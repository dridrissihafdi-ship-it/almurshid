/* ---------- ask the sheikh (questions/{id}) ---------- */
let askData={list:null,busy:false,msg:'',draft:''};
const tsMs=t=>t&&t.toMillis?t.toMillis():t&&t.seconds?t.seconds*1000:0;
async function askLoad(){if(!(window.FB&&FB.myQs&&AUTH.user))return;try{const L=await FB.myQs(AUTH.user.uid);askData.list=L.sort((a,b)=>tsMs(b.createdAt)-tsMs(a.createdAt));
  try{localStorage.setItem('murshid-qa-ans',String(askData.list.filter(q=>q.answer).length))}catch(e){}}catch(e){askData.list=askData.list||[];askData.msg='تعذّر تحميل أسئلتك: '+(e.code||e.message)}if(screen==='ask'||screen==='home')render()}
function askUnseen(){const n=(askData.list||[]).filter(q=>q.answer).length;return n>(+((S.qSeen)||0))}
function viewAsk(){if(AUTH.state!=='in'||!AUTH.user)return '<section class="box pad"><p>سجّل الدخول بحسابك لتستطيع أن تسأل الشيخ، ويصلك الجواب هنا.</p></section>';
  if(askData.list===null&&!askData.busy){askData.busy=true;setTimeout(()=>askLoad().then(()=>{askData.busy=false}),0)}
  const L=askData.list||[],ans=L.filter(q=>q.answer).length;if(ans>(+S.qSeen||0)){S.qSeen=ans;save()}
  const f=t=>{const m=tsMs(t);return m?new Date(m).toLocaleDateString(LOC[LANG],{day:'numeric',month:'short',year:'numeric'}):'…'};
  return `<section><p class="muted">اكتب سؤالك في السلوك أو العبادة أو حال قلبك، فيصل إلى الشيخ، ويظهر جوابه هنا. سؤالك لا يراه إلا أنت والإدارة.</p>
   <div class="box pad"><label class="muted" for="askT">سؤالك</label><textarea id="askT" dir="auto" maxlength="2000" rows="4" placeholder="مثال: كيف أحافظ على حضور القلب في الصلاة؟">${esc(askData.draft)}</textarea>
    <div class="btns"><button class="btn ok" data-asksend="1">أرسل السؤال</button></div>${askData.msg?`<p class="logged">${esc(askData.msg)}</p>`:''}</div>
   <div class="sh" style="margin:20px 2px 10px"><h2>أسئلتي</h2><span>${L.length}</span></div>
   ${askData.list===null?'<p class="muted">جارٍ التحميل…</p>':L.length?L.map(q=>`<div class="box pad ask-q${q.answer?' ok':''}"><div class="ask-h"><small>${f(q.createdAt)}</small><span class="pill ${q.answer?'p-tanwir':''}">${q.answer?'أجاب الشيخ':'في انتظار الجواب'}</span></div>
     <p class="notr ask-t" dir="auto">${esc(q.text)}</p>${q.answer?`<div class="ask-a"><b>الجواب</b><p class="notr" dir="auto">${esc(q.answer)}</p></div>`:''}</div>`).join(''):'<p class="muted">لم تسأل بعد.</p>'}</section>`}
async function askSend(){const t=(document.getElementById('askT').value||'').trim();if(!t){askData.msg='اكتب سؤالك أولًا.';return render()}
  askData.draft=t;askData.msg='جارٍ الإرسال…';render();
  try{await FB.askQ(AUTH.user,t,S.name||'',LANG);askData.draft='';askData.msg='وصل سؤالك. سيظهر الجواب هنا إن شاء الله.';await askLoad()}catch(e){askData.msg='تعذّر الإرسال: '+(e.code||e.message)}render()}
/* admin side */
let adQ=null;
async function adQLoad(){try{adQ=await adminTry(()=>FB.allQs())}catch(e){adQ=[];adminData.msg='تعذّر تحميل الأسئلة: '+(e.code||e.message)+' — تأكّد من تحديث قواعد Firestore.'}render()}
function adQBlock(){if(adQ===null){adQ=undefined;setTimeout(adQLoad,0)}const L=adQ||[],open=L.filter(q=>!q.answer);
  if(adQ===undefined)return '<p class="muted" style="margin:0">جارٍ التحميل…</p>';
  return `<p class="muted" style="margin:0 0 8px">${open.length} <span>سؤال ينتظر الجواب</span></p>${L.length?`<div class="ad-list">${L.map(q=>`<div class="ad-row ad-msg"><div class="ad-mh"><b class="notr" dir="auto">${esc(q.name||'—')}</b><small>${q.answer?'✓ مُجاب':'جديد'}</small></div><p class="notr" dir="auto">${esc(q.text)}</p>
    <textarea id="adq-${q.id}" dir="auto" rows="3" placeholder="اكتب الجواب…">${esc(q.answer||'')}</textarea><div class="btns"><button class="btn ok small" data-adqans="${q.id}">${q.answer?'تحديث الجواب':'أرسل الجواب'}</button><button class="btn small dl-del" data-adqdel="${q.id}">حذف</button></div></div>`).join('')}</div>`:'<p class="muted">لا توجد أسئلة.</p>'}
   <div class="btns"><button class="btn small" data-adqreload="1">تحديث</button></div>`}
