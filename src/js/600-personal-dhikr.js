/* ---------- personal dhikr: list + timed session ---------- */
function dlList(){const M=S.marks;if(!M.dhikrList){M.dhikrList=M.dhikrText?[{text:M.dhikrText,min:10}]:[]}return M.dhikrList}
const dlTotal=()=>dlList().reduce((a,d)=>a+(+d.min||0),0);
function dhikrEditor(){
  const dl=dlList();
  return `<div class="box pad dl-box"><details class="dl-det" ${dlOpen?'open':''}><summary class="dl-sum"><span class="dl-sum-t">مجموعة الذكر الشخصي</span><span class="dl-sum-m">${dl.length?`${ar2(dl.length)} ${dl.length>2&&dl.length<11?'أذكار':'ذكر'} · `:''}<span class="dl-tot">${ar2(dlTotal())}</span> دقيقة</span></summary>
   <div class="dl-body">${dl.length?'':'<p class="muted">لم تضف أي ذكر بعد. أضف ذكرك وحدّد مدته بالدقائق.</p>'}
   <ol class="dl-list">${dl.map((d,i)=>`<li class="dl-row">
     <label class="sr" for="dl-t-${i}">نص الذكر ${i+1}</label><input type="text" id="dl-t-${i}" data-dlt="${i}" value="${esc(d.text)}" placeholder="نص الذكر">
     <div class="dl-ctl"><label for="dl-m-${i}" class="meta">المدة</label><input type="number" inputmode="numeric" min="1" max="180" id="dl-m-${i}" data-dlm="${i}" value="${d.min}"><span class="meta">دقيقة</span>
      <button class="btn small" data-dlup="${i}" aria-label="تقديم" ${i===0?'disabled':''}>▲</button><button class="btn small" data-dldown="${i}" aria-label="تأخير" ${i===dl.length-1?'disabled':''}>▼</button><button class="btn small dl-del" data-dldel="${i}" aria-label="حذف">حذف</button></div></li>`).join('')}</ol>
   <div class="btns"><button class="btn" data-dladd="1">+ أضف ذكرًا</button></div></div></details>
   ${dl.length?`<div class="btns"><button class="btn ok" data-dstart="1">ابدأ الذكر الشخصي</button></div>`:''}
   <p class="meta">عند انتهاء مدة كل ذكر يصدر تنبيه وينتقل العدّاد إلى الذكر التالي، وفي النهاية صوت مختلف. المس الشاشة أثناء الذكر لإيقاف العدّاد مؤقتًا.</p></div>`;
}
let dlOpen=false,run=null,runTimer=null,actx=null,wakeLock=null;
function audio(){try{actx=actx||new (window.AudioContext||window.webkitAudioContext)();if(actx.state!=='running')actx.resume()}catch(e){}return actx}
function bell(freqs,gap,len,vol){const c=audio();if(!c)return;const t0=c.currentTime+.05;
  freqs.forEach((f,k)=>{const t=t0+k*gap;[1,2.01,3.02].forEach((h,j)=>{const o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.value=f*h;
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol/(j*2+1),t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+len);o.connect(g).connect(c.destination);o.start(t);o.stop(t+len+.05)})})}
/* chimes rendered once to WAV and played through <audio> elements: more reliable on iPhone than live Web Audio */
function chimeWav(freqs,gap,len,vol,silent){const sr=22050,dur=silent?1:(freqs.length-1)*gap+len+.1,n=Math.round(sr*dur),b=new ArrayBuffer(44+n*2),v=new DataView(b);
  const w=(o,str)=>{for(let i=0;i<str.length;i++)v.setUint8(o+i,str.charCodeAt(i))};w(0,'RIFF');v.setUint32(4,36+n*2,true);w(8,'WAVEfmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,sr,true);v.setUint32(28,sr*2,true);v.setUint16(32,2,true);v.setUint16(34,16,true);w(36,'data');v.setUint32(40,n*2,true);
  for(let i=0;i<n;i++){const t=i/sr;let x=0;if(!silent)freqs.forEach((f,k)=>{const u=t-k*gap;if(u<0||u>len)return;const env=Math.min(1,u/.01)*Math.exp(-u*5/len);[1,2.01,3.02].forEach((h,j)=>{x+=Math.sin(2*Math.PI*f*h*u)*env*vol/(j*2+1)})});
    v.setInt16(44+i*2,Math.max(-1,Math.min(1,x*.8))*32767,true)}
  return URL.createObjectURL(new Blob([b],{type:'audio/wav'}))}
let SND=null;
function sndInit(){if(SND)return SND;try{SND={step:new Audio(chimeWav([784,988],.28,1.4,.35)),end:new Audio(chimeWav([523,659,784,1047],.32,2.4,.4)),keep:new Audio(chimeWav([],0,0,0,true))};SND.keep.loop=true;Object.values(SND).forEach(a=>{a.preload='auto';a.setAttribute('playsinline','')})}catch(e){SND=null}return SND}
function sndUnlock(){try{if(navigator.audioSession)navigator.audioSession.type='playback'}catch(e){}const S2=sndInit();if(!S2)return;
  [S2.step,S2.end].forEach(a=>{a.muted=true;const p=a.play();if(p&&p.then)p.then(()=>{a.pause();a.currentTime=0;a.muted=false}).catch(()=>{a.muted=false})});
  try{S2.keep.volume=.01;S2.keep.play().catch(()=>{})}catch(e){}}
function sndPlay(k,fb){const S2=sndInit();let ok=false;if(S2){try{const a=S2[k];a.muted=false;a.currentTime=0;const p=a.play();ok=true;if(p&&p.catch)p.catch(()=>fb())}catch(e){ok=false}}if(!ok)fb()}
function sndStop(){try{SND&&SND.keep.pause()}catch(e){}}
const soundStep=()=>{sndPlay('step',()=>bell([784,988],.28,1.4,.35));try{navigator.vibrate&&navigator.vibrate([120,80,120])}catch(e){}};
const soundEnd=()=>{sndPlay('end',()=>bell([523,659,784,1047],.32,2.4,.4));sndStop();try{navigator.vibrate&&navigator.vibrate([200,100,200,100,400])}catch(e){}};
async function keepAwake(on){try{if(on&&wakeLock&&!wakeLock.released)return;if(on&&'wakeLock' in navigator){wakeLock=await navigator.wakeLock.request('screen')}else if(!on&&wakeLock){await wakeLock.release();wakeLock=null}}catch(e){}}
function startRun(){const dl=dlList().filter(d=>(d.text||'').trim()&&+d.min>0);if(!dl.length)return;audio();sndUnlock();
  run={list:dl.map(d=>({text:d.text,ms:Math.round(+d.min*60000)})),i:0,el:0,last:Date.now(),paused:false,done:false};
  keepAwake(true);clearInterval(runTimer);runTimer=setInterval(tick,250);go('dhikr_run')}
function tick(){if(!run||run.paused||run.done)return;const n=Date.now();run.el+=n-run.last;run.last=n;let moved=false;
  while(!run.done&&run.el>=run.list[run.i].ms){run.el-=run.list[run.i].ms;run.i++;moved=true;if(run.i>=run.list.length){run.done=true;run.i=run.list.length-1;run.el=run.list[run.i].ms}}
  if(run.done){soundEnd();clearInterval(runTimer);keepAwake(false);if(screen==='dhikr_run')render();return}
  if(moved){soundStep();if(screen==='dhikr_run')render();return}
  paintRun()}
function togglePause(){if(!run||run.done)return;run.paused=!run.paused;run.last=Date.now();if(!run.paused){audio();sndUnlock()}else sndStop();render()}
function stopRun(){clearInterval(runTimer);run=null;keepAwake(false);sndStop()}
const fmtMs=ms=>{const s=Math.max(0,Math.ceil(ms/1000));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
function paintRun(){const r=document.getElementById('dr-ring'),t=document.getElementById('dr-time'),tt=document.getElementById('dr-total');if(!r||!run)return;
  const cur=run.list[run.i],left=cur.ms-run.el;r.style.setProperty('--p',Math.min(100,(1-left/cur.ms)*100));t.textContent=fmtMs(left);
  const totalLeft=run.list.slice(run.i+1).reduce((a,d)=>a+d.ms,0)+left;tt.innerHTML=Tx('المتبقي من المجموعة')+' <span dir="ltr">'+fmtMs(totalLeft)+'</span>'}
function viewDhikrRun(){
  if(!run)return `<section class="box pad"><p class="muted">لا توجد جلسة ذكر جارية.</p><div class="btns"><button class="btn ok" data-dstart="1">ابدأ الذكر الشخصي</button><button class="btn" data-go="aamal">رجوع</button></div></section>`;
  if(run.done){const ok=dayLog().awrad.includes('dhikr');
    return `<section class="dr dr-done"><div class="dr-check">✓</div><h2>تمّت مجموعة الذكر</h2><p>${ar2(run.list.length)} ${run.list.length>2&&run.list.length<11?'أذكار':'ذكر'} · ${ar2(Math.max(1,Math.round(run.list.reduce((a,d)=>a+d.ms,0)/60000)))} دقيقة</p>
     ${ok?'<p class="logged" style="color:#bfe6d2">✓ أكّدت الذكر الشخصي اليوم، وقلبك مستنير 24 ساعة</p>':'<button class="btn big dr-confirm" data-dconfirm="1">أكّدت الذكر الشخصي</button>'}
     <div class="btns" style="justify-content:center"><button class="btn small" data-dend="1">رجوع إلى الأعمال</button></div></section>`}
  const cur=run.list[run.i],nx=run.list[run.i+1],C=2*Math.PI*96;
  return `<section class="dr${run.paused?' paused':''}" data-drpad="1">
   <div class="dr-step">الذكر ${ar2(run.i+1)} من ${ar2(run.list.length)}</div>
   <div class="dr-dots">${run.list.map((d,k)=>`<i class="${k<run.i?'d':k===run.i?'c':''}"></i>`).join('')}</div>
   <p class="dr-text" dir="auto">${esc(cur.text)}</p>
   <div class="dr-ringbox alhbox">${alhRing('dr-ring',run.el/cur.ms*100)}
    <div class="dr-center"><b id="dr-time">${fmtMs(cur.ms-run.el)}</b><span>${run.paused?'متوقف':'جارٍ'}</span></div></div>
   <p class="dr-hint">${run.paused?'المس الشاشة للمتابعة':'المس الشاشة لإيقاف العدّاد'}</p>
   <p class="dr-total" id="dr-total"></p>
   ${nx?`<p class="dr-next"><span>التالي:</span> <span class="notr" dir="auto">${esc(nx.text)}</span></p>`:'<p class="dr-next">هذا آخر ذكر في المجموعة</p>'}
   ${run.paused?`<div class="btns dr-btns"><button class="btn small" data-dskip="1">انتقل إلى التالي</button><button class="btn small" data-dend="1">إنهاء الجلسة</button></div>`:''}
  </section>`;
}
document.addEventListener('pointerdown',e=>{if(screen!=='dhikr_run'||!run||run.done)return;if(e.target.closest('button'))return;if(!e.target.closest('.dr,#app'))return;e.preventDefault();togglePause()});
document.addEventListener('toggle',e=>{if(e.target.classList&&e.target.classList.contains('dl-det'))dlOpen=e.target.open},true);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&run&&!run.done){if(!run.paused)tick();if(screen==='dhikr_run')keepAwake(true)}});
