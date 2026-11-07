/* ---------- anonymous usage counts: which sections help, and where seekers stop on the path ----------
   Each phone adds +1 to a few counters in stats/d-YYYY-MM-DD, at most once a day per counter
   (and once ever for the milestones). Nothing identifies the phone or the person: no account, no id,
   no text, no times — only "one more phone opened «الأعمال» today". The seeker can turn it off in the settings.
   The list of counters must match ST_KEYS in firestore.rules. */
const ST_SCR=['home','maraka','search','h_ibadat','h_ruh','h_ilm','h_shurut','tasmi','me','wudu','salat','khushu','ikhub','ikhlas','sirr','ikhl','ahdaf','tawba','mujahada','series','fatur','tools','duas','qibla','hifz','ask','majalis','path','roadmap','fiqh','aqida','audio','sira','qiyama','method','tazkiya','uyub','muraqabat','sura','aamal','dhikr_run','adh_sabah','adh_masa','notif','profile','muhasaba','organ','quran','umrah','khalwa','subha','mushaf','qa','week','about','tahlil','ruhi','mraqib','munajat'];
/* daily: one per phone per day */
const ST_DAY=['dev','acct','guest','inst','l_ar','l_en','l_fr','l_es','l_ru','l_ur','ui_s','ui_c','f_pray','f_mh','f_kh','f_adh','f_q','f_mkw','f_mkl'];
/* milestones: one per phone, ever — they show how far seekers go */
const ST_MS=['m_seen','m_new','m_pray','m_uy','m_prep1','m_prep7','m_prep30','m_org','m_org7','m_org30','m_mh7','m_acct','m_push','m_inst'];
const ST_KEYS=[...ST_DAY,...ST_MS,...ST_SCR.map(s=>'v_'+s)];
const stOn=()=>!S.statsOff&&!S.demo&&!isAdmin();
function stLoad(){try{const s=JSON.parse(localStorage.getItem('murshid-st')||'null');if(s&&s.day===TODAY)return s;return {day:TODAY,sent:[],ms:(s&&s.ms)||[],pend:[]}}catch(e){return {day:TODAY,sent:[],ms:[],pend:[]}}}
let ST=stLoad();
function stSave(){try{localStorage.setItem('murshid-st',JSON.stringify(ST))}catch(e){}}
/* note a counter for today (sent later, in one write) */
function stMark(k){if(!ST_KEYS.includes(k))return;if(ST.day!==TODAY)ST=stLoad();if(ST.sent.includes(k)||ST.pend.includes(k))return;ST.pend.push(k);stSave()}
function stMile(k){if(!ST_MS.includes(k)||ST.ms.includes(k))return;stMark(k)}
/* what the seeker's own data already shows (read on this phone only) */
function stObserve(){try{
  stMark('dev');stMark(AUTH.state==='in'?'acct':'guest');
  const sa=window.matchMedia&&matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;if(sa){stMark('inst');stMile('m_inst')}
  stMark('l_'+(LANG||'ar'));stMark(S.ui==='classic'?'ui_c':'ui_s');
  const L=(S.log||{})[TODAY]||{};if((L.prayers||[]).length)stMark('f_pray');
  if(typeof mhOn==='function'&&mhOn(TODAY))stMark('f_mh');
  const any=Object.values(S.log||{}).some(x=>x&&(x.prayers||[]).length);if(any)stMile('m_pray');
  const U=S.uy||{};if(U.tests&&U.tests.length)stMile('m_uy');
  if(typeof prepDays==='function'){const p=prepDays();if(p>=1)stMile('m_prep1');if(p>=7)stMile('m_prep7');if(p>=30)stMile('m_prep30')}
  const O=Object.values(S.organs||{});if(O.some(o=>o&&o.phase&&o.phase!=='idle'))stMile('m_org');
  if(O.some(o=>o&&(o.days>=7||o.phase==='tanwir'||o.phase==='done')))stMile('m_org7');
  if(O.some(o=>o&&(o.phase==='tanwir'||o.phase==='done')))stMile('m_org30');
  if(typeof mhOn==='function'){let n=0;for(let i=0;i<60&&n<7;i++)if(mhOn(addDays(TODAY,-i)))n++;if(n>=7)stMile('m_mh7')}
  if(AUTH.state==='in')stMile('m_acct');
  try{if(typeof pushState==='function'&&pushState()[0]==='on')stMile('m_push')}catch(e){}
}catch(e){}}
let stBusy=false;
async function stFlush(){if(!stOn()||stBusy||!window.FB||!FB.stat)return;stObserve();if(!ST.pend.length)return;
  stBusy=true;const keys=ST.pend.slice(0,30);/* the rules accept 40 counters per write */
  try{await FB.stat(ST.day,keys);ST.sent.push(...keys);keys.forEach(k=>{if(ST_MS.includes(k)&&!ST.ms.includes(k))ST.ms.push(k)});ST.pend=ST.pend.filter(k=>!keys.includes(k));stSave()}catch(e){}
  stBusy=false;if(ST.pend.length&&ST.sent.length)setTimeout(stFlush,3000)}
