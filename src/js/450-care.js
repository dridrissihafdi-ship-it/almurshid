/* ---------- care: gentle guidance when overloaded or after a pause ---------- */
function careCard(){const L7=lastDays(8).slice(1),act=d=>{const l=S.log[d];return l&&((l.prayers||[]).length||(l.awrad||[]).length)};
  const idle=L7.slice(0,3).every(d=>!act(d))&&L7.slice(3).some(act);
  if(idle)return `<button class="box pad care" data-go="aamal"><b>مرحبًا بعودتك</b><span class="meta">لا تحمل همّ ما فات. ابدأ اليوم بعمل واحد صغير تداوم عليه، فالقليل الدائم خير من الكثير المنقطع.</span></button>`;
  const P=amPick(dayLog()),picked=(P.aw||[]).length+(P.nf||[]).length;
  const rate=L7.map(d=>{const l=S.log[d];if(!l)return null;const[a,b]=amProgress(l);return b?a/b:null}).filter(x=>x!=null);
  const avg=rate.length?rate.reduce((a,b)=>a+b,0)/rate.length:1;
  if(picked>=9&&rate.length>=4&&avg<.4)return `<div class="box pad care"><b>خفّف لتدوم</b><span class="meta">اخترت أعمالًا كثيرة، وأتممت أقل من نصفها هذا الأسبوع. «أحبّ الأعمال إلى الله أدومها وإن قلّ»: أبقِ ما تقدر عليه، ثم زد بالتدريج.</span><div class="btns"><button class="btn small" data-go="aamal">راجع أعمالك</button><button class="btn small" data-go="fatur">عند الفتور</button></div></div>`;
  return ''}
