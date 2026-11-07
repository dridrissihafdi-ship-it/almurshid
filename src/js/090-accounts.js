/* ---------- accounts (Firebase) : classic side ---------- */
const ADMIN_EMAIL='dr.idrissi.hafdi@gmail.com';
let AUTH={state:'loading',user:null,mode:'in',err:'',info:'',busy:false};
let CONTENT={announcement:null,extra:[]};try{const c=JSON.parse(localStorage.getItem('murshid-content')||'null');if(c)CONTENT=Object.assign(CONTENT,c)}catch(e){}
let adminData={users:null,loading:false,msg:''};
const isAdmin=()=>!!(AUTH.user&&AUTH.user.email&&AUTH.user.email.toLowerCase()===ADMIN_EMAIL&&AUTH.user.emailVerified);
const gated=()=>AUTH.state==='loading'||AUTH.state==='out';
const AUTH_ERR={
 'auth/invalid-email':'صيغة البريد غير صحيحة.',
 'auth/missing-email':'اكتب بريدك الإلكتروني.',
 'auth/missing-password':'اكتب كلمة المرور.',
 'auth/weak-password':'كلمة المرور قصيرة: ستة أحرف على الأقل.',
 'auth/email-already-in-use':'هذا البريد مسجّل من قبل. ادخل بدل إنشاء حساب.',
 'auth/invalid-credential':'البريد أو كلمة المرور غير صحيحة.',
 'auth/wrong-password':'البريد أو كلمة المرور غير صحيحة.',
 'auth/user-not-found':'البريد أو كلمة المرور غير صحيحة.',
 'auth/too-many-requests':'محاولات كثيرة. انتظر قليلًا ثم أعد المحاولة.',
 'auth/network-request-failed':'لا يوجد اتصال بالإنترنت. تحقّق من الاتصال ثم أعد المحاولة.',
 'auth/popup-closed-by-user':'أُغلقت نافذة Google قبل إتمام الدخول.',
 'auth/popup-blocked':'منع المتصفح نافذة Google. سنحاول بطريقة أخرى.',
 'auth/requires-recent-login':'لأمانك، سجّل الخروج ثم ادخل من جديد، ثم أعد المحاولة.',
 'auth/unauthorized-domain':'هذا الرابط غير مسموح له بالدخول في إعدادات Firebase.',
 'auth/invalid-login-credentials':'البريد أو كلمة المرور غير صحيحة.',
 'auth/user-disabled':'هذا الحساب موقوف. راسل إدارة التطبيق.',
 'auth/operation-not-allowed':'طريقة الدخول هذه غير مفعّلة حاليًا. جرّب طريقة أخرى.',
 'auth/internal-error':'حدث خلل مؤقت في خدمة الحسابات. أعد المحاولة بعد قليل.',
 'auth/timeout':'انتهت مهلة الاتصال. تحقّق من الإنترنت ثم أعد المحاولة.',
 'auth/cancelled-popup-request':'أُلغيت نافذة الدخول. أعد المحاولة.',
 'auth/account-exists-with-different-credential':'هذا البريد مسجّل بطريقة دخول أخرى. ادخل بها، كالبريد وكلمة المرور.',
 'auth/expired-action-code':'انتهت صلاحية الرابط. اطلب رابطًا جديدًا.',
 'auth/invalid-action-code':'الرابط غير صالح أو استُعمل من قبل. اطلب رابطًا جديدًا.',
 'auth/quota-exceeded':'تجاوزت الخدمة حدّها اليوم. أعد المحاولة لاحقًا.'
};
const authErr=e=>AUTH_ERR[e&&e.code]||'تعذّر إتمام العملية. أعد المحاولة.';
function viewAuth(){
  const up=AUTH.mode==='up',reset=AUTH.mode==='reset';
  const langs=`<div class="langs" role="group" aria-label="اللغة">${LANGS.map(([c,l,n])=>`<button class="lang notr${c===LANG?' on':''}" data-lang="${c}" aria-pressed="${c===LANG}" title="${n}" lang="${c}">${l}</button>`).join('')}</div>`;
  if(AUTH.state==='loading')return `<section class="auth">${langs}<div class="auth-logo">${LOGO}</div><h1 class="auth-title">المرشد</h1><p class="auth-sub">جارٍ التحميل…</p></section>`;
  return `<section class="auth">${langs}
   <div class="auth-logo">${LOGO}</div><h1 class="auth-title">المرشد</h1><p class="auth-sub">دليلك نحو التزكية والقرب من الله</p>
   ${reset?'':`<ul class="auth-why"><li><b>أعمال يومك</b><span>صلواتك وأذكارك ووردك في قائمة واحدة، ومحاسبة قصيرة كل ليلة.</span></li><li><b>القرآن</b><span>مصحف برواية ورش، وحفظ وتسميع يسمع تلاوتك من حفظك.</span></li><li><b>التزكية</b><span>طريق متدرّج: الجوارح، ثم العقل، ثم القلب، مع معرفة عيوبك وعلاجها.</span></li></ul>
   <button class="btn ok big auth-try" data-guest="1">ابدأ الآن دون حساب</button>
   <p class="auth-note">الحساب اختياري: يحفظ تقدّمك ويجمعه بين أجهزتك. يمكنك إنشاؤه لاحقًا من «أنا» دون أن تفقد شيئًا.</p>`}
   ${reset?'':`<div class="auth-tabs" role="tablist"><button role="tab" aria-selected="${!up}" class="${up?'':'on'}" data-amode="in">تسجيل الدخول</button><button role="tab" aria-selected="${up}" class="${up?'on':''}" data-amode="up">حساب جديد</button></div>`}
   <form class="auth-form" id="authForm" novalidate>
    ${reset?'<h2 class="auth-h">استعادة كلمة المرور</h2><p class="muted">اكتب بريدك، وسنرسل إليه رابطًا لتعيين كلمة مرور جديدة.</p>':''}
    ${up?`<label for="a-name">الاسم</label><input id="a-name" type="text" autocomplete="name" placeholder="اسمك كما تحب أن يظهر">`:''}
    <label for="a-email">البريد الإلكتروني</label><input id="a-email" type="email" inputmode="email" autocomplete="email" dir="ltr" placeholder="name@gmail.com">
    ${reset?'':`<label for="a-pass">كلمة المرور</label><span class="pw-w" dir="ltr"><input id="a-pass" type="password" autocomplete="${up?'new-password':'current-password'}" dir="ltr" placeholder="••••••" minlength="6"><button type="button" class="pw-eye" data-pweye="a-pass" aria-label="إظهار كلمة المرور" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg></button></span>${up?'<small class="pw-req">ستة أحرف على الأقل.</small>':''}`}
    ${up?`<label for="a-pass2">تأكيد كلمة المرور</label><span class="pw-w" dir="ltr"><input id="a-pass2" type="password" autocomplete="new-password" dir="ltr" placeholder="••••••"><button type="button" class="pw-eye" data-pweye="a-pass2" aria-label="إظهار كلمة المرور" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg></button></span>`:''}
    ${AUTH.err?`<p class="auth-err" role="alert">${AUTH.err}</p>`:''}${AUTH.info?`<p class="auth-info" role="status">${AUTH.info}</p>`:''}
    <button class="btn ok big" type="submit" ${AUTH.busy?'disabled':''}>${reset?'أرسل رابط الاستعادة':up?'إنشاء الحساب':'دخول'}</button>
    ${reset?'<button class="btn link-btn" type="button" data-amode="in">رجوع إلى الدخول</button>':`<button class="btn link-btn" type="button" data-amode="reset">نسيت كلمة المرور؟</button>`}
   </form>
   ${reset?'':`<div class="auth-or"><span>أو</span></div><button class="btn big g-btn" data-google="1" ${AUTH.busy?'disabled':''}>${GLOGO}<span>الدخول بحساب Google</span></button>`}
   <p class="auth-privacy"><span>تُحفظ بياناتك وتقدّمك في حسابك على خوادم Google (Firebase)، ولا يطّلع عليها أحد غيرك، حتى إدارة التطبيق. تبقى ما دام حسابك قائمًا، وتُحذف كلها نهائيًا عند حذفه من «أنا».</span> ${up?'<span>بإنشاء الحساب فأنت توافق على</span> ':''}<a href="privacy.html" target="_blank" rel="noopener">سياسة الخصوصية وشروط الاستخدام</a>.</p>
  </section>`;
}
const LOGO='<svg viewBox="0 0 48 48" aria-hidden="true"><rect width="48" height="48" rx="12" fill="#265661"/><g transform="translate(11.04 3.68) scale(.2592)"><path d="M50,3 C53,11 60,16 68,24 C79,35 86,47 86,61 C86,77 72,87 69,99 C68,105 72,109 76,113 C83,119 86,127 86,137 C86,151 70,157 50,157 C30,157 14,151 14,137 C14,127 17,119 24,113 C28,109 32,105 31,99 C28,87 14,77 14,61 C14,47 21,35 32,24 C40,16 47,11 50,3 Z" fill="none" stroke="#f3d6a6" stroke-width="10" stroke-linejoin="round"/><path d="M50,3 C53,11 60,16 68,24 C79,35 86,47 86,61 C86,77 72,87 69,99 C68,105 72,109 76,113 C83,119 86,127 86,137 C86,151 70,157 50,157 C30,157 14,151 14,137 C14,127 17,119 24,113 C28,109 32,105 31,99 C28,87 14,77 14,61 C14,47 21,35 32,24 C40,16 47,11 50,3 Z" fill="none" stroke="#265661" stroke-width="4.4" stroke-linejoin="round"/><path transform="translate(36 54) scale(0.4261) translate(-24 -24)" d="M24 7l4.6 6.4 7.8-1.2-1.2 7.8L41.6 24l-6.4 4.6 1.2 7.8-7.8-1.2L24 41.6l-4.6-6.4-7.8 1.2 1.2-7.8L6.4 24l6.4-4.6-1.2-7.8 7.8 1.2z" fill="#f3d6a6"/><path transform="translate(64 54) scale(0.4261) translate(-24 -24)" d="M24 7l4.6 6.4 7.8-1.2-1.2 7.8L41.6 24l-6.4 4.6 1.2 7.8-7.8-1.2L24 41.6l-4.6-6.4-7.8 1.2 1.2-7.8L6.4 24l6.4-4.6-1.2-7.8 7.8 1.2z" fill="#f3d6a6"/><circle cx="36" cy="54" r="2.4" fill="#265661"/><circle cx="64" cy="54" r="2.4" fill="#265661"/></g></svg>';
const GLOGO='<svg viewBox="0 0 48 48" width="20" height="20" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>';
async function authSubmit(){
  const v=id=>(document.getElementById(id)||{}).value||'';
  const email=v('a-email').trim(),pass=v('a-pass'),pass2=v('a-pass2'),name=v('a-name').trim();
  AUTH.err='';AUTH.info='';
  if(!window.FB){AUTH.err='تعذّر الاتصال بخدمة الحسابات. تحقّق من الإنترنت ثم أعد فتح التطبيق.';return render()}
  if(AUTH.mode==='reset'){if(!email){AUTH.err='اكتب بريدك الإلكتروني.';return render()}
    AUTH.busy=true;render();try{await FB.reset(email);AUTH.info='أُرسل رابط الاستعادة إلى بريدك. افتحه ثم ارجع وادخل بكلمة المرور الجديدة.'}catch(e){AUTH.err=authErr(e)}AUTH.busy=false;return render()}
  if(AUTH.mode==='up'){
    if(!name){AUTH.err='اكتب اسمك.';return render()}
    if(pass.length<6){AUTH.err='كلمة المرور قصيرة: ستة أحرف على الأقل.';return render()}
    if(pass!==pass2){AUTH.err='كلمتا المرور غير متطابقتين.';return render()}
    pendingName=name;AUTH.busy=true;render();try{await FB.signUp(email,pass,name)}catch(e){AUTH.err=authErr(e);AUTH.busy=false;render()}return}
  if(AUTH.mode!=='up'&&email.toLowerCase()==='test'&&pass==='test')return testSignIn();
  AUTH.busy=true;render();try{await FB.signIn(email,pass)}catch(e){AUTH.err=authErr(e);AUTH.busy=false;render()}
}
/* shared trial account: "test" / "test" in the sign-in form maps to a real Firebase account (created on first use) */
const TEST_ACCT={email:'test.almurshid@example.com',pass:'murshid-test-2026'};
async function testSignIn(){AUTH.busy=true;render();
  try{await FB.signIn(TEST_ACCT.email,TEST_ACCT.pass)}
  catch(e){const c=(e&&e.code)||'';
    if(/user-not-found|invalid-credential|invalid-login/.test(c)){pendingName='حساب تجريبي';try{await FB.signUp(TEST_ACCT.email,TEST_ACCT.pass,'حساب تجريبي')}catch(e2){AUTH.err=authErr(e2);AUTH.busy=false;render()}}
    else{AUTH.err=authErr(e);AUTH.busy=false;render()}}}
