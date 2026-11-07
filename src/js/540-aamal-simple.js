/* ---------- «الأعمال» in the simple UI: one line on top, the five prayers, then one list of the day in the order of its hours ---------- */
let amDoneOpen=false,amDlOpen=false,amMineOpen=false;
function amSimple(o){const {L,past,D,P,awL,nfOn,lateAw,IT,pt,pr,late,sum2}=o,PN=Object.fromEntries(FIVE),h0=dH(),hh=h0<pt.fajr?h0+24:h0;
  const head=sum2.replace(/<label class="am-ib"[\s\S]*?<\/label>/,'').replace(/<button class="am-ib[^"]*" data-ampickopen="1"[\s\S]*?<\/button>/,`<button class="am-ib am-dots" data-ammore="1" aria-label="${esc(Tx('المزيد'))}">⋯</button>`);
  /* the five prayers; "in the mosque?" is asked once, for the last prayer recorded */
  const lastK=FIVE.map(f=>f[0]).filter(k=>pr.includes(k)).pop(),askK=!past&&lastK&&!inMsj(L,lastK)&&!(L.msjNo||[]).includes(lastK)?lastK:null;
  const five=`<div class="sh am-h"><h2>الفرائض</h2><span dir="ltr">${pr.length} / 5</span></div><div class="box pad am-five am-s5"><span class="pr-row">${FIVE.map(([k,n])=>{const on=pr.includes(k),lt=late.includes(k),m=on&&inMsj(L,k);
    return `<span class="pr-cell"><button class="pr-chip${on?(m?' on':' home'):lt?' late':''}" data-pray="${k}" aria-pressed="${on}"><i>${on?'✓':lt?'!':''}</i><b>${n}</b><small>${hm(pt[k])}</small></button>${m?`<button class="am-mt" data-masjid="${k}">في المسجد</button>`:''}</span>`}).join('')}</span>
    ${askK?`<div class="am-ask"><b><span>صلّيت</span> ${PN[askK]}<span>: في المسجد؟</span></b><button class="btn small ok" data-masjid="${askK}">نعم</button><button class="btn small" data-msjno="${askK}">لا</button></div>`:''}</div>`;
  /* the day's deeds, sorted by the hour they belong to */
  const ND=Object.fromEntries(naflDefs(pt).map(x=>[x.id,x]));
  const AT={sawm_mon:-1,sawm_thu:-1,sabah:pt.fajr,quran:pt.fajr+.05,sadaqa:pt.dhuhr+.01,help:pt.dhuhr+.02,masa:pt.maghrib,dhikr:pt.maghrib+.05,qiyam:24+pt.fajr-1};
  const ST={sabah:pt.fajr,masa:pt.maghrib,qiyam:pt.isha};
  const it=[];
  seasonal().filter(x=>x.id!=='khalwa').forEach(x=>it.push({k:'x',id:x.id,t:-2,a:{id:x.id,t:x.t,s:x.s}}));
  awL.forEach(i=>it.push({k:'a',id:i,t:AT[i]!==undefined?AT[i]:pt.dhuhr,st:ST[i]}));
  nfOn.forEach(i=>{const x=ND[i];if(x)it.push({k:'n',id:i,t:x.w[0],st:x.w[0]})});
  (CONTENT.extra||[]).forEach(x=>it.push({k:'x',id:x.id,t:98,a:{id:x.id,t:'<span class="notr" dir="auto">'+esc(x.t)+'</span>',s:x.s?'<span class="notr" dir="auto">'+esc(x.s)+'</span>':''}}));
  myDeeds().filter(m=>mineDue(m,D)).forEach(m=>it.push({k:'x',id:m.id,t:99,a:{id:m.id,t:'<span class="notr" dir="auto">'+esc(m.t)+'</span>',s:(m.s?'<span class="notr" dir="auto">'+esc(m.s)+'</span> · ':'')+'<span>من أعمالي الخاصة</span>'}}));
  it.sort((a,b)=>a.t-b.t);
  const isDone=x=>x.k==='n'?(()=>{const n=(L.nafl||{})[x.id];return !!n&&nfFull(ND[x.id],n)})():L.awrad.includes(x.id);
  const strip=s=>s.replace(/^<div class="box">/,'').replace(/<\/div>$/,'');
  const row=x=>{const dim=!past&&!isDone(x)&&x.st!==undefined&&hh<x.st&&!lateAw.includes(x.id);
    let r=x.k==='n'?naflRows([x.id],L,pt):strip(wirdList([x.k==='a'?Object.assign({},IT[x.id],{tag:null}):x.a],L,x.k==='a'?lateAw:[]));
    if(x.id==='dhikr'&&!past)r+=`<button class="am-dl" data-amdl="1">${amDlOpen?'إخفاء أذكارك':'تعديل أذكارك'}</button>`;
    return `<div class="am-it${dim?' dim':''}">${r}</div>`};
  const done=it.filter(isDone),todo=it.filter(x=>!isDone(x));
  const list=`<div class="sh am-h"><h2>أعمال اليوم ${hintBtn('day')}</h2><span dir="ltr">${done.length} / ${it.length}</span></div>
   <div class="box am-list">${done.length?`<button class="am-done" data-amdone="1"><span>✓ <span>أتممت</span> ${done.length}</span><small>${amDoneOpen?'<span>إخفاء</span>':done.slice(0,3).map(x=>x.k==='n'?ND[x.id].t:x.k==='a'?IT[x.id].t:x.a.t).join(RTL()?'، ':', ')}</small></button>`:''}
    ${amDoneOpen?done.map(row).join(''):''}${todo.map(row).join('')}
    ${past?'':`<div class="am-add"><button class="am-addb" data-mineadd="1">+ <span>أضف عملًا</span></button>${myDeeds().length?`<button class="am-addb s" data-ammine="1">${amMineOpen?'إخفاء':'أعمالي الخاصة'}</button>`:''}</div>`}</div>
   ${amDlOpen&&!past?dhikrEditor():''}${(mineForm||amMineOpen)&&!past?mineBlock(L,D,past):''}`;
  return `${past?aDateBar():''}${head}${past?'':pushInvite()}${five}${list}`}
