/* ---------- one search for the whole app ---------- */
let usQ='';
function viewSearch(){return `<section class="us"><div class="qa-search"><input type="search" id="usQ" value="${esc(usQ)}" placeholder="${esc(Tx('ابحث في الأقسام والأذكار والأسئلة والدروس والعيوب'))}" aria-label="${esc(Tx('بحث'))}" autocomplete="off" enterkeyhint="search"></div>
  <div id="usRes" aria-live="polite">${usResults(usQ)}</div></section>`}
function usIndex(){const R=[],tr=t=>LANG==='ar'?t:Tx(t);
  Object.entries(TITLES).forEach(([id,t])=>{if(t&&VIEWS[id]&&!['admin','series','install','me','khr','ikhl','qalb','amrad'].includes(id)&&(id!=='admin'||isAdmin()))R.push(['sec',tr(t),'',`data-go="${id}"`])});
  try{pathData().forEach(g=>g.steps.forEach(x=>R.push(['path',tr(x.t),tr(g.t),`data-go="${x.go}"`])))}catch(e){}
  UY.forEach(([id,n])=>R.push(['uy',tr(n),tr('اعرف عيوبك وعالجها'),`data-uyf="${id}"`]));
  [['sabah','أذكار الصباح'],['masa','أذكار المساء']].forEach(([k,n])=>adhList(k).forEach(a=>a&&a.t&&R.push(['adh',a.t,tr(n),`data-go="adh_${k}"`,1])));
  DUAS.forEach(([sec,L])=>L.forEach(([t,x])=>R.push(['dua',tr(t)+' · '+x,tr(sec),'data-go="duas"',1])));
  (QA.qa||[]).forEach((x,i)=>{const [q,a]=qaT(i);R.push(['qa',q,'',`data-qaopen="${i}"`,1,a])});
  (auCat||[]).forEach(g=>{const sc=g.k===AQ_K?'aqida':g.k===SIRA_K?'sira':g.k===QIY_K?'qiyama':'audio';(g.items||[]).forEach(it=>R.push(['au',it.t,g.n||'',`data-auplay="${esc(it.p)}" data-ausc="${sc}"`,1]))});
  Object.keys(YS).forEach(k=>{const rid=ysRid(k);ysEps(rid).forEach((x,j)=>R.push(['au',x[1],Tx(YS[k].t),`data-ysgo="${YS[k].scr}" data-ysep="${j}" data-ysrid="${rid}"`,1]))});
  return R}
