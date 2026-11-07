/* religious review credit: fill REVIEW_BY (e.g. 'الشيخ فلان') and it shows in «عن المرشد»; also editable from the content panel (CONTENT.review) */
const REVIEW_BY='';
function reviewLine(){const r=(typeof CONTENT!=='undefined'&&CONTENT.review)||REVIEW_BY;return r?`<p class="rv-by"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6z"/><path d="M9 12l2 2 4-4"/></svg><span><span>راجع المحتوى الشرعي:</span> <b class="notr">${esc(r)}</b></span></p>`:''}
/* ---------- about, privacy, contact ---------- */
let contactMsg='',contactBusy=false;
const aboutOpen=new Set();
document.addEventListener('toggle',e=>{const d=e.target;if(d&&d.dataset&&d.dataset.acc){if(d.open)aboutOpen.add(d.dataset.acc);else aboutOpen.delete(d.dataset.acc)}},true);
const ABI={
 font:'<path d="M4 19 9 5l5 14M6 14h6"/><path d="M15 19l3-8 3 8M16 16.5h4"/>',
 backup:'<path d="M12 4v10M8 10l4 4 4-4"/><path d="M5 15v4h14v-4"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6"/><circle cx="12" cy="7.6" r=".9" fill="currentColor" stroke="none"/>',
 theme:'<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/>',
 install:'<rect x="7" y="2.5" width="10" height="19" rx="2.2"/><path d="M12 7v7M9.2 11.4 12 14.2l2.8-2.8M10.5 18.5h3"/>',
 bell:'<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
 help:'<circle cx="12" cy="12" r="9"/><path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.3c-.7.3-1 .8-1 1.5v.4"/><circle cx="12" cy="16.9" r=".9" fill="currentColor" stroke="none"/>',
 offline:'<path d="M3 3l18 18"/><path d="M8.5 8.6A6 6 0 0 0 6 13a4 4 0 0 0 1 8h10m3.2-1.6A4 4 0 0 0 17 13h-.3A6 6 0 0 0 11 7.3"/>',
 transfer:'<path d="M4 8h13l-3.5-3.5M20 16H7l3.5 3.5"/>',
 shield:'<path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.3-7.5 9.5-4.3-1.2-7.5-4.9-7.5-9.5V6z"/><path d="M9 12l2.2 2.2L15.5 10"/>',
 users:'<circle cx="9" cy="8.5" r="3.5"/><path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5"/><path d="M15.5 5.2a3.4 3.4 0 0 1 0 6.6M18 14.8c1.9.7 3.1 2.4 3.5 5.2"/>',
 megaphone:'<path d="M3.5 10v4h3l7 4.5v-13l-7 4.5z"/><path d="M17 9a4 4 0 0 1 0 6"/><path d="M6.5 14l1.5 5.5h2.5"/>',
 list:'<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2"/>',
 code:'<path d="M8.5 7L3.5 12l5 5M15.5 7l5 5-5 5"/>',
 user:'<circle cx="12" cy="8" r="4"/><path d="M4.5 20.5c1.2-4 4.2-6 7.5-6s6.3 2 7.5 6"/>',
 pin:'<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/>',
 key:'<circle cx="8" cy="15" r="4"/><path d="M11 12l8.5-8.5M16.5 6.5l2.5 2.5M14 9l2 2"/>',
 reset:'<path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4v4.5h4.5"/>',
 mail:'<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M3.5 7l8.5 6 8.5-6"/>',
 speaker:'<path d="M4 9.5v5h3.5l4.5 4v-13l-4.5 4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>'};
/* settings: the reading voice for the app's language, and for Arabic texts (verses, adhkar) */
const VC_SAMPLE={ar:'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ. هَذَا صَوْتُ الْقِرَاءَةِ فِي الْمُرْشِدِ.',en:'This is the reading voice of Al-Murshid.',fr:'Voici la voix de lecture d’Al-Murshid.',es:'Esta es la voz de lectura de Al-Murshid.',ru:'Это голос чтения приложения Аль-Муршид.',ur:'یہ المرشد کی پڑھنے والی آواز ہے۔'};
function voiceBox(){const langs=LANG==='ar'?['ar']:[LANG,'ar'];
  return langs.map(lg=>{const vs=ttsVoices(lg).sort((a,b)=>ttsScore(b,lg)-ttsScore(a,lg)),cur=(S.ttsV||{})[lg]||'';
    return `<div class="vc-r"><p class="muted">${lg==='ar'&&LANG!=='ar'?'صوت النصوص العربية (الآيات والأذكار)':'صوت لغة التطبيق'}</p>${vs.length?`<div class="vc-row"><select class="vc-sel notr" data-vclang="${lg}" dir="ltr"><option value="">${esc(Tx('تلقائي: أفضل صوت متاح'))}</option>${vs.map(v=>`<option value="${esc(v.voiceURI)}"${v.voiceURI===cur?' selected':''}>${esc(v.name)} · ${esc(v.lang)}</option>`).join('')}</select><button class="btn small" data-vctry="${lg}">جرّب</button></div>`:'<p class="meta">لا يوجد صوت لهذه اللغة في هاتفك.</p>'}</div>`}).join('')+
   `<div class="vc-help"><p><b>لصوت أوضح، نزّل صوتًا محسّنًا في هاتفك:</b></p><p>آيفون: الإعدادات ← تسهيلات الاستخدام ← المحتوى المنطوق ← الأصوات ← اختر اللغة ← نزّل صوتًا «محسّنًا» أو «ممتازًا».</p><p>أندرويد: الإعدادات ← تسهيلات الاستخدام ← تحويل النص إلى كلام ← محرك Google ← تثبيت بيانات الصوت ← اختر اللغة.</p><p class="meta">ثم أغلق التطبيق وافتحه، واختر الصوت الجديد هنا.</p></div>`}