async function googleSignIn(){if(!window.FB)return;AUTH.err='';AUTH.busy=true;render();
  try{await FB.google()}catch(e){AUTH.err=authErr(e);AUTH.busy=false;render()}}
/* called by the module when auth state changes */
let pendingName='';
const OWNER='murshid-owner';
const lsGet=k=>{try{return localStorage.getItem(k)}catch(e){return null}};
const lsSet=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
async function onAuthUser(u){
  const was=AUTH.state==='in';
  AUTH.user=u;AUTH.busy=false;
  if(!u){if(was){try{localStorage.removeItem(KEY);localStorage.removeItem(OWNER)}catch(e){}location.reload();return}
    AUTH.state=lsGet('murshid-guest')?'local':'out';return render()}
  try{localStorage.removeItem('murshid-guest')}catch(e){}
  const owner=lsGet(OWNER),nm=(u.displayName||pendingName||'').trim();
  let cloud=null,offline=false;
  try{cloud=await FB.loadProgress(u.uid)}catch(e){offline=true;console.warn('load',e)}
  if(!offline){
    if(cloud&&cloud.data){
      const localAt=owner===u.uid?(S.updatedAt||0):-1;
      if((cloud.updatedAt||0)>localAt){lsSet(KEY,cloud.data);lsSet(OWNER,u.uid);location.reload();return}
    }else if(owner!==u.uid){
      // first sign-in on this account: keep this device's own data if it is real (not demo, not another account)
      if(S.demo||owner){S=freshState(nm);S.lang=LANG}
    }
    lsSet(OWNER,u.uid);
    if(!S.name&&nm)S.name=nm;
    AUTH.state='in';save();cloudSaveNow();
  }else{
    if(owner&&owner!==u.uid){S=freshState(nm);S.lang=LANG}
    lsSet(OWNER,u.uid);AUTH.state='in';
  }
  pendingName='';
  FB.touchUser(u,S.name||nm,LANG).catch(e=>console.warn('user',e));setTimeout(inboxLoad,1500);setTimeout(ttFlush,4000);
  FB.loadContent().then(c=>{if(c){CONTENT=Object.assign({announcement:null,extra:[]},c);try{localStorage.setItem('murshid-content',JSON.stringify({ui:CONTENT.ui||null}))}catch(e){}edTheme();if(AUTH.state==='in')render()}}).catch(()=>{});
  render();
}
function onFbFail(){if(AUTH.state==='loading'){AUTH.state='local';render()}}
let cloudTimer=null;
function cloudSaveNow(){if(!window.FB||!AUTH.user||AUTH.state!=='in')return;clearTimeout(cloudTimer);
  FB.saveProgress(AUTH.user.uid,JSON.stringify(S),S.updatedAt||Date.now()).catch(e=>console.warn('save',e))}
