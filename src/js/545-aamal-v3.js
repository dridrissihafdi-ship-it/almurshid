/* ---------- «الأعمال» (simple UI), third form:
   week strip · the day's progress · «الآن» · the five prayers · the day as stations on the prayer times
   (past ones folded, the current one open, coming ones dimmed) · swipe a deed to complete it · long-press for its details ·
   gentle words for what has passed · then insights: what you miss most, two weeks of constancy, and levels. ---------- */
const amStOpen=new Set();let amLP=null,amSw=null,amNoClick=0;
const AMI={sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/>',
 moon:'<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',book:'<path d="M3 5c3-1 6-1 9 1 3-2 6-2 9-1v14c-3-1-6-1-9 1-3-2-6-2-9-1z"/><path d="M12 6v14"/>',
 beads:'<circle cx="12" cy="4" r="1.6"/><circle cx="17" cy="6.5" r="1.6"/><circle cx="19" cy="12" r="1.6"/><circle cx="17" cy="17.5" r="1.6"/><circle cx="7" cy="6.5" r="1.6"/><circle cx="5" cy="12" r="1.6"/><circle cx="7" cy="17.5" r="1.6"/><path d="M12 19v3"/>',
 star:'<path d="M12 3l2.6 5.5 6 .7-4.5 4.1 1.2 6L12 16.3 6.7 19.3l1.2-6L3.4 9.2l6-.7z"/>',mosque:'<path d="M4 20V11a8 6 0 0 1 16 0v9z"/><path d="M12 3v2M9 20v-4a3 3 0 0 1 6 0v4"/>',
 rug:'<rect x="6" y="3" width="12" height="18" rx="2"/><path d="M9 7h6M9 17h6M12 10v4"/>',hand:'<path d="M4 14c3 0 5 1 7 3h4a2 2 0 0 0 0-4h-3"/><path d="M4 12v8"/><path d="M15 13l4-3a2 2 0 0 1 3 3l-5 5c-2 2-6 2-9 1"/><circle cx="16" cy="5" r="2"/>',
 heart:'<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>',fast:'<path d="M17 4a8 8 0 1 0 3 12 6 6 0 0 1-3-12z"/><path d="M4 21h16"/>',
 drop:'<path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z"/>',walk:'<circle cx="13" cy="4" r="2"/><path d="M11 21l2-6-3-3 1-4 4 3 3 1M8 13l-2 8"/>',check:'<path d="M5 12l5 5 9-10"/>'};
const AM_IC={sabah:'sun',masa:'moon',quran:'book',kahf:'book',dhikr:'beads',jsal:'beads',qiyam:'star',witr:'star',raghiba:'rug',duha:'sun',qdhuhr:'rug',bdhuhr:'rug',qasr:'rug',bmaghrib:'rug',bisha:'rug',
 sadaqa:'hand',help:'heart',sawm:'fast',sawm_mon:'fast',sawm_thu:'fast',bid:'fast',ghusl:'drop',tabkir:'walk',fajr:'mosque',dhuhr:'mosque',asr:'mosque',maghrib:'mosque',isha:'mosque'};
const amIc=id=>`<span class="amx-ic" aria-hidden="true"><svg viewBox="0 0 24 24">${AMI[AM_IC[id]||'check']}</svg></span>`;
/* which station each deed belongs to ('all' = any time of the day) */
const AM_ST={raghiba:'fajr',sabah:'fajr',quran:'fajr',duha:'duha',qdhuhr:'dhuhr',bdhuhr:'dhuhr',qasr:'asr',masa:'maghrib',bmaghrib:'maghrib',dhikr:'maghrib',bisha:'isha',witr:'layl',qiyam:'layl',ghusl:'fajr',tabkir:'duha'};
function amStations(pt){return [['all','طوال اليوم',null,null],['fajr','الفجر',pt.fajr,pt.sunrise,'fajr'],['duha','الضحى',pt.sunrise,pt.dhuhr],['dhuhr','الظهر',pt.dhuhr,pt.asr,'dhuhr'],['asr','العصر',pt.asr,pt.maghrib,'asr'],
 ['maghrib','المغرب',pt.maghrib,pt.isha,'maghrib'],['isha','العشاء',pt.isha,pt.isha+1.5,'isha'],['layl','الليل',pt.isha+1.5,24+pt.fajr]]}