function amMore(){const D=aDate||TODAY;
  const r=(attr,ic,t,s)=>`<button class="h2-row" ${attr} data-bsx="1"><span class="h2-ri"><svg viewBox="0 0 24 24" aria-hidden="true">${ic}</svg></span><span class="tx">${t}${s?`<small>${s}</small>`:''}</span></button>`;
  sheetOpen(`<div class="bs-top"><h2>أعمالك</h2><button class="qa-ed" data-bsx="1">إغلاق</button></div><div class="box h2-more am-mm">
   ${r('data-ampickopen="1"','<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>','اختر أعمالك ونوافلك','ما يظهر في قائمة اليوم')}
   <label class="h2-row am-dt"><span class="h2-ri"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="3"/><path d="M4 10h16M9 3v4M15 3v4"/></svg></span><span class="tx">يوم آخر<small>سجّل ما فاتك تسجيله</small></span><input type="date" id="aDateIn" value="${D}" max="${TODAY}" min="${addDays(TODAY,-365)}"></label>
   ${r('data-amview="type"','<path d="M4 6h16M4 12h16M4 18h16"/>','العرض حسب نوع العمل','الأقسام كما كانت من قبل')}</div>
   <p class="meta am-mv">وتجد أيضًا:</p><div class="box h2-more am-mm">
   ${r('data-go="ijtihad"','<path d="M5 19V13M10 19V9M15 19V11M20 19V5"/>','مرآة أعمالك','درجة أسبوعك ونصائح لك · في «أنا»')}
   ${r('data-go="khalwa"','<path d="M12 3a7 7 0 1 0 7 9 5.5 5.5 0 0 1-7-9z"/>','الخلوة والاعتكاف','في الطريق · الروحانيات')}</div>`)}
