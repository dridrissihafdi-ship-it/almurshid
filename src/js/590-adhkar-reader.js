/* ---------- adhkar reader ---------- */
let adhSize=20;try{adhSize=+localStorage.getItem('murshid-adh-size')||20}catch(e){}
function adhList(kind){return[ADHKAR.open,...ADHKAR.quran,...ADHKAR[kind]]}
function adhState(kind){const L=dayLog();L.ad=L.ad||{};const n=adhList(kind).length;if(!L.ad[kind]||L.ad[kind].length!==n)L.ad[kind]=adhList(kind).map(()=>0);return L.ad[kind]}
/* adhkar audio: one clip per dhikr (Sheikh Ahmed Dabbagh, evening recording) */
const ADH_SAME=[0,1,2,8,9,12,13,14,15,16,17,18,19,20,21,22,23];
function adhAu(kind,i){const q=ADHKAR.quran.length;if(i===0)return'open';if(i<=q)return'q'+String(i-1).padStart(2,'0');const k=i-1-q;const z=String(k).padStart(2,'0');return kind==='masa'||ADH_SAME.includes(k)?'m'+z:'s'+z}
const adTts=(kind,i)=>/^s/.test(adhAu(kind,i)||'');
let MS_SRC='';
const ADA=new Audio();ADA.preload='none';const ADP={kind:null,i:-1,on:false};
const AD_RATES=[0.75,1,1.25,1.5,1.75,2];let adRate=1,adMute=false;
try{adRate=+localStorage.getItem('murshid-ad-rate')||1;adMute=localStorage.getItem('murshid-ad-mute')==='1'}catch(e){}
const AD_IC={wave:'<svg viewBox="0 0 24 24" fill="currentColor"><rect class="w1" x="4" y="9" width="3" height="6" rx="1.5"/><rect class="w2" x="10.5" y="5" width="3" height="14" rx="1.5"/><rect class="w3" x="17" y="8" width="3" height="8" rx="1.5"/></svg>',
 prev:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h2.4v14H6zM20 5.5v13L9.5 12z"/></svg>',next:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.6 5H18v14h-2.4zM4 5.5v13L14.5 12z"/></svg>',
 vol:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor"/><path d="M15.5 9a4.2 4.2 0 0 1 0 6M18.3 6.5a8 8 0 0 1 0 11"/></svg>',
 mute:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor"/><path d="M16 9.5l5 5M21 9.5l-5 5"/></svg>'};
const adRateTx=r=>String(r).replace(/^0\./,'0.')+'×';
function adTitle(kind,i){const a=adhList(kind)[i];if(!a)return'';if(i===0)return'الصلاة الإبراهيمية';if(a.s)return a.s;return a.t.replace(/<[^>]+>/g,'').split(/\s+/).slice(0,5).join(' ')+'…'}
function adBar(kind){const on=ADP.on&&ADP.kind===kind,pl=on&&!ADA.paused,i=on?ADP.i:-1;
  return `<div class="adp${on?' on':''}" id="adp"><i class="adp-bar"><i id="adpBar"></i></i>
   <button class="adp-pp" data-adpp="1" id="adpPP" aria-label="${esc(Tx(pl?'إيقاف مؤقت':'تشغيل'))}">${pl?AU_IC.pause:AU_IC.play}</button>
   <span class="adp-m"><b id="adpT"${on&&!adhList(kind)[i].s&&i!==0?' class="notr" dir="rtl"':''}>${on?esc(adTitle(kind,i)):'استمع للأذكار'}</b><small id="adpV">${on&&adTts(kind,i)?'صوت آلي (قراءة حاسوبية)':'بصوت الشيخ أحمد دباغ'}</small></span>
   <button class="adp-r notr" data-adrate="1" id="adpR" aria-label="${esc(Tx('السرعة'))}" dir="ltr">${adRateTx(adRate)}</button>
   <button class="adp-b adp-mu${adMute?' on':''}" data-admute="1" id="adpMu" aria-pressed="${adMute}" aria-label="${esc(Tx('الصمت'))}">${adMute?AD_IC.mute:AD_IC.vol}</button>
   <button class="adp-b adp-x" data-adclose="1" aria-label="${esc(Tx('إخفاء المشغّل'))}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>`}
function adMeta(){if(!('mediaSession' in navigator)||!ADP.on)return;try{navigator.mediaSession.metadata=new MediaMetadata({title:Tx(adTitle(ADP.kind,ADP.i)),artist:Tx(adTts(ADP.kind,ADP.i)?'صوت آلي (قراءة حاسوبية)':'الشيخ أحمد دباغ'),album:Tx(ADP.kind==='sabah'?'أذكار الصباح':'أذكار المساء'),artwork:[{src:'icon-512.png',sizes:'512x512',type:'image/png'}]})}catch(e){}}
function adPlay(kind,i){const list=adhList(kind);while(i<list.length&&!adhAu(kind,i))i++;if(i>=list.length)return adStop();
  try{if(AU.src&&!AU.paused){auStore(true);AU.pause()}}catch(e){}try{if(tts.on)ttsStop()}catch(e){}
  MS_SRC='ad';if(SAL.on)salStop();ADP.kind=kind;ADP.i=i;ADP.on=true;const u='adhkar/'+adhAu(kind,i)+'.mp3';
  if(ADA.getAttribute('src')!==u){ADA.src=u}
  ADA.defaultPlaybackRate=adRate;ADA.playbackRate=adRate;ADA.muted=adMute;try{ADA.preservesPitch=true;ADA.webkitPreservesPitch=true}catch(e){}
  const pr=ADA.play();if(pr&&pr.catch)pr.catch(()=>{});adMeta();adUi(true)}
function adStop(){try{ADA.pause()}catch(e){}ADP.on=false;ADP.i=-1;adUi()}
function adToggle(kind){if(ADP.on&&ADP.kind===kind){if(ADA.paused){ADA.playbackRate=adRate;ADA.play().catch(()=>{})}else ADA.pause();return adUi()}
  }
function adStep(kind,d){if(!(ADP.on&&ADP.kind===kind))return adPlay(kind,0);let i=ADP.i+d;if(d<0){if(ADA.currentTime>4)i=ADP.i;while(i>0&&!adhAu(kind,i))i--}adPlay(kind,Math.max(0,i))}
function adUi(scroll){try{sndUi()}catch(e){}const kind=screen.startsWith('adh_')?screen.slice(4):null,on=ADP.on&&ADP.kind===kind,pl=on&&!ADA.paused;
  document.querySelectorAll('.adh-w').forEach(w=>{const me=on&&+w.dataset.adw===ADP.i;w.classList.toggle('playing',me);const b=w.querySelector('.adh-pl');if(b)b.innerHTML=me&&pl?AD_IC.wave:AU_IC.play});
  const bar=document.getElementById('adp');if(!bar||!kind)return;bar.classList.toggle('on',on);
  const pp=document.getElementById('adpPP');pp.innerHTML=pl?AU_IC.pause:AU_IC.play;pp.setAttribute('aria-label',Tx(pl?'إيقاف مؤقت':'تشغيل'));
  const t=document.getElementById('adpT'),a=on?adhList(kind)[ADP.i]:null,raw=on&&!a.s&&ADP.i!==0;t.textContent=on?(raw?adTitle(kind,ADP.i):Tx(adTitle(kind,ADP.i))):Tx('استمع للأذكار');t.classList.toggle('notr',raw);const vv=document.getElementById('adpV');if(vv)vv.textContent=Tx(on&&adTts(kind,ADP.i)?'صوت آلي (قراءة حاسوبية)':'بصوت الشيخ أحمد دباغ');
  document.getElementById('adpR').textContent=adRateTx(adRate);const mu=document.getElementById('adpMu');mu.innerHTML=adMute?AD_IC.mute:AD_IC.vol;mu.classList.toggle('on',adMute);mu.setAttribute('aria-pressed',adMute);
  if(scroll&&on){const w=document.querySelector(`.adh-w[data-adw="${ADP.i}"]`);if(w){const r=w.getBoundingClientRect();if(r.top<90||r.top>innerHeight*.55)w.scrollIntoView({behavior:'smooth',block:'start'})}}}
ADA.addEventListener('ended',()=>{ADP.on=false;ADP.i=-1;adUi()});
ADA.addEventListener('play',()=>sndUi());ADA.addEventListener('pause',()=>sndUi()); // one clip per tap on ▶; the player hides when it ends
['play','pause'].forEach(ev=>ADA.addEventListener(ev,()=>adUi()));
ADA.addEventListener('timeupdate',()=>{const b=document.getElementById('adpBar');if(b)b.style.width=(ADA.duration?100*ADA.currentTime/ADA.duration:0)+'%'});
function adClick(d){const kind=screen.startsWith('adh_')?screen.slice(4):null;if(!kind)return false;
  if(d.adpl!==undefined){const i=+d.adpl;if(ADP.on&&ADP.kind===kind&&ADP.i===i)adToggle(kind);else adPlay(kind,i);return true}
  if(d.adpp){adToggle(kind);return true}
  if(d.adclose){adStop();return true}
  if(d.adrate){adRate=AD_RATES[(AD_RATES.indexOf(adRate)+1)%AD_RATES.length]||1;ADA.defaultPlaybackRate=adRate;ADA.playbackRate=adRate;try{localStorage.setItem('murshid-ad-rate',adRate)}catch(e){}adUi();return true}
  if(d.admute){adMute=!adMute;ADA.muted=adMute;try{localStorage.setItem('murshid-ad-mute',adMute?'1':'0')}catch(e){}adUi();return true}
  return false}
function viewAdhkar(kind){
  const list=adhList(kind),st=adhState(kind),L=dayLog(),p=period();
  const done=list.filter((a,i)=>st[i]>=a.n).length,confirmed=L.awrad.includes(kind);
  const name=kind==='sabah'?'أذكار الصباح':'أذكار المساء';
  const inWin=p.kind===kind;
  const card=(a,i)=>{const c=st[i],full=c>=a.n;
    const au=adhAu(kind,i),pl=ADP.on&&ADP.kind===kind&&ADP.i===i;
    return `<div class="adh-w${pl?' playing':''}" data-adw="${i}">${au?`<button class="adh-pl" data-adpl="${i}" aria-label="${esc(Tx('استمع'))}">${pl&&!ADA.paused?AD_IC.wave:AU_IC.play}</button>`:''}${adTts(kind,i)?'<span class="adh-tts">صوت آلي</span>':''}<button class="adh ${a.k}${full?' full':''}${au?' has-au':''}" data-adh="${i}" aria-label="${full?'تم':'اضغط للعدّ'}">
      ${a.s?`<span class="adh-s">${a.s}</span>`:''}<span class="adh-t" dir="rtl" lang="ar">${a.t}</span>
      <span class="adh-f"><span class="adh-n">${full?'✓ تمّ':(a.n===1?'مرة واحدة':`${ar2(a.n-c)} من ${ar2(a.n)}`)}</span>${full?'':'<span class="adh-tap">اضغط للعدّ</span>'}</span></button></div>`};
  let i=0;
  const sec=(title,arr)=>`<h3 class="adh-h">${title}</h3>`+arr.map(a=>card(a,i++)).join('');
  return `<section class="adh-wrap" style="--adh:${adhSize}px">
   <div class="adh-bar"><div class="adh-prog"><i style="width:${Math.round(done/list.length*100)}%"></i></div><span>${ar2(done)} / ${ar2(list.length)}</span>
    <button class="btn small" data-adhsize="-1" aria-label="تصغير الخط">أ−</button><button class="btn small" data-adhsize="1" aria-label="تكبير الخط">أ+</button></div>
   ${inWin?'':`<p class="tq-note">${kind==='sabah'?'وقت أذكار الصباح من الفجر إلى المغرب':'وقت أذكار المساء من المغرب إلى الفجر'}. يُسجَّل التأكيد الآن في الأعمال، لكن الهالة لا تظهر إلا إذا أكّدتها في وقتها.</p>`}
   ${adBar(kind)}
   ${sec('الاستهلال',[list[0]])}
   ${sec('أولًا: من القرآن الكريم',list.slice(1,1+ADHKAR.quran.length))}
   ${sec('ثانيًا: من السنة النبوية ('+(kind==='sabah'?'صباحًا':'مساءً')+')',list.slice(1+ADHKAR.quran.length))}
   <div class="adh-end">${confirmed?`<p class="logged">✓ أكّدت ${name} اليوم</p><div class="btns"><button class="btn small" data-adhconfirm="0">إلغاء التأكيد</button><button class="btn" data-go="aamal">رجوع إلى الأعمال</button></div>`
     :`<button class="btn ok big" data-adhconfirm="1">أكّدت ${name}</button>${done<list.length?`<span class="meta">أتممت ${ar2(done)} من ${ar2(list.length)}</span>`:''}`}
    <div class="btns"><button class="btn small" data-adhreset="1">تصفير العدّاد</button></div></div>
   <p class="tq-src" style="color:var(--muted)">من ملف «الأذكار المحمدية للصباح والمساء من القرآن الكريم والسنة النبوية» · مجموعة الذاكرين</p>
  </section>`;
}
const ar2=n=>String(n); // Western digits everywhere