function cloudSave(){if(!window.FB||!AUTH.user||AUTH.state!=='in')return;clearTimeout(cloudTimer);cloudTimer=setTimeout(cloudSaveNow,1500)}
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'&&cloudTimer)cloudSaveNow()});
/* admin */
async function adminTry(fn){
  try{return await fn()}catch(e){if(e.code!=='permission-denied')throw e}
  try{await FB.reloadUser()}catch(e){}
  try{return await fn()}catch(e){if(e.code==='permission-denied'){let c={};try{c=await FB.claims()}catch(x){}
    e.diag='البريد في الحساب: '+(c.email||'—')+' · مؤكَّد: '+(c.v?'نعم':'لا')+' · طريقة الدخول: '+(c.p||'—')}throw e}
}
/* time spent in the app: counted while the app is on screen, added to the account every minute */
const TT={acc:0,last:Date.now(),scr:{}};try{TT.acc=+localStorage.getItem('murshid-tt')||0;TT.scr=JSON.parse(localStorage.getItem('murshid-tts')||'{}')}catch(e){}
function ttTick(){const now=Date.now();if(document.visibilityState==='visible'&&TT.last){const dt=Math.min(now-TT.last,60000)/1000;TT.acc+=dt;const k=String(screen||'home');TT.scr[k]=(TT.scr[k]||0)+dt}TT.last=now;try{localStorage.setItem('murshid-tt',String(Math.round(TT.acc)));localStorage.setItem('murshid-tts',JSON.stringify(TT.scr))}catch(e){}if(TT.acc>=60)ttFlush()}
function ttFlush(){if(!AUTH.user||AUTH.state!=='in'||!window.FB||!FB.addTime||TT.acc<5)return;const sec=Math.round(TT.acc),sc={};Object.entries(TT.scr).forEach(([k,v])=>{if(Math.round(v)>0)sc[k]=Math.round(v)});TT.acc=0;TT.scr={};try{localStorage.setItem('murshid-tt','0');localStorage.setItem('murshid-tts','{}')}catch(e){}FB.addTime(AUTH.user.uid,sec,TODAY,sc).catch(()=>{TT.acc+=sec;Object.entries(sc).forEach(([k,v])=>TT.scr[k]=(TT.scr[k]||0)+v)})}
setInterval(ttTick,15000);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'){ttTick();ttFlush();TT.last=0}else TT.last=Date.now()});
/* private messages from the administration */
let INBOX=[];
async function inboxLoad(){if(!AUTH.user||!window.FB||!FB.inboxOf)return;try{INBOX=await FB.inboxOf(AUTH.user.uid);if(screen==='home')render()}catch(e){}}
function inboxCard(){const L=INBOX.filter(m=>!m.read);if(!L.length)return '';
  return L.map(m=>`<div class="box pad inbox-c"><small>✉️ <span>رسالة خاصة من الإدارة</span></small><p class="notr" dir="auto">${esc(m.text)}</p><div class="btns"><button class="btn small ok" data-inread="${esc(m.id)}">قرأتها ✓</button></div></div>`).join('')}
