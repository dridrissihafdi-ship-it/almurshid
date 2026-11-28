/* ---------- morning and evening adhkar on one living picture ----------
   The whole screen is the scene: the Name of Allah glowing at the top, the current dhikr under it, the seeker at the bottom
   with his hands raised. Every repetition lays one more brick of a dome around him, in no fixed order; black shadows fly in
   from the sides: they break on the bricks, and slip through where the dome is still open.
   «...كمثل رجل خرج العدو في أثره سراعًا حتى إذا أتى على حصن حصين فأحرز نفسه منهم، كذلك العبد لا يحرز نفسه من الشيطان إلا بذكر الله» (الترمذي 2863) */
const ASH={cx:50,cy:128,in:[24,34],out:[33,46],a0:-12,a1:192};   // stage units: width 100, height 150; the dome is a band of elliptic rows
/* one brick per repetition: the band is split into rows and the bricks shared out by the length of each row */
const ASH_C={};
function ashCells(kind){const N=adhList(kind).reduce((a,x)=>a+x.n,0);if(ASH_C[kind]&&ASH_C[kind].length===N)return ASH_C[kind];
  const R=Math.max(2,Math.round(Math.sqrt(N/7))),rows=[];for(let r=0;r<R;r++){const f=R>1?r/(R-1):0,rx=ASH.in[0]+(ASH.out[0]-ASH.in[0])*f,ry=ASH.in[1]+(ASH.out[1]-ASH.in[1])*f;rows.push({rx,ry,L:Math.PI*Math.sqrt((rx*rx+ry*ry)/2)})}
  const tot=rows.reduce((a,r)=>a+r.L,0);let left=N;rows.forEach((r,i)=>{r.n=i===R-1?left:Math.round(N*r.L/tot);left-=r.n});
  const bw=Math.min(7,rows[0].L*(ASH.a1-ASH.a0)/180/rows[0].n*.92),o=[];
  rows.forEach((w,ri)=>{for(let i=0;i<w.n;i++){const th=ASH.a0+(i+.5)*(ASH.a1-ASH.a0)/w.n,t=th*Math.PI/180;
    o.push({ri,th,bw,rot:Math.atan2(-w.ry*Math.cos(t),-w.rx*Math.sin(t))*180/Math.PI+180,x:ASH.cx+w.rx*Math.cos(t),y:ASH.cy-w.ry*Math.sin(t),rx:w.rx,ry:w.ry,step:(ASH.a1-ASH.a0)/w.n})}});
  return ASH_C[kind]=o}
/* the order the bricks are laid: shuffled, but the same all day for the same adhkar */
function ashOrder(kind){let s=0;for(const ch of kind+TODAY)s=(s*31+ch.charCodeAt(0))>>>0;const a=ashCells(kind).map((_,i)=>i);
  for(let i=a.length-1;i>0;i--){s=(s*1103515245+12345)>>>0;const j=s%(i+1);[a[i],a[j]]=[a[j],a[i]]}return a}
function ashLevel(kind){const list=adhList(kind),st=adhState(kind);let a=0,b=0;list.forEach((x,i)=>{a+=Math.min(st[i]||0,x.n);b+=x.n});return b?a/b:0}
const ashLit=kind=>Math.round(ashLevel(kind)*ashCells(kind).length);
function ashBrick(c,i,nw){const sc=(.92+((i*37)%17)/100).toFixed(2),br=(.85+((i*53)%30)/100).toFixed(2);
  return `<img class="ash-bk${nw?' nw':''}" src="il/adh_brick.webp" alt="" data-c="${i}" style="left:${c.x}%;top:${(c.y/1.5).toFixed(2)}%;width:${c.bw.toFixed(2)}%;--r:${c.rot.toFixed(1)}deg;--s:${sc};--b:${br}">`}
