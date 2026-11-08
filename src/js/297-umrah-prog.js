/* ---------- برنامج الرحلة: the daily works of the journey, from the Hajj & Umrah booklet of the Muhammadan path ----------
   Tabs: before travel, Makkah, Madinah, al-Baqi', the cave of Hira', after returning.
   Item kinds: r = recited inside the prayer (no tracking) · a = an act to tick · n = a dhikr counted to a number · m = a dhikr timed in minutes.
   Progress is kept per day (S.umP, reset each day); a group marked once:1 is kept for the whole journey (S.umOnce). */
const UPD={
 sal:['اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ. اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ','الصلاة الإبراهيمية'],
 dur:['اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِهِ وَصَحْبِهِ وَسَلِّمْ','الصلاة على النبي ﷺ'],
 ist:['أَسْتَغْفِرُ اللَّهَ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ','الاستغفار'],
 haw:['لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ الْعَلِيِّ الْعَظِيمِ','الحوقلة'],
 haw2:['لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ','الحوقلة'],
 yAllah:['يَا اللَّهُ','يا الله'],yRahman:['يَا رَحْمَٰنُ','يا رحمن'],yRahim:['يَا رَحِيمُ','يا رحيم'],yGhafur:['يَا غَفُورُ','يا غفور'],yJabbar:['يَا جَبَّارُ','يا جبّار'],
 yMalik:['يَا مَلِكُ يَا قُدُّوسُ','يا ملك يا قدوس'],yHamid:['يَا حَمِيدُ','يا حميد'],ySamad:['يَا صَمَدُ','يا صمد'],yMuhaymin:['يَا مُهَيْمِنُ','يا مهيمن'],
 allah2:['اللَّهُ اللَّهُ','ذكر الاسم المفرد'],allahu:['اللَّهُ هُوَ','ذكر «الله هو»'],
 salam:['السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ','السلام على النبي ﷺ'],
 ummi:['اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ النَّبِيِّ الْأُمِّيِّ وَعَلَى آلِهِ وَصَحْبِهِ وَسَلِّمْ تَسْلِيمًا','الصلاة على النبي الأمي ﷺ'],
 jah:['اللَّهُمَّ يَا رَبِّ بِجَاهِ سَيِّدِنَا مُحَمَّدِ ابْنِ عَبْدِ اللَّهِ ﷺ اجْمَعْ بَيْنِي وَبَيْنَ سَيِّدِنَا مُحَمَّدِ ابْنِ عَبْدِ اللَّهِ فِي الدُّنْيَا قَبْلَ الْآخِرَةِ','دعاء الاجتماع بالنبي ﷺ'],
 subbuh:['سُبُّوحٌ قُدُّوسٌ رَبُّنَا وَرَبُّ الْمَلَائِكَةِ وَالرُّوحِ','التسبيح والتقديس'],
 rabbi:['رَبِّ اغْفِرْ وَارْحَمْ وَأَنْتَ خَيْرُ الرَّاحِمِينَ','طلب المغفرة والرحمة'],
 wahdah:['لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ','التوحيد'],
 jalal:['يَا ذَا الْجَلَالِ وَالْإِكْرَامِ','يا ذا الجلال والإكرام'],
 mubin:['لَا إِلَٰهَ إِلَّا اللَّهُ الْمَلِكُ الْحَقُّ الْمُبِينُ','التوحيد'],
};
const UP_AFTER_TAWBA=[['n','sal',10],['n','ist',10],['n','haw',10],['n','yAllah',100],['n','yRahim',100],['n','yGhafur',100]];
const UP_KAABA=[['n','dur',100],['m','allah2',60],['m','allahu',60],['n','dur',100],['a','مراقبة ومناجاة',20]];
const UP_MAD=[['a','أربع ركعات صلاة التوبة'],['m','salam',45],['m','jah',30],['m','allah2',60],['m','dur',45],['a','صلاة الشكر']];
const UP=[
 {k:'pre',vis:[['upt_pre',47,48]],t:'قبل السفر',ic:'m_door',
  intro:'مفتاح الانتفاع بالرحلة التوبة: على قدر تطهّرك قبلها يكون فتحك فيها. كن في حال توبة خمسة أيام على الأقل قبل سفرك، وأكثر من صلاة التوبة نافلةً، ركعتين ركعتين أو أربعًا أربعًا، وكلما أكثرت كان أفضل.',
  g:[{t:'في كل ركعة من صلاة التوبة',it:[['r','الفاتحة'],['r','آية الكرسي',3],['r','آخر سورة الحشر (الآيات 22–24)',3],['r','سورة الإخلاص',3]]},
     {t:'صلاة التوبة وما بعدها',it:[['a','صلِّ صلاة التوبة'],...UP_AFTER_TAWBA,['n','sal',10]]}],
  think:'استحضر أنك بين يدي ربك تطلب مغفرته من كل ذنب صغير وكبير، وأنه يراك ويسمعك. وتخيّل مطر الرحمة ينزل عليك فيغسلك حتى تتلألأ. من سأل بصدق غُفر له.',
  tips:['تعلّم أحكام العمرة قبل السفر: أركانها وواجباتها وسننها وما يفسدها (تجدها في «مراحل العمرة»).']},
 {k:'makkah',vis:[['upt_makkah',31,50],['upt_sujood',40,58,'في المراقبة']],t:'مكة',ic:'um_kaaba',
  intro:'ادخل مكة في غاية التواضع، ونيّتك لقاء ربك، في حال توبة وتوكّل وشكر. كن دائمًا في عبادة: صلاة أو ذكر أو قرآن، ولا تترك شيئًا من سنن النبي ﷺ. هنا تُجاب الدعوات، فانتبه لما تسأل.',
  g:[{t:'صباحًا بعد الفجر، جالسًا أمام الكعبة',it:UP_KAABA},
     {t:'عند أول زيارة للحرم، بعد الظهر',once:1,it:[['a','أربع ركعات صلاة التسبيح'],['n','dur',10],['n','yAllah',100],['n','yRahman',100],['n','yRahim',100],['n','yJabbar',100],['n','dur',10]]},
     {t:'بعد الظهر كل يوم',it:[['a','أربع ركعات صلاة التوبة (بقراءتها في «قبل السفر»)'],...UP_AFTER_TAWBA,['n','yMalik',100],['n','sal',10]]},
     {t:'مساءً بعد العشاء، جالسًا أمام الكعبة',it:UP_KAABA}],
  think:'تخيّل نور الكعبة يقع على قلبك، ثم يتّسع فيضيء جسدك كله، وما فيك من سوء يتفتّت حتى يطهر باطنك لتكون بين يدي ربك. واسأله أن ينظّف قلبك حتى يشرق كالشمس في الظهيرة. وفي المراقبة: استحضر أنك ساجد لربك بجسدك وعقلك وروحك، لا ملجأ لك إلا إليه؛ فاحمده واستغفره واشكره.',
  tips:['يرفع الرجال صوتهم بالذكر أكثر من النساء، وتجلس النساء بعيدًا عن الرجال؛ فذلك أجمع للقلب.','يجوز ذكر «الله الله» و«الله هو» أثناء الطواف.','صلاة التسبيح تُصلّى عند أول زيارة للحرم، ثم إن شئت داومت عليها.']},
 {k:'madinah',vis:[['upt_madinah',50,55]],t:'المدينة المنورة',ic:'m_mosque',
  intro:'زر الحبيب ﷺ في غاية التواضع والشكر، فهو الذي دلّك على طريق الرحمة. اجلس كأنه جالس معك، واستغفر من تقصيرك في اتباع سنّته، وأكثر من السلام والصلاة عليه.',
  g:[{t:'عند الوصول إلى المسجد النبوي',once:1,it:[['n','dur',100],['n','salam',100],['n','ummi',100],['n','dur',100]]},
     {t:'صباحًا',it:UP_MAD},{t:'مساءً',it:UP_MAD}],
  think:'تخيّل القبر الشريف يضيء ونوره يقع على جسدك، ثم تخيّل نور البيت الحرام يسري إلى القبة الخضراء فيجتمع النوران ويقعان عليك، فتدور حياتك حول ربك وحبيبه ﷺ. وكلما اجتهدت في اتباع سنّته كنت أقرب إليه. وإن لم تره فاعلم أنه ﷺ يُعرض عليه سلامك.',
  tips:['اسأل نفسك: كم تحب الحبيب ﷺ؟ وكم اتبعت سنّته؟ فعلى قدر الاتباع يكون القرب.']},
 {k:'baqi',vis:[['upt_baqi',18,52]],t:'البقيع',ic:'m_drop',
  intro:'كن على وضوء في البقيع وفي كل مكان مبارك تزوره، فهو مثوى كثير من الصحابة رضي الله عنهم.',
  g:[{t:'عند زيارة البقيع',it:[['n','dur',3],['n','haw2',33],['n','subbuh',33],['n','rabbi',33],['n','dur',3]]}],
  think:'تخيّل اسم الله يتلألأ فوق البقيع، ونوره ينزل على عباده الصالحين من الصحابة فيضيء ما حولهم، ثم يدخل قلبك، فتنال ما قسم الله لك من فتح.'},
 {k:'hira',vis:[['upt_hira',38,66],],t:'غار حراء',ic:'mk_s4',
  intro:'هنا نزل أول الوحي، وهنا تعبّد النبي ﷺ ونزل عليه جبريل عليه السلام. زره بقلب شاكر وتواضع شديد.',
  g:[{t:'عند زيارة غار حراء',it:[['n','dur',3],['n','wahdah',10],['n','rabbi',10],['n','jalal',10],['n','mubin',10],['n','dur',3]]}],
  think:'اشكر ربك الذي أنزل القرآن، وحبيبه ﷺ الذي بلّغه إليك. تخيّل نور الغار يشتدّ ثم يقع على قلبك، فيخضع قلبك لكلام ربك ويشتاق إلى لقائه. لولا رسالته ما وصلك هذا الكتاب.'},
 {k:'after',vis:[['upt_after',50,60]],t:'بعد الرجوع',ic:'tree4',
  intro:'إذا رجعت فصلِّ أربع ركعات شكرًا لله أن اختارك لزيارة بيته وحبيبه ﷺ، واحفظ رحلتك في مكان خاص من قلبك.',
  g:[{t:'عند الرجوع',once:1,it:[['a','أربع ركعات صلاة الشكر'],['n','dur',10],['n','yHamid',100],['n','ySamad',100],['n','yMuhaymin',100],['n','yJabbar',100],['n','dur',10]]},
     {t:'كل جمعة',it:[['a','مراقبة تحفظ بها بركة الرحلة',10]]}],
  think:'في مراقبة الجمعة: أغمض عينيك واستعد رحلتك إلى بيت الله وإلى حبيبه ﷺ، وتخيّل روحك ما زالت هناك تؤدّي أعمالها، ونورها يدخل جسدك ثم يحيط به كالدرع يحفظ ما نلت من بركة. ومن حفظ بركته زاده الله منها.',
  tips:['مقاصد الرحلة ثلاثة: تجديد العهد مع الله، فالطواف وعدٌ أن تدور حياتك حول الله ورسوله ﷺ لا حول الدنيا؛ واتباع خطى النبي ﷺ؛ وأن يكون ذلك كله لوجه الله وحده.','بعد الرجوع قم بحقوق الله ورسوله ﷺ وحقوق الناس، واتبع السنة كلها لا ما يوافق هواك، ودلّ غيرك عليها.','ليس المقصود أن ترى منامات أو أحوالًا، فطلبها مدخل للشيطان؛ المقصود الاتباع والتعلّم على يد عالم.']}];