const amPct=d=>{try{const r=trDay(d);return r[1]?Math.round(r[0]/r[1]*100):0}catch(e){return 0}};
function amStreak(){let n=0;const t=amPct(TODAY)>=50;for(let i=t?0:1;i<400;i++){if(amPct(addDays(TODAY,-i))>=50)n++;else break}return n}
/* did the seeker do deed `id` on day d (for constancy, insights and the heat map) */
function amDid(id,d){const L=(S.log||{})[d];if(!L)return null;if(FIVE.some(f=>f[0]===id))return (L.prayers||[]).includes(id);if(NAFL_IDS.includes(id))return !!(L.nafl||{})[id];return (L.awrad||[]).includes(id)}
function amChosen(d){const L=(S.log||{})[d],P=(L&&L.pick)||S.amPick||{aw:AW_PICK.slice(),nf:['raghiba','witr']};return [...awList(P,d),...(P.nf||[]).filter(i=>NAFL_IDS.includes(i))]}
function amName(id,pt){const a=AWRAD.find(x=>x.id===id);if(a)return a.t;const n=naflDefs(pt).find(x=>x.id===id);if(n)return n.t.replace(/<[^>]+>/g,'');const f=FIVE.find(x=>x[0]===id);if(f)return 'صلاة '+f[1];const s=seasonal().find(x=>x.id===id);return s?s.t:id}
function amWeek(){const days=Array.from({length:7},(_,i)=>addDays(TODAY,i-6)),cur=aDate||TODAY;
  return `<div class="amx-week" role="tablist">${days.map(d=>{const p=amPct(d),w=WDAYS[new Date(d+'T12:00:00').getDay()];return `<button role="tab" class="${d===cur?'on':''}" data-amday="${d}" aria-selected="${d===cur}"><small>${d===TODAY?'<span>اليوم</span>':w}</small><i style="--p:${p}"></i></button>`}).join('')}</div>`}
function amHead(D,past){const [dn,tot]=trDay(D),p=tot?dn/tot:0,C=2*Math.PI*40;
  let tr='',mk='';try{const T=treeState();tr=T.st<3?TREE_ST[T.st]:T.hs===0?(T.t>=1?'مثمرة كاملة':'نضرة'):TREE_HS[T.hs]}catch(e){}
  try{const f=mkDone(TODAY),D2=mkDay();mk=D2.r==='w'?'انتصرت':D2.r==='l'?'خسرت':f.filter(Boolean).length+' / '+f.length}catch(e){}
  const st=amStreak();
  return `<div class="box amx-prog"><svg viewBox="0 0 100 100" class="amx-ring" aria-hidden="true"><circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,.14)" stroke-width="9"/><circle cx="50" cy="50" r="40" fill="none" stroke="var(--gold)" stroke-width="9" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C*(1-p)}" transform="rotate(-90 50 50)"/><text x="50" y="52" text-anchor="middle" class="r1" dir="ltr">${Math.round(p*100)}%</text><text x="50" y="68" text-anchor="middle" class="r2" dir="ltr">${dn} / ${tot}</text></svg>
   <div class="amx-st">${past?`<div><span>يوم مضى</span><b>${WDAYS[new Date(D+'T12:00:00').getDay()]} ${fmtD(D)}</b></div>`:`<div><span>أيام المداومة</span><b dir="auto">${st} <span>${st===1?'يوم':st===2?'يومان':st<11?'أيام':'يومًا'}</span></b></div><div><span>شجرتك</span><b>${tr}</b></div><div><span>معركة اليوم</span><b dir="auto">${mk}</b></div>`}</div>
   <button class="amx-more" data-ammore="1" aria-label="${esc(Tx('المزيد'))}">⋯</button></div>`}