/* screens opened, and a few actions */
let stLastScr='';
setInterval(()=>{if(screen&&screen!==stLastScr){stLastScr=screen;if(ST_SCR.includes(screen))stMark('v_'+screen);if(screen==='adh_sabah'||screen==='adh_masa')stMark('f_adh')}},1500);
document.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('[data-khq],[data-qaopen],[data-qastar]');if(!t)return;
  if(t.dataset.khq!==undefined)stMark('f_kh');else stMark('f_q')},true);
/* a phone is new when this is its first day with the app (older users are not counted as new) */
(function(){let first=TODAY;try{const ks=Object.keys(S.log||{}).sort();if(ks.length)first=ks[0]}catch(e){}if(!localStorage.getItem('murshid-st')&&first>=addDays(TODAY,-1))stMile('m_new');stMile('m_seen')})();
setTimeout(stFlush,20000);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')stFlush()});

/* ---------- the admin's view: «ما ينفع فعلًا» ---------- */
let stData=null,stBusyR=false;
async function stRead(){if(stBusyR||!window.FB||!FB.statRead)return;stBusyR=true;
  try{const days=Array.from({length:30},(_,i)=>addDays(TODAY,-i));stData=await FB.statRead(days)}catch(e){stData={err:String(e&&e.code||e)}}
  stBusyR=false;render()}
