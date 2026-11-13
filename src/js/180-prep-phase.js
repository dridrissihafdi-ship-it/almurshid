/* ---------- preliminary phase: three prophetic practices, 30 logged days, no reset ---------- */
const PREP=[
 {id:'samt',t:'طول الصمت',s:'لا تتكلم إلا بخير أو لحاجة، واترك فضول الكلام',d:'الأفضل أن تصمت إلا إذا كان كلامك يضيف طيبًا وقيمة. فكّر قبل أن تتكلم واسأل نفسك: هل في كلامي خير؟ فإن تكلّمت فبكلام جميل لطيف: صادق، رحيم، صبور، متسامح، مبهج. داوم على ذلك ثلاثين يومًا حتى يصير عادة ثابتة.'},
 {id:'khuluq',t:'حسن الخلق',s:'لين الكلام، وطلاقة الوجه، وكفّ الأذى، والصبر على الناس',d:'في كل تعامل مع الناس، اجعل غايتك أن تتركهم في حال أفضل مما وجدتهم عليه. أظهر الرحمة، وابعث الأمل، وعبّر عن المحبة واللطف في كل لقاء. التزم بذلك ثلاثين يومًا متتالية حتى يصير عادة ثابتة.'},
 {id:'hudur',t:'الحضور مع الله طيلة اليوم',s:'استحضار مراقبة الله في كل حال، والرجوع إليه كلما غفلت',d:'قال ﷺ: «الإحسان أن تعبد الله كأنك تراه، فإن لم تكن تراه فإنه يراك» (مسلم). في ساعات يقظتك، عند بداية كل ساعة، خذ لحظة تستحضر فيها حضور الله: أنه معك، يراك، ويسمعك، واربط قلبك به. داوم على ذلك ثلاثين يومًا حتى يصير عادة ثابتة، وسجّل تقدّمك كل يوم.'}];
