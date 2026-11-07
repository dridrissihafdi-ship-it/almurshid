/* ---------- daily self-review (muhasaba) ---------- */
function mhState(){if(!S.muhasaba)S.muhasaba={};return S.muhasaba}
/* a night counts as reckoned when the faces were answered, or something was written */
const mhOn=d=>!!((mhState()[d]||{}).saved)||(()=>{try{return qmRows().length>0&&qmDone(d)}catch(e){return false}})();
function ikMh(){const K=ikS();if(!K.base||ikDays().n>=90&&ikDone(TODAY))return '';const a=(K.log[TODAY]||{}).a||[],n=Math.min(ikDays().n,90);
  return `<div class="sh mh-sh"><h2>أسئلة الإخلاص</h2><span><span>اليوم</span> ${Math.min(n+(ikDone(TODAY)?0:1),90)} <span>من</span> 90</span></div>
   <div class="box ik-q">${IKQ.map((q,i)=>`<div class="ik-r"><span>${q}</span><div class="ik-yn">${[1,0].map(v=>`<button class="${a[i]===v?(v===IKGOOD[i]?'g':'b'):''}" data-ikq="${i}" data-v="${v}">${v?'نعم':'لا'}</button>`).join('')}</div></div>`).join('')}</div>`}
let mhMsg='';
function viewMuhasaba(){
  const M=mhState(),k=tzDate||nowStr(),T=M[k]||{},days=Object.keys(M).filter(d=>M[d]&&M[d].saved).sort().reverse();
  const past=days.filter(d=>d!==k).slice(0,60);
  return `<section><p class="muted">قبل النوم، قف مع نفسك دقيقة: كيف كانت جوارحك اليوم؟ وأين زللت؟ من حاسب نفسه في الدنيا خفّ حسابه يوم القيامة.</p>${khMuhLine()}
   ${qmRows().length?qmCard(0,1):''}${ikMh()}
   <div class="sh mh-sh"><h2>اكتب محاسبتك</h2><span>اختياري</span></div>
   <div class="box pad mh-card">
    <label for="mh-good" class="mh-q">ماذا حفظت اليوم؟</label>
    <textarea id="mh-good" dir="auto" placeholder="مثال: حفظت لساني من الغيبة في مجلس العمل، وصليت الفجر في وقته…">${esc(T.good||'')}</textarea>
    <label for="mh-slip" class="mh-q">أين زللت؟</label>
    <textarea id="mh-slip" dir="auto" placeholder="مثال: غضبت في نقاش، وسهرت على الهاتف…">${esc(T.slip||'')}</textarea>
    <div class="btns"><button class="btn primary" data-mhsave="1">${T.saved?'تحديث ما كتبت':'احفظ ما كتبت'}</button></div>
    ${mhMsg?`<p class="logged">${esc(mhMsg)}</p>`:T.saved?'<p class="logged">حُفظ ما كتبت ✓</p>':''}
   </div></section>
   <section><div class="sh"><h2>محاسباتك السابقة</h2><span>${past.length}</span></div>
   ${past.length?`<div class="box">${past.map(d=>{const x=M[d];return `<details class="mh-past"><summary><b>${fmtD(d)}</b></summary>${x.good?`<p><span class="mh-tag ok">حفظت</span> <span class="notr" dir="auto">${esc(x.good)}</span></p>`:''}${x.slip?`<p><span class="mh-tag bad">زللت</span> <span class="notr" dir="auto">${esc(x.slip)}</span></p>`:''}</details>`}).join('')}</div>`:'<p class="muted">لم تسجّل محاسبة سابقة بعد. تظهر هنا محاسباتك يومًا بعد يوم.</p>'}</section>`;
}

