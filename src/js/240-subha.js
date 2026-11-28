/* ---------- the prayer beads (subha): your own dhikr list, a counter you tap ---------- */
const SUBHA_DEF=[['سبحان الله',33],['الحمد لله',33],['الله أكبر',34],['أستغفر الله',100],['اللهم صلِّ على سيدنا محمد',100],['لا إله إلا الله',100]];
let sbAdd=false,sbReset=false,sbEdit=false,sbZero=false;
function sb(){if(!S.subha)S.subha={list:SUBHA_DEF.map(([t,n])=>({t,n})),cur:0,day:{}};const B=S.subha;if(!B.day[TODAY])B.day[TODAY]={};if(B.cur>=B.list.length)B.cur=0;return B}
const sbCount=(i)=>(sb().day[TODAY][i]||0);
const sbTotal=()=>Object.values(sb().day[TODAY]).reduce((a,b)=>a+b,0);
function subhaCard(){const B=sb(),t=sbTotal();
  return `<button class="box pad sb-card" data-go="subha"><span class="sb-ic"><svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="9" r="3.2"/><circle cx="15.5" cy="13" r="3.2"/><circle cx="32.5" cy="13" r="3.2"/><circle cx="11.5" cy="21.5" r="3.2"/><circle cx="36.5" cy="21.5" r="3.2"/><circle cx="15.5" cy="30" r="3.2"/><circle cx="32.5" cy="30" r="3.2"/><circle cx="24" cy="34" r="3.2"/><path d="M24 37.5v4M21 44h6"/></svg></span><span class="tz-name"><b>السبحة</b><small>${t?'<span>تسبيحات اليوم:</span> '+t:'أذكارك مع عدّاد باللمس'}</small></span><span class="btn small ok">افتح</span></button>`}
/* 33 beads around the circle: the ones already counted in this round of the subha are lit, the next one is bigger */
function sbBeads(c){const f=c%33===0&&c>0?33:c%33;let o='';for(let k=0;k<33;k++){const a=-Math.PI/2+k/33*2*Math.PI,x=130+118*Math.cos(a),y=130+118*Math.sin(a);
  o+=`<circle class="sb-bd${k<f?' on':''}${k===f%33?' nx':''}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${k===f%33?9:6.5}"/>`}return o}
/* the subha on the living picture of «التسبيح بعد الصلاة»: the seeker climbs as the count of the current dhikr fills,
   one picture for each third, the light when it is complete; the string of beads slides one bead per tap */
function sbFrac(d,c){return d.n?Math.min(c/d.n,1):((c%99)/99)}
function sbStage(d,c){const f=sbFrac(d,c);return f>=1?4:1+Math.min(2,Math.floor(f*3))}
const sbZoomK=(d,c)=>{const f=sbFrac(d,c);return f>=1?0:Math.round(((f*3)%1)*33)};
function viewSubha(){const B=sb(),i=B.cur,d=B.list[i]||{t:'',n:0},c=sbCount(i),stg=sbStage(d,c),k=c%33===0&&c>0?33:c%33,P=TSB_PH[(stg-1)%3]||TSB_PH[0],done=stg===4;
  const chips=B.list.map((x,q)=>`<button class="${q===i?'on':''} notr" dir="rtl" data-sbpick="${q}">${esc(x.t)}<small dir="ltr">${sbCount(q)}${x.n?' / '+x.n:''}</small></button>`).join('');
  setTimeout(()=>{const on=document.querySelector('.sbx-chips .on');if(on)on.scrollIntoView({inline:'center',block:'nearest'})},0);
  const beads=Array.from({length:33},(_,j)=>{const [x,y]=tsbBeadXY(j,k);return `<g class="tsb-bd" style="transform:translate(${x.toFixed(1)}px,${y.toFixed(1)}px)"><circle r="5.6" fill="${done?'#F6E2A8':P.bd}"/></g>`}).join('');
  const dust=Array.from({length:12},(_,q)=>`<i style="--x:${(q*37)%100}%;--d:${7+(q*5)%9}s;--s:${-(q*1.7).toFixed(1)}s;--z:${2+(q%3)*2}px"></i>`).join('');
  const panel=sbAdd?`<div class="sbx-panel"><label for="sbT">الذكر</label><input type="text" id="sbT" placeholder="مثال: سبحان الله وبحمده" dir="rtl">
     <label for="sbN">العدد المطلوب (اتركه 0 بلا حدّ)</label><input type="number" id="sbN" min="0" value="100" inputmode="numeric">
     <div class="btns"><button class="btn ok" data-sbsave="1">أضف</button><button class="btn" data-sbcancel="1">تراجع</button></div></div>`
   :sbZero?`<div class="sbx-panel"><p>تصفير كل عدّادات السبحة لهذا اليوم والبدء من الذكر الأول؟</p><div class="btns"><button class="btn slip" data-sbzeroyes="1">نعم، ابدأ من 0</button><button class="btn" data-sbzerono="1">تراجع</button></div></div>`
   :sbReset?`<div class="sbx-panel"><p><span>تصفير عدّاد</span> «<span class="notr">${esc(d.t)}</span>» <span>لهذا اليوم؟</span></p><div class="btns"><button class="btn slip" data-sbresetyes="1">نعم، صفّره</button><button class="btn" data-sbresetno="1">تراجع</button></div></div>`
   :sbEdit?`<div class="sbx-panel sbx-list">${B.list.map((x,q)=>`<div class="sb-row"><span class="notr" dir="rtl">${esc(x.t)}</span><small>${sbCount(q)} / ${x.n||'∞'}</small><button class="btn small" data-sbrz="${q}"${sbCount(q)?'':' disabled'}>إعادة</button><button class="btn small" data-sbup="${q}"${q?'':' disabled'} aria-label="تقديم">▲</button><button class="btn small dl-del" data-sbdel="${q}" aria-label="حذف"${B.list.length>1?'':' disabled'}>حذف</button></div>`).join('')}<div class="btns"><button class="btn small ok" data-sbedit="1">تمّ</button></div></div>`:'';
  return `<section class="tsb sbx ph${(stg-1)%3}${done?' done':''}" id="sbx">
   <div class="tsb-bg"><div class="tsb-kb"><img class="tsb-img" id="tsbImg" src="${tsbImg(stg===4?4:stg-1)}" alt="" style="transform:${tsbZoom(sbZoomK(d,c))}"></div><div class="tsb-dust">${dust}</div>${done?'<div class="tsb-glow"></div>':''}</div>
   <div class="tsb-top"><button class="tsb-x" data-back="h_ibadat" aria-label="رجوع">✕</button><span class="tsb-src" id="sbTotL"><span>المجموع اليوم</span> <b id="sbTot">${sbTotal()}</b></span><button class="tsb-x" dir="ltr" data-sbundo="1" aria-label="تراجع واحدة"${c?'':' disabled'}>−1</button><button class="tsb-x" data-sbmore="1" aria-label="${esc(Tx('المزيد'))}">⋯</button></div>
   <div class="sbx-chips">${chips}</div>
   <div class="tsb-head"><h2 class="tsb-t sbx-t notr" lang="ar" dir="rtl">${esc(d.t)}</h2>
    <p class="tsb-c" dir="ltr"><strong id="sbNum">${c}</strong><small id="sbOf">${d.n?'/ '+d.n:''}</small><button class="sbx-rz" data-sbreset="1" aria-label="${esc(Tx('إعادة هذا الذكر من 0'))}"${c?'':' disabled'}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4"/></svg></button></p>
    ${d.n?`<div class="tsb-seg sbx-seg"><i class="cur"><b id="sbBar" style="width:${Math.min(c/d.n,1)*100}%"></b></i></div>`:''}</div>
   <svg class="tsb-sc" viewBox="0 0 360 140" aria-hidden="true"><line class="tsb-th" x1="-20" y1="130" x2="${(-20+TSB_L*Math.cos(TSB_A)).toFixed(0)}" y2="${(130-TSB_L*Math.sin(TSB_A)).toFixed(0)}"/><g id="tsbBeads">${beads}</g></svg>
   ${panel}<div class="tsb-sp"></div>
   ${done&&!panel?`<p class="sbx-done">${B.list.length>1?'<span>تمّ هذا الذكر</span> · <span>ننتقل إلى الذكر التالي</span>':'<span>تمّ هذا الذكر</span>'}</p>`:''}
   <p class="tsb-hint">المس الشاشة في أي مكان لكل تسبيحة</p>
  </section>`}
