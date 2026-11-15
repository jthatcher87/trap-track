/** Trap Track 2.0. Deploy this SEPARATE project as USER_ACCESSING, never as owner. */
function assertUserExecution_(){
  // A shared execute-as-owner deployment must fail closed, before creating or reading a Sheet.
  const active=Session.getActiveUser().getEmail(),effective=Session.getEffectiveUser().getEmail();
  if(!active || !effective || active!==effective)throw new Error('This service must run as the signed-in user. Contact the app owner.');
}
function doGet(){
  assertUserExecution_();
  const t=HtmlService.createTemplateFromFile('Hosted');
  t.appUrl='https://jthatcher87.github.io/trap-track/';
  return t.evaluate().setTitle('Trap Track 2.0 · My Google journal').addMetaTag('viewport','width=device-width, initial-scale=1');
}
function hostedStatus_(){
 const id=PropertiesService.getUserProperties().getProperty('SHEET_ID');
 return {version:'2.0.0',configured:!!id,sheetUrl:id?'https://docs.google.com/spreadsheets/d/'+id+'/edit':null};
}
function setupJournal_(){
 const lock=LockService.getUserLock();lock.waitLock(10000);
 try{
  const p=PropertiesService.getUserProperties();
  if(!p.getProperty('SHEET_ID')){
   const ss=SpreadsheetApp.create('Trap Track · Private encrypted journal');
   const sheet=ss.getSheets()[0];sheet.setName('Vault');
   sheet.getRange('A1:D1').setValues([['Revision','Updated UTC','Encrypted chunk','Format']]);
   sheet.getRange('A1:D1').setBackground('#020617').setFontColor('#ffffff').setFontWeight('bold');
   sheet.setFrozenRows(1);sheet.setColumnWidth(3,600);
   p.setProperty('SHEET_ID',ss.getId());
  }
  return hostedStatus_();
 }finally{lock.releaseLock();}
}
function hostedApi(request) {
  assertUserExecution_();
  if (!request || !['status','setup','read','write'].includes(request.action)) throw new Error('Unknown journal action.');
  if(request.action==='status')return hostedStatus_();
  if(request.action==='setup')return setupJournal_();
  const p=PropertiesService.getUserProperties();
  if(!p.getProperty('SHEET_ID'))throw new Error('Create your private Sheet from Settings first.');
  const lock=LockService.getUserLock();lock.waitLock(10000);
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
