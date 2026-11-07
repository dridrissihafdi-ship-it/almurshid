/* ---------- «مرآة الاجتهاد»: a private weekly mirror of the seeker's effort ---------- */
const IJ_W={fard:40,nafl:20,awrad:20,birr:10};
const IJ_AW=['sabah','masa','quran','dhikr','qiyam'],IJ_BIRR=['sadaqa','help','sawm_mon','sawm_thu'];
function ijFirst(){const ks=Object.keys(S.log||{}).filter(k=>/^\d{4}-\d\d-\d\d$/.test(k)).sort();return ks[0]||TODAY}
function ijDay(D){const L=S.log[D];const first=ijFirst();if(D<first||D>TODAY)return null;
  const Lx=L||{awrad:[],prayers:[]},today=D===TODAY,h=today?dH():99,pt=prayerTimes(new Date(D+'T12:00:00'));
  const P=Lx.pick||S.amPick||{aw:AW_PICK.slice(),nf:['raghiba','witr']},pr=Lx.prayers||[],ms=Lx.masjid||[],aw=Lx.awrad||[],N=Lx.nafl||{};
  const C={};
  // obligatory prayers
  let fs=0,fd=0;const fp={};FIVE.forEach(([k])=>{const on=pr.includes(k),due=!today||h>=pt[k];if(!on&&!due){fp[k]='';return}fd++;const v=on?(ms.includes(k)?1:.7):0;fs+=v;fp[k]=on?(ms.includes(k)?'on':'home'):'late'});
  if(fd)C.fard=fs/fd;
  // voluntary prayers
  let ns=0,nd=0;const nf={};naflDefs(pt).filter(x=>P.nf.includes(x.id)).forEach(x=>{const n=N[x.id]||0,due=!today||h>=(x.e||x.w[1]);if(!n&&!due)return;nd++;const v=n?(nfFull(x,n)?1:.5):0;ns+=v;nf[x.id]=n?(nfFull(x,n)?'full':'part'):'miss'});
  if(nd)C.nafl=ns/nd;
  // adhkar & awrad
  let as=0,ad=0;IJ_AW.filter(i=>P.aw.includes(i)).forEach(i=>{const on=aw.includes(i),due=!today||(i==='sabah'&&h>=pt.maghrib);if(!on&&!due)return;ad++;if(on)as++});
  if(ad)C.awrad=as/ad;
  // deeds of righteousness
  let bs=0,bd=0;IJ_BIRR.filter(i=>P.aw.includes(i)&&awDayOk(i,D)).forEach(i=>{const on=aw.includes(i),due=!today||(/^sawm/.test(i)&&h>=pt.maghrib);if(!on&&!due)return;bd++;if(on)bs++});
  if(bd)C.birr=bs/bd;
  const ks=Object.keys(C);let w=0,v=0;ks.forEach(k=>{w+=IJ_W[k];v+=IJ_W[k]*C[k]});
  return {D,C,score:w?Math.round(v/w*100):null,fp,nf,aw,P,today,hasLog:!!L}}
function ijWeek(off){const E=addDays(TODAY,-7*off),days=Array.from({length:7},(_,i)=>addDays(E,i-6)).map(ijDay);
  const ok=days.filter(d=>d&&d.score!==null);if(!ok.length)return {days,score:null,ok};
  const min=S.ijMin||60,mean=ok.reduce((a,d)=>a+d.score,0)/ok.length,cons=ok.filter(d=>d.score>=min).length/ok.length;
  const comp={};Object.keys(IJ_W).forEach(k=>{const xs=ok.filter(d=>d.C[k]!==undefined);if(xs.length)comp[k]=xs.reduce((a,d)=>a+d.C[k],0)/xs.length});
  return {days,ok,score:Math.round(mean*.9+cons*10),cons,comp,E}}
function ijStreak(id){let n=0,D=TODAY;const L0=S.log[TODAY];if(!(L0&&(L0.awrad||[]).includes(id)))D=addDays(D,-1);
  while(n<400){const L=S.log[D];if(L&&(L.awrad||[]).includes(id)){n++;D=addDays(D,-1)}else break}return n}
