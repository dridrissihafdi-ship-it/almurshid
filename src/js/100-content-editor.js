/* ---------- content editor (admin): text overrides, hidden items and colours, kept in content/main → ui ---------- */
let ED=false,edMode='edit';
const UI=()=>CONTENT.ui||{};
const edNorm=s=>String(s).replace(/\s+/g,' ').trim();
const edHash=s=>{let h=5381;for(let i=0;i<s.length;i++)h=((h<<5)+h+s.charCodeAt(i))|0;return 'h'+(h>>>0).toString(36)+s.length.toString(36)};
const ED_NO='.verse,.tq,.adh.q,.ay,.bas,.sn,.msh-page,.au-mini,input,textarea,select,script,style,.ed-sheet,.ed-bar';
const ED_CARD='.h2-row,.h2-tile,.ad-tile,.tile,.mcard,.acc,.au-g,.au-row,.vd-row,.rm-g0,.rm-it>li,.adh-w,.wird,li,button,.box';
const ED_LANGS=[['en','English'],['fr','Français'],['es','Español'],['ru','Русский']];
function edApply(root){const U=UI(),T=U.t||{},H=U.hide||[];if(!root)return;
  const hasT=Object.keys(T).some(k=>T[k]);if(!hasT&&!H.length)return;
  const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];let n;while(n=w.nextNode())nodes.push(n);
  nodes.forEach(n=>{const v=n.nodeValue,k=edNorm(v);if(!k||!/[؀-ۿ]/.test(k))return;const el=n.parentElement;if(!el||el.closest('.ed-sheet,.ed-bar,script,style'))return;
    const h=edHash(k);
    if(H.includes(h)&&screen!=='admin'){const c=el.closest(ED_CARD);if(c&&c!==root&&!c.closest('nav.tabs')&&!c.matches('[data-go=admin]')&&!c.querySelector('[data-go=admin],[data-edon]'))c.classList.add(ED?'ed-ghost':'ed-hidden')}
    const o=T[h];if(!o)return;el.dataset.edk=k;const lead=v.match(/^\s*/)[0],trail=v.match(/\s*$/)[0];
    if(LANG==='ar'){if(o.ar)n.nodeValue=lead+o.ar+trail}else if(o[LANG]){n.nodeValue=lead+o[LANG]+trail}})}
const edCardOf=k=>{const w=document.createTreeWalker(document.getElementById('app'),NodeFilter.SHOW_TEXT);let t;while(t=w.nextNode()){if(edNorm(t.nodeValue)===k)return t.parentElement.closest(ED_CARD)}return null};
function edSaveUi(ui,msg){const U=Object.assign({},UI(),ui);CONTENT.ui=U;try{localStorage.setItem('murshid-content',JSON.stringify({ui:U}))}catch(e){}edTheme();
  adminSave({ui:U},msg).then(()=>{if(screen!=='admin')edToast(adminData.msg||msg)})}
function edToast(t){let el=document.getElementById('edToast');if(!el){el=document.createElement('div');el.id='edToast';el.className='ed-toast';document.body.appendChild(el)}
  el.textContent=t;el.classList.add('on');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('on'),2600)}
function edBar(){let b=document.getElementById('edBar');if(!(ED&&isAdmin())){if(b)b.remove();document.documentElement.classList.remove('ed-on');return}
  document.documentElement.classList.add('ed-on');
  if(!b){b=document.createElement('div');b.id='edBar';b.className='ed-bar';b.dir='rtl';document.body.appendChild(b);
    b.addEventListener('click',e=>{const t=e.target.closest('[data-edm]');if(!t)return;const m=t.dataset.edm;
      if(m==='off'){ED=false;render();return}edMode=m;edBar()})}
  b.innerHTML=`<span class="ed-dot"></span><b>${edMode==='edit'?'اضغط على أي نص لتعديله أو إخفائه':'تصفّح التطبيق، ثم ارجع إلى التعديل'}</b>
   <span class="ed-seg"><button data-edm="edit" class="${edMode==='edit'?'on':''}">تعديل</button><button data-edm="browse" class="${edMode==='browse'?'on':''}">تصفّح</button></span><button class="ed-x" data-edm="off">إنهاء</button>`}
