/* ---------- scheduled retreats (khalwa / i'tikaf) with an hour-by-hour programme and reminders ---------- */
let khEdit=null,khMsg='',khDel=null;
const khList=()=>S.khal||(S.khal=[]);
const pad2=n=>String(n).padStart(2,'0');
const localStr=d=>d.getFullYear()+'-'+pad2(d.getMonth()+1)+'-'+pad2(d.getDate())+'T'+pad2(d.getHours())+':'+pad2(d.getMinutes());
const khMs=v=>new Date(v).getTime();
const khName=r=>r.type==='itikaf'?'اعتكاف':'خلوة';
function khEvents(r){const st=khMs(r.s),en=khMs(r.e),d0=new Date(r.s);d0.setHours(0,0,0,0);const nd=Math.ceil((en-d0.getTime())/DAY);const ev=[];
  (r.p||[]).forEach((p,i)=>{const [h,m]=String(p.t||'0:0').split(':').map(Number);const days=+p.d?[+p.d-1]:Array.from({length:nd},(_,k)=>k);
    days.forEach(k=>{const at=new Date(d0.getTime());at.setDate(at.getDate()+k);at.setHours(h||0,m||0,0,0);const t=at.getTime();if(t>=st&&t<=en)ev.push({at:t,x:p.x,i,k})})});
  return ev.sort((a,b)=>a.at-b.at)}
const khState=r=>{const n=Date.now();return n<khMs(r.s)?'soon':n<=khMs(r.e)?'now':'past'};
const fmtDT=ms=>{const d=new Date(ms);return fmtD(ds(d))+' · '+pad2(d.getHours())+':'+pad2(d.getMinutes())};
const hmMs=ms=>{const d=new Date(ms);return pad2(d.getHours())+':'+pad2(d.getMinutes())};
const KH_SHORT=[[0,'النية: أستحضر أن خلوتي لله وحده، وأقطع عني كل شاغل'],[10,'الاستغفار بحضور القلب'],[25,'الصلاة على النبي ﷺ'],[40,'ذكر «لا إله إلا الله»'],[60,'تلاوة القرآن بتدبّر'],[90,'التفكر والمراقبة: أستحضر أن الله يراني'],[110,'المحاسبة والدعاء، ثم الختم بالحمد']];
const KH_DAY=[['04:30','قيام الليل والاستغفار في السحر'],['06:15','أذكار الصباح'],['07:00','تلاوة القرآن بتدبّر'],['09:00','الذكر الشخصي'],['10:30','راحة قصيرة'],['11:00','طلب العلم أو القراءة النافعة'],['14:00','الصلاة على النبي ﷺ'],['15:30','التفكر والمراقبة'],['17:15','أذكار المساء'],['19:30','تلاوة القرآن'],['20:30','المحاسبة والدعاء'],['21:30','النوم على طهارة']];
function khTemplate(r){const st=new Date(r.s),dur=(khMs(r.e)-khMs(r.s))/36e5;
  if(dur<=6)return KH_SHORT.filter(([m])=>m/60<=dur).map(([m,x])=>{const d=new Date(st.getTime()+m*6e4);return{d:1,t:pad2(d.getHours())+':'+pad2(d.getMinutes()),x}});
  return KH_DAY.map(([t,x])=>({d:0,t,x}))}
function khNew(type){const s=new Date();s.setMinutes(0,0,0);s.setHours(s.getHours()+1);const e=new Date(s.getTime()+(type==='itikaf'?3*DAY:2*36e5));
  const r={id:'k'+Date.now().toString(36),type,s:localStr(s),e:localStr(e),p:[]};r.p=khTemplate(r);return r}
function khReadForm(){const R=khEdit;if(!R)return;const g=id=>document.getElementById(id);if(g('khType'))R.type=g('khType').value;if(g('khS'))R.s=g('khS').value;if(g('khE'))R.e=g('khE').value;
  R.p=[...document.querySelectorAll('.kh-prow')].map(row=>({d:+row.querySelector('select').value,t:row.querySelector('input[type=time]').value,x:row.querySelector('input[type=text]').value.trim()}))}
