export const STAGES=['Purchased','In-Transit','Arrived','Inspection','Parts','Safety','Ready for lot','Sold'];
export const DAY=86400000;
export function createState(now=Date.now()) {
 const names=['2023 BMW 330i','2022 Audi Q5','2024 Honda Civic','2021 Mercedes-Benz C300','2023 Toyota RAV4','2022 Mazda CX-5','2024 Lexus NX 350','2021 Volkswagen Golf','2023 Hyundai Tucson','2022 Volvo XC60','2024 Kia Sportage','2023 Acura RDX','2022 BMW X3','2023 Audi A4','2024 Toyota Camry','2021 Honda CR-V'];
 const s={version:1,next:1041,vehicles:[],notifications:[]};
 names.forEach((name,i)=>{const stage=STAGES[i%8], age=5+i*2, purchased=now-age*DAY,at=i%8===0?purchased:now-(i%5+1)*DAY;
 s.vehicles.push({stock:`VT-${1025+i}`,name,vin:`DEM${String(i+1).padStart(14,'0')}`,km:18400+i*3170,color:['Alpine white','Graphite grey','Midnight black','Deep blue'][i%4],location:i%2?'Demo South lot':'Demo North lot',stage,purchased,eta:i%8===1?new Date(now+3*DAY).toISOString().slice(0,10):'',notes:i%3?'':'Arrival walkaround complete. Check front bumper finish.',body:'',mechanical:'',safety:'',safetyReady:stage==='Ready for lot'||stage==='Sold',parts:[],history:STAGES.slice(0,i%8+1).map((st,j)=>({stage:st,at:j===i%8?at:purchased+j*(at-purchased)/Math.max(1,i%8)})),sale:stage==='Sold'?{type:i%2?'Retail':'Wholesale',seller:'Alex Demo',location:'Demo South lot',at}:null});});
 s.notifications=[{id:'seed',at:now-3600000,text:'VT-1031 moved to Ready for lot. Demo team notified.'}]; return s;
}
export function inventoryDays(v,now=Date.now()){return Math.max(0,Math.floor(((v.sale?.at??now)-v.purchased)/DAY));}
export function stageDays(v,now=Date.now()){return Math.max(0,Math.floor(((v.sale?.at??now)-v.history.at(-1).at)/DAY));}
export function moveVehicle(s,stock,stage,sale=null,now=Date.now()){
 const v=s.vehicles.find(v=>v.stock===stock);
 if(!v||!STAGES.includes(stage))throw Error('Unknown vehicle or stage.');
 if(v.stage==='Sold')throw Error('Sold vehicles are archived in this demo.');
 if(stage===v.stage)return v;
 if(stage==='Sold'){
  if(!sale||!['Retail','Wholesale'].includes(sale.type)||!sale.seller?.trim()||!sale.location?.trim())throw Error('Sale requires type, seller and location.');
  v.sale={type:sale.type,seller:sale.seller.trim(),location:sale.location.trim(),at:now};
 }
 v.stage=stage;v.history.push({stage,at:now});
 notify(s,`${stock} moved to ${stage}${v.sale?` · ${v.sale.type} by ${v.sale.seller} at ${v.sale.location}`:''}. Demo team notified.`,now);return v;
}
export function notify(s,text,now){s.notifications.unshift({id:`${now}-${s.notifications.length}`,at:now,text});s.notifications=s.notifications.slice(0,100);}
export function addVehicle(s,fields,now=Date.now()){
 const name=String(fields.name||'').trim(),vin=String(fields.vin||'').trim().toUpperCase();
 if(!name||!vin)throw Error('Vehicle and VIN are required.');
 if(!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin))throw Error('VIN must contain 17 characters (no I, O or Q).');
 if(s.vehicles.some(v=>v.vin===vin))throw Error('This VIN is already in inventory.');
 const v={stock:`VT-${s.next++}`,name,vin,location:fields.location||'Demo North lot',km:Number(fields.km)||0,color:fields.color||'Not specified',stage:'Purchased',purchased:now,eta:'',notes:'',body:'',mechanical:'',safety:'',safetyReady:false,parts:[],history:[{stage:'Purchased',at:now}],sale:null};
 s.vehicles.unshift(v);notify(s,`${v.stock} Purchased. Demo team notified.`,now);return v;
}