document.addEventListener('click',e=>{if(!ED||edMode!=='edit'||!isAdmin())return;
  if(e.target.closest('.ed-sheet,.ed-bar,nav.tabs,.ed-toast'))return;
  e.preventDefault();e.stopPropagation();
  if(LANG!=='ar'){edToast('بدّل لغة التطبيق إلى العربية لتعديل النصوص.');return}
  let node=null;try{const r=document.caretRangeFromPoint&&document.caretRangeFromPoint(e.clientX,e.clientY);if(r&&r.startContainer&&r.startContainer.nodeType===3&&edNorm(r.startContainer.nodeValue))node=r.startContainer}catch(x){}
  if(!node){const w=document.createTreeWalker(e.target,NodeFilter.SHOW_TEXT);let t;while(t=w.nextNode()){if(/[؀-ۿ]/.test(t.nodeValue)){node=t;break}}}
  if(!node){edToast('لا يوجد نص هنا. اضغط على الكلمات نفسها.');return}
  const el=node.parentElement;if(el.closest(ED_NO)){edToast('هذا نص محمي (آيات القرآن أو نص يُكتب تلقائيًا)، فلا يُعدَّل من هنا.');return}
  const k=el.dataset.edk||edNorm(node.nodeValue);if(!/[؀-ۿ]/.test(k)){edToast('اضغط على نص عربي.');return}
  edOpen(k)},true);
function edOpen(k){if(!I18N_ALL){i18nLoadAll().then(()=>edOpen(k));return}const h=edHash(k),o=(UI().t||{})[h]||{},hid=(UI().hide||[]).includes(h),dyn=/[0-9٠-٩]/.test(k);
  const d0=I18N_D[k]||null,sh=document.createElement('div');sh.className='ed-sheet';sh.dir='rtl';
  sh.innerHTML=`<div class="ed-box"><div class="ed-hd"><b>تعديل النص</b><button class="ed-close" data-ed="close" aria-label="إغلاق">✕</button></div>
   <small class="ed-l">النص الأصلي</small><p class="ed-orig">${esc(k)}</p>
   ${dyn?'<p class="ed-warn">في هذا النص أرقام قد تتغيّر تلقائيًا (تاريخ، عدد، وقت)، فقد لا يثبت تعديله.</p>':''}
   <label class="ed-l" for="edAr">النص الجديد</label><textarea id="edAr" dir="rtl" rows="${Math.min(8,Math.max(2,Math.ceil(k.length/38)))}">${esc(o.ar||k)}</textarea>
   <details class="ed-tr"><summary>الترجمة في اللغات الأخرى (اختياري)</summary>${ED_LANGS.map(([c,n],i)=>`<label class="ed-l" for="edT-${c}">${n}</label><input id="edT-${c}" dir="${c==='ar'?'rtl':'ltr'}" value="${esc(o[c]||(d0?d0[i]:''))}">`).join('')}
    <p class="meta">إن تركتها كما هي تبقى الترجمة الأصلية.</p></details>
   <div class="ed-btns"><button class="btn ok" data-ed="save">حفظ للجميع</button>${o.ar||Object.keys(o).length?'<button class="btn" data-ed="reset">إرجاع الأصل</button>':''}
    <button class="btn ${hid?'':'ed-danger'}" data-ed="${hid?'show':'hide'}">${hid?'إظهار هذا العنصر':'إخفاء هذا العنصر'}</button></div>
   <p class="meta ed-note">التعديل يظهر عند كل السالكين بعد ثوانٍ. الإخفاء يُخفي البطاقة أو الزر الذي فيه هذا النص.</p></div>`;
  document.body.appendChild(sh);
  sh.addEventListener('click',e=>{const b=e.target.closest('[data-ed]');if(e.target===sh){sh.remove();return}if(!b)return;const a=b.dataset.ed,U=UI(),T=Object.assign({},U.t||{});let H=(U.hide||[]).slice();
    if(a==='close'){sh.remove();return}
    if(a==='save'){const ar=edNorm(sh.querySelector('#edAr').value);if(!ar){edToast('اكتب النص الجديد.');return}const ob={};if(ar!==k)ob.ar=ar;
      ED_LANGS.forEach(([c],i)=>{const v=edNorm(sh.querySelector('#edT-'+c).value);if(v&&v!==(d0?d0[i]:''))ob[c]=v});
      T[h]=Object.keys(ob).length?Object.assign(ob,{src:k,at:Date.now()}):null;sh.remove();edSaveUi({t:T},Object.keys(ob).length?'حُفظ التعديل.':'لا تغيير.');return}
    if(a==='reset'){T[h]=null;sh.remove();edSaveUi({t:T},'أُرجع النص الأصلي.');return}
    if(a==='hide'&&(screen==='admin'||document.querySelector('[data-go=admin]')&&edCardOf(k)&&edCardOf(k).matches('[data-go=admin]'))){edToast('لا يمكن إخفاء لوحة الإدارة.');return}
    if(a==='hide'){if(!H.includes(h))H.push(h);const L=Object.assign({},U.hideL||{});L[h]=k;sh.remove();edSaveUi({hide:H,hideL:L},'أُخفي العنصر عند الجميع.');return}
    if(a==='show'){H=H.filter(x=>x!==h);sh.remove();edSaveUi({hide:H},'أُظهر العنصر.');return}});
  setTimeout(()=>{const t=sh.querySelector('#edAr');if(t){t.focus();t.setSelectionRange(t.value.length,t.value.length)}},50)}