function sbMore(){const r=(a,t)=>`<button class="h2-row" ${a} data-bsx="1"><span class="tx">${t}</span></button>`;
  sheetOpen(`<div class="bs-top"><h2>السبحة</h2><button class="qa-ed" data-bsx="1">إغلاق</button></div><div class="box h2-more">${r('data-sbadd="1"','أضف ذكرًا')}${r('data-sbedit="1"','كل الأذكار: إعادة أو ترتيب أو حذف')}${r('data-sbreset="1"','تصفير هذا الذكر')}${r('data-sbzero="1"','ابدأ كل الأذكار من 0')}</div><p class="meta" style="margin:10px 4px 0">المس الدائرة لكل تسبيحة. عند بلوغ العدد يصدر تنبيه وتنتقل إلى الذكر التالي.</p>`)}
function sbTick(){const B=sb(),i=B.cur,d=B.list[i];if(!d)return;const T=B.day[TODAY],st0=sbStage(d,T[i]||0);T[i]=(T[i]||0)+1;save();
  const c=T[i];try{navigator.vibrate&&navigator.vibrate(d.n&&c===d.n?[120,60,120]:c%33===0?[60,40,60]:10)}catch(e){}
  if(d.n&&c===d.n){sndPlay('step',()=>bell([784,988],.28,1.4,.35));if(B.list.length>1){render();setTimeout(()=>{if(screen!=='subha'||B.cur!==i)return;B.cur=(i+1)%B.list.length;save();render()},1600);return}}
  if(sbStage(d,c)!==st0){render();return}
  const num=document.getElementById('sbNum'),tot=document.getElementById('sbTot');if(num)num.textContent=c;if(tot)tot.textContent=sbTotal();
  const bar=document.getElementById('sbBar');if(bar&&d.n)bar.style.width=Math.min(c/d.n,1)*100+'%';
  const k=c%33===0&&c>0?33:c%33;document.querySelectorAll('#tsbBeads .tsb-bd').forEach((b,j)=>{const [x,y]=tsbBeadXY(j,k);b.style.transform=`translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`});
  const im=document.getElementById('tsbImg');if(im)im.style.transform=tsbZoom(sbZoomK(d,c));
  const bg=document.querySelector('#sbx .tsb-bg');if(bg){bg.classList.remove('step');void bg.offsetWidth;bg.classList.add('step')}
  const un=document.querySelector('#sbx [data-sbundo]');if(un)un.disabled=false;const rz=document.querySelector('#sbx .sbx-rz');if(rz)rz.disabled=false;
  const ch=document.querySelector('[data-sbpick="'+i+'"] small');if(ch)ch.textContent=c+(d.n?' / '+d.n:'')}
document.addEventListener('click',e=>{if(screen!=='subha')return;const f=e.target.closest('#sbx');if(!f)return;
  if(e.target.closest('button,a,input,label,.sbx-panel,.sbx-chips'))return;e.stopPropagation();sndInit();sbTick()},true);
