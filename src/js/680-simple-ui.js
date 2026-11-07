/* ================= simplified, picture-first interface ================= */
const SIMPLE=()=>S.ui!=='classic';
const NAV_CLASSIC=(document.querySelector('nav.tabs .in')||{}).innerHTML||'';
const NAV_SIMPLE=`<button data-nav="home" aria-label="اليوم"><svg viewBox="0 0 24 24"><circle class="f" cx="12" cy="12" r="4.2"/><circle cx="12" cy="12" r="4.2"/><path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7"/></svg><span>اليوم</span></button>
 <button data-nav="tariq" aria-label="الطريق"><svg viewBox="0 0 24 24"><path class="f" d="M3 19l6-12 4 7 3-4 5 9z"/><path d="M3 19l6-12 4 7 3-4 5 9zM2 19h20"/></svg><span>الطريق</span></button>
 <button data-nav="me" aria-label="أنا"><svg viewBox="0 0 24 24"><circle class="f" cx="12" cy="8.5" r="3.8"/><circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20.5c.8-4 3.8-6.3 7.5-6.3s6.7 2.3 7.5 6.3"/></svg><span>أنا</span></button>`;
function navSync(){const n=document.querySelector('nav.tabs .in');if(!n)return;const m=SIMPLE()?'s':'c';if(n.dataset.mode===m)return;n.dataset.mode=m;n.innerHTML=m==='s'?NAV_SIMPLE:NAV_CLASSIC}
function tabS(s){if(s==='home'||s.startsWith('adh_')||['aamal','dhikr_run','quran','mushaf','hifz','tasmi','qa'].includes(s))return 'home';
  if(['me','profile','ruhi','notif','about','admin','week','install','muraqabat','sura','tahlil','mraqib','munajat'].includes(s))return 'me';return 'tariq'}

/* picture tiles */
const SMT={maraka:'معركة اليوم',h_quran:'القرآن',h_ibadat:'عبادات',h_ruh:'الروحانيات',h_ilm:'العلم والصحبة',h_shurut:'جبل الشروط الأربعة',ahdaf:'جبل الأهداف الأربعة',mraqib:'مراقبات',munajat:'مناجاة',qiyama:'يوم القيامة',aqida:'العقيدة',fiqh:'الفقه',tawba:'التوبة',mujahada:'المجاهدة',hifz:'حفظ القرآن وتسميعه',tasmi:'التسميع',aamal:'أعمال اليوم',quran:'القرآن',khushu:'الخشوع',amrad:'أمراض القلب',qa:'سؤال وجواب',tazkiya:'التزكية',uyub:'اعرف عيوبك وعالجها',khalwa:'الخلوة والاعتكاف',method:'المنهج المحمدي',taammulat:'تأملات',majalis:'المجالس والدروس',ask:'اسأل الشيخ',tools:'أدوات السالك',umrah:'العمرة',wudu:'الوضوء',salat:'الصلاة',sira:'السيرة النبوية'};

/* the Path's sections ("tabs"): each opens a page of picture tiles */
const HUBS={h_quran:['quran','hifz'],h_ibadat:['aamal','wudu','salat','umrah'],h_ruh:['maraka','uyub','khushu','mraqib','munajat','khalwa'],
 h_ilm:['method','majalis','sira','qiyama','qa','ask'],h_shurut:['aqida','fiqh','tawba','mujahada']};
const IL_ALIAS={maraka:['m_climb'],h_quran:'quran',h_ibadat:'salat',h_ruh:'taammulat',h_ilm:'majalis',h_shurut:['c_aqida','m_climb'],ahdaf:['g4','m_mosque'],mraqib:'m_lamp',munajat:'m_heart',uyub:['uyub','amrad'],khalwa:['khalwa','m_lamp'],ghiba:'m_door',kadhib:'m_path',zann:'m_lamp',fudul:'m_tree',qiyama:'m_path',aqida:['c_aqida','m_tree'],fiqh:['c_fiqh','m_book'],tawba:'m_door',mujahada:'m_climb',hifz:'m_book',tasmi:'m_book'};
const viewHub=k=>()=>`<section>${smTiles(HUBS[k],HUBS[k].length%2?'odd':'')}</section>`;

