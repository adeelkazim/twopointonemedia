import identities from './identities.js';
import {STATES} from './data.js';
// Deliberately synthetic, approved for visual QA only. No private source content.
export function demoSnapshot(now=Math.floor(Date.now()/1000)){
 return {schemaVersion:1,mode:'synthetic',observedAt:now,components:identities.map((id,i)=>{
  const locked=id.building===24,status=locked?'unknown':STATES[i%6],evidence=locked?'unavailable':'synthetic';
  return {...id,status,lastActivity:null,observedAt:now,evidence,summary:locked?'No reliable telemetry available.':`synthetic: ${status}; point-in-time evidence only.`,details:locked?{locked:true}:{telemetry:'unavailable'}};
 }),catalogs:{skills:[{id:'demo-gardening',name:'Demo gardening',description:'Synthetic guide to tending a fictional garden.'},{id:'demo-navigation',name:'Demo navigation',description:'Synthetic notes about a fictional town.'}],memory:[{id:'demo-garden',name:'Demo garden',description:'A fictional garden is beside the cottage. Not real memory.'}]}};
}
