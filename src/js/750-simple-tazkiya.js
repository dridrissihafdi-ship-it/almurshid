/* ---------- simplified التزكية: where am I, today's step, two buttons — everything else on request ---------- */
const TZ_K=['prep','jawarih','aql','qalb'];
function tzStage0(st){return TZ_K.find(k=>!st[k].done)||'qalb'}
function tzUnl(k,st){const i=TZ_K.indexOf(k),ci=TZ_K.indexOf(tzStage0(st));return i<=ci||st[k].done||(st[k].n||0)>0||(S.tzOpen||[]).includes(k)}
/* a later stage can be opened before its turn, after a gentle reminder that the method is gradual */
function tzOpenAsk(k){const st=tzSt(),L=Object.fromEntries(TZ_TABS),cur=tzStage0(st);
  sheetOpen(`<div class="bs-top"><h2>${L[k]}</h2><button class="qa-ed" data-bsx="1">إغلاق</button></div>
   <p class="tzo-p"><span>المنهج متدرّج: كل مرحلة تُبنى على التي قبلها، والأفضل أن تُتمّ</span> «<b>${L[cur]}</b>» <span>أولًا.</span></p>
   <p class="meta tzo-p">ويمكنك فتح هذه المرحلة الآن لتطّلع عليها أو تبدأها مع ما أنت فيه، ويبقى تقدّمك في «${L[cur]}» محفوظًا.</p>
   <div class="tzo-b"><button class="btn ok" data-tzopen="${k}" data-tzopenok="1">افتحها الآن</button><button class="btn" data-bsx="1">أكمل ما أنا فيه</button></div>`);i18nApply(document.getElementById('bsheet'))}
function tzLadder(st){const cur=tzStage0(st),L=Object.fromEntries(TZ_TABS);
  return `<div class="box tzl-w"><p class="tzl-h">طريقك في التزكية</p><div class="tzl">${TZ_K.map((k,i)=>{const u=tzUnl(k,st),d=st[k].done;
    return `<button class="tzl-s${d?' d':''}${k===tzTab?' on':''}${u?'':' l'}" ${u?`data-tztab="${k}"`:`data-tzopen="${k}" aria-label="${esc(Tx(L[k]))} · ${esc(Tx('مقفلة'))}"`} style="height:${46+i*18}%">${k===cur?'<span class="tzl-me" aria-hidden="true"></span>':''}<i>${d?'✓':u?(LANG==='ar'?tsDig(i+1):i+1):'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>'}</i><span>${L[k]}</span></button>`}).join('')}</div></div>`}
function tzSCard(g){const o=S.organs[g.id];
  if(tzEdit&&tzEdit.id===g.id)return `<section class="tz-card">${tzEditBox(g)}</section>`;
  if(confirmFor===g.id||o.ready)return organCard(g,false);
  const ok=o.today==='ok',sl=o.today==='slip',day=Math.min(o.days+(ok?0:1),30);
  return `<article class="box tzc">${ilBan('o_'+g.id,'tzc-img')}<div class="tzc-b"><div class="tzc-r">${tzRing(o.days,o.phase)}<div class="tzc-n"><b>${g.name}</b><small><span>${PHASE[o.phase]}</span> · <span>اليوم</span> ${day} <span>من</span> 30</small></div><button class="tzc-m" data-tzmore="${g.id}" aria-label="${esc(Tx('المزيد'))}">⋯</button></div>
    ${o.pend&&!o.today?`<p class="tz-pend2">${pendTxt(o)}</p>`:''}
    ${ok?'<p class="tzc-ok">حفظتَها اليوم ✓</p>':sl?'<p class="tzc-sl">سُجّلت زلّة. تُب واستأنف غدًا.</p>':`<div class="tzc-btns"><button class="btn ok" data-ok="${g.id}">حفظتُها اليوم ✓</button><button class="btn slip" data-slip="${g.id}">زللتُ</button></div>`}</div></article>`}
