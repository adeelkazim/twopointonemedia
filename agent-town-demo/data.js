import identities from './identities.js';
export class TownStore {
 constructor(onChange=()=>{}){this.onChange=onChange;this.snapshot=null;this.state='locked';}
 clear(state='locked'){this.snapshot=null;this.state=state;this.onChange(this);}
 accept(value,now){try{this.snapshot=validateSnapshot(value,now);this.state=value.mode==='synthetic'?'synthetic':'connected';this.onChange(this);}catch(e){this.clear('unavailable');throw e;}}
 tick(now=Math.floor(Date.now()/1000)){if(this.snapshot){try{validateSnapshot(this.snapshot,now);}catch{this.clear('unavailable');}}}
}
export function torontoTime(date=new Date()){
 const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Toronto',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(date);
 const hour=Number(parts.find(p=>p.type==='hour').value),minute=parts.find(p=>p.type==='minute').value;
 return {hour,label:`${String(hour).padStart(2,'0')}:${minute} Toronto`,night:hour<7||hour>=19};
}
export const STATES=['ok','busy','warning','error','offline','unknown'];
export function parseSanitizedJson(text){
 need(typeof text==='string'&&new TextEncoder().encode(text).length<=65536);
 const value=JSON.parse(text);let i=0;
 const space=()=>{while(/\s/.test(text[i]||'')&&i<text.length)i++;};
 const string=()=>{const start=i++;while(i<text.length){if(text[i]==='\\'){i+=2;continue;}if(text[i++]==='"')return JSON.parse(text.slice(start,i));}throw new Error('Invalid JSON');};
 function scan(depth){
  need(depth<=12);space();const c=text[i];
  if(c==='"'){string();return;}
  if(c==='{'||c==='['){i++;space();const close=c==='{'?'}':']',keys=new Set();if(text[i]===close){i++;return;}
   while(i<text.length){if(c==='{'){space();need(text[i]==='"');const key=string();need(!keys.has(key));keys.add(key);space();need(text[i++]===':');}scan(depth+1);space();if(text[i]===close){i++;return;}need(text[i++]===',');}throw new Error('Invalid JSON');
  }
  const start=i;while(i<text.length&&!/[\s,}\]]/.test(text[i]))i++;need(i>start);const primitive=JSON.parse(text.slice(start,i));need(typeof primitive!=='number'||Number.isFinite(primitive));
 }
 scan(0);space();need(i===text.length);return value;
}
const need=v=>{if(!v)throw new Error('Invalid sanitized data');};
const exact=(o,fields)=>need(o&&typeof o==='object'&&!Array.isArray(o)&&Object.keys(o).sort().join('|')===[...fields].sort().join('|'));
const stamp=(t,now,ttl)=>need(Number.isInteger(t)&&t>=0&&t<=now&&now-t<=ttl);
export function safeText(s,n){need(typeof s==='string'&&s.length>0&&s.length<=n&&/^[A-Za-z0-9 .,:;()'-]+$/.test(s)&&!/(bearer|password|passwd|api.?key|secret|token|sk-|gh[pousr]_|github_pat_|eyJ|https?:|[0-9]{6,}|[A-Za-z0-9_-]{24,})/i.test(s));return s;}
export function validateCatalog(items){
 need(Array.isArray(items)&&items.length<=128);const ids=new Set();
 for(const e of items){exact(e,['id','name','description']);need(typeof e.id==='string'&&/^[a-z][a-z0-9-]{0,63}$/.test(e.id)&&!ids.has(e.id));ids.add(e.id);safeText(e.id,64);safeText(e.name,80);safeText(e.description,240);}return items;
}
export function validateSnapshot(s,now=Math.floor(Date.now()/1000)){
 exact(s,['schemaVersion','mode','observedAt','components','catalogs']);need(s.schemaVersion===1&&['live','synthetic'].includes(s.mode));stamp(s.observedAt,now,60);
 need(Array.isArray(s.components)&&s.components.length===33);
 s.components.forEach((c,i)=>{
  const expected=identities[i];exact(c,[...Object.keys(expected),'status','lastActivity','observedAt','evidence','summary','details']);for(const k in expected)need(c[k]===expected[k]);
  need(STATES.includes(c.status)&&['unavailable','inventory','synthetic','heartbeat','verified-check'].includes(c.evidence));stamp(c.observedAt,s.observedAt,120);stamp(c.observedAt,now,120);
  if(['unavailable','inventory'].includes(c.evidence))need(c.status==='unknown'&&c.lastActivity===null);
  else {need(s.mode==='synthetic'||c.evidence!=='synthetic');if(c.lastActivity!==null)stamp(c.lastActivity,c.observedAt,120);}
  const summary=c.evidence==='unavailable'?'No reliable telemetry available.':c.evidence==='inventory'?'Inventory only; current health is unknown.':`${c.evidence}: ${c.status}; point-in-time evidence only.`;
  need(c.summary===summary);
  if(c.building===24){exact(c.details,['locked']);need(c.details.locked===true&&c.status==='unknown'&&c.evidence==='unavailable'&&c.lastActivity===null);}
  else {exact(c.details,['telemetry']);need(c.details.telemetry==='unavailable');}
 });
 exact(s.catalogs,['memory','skills']);validateCatalog(s.catalogs.memory);validateCatalog(s.catalogs.skills);return structuredClone(s);
}