function khForm(){const R=khEdit,nd=Math.max(1,Math.ceil((khMs(R.e)-new Date(R.s.slice(0,10)+'T00:00').getTime())/DAY));
  const dayOpts=v=>`<option value="0"${+v===0?' selected':''}>كل يوم</option>`+Array.from({length:nd},(_,k)=>`<option value="${k+1}"${+v===k+1?' selected':''}>${Tx('اليوم')} ${k+1}</option>`).join('');
  return `<section class="box pad kh-form"><h3>${R._new?'برمجة خلوة جديدة':'تعديل البرنامج'}</h3>
   <label class="muted" for="khType">النوع</label><select id="khType"><option value="khalwa"${R.type==='khalwa'?' selected':''}>خلوة</option><option value="itikaf"${R.type==='itikaf'?' selected':''}>اعتكاف</option></select>
   <div class="kh-dates"><label><span class="muted">البداية</span><input type="datetime-local" id="khS" value="${R.s}"></label><label><span class="muted">النهاية</span><input type="datetime-local" id="khE" value="${R.e}"></label></div>
   <div class="kh-ph"><b>البرنامج</b><button class="btn small" data-khtpl="1">برنامج مقترح</button></div>
   <div class="kh-prog">${(R.p||[]).map((p,i)=>`<div class="kh-prow"><select aria-label="اليوم">${dayOpts(p.d)}</select><input type="time" value="${p.t}" aria-label="الساعة"><input type="text" value="${esc(p.x||'')}" placeholder="العمل، مثل: تلاوة القرآن" dir="auto"><button class="btn small dl-del" data-khpdel="${i}" aria-label="حذف">✕</button></div>`).join('')||'<p class="meta">لا يوجد عمل بعد. أضف أعمالك أو اختر «برنامج مقترح».</p>'}</div>
   <button class="btn small" data-khpadd="1">+ أضف عملًا</button>
   ${khMsg?`<p class="logged bad">${esc(khMsg)}</p>`:''}
   <div class="btns" style="margin-top:12px"><button class="btn ok" data-khsave="1">حفظ</button><button class="btn" data-khcancel="1">تراجع</button></div>
   <p class="meta">تصلك تذكيرات على الهاتف ببداية الخلوة، وبكل عمل في وقته، وبنهايتها، إذا كانت التذكيرات مفعّلة.</p></section>`}
function khCard(r){const st=khState(r),ev=khEvents(r),n=Date.now(),nx=ev.find(e=>e.at>n),pct=st==='now'?Math.round((n-khMs(r.s))/(khMs(r.e)-khMs(r.s))*100):st==='past'?100:0;
  const days={};ev.forEach(e=>{const k=ds(new Date(e.at));(days[k]=days[k]||[]).push(e)});
  const prog=Object.keys(days).map(k=>`<div class="kh-day"><p class="kh-dl">${fmtD(k)}</p>${days[k].map(e=>`<div class="kh-ev${e.at<=n?' done':''}${nx&&e===nx?' next':''}"><time>${hmMs(e.at)}</time><span class="notr" dir="auto">${esc(e.x||'')}</span></div>`).join('')}</div>`).join('');
  return `<div class="box pad kh-card ${st}"><div class="kh-top"><b>${khName(r)}</b><span class="pill p-${st==='now'?'tanwir':st==='soon'?'tathir':'done'}">${st==='now'?'جارية الآن':st==='soon'?'مبرمجة':'انتهت'}</span></div>
   <p class="meta" style="margin:4px 0"><span>من</span> ${fmtDT(khMs(r.s))} <span>إلى</span> ${fmtDT(khMs(r.e))}</p>
   ${st!=='soon'?`<i class="kh-bar"><b style="width:${pct}%"></b></i>`:''}
   ${nx&&st!=='past'?`<p class="kh-next"><span>التالي:</span> <b>${hmMs(nx.at)}</b> · <span class="notr" dir="auto">${esc(nx.x||'')}</span></p>`:''}
   ${st==='past'&&!r.logged?`<div class="confirm"><span>هل أتممت ${khName(r)}؟ سيستنير جسدك كله في «حالتك الروحية اليومية» ثلاثين يومًا.</span><div class="btns"><button class="btn ok" data-khlog="${r.id}">نعم، أتممتها</button></div></div>`:''}
   ${r.logged?'<p class="logged">سُجّلت ✓</p>':''}
   <details class="kh-det"${st==='now'?' open':''}><summary>البرنامج (${ev.length})</summary>${prog||'<p class="meta">لا يوجد برنامج.</p>'}</details>
   <div class="btns">${st!=='past'?`<button class="btn small" data-khedit="${r.id}">تعديل</button>`:''}${khDel===r.id?`<button class="btn small slip" data-khdelyes="${r.id}">تأكيد الحذف</button><button class="btn small" data-khdelno="1">تراجع</button>`:`<button class="btn small" data-khdel="${r.id}">حذف</button>`}</div></div>`}