function viewAdhFull(kind){const list=adhList(kind),st=adhState(kind),L=dayLog(),p=period(),j=adhCurI(kind),a=list[j],c=st[j],full=c>=a.n;
  const done=list.filter((x,i)=>st[i]>=x.n).length,all=done===list.length,confirmed=L.awrad.includes(kind),name=kind==='sabah'?'أذكار الصباح':'أذكار المساء',q=ADHKAR.quran.length;
  const sec=j===0?'الاستهلال':j<=q?'من القرآن الكريم':'من السنة النبوية',au=adhAu(kind,j),ord=ashOrder(kind),lit=ashLit(kind);
  const bricks=ord.slice(0,lit).map(i=>ashBrick(ashCells(kind)[i],i,false)).join('');
  const dust=Array.from({length:10},(_,i)=>`<i style="--x:${(i*41)%100}%;--d:${8+(i*5)%9}s;--s:${-(i*1.9).toFixed(1)}s"></i>`).join('');
  setTimeout(()=>{ashFit();ashStart(kind)},0);
  return `<section class="ashf ${kind}${all?' all':''}" id="ashf">
   <div class="ash-fill" style="background-image:url(il/adh_${kind}.webp)"></div><div class="ash-stage" id="ashStage"><img class="ash-bg" src="il/adh_${kind}.webp" alt=""><div class="ash-name"></div><div class="ash-dust">${dust}</div>
    <div class="ash-man${all?' safe':''}"></div><div id="ashBricks">${bricks}</div><div id="ashFx"></div></div>
   <div class="ash-top"><button class="ash-x" data-back="aamal" aria-label="رجوع">✕</button>
    <div class="ash-prog"><i style="width:${Math.round(done/list.length*100)}%"></i></div><span class="ash-k" dir="ltr">${j+1} / ${list.length}</span>
    <button class="ash-x ash-sm" data-adhview="list">القائمة</button></div>
   ${all?'':`<div class="ash-txt">${p.kind===kind?'':`<p class="ash-note">${kind==='sabah'?'وقت أذكار الصباح من الفجر إلى المغرب':'وقت أذكار المساء من المغرب إلى الفجر'}</p>`}<p class="ash-sec"><span>${sec}</span>${a.s?` · <span class="notr">${a.s}</span>`:''}</p><div class="ash-scroll"><p class="ash-t notr" dir="rtl" lang="ar" style="font-size:${adhSize}px">${a.t}</p></div>
    ${au?`<button class="ash-pl" data-adpl="${j}">${AU_IC.play}<span>استمع</span></button>`:''}</div>`}
   ${all||confirmed?`<div class="ash-end">${all?`<p class="ash-had notr" lang="ar" dir="rtl">«كَذَلِكَ الْعَبْدُ لَا يُحْرِزُ نَفْسَهُ مِنَ الشَّيْطَانِ إِلَّا بِذِكْرِ اللَّهِ» <small>(الترمذي 2863)</small></p>`:''}
     ${confirmed?`<p class="logged">✓ أكّدت ${name} اليوم</p><div class="btns"><button class="btn small" data-adhconfirm="0">إلغاء التأكيد</button><button class="btn" data-go="aamal">رجوع إلى الأعمال</button></div>`
     :`<div class="btns"><button class="btn ok" data-adhconfirm="1">أكّدت ${name}</button><button class="btn small" data-adhreset="1">تصفير العدّاد</button></div>`}</div>`:''}
   <div class="ash-sp"></div>
   <div class="ash-ad">${adBar(kind)}</div>
   <div class="ash-ctl">
    <button class="ash-nav" data-adhgo="-1"${j?'':' disabled'} aria-label="${esc(Tx('السابق'))}"><svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button>
    <div class="ash-cnt${full?' full':''}"><b dir="ltr" id="ashN">${full?'✓':c}</b><small>${full?'تمّ':a.n===1?'مرة واحدة':'<span>من</span> '+a.n}</small></div>
    <button class="ash-nav" data-adhgo="1"${j<list.length-1?'':' disabled'} aria-label="${esc(Tx('التالي'))}"><svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg></button>
   </div>
   <p class="ash-hint">${all?'اكتملت هالتك: أحرزت نفسك بذكر الله':'المس الشاشة مع كل مرة: كل ذكر يضع لبنة في حصنك'}</p>
  </section>`}
