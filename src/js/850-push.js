let photoMsg='',geoMsg='',pushMsg='',pushBusy=false;
const VAPID='BJUJCmPxkDUS3CbATinyVl07MtSU_E3bBQmv7zAwn2V4KWNmMM-YLGXZfBqsO_U0acQsL7a9ovHH-IMT0M1SMxM';
const isIOS=()=>/iPhone|iPad|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
function pushPrefs(){if(!S.push)S.push={enabled:false,on:{sabah:true,masa:true,muhasaba:true,hudur:false},bed:'22:00'};return S.push}
/* trainings of the purification stages still to be logged today (sent to the server for the evening reminder) */
function trPend(onlyToday){const out=[];try{
  activeOrgans().forEach(g=>{const o=S.organs[g.id];if(o.ready)return;if(!onlyToday||!o.today)out.push(Tx(g.name))});
  const one=(id,lbl)=>{const A=trS(id);if(!A.base||A.base>TODAY||A.done.length>=trN(id))return;const R=trSim(id);if(R.complete)return;if(!onlyToday||!R.today)out.push(lbl)};
  if(S.aqlT)one('aql',Tx('تزكية العقل')+' · '+Tx('المستوى')+' '+S.aqlT.lvl);
  AHD.forEach(a=>{if(S.ahd&&S.ahd[a.id])one(a.id,Tx('عهد')+' '+Tx(a.n)+' · '+Tx('الدرجة')+' '+S.ahd[a.id].lvl)})}catch(e){}return out}
function pushDoc(){const P=pushPrefs();let tz='Africa/Casablanca';try{tz=Intl.DateTimeFormat().resolvedOptions().timeZone||tz}catch(e){}
  return{tz,off:-new Date().getTimezoneOffset(),lat:LAT,lng:LNG,lang:LANG,on:P.on,tr:{d:TODAY,need:trPend(true),act:trPend(false)},bed:P.bed,hFrom:P.hFrom||'07:00',hTo:P.hTo||'22:00',kh:(S.khal||[]).filter(r=>khMs(r.e)>Date.now()-DAY).slice(-6).map(r=>({id:r.id,type:r.type,s:r.s,e:r.e,p:(r.p||[]).map(p=>({d:+p.d||0,t:p.t,x:String(p.x||'').slice(0,140)}))})),updatedAt:Date.now()}}
let pushT=0;document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'&&Date.now()-pushT>60000){pushT=Date.now();try{pushSync()}catch(e){}}});
function pushSync(){const P=pushPrefs();if(!P.enabled||!window.FB||!AUTH.user)return;FB.savePush(AUTH.user.uid,pushDoc()).catch(e=>console.warn('push',e))}
async function pushEnable(){pushMsg='';
  if(!window.FB||AUTH.state!=='in'){pushMsg='سجّل الدخول بحسابك أولًا لتفعيل التذكيرات.';return render()}
  if(!VAPID){pushMsg='التذكيرات قيد الإعداد من إدارة التطبيق. ستتوفر قريبًا.';return render()}
  if(!('Notification' in window)||!('serviceWorker' in navigator)){pushMsg=isIOS()?'على iPhone: ثبّت التطبيق على الشاشة أولًا، ثم افتحه من أيقونته وفعّل التذكيرات.':'هذا المتصفح لا يدعم الإشعارات. جرّب Chrome.';return render()}
  pushBusy=true;render();
  try{const perm=await Notification.requestPermission();
    if(perm!=='granted'){pushMsg='لم يُسمح بالإشعارات. اسمح بها من إعدادات الهاتف للتطبيق، ثم أعد المحاولة.';pushBusy=false;return render()}
    const token=await FB.enablePush(VAPID);
    await FB.savePush(AUTH.user.uid,Object.assign({token},pushDoc()));
    pushPrefs().enabled=true;save();pushMsg='فُعّلت التذكيرات على هذا الهاتف ✓'}
  catch(e){console.warn(e);pushMsg=e&&e.code==='push/unsupported'?(isIOS()?'على iPhone: ثبّت التطبيق على الشاشة أولًا، ثم افتحه من أيقونته وفعّل التذكيرات.':'هذا المتصفح لا يدعم الإشعارات. جرّب Chrome.'):'تعذّر تفعيل التذكيرات. أعد المحاولة.'+(e&&e.code?' ('+e.code+')':'')}
  pushBusy=false;render()}