const fmtDur=x=>{x=Math.round((x||0)/60);if(x<60)return x+' '+Tx('د');return Math.floor(x/60)+' '+Tx('س')+(x%60?' '+(x%60)+' '+Tx('د'):'')};
async function adminLoad(){if(!isAdmin())return;adminData.loading=true;render();
  try{adminData.end=await FB.listEndorse()}catch(e){adminData.end=adminData.end||{}}try{adminData.users=await adminTry(()=>FB.listUsers());if(adminData.msg.startsWith('تعذّر'))adminData.msg=''}catch(e){adminData.users=adminData.users||[];adminData.msg='تعذّر جلب المستعملين: '+(e.code||e.message)+(e.diag?' — '+e.diag:'')}
  adminData.loading=false;if(screen==='admin')render()}
async function adminMsgsLoad(){try{adminData.msgs=await adminTry(()=>FB.listMessages())}catch(e){adminData.msgs=[];adminData.msg='تعذّر تحميل الرسائل: '+(e.code||e.message)}render()}
async function adminMsgDel(id){try{await adminTry(()=>FB.deleteMessage(id));adminData.msgs=(adminData.msgs||[]).filter(m=>m.id!==id)}catch(e){adminData.msg='تعذّر الحذف: '+(e.code||e.message)}render()}
function adminPush(){const t=(document.getElementById('ad-pt').value||'').trim(),b=(document.getElementById('ad-pb').value||'').trim();
  if(!t||!b){adminData.msg='اكتب عنوان الإشعار ونصه.';return render()}
  adminSave({push:{id:'p'+Date.now().toString(36),title:t,text:b,at:Date.now()}},'سُجّل الإشعار، وسيصل إلى الهواتف خلال دقائق.')}