/* a tap: count, lay the new bricks without redrawing the scene, move on by itself when this dhikr is complete */
function ashTap(kind){const list=adhList(kind),st=adhState(kind),j=adhCurI(kind),a=list[j];if(st[j]>=a.n)return;
  const before=ashLit(kind);st[j]++;save();const c=st[j],full=c>=a.n;try{navigator.vibrate&&navigator.vibrate(full?[60,40,60]:12)}catch(x){}
  const after=ashLit(kind),ord=ashOrder(kind),box=document.getElementById('ashBricks');
  if(box)for(let k=before;k<after;k++){box.insertAdjacentHTML('beforeend',ashBrick(ashCells(kind)[ord[k]],ord[k],true));ashFly(box.lastElementChild,ashCells(kind)[ord[k]])}
  const n=document.getElementById('ashN');if(n)n.textContent=full?'✓':c;
  const cn=document.querySelector('.ash-cnt');if(cn){cn.classList.remove('pulse');void cn.offsetWidth;cn.classList.add('pulse')}
  const allDone=list.every((x,i)=>st[i]>=x.n);
  if(full){setTimeout(()=>{if(screen!=='adh_'+kind||adhIdx[kind]!==j)return;const nx=adhNext(kind,j);if(nx>=0)adhIdx[kind]=nx;render()},allDone?200:550)}}
/* the shadows: one every second and a half, from the left or the right, aimed at the seeker */
let ashT=null,ashK=null;
function ashStart(kind){ashK=kind;if(ashT)return;ashT=setInterval(ashSpawn,1500);setTimeout(ashSpawn,500)}
function ashStop(){if(ashT){clearInterval(ashT);ashT=null}}
function ashSpawn(){const st=document.getElementById('ashStage'),fx=document.getElementById('ashFx');if(!st||!fx||!screen.startsWith('adh_')){ashStop();return}
  if(document.hidden||!fx.animate)return;const kind=ashK;if(ashLevel(kind)>=1)return;if(fx.childElementCount>3)return;
  const W=st.clientWidth,u=W/100,left=Math.random()<.5,th=left?180-Math.random()*70:Math.random()*70,thr=th*Math.PI/180;   // angle of attack on the dome
  const tx=ASH.cx*u,ty=ASH.cy*u,dx=Math.cos(thr),dy=-Math.sin(thr);
  /* is this side already walled? the outermost laid brick near that angle stops it */
  const lit=new Set(ashOrder(kind).slice(0,ashLit(kind)));let stopR=0;
  let stopC=null;ashCells(kind).forEach((c,i)=>{if(lit.has(i)&&Math.abs(c.th-th)<c.step*.8&&(!stopC||c.ri>stopC.ri))stopC=c});stopR=stopC?1:0;
  const R0=72,x0=tx+dx*R0*u,y0=ty+dy*R0*u,er=stopC?[stopC.rx+stopC.bw*.4,stopC.ry+stopC.bw*.4]:[7,14],ex=er[0]*Math.cos(thr),ey=-er[1]*Math.sin(thr),x1=tx+ex*u,y1=ty+ey*u;
  const el=document.createElement('img');el.src='il/adh_shay.webp';el.alt='';el.className='ash-sh';fx.appendChild(el);
  const sz=(11+Math.random()*4)*u,hh=sz*148/260,vx=x1-x0,vy=y1-y0,vl=Math.hypot(vx,vy),ux=vx/vl,uy=vy/vl,ang=Math.atan2(uy,ux)*180/Math.PI,fl=Math.abs(ang)>90?-1:1;el.style.width=sz+'px';
  /* the image flies head first (its head is at the right, 30% of its width past the centre) */
  const T2=(x,y,s)=>`translate(${(x-ux*sz*.3-sz/2).toFixed(1)}px,${(y-uy*sz*.3-hh/2).toFixed(1)}px) rotate(${ang.toFixed(1)}deg) scaleY(${fl}) scale(${s})`;
  const dur=1700+Math.random()*900,an=el.animate([{transform:T2(x0,y0,1),opacity:0},{opacity:1,offset:.15},{transform:T2(x1,y1,1),opacity:1}],{duration:dur,easing:'cubic-bezier(.4,0,.9,.6)',fill:'forwards'});
  an.onfinish=()=>{el.animate([{transform:T2(x1,y1,1),opacity:1,filter:'blur(0)'},{transform:T2(x1+dx*3*u,y1+dy*3*u,1.6),opacity:0,filter:'blur(6px)'}],{duration:450,fill:'forwards'}).onfinish=()=>el.remove();
    if(stopR){const b=document.createElement('i');b.className='ash-hit';b.style.left=x1+'px';b.style.top=y1+'px';fx.appendChild(b);setTimeout(()=>b.remove(),700)}
    else{const m=document.querySelector('.ash-man');if(m){m.classList.remove('hurt');void m.offsetWidth;m.classList.add('hurt')}}}}