const US_G=[['sec','الأقسام'],['path','مراحل الطريق'],['uy','العيوب'],['adh','الأذكار'],['dua','سنن الرسول ﷺ'],['qa','سؤال وجواب'],['au','الدروس والسلاسل']];
function usResults(v){const words=qaNorm(v.trim()).split(/\s+/).filter(Boolean);if(!words.length)return `<p class="meta us-tip">${Tx('اكتب كلمة: الغضب، الصبح، التوبة، الكبر…')}</p>`;
  if(!auCat&&typeof auLoad==='function'){try{auLoad().then(()=>{if(screen==='search'){const r=document.getElementById('usRes');if(r)r.innerHTML=usResults((document.getElementById('usQ')||{}).value||'');i18nApply(r)}})}catch(e){}}
  const hits={};let n=0;
  usIndex().forEach(r=>{const hay=qaNorm(r[1]+' '+(r[5]||'')+' '+r[2]);if(!words.every(w=>hay.includes(w)))return;(hits[r[0]]=hits[r[0]]||[]).push(r);n++});
  if(!n)return `<p class="meta">لا توجد نتيجة.</p>`;
  const cut=s=>{s=String(s).replace(/<[^>]+>/g,'');return s.length>110?s.slice(0,110)+'…':s};
  return US_G.filter(([k])=>hits[k]).map(([k,t])=>{const L=hits[k];return `<div class="sh us-h"><h2>${t}</h2><span dir="ltr">${L.length}</span></div><div class="box h2-more">${L.slice(0,8).map(r=>`<button class="h2-row us-r" ${r[3]}><span class="tx"><span${r[4]?' class="notr" dir="auto"':''}>${esc(cut(r[1]))}</span>${r[2]?`<small${r[4]&&k!=='dua'?'':''}>${esc(cut(r[2]))}</small>`:''}</span><svg class="h2-chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg></button>`).join('')}${L.length>8?`<p class="meta us-more"><span>و</span><span dir="ltr">${L.length-8}</span> <span>نتائج أخرى، زد كلمة لتضييق البحث</span></p>`:''}</div>`}).join('')}
let usT=0;
document.addEventListener('input',e=>{if(e.target.id!=='usQ')return;usQ=e.target.value;clearTimeout(usT);usT=setTimeout(()=>{const r=document.getElementById('usRes');if(r){r.innerHTML=usResults(usQ);i18nApply(r);if(usQ.trim())qaMark(r,qaNorm(usQ.trim()).split(/\s+/).filter(Boolean))}},200)});
document.addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;const d=t.dataset;
  if(d.hint){hintOpen(d.hint);return}
  if(d.khnever){S.khAsk=false;save();sheetClose();miniToast(Tx('لن يُسأل بعد الصلاة. تعيده من صفحة الخشوع.'));return}
  if(d.ysgo&&screen==='search'){e.stopImmediatePropagation();const P=recP(d.ysrid);P.i=+d.ysep;P.t=0;save();recOpen=d.ysrid;go(d.ysgo);return}
  if(d.auplay&&screen==='search'){const p=d.auplay;e.stopImmediatePropagation();go(d.ausc||'audio');setTimeout(()=>{try{auPlay(p)}catch(x){}},150);return}},true);
(function(){try{let ch=0;['quick','homeT'].forEach(k=>{if(Array.isArray(S[k])&&S[k].some(x=>x==='taammulat'||x==='h_quran')){S[k]=S[k].map(x=>x==='taammulat'?(S[k].includes('h_ruh')?null:'h_ruh'):x==='h_quran'?(S[k].includes('quran')?null:'quran'):x);if(k==='quick')S[k]=S[k].filter(Boolean);ch=1}});if(ch)save()}catch(e){}})();
function viewHome(){
  const L=dayLog(),[dn,tot]=amProgress(L),C=2*Math.PI*18,lc=litCount();
  const fri=new Date().getDay()===5?`<button class="box pad wk-ban" data-wkopen="1"><b>تقريرك الأسبوعي جاهز</b><span class="meta">صلواتك وأورادك وجوارحك في أسبوع</span></button>`:'';
  const moved=NEW_HOST&&/github\.io$/.test(location.hostname)?`<div class="box pad mv-ban"><b>انتقل «المرشد» إلى عنوانه الجديد</b><span class="notr" dir="ltr">${NEW_HOST}</span><p class="meta">${AUTH.state==='local'?'بياناتك محفوظة في هذا المتصفح فقط: احفظ نسخة احتياطية أولًا، ثم استرجعها في العنوان الجديد من «ملفك».':'سجّل الدخول بحسابك نفسه في العنوان الجديد، وستجد بياناتك كما هي. ثم أضف التطبيق إلى شاشتك من جديد.'}</p><div class="btns">${AUTH.state==='local'?'<button class="btn" data-bkexp="1">حفظ نسخة احتياطية</button>':''}<a class="btn ok" href="https://${NEW_HOST}/">افتح العنوان الجديد</a></div></div>`:'';
  const banner=moved+fri+announcementBanner()+(AUTH.state==='local'?`<p class="muted" style="margin-bottom:12px">وضع محلي: تُحفظ بياناتك في هذا المتصفح فقط.</p>`:'')+(S.demo?`<p class="muted" style="margin-bottom:12px">تعرض الأقسام بيانات تجريبية. يمكنك البدء من الصفر من الملف الشخصي.</p>`:'');
  const tiles=`<div class="h2-tiles"><button class="h2-tile" data-go="aamal"><svg viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="18" fill="none" stroke="rgba(243,237,230,.18)" stroke-width="4"/><circle cx="22" cy="22" r="18" fill="none" stroke="#E6C891" stroke-width="4" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C*(1-(tot?dn/tot:0))}" transform="rotate(-90 22 22)"/></svg><span><small>يومك</small><b dir="ltr">${dn} / ${tot}</b></span></button>
   <button class="h2-tile" data-go="me"><svg viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="18" fill="rgba(230,200,145,.12)"/><path d="M22 34V22M22 24c-5 0-8-3-8-7 4 0 8 2 8 7zM22 21c4 0 7-3 7-7-4 0-7 2-7 7z" fill="none" stroke="#E6C891" stroke-width="1.8" stroke-linecap="round"/></svg><span><small>شجرتك</small><b dir="ltr">${treeDays()} / 30</b></span></button></div>`;
  const more=[...['roadmap','tools','majalis','ruhi','method','about'].map(id=>MENU.find(m=>m&&m.id===id)).filter(Boolean),...(isAdmin()?MENU.filter(m=>m.id==='admin'):[])];
  const subs={tools:'القبلة، سنن الرسول ﷺ، حفظ القرآن، وضع رمضان',ask:askUnseen()?'وصلك جواب جديد ✦':'سؤالك يصل إلى الشيخ، والجواب هنا',majalis:majUpcoming().length?'<span>المجلس القادم:</span> <span class="notr">'+majFmt(majUpcoming()[0].at)+'</span>':'مواعيد مجالس الذكر والدروس',roadmap:'الشروط الأربعة، الجسر، والأهداف الأربعة',audio:'دروس ومحاضرات صوتية',method:'الطريقة المحمدية: الأصول والأبواب وطريق التحقق',ruhi:`${lc} <span>من 4 أنوار مضيئة</span>`,admin:'المستعملون، الرسائل، الأعمال المقترحة',about:'التعريف بالتطبيق والإعدادات'};
  const list=`<div class="sh" style="margin:22px 2px 10px"><h2>المزيد</h2></div><div class="box h2-more">${more.map(m=>`<button class="h2-row" data-go="${m.id}"><span class="h2-ri"><svg viewBox="0 0 48 48" aria-hidden="true">${m.ic||m.art}</svg></span><span class="tx">${m.t}<small>${subs[m.id]||''}</small></span><svg class="h2-chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg></button>`).join('')}</div>`;
  const langs=`<div class="langs h2-langs" role="group" aria-label="اللغة">${LANGS.map(([c,l,n])=>`<button class="lang notr${c===LANG?' on':''}" data-lang="${c}" aria-pressed="${c===LANG}" title="${n}" lang="${c}">${l}</button>`).join('')}</div>`;
  if(SIMPLE()){const eve=dH()>=ptDay().maghrib&&!qmDone();
    return heroHome()+`<main class="sheet sm-home">${inboxCard()}${banner}${homeNow()}${fsCard()}${eve?qmCard(1):''}${ramCard()}${majCard()}${homeTiles()}</main>`}
  return heroHome()+`<main class="sheet">${inboxCard()}${banner}${homeNow()}${fsCard()}${careCard()}${ramCard()}${majCard()}${qaGrid()}${homeProg()}<button class="me-ui" data-uimode="simple"><span>الواجهة المبسّطة</span><small>صور، وأقسام أقل، وكل شيء أقرب</small></button></main>`;
}

function ring(days,phase){
  const r=27,c=2*Math.PI*r,p=phase==='done'?1:Math.min(days,30)/30;
  const col=phase==='tanwir'||phase==='done'?'var(--green)':phase==='tathir'?'var(--amber)':'var(--card-line)';
  return `<div class="ring"><svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="${r}" fill="none" stroke="var(--chip)" stroke-width="6"/><circle class="fg" cx="32" cy="32" r="${r}" fill="none" stroke="${col}" stroke-width="6" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c*(1-p)}"/></svg><b>${phase==='done'?'✓':days+'<small>من 30</small>'}</b></div>`;
}
function pendTxt(o){const n=o.pend;return `<b>${n===1?'<span>يوم واحد لم يُسجَّل</span>':n===2?'<span>يومان لم يُسجَّلا</span>':n+' <span>أيام لم تُسجَّل</span>'}</b> <span>منذ</span> ${fmtD(o.pendFrom)}. <span>إن سجّلت «حفظتُها» حُسبت كلها محفوظة، وإن سجّلت «زلّة» أُعيد العدّ من الأول.</span>`}
function tzEditBox(g){const o=S.organs[g.id],passed=orgPassed(o),mode=tzEdit.mode;
  const fate=passed?`<span>${g.name}</span>: <span>تبقى قد أتمّت التطهير، وتخرج من «اليوم». يمكنك إعادتها متى شئت من «رحلة الجوارح» لتبدأ تنويرها.</span>${o.phase==='tanwir'&&o.days?' <span>وتُلغى أيام التنوير التي سجّلتها.</span>':''}`
    :`<span>${g.name}</span>: <span>تعود إلى «لم تبدأ»</span>${o.days?`<span>، ويُلغى عدّ تطهيرها</span> (<span dir="ltr">${o.days}</span> <span>${o.days>10||o.days<3?'يومًا':'أيام'}</span>)`:''}.`;
  if(mode==='drop')return `<div class="tz-ed"><b><span>إلغاء</span> ${g.name} <span>من «اليوم»</span></b><p>${fate}</p><div class="btns"><button class="btn slip" data-tzdrop="${g.id}">نعم، ألغِها</button><button class="btn" data-tzeditno="1">تراجع</button></div></div>`;
  const cand=ORGANS.filter(x=>{const q=S.organs[x.id];return x.id!==g.id&&q.phase!=='done'&&(q.phase==='idle'||q.parked)});
  return `<div class="tz-ed"><b><span>تبديل</span> ${g.name} <span>بجارحة أخرى</span></b><p>${fate}</p>
   ${cand.length?`<p class="tz-ed-h">اختر الجارحة التي تحلّ محلّها:</p><div class="tz-ed-l">${cand.map(x=>{const q=S.organs[x.id];return `<button class="tz-ed-o" data-tzswap="${g.id}" data-to="${x.id}"><b>${x.name}</b><small>${q.parked?'أتمّت التطهير · تبدأ تنويرها':'تبدأ تطهيرها اليوم'}</small></button>`}).join('')}</div>`:'<p class="meta">لا توجد جارحة أخرى متاحة للتبديل.</p>'}
   <div class="btns"><button class="btn" data-tzeditno="1">تراجع</button></div></div>`}
function tanwirAsk(g){return `<div class="tw-ask"><b><span>أتممت تطهير</span> ${g.name}<span>: ثلاثون يومًا ✓</span></b><p>مرحلة التنوير ثلاثون يومًا أخرى من أعمال البرّ بهذه الجارحة. ابدأها حين تكون مستعدًّا لها، ولا يُحسب شيء قبل أن تبدأها.</p><div class="btns"><button class="btn ok" data-tanwirgo="${g.id}" data-when="today">ابدأ التنوير اليوم</button><button class="btn" data-tanwirgo="${g.id}" data-when="tomorrow">ابدأ غدًا</button></div></div>`}
function organCard(g,full){
  const o=S.organs[g.id];let body='';
  if(o.phase==='idle')body=`<div class="btns"><button class="btn primary" data-start="${g.id}">ابدأ التطهير</button></div>`;
  else if(o.parked)body=`<div class="tw-ask"><b>أتمّت التطهير ✓ · خارج «اليوم»</b><p>أخرجتها من «اليوم» بعد أن أتممت تطهيرها. أعدها حين تريد أن تبدأ تنويرها.</p><div class="btns"><button class="btn ok" data-unpark="${g.id}">أعدها إلى «اليوم»</button></div></div>`;
  else if(o.ready)body=tanwirAsk(g);
  else if(o.phase==='done')body=`<div class="meta">أتممت التطهير والتنوير${(o.cycle||1)>1?' في الدورة '+o.cycle:''}. ثبّتك الله.</div>`;
  else if(o.today==='ok')body=`<div class="logged">سُجّل اليوم: حفظتها ✓</div>`;
  else if(o.today==='slip')body=`<div class="logged bad">سُجّلت زلة، وبدأ العدّ من جديد. تُب واستأنف غدًا.</div>`;
  else if(confirmFor===g.id)body=`<div class="confirm"><span>ستعود أيام ${PHASE[o.phase]} ${g.name} إلى الصفر.${o.pend?' <span>وتُعتبر الأيام التي لم تسجّلها منذ</span> '+fmtD(o.pendFrom)+' <span>فائتة.</span>':''}</span>
    <label for="slipnote-${g.id}" class="slip-label">سبب الزلة: ما الذي أوقعك؟ وفي أي حال كنت؟</label>
    <textarea id="slipnote-${g.id}" class="slip-note" placeholder="مثال: مجلس طال فيه الكلام، أو تعب وغفلة، أو صحبة معيّنة…"></textarea>
    <div class="btns"><button class="btn slip" data-slipyes="${g.id}">نعم، أعد العدّ</button><button class="btn" data-slipno="1">تراجع</button></div></div>`;
  else body=`<div class="btns"><button class="btn ok" data-ok="${g.id}">حفظتُها اليوم</button><button class="btn slip" data-slip="${g.id}">وقعت زلة</button></div>`;
  const list=o.phase==='tanwir'?g.tanwir:g.tathir;
  const tips=o.phase!=='done'?`<details${full&&o.phase==='tanwir'?' open':''}><summary>${o.phase==='tanwir'?'أعمال التنوير':'ما تمتنع عنه'} (${list.length})</summary><ul>${list.map(x=>`<li>${x}</li>`).join('')}</ul></details>`:'';
  const broke=(o.broken?`<div class="meta" style="color:var(--red)">انقطعت السلسلة بيوم فائت، فبدأ العدّ من جديد.</div>`:'')+(o.pend&&!o.today?`<div class="tz-pendn">${pendTxt(o)}</div>`:'');
  const left=o.phase==='tathir'||o.phase==='tanwir'?`باقٍ ${30-o.days} يومًا`:'';
  const att=(o.phase==='tathir'||o.phase==='tanwir')&&o.attemptStart?`<div class="attempt">${(o.cycle||1)>1?'الدورة '+o.cycle+' · ':''}المحاولة ${o.attempt} · بدأت ${o.attemptStart>TODAY?'غدًا':''} ${fmtD(o.attemptStart)}</div>${true?`<label class="st-date"><span>تاريخ بدء المحاولة</span><input type="date" data-orgstart="${g.id}" value="${o.attemptStart>TODAY?TODAY:o.attemptStart}" max="${TODAY}"></label><p class="meta st-note">إذا بدأت قبل تسجيلها في التطبيق، اختر يوم البدء. الأيام التي لم تسجّلها تُحسب محفوظة إذا سجّلت بعدها «حفظتُها»، وتُعاد من الأول إذا سجّلت «زلّة».</p>`:''}`:'';
  const slips=full&&o.slips.length?`<details class="slips"><summary>مراجعة أسباب الزلات (${o.slips.length})</summary><ol>${o.slips.slice().reverse().map(s=>`<li><div class="sl-h"><b>${fmtD(s.date)}</b><span class="pill p-${s.phase}">${PHASE[s.phase]}</span><span class="meta">بعد ${s.day} ${s.day>10?'يومًا':'أيام'}</span></div><p>${s.reason?'<span class="notr" dir="auto">'+esc(s.reason)+'</span>':'<span class="meta">لم يُدوَّن سبب</span>'}</p></li>`).join('')}</ol></details>`:'';
  let redo='';
  if(full&&o.phase!=='idle'){
    const canT=o.phase==='tanwir'||o.phase==='done';
    if(redoFor&&redoFor.id===g.id){
      const k=redoFor.kind,lbl=k==='tathir'?'التطهير':'التنوير';
      redo=`<div class="confirm redo-c"><span>ستبدأ ${lbl} ${g.name} من جديد: ثلاثون يومًا متتالية تبدأ اليوم${k==='tathir'?'، ويعود مجراها في القلب مفتوحًا حتى تُتمّ التطهير':o.phase==='done'?'، ويعود قسمها في القلب رماديًا حتى تُتمّ التنوير':''}.</span>
        <label for="redonote-${g.id}" class="slip-label">سبب الإعادة (اختياري)</label>
        <textarea id="redonote-${g.id}" class="slip-note" placeholder="مثال: أحسست بفتور في هذه الجارحة، أو أريد تثبيت ما حققته…"></textarea>
        <div class="btns"><button class="btn ok" data-redoyes="${g.id}">نعم، أعد ${lbl}</button><button class="btn" data-redono="1">تراجع</button></div></div>`;
    }else{
      redo=`<div class="redo"><span class="meta">${o.phase==='done'?'تجديد السلوك:':'إعادة المرحلة:'}</span><button class="btn small" data-redo="${g.id}" data-kind="tathir">إعادة التطهير</button>${canT?`<button class="btn small" data-redo="${g.id}" data-kind="tanwir">إعادة التنوير</button>`:''}</div>`;
    }
  }
  const hist=full&&o.history&&o.history.length?`<details class="slips redo-h"><summary>سجل الإعادات (${o.history.length})</summary><ol>${o.history.slice().reverse().map(h=>`<li><div class="sl-h"><b>${fmtD(h.date)}</b><span class="pill p-${h.kind}">إعادة ${PHASE[h.kind]}</span><span class="meta">من حال: ${PHASE[h.from]}${h.from!=='done'?' · '+h.day+' يوم':''}</span></div>${h.reason?`<p class="notr" dir="auto">${esc(h.reason)}</p>`:''}</li>`).join('')}</ol></details>`:'';
  return `<div class="box organ"><div class="orow">${ring(o.days,o.phase)}<div class="info"><h3>${g.name}</h3><span class="pill p-${o.phase}">${PHASE[o.phase]}</span> <span class="meta">${left}${o.resets?' · إعادات: '+o.resets:''}</span>${att}</div></div>${broke}${body}${tips}${redo}${slips}${hist}</div>`;
}

