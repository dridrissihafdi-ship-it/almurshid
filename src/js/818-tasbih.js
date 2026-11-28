/* ---------- «التسبيح بعد الصلاة»: 33 subhan Allah, 33 al-hamdu lillah, 33 Allahu akbar, and the hundredth (Muslim 597)
   One full screen you tap anywhere, over a living picture: a man climbing a hill, dragging three iron weights
   (sins, heedlessness, worry). The camera creeps closer with every tap; each completed 33 breaks one chain and the next picture fades in;
   at the hundredth he stands in the light of the Name. A string of beads slides one bead per tap. */
const TSB_PH=[
 {t:'سُبْحَانَ اللَّهِ',m:'تنزيه الله عن كل نقص',bd:'#D9A54E'},
 {t:'الْحَمْدُ لِلَّهِ',m:'الثناء على الله بكل كمال',bd:'#45B27A'},
 {t:'اللَّهُ أَكْبَرُ',m:'الله أكبر من كل شيء',bd:'#C9D6EF'}];
const TSB_100='لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ';
const TSB_HAD='«مَنْ سَبَّحَ اللَّهَ فِي دُبُرِ كُلِّ صَلَاةٍ ثَلَاثًا وَثَلَاثِينَ، وَحَمِدَ اللَّهَ ثَلَاثًا وَثَلَاثِينَ، وَكَبَّرَ اللَّهَ ثَلَاثًا وَثَلَاثِينَ… وَقَالَ تَمَامَ الْمِائَةِ: لَا إِلَهَ إِلَّا اللَّهُ… غُفِرَتْ خَطَايَاهُ وَإِنْ كَانَتْ مِثْلَ زَبَدِ الْبَحْرِ»';
const TSB_W=['الذنوب','الغفلة','الهمّ'];
/* the string of beads runs across the screen under the counter */
const TSB_L=420,TSB_SP=11,TSB_A=Math.atan2(130,400);
function tsbN(){const now=Date.now();if(!S.tsb||now-(S.tsb.at||0)>30*60000||S.tsb.n>100)S.tsb={n:0,at:now};return S.tsb.n}
const tsbPh=n=>n>=100?4:n>=99?3:Math.floor(n/33);
/* a bead's place on the string: counted beads gather at the lower end, the rest wait at the upper end */
function tsbBeadXY(j,k){const s=j<k?14+j*TSB_SP:TSB_L-14-(32-j)*TSB_SP;return [-20+s*Math.cos(TSB_A),130-s*Math.sin(TSB_A)]}
/* the picture of each stage (3 weights, 2, 1, the light); the camera creeps toward the walker as the 33 fill */
const tsbImg=ph=>'il/tsb'+(ph>=4?4:Math.min(ph,2)+1)+'.webp';
const tsbZoom=k=>`scale(${(1.02+0.13*k/33).toFixed(3)})`;
function viewTasbih(){const n=tsbN(),ph=tsbPh(n),P=TSB_PH[Math.min(ph,2)],k=ph<3?n-ph*33:33,done=n>=100;
  const beads=Array.from({length:33},(_,j)=>{const [x,y]=tsbBeadXY(j,ph<3?k:33);return `<g class="tsb-bd" style="transform:translate(${x.toFixed(1)}px,${y.toFixed(1)}px)"><circle r="5.6" fill="${done?'#F6E2A8':P.bd}"/></g>`}).join('');
  const segs=[0,1,2].map(i=>`<i class="${i<ph?'full':i===ph?'cur':''}"><b style="width:${i<ph?100:i===ph?k/33*100:0}%"></b></i>`).join('');
  const head=ph<3?`<h2 class="tsb-t notr" lang="ar" dir="rtl">${P.t}</h2><p class="tsb-m">${P.m}</p><p class="tsb-c" dir="ltr"><strong id="tsbNum">${k}</strong><small>/ 33</small></p>`
    :done?'':`<h2 class="tsb-t tsb-t100 notr" lang="ar" dir="rtl">${TSB_100}</h2><p class="tsb-m">قلها مرة واحدة ثم المس الشاشة</p>`;
  const fresh=ph>0&&k===0&&ph<3||ph===4,prev=fresh?`<img class="tsb-img prev" src="${tsbImg(ph===4?2:ph-1)}" alt="" style="transform:${tsbZoom(33)}">`:'';
  const brk=ph>0&&ph<=3&&k===0&&n===ph*33?`<p class="tsb-brk"><span>انكسرت سلسلة</span> «<span>${TSB_W[ph-1]}</span>»</p>`:'';
  const dust=Array.from({length:12},(_,i)=>`<i style="--x:${(i*37)%100}%;--d:${7+(i*5)%9}s;--s:${-(i*1.7).toFixed(1)}s;--z:${2+(i%3)*2}px"></i>`).join('');
  return `<section class="tsb ph${ph}${done?' done':''}" id="tsb" data-tsbtap="1">
   <div class="tsb-bg"><div class="tsb-kb">${prev}<img class="tsb-img${fresh?' in':''}" id="tsbImg" src="${tsbImg(ph)}" alt="" style="transform:${tsbZoom(ph===3?33:done?0:k)}"></div><div class="tsb-dust">${dust}</div>${done?'<div class="tsb-glow"></div>':''}</div>
   ${done?'':`<div class="tsb-top"><button class="tsb-x" data-back="h_ibadat" aria-label="رجوع">✕</button><span class="tsb-src">صحيح مسلم 597</span><button class="tsb-x" dir="ltr" data-tsbundo="1" aria-label="تراجع واحدة"${n?'':' disabled'}>−1</button></div>`}
   <div class="tsb-head">${head}${done?'':`<div class="tsb-seg" dir="rtl">${segs}</div>`}</div>
   ${done?'':`<svg class="tsb-sc" viewBox="0 0 360 140" aria-hidden="true"><line class="tsb-th" x1="-20" y1="130" x2="${(-20+TSB_L*Math.cos(TSB_A)).toFixed(0)}" y2="${(130-TSB_L*Math.sin(TSB_A)).toFixed(0)}"/><g id="tsbBeads">${beads}</g></svg>`}
   ${brk}<div class="tsb-sp"></div>
   ${done?`<div class="tsb-end"><p class="tsb-had notr" lang="ar" dir="rtl">${TSB_HAD}</p><p class="tsb-hm">غفرت خطاياه وإن كانت مثل زبد البحر</p><div class="btns"><button class="btn" data-tsbagain="1">من جديد</button><button class="btn ok" data-back="h_ibadat">تمّ</button></div></div>`
     :`<p class="tsb-hint">المس الشاشة في أي مكان لكل تسبيحة</p>`}
  </section>`}