document.addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;const d=t.dataset;
  if(d.ammore){amMore();return}
  if(d.htedit){htEdit();return}
  if(d.errcopy){try{navigator.clipboard.writeText(APP_VER+'\n'+(localStorage.getItem('murshid-err')||''));t.textContent=Tx('نُسخ ✓')}catch(x){}return}
  if(d.errclear){try{localStorage.removeItem('murshid-err')}catch(x){}return render()}
  if(d.pushno){S.pushAskNo=1;save();return render()}
  if(d.mshretry){const w=document.getElementById('mshWait');if(w)w.innerHTML='<span class="msh-spin"></span><span>'+Tx('جارٍ تحميل الصفحة…')+'</span>';mushafPaint();return}
  if(d.amdone){amDoneOpen=!amDoneOpen;return render()}
  if(d.amdl){amDlOpen=!amDlOpen;if(amDlOpen)dlOpen=true;render();if(amDlOpen)setTimeout(()=>{const b=document.querySelector('.dl-box');b&&b.scrollIntoView({block:'start',behavior:'smooth'})},60);return}
  if(d.ammine){amMineOpen=!amMineOpen;return render()}
  if(d.msjno){const L=aLog();L.msjNo=L.msjNo||[];if(!L.msjNo.includes(d.msjno))L.msjNo.push(d.msjno);save();const y=SCR().scrollTop;render();SCR().scrollTo(0,y);return}
});
document.addEventListener('change',e=>{if(e.target&&e.target.id==='aDateIn'&&e.target.closest('#bsheet'))setTimeout(sheetClose,0)});