/* Today's four tiles: the user can change or remove each one (long press), and fill an empty place with "+" */
const HT_ALL=['aamal','quran','tazkiya','qa','hifz','khushu','wudu','salat','umrah','method','majalis','sira','qiyama','ask','tools','h_shurut','ahdaf','mraqib','munajat','h_ibadat','h_ruh','h_ilm','uyub','muhasaba','maraka'];
function htGet(){if(!Array.isArray(S.homeT)||S.homeT.length!==4)S.homeT=['aamal','quran','tazkiya','qa'];const T=S.homeT,a=T.indexOf('amrad');if(a>=0)T[a]=T.includes('uyub')?null:'uyub';return T}
function homeTiles(){const T=htGet();return `<div class="sm-tiles ht">${T.map((id,i)=>id&&SMT[id]?`<button class="sm-tile" data-go="${id}" data-ht="${i}">${ilSvg(id)}<span>${SMT[id]}</span></button>`:`<button class="sm-tile ht-add" data-htadd="${i}" aria-label="${esc(Tx('أضف تبويبة'))}"><i>+</i><span>أضف تبويبة</span></button>`).join('')}</div><div class="ht-tip"><button class="ht-ed" data-htedit="1">تخصيص هذه البلاطات</button></div>`}
function htPick(i){const T=htGet();sheetOpen(`<div class="bs-top"><h2>اختر التبويبة</h2><button class="qa-ed" data-bsx="1">إلغاء</button></div><div class="sm-tiles c3 ht-pick">${HT_ALL.filter(id=>SMT[id]).map(id=>`<button class="sm-tile${T.includes(id)?' on':''}" data-htset="${i}" data-id="${id}">${ilSvg(id)}<span>${SMT[id]}</span></button>`).join('')}</div>`);i18nApply(document.getElementById('bsheet'))}
function htEdit(){const T=htGet();sheetOpen(`<div class="bs-top"><h2>تخصيص البلاطات</h2><button class="qa-ed" data-bsx="1">تمّ</button></div><p class="meta" style="margin:0 0 8px">اختر بلاطة لتغييرها، أو احذفها لتترك مكانها فارغًا. ويمكنك أيضًا الضغط مطولًا على أي بلاطة.</p><div class="box h2-more">${T.map((id,i)=>`<div class="ht-er"><span>${id&&SMT[id]?SMT[id]:Tx('مكان فارغ')}</span><button class="btn small" data-htchg="${i}">${id?Tx('تغيير'):Tx('أضف')}</button>${id?`<button class="btn small" data-htdel="${i}">${Tx('حذف')}</button>`:''}</div>`).join('')}</div>`)}
function htMenu(i){const id=htGet()[i];sheetOpen(`<div class="bs-top"><h2>${SMT[id]||''}</h2><button class="qa-ed" data-bsx="1">إلغاء</button></div><div class="box h2-more ht-menu"><button class="h2-row" data-htchg="${i}"><span class="tx">تغيير التبويبة</span></button><button class="h2-row" data-htdel="${i}"><span class="tx" style="color:var(--red)">حذف التبويبة</span></button></div>`);i18nApply(document.getElementById('bsheet'))}
let htLP=null,htSkip=false;
document.addEventListener('pointerdown',e=>{const t=e.target.closest&&e.target.closest('.sm-tile[data-ht]');if(!t)return;const i=+t.dataset.ht,x=e.clientX,y=e.clientY;clearTimeout(htLP);
  htLP=setTimeout(()=>{htSkip=true;try{navigator.vibrate&&navigator.vibrate(30)}catch(er){}htMenu(i)},550);
  const mv=ev=>{if(Math.abs(ev.clientX-x)>10||Math.abs(ev.clientY-y)>10)cl()},cl=()=>{clearTimeout(htLP);removeEventListener('pointermove',mv);removeEventListener('pointerup',cl);removeEventListener('pointercancel',cl)};
  addEventListener('pointermove',mv);addEventListener('pointerup',cl);addEventListener('pointercancel',cl)},{passive:true});
document.addEventListener('click',e=>{if(htSkip){htSkip=false;if(e.target.closest&&e.target.closest('.sm-tile[data-ht]')){e.preventDefault();e.stopPropagation()}}},true);
document.addEventListener('contextmenu',e=>{if(e.target.closest&&e.target.closest('.sm-tile[data-ht]'))e.preventDefault()});
const smGroup=(t,ids)=>`<h3 class="sm-gh">${t}</h3>${smTiles(ids,ids.length===3?'c3':'')}`;
const smTiles=(ids,cls)=>`<div class="sm-tiles ${cls||''}">${ids.map(id=>`<button class="sm-tile" data-go="${id}">${ilSvg(id)}<span>${SMT[id]}</span></button>`).join('')}</div>`;

