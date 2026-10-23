import {places} from './world.js';
import {paintArchitecture} from './architecture.js';
// Original raster illustration: every mark aligned to the low-resolution pixel grid.
export function paintTown(ctx){
 let seed=724;const rnd=n=>{seed=(seed*1664525+1013904223)>>>0;return seed%n;};
 const r=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
 const colors={access:['#557d6b','#86ad86','#63d6ba'],mind:['#5b617d','#9297ac','#ad9fe9'],workshop:['#96674f','#c09365','#f3b96e'],agents:['#3e777c','#71a5a0','#69e0d0'],control:['#7c735f','#ac9c70','#ffc772'],cloud:['#626c91','#99a0be','#a4c7fb'],centre:['#497874','#7ba69a','#75f4de']};
 r(0,0,940,700,'#344c4c');
 for(let i=0;i<20000;i++){let x=rnd(940),y=rnd(700);r(x,y,1+rnd(4),1+rnd(3),['#3c5650','#415f52','#4b6856','#57725c','#2e4949'][rnd(5)]);}
 // Open stone avenues and a broad octagonal square.
 const path=(x,y,w,h)=>{r(x-4,y-4,w+8,h+8,'#263e41');r(x-2,y-2,w+4,h+4,'#728176');r(x,y,w,h,'#909184');for(let i=0;i<w*h/65;i++){const px=x+rnd(w),py=y+rnd(h);r(px,py,3+rnd(6),1+rnd(3),['#aaa592','#7d8279','#bbb09a','#989c8d'][rnd(4)]);}};
 path(55,228,830,36);path(318,57,30,608);path(690,45,29,612);path(65,584,820,34);path(420,70,34,582);path(44,449,841,35);
 // One continuous stepped octagon; texture once, not bordered strips.
 for(let y=270;y<463;y++){
  const inset=y<318?Math.floor((318-y)*.85):y>414?Math.floor((y-414)*.85):0;
  r(314+inset,y,355-inset*2,1,'#748477');
  r(317+inset,y,349-inset*2,1,'#a59d86');
 }
 for(let i=0;i<1500;i++){const x=320+rnd(344),y=273+rnd(186),inset=y<318?Math.floor((318-y)*.85):y>414?Math.floor((y-414)*.85):0;if(x>318+inset&&x<661-inset)r(x,y,3+rnd(5),1+rnd(2),['#bdb097','#9a9986','#c6b79b','#8d9585'][rnd(4)]);}
 // Decorative radial plaza paving, with a little brass observatory fountain.
 for(let y=290;y<456;y+=10)for(let x=333;x<642;x+=13)if(((x-485)**2/24000+(y-373)**2/6500)<1)r(x,y,10,1,'#c1b394');
 const pipe=(x,y,w)=>{r(x,y,w,5,'#283e42');r(x,y,w,2,'#b39161');for(let t=x+5;t<x+w;t+=18)r(t,y-1,2,6,'#dfbb7f');};
 pipe(28,280,260);pipe(742,445,171);pipe(370,637,260);
 // Luminous utility conduits follow the edges, never bisect the open plaza.
 for(const [x,y,w,c]of [[55,230,258,'#8ee9da'],[350,230,340,'#c7a4f3'],[65,570,248,'#8ee9da']]){
  r(x-2,y-3,w+4,7,'#263e45');r(x,y-2,w,1,'#a78965');r(x,y,w,2,c);r(x,y+3,w,1,'#bb9868');
  for(let xx=x+15;xx<x+w;xx+=24){r(xx,y-3,2,2,'#e1be83');r(xx,y+2,2,3,'#ddbd87');}
  for(const xx of [x,x+w-6]){r(xx-3,y-5,11,11,'#354e52');r(xx-1,y-3,7,7,'#b79a70');r(xx,y-2,5,5,c);}
 }
 r(701,48,7,608,'#263e45');r(701,48,1,608,'#c09c6d');r(704,48,2,608,'#8ee9da');r(707,48,1,608,'#a58b66');
 for(let yy=62;yy<650;yy+=28){r(700,yy,3,2,'#e1be83');r(706,yy,3,2,'#e1be83');}
 // Teal irrigation canal on the eastern edge, crossed by brass bridges.
 r(726,27,16,645,'#233c47');r(729,28,10,643,'#397b83');for(let y=29;y<670;y+=13){r(730+rnd(5),y,4,1,'#87c7b8');}
 for(const y of [245,467,600]){r(718,y-7,33,22,'#3a3636');for(let x=719;x<751;x+=4){r(x,y-7,3,20,'#b09368');r(x,y-7,3,2,'#e4c38a');}r(717,y-8,35,2,'#ddbc7b');r(717,y+12,35,2,'#665a4e');}
 const tree=(x,y,size=1)=>{r(x-10,y+5,24,6,'#2a4142');r(x-2,y-6,5,17,'#665245');r(x+1,y-6,2,13,'#93725b');for(let j=0;j<23;j++){const a=rnd(22)-11,b=rnd(18)-18;r(x+a,y+b,8,7,['#345e54','#467962','#5a916a','#79a775','#396b60'][rnd(5)]);}r(x-5,y-20,9,3,'#94b57a');};
 for(const [x,y] of [[33,43],[34,147],[35,211],[635,40],[658,122],[660,218],[29,352],[29,425],[659,528],[665,655],[911,46],[909,190],[906,328],[910,454],[909,645],[55,665],[293,669],[386,684],[757,674]])tree(x,y);
 // Small garden beds, pixel flowers, fern leaves, crates, steam fittings.
 for(let i=0;i<360;i++){const x=rnd(940),y=rnd(700);if((x<50||x>890||y<35||y>670)){r(x,y,2,2,['#86b88b','#d5c58d','#9fb7c6'][rnd(3)]);r(x+1,y+2,1,2,'#57856b');}}
 const lamp=(x,y)=>{r(x-4,y+12,11,3,'#354748');r(x,y-12,3,26,'#635d52');r(x+1,y-12,1,24,'#b8a079');r(x-4,y-19,11,8,'#413c39');r(x-3,y-18,9,6,'#cda266');r(x-1,y-17,5,5,'#ffe0a0');r(x-5,y-21,13,2,'#7c7960');};
 for(const [x,y]of [[60,264],[293,264],[388,270],[666,264],[872,264],[74,483],[295,484],[660,484],[874,485],[392,619],[699,619]])lamp(x,y);
 const crate=(x,y)=>{r(x,y,11,10,'#3e4543');r(x+1,y+1,9,7,'#a28560');r(x+2,y+2,6,1,'#d1ae77');r(x+5,y+1,1,8,'#6b614f');r(x,y+7,11,2,'#685b49');};
 function building(p){if(paintArchitecture(ctx,p))return;const x=Math.round(p.x/2),y=Math.round(p.y/2),n=p.building;const [dark,light,neon]=colors[p.quarter];let w=n===1?91:66,h=n===1?50:34;const left=x-Math.round(w/2),top=y-25;
  r(left-5,y+26,w+17,10,'#293e40');r(left,y-6,w,37,'#333f43');r(left+2,y-5,w-4,33,'#726e61');r(left+5,y-4,w-10,28,'#8e806b');r(left+5,y+5,w-10,2,'#aa9676');
  for(let xx=left+5;xx<left+w-3;xx+=12){r(xx,y-5,3,34,'#444f4b');r(xx+1,y-4,1,31,'#b39b72');}
  // Roof silhouette; alternating staggered tiles, no smoothing or vector shapes.
  for(let row=0;row<h;row++){const slope=Math.floor(row/4);r(left+8-slope,top-h+row,w-16+slope*2,1,row<4?light:dark);}
  for(let yy=top-h+7;yy<top;yy+=6){const slope=Math.floor((yy-(top-h))/4);r(left+7-slope,yy,w-14+slope*2,1,'#293c42');for(let xx=left+9-slope+((yy%12)?0:5);xx<left+w-7+slope;xx+=10){r(xx,yy+1,1,4,'#b7ad8a');r(xx+1,yy+1,7,1,light);}}
  r(left-4,top,w+8,4,'#303b3e');r(left-3,top,w+6,1,light);r(left-2,top+4,w+4,2,neon);r(left+2,top+7,w-4,2,'#3a4542');
  // A raised dormer/monitor makes the façade recognizable as a workshop.
  const doorX=x-5;r(doorX-2,y+7,15,23,'#41433d');r(doorX,y+7,11,21,'#465d5d');r(doorX+2,y+10,7,10,neon);r(doorX+2,y+21,7,6,'#685f4f');r(doorX+8,y+22,1,2,'#ffe0a2');r(doorX-4,y+28,18,3,'#c4ae87');
  for(const wx of [left+10,left+w-19]){r(wx-2,y+1,12,14,'#343e3d');r(wx,y+3,8,9,'#e0a86c');r(wx+1,y+3,5,7,'#ffdc92');r(wx+4,y+2,1,11,'#705d4a');r(wx-3,y+13,14,2,'#bd9b6d');}
  // Industrial chimney, brass piping, crates, rooftop equipment.
  const chimney=left+w-15;r(chimney,top-h-5,9,18,'#36494b');r(chimney+2,top-h-4,5,16,'#889186');r(chimney-1,top-h-7,11,3,'#bcc0a5');r(chimney+1,top-h-2,7,2,'#475a5a');
  r(left-4,y-5,3,35,'#3a4948');r(left-3,y-4,2,29,'#d0aa70');r(left-5,y+20,7,2,'#f0c480');crate(left+w+3,y+18);crate(left+w+10,y+10);
  if(n%3===0){r(x-12,top-h-7,18,10,'#334950');r(x-10,top-h-5,14,6,'#5d9daa');r(x-8,top-h-5,1,6,'#b2d5bd');r(x-3,top-h-5,1,6,'#b2d5bd');}
  if(n===15||n===32){r(x-9,top-h-31,20,35,'#394e53');r(x-7,top-h-29,16,30,light);r(x-5,top-h-24,12,12,'#36474c');r(x,top-h-23,2,7,'#ffe0a2');r(x,top-h-18,5,2,'#ffe0a2');r(x-11,top-h-33,24,3,neon);}
  if(n===7||n===10||n===9){for(let a=0;a<5;a++){r(left-10+a*3,y+11,2,14,['#ba9971','#779d91','#a0a7bf'][a%3]);}r(left-13,y+26,20,3,'#504e45');}
  if(n===24){r(x-3,y+12,7,8,'#dfb771');r(x-1,y+14,2,3,'#514e45');}
  if(n===1){r(x-16,top-h-19,33,15,'#344b4d');r(x-14,top-h-17,29,11,'#729f90');r(x-11,top-h-14,23,3,'#a1f8d0');r(x-1,top-h-30,2,12,'#ddb77f');r(x-3,top-h-33,6,4,'#85ead2');}
  // Shaded return wall, rivets, weathered stone and a little timber loading deck.
  r(left+w-5,y-4,12,34,'#3d514e');r(left+w-3,y-2,8,29,'#58645a');
  for(let stone=0;stone<12;stone++){const sx=left+4+rnd(w-9),sy=y+5+rnd(21);if(Math.abs(sx-x)>10)r(sx,sy,2+rnd(3),1,['#b6a17c','#6b7160','#c6af83'][rnd(3)]);}
  r(left+5,y+30,w-10,4,'#615e4d');for(let plank=left+7;plank<left+w-8;plank+=7)r(plank,y+30,1,4,'#bf9c6a');
  for(const ry of [y-1,y+21]){r(left+w-2,ry,2,2,'#d2b37b');r(left+2,ry,2,2,'#dac18a');}
  if(p.quarter==='workshop'||n===7){for(let ax=left+4;ax<left+w-4;ax+=7){r(ax,y-1,7,6,(ax-left)%14<7?'#d2ae74':'#6a8273');r(ax,y+5,7,2,'#344c48');}r(left+4,y+7,1,22,'#b9a076');r(left+w-4,y+7,1,22,'#b9a076');}
  if(n%4===1){for(let v=0;v<9;v++){r(left-1+(v%3)*2,y-8+v*3,4,3,['#446d52','#73a06b','#a1b87b'][v%3]);}}
  if(n===25){for(let oy=-14;oy<15;oy++){const span=oy<-9||oy>9?10:oy<-5||oy>5?19:25;r(x-Math.floor(span/2),top-h-19+oy,span,1,oy%5===0?'#ebd4a0':'#94b8ca');}r(x-3,top-h-26,6,12,'#d8edd6');r(x-14,top-h-18,28,2,'#588b93');r(x-4,top-h-5,8,8,'#bfa378');}
  if(n===29||n===33){r(left-13,y+12,2,17,'#d1aa71');r(left-21,y+14,2,16,'#d1aa71');r(left-22,y,14,18,'#c8b88f');r(left-20,y+2,10,14,'#729cb0');r(left-18,y+5,5,5,'#bcd3aa');r(left-21,y+10,11,5,'#4e7f82');}
  // Planters and one luminous hanging shop sign.
  r(left-13,y+2,9,9,'#7b7056');r(left-15,y-2,13,6,'#507e60');r(left-12,y-4,7,5,'#8ab47b');r(left+w+2,y-14,1,21,'#c7a773');r(left+w-1,y-13,14,9,'#3d4c4c');r(left+w,y-12,12,7,neon);r(left+w+3,y-10,6,2,'#45595b');
 }
 for(const p of [...places].sort((a,b)=>a.y-b.y))building(p);
 // Welcome bulletin board in the open square, benches and amber beacon.
 r(444,411,3,24,'#665a48');r(480,411,3,24,'#665a48');r(440,400,47,23,'#383f3b');r(442,402,43,18,'#a38a62');r(440,397,47,4,'#d3b282');
 for(let j=0;j<4;j++){r(446+j*9,405+(j%2)*3,6,9,'#f5dab0');r(447+j*9,407+(j%2)*3,4,1,'#a58b68');}
 for(const [x,y]of [[350,390],[620,392],[544,473]]){r(x,y,30,4,'#cbac79');r(x,y+5,30,3,'#8b7758');r(x+3,y+8,3,5,'#44504b');r(x+24,y+8,3,5,'#44504b');}
 r(552,378,22,9,'#3b5555');r(555,371,16,9,'#79a393');r(558,366,10,6,'#d3b98b');r(561,353,4,14,'#7ae1ce');r(559,355,8,5,'#a8f2ce');
}