async function pushDisable(){const P=pushPrefs();P.enabled=false;save();try{if(window.FB&&AUTH.user)await FB.deletePush(AUTH.user.uid)}catch(e){}pushMsg='أُوقفت التذكيرات.';render()}
setTimeout(()=>{try{pushSync()}catch(e){}},9000); // keep the phone's clock offset fresh on the server
async function pushTest(){if(notifPerm()!=='granted'){pushMsg=notifBlockedMsg();return render()}try{const reg=await navigator.serviceWorker.ready;await reg.showNotification('المرشد',{body:'هكذا ستصلك التذكيرات ✦',icon:'icon-192.png',tag:'murshid-test',lang:'ar',dir:'rtl'});pushMsg=''}catch(e){pushMsg='تعذّر عرض الإشعار على هذا الجهاز.'}render()}
const notifPerm=()=>{try{return 'Notification' in window?Notification.permission:'unsupported'}catch(e){return 'unsupported'}};
function notifBlockedMsg(){return notifPerm()==='denied'?'الإشعارات ممنوعة لهذا التطبيق. افتح إعدادات الهاتف ← الإشعارات ← المرشد، واسمح بها، ثم اضغط «فعّل التذكيرات من جديد».':'لم يُسمح بالإشعارات بعد لهذا التطبيق، وهذا يحدث بعد إعادة تثبيته. اضغط «فعّل التذكيرات من جديد».'}
async function hudurTest(){if(notifPerm()!=='granted'){pushMsg=notifBlockedMsg();return render()}
  // iPhone rejects image/vibrate/renotify (TypeError), so it gets the plain form that its own test already shows
  const base={body:'﴿وَهُوَ مَعَكُمْ أَيْنَمَا كُنتُمْ﴾',icon:'icon-192.png',tag:'murshid-hudur',lang:'ar',dir:'rtl',data:{url:'./#hudur'}};
  try{const reg=await navigator.serviceWorker.ready;
    await reg.showNotification('الحضور مع الله',isIOS()?base:Object.assign({badge:'icon-192.png',image:'maiya-wide.jpg',renotify:true,vibrate:[200,120,200]},base));
    pushMsg=''}catch(e){pushMsg='تعذّر عرض الإشعار على هذا الجهاز.'+(e&&e.name?' ('+e.name+(e.message?': '+e.message:'')+')':'')}render()}
function showHudur(){if(document.getElementById('hudurOv'))return;
  const o=document.createElement('div');o.id='hudurOv';o.setAttribute('role','dialog');o.setAttribute('aria-label','الحضور مع الله');
  o.innerHTML=`<img src="maiya.jpg" alt="الله"><p class="hv notr" dir="rtl" lang="ar">﴿وَهُوَ مَعَكُمْ أَيْنَمَا كُنتُمْ﴾</p>${meaning('maiya')}<p class="hs">توقّف لحظة، واستحضر أن الله معك الآن.</p><button class="btn primary" data-hudurclose="1">الحمد لله</button>`;
  document.body.appendChild(o);
  try{const a=new Audio('hudur.mp3');a.volume=.8;const p=a.play();if(p&&p.catch)p.catch(()=>{o.addEventListener('click',()=>{try{a.play()}catch(x){}},{once:true})})}catch(e){}
  o.addEventListener('click',e=>{if(e.target.closest('[data-hudurclose]'))o.remove()});
  try{i18nApply(o)}catch(e){}}