/* colours: swap the gold / copper accents in the stylesheet */
const ED_THEMES=[{id:'gold',n:'ذهبي (الأصل)',g:'#E6C891',c:'#8A5B3D'},{id:'emerald',n:'زمردي',g:'#9FD8B8',c:'#3E7A60'},{id:'sky',n:'سماوي',g:'#A9CDEB',c:'#466F93'},
 {id:'rose',n:'وردي عتيق',g:'#EBB2A6',c:'#94554A'},{id:'violet',n:'بنفسجي',g:'#CDB8F2',c:'#65539A'},{id:'sand',n:'رملي فاتح',g:'#F0DDB0',c:'#9A7A4E'}];
let ED_CSS0=null;
let ED_ST=null;
function edTheme(){const st=ED_ST||(ED_ST=[...document.querySelectorAll('style')].sort((x,y)=>y.textContent.length-x.textContent.length)[0]);if(!st)return;if(ED_CSS0===null)ED_CSS0=st.textContent;
  const T=UI().theme||{},th=ED_THEMES.find(x=>x.id===T.id)||ED_THEMES[0],L=+T.light||0;
  const rgb=x=>[1,3,5].map(i=>parseInt(x.slice(i,i+2),16)).join(',');
  let css=ED_CSS0;if(th.id!=='gold')css=css.replace(/#E6C891/gi,th.g).replace(/rgba\(230,\s*200,\s*145/g,'rgba('+rgb(th.g)).replace(/#8A5B3D/gi,th.c).replace(/rgba\(214,160,106/g,'rgba('+rgb(th.g));
  if(L)css+=`\nbody::after{filter:brightness(${(1+0.12*L).toFixed(2)})!important}body{filter:brightness(${(1+0.04*L).toFixed(2)})}`;
  if(st.textContent!==css)st.textContent=css}
function edAdminBlock(){const U=UI(),T=U.t||{},keys=Object.keys(T).filter(k=>T[k]),H=U.hide||[],HL=U.hideL||{},th=(U.theme||{}).id||'gold',L=+(U.theme||{}).light||0;
  return `<p class="muted" style="margin:0 0 10px">فعّل وضع التعديل، ثم تنقّل في التطبيق واضغط على أي نص لتغييره أو لإخفاء البطاقة التي فيه. التعديلات تصل إلى كل السالكين فورًا، دون رفع أي ملف.</p>
   <div class="btns"><button class="btn ok" data-edon="1">${ED?'وضع التعديل مفعّل':'تفعيل وضع التعديل'}</button></div>
   <h4 class="ed-h">الألوان</h4><div class="ed-th">${ED_THEMES.map(x=>`<button class="ed-sw${x.id===th?' on':''}" data-edth="${x.id}"><i style="background:${x.g}"></i><i style="background:${x.c}"></i><span>${x.n}</span></button>`).join('')}</div>
   <h4 class="ed-h">إضاءة الخلفيات</h4><div class="ed-lt"><button class="btn small" data-edlt="-1" ${L<=-2?'disabled':''}>أغمق</button><span class="ed-lv">${L===0?'الأصل':(L>0?'+':'')+L}</span><button class="btn small" data-edlt="1" ${L>=3?'disabled':''}>أفتح</button></div>
   <h4 class="ed-h">النصوص المعدّلة <span class="meta">(${keys.length})</span></h4>${keys.length?`<div class="ad-list">${keys.map(h=>`<div class="ad-row ad-x"><div><small class="notr" dir="rtl">${esc(T[h].src||'')}</small><b class="notr" dir="rtl">${esc(T[h].ar||T[h].src||'')}</b></div><button class="btn small" data-edrm="${h}">إرجاع</button></div>`).join('')}</div>`:'<p class="muted">لا توجد نصوص معدّلة.</p>'}
   <h4 class="ed-h">العناصر المخفية <span class="meta">(${H.length})</span></h4>${H.length?`<div class="ad-list">${H.map(h=>`<div class="ad-row ad-x"><div><b class="notr" dir="rtl">${esc(HL[h]||'عنصر')}</b></div><button class="btn small" data-edshow="${h}">إظهار</button></div>`).join('')}</div>`:'<p class="muted">لا توجد عناصر مخفية.</p>'}
   ${keys.length||H.length||th!=='gold'||L?'<div class="btns" style="margin-top:12px"><button class="btn small dl-del" data-edall="1">إرجاع كل التعديلات</button></div>':''}`}
edTheme();
function edClick(d){if(!isAdmin())return false;const U=UI();
  if(d.edon){if(LANG!=='ar'){adminData.msg='بدّل لغة التطبيق إلى العربية أولًا لتعديل النصوص.';render();return true}ED=true;edMode='edit';go('home');edToast('وضع التعديل مفعّل: اضغط على أي نص.');return true}
  if(d.edth){edSaveUi({theme:Object.assign({},U.theme||{},{id:d.edth})},'تغيّرت الألوان عند الجميع.');return true}
  if(d.edlt){const L=Math.max(-2,Math.min(3,(+(U.theme||{}).light||0)+(+d.edlt)));edSaveUi({theme:Object.assign({},U.theme||{},{light:L})},'تغيّرت إضاءة الخلفيات.');return true}
  if(d.edrm){const T=Object.assign({},U.t||{});T[d.edrm]=null;edSaveUi({t:T},'أُرجع النص الأصلي.');return true}
  if(d.edshow){edSaveUi({hide:(U.hide||[]).filter(x=>x!==d.edshow)},'أُظهر العنصر.');return true}
  if(d.edall){if(!confirm('إرجاع كل النصوص والألوان والعناصر المخفية إلى الأصل؟'))return true;const T={};Object.keys(U.t||{}).forEach(k=>T[k]=null);edSaveUi({t:T,hide:[],hideL:{},theme:{id:'gold',light:0}},'أُرجع كل شيء إلى الأصل.');return true}
  return false}
async function adminSave(patch,msg){try{await adminTry(()=>FB.saveContent(patch));Object.assign(CONTENT,patch);adminData.msg=msg}catch(e){adminData.msg='تعذّر الحفظ: '+(e.code||e.message)+(e.diag?' — '+e.diag:'')}render()}
function announcementBanner(){const A=CONTENT.announcement;if(!A||!A.on||!A.text)return '';
  let seen='';try{seen=localStorage.getItem('murshid-ann')||''}catch(e){}
  const id=String(A.at||'');if(seen===id)return '';
  return `<div class="ann" role="status"><b>رسالة من الإدارة</b><p class="notr" dir="auto">${esc(A.text)}</p><button class="btn small" data-anndismiss="${esc(id)}">حسنًا</button></div>`}
function onAuthRedirectError(e){AUTH.err=authErr(e);AUTH.busy=false;if(gated())render()}
let delAsk=false,acctMsg='';
function accountSection(){
  if(AUTH.state==='local')return `<section><div class="sh"><h2>الحساب</h2></div><div class="box pad"><p class="muted" style="margin-top:0">${lsGet('murshid-guest')?'تستعمل التطبيق دون حساب: تُحفظ بياناتك في هذا الهاتف فقط، وتضيع إذا مُسحت بيانات المتصفح.':'وضع محلي: لم نتمكن من الاتصال بخدمة الحسابات هنا، فتُحفظ بياناتك في هذا المتصفح فقط.'}</p>${lsGet('murshid-guest')?'<p class="meta">أنشئ حسابًا أو ادخل: يُنقل إليه كل ما سجّلته هنا.</p><div class="btns"><button class="btn ok" data-toauth="up">إنشاء حساب</button><button class="btn" data-toauth="in">لديّ حساب</button></div>':''}</div></section>`;
  const u=AUTH.user;if(!u)return '';
  return `<section><div class="sh"><h2>الحساب</h2></div>
   <div class="box pad" style="display:flex;flex-direction:column;gap:8px">
    <div><span class="muted">البريد الإلكتروني</span><div class="notr" dir="ltr" style="text-align:start;font-weight:500;overflow-wrap:anywhere">${esc(u.email||'')}</div></div>
    ${u.emailVerified?'<div class="logged">البريد مؤكَّد ✓</div>':`<div class="logged bad">لم يُؤكَّد البريد بعد. افتح الرسالة التي وصلتك ثم اضغط «تحقّقت».</div><div class="btns"><button class="btn small" data-resend="1">أعد إرسال رسالة التأكيد</button><button class="btn small" data-verified="1">تحقّقت</button></div>`}
    ${(u.email||'').toLowerCase()===TEST_ACCT.email?'<div class="box pad acct-test"><b>هذا حساب تجريبي مشترك</b><p class="meta" style="margin:4px 0 0">يدخله كل من يجرّب التطبيق: ما تسجّله فيه قد يراه غيرك أو يغيّره، وقد يُمسح في أي وقت. لتحفظ تقدّمك لك وحدك، اخرج منه وأنشئ حسابك الشخصي.</p></div>':''}
    ${!u.emailVerified&&(u.email||'').toLowerCase()!==TEST_ACCT.email?'<p class="meta" style="margin:0">كل خصائص التطبيق تعمل قبل تأكيد البريد. التأكيد يحمي حسابك، ويلزم لاستعادة كلمة المرور.</p>':''}
    ${acctMsg?`<p class="meta">${esc(acctMsg)}</p>`:''}
    <p class="muted" style="margin:0">يُحفظ تقدّمك في حسابك، فتجده على أي هاتف تدخل منه.</p>
    <div class="btns"><button class="btn" data-signout="1">تسجيل الخروج</button></div>
   </div>
   ${delAsk?`<div class="confirm"><span>سيُحذف حسابك وكل تقدّمك نهائيًا. متابعة؟</span><button class="btn slip" data-delyes="1">نعم، احذف حسابي</button><button class="btn" data-delno="1">تراجع</button></div>`:`<div class="btns"><button class="btn small" data-delacct="1">حذف الحساب</button></div>`}
  </section>`;
}
async function authClick(d){
  if(d.amode){AUTH.mode=d.amode;AUTH.err='';AUTH.info='';render();return true}
  if(d.google){googleSignIn();return true}
  if(d.signout){if(window.FB){cloudSaveNow();ttFlush();INBOX=[];FB.signOut()}return true}
  if(d.inread){const m=INBOX.find(x=>x.id===d.inread);if(m)m.read=true;render();FB.readInbox(d.inread).catch(()=>{});return true}
  if(d.resend){try{await FB.resendVerify();acctMsg='أُرسلت رسالة التأكيد إلى بريدك.'}catch(e){acctMsg=authErr(e)}render();return true}
  if(d.verified){try{const u=await FB.reloadUser();AUTH.user=u;acctMsg=u&&u.emailVerified?'':'لم يُؤكَّد بعد. افتح الرابط في الرسالة ثم أعد المحاولة.'}catch(e){acctMsg=authErr(e)}render();return true}
  if(d.delacct){delAsk=true;render();return true}
  if(d.delno){delAsk=false;render();return true}
  if(d.delyes){try{await FB.deleteAccount()}catch(e){delAsk=false;acctMsg=authErr(e);render()}return true}
  if(d.adminreload){adminData.users=null;adminLoad();adminData.msgs=null;adminMsgsLoad();return true}
  if(d.adpub){const t=(document.getElementById('ad-msg').value||'').trim();if(!t){adminData.msg='اكتب نص الرسالة أولًا.';render();return true}
    adminSave({announcement:{text:t,on:true,at:Date.now()}},'نُشرت الرسالة لكل المستعملين.');return true}
  if(d.adhide){adminSave({announcement:Object.assign({},CONTENT.announcement,{on:false})},'أُخفيت الرسالة.');return true}
  if(d.adxadd){const t=(document.getElementById('ad-xt').value||'').trim(),s=(document.getElementById('ad-xs').value||'').trim();
    if(!t){adminData.msg='اكتب اسم العمل أولًا.';render();return true}
    adminSave({extra:[...(CONTENT.extra||[]),{id:'x'+Date.now().toString(36),t,s}]},'أُضيف العمل.');return true}
  if(d.adxdel!==undefined){const X=(CONTENT.extra||[]).slice();X.splice(+d.adxdel,1);adminSave({extra:X},'حُذف العمل.');return true}
  if(d.anndismiss!==undefined){lsSet('murshid-ann',d.anndismiss);render();return true}
  return false;
}

const SCR=()=>document.getElementById('app')||document.scrollingElement||document.documentElement;
/* pinch with two fingers anywhere (except the mushaf page, which zooms its image) to enlarge or shrink the content */
let pz=null;const pzD=t=>Math.hypot(t[0].clientX-t[1].clientX,t[0].clientY-t[1].clientY);
function pzEl(){return document.querySelector('main.sheet')}
const PZ_OK=()=>screen.startsWith('adh_')||['method','qa','tawba','mujahada','quran','mushaf','organ','qalb','duas','fatur'].includes(screen);
document.addEventListener('touchstart',e=>{if(e.touches.length!==2||!PZ_OK()||e.target.closest('.msh-page,.dr,#hudurOv')||!pzEl())return;
  const t=e.touches,el=pzEl(),r=el.getBoundingClientRect();pz={d:pzD(t),f:S.fz||1,nf:null,ox:(t[0].clientX+t[1].clientX)/2-r.left,oy:(t[0].clientY+t[1].clientY)/2-r.top}},{passive:true});
document.addEventListener('touchmove',e=>{if(!pz||e.touches.length!==2)return;e.preventDefault();
  const f=Math.max(.85,Math.min(1.8,pz.f*pzD(e.touches)/pz.d)),el=pzEl();pz.nf=f;if(!el)return;
  el.style.transformOrigin=pz.ox+'px '+pz.oy+'px';el.style.transform='scale('+(f/pz.f).toFixed(3)+')';el.style.animation='none';
  let b=document.getElementById('pzTip');if(!b){b=document.createElement('div');b.id='pzTip';document.body.appendChild(b)}b.textContent=Math.round(f*20)*5+'%'},{passive:false});
function pzEnd(e){if(!pz||(e.touches&&e.touches.length>=2))return;const p=pz;pz=null;const b=document.getElementById('pzTip');if(b)b.remove();
  const el=pzEl();if(el){el.style.transform='';el.style.transformOrigin=''}
  if(p.nf==null)return;const f=Math.round(p.nf*20)/20;if(Math.abs(f-p.f)<.01)return;
  const sc=SCR(),rel=sc.scrollTop/Math.max(1,sc.scrollHeight);S.fz=f;save();render();sc.scrollTop=rel*sc.scrollHeight}
document.addEventListener('touchend',pzEnd);document.addEventListener('touchcancel',pzEnd);
['gesturestart','gesturechange'].forEach(ev=>document.addEventListener(ev,e=>{if(!(e.target.closest&&e.target.closest('.msh-page')))e.preventDefault()},{passive:false}));

/* iPhone sometimes paints the fixed tab bar in the wrong place after scrolling or returning to the app: nudge it back */
function navFix(){const n=document.querySelector('nav.tabs');if(!n)return;n.style.position='relative';void n.offsetHeight;n.style.position=''}
let navT=null;document.addEventListener('scroll',()=>{clearTimeout(navT);navT=setTimeout(navFix,180)},{passive:true,capture:true});
['resize','orientationchange','pageshow','focus'].forEach(ev=>addEventListener(ev,()=>setTimeout(navFix,120)));
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')setTimeout(navFix,150)});
if(window.visualViewport)visualViewport.addEventListener('resize',()=>setTimeout(navFix,120));
const save=()=>{S.updatedAt=Date.now();try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){};cloudSave()};
const YDAY=addDays(TODAY,-1);
function normOrgans(){let ch=false;ORGANS.forEach(g=>{
  if(!S.organs[g.id])S.organs[g.id]=blankOrgan();
  const o=S.organs[g.id];
  if(!o.slips)o.slips=[];
  if(o.attempt==null)o.attempt=o.phase==='idle'?0:(o.resets||0)+1;
  if(o.attemptStart===undefined)o.attemptStart=o.days>0&&o.last?addDays(o.last,-(o.days-1)):null;
  if(!o.base&&(o.phase==='tathir'||o.phase==='tanwir'))orgMigrate(o);
  if(o.base){const k=JSON.stringify([o.days,o.phase,o.slips.length]);orgSim(o);if(k!==JSON.stringify([o.days,o.phase,o.slips.length]))ch=true}
  else o.today=o.last===TODAY?o.today:null});return ch}
