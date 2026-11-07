const WIRD_OPTS=[[1,'ثمن واحد'],[2,'ربع حزب'],[4,'نصف حزب'],[8,'حزب'],[16,'حزبان']];
const QBUF=new Map(),QURL=new Map();let mshMsg='',mshDl=null;
function msh(){if(!S.mushaf)S.mushaf={p:0,wird:8,day:null,khatm:0};const M=S.mushaf;if(!M.day||M.day.d!==nowStr())M.day={d:nowStr(),read:[],done:false};return M}
const qKey=i=>QIDX[i][0]*10+QIDX[i][3];
const qHQ=()=>QIDXM.length===QIDX.length&&!(S.mushaf&&S.mushaf.orig);
function qBundle(hz,hq){hq=hq===undefined?qHQ():hq;const key=(hq?'m':'q')+hz;if(QBUF.has(key))return QBUF.get(key);const p=fetch(key.slice(0,1)+String(hz).padStart(2,'0')+'.bin').then(r=>{if(!r.ok)throw new Error(r.status);return r.arrayBuffer()});QBUF.set(key,p);p.catch(()=>QBUF.delete(key));return p}
async function qPage(i){const hq=qHQ(),key=(hq?'m':'q')+i;if(QURL.has(key))return QURL.get(key);const hz=QIDX[i][0],[off,len]=hq?QIDXM[i]:QIDX[i].slice(1,3),buf=await qBundle(hz,hq);const u=URL.createObjectURL(new Blob([buf.slice(off,off+len)],{type:hq?'image/webp':'image/jpeg'}));QURL.set(key,u);return u}
let mshBr=null;const mshCP=()=>mshBr!=null?mshBr:msh().p;
async function mushafPaint(){const img=document.getElementById('mshImg');if(!img)return;const i=mshCP();if(mshBr!=null&&S.mshLast!==i){S.mshLast=i;save()}document.body.classList.toggle('msh-focus',!!S.mshFocus);
  try{const u=await qPage(i);if(mshCP()===i&&img.isConnected){img.src=u;img.classList.add('on');document.getElementById('mshWait').hidden=true;if(mshY!=null){const y=mshY;mshY=null;const go=()=>{const bar=document.querySelector('.msh-bar'),t=img.getBoundingClientRect().top+SCR().scrollTop+img.offsetHeight*y-(bar?bar.offsetHeight:0)-8;SCR().scrollTo({top:Math.max(0,t),behavior:'smooth'})};img.complete?go():img.addEventListener('load',go,{once:true})}}
    const nx=QIDX[i+1];if(nx)qBundle(nx[0]).catch(()=>{});}
  catch(e){const w=document.getElementById('mshWait');if(w){w.hidden=false;w.innerHTML=`<span>${Tx('تعذّر تحميل الصفحة. تحقق من الاتصال بالإنترنت، أو نزّل المصحف كاملًا للقراءة دون اتصال.')}</span><br><button class="btn small" data-mshretry="1" style="margin-top:10px">${Tx('أعد المحاولة')}</button>`}}}
function mushafGo(i,fwd){const M=msh();i=Math.max(0,Math.min(QIDX.length-1,i));
  if(mshBr!=null){mshBr=i;render();SCR().scrollTo(0,0);return}
  if(fwd&&QIDX[M.p][3]>0){const k=qKey(M.p);if(!M.day.read.includes(k))M.day.read.push(k)}
  if(fwd&&M.p===QIDX.length-1){M.khatm=(M.khatm||0)+1;mshMsg='ختمت القرآن الكريم، تقبّل الله منك ✦';i=0}
  M.p=i;if(!M.day.done&&M.day.read.length>=M.wird){M.day.done=true;applyWird('quran',true);mshMsg=mshMsg||'أتممت وردك من القرآن اليوم ✦ تقبّل الله منك'}
  save();render();SCR().scrollTo(0,0)}
