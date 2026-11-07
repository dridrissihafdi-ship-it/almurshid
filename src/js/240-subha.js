/* ---------- the prayer beads (subha): your own dhikr list, a counter you tap ---------- */
const SUBHA_DEF=[['سبحان الله',33],['الحمد لله',33],['الله أكبر',34],['أستغفر الله',100],['اللهم صلِّ على سيدنا محمد',100],['لا إله إلا الله',100]];
let sbAdd=false,sbReset=false,sbEdit=false,sbZero=false;
function sb(){if(!S.subha)S.subha={list:SUBHA_DEF.map(([t,n])=>({t,n})),cur:0,day:{}};const B=S.subha;if(!B.day[TODAY])B.day[TODAY]={};if(B.cur>=B.list.length)B.cur=0;return B}
const sbCount=(i)=>(sb().day[TODAY][i]||0);
const sbTotal=()=>Object.values(sb().day[TODAY]).reduce((a,b)=>a+b,0);
function subhaCard(){const B=sb(),t=sbTotal();
  return `<button class="box pad sb-card" data-go="subha"><span class="sb-ic"><svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="9" r="3.2"/><circle cx="15.5" cy="13" r="3.2"/><circle cx="32.5" cy="13" r="3.2"/><circle cx="11.5" cy="21.5" r="3.2"/><circle cx="36.5" cy="21.5" r="3.2"/><circle cx="15.5" cy="30" r="3.2"/><circle cx="32.5" cy="30" r="3.2"/><circle cx="24" cy="34" r="3.2"/><path d="M24 37.5v4M21 44h6"/></svg></span><span class="tz-name"><b>السبحة</b><small>${t?'<span>تسبيحات اليوم:</span> '+t:'أذكارك مع عدّاد باللمس'}</small></span><span class="btn small ok">افتح</span></button>`}
function viewSubha(){const B=sb(),i=B.cur,d=B.list[i]||{t:'',n:0},c=sbCount(i),pct=d.n?Math.min(c/d.n,1):0,C=2*Math.PI*118;
  const chips=B.list.map((x,k)=>`<button class="${k===i?'on':''} notr" dir="rtl" data-sbpick="${k}">${esc(x.t)}<small dir="ltr">${sbCount(k)}${x.n?' / '+x.n:''}</small></button>`).join('');
  setTimeout(()=>{const on=document.querySelector('.sb-chips .on');if(on)on.scrollIntoView({inline:'center',block:'nearest'})},0);
  return `<section class="sb">
   <div class="sb-chips">${chips}</div>
   ${sbAdd?`<div class="box pad sb-form"><label class="muted" for="sbT">الذكر</label><input type="text" id="sbT" placeholder="مثال: سبحان الله وبحمده" dir="rtl">
     <label class="muted" for="sbN">العدد المطلوب (اتركه 0 بلا حدّ)</label><input type="number" id="sbN" min="0" value="100" inputmode="numeric">
     <div class="btns"><button class="btn ok" data-sbsave="1">أضف</button><button class="btn" data-sbcancel="1">تراجع</button></div></div>`:''}
   <button class="sb-tap" id="sbTap" data-sbtap="1" aria-label="سبّح">
     <svg viewBox="0 0 260 260" aria-hidden="true"><circle cx="130" cy="130" r="118" fill="none" stroke="var(--chip)" stroke-width="12"/><circle id="sbRing" cx="130" cy="130" r="118" fill="none" stroke="var(--gold)" stroke-width="12" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C*(1-pct)}" transform="rotate(-90 130 130)"/></svg>
     <span class="sb-in"><b class="notr" dir="rtl">${esc(d.t)}</b><strong id="sbNum">${c}</strong><small id="sbOf" dir="ltr">${d.n?'/ '+d.n:''}</small></span>
   </button>
   <div class="sb-bar"><button class="sb-b" dir="ltr" data-sbundo="1" aria-label="${esc(Tx('تراجع واحدة'))}">−1</button><span class="sb-tot"><span>اليوم:</span> <b id="sbTot">${sbTotal()}</b></span><button class="sb-b" data-sbmore="1" aria-label="${esc(Tx('المزيد'))}">⋯</button></div>
   ${sbZero?`<div class="confirm" style="margin-top:10px"><span>تصفير كل عدّادات السبحة لهذا اليوم والبدء من الذكر الأول؟</span><div class="btns"><button class="btn slip" data-sbzeroyes="1">نعم، ابدأ من 0</button><button class="btn" data-sbzerono="1">تراجع</button></div></div>`:''}
   ${sbReset?`<div class="confirm" style="margin-top:10px"><span><span>تصفير عدّاد</span> «<span class="notr">${esc(d.t)}</span>» <span>لهذا اليوم؟</span></span><div class="btns"><button class="btn slip" data-sbresetyes="1">نعم، صفّره</button><button class="btn" data-sbresetno="1">تراجع</button></div></div>`:''}
   ${sbEdit?`<div class="box sb-list">${B.list.map((x,k)=>`<div class="sb-row"><span class="notr" dir="rtl">${esc(x.t)}</span><small>${x.n||'∞'}</small><button class="btn small" data-sbup="${k}"${k?'':' disabled'} aria-label="تقديم">▲</button><button class="btn small dl-del" data-sbdel="${k}" aria-label="حذف"${B.list.length>1?'':' disabled'}>حذف</button></div>`).join('')}<div class="btns"><button class="btn small ok" data-sbedit="1">تمّ</button></div></div>`:''}
   </section>`}
function sbMore(){const r=(a,t)=>`<button class="h2-row" ${a} data-bsx="1"><span class="tx">${t}</span></button>`;
  sheetOpen(`<div class="bs-top"><h2>السبحة</h2><button class="qa-ed" data-bsx="1">إغلاق</button></div><div class="box h2-more">${r('data-sbadd="1"','أضف ذكرًا')}${r('data-sbedit="1"','ترتيب الأذكار أو حذفها')}${r('data-sbreset="1"','تصفير هذا الذكر')}${r('data-sbzero="1"','ابدأ كل الأذكار من 0')}</div><p class="meta" style="margin:10px 4px 0">المس الدائرة لكل تسبيحة. عند بلوغ العدد يصدر تنبيه وتنتقل إلى الذكر التالي.</p>`)}
function sbTick(){const B=sb(),i=B.cur,d=B.list[i];if(!d)return;const T=B.day[TODAY];T[i]=(T[i]||0)+1;save();
  const c=T[i];try{navigator.vibrate&&navigator.vibrate(d.n&&c===d.n?[120,60,120]:12)}catch(e){}
  if(d.n&&c===d.n){sndPlay('step',()=>bell([784,988],.28,1.4,.35));if(B.list.length>1){B.cur=(i+1)%B.list.length;save();render();const t=document.getElementById('sbTap');if(t){t.classList.add('done');setTimeout(()=>t.classList.remove('done'),900)}return}}
  const num=document.getElementById('sbNum'),ring=document.getElementById('sbRing'),tot=document.getElementById('sbTot');
  if(num)num.textContent=c;if(tot)tot.textContent=sbTotal();
  if(ring&&d.n){const C=2*Math.PI*118;ring.setAttribute('stroke-dashoffset',C*(1-Math.min(c/d.n,1)))}
  const tap=document.getElementById('sbTap');if(tap){tap.classList.remove('pulse');void tap.offsetWidth;tap.classList.add('pulse')}
  const ch=document.querySelector('[data-sbpick="'+i+'"] small');if(ch)ch.textContent=c+(d.n?' / '+d.n:'')}
