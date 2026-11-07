/* ---------- read-aloud of the method text (the device's own voice) ---------- */
const TTS_OK='speechSynthesis' in window&&'SpeechSynthesisUtterance' in window;
const TTS_LANG={ar:'ar-SA',en:'en-US',fr:'fr-FR',es:'es-ES',ru:'ru-RU',ur:'ur-PK'};
const TTS_PBUH={ar:'صلى الله عليه وسلم',en:'peace be upon him',fr:'paix et salut sur lui',es:'la paz sea con él',ru:'мир ему и благословение Аллаха',ur:'صلی اللہ علیہ وسلم'};
let tts={on:false,all:false,sec:0,i:0,paused:false,rate:1,tok:0};
try{tts.rate=+localStorage.getItem('murshid-tts-rate')||1}catch(e){}
/* choose the clearest voice installed on the phone (or the one the user picked in the settings) */
const TTS_PREF={ar:['ar-SA','ar-001','ar-EG','ar-AE','ar-MA','ar-JO'],en:['en-GB','en-US','en-AU','en-IE'],fr:['fr-FR','fr-CA','fr-BE'],es:['es-ES','es-MX','es-US'],ru:['ru-RU'],ur:['ur-PK','ur-IN']};
const TTS_JUNK=/^(Albert|Bad News|Bahh|Bells|Boing|Bubbles|Cellos|Deranged|Good News|Hysterical|Jester|Organ|Pipe Organ|Superstar|Trinoids|Whisper|Wobble|Zarvox|Fred|Junior|Kathy|Ralph|Grandma|Grandpa|Eddy|Flo|Reed|Rocko|Sandy|Shelley)\b/i;
const ttsVoices=lg=>{const L=(lg||LANG).slice(0,2);try{return speechSynthesis.getVoices().filter(v=>(v.lang||'').toLowerCase().replace('_','-').startsWith(L))}catch(e){return[]}};
function ttsScore(v,lg){const n=v.name||'',l=(v.lang||'').replace('_','-').toLowerCase(),P=(TTS_PREF[lg]||[]).map(x=>x.toLowerCase()),i=P.indexOf(l);let s=i<0?0:10-i;
  if(/premium|ممتاز/i.test(n))s+=40;if(/enhanced|améliorée|mejorada|улучш|محسّن|محسن/i.test(n))s+=30;if(/neural|natural|online/i.test(n))s+=25;if(/google/i.test(n))s+=15;if(/siri/i.test(n))s+=10;if(/compact/i.test(n))s-=10;if(TTS_JUNK.test(n))s-=100;if(v.localService)s+=2;return s}