const PREP_HAD='قال ﷺ لأبي ذر: «ألا أدلّك على خصلتين هما أخفّ على الظهر وأثقل في الميزان من غيرهما؟» قال: بلى يا رسول الله، قال: «عليك بحسن الخلق وطول الصمت، فوالذي نفسي بيده ما عمل الخلائق بمثلهما» (شعب الإيمان للبيهقي).';
const prepExp=x=>`<details class="prep-x"><summary>كيف أطبّقها؟</summary><p>${x.d}</p></details>`;
let prepFail=null,prepRedo=false,prepOpen=false;
document.addEventListener('toggle',e=>{if(e.target&&e.target.id==='prepD')prepOpen=e.target.open},true);
function prepState(){if(!S.prep)S.prep={status:'idle',log:{},cycle:1,history:[]};if(!S.prep.log)S.prep.log={};return S.prep}
const prepDayDone=d=>PREP.every(x=>d&&d[x.id]);
const prepDays=()=>Object.values(prepState().log).filter(prepDayDone).length;
const prepReady=()=>prepState().status==='done';
const prepPendingToday=()=>{const P=prepState();return P.status==='active'&&!prepDayDone(P.log[TODAY])};
function prepCard(){
  const P=prepState(),n=Math.min(prepDays(),30),T=P.log[tzDate||TODAY]||{};
  const fails=[];Object.keys(P.log).sort().forEach(d=>PREP.forEach(x=>{if(P.log[d][x.id]==='fail')fails.push({d,x,r:(P.log[d].notes||{})[x.id]||''})}));
  const okCount=id=>Object.values(P.log).filter(d=>d[id]==='ok').length;
  let body='';
  if(P.status==='idle')body=`<p class="meta" style="color:var(--ink)">قبل تزكية الجوارح، تدرّب ثلاثين يومًا على ثلاث وصايا نبوية. لا يُعاد العدّ إن أخفقت في يوم، بل تدوّن سبب الإخفاق وتستمر حتى تُتمّ ثلاثين يومًا.</p>
    <ul class="prep-l">${PREP.map(x=>`<li><b>${x.t}</b><small>${x.s}</small>${prepExp(x)}</li>`).join('')}</ul>
    <div class="btns"><button class="btn primary" data-prepstart="1">ابدأ المرحلة التمهيدية</button></div>`;
  else if(P.status==='active'){
    const stRow=`<label class="st-date"><span>تاريخ بدء المرحلة</span><input type="date" data-prepstartd="1" value="${P.start&&P.start<=TODAY?P.start:TODAY}" max="${TODAY}"></label><p class="meta st-note">إذا بدأت قبل تسجيلها في التطبيق، اختر يوم البدء: تُحسب الأيام منه إلى الأمس محقّقة، إلا ما سجّلت فيه إخفاقًا.</p>`;
    const rows=PREP.map(x=>{const v=T[x.id];
      if(prepFail===x.id)return `<div class="prep-r"><div class="t"><b>${x.t}</b></div><div class="confirm"><label for="prepnote-${x.id}" class="slip-label">سبب الإخفاق: ما الذي حصل؟</label><textarea id="prepnote-${x.id}" class="slip-note" placeholder="مثال: انشغلت فغفلت، أو غضبت في نقاش…"></textarea><div class="btns"><button class="btn slip" data-prepfailyes="${x.id}">سجّل الإخفاق</button><button class="btn" data-prepno="1">تراجع</button></div></div></div>`;
      if(v)return `<div class="prep-r"><div class="t"><b>${x.t}</b><small>${x.s}</small>${prepExp(x)}</div><span class="logged${v==='fail'?' bad':''}">${v==='ok'?'حققته ✓':'أخفقت اليوم'}</span><button class="btn small" data-prepundo="${x.id}">تعديل</button></div>`;
      return `<div class="prep-r"><div class="t"><b>${x.t}</b><small>${x.s}</small>${prepExp(x)}</div><div class="btns"><button class="btn ok" data-prepok="${x.id}">حققته</button><button class="btn slip" data-prepfail="${x.id}">أخفقت</button></div></div>`}).join('');
    body=`${P.start?`<p class="meta" style="margin:0 0 6px"><span>بدأت المرحلة:</span> ${fmtD(P.start)}</p>`:''}${rows}${prepDayDone(T)?`<div class="logged">سُجّل يوم ${String(n)} من 30. بارك الله فيك.</div>`:'<p class="meta">سجّل الوصايا الثلاث ليُحتسب اليوم.</p>'}${stRow}`;
  }else body=`<div class="logged">أتممت المرحلة التمهيدية${(P.cycle||1)>1?' في الدورة '+String(P.cycle):''} ✓</div>
    <div class="meta">${PREP.map(x=>`${x.t}: ${String(okCount(x.id))} يومًا`).join(' · ')}</div>`;
  const redo=P.status==='idle'?'':prepRedo?`<div class="confirm"><span>ستبدأ المرحلة التمهيدية من الصفر، ويُحفظ السجل السابق.</span><div class="btns"><button class="btn slip" data-prepredoyes="1">نعم، أعدها من الصفر</button><button class="btn" data-prepredono="1">تراجع</button></div></div>`:`<div class="redo"><span class="meta">إعادة المرحلة:</span><button class="btn small" data-prepredo="1">إعادة المرحلة التمهيدية من الصفر</button></div>`;
  const log=fails.length?`<details class="slips"><summary>مراجعة أسباب الإخفاق (${String(fails.length)})</summary><ol>${fails.reverse().map(f=>`<li><div class="sl-h"><b>${fmtD(f.d)}</b><span class="pill p-tathir">${f.x.t}</span></div><p>${f.r?'<span class="notr" dir="auto">'+esc(f.r)+'</span>':'<span class="meta">لم يُدوَّن سبب</span>'}</p></li>`).join('')}</ol></details>`:'';
  const hist=P.history&&P.history.length?`<details class="slips redo-h"><summary>سجل الإعادات (${String(P.history.length)})</summary><ol>${P.history.slice().reverse().map(h=>`<li><div class="sl-h"><b>${fmtD(h.date)}</b><span class="meta">بعد ${String(h.days)} يومًا</span></div></li>`).join('')}</ol></details>`:'';
  const ph=P.status==='done'?'done':P.status==='active'?'tathir':'idle';
  return `<div class="box organ prep"><div class="orow">${ring(n,ph)}<div class="info"><h3>المرحلة التمهيدية</h3><span class="pill p-${ph}">${P.status==='done'?'مكتملة':P.status==='active'?'قيد العمل':'لم تبدأ'}</span> <span class="meta">${P.status==='active'?'باقٍ '+String(30-n)+' يومًا':''}</span></div></div>
   <p class="quote notr" dir="rtl" lang="ar">«عليك بطول الصمت وحسن الخلق، فوالذي نفسي بيده ما تجمّل الخلائق بمثلهما»</p>${meaning('hsamt')}<details class="prep-d" id="prepD"${prepOpen?' open':''}><summary>${P.status==='idle'?'الوصايا الثلاث وطريقة العمل':P.status==='active'?(prepDayDone(T)?'سجل اليوم ✓':'سجّل يومك'):'تفاصيل المرحلة'}</summary><div class="prep-in"><p class="prep-had">${PREP_HAD}</p>${body}${redo}${log}${hist}</div></details></div>`;
}
function prepSet(id,v,note){const P=prepState(),DD=tzDate||TODAY,T=P.log[DD]||(P.log[DD]={});
  if(v===null){delete T[id];if(T.notes)delete T.notes[id]}else{T[id]=v;if(v==='fail'){(T.notes=T.notes||{})[id]=(note||'').trim()}else if(T.notes)delete T.notes[id]}
  prepFail=null;if(prepDays()>=30){P.status='done';P.doneAt=TODAY}save();render()}

