/* ---------- التسميع: the app listens to the user's recitation from memory ---------- */
const RW_N={warsh:'ورش عن نافع',qaloon:'قالون عن نافع',hafs:'حفص عن عاصم',shouba:'شعبة عن عاصم',doori:'الدوري عن أبي عمرو',soosi:'السوسي عن أبي عمرو',bazzi:'البزي عن ابن كثير',qumbul:'قنبل عن ابن كثير'};
const RWD={},RWF={};let tsMsg='',TSR=null,tsRes=null;
const TS_SR=()=>window.SpeechRecognition||window.webkitSpeechRecognition;
function tsSt(){S.tasmi=S.tasmi||{rw:'warsh',s:0,a1:1,a2:7,hide:true,hist:[]};const t=S.tasmi;if(!RW_N[t.rw])t.rw='warsh';t.hist=t.hist||[];return t}
function tsLoad(rw){if(RWD[rw]||RWD[rw+'_p'])return;RWD[rw+'_p']=1;
  fetch('data/rw/'+rw+'.json').then(r=>{if(!r.ok)throw 0;return r.json()}).then(d=>{RWD[rw]=d;delete RWD[rw+'_p'];if(screen==='tasmi')render()}).catch(()=>{delete RWD[rw+'_p'];tsMsg='تعذّر تحميل نص الرواية. تحقق من الاتصال ثم أعد المحاولة.';if(screen==='tasmi')render()});
  if(!RWF[rw]&&window.FontFace){try{const f=new FontFace('KF_'+rw,`url(fonts/${rw}.woff2)`);RWF[rw]=f;f.load().then(x=>{document.fonts.add(x);if(screen==='tasmi')render()}).catch(()=>{})}catch(e){}}}
const tsDig=n=>String(n).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);
function tsAyat(){const t=tsSt(),D=RWD[t.rw];if(!D)return null;const A=D.s[t.s]||[],n=A.length;t.a1=Math.max(1,Math.min(n,t.a1|0||1));t.a2=Math.max(t.a1,Math.min(n,t.a2|0||t.a1));return {A,n}}
function tsWords(){const t=tsSt(),X=tsAyat(),E=[];for(let a=t.a1;a<=t.a2;a++)X.A[a-1].split(/\s+/).forEach(w=>{const k=tsKey(w);if(k[0])E.push({w,k,a,st:0})});return E}
const tsSay=w=>w.replace(/[ۖ-ۭ]/g,'');
function tsSpeak(txt,then){if(!TSR)return;TSR.speaking=true;try{TSR.rec&&TSR.rec.abort()}catch(e){}
  const fin=()=>{if(!TSR)return;TSR.speaking=false;TSR.last=Date.now();if(TSR.on)tsRec();then&&then()};
  if(!TTS_OK){setTimeout(fin,600);return}try{speechSynthesis.cancel()}catch(e){}
  const u=new SpeechSynthesisUtterance(txt),v=ttsVoice('ar');u.lang=v?v.lang:'ar-SA';if(v)u.voice=v;u.rate=.9;let done=false;const f=()=>{if(!done){done=true;setTimeout(fin,60)}};u.onend=f;u.onerror=f;setTimeout(f,3000);speechSynthesis.speak(u)}
function tsRec(){const SR=TS_SR();if(!SR||!TSR)return;const r=new SR();r.lang='ar-SA';r.continuous=true;r.interimResults=true;r.maxAlternatives=1;TSR.rec=r;TSR.seg=[];
  /* a word is counted as soon as the recogniser has given it twice in a row (it no longer changes), or when the phrase is final:
     no waiting for the end of the phrase, and no judging a word the recogniser is still revising */
  r.onresult=e=>{if(!TSR||TSR.speaking)return;const nw=[];let live='';
    for(let i=0;i<e.results.length;i++){const R=e.results[i],tx=R[0].transcript||'',tk=tx.trim().split(/\s+/).filter(Boolean),st=TSR.seg[i]||(TSR.seg[i]={c:0,prev:[]});live+=' '+tx;
      if(R.isFinal){if(tk.length>st.c)nw.push(...tk.slice(st.c));st.c=Math.max(st.c,tk.length);st.prev=tk;continue}
      let s=0;while(s<tk.length-1&&tk[s]===st.prev[s])s++;if(s>st.c){nw.push(...tk.slice(st.c,s));st.c=s}st.prev=tk}
    if(live.trim())TSR.last=Date.now();tsHear(live);
    if(nw.length){tsFeed(TSR.T,nw,{err:tsErr,fath:tsFath,done:tsDone});tsPaint()}};
  r.onerror=e=>{if(!TSR)return;if(e.error==='not-allowed'||e.error==='service-not-allowed'){tsStop();tsMsg='لم يُسمح باستعمال الميكروفون. اسمح للتطبيق باستعماله من إعدادات المتصفح ثم أعد المحاولة.';render()}};
  /* the recogniser stops by itself after a pause: count what it heard last, then listen again at once */
  r.onend=()=>{if(!TSR||TSR.rec!==r)return;if(!TSR.speaking){const nw=[];(TSR.seg||[]).forEach(st=>{if(st.prev.length>st.c){nw.push(...st.prev.slice(st.c));st.c=st.prev.length}});
      if(nw.length){tsFeed(TSR.T,nw,{err:tsErr,fath:tsFath,done:tsDone});tsPaint()}}
    if(TSR&&TSR.on&&!TSR.speaking&&TSR.rec===r)tsRec()};
  try{r.start()}catch(e){}}
