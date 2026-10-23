import {places,WIDTH,HEIGHT} from './world.js';
// Substeps keep collision reliable even after a slow frame. Coordinates mark feet.
export function advanceAvatar(position,vector,seconds){
 const length=Math.hypot(vector.x,vector.y);if(!length||seconds<=0)return {...position};
 const dx=vector.x/length*180*seconds,dy=vector.y/length*180*seconds;
 const direction=Math.abs(vector.x)>Math.abs(vector.y)?vector.x<0?'left':'side':vector.y<0?'back':'front';
 const steps=Math.ceil(Math.max(Math.abs(dx),Math.abs(dy))/3);let {x,y}=position;
 for(let i=0;i<steps;i++){
  const nx=Math.max(10,Math.min(WIDTH-10,x+dx/steps)),ny=Math.max(10,Math.min(HEIGHT-10,y+dy/steps));
  if(places.some(p=>Math.abs(nx-p.x)<78&&ny>p.y-48&&ny<p.y+60))break;
  x=nx;y=ny;
 }
 return {x,y,direction};
}
export function moveAvatar(position,key){
 const move={ArrowUp:[0,-24,'back'],w:[0,-24,'back'],ArrowDown:[0,24,'front'],s:[0,24,'front'],ArrowLeft:[-24,0,'left'],a:[-24,0,'left'],ArrowRight:[24,0,'side'],d:[24,0,'side']}[key];
 if(!move)return {...position};
 const x=Math.max(10,Math.min(WIDTH-10,position.x+move[0])),y=Math.max(10,Math.min(HEIGHT-10,position.y+move[1]));
 const blocked=places.some(p=>Math.abs(x-p.x)<78&&y>p.y-48&&y<p.y+60);
 return {x:blocked?position.x:x,y:blocked?position.y:y,direction:move[2]};
}