let adU={open:null,inbox:{},q:''};
const uName=u=>u.aName||u.name||'';
const SCR_N={home:'اليوم',aamal:'الأعمال',tazkiya:'التزكية',quran:'القرآن',taammulat:'تأمّلات',profile:'الإعدادات',adh_sabah:'أذكار الصباح',adh_masa:'أذكار المساء',dhikr_run:'الذكر الشخصي',admin:'لوحة الإدارة'};
const scrName=k=>SCR_N[k]||(TITLES[k]&&TITLES[k].replace(/<[^>]+>/g,''))||(MENU.find(m=>m&&m.id===k)||{}).t||k;
function scrTop(m,n){const E=Object.entries(m||{}).filter(x=>x[1]>0).sort((a,b)=>b[1]-a[1]),tot=E.reduce((a,x)=>a+x[1],0)||1;
  return E.length?`<ol class="st-scr">${E.slice(0,n).map(([k,v])=>`<li><span>${esc(scrName(k))}</span><i><b style="width:${Math.max(3,Math.round(v/E[0][1]*100))}%"></b></i><small>${fmtDur(v)} · ${Math.round(v/tot*100)}%</small></li>`).join('')}</ol>`:'<p class="meta">لم تُسجَّل بيانات بعد.</p>'}
function adUFilter(v){adU.q=v;const q=v.trim().toLowerCase();document.querySelectorAll('.ad-u').forEach(r=>{r.hidden=!!q&&!r.dataset.q.includes(q)});const n=document.getElementById('adUN');if(n)n.textContent=[...document.querySelectorAll('.ad-u')].filter(r=>!r.hidden).length}
function adUsersBlock(users,fmt){if(adminData.loading)return '<p class="muted" style="margin:0">جارٍ التحميل…</p>';
  const L=users.slice().sort((a,b)=>tsMs(b.lastSeen)-tsMs(a.lastSeen)),wk=new Date(Date.now()-6*864e5).toISOString().slice(0,10);
  const add=`<details class="ad-add"><summary>＋ أضف سالكًا باسمه وإيميله</summary><label for="au-n" class="muted">اسم السالك</label><input id="au-n" type="text" dir="auto"><label for="au-e" class="muted">الإيميل</label><input id="au-e" type="email" dir="ltr" placeholder="name@example.com"><p class="meta">يُنشأ له حساب، ويصله إيميل ليختار كلمة السر بنفسه.</p><div class="btns"><button class="btn ok" data-auadd="1">أضف السالك</button></div></details>`;
  if(!L.length)return add+'<p class="muted" style="margin:0">لا يوجد مستعملون بعد.</p>';
  return `${add}<label class="ad-search"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg><input type="search" placeholder="ابحث بالاسم أو الإيميل" value="${esc(adU.q)}" oninput="adUFilter(this.value)"></label><p class="meta"><span id="adUN">${L.length}</span> <span>سالك</span></p>
   <div class="ad-list">${L.map(u=>{const D=u.days||{},w=Object.keys(D).filter(k=>k>=wk).reduce((n,k)=>n+(D[k]||0),0),nd=Object.keys(D).length,op=adU.open===u.id,IB=adU.inbox[u.id];
    return `<details class="ad-u"${op?' open':''} data-uid="${esc(u.id)}" data-q="${esc((uName(u)+' '+(u.name||'')+' '+(u.email||'')).toLowerCase())}"${adU.q&&!(uName(u)+' '+(u.email||'')).toLowerCase().includes(adU.q.trim().toLowerCase())?' hidden':''}><summary><span class="ad-un"><b class="notr" dir="auto">${esc(uName(u)||'—')}</b><span class="notr" dir="ltr">${esc(u.email||'')}</span></span><small><span>آخر دخول</span>: <span class="notr">${fmt(u.lastSeen)}</span>${u.time?' · ⏱ '+fmtDur(u.time):''}</small></summary>
     <div class="ad-ub"><div class="ad-ug"><span><small>انضمّ</small><b class="notr">${fmt(u.createdAt)}</b></span><span><small>آخر دخول</small><b class="notr">${fmt(u.lastSeen)}</b></span><span><small>الوقت في التطبيق</small><b>${fmtDur(u.time)}</b></span><span><small>آخر 7 أيام</small><b>${fmtDur(w)}</b></span><span><small>أيام الاستعمال</small><b>${nd}</b></span><span><small>المعدّل اليومي</small><b>${fmtDur(nd?(u.time||0)/nd:0)}</b></span><span><small>اللغة</small><b class="notr">${esc(u.lang||'ar')}</b></span></div>
      <h4 class="st-h">التبويبات الأكثر استعمالًا</h4>${scrTop(u.scr,8)}
      <h4 class="st-h">تأكيد الشيخ لعلامات الأهداف الأربعة</h4><p class="meta">ما تؤكّده هنا يُحتسب للسالك في «مساري» ويتقدّم به على الخريطة.</p><div class="btns ad-end">${[['g1','التعظيم لأمر الله'],['g2','التعظيم لأمر رسول الله ﷺ'],['g3','الشفقة على الخلق'],['g4','الحضور مع الله']].map(([g,n])=>{const on=!!(((adminData.end||{})[u.id]||{})[g]);return `<button class="btn small${on?' ok':''}" data-auend="${esc(u.id)}" data-g="${g}">${on?'✓ ':''}${n}</button>`}).join('')}</div>
      <label class="muted" for="an-${esc(u.id)}">الاسم الظاهر عند الإدارة</label><div class="ad-inl"><input id="an-${esc(u.id)}" type="text" dir="auto" value="${esc(uName(u))}"><button class="btn small" data-auname="${esc(u.id)}">احفظ</button></div>
      <label class="muted" for="am-${esc(u.id)}">رسالة خاصة إلى هذا السالك</label><textarea id="am-${esc(u.id)}" rows="3" dir="auto" placeholder="تظهر له في أعلى الصفحة الرئيسية، ويصله إشعار إن فعّل الإشعارات"></textarea><div class="btns"><button class="btn small ok" data-aumsg="${esc(u.id)}">أرسل الرسالة</button><button class="btn small" data-auinbox="${esc(u.id)}">${IB?'تحديث الرسائل السابقة':'الرسائل السابقة'}</button></div>
      ${IB?(IB.length?`<ul class="ad-ib">${IB.map(m=>`<li><span class="notr" dir="auto">${esc(m.text)}</span><small><span class="notr">${fmt(m.createdAt)}</span> · ${m.read?'قرأها ✓':'لم يقرأها بعد'}</small><button class="btn small dl-del" data-auibdel="${esc(m.id)}" data-uid="${esc(u.id)}">حذف</button></li>`).join('')}</ul>`:'<p class="meta">لا توجد رسائل سابقة.</p>'):''}
      <div class="btns ad-del"><button class="btn small slip" data-audel="${esc(u.id)}">حذف البروفايل</button></div></div></details>`}).join('')}</div>`}
