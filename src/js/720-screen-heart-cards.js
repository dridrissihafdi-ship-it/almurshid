/* ---------- screen: heart diseases as picture cards ---------- */
let amI=0;
function viewAmrad(){const A=AMRAD[LANG]||AMRAD.ar,ids=Object.keys(AMRAD.ar),dir=LANG==='ar'||LANG==='ur'?'rtl':'ltr';
  return `<section class="am"><p class="muted am-in">ثمانية أمراض تصيب القلب. اسحب لترى كل مرض، واختر تمرينًا لأسبوعك.</p>
   <div class="am-row" id="amRow">${ids.map((id,i)=>{const x=A[id];return `<article class="am-c" data-ami="${i}">${ilSvg(id)}<div class="am-b tts-s"><h3 class="notr" dir="${dir}">${x[0]}</h3>
     <dl><dt>مَا هُوَ؟</dt><dd class="notr" dir="${dir}">${x[1]}</dd><dt>عَلَامَتُهُ</dt><dd class="notr" dir="${dir}">${x[2]}</dd><dt>عِلَاجُهُ</dt><dd class="notr" dir="${dir}">${x[3]}</dd></dl>
     <dl class="am-ex"><dt>تَمْرِينُ الْأُسْبُوعِ</dt><dd class="notr" dir="${dir}">${x[4]}</dd></dl></div>
     <div class="am-btns">${S.amEx&&S.amEx.id===id?'<span class="logged">اخترته لأسبوعك ✓</span>':`<button class="btn ok small" data-amsel="${id}">اختر هذا التمرين لأسبوعك</button>`}<button class="btn small" data-go="qalb">برنامج العلاج: أربعون يومًا</button></div></article>`}).join('')}</div>
   <div class="am-dots">${ids.map((id,i)=>`<button data-amgo="${i}" aria-label="${i+1}"${i===amI?' class="on"':''}></button>`).join('')}</div>
   ${ttsBtn('استمع')}</section>`}
function amBind(){const r=document.getElementById('amRow');if(!r)return;const cards=[...r.children];
  if(amI)requestAnimationFrame(()=>cards[amI]&&cards[amI].scrollIntoView({inline:'center',block:'nearest'}));
  r.addEventListener('scroll',()=>{const c=r.getBoundingClientRect(),mid=c.left+c.width/2;let b=0,bd=1e9;cards.forEach((x,i)=>{const q=x.getBoundingClientRect(),dd=Math.abs(q.left+q.width/2-mid);if(dd<bd){bd=dd;b=i}});if(b!==amI){amI=b;document.querySelectorAll('.am-dots button').forEach((x,i)=>x.classList.toggle('on',i===b))}},{passive:true})}

