// Original pixel architecture. All silhouettes stay within one walkable map lot.
// Light is illustrative, never telemetry or a claim of current service health.
export function paintArchitecture(ctx,p){
 const n=p.building,x=Math.round(p.x/2),y=Math.round(p.y/2);
 if(n===2)return false;
 const palettes={access:['#304e50','#617e70','#a5b69a','#87eac7'],agents:['#294d58','#4c7c83','#98b8ac','#83e8d4'],centre:['#294c53','#4b7c7c','#88b2a4','#72f4d5'],workshop:['#484652','#766771','#aa8d77','#ffcd85'],mind:['#393e5a','#606780','#969ab0','#bba2fa'],cloud:['#34465c','#617993','#a7bcc4','#8ee4f2'],control:['#484950','#797866','#b8a77c','#ffdb8d']};
 const [dark,wall,edge,neon]=palettes[p.quarter],ink='#23363e',brass='#bb9160',gold='#eed09a',glass='#315d69';
 const r=(a,b,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(x+a,y+b,w,h);};
 const plate=(a,b,w,h,c=wall)=>{
  r(a,b,w,h,ink);r(a+2,b+2,w-4,h-4,c);r(a+2,b+2,w-4,1,edge);
  // Lit left bevel, dark return wall and sparse scratched panels give raster depth.
  if(w>=9&&h>=10){
   r(a+2,b+3,1,h-5,brass);r(a+w-5,b+3,3,h-5,'#1b3039');r(a+3,b+h-4,w-8,2,dark);
   for(let row=b+7;row<b+h-5;row+=7)for(let col=a+6;col<a+w-6;col+=9){
    const hash=Math.abs(col*13+row*7+n*3);r(col,row,2+hash%3,1,hash%3?'#70878a':edge);
    if(hash%4===0)r(col+1,row+1,1,2,dark);
   }
   for(const col of [a+3,a+w-7])for(const row of [b+4,b+h-6]){r(col,row,2,2,ink);r(col,row,1,1,'#d8c495');}
  }
 };
 const pipe=(a,b,w,h)=>{r(a,b,w,h,ink);r(a+1,b,w-2,h,brass);for(let t=b+4;t<b+h;t+=10)r(a,t,w,2,gold);};
 const window=(a,b,w=10,h=13)=>{plate(a,b,w,h,glass);r(a+3,b+3,w-6,h-6,neon);r(a+3,b+3,1,h-6,'#e9f4cf');};
 const door=(a=-7)=>{plate(a,6,14,24,dark);r(a+3,9,8,2,neon);r(a+10,20,2,3,gold);r(a-3,30,20,3,edge);};
 const rivets=(a,b,w)=>{for(let t=a+4;t<a+w-2;t+=10)r(t,b,2,2,gold);};
 const ring=(cx,cy,rx,ry,c)=>{for(let row=-ry;row<=ry;row++){const extent=Math.round(rx*Math.sqrt(1-row*row/(ry*ry)));if(extent>0){r(cx-extent,cy+row,extent*2+1,1,c);if(Math.abs(row)<ry-2&&extent>5)r(cx-extent+3,cy+row,extent*2-5,1,dark);}}};
 const base=(w=76)=>{plate(-w/2,-13,w,45);r(-w/2-4,32,w+8,4,'#555e59');rivets(-w/2,-9,w);};
 r(-49,28,99,8,'#293e40');
 if(n===1){
  // Central reactor hall: octagonal glass chamber, twin heat exchangers, copper crown.
  base(92);plate(-31,-40,62,29);plate(-24,-59,48,22,dark);r(-18,-56,36,3,brass);ring(0,-34,35,10,brass);
  for(let row=0;row<35;row++){const span=row<9?8+row*2:row>25?8+(34-row)*2:26;r(-Math.floor(span/2),-52+row,span,1,row%5===0?'#bcffe2':neon);}
  r(-2,-48,3,22,'#ecffe0');r(-28,-27,56,2,gold);
  for(const a of [-44,30]){plate(a,-28,15,53,dark);for(let b=-23;b<20;b+=6)r(a+3,b,9,2,edge);pipe(a+4,-48,7,21);}
  plate(-15,-75,30,13,dark);r(-10,-72,20,4,neon);r(-2,-63,4,8,brass);door();window(-29,6,12,19);window(18,6,12,19);
 }else if(n===15){
  // Clock tower is the entire building, not a clock added to a cottage roof.
  plate(-31,-8,62,40);plate(-19,-61,38,61);plate(-23,-65,46,7,brass);plate(-14,-76,28,12,dark);
  r(-2,-73,4,5,neon);plate(-15,-58,30,28,dark);
  for(let b=-10;b<=10;b++){const span=Math.round(Math.sqrt(100-b*b));if(span)r(-span,-44+b,span*2+1,1,'#e5c698');}
  r(-1,-53,2,11,ink);r(0,-44,8,2,ink);for(const a of [-29,22])pipe(a,-15,7,39);
  r(-21,-27,42,4,neon);plate(-12,-21,24,20,glass);r(-1,-18,2,12,gold);r(-5,-10,10,2,brass);door();
 }else if(n===32){
  // Supervisor tower: slender stacked observation decks and offset radar crown.
  plate(-15,-50,30,81,dark);for(const b of [-49,-26,-3]){plate(-31,b,62,17);for(const a of [-25,-9,7])window(a,b+3,12,11);r(-30,b+15,60,2,neon);}
  plate(-20,-59,40,10,brass);r(-2,-74,4,16,edge);r(-22,-76,43,4,neon);r(19,-72,3,10,brass);r(-23,-73,3,10,brass);
  for(const a of [-23,19]){r(a,-9,4,41,brass);r(a+1,-8,1,38,gold);}door();
 }else if(n===25){
  // Model spire: stepped quartz crystal suspended in brass inference rings.
  base(66);plate(-17,-22,34,19,dark);ring(0,-53,29,8,brass);ring(0,-31,36,10,neon);
  for(let b=0;b<48;b++){const span=b<17?4+Math.floor(b/2):b>34?13-Math.floor((b-34)/2):13;r(-span,-74+b,span*2,1,b%8===0?'#dbf9ee':'#8fa7dd');r(-2,-74+b,3,1,'#d6fff0');}
  r(-29,-48,3,29,brass);r(27,-48,3,29,brass);
  window(-26,1,13,21);window(14,1,13,21);door();r(-33,26,66,3,neon);
 }else if(n===10){
  // Skills foundry: sawtooth factory roof, exhaust stack, visible maker benches.
  base(82);for(let a=-41;a<40;a+=27){for(let row=0;row<22;row++)r(a,-46+row,5+row,1,dark);r(a,-47,4,24,brass);r(a+4,-27,22,3,neon);}
  plate(-41,-24,82,13);pipe(31,-70,10,45);r(28,-73,16,4,edge);r(33,-64,6,2,gold);
  for(const a of [-32,-10,12]){window(a,-18,18,23);r(a-2,7,22,3,brass);r(a,12,18,2,gold);r(a+2,17,4,10,wall);}
  r(-36,27,72,3,neon);rivets(-41,-22,82);
 }else if(n===11){
  // Terminal machine hall: angular server canopy and huge CRT-green command windows.
  base(84);plate(-39,-45,78,31,dark);plate(-26,-58,52,14);r(-23,-55,46,2,brass);
  for(const a of [-32,-9,14]){window(a,-38,18,19);r(a+4,-32,4,2,'#f3e7b5');r(a+8,-29,5,1,'#f3e7b5');}
  for(const a of [-42,35]){pipe(a,-62,7,51);r(a,-64,7,3,edge);}r(-37,-16,74,3,neon);door();window(-32,3,18,19);window(15,3,18,19);
  for(const a of [-27,19]){r(a,25,9,2,brass);r(a+2,22,2,2,gold);}
 }else if(n===23){
  // Approval checkpoint: two armored pylons and a high luminous open arch.
  for(const a of [-43,23]){plate(a,-54,20,86,dark);plate(a+3,-47,14,28);r(a+6,-42,8,17,neon);r(a+2,-13,16,4,brass);for(let b=-5;b<26;b+=7)r(a+4,b,12,2,edge);}
  plate(-34,-68,68,15,dark);r(-28,-64,56,3,neon);r(-19,-52,38,4,brass);r(-23,-54,4,15,brass);r(19,-54,4,15,brass);
  r(-19,22,38,4,brass);for(let a=-17;a<18;a+=7){r(a,22,4,4,ink);}r(-20,29,40,4,edge);plate(-9,-64,18,12,brass);r(-4,-60,8,3,gold);
 }else if(n===24){
  // Credential strongroom has no windows: armored drum, lock wheel and buttresses.
  base(78);plate(-31,-47,62,37,dark);plate(-23,-57,46,11,brass);r(-19,-54,38,2,gold);
  for(const a of [-39,27]){plate(a,-35,12,64);for(let b=-29;b<24;b+=9)r(a+3,b,6,2,brass);}
  plate(-21,-26,42,53,dark);ring(0,0,16,17,brass);ring(0,0,10,11,edge);r(-1,-10,3,21,gold);r(-10,-1,21,3,gold);r(-3,-3,7,7,ink);r(-1,-1,3,3,gold);
  r(-17,-23,34,3,neon);rivets(-31,-41,62);rivets(-31,26,62);
 }else if(p.quarter==='mind'){
  // Knowledge quarter: Art Deco archive stacks and stained-glass atrium roofs.
  const tier=n===7?8:n===9?0:4;base(78);plate(-33,-36-tier,66,24+tier,dark);plate(-24,-49-tier,48,13);
  if(n===7||n===6){for(let b=0;b<17;b++){const span=Math.round(23*Math.sqrt(1-(16-b)**2/256));if(span)r(-span,-66-tier+b,span*2,1,b%4===0?brass:glass);}for(const a of [-12,-1,10])r(a,-58-tier,2,11,gold);}
  else{plate(-15,-64,30,14,dark);for(const a of [-10,0,10])r(a,-61,4,7,neon);r(-17,-67,34,3,brass);}
  for(const a of [-27,-10,7])window(a,-31-tier,13,17+tier);
  for(const a of [-36,29]){plate(a,-31,7,61,brass);r(a+2,-27,2,51,gold);}
  door();for(const a of [-28,17]){plate(a,3,13,21,glass);for(let b=6;b<22;b+=4)r(a+3,b,7,2,['#d6ac7b','#9cbeac','#b7a7d4'][(b-6)%3]);}
  r(-30,-12,60,3,neon);r(-25,-8,50,2,brass);rivets(-33,-39-tier,66);
 }else if(p.quarter==='agents'){
  // Team courtyard: planted live/work terraces and staggered solar awnings.
  const offset=(n%3)*8-8;base(74);plate(-29,-37,58,25);plate(-23+offset,-57,38,23,dark);
  r(-26+offset,-61,44,5,brass);r(-23+offset,-55,38,2,neon);window(-17+offset,-50,14,13);window(0+offset,-50,12,13);
  for(let a=-31;a<30;a+=13){r(a,-27,11,12,glass);r(a+1,-26,8,1,neon);r(a+4,-24,1,8,edge);}
  r(-36,-15,72,4,brass);r(-36,-12,72,2,neon);door();window(-28,2,14,19);window(15,2,14,19);
  for(const a of [-34,23]){r(a,24,12,6,brass);for(let b=0;b<4;b++)r(a+b*3,20-b%2*3,3,6,['#467965','#82ac7d'][b%2]);}
  r(28,-59,2,22,brass);r(30,-58,13,8,neon);r(32,-56,8,2,glass);rivets(-29,-34,58);
 }else if(p.quarter==='access'){
  // Arrival transit pavilions: curved glass canopies and pneumatic post tubes.
  base(76);plate(-36,-34,72,22,dark);
  for(let b=0;b<22;b++){const span=36-Math.floor((21-b)*(21-b)/24);if(span>0)r(-span,-56+b,span*2,1,b%5===0?brass:glass);}
  for(const a of [-24,-12,0,12,24]){r(a,-43,2,23,edge);r(a+2,-40,2,11,neon);}r(-36,-16,72,3,neon);
  door();window(-28,2,14,19);window(15,2,14,19);
  if(n===4){for(const a of [-47,41]){pipe(a,-45,6,69);r(a-1,-47,8,3,gold);}plate(-17,-63,34,11,brass);r(-11,-60,22,4,gold);}
  else{plate(-16,-67,32,12,dark);r(-12,-64,24,6,neon);r(-10,-63,20,3,glass);}
  rivets(-36,-11,72);r(-33,26,66,3,brass);
 }else if(p.quarter==='cloud'){
  // Sky docks: elevated steel decks, exposed trusses, antennae and cargo crane.
  plate(-42,-12,84,30,dark);r(-46,19,92,5,brass);r(-43,20,86,1,gold);
  for(const a of [-36,27]){plate(a,22,9,11);r(a+3,25,2,5,neon);}
  for(const a of [-35,-15,5,25])window(a,-5,13,16);r(-40,-15,80,3,neon);
  if(n===27){
   plate(-37,-65,9,51,brass);r(-35,-61,3,42,gold);plate(-36,-68,75,7,brass);for(let a=-23;a<35;a+=12){r(a,-60,2,11,brass);r(a+2,-58,7,2,brass);}r(25,-60,2,25,gold);r(23,-36,8,3,edge);plate(14,-32,23,17);rivets(14,-29,23);
  }else if(n===28){
   plate(-22,-36,44,20);pipe(-3,-73,7,37);ring(0,-57,27,11,edge);r(-1,-69,2,24,neon);r(-21,-58,42,2,neon);plate(-11,-42,22,9,brass);
  }else if(n===29){
   plate(-30,-43,60,29);ring(0,-46,28,21,brass);ring(0,-46,21,16,edge);ring(0,-46,13,10,neon);r(-5,-51,10,10,glass);r(-3,-49,4,3,gold);for(const a of [-37,29])pipe(a,-30,7,18);
  }else{
   plate(-31,-39,62,24);plate(-22,-56,44,18);plate(-13,-69,26,14,dark);r(-10,-66,20,5,neon);for(const a of [-24,-8,8])window(a,-34,12,13);r(-24,-58,48,3,brass);r(-17,-41,34,2,gold);
  }
  rivets(-42,15,84);
 }else{
  // Maker annexes: ventilated machine roofs, gantries and task-specific machinery.
  base(80);plate(-35,-37,70,25,dark);plate(-27,-49,54,12);r(-24,-46,48,3,brass);
  for(const a of [-27,-9,9]){window(a,-32,13,15);r(a+3,-28,7,1,gold);}
  pipe(-45,-56,7,70);r(-47,-59,11,4,edge);r(-39,-14,78,3,neon);door();window(-30,1,15,20);window(16,1,15,20);
  if(n===13){plate(-12,-68,24,18,dark);ring(0,-59,16,8,brass);r(8,-74,8,19,edge);r(10,-72,4,11,neon);}
  else if(n===33){plate(-19,-66,38,18,dark);ring(0,-58,12,9,brass);r(-6,-63,12,9,glass);r(-3,-61,4,3,neon);}
  else if(n===31){ring(0,-58,18,13,brass);ring(0,-58,10,7,edge);r(-3,-61,6,6,neon);for(const a of [-22,18])r(a,-63,5,9,brass);}
  else if(n===16){plate(-17,-65,34,15,dark);for(const a of [-11,-1,9])r(a,-61,5,7,neon);r(-2,-75,3,10,brass);r(-13,-72,25,2,edge);}
  else{plate(-24,-61,48,13,brass);for(let a=-20;a<23;a+=7)r(a,-58,3,6,glass);r(27,-63,5,28,brass);r(24,-66,11,4,edge);}
  r(-34,25,68,3,brass);rivets(-35,-35,70);
 }
 return true;
}
