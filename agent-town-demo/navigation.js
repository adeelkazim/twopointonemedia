import {places,WIDTH,HEIGHT} from './world.js';
export function moveAvatar(position,key){
 const move={ArrowUp:[0,-24,'back'],w:[0,-24,'back'],ArrowDown:[0,24,'front'],s:[0,24,'front'],ArrowLeft:[-24,0,'left'],a:[-24,0,'left'],ArrowRight:[24,0,'side'],d:[24,0,'side']}[key];
 if(!move)return {...position};
 const x=Math.max(10,Math.min(WIDTH-10,position.x+move[0])),y=Math.max(10,Math.min(HEIGHT-10,position.y+move[1]));
 const blocked=places.some(p=>Math.abs(x-p.x)<78&&y>p.y-48&&y<p.y+60);
 return {x:blocked?position.x:x,y:blocked?position.y:y,direction:move[2]};
}