function adStatsBlock(users){if(adminData.loading)return '<p class="muted" style="margin:0">جارٍ التحميل…</p>';
  const now=Date.now(),day=k=>new Date(now-k*864e5).toISOString().slice(0,10),n=users.length,since=(t,d)=>tsMs(t)>now-d*864e5;
  const act=d=>users.filter(u=>since(u.lastSeen,d)).length,nw=d=>users.filter(u=>since(u.createdAt,d)).length;
  const tot=users.reduce((a,u)=>a+(u.time||0),0),withT=users.filter(u=>u.time>0).length;
  const days=Array.from({length:14},(_,i)=>day(13-i)),sum=days.map(k=>users.reduce((a,u)=>a+((u.days||{})[k]||0),0)),cnt=days.map(k=>users.filter(u=>((u.days||{})[k]||0)>0).length),mx=Math.max(1,...sum);
  const w7=sum.slice(7).reduce((a,b)=>a+b,0);
  const langs={};users.forEach(u=>{const l=u.lang||'ar';langs[l]=(langs[l]||0)+1});
  const top=users.filter(u=>u.time>0).sort((a,b)=>b.time-a.time).slice(0,5);
  const card=(t,v,sub)=>`<div class="st-c"><small>${t}</small><b>${v}</b>${sub?`<span>${sub}</span>`:''}</div>`;
  return `<div class="st-g">${card('عدد السالكين',n)}${card('نشطون اليوم',act(1))}${card('نشطون هذا الأسبوع',act(7))}${card('نشطون هذا الشهر',act(30))}${card('جدد هذا الأسبوع',nw(7))}${card('جدد هذا الشهر',nw(30))}${card('مجموع الوقت في التطبيق',fmtDur(tot))}${card('الوقت في آخر 7 أيام',fmtDur(w7))}${card('معدّل الوقت لكل سالك',fmtDur(withT?tot/withT:0))}</div>
   <h4 class="st-h">الاستعمال في آخر 14 يومًا</h4><div class="st-bars">${days.map((k,i)=>`<div class="st-b" title="${k}"><i style="height:${Math.round(sum[i]/mx*100)}%"></i><small>${+k.slice(8)}</small><em>${cnt[i]||''}</em></div>`).join('')}</div><p class="meta">طول العمود: مجموع الدقائق في ذلك اليوم · الرقم: عدد السالكين النشطين.</p>
   <h4 class="st-h">اللغات</h4><div class="st-l">${Object.entries(langs).sort((a,b)=>b[1]-a[1]).map(([l,c])=>`<span><b class="notr">${esc(l)}</b> ${c}</span>`).join('')}</div>
   <h4 class="st-h">التبويبات الأكثر استعمالًا عند كل السالكين</h4>${(()=>{const m={};users.forEach(u=>Object.entries(u.scr||{}).forEach(([k,v])=>m[k]=(m[k]||0)+v));return scrTop(m,10)})()}
   ${top.length?`<h4 class="st-h">الأكثر استعمالًا للتطبيق</h4><ol class="st-top">${top.map(u=>`<li><span class="notr" dir="auto">${esc(uName(u)||u.email||'—')}</span><b>${fmtDur(u.time)}</b></li>`).join('')}</ol>`:''}
   <p class="meta">يُحسب الوقت منذ هذا التحديث فقط، ولا يُحسب إلا والتطبيق ظاهر على الشاشة.</p>`}