document.addEventListener('click',e=>{if(!screen.startsWith('adh_')||!adhCardMode())return;const f=e.target.closest('#ashf');if(!f)return;
  if(e.target.closest('button,a,.ash-txt,.ash-end,input'))return;e.stopPropagation();ashTap(screen.slice(4))},true);
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&screen.startsWith('adh_')&&document.getElementById('ashStage'))ashStart(screen.slice(4))});
/* the picture is shown whole (never cropped): as wide as the screen allows, centred; a blurred copy fills the rest */
function ashFit(){const f=document.getElementById('ashf'),st=document.getElementById('ashStage');if(!f||!st)return;
  const W=f.clientWidth,H=f.clientHeight,w=Math.min(W,H*2/3),h=w*1.5;Object.assign(st.style,{width:w+'px',height:h+'px',left:((W-w)/2)+'px',top:((H-h)/2)+'px'});
  f.style.setProperty('--sh',((H-h)/2)+'px');f.style.setProperty('--sw',w+'px')}
addEventListener('resize',()=>{if(document.getElementById('ashf'))ashFit()});
/* a new brick is sent down from the Name of Allah: it leaves the light at the top and settles, glowing, in its place */
function ashFly(el,c){const st=document.getElementById('ashStage');if(!el||!st||!el.animate)return;const w=st.clientWidth,dx=(50-c.x)*w/100,dy=(16.5-c.y)*w/100;
  const nm=document.querySelector('.ash-name');if(nm){nm.classList.remove('give');void nm.offsetWidth;nm.classList.add('give')}
  el.classList.remove('nw');
  el.animate([{translate:`calc(-50% + ${dx}px) calc(-50% + ${dy}px)`,scale:.25,opacity:0,filter:'brightness(3) drop-shadow(0 0 14px #fff3c4)'},
    {opacity:1,scale:.7,offset:.18,filter:'brightness(2.4) drop-shadow(0 0 12px #ffe08a)'},
    {translate:'-50% -50%',scale:'var(--s)',opacity:1,filter:'brightness(var(--b)) drop-shadow(0 0 3px rgba(255,214,130,.9))'}],{duration:900,easing:'cubic-bezier(.35,.1,.25,1)'});
  /* a thin trail of light behind it */
  const t=document.createElement('i');t.className='ash-trail';const L=Math.hypot(dx,dy),an=Math.atan2(-dy,-dx)*180/Math.PI;
  Object.assign(t.style,{left:c.x+'%',top:(c.y/1.5)+'%',width:L+'px',rotate:an+'deg'});document.getElementById('ashFx').appendChild(t);setTimeout(()=>t.remove(),1000)}
