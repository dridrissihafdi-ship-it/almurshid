const QA_ALL=[
 {id:'roadmap',t:'الخريطة',ic:'n_roadmap'},{id:'path',t:'مساري',ic:'n_path'},{id:'tazkiya',t:'التزكية',ic:'n_tazkiya'},
 {id:'muhasaba',t:'المحاسبة',ic:'n_muhasaba'},
 {id:'aamal',t:'الأعمال',ic:'n_aamal'},{id:'quran',t:'المصحف',ic:'n_quran'},{id:'khushu',t:'الخشوع',ic:'n_khushu'},{id:'hifz',t:'الحفظ',ic:'n_hifz'},
 {id:'majalis',t:'المجالس',ic:'n_majalis'},{id:'salat',t:'الصلاة ﷺ',ic:'n_salat'},{id:'qibla',t:'القبلة',ic:'n_qibla'},{id:'duas',t:'السنن',ic:'n_duas'},{id:'method',t:'المنهج',ic:'n_method'},
 {id:'khalwa',t:'الخلوة',ic:'n_khalwa'},{id:'ruhi',t:'بياناتي',ic:'n_ruhi'},{id:'fatur',t:'عند الفتور',ic:'n_fatur'},{id:'tools',t:'الأدوات',ic:'n_tools'},
 {id:'profile',t:'حسابي',ic:'n_profile'},{id:'about',t:'عن التطبيق',ic:'n_about'},{id:'admin',t:'الإدارة',ic:'n_admin',adm:1}];
const QA_DEF=['roadmap','tazkiya','khushu','majalis','salat','qibla','duas','method','path'];
const qaSel=()=>(Array.isArray(S.quick)?S.quick:QA_DEF).filter(id=>QA_ALL.some(x=>x.id===id&&(!x.adm||isAdmin())));
const qaDot=id=>id==='majalis'?majUpcoming().some(m=>m.at-Date.now()<864e5):id==='salat'?SAL.on:false;
const qaBtn=x=>`<button class="qa-ic${x.id==='salat'&&SAL.on?' on':''}" data-qago="${x.id}"><i><svg viewBox="0 0 24 24" aria-hidden="true">${QI[x.ic]}</svg>${qaDot(x.id)?'<em></em>':''}</i><span>${x.t}</span></button>`;
function qaGrid(){const L=qaSel().map(id=>QA_ALL.find(x=>x.id===id));
  return `<div class="sh qa-sh"><h2>الوصول السريع</h2><button class="qa-ed" data-qaedit="1">تعديل</button></div><div class="qa-grid">${L.map(qaBtn).join('')}${L.length?'':'<button class="qa-ic" data-qaedit="1"><i><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></i><span>أضف</span></button>'}</div>`}
function qaGo(id){sheetClose();if(id==='madh'){setTimeout(madhOpen,240);return}if(id==='salat'){go('majalis');majTab=null;if(SAL.on)salStop();else salStart();render();return}if(id==='qalbruh'||id==='aql'||id==='muhasaba'||/^g\d$/.test(id))return go(id);go(id)}
function homeProg(){if(S.ikMode){const L=dayLog(),left=[];const P=amPick(L);if((L.prayers||[]).length<5)left.push(Tx('الصلوات'));P.aw.forEach(w=>{if(!L.awrad.includes(w)){const n={sabah:'أذكار الصباح',masa:'أذكار المساء',quran:'ورد القرآن',dhikr:'الذكر الشخصي'}[w];if(n)left.push(Tx(n))}});
  return `<div class="sh qa-sh"><h2>يومك</h2></div><button class="box pad hp-ik" data-go="aamal">${left.length?`<span>بقي:</span> <span class="notr">${left.join(RTL()?'، ':', ')}</span>`:'<span>أتممت أعمال اليوم، تقبّل الله منك</span>'}</button>`}const L=dayLog(),[dn,tot]=amProgress(L),lc=litCount();let pc=0;try{pc=pathPct(pathData())}catch(e){}
  const mini=(go,t,v,p,c)=>`<button class="hp-m" data-go="${go}"><small>${t}</small><b dir="ltr">${v}</b><i><b style="width:${Math.round(p)}%;background:${c}"></b></i></button>`;
  return `<div class="sh qa-sh"><h2>تقدّمي</h2></div><div class="hp">${mini('aamal','يومك',dn+' / '+tot,tot?dn/tot*100:0,'var(--gold)')}${mini('me','شجرتك',treeDays()+' / 30',treeDays()/30*100,'var(--green)')}${mini('path','مساري',Math.round(pc)+'%',pc,'#C9A6E8')}</div>`}