/* each organ keeps a day-by-day record (hist) from a starting point (base); its count is always recomputed from it,
   so a past day can be reviewed and corrected */
function orgMigrate(o){const slipToday=o.today==='slip'&&o.last===TODAY,sl=o.slips.slice();let r='';
  if(slipToday&&sl.length&&sl[sl.length-1].date===TODAY)r=sl.pop().reason||'';
  const d0=o.days>0&&o.last?addDays(o.last,-(o.days-1)):slipToday?TODAY:(o.attemptStart&&o.attemptStart<=TODAY?o.attemptStart:TODAY);
  o.base={d:d0,ph:o.phase,slips:sl,resets:Math.max(0,(o.resets||0)-(slipToday?1:0)),at:Math.max(1,(o.attempt||1)-(slipToday?1:0))};o.hist={};
  if(o.days>0&&o.last)for(let i=0;i<o.days;i++)o.hist[addDays(o.last,-i)]={v:'ok'};
  if(slipToday)o.hist[TODAY]={v:'slip',r}}
/* the seeker sets the day the current attempt began: days from then until yesterday that are not logged count as kept */
function orgSetStart(o,D){if(!D||D>TODAY)return;if(!o.base)orgMigrate(o);if(!o.base)return;
  const ph=o.phase==='done'?'tanwir':o.phase;
  o.base={d:D,ph,slips:(o.slips||[]).filter(x=>x.date<D),resets:(o.slips||[]).filter(x=>x.date<D).length,at:o.attempt||1};
  Object.keys(o.hist||{}).forEach(k=>{if(k<D)delete o.hist[k]});
  /* days from the new start up to the first logged day take that day's verdict; with nothing logged they wait for the next log */
  const first=Object.keys(o.hist).filter(k=>k>=D).sort()[0];
  if(first){const v=o.hist[first].v;for(let d=D;d<first;d=addDays(d,1))if(!o.hist[d])o.hist[d]=v==='ok'?{v:'ok',f:first}:{v:'miss',f:first}}
  orgSim(o)}