function tsHear(t){const el=document.getElementById('tsHear');if(el){const w=t.trim().split(/\s+/);el.textContent=w.slice(-6).join(' ')}}
function tsStart(){if(!TS_SR()){tsMsg='nosr';render();return}const E=tsWords();if(!E.length)return;tsMsg='';tsRes=null;
  TSR={T:tsNew(E),on:true,speaking:false,last:Date.now()+3000,t0:Date.now()};tsRec();TSR.tick=setInterval(tsTick,500);render()}
function tsStop(){if(!TSR)return;TSR.on=false;clearInterval(TSR.tick);try{TSR.rec&&TSR.rec.abort()}catch(e){}try{speechSynthesis.cancel()}catch(e){}TSR=null}
function tsTick(){if(!TSR||!TSR.on||TSR.speaking)return;const T=TSR.T;if(T.p>=T.E.length)return;
  if(Date.now()-TSR.last>(T.begun?5500:9000))tsFath(T.p)}
function tsErr(){if(!TSR)return;try{navigator.vibrate&&navigator.vibrate(180)}catch(e){}tsFlash('أَعِدْ');tsSpeak('أَعِدْ')}
function tsFath(p){if(!TSR)return;const T=TSR.T;p=tsPrompt(T);if(p<0)return;tsPaint();tsFlash(Tx('فتح عليك'));tsSpeak(tsSay(T.E[p].w))}
function tsFlash(t){const el=document.getElementById('tsSt');if(el){el.textContent=t;el.classList.add('on');clearTimeout(tsFlash.h);tsFlash.h=setTimeout(()=>{el.classList.remove('on');el.textContent=Tx('أسمعك… اقرأ من حفظك')},1600)}}
function tsDone(){if(!TSR)return;const T=TSR.T,t=tsSt();const ok=T.E.filter(x=>x.st===1).length;
  tsRes={n:T.E.length,ok,err:T.err,fath:T.fath,bad:T.E.filter(x=>x.st===2||x.f).map(x=>x.w),s:t.s,a1:t.a1,a2:t.a2,rw:t.rw,full:t.a1===1&&t.a2===tsAyat().n};
  t.hist.unshift({d:TODAY,rw:t.rw,s:t.s,a1:t.a1,a2:t.a2,n:T.E.length,e:T.err,f:T.fath});t.hist=t.hist.slice(0,30);save();
  const msg=T.err||T.fath?'أتممت. راجع الكلمات المعلَّمة.':'ما شاء الله، تسميع بلا خطأ.';tsStop();
  render();setTimeout(()=>{try{const u=new SpeechSynthesisUtterance(T.err||T.fath?'أَتْمَمْتَ':'مَا شَاءَ اللَّهُ'),v=ttsVoice('ar');u.lang=v?v.lang:'ar-SA';if(v)u.voice=v;speechSynthesis.speak(u)}catch(e){}},300)}
function tsPaint(){if(!TSR)return;const T=TSR.T;T.E.forEach((x,i)=>{const el=document.getElementById('tw'+i);if(el)el.className='tw s'+x.st+(i===T.p?' cur':'')});
  const c=document.getElementById('tw'+T.p);if(c){const r=c.getBoundingClientRect();if(r.top>innerHeight*.7||r.top<90)c.scrollIntoView({block:'center',behavior:'smooth'})}
  const pr=document.getElementById('tsPr');if(pr)pr.style.width=(T.p/T.E.length*100)+'%';const ec=document.getElementById('tsEc');if(ec)ec.textContent=T.err}