/* «الآن»: the one thing to do now, with its button, and the time left before the next prayer */
function amNow(o,stK,items,isDone){const {L,pt,pr}=o,h=dH(),PN=Object.fromEntries(FIVE);
  const nxt=FIVE.find(([k])=>h<pt[k]),nT=nxt?pt[nxt[0]]:24+pt.fajr,mins=Math.max(0,Math.round((nT-h)*60)),left=mins>=60?`${Math.floor(mins/60)} <span>س</span> ${mins%60} <span>د</span>`:`${mins} <span>دقيقة</span>`;
  const cd=`<div class="amx-cd"><span>${nxt?'<span>يبقى على</span> '+nxt[1]:'<span>يبقى على الفجر</span>'}</span><b dir="auto">${left}</b></div>`;
  const curP=h<pt.fajr?null:FIVE.filter(([k])=>h>=pt[k]).map(f=>f[0]).pop(),due=curP&&!pr.includes(curP)?curP:null;
  if(due)return `<div class="box amx-now"><p class="k"><i></i><span>الآن</span></p><h2><span>صلاة</span> ${PN[due]}</h2><p class="s"><span>دخل وقتها</span> ${hm(pt[due])}</p><button class="btn ok amx-cta" data-pray="${due}">صلّيتها ✓</button>${cd}</div>`;
  const x=items.find(i=>!isDone(i)&&AM_ST[i.id]===stK)||items.find(i=>!isDone(i)&&(AM_ST[i.id]||'all')==='all');
  if(!x)return `<div class="box amx-now ok"><p class="k"><i></i><span>الآن</span></p><h2>أحسنت</h2><p class="s">أتممت ما في هذا الوقت. ${nxt?'<span>التالي:</span> <span>صلاة</span> '+nxt[1]+' '+hm(pt[nxt[0]]):''}</p>${cd}</div>`;
  const nm=amName(x.id,pt),sub=x.k==='a'?(o.IT[x.id]||{}).s||'':'';
  const btn=x.id==='sabah'||x.id==='masa'?`<button class="btn ok amx-cta" data-adhkar="${x.id}">ابدأ الآن ←</button>`:x.id==='quran'&&S.mushaf?`<button class="btn ok amx-cta" data-mshopen="1">افتح المصحف ←</button>`:x.k==='n'?`<button class="btn ok amx-cta" data-nafl="${x.id}" data-nfn="${Math.max(...(naflDefs(pt).find(z=>z.id===x.id)||{r:[2]}).r)}">أدّيتها ✓</button>`:`<button class="btn ok amx-cta" data-amck="w-${x.id}">أتممته ✓</button>`;
  return `<div class="box amx-now"><p class="k"><i></i><span>الآن</span></p><h2>${nm}</h2>${sub?`<p class="s">${sub}</p>`:''}${btn}${cd}</div>`}
/* small heads-up chips: tomorrow's sunnah fast, the white days coming */
function amTips(){const t=[],h=dH(),pt=ptDay(),tw=(DOW+1)%7;
  if((tw===1||tw===4)&&h>=pt.asr)t.push(`🌙 <span>${tw===1?'غدًا الاثنين: تنوي الصيام؟':'غدًا الخميس: تنوي الصيام؟'}</span>`);
  if(hijriDay>=10&&hijriDay<=12)t.push(`⚪ <span>الأيام البيض بعد</span> ${13-hijriDay} <span>${13-hijriDay===1?'يوم':'أيام'}</span>`);
  return t.length?`<div class="amx-tips">${t.map(x=>`<span class="amx-chip">${x}</span>`).join('')}</div>`:''}
