/* ---------- screens: wudu / salat step by step, like the umrah guide ---------- */
function viewGuide(k){const G=(GUIDES[k][LANG]||GUIDES[k].ar),n=G.steps.length;S.gStep=S.gStep||{};const i=Math.max(0,Math.min(n-1,S.gStep[k]||0)),x=G.steps[i],dir=LANG==='ar'||LANG==='ur'?'rtl':'ltr';
  return `<section class="um gd">
   <div class="um-dots" role="tablist">${G.steps.map((s,j)=>`<button class="${j===i?'on':j<i?'past':''}" role="tab" aria-selected="${j===i}" data-gstep="${k}:${j}" aria-label="${j+1}">${j+1}</button>`).join('')}</div>
   <article class="um-card gd-card">${ilSvg((k==='wudu'?'w':'s')+(i+1))}
    <div class="um-b tts-s"><p class="um-k nosay"><span>الخطوة</span> <span dir="ltr">${i+1} / ${n}</span></p><h3 class="notr" dir="${dir}">${x[0]}</h3><p class="notr gd-t" dir="${dir}">${x[1]}</p></div></article>
   <div class="msh-nav"><button class="btn" data-gstep="${k}:${i-1}"${i?'':' disabled'}>السابق</button>${ttsBtn('استمع')}${i<n-1?`<button class="btn ok" data-gstep="${k}:${i+1}">التالي</button>`:`<button class="btn ok" data-gstep="${k}:0">من البداية</button>`}</div>
   <details class="box pad gd-sum"><summary>${G.sum[0]}</summary><p class="notr" dir="${dir}">${G.sum[1]}</p></details>
   <p class="meta">على مذهب الإمام مالك. راجع التفاصيل مع شيخك.</p></section>`}