function hudurHash(){const h=location.hash;if(h==='#khalwa'){try{history.replaceState(null,'',location.pathname+location.search)}catch(e){}setTimeout(()=>go('khalwa'),200);return}if(h.startsWith('#qa=')){try{history.replaceState(null,'',location.pathname+location.search)}catch(e){}setTimeout(()=>openQA(h.slice(4)),250);return}if(h==='#khushu'){try{history.replaceState(null,'',location.pathname+location.search)}catch(e){}setTimeout(()=>{khTab='prep';khPr=null;go('khushu')},200);return}if(h==='#tadrib'){try{history.replaceState(null,'',location.pathname+location.search)}catch(e){}setTimeout(()=>{tzTab=null;go('tazkiya')},200);return}if(h==='#hudur'||h==='#muhasaba'){try{history.replaceState(null,'',location.pathname+location.search)}catch(e){}if(h==='#hudur')setTimeout(showHudur,300);else setTimeout(()=>go('muhasaba'),200)}}
hudurHash();window.addEventListener('hashchange',hudurHash);
if('serviceWorker' in navigator)navigator.serviceWorker.addEventListener('message',e=>{if(e.data&&e.data.t==='hudur')showHudur();if(e.data&&e.data.t==='go'&&VIEWS[e.data.s])go(e.data.s);if(e.data&&e.data.t==='qa')openQA(e.data.n)});
window.showHudur=showHudur;

function pushState(){const P=pushPrefs(),perm=notifPerm(),standalone=window.matchMedia&&matchMedia('(display-mode: standalone)').matches||navigator.standalone;
  if(perm==='unsupported'||!('serviceWorker' in navigator))return isIOS()&&!standalone?['ios','تحتاج تثبيت التطبيق على الشاشة: افتحه في Safari، ثم «مشاركة» ← «إضافة إلى الشاشة الرئيسية»، ثم افتحه من أيقونته.']:['no','هذا المتصفح لا يدعم التذكيرات.'];
  if(perm==='denied')return ['denied','ممنوعة من إعدادات الهاتف: افتح الإعدادات ← الإشعارات ← المرشد، واسمح بها.'];
  if(P.enabled&&perm==='granted')return ['on','مفعّلة على هذا الهاتف ✓'];
  if(P.enabled)return ['off','كانت مفعّلة ثم توقفت (بعد إعادة التثبيت مثلًا). فعّلها من جديد.'];
  return ['off','غير مفعّلة بعد.']}
function pushStateLine(){const [k,t]=pushState();return `<p class="push-st ${k}"><i></i><span>${t}</span></p>${k==='ios'?'<button class="btn small" data-iosguide="1" style="margin:0 0 10px">كيف أثبّته؟ خطوة بخطوة</button>':''}`}
function pushInvite(){if(AUTH.state!=='in'||S.pushAskNo||pushPrefs().enabled)return '';const [k]=pushState();if(k==='denied'||k==='no')return '';
  return `<div class="box pad push-inv"><b>ذكّرني في وقتها</b><p class="meta" style="margin:4px 0 8px">أذكار الصباح بعد الفجر، وأذكار المساء قبل المغرب، ومحاسبة قصيرة قبل النوم. تغيّرها متى شئت من «أنا».</p><div class="btns">${k==='ios'?'<button class="btn ok small" data-iosguide="1">كيف أفعّلها؟</button>':'<button class="btn ok small" data-pushon1="1">فعّل التذكيرات</button>'}<button class="btn small" data-pushno="1">لاحقًا</button></div></div>`}