function amSimple(o){const {L,past,D,P,awL,nfOn,lateAw,IT,pt,pr,late}=o,PN=Object.fromEntries(FIVE),h0=dH(),hh=past?99:(h0<pt.fajr?h0+24:h0);
  const lastK=FIVE.map(f=>f[0]).filter(k=>pr.includes(k)).pop(),askK=!past&&lastK&&!inMsj(L,lastK)&&!(L.msjNo||[]).includes(lastK)?lastK:null;
  const five=`<div class="sh am-h"><h2>الفرائض</h2><span dir="ltr">${pr.length} / 5</span></div><div class="box pad am-five am-s5"><span class="pr-row">${FIVE.map(([k,n])=>{const on=pr.includes(k),lt=late.includes(k),m=on&&inMsj(L,k);
    return `<span class="pr-cell"><button class="pr-chip${on?(m?' on':' home'):lt?' late':''}" data-pray="${k}" aria-pressed="${on}"><i>${on?'✓':lt?'!':''}</i><b>${n}</b><small>${hm(pt[k])}</small></button>${m?`<button class="am-mt" data-masjid="${k}">في المسجد</button>`:''}</span>`}).join('')}</span>
    ${askK?`<div class="am-ask"><b><span>صلّيت</span> ${PN[askK]}<span>: في المسجد؟</span></b><button class="btn small ok" data-masjid="${askK}">نعم</button><button class="btn small" data-msjno="${askK}">لا</button></div>`:''}</div>`;
  /* the deeds */
  const ND=Object.fromEntries(naflDefs(pt).map(x=>[x.id,x]));const it=[];
  seasonal().filter(x=>x.id!=='khalwa').forEach(x=>it.push({k:'x',id:x.id,a:{id:x.id,t:x.t,s:x.s}}));
  awL.forEach(i=>it.push({k:'a',id:i}));nfOn.forEach(i=>{if(ND[i])it.push({k:'n',id:i})});
  (CONTENT.extra||[]).forEach(x=>it.push({k:'x',id:x.id,a:{id:x.id,t:'<span class="notr" dir="auto">'+esc(x.t)+'</span>',s:x.s?'<span class="notr" dir="auto">'+esc(x.s)+'</span>':''}}));
  myDeeds().filter(m=>mineDue(m,D)).forEach(m=>it.push({k:'x',id:m.id,a:{id:m.id,t:'<span class="notr" dir="auto">'+esc(m.t)+'</span>',s:(m.s?'<span class="notr" dir="auto">'+esc(m.s)+'</span> · ':'')+'<span>من أعمالي الخاصة</span>'}}));
  const isDone=x=>x.k==='p'?pr.includes(x.id):x.k==='n'?(()=>{const n=(L.nafl||{})[x.id];return !!n&&nfFull(ND[x.id],n)})():L.awrad.includes(x.id);
  const strip=s=>s.replace(/^<div class="box">/,'').replace(/<\/div>$/,'');
  const gentle=s=>s.replace(/<span class="tag miss">فاتتك?<\/span>/g,'<span class="tag amx-past">لم يُسجَّل</span>');
  const row=x=>{let r;
    if(x.k==='p'){const on=pr.includes(x.id),lt=late.includes(x.id),m=on&&inMsj(L,x.id);r=`<div class="wird amx-pr${on?' on':lt?' late':''}"><button class="nf-c" data-pray="${x.id}" aria-pressed="${on}">${on?'✓':lt?'!':''}</button><span class="t"><span>صلاة</span> ${PN[x.id]}<small>${hm(pt[x.id])}${m?' · <span>في المسجد</span>':''}</small></span></div>`}
    else r=x.k==='n'?gentle(naflRows([x.id],L,pt)):gentle(strip(wirdList([x.k==='a'?Object.assign({},IT[x.id],{tag:null}):x.a],L,x.k==='a'?lateAw:[])));
    if(x.id==='dhikr'&&!past)r+=`<button class="am-dl" data-amdl="1">${amDlOpen?'إخفاء أذكارك':'تعديل أذكارك'}</button>`;
    return `<div class="am-it amx-it${isDone(x)?' dn':''}" data-amid="${x.id}" data-amk="${x.k}">${amIc(x.id)}<div class="amx-b">${r}</div></div>`};
  const ST=amStations(pt);let curK=null;if(!past){for(const s of ST)if(s[2]!=null&&hh>=s[2])curK=s[0]}
  const byS={};ST.forEach(s=>byS[s[0]]=[]);ST.forEach(s=>{if(s[4])byS[s[0]].push({k:'p',id:s[4]})});
  it.forEach(x=>byS[AM_ST[x.id]||'all'].push(x));
  const ci=ST.findIndex(s=>s[0]===curK),all=[...it];
  const tl=ST.map((s,i)=>{const L2=byS[s[0]];if(!L2.length)return '';const dn=L2.filter(isDone).length,full=dn===L2.length,isAll=s[0]==='all';
    const st=past?'past':isAll?(full?'past':'cur'):s[0]===curK?'cur':i<ci?'past':'fu',open=past?amStOpen.has(s[0])||!full:st==='cur'?!amStOpen.has('-'+s[0]):amStOpen.has(s[0]);
    const n=`<span class="amx-n">${full?'✓':isAll?'∞':i}</span>`,tm=s[2]!=null?`<small>${hm(s[2]%24)}</small>`:'';
    if(!open)return `<div class="amx-st2 ${st}${full?' full':''}">${n}<button class="amx-fold" data-amst="${s[0]}"><b>${s[1]}</b>${st==='fu'?`<span class="amx-nm">${tm} · ${L2.filter(x=>x.k!=='p').map(x=>'<span>'+amName(x.id,pt)+'</span>').slice(0,3).join(' · ')||'<span>الصلاة</span>'}</span>`:`<span class="amx-c${full?' ok':''}" dir="ltr">${full?'✓ ':''}${dn} / ${L2.length}</span>`}</button></div>`;
    return `<div class="amx-st2 ${st} open${full?' full':''}">${n}<section class="amx-open"><button class="amx-hd" data-amst="${st==='cur'?'-':''}${s[0]}"><b>${s[1]}</b>${st==='cur'&&!isAll?'<span class="amx-now-t">الآن</span>':tm}<span class="amx-c" dir="ltr">${dn} / ${L2.length}</span></button>${L2.map(row).join('')}</section></div>`}).join('');
  const nowC=past?'':amNow(o,curK,all,isDone);
  const list=`<div class="sh am-h"><h2>يومك على أوقات الصلاة ${hintBtn('day')}</h2></div><div class="amx-tl">${tl}</div>
    ${past?'':`<div class="am-add"><button class="am-addb" data-mineadd="1">+ <span>أضف عملًا</span></button>${myDeeds().length?`<button class="am-addb s" data-ammine="1">${amMineOpen?'إخفاء':'أعمالي الخاصة'}</button>`:''}</div>`}
    ${amDlOpen&&!past?dhikrEditor():''}${(mineForm||amMineOpen)&&!past?mineBlock(L,D,past):''}`;
  return `${past?aDateBar():''}${amWeek()}${amHead(D,past)}${nowC}${past?'':amTips()}${past?'':pushInvite()}${five}${list}${past?'':amInsights(pt)}
   <p class="meta amx-hint">اسحب أي عمل جانبًا لإتمامه، واضغط عليه مطوّلًا لترى تفاصيله.</p>`}
