/* ---------- «حصاد يومك»: a short report on the home page after Isha (until Fajr) ---------- */
function nightOn(){try{const h=dH(),pt=ptDay();return (h>=pt.isha||h<pt.fajr)&&S.nightX!==TODAY}catch(e){return false}}
function nightCard(){if(!nightOn())return '';
  const L=dayLog(),[dn,tot]=amProgress(L),T=treeState(),D=mkDay(),f=mkDone(TODAY),mk=D.r==='w'?'انتصرت':D.r==='l'?'خسرت':f.filter(Boolean).length+' / '+f.length;
  const tt=T.st<3?TREE_ST[T.st]:T.hs===0?(T.t>=1?'مثمرة كاملة':'نضرة'):TREE_HS[T.hs];
  const pr=L.prayers||[],left=FIVE.filter(([k])=>!pr.includes(k)).map(x=>'صلاة '+x[1]);
  const all=dn>=tot,msg=all?'أتممت أعمال يومك كلها. تقبّل الله منك، واختم يومك بالمحاسبة.':dn/tot>=.6?'يوم طيب. ما بقي قليل، وما زال في الليل وقت.':'لم يفت الوقت: ما أدركته الليلة يُحسب لك، وغدًا بداية جديدة.';
  return `<section class="box nt-c"><button class="nt-x" data-nightx="1" aria-label="إخفاء">×</button>
   <small class="nt-k">حصاد يومك</small><p class="nt-m">${msg}</p>
   <div class="nt-s"><div><b dir="ltr">${dn}/${tot}</b><span>الأعمال</span></div><div><b>${tt}</b><span>شجرتك</span></div><div><b${D.r==='w'?' class="w"':D.r==='l'?' class="l"':''}>${mk}</b><span>المعركة</span></div></div>
   ${left.length&&!all?`<p class="meta nt-l"><span>لم تسجّل بعد:</span> ${left.slice(0,3).map(t=>'<span>'+t+'</span>').join(RTL()?'، ':', ')}</p>`:''}
   <div class="nt-b"><button class="btn ok small" data-go="muhasaba">حاسب نفسك</button>${all?'':'<button class="btn small" data-go="aamal">أكمل ما بقي</button>'}${!D.r&&mkCanJudge()?'<button class="btn small" data-go="maraka">نتيجة المعركة</button>':''}</div></section>`}
/* each completed deed: a light vibration (Android) and a small gold chip «+ ثمرة»; all done: a fuller one */
let dnLast=null,dnDay=null;
function deedPulse(){try{if(gated()||needOnboard())return;const [dn,tot]=amProgress(dayLog());
  if(dnDay===TODAY&&dnLast!=null&&dn>dnLast){const all=dn>=tot;try{navigator.vibrate&&navigator.vibrate(all?[30,60,30,60,60]:25)}catch(e){}
    let t=document.getElementById('dpT');if(t)t.remove();t=document.createElement('div');t.id='dpT';t.className='dp-t'+(all?' all':'');t.dir=RTL()?'rtl':'ltr';t.setAttribute('role','status');
    t.innerHTML=all?`<b>${Tx('أتممت أعمال اليوم')}</b><span>${Tx('اكتملت ثمار شجرتك')}</span>`:`<b>${Tx('+ ثمرة')}</b><span dir="ltr">${dn} / ${tot}</span>`;
    document.body.appendChild(t);setTimeout(()=>t.classList.add('out'),all?2600:1300);setTimeout(()=>t.remove(),all?3200:1800)}
  dnLast=dn;dnDay=TODAY}catch(e){}}
