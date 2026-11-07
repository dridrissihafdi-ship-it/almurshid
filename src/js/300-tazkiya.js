/* ---------- purification: today · the organs' journey · self-review ---------- */
let tzTab=null,orgSel=null,tzMsg='',tzDate=null,tzConf=null,tzEdit=null;
function tzDateBar(){const D=tzDate||TODAY,min=addDays(TODAY,-365);
  return `<div class="ad-bar"><button class="iconbtn sm" data-tzdate="-1" aria-label="اليوم السابق"${D<=min?' disabled':''}><svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button>
   <label class="ad-in"><input type="date" id="tzDateIn" value="${D}" max="${TODAY}" min="${min}"><span><b>${tzDate?fmtD(D):'<span>اليوم</span> · '+fmtD(D)}</b><small>${tzDate?WDAYS[new Date(D+'T12:00:00').getDay()]:'اضغط لاختيار يوم آخر'}</small></span></label>
   <button class="iconbtn sm" data-tzdate="1" aria-label="اليوم التالي"${tzDate?'':' disabled'}><svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg></button></div>
   ${tzDate?`<div class="ad-note"><span>تراجع يومًا مضى. ما تصحّحه هنا يُعاد به حساب العدّ من ذلك اليوم.</span><button class="btn small ok" data-tzdate="0">العودة إلى اليوم</button></div>`:''}`}
/* the organs and the preparatory phase on a past day */
function tzPast(){const D=tzDate,P=prepState();
  const orgs=ORGANS.filter(g=>{const o=S.organs[g.id];if(o.phase==='idle')return false;if(!o.base&&(o.phase==='tathir'||o.phase==='tanwir'))orgMigrate(o);return o.base&&o.base.d<=D});
  const rows=orgs.map(g=>{const o=S.organs[g.id],h=(o.hist||{})[D];
    if(tzConf===g.id)return `<div class="confirm" style="margin:8px 0"><span><span>سبب الزلة في</span> <b>${g.name}</b>:</span><textarea id="tzn-${g.id}" rows="2">${h&&h.v==='slip'?esc(h.r||''):''}</textarea><div class="btns"><button class="btn slip" data-tzslipyes="${g.id}">سجّل الزلة</button><button class="btn" data-tzslipno="1">تراجع</button></div></div>`;
    const st=h?(h.v==='ok'?'<span class="tz-done">حفظتُها ✓</span>':h.v==='miss'?'<span class="tz-bad">فائت</span>':'<span class="tz-bad">زلّة</span>'):'<span class="tz-bad" style="color:var(--muted)">لم يُسجَّل</span>';
    return `<div class="tz-row"><span class="tz-name"><b>${g.name}</b><small>${st}</small></span><div class="tz-act"><button class="btn ok small" data-tzok="${g.id}"${h&&h.v==='ok'?' disabled':''}>حفظتُها</button><button class="btn slip small" data-tzslip="${g.id}">زلّة</button>${h?`<button class="btn small" data-tzclr="${g.id}" aria-label="مسح">✕</button>`:''}</div></div>`}).join('');
  const prep=P.status!=='idle'&&(!P.start||P.start<=D)?prepCard():'';
  return `${rows?`<div class="box tz-list">${rows}</div>`:'<p class="muted" style="margin:10px 2px">لا توجد جارحة في التزكية في ذلك اليوم.</p>'}${prep}
   <p class="meta" style="margin-top:10px">إذا صحّحت يومًا مضى، يُعاد حساب الأيام المتتالية من ذلك اليوم إلى اليوم.</p>`}