function prepSetStart(D){if(!D||D>TODAY)return;const P=prepState();P.start=D;
  Object.keys(P.log).forEach(k=>{if(k<D)delete P.log[k]});
  for(let d=D;d<TODAY;d=addDays(d,1))if(!P.log[d]||!Object.keys(P.log[d]).length){P.log[d]={};PREP.forEach(x=>P.log[d][x.id]='ok')}
  if(prepDays()>=30){P.status='done';P.doneAt=TODAY}else if(P.status==='done')P.status='active'}
function orgBase(o,ph){o.base={d:TODAY,ph,slips:(o.slips||[]).slice(),resets:o.resets||0,at:1};o.hist={}}
function orgSim(o){const B=o.base;if(!B)return;let ph=B.ph,days=0,last=null,at=B.at||1,aStart=B.d,resets=B.resets||0,pend=0,pendFrom=null,ready=false;const slips=(B.slips||[]).slice();o.hist=o.hist||{};
  const lastLog=Object.keys(o.hist).filter(k=>k<=TODAY).sort().pop()||'';
  for(let d=B.d;d<=TODAY&&ph!=='done'&&!ready;d=addDays(d,1)){const h=o.hist[d];
    if(h&&h.v==='miss')continue;
    if(!h&&d<TODAY&&d>lastLog){pend++;if(!pendFrom)pendFrom=d;continue}
    if(h&&h.v==='ok'){if(days===0)aStart=d;days++;last=d;if(days>=30){if(ph==='tathir'){days=30;ready=true}else{ph='done';days=30}}}
    else if(h&&h.v==='slip'){slips.push({date:d,phase:ph,day:days,reason:h.r||''});days=0;resets++;at++;aStart=addDays(d,1);last=d}
    else if(d<TODAY&&days>0){slips.push({date:d,phase:ph,day:days,reason:'انقطاع: يوم لم يُسجَّل',auto:true});days=0;resets++;at++;aStart=d}}
  const L=slips[slips.length-1];
  Object.assign(o,{phase:ph,days,ready,last,attempt:at,attemptStart:aStart,slips,resets,pend:ph==='done'||ready?0:pend,pendFrom,today:ready?(last===TODAY?'ok':null):o.hist[TODAY]?(o.hist[TODAY].v==='ok'?'ok':'slip'):null,broken:!!(L&&L.auto&&days===0&&ph!=='done'&&L.date>=addDays(TODAY,-1))})}
