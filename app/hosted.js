export function googleOrigin(origin){return /^https:\/\/([a-z0-9-]+-script\.googleusercontent\.com|script\.googleusercontent\.com|script\.google\.com)$/.test(origin)}
export function createHostedConnection(win, onReady){
 const params=new URLSearchParams(win.location.search),nonce=params.get('nonce');
 const enabled=params.get('hosted')==='1'&&/^[a-f0-9-]{36}$/.test(nonce||'')&&win.parent!==win;
 let peer=null,ready=false;const pending=new Map();
 const hello=()=>{if(enabled&&!ready)for(const origin of ['https://script.google.com','https://script.googleusercontent.com'])win.parent.postMessage({kind:'trap-hosted-hello',nonce},origin)};
 // Parent sends its origin through a validated ready message after the frame load.
 function listener(e){
  const d=e.data;
  if(!enabled||e.source!==win.parent||!googleOrigin(e.origin)||d?.nonce!==nonce)return;
  if(d.kind==='trap-hosted-ready'){
   if(ready)return;peer={source:e.source,origin:e.origin};ready=true;win.parent.postMessage({kind:'trap-hosted-hello',nonce},peer.origin);onReady();return;
  }
  if(!peer||e.origin!==peer.origin||d.kind!=='trap-hosted-result')return;
  const p=pending.get(d.id);if(!p)return;pending.delete(d.id);clearTimeout(p.timer);d.error?p.reject(Error(d.error)):p.resolve(d.result);
 }
 win.addEventListener('message',listener);
 return {enabled,get ready(){return ready},hello,request(action,payload){
  if(!ready||!peer)return Promise.reject(Error('Open the Google workspace and wait for its connection.'));
  return new Promise((resolve,reject)=>{const id=win.crypto.randomUUID(),timer=setTimeout(()=>{pending.delete(id);reject(Error('Google connection timed out. Your local journal is safe. Try again.'))},30000);pending.set(id,{resolve,reject,timer});peer.source.postMessage({kind:'trap-hosted-request',id,nonce,action,payload},peer.origin)});
 }};
}
