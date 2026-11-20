/* ---------- screen: me ---------- */
/* «أنا»: each main group folds its rows away; a tap opens it (remembered for the session) */
const meOpen=new Set();
const meG=(k,t,sub)=>`<details class="me-g" data-meg="${k}"${meOpen.has(k)?' open':''}><summary class="me-gs"><span class="me-gt"><b>${t}</b><small>${sub.map(x=>`<span>${x}</span>`).join(LANG==='ar'||LANG==='ur'?'، ':', ')}</small></span><svg class="me-gc" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></summary>`;
document.addEventListener('toggle',e=>{const d=e.target;if(d.classList&&d.classList.contains('me-g'))d.open?meOpen.add(d.dataset.meg):meOpen.delete(d.dataset.meg)},true);
function viewMe(){const u=AUTH.user,ex=S.amEx&&AMRAD.ar[S.amEx.id]?S.amEx:null,A=AMRAD[LANG]||AMRAD.ar;
  const row=(go,t,ic,extra)=>`<button class="h2-row me-row" ${go}><span class="h2-ri"><svg viewBox="0 0 24 24" aria-hidden="true">${ic}</svg></span><span class="h2-rt"><b>${t}</b></span>${extra||''}<svg class="h2-chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg></button>`;
  const exc=ex?`<section class="box am-my"><div>${ilSvg(ex.id,'am-th')}</div><div><small>تمرينك هذا الأسبوع</small><b class="notr" ${LANG==='ar'||LANG==='ur'?'dir="rtl"':'dir="ltr"'}>${A[ex.id][4]}</b>${(ex.done||{})[TODAY]?'<span class="logged">فعلته اليوم ✓</span>':'<button class="btn ok small" data-amdone="1">فعلته اليوم</button>'}</div></section>`:'';
  return `<section class="me-hd"><button class="avatar big" data-go="profile" aria-label="الإعدادات">${avatarImg()}</button><div><h2>${esc(S.name||'')}</h2><p class="muted notr">${esc(cityName(S.loc))}</p></div></section>
   ${treeCard()}
   ${meG('ruh','مساحتي الروحية',['بياناتك الروحية','محاسبة الليلة','عيوبك','مداومتك','مستواك في الأعمال'])}<div class="box h2-more me-list">
    ${row('data-go="ruhi"','بياناتك الروحية','<path d="M12 20s-8-4.8-8-10.5A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 8 2.5C20 15.2 12 20 12 20z"/>')}
    ${row('data-go="muhasaba"','محاسبة الليلة','<path d="M12 3a7 7 0 1 0 7 9 5.5 5.5 0 0 1-7-9z"/>')}
    ${row('data-go="uyub"','اعرف عيوبك وعالجها','<ellipse cx="12" cy="10" rx="6" ry="7"/><path d="M12 17v4M9 21h6"/>')}
    ${row('data-go="ijtihad"','التقرير الأسبوعي: مرآة أعمالك','<path d="M5 19V13M10 19V9M15 19V11M20 19V5"/>')}
   </div><div class="me-ins">${amInsights(ptDay())}</div></details>
   <div class="box h2-more me-list">${row('data-go="profile"','الإعدادات','<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>',`<small class="me-x">${Tx('الحساب، اللغة، المدينة، التذكيرات')}</small>`)}</div>
   ${meG('help','المساعدة',['البحث','دليل الاستعمال','الخصوصية','التواصل'])}<div class="box h2-more me-list">
    ${row('data-go="search"','البحث في التطبيق','<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>')}
    ${row('data-go="about"','عن التطبيق ودليل الاستعمال','<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>')}
    ${row('data-go="about" data-openacc="privacy"','الخصوصية','<path d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6z"/>')}
    ${row('data-go="about" data-openacc="contact"','التواصل والدعم','<path d="M4 5h16v11H8l-4 4z"/>')}
    ${isAdmin()?row('data-go="admin"','لوحة الإدارة','<path d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6z"/>'):''}
   </div></details>
`}

