/* ---------- series added by the admin (content/main → series): audio/<k>/ or video/<k>/ ---------- */
let serSel=null;
const serCur=()=>(CONTENT.series||[]).find(x=>x.k===serSel)||null;
function serSet(k){serSel=k;const d=serCur();TITLES.series=d?d.t:'';VERSES.series=d?(d.v||''):''}
function viewSeries(){const d=serCur();if(!d)return '<section class="box pad"><p>هذه السلسلة غير موجودة.</p></section>';
  return d.kind==='video'?viewVideo(d.k,d.by):viewAudio(d.k)}
function serCards(){return (CONTENT.series||[]).filter(d=>!d.hide).map(d=>{const vid=d.kind==='video';let n=0,dn=0;
   if(vid){const L=vdList(d.k);n=L.length;dn=L.filter(p=>vdSt().done[p]).length}else{const g=(auCat||[]).find(x=>x.k===d.k);if(g){n=g.items.length;dn=g.items.filter(x=>auSt().done[x.p]).length}}
   return `<button class="tm-feat tm-sira" data-serid="${esc(d.k)}"><small><span>${vid?'سلسلة مرئية':'سلسلة صوتية'}</span>${n?` · <span>${vid?'شاهدت':'استمعت إلى'}</span> ${dn} <span>من</span> ${n}`:''}</small><b class="notr" dir="auto">${esc(d.t)}</b>${d.v?`<span class="tm-v notr" dir="rtl" lang="ar">${esc(d.v)}</span>`:''}${n?`<i><b style="width:${dn/n*100}%"></b></i>`:''}</button>`}).join('')}
function adSerBlock(){const L=CONTENT.series||[];
  return `<p class="muted" style="margin:0 0 8px">أنشئ سلسلة جديدة تظهر في «تأملات». ارفع ملفاتها في مجلد بالاسم نفسه داخل <span class="notr" dir="ltr">audio/</span> للصوت أو <span class="notr" dir="ltr">video/</span> للفيديو، مثل «01 - العنوان.mp3»، فتظهر الحلقات وحدها.</p>
   ${L.length?`<div class="ad-list">${L.map((d,i)=>`<div class="ad-row ad-x"><div><b class="notr" dir="auto">${esc(d.t)}</b><small class="notr" dir="ltr">${d.kind==='video'?'video':'audio'}/${esc(d.k)}</small></div><div class="btns" style="margin:0"><button class="btn small" data-adserhide="${i}">${d.hide?'إظهار':'إخفاء'}</button><button class="btn small dl-del" data-adserdel="${i}">حذف</button></div></div>`).join('')}</div>`:'<p class="muted">لا توجد سلاسل مضافة.</p>'}
   <label class="muted" for="sr-kind">النوع</label><select id="sr-kind"><option value="audio">سلسلة صوتية</option><option value="video">سلسلة مرئية</option></select>
   <label class="muted" for="sr-k">اسم المجلد (بالضبط كما في GitHub)</label><input id="sr-k" type="text" dir="auto" placeholder="مثال: شرح_الحكم_العطائية">
   <label class="muted" for="sr-t">العنوان الظاهر</label><input id="sr-t" type="text" dir="auto" placeholder="مثال: شرح الحكم العطائية">
   <label class="muted" for="sr-v">آية أو وصف قصير (اختياري)</label><input id="sr-v" type="text" dir="auto">
   <label class="muted" for="sr-b">الشيخ أو المصدر (اختياري)</label><input id="sr-b" type="text" dir="auto">
   <div class="btns"><button class="btn ok" data-adseradd="1">أنشئ السلسلة</button></div>`}
function serClick(d){
  if(d.serid){serSet(d.serid);go('series');return true}
  if(!isAdmin())return false;
  if(d.adseradd){const v=id=>(document.getElementById(id).value||'').trim(),k=v('sr-k').replace(/^(audio|video)\//,'').replace(/\/+$/,''),t=v('sr-t');
    if(!k||!t){adminData.msg='اكتب اسم المجلد والعنوان.';render();return true}if((CONTENT.series||[]).some(x=>x.k===k)){adminData.msg='هذه السلسلة موجودة.';render();return true}
    adminSave({series:[...(CONTENT.series||[]),{k,t,kind:v('sr-kind')==='video'?'video':'audio',v:v('sr-v'),by:v('sr-b')}]},'أُنشئت السلسلة، وتظهر في «تأملات».');return true}
  if(d.adserdel!==undefined){if(!confirm('حذف هذه السلسلة من التطبيق؟ (الملفات تبقى في GitHub)'))return true;const L=(CONTENT.series||[]).slice();L.splice(+d.adserdel,1);adminSave({series:L},'حُذفت السلسلة.');return true}
  if(d.adserhide!==undefined){const L=(CONTENT.series||[]).map(x=>({...x}));L[+d.adserhide].hide=!L[+d.adserhide].hide;adminSave({series:L},'تم.');return true}
  return false}
