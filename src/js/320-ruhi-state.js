/* ---------- your spiritual data: daily state, heart, slip analysis ---------- */
let ruhiTab='muraqabat';
const RUHI_TABS=[['muraqabat','الحالة اليومية'],['sura','حالة القلب'],['tahlil','تحليل الزلّات'],['week','الأسبوع']];
let wkOff=0;
function wkData(){const E=addDays(TODAY,-7*wkOff),days=Array.from({length:7},(_,i)=>addDays(E,i-6));
  const now=new Date(),h=now.getHours()+now.getMinutes()/60,pt=prayerTimes(now);
  let pDone=0,pDue=0;const grid=days.map(D=>{const L=S.log[D]||{},pr=L.prayers||[];return FIVE.map(([k])=>{const on=pr.includes(k),due=D<TODAY||(D===TODAY&&h>=pt[k])||on;if(due)pDue++;if(on)pDone++;return on?'on':due?'late':''})});
  const aw={};AWRAD.forEach(a=>aw[a.id]=days.filter(D=>((S.log[D]||{}).awrad||[]).includes(a.id)).length);
  const sl=allSlips().filter(x=>x.date>=days[0]&&x.date<=E&&x.reason!=='انقطاع: يوم لم يُسجَّل');
  const cats={};sl.forEach(x=>slipCats(x.reason).forEach(c=>cats[c.t]=(cats[c.t]||0)+1));
  const top=Object.entries(cats).sort((a,b)=>b[1]-a[1]).slice(0,3);
  const mh=days.filter(D=>mhOn(D)).length;
  const org=ORGANS.filter(g=>S.organs[g.id].phase!=='idle').map(g=>({g,o:S.organs[g.id],n:sl.filter(x=>x.oid===g.id).length}));
  return {days,E,grid,pDone,pDue,aw,sl,top,mh,org}}
function wkShare(){const W=wkData(),c=RTL()?'، ':', ',lines=[Tx('تقريري الأسبوعي في «المرشد»'),fmtD(W.days[0])+' – '+fmtD(W.E),Tx('الصلوات المسجّلة:')+' '+W.pDone+'/'+W.pDue,Tx('أذكار الصباح:')+' '+W.aw.sabah+'/7 · '+Tx('أذكار المساء:')+' '+W.aw.masa+'/7',Tx('ورد القرآن:')+' '+W.aw.quran+'/7 · '+Tx('قيام الليل:')+' '+W.aw.qiyam+'/7',Tx('ليالي المحاسبة:')+' '+W.mh+'/7',...W.org.map(x=>Tx(x.g.name)+': '+(x.o.phase==='done'?Tx('مكتملة'):Tx(PHASE[x.o.phase])+' '+x.o.days+'/30')+(x.n?' · '+Tx('زلّات:')+' '+x.n:'')),...(W.top.length?[Tx('أكثر أسباب الزلّات:')+' '+W.top.map(t=>Tx(t[0])).join(c)]:[])];
  const text=lines.join('\n');
  if(navigator.share)navigator.share({text}).catch(()=>{});else{try{navigator.clipboard.writeText(text);alert(Tx('نُسخ التقرير.'))}catch(e){}}}