const MAX_ACTIVE=2;
const ORG_VERSE={lisan:'«مَن صَمَتَ نَجَا»',ayn:'﴿قُل لِّلْمُؤْمِنِينَ يَغُضُّوا مِنْ أَبْصَارِهِمْ﴾',udhun:'﴿إِنَّ السَّمْعَ وَالْبَصَرَ وَالْفُؤَادَ كُلُّ أُولَٰئِكَ كَانَ عَنْهُ مَسْئُولًا﴾',yad:'«المسلمُ مَن سَلِمَ المسلمون من لسانه ويده»',qadam:'﴿وَلَا تَمْشِ فِي الْأَرْضِ مَرَحًا﴾',batn:'﴿كُلُوا مِنَ الطَّيِّبَاتِ وَاعْمَلُوا صَالِحًا﴾',farj:'﴿وَالَّذِينَ هُمْ لِفُرُوجِهِمْ حَافِظُونَ﴾'};
const TZ_TABS=[['prep','التمهيدية'],['jawarih','الجوارح'],['aql','العقل'],['qalb','القلب والروح']];
function tzSt(){const P=pathData().flatMap(g=>g.steps),f=id=>P.find(x=>x.id===id)||{};const pr=prepState();
  return {prep:{done:pr.status==='done',n:Math.min(prepDays(),30),goal:30},jawarih:f('jawarih'),aql:f('aql'),qalb:f('nafs')}}
function tzTabs(st){return `<div class="rtabs tz-stg" role="tablist">${TZ_TABS.map(([k,l],i)=>`<button role="tab" aria-selected="${k===tzTab}" class="${k===tzTab?'on':''}${st[k].done?' dn':''}" data-tztab="${k}"><i>${st[k].done?'✓':i}</i><span>${l}</span></button>`).join('')}</div>`}
const TZ_INFO={prep:['المرحلة التمهيدية','قبل تزكية الجوارح، يتدرّب السالك ثلاثين يومًا على ثلاث وصايا نبوية، فيتعوّد المداومة والصدق مع النفس.'],
 jawarih:['المرحلة الأولى: تزكية الجوارح','لكل جارحة مرحلتان: تطهير ثلاثين يومًا متتالية بلا زلة، ثم تنوير ثلاثين يومًا باستعمالها في الطاعة على السنة. والمحاسبة كل ليلة تحفظ هذا العمل.'],
 aql:['المرحلة الثانية: تزكية العقل','يتدرّب السالك على تطهير عقله من الأفكار الخاطئة ووساوس الشيطان، ثم على شغله دائمًا بذكر الله، في عشرة مستويات، ثلاثين يومًا متتالية لكل مستوى.'],
 qalb:['المرحلة الثالثة: تزكية القلب والروح','يتخلّص السالك من المعاصي الخفية في القلب، كالحقد والكبر وحب الدنيا، ويستبدل بها صفات حميدة، بالتدرّب على العهود السماوية: الإخلاص، والتواضع، والشكر، والتوبة. لكل عهد درجات، ولكل درجة ثلاثون يومًا متتالية.']};
const tzRow=(a,ic,t,sm)=>`<button class="h2-row" ${a}><span class="h2-ri"><svg viewBox="0 0 48 48" aria-hidden="true">${ic}</svg></span><span class="tx">${t}${sm?`<small>${sm}</small>`:''}</span><svg class="h2-chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg></button>`;
const TZI={book:'<path d="M8 10c5-2 10-2 16 1v28c-6-3-11-3-16-1zM40 10c-5-2-10-2-16 1v28c6-3 11-3 16-1z"/>',qa:'<path d="M8 10h32v20H22l-8 7v-7H8z"/><path d="M20 17a4 4 0 1 1 5 4v2"/>',
 heart:'<path d="M24 38s-12-7.5-12-16a6.5 6.5 0 0 1 12-3.5A6.5 6.5 0 0 1 36 22c0 8.5-12 16-12 16z"/>',mh:'<path d="M14 8h20v32H14z"/><path d="M19 16h10M19 22h10M19 28h6"/>',
 star:'<path d="M24 8l4.5 10 10.5 1-8 7 2.5 11L24 31l-9.5 6 2.5-11-8-7 10.5-1z"/>',moon:'<path d="M30 8a16 16 0 1 0 10 26A13 13 0 0 1 30 8z"/>',chart:'<path d="M10 38V10M10 38h28M16 30l7-8 6 5 9-11"/>',map:'<path d="M8 12l10-4 12 4 10-4v28l-10 4-12-4-10 4z"/><path d="M18 8v28M30 12v28"/>'};
function tzHead(k,st){const [t,x]=TZ_INFO[k],v=st[k],n=Math.min(v.n||0,v.goal||1),pct=v.done?100:n/(v.goal||1)*100;
  return `<div class="box pad tz-sh"><b>${t}</b><p>${x}</p><i class="tz-bar"><b style="width:${pct}%"></b></i><small>${v.done?'<span>أتممت هذه المرحلة ✓</span>':v.hint?esc(v.hint):''}</small></div>`}