function tzMore(id){const g=ORGANS.find(x=>x.id===id);if(!g)return;const o=S.organs[id];
  const row=(attr,ic,t,s)=>`<button class="h2-row tzm-r" ${attr}><span class="tzm-i">${ic}</span><span class="tx">${t}${s?`<small>${s}</small>`:''}</span></button>`;
  sheetOpen(`<div class="bs-top"><h2>${g.name}</h2><button class="qa-ed" data-bsx="1">إغلاق</button></div><p class="meta" style="margin:0 0 8px">كل ما لا تحتاجه كل يوم، في مكان واحد</p>
   <div class="box h2-more tzm">
    <details class="tzm-d"><summary><span class="tzm-i">☰</span><span class="tx">ما تمتنع عنه <small dir="ltr">(${g.tathir.length})</small></span></summary><ul>${g.tathir.map(x=>`<li>${x}</li>`).join('')}</ul></details>
    <details class="tzm-d"><summary><span class="tzm-i">✦</span><span class="tx">أعمال التنوير <small dir="ltr">(${g.tanwir.length})</small></span></summary><ul>${g.tanwir.map(x=>`<li>${x}</li>`).join('')}</ul></details>
    ${row('data-tzdate="-1" data-tzx="1"','📅','سجّل يومًا فاتك','إن نسيت التسجيل')}
    ${row(`data-organ="${id}" data-tzx="1"`,'?','أسباب زلاتك وكل التفاصيل',o.slips&&o.slips.length?`<span dir="ltr">${o.slips.length}</span> <span>زلات مسجّلة</span>`:'')}
    ${row(`data-tzedit="${id}" data-mode="swap" data-tzx="1"`,'⇄','تبديل الجارحة','')}
    ${row(`data-tzedit="${id}" data-mode="drop" data-tzx="1"`,'✕','إلغاؤها من «اليوم»','')}
   </div>`);i18nApply(document.getElementById('bsheet'))}
function tzLearn(k){return lessonGet(k)?`<button class="st-btn" data-story="${k}">${ilSvg(ST_MOTIF[k]||'m_climb')}<span><b>تعلّم هذه المرحلة</b><small>صورة وفكرة في كل صفحة</small></span></button>`:''}
function tzSimple(){const st=tzSt();if(!tzTab||!TZ_K.includes(tzTab)||!tzUnl(tzTab,st))tzTab=tzStage0(st);const k=tzTab,act=activeOrgans();
  let body='';
  if(tzDate&&['jawarih','aql','qalb'].includes(k))body=tzDateBar()+tzStage(k,st);
  else if(k==='prep')body=`<div class="sh tz-sh2"><h2>خطوة اليوم</h2><span><span>اليوم</span> ${Math.min(prepDays()+1,30)} <span>من</span> 30</span></div>${ilBan('tazkiya','tzc-img')}${prepCard()}${st.prep.done?'':`<div class="tz-lock">بعد التمهيدية تنفتح <b>تزكية الجوارح</b>: سبع جوارح، تطهير ثلاثين يومًا ثم تنوير ثلاثين يومًا.${tzUnl('jawarih',st)?'':' <button class="link-btn" data-tzopen="jawarih">افتحها الآن</button>'}</div>`}`;
  else if(k==='jawarih')body=`<div class="sh tz-sh2"><h2>خطوة اليوم ${hintBtn('organ')}</h2><span>${WDAYS[new Date(TODAY+'T12:00:00').getDay()]} ${fmtD(TODAY)}</span></div>
     ${act.length?act.map(tzSCard).join(''):'<p class="muted">اختر جارحة تبدأ بها رحلتك:</p>'}
     ${act.length?`<details class="box pad tz-pathd"><summary>رحلة الجوارح السبع</summary>${tzPath()}</details>`:tzPath()}
     <div class="sh tz-sh2"><h2>محاسبة الليلة</h2></div>${qmCard()}`;
  else if(k==='aql')body=`<div class="sh tz-sh2"><h2>خطوة اليوم</h2></div>${ilBan('aql','tzc-img')}${aqlCard()}${tzLearn('aql')}`;
  else{const cur=ahdSel||ahdCur();body=`<div class="ahd-sel" role="tablist">${AHD.map(a=>{const A=trS(a.id),dn=A.done.length>=a.lv.length;return `<button class="${a.id===cur?'on':''}${dn?' dn':''}" data-ahdsel="${a.id}"><b>${ahN(a)}</b><small dir="ltr">${dn?'✓':A.done.length+' / '+a.lv.length}</small></button>`}).join('')}</div>${ilBan('q_'+cur,'tzc-img')}${trCard(cur)}
     <details class="box pad tz-pathd"><summary>الإخلاص</summary><div class="h2-more tz-more">${tzRow('data-go="ikhlas"',Q2('star'),'ورقة الإخلاص · 90 يومًا','')}${tzRow('data-madh="1"',Q2('heart'),'مُدِحتُ الآن','')}${tzRow('data-go="sirr"',Q2('moon'),'أعمال السر','')}${tzRow('data-go="ikhub"',Q2('star'),'إعدادات الإخلاص','')}</div></details>${tzLearn('qalb')}`}
  return `<section class="tzs">${tzLadder(st)}${tzMsg?`<p class="logged bad" style="margin:12px 0 0">${esc(tzMsg)}</p>`:''}${body}</section>`}
/* night review: a face on an organ being purified counts in its 30 days */
let qmSlip=null;
const QM_REASONS=['مجلس طال فيه الكلام','غضب','تعب وغفلة','صحبة معيّنة','أخرى'];

