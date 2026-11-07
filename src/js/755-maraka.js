/* ---------- «معركة اليوم»: a game against Satan, one battle a day ----------
   Each level is one of Satan's ways into the heart, with five tasks. The five prayers are always the first task and are
   required; the battle is won with the prayers and at least three of the four other tasks. The result is announced after
   Isha (or once every task is done). Five wins within seven days open the next level.
   A won battle: the shadow evaporates. A lost one: it laughs, then «خسارة معركة لا تعني خسارة الحرب» and the door of
   istighfar, which silences it. The shadow has no face or shape, only smoke. */
const MK_AUTO={
  pr5:L=>FIVE.every(([k])=>(L.prayers||[]).includes(k)),
  fajr:L=>(L.prayers||[]).includes('fajr'),
  sabah:L=>L.awrad.includes('sabah'),masa:L=>L.awrad.includes('masa'),adh2:L=>L.awrad.includes('sabah')&&L.awrad.includes('masa'),
  quran:L=>L.awrad.includes('quran'),qiyam:L=>L.awrad.includes('qiyam'),sadaqa:L=>L.awrad.includes('sadaqa'),help:L=>L.awrad.includes('help'),
  mh:(L,d)=>{try{return mhOn(d)}catch(e){return false}}};
const MK_GO={pr5:'aamal',fajr:'aamal',sabah:'adh_sabah',masa:'adh_masa',adh2:'aamal',quran:'quran',qiyam:'aamal',sadaqa:'aamal',help:'aamal',mh:'muhasaba'};
const MK_PR={a:'pr5',t:'الصلوات الخمس في أوقاتها',s:'الفريضة أولًا: بها تبدأ كل معركة'};
const MK_LV=[
 {t:'الغفلة',s:'يبدأ بإنسائك ذكر الله',img:'ghafla',v:'﴿وَلَا تُطِعْ مَنْ أَغْفَلْنَا قَلْبَهُ عَن ذِكْرِنَا﴾',k:[
  {a:'sabah',t:'أذكار الصباح',s:'حصنك قبل أن تخرج'},{a:'masa',t:'أذكار المساء',s:'حصنك حين يقبل الليل'},
  {t:'مئة استغفار',s:'متفرقة في يومك'},{t:'آية الكرسي قبل النوم',s:'لا يقربك شيطان حتى تصبح'}]},
 {t:'الكسل والتسويف',s:'«سوف أفعل غدًا»',img:'m_path',v:'﴿وَلَا تَتَّبِعُوا خُطُوَاتِ الشَّيْطَانِ﴾',k:[
  {a:'fajr',t:'صلاة الصبح في وقتها',s:'أول انتصار في اليوم'},{a:'quran',t:'ورد القرآن',s:'ولو صفحة'},
  {t:'إنجاز عمل أجّلته',s:'ابدأ به قبل غيره'},{t:'السنن الرواتب',s:'قبل الفريضة أو بعدها'}]},
 {t:'آفات اللسان',s:'كلمة لا يلقي لها بالًا',img:'m_door',v:'﴿مَا يَلْفِظُ مِن قَوْلٍ إِلَّا لَدَيْهِ رَقِيبٌ عَتِيدٌ﴾',k:[
  {t:'يوم بلا غيبة',s:'وإن سمعتها فغيّر الحديث'},{t:'ترك الجدال',s:'ولو كنت محقًّا'},
  {t:'كلمة طيبة لثلاثة أشخاص',s:'والكلمة الطيبة صدقة'},{t:'الصمت عمّا لا يعنيك',s:'من حسن إسلام المرء'}]},
 {t:'النظر والشاشة',s:'سهم من سهامه',img:'m_lamp',v:'﴿قُل لِّلْمُؤْمِنِينَ يَغُضُّوا مِنْ أَبْصَارِهِمْ﴾',k:[
  {t:'غضّ البصر',s:'في الطريق وعلى الشاشة'},{t:'ساعة كاملة بلا هاتف',s:'اختر وقتها بنفسك'},
  {t:'لا تصفّح بعد العشاء',s:'إلا لحاجة'},{t:'قراءة صفحة نافعة',s:'بدل التمرير'}]},
 {t:'الغضب',s:'جمرة يوقدها في القلب',img:'ghadab',v:'﴿وَالْكَاظِمِينَ الْغَيْظَ وَالْعَافِينَ عَنِ النَّاسِ﴾',k:[
  {t:'الاستعاذة عند أول انفعال',s:'«أعوذ بالله من الشيطان الرجيم»'},{t:'العفو عن شخص',s:'في قلبك قبل لسانك'},
  {t:'الابتسامة في وجه من أساء',s:'تطفئ النار'},{t:'الدعاء لمن ضايقك',s:'بظهر الغيب'}]},
 {t:'البخل وحبّ الدنيا',s:'يعدك الفقر',img:'dunya',v:'﴿الشَّيْطَانُ يَعِدُكُمُ الْفَقْرَ وَيَأْمُرُكُم بِالْفَحْشَاءِ﴾',k:[
  {a:'sadaqa',t:'صدقة اليوم',s:'ولو بشقّ تمرة'},{a:'help',t:'مساعدة شخص',s:'قضاء حاجة أو عون'},
  {t:'صلة رحم',s:'ولو بمكالمة'},{t:'كتابة نعمة تشكر الله عليها',s:'بعينها لا بالجملة'}]},
 {t:'الرياء والعُجب',s:'يفسد العمل بعد أن تعمله',img:'riya',v:'﴿وَلَا يُشْرِكْ بِعِبَادَةِ رَبِّهِ أَحَدًا﴾',k:[
  {t:'عمل صالح خفيّ',s:'لا يعلمه أحد'},{t:'لا تذكر إنجازاتك اليوم',s:'لا قولًا ولا نشرًا'},
  {t:'ركعتان في خلوة',s:'بينك وبين الله'},{t:'دعاء الإخلاص',s:'«اللهم إني أعوذ بك أن أشرك بك وأنا أعلم، وأستغفرك لما لا أعلم»'}]},
 {t:'الوسوسة',s:'يوسوس ثم يخنس',img:'m_drop',v:'﴿مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ﴾',k:[
  {t:'المعوّذتان صباحًا ومساءً',s:'ثلاث مرات'},{t:'الإعراض عن الوسواس',s:'لا تسترسل معه ولا تجادله'},
  {t:'قراءة من سورة البقرة في البيت',s:'ينفر منه الشيطان'},{t:'البقاء على طهارة',s:'جدّد وضوءك'}]},
 {t:'اليأس والقنوط',s:'«ذنوبك أكبر من أن تُغفر»',img:'m_heart',v:'﴿لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ﴾',k:[
  {t:'تأمّل آية رجاء',s:'اقرأها ببطء مرتين'},{t:'الاستغفار بعد الذنب فورًا',s:'لا تؤجّل التوبة'},
  {t:'«لا حول ولا قوة إلا بالله» مئة مرة',s:'كنز من كنوز الجنة'},{t:'الدعاء بإلحاح في السجود',s:'أقرب ما يكون العبد من ربه'}]},
 {t:'الثبات',s:'الحرب لا تنتهي ما دامت الروح في الجسد',img:'m_climb',v:'﴿إِنَّ الَّذِينَ قَالُوا رَبُّنَا اللَّهُ ثُمَّ اسْتَقَامُوا﴾',k:[
  {a:'qiyam',t:'قيام الليل',s:'ولو ركعتين'},{a:'quran',t:'ورد القرآن',s:'مع التدبر'},
  {a:'mh',t:'محاسبة الليلة',s:'قبل أن تنام'},{a:'adh2',t:'أذكار الصباح والمساء',s:'كلاهما'}]}];