/* insights: the deed missed most this week, two weeks of constancy, and ready levels */
const AM_LV=[['مبتدئ',{aw:['sabah','masa'],nf:['witr']}],['متوسط',{aw:['sabah','masa','quran','dhikr','sadaqa'],nf:['raghiba','witr']}],
 ['متقدّم',{aw:['sabah','masa','quran','dhikr','qiyam','sawm_mon','sawm_thu','sadaqa','help'],nf:NAFL_IDS.slice()}]];
function amInsights(pt){const days=Array.from({length:7},(_,i)=>addDays(TODAY,-i-1)),cnt={};
  days.forEach(d=>{if(!(S.log||{})[d])return;[...FIVE.map(f=>f[0]),...amChosen(d)].forEach(id=>{if(amDid(id,d)===false)cnt[id]=(cnt[id]||0)+1})});
  const worst=Object.entries(cnt).sort((a,b)=>b[1]-a[1])[0];
  const ins=worst&&worst[1]>=3?`<div class="box amx-ins"><span class="amx-ic warn" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 16.5v.5"/></svg></span><div><b>أكثر ما يفوتك هذا الأسبوع</b><p><span>«</span>${amName(worst[0],pt)}<span>»</span> <span>لم يُسجَّل</span> ${worst[1]} <span>مرات من سبعة أيام.</span> <span>اجعله في نيّتك من أول وقته، أو خفّف أعمالك حتى تثبت عليه.</span></p></div></div>`:'';
  const ids=['fajr',...amChosen(TODAY)].slice(0,6),d14=Array.from({length:14},(_,i)=>addDays(TODAY,i-13));
  const hm2=`<div class="box amx-hm"><div class="sh" style="margin:0 0 8px"><h3>مداومتك في أسبوعين</h3></div><div class="amx-grid">${ids.map(id=>`<span class="amx-hl">${id==='fajr'?'<span>الفرائض</span>':amName(id,pt)}</span>${d14.map(d=>{let v;if(id==='fajr'){const L=(S.log||{})[d];v=L?(L.prayers||[]).length/5:null}else{const x=amDid(id,d);v=x===null?null:x?1:0}return `<i class="${v===null?'':v>=1?'c':v>=.6?'b':v>0?'a':'z'}"></i>`}).join('')}`).join('')}</div></div>`;
  const P=S.amPick||{aw:[],nf:[]},same=(a,b)=>a.length===b.length&&a.every(x=>b.includes(x)),cur=AM_LV.findIndex(([,x])=>same(x.aw,P.aw)&&same(x.nf,P.nf));
  const lv=`<div class="box amx-lv"><div class="sh" style="margin:0 0 8px"><h3>مستواك في الأعمال</h3></div><div class="amx-lvs">${AM_LV.map(([t,x],i)=>`<button class="${i===cur?'on':''}" data-amlv="${i}"><b>${t}</b><small>${5+x.aw.filter(a=>awDayOk(a)).length+x.nf.length} <span>أعمال اليوم</span></small></button>`).join('')}</div><p class="meta" style="margin:8px 0 0">${cur<0?'<span>اخترت أعمالك بنفسك.</span> ':''}<span>ابدأ بالقليل الذي تداوم عليه، فأحبّ الأعمال إلى الله أدومها وإن قلّ.</span></p></div>`;
  return ins+hm2+lv}