function viewAdmin(){
  if(!isAdmin())return '<section class="box pad"><p class="muted">هذه الخانة خاصة بإدارة التطبيق.</p></section>';
  if(adminData.users===null&&!adminData.loading)setTimeout(adminLoad,0);
  if(adminData.msgs===undefined){adminData.msgs=null;setTimeout(adminMsgsLoad,0)}
  const A=CONTENT.announcement||{},X=CONTENT.extra||[],users=adminData.users||[],msgs=adminData.msgs||[];
  const fmt=t=>t&&t.toDate?t.toDate().toLocaleDateString(LOC[LANG],{day:'numeric',month:'short',year:'numeric'}):'—';
  const nU=adminData.loading?'…':users.length,nM=adminData.msgs===null?'…':msgs.length;
  const statsB=adStatsBlock(users);
  const usersB=adUsersBlock(users,fmt)+`
   <p class="meta">لا تظهر هنا تفاصيل التقدم الروحي للسالكين، فهي خاصة بكل واحد منهم.</p>
   <div class="btns"><button class="btn small" data-adminreload="1">تحديث القائمة</button></div>`;
  const msgsB=adminData.msgs===null?'<p class="muted" style="margin:0">جارٍ التحميل…</p>':msgs.length?`<div class="ad-list">${msgs.map(m=>`<div class="ad-row ad-msg"><div class="ad-mh"><b class="notr" dir="auto">${esc(m.name||'—')}</b><small>${fmt(m.createdAt)}</small></div><a class="notr" dir="ltr" href="mailto:${esc(m.email)}">${esc(m.email)}</a><p class="notr" dir="auto">${esc(m.text)}</p><div class="btns"><a class="btn small" href="mailto:${esc(m.email)}">ردّ بالبريد</a><button class="btn small dl-del" data-admsgdel="${esc(m.id)}">حذف</button></div></div>`).join('')}</div>`:'<p class="muted" style="margin:0">لا توجد رسائل بعد.</p>';
  const pushB=`<p class="muted" style="margin:0 0 6px">يصل إلى كل من فعّل التذكيرات، خلال 5 دقائق تقريبًا، حتى والتطبيق مغلق.</p>
   <label for="ad-pt" class="muted">عنوان الإشعار</label><input id="ad-pt" type="text" dir="auto" maxlength="60" placeholder="مثال: مجلس الذكر الليلة">
   <label for="ad-pb" class="muted">نص الإشعار</label><textarea id="ad-pb" dir="auto" maxlength="300" placeholder="مثال: نلتقي بعد صلاة العشاء إن شاء الله…"></textarea>
   <div class="btns"><button class="btn ok" data-adpush="1">أرسل الإشعار</button></div>
   ${CONTENT.push&&CONTENT.push.at?`<p class="meta"><span>آخر إشعار:</span> «<span class="notr" dir="auto">${esc(CONTENT.push.title||'')}</span>» · <span>${new Date(CONTENT.push.at).toLocaleString(LOC[LANG])}</span></p>`:''}`;
  const annB=`<label for="ad-msg" class="muted">تظهر في أعلى الصفحة الرئيسية لكل السالكين</label>
   <textarea id="ad-msg" dir="auto" placeholder="مثال: مجلس الذكر هذا الخميس بعد صلاة العشاء…">${esc(A.text||'')}</textarea>
   <div class="btns"><button class="btn ok" data-adpub="1">نشر الرسالة</button>${A.on?'<button class="btn small" data-adhide="1">إخفاء الرسالة</button>':''}</div>`;
  const extraB=`<p class="muted" style="margin:0 0 6px">تظهر في «الأعمال» لكل السالكين، ويؤكدها كل واحد منهم.</p>
   ${X.length?`<div class="ad-list">${X.map((x,i)=>`<div class="ad-row ad-x"><div><b class="notr" dir="auto">${esc(x.t)}</b>${x.s?`<small class="notr" dir="auto">${esc(x.s)}</small>`:''}</div><button class="btn small dl-del" data-adxdel="${i}">حذف</button></div>`).join('')}</div>`:'<p class="muted">لا توجد أعمال مقترحة.</p>'}
   <label for="ad-xt" class="muted">العمل</label><input id="ad-xt" type="text" dir="auto" placeholder="مثال: قراءة سورة يس">
   <label for="ad-xs" class="muted">وصف قصير (اختياري)</label><input id="ad-xs" type="text" dir="auto" placeholder="مثال: ليلة الجمعة">
   <div class="btns"><button class="btn ok" data-adxadd="1">أضف العمل</button></div>`;
  const updB='<p class="muted" style="margin:0">التعديلات في هذه اللوحة تصل إلى كل السالكين فورًا. أما تغيير التصميم أو إضافة خاصية جديدة فيكون برفع ملف index.html الجديد إلى مستودع GitHub.</p>';
  const tile=(n,l,k)=>`<button class="ad-tile" data-adopen="${k}"><b>${n}</b><span>${l}</span></button>`;
  return `<section class="ad-hero"><div class="ad-tiles">${tile(nU,'المستعملون','users')}${tile(nM,'الرسائل','msgs')}${tile(X.length,'الأعمال المقترحة','extra')}</div>
    ${adminData.msg?`<p class="logged" id="adMsgP" style="margin:12px 0 0">${esc(adminData.msg)}</p>`:''}</section>
   <p class="ab-g">السالكون</p>
   <div class="acc-card">${acc('ad-stats','list','إحصائيات السالكين',statsB,'')}${acc('ad-use','list','ما ينفع فعلًا: إحصاء مجهول',stBlock(),'')}${acc('ad-users','users','السالكون',usersB,String(nU))}${acc('ad-msgs','mail','رسائل السالكين',msgsB,String(nM))}${acc('ad-maj','list','المجالس والدروس المباشرة',adMajBlock(),String((CONTENT.majalis||[]).length))}${acc('ad-yt','list','قناة يوتيوب للبث المباشر',adYtBlock(),'')}${acc('ad-fb','list','صفحة فيسبوك للبث المباشر',adFbBlock(),'')}${acc('ad-rec','list','الدروس المسجّلة (يوتيوب)',adRecBlock(),String(recList().length))}${acc('ad-sal','list','مجلس الصلاة على النبي ﷺ',adSalBlock(),'')}</div>
   <p class="ab-g">التواصل مع السالكين</p>
   <div class="acc-card">${acc('ad-push','bell','إشعار على هواتف المستعملين',pushB)}${acc('ad-ann','megaphone','رسالة في الصفحة الرئيسية',annB,A.on?'منشورة':'غير منشورة')}</div>
   <p class="ab-g">المحتوى</p>
   <div class="acc-card">${acc('ad-edit','font','محرّر المحتوى والتصميم',edAdminBlock(),ED?'مفعّل':'')}${acc('ad-ser','list','السلاسل الصوتية والمرئية',adSerBlock(),String((CONTENT.series||[]).length))}${acc('ad-extra','list','أعمال مقترحة من الإدارة',extraB,String(X.length))}${acc('ad-upd','code','تحديث التطبيق نفسه',updB)}</div>`;
}

