/* ---------- slip analysis ---------- */
const SLIP_CATS=[
 {id:'majlis',t:'المجالس والصحبة',w:['مجلس','مجالس','جلسه','جلسة','اصدقاء','اصحاب','صديق','زملاء','زميل','صحبه','رفقه','رفاق','friends','amis']},
 {id:'ghadab',t:'الغضب والانفعال',w:['غضب','غضبت','انفعال','انفعلت','عصبي','نرفز','نقاش','جدال','خصام','شجار','anger','colere','colère']},
 {id:'hatif',t:'الهاتف والشاشات',w:['هاتف','الهاتف','جوال','تلفون','انترنت','نت','فيديو','يوتيوب','تيك','انستغرام','انستا','فيسبوك','تلفاز','شاشه','مواقع','phone','telephone','téléphone','instagram','tiktok','youtube']},
 {id:'sahar',t:'السهر والتعب',w:['سهر','سهرت','تعب','تعبت','متعب','ارهاق','نعاس','نوم','نمت','tired','fatigue']},
 {id:'ghafla',t:'الغفلة والانشغال',w:['غفله','غفلت','نسيت','نسيان','سهوت','انشغلت','انشغال','شغلني','تكاسل','كسل','forgot','oubli']},
 {id:'amal',t:'العمل والضغط',w:['عمل','العمل','شغل','الشغل','ضغط','دوام','مكتب','عياده','العياده','زبون','زبائن','مريض','work','travail']},
 {id:'bayt',t:'البيت والأهل',w:['البيت','المنزل','اهل','اهلي','زوجتي','زوجي','زوجه','الاولاد','اولادي','ابنائي','عائله','والدي','امي','ابي','family','famille']},
 {id:'kalam',t:'كثرة الكلام والفضول',w:['تكلمت','كلام','ثرثره','فضول','يعنيني','مزاح','مزحت','خضت']},
 {id:'tahawun',t:'التهاون واستصغار الذنب',w:['هينه','هين','صغيره','بسيطه','تهاون','تهاونت','تهرب','استصغرت','ظننتها']},
 {id:'hayaa',t:'المجاملة والحرج',w:['مجامله','جاملت','حرج','احرجت','خجل','خجلت','حياء','خوف','خفت']}
];
const normAr=s=>String(s||'').toLowerCase().replace(/[ً-ٰٟـ]/g,'').replace(/[أإآ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي');
function allSlips(){const out=[];
  ORGANS.forEach(g=>(S.organs[g.id].slips||[]).forEach(s=>out.push({date:s.date,org:g.name,oid:g.id,reason:s.reason||''})));
  const P=prepState();Object.keys(P.log||{}).forEach(d=>PREP.forEach(x=>{if(P.log[d][x.id]==='fail')out.push({date:d,org:'المرحلة التمهيدية',oid:'prep',reason:((P.log[d].notes||{})[x.id])||''})}));
  return out.sort((a,b)=>a.date<b.date?1:-1)}
const slipCands=t=>[t,t.replace(/^(وال|بال|فال|كال|لل|ال)/,''),t.replace(/^[وفبل]/,''),t.replace(/^[وفبل]ال/,'')];
function slipCats(reason){const toks=normAr(reason).split(/[^\p{L}]+/u).filter(Boolean);
  return SLIP_CATS.filter(c=>c.w.some(w=>{const k=normAr(w).replace(/^ال/,'');return toks.some(t=>slipCands(t).some(x=>x===k||(k.length>=3&&x.startsWith(k))))}))}
const WDAYS_AR=['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
// weekday names follow the interface language wherever they are glued into a sentence
const WDAYS=new Proxy(WDAYS_AR,{get:(t,k)=>typeof k==='string'&&/^\d$/.test(k)&&typeof LANG!=='undefined'&&LANG!=='ar'?Tx(t[k]):t[k]});
function viewTahlil(){
  const L=allSlips();
  if(!L.length)return `<section><div class="box pad"><b>لا توجد زلّات مسجّلة بعد</b><p class="muted" style="margin:6px 0 0">كلما سجّلت زلّة في جارحة أو إخفاقًا في المرحلة التمهيدية مع سببها، يظهر لك هنا ما يتكرر في أسبابك، فتعرف موضع ضعفك وتسدّ بابه.</p></div></section>`;
  const withR=L.filter(s=>s.reason.trim()),cc={},ex={};
  withR.forEach(s=>{const cs=slipCats(s.reason);(cs.length?cs:[{id:'other',t:'أسباب أخرى'}]).forEach(c=>{cc[c.id]=(cc[c.id]||0)+1;(ex[c.id]=ex[c.id]||[]).push(s)})});
  const name=id=>(SLIP_CATS.find(c=>c.id===id)||{t:'أسباب أخرى'}).t;
  const cats=Object.keys(cc).sort((a,b)=>(a==='other')-(b==='other')||cc[b]-cc[a]);
  const max=Math.max(1,...Object.values(cc));
  const oc={};L.forEach(s=>oc[s.org]=(oc[s.org]||0)+1);const orgs=Object.keys(oc).sort((a,b)=>oc[b]-oc[a]);
  const wd=[0,0,0,0,0,0,0];L.forEach(s=>wd[new Date(s.date+'T12:00:00').getDay()]++);const wmax=Math.max(...wd),wi=wd.indexOf(wmax);
  const top=cats.find(c=>c!=='other');
  const bar=(label,n,m,cls)=>`<div class="tb-row"><span class="tb-l">${label}</span><span class="tb-bar"><i class="${cls||''}" style="width:${Math.round(n/m*100)}%"></i></span><b class="tb-n">${n}</b></div>`;
  return `<section><div class="box pad tb-sum"><b>${L.length}</b><span class="muted">زلّة مسجّلة، منها ${withR.length} مع سببها</span></div>
   ${top?`<div class="box pad tb-key"><span class="muted">أكثر ما يتكرر في أسبابك</span><b>${name(top)}</b><p class="muted" style="margin:4px 0 0">ابدأ من هنا: اجعل لهذا الباب خطة صغيرة واضحة، فإن سدّه يحفظ أكثر من جارحة.</p></div>`:''}</section>
   <section><div class="sh"><h2>أسباب الزلّات</h2></div><div class="box pad">${cats.map(c=>bar(name(c),cc[c],max,c==='other'?'o':'')).join('')}</div>
   <p class="meta">تُصنَّف الأسباب تلقائيًا من الكلمات التي كتبتها، وقد يدخل السبب الواحد في بابين.</p></section>
   <section><div class="sh"><h2>الجوارح الأكثر زللًا</h2></div><div class="box pad">${orgs.map(o=>bar(o,oc[o],oc[orgs[0]])).join('')}</div>
   ${wmax>1?`<p class="meta"><span>أكثر الأيام زللًا: يوم</span> <b>${WDAYS[wi]}</b></p>`:''}</section>
   <section><div class="sh"><h2>أمثلة من أسبابك</h2></div>${cats.slice(0,4).map(c=>`<details class="slips"><summary>${name(c)} <span>(${cc[c]})</span></summary><ol>${ex[c].slice(0,5).map(s=>`<li><div class="sl-h"><b>${fmtD(s.date)}</b><span class="pill p-tathir">${s.org}</span></div><p><span class="notr" dir="auto">${esc(s.reason)}</span></p></li>`).join('')}</ol></details>`).join('')}</section>`;
}