const MK_WIN_N=5,MK_WIN_IN=7;
let mkAnim=null,mkSnd=null;
function mkS(){const M=S.mk=S.mk||{};M.lv=M.lv||0;M.d=M.d||{};return M}
const mkTasks=lv=>[MK_PR,...MK_LV[lv].k];
const mkLog=d=>S.log[d]||{awrad:[],prayers:[]};
function mkDone(d){const M=mkS(),D=M.d[d]||{},lv=D.lv!=null?D.lv:M.lv,L=mkLog(d);
  return mkTasks(lv).map((x,j)=>x.a?!!MK_AUTO[x.a]({awrad:L.awrad||[],prayers:L.prayers||[]},d):(D.m||[]).includes(j))}
const mkWon=d=>{const f=mkDone(d);return f[0]&&f.filter(Boolean).length>=4};
const mkWins=()=>{const M=mkS();let n=0;for(let i=0;i<MK_WIN_IN;i++){const D=M.d[addDays(TODAY,-i)];if(D&&D.r==='w'&&D.lv===M.lv)n++}return n};
/* the day of the battle: created when the seeker opens the game; earlier unjudged days are judged on their own data */
function mkDay(){const M=mkS();
  Object.keys(M.d).filter(d=>d<TODAY&&!M.d[d].r).forEach(d=>{M.d[d].r=mkWon(d)?'w':'l';M.d[d].late=1});
  if(!M.d[TODAY])M.d[TODAY]={lv:M.lv,m:[]};
  const old=addDays(TODAY,-60);Object.keys(M.d).forEach(d=>{if(d<old)delete M.d[d]});
  return M.d[TODAY]}