const ttsVoice=lg=>{lg=lg||LANG;const vs=ttsVoices(lg);if(!vs.length)return null;const pk=(S.ttsV||{})[lg],m=pk&&vs.find(v=>v.voiceURI===pk);return m||vs.slice().sort((a,b)=>ttsScore(b,lg)-ttsScore(a,lg))[0]};
const ttsRateFor=arab=>tts.rate*(arab?.92:1);
const ttsSecs=()=>[...document.querySelectorAll('.tq-s,.tts-s')];
const ttsUnits=si=>{const s=ttsSecs()[si];if(!s)return [];const u=[s.querySelector(':scope > summary'),...s.querySelectorAll('h3,h4,p,li,dt,dd,.ls-cmp span,.ls-cmp i,.ls-bird b,td')].filter(x=>x&&!x.closest('.nosay')&&x.innerText&&x.innerText.trim());return u.length?u:[s]};
function ttsText(el){let t=(el.tagName==='SUMMARY'?el.textContent:el.innerText||el.textContent).replace(/ﷺ/g,' '+(TTS_PBUH[LANG]||TTS_PBUH.ar)+' ').replace(/[﴿﴾«»]/g,'').replace(/\s+/g,' ').trim();return t}
function ttsChunks(t){const out=[];let cur='';t.split(/(?<=[.!?؟؛:،,;۔])\s+/).forEach(p=>{if((cur+' '+p).length>220&&cur){out.push(cur);cur=p}else cur=cur?cur+' '+p:p});if(cur)out.push(cur);return out}
function ttsMark(){document.querySelectorAll('.tq-speak').forEach(e=>e.classList.remove('tq-speak'));if(!tts.on)return;const u=ttsUnits(tts.sec)[tts.i];if(u){u.classList.add('tq-speak');const d=u.closest('details');if(d&&!d.open)d.open=true;u.scrollIntoView({block:'center',behavior:'smooth'})}}
function ttsSpeak(){if(!tts.on)return;const units=ttsUnits(tts.sec);
  if(tts.i>=units.length){const n=ttsSecs().length;if(tts.all&&tts.sec+1<n){tts.sec++;tts.i=0;return ttsSpeak()}return ttsStop()}
  ttsMark();ttsBar();const tok=++tts.tok,parts=ttsChunks(ttsText(units[tts.i]));let k=0;
  const next=()=>{if(tok!==tts.tok||!tts.on)return;if(k>=parts.length){tts.i++;return ttsSpeak()}
    const txt=parts[k++],urd=LANG==='ur'&&/[ٹڈڑںےۓہھکگپچژیۂ]/.test(txt),arab=!urd&&/[\u0600-\u06FF]/.test(txt)&&(txt.match(/[\u0600-\u06FF]/g)||[]).length>txt.length/4;const u=new SpeechSynthesisUtterance(txt);u.lang=arab?'ar-SA':(TTS_LANG[LANG]||'ar-SA');const v=ttsVoice(arab?'ar':LANG)||(LANG==='ur'?ttsVoice('ar'):null);if(v){u.voice=v;u.lang=v.lang}u.rate=ttsRateFor(arab||LANG==='ar');
    u.onend=()=>setTimeout(next,60);u.onerror=e=>{if(e&&(e.error==='interrupted'||e.error==='canceled'))return;setTimeout(next,60)};speechSynthesis.speak(u)};
  if(!parts.length){tts.i++;return ttsSpeak()}next()}
function ttsStart(sec,all){if(!TTS_OK)return;try{if(!AU.paused)AU.pause()}catch(e){}speechSynthesis.cancel();tts.on=true;tts.all=all;tts.sec=sec;tts.i=0;tts.paused=false;const d=ttsSecs()[sec];if(d&&d.tagName==='DETAILS')d.open=true;ttsSpeak()}
function ttsStop(){tts.on=false;tts.paused=false;tts.tok++;if(TTS_OK)speechSynthesis.cancel();ttsMark();ttsBar()}
function ttsToggle(){if(!tts.on)return;if(tts.paused){tts.paused=false;if(speechSynthesis.paused)speechSynthesis.resume();else{speechSynthesis.cancel();ttsSpeak()}}else{tts.paused=true;speechSynthesis.pause()}ttsBar()}
function ttsJump(d){if(!tts.on)return;speechSynthesis.cancel();tts.paused=false;tts.i=Math.max(0,tts.i+d);ttsSpeak()}
function ttsRate(){const R=[1,1.25,1.5,0.75],i=R.indexOf(tts.rate);tts.rate=R[(i+1)%R.length];try{localStorage.setItem('murshid-tts-rate',tts.rate)}catch(e){}if(tts.on&&!tts.paused){speechSynthesis.cancel();ttsSpeak()}else ttsBar()}
function ttsBar(){document.body.classList.toggle('tts-on',tts.on);let b=document.getElementById('ttsBar');
  if(!tts.on){if(b)b.hidden=true;return}const U=tqU();
  if(!b){b=document.createElement('div');b.id='ttsBar';b.className='tts-bar';document.body.appendChild(b)}
  if(b.dataset.lang!==LANG){b.dataset.lang=LANG;b.dir=RTL()?'rtl':'ltr';b.innerHTML=`<span class="tts-t"></span><div class="tts-c" dir="ltr"><button class="au-b" data-ttsprev="1" aria-label="${esc(U.lprev)}">${AU_IC.prev}</button><button class="au-b au-big" data-ttstoggle="1" aria-label="${esc(U.lpause)}">${AU_IC.pause}</button><button class="au-b" data-ttsnext="1" aria-label="${esc(U.lnext)}">${AU_IC.next}</button><button class="tts-r" data-ttsrate="1"><b></b></button><button class="tts-x" data-ttsstop="1" aria-label="${esc(U.lstop)}">✕</button></div>`}
  b.hidden=false;
  const sc=ttsSecs()[tts.sec],sm=sc&&sc.querySelector(':scope > summary');b.querySelector('.tts-t').textContent=((sm||sc||{}).innerText||'').trim().split('\n')[0].slice(0,80);b.querySelector('[data-ttstoggle]').innerHTML=tts.paused?AU_IC.play:AU_IC.pause;b.querySelector('[data-ttsrate] b').textContent='×'+tts.rate}
