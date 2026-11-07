/* ---------- «خطواتك الأولى»: a short path for the new seeker, each step ticks itself when done ---------- */
function fsSteps(){const anyPr=Object.values(S.log||{}).some(L=>L&&(L.prayers||[]).length),U=S.uy||{},org=Object.values(S.organs||{}).some(o=>o&&o.phase&&o.phase!=='idle');
  const st=[['city',!!S.loc,'اختر مدينتك','لمواقيت صلاة صحيحة','data-go="profile" data-cityfocus="1"'],
    ['pray',anyPr,'سجّل أول صلاة','في «الأعمال» اضغط على الصلاة بعد أدائها','data-go="aamal"'],
    ['uyub',!!(U.tests&&U.tests.length),'اعرف عيوبك','تشخيص قصير يدلّك من أين تبدأ','data-go="uyub"'],
    ['tazkiya',org,'ابدأ تطهير جارحة','ثلاثون يومًا تحفظ فيها جارحة واحدة','data-go="tazkiya"']];
  if(AUTH.state==='in'){const [k]=pushState();if(k!=='no')st.push(['push',k==='on','فعّل التذكيرات','تذكير بالأذكار والمحاسبة في وقتها',k==='ios'?'data-iosguide="1"':k==='denied'?'data-khpush="1"':'data-pushon1="1"'])}
  else st.push(['acct',false,'احفظ تقدّمك بحساب','ليبقى معك إن غيّرت هاتفك','data-toauth="up"']);
  return st}
function fsCard(){if(S.fsHide||S.demo)return '';const st=fsSteps(),n=st.filter(x=>x[1]).length;if(n===st.length)return '';
  return `<section class="box pad fs-card" aria-labelledby="fsH"><div class="fs-top"><h2 id="fsH">خطواتك الأولى</h2><span dir="ltr">${n} / ${st.length}</span><button class="fs-x" data-fshide="1" aria-label="${esc(Tx('إخفاء خطواتك الأولى'))}">×</button></div>
   <span class="fs-bar" aria-hidden="true"><b style="width:${n/st.length*100}%"></b></span>
   <ol class="fs-l">${st.map(([k,ok,t,s,a])=>`<li class="${ok?'ok':''}"><button class="fs-r" ${a}${ok?' aria-disabled="true"':''}><i aria-hidden="true">${ok?'✓':''}</i><span class="tx"><b>${t}</b>${ok?'':`<small>${s}</small>`}</span>${ok?`<span class="sr">${Tx('تمّت')}</span>`:''}</button></li>`).join('')}</ol></section>`}
/* how to install on iPhone, step by step, with pictures of the buttons to press */
function iosGuide(){const ic=p=>`<span class="ig-ic" aria-hidden="true"><svg viewBox="0 0 24 24">${p}</svg></span>`;
  sheetOpen(`<div class="bs-top"><h2>التذكيرات على iPhone</h2><button class="qa-ed" data-bsx="1">إغلاق</button></div>
   <p class="meta" style="margin:0 2px 12px">لا يسمح iPhone بالتذكيرات إلا للتطبيق المثبّت على الشاشة الرئيسية. ثلاث خطوات:</p>
   <ol class="ig-l">
    <li>${ic('<path d="M12 3v12M7.5 7.5 12 3l4.5 4.5"/><path d="M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1"/>')}<span><b>اضغط زر «مشاركة»</b><small>أسفل الشاشة في Safari، أو أعلاها في iPad</small></span></li>
    <li>${ic('<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M12 8v8M8 12h8"/>')}<span><b>اختر «إضافة إلى الشاشة الرئيسية»</b><small>انزل في القائمة إن لم تجده، ثم «إضافة»</small></span></li>
    <li>${ic('<rect x="5" y="3" width="14" height="18" rx="3"/><circle cx="12" cy="17.5" r="1"/><path d="M9 8h6M9 11h6"/>')}<span><b>افتح «المرشد» من أيقونته</b><small>ثم ادخل بحسابك، واضغط «فعّل التذكيرات»</small></span></li></ol>
   <p class="meta" style="margin:10px 2px 0">بياناتك محفوظة في حسابك، فلن تفقد شيئًا حين تفتحه من الأيقونة.</p>`)}
document.addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;const d=t.dataset;
  if(d.fshide){S.fsHide=1;save();render();return}
  if(d.iosguide){iosGuide();return}},true);
