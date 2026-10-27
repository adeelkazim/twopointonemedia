// Public source data never implies operational workflow state.
export const FEED_URL='https://hillz-files.s3.ca-central-1.amazonaws.com/sent-ftps/google-merchant/public/vantagemotors.xml';
const ATOM='http://www.w3.org/2005/Atom',GOOGLE='http://base.google.com/ns/1.0';
export function safeUrl(value,kind){
 try{
  if(/[\u0000-\u0020\u007f]/.test(value))return '';
  const url=new URL(value);
  const hosts=kind==='image'?['hillzimage.blob.core.windows.net']:['www.vantagemotors.co','vantagemotors.co'];
  return url.protocol==='https:'&&!url.username&&!url.password&&!url.port&&hosts.includes(url.hostname)?url.href:'';
 }catch{return '';}
}
// Memory-only snapshots: live source never reads or writes demo localStorage.
export function createInventorySource({fetcher=globalThis.fetch.bind(globalThis),now=Date.now,onChange=()=>{}}={}){
 const snapshot={status:'idle',data:null,lastSuccess:null,lastModified:null,error:'',loading:false};
 async function refresh(){
  if(snapshot.loading)return false;
  snapshot.loading=true;snapshot.status='loading';snapshot.error='';onChange(snapshot);
  const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),20000);
  try{
   const response=await fetcher(FEED_URL,{mode:'cors',credentials:'omit',cache:'no-store',redirect:'error',signal:controller.signal});
   if(!response.ok)throw Error(`Feed returned HTTP ${response.status}.`);
   const data=parseFeed(await response.text());
   const modified=response.headers.get('Last-Modified');
   snapshot.data=data;snapshot.lastSuccess=now();snapshot.lastModified=modified&&!Number.isNaN(Date.parse(modified))?modified:null;snapshot.status='success';
   return true;
  }catch(error){
   snapshot.error=error.name==='AbortError'?'Feed request timed out after 20 seconds.':error.message||'Unable to fetch inventory.';
   snapshot.status=snapshot.data?'stale':'error';return false;
  }finally{clearTimeout(timeout);snapshot.loading=false;onChange(snapshot);}
 }
 return {snapshot,refresh};
}
export function parseFeed(xml){
 if(typeof xml!=='string'||!xml.trim()||xml.length>5_000_000||/<!DOCTYPE|<!ENTITY/i.test(xml))throw Error('Empty, oversized or unsupported XML document.');
 const doc=new DOMParser().parseFromString(xml,'application/xml'),root=doc.documentElement;
 if(doc.getElementsByTagName('parsererror').length||root?.localName!=='feed'||root.namespaceURI!==ATOM)throw Error('Invalid XML: expected an Atom inventory feed.');
 const entries=[...root.children].filter(e=>e.namespaceURI===ATOM&&e.localName==='entry');
 if(entries.length>5000)throw Error('Feed exceeds the 5,000-record safety limit.');
 const vehicles=[],issues=[],seen=new Set();
 let duplicates=0,invalid=0;
 entries.forEach((entry,index)=>{
  const field=name=>[...entry.children].find(e=>e.namespaceURI===GOOGLE&&e.localName===name)?.textContent.trim()||'';
  const vin=field('vin'),sourceId=field('id'),id=sourceId||(/^[A-HJ-NPR-Z0-9]{17}$/i.test(vin)?`vin:${vin.toUpperCase()}`:''),name=field('title');
  if(!id||!name){invalid++;issues.push(`Entry ${index+1}: excluded; missing stable ID / valid VIN or title.`);return;}
  if(seen.has(id)){duplicates++;issues.push(`Entry ${index+1}: duplicate ID ${id}; first valid entry retained.`);return;}
  seen.add(id);
  const amount=field('price').match(/^(\d+(?:\.\d+)?)\s+([A-Z]{3})$/),price=amount?Number(amount[1]):null;
  const mileage=field('mileage').match(/^(\d+(?:,\d{3})*(?:\.\d+)?)\s*km$/i);
  vehicles.push({id,sourceId,name,stock:field('stock_number'),vin,year:field('year'),make:field('brand'),model:field('model'),trim:field('trim'),color:field('color'),km:mileage?Number(mileage[1].replaceAll(',','')):null,mileage:field('mileage'),price:Number.isFinite(price)&&price>0?price:null,currency:field('price').match(/(?:^|\s)([A-Z]{3})$/)?.[1]||'',availability:field('availability'),image:safeUrl(field('image_link'),'image'),link:safeUrl(field('link'),'link'),description:field('description'),bodyStyle:field('body_style'),drivetrain:field('drivetrain'),fuel:field('fuel_type'),transmission:field('transmission'),condition:field('condition'),dealer:field('dealer_name'),stage:'Not tracked',purchased:null,eta:null,safetyReady:null,history:[]});
 });
 if(entries.length&&vehicles.length===0)throw Error(`No usable vehicles: ${invalid} invalid entries, ${duplicates} duplicates. Previous inventory retained.`);
 return {vehicles,counts:{total:entries.length,accepted:vehicles.length,duplicates,invalid},issues};
}
