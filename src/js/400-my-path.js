/* ---------- my path: the roadmap as a living programme ---------- */
function pathMan(){S.path=S.path||{};S.path.man=S.path.man||{};return S.path.man}
const lastDays=n=>{const o=[];for(let i=0;i<n;i++)o.push(addDays(TODAY,-i));return o};
function pathData(){const a=auSt(),v=vdSt(),man=pathMan(),M=S.marks||{};
  const aqI=((auCat||[]).find(g=>g.k===AQ_K)||{items:[]}).items,aqN=aqI.length||32,aqD=aqI.filter(x=>a.done[x.p]).length;
  const fqL=vdList(FQ_K),fqN=fqL.length||3,fqD=fqL.filter(p=>v.done[p]).length;
  const mh=(()=>{const s=new Set(Object.keys(mhState()).filter(d=>mhState()[d]&&mhState()[d].saved));Object.keys(S.qm||{}).forEach(d=>{if(mhOn(d))s.add(d)});return s.size})();
  const full5=d=>((S.log[d]||{}).prayers||[]).length>=5;
  const muj=lastDays(40).filter(full5).length;
  const org=ORGANS.filter(g=>{const o=S.organs[g.id];return o&&(o.phase==='tanwir'||o.phase==='done'||(o.phase==='tathir'&&(o.ready||o.parked)))}).length;
  const Q=qb(),qn=(Q.hist||[]).length,qcur=!!Q.cur;
  const dk=new Set((M.dhikr||[]).map(t=>ds(new Date(t)))).size,kh=(M.khalwa||[]).length;
  const st=(id,t,n,goal,go,hint,auto)=>{const m=!!man[id],v=Math.min(n,goal);return{id,t,n:v,goal,go,hint,done:m||(auto!==false&&n>=goal),man:m,auto:auto!==false}};
  const L40=lastDays(40),lg=d=>S.log[d]||{},hasA=(d,ids)=>ids.some(i=>(lg(d).awrad||[]).includes(i));
  const kh14=lastDays(14).flatMap(d=>Object.values(lg(d).khs||{})).filter(x=>x&&x.h),khA=kh14.length?kh14.reduce((s,x)=>s+x.h,0)/kh14.length/5*Math.min(1,kh14.length/10):0;
  const I={g1:Math.min(1,L40.filter(full5).length/36),
    g2:Math.min(1,L40.filter(d=>Object.values(lg(d).nafl||{}).some(Boolean)||hasA(d,['qiyam','sawm_mon','sawm_thu'])).length/20),
    g3:Math.min(1,L40.filter(d=>hasA(d,['sadaqa','help'])).length/12),
    g4:Math.min(1,.5*khA+.5*Math.min(1,L40.filter(d=>hasA(d,['dhikr'])).length/30))};
  const E=S.endorse||{},gst=(id,t,ind,go,hint)=>{const m=!!man[id],sh=!!E[id];return{id,t,n:Math.round(ind*100),goal:100,go,hint,done:sh||(m&&ind>=.5),man:m,auto:false,ind,sh,weak:m&&!sh&&ind<.5}};
  return [
   {k:'c',t:'جبل الشروط الأربعة',sub:'الأساس الذي يقوم عليه السلوك',steps:[
     st('aqida','العقيدة',aqD,aqN,'aqida','استمع إلى دروس العقيدة الأشعرية كلها.'),
     st('fiqh','الفقه',fqD,fqN,'fiqh','شاهد دروس الفقه المالكي، وتعلّم ما تصح به عبادتك.'),
     st('tawba','التوبة',mh,7,'tawba','حاسب نفسك قبل النوم سبع ليالٍ، وجدّد التوبة من كل زلة.'),
     st('mujahada','المجاهدة',muj,30,'mujahada','حافظ على الصلوات الخمس ثلاثين يومًا (من آخر أربعين يومًا).')]},
   {k:'b',t:'جسر التزكية',sub:'العبور من العادة إلى الحضور',steps:[
     st('jawarih','تزكية الجوارح',org,3,'tazkiya','أتمّ مرحلة التطهير في ثلاث جوارح على الأقل.'),
     st('aql','تزكية العقل',(S.aqlT&&S.aqlT.done||[]).length,10,'aql','أتمّ المستويات العشرة لتزكية العقل، ثلاثين يومًا متتالية لكل مستوى.'),
     st('nafs','تزكية القلب والروح',AHD.reduce((n,a)=>n+Math.min(trS(a.id).done.length,a.lv.length),0),AHD.reduce((n,a)=>n+a.lv.length,0),'qalbruh','أتمّ درجات العهود السماوية: الإخلاص والتواضع والشكر والتوبة، ثلاثين يومًا متتالية لكل درجة.')]},
   {k:'g',t:'جبل الأهداف الأربعة',sub:'ثمرات الطريق، تُعرف بعلاماتها',steps:[
     gst('g1','التعظيم لأمر الله',I.g1,'g1','علامته: المبادرة إلى الفرائض في أوقاتها، والوقوف عند الحدود.'),
     gst('g2','التعظيم لأمر رسول الله ﷺ',I.g2,'g2','علامته: الحرص على السنن والنوافل، والصلاة عليه ﷺ.'),
     gst('g3','الشفقة على الخلق',I.g3,'g3','علامته: الصدقة، وقضاء الحوائج، والكلمة الطيبة.'),
     gst('g4','الحضور مع الله',I.g4,'g4','علامته: الذكر بالقلب في كل حال، ومراقبة الله.')]}]}