function tzStage(k,st){const mh=mhOn(nowStr()),pr=prepState();
  if(k==='prep')return prepCard();
  if(k==='jawarih')return tzHead(k,st)+(pr.status==='idle'?`<div class="box pad tz-note"><span>يُستحسن أن تبدأ بالمرحلة التمهيدية قبل تزكية الجوارح.</span><button class="btn small ok" data-tztab="prep">المرحلة التمهيدية</button></div>`:'')
    +(tzDate?tzPast():tzToday())+`<div class="box h2-more tz-more">${tzRow('data-go="muhasaba"',TZI.mh,'محاسبة الليلة',mh?'سجّلت محاسبة اليوم ✓':'ماذا حفظت اليوم؟ وأين زللت؟')}</div>`
    +`<div class="sh" id="tzMap" style="margin:22px 2px 8px"><h2>رحلة الجوارح</h2></div>`+tzPath();
  if(k==='aql'){const X=lessonGet('aql');return tzHead(k,st)+ilBan('aql','tz-ban')+aqlCard()+`<div class="sh" style="margin:22px 2px 8px"><h2>شرح المستويات العشرة</h2></div>${LANG!=='ar'&&!lsL('aql')?'<p class="ls-ar">هذا الشرح متوفر بالعربية فقط.</p>':''}${ttsBtn('استمع إلى الشرح كاملًا','#lsAql')}<div class="box pad ls-lead tts-s notr" id="lsAql" ${lsDir('aql')}>${X.lead}</div>${lsAcc(X,-1)}<p class="meta">ملخّص منقّح لمادة الدرس. يُستحسن مراجعته مع الشيخ.</p>`}
  const X=lessonGet('qalb'),cur=ahdSel||ahdCur();return tzHead(k,st)+`<div class="ahd-sel" role="tablist">${AHD.map(a=>{const A=trS(a.id),dn=A.done.length>=a.lv.length;return `<button class="${a.id===cur?'on':''}${dn?' dn':''}" data-ahdsel="${a.id}"><b>${ahN(a)}</b><small dir="ltr">${dn?'✓':A.done.length+' / '+a.lv.length}</small></button>`}).join('')}</div>`+ilBan('q_'+cur,'tz-ban')+(tzDate?trPast(cur):trCard(cur))+`<div class="sh qa-sh"><h2>الإخلاص</h2></div><div class="box h2-more tz-more">${tzRow('data-go="ikhlas"',Q2('star'),'ورقة الإخلاص · 90 يومًا','')}${tzRow('data-madh="1"',Q2('heart'),'مُدِحتُ الآن','')}${tzRow('data-go="sirr"',Q2('moon'),'أعمال السر','')}${tzRow('data-go="ikhl"',Q2('book'),'درس الإخلاص','')}${tzRow('data-go="ikhub"',Q2('star'),'إعدادات الإخلاص','<span>وضع الإخلاص، تذكير النية</span>')}</div>`+`<div class="sh" style="margin:22px 2px 8px"><h2>شرح المرحلة والعهود السماوية</h2></div>${LANG!=='ar'&&!lsL('qalbIntro')?'<p class="ls-ar">هذا الشرح متوفر بالعربية فقط.</p>':''}${ttsBtn('استمع إلى الشرح كاملًا','#lsQalb')}<div class="box pad ls-lead tts-s notr" id="lsQalb" ${lsDir('qalbIntro')}>${X.lead}</div>${lsAcc(X,-1)}<p class="meta">ملخّص منقّح لمادة الدرس. يُستحسن مراجعته مع الشيخ.</p>`}
