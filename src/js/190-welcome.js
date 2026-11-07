/* ---------- welcome screens (shown once to a new seeker) ---------- */
let obStep=0;
const MEAN={"maiya": ["“And He is with you wherever you are.” (57:4)", "« Et Il est avec vous où que vous soyez. » (57:4)", "«Y Él está con vosotros dondequiera que estéis.» (57:4)", "«Он с вами, где бы вы ни были». (57:4)", "«اور وہ تمہارے ساتھ ہے جہاں کہیں بھی تم ہو» (57:4)"], "v91": ["“He has truly succeeded who purifies it.” (91:9)", "« A réussi, certes, celui qui la purifie. » (91:9)", "«Ciertamente triunfa quien la purifica.» (91:9)", "«Преуспел тот, кто очистил её». (91:9)", "«یقیناً وہ کامیاب ہوا جس نے اسے پاک کیا» (91:9)"], "hsamt": ["“Hold to long silence and good character, for by the One in whose hand my soul is, creation has never adorned itself with anything like them.”", "« Attache-toi au long silence et au bon caractère : par Celui qui tient mon âme en Sa main, les créatures ne se sont jamais parées de rien de semblable. »", "«Aférrate al largo silencio y al buen carácter: por Aquel en cuya mano está mi alma, las criaturas nunca se han adornado con nada semejante.»", "«Держись долгого молчания и благого нрава: клянусь Тем, в Чьей руке моя душа, ничем подобным творения себя не украшали».", "«لمبی خاموشی اور اچھے اخلاق کو لازم پکڑو، قسم ہے اس ذات کی جس کے ہاتھ میں میری جان ہے، مخلوق نے ان جیسی کسی چیز سے اپنے آپ کو آراستہ نہیں کیا»"]};
const meaning=k=>LANG==='ar'?'':`<p class="ob-tr notr" dir="${RTL()?'rtl':'ltr'}" lang="${LANG}">${MEAN[k][LIDX[LANG]]||MEAN[k][0]}</p>`;
const needOnboard=()=>(AUTH.state==='in'||AUTH.state==='local')&&!S.onboarded;
function viewOnboard(){
  const pages=[
   `${ilBan('ob1','ob-ban')||`<div class="ob-ic">${LOGO}</div>`}<h1 class="ob-t">مرحبًا بك في المرشد</h1>
    <p class="ob-v notr" dir="rtl" lang="ar">﴿قَدْ أَفْلَحَ مَن زَكَّاهَا﴾</p>${meaning('v91')}
    <p class="ob-p">رفيقك في طريق التزكية على المنهج المحمدي: يعينك على تطهير جوارحك وتنويرها، والمداومة على أورادك، ومراقبة قلبك يومًا بعد يوم، طلبًا لرضا الله.</p>`,
   `${ilBan('ob2','ob-ban')}<h1 class="ob-t">كيف تسير في التطبيق</h1>
    <ul class="ob-l">
     <li><b>التزكية</b><span>سبع جوارح: تطهير ثلاثين يومًا بلا زلة، ثم تنوير ثلاثين يومًا.</span></li>
     <li><b>الأعمال</b><span>أذكار الصباح والمساء، وذكرك الشخصي، وورد القرآن، والصلوات الخمس.</span></li>
     <li><b>حالة قلبك وحالتك الروحية</b><span>صورتان تتغيران بأعمالك، فترى أثر سيرك.</span></li>
     <li><b>المنهج المحمدي</b><span>مرجعك: التعريف والأصول وطريق التحقق.</span></li>
    </ul>
    <p class="ob-p small">من الملف الشخصي تختار مدينتك لضبط المواقيت، وتفعّل التذكيرات على هاتفك.</p>`,
   `${ilBan('ob3','ob-ban')}<h1 class="ob-t">ابدأ بالمرحلة التمهيدية</h1>
    <p class="ob-p">ثلاثون يومًا تتدرّب فيها على ثلاث وصايا نبوية:</p>
    <div class="ob-three"><span>طول الصمت</span><span>حسن الخلق</span><span>الحضور مع الله طيلة اليوم</span></div>
    <p class="ob-q notr" dir="rtl" lang="ar">«عليك بطول الصمت وحسن الخلق، فوالذي نفسي بيده ما تجمّل الخلائق بمثلهما»</p>${meaning('hsamt')}
    <p class="ob-p small">سجّل كل يوم ما حققته. وإن أخفقت فلا يُعاد العدّ: دوّن السبب واستمر.</p>`];
  const last=obStep===pages.length-1;
  return `<section class="ob">
   <div class="langs" role="group" aria-label="اللغة">${LANGS.map(([c,l,n])=>`<button class="lang notr${c===LANG?' on':''}" data-lang="${c}" aria-pressed="${c===LANG}" title="${n}" lang="${c}">${l}</button>`).join('')}</div>
   <div class="ob-top">${obStep>0?'<button class="btn link-btn ob-skip" data-ob="prev">رجوع</button>':'<span></span>'}${last?'<span></span>':'<button class="btn link-btn ob-skip" data-ob="skip">تخطّي</button>'}</div>
   <div class="ob-card">${pages[obStep]}</div>
   <div class="ob-dots" aria-hidden="true">${pages.map((_,i)=>`<i class="${i===obStep?'on':''}"></i>`).join('')}</div>
   <div class="ob-btns">${last?'<button class="btn ok big" data-ob="start">ابدأ المرحلة التمهيدية</button><button class="btn big ob-later" data-ob="later">لاحقًا، خذني إلى الرئيسية</button>':'<button class="btn ok big" data-ob="next">التالي</button>'}</div>
  </section>`;
}
function obClick(k){
  if(k==='next'){obStep++;return render()}
  if(k==='prev'){obStep=Math.max(0,obStep-1);return render()}
  if(k==='skip'){obStep=2;return render()}
  S.onboarded=true;
  if(k==='start'){const P=prepState();if(P.status==='idle'){P.status='active';P.start=TODAY;P.log={}}prepOpen=true;save();obStep=0;return go('tazkiya')}
  save();obStep=0;go('home');
}