const SURAS=[["الفاتحة",0,0],["البقرة",1,0],["آل عمران",40,0.714],["النساء",61,0.38],["المائدة",85,0.444],["الأنعام",103,0.034],["الأعراف",121,0.713],["الأنفال",141,0.533],["التوبة",149,0.545],["يونس",166,0.675],["هود",177,0.531],["يوسف",189,0.38],["الرعد",199,0.227],["إبراهيم",205,0.023],["الحجر",210,0.027],["النحل",214,0.033],["الإسراء",226,0.03],["الكهف",235,0.033],["مريم",244,0.595],["طه",250,0.025],["الأنبياء",258,0.025],["الحج",266,0.028],["المؤمنون",274,0.025],["النور",280,0.234],["الفرقان",288,0.241],["الشعراء",294,0.028],["النمل",301,0.642],["القصص",309,0.025],["العنكبوت",317,0.5],["الروم",323,0.603],["لقمان",328,0.447],["السجدة",331,0.294],["الأحزاب",333,0.909],["سبأ",343,0.03],["فاطر",348,0.458],["يس",352,0.698],["الصافات",357,0.267],["ص",363,0.028],["الزمر",367,0.194],["غافر",374,0.025],["فصلت",381,0.498],["الشورى",386,0.758],["الزخرف",392,0.362],["الدخان",397,0.228],["الجاثية",399,0.027],["الأحقاف",402,0.027],["محمد",405,0.344],["الفتح",408,0.431],["الحجرات",412,0.03],["ق",414,0.466],["الذاريات",417,0.027],["الطور",419,0.239],["النجم",421,0.311],["القمر",423,0.417],["الرحمن",426,0.027],["الواقعة",428,0.025],["الحديد",430,0.475],["المجادلة",434,0.025],["الحشر",436,0.681],["الممتحنة",439,0.027],["الصف",441,0.027],["الجمعة",442,0.025],["المنافقون",443,0.025],["التغابن",444,0.33],["الطلاق",446,0.028],["التحريم",448,0.037],["الملك",450,0.027],["القلم",451,0.531],["الحاقة",453,0.239],["المعارج",455,0.027],["نوح",456,0.248],["الجن",458,0.025],["المزمل",459,0.283],["المدثر",460,0.372],["القيامة",462,0.028],["الإنسان",463,0.027],["المرسلات",464,0.575],["النبأ",466,0.027],["النازعات",467,0.025],["عبس",468,0.13],["التكوير",469,0.033],["الانفطار",470,0.028],["المطففين",470,0.527],["الانشقاق",471,0.575],["البروج",472,0.347],["الطارق",473,0.348],["الأعلى",474,0.027],["الغاشية",474,0.555],["الفجر",475,0.222],["البلد",476,0.03],["الشمس",476,0.53],["الليل",477,0.025],["الضحى",477,0.588],["الشرح",478,0.03],["التين",478,0.353],["العلق",478,0.734],["القدر",479,0.342],["البينة",479,0.666],["الزلزلة",480,0.35],["العاديات",480,0.661],["القارعة",481,0.027],["التكاثر",481,0.431],["العصر",481,0.734],["الهمزة",482,0.028],["الفيل",482,0.403],["قريش",482,0.725],["الماعون",483,0.03],["الكوثر",483,0.308],["الكافرون",483,0.52],["النصر",483,0.783],["المسد",484,0.025],["الإخلاص",484,0.277],["الفلق",484,0.478],["الناس",484,0.731]];
function suraAt(p){let k=0;for(let j=0;j<SURAS.length;j++){const s=SURAS[j];if(s[1]<p||(s[1]===p&&s[2]<.12))k=j;else if(s[1]>p)break}return k}
function suraOnPage(p){return SURAS.map((s,j)=>s[1]===p?j:-1).filter(j=>j>=0)}
let mshSur=false,mshY=null,mshAuto=false,mshRun=true,mshRaf=0,mshLast=0,mshEndAt=0,mshAcc=0,mshHold=0;
const MSEC=[420,360,300,250,210,175,145,120,95,75]; /* seconds per page at each speed level */
const mshSpd=()=>{const M=msh();return Math.max(1,Math.min(10,M.spd||3))};
const IC_PAUSE='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14"/></svg>',IC_PLAY='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5l12 7-12 7z"/></svg>';
let mshPos=0,mshSet=-1,mshUserTs=-1e9;
['touchmove','wheel'].forEach(ev=>addEventListener(ev,()=>{if(mshAuto)mshUserTs=performance.now()},{passive:true}));
function mshBase(){const pg=document.getElementById('mshPage'),bar=document.querySelector('.msh-bar');return pg?pg.getBoundingClientRect().top+SCR().scrollTop-(bar?bar.offsetHeight:0)-6:0}
function mshToTop(){mshPos=0;SCR().scrollTop=Math.round(mshBase());mshSet=SCR().scrollTop}
/* reading advances through the page image at the chosen pace; the screen follows, then the next page opens */
function mshTick(ts){if(!mshAuto||screen!=='mushaf'){mshRaf=0;return}
  const dt=mshLast?Math.min(.1,(ts-mshLast)/1000):0;mshLast=ts;
  const sc=SCR(),img=document.getElementById('mshImg'),ready=img&&img.classList.contains('on')&&img.complete&&img.naturalHeight>0;
  if(ready){const base=mshBase(),ih=img.getBoundingClientRect().height,bar=document.querySelector('.msh-bar'),ab=document.querySelector('.msh-auto');
    const viewH=innerHeight-(bar?bar.offsetHeight:0)-(ab?ab.offsetHeight+20:90),maxS=Math.max(0,ih-viewH);
    const user=ts-mshUserTs<700;if(user){mshPos=Math.max(0,Math.min(ih,sc.scrollTop-base+(sc.scrollTop>base?viewH*.35:0)))}
    if(mshRun&&ts>mshHold){mshPos+=ih/MSEC[mshSpd()-1]*dt;
      if(mshPos>=ih){if(!mshEndAt)mshEndAt=ts;else if(ts-mshEndAt>1500){mshEndAt=0;mushafGo(mshCP()+1,true);mshToTop();mshHold=ts+1000;mshRaf=requestAnimationFrame(mshTick);return}}}
    if(!user){const want=Math.round(base+Math.max(0,Math.min(maxS,mshPos-viewH*.35)));if(Math.abs(sc.scrollTop-want)>=1)sc.scrollTop=want}
    const pb=document.getElementById('mshAP');if(pb)pb.style.width=Math.min(100,mshPos/ih*100)+'%'}
  mshRaf=requestAnimationFrame(mshTick)}