/* short action words become icons (label kept for screen readers and as a tooltip) */
const ICO_SVG=d=>`<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const ICO={'حذف':'<path d="M4 7h16M9 7V4.8c0-.4.4-.8.8-.8h4.4c.4 0 .8.4.8.8V7M6.5 7l.9 12.2c0 .5.5.8 1 .8h7.2c.5 0 .9-.3 1-.8L17.5 7M10 11v5.5M14 11v5.5"/>',
 'تعديل':'<path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17z"/><path d="M14 8l3 3"/>',
 'تحديث القائمة':'<path d="M20 12a8 8 0 1 1-2.4-5.7"/><path d="M20 4v5h-5"/>','تحديث':'<path d="M20 12a8 8 0 1 1-2.4-5.7"/><path d="M20 4v5h-5"/>',
 'افتح':'<path d="M9 6l6 6-6 6"/>','أضف إلى التقويم':'<rect x="4" y="5" width="16" height="15" rx="3"/><path d="M4 10h16M9 3v4M15 3v4M12 13v5M9.5 15.5h5"/>',
 'رابط المجلس':'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
 'إرجاع':'<path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/>','تراجع':'<path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/>',
 'إظهار':'<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>','إخفاء':'<path d="M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4M6.6 6.6A17 17 0 0 0 2 12s3.6 7 10 7a10 10 0 0 0 5.4-1.6"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
 'راجعتها':'<path d="M5 12.5l4.5 4.5L19 7.5"/>'};
function iconize(root){if(!root)return;root.querySelectorAll('button.btn,a.btn').forEach(b=>{if(b.dataset.ic||b.children.length)return;const k=b.textContent.trim(),d=ICO[k];if(!d)return;
  b.dataset.ic=1;if(!b.getAttribute('aria-label'))b.setAttribute('aria-label',k);b.title=k;b.innerHTML=ICO_SVG(d);b.classList.add('btn-ic')})}
