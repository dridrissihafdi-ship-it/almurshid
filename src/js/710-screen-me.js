/* ---------- screen: me ---------- */
/* «أنا»: each main group folds its rows away; a tap opens it (remembered for the session) */
const meOpen=new Set();
const meG=(k,t,sub)=>`<details class="me-g" data-meg="${k}"${meOpen.has(k)?' open':''}><summary class="me-gs"><span class="me-gt"><b>${t}</b><small>${sub.map(x=>`<span>${x}</span>`).join(LANG==='ar'||LANG==='ur'?'، ':', ')}</small></span><svg class="me-gc" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></summary>`;
document.addEventListener('toggle',e=>{const d=e.target;if(d.classList&&d.classList.contains('me-g'))d.open?meOpen.add(d.dataset.meg):meOpen.delete(d.dataset.meg)},true);
function viewMe(){const u=AUTH.user,ex=S.amEx&&AMRAD.ar[S.amEx.id]?S.amEx:null,A=AMRAD[LANG]||AMRAD.ar;
  const row=(go,t,ic,extra)=>`<button class="h2-row me-row" ${go}><span class="h2-ri"><svg viewBox="0 0 24 24" aria-hidden="true">${ic}</svg></span><span class="h2-rt"><b>${t}</b></span>${extra||''}<svg class="h2-chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg></button>`;
  const exc=ex?`<section class="box am-my"><div>${ilSvg(ex.id,'am-th')}</div><div><small>تمرينك هذا الأسبوع</small><b class="notr" ${LANG==='ar'||LANG==='ur'?'dir="rtl"':'dir="ltr"'}>${A[ex.id][4]}</b>${(ex.done||{})[TODAY]?'<span class="logged">فعلته اليوم ✓</span>':'<button class="btn ok small" data-amdone="1">فعلته اليوم</button>'}</div></section>`:'';
  return `<section class="me-hd"><button class="avatar big" data-go="profile" aria-label="الإعدادات">${avatarImg()}</button><div><h2>${esc(S.name||'')}</h2><p class="muted notr">${esc(cityName(S.loc))}</p></div></section>
   ${treeCard()}${qmCard()}
   ${meG('ruh','مساحتي الروحية',['مساري','محاسبة الليلة','تحليل زلّاتي','عيوبك','ما بقي من يومك'])}<div class="box h2-more me-list">
    ${row('data-go="path"','مساري: أين أنا في الطريق؟','<path d="M5 19c3-1 4-5 7-6s5 1 7-2 2-5 2-5"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="6" r="2"/>',`<small class="me-x" dir="ltr">${pathPct(pathData())}%</small>`)}
    ${row('data-go="muhasaba"','محاسبة الليلة','<path d="M12 3a7 7 0 1 0 7 9 5.5 5.5 0 0 1-7-9z"/>')}
    ${row('data-go="tahlil"','تحليل زلّاتي','<path d="M4 19h16M7 15l3-4 3 2 4-6"/>')}
    ${row('data-go="uyub"','اعرف عيوبك وعالجها','<ellipse cx="12" cy="10" rx="6" ry="7"/><path d="M12 17v4M9 21h6"/>')}
    ${row('data-go="notif"','ما بقي من يومك','<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 20a2 2 0 0 0 4 0"/>')}
   </div></details>
   ${meG('rep','تقاريري',['مرآة أعمالك','بياناتك الروحية','التقرير الأسبوعي'])}<div class="box h2-more me-list">
    ${row('data-go="ijtihad"','مرآة أعمالك','<path d="M5 19V13M10 19V9M15 19V11M20 19V5"/>')}
    ${row('data-go="ruhi"','بياناتك الروحية','<path d="M12 20s-8-4.8-8-10.5A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 8 2.5C20 15.2 12 20 12 20z"/>')}
    ${row('data-go="week"','التقرير الأسبوعي','<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>')}
   </div></details>
   ${meG('acc','حسابي',['الاسم والصورة','الحساب','النسخة الاحتياطية'])}<div class="box h2-more me-list">
    ${row('data-go="profile" data-openacc="pname"','الاسم والصورة','<circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-4 4.5-6 8-6s6.5 2 8 6"/>')}
    ${row('data-go="profile" data-openacc="account"',u&&u.email?'الحساب والبريد':'إنشاء حساب','<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 8l9 6 9-6"/>',u&&u.email?`<small class="me-x notr" dir="ltr">${esc(u.email.split('@')[0])}</small>`:'')}
    ${row('data-go="profile" data-openacc="backup"','النسخة الاحتياطية','<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>')}
   </div></details>
   ${meG('set','إعدادات التطبيق',['اللغة','المدينة','التذكيرات','الصوت والخط','دون إنترنت'])}<div class="box h2-more me-list">
    ${row('data-go="profile" data-openacc="lang"','اللغة','<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/>',`<small class="me-x notr">${(LANGS.find(x=>x[0]===LANG)||[0,0,''])[2]}</small>`)}
    ${row('data-go="profile" data-openacc="city"','المدينة ومواقيت الصلاة','<path d="M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11z"/><circle cx="12" cy="10" r="2.2"/>',`<small class="me-x notr">${esc(cityName(S.loc))}</small>`)}
    ${row('data-go="profile" data-openacc="push"','التذكيرات','<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 20a2 2 0 0 0 4 0"/>')}
    ${row('data-go="profile" data-openacc="voice"','الصوت وحجم الخط','<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 8.5a5 5 0 0 1 0 7"/>')}
    ${row('data-go="profile" data-openacc="offl"','العمل دون إنترنت','<path d="M3 9a14 14 0 0 1 18 0M6.5 12.5a9 9 0 0 1 11 0M10 16a4 4 0 0 1 4 0"/><circle cx="12" cy="19" r="1"/>')}
   </div></details>
   ${meG('help','المساعدة',['البحث','دليل الاستعمال','الخصوصية','التواصل'])}<div class="box h2-more me-list">
    ${row('data-go="search"','البحث في التطبيق','<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>')}
    ${row('data-go="about"','عن التطبيق ودليل الاستعمال','<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>')}
    ${row('data-go="about" data-openacc="privacy"','الخصوصية','<path d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6z"/>')}
    ${row('data-go="about" data-openacc="contact"','التواصل والدعم','<path d="M4 5h16v11H8l-4 4z"/>')}
    ${isAdmin()?row('data-go="admin"','لوحة الإدارة','<path d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6z"/>'):''}
   </div></details>
   <button class="me-ui" data-uimode="classic"><span>الواجهة الكلاسيكية</span><small>كل الأقسام كما كانت من قبل</small></button>`}