function stBlock(){if(!stData){setTimeout(stRead,0);return '<p class="muted" style="margin:0">جارٍ التحميل…</p>'}
  if(stData.err)return `<p class="meta">تعذّر تحميل الإحصاء (${esc(stData.err)}). تأكّد من نشر قواعد Firestore الجديدة.</p>`;
  const D=stData,days=Object.keys(D).filter(k=>k!=='all').sort(),sum=k=>days.reduce((a,d)=>a+((D[d]||{})[k]||0),0),last=k=>days.slice(-7).reduce((a,d)=>a+((D[d]||{})[k]||0),0);
  const card=(t,v,sub)=>`<div class="st-c"><small>${t}</small><b>${v}</b>${sub?`<span>${sub}</span>`:''}</div>`;
  const d14=days.slice(-14),mx=Math.max(1,...d14.map(d=>(D[d]||{}).dev||0));
  const avg=k=>{const n=days.filter(d=>(D[d]||{}).dev).length||1;return Math.round(sum(k)/n)};
  const pct=(a,b)=>b?Math.round(a/b*100)+'%':'—';
  /* the path: phones that reached each milestone in the last 30 days */
  const F=[['m_seen','استعملوا التطبيق'],['m_pray','سجّلوا صلاة'],['m_prep1','بدأوا المرحلة التمهيدية'],['m_prep7','أتمّوا 7 أيام تمهيدية'],['m_prep30','أتمّوا المرحلة التمهيدية'],['m_uy','شخّصوا عيوبهم'],['m_org','بدأوا تطهير جارحة'],['m_org7','بلغوا 7 أيام في جارحة'],['m_org30','أتمّوا تطهير جارحة'],['m_mh7','حاسبوا أنفسهم 7 ليالٍ'],['m_acct','أنشأوا حسابًا أو دخلوا'],['m_push','فعّلوا التذكيرات'],['m_inst','ثبّتوا التطبيق على الشاشة']];
  const A=D.all||{},f0=Math.max(1,A.m_seen||0);
  const funnel=`<ol class="st-scr st-fun">${F.map(([k,t])=>{const v=A[k]||0;return `<li><span>${t}</span><i><b style="width:${Math.max(2,Math.min(100,Math.round(v/f0*100)))}%"></b></i><small dir="ltr">${v}</small></li>`}).join('')}</ol>`;
  /* sections: phone-days that opened each one; the least used and the unused */
  const sc=ST_SCR.map(s=>[s,sum('v_'+s)]).sort((a,b)=>b[1]-a[1]),top=sc.filter(x=>x[1]>0),zero=sc.filter(x=>!x[1]).map(x=>x[0]);
  const scList=L=>`<ol class="st-scr">${L.map(([k,v])=>`<li><span>${esc(scrName(k))}</span><i><b style="width:${Math.max(3,Math.round(v/((top[0]||[0,1])[1]||1)*100))}%"></b></i><small dir="ltr">${v}</small></li>`).join('')}</ol>`;
  return `<p class="meta" style="margin-top:0">أعداد مجهولة الهوية من كل الهواتف، بحساب أو بدونه، في آخر 30 يومًا. لا يُعرف منها أحد، ولا يُرسل شيء من أعمال السالك.</p>
   <div class="st-g">${card('هواتف نشطة اليوم',(D[TODAY]||{}).dev||0)}${card('معدّل الهواتف في اليوم',avg('dev'))}${card('هواتف جديدة في 30 يومًا',sum('m_new'))}${card('بلا حساب',pct(sum('guest'),sum('dev')),'من أيام الاستعمال')}${card('مثبّت على الشاشة',pct(sum('inst'),sum('dev')))}${card('الواجهة المبسّطة',pct(sum('ui_s'),sum('dev')))}</div>
   <h4 class="st-h">الهواتف النشطة في آخر 14 يومًا</h4><div class="st-bars">${d14.map(d=>{const v=(D[d]||{}).dev||0;return `<div class="st-b" title="${d}"><i style="height:${Math.round(v/mx*100)}%"></i><small>${+d.slice(8)}</small><em>${v||''}</em></div>`}).join('')}</div>
   <h4 class="st-h">أين يصل السالكون في الطريق؟</h4><p class="meta">عدد الهواتف التي بلغت كل خطوة، منذ بدء هذا الإحصاء. حيث ينقص العدد كثيرًا بين خطوتين، فهناك ما يحتاج تيسيرًا.</p>${funnel}
   <h4 class="st-h">ما يفعلونه في يومهم</h4><div class="st-g">${card('سجّلوا صلاة',pct(sum('f_pray'),sum('dev')),'من أيام الاستعمال')}${card('فتحوا الأذكار',pct(sum('f_adh'),sum('dev')))}${card('حاسبوا أنفسهم',pct(sum('f_mh'),sum('dev')))}${card('أجابوا عن الخشوع',pct(sum('f_kh'),sum('dev')))}${card('قرأوا سؤالًا',pct(sum('f_q'),sum('dev')))}${card('انتصروا في معركة اليوم',pct(sum('f_mkw'),sum('f_mkw')+sum('f_mkl')),'من المعارك المعلنة')}</div>
   <h4 class="st-h">الأقسام الأكثر فتحًا</h4><p class="meta">الرقم: عدد مرات فتح القسم، مرة واحدة على الأكثر لكل هاتف في اليوم.</p>${top.length?scList(top.slice(0,12)):'<p class="meta">لا توجد بيانات بعد.</p>'}
   ${top.length>12?`<h4 class="st-h">الأقل فتحًا</h4>${scList(top.slice(-8).reverse())}`:''}
   ${zero.length?`<h4 class="st-h">لم يفتحها أحد في 30 يومًا</h4><div class="st-l">${zero.map(k=>`<span>${esc(scrName(k))}</span>`).join('')}</div>`:''}
   <div class="btns"><button class="btn small" data-streload="1">تحديث</button></div>`}
document.addEventListener('click',e=>{const t=e.target.closest('[data-streload],[data-stoff]');if(!t)return;
  if(t.dataset.streload){stData=null;render();return}
  if(t.dataset.stoff){S.statsOff=!S.statsOff;save();render()}});