function vcTry(lg){if(!TTS_OK)return;try{speechSynthesis.cancel()}catch(e){}const u=new SpeechSynthesisUtterance(VC_SAMPLE[lg]||VC_SAMPLE.ar),v=ttsVoice(lg);u.lang=v?v.lang:(TTS_LANG[lg]||'ar-SA');if(v)u.voice=v;u.rate=ttsRateFor(lg==='ar');speechSynthesis.speak(u)}
try{speechSynthesis.addEventListener('voiceschanged',()=>{if(screen==='profile'&&aboutOpen.has('voice'))render()})}catch(e){}
document.addEventListener('change',e=>{const t=e.target;if(!t||!t.dataset||!t.dataset.vclang)return;S.ttsV=S.ttsV||{};if(t.value)S.ttsV[t.dataset.vclang]=t.value;else delete S.ttsV[t.dataset.vclang];save();vcTry(t.dataset.vclang)});
const CHEV='<svg class="acc-ch" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>';
function acc(id,ic,t,body,val){return `<details class="acc" data-acc="${id}"${aboutOpen.has(id)?' open':''}><summary><span class="acc-ic"><svg viewBox="0 0 24 24" aria-hidden="true">${ABI[ic]}</svg></span><span class="acc-t">${t}</span>${val?`<span class="acc-v">${val}</span>`:''}${CHEV}</summary><div class="acc-b">${body}</div></details>`}
function viewAbout(){
  const canSend=AUTH.state==='in'&&window.FB,P=installParts(true);
  if(contactMsg)aboutOpen.add('contact');
  const status=P.standalone?'<span class="ab-ok">مثبّت على شاشتك ✓</span>':installEvt?'<button class="btn ok small" data-install="1">ثبّت المرشد على الشاشة</button>':'';
  const install=(P.top&&!P.standalone?P.top.replace(/class="box pad[^"]*"/,'class="acc-note"'):'')+(P.standalone?'<p class="muted" style="margin:0">أنت تستعمله الآن كتطبيق مستقل، ويعمل حتى دون اتصال بالإنترنت.</p>':(P.ios?P.iosS+P.andS:P.andS+P.iosS));
  const contact=canSend?`<p class="muted" style="margin:0 0 8px">سؤال، أو ملاحظة، أو خطأ وجدته في التطبيق: اكتبه هنا فيصل إلى إدارة المرشد.</p><textarea id="ct-text" dir="auto" placeholder="اكتب رسالتك…" maxlength="2000"></textarea>
    <div class="btns"><button class="btn ok" data-ctsend="1" ${contactBusy?'disabled':''}>أرسل الرسالة</button></div>${contactMsg?`<p class="logged">${esc(contactMsg)}</p>`:''}`
    :'<p class="muted" style="margin:0">سجّل الدخول بحسابك لتتمكن من مراسلة الإدارة.</p>';
  const privacy=`<dl class="pv">
    <dt>ما الذي يُحفظ؟</dt><dd>بريدك الإلكتروني واسمك عند إنشاء الحساب، وتقدمك في التزكية والأوراد والمحاسبة، ومدينتك أو موقعك التقريبي لحساب مواقيت الصلاة، ورمز الإشعارات إن فعّلت التذكيرات.</dd>
    <dt>أين يُحفظ؟</dt><dd>على هاتفك، وفي حسابك على خدمة Google Firebase لتجده على كل أجهزتك.</dd>
    <dt>من يطّلع عليه؟</dt><dd>لا أحد غيرك. لا تُباع بياناتك، ولا تُشارك مع أي جهة، ولا يوجد في التطبيق إعلانات ولا أدوات تتبّع إعلانية. ترى الإدارة اسمك وبريدك، ومدة استعمالك للتطبيق والأقسام التي تقضي فيها وقتك، ولا ترى تفاصيل تقدمك الروحي ولا محاسباتك ولا زلّاتك.</dd>
    <dt>الإحصاء المجهول</dt><dd>يرسل التطبيق أعدادًا لا تدلّ على أحد، مثل: «هاتف آخر فتح الأعمال اليوم»، أو «هاتف آخر أتمّ سبعة أيام في التزكية»، لتعرف الإدارة ما ينفع السالكين وأين يتوقفون. لا يُرسل معها اسم ولا بريد ولا أي معرّف للهاتف، ولا شيء من أعمالك أو كتاباتك.<br><button class="btn small" data-stoff="1" style="margin-top:8px">${S.statsOff?'أعد تفعيل المشاركة في الإحصاء':'أوقف المشاركة في الإحصاء'}</button>${S.statsOff?' <small class="meta">موقوفة على هذا الهاتف.</small>':''}</dd>
    <dt>الموقع</dt><dd>يُستعمل لحساب مواقيت الصلاة ووقت التذكيرات فقط، ويمكنك اختيار مدينتك يدويًا بدلًا منه.</dd>
    <dt>حذف بياناتك</dt><dd>من الملف الشخصي، اضغط «حذف الحساب» فتُحذف كل بياناتك نهائيًا.</dd></dl>`;
  return `<section class="ab-hero"><div class="ab-logo">${LOGO}</div><h2 class="ab-name">المرشد</h2>
    <p class="ab-tag">رفيق السالك في طريق التزكية على المنهج المحمدي</p>
    <div class="ab-chips"><span>مجاني</span><span>بلا إعلانات</span><span>يعمل دون إنترنت</span><span>ست لغات</span></div>${status?`<div class="ab-st">${status}</div>`:''}</section>
   <p class="ab-g">التطبيق</p>
   <div class="acc-card">${acc('about','info','عن المرشد','<p style="margin:0">يعين المرشد السالك على تطهير جوارحه وتنويرها، والمداومة على أوراده، ومحاسبة نفسه، ومراقبة قلبه يومًا بعد يوم. وهو مجاني، بلا إعلانات.</p>'+reviewLine())}
    ${acc('install','install','تثبيت التطبيق',install)}${acc('notif','bell','تفعيل التذكيرات',P.notS.replace(/<b class="acc-sub">[^<]*<\/b>/,''))}
    ${acc('tips','help','إن لم تصلك التذكيرات',P.tipS.replace(/<b class="acc-sub">[^<]*<\/b>/,''))}${acc('offline','offline','العمل دون إنترنت',P.offS.replace(/<b class="acc-sub">[^<]*<\/b>/,''))}
    ${acc('transfer','transfer','نقل بياناتك',P.transfer)}</div>
   <p class="ab-g">الخصوصية والتواصل</p>
   <div class="acc-card">${acc('privacy','shield','سياسة الخصوصية',privacy+'<p><a href="privacy.html" target="_blank" rel="noopener" class="btn small">سياسة الخصوصية وشروط الاستخدام كاملة</a></p>')}${acc('contact','mail','راسلنا',contact)}${acc('errlog','list','سجل الأخطاء التقنية',(()=>{let L=[];try{L=JSON.parse(localStorage.getItem('murshid-err')||'[]')}catch(e){}return `<p class="meta" style="margin-top:0"><span>الإصدار:</span> <span dir="ltr">${APP_VER}</span>. <span>إن واجهت مشكلة، انسخ هذا السجل وأرسله في «راسلنا».</span></p>${L.length?`<pre class="err-log notr" dir="ltr">${esc(L.slice().reverse().map(x=>x.t+' '+x.s+' '+x.m).join('\n'))}</pre><div class="btns"><button class="btn small" data-errcopy="1">انسخ السجل</button><button class="btn small" data-errclear="1">امسحه</button></div>`:'<p class="logged">لا أخطاء مسجّلة ✓</p>'}`})())}</div>
   <p class="ab-foot"><span class="notr" dir="ltr">dr.idrissi.hafdi@gmail.com</span></p>`;
}
async function contactSend(){const el=document.getElementById('ct-text'),t=(el&&el.value||'').trim();
  if(!t){contactMsg='اكتب رسالتك أولًا.';return render()}
  contactBusy=true;render();
  try{await FB.sendMessage(AUTH.user,t,S.name||'',LANG);contactMsg='وصلت رسالتك إلى الإدارة. جزاك الله خيرًا.'}
  catch(e){contactMsg='تعذّر الإرسال. تأكد من اتصالك بالإنترنت ثم أعد المحاولة.'+(e&&e.code?' ('+e.code+')':'')}
  contactBusy=false;render()}

