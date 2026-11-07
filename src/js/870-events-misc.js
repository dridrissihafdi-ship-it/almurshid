document.addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;const d=t.dataset;
  if(d.pweye){const i=document.getElementById(d.pweye);if(i){const on=i.type==='password';i.type=on?'text':'password';t.setAttribute('aria-pressed',String(on));t.setAttribute('aria-label',Tx(on?'إخفاء كلمة المرور':'إظهار كلمة المرور'));t.classList.toggle('on',on)}return}
  if(d.guest){lsSet('murshid-guest','1');AUTH.state='local';AUTH.err='';render();return}
  if(d.toauth){try{localStorage.removeItem('murshid-guest')}catch(x){}AUTH.mode=d.toauth;AUTH.err='';AUTH.state=window.FB?'out':'local';render();SCR().scrollTo(0,0);return}});
document.addEventListener('change',e=>{
  if(e.target.dataset&&e.target.dataset.trstartd){const v=e.target.value;if(v&&v<=TODAY){trSetStart(e.target.dataset.trstartd,v);render()}return}
  if(e.target.dataset&&e.target.dataset.orgstart){const o=S.organs[e.target.dataset.orgstart],v=e.target.value;if(v&&v<=TODAY){orgSetStart(o,v);save();render()}return}
  if(e.target.dataset&&e.target.dataset.prepstartd){const v=e.target.value;if(v&&v<=TODAY){prepSetStart(v);save();render()}return}
  if(e.target.id==='khS'||e.target.id==='khE'){khReadForm();render();return}
  if(e.target.id==='tzDateIn'){const v=e.target.value;tzDate=v&&v<TODAY?v:null;tzConf=null;render();return}
  if(e.target.id==='aDateIn'){const v=e.target.value;aDate=v&&v<TODAY?v:null;render();return}
  if(e.target.id==='photoIn'){setPhoto(e.target.files&&e.target.files[0]);return}
  if(e.target.dataset&&e.target.dataset.pushon){pushPrefs().on[e.target.dataset.pushon]=e.target.checked;save();pushSync();if(e.target.dataset.pushon==='hudur'){const y=SCR().scrollTop;render();SCR().scrollTo(0,y)}return}
  if(e.target.id==='bedT'){pushPrefs().bed=e.target.value||'22:00';save();pushSync();return}
  if(e.target.id==='hFrom'||e.target.id==='hTo'){const P=pushPrefs();P[e.target.id]=e.target.value||(e.target.id==='hFrom'?'07:00':'22:00');save();pushSync();return}
  if(e.target.id==='ptMSel'){S.ptM=e.target.value==='auto'?undefined:e.target.value;save();pushSync();const y=SCR().scrollTop;render();SCR().scrollTo(0,y);return}
  if(e.target.id==='citySel'){const c=CITIES[+e.target.value];if(c){geoMsg='';setLoc({lat:c[3],lng:c[4],ar:c[1],lt:c[2]})}return}
  const pk=e.target.dataset&&e.target.dataset.ampick;if(pk){const[k,id]=pk.split(':'),L=aLog(),P=amPick(L),cur=S.amPick||{aw:P.aw.slice(),nf:P.nf.slice()};
    [cur,P].forEach(o=>{o[k]=o[k].filter(x=>x!==id);if(e.target.checked)o[k].push(id)});S.amPick=cur;if(!aDate)L.pick=P;save();const y=SCR().scrollTop;render();SCR().scrollTo(0,y);return}
  if(e.target.dataset&&e.target.dataset.adzon!==undefined){const A=adzP();A.on=e.target.checked;save();if(A.on){adzUnlocked=false}const y=SCR().scrollTop;render();SCR().scrollTo(0,y);return}
  if(e.target.dataset&&e.target.dataset.adzp){adzP().p[e.target.dataset.adzp]=e.target.checked;save();return}
  const w=e.target.dataset&&e.target.dataset.wird;if(!w)return;const L=screen==='aamal'?aLog():dayLog();
  if(w==='salat')L.prayers=e.target.checked?FIVE.map(f=>f[0]):[];
  applyWird(w,e.target.checked,screen==='aamal'?aDate:null);
  if(screen==='aamal')return render();
  const c=document.getElementById('wcount');if(c)c.textContent=AWRAD.filter(a=>L.awrad.includes(a.id)).length+' / '+AWRAD.length;
});
document.addEventListener('input',e=>{
  if(e.target.id==='dhikrText'){S.marks.dhikrText=e.target.value;save()}
  if(e.target.id==='mh-good'||e.target.id==='mh-slip'){const M=mhState(),k=nowStr();M[k]=M[k]||{};M[k][e.target.id==='mh-good'?'good':'slip']=e.target.value;save()}
  if(e.target.dataset.dlt!==undefined){dlList()[+e.target.dataset.dlt].text=e.target.value;save()}
  if(e.target.dataset.dlm!==undefined){const v=Math.max(0,Math.min(180,parseFloat(e.target.value)||0));dlList()[+e.target.dataset.dlm].min=v;save();const h=document.querySelector('.dl-tot');if(h)h.textContent=ar2(dlTotal())}
  if(e.target.id==='mshQ'){const q=normAr(e.target.value.trim()).replace(/^سوره\s*/,'').replace(/^ال(?=..)/,'');let c=0;document.querySelectorAll('#mshSL .msh-sr').forEach(b=>{const n=b.dataset.n,ok=!q||(/^\d+$/.test(q)?n.split(' ').pop()===q:n.includes(q));b.hidden=!ok;if(ok)c++});document.getElementById('mshNone').hidden=c>0}
  if(e.target.id==='tqQ'){tqQuery=e.target.value;clearTimeout(tqSearch.t);tqSearch.t=setTimeout(()=>{tqSearch.jump=true;tqSearch()},220)}
  if(e.target.id==='tqAsk'){tqAskDraft=e.target.value}
  if(e.target.id==='note'){dayLog().note=e.target.value;save()}
  if(e.target.id==='pname'){S.name=e.target.value;save()}
  if(e.target.id==='bkIn'){backupRead(e.target.files&&e.target.files[0]);e.target.value='';return}
  if(e.target.id==='waredIn'){(S.waredDrafts=S.waredDrafts||{})[screen]=e.target.value;save()}
});
