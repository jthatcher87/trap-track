/** Trap Track: one deployment and private spreadsheet per individual. */
function setup() {
  const p = PropertiesService.getScriptProperties();
  if (!p.getProperty('SHEET_ID')) {
    const ss = SpreadsheetApp.create('Trap Track · Private encrypted journal');
    const sheet = ss.getSheets()[0]; sheet.setName('Vault');
    sheet.getRange('A1:D1').setValues([['Revision','Updated UTC','Encrypted chunk','Format']]);
    sheet.getRange('A1:D1').setBackground('#183439').setFontColor('#ffffff').setFontWeight('bold');
    sheet.setFrozenRows(1); sheet.setColumnWidth(1,120);sheet.setColumnWidth(2,210);sheet.setColumnWidth(3,600);
    p.setProperty('SHEET_ID', ss.getId());
  }
  if (!p.getProperty('ACCESS_TOKEN')) p.setProperty('ACCESS_TOKEN', Utilities.getUuid()+Utilities.getUuid());
  // Set ALLOWED_ORIGIN in Project Settings > Script Properties, for example:
  // https://jthatcher87.github.io (origin only, no repository path).
  // Token is visible only in Script Properties; do not put it in code or logs.
}
function doGet(e) {
  const p=PropertiesService.getScriptProperties();
  const origin=p.getProperty('ALLOWED_ORIGIN')||'';
  if (!/^https:\/\/[a-zA-Z0-9.-]+(?::[0-9]+)?$/.test(origin)) return HtmlService.createHtmlOutput('Set a valid HTTPS ALLOWED_ORIGIN in Script Properties.');
  const t=HtmlService.createTemplateFromFile('Bridge');
  t.origin=origin;t.nonce=String(e.parameter.nonce||'').replace(/[^a-zA-Z0-9-]/g,'');
  return t.evaluate().setTitle('Trap Track private connection').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
function journalApi(request) {
  const p=PropertiesService.getScriptProperties(), expected=p.getProperty('ACCESS_TOKEN');
  if (!expected || !request || typeof request.token!=='string' || !equal_(expected,request.token)) throw new Error('Connection not authorized. Check your private access token.');
  const lock=LockService.getScriptLock();lock.waitLock(10000);
  try {
    const ss=SpreadsheetApp.openById(p.getProperty('SHEET_ID')),sheet=ss.getSheetByName('Vault');
    const rows=sheet.getLastRow(), revision=rows>1?String(sheet.getRange(2,1).getValue()):'0';
    if(request.action==='read') {
      const text=rows>1?sheet.getRange(2,3,rows-1,1).getValues().map(r=>{if(typeof r[0]!=='string'||r[0].slice(0,3)!=='v1:')throw new Error('Invalid journal chunk.');return r[0].slice(3);}).join(''):'';
      return {revision:revision,envelope:text?JSON.parse(text):null};
    }
    if(request.action!=='write')throw new Error('Unknown journal action.');
    const payload=request.payload||{};
    if(String(payload.revision)!==revision)return {ok:false,conflict:true};
    const v=payload.envelope;
    if(!v || v.v!==1 || !/^[A-Za-z0-9+/=]+$/.test(v.data||'') || !/^[A-Za-z0-9+/=]{24}$/.test(v.salt||'') || !/^[A-Za-z0-9+/=]{16}$/.test(v.iv||''))throw new Error('Invalid encrypted journal.');
    const text=JSON.stringify(v);if(text.length>1500000)throw new Error('Journal exceeds 1.5 MB. Export a backup and archive older entries.');
    const next=Utilities.getUuid(),now=new Date().toISOString(),out=[];
    for(let i=0;i<text.length;i+=40000)out.push([next,now,'v1:'+text.slice(i,i+40000),'AES-GCM / PBKDF2-SHA256 v1']);
    // Prefix every chunk so no chunk can be interpreted as a spreadsheet formula.
    if(sheet.getMaxRows()<out.length+1)sheet.insertRowsAfter(sheet.getMaxRows(),out.length+1-sheet.getMaxRows());
    sheet.getRange(2,1,out.length,4).setNumberFormat('@').setValues(out);
    if(rows>out.length+1)sheet.getRange(out.length+2,1,rows-out.length-1,4).clearContent();
    SpreadsheetApp.flush();return {ok:true,revision:next};
  } finally {lock.releaseLock();}
}
function equal_(a,b) {
 const x=Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,a),y=Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,b);
 let diff=0;for(let i=0;i<x.length;i++)diff|=x[i]^y[i];return diff===0;
}