/* a deed's details (long press) */
function amDetail(id,k){const D=aDate||TODAY,pt=prayerTimes(new Date(D+'T12:00:00')),ND=naflDefs(pt).find(x=>x.id===id),A=AWRAD.find(x=>x.id===id),nm=amName(id,pt);
  const S_=AM_ST[id],ST=amStations(pt).find(s=>s[0]===S_),win=ND?hm(ND.w[0])+' – '+hm(ND.w[1]%24):FIVE.some(f=>f[0]===id)?hm(pt[id]):ST&&ST[2]!=null?hm(ST[2])+' – '+hm(ST[3]%24):Tx('طوال اليوم');
  const d30=Array.from({length:30},(_,i)=>addDays(TODAY,-i)),has=d30.filter(d=>amDid(id,d)!==null),got=has.filter(d=>amDid(id,d)).length;
  const d14=Array.from({length:14},(_,i)=>addDays(TODAY,i-13));
  sheetOpen(`<div class="bs-top"><h2>${nm}</h2><button class="qa-ed" data-bsx="1">إغلاق</button></div>
   ${A&&A.s?`<p class="meta" style="margin:0 0 8px">${A.s}</p>`:ND?`<p class="meta" style="margin:0 0 8px">${ND.s}</p>`:''}
   <div class="amx-kv"><div><b dir="ltr">${win}</b><span>وقته</span></div><div><b dir="ltr">${got} / ${has.length||0}</b><span>مداومتك في 30 يومًا</span></div></div>
   <div class="amx-dots">${d14.map(d=>{const x=amDid(id,d);return `<i class="${x===null?'':x?'c':'z'}" title="${d}"></i>`}).join('')}</div><p class="meta" style="margin:4px 0 12px">آخر أسبوعين: الأخضر يوم أتممته فيه.</p>
   <button class="btn ok" data-bsx="1" data-amck="${k==='p'?'':k==='n'?'':'w-'+id}" ${k==='p'?`data-pray="${id}"`:k==='n'?`data-nafl="${id}" data-nfn="${ND?Math.max(...ND.r):2}"`:''}>${amDid(id,D)?'تمّ ✓ (اضغط للتراجع)':'سجّلته ✓'}</button>`);i18nApply(document.getElementById('bsheet'))}
