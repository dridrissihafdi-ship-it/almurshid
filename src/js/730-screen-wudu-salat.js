/* ---------- screens: wudu / salat step by step, like the umrah guide ---------- */
function viewGuide(k){const G=(GUIDES[k][LANG]||GUIDES[k].ar),n=G.steps.length;S.gStep=S.gStep||{};const i=Math.max(0,Math.min(n-1,S.gStep[k]||0)),x=G.steps[i],dir=LANG==='ar'||LANG==='ur'?'rtl':'ltr';
  const H=k==='salat'?(SLH[LANG]||SLH.ar):null,tb=H?(S.slTab||'prep'):'steps';
  const tabs=H?`<div class="rtabs sl-tabs" role="tablist">${['prep','steps','after','lv'].map((t,j)=>`<button role="tab" class="notr ${tb===t?'on':''}" aria-selected="${tb===t}" data-sltab="${t}" dir="${dir}">${H.tabs[j]}</button>`).join('')}</div>`:'';
  const card=(t,b,ex)=>`<article class="box pad sl-c tts-s"><h3 class="notr" dir="${dir}">${t}</h3><p class="notr" dir="${dir}">${b}</p>${ex||''}</article>`;
  const src=H?`<p class="meta notr sl-src" dir="${dir}">${H.src}</p>`:'';
  if(H&&tb==='prep')return `<section class="um gd sl">${tabs}<p class="sl-lead notr" dir="${dir}">${H.prepLead}</p>
   ${H.prep.map((p,j)=>card(`<span class="sl-n">${j+1}</span>${p[0]}`,p[1],j===2?`<div class="sl-nur"><b class="notr" dir="${dir}">${H.nurT}</b><p class="notr ar-q" dir="rtl" lang="ar">${SLH_NUR}</p>${H.nurM?`<p class="notr sl-m" dir="${dir}">${H.nurM}</p>`:''}</div>`:'')).join('')}
   <div class="msh-nav"><button class="btn ok notr" data-sltab="steps" dir="${dir}">${H.tabs[1]}</button></div>${src}</section>`;
  if(H&&tb==='after')return `<section class="um gd sl">${tabs}${H.after.map(p=>card(p[0],p[1])).join('')}${src}</section>`;
  if(H&&tb==='lv')return `<section class="um gd sl">${tabs}<p class="sl-lead notr" dir="${dir}">${H.lvLead}</p>
   <ol class="sl-lv">${H.lv.map((l,j)=>`<li class="box pad"><p class="sl-k notr" dir="${dir}">${H.lvN} ${j?j:H.lvPre}</p><h3 class="notr" dir="${dir}">${l[0]}</h3><p class="notr" dir="${dir}">${l[1]}</p>${l[2]?`<p class="sl-sj notr" dir="${dir}">${l[2]}</p>`:''}</li>`).join('')}</ol>${src}</section>`;
  const hz=H&&H.heart[i]?`<div class="box pad sl-heart tts-s"><b class="notr" dir="${dir}">${H.heartT}</b><p class="notr" dir="${dir}">${H.heart[i]}</p></div>`:'';
  return `<section class="um gd${H?' sl':''}">${tabs}
   <div class="um-dots" role="tablist">${G.steps.map((s,j)=>`<button class="${j===i?'on':j<i?'past':''}" role="tab" aria-selected="${j===i}" data-gstep="${k}:${j}" aria-label="${j+1}">${j+1}</button>`).join('')}</div>
   <article class="um-card gd-card">${ilSvg((k==='wudu'?'w':'s')+(i+1))}
    <div class="um-b tts-s"><p class="um-k nosay"><span>الخطوة</span> <span dir="ltr">${i+1} / ${n}</span></p><h3 class="notr" dir="${dir}">${x[0]}</h3><p class="notr gd-t" dir="${dir}">${x[1]}</p></div></article>
   ${hz}
   <div class="msh-nav"><button class="btn" data-gstep="${k}:${i-1}"${i?'':' disabled'}>السابق</button>${ttsBtn('استمع')}${i<n-1?`<button class="btn ok" data-gstep="${k}:${i+1}">التالي</button>`:H?`<button class="btn ok notr" data-sltab="after" dir="${dir}">${H.tabs[2]}</button>`:`<button class="btn ok" data-gstep="${k}:0">من البداية</button>`}</div>
   ${H?`<details class="box pad sl-w"><summary class="notr" dir="${dir}">${H.wanderT}</summary><ul>${H.wander.map(w=>`<li class="notr" dir="${dir}">${w}</li>`).join('')}</ul></details>`:''}
   <details class="box pad gd-sum"><summary>${G.sum[0]}</summary><p class="notr" dir="${dir}">${G.sum[1]}</p></details>
   <p class="meta">على مذهب الإمام مالك. راجع التفاصيل مع شيخك.</p>${src}</section>`}
