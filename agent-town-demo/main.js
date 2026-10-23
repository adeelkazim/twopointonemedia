import {places,districts,findPlaces,WIDTH,HEIGHT} from './world.js';
import {paintTown} from './art.js';
import {advanceAvatar} from './navigation.js';
import {TownStore} from './data.js';
import {mode,initialSnapshot} from './mode.js';
const $=id=>document.getElementById(id),demo=mode==='fictional-demo';
let selected=null,zoom=innerWidth<700?1:.8;
const map=$('map'),world=$('world');
const disclosure=demo?'Fictional demo: all data is synthetic, not live. No private information or live connection.':'Locked preview: no owner session or live data is connected. All telemetry is unavailable.';
$('mode-label').textContent=demo?'FICTIONAL DEMO · NOT LIVE':'LOCKED PREVIEW · NO DATA';
$('welcome-disclosure').textContent=disclosure;
const store=new TownStore(()=>renderState());const initial=initialSnapshot();if(initial)store.accept(initial,Math.floor(Date.now()/1000));
paintTown($('town-art').getContext('2d'));
for(const p of places){
 const button=document.createElement('button');button.className='building';button.id='place-'+p.building;button.style.left=(p.x-90)+'px';button.style.top=(p.y-126)+'px';
 button.setAttribute('aria-label',`${p.building}. ${p.displayName}`);button.title=p.displayName;
 const label=document.createElement('span');label.className='building-label';const number=document.createElement('b');number.textContent=String(p.building).padStart(2,'0');const name=document.createElement('span');name.textContent=p.displayName;label.append(number,name);button.append(label);button.addEventListener('click',()=>openPlace(p));$('buildings').append(button);
}
const districtPositions={access:[160,36],mind:[760,32],workshop:[230,490],agents:[910,933],control:[1500,931],cloud:[1525,32],centre:[828,479]};
for(const [key,label]of Object.entries(districts)){
 const option=document.createElement('option');option.value=key;option.textContent=label;$('district-filter').append(option);
 const tag=document.createElement('span');tag.textContent=label;tag.style.left=districtPositions[key][0]+'px';tag.style.top=districtPositions[key][1]+'px';$('district-labels').append(tag);
}
function renderDirectory(){const result=findPlaces($('directory-search').value,$('district-filter').value);$('directory-count').textContent=`${result.length} of 33 buildings`;$('directory-results').replaceChildren();for(const p of result){const button=document.createElement('button');button.className='directory-entry';const n=document.createElement('span');n.className='entry-number';n.textContent=String(p.building).padStart(2,'0');const name=document.createElement('span');name.textContent=p.displayName;const type=document.createElement('small');type.textContent=p.description;name.append(type);button.append(n,name);button.addEventListener('click',()=>openPlace(p));$('directory-results').append(button);}if(!result.length){const empty=document.createElement('p');empty.textContent='No buildings found. Try another name or district.';$('directory-results').append(empty);}}
function openPlace(p){stopWalking();selected=p;$('inspector-title').textContent=p.displayName;$('inspector-number').textContent=`BUILDING ${String(p.building).padStart(2,'0')} / 33`;$('inspector-district').textContent=districts[p.quarter];$('inspector-type').textContent=p.name;$('inspector-purpose').textContent=p.description;renderState();$('inspector').showModal();}
function renderCatalog(){
 const kind=selected?.building===7?'memory':selected?.building===10?'skills':null;
 $('catalog').hidden=!kind;$('catalog-results').replaceChildren();
 if(!kind){$('catalog-search').value='';$('catalog-count').textContent='';return;}
 const available=Boolean(store.snapshot);$('catalog-search').disabled=!available;
 if(!available)$('catalog-search').value='';
 const query=$('catalog-search').value.toLowerCase(),items=(store.snapshot?.catalogs[kind]||[]).filter(e=>`${e.name} ${e.description}`.toLowerCase().includes(query));
 $('catalog-count').textContent=available?`${items.length} reviewed fictional entries`:'No catalog data retained';
 for(const e of items){const row=document.createElement('article');row.className='catalog-entry';const title=document.createElement('h3');title.textContent=e.name;const text=document.createElement('p');text.textContent=e.description;row.append(title,text);$('catalog-results').append(row);}
 if(!items.length)$('catalog-results').textContent=available?'No reviewed entries match.':'No reviewed catalog available. Data is cleared or locked.';
}
function renderState(){
 $('data-state').textContent=store.snapshot?'Synthetic example loaded · not live':`Data cleared / ${store.state} · no telemetry`;
 if(!selected)return;
 const c=store.snapshot?.components.find(c=>c.building===selected.building);
 $('inspector-status').textContent=selected.building===24?'LOCKED':c?'SYNTHETIC EXAMPLE · '+c.status.toUpperCase():'UNKNOWN · NO DATA';
 $('inspector-summary').textContent=c?.summary||'No reliable telemetry available.';
 $('inspector-boundary').textContent=selected.building===24?'Locked marker only. No credentials, values, account details or sign-in are exposed.':disclosure;
 renderCatalog();
}
let avatar={x:1040,y:810,direction:'front'};
let walking=false,walkDistance=0,target=null,lastTime=null;const keys=new Set();
const vectors={w:[0,-1],ArrowUp:[0,-1],s:[0,1],ArrowDown:[0,1],a:[-1,0],ArrowLeft:[-1,0],d:[1,0],ArrowRight:[1,0]};
function renderAvatar(){const el=$('avatar'),frame=walking&&!$('reduced-motion').checked?1+Math.floor(walkDistance/15)%4:0;el.style.left=avatar.x*zoom+'px';el.style.top=avatar.y*zoom+'px';el.dataset.direction=avatar.direction;el.dataset.frame=frame;el.dataset.state=walking?'walking':'idle';const src=`./assets/walk-${avatar.direction}-${frame}.png`;if(el.querySelector('img').getAttribute('src')!==src)el.querySelector('img').src=src;}
function stopWalking(){keys.clear();target=null;walking=false;walkDistance=0;renderAvatar();}
function blockedInput(){return Boolean(document.querySelector('dialog[open]'))||$('directory').classList.contains('open')||$('options').open||document.activeElement?.matches('input,select,textarea,[contenteditable=true]');}
function animate(time){
 const dt=lastTime===null?0:Math.min((time-lastTime)/1000,.05);lastTime=time;
 if(blockedInput()){if(walking||keys.size||target)stopWalking();}
 else{
  let x=0,y=0;for(const key of keys){x+=vectors[key][0];y+=vectors[key][1];}
  let seconds=dt;if(target&&!keys.size){x=target.x-avatar.x;y=target.y-avatar.y;const distance=Math.hypot(x,y);seconds=Math.min(dt,distance/180);if(distance<1){target=null;x=y=0;}}
  const next=advanceAvatar(avatar,{x,y},seconds),distance=Math.hypot(next.x-avatar.x,next.y-avatar.y);walking=distance>.001;
  if(walking){avatar=next;walkDistance+=distance;focusMap(avatar.x,avatar.y);}else{walkDistance=0;if(x||y){avatar.direction=next.direction;target=null;}}
  renderAvatar();
 }
 requestAnimationFrame(animate);
}
window.addEventListener('blur',stopWalking);document.addEventListener('visibilitychange',()=>{stopWalking();lastTime=null;});
document.addEventListener('focusin',event=>{if(event.target!==map&&!event.target.closest('#walk-controls'))stopWalking();});
document.addEventListener('keydown',event=>{const key=event.key.startsWith('Arrow')?event.key:event.key.toLowerCase();if(!vectors[key]||blockedInput()||event.target!==map)return;event.preventDefault();target=null;keys.add(key);});
document.addEventListener('keyup',event=>{keys.delete(event.key.startsWith('Arrow')?event.key:event.key.toLowerCase());if(!keys.size&&!target){walking=false;walkDistance=0;renderAvatar();}});
for(const button of document.querySelectorAll('#walk-controls button')){
 button.addEventListener('pointerdown',event=>{event.preventDefault();if(blockedInput())return;stopWalking();map.focus({preventScroll:true});button.setPointerCapture(event.pointerId);keys.add(button.dataset.key);});
 for(const type of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(type,stopWalking);
 button.addEventListener('click',event=>event.preventDefault());
}
function setZoom(value){zoom=Math.max(.35,Math.min(1.4,value));world.style.setProperty('--zoom',zoom);world.style.width=WIDTH*zoom+'px';world.style.height=HEIGHT*zoom+'px';$('zoom-value').value=Math.round(zoom*100)+'%';renderAvatar();}
function focusMap(x=avatar.x,y=avatar.y){map.scrollLeft=x*zoom-map.clientWidth/2;map.scrollTop=y*zoom-map.clientHeight/2;}
function toggleDirectory(open){stopWalking();$('directory').classList.toggle('open',open);$('directory-toggle').setAttribute('aria-expanded',String(open));}
$('directory-toggle').onclick=()=>{const open=!$('directory').classList.contains('open');toggleDirectory(open);if(open)$('directory-search').focus();};
$('directory-close').onclick=()=>{toggleDirectory(false);$('directory-toggle').focus();};
document.querySelector('.skip').onclick=event=>{event.preventDefault();toggleDirectory(true);$('directory-search').focus();};
document.addEventListener('keydown',event=>{
 if(event.key!=='Escape'||document.querySelector('dialog[open]'))return;
 if($('directory').classList.contains('open')){toggleDirectory(false);$('directory-toggle').focus();}
 else if($('options').open){$('options').open=false;$('options').querySelector('summary').focus();}
});
$('inspector').addEventListener('close',()=>{if(innerWidth<=700)toggleDirectory(false);});
window.addEventListener('resize',()=>{if(innerWidth>700)toggleDirectory(false);});
$('directory-search').addEventListener('input',renderDirectory);$('district-filter').addEventListener('change',renderDirectory);
$('welcome-start').onclick=$('welcome-close').onclick=()=>$('welcome').close();
$('about').onclick=$('bulletin').onclick=()=>{stopWalking();$('welcome').showModal();};
$('inspector-close').onclick=$('inspector-done').onclick=()=>$('inspector').close();
$('catalog-search').addEventListener('input',renderCatalog);
$('jump').onclick=()=>{if(!selected)return;$('inspector').close();document.querySelectorAll('.building.selected').forEach(e=>e.classList.remove('selected'));$('place-'+selected.building).classList.add('selected');focusMap(selected.x,selected.y);map.focus({preventScroll:true});};
$('home').onclick=()=>{stopWalking();avatar={x:1040,y:810,direction:'front'};setZoom(innerWidth<700?1:.8);focusMap();document.querySelectorAll('.building.selected').forEach(e=>e.classList.remove('selected'));$('directory-search').value='';$('district-filter').value='';renderDirectory();map.focus({preventScroll:true});};
$('overview').onclick=()=>{setZoom(map.clientWidth/WIDTH);map.scrollTo(0,0);};
$('zoom-in').onclick=()=>{const x=(map.scrollLeft+map.clientWidth/2)/zoom,y=(map.scrollTop+map.clientHeight/2)/zoom;setZoom(Math.round((zoom+.2)*100)/100);focusMap(x,y);};
$('zoom-out').onclick=()=>{const x=(map.scrollLeft+map.clientWidth/2)/zoom,y=(map.scrollTop+map.clientHeight/2)/zoom;setZoom(Math.round((zoom-.2)*100)/100);focusMap(x,y);};
$('reduced-motion').checked=matchMedia('(prefers-reduced-motion: reduce)').matches;
$('reduced-motion').onchange=()=>document.body.classList.toggle('reduce-motion',$('reduced-motion').checked);
$('reduced-motion').onchange();
map.addEventListener('click',event=>{
 if(event.target.closest('button')||document.querySelector('dialog[open]'))return;
 const bounds=map.getBoundingClientRect(),x=(event.clientX-bounds.left+map.scrollLeft)/zoom,y=(event.clientY-bounds.top+map.scrollTop)/zoom;
 stopWalking();target={x,y};map.focus({preventScroll:true});
});
$('clear-data').onclick=()=>store.clear('locked');
setInterval(()=>store.tick(),1000);
document.addEventListener('visibilitychange',()=>store.tick());
window.addEventListener('pageshow',()=>store.tick());
renderDirectory();renderState();setZoom(zoom);requestAnimationFrame(()=>{focusMap();$('welcome').showModal();requestAnimationFrame(animate);});