function mshAutoBar(){return `<div class="msh-auto" role="toolbar" aria-label="القراءة التلقائية"><button class="ma-b" data-mshspd="-1" aria-label="أبطأ">−</button><span class="ma-s"><small>السرعة</small><b id="mshSpdV">${mshSpd()}</b></span><button class="ma-b" data-mshspd="1" aria-label="أسرع">+</button><button class="ma-b ma-p" id="mshPlay" data-mshplay="1" aria-label="إيقاف أو متابعة">${mshRun?IC_PAUSE:IC_PLAY}</button><button class="ma-x" data-mshauto="0">خروج</button><i class="ma-pr"><b id="mshAP"></b></i></div>`}
function mshSurList(){return SURAS.map((s,j)=>`<button class="msh-sr" data-mshsura="${j}" data-n="${esc(normAr(s[0]))} ${j+1}"><span class="msh-sn">${j+1}</span><b class="notr">${s[0]}</b><small><span>${Tx('الحزب')}</span> ${QIDX[s[1]][0]}</small></button>`).join('')}
function viewQuran(){const M=msh(),k=suraAt(M.p),[hz,,,th]=QIDX[M.p],n=Math.min(M.day.read.length,M.wird);
  return `<section>
   <button class="qr-cont" data-qrcont="1"><small><span>وردك اليوم</span> · <span>مصحف ورش</span></small><span class="qr-sn"><b class="notr">${Tx('سورة')} ${SURAS[k][0]}</b><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg></span>
    <span class="qr-at">${th===0?'<span>الفاتحة</span>':'<span>أكمل من</span> <span>الحزب</span> '+hz+' · <span>الثمن</span> '+th}</span>
    <span class="qr-pr"><i><b style="width:${n/M.wird*100}%"></b></i><em dir="ltr">${n} / ${M.wird}</em></span></button>
   <div class="qr-hz"><button class="h2-row" data-go="hifz"><span class="h2-ri"><svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 36V12c5-2 10-2 16 2 6-4 11-4 16-2v24c-5-2-10-2-16 2-6-4-11-4-16-2z"/><path d="M24 14v24"/></svg></span><span class="tx">حفظ القرآن وتسميعه<small>${hzDone()} <span>سورة محفوظة</span> · <span>سمّع حفظك بصوتك</span></small></span><svg class="h2-chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg></button></div>
   <label class="qr-search"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg><input id="mshQ" type="search" placeholder="${Tx('ابحث عن سورة بالاسم أو الرقم')}" autocomplete="off"></label>
   <div class="sh" style="margin:18px 2px 6px"><h2>السور</h2><span>114</span></div>
   <div class="qr-list" id="mshSL">${mshSurList()}</div><p class="meta" id="mshNone" hidden>لا توجد سورة بهذا الاسم.</p>
  </section>`}
