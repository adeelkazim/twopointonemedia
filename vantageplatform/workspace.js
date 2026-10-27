// Deliberate navigation; never persist a mode or mix live and demo state.
const selector=document.querySelector('#workspaceMode');
selector?.addEventListener('change',()=>{
 if(['index.html','demo.html','live.html'].includes(selector.value))location.assign(new URL(selector.value,location.href));
});