function mkCanJudge(){const f=mkDone(TODAY);if(f.every(Boolean))return true;try{return dH()>=prayerTimes(new Date()).isha+0.5}catch(e){return dH()>=21}}
/* the scene: the seeker, and the shadow whose strength is what remains of the day's tasks */
function mkScene(st,left){const k=Math.max(.25,left/5),dawn=st==='w';
  return `<div class="mk-scene mk-${st}" style="--mk:${k}" role="img" aria-label="${esc(Tx(st==='w'?'تبخّر الشيطان واختفى':st==='l'?'الشيطان يضحك':st==='i'?'خنس الشيطان بالاستغفار':'الشيطان أمامك'))}">
  <svg viewBox="0 0 360 230" aria-hidden="true">
   <defs><linearGradient id="mkSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${dawn?'#f4c98a':'#152536'}"/><stop offset=".65" stop-color="${dawn?'#fbe7c4':'#243c4f'}"/><stop offset="1" stop-color="${dawn?'#fff4df':'#35505f'}"/></linearGradient>
    <radialGradient id="mkSm"><stop offset="0" stop-color="#0b0a10" stop-opacity=".95"/><stop offset=".55" stop-color="#17141f" stop-opacity=".75"/><stop offset="1" stop-color="#2a2433" stop-opacity="0"/></radialGradient>
    <radialGradient id="mkLt"><stop offset="0" stop-color="#fff6d8" stop-opacity=".95"/><stop offset="1" stop-color="#fff6d8" stop-opacity="0"/></radialGradient>
    <filter id="mkBlur" x="-30%" y="-30%" width="160%" height="160%"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="4"><animate attributeName="baseFrequency" dur="9s" values=".035;.05;.035" repeatCount="indefinite"/></feTurbulence><feDisplacementMap in="SourceGraphic" scale="26"/><feGaussianBlur stdDeviation="2.5"/></filter></defs>
   <rect width="360" height="230" fill="url(#mkSky)"/>
   ${dawn?`<circle cx="250" cy="150" r="70" fill="url(#mkLt)"/>`:[[30,30],[70,55],[120,22],[300,40],[330,70],[200,18],[255,60]].map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="${i%3?1.2:1.8}" fill="#f6e7b0" opacity=".8"/>`).join('')+`<path d="M318 26a14 14 0 1 0 10 24a11 11 0 1 1 -10 -24z" fill="#f3dc9a"/>`}
   <path d="M0 192 Q90 176 180 186 T360 182 V230 H0z" fill="${dawn?'#d9b98a':'#1d3140'}"/>
   <path d="M282 188v-34l6-10 6 10v34z M276 188h24" fill="${dawn?'#b48d5e':'#122230'}" opacity=".8"/>
   <g class="mk-me"><ellipse cx="96" cy="196" rx="24" ry="4" fill="#000" opacity=".18"/>${ilFig(96,196,1.25,st==='w'?'takbir':st==='i'?'dua':st==='l'?'bow':'stand')}
    ${st==='w'?`<circle cx="96" cy="140" r="52" fill="url(#mkLt)" opacity=".6"/>`:''}</g>
   <g class="mk-sh"><g class="mk-shb" filter="url(#mkBlur)">
    <ellipse cx="236" cy="132" rx="58" ry="66" fill="url(#mkSm)"/><ellipse cx="214" cy="96" rx="34" ry="36" fill="url(#mkSm)"/><ellipse cx="262" cy="110" rx="30" ry="40" fill="url(#mkSm)"/><ellipse cx="236" cy="182" rx="66" ry="20" fill="url(#mkSm)"/></g>
    ${st==='w'?Array.from({length:14},(_,i)=>`<circle class="mk-p" style="--i:${i}" cx="${190+i*7%96}" cy="${150-i*5%60}" r="${3+i%4}" fill="#3a3344"/>`).join(''):''}</g>
  </svg>${st==='l'?`<button class="mk-snd" data-mksnd="1" aria-pressed="${!!S.mkSnd}" aria-label="${esc(Tx('صوت الضحكة'))}">${S.mkSnd?'🔊':'🔈'}</button>`:''}</div>`}
/* a short, low laugh drawn with the Web Audio API; only when the seeker turned the sound on */
function mkLaugh(){if(!S.mkSnd)return;try{const C=mkSnd=mkSnd||new (window.AudioContext||window.webkitAudioContext)(),t=C.currentTime+.05;
  [0,.32,.62,.9].forEach((o,i)=>{const g=C.createGain(),f=C.createBiquadFilter(),s=C.createOscillator();s.type='sawtooth';s.frequency.setValueAtTime(150-i*12,t+o);s.frequency.exponentialRampToValueAtTime(90-i*8,t+o+.24);
   f.type='lowpass';f.frequency.value=700;g.gain.setValueAtTime(0,t+o);g.gain.linearRampToValueAtTime(.22,t+o+.03);g.gain.exponentialRampToValueAtTime(.001,t+o+.26);s.connect(f);f.connect(g);g.connect(C.destination);s.start(t+o);s.stop(t+o+.3)})}catch(e){}}
function mkResult(D){if(D.r==='w')return `<div class="box pad mk-res w"><p class="mk-rt">انتصرتَ في معركة اليوم</p><p class="mk-v notr" dir="rtl" lang="ar">﴿إِنَّ كَيْدَ الشَّيْطَانِ كَانَ ضَعِيفًا﴾</p><p class="meta">تبخّر الشيطان واختفى. احمد الله، فما كان النصر إلا من عنده.</p></div>`;
  if(D.ist)return `<div class="box pad mk-res i"><p class="mk-rt">خنس الشيطان باستغفارك</p><p class="meta">قال إبليس: «وعزتك لا أبرح أغوي عبادك ما دامت أرواحهم في أجسادهم»، فقال الله تعالى: «وعزتي وجلالي لا أزال أغفر لهم ما استغفروني».</p><p class="meta">غدًا معركة جديدة، وأنت أقوى بما تعلّمته اليوم.</p></div>`;
  return `<div class="box pad mk-res l"><p class="mk-rt">خسارة معركة لا تعني خسارة الحرب</p><p class="meta">«كل ابن آدم خطّاء، وخير الخطّائين التوابون». أغلق عليه الباب الآن.</p><button class="btn ok" data-mkist="1">أستغفر الله وأتوب إليه</button></div>`}
function viewMaraka(){const M=mkS(),D=mkDay(),lv=D.lv,L=MK_LV[lv],T=mkTasks(lv),f=mkDone(TODAY),n=f.filter(Boolean).length,can=mkCanJudge();
  const st=D.r==='w'?'w':D.r==='l'?(D.ist?'i':'l'):'f',wins=mkWins(),up=M.up===TODAY;
  if(mkAnim===TODAY&&st==='l'){mkAnim=null;setTimeout(mkLaugh,350)}
  return `<section class="mk">
   ${up?`<div class="box pad mk-up"><p class="mk-rt">فُتح لك حصن جديد</p><p class="meta"><span>انتصرتَ</span> ${MK_WIN_N} <span>مرات في أسبوع، فانتقلتَ إلى المستوى</span> ${M.lv+1}: <span>${MK_LV[M.lv].t}</span></p></div>`:''}
   <div class="mk-lvh"><p class="mk-k"><span>المستوى</span> ${lv+1} / ${MK_LV.length}</p><h3>${L.t}</h3><p class="meta">${L.s}</p><p class="mk-v notr" dir="rtl" lang="ar">${L.v}</p></div>
   ${mkScene(st,5-n)}
   <div class="mk-bar" aria-hidden="true"><span>قوة الشيطان</span><i><b style="width:${st==='w'?0:Math.round((5-n)/5*100)}%"></b></i></div>
   ${D.r?mkResult(D):''}
   <div class="box mk-tasks"><p class="mk-th"><span>مهام اليوم</span> <b dir="ltr">${n} / 5</b></p>
    <ul>${T.map((x,j)=>{const on=f[j];return `<li><button class="mk-t${on?' on':''}${x.a?' au':''}" ${x.a?`data-go="${MK_GO[x.a]}"`:`data-mkt="${j}"`} aria-pressed="${on}"${D.r?' disabled':''}><i aria-hidden="true">${on?'✓':''}</i><span><b>${x.t}</b><small>${x.s}</small>${x.a?`<small class="mk-au">${on?'سُجّلت في أعمالك':'تُسجَّل من أعمالك، اضغط لتسجّلها'}</small>`:''}${j===0?' <em>لا بدّ منها</em>':''}</span></button></li>`}).join('')}</ul>
    ${D.r?'':`<button class="btn ok mk-j" data-mkj="1"${can?'':' disabled'}>أعلن نتيجة المعركة</button><p class="meta mk-m">${can?'الانتصار: الصلوات الخمس، وثلاث مهام على الأقل من الأربع.':'تُعلن النتيجة بعد العشاء، أو حين تُنجز كل المهام.'}</p>`}
   </div>
   <div class="box pad mk-wk"><p class="mk-th"><span>انتصاراتك في هذا المستوى، آخر سبعة أيام</span> <b dir="ltr">${wins} / ${MK_WIN_N}</b></p>
    <div class="mk-days">${Array.from({length:MK_WIN_IN},(_,i)=>{const d=addDays(TODAY,i-MK_WIN_IN+1),x=M.d[d];return `<i class="${x&&x.r?x.r:''}${d===TODAY?' t':''}" title="${d}">${x&&x.r==='w'?'✓':x&&x.r==='l'?'·':''}</i>`}).join('')}</div>
    <p class="meta">${MK_WIN_N} <span>انتصارات في سبعة أيام تفتح المستوى التالي.</span></p></div>
   <h3 class="mk-mh">حصون الطريق</h3>
   <div class="mk-map">${MK_LV.map((x,i)=>`<div class="mk-f${i<M.lv?' done':i===M.lv?' cur':' lock'}"><div class="mk-fi">${ilSvg(x.img)}${i>M.lv?'<span class="mk-lk" aria-hidden="true">🔒</span>':i<M.lv?'<span class="mk-lk ok" aria-hidden="true">✓</span>':''}</div><span><small dir="ltr">${i+1}</small> ${x.t}</span></div>`).join('')}</div>
   <p class="meta" style="margin-top:12px">ليست هذه لعبة للتسلية فقط: كل مهمة عمل حقيقي تتقرّب به إلى الله. والصدق مع نفسك هو شرط الانتصار.</p>
  </section>`}
document.addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;const d=t.dataset;
  if(d.mkt!==undefined){const D=mkDay(),j=+d.mkt;if(D.r)return;D.m=D.m.includes(j)?D.m.filter(x=>x!==j):[...D.m,j];save();const y=SCR().scrollTop;render();SCR().scrollTo(0,y);return}
  if(d.mkj){const M=mkS(),D=mkDay();if(D.r||!mkCanJudge())return;D.r=mkWon(TODAY)?'w':'l';
    if(D.r==='w'){try{navigator.vibrate&&navigator.vibrate([40,60,40])}catch(x){}if(mkWins()>=MK_WIN_N&&M.lv<MK_LV.length-1){M.lv++;M.up=TODAY}}else mkAnim=TODAY;
    save();render();SCR().scrollTo({top:0,behavior:'smooth'});return}
  if(d.mkist){const D=mkDay();D.ist=1;save();render();return}
  if(d.mksnd){S.mkSnd=!S.mkSnd;save();render();if(S.mkSnd)mkLaugh();return}
});