/* bottom sheets */
function sheetOpen(html,cls){let o=document.getElementById('bsheet');if(!o){o=document.createElement('div');o.id='bsheet';document.body.appendChild(o);
    o.addEventListener('click',e=>{if(e.target===o||e.target.closest('[data-bsx]')){sheetClose();return}const q=e.target.closest('[data-qat]');if(q){e.stopPropagation();qaToggle(q.dataset.qat);return}if(e.target.closest('[data-qareset]')){e.stopPropagation();S.quick=QA_DEF.slice();save();qaEditOpen(true);if(screen==='home')render()}})}
  o.className=cls||'';o.dir=RTL()?'rtl':'ltr';o.innerHTML=`<div class="bs"><i class="bs-grab" data-bsx="1"></i>${html}</div>`;i18nApply(o);o.hidden=false;requestAnimationFrame(()=>o.classList.add('on'))}
function sheetClose(){const o=document.getElementById('bsheet');if(!o||o.hidden)return;o.classList.remove('on');setTimeout(()=>{o.hidden=true},220)}
function moreOpen(){const sec=(t,ids)=>`<h3 class="bs-h">${t}</h3><div class="qa-grid">${ids.map(id=>QA_ALL.find(x=>x.id===id)).filter(x=>x&&(!x.adm||isAdmin())).map(qaBtn).join('')}</div>`;
  sheetOpen(`<div class="bs-top"><h2>المزيد</h2><button class="qa-ed" data-qaedit="1">تعديل الرئيسية</button></div>${sec('الأدوات',['tools','qibla','duas','hifz','fatur'])}${sec('الطريق',['roadmap','path','tazkiya','method'])}${sec('العبادة',['aamal','khushu','quran','khalwa','muhasaba'])}${sec('المجالس والتأمّل',['majalis','salat','h_ruh','ruhi'])}${sec('الحساب',['profile','about','admin'])}`)}
function qaEditOpen(keep){const sel=qaSel();sheetOpen(`<div class="bs-top"><h2>الوصول السريع</h2><button class="qa-ed" data-bsx="1">تمّ</button></div><p class="meta">اضغط على أيقونة لإضافتها إلى الصفحة الرئيسية أو إزالتها. تظهر بالترتيب الذي تختاره، حتى 12 أيقونة.</p>
   <div class="qa-grid qa-pick">${QA_ALL.filter(x=>!x.adm||isAdmin()).map(x=>{const k=sel.indexOf(x.id);return `<button class="qa-ic${k>=0?' sel':''}" data-qat="${x.id}"><i><svg viewBox="0 0 24 24" aria-hidden="true">${QI[x.ic]}</svg>${k>=0?`<em class="n">${k+1}</em>`:''}</i><span>${x.t}</span></button>`}).join('')}</div>
   <div class="btns" style="margin-top:14px"><button class="btn small" data-qareset="1">استعادة الاختيار الأول</button></div>`,'tall')}
function qaToggle(id){const L=qaSel().slice(),k=L.indexOf(id);if(k>=0)L.splice(k,1);else if(L.length<12)L.push(id);S.quick=L;save();qaEditOpen(true);if(screen==='home')render()}
