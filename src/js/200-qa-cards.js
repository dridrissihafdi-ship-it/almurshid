/* ---------- تأملات: guided muraqaba (synced animation + audio) and a journal of waridat ---------- */
let waredMsg='';
/* ---------- 200 questions on the path to God's good pleasure: flip cards ---------- */
let QA={qa:[],secs:[],tr:{}};
const qaDayIdx=(d)=>{const x=new Date((d||nowStr())+'T00:00:00Z').getTime()/864e5;const N=QA.qa.length;if(!N)return[0,0];return [(x*2)%N,(x*2+1)%N]};
/* the big texts (method + Q&A) load from data/*.json, kept offline by the service worker */
let DATA_OK=false;
async function dataLoad(){try{const [a,b]=await Promise.all([fetch('data/tq.json').then(r=>{if(!r.ok)throw 0;return r.json()}),fetch('data/qa.json').then(r=>{if(!r.ok)throw 0;return r.json()})]);TQ=a;QA=b;DATA_OK=true;try{render()}catch(e){}}catch(e){setTimeout(dataLoad,5000)}}
dataLoad();
let qaSec=-1,qaFocus=null;
const qaT=i=>{if(!QA.qa[i])return['…',''];const T=LANG!=='ar'&&QA.tr&&QA.tr[LANG];return T?T.qa[i]:[QA.qa[i][1],QA.qa[i][2]]};
const qaSecT=k=>{const T=LANG!=='ar'&&QA.tr&&QA.tr[LANG];return T?T.secs[k]:(QA.secs[k]||'')};
const qaDir=()=>RTL()?'dir="rtl" lang="'+LANG+'"':'dir="ltr" lang="'+LANG+'"';
function qaCard(i,big){const [q,a]=qaT(i),seen=(S.qaSeen2||[]).includes(i),fav=(S.qaFav||[]).includes(i);
  return `<div class="qa-w"><button class="qa-star${fav?' on':''}" data-qastar="${i}" aria-pressed="${fav}" aria-label="${esc(Tx(fav?'إزالة من المحفوظة':'احفظ السؤال'))}">${fav?'★':'☆'}</button><button class="qa-share" data-qashare="${i}" aria-label="${esc(Tx('شارك هذا السؤال'))}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12M7.5 7.5 12 3l4.5 4.5"/><path d="M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1"/></svg></button><button class="qa-card${big?' big':''}${qaFocus===i?' focus':''}" data-qa="${i}" id="qa-${i}" aria-label="${i+1}"><span class="qa-in"><span class="qa-f"><span class="qa-n">${i+1}${seen?' ✓':''}</span><b class="notr" ${qaDir()}>${q}</b><small class="qa-hint">اضغط لرؤية الجواب</small></span><span class="qa-b"><small class="qa-bq notr" ${qaDir()}>${q}</small><span class="qa-n">الجواب</span><span class="notr" ${qaDir()}>${a}</span><small class="qa-hint">اضغط للعودة إلى السؤال</small></span></span></button></div>`}
function viewQA(){if(!QA.qa.length)return '<p class="muted">جارٍ التحميل…</p>';const [m,e]=qaDayIdx(),seen=(S.qaSeen2||[]).length;
  const fav=S.qaFav||[],list=QA.qa.map((x,i)=>i).filter(i=>qaSec===-2?fav.includes(i):qaSec<0||QA.qa[i][0]===qaSec),last=S.qaLast;
  return `<div class="qa-search"><input type="search" id="qaQ" placeholder="${esc(Tx('ابحث في الأسئلة والأجوبة'))}" aria-label="${esc(Tx('ابحث في الأسئلة والأجوبة'))}" autocomplete="off"><p class="meta" id="qaNone" hidden>لا توجد نتيجة.</p><p class="meta" id="qaCnt" aria-live="polite" hidden><span id="qaCntN" dir="ltr"></span> <span>نتيجة</span> · <span>الكلمة مبرزة، والجواب ظاهر حين تكون الكلمة فيه</span></p></div>
  ${last!=null&&last>=0&&last<QA.qa.length?`<button class="box qa-last" data-qaopen="${last}"><small>آخر ما قرأت</small><b class="notr" ${qaDir()}>${qaT(last)[0]}</b></button>`:''}
  <section class="qa-daysec"><div class="sh"><h2>سؤالا اليوم</h2><span dir="ltr">${seen} / ${QA.qa.length}</span></div>
   <div class="qa-day"><div><p class="meta">بعد الفجر</p>${qaCard(m,1)}</div><div><p class="meta">بعد العشاء</p>${qaCard(e,1)}</div></div></section>
  <section><div class="sh"><h2>كل الأسئلة</h2></div>
   <div class="qa-chips"><button class="${qaSec===-1?'on':''}" data-qasec="-1">الكل</button><button class="${qaSec===-2?'on':''}" data-qasec="-2">★ <span>المحفوظة</span> <span dir="ltr">${fav.length}</span></button>${QA.secs.map((t,k)=>`<button class="${qaSec===k?'on':''} notr" data-qasec="${k}">${qaSecT(k)}</button>`).join('')}</div>
   ${qaSec===-2?(list.length?`<div class="qa-grid qa-list">${list.map(i=>qaCard(i)).join('')}</div>`:'<p class="muted">لم تحفظ سؤالًا بعد. اضغط ☆ على أي سؤال لتجده هنا.</p>'):''}${(qaSec===-2?[]:qaSec<0?QA.secs.map((t,k)=>k):[qaSec]).map(k=>`${ilBan('qa'+(k+1),'qa-ban')}<h3 class="qa-sh notr">${qaSecT(k)}</h3><div class="qa-grid qa-list">${list.filter(i=>QA.qa[i][0]===k).map(i=>qaCard(i)).join('')}</div>`).join('')}
   <p class="meta" style="margin-top:12px">يصلك سؤال بعد الفجر بربع ساعة وآخر بعد العشاء بنصف ساعة، إذا فعّلت «سؤال وجواب» في التذكيرات.</p></section>`}
function openQA(n,tries){n=+n;if(!QA.qa.length&&(tries||0)<20){setTimeout(()=>openQA(n,(tries||0)+1),300);return}if(!(n>=0&&n<QA.qa.length))return;qaSec=-1;qaFocus=n;go('qa');setTimeout(()=>{const el=document.querySelectorAll('#qa-'+n);const t=el[0];if(t)t.scrollIntoView({block:'center'})},120)}
