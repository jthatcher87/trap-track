const enc=new TextEncoder(),dec=new TextDecoder();
const b64=b=>btoa(String.fromCharCode(...new Uint8Array(b)));
const bytes=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
async function key(pass,salt){const raw=await crypto.subtle.importKey('raw',enc.encode(pass),'PBKDF2',false,['deriveKey']);return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:310000,hash:'SHA-256'},raw,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);}
export async function seal(value,pass){const salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12));const data=await crypto.subtle.encrypt({name:'AES-GCM',iv},await key(pass,salt),enc.encode(JSON.stringify(value)));return {v:1,salt:b64(salt),iv:b64(iv),data:b64(data)};}
export async function open(value,pass){if(value.v!==1)throw Error('Unsupported backup format');const data=await crypto.subtle.decrypt({name:'AES-GCM',iv:bytes(value.iv)},await key(pass,bytes(value.salt)),bytes(value.data));return JSON.parse(dec.decode(data));}