function viewAamal(){
  const past=!!aDate,L=aLog(),l=lights(),M=S.marks,D=aDate||TODAY,view=S.amView==='time'?'time':'type';
  const LIGHT={sabah:['الهالة',l.halo&&l.p.kind==='sabah'],masa:['الهالة',l.halo&&l.p.kind==='masa'],quran:['الرأس',l.head],dhikr:['القلب',l.heart]};
  const IT={};AWRAD.forEach(a=>{const x=LIGHT[a.id];const it={...a};
    if(a.id==='dhikr'){const dl=M.dhikrList||[];it.s=dl.length?`${ar2(dl.length)} ${dl.length>2&&dl.length<11?'أذكار':'ذكر'} · ${ar2(dlTotal())} دقيقة`:'أضف أذكارك من «مجموعة الذكر الشخصي» أسفله'}
    if(a.id==='quran'&&S.mushaf&&!past){const m=msh();it.s=Math.min(m.day.read.length,m.wird)+' / '+m.wird+' · '+(WIRD_OPTS.find(o=>o[0]===m.wird)||[0,''])[1]}
    if(x&&!past){it.tag=(x[1]?'✦ ':'')+x[0];it.tagOn=x[1]}IT[a.id]=it});
  const pt0=prayerTimes(new Date(D+'T12:00:00')),P=amPick(L),awL=awList(P,D),awOn=i=>awL.includes(i),nfOn=P.nf.filter(i=>NAFL_IDS.includes(i));
  const lateAw=[...AW_PICK,...AW_X].filter(i=>awOn(i)&&awLate(i,L,pt0));
  const rows=ids=>{ids=ids.filter(awOn);return ids.length?wirdList(ids.map(i=>IT[i]),L,lateAw):''};
  const pr=L.prayers||[],late=prLate(L,aDate),pt=prayerTimes(new Date(D+'T12:00:00')),PN=Object.fromEntries(FIVE);
  const prRow=k=>{const on=pr.includes(k),lt=late.includes(k),m=on&&inMsj(L,k);return `<div class="am-prw"><button class="am-pr${on?(m?' on':' home'):lt?' late':''}" data-pray="${k}" aria-pressed="${on}"><i>${on?'✓':lt?'!':''}</i><span><span>صلاة</span> ${PN[k]}<small>${hm(pt[k])}</small></span>${!on&&!past&&lt?'<em>صلّيتها</em>':''}</button><button class="pr-msj wide${m?' on':''}" data-masjid="${k}" aria-pressed="${m}">${MSJ}<span>في المسجد</span></button>${!on&&!past?`<button class="kh-mini" data-khgo="${k}">${khS(KU('khBtn'))}</button>`:''}</div>`};
  const total=FIVE.length+awL.length+nfOn.length,doneN=pr.length+awL.filter(i=>L.awrad.includes(i)).length+nfOn.filter(i=>(L.nafl||{})[i]).length;
  const left=[...FIVE.filter(([k])=>!pr.includes(k)&&late.includes(k)).map(f=>'صلاة '+f[1]),...awL.filter(i=>!L.awrad.includes(i)).map(i=>IT[i].t),...naflDefs(pt0).filter(x=>nfOn.includes(x.id)&&!(L.nafl||{})[x.id]).map(x=>x.t)];
  const C=2*Math.PI*26,ring=`<svg viewBox="0 0 64 64" class="am-ring"><circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="6"/><circle cx="32" cy="32" r="26" fill="none" stroke="var(--gold)" stroke-width="6" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C*(1-doneN/total)}" transform="rotate(-90 32 32)"/><text x="32" y="37" text-anchor="middle">${doneN}/${total}</text></svg>`;
  const C2=2*Math.PI*21,ring2=`<svg viewBox="0 0 52 52" class="am-ring2" aria-hidden="true"><circle cx="26" cy="26" r="21" fill="none" stroke="rgba(243,237,230,.16)" stroke-width="5"/><circle cx="26" cy="26" r="21" fill="none" stroke="var(--gold)" stroke-width="5" stroke-linecap="round" stroke-dasharray="${C2}" stroke-dashoffset="${C2*(1-(total?doneN/total:0))}" transform="rotate(-90 26 26)"/><text x="26" y="31" text-anchor="middle" dir="ltr">${doneN}/${total}</text></svg>`;
  const sum2=`<div class="am-sum2">${ring2}<div class="am-sm"><b>${past?'<span>يوم مضى</span> · '+WDAYS[new Date(D+'T12:00:00').getDay()]+' '+fmtD(D):'<span>اليوم</span> · '+WDAYS[new Date(D+'T12:00:00').getDay()]+' '+fmtD(D)}</b><small>${doneN===total?'أتممت أعمال اليوم ✓ تقبّل الله منك':left.length?'<span>باقٍ:</span> '+left.slice(0,3).map(t=>'<span>'+t+'</span>').join(RTL()?'، ':', ')+(left.length>3?' …':''):''}</small></div>${past?'':`<label class="am-ib" aria-label="اختيار يوم آخر"><input type="date" id="aDateIn" value="${D}" max="${TODAY}" min="${addDays(TODAY,-365)}">${'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="3"/><path d="M4 10h16M9 3v4M15 3v4"/></svg>'}</label>`}<button class="am-ib${amPickOpen?' on':''}" data-ampickopen="1" aria-label="اختر أعمالك ونوافلك">${'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/></svg>'}</button></div>${amPickOpen?amPickBox(P,pt0):''}`;
  if(SIMPLE()){if(!S.amV2){S.amV2=1;S.amView='list';save()}if(S.amView==='list')return amSimple({L,past,D,P,awL,nfOn,lateAw,IT,pt,pr,late,sum2})}
  const sum=`<div class="am-sum">${ring}<div><b>${past?'أعمال ذلك اليوم':'يومك حتى الآن'}</b><small>${doneN===total?'أتممت أعمال اليوم ✓ تقبّل الله منك':left.length?'<span>باقٍ:</span> '+left.slice(0,4).map(t=>'<span>'+t+'</span>').join(RTL()?'، ':', ')+(left.length>4?' …':''):''}</small></div></div>`;
  const pickBtn=`<div class="am-pickbar"><button class="btn small" data-ampickopen="1">${amPickOpen?'إغلاق':'اختر أعمالك ونوافلك'}</button></div>${amPickOpen?amPickBox(P,pt0):''}`;
  const tabs=`<div class="rtabs am-tabs" role="tablist"><button role="tab" class="${view==='type'?'on':''}" data-amview="type">حسب نوع العمل</button><button role="tab" class="${view==='time'?'on':''}" data-amview="time">حسب أوقات اليوم</button>${SIMPLE()?'<button role="tab" data-amview="list">قائمة واحدة</button>':''}</div>`;
  // what is due now (today only)
  let now='';if(!past){const P=period(),h=dH();
    const due=FIVE.filter(([k])=>!pr.includes(k)&&h>=pt[k]).map(f=>f[0]).pop();
    const nxt=FIVE.find(([k])=>h<pt[k])||(h>=pt.isha?['fajr',FIVE[0][1]]:null);
    if(due)now=`<div class="am-now"><div><b><span>الآن:</span> <span>صلاة</span> ${PN[due]}</b><small><span>دخل وقتها</span> ${hm(pt[due])}${nxt?' · <span>التالية:</span> <span>'+nxt[1]+'</span> '+hm(pt[nxt[0]]):''}</small></div><button class="btn small kh-pre" data-khgo="${due}">${khS(KU('khBtn'))}</button><button class="btn small ok" data-pray="${due}">صلّيتها</button></div>`;
    else if(!L.awrad.includes(P.kind))now=`<div class="am-now"><div><b><span>الآن:</span> ${P.kind==='sabah'?'أذكار الصباح':'أذكار المساء'}</b><small>${nxt?'<span>التالية:</span> <span>'+nxt[1]+'</span> '+hm(pt[nxt[0]]):''}</small></div><button class="btn small ok" data-adhkar="${P.kind}">اقرأ</button></div>`;
    else if(nxt)now=`<div class="am-now calm"><div><b><span>الصلاة التالية:</span> ${nxt[1]}</b><small>${hm(pt[nxt[0]])}</small></div><button class="btn small kh-pre" data-khgo="${nxt[0]}">${khS(KU('khBtn'))}</button></div>`}
  const g=(t,n,m,body)=>`<div class="am-g"><h3>${t}</h3><span dir="ltr">${n} / ${m}</span></div>${body}`;
  const cnt=ids=>ids.filter(i=>awOn(i)&&L.awrad.includes(i)).length,cn=ids=>ids.filter(awOn).length;
  const gg=(t,ids,body)=>cn(ids)?g(t,cnt(ids),cn(ids),body):'';
  let body;
  if(view==='type'){
    body=`${now}${g('الفرائض',pr.length,5,`<div class="box pad am-five">${prayerChips(L)}</div>${past?'':khAamalLink()}`)}
     ${gg('الأذكار',['sabah','masa'],rows(['sabah','masa']))}
     ${gg('الأوراد',['quran','dhikr'],rows(['quran','dhikr']))}
     ${nfOn.length+cn(['qiyam',...AW_X])?g('النوافل',nfOn.filter(i=>(L.nafl||{})[i]).length+cnt(['qiyam',...AW_X]),nfOn.length+cn(['qiyam',...AW_X]),`<div class="box">${naflRows(NAFL_IDS.filter(i=>nfOn.includes(i)),L,pt)}${rows(['qiyam',...AW_X]).replace(/^<div class="box">/,'').replace(/<\/div>$/,'')}</div>`):''}`}
  else{
    const h=dH();
    const SL=[['الصبح والصباح','fajr',['sabah','quran','sawm_mon','sawm_thu']],['الظهر','dhuhr',['sadaqa','help']],['العصر','asr',[]],['المغرب والمساء','maghrib',['masa']],['العشاء والليل','isha',['dhikr','qiyam']]];
    const curI=past?-1:SL.map((x,i)=>h>=pt[x[1]]?i:-1).filter(i=>i>=0).pop();
    const NT=Object.fromEntries(naflDefs(pt).map(x=>[x.id,x.t]));
    const itemsOf=(k,ids)=>[['p',k],...NAFL_SLOT[k].filter(x=>nfOn.includes(x)).map(x=>['n',x]),...ids.filter(awOn).map(x=>['a',x])];
    const isDone=x=>x[0]==='p'?pr.includes(x[1]):x[0]==='n'?!!(L.nafl||{})[x[1]]:L.awrad.includes(x[1]);
    const nameOf=x=>x[0]==='p'?'<span>صلاة</span> '+PN[x[1]]:x[0]==='n'?NT[x[1]]:IT[x[1]].t;
    body=SL.map(([t,k,ids],i)=>{const its=itemsOf(k,ids),dn=its.filter(isDone).length,full=dn===its.length,fut=!past&&i>curI,open=amOpen.has(k),cur=i===curI;
      if(full&&!open)return `<button class="am-col f" data-amslot="${k}"><i>✓</i><span class="am-ct">${t}</span><small><span>أتممت</span> ${dn} <span>${dn===1?'عملًا':dn===2?'عملين':'أعمال'}</span></small>${'<svg class="h2-chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>'}</button>`;
      if(fut&&!open)return `<button class="am-col fu" data-amslot="${k}"><span class="am-cth"><b>${t}</b><small>${hm(pt[k])}</small></span><span class="am-cl">${its.map(nameOf).join(' · ')}</span></button>`;
      return `<section class="am-slot2${cur?' cur':''}"><button class="am-sh2" data-amslot="${k}"${full||fut?'':' disabled'}><b>${t}${cur?' · <span>الآن</span>':''}</b><span>${hm(pt[k])} · ${dn} <span>من</span> ${its.length}</span></button><div class="am-sbox">${prRow(k)}${naflRows(NAFL_SLOT[k].filter(x=>nfOn.includes(x)),L,pt)}${ids.filter(awOn).length?rows(ids).replace(/^<div class="box">/,'').replace(/<\/div>$/,''):''}</div></section>`}).join('')}
  const extra=(CONTENT.extra||[]).length?`<section><div class="sh"><h2>أعمال مقترحة من الإدارة</h2><span>${CONTENT.extra.filter(x=>L.awrad.includes(x.id)).length} / ${CONTENT.extra.length}</span></div><div class="notr-wrap">${wirdList(CONTENT.extra.map(x=>({id:x.id,t:'<span class="notr" dir="auto">'+esc(x.t)+'</span>',s:x.s?'<span class="notr" dir="auto">'+esc(x.s)+'</span>':''})),L)}</div></section>`:'';
  let kAct;
  if(lightConfirm==='khalwa'||lightConfirm==='itikaf'){const w=lightConfirm==='khalwa'?'خلوة':'اعتكاف';
    kAct=`<div class="confirm redo-c"><span>تأكيد: أتممت ${w} اليوم؟ سيستنير جسدك كله في «حالتك الروحية اليومية» ثلاثين يومًا.</span><div class="btns"><button class="btn ok" data-lightyes="${lightConfirm}">نعم، أتممته</button><button class="btn" data-lightno="1">تراجع</button></div></div>`}
  else kAct=`<div class="btns"><button class="btn ok" data-lightask="khalwa">سجّلت خلوة</button><button class="btn ok" data-lightask="itikaf">سجّلت اعتكافًا</button></div>`;
  const lastK=M.khalwa.length?M.khalwa[M.khalwa.length-1]:null;
  const kStatus=l.body?`<span class="tag on">✦ الجسد كله</span> مستنير حتى ${fmtD(ds(new Date(l.bodyEnd)))} · باقٍ ${Math.ceil((l.bodyEnd-Date.now())/DAY)} يومًا`:lastK?`آخر ${lastK.type==='itikaf'?'اعتكاف':'خلوة'}: ${fmtD(ds(new Date(lastK.ts)))}`:'لم تُسجَّل خلوة بعد';
  const canUndo=lastK&&ds(new Date(lastK.ts))===nowStr();
  const more=past?'':`<div class="sh" style="margin:22px 2px 10px"><h2>المزيد</h2></div><div class="acc-card am-more"><button class="am-mrow" data-go="ijtihad"><span class="h2-ri"><svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 40V28M18 40V20M28 40V24M38 40V12"/><path d="M6 42h36"/></svg></span><span class="tx">مرآة أعمالك<small><span>درجة أسبوعك ونصائح لك</span>${(()=>{const w=ijWeek(0);return w.score===null?'':' · '+w.score+'/100'})()}</small></span>${'<svg class="h2-chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>'}</button>${acc('am-season','list','الأعمال الموسمية',wirdList(seasonal(),L),hijriLabel)}${acc('am-khalwa','user','الخلوة والاعتكاف',`<div class="box pad" style="display:flex;flex-direction:column;gap:10px"><button class="btn ok" data-go="khalwa" style="align-self:flex-start">برمجة خلوة أو اعتكاف وبرنامجها</button><div class="meta" style="color:var(--ink)">${kStatus}</div>${kAct}${canUndo&&!lightConfirm?`<button class="btn small" style="align-self:flex-start" data-khundo="1">إلغاء تسجيل اليوم</button>`:''}
   ${M.khalwa.length?`<details class="slips redo-h"><summary>سجل الخلوات (${M.khalwa.length})</summary><ol>${M.khalwa.slice().reverse().map(k=>`<li><div class="sl-h"><b>${fmtD(ds(new Date(k.ts)))}</b><span class="pill p-tanwir">${k.type==='itikaf'?'اعتكاف':'خلوة'}</span></div></li>`).join('')}</ol></details>`:''}</div>`,String(M.khalwa.length))}</div>${dhikrEditor()}`;
  return `${past?aDateBar():''}${sum2}${tabs}<section>${view==='time'&&!past?khAamalLink():''}${body}</section>${extra}${mineBlock(L,D,past)}${more}
   <p class="meta" style="margin-top:14px">أذكار الصباح تُحتسب بين الفجر والمغرب، وأذكار المساء بين المغرب والفجر. الأعمال المعلّمة بـ✦ تضيء صورتك في «حالتك الروحية اليومية».</p>`;
}
