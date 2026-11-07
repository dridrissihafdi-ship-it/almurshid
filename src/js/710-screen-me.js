/* ---------- screen: me ---------- */
function viewMe(){const u=AUTH.user,ex=S.amEx&&AMRAD.ar[S.amEx.id]?S.amEx:null,A=AMRAD[LANG]||AMRAD.ar;
  const row=(go,t,ic,extra)=>`<button class="h2-row me-row" ${go}><span class="h2-ri"><svg viewBox="0 0 24 24" aria-hidden="true">${ic}</svg></span><span class="h2-rt"><b>${t}</b></span>${extra||''}<svg class="h2-chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg></button>`;
  const exc=ex?`<section class="box am-my"><div>${ilSvg(ex.id,'am-th')}</div><div><small>تمرينك هذا الأسبوع</small><b class="notr" ${LANG==='ar'||LANG==='ur'?'dir="rtl"':'dir="ltr"'}>${A[ex.id][4]}</b>${(ex.done||{})[TODAY]?'<span class="logged">فعلته اليوم ✓</span>':'<button class="btn ok small" data-amdone="1">فعلته اليوم</button>'}</div></section>`:'';
  return `<section class="me-hd"><button class="avatar big" data-go="profile" aria-label="الإعدادات">${avatarImg()}</button><div><h2>${esc(S.name||'')}</h2><p class="muted notr">${esc(cityName(S.loc))}</p></div></section>
   ${treeCard()}${qmCard()}
   <div class="sh me-sh"><h2>رحلتي</h2></div><div class="box h2-more me-list">
    ${row('data-go="path"','مساري: أين أنا في الطريق؟','<path d="M5 19c3-1 4-5 7-6s5 1 7-2 2-5 2-5"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="6" r="2"/>',`<small class="me-x" dir="ltr">${pathPct(pathData())}%</small>`)}
    ${row('data-go="uyub"','اعرف عيوبك وعالجها','<ellipse cx="12" cy="10" rx="6" ry="7"/><path d="M12 17v4M9 21h6"/>')}
    ${row('data-go="ruhi"','بياناتك الروحية','<path d="M12 20s-8-4.8-8-10.5A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 8 2.5C20 15.2 12 20 12 20z"/>')}
    ${row('data-go="ijtihad"','مرآة أعمالك','<path d="M5 19V13M10 19V9M15 19V11M20 19V5"/>')}
   </div>
   <div class="sh me-sh"><h2>التطبيق</h2></div><div class="box h2-more me-list">
    ${row('data-go="search"','البحث في التطبيق','<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>')}
    ${row('data-go="notif"','ما بقي من يومك','<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 20a2 2 0 0 0 4 0"/>')}
    ${row('data-go="profile"','الإعدادات','<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>')}
    ${row('data-go="about"','عن التطبيق','<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>')}
    ${isAdmin()?row('data-go="admin"','لوحة الإدارة','<path d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6z"/>'):''}
   </div>
   <button class="me-ui" data-uimode="classic"><span>الواجهة الكلاسيكية</span><small>كل الأقسام كما كانت من قبل</small></button>`}