normOrgans();applyFz();

function demoMarks(){const M=emptyMarks(),t=Date.now(),p=period();
  M[p.kind][p.key]=Math.max(p.start+10*6e4,t-45*6e4);
  M.quran=[t-3*36e5];M.dhikrText='';M.dhikrList=[{text:'أستغفر الله الذي لا إله إلا هو الحي القيوم وأتوب إليه',min:15},{text:'لا إله إلا الله',min:10},{text:'اللهم صلِّ على سيدنا محمد وعلى آله وصحبه وسلم',min:5}];
  M.dhikr=[2,3,5,6,9].map(i=>atH(addDays(nowStr(),-i),21));
  M.khalwa=[{ts:atH(addDays(nowStr(),-45),10),type:'khalwa'}];return M}
const dayLog=()=>S.log[TODAY]||(S.log[TODAY]={awrad:[],heart:null,note:''});
const activeOrgans=()=>ORGANS.filter(g=>['tathir','tanwir'].includes(S.organs[g.id].phase)&&!S.organs[g.id].parked);
/* take an organ out of «اليوم»: past purification it keeps that, otherwise it goes back to «not started» */
const orgPassed=o=>o.ready||o.phase==='tanwir';
function orgPark(o){const s0=addDays(TODAY,-30);o.base={d:s0,ph:'tathir',slips:(o.slips||[]).slice(),resets:o.resets||0,at:o.attempt||1};o.hist={};
  for(let d=s0;d<TODAY;d=addDays(d,1))o.hist[d]={v:'ok',f:'park'};Object.assign(o,{phase:'tathir',parked:true});orgSim(o);o.today=null}
function orgDrop(id){const o=S.organs[id];
  if(orgPassed(o))orgPark(o);
  else{Object.assign(o,{phase:'idle',days:0,ready:false,parked:false,today:null,last:null,attempt:0,attemptStart:null,pend:0,pendFrom:null,broken:false});delete o.base;o.hist={}}}
function orgTake(id){const o=S.organs[id];
  if(o.parked){o.parked=false;orgSim(o);return}
  Object.assign(o,{phase:'tathir',days:0,ready:false,last:null,today:null,attempt:1,attemptStart:TODAY});orgBase(o,'tathir')}
const pendingOrgans=()=>activeOrgans().filter(g=>!S.organs[g.id].today&&!S.organs[g.id].ready);

