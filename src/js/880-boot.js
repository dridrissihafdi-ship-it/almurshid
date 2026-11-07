let lastSig='';setInterval(()=>{if(!(screen==='ruhi'&&ruhiTab==='muraqabat')||document.activeElement&&document.activeElement.id==='dhikrText')return;const l=lights(),sig=[l.p.key,l.p.kind,l.halo,l.head,l.heart,l.body].join();if(lastSig&&sig!==lastSig)render();lastSig=sig},30000);
setInterval(()=>{const c=document.getElementById('clock');if(c){const n=new Date();c.textContent=pad(n.getHours())+':'+pad(n.getMinutes())}},15000);
TODAY=dayKey();
if(LANG!=='ar'){i18nLoad().then(()=>render())}else render();
setTimeout(()=>onFbFail(),navigator.onLine===false?3000:15000);