function viewKhalwa(){if(khEdit)return khForm();const L=khList().slice().sort((a,b)=>khMs(a.s)-khMs(b.s));
  const now=L.filter(r=>khState(r)==='now'),soon=L.filter(r=>khState(r)==='soon'),past=L.filter(r=>khState(r)==='past').reverse();
  return `<div class="kashf-w">✦ <span>الغاية رضا الله، لا الأنوار ولا الرؤى. إن رأيت شيئًا في خلوتك فاعرضه على شيخك، ولا تجعله مقصدك.</span></div>${now.length?`<section><div class="sh"><h2>الآن</h2></div>${now.map(khCard).join('')}</section>`:''}
   <section><div class="btns kh-new"><button class="btn ok" data-khnew="khalwa">+ برمجة خلوة</button><button class="btn ok" data-khnew="itikaf">+ برمجة اعتكاف</button></div>
   ${khMsg?`<p class="logged">${esc(khMsg)}</p>`:''}</section>
   ${soon.length?`<section><div class="sh"><h2>المبرمجة</h2><span>${soon.length}</span></div>${soon.map(khCard).join('')}</section>`:''}
   ${past.length?`<section><div class="sh"><h2>السابقة</h2><span>${past.length}</span></div>${past.slice(0,10).map(khCard).join('')}</section>`:''}
   ${!L.length?khIntro():''}`}
/* shown while nothing is programmed yet: what a khalwa and an i'tikaf are, and how the programme works */
function khIntro(){return `<section class="box kh-intro">${ilSvg('taammulat')}<div class="pad">
   <div class="kh-two"><div><b>الخلوة</b><span>وقت تنقطع فيه عن الناس والشواغل، في بيتك أو في مكان هادئ، للذكر والقرآن والتفكّر، ساعةً أو أكثر.</span></div>
   <div><b>الاعتكاف</b><span>لزوم المسجد بنية التقرّب إلى الله. وعند المالكية: يُشترط فيه الصوم، وأقلّه يوم وليلة.</span></div></div>
   <ol class="kh-steps"><li><b>حدّد البداية والنهاية</b><span>اختر خلوة أو اعتكافًا، ويومه وساعته.</span></li><li><b>رتّب برنامجك</b><span>ذكر، قرآن، صلاة، تفكّر… كل فقرة بساعتها ودقيقتها.</span></li><li><b>يذكّرك التطبيق</b><span>بنغمة هادئة عند كل فقرة، فلا تنشغل بالوقت.</span></li></ol></div></section>`}
/* while the app is open: chime and a banner when a programme item arrives */
let khAlerted=new Set();
setInterval(()=>{try{const n=Date.now();for(const r of khList()){if(khState(r)!=='now')continue;for(const e of khEvents(r)){const k=r.id+e.at;if(n>=e.at&&n<e.at+60000&&!khAlerted.has(k)){khAlerted.add(k);sndPlay('step',()=>bell([784,988],.28,1.4,.35));khToast(khName(r)+' · '+hmMs(e.at),e.x)}}}}catch(x){}},15000);
function khToast(t,x){let el=document.getElementById('khToast');if(!el){el=document.createElement('div');el.id='khToast';el.className='kh-toast';document.body.appendChild(el)}
  el.innerHTML=`<b>${esc(t)}</b><span dir="auto">${esc(x||'')}</span>`;el.classList.add('on');el.onclick=()=>{el.classList.remove('on');go('khalwa')};setTimeout(()=>el.classList.remove('on'),12000)}