function pathWhere(P){for(const g of P)for(const x of g.steps)if(!x.done)return{g,x};return null}
function pathPlan(P){const w=pathWhere(P),out=[],L7=lastDays(7);
  const miss5=L7.filter(d=>d!==TODAY&&((S.log[d]||{}).prayers||[]).length<5).length;
  if(miss5>=2)out.push({t:'حافظ على الصلوات الخمس كل يوم',s:`<span>فاتك تمامها في</span> ${miss5} <span>من آخر 7 أيام</span>`,go:'aamal'});
  if(w){const x=w.x;
    if(x.id==='aqida'||x.id==='fiqh'){const items=x.id==='aqida'?(((auCat||[]).find(g=>g.k===AQ_K)||{items:[]}).items.filter(i=>!auSt().done[i.p]).slice(0,2).map(i=>i.t)):vdList(FQ_K).filter(p=>!vdSt().done[p]).slice(0,2).map(vdTitle);
      out.push({t:x.id==='aqida'?'استمع إلى درسين من العقيدة':'شاهد درسًا من الفقه',s:items.length?'<span class="notr" dir="rtl">'+items.map(esc).join(' · ')+'</span>':'',go:x.go})}
    else if(x.id==='tawba')out.push({t:'حاسب نفسك قبل النوم أربع ليالٍ هذا الأسبوع',s:'دقيقتان مع النفس، وتوبة من كل زلة',go:'muhasaba'});
    else if(x.id==='mujahada')out.push({t:'لا تؤخّر صلاة عن وقتها',s:'وصلّ ما استطعت منها في المسجد',go:'aamal'});
    else if(x.id==='jawarih')out.push({t:'ركّز هذا الأسبوع على جارحة واحدة',s:'ابدأ تطهيرها أو أكمله في «التزكية»',go:'tazkiya'});
    else if(x.id==='aql')out.push({t:`<span>تدرّب على المستوى</span> ${aqT().lvl} <span>من تزكية العقل</span>`,s:AQL_LV[aqT().lvl-1],go:'aql'});
    else if(x.id==='nafs'){const a=AHD.find(z=>z.id===ahdCur());out.push({t:`<span>تدرّب على الدرجة</span> ${trS(a.id).lvl} <span>من عهد</span> <span>${a.n}</span>`,s:'ثلاثون يومًا متتالية لكل درجة',go:'qalbruh'})}
    else out.push({t:'راقب في نفسك علامة: '+x.t,s:x.hint,go:x.go})}
  const ad=L7.filter(d=>d!==TODAY&&!((S.log[d]||{}).awrad||[]).includes('sabah')).length;
  if(ad>=3)out.push({t:'أذكار الصباح بعد صلاة الفجر',s:`<span>فاتتك في</span> ${ad} <span>من آخر 7 أيام</span>`,go:'adh_sabah'});
  if(out.length<3)out.push({t:'عمل من أعمال الشفقة على الخلق',s:'صدقة، أو مساعدة شخص، أو صلة رحم',go:'aamal'});
  return out.slice(0,4)}
