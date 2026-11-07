/* ---------- «بياناتك الروحية»: four tabs, one visual language ---------- */
const RT_IC={khr:'<path d="M7 20v-8.4a5 5 0 0 1 10 0V20M4.5 20h15"/><path d="M9.6 20v-6.2a2.4 2.4 0 0 1 4.8 0V20"/>',muraqabat:'<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/>',
 sura:'<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
 tahlil:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
 week:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>'};
const RT_L={muraqabat:'أنوار اليوم',sura:'حالة القلب',tahlil:'الزلّات',week:'الأسبوع',khr:'الخشوع'};
function ruhiTabs(t){return `<div class="rtabs rt2" role="tablist">${RUHI_TABS.map(([k])=>`<button role="tab" aria-selected="${k===t}" class="${k===t?'on':''}" data-rtab="${k}"><svg viewBox="0 0 24 24" aria-hidden="true">${RT_IC[k]}</svg><span>${RT_L[k]}</span></button>`).join('')}</div>`}
function viewMuraqabat(){
  const l=lights(),n=litCount(),M=S.marks,dl=(M.dhikrList||[]).length;
  const msg=n===4?'اكتمل نورك: الهالة والرأس والقلب والجسد كله.':n===0?'الصورة مطفأة. كل عمل تقوم به يضيء جزءًا منها.':'كل عمل تقوم به يضيء جزءًا من الصورة.';
  const row=(on,name,how,until,btn)=>`<div class="lt-r${on?' on':''}"><i></i><div><b>${name}</b><small>${on?`<span>مضيء</span>${until?' · <span>حتى</span> '+until:''}`:how}</small></div>${on?'<span class="lt-ok">✓</span>':btn}</div>`;
  const rows=row(l.halo,'الهالة',l.p.kind==='sabah'?'تضيء بأذكار الصباح':'تضيء بأذكار المساء',l.p.endName,`<button class="btn small" data-adhkar="${l.p.kind}">اقرأ</button>`)
   +row(l.head,'الرأس','يضيء بورد القرآن',tHM(l.headEnd),'<button class="btn small" data-mshopen="1">المصحف</button>')
   +row(l.heart,'القلب','يضيء بالذكر الشخصي',tHM(l.heartEnd),dl?'<button class="btn small" data-dstart="1">اذكر</button>':'<button class="btn small" data-go="aamal">أضف ذكرًا</button>')
   +row(l.body,'الجسد كله','يضيء بخلوة أو اعتكاف ثلاثين يومًا',fmtD(ds(new Date(l.bodyEnd))),'<button class="btn small" data-go="khalwa">الخلوة</button>');
  return `<section class="ru">
   <div class="ru-hd"><div class="ru-n"><b dir="ltr">${n}<small>/4</small></b><span>أنوار مضيئة</span></div><p>${msg}</p></div>
   <div class="lt-wrap"><div class="figure-box lt-fig">${figureSVG(l)}</div><div class="lt-list">${rows}</div></div>
   <p class="meta ru-foot">تبقى الهالة حتى نهاية الفترة، ويبقى نور الرأس والقلب أربعًا وعشرين ساعة، ونور الجسد كله ثلاثين يومًا.</p></section>`}
let wkHowOpen=false;
function viewWeek(){const W=wkData(),IW=ijWeek(wkOff),IW1=ijWeek(wkOff+1),PN=Object.fromEntries(FIVE),wd=d=>WDAYS[new Date(d+'T12:00:00').getDay()];
  const nav=`<div class="wk-nav"><button class="iconbtn sm" data-wk="1" aria-label="الأسبوع السابق"><svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button><b><span>${fmtD(W.days[0])}</span> – <span>${fmtD(W.E)}</span></b><button class="iconbtn sm nx" data-wk="-1" aria-label="الأسبوع التالي"${wkOff?'':' disabled'}><svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg></button></div>`;
  if(IW.score===null)return `<section class="ru">${nav}<div class="box pad"><p style="margin:0">سجّل أعمالك في «الأعمال» بضعة أيام، وستظهر هنا درجة أسبوعك ونصائح عملية لك.</p><div class="btns"><button class="btn small ok" data-go="aamal">افتح الأعمال</button></div></div></section>`;
  const d=IW1.score===null?null:IW.score-IW1.score,hist=[3,2,1,0].map(o=>ijWeek(wkOff+o).score);
  const okD=IW.ok.length,pr=k=>IW.ok.filter(x=>x.fp[k]==='on'||x.fp[k]==='home').length,ms=k=>IW.ok.filter(x=>x.fp[k]==='on').length;
  const tp=FIVE.reduce((a,[k])=>a+pr(k),0),tm=FIVE.reduce((a,[k])=>a+ms(k),0);
  const hero=`<div class="wk-hero"><div class="wk-sc"><b dir="ltr">${IW.score}</b><small>/100</small></div>
    <div class="wk-ht"><b>درجة أعمالك</b><small>${d===null?'<span>أول أسبوع مسجّل</span>':d>0?`<span class="up">▲ ${d}</span> <span>عن الأسبوع الماضي</span>`:d<0?`<span class="dn">▼ ${-d}</span> <span>عن الأسبوع الماضي</span>`:'<span>مثل الأسبوع الماضي</span>'}</small></div>
    <div class="wk-spark" aria-hidden="true">${hist.map((s,i)=>`<i class="${i===3?'cur':''}"><b style="height:${s===null?0:Math.max(6,s)}%"></b></i>`).join('')}</div>
    <div class="wk-kp"><div><b dir="ltr">${W.pDone}<small>/${W.pDue}</small></b><span>صلوات</span></div><div><b dir="ltr">${tm}<small>/${tp}</small></b><span>في المسجد</span></div><div><b dir="ltr">${W.aw.sabah+W.aw.masa}<small>/14</small></b><span>أذكار</span></div><div><b dir="ltr">${W.mh}<small>/7</small></b><span>محاسبة</span></div></div></div>`;
  const tips=ijTips(IW,IW1).map(t=>`<div class="ij-tip"><b>${t.t}</b>${t.st?`<small class="ij-stat">${t.st}</small>`:''}<p>${t.b}</p>${/^﴿/.test(t.ev)?`<p class="ij-ev notr" dir="rtl" lang="ar">${t.ev}</p>`:`<p class="ij-ev">${t.ev}</p>`}</div>`).join('');
  const nx=wkOff?'':ijNext(IW),fri=new Date().getDay()===5;
  const next=nx?`<div class="ij-next"><small>${fri?'اقتراح الجمعة للأسبوع القادم':'خطوتك القادمة'}</small><b>${nx}</b><p>أضفه وحده من «اختر أعمالك ونوافلك»، وداوم عليه أسبوعًا قبل أن تزيد غيره.</p><button class="btn small" data-go="aamal">افتح الأعمال</button></div>`:'';
  const grid=`<div class="box pad"><div class="ij-pr">${FIVE.map(([k,n])=>`<div><b>${n}</b><span dir="ltr">${pr(k)}/${okD}</span><small>${MSJ}<span dir="ltr">${ms(k)}</span></small></div>`).join('')}</div>
    <div class="wk-grid">${IW.days.map(x=>x?`<div class="wk-r"><span>${wd(x.D)}</span>${FIVE.map(([k])=>`<i class="${x.fp[k]||''}"></i>`).join('')}</div>`:'').join('')}</div>
    <div class="pr-key"><span><i class="g"></i><span>في المسجد</span></span><span><i class="b"></i><span>في غير المسجد</span></span><span><i class="r"></i><span>فاتت</span></span></div></div>`;
  const CL={fard:'الفرائض',nafl:'النوافل',awrad:'الأذكار والأوراد',birr:'أعمال البرّ'},bar=(t,v)=>`<div><span>${t}</span><i><b style="width:${Math.round(v*100)}%"></b></i><em dir="ltr">${Math.round(v*100)}%</em></div>`;
  const P=S.amPick||{aw:[]},deeds=AWRAD.filter(a=>a.id!=='salat'&&P.aw.includes(a.id)).map(a=>{const m=AW_DAY[a.id]!==undefined?1:7;return `<div><span>${a.t}</span><i><b style="width:${Math.min(1,W.aw[a.id]/m)*100}%"></b></i><em dir="ltr">${W.aw[a.id]}/${m}</em></div>`}).join('');
  const comp=`<div class="box pad wk-bars">${Object.keys(IJ_W).filter(k=>IW.comp[k]!==undefined).map(k=>bar(CL[k],IW.comp[k])).join('')}${bar('المداومة',IW.cons)}
    ${deeds?`<details class="wk-more"><summary>كل عمل على حدة</summary><div class="wk-bars">${deeds}</div></details>`:''}</div>`;
  const IT=Object.fromEntries(AWRAD.map(a=>[a.id,a.t])),st=wkOff?[]:IJ_AW.filter(i=>P.aw.includes(i)).map(i=>[i,ijStreak(i)]).filter(x=>x[1]>=2);
  const streaks=st.length?`<div class="sh"><h2>المداومة</h2></div><div class="box pad ij-st">${st.map(([i,s])=>`<div><b>${IT[i]}</b><span><span>داومت عليه</span> ${s} <span>${s>10||s<3?'يومًا متتاليًا':'أيام متتالية'}</span></span></div>`).join('')}</div>`:'';
  const org=W.org.length?`<div class="sh"><h2>الجوارح</h2></div><div class="box pad">${W.org.map(x=>`<div class="wk-o"><b>${x.g.name}</b><span class="pill p-${x.o.phase}">${x.o.phase==='done'?'مكتملة':PHASE[x.o.phase]}</span><span class="meta">${x.n?'<span>زلّات الأسبوع:</span> '+x.n:'بلا زلّات هذا الأسبوع ✓'}</span></div>`).join('')}</div>`:'';
  const sl=W.sl.length&&W.top.length?`<div class="sh"><h2>أسباب الزلّات</h2><span>${W.sl.length}</span></div><div class="box pad">${W.top.map(([t,n])=>`<div class="wk-o"><b>${t}</b><span class="meta">${n}</span></div>`).join('')}</div>`:'';
  const mins=[50,60,70,80].map(v=>`<button class="${(S.ijMin||60)===v?'on':''}" data-ijmin="${v}">${v}</button>`).join('');
  return `<section class="ru ij" id="ijSec">${nav}${hero}
   <div class="sh"><h2>${wkOff?'نصائح ذلك الأسبوع':'نصائح لك'}</h2></div><div class="ij-tips">${tips}${next}</div>
   <div class="sh"><h2>الصلوات المفروضة</h2><span dir="ltr">${W.pDue?Math.round(W.pDone/W.pDue*100):0}%</span></div>${grid}
   <div class="sh"><h2>تفصيل الأعمال</h2></div>${comp}
   ${streaks}${org}${sl}
   <details class="box pad wk-how"${wkHowOpen?' open':''}><summary>كيف تُحسب الدرجة؟</summary><p><span>الفرائض 40%: في المسجد نقطة كاملة، وفي غيره 0.7. النوافل 20%: كل الركعات 1، وبعضها 0.5. الأذكار والأوراد 20%. أعمال البرّ 10%. والمداومة 10%. ولا يُحسب من اليوم إلا ما دخل وقته.</span></p><div class="ij-set"><span>يُحسب اليوم «مداومًا» إذا بلغت درجته:</span><div class="ij-mins" dir="ltr">${mins}</div></div></details>
   <p class="meta ij-note">هذه مرآة لحالك بينك وبين ربك، لا يراها غيرك ولا تُقارَن بأحد. العبرة بالقبول لا بالعدد، فاسأل الله القبول، ولا تجعلها سببًا للعُجب ولا لليأس.</p>
   <div class="btns" style="justify-content:center;margin-top:4px"><button class="btn" data-wkshare="1">مشاركة التقرير</button></div></section>`}
function viewRuhi(){const t=RUHI_TABS.some(x=>x[0]===ruhiTab)?ruhiTab:'muraqabat';
  return ruhiTabs(t)+VIEWS[t]()}