function viewTazkiya(){if(SIMPLE())return tzSimple();
  if(!tzTab||tzTab==='today'||tzTab==='path'){const go2=tzTab==='path';tzTab=prepState().status==='done'||activeOrgans().length?'jawarih':'prep';if(go2){tzTab='jawarih';setTimeout(()=>{const m=document.getElementById('tzMap');if(m)m.scrollIntoView()},60)}}
  const st=tzSt();
  const body=tzTab==='mh'?`<div id="mhSec">${viewMuhasaba()}</div>`:tzStage(tzTab,st);
  const top=`<button class="tz-method2" data-go="method"><span><b>المنهج المحمدي</b><small>تعريف الطريقة وأصولها</small></span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg></button>`;
  return `<section>${tzTabs(st)}${tzTab==='mh'?'<button class="btn small" data-tztab="jawarih" style="margin:0 0 10px">→ تزكية الجوارح</button>':''}${tzDate&&['jawarih','aql','qalb'].includes(tzTab)?tzDateBar():''}${tzMsg?`<p class="logged bad" style="margin:0 0 12px">${esc(tzMsg)}</p>`:''}${body}</section>`;
}
let tzPrepOpen=false;
function tzRing(n,ph){const C=2*Math.PI*21;return `<svg viewBox="0 0 52 52" class="am-ring2" aria-hidden="true"><circle cx="26" cy="26" r="21" fill="none" stroke="rgba(243,237,230,.16)" stroke-width="5"/><circle cx="26" cy="26" r="21" fill="none" stroke="${ph==='tanwir'?'var(--green)':'var(--gold)'}" stroke-width="5" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C*(1-Math.min(n,30)/30)}" transform="rotate(-90 26 26)"/><text x="26" y="31" text-anchor="middle">${n}</text></svg>`}
function tzToday(){
  const act=activeOrgans(),P=prepState(),prepOn=P.status==='active',prepDone=prepOn&&prepDayDone(P.log[TODAY]);
  const total=act.length+(prepOn?1:0),done=act.filter(g=>S.organs[g.id].today).length+(prepDone?1:0);
  const day=total?`<div class="tz-day2"><b><span>سجلّ اليوم</span> · ${WDAYS[new Date(TODAY+'T12:00:00').getDay()]} ${fmtD(TODAY)}</b><span class="tz-dots2" aria-label="${done} / ${total}">${Array.from({length:total},(_,k)=>`<i class="${k<done?'f':''}"></i>`).join('')}</span></div>`:'';
  const cards=act.map(g=>{const o=S.organs[g.id];
    if(confirmFor===g.id)return organCard(g,false);
    const head=`<button class="tz-oh" data-organ="${g.id}">${tzRing(o.days,o.phase)}<span class="tz-on"><b>${g.name}</b><small><span>${PHASE[o.phase]}</span> · <span>اليوم</span> ${Math.min(o.days+(o.today==='ok'?0:1),30)} <span>من</span> 30</small></span>${o.today==='ok'?'<span class="tz-tag ok">حفظتُها ✓</span>':o.today==='slip'?'<span class="tz-tag bad">سُجّلت زلّة</span>':''}</button>`;
    const pend=o.pend&&!o.today?`<p class="tz-pend2">${pendTxt(o)}</p>`:'';
    if(tzEdit&&tzEdit.id===g.id)return `<section class="tz-card">${tzEditBox(g)}</section>`;
    const acts=`<div class="tz-acts"><button class="tz-a" data-tzedit="${g.id}" data-mode="swap"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h13l-3-3M20 16H7l3 3"/></svg><span>تبديل</span></button><button class="tz-a" data-tzedit="${g.id}" data-mode="drop"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg><span>إلغاء</span></button></div>`;
    if(o.ready)return `<section class="tz-card ready"><button class="tz-oh" data-organ="${g.id}">${tzRing(30,'tathir')}<span class="tz-on"><b>${g.name}</b><small>أتممت التطهير ✓</small></span></button>${tanwirAsk(g)}${acts}</section>`;
    const btns=o.today?'':`<div class="tz-btn2"><button class="btn ok" data-ok="${g.id}">حفظتُها</button><button class="btn tz-slipb" data-slip="${g.id}">زلّة</button></div>`;
    return `<section class="tz-card${o.today?' logged':''}">${head}${pend}${btns}${acts}</section>`}).join('');
  const empty=!act.length?`<div class="box pad tz-empty"><b>لم تبدأ تزكية أي جارحة بعد</b><p class="muted" style="margin:4px 0 10px">اختر جارحة أو جارحتين من «رحلة الجوارح» وابدأ تطهيرها.</p><button class="btn primary" data-tzmap="1">اختر من رحلة الجوارح</button></div>`:'';
  const mh=mhOn(nowStr()),n=Math.min(prepDays(),30);
  const prepFull=P.status!=='done'&&((prepOn&&!prepDone)||tzPrepOpen);
  const prepRow=P.status!=='done'&&!prepFull?`<button class="h2-row" data-tzprep="1"><span class="h2-ri tz-n">${n}</span><span class="tx"><span>المرحلة التمهيدية</span><small>${P.status==='idle'?'لم تبدأ · ثلاثون يومًا على ثلاث وصايا نبوية':prepDone?'<span>سُجّل اليوم ✓</span> · '+n+' <span>من</span> 30':''}</small><i class="tz-bar"><b style="width:${n/30*100}%"></b></i></span><svg class="h2-chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg></button>`:'';
  const list=`<div class="box h2-more tz-more">${prepRow}<button class="h2-row" data-go="muhasaba"><span class="h2-ri"><svg viewBox="0 0 48 48" aria-hidden="true"><path d="M14 8h20v32H14z"/><path d="M19 16h10M19 22h10M19 28h6"/></svg></span><span class="tx">محاسبة الليلة<small>${mh?'سجّلت محاسبة اليوم ✓':'ماذا حفظت اليوم؟ وأين زللت؟'}</small></span><svg class="h2-chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg></button><button class="h2-row" data-go="ruhi"><span class="h2-ri"><svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 38s-12-7.5-12-16a6.5 6.5 0 0 1 12-3.5A6.5 6.5 0 0 1 36 22c0 8.5-12 16-12 16z"/></svg></span><span class="tx">حالتك الروحية اليومية<small><span>${litCount()} من 4 أنوار مضيئة</span></small></span><svg class="h2-chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg></button></div>`;
  return `${day}${cards}${empty}`;
}
function tzPath(){
  const act=activeOrgans().length,col={idle:'var(--card-line)',tathir:'var(--amber)',tanwir:'var(--green)',done:'var(--teal)'};
  return `<p class="muted" style="margin:0 2px 4px">لكل جارحة مرحلتان: تطهير ثلاثين يومًا متتالية بلا زلة، ثم تنوير ثلاثين يومًا باستعمالها في الطاعة على السنة. الزلة أو اليوم الفائت يعيد العدّ من البداية.</p>
   <p class="meta tz-lim">يمكنك تزكية جارحتين معًا على الأكثر · ${act} من ${MAX_ACTIVE} الآن</p>
   <div class="tz-path">${ORGANS.map(g=>{const o=S.organs[g.id];const tag=o.phase==='idle'?PHASE.idle:o.parked?'أتمّت التطهير · خارج اليوم':o.phase==='done'?'تمّت تزكيتها ✓':'<span>'+PHASE[o.phase]+'</span> · <span>'+o.days+' من 30</span>';
    return `<button class="tz-node" style="--c:${col[o.phase]}" data-organ="${g.id}"><span class="tz-name"><b>${g.name}</b><span class="pill p-${o.phase}">${tag}</span></span><span class="tz-go"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6" stroke-linecap="round" stroke-linejoin="round"/></svg></span></button>`}).join('')}</div>`;
}
function viewOrgan(){const g=ORGANS.find(x=>x.id===orgSel)||ORGANS[0],o=S.organs[g.id];
  const stIdx={idle:-1,tathir:0,tanwir:1,done:2}[o.phase],pct=Math.min(o.days,30)/30*100;
  const steps=['التطهير','التنوير','تمّت'].map((l,k)=>`<div class="${k<stIdx||o.phase==='done'?'f':k===stIdx?'a':''}"><i style="${k===stIdx&&o.phase!=='done'?'--p:'+pct+'%':''}"></i>${l}</div>`).join('');
  const full=activeOrgans().length>=MAX_ACTIVE&&o.phase==='idle';
  let card=organCard(g,true);
  if(full)card=card.replace(/<div class="btns"><button class="btn primary" data-start="[a-z]+">[^<]*<\/button><\/div>/,`<p class="meta tz-lim" style="margin:8px 0 0">تزكّي الآن جارحتين، وهذا أقصى ما يُجمع. أتمم إحداهما ثم ابدأ ${g.name}.</p>`);
  return `<section><div class="box pad tz-steps">${steps}</div>${card}</section>`;
}