function ijTips(W,W1){const T=[],ds_=W.ok,cnt=(f)=>ds_.filter(f).length,PN=Object.fromEntries(FIVE),n=ds_.length;
  const miss=k=>cnt(d=>d.fp[k]==='late'),prayed=k=>cnt(d=>d.fp[k]==='on'||d.fp[k]==='home'),msj=k=>cnt(d=>d.fp[k]==='on');
  const tot=FIVE.reduce((a,[k])=>a+prayed(k),0),totM=FIVE.reduce((a,[k])=>a+msj(k),0);
  if(miss('fajr')>=2)T.push({k:'fajr',t:'صلاة الصبح تفوتك',st:`<span>فاتتك</span> ${miss('fajr')} <span>من</span> ${n}`,b:'نَم بعد العشاء بساعتين، وتوضّأ قبل النوم، واجعل المنبّه بعيدًا عن سريرك حتى تقوم إليه.',ev:'«مَن صلّى البَرْدَيْن دخل الجنة» (رواه البخاري)'});
  const wk=FIVE.filter(([k])=>k!=='fajr').map(([k])=>[k,miss(k)]).sort((a,b)=>b[1]-a[1])[0];
  if(wk&&wk[1]>=2)T.push({k:'slot',t:`<span>أضعف صلاة عندك:</span> ${PN[wk[0]]}`,st:`<span>فاتتك</span> ${wk[1]} <span>من</span> ${n}`,b:'اضبط تذكيرًا عند دخول وقتها، واترك ما في يدك عند الأذان؛ فأول الوقت أيسر من آخره.',ev:'«أحبّ الأعمال إلى الله الصلاة على وقتها» (متفق عليه)'});
  if(tot>=5&&totM/tot<.4){const best=FIVE.map(([k])=>[k,prayed(k)-msj(k)]).sort((a,b)=>b[1]-a[1])[0][0];
    T.push({k:'masjid',t:'الصلاة في المسجد قليلة',st:`<span>في المسجد:</span> ${totM} <span>من</span> ${tot}`,b:`<span>ابدأ هذا الأسبوع بصلاة واحدة في المسجد:</span> ${PN[best]}<span>، ثم أضف إليها غيرها حين تثبت.</span>`,ev:'«صلاة الجماعة تفضُل صلاة الفذّ بسبعٍ وعشرين درجة» (متفق عليه)'})}
  const NT=Object.fromEntries(naflDefs(prayerTimes(new Date())).map(x=>[x.id,x.t]));
  const part=NAFL_IDS.map(id=>[id,cnt(d=>d.nf[id]==='part')]).sort((a,b)=>b[1]-a[1])[0];
  if(part&&part[1]>=2)T.push({k:'nafl',t:`<span>نافلة تؤدّي بعضها:</span> ${NT[part[0]]}`,st:`<span>أدّيت بعضها</span> ${part[1]} <span>من</span> ${n}`,b:'زِد ركعتين فقط في هذه النافلة، ولا تزد غيرها حتى تثبت عليها أسبوعًا.',ev:'«أحبّ الأعمال إلى الله أدومها وإن قلّ» (متفق عليه)'});
  const P=(ds_[ds_.length-1]||{}).P||S.amPick||{aw:[]};
  const sm=cnt(d=>d.P.aw.includes('sabah')&&!d.today&&!d.aw.includes('sabah'));
  if(sm>=3)T.push({k:'sabah',t:'أذكار الصباح تفوتك',st:`<span>فاتتك</span> ${sm} <span>من</span> ${n}`,b:'اربطها بعادة ثابتة: اجلس بعد صلاة الصبح في مكانك واقرأها قبل أن تمسك هاتفك.',ev:'﴿فَسُبْحَانَ اللَّهِ حِينَ تُمْسُونَ وَحِينَ تُصْبِحُونَ﴾'});
  const brk=IJ_AW.filter(i=>P.aw.includes(i)).find(i=>{const s=ijStreak(i);if(s)return false;let r=0,D=addDays(TODAY,-2);while(r<30){const L=S.log[D];if(L&&(L.awrad||[]).includes(i)){r++;D=addDays(D,-1)}else break}return r>=3});
  if(brk){const IT=Object.fromEntries(AWRAD.map(a=>[a.id,a.t]));T.push({k:'back',t:`<span>انقطعت عن:</span> ${IT[brk]}`,st:'',b:'لا تيأس ولا تحاسب نفسك على ما فات؛ العبرة بالرجوع. ابدأ اليوم ولو بقليل منه.',ev:'﴿وَتُوبُوا إِلَى اللَّهِ جَمِيعًا أَيُّهَ الْمُؤْمِنُونَ لَعَلَّكُمْ تُفْلِحُونَ﴾'})}
  if(P.aw.includes('sadaqa')&&cnt(d=>d.aw.includes('sadaqa'))<=1&&n>=4)T.push({k:'sadaqa',t:'الصدقة قليلة هذا الأسبوع',st:'',b:'خصّص مبلغًا صغيرًا ثابتًا كل يوم، ولو درهمًا، وضعه في صندوق أو في جيبك صباحًا لتتصدّق به.',ev:'«اتّقوا النار ولو بشقّ تمرة» (متفق عليه)'});
  const over=cnt(d=>d.aw.includes('qiyam'))>=7&&W.score>=95;
  if(over)T.push({k:'over',t:'أحسنت، فاحفظ الاعتدال',st:'',b:'لا تُثقل على نفسك حتى تملّ؛ أعطِ بدنك وأهلك حقّهم، فالدوام على القليل خير من كثير ينقطع.',ev:'«إنّ لبدنك عليك حقًّا» (رواه البخاري)'});
  if(!T.length&&W.score>=80)T.push({k:'good',t:'أسبوع طيّب',st:'',b:'ثبّت ما أنت عليه ولا تُكثر فجأة، واسأل الله القبول؛ فالعبرة بالقبول لا بالعدد.',ev:'«أحبّ الأعمال إلى الله أدومها وإن قلّ» (متفق عليه)'});
  if(!T.length)T.push({k:'start',t:'ابدأ بخطوة واحدة',st:'',b:'اختر عملًا واحدًا فقط وداوم عليه هذا الأسبوع، ولا تحمّل نفسك أكثر من طاقتها.',ev:'﴿لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا﴾'});
  return T.slice(0,3)}