function viewMushaf(){const M=msh(),P=mshCP(),[hz,,,th]=QIDX[P],n=Math.min(M.day.read.length,M.wird),pct=n/M.wird*100;
  setTimeout(mushafPaint,0);
  return `<section class="msh">
   <div class="msh-bar"><div><b>${(()=>{const on=suraOnPage(P),k=suraAt(P),ns=[...new Set([k,...on])].sort((a,b)=>a-b);return '<span class="notr">'+Tx('سورة')+' '+ns.map(j=>SURAS[j][0]).join(' · ')+'</span>'})()}</b><span class="msh-bb"><button class="btn small msh-fb" data-mshfocus="1" aria-pressed="${!!S.mshFocus}">${S.mshFocus?'إنهاء وضع القراءة':'وضع القراءة'}</button><button class="btn small msh-sbtn" data-mshsur="1">${mshSur?'إغلاق':'السور'}</button></span></div>
   <div><small>${th===0?'<span>الفاتحة</span>':'<span>'+Tx('الحزب')+' '+hz+'</span> · <span>'+Tx('الثمن')+' '+th+'</span>'}</small><small><span>ورد اليوم:</span> ${n} / ${M.wird}</small></div><i><b style="width:${pct}%"></b></i></div>
   ${mshSur?`<div class="msh-sur"><input id="mshQ" type="search" placeholder="${Tx('ابحث عن سورة بالاسم أو الرقم')}" autocomplete="off"><div class="msh-sl" id="mshSL">${mshSurList()}</div><p class="meta" id="mshNone" hidden>لا توجد سورة بهذا الاسم.</p></div>`:''}
   ${mshBr!=null?(()=>{const [wh,,,wt]=QIDX[M.p];return `<div class="box pad msh-br"><b>هذه الصفحة خارج ورد اليوم</b><small><span>قراءتك هنا لا تُحسب في الورد. وردك عند</span> <span class="notr">${Tx('سورة')} ${SURAS[suraAt(M.p)][0]}</span>، ${wt===0?'<span>الفاتحة</span>':'<span>'+Tx('الحزب')+' '+wh+'</span> · <span>'+Tx('الثمن')+' '+wt+'</span>'}</small><div class="btns"><button class="btn small" data-mshback="1">العودة إلى وردي</button><button class="btn small ok" data-mshset="1">اجعل وردي يبدأ من هنا</button></div></div>`})()
     :S.mshLast!=null&&S.mshLast!==M.p&&QIDX[S.mshLast]?(()=>{const L=S.mshLast,[lh,,,lt]=QIDX[L];return `<div class="box pad msh-cont"><small><span>آخر صفحة قرأتها خارج الورد:</span> <span class="notr">${Tx('سورة')} ${SURAS[suraAt(L)][0]}</span>، ${lt===0?'<span>الفاتحة</span>':'<span>'+Tx('الحزب')+' '+lh+'</span> · <span>'+Tx('الثمن')+' '+lt+'</span>'}</small><button class="btn small" data-mshlast="1">متابعة القراءة من هناك</button></div>`})():''}
   ${mshMsg?`<p class="logged" style="margin:8px 0">${esc(mshMsg)}</p>`:''}
   <div class="msh-page" id="mshPage"><img id="mshImg" alt="" draggable="false"><p class="meta" id="mshWait"><span class="msh-spin" aria-hidden="true"></span><span>جارٍ تحميل الصفحة…</span></p></div>
   <div class="msh-nav"><button class="btn" data-mshgo="-1"${P?'':' disabled'}>→ السابق</button><span dir="ltr">${P+1} / ${QIDX.length}</span><button class="btn ok" data-mshgo="1">التالي ←</button></div>
   <button class="btn ok msh-autob" data-mshauto="1"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v13M6 11l6 6 6-6M5 20h14"/></svg>القراءة التلقائية</button>
   <p class="meta" style="text-align:center;margin:4px 0 14px">اسحب الصفحة يمينًا للتالي ويسارًا للسابق، وكبّرها بإصبعين. وفي القراءة التلقائية تنزل الصفحة وحدها وتنتقل إلى التالية.</p>
   ${mshAuto?mshAutoBar():''}
   <div class="acc-card msh-set">${acc('msh','list','الانتقال والإعدادات',`
    <label class="muted">انتقل إلى</label>
    <div class="msh-jump"><select id="mshHz" aria-label="الحزب">${Array.from({length:60},(_,k)=>`<option value="${k+1}"${k+1===hz?' selected':''}>${Tx('الحزب')} ${k+1}</option>`).join('')}</select><select id="mshTh" aria-label="الثمن">${Array.from({length:8},(_,k)=>`<option value="${k+1}"${k+1===th?' selected':''}>${Tx('الثمن')} ${k+1}</option>`).join('')}</select><button class="btn ok" data-mshjump="1">اذهب</button></div>
    <button class="btn small" data-mshfat="1" style="margin-top:8px">الفاتحة</button>
    <label class="muted" style="display:block;margin-top:12px">مقدار الورد اليومي</label>
    <div class="msh-wird">${WIRD_OPTS.map(([v,l])=>`<button class="btn small${M.wird===v?' ok':''}" data-mshwird="${v}">${l}</button>`).join('')}</div>
    ${QIDXM.length?`<label class="muted" style="display:block;margin-top:12px">جودة الصفحات</label><div class="msh-wird"><button class="btn small${M.orig?'':' ok'}" data-mshq="hq">عالية الدقة</button><button class="btn small${M.orig?' ok':''}" data-mshq="orig">الصورة الأصلية</button></div>`:''}
    <p class="meta" style="margin:12px 0 4px">${M.khatm?'<span>الختمات:</span> '+M.khatm:''}</p>
    ${(()=>{const n=OFFST?OFFST.quran:0,mb=Math.round((qHQ()?QIDXM:QIDX).reduce((a,x)=>a+(qHQ()?x[1]:x[2]),0)/1048576);return n>=60&&!(mshDl&&mshDl.on)?'<p class="logged">المصحف منزَّل كاملًا على هاتفك ✓</p>':`<button class="btn" data-mshdl="1"${mshDl&&mshDl.on?' disabled':''}>${mshDl&&mshDl.on?Tx('جارٍ التنزيل…')+' '+mshDl.n+' / 60':n?Tx('استأنف التنزيل')+' · '+n+' / 60':'تنزيل المصحف كاملًا للقراءة دون إنترنت'}</button>${mshDl&&mshDl.on?`<i class="msh-dlbar"><b style="width:${mshDl.n/60*100}%"></b></i>`:`<p class="meta"><span>الحجم نحو</span> <span dir="ltr">${mb} MB</span>${n?` · <span>منزَّل الآن:</span> <span dir="ltr">${n} / 60</span>`:''}. <span>يُستحسن التنزيل على شبكة Wi-Fi، وأبقِ التطبيق مفتوحًا حتى يكتمل.</span></p>`}`})()}
    ${mshDl&&mshDl.msg?`<p class="meta">${esc(mshDl.msg)}</p>`:''}
    <p class="meta">مصحف التجويد الملوّن برواية ورش، مجزّأ أثمانًا: كل صفحة ثمن.</p>`)}</div></section>`}