function pathPct(P){let a=0,b=0;P.forEach(g=>g.steps.forEach(x=>{a+=x.done?1:Math.min(1,x.n/x.goal)*.99;b++}));return Math.round(100*a/b)}
function pathHomeCard(){const P=pathData(),w=pathWhere(P),pc=pathPct(P);
  return `<button class="box pth-home" data-go="path"><span class="pth-hi"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19c3-1 4-5 8-6s5-5 8-8"/><circle cx="4" cy="19" r="1.8"/><circle cx="20" cy="5" r="1.8"/></svg></span>
   <span class="pth-ht"><small>مساري</small><b>${w?`<span>${w.g.t}</span> ← <span>${w.x.t}</span>`:'بلغت آخر الخريطة، فاثبت'}</b><i class="pth-bar"><i style="width:${pc}%"></i></i></span><span class="pth-pc notr" dir="ltr">${pc}%</span></button>`}
function viewPath(){const P=pathData(),w=pathWhere(P),plan=pathPlan(P),pc=pathPct(P);endLoad();setTimeout(()=>rmAnim(),90);
  const step=x=>`<li class="pth-s${x.done?' ok':''}${w&&w.x===x?' cur':''}"><span class="pth-i">${x.done?'✓':''}</span><div class="pth-b"><div class="pth-r"><b>${x.t}</b>${x.auto?`<span class="pth-n notr" dir="ltr">${x.n} / ${x.goal}</span>`:''}</div>
    ${w&&w.x===x?'':`<p class="meta">${x.hint}</p>`}${rmInfo(x,w&&w.x===x)}${x.ind!=null?`<div class="pth-ind"><small>مؤشّر العلامة من أعمالك</small><span class="notr" dir="ltr">${Math.round(x.ind*100)}%</span><i class="pth-bar"><i style="width:${Math.round(x.ind*100)}%"></i></i></div>${x.sh?'<p class="pth-sh">✓ أكّدها الشيخ</p>':x.weak?'<p class="meta pth-weak">تحتاج هذه العلامة إلى ثبات في أعمالك حتى تُحتسب.</p>':''}`:''}${x.auto?`<i class="pth-bar"><i style="width:${Math.round(100*x.n/x.goal)}%"></i></i>`:''}
    <div class="btns"><button class="btn small" data-go="${x.go}">افتح</button>${x.auto?'':`<button class="btn small${x.man?' ok':''}" data-pathman="${x.id}">${x.man?'✓ سجّلته':(P[2].steps.includes(x)?'أجد هذا في نفسي':'سجّلت أني أتممته')}</button>`}</div></div></li>`;
  return `<section class="pth"><div class="rm-img rm-mini"><button class="rm-imgb" data-go="roadmap" aria-label="${esc(Tx('اعرض الخريطة'))}"><img src="roadmap2-s.webp" alt="" width="836" height="470" decoding="async"></button>${rmLayer(P,1)}</div><div class="box pad pth-top"><small>أين أنا الآن؟</small><h2>${w?`<span>${w.g.t}</span> ← <span>${w.x.t}</span>`:'بلغت آخر الخريطة'}</h2>
    <i class="pth-bar big"><i style="width:${pc}%"></i></i><p class="meta"><span>تقدّمك في الطريق</span> <span class="notr" dir="ltr">${pc}%</span> ${hintBtn('road')} · <button class="lnk" data-go="roadmap">اعرض الخريطة</button></p></div>
   <div class="sh" style="margin:18px 2px 10px"><h2>خطة هذا الأسبوع</h2></div>
   <div class="box pth-plan">${plan.map(x=>`<button class="pth-p" data-go="${x.go}"><b>${x.t}</b>${x.s?`<small>${x.s}</small>`:''}<svg class="h2-chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg></button>`).join('')}</div>
   ${P.map((g,i)=>`<div class="sh" style="margin:22px 2px 8px"><h2><span class="pth-gn">${i+1}</span> ${g.t}</h2><span dir="ltr" class="notr">${g.steps.filter(x=>x.done).length} / ${g.steps.length}</span></div><p class="meta" style="margin:-4px 4px 8px">${g.sub}</p><ol class="pth-st">${g.steps.map(step).join('')}</ol>`).join('')}
   <p class="meta" style="margin-top:14px">يُحسب التقدّم من دروسك ومحاسبتك وصلواتك وجوارحك تلقائيًا. الخطوات التي لا تُقاس تسجّلها أنت بصدق بينك وبين الله. المسار للتوجيه لا للحكم على الأحوال، فاستشر شيخك في كل مرحلة.</p></section>`}