function ijNext(W){const P=(W.ok[W.ok.length-1]||{}).P||S.amPick||{aw:[],nf:[]},NT=Object.fromEntries(naflDefs(prayerTimes(new Date())).map(x=>[x.id,x.t])),IT=Object.fromEntries(AWRAD.map(a=>[a.id,a.t]));
  const part=NAFL_IDS.find(id=>P.nf.includes(id)&&W.ok.filter(d=>d.nf[id]==='part').length>=3);
  if(part)return `<span>أكمِل ركعات</span> ${NT[part]}`;
  const LAD=[['nf','duha'],['nf','bmaghrib'],['aw','qiyam'],['nf','qdhuhr'],['aw','quran'],['nf','bisha'],['aw','dhikr'],['aw','sadaqa'],['aw','help']];
  const x=LAD.find(([k,id])=>!(P[k]||[]).includes(id));
  return x?(x[0]==='nf'?NT[x[1]]:IT[x[1]]):'';}
function viewIjtihad(){const W=ijWeek(0),W1=ijWeek(1),PN=Object.fromEntries(FIVE);
  if(W.score===null)return `<div class="box pad"><p>سجّل أعمالك في «الأعمال» بضعة أيام، وستظهر هنا مرآة اجتهادك ونصائح عملية لك.</p></div>`;
  const d=W1.score===null?null:W.score-W1.score;
  const hist=[3,2,1,0].map(o=>[o,ijWeek(o).score]);
  const bars=`<div class="ij-hist">${hist.map(([o,s])=>`<div><i><b style="height:${s===null?0:Math.max(4,s)}%"></b></i><span>${s===null?'–':s}</span><small>${o===0?'<span>هذا الأسبوع</span>':o===1?'<span>الماضي</span>':'−'+o}</small></div>`).join('')}</div>`;
  const CL={fard:'الفرائض',nafl:'النوافل',awrad:'الأذكار والأوراد',birr:'أعمال البرّ'};
  const comp=`<div class="box pad wk-bars">${Object.keys(IJ_W).filter(k=>W.comp[k]!==undefined).map(k=>`<div><span>${CL[k]}</span><i><b style="width:${Math.round(W.comp[k]*100)}%"></b></i><em>${Math.round(W.comp[k]*100)}%</em></div>`).join('')}<div><span>المداومة</span><i><b style="width:${Math.round(W.cons*100)}%"></b></i><em>${Math.round(W.cons*100)}%</em></div></div>`;
  const grid=`<div class="box pad wk-grid"><div class="wk-h"><span></span>${FIVE.map(([,n])=>`<span>${n}</span>`).join('')}</div>${W.days.map(x=>x?`<div class="wk-r"><span>${WDAYS[new Date(x.D+'T12:00:00').getDay()]}</span>${FIVE.map(([k])=>`<i class="${x.fp[k]||''}"></i>`).join('')}</div>`:'').join('')}
    <div class="pr-key"><span><i class="g"></i><span>في المسجد</span></span><span><i class="b"></i><span>في غير المسجد</span></span><span><i class="r"></i><span>فاتت</span></span></div></div>`;
  const pr=`<div class="box pad ij-pr">${FIVE.map(([k,n])=>{const p=W.ok.filter(x=>x.fp[k]==='on'||x.fp[k]==='home').length,m=W.ok.filter(x=>x.fp[k]==='on').length;return `<div><b>${n}</b><span dir="ltr">${p}/${W.ok.length}</span><small><span>المسجد</span> <span dir="ltr">${m}</span></small></div>`}).join('')}</div>`;
  const P=S.amPick||{aw:[]},IT=Object.fromEntries(AWRAD.map(a=>[a.id,a.t]));
  const st=IJ_AW.filter(i=>P.aw.includes(i)).map(i=>[i,ijStreak(i)]).filter(x=>x[1]>=2);
  const streaks=st.length?`<div class="box pad ij-st">${st.map(([i,s])=>`<div><b>${IT[i]}</b><span><span>داومت عليه</span> ${s} <span>${s>10||s<3?'يومًا متتاليًا':'أيام متتالية'}</span></span></div>`).join('')}</div>`:'';
  const tips=ijTips(W,W1).map(t=>`<div class="box pad ij-tip"><b>${t.t}</b>${t.st?`<small class="ij-stat">${t.st}</small>`:''}<p>${t.b}</p>${/^﴿/.test(t.ev)?`<p class="ij-ev notr" dir="rtl" lang="ar">${t.ev}</p>`:`<p class="ij-ev">${t.ev}</p>`}</div>`).join('');
  const nx=ijNext(W),fri=new Date().getDay()===5;
  const next=nx?`<div class="box pad ij-next${fri?' fri':''}"><small>${fri?'اقتراح الجمعة للأسبوع القادم':'اقتراح لخطوتك القادمة'}</small><b>${nx}</b><p>أضف هذا العمل وحده من «اختر أعمالك ونوافلك»، وداوم عليه أسبوعًا قبل أن تزيد غيره؛ فالتدرّج والاستمرار من أصول المنهج.</p><button class="btn small" data-go="aamal">افتح الأعمال</button></div>`:'';
  const mins=[50,60,70,80].map(v=>`<button class="${(S.ijMin||60)===v?'on':''}" data-ijmin="${v}">${v}</button>`).join('');
  return `<section class="ij">
   <div class="box pad ij-top"><div class="ij-big"><b>${W.score}</b><small>/100</small></div><div><b>درجة أعمالك هذا الأسبوع</b><small>${d===null?'<span>آخر سبعة أيام</span>':d>0?`<span class="up">▲ ${d}</span> <span>عن الأسبوع الماضي</span>`:d<0?`<span class="dn">▼ ${-d}</span> <span>عن الأسبوع الماضي</span>`:'<span>مثل الأسبوع الماضي</span>'}</small></div></div>
   ${bars}
   <div class="sh"><h2>نصائح لك هذا الأسبوع</h2></div>${tips}${next}
   <div class="sh"><h2>تفصيل الأسبوع</h2></div>${comp}
   <div class="sh"><h2>الصلوات المفروضة</h2></div>${pr}${grid}
   ${streaks?`<div class="sh"><h2>المداومة</h2></div>${streaks}`:''}
   <div class="box pad ij-set"><span>يُحسب اليوم «مداومًا» إذا بلغت درجته:</span><div class="ij-mins" dir="ltr">${mins}</div></div>
   <p class="meta ij-note">هذه مرآة لحالك بينك وبين ربك، لا يراها غيرك ولا تُقارَن بأحد. العبرة بالقبول لا بالعدد، فاسأل الله القبول، ولا تجعلها سببًا للعُجب ولا لليأس.</p>
   <p class="meta ij-how"><span>كيف تُحسب؟</span> <span>الفرائض 40%: في المسجد نقطة كاملة، وفي غيره 0.7. النوافل 20%: كل الركعات 1، وبعضها 0.5. الأذكار والأوراد 20%. أعمال البرّ 10%. والمداومة 10%. ولا يُحسب من اليوم إلا ما دخل وقته.</span></p>
  </section>`}