async function mushafDownload(){mshDl={on:true,n:0,msg:''};render();let ok=0,cut=false;
  for(let h=1;h<=60;h++){if(!navigator.onLine){cut=true;break}try{await qBundle(h);ok++}catch(e){if(!navigator.onLine){cut=true;break}}mshDl.n=h;const b=document.querySelector('[data-mshdl]');if(b)b.textContent=Tx('جارٍ التنزيل…')+' '+h+' / 60';const br=document.querySelector('.msh-dlbar b');if(br)br.style.width=(h/60*100)+'%'}
  try{await checkOffline()}catch(e){}
  mshDl={on:false,n:ok,msg:ok===60?Tx('نُزّل المصحف كاملًا، ويمكنك قراءته دون إنترنت.'):Tx(cut?'انقطع الاتصال. ما نُزّل محفوظ، فاضغط «استأنف التنزيل» حين يعود.':'لم يكتمل التنزيل. أعد المحاولة عند الاتصال بالإنترنت.')};render()}
/* swipe from the left edge of the screen to the right: go back to the previous page (like the back button).
   Only from the edge: a swipe started anywhere else was taken for "back" while the seeker was just scrolling. */
let swb=null;
function swbScrollable(el){for(let e=el;e&&e!==document.body;e=e.parentElement){if(e.scrollWidth>e.clientWidth+4){const o=getComputedStyle(e).overflowX;if(o==='auto'||o==='scroll')return true}}return false}
document.addEventListener('touchstart',e=>{swb=null;if(e.touches.length!==1||screen==='home'||screen==='mushaf')return;const t=e.target;
  if(t.closest('input,textarea,select,[contenteditable],.dr,#bsheet,#hudurOv,.msh-page,canvas,iframe,video,.st-ov,.am-row,.rm-full'))return;if(document.querySelector('#bsheet:not([hidden])'))return;if(swbScrollable(t))return;
  if(!document.querySelector('[data-back]'))return;if(e.touches[0].clientX>28)return;swb={x:e.touches[0].clientX,y:e.touches[0].clientY,t:Date.now(),h:null}},{passive:true});
