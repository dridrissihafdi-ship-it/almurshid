/* ---------- lessons as picture stories ---------- */
const ST_MOTIF={tawba:'m_door',mujahada:'m_climb',ikhlas:'m_drop',qalb:'m_heart',qalbIntro:'m_heart',aql:'m_lamp',khushu:'khushu'};
const ST_ROT=['m_path','m_lamp','m_tree','m_book','m_mosque','m_heart'];
function storySlides(k){const X=lessonGet(k);if(!X)return[];const out=[{t:X.t||TITLES[k]||'',h:X.lead,img:ST_MOTIF[k]||'m_path'}];
  (X.secs||[]).forEach((s,si)=>{const d=document.createElement('div');d.innerHTML=s.h||'';const parts=[];
    [...d.children].forEach(c=>{if(/^(UL|OL)$/.test(c.tagName))[...c.children].forEach(li=>parts.push(`<p>${li.innerHTML}</p>`));else if(c.textContent.trim())parts.push(c.outerHTML)});
    if(!parts.length&&d.textContent.trim())parts.push(`<p>${d.innerHTML}</p>`);
    parts.forEach((p,pi)=>out.push({t:s.t,h:p,img:ST_ROT[si%ST_ROT.length],sec:si,first:pi===0}))});
  return out}
let stSpeakTok=0;
function stSay(el){if(!TTS_OK)return;speechSynthesis.cancel();const tok=++stSpeakTok,parts=ttsChunks(ttsText(el));let k=0;
  const next=()=>{if(tok!==stSpeakTok||k>=parts.length)return;const txt=parts[k++],urd=LANG==='ur'&&/[ٹڈڑںےۓہھکگپچژیۂ]/.test(txt),arab=!urd&&(txt.match(/[؀-ۿ]/g)||[]).length>txt.length/4;
    const u=new SpeechSynthesisUtterance(txt);u.lang=arab?'ar-SA':(TTS_LANG[LANG]||'ar-SA');const v=ttsVoice(arab?'ar':LANG)||(LANG==='ur'?ttsVoice('ar'):null);if(v){u.voice=v;u.lang=v.lang}u.rate=ttsRateFor(arab||LANG==='ar');u.onend=()=>setTimeout(next,60);speechSynthesis.speak(u)};next()}
function storyOpen(k){const SL=storySlides(k);if(!SL.length)return;let i=0;const dir=lsL(k)?'auto':'rtl';
  const o=document.createElement('div');o.className='st-ov';o.dir=RTL()?'rtl':'ltr';
  const paint=()=>{const s=SL[i];o.innerHTML=`<div class="st-bars" dir="${RTL()?'rtl':'ltr'}">${SL.length<=24?SL.map((_,j)=>`<i class="${j<i?'d':j===i?'on':''}"></i>`).join(''):`<i class="on" style="flex:1"><b style="width:${(i+1)/SL.length*100}%"></b></i>`}</div>
    <div class="st-top"><span class="st-n" dir="ltr">${i+1} / ${SL.length}</span><button class="st-x" aria-label="${esc(Tx('إغلاق'))}"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
    <div class="st-art">${ilSvg(s.img)}</div>
    <div class="st-body"><h3 class="notr" dir="${dir}">${s.t}</h3><div class="st-txt notr" dir="${dir}">${s.h}</div></div>
    <div class="st-nav"><button class="st-p" ${i?'':'disabled'}>${esc(Tx('السابق'))}</button>${TTS_OK?`<button class="st-say"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 8.5a5 5 0 0 1 0 7"/></svg>${esc(Tx('استمع'))}</button>`:''}<button class="st-f">${esc(Tx(i<SL.length-1?'التالي':'إغلاق'))}</button></div>`;
    o.querySelector('.st-x').onclick=close;o.querySelector('.st-p').onclick=()=>go_(-1);o.querySelector('.st-f').onclick=()=>i<SL.length-1?go_(1):close();
    const sy=o.querySelector('.st-say');if(sy)sy.onclick=()=>stSay(o.querySelector('.st-body'))};
  const go_=d=>{i=Math.max(0,Math.min(SL.length-1,i+d));stSpeakTok++;try{speechSynthesis.cancel()}catch(e){}paint()};
  const close=()=>{stSpeakTok++;try{speechSynthesis.cancel()}catch(e){}o.remove();removeEventListener('keydown',kd)};
  const kd=e=>{if(e.key==='Escape')close();if(e.key==='ArrowLeft')go_(RTL()?1:-1);if(e.key==='ArrowRight')go_(RTL()?-1:1)};addEventListener('keydown',kd);
  let sx=null;o.addEventListener('touchstart',e=>{sx=[e.touches[0].clientX,e.touches[0].clientY]},{passive:true});
  o.addEventListener('touchend',e=>{if(!sx)return;const dx=e.changedTouches[0].clientX-sx[0],dy=e.changedTouches[0].clientY-sx[1];sx=null;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.3)go_((dx<0)===!RTL()?1:-1);else if(dy>110&&Math.abs(dy)>Math.abs(dx)*1.5)close()},{passive:true});
  paint();document.body.appendChild(o)}