/* one tap: update in place so the beads glide and the picture steps forward; a full redraw only when a 33 completes */
function tsbTick(){let n=tsbN();if(n>=100)return;n++;S.tsb={n,at:Date.now()};save();
  const full=n%33===0||n>=99;try{navigator.vibrate&&navigator.vibrate(n%33===0||n===100?[90,50,90]:10)}catch(e){}
  if(full){if(n%33===0||n===100){try{sndPlay('step',()=>bell([784,988],.28,1.4,.35))}catch(e){}}
    if(n===100){const L=dayLog();L.tsb=(L.tsb||0)+1;save()}render();return}
  const ph=tsbPh(n),k=n-ph*33,num=document.getElementById('tsbNum');if(num)num.textContent=k;
  document.querySelectorAll('#tsbBeads .tsb-bd').forEach((b,j)=>{const [x,y]=tsbBeadXY(j,k);b.style.transform=`translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`});
  const cur=document.querySelector('.tsb-seg i.cur b');if(cur)cur.style.width=(k/33*100)+'%';
  const im=document.getElementById('tsbImg');if(im)im.style.transform=tsbZoom(k);
  const bg=document.querySelector('.tsb-bg');if(bg){bg.classList.remove('step');void bg.offsetWidth;bg.classList.add('step')}
  const br=document.querySelector('.tsb-brk');if(br)br.remove()}
document.addEventListener('click',e=>{if(screen!=='tasbih')return;const t=e.target.closest('[data-tsbundo],[data-tsbagain],[data-back],.btn');
  if(t&&t.dataset.tsbundo!==undefined){e.stopPropagation();const n=tsbN();if(n>0){S.tsb={n:n-1,at:Date.now()};save();render()}return}
  if(t&&t.dataset.tsbagain!==undefined){e.stopPropagation();S.tsb={n:0,at:Date.now()};save();render();return}
  if(t)return;if(e.target.closest('#tsb'))tsbTick()},true);
VIEWS.tasbih=viewTasbih;
document.addEventListener('click',e=>{const t=e.target.closest('[data-tsbgo]');if(!t)return;e.preventDefault();e.stopPropagation();try{sheetClose()}catch(x){}S.tsb={n:0,at:Date.now()};save();go('tasbih')},true);
function tsbBtn(){return `<button class="tsb-go" data-tsbgo="1"><span class="tsb-gi" aria-hidden="true">${Array.from({length:5},(_,i)=>`<i style="--i:${i}"></i>`).join('')}</span><span><b>التسبيح بعد الصلاة</b><small>33 + 33 + 33 وتمام المائة</small></span></button>`}