document.addEventListener('touchmove',e=>{if(!swb||e.touches.length!==1){swb=null;return}const dx=e.touches[0].clientX-swb.x,dy=e.touches[0].clientY-swb.y;
  if(swb.h===null&&(Math.abs(dx)>10||Math.abs(dy)>10))swb.h=dx>0&&Math.abs(dx)>Math.abs(dy)*2;
  if(swb.h===false){swb=null;return}
  if(swb.h){const a=document.getElementById('app');if(a){a.style.transition='none';a.style.transform=`translateX(${Math.min(dx,140)*0.45}px)`;a.style.opacity=String(1-Math.min(dx,140)/700)}}},{passive:true});
function swbReset(){const a=document.getElementById('app');if(!a)return;a.style.transition='transform .2s ease,opacity .2s ease';a.style.transform='';a.style.opacity='';setTimeout(()=>{a.style.transition=''},220)}
document.addEventListener('touchend',e=>{if(!swb)return;const s=swb;swb=null;if(!s.h){return}const t=e.changedTouches[0],dx=t.clientX-s.x,dy=t.clientY-s.y;
  swbReset();if(dx>90&&Math.abs(dy)<dx*0.5&&Date.now()-s.t<900){const b=document.querySelector('[data-back]');if(b)b.click()}},{passive:true});
document.addEventListener('touchcancel',()=>{if(swb&&swb.h)swbReset();swb=null},{passive:true});
/* swipe to turn pages */
let mshX=null;document.addEventListener('touchstart',e=>{if(screen==='mushaf'&&e.target.closest('#mshPage')&&e.touches.length===1)mshX=[e.touches[0].clientX,e.touches[0].clientY,Date.now()];else mshX=null},{passive:true});
document.addEventListener('touchend',e=>{if(!mshX||screen!=='mushaf')return;const t=e.changedTouches[0],dx=t.clientX-mshX[0],dy=t.clientY-mshX[1];
  if(Date.now()-mshX[2]<700&&Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5&&(!window.visualViewport||visualViewport.scale<=1.05)){const P=mshCP();if(dx>0)mushafGo(P+1,true);else mushafGo(P-1,false)}mshX=null},{passive:true});

/* reading mode: only the page stays; one tap on it shows or hides the tools */
document.addEventListener('click',e=>{if(screen!=='mushaf'||!S.mshFocus||!e.target.closest('#mshPage'))return;document.body.classList.toggle('msh-show')});