function viewTasmi(){const t=tsSt();tsLoad(t.rw);const D=RWD[t.rw],SR=!!TS_SR(),live=!!TSR,ff=`'KF_${t.rw}','Amiri Quran',serif`;
  const opts=(n,v)=>Array.from({length:n},(_,i)=>`<option value="${i+1}"${i+1===v?' selected':''}>${i+1}</option>`).join('');
  const intro=`<div class="box pad ts-in"><b>سمّع حفظك بصوتك</b><p>اقرأ من حفظك، والتطبيق يستمع: يسكت ما دمت تقرأ صوابًا، ويقول لك «أَعِدْ» إذا أخطأت، ويفتح عليك بالكلمة التالية إذا نسيت أو توقفت.</p></div>`;
  const nosr=!SR||tsMsg==='nosr'?`<div class="box pad tz-note ts-warn"><b>التسميع غير متاح في هذا المتصفح</b><p>يحتاج التسميع إلى خاصية التعرف على الكلام: افتح التطبيق في Chrome على أندرويد، أو في Safari على آيفون مع تفعيل الإملاء (Dictation) من إعدادات لوحة المفاتيح.</p></div>`:'';
  if(!D)return `<section class="ts">${intro}${nosr}<p class="muted">${tsMsg&&tsMsg!=='nosr'?esc(tsMsg):'جارٍ تحميل نص الرواية…'}</p></section>`;
  const X=tsAyat();
  const setup=`<div class="box pad ts-set">
    <label class="muted" for="tsRw">الرواية</label><select id="tsRw" class="ts-sel" data-tsset="rw"${live?' disabled':''}>${Object.keys(RW_N).map(k=>`<option value="${k}"${k===t.rw?' selected':''}>${RW_N[k]}</option>`).join('')}</select>
    <label class="muted" for="tsSu">السورة</label><select id="tsSu" class="ts-sel notr" data-tsset="s"${live?' disabled':''}>${SURAS.map((x,i)=>`<option value="${i}"${i===t.s?' selected':''}>${i+1}. ${x[0]}</option>`).join('')}</select>
    <div class="ts-rg"><div><label class="muted" for="tsA1">من الآية</label><select id="tsA1" class="ts-sel" data-tsset="a1"${live?' disabled':''}>${opts(X.n,t.a1)}</select></div><div><label class="muted" for="tsA2">إلى الآية</label><select id="tsA2" class="ts-sel" data-tsset="a2"${live?' disabled':''}>${opts(X.n,t.a2)}</select></div></div>
    <label class="ts-chk"><input type="checkbox" data-tsset="hide"${t.hide?' checked':''}> <span>أخفِ النص، وأظهر كل كلمة حين أقرؤها صوابًا</span></label></div>`;
  const E=live?TSR.T.E:tsWords();let html='',ca=0;
  E.forEach((x,i)=>{if(x.a!==ca){if(ca)html+=`<span class="ts-n">${tsDig(ca)}</span> `;ca=x.a}html+=`<span id="tw${i}" class="tw s${x.st}${live&&i===TSR.T.p?' cur':''}">${x.w}</span> `});html+=`<span class="ts-n">${tsDig(ca)}</span>`;
  const txt=`<div class="box pad ts-txt notr${t.hide?' hid':''}" dir="rtl" lang="ar" style="font-family:${ff}">${t.a1===1&&t.s!==0&&t.s!==8?`<p class="ts-bs">${t.rw==='hafs'||t.rw==='shouba'?'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ':'بِسْمِ اِ۬للَّهِ اِ۬لرَّحْمَٰنِ اِ۬لرَّحِيمِ'}</p>`:''}${html}</div>`;
  const ctl=live?`<div class="ts-live"><p id="tsSt" class="ts-st">أسمعك… اقرأ من حفظك</p><p id="tsHear" class="ts-hear notr" dir="rtl" aria-live="off"></p><i class="ts-pr"><b id="tsPr" style="width:${TSR.T.p/TSR.T.E.length*100}%"></b></i>
     <div class="ts-btns"><button class="btn small" data-tsfath="1">افتح عليّ</button><button class="btn small slip" data-tsstop="1">أوقف</button></div><p class="meta"><span>الأخطاء</span>: <b id="tsEc">${TSR.T.err}</b></p></div>`
    :`<div class="btns ts-go"><button class="btn ok ts-mic" data-tsgo="1"${SR?'':' disabled'}><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg><span>ابدأ التسميع</span></button></div>`;
  const res=tsRes?`<div class="box pad ts-res"><b>${tsRes.err||tsRes.fath?'أتممت التسميع':'ما شاء الله، تسميع بلا خطأ'}</b><p><span>الكلمات</span>: ${tsRes.n} · <span>الأخطاء</span>: ${tsRes.err} · <span>الفتح</span>: ${tsRes.fath}</p>${tsRes.bad.length?`<p class="muted">راجع هذه الكلمات:</p><p class="ts-bad notr" dir="rtl" style="font-family:${ff}">${tsRes.bad.slice(0,20).join(' · ')}</p>`:''}
     <div class="btns">${tsRes.full&&!tsRes.err&&!tsRes.fath&&(hz().m[tsRes.s]||0)!==2?`<button class="btn ok small" data-tsmem="${tsRes.s}">علّمها سورة محفوظة</button>`:''}<button class="btn small" data-tsgo="1">أعد التسميع</button>${tsRes.a2<X.n?`<button class="btn small" data-tsnext="1">الآيات التالية</button>`:''}</div></div>`:'';
  const hist=t.hist.length&&!live?`<details class="box pad ts-h"><summary>آخر تسميعاتك</summary>${t.hist.slice(0,8).map(h=>`<p class="meta"><span class="notr">${SURAS[h.s][0]} ${h.a1}–${h.a2}</span> · <span>${RW_N[h.rw]||''}</span> · <span>الأخطاء</span> ${h.e} · <span>الفتح</span> ${h.f} · ${fmtD(h.d)}</p>`).join('')}</details>`:'';
  return `<section class="ts">${live?'':intro}${nosr}${tsMsg&&tsMsg!=='nosr'?`<p class="logged bad">${esc(tsMsg)}</p>`:''}${live?'':setup}${res}${ctl}${txt}${hist}
   <p class="meta ts-note">يعتمد التسميع على خدمة التعرف على الكلام في هاتفك (Google أو Apple)، فيُرسَل صوتك إليها لتحويله إلى نص، ولا يحفظه التطبيق. وهو يتحقق من الكلمات، لا من أحكام التجويد. النص من مصاحف مجمع الملك فهد لطباعة المصحف الشريف.</p></section>`}