/* toggle a deed from its row: the same control the row already has */
function amToggle(it){const c=it.querySelector('input[data-wird]')||it.querySelector('button.nf-c')||it.querySelector('[data-pray]');amNoClick=0;if(c)c.click();amNoClick=Date.now()}
document.addEventListener('click',e=>{if(amNoClick&&Date.now()-amNoClick<700){e.preventDefault();e.stopPropagation();return}
  const t=e.target.closest('button');if(!t)return;const d=t.dataset;
  if(d.amday){aDate=d.amday===TODAY?null:d.amday;amStOpen.clear();render();SCR().scrollTo(0,0);return}
  if(d.amst){const k=d.amst;amStOpen.has(k)?amStOpen.delete(k):amStOpen.add(k);const y=SCR().scrollTop;render();SCR().scrollTo(0,y);return}
  if(d.amck){const el=document.getElementById(d.amck);if(el){el.click()}else{const L=aLog(),id=d.amck.slice(2);L.awrad=L.awrad||[];L.awrad.includes(id)?L.awrad.splice(L.awrad.indexOf(id),1):L.awrad.push(id);save();const y=SCR().scrollTop;render();SCR().scrollTo(0,y)}if(d.bsx)try{sheetClose()}catch(x){}return}
  if(d.amlv){const x=AM_LV[+d.amlv][1];S.amPick={aw:x.aw.slice(),nf:x.nf.slice()};if(!aDate){const L=aLog();L.pick={aw:x.aw.slice(),nf:x.nf.slice()}}save();const y=SCR().scrollTop;render();SCR().scrollTo(0,y);return}
},true);
/* swipe sideways on a deed = complete it; long press = its details */
document.addEventListener('touchstart',e=>{const it=e.target.closest&&e.target.closest('.amx-it');if(!it||e.touches.length!==1)return;const p=e.touches[0];
  amSw={it,x:p.clientX,y:p.clientY,h:false,dx:0};clearTimeout(amLP);amLP=setTimeout(()=>{if(amSw&&!amSw.h&&Math.abs(amSw.dx)<8){amNoClick=Date.now();try{navigator.vibrate&&navigator.vibrate(15)}catch(x){}amDetail(it.dataset.amid,it.dataset.amk);amSw=null}},550)},{passive:true});
document.addEventListener('touchmove',e=>{if(!amSw)return;const p=e.touches[0],dx=p.clientX-amSw.x,dy=p.clientY-amSw.y;amSw.dx=dx;
  if(Math.abs(dy)>12&&!amSw.h){clearTimeout(amLP);amSw=null;return}if(Math.abs(dx)>12){clearTimeout(amLP);amSw.h=true;const b=amSw.it.querySelector('.amx-b');if(b){b.style.transform=`translateX(${Math.max(-110,Math.min(110,dx))}px)`;amSw.it.classList.toggle('sw',Math.abs(dx)>70)}}},{passive:true});
document.addEventListener('touchend',()=>{clearTimeout(amLP);if(!amSw)return;const {it,dx,h}=amSw;amSw=null;const b=it.querySelector('.amx-b');if(b)b.style.transform='';it.classList.remove('sw');
  if(h&&Math.abs(dx)>70){try{navigator.vibrate&&navigator.vibrate(20)}catch(x){}amToggle(it)}},{passive:true});
document.addEventListener('contextmenu',e=>{if(e.target.closest&&e.target.closest('.amx-it'))e.preventDefault()});