function ttsClick(d){if(d.ttsall){ttsStart(0,true);return true}if(d.ttsfrom!==undefined){const L=ttsSecs(),i=L.indexOf(document.querySelector(d.ttsfrom));ttsStart(Math.max(0,i),true);return true}if(d.ttssec!==undefined){ttsStart(+d.ttssec,false);return true}
  if(d.ttstoggle){ttsToggle();return true}if(d.ttsstop){ttsStop();return true}if(d.ttsprev){ttsJump(-1);return true}if(d.ttsnext){ttsJump(1);return true}if(d.ttsrate){ttsRate();return true}return false}
if(TTS_OK){speechSynthesis.getVoices();speechSynthesis.onvoiceschanged=()=>{}}

function viewMethod(){if(!TQ)return '<p class="muted">جارٍ التحميل…</p>';
  const D=TQ[LANG]||TQ.ar,U=tqU(),rtl=LANG==='ar';
  if(tqQuery)setTimeout(tqSearch,0);
  if(tts.on)setTimeout(()=>{ttsMark();ttsBar()},0);
  return `<section class="tq${rtl?'':' notr'}" dir="${rtl?'rtl':'ltr'}" lang="${LANG}">
  <div class="tq-head"><h2>${D.title}</h2><p class="tq-sub">${D.sub}</p></div>
  <div class="tq-find"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg><input id="tqQ" type="search" autocomplete="off" placeholder="${esc(U.ph)}" value="${esc(tqQuery)}"><button class="tq-clr" data-tqclr="1" ${tqQuery?'':'hidden'} aria-label="${esc(U.clr)}">✕</button></div>
  <p class="tq-cnt" id="tqN" hidden></p>
  ${TTS_OK?`<button class="tts-all" data-ttsall="1"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12"/></svg><span>${U.lall}</span></button>`:''}
  <div id="tqSecs">${D.secs.map((s,i)=>`<details class="tq-s" data-tqs="${i}"><summary>${s.t}</summary>${TTS_OK?`<button class="tts-one" data-ttssec="${i}" aria-label="استمع إلى هذا القسم"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 8.5a5 5 0 0 1 0 7"/></svg>${U.lone}</button>`:''}${s.b.map(tqBlock).join('')}</details>`).join('')}</div>
  <div class="tq-ask" id="tqAskBox"><h3>${U.ask}</h3><textarea id="tqAsk" rows="3" placeholder="${esc(U.askp)}">${esc(tqAskDraft)}</textarea>
   <div class="btns"><button class="btn ok" data-tqask="1" ${tqAskBusy?'disabled':''}>${U.send}</button></div>
   <p class="tq-hint">${tqAskMsg?esc(tqAskMsg):U.hint}</p></div>
  <div class="btns" style="margin-top:4px"><button class="btn primary" data-go="tazkiya">${U.start}</button></div>
 </section>`}
function tqSearch(){
  const box=document.getElementById('tqSecs'),N=document.getElementById('tqN');if(!box)return;
  const U=tqU(),raw=tqQuery.trim(),q=tqNorm(raw);
  const clr=document.querySelector('[data-tqclr]');if(clr)clr.hidden=!raw;
  box.querySelectorAll('mark').forEach(m=>m.replaceWith(...m.childNodes));box.normalize();
  box.querySelectorAll('.hit').forEach(e=>e.classList.remove('hit'));
  const secs=[...box.querySelectorAll('.tq-s')];
  if(q.length<2){secs.forEach(s=>{s.hidden=false});N.hidden=true;return}
  const words=q.split(/\s+/).filter(w=>w.length>1).map(w=>LANG!=='ar'&&w.length>=6?w.slice(0,-2):w);let total=0,first=null;
  secs.forEach(s=>{let n=0;
    s.querySelectorAll('p,li,dt,dd,h4,summary').forEach(e=>{const t=tqNorm(e.textContent);
      if(words.every(w=>t.includes(w))){n++;e.classList.add('hit');if(!first)first=e;tqMark(e,words)}});
    s.hidden=!n;if(n)s.open=true;total+=n});
  N.hidden=false;N.innerHTML=total?`${U.n}: <b>${total}</b>`:`${U.none} <button class="tq-lnk" data-tqasknow="1">${U.ask}</button>`;
  if(first&&tqSearch.jump){tqSearch.jump=false;first.scrollIntoView({block:'center',behavior:'smooth'})}}
function tqMark(el,words){
  const walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT),nodes=[];let x;while((x=walk.nextNode()))nodes.push(x);
  nodes.forEach(tn=>{const s=tn.nodeValue;let map=[],ns='';
    for(let i=0;i<s.length;i++){const c=tqNorm(s[i]);for(let j=0;j<c.length;j++){ns+=c[j];map.push(i)}}
    const rs=[];words.forEach(w=>{let p=ns.indexOf(w);while(p>-1){rs.push([map[p],map[p+w.length-1]+1]);p=ns.indexOf(w,p+w.length)}});
    if(!rs.length)return;rs.sort((a,b)=>a[0]-b[0]);
    const f=document.createDocumentFragment();let last=0;
    rs.forEach(([a,b])=>{if(a<last)return;if(LANG!=='ar')while(b<s.length&&/\p{L}/u.test(s[b]))b++;f.append(s.slice(last,a));const m=document.createElement('mark');m.textContent=s.slice(a,b);f.append(m);last=b});
    f.append(s.slice(last));tn.replaceWith(f)})}
async function tqAskSend(){const U=tqU(),el=document.getElementById('tqAsk'),t=(el&&el.value||'').trim();tqAskDraft=t;
  if(!t){tqAskMsg=U.empty;return render()}
  if(!window.FB||!AUTH.user||navigator.onLine===false){tqAskMsg=U.off;return render()}
  tqAskBusy=true;render();
  try{await FB.sendMessage(AUTH.user,'❓ سؤال عن المنهج المحمدي'+(tqQuery?' (بحث: '+tqQuery+')':'')+':\n'+t,S.name||'',LANG);tqAskMsg=U.sent;tqAskDraft=''}
  catch(e){tqAskMsg=U.fail+(e&&e.code?' ('+e.code+')':'')}
  tqAskBusy=false;render();const b=document.getElementById('tqAskBox');if(b)b.scrollIntoView({block:'center'})}

function viewNotif(){
  const pt=prayerTimes(new Date()),nx=nextPrayer(pt),L=dayLog(),now=new Date().getHours()+new Date().getMinutes()/60;
  const items=[{on:true,t:`اقترب وقت صلاة ${nx.n}`,s:`عند ${hm(pt[nx.k])}`}];
  if(prepPendingToday())items.push({on:true,t:'لم تُسجّل المرحلة التمهيدية اليوم',s:`اليوم ${prepDays()+1} من 30 · طول الصمت، حسن الخلق، الحضور مع الله`,go:'tazkiya'});
  try{const one=(id,go,lbl)=>{const A=trS(id);if(!A.base||A.base>TODAY||A.done.length>=trN(id))return;const R=trSim(id);if(R.complete||R.today)return;items.push({on:true,t:`<span>لم تُسجّل تدريب اليوم</span>: <span>${lbl}</span>`,s:`<span>اليوم</span> ${Math.min(R.days+1,30)} <span>من</span> 30`,go})};if(S.aqlT)one('aql','aql',Tx('تزكية العقل'));AHD.forEach(a=>{if(S.ahd&&S.ahd[a.id])one(a.id,'qalbruh',Tx('عهد')+' '+Tx(a.n))})}catch(e){}
  pendingOrgans().forEach(g=>items.push({on:true,t:`لم تُسجّل محاسبة ${g.name} اليوم`,s:`مرحلة ${PHASE[S.organs[g.id].phase]} · اليوم ${S.organs[g.id].days+1} من 30`,go:'tazkiya'}));
  const lt=lights();
  if(!lt.halo)items.push({on:true,t:`${lt.p.kind==='sabah'?'أذكار الصباح':'أذكار المساء'}: الهالة مطفأة`,s:`أكّدها قبل ${lt.p.endName} ${tHM(lt.p.end)}`,go:'aamal'});
  if(!lt.dhikrToday)items.push({on:!lt.heart,t:'الذكر الشخصي اليومي',s:lt.heart?`القلب مستنير حتى ${tHM(lt.heartEnd)}`:'القلب مطفأ',go:'aamal'});
  if(!lt.quranToday)items.push({on:!lt.head,t:'الورد اليومي من القرآن',s:lt.head?`الرأس مستنير حتى ${tHM(lt.headEnd)}`:'الرأس مطفأ',go:'aamal'});
  seasonal().filter(s=>s.tag==='اليوم'||s.tag==='الجمعة').forEach(s=>items.push({on:!L.awrad.includes(s.id),t:s.t,s:s.s,go:'aamal'}));
  return `<section><div class="box">${items.map(i=>`<div class="notif"><i class="dot${i.on?' on':''}"></i><div class="t">${i.t}<small>${i.s}</small></div>${i.go?`<button class="btn" data-go="${i.go}">افتح</button>`:''}</div>`).join('')}</div>
  <p class="muted">التنبيهات هنا داخل الصفحة. التنبيهات الفعلية على الهاتف تحتاج نسخة التطبيق المثبّتة.</p></section>`;
}
const APP_VER='__BUILD__';
function errLog(m){try{const L=JSON.parse(localStorage.getItem('murshid-err')||'[]');L.push({t:new Date().toISOString().slice(0,16),v:APP_VER,s:typeof screen==='string'?screen:'',m:String(m).slice(0,300)});localStorage.setItem('murshid-err',JSON.stringify(L.slice(-30)))}catch(e){}}
window.addEventListener('error',e=>errLog((e.message||'error')+' @'+(e.filename||'').split('/').pop()+':'+(e.lineno||'')));
window.addEventListener('unhandledrejection',e=>errLog('promise: '+((e.reason&&(e.reason.code||e.reason.message))||e.reason)));
let OFFREADY=null,OFFST=null;
/* what is really saved on this phone: the app, the translations, the Mushaf, the pictures */
async function checkOffline(){let st={sw:false,app:false,i18n:LANG==='ar',quran:0,img:0};
  try{st.sw=!!(navigator.serviceWorker&&navigator.serviceWorker.controller);
    if(window.caches){st.app=!!(await caches.match('index.html',{ignoreSearch:true}));
      if(LANG!=='ar')st.i18n=!!(await caches.match('i18n.json',{ignoreSearch:true}));
      const ks=await caches.keys();for(const k of ks){if(/quran/.test(k)){const c=await caches.open(k);const r=await c.keys();st.quran=new Set(r.map(x=>(x.url.match(/\/[qm](\d\d)\.bin/)||[])[1]).filter(Boolean)).size}
        if(/murshid-img/.test(k)){const c=await caches.open(k);st.img=(await c.keys()).length}}}}catch(e){}
  const ok=st.sw&&st.app&&st.i18n,ch=JSON.stringify(st)!==JSON.stringify(OFFST);OFFST=st;
  if(ok!==OFFREADY||ch){OFFREADY=ok;if(screen==='profile'){const y=SCR().scrollTop;render();SCR().scrollTo(0,y)}}}
function offlineLine(){const s=OFFST;if(!s)return '';
  const row=(ok,t,v)=>`<li class="${ok?'ok':''}"><i>${ok?'✓':'…'}</i><span>${t}</span>${v?`<small dir="ltr">${v}</small>`:''}</li>`;
  return `<div class="off-st"><p class="${OFFREADY?'logged':'meta'}" style="margin:10px 0 6px">${OFFREADY?'يعمل التطبيق دون إنترنت ✓':s.sw?'يُحفظ التطبيق للعمل دون إنترنت الآن…':'سيُحفظ التطبيق للعمل دون إنترنت بعد أول فتح كامل له وأنت متصل.'}</p>
   <ul>${row(s.app&&s.sw,'التطبيق والأذكار ومواقيت الصلاة وتقدّمك')}${LANG!=='ar'?row(s.i18n,'الترجمة'):''}${row(s.quran>=60,'المصحف',(mshDl&&mshDl.on?mshDl.n:s.quran)+' / 60')}${row(s.img>=IL_IMG.size,'الصور',Math.min(s.img,IL_IMG.size)+' / '+IL_IMG.size)}</ul>
   ${s.quran<60?`<button class="btn small" data-mshdl="1"${mshDl&&mshDl.on?' disabled':''} style="margin:6px 0 2px">${mshDl&&mshDl.on?Tx('جارٍ التنزيل…')+' '+mshDl.n+' / 60':Tx('نزّل المصحف ليُقرأ دون إنترنت')}</button>`:''}
   <p class="meta" style="margin:4px 0 0">الدروس الصوتية والمرئية تحتاج إنترنت.</p></div>`}
/* the pictures of the lessons are saved on the phone once per version, quietly, while online */
async function prefetchImgs(){try{if(!window.caches||!navigator.onLine)return;
  const v=(typeof APP_VER!=='undefined'?APP_VER:'')+'|'+IL_IMG.size;let done='';try{done=localStorage.getItem('murshid-imgv')||''}catch(e){}
  const c=await caches.open('murshid-img-v2');let miss=0;
  for(const k of IL_IMG){const path=new URL('il/'+k+'.webp',location.href).pathname;if(await c.match(path))continue;
    try{const r=await fetch('il/'+k+'.webp');if(r.ok&&(r.headers.get('Content-Type')||'').startsWith('image/'))await c.put(path,r);else miss++}catch(e){miss++}}
  if(!miss&&done!==v){try{localStorage.setItem('murshid-imgv',v)}catch(e){}}
  checkOffline()}catch(e){}}
setTimeout(prefetchImgs,6000);addEventListener('online',()=>setTimeout(prefetchImgs,2000));
setTimeout(checkOffline,2500);setInterval(checkOffline,30000);
let bkPending=null,bkMsg='',bkWhen='';
function applyFz(){}
/* text size: scale each text element's own size (CSS zoom breaks fixed positioning on iPhone) */
function fzApply(){const f=S.fz||1;if(f===1)return;try{const els=[...document.querySelectorAll('main.sheet, main.sheet *')].filter(e=>!(e instanceof SVGElement));
  const sz=els.map(e=>parseFloat(getComputedStyle(e).fontSize)||0);els.forEach((e,i)=>{if(sz[i])e.style.fontSize=(sz[i]*f).toFixed(2)+'px'})}catch(e){}}
async function backupExport(){S.lastBackup=TODAY;save();const blob=new Blob([JSON.stringify({app:'almurshid',v:1,at:Date.now(),S})],{type:'application/json'}),name='almurshid-'+TODAY+'.json';
  try{const f=new File([blob],name,{type:'application/json'});if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],title:name});bkMsg='حُفظت النسخة الاحتياطية.';render();return}}catch(e){if(e&&e.name==='AbortError')return}
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1000);bkMsg='حُفظت النسخة الاحتياطية في التنزيلات.';render()}
function backupRead(f){if(!f)return;const r=new FileReader();r.onload=()=>{try{const j=JSON.parse(r.result),X=j&&j.app==='almurshid'?j.S:j;if(!X||!X.organs||!X.log)throw 0;bkPending=X;bkWhen=fmtD(ds(new Date(j.at||X.updatedAt||Date.now())));bkMsg=''}catch(e){bkPending=null;bkMsg='هذا الملف ليس نسخة احتياطية من «المرشد».'}aboutOpen.add('backup');render()};r.readAsText(f)}
function viewProfile(){
  const started=ORGANS.filter(g=>S.organs[g.id].phase!=='idle').length,P=pushPrefs(),u=AUTH.user;
  if(pushMsg||pushBusy)aboutOpen.add('push');if(bkPending||bkMsg)aboutOpen.add('backup');if(acctMsg||delAsk)aboutOpen.add('account');if(photoMsg)aboutOpen.add('pname');if(geoMsg)aboutOpen.add('city');if(confirmReset)aboutOpen.add('data');
  const strip=h=>h.replace(/^\s*<section[^>]*>\s*<div class="sh"><h2>[^<]*<\/h2>(<span>[^<]*<\/span>)?<\/div>/,'').replace(/<\/section>\s*$/,'');
  const account=AUTH.state==='local'||u?strip(accountSection()):'';
  return `<section class="ab-hero pf-hero"><label class="pf-av" for="photoIn" aria-label="تغيير الصورة"><span class="avatar big">${avatarImg()}</span><span class="pf-edit"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/></svg></span></label>
    <h2 class="ab-name">${esc(S.name||'')}</h2><p class="ab-tag"><span class="notr">${esc(cityName(S.loc))}</span></p>
    <div class="ab-chips"><span>${started} من ${ORGANS.length} جوارح بدأت تزكيتها</span>${prepState().status==='active'?`<span>المرحلة التمهيدية ${Math.min(prepDays(),30)} من 30</span>`:''}</div>
    ${offlineLine()}</section>
   <p class="ab-g">ملفك</p>
   <div class="acc-card">${acc('pname','user','الاسم والصورة',`<label for="pname" class="muted">الاسم الظاهر في الرئيسية</label><input type="text" id="pname" value="${esc(S.name)}">
   <label class="muted" style="display:block;margin-top:10px">صورة الملف الشخصي</label>
   <p class="meta" style="margin:0">${S.photo?'صورة اخترتها بنفسك.':AUTH.user&&AUTH.user.photoURL?'صورة حسابك في Google.':'لا توجد صورة بعد. عند الدخول بحساب Google تظهر صورة حسابك تلقائيًا.'}</p>
   <div class="ph-btns"><label class="btn small" for="photoIn">تغيير الصورة</label><input type="file" id="photoIn" accept="image/*" hidden>${S.photo?'<button class="btn small" data-photodel="1">'+(AUTH.user&&AUTH.user.photoURL?'العودة إلى صورة Google':'إزالة الصورة')+'</button>':''}</div>
   ${photoMsg?`<p class="logged bad">${esc(photoMsg)}</p>`:''}`)}
    ${acc('city','pin','المدينة ومواقيت الصلاة',`<p class="muted">تُحسب مواقيت الصلاة، ووقت أذكار الصباح والمساء، وإضاءة الهالة، حسب مدينتك.</p>
   <div class="box pad" style="display:flex;flex-direction:column;gap:10px">
    <div>المدينة الحالية: <b class="notr">${esc(cityName(S.loc))}</b>${S.loc?(S.loc.auto?' <span class="meta">(حُدّدت تلقائيًا)</span>':''):' <span class="meta">(افتراضية)</span>'}</div>
    <div class="btns"><button class="btn ok" data-geoloc="1">حدّد موقعي تلقائيًا</button></div>
    <p class="meta" style="margin:-4px 0 0">يُستعمل موقعك مرة واحدة لاختيار أقرب مدينة وحساب مواقيت الصلاة، ويبقى في هاتفك. إن لم تسمح به، اختر مدينتك من القائمة.</p>${S.loc&&S.loc.at?`<p class="meta" style="margin:0"><span>آخر تحديث للمدينة:</span> ${fmtD(ds(new Date(S.loc.at)))}</p>`:''}
    <label for="citySel" class="muted">أو اختر مدينتك:</label>
    <div class="city-row"><select id="citySel" class="notr"><option value="">—</option><optgroup label="${LANG==='ar'?'المغرب':LANG==='ur'?'مراکش':'Morocco'}">${CITIES.map((c,i)=>c[0]==='ma'?`<option value="${i}"${S.loc&&!S.loc.auto&&S.loc.lt===c[2]?' selected':''}>${RTL()?c[1]:c[2]}</option>`:'').join('')}</optgroup><optgroup label="${LANG==='ar'?'مدن أخرى':'Other cities'}">${CITIES.map((c,i)=>c[0]==='w'?`<option value="${i}"${S.loc&&!S.loc.auto&&S.loc.lt===c[2]?' selected':''}>${RTL()?c[1]:c[2]}</option>`:'').join('')}</optgroup></select></div>
    ${geoMsg?`<p class="meta">${esc(geoMsg)}</p>`:''}
    <p class="meta" style="margin:0">الفجر ${hm(prayerTimes(new Date()).fajr)} · المغرب ${hm(prayerTimes(new Date()).maghrib)}</p>
   </div>${ptAdjBox()}${adzBox()}`,`<span class="notr">${esc(cityName(S.loc))}</span>`)}</div>
   <div class="acc-card">${TTS_OK?acc('voice','speaker','صوت القراءة',voiceBox()):''}</div>
   <div class="acc-card">${acc('font','font','حجم الخط',`<p class="muted">كبّر الخط إن كانت القراءة متعبة، خاصة في الأذكار.</p><p class="meta">ويمكنك أيضًا تكبير النص أو تصغيره بإصبعين في صفحات القراءة والقرآن.</p><div class="fz-row">${[[1,'عادي'],[1.12,'كبير'],[1.25,'أكبر']].map(([v,l])=>`<button class="btn${(S.fz||1)===v?' ok':''}" data-fz="${v}" style="font-size:${14*v}px">${l}</button>`).join('')}</div>`,(S.fz||1)===1?'عادي':S.fz===1.12?'كبير':S.fz===1.25?'أكبر':Math.round(S.fz*100)+'%')}</div>
   <p class="ab-g">التذكيرات</p>
   <div class="acc-card">${acc('push','bell','التذكيرات على الهاتف',strip(pushSection()),P.enabled?'مفعّلة':'غير مفعّلة')}</div>
   <p class="ab-g">الحساب والبيانات</p>
   <div class="acc-card">${account?acc('account','key','الحساب',account,u&&u.email?`<span class="notr" dir="ltr">${esc(u.email.split('@')[0])}</span>`:''):''}
    ${acc('backup','backup','النسخة الاحتياطية',`<p class="muted">احفظ كل بياناتك (الجوارح، الأوراد، الصلوات، المحاسبة، الواردات) في ملف على هاتفك، واسترجعها متى شئت، حتى بلا حساب أو عند تغيير الهاتف.</p>
   <div class="btns"><button class="btn ok" data-bkexp="1">حفظ نسخة احتياطية</button><label class="btn" for="bkIn">استرجاع من ملف</label><input type="file" id="bkIn" accept=".json,application/json" hidden></div>
   ${bkPending?`<div class="confirm"><span><span>ستُستبدل بياناتك الحالية بنسخة بتاريخ:</span> <b>${esc(bkWhen)}</b>. <span>متابعة؟</span></span><div class="btns"><button class="btn slip" data-bkyes="1">نعم، استرجعها</button><button class="btn" data-bkno="1">تراجع</button></div></div>`:''}
   ${bkMsg?`<p class="meta">${esc(bkMsg)}</p>`:''}
   ${S.lastBackup?`<p class="meta" style="margin:0"><span>آخر نسخة:</span> <span>${fmtD(S.lastBackup)}</span></p>`:''}`,S.lastBackup?fmtD(S.lastBackup):'')}
    ${acc('data','reset','البيانات',`<p class="muted">${S.demo?'تعرض الأقسام حاليًا بيانات تجريبية للتوضيح.':AUTH.state==='in'?'تُحفظ بياناتك في حسابك وفي هذا الهاتف.':'تُحفظ بياناتك في هذا المتصفح فقط.'}</p>
   ${confirmReset?`<div class="confirm"><span>سيُمسح كل السجل والتقدم. متابعة؟</span><button class="btn slip" data-resetyes="1">نعم، ابدأ من الصفر</button><button class="btn" data-resetno="1">تراجع</button></div>`:`<div class="btns"><button class="btn slip" data-reset="1">ابدأ رحلتي من الصفر</button></div>`}`)}</div>
   ${isAdmin()?'<div class="btns" style="justify-content:center;margin-top:16px"><button class="btn ok" data-go="admin">لوحة الإدارة</button></div>':''}`;
}

if(!S.marks)S.marks=S.demo?demoMarks():emptyMarks();
S.marks.dhikr.forEach(t=>syncWird('dhikr',true,ds(new Date(t))));
Object.values(S.log).forEach(L=>{if(!L.prayers&&L.awrad&&L.awrad.includes('salat'))L.prayers=['fajr','dhuhr','asr','maghrib','isha']});
S.marks.quran.forEach(t=>syncWird('quran',true,ds(new Date(t))));['sabah','masa'].forEach(k=>Object.keys(S.marks[k]).forEach(d=>syncWird(k,true,d)));