function pushSection(){const P=pushPrefs(),fajr=hm(prayerTimes(new Date()).fajr),magh=hm(prayerTimes(new Date()).maghrib-0.25);
  const row=(k,t,sub,def=true)=>`<label class="wird" for="pu-${k}"><input type="checkbox" id="pu-${k}" data-pushon="${k}" ${(def?P.on[k]!==false:P.on[k]===true)?'checked':''}><span class="t">${t}<small>${sub}</small></span></label>`;
  return `<section id="pushSec"><div class="sh"><h2>التذكيرات على الهاتف</h2></div>${pushStateLine()}
   <p class="muted">تصلك على هاتفك حتى والتطبيق مغلق: أذكار الصباح بعد الفجر، وأذكار المساء قبل المغرب، والمحاسبة قبل النوم، والتذكير بالحضور مع الله كل ساعة إن فعّلته.</p>
   ${P.enabled?`<div class="box">${row('sabah','أذكار الصباح',`بعد الفجر بنحو 20 دقيقة · اليوم ${fajr}`)}${row('masa','أذكار المساء',`قبل المغرب بنحو 15 دقيقة · اليوم ${magh}`)}${row('muhasaba','محاسبة اليوم قبل النوم','في الوقت الذي تختاره')}${row('tadrib','تذكير تدريب التزكية','قبل وقت المحاسبة بساعة، إن لم تسجّل يومك في الجوارح أو العقل أو العهود')}${row('qa','سؤال وجواب','بعد الفجر بربع ساعة · وبعد العشاء بنصف ساعة')}${row('khushu','تهيّأ للقاء','قبل كل صلاة بنحو 10 دقائق',false)}${row('hudur','الحضور مع الله','تذكير بمعيّة الله كل ساعة، في الوقت الذي تحدّده',false)}</div>
   ${P.on.hudur===true?`<p class="muted" style="margin:12px 0 4px">وقت تذكير الحضور</p><div class="hud-rng"><label for="hFrom" class="muted">من الساعة</label><input type="time" id="hFrom" value="${esc(P.hFrom||'07:00')}" class="time-in" step="3600"><label for="hTo" class="muted">إلى الساعة</label><input type="time" id="hTo" value="${esc(P.hTo||'22:00')}" class="time-in" step="3600"></div>`:''}
   <label for="bedT" class="muted" style="display:block;margin-top:8px">وقت المحاسبة قبل النوم</label><input type="time" id="bedT" value="${esc(P.bed)}" class="time-in">
   <div class="btns">${notifPerm()!=='granted'?'<button class="btn primary" data-pushon1="1">فعّل التذكيرات من جديد</button>':''}<button class="btn small" data-pushtest="1">جرّب إشعارًا الآن</button><button class="btn small" data-hudurtest="1">جرّب تذكير الحضور</button><button class="btn small" data-pushoff="1">إيقاف التذكيرات</button></div>`
   :`<div class="btns"><button class="btn ok" data-pushon1="1" ${pushBusy?'disabled':''}>فعّل التذكيرات على هاتفي</button></div>${isIOS()&&!isStandalone()?'<p class="meta">على iPhone تعمل التذكيرات فقط إذا ثبّت التطبيق على الشاشة وفتحته من أيقونته.</p>':''}`}
   ${pushMsg?`<p class="meta">${esc(pushMsg)}</p>`:''}
   <p class="meta">قد يتأخر التذكير بضع دقائق عن وقته.</p></section>`}
function setLoc(L){L.at=Date.now();S.loc=L;applyLoc();save();pushSync();render()}
function geoLocate(){geoMsg='';if(!navigator.geolocation){geoMsg='لا يدعم هذا الجهاز تحديد الموقع. اختر مدينتك من القائمة.';return render()}
  geoMsg='جارٍ تحديد موقعك…';render();
  navigator.geolocation.getCurrentPosition(p=>{const lat=+p.coords.latitude.toFixed(4),lng=+p.coords.longitude.toFixed(4),n=nearestCity(lat,lng);
    const near=n.c&&n.km<60;geoMsg='';setLoc({lat,lng,ar:near?n.c[1]:'موقعي الحالي',lt:near?n.c[2]:'My location',auto:true})},
   e=>{geoMsg=e&&e.code===1?'لم يُسمح بالوصول إلى الموقع. اسمح به من إعدادات المتصفح، أو اختر مدينتك من القائمة.':'تعذّر تحديد الموقع. اختر مدينتك من القائمة.';render()},{enableHighAccuracy:false,timeout:15000,maximumAge:6e5})}
function setPhoto(file){photoMsg='';if(!file)return;if(!/^image\//.test(file.type)){photoMsg='اختر ملف صورة.';return render()}
  const url=URL.createObjectURL(file),im=new Image();
  im.onload=()=>{const z=256,c=document.createElement('canvas');c.width=c.height=z;const g=c.getContext('2d'),m=Math.min(im.width,im.height);
    g.drawImage(im,(im.width-m)/2,(im.height-m)/2,m,m,0,0,z,z);URL.revokeObjectURL(url);S.photo=c.toDataURL('image/jpeg',.85);save();render()};
  im.onerror=()=>{URL.revokeObjectURL(url);photoMsg='تعذّرت قراءة هذه الصورة. جرّب صورة أخرى.';render()};im.src=url}
document.addEventListener('submit',e=>{if(e.target.id==='authForm'){e.preventDefault();authSubmit()}});
/* search in سؤال وجواب: filters the cards in place, so typing is never interrupted */