function tsClick(d){
  if(d.tsgo){tsRes=null;tsStart();return true}
  if(d.tsstop){tsStop();render();return true}
  if(d.tsfath){if(TSR)tsFath(TSR.T.p);return true}
  if(d.tsnext){const t=tsSt(),X=tsAyat(),len=t.a2-t.a1+1;t.a1=Math.min(X.n,t.a2+1);t.a2=Math.min(X.n,t.a1+len-1);tsRes=null;save();render();return true}
  if(d.tsmem!==undefined){hz().m[+d.tsmem]=2;save();render();return true}
  return false}
document.addEventListener('change',e=>{const el=e.target;if(!el||!el.dataset||!el.dataset.tsset)return;const t=tsSt(),k=el.dataset.tsset;
  if(k==='hide')t.hide=el.checked;else if(k==='rw'){t.rw=el.value;tsLoad(t.rw)}else if(k==='s'){t.s=+el.value;t.a1=1;const D=RWD[t.rw];t.a2=D?Math.min(7,D.s[t.s].length):7}
  else if(k==='a1'){t.a1=+el.value;if(t.a2<t.a1)t.a2=t.a1}else if(k==='a2'){t.a2=+el.value;if(t.a2<t.a1)t.a1=t.a2}
  tsRes=null;save();render()});

const VIEWS={search:viewSearch,h_quran:viewHub('h_quran'),h_ibadat:viewHub('h_ibadat'),h_ruh:viewHub('h_ruh'),h_ilm:viewHub('h_ilm'),h_shurut:viewHub('h_shurut'),tasmi:viewTasmi,me:viewMe,amrad:viewAmrad,wudu:()=>viewGuide('wudu'),salat:()=>viewGuide('salat'),khushu:viewKhushu,khr:viewKhushuR,ikhub:viewIkhub,ikhlas:viewIkhlas,sirr:viewSirr,ikhl:()=>viewLesson('ikhlas'),ahdaf:viewAhdaf,tawba:()=>viewLesson('tawba'),mujahada:()=>viewLesson('mujahada'),series:viewSeries,fatur:viewFatur,tools:viewTools,duas:viewDuas,qibla:viewQibla,hifz:viewHifz,ask:viewAsk,majalis:viewMajalis,path:viewPath,roadmap:viewRoadmap,fiqh:viewFiqh,aqida:()=>viewAudio(AQ_K),audio:()=>viewAudio(SIRA_K),sira:()=>viewAudio(SIRA_K),qiyama:()=>viewAudio(QIY_K),method:viewMethod,tazkiya:viewTazkiya,uyub:viewUyub,muraqabat:viewMuraqabat,sura:viewSura,aamal:viewAamal,dhikr_run:viewDhikrRun,adh_sabah:()=>viewAdhkar('sabah'),adh_masa:()=>viewAdhkar('masa'),install:viewInstall,notif:viewNotif,profile:viewProfile,admin:viewAdmin,taammulat:viewTaammulat,muhasaba:viewMuhasaba,organ:viewOrgan,qalb:viewQalb,quran:viewQuran,umrah:viewUmrah,khalwa:viewKhalwa,subha:viewSubha,mushaf:viewMushaf,qa:viewQA,week:viewWeek,about:viewAbout,tahlil:viewTahlil,ruhi:viewRuhi,mraqib:viewMraqib,munajat:viewMraqib};
const TOPTABS=['aamal','tazkiya','quran'];
