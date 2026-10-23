import {places} from './world.js';
import {paintArchitecture} from './architecture.js';
// Original monochrome raster town: quiet stone, dark clipped gardens and silver canal.
// Native neutral inks, no CSS filter, postprocessed screenshot or glow.
export function paintTown(ctx){
 const r=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
 r(0,0,940,700,'#aaaaaa');
 // Regular cobbles replace noisy random grass. Low-contrast joints preserve silhouettes.
 for(let y=0;y<700;y+=8)for(let x=(y%16?0:6);x<940;x+=13){r(x,y,11,1,'#a7a7a7');r(x,y,1,6,'#b2b2b2');}
 const path=(x,y,w,h)=>{r(x-3,y-3,w+6,h+6,'#777777');r(x-2,y-2,w+4,h+4,'#eeeeee');r(x,y,w,h,'#cccccc');for(let yy=y+6;yy<y+h;yy+=8)for(let xx=x+4;xx<x+w-3;xx+=16)r(xx,yy,11,1,'#bbbbbb');};
 path(55,228,830,36);path(318,57,30,608);path(690,45,29,612);path(65,584,820,34);path(420,70,34,582);path(44,449,841,35);
 // Broad continuous stepped town square, decorative white inlay set into basalt edging.
 for(let y=269;y<463;y++){
  const inset=y<318?Math.floor((318-y)*.85):y>414?Math.floor((y-414)*.85):0;
  r(314+inset,y,355-inset*2,1,'#777777');r(317+inset,y,349-inset*2,1,'#dddddd');
 }
 for(let y=282;y<452;y+=12)for(let x=326;x<656;x+=18){const inset=y<318?Math.floor((318-y)*.85):y>414?Math.floor((y-414)*.85):0;if(x>320+inset&&x+14<660-inset)r(x,y,14,1,'#cccccc');}
 // Engraved paving compass, not an obstacle to walking.
 for(let y=-23;y<=23;y++){const span=23-Math.abs(y);if(span>1){r(535-span,390+y,span*2,1,'#bbbbbb');if(span>4)r(538-span,390+y,span*2-6,1,'#dddddd');}}
 r(533,375,4,29,'#eeeeee');r(521,388,28,4,'#eeeeee');
 // Thin porcelain utility lines trace avenue edges, with square inspection covers.
 for(const [x,y,w]of [[55,230,258],[350,230,340],[65,570,248]]){
  r(x,y-2,w,5,'#777777');r(x,y,w,1,'#eeeeee');for(let xx=x+15;xx<x+w;xx+=32){r(xx,y-3,5,7,'#555555');r(xx+1,y-2,3,5,'#bbbbbb');}
 }
 r(701,48,7,608,'#777777');r(704,48,2,608,'#eeeeee');
 // A silver canal, three timber footbridges. Decoration has no health meaning.
 r(726,27,16,645,'#555555');r(729,28,10,643,'#888888');for(let y=32;y<670;y+=12)r(731+(y%3),y,5,1,'#bbbbbb');
 for(const y of [245,467,600]){r(717,y-8,35,22,'#444444');for(let x=719;x<751;x+=4){r(x,y-7,3,20,'#aaaaaa');r(x,y-7,3,2,'#dddddd');}r(717,y-8,35,2,'#eeeeee');}
 const tree=(x,y)=>{
  r(x-13,y+5,28,5,'#888888');r(x-2,y-9,5,19,'#444444');r(x+1,y-7,2,13,'#999999');
  for(let row=-28;row<1;row++){const span=row<-20?10+Math.floor((row+28)/2):row>-6?13-Math.floor((row+6)/2):17;r(x-span,y+row,span*2,1,'#444444');if(row<-7)r(x-span+2,y+row,span*2-6,1,row%5===0?'#777777':'#666666');}
  r(x-8,y-25,10,2,'#999999');r(x-11,y-16,8,2,'#888888');
 };
 for(const [x,y]of [[30,43],[30,146],[30,211],[654,45],[657,146],[658,218],[28,350],[28,424],[658,531],[664,657],[912,46],[912,190],[912,328],[912,454],[912,645],[55,668],[292,668],[386,684],[757,674]])tree(x,y);
 // Recessed planters frame each lot, never cluttering the broad plaza.
 for(const p of places){const x=Math.round(p.x/2),y=Math.round(p.y/2);r(x-47,y+36,96,3,'#cccccc');r(x-48,y+35,97,1,'#eeeeee');}
 const lamp=(x,y)=>{r(x-4,y+12,10,3,'#888888');r(x,y-11,2,25,'#555555');r(x-4,y-18,10,8,'#444444');r(x-2,y-16,6,4,'#eeeeee');r(x-5,y-20,12,2,'#dddddd');};
 for(const [x,y]of [[60,264],[293,264],[388,270],[666,264],[872,264],[74,483],[295,484],[660,484],[874,485],[392,619],[699,619]])lamp(x,y);
 for(const p of [...places].sort((a,b)=>a.y-b.y)){
  if(paintArchitecture(ctx,p))continue;
  // The human home alone has a tiled roof and a familiar front porch.
  const x=p.x/2,y=p.y/2;r(x-37,y-12,74,43,'#444444');r(x-34,y-11,68,40,'#bbbbbb');
  for(let row=0;row<34;row++){const span=23+Math.floor(row/3);r(x-span,y-47+row,span*2,1,row%6===0?'#333333':'#666666');}
  r(x-37,y-14,74,3,'#eeeeee');r(x-8,y+4,16,26,'#444444');r(x-5,y+7,10,11,'#dddddd');r(x+3,y+21,2,3,'#eeeeee');
  for(const wx of [x-28,x+17]){r(wx,y-1,13,18,'#444444');r(wx+2,y+1,9,12,'#eeeeee');r(wx+6,y+1,1,12,'#777777');}
  r(x-15,y+29,31,4,'#dddddd');r(x+22,y-53,7,24,'#444444');r(x+20,y-55,11,3,'#dddddd');
 }
 // Welcome board and two uncluttered benches.
 r(444,411,3,24,'#555555');r(480,411,3,24,'#555555');r(440,400,47,23,'#333333');r(442,402,43,18,'#888888');r(440,397,47,4,'#dddddd');
 for(let j=0;j<4;j++){r(446+j*9,405+(j%2)*3,6,9,'#eeeeee');r(447+j*9,407+(j%2)*3,4,1,'#aaaaaa');}
 for(const [x,y]of [[350,390],[620,392],[544,473]]){r(x,y,30,4,'#eeeeee');r(x,y+5,30,3,'#888888');r(x+3,y+8,3,5,'#555555');r(x+24,y+8,3,5,'#555555');}
}