let upTab=null,umSeg=null;const upRun={};let upTick=null;
function upS(){if(!S.umP||S.umP.d!==TODAY)S.umP={d:TODAY,c:{},t:{},a:{}};if(!S.umOnce)S.umOnce={c:{},t:{},a:{}};return S.umP}
const upStore=key=>{const[k,g]=key.split(':'),G=UP.find(x=>x.k===k).g[+g];return G.once?(upS(),S.umOnce):upS()};
function upSecs(key){const P=upStore(key);return (P.t[key]||0)+(upRun[key]?(Date.now()-upRun[key])/1000:0)}
function upDone(key,it){const P=upStore(key);if(it[0]==='a')return !!P.a[key]||(!!it[2]&&upSecs(key)>=it[2]*60);if(it[0]==='n')return (P.c[key]||0)>=it[2];if(it[0]==='m')return upSecs(key)>=it[2]*60||!!P.a[key];return false}
const upMM=s=>{s=Math.max(0,Math.ceil(s));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
function upTabProg(T){let d=0,n=0;T.g.forEach((G,gi)=>G.it.forEach((it,ii)=>{if(it[0]==='r')return;n++;if(upDone(T.k+':'+gi+':'+ii,it))d++}));return [d,n]}
function upItem(T,gi,ii,it){const key=T.k+':'+gi+':'+ii,ok=upDone(key,it),D=UPD[it[1]];
  if(it[0]==='r')return `<li class="up-r"><span>${it[1]}</span>${it[2]?`<b dir="ltr">×${it[2]}</b>`:''}</li>`;
  const okb=ok?`<span class="up-okb" aria-label="${esc(Tx('تمّ'))}">✓</span>`:'';
  if(it[0]==='a')return `<li class="up-i up-a${ok?' ok':''}"><button class="up-ck" data-upa="${key}" aria-pressed="${ok}"><i>${ok?'✓':''}</i><span>${it[1]}${it[2]?` <small>· ${it[2]} <span>دقيقة</span></small>`:''}</span></button>${it[2]?`<div class="up-row">${upTimer(key,it[2],ok)}${upZt(key)}</div>`:''}</li>`;
  const txt=`<p class="up-ar notr" dir="rtl" lang="ar">${D[0]}</p>${LANG!=='ar'?`<small class="up-mn">${D[1]}</small>`:''}`;
  if(it[0]==='n'){const c=Math.min(upStore(key).c[key]||0,it[2]);
    return `<li class="up-i${ok?' ok':''}">${okb}${txt}<div class="up-row"><button class="up-cnt" data-upc="${key}" data-upn="${it[2]}" aria-label="${esc(Tx('اضغط مع كل مرة'))}"><b dir="ltr" id="upc-${key.replace(/:/g,'-')}">${c} / ${it[2]}</b><small>${ok?'✓':'<span>اضغط مع كل مرة</span>'}</small></button>${c?`<button class="up-z" data-upz="${key}" aria-label="${esc(Tx('من جديد'))}">↺</button>`:''}</div></li>`}
  return `<li class="up-i${ok?' ok':''}">${okb}${txt}<div class="up-row">${upTimer(key,it[2],ok)}${upZt(key)}</div></li>`}
/* «من جديد» for a timed dhikr: shown once it has started (running, paused or finished) */
function upZt(key){return upRun[key]||upSecs(key)>0||upStore(key).a[key]?`<button class="up-z" data-upzt="${key}" aria-label="${esc(Tx('من جديد'))}">↺</button>`:''}
/* sounds: a soft chime when a timed dhikr starts, a fuller one when its time is over (and when a counted dhikr is complete).
   While a timer runs, a silent loop keeps the page awake so the end chime can still sound with the screen locked. */
function upSnd(k){try{if(k==='start'){sndUnlock();soundStep()}else{sndPlay('end',()=>bell([523,659,784,1047],.32,2.4,.4));try{navigator.vibrate&&navigator.vibrate([200,100,200,100,400])}catch(e){}if(!Object.keys(upRun).length&&!(typeof run!=='undefined'&&run&&!run.done))sndStop()}}catch(e){}}
function upTimer(key,min,ok){const run=!!upRun[key],left=min*60-upSecs(key);
  return `<button class="up-tm${run?' run':''}${ok?' ok':''}" data-upt="${key}" data-upm="${min}"><span class="up-tg" aria-hidden="true">${ok?'✓':run?'❚❚':'▶'}</span><b dir="ltr" id="upt-${key.replace(/:/g,'-')}">${ok?min+':00':upMM(left)}</b><small>${ok?'<span>تمّ</span>':run?'<span>إيقاف مؤقت</span>':`${min} <span>دقيقة</span>`}</small></button>`}
function viewUmProg(){upS();if(Object.keys(upRun).length)upTickOn();const T=UP.find(x=>x.k===upTab)||UP[0];upTab=T.k;
  return `<section class="up">
   <p class="meta up-src">من كتيّب «أعمال الحج والعمرة» للطريقة المحمدية. افعل منه ما تستطيع؛ والأعداد والمدد المذكورة هي الأصل.</p>
   <div class="up-tabs" role="tablist">${UP.map(x=>{const[d,n]=upTabProg(x);return `<button role="tab" aria-selected="${x.k===T.k}" class="${x.k===T.k?'on':''}${n&&d>=n?' dn':''}" data-uptab="${x.k}"><span>${n&&d>=n?'✓ ':''}${x.t}</span>${d?`<small dir="ltr">${d}/${n}</small>`:''}</button>`}).join('')}</div>
   <article class="box up-card">${IL_IMG.has(T.ic)?`<div class="up-art">${ilSvg(T.ic)}</div>`:''}<div class="pad"><h3>${T.t}</h3><p class="up-in">${T.intro}</p></div></article>
   ${T.g.map((G,gi)=>{const P=G.it.filter(it=>it[0]!=='r'),dn=P.filter((it,ii)=>upDone(T.k+':'+gi+':'+G.it.indexOf(it),it)).length;
     return `<div class="sh up-sh${P.length&&dn>=P.length?' dn':''}"><h2>${P.length&&dn>=P.length?'<i class="up-gok" aria-hidden="true">✓</i>':''}${G.t}</h2>${P.length?`<span dir="ltr">${dn} / ${P.length}</span>`:''}</div>${G.once?'<p class="meta up-once">مرة واحدة في الرحلة</p>':''}
     <ol class="box up-list${G.it[0][0]==='r'?' up-rl':''}">${G.it.map((it,ii)=>upItem(T,gi,ii,it)).join('')}</ol>`}).join('')}
   <div class="box up-th">${T.vis?upVis(T.vis[0]):''}<div class="pad"><b>ما تستحضره</b><p>${T.think}</p></div>${T.vis&&T.vis[1]?`${upVis(T.vis[1])}`:''}</div>
   ${T.tips?`<div class="box pad up-tips"><b>نصائح</b><ul>${T.tips.map(t=>`<li>${t}</li>`).join('')}</ul></div>`:''}
   ${T.k==='makkah'||T.k==='madinah'?'<p class="meta">اليوم يبدأ من جديد كل يوم، وما يُفعل مرة واحدة يبقى محفوظًا طوال الرحلة.</p>':''}
   <button class="btn link-btn up-reset" data-upreset="1">مسح علامات الرحلة والبدء من جديد</button></section>`}
function upTickOn(){if(upTick)return;upTick=setInterval(()=>{const ks=Object.keys(upRun);if(!ks.length){clearInterval(upTick);upTick=null;keepAwake(false);return}
  ks.forEach(key=>{const[k,g,i]=key.split(':'),it=UP.find(x=>x.k===k).g[+g].it[+i],min=it[2],left=min*60-upSecs(key),el=document.getElementById('upt-'+key.replace(/:/g,'-'));
    if(left<=0){const P=upStore(key);P.t[key]=min*60;delete upRun[key];save();upSnd('end');if(screen==='umrah'){const y=SCR().scrollTop;render();SCR().scrollTo(0,y)}}
    else if(el&&screen==='umrah')el.textContent=upMM(left)})},1000)}
function upEvent(d){if(d.umseg){umSeg=d.umseg;S.umSeg=umSeg;save();return 1}
  if(d.uptab){upTab=d.uptab;return 1}
  if(d.upa){const P=upStore(d.upa);P.a[d.upa]=P.a[d.upa]?0:1;if(!P.a[d.upa]&&upRun[d.upa])delete upRun[d.upa];save();return 1}
  if(d.upz){const P=upStore(d.upz);P.c[d.upz]=0;save();return 1}
  if(d.upzt){const k=d.upzt,P=upStore(k);delete upRun[k];P.t[k]=0;P.a[k]=0;save();return 1}
  if(d.upt){const key=d.upt,P=upStore(key);if(upDone(key,['m',0,+d.upm]))return 0;if(upRun[key]){P.t[key]=upSecs(key);delete upRun[key]}else{upRun[key]=Date.now();upTickOn();upSnd('start');keepAwake(true)}save();return 1}
  if(d.upreset){if(!confirm(Tx('مسح علامات الرحلة كلها؟')))return 0;S.umP=null;S.umOnce=null;for(const k in upRun)delete upRun[k];try{sndStop()}catch(e){}save();return 1}
  return 0}
/* the counter: one tap = one time, updated in place (no re-render, so the page does not jump) */
function upCount(btn){const key=btn.dataset.upc,n=+btn.dataset.upn,P=upStore(key);if((P.c[key]||0)>=n)return;const c=Math.min(n,(P.c[key]||0)+1);if(c===1)try{sndUnlock()}catch(e){}if(c>=n)upSnd('end');P.c[key]=c;save();
  const b=btn.querySelector('b');if(b)b.textContent=c+' / '+n;try{navigator.vibrate&&navigator.vibrate(c>=n?[40,60,40]:8)}catch(e){}
  if(c>=n){const y=SCR().scrollTop;render();SCR().scrollTo(0,y)}else if(c===1){const y=SCR().scrollTop;render();SCR().scrollTo(0,y)}}
/* «ما تستحضره» pictured: a slow camera drift, the light breathing at the heart, golden sparks rising (all CSS, still with reduced motion) */
function upVis([img,x,y,cap]){const sp=Array.from({length:14},(_,i)=>`<i style="left:${(x+((i*37)%41)-20).toFixed(0)}%;--d:${(i*0.53)%4+3}s;--w:${(i*0.71)%5}s;--s:${2+i%3}px"></i>`).join('');
  return `<figure class="up-vis" style="--fx:${x}%;--fy:${y}%"><img src="il/${img}.webp" alt="" loading="lazy" decoding="async"><span class="up-glow" aria-hidden="true"></span><span class="up-sp" aria-hidden="true">${sp}</span>${cap?`<figcaption>${cap}</figcaption>`:''}</figure>`}
