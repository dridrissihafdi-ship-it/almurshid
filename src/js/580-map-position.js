/* ---------- the seeker on the map: exact position between the stations ---------- */
const RM_PTS=[[1530,940],[1490,880],[1430,830],[1400,800],[1395,770],[1415,740],[1480,712],[1530,675],[1510,650],[1460,625],[1400,600],[1395,575],[1430,545],[1490,518],[1520,490],[1490,465],[1440,440],[1380,420],[1345,400],[1335,380],[1350,360],[1400,340],[1460,330],[1510,315],[1520,295],[1480,280],[1420,270],[1370,260],[1350,240],[1365,220],[1415,205],[1480,190],[1350,240],[1320,330],[1290,430],[1230,478],[1110,478],[905,478],[640,478],[440,478],[330,525],[215,540],[170,500],[120,465],[160,330],[165,310],[180,280],[215,172],[238,152]];
const RM_MS=[0,6,13,21,31,36,37,38,43,45,47,48];
const RM_BADGE={aqida:[1437,705],fiqh:[1452,518],tawba:[1398,328],mujahada:[1450,185],jawarih:[1117,402],aql:[910,402],nafs:[645,402],g1:[157,185],g2:[111,342],g3:[133,553],g4:[191,733]};
const RM_ME='<svg viewBox="0 0 60 100" aria-hidden="true"><ellipse cx="30" cy="96" rx="18" ry="4" fill="#000" opacity=".5"/><path d="M12 30 7 96" stroke="#4a3220" stroke-width="3.4" stroke-linecap="round"/><circle cx="12" cy="28" r="3" fill="#ffd98a"/><path d="M33 6c-6 0-11 5-11 11 0 3 1 5 3 7-7 4-11 13-12 25l-3 30h14l3-17 4 17h14l-2-30c-1-12-5-21-12-25 2-2 3-4 3-7 0-6-5-11-11-11z" fill="#3b2a1c" stroke="#ffd98a" stroke-width="2.2" stroke-linejoin="round"/><path d="M24 40c-5 3-8 7-11 12" stroke="#ffd98a" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M24 15c1-6 5-9 9-9 6 0 10 4 11 10-4-2-8-3-10-3-4 0-7 1-10 2z" fill="#ffd98a" opacity=".55"/></svg>';
function rmSeq(P){return [...P[0].steps,...P[1].steps]}
function rmParam(P){const q=rmSeq(P),i=q.findIndex(x=>!x.done);
  if(i>=0)return i+Math.min(.97,Math.max(0,q[i].n/q[i].goal));
  const G=P[2].steps,c=G.filter(x=>x.done).length,u=G.filter(x=>!x.done);
  return Math.min(11,7+c+(u.length?Math.min(.9,u.reduce((s,x)=>s+(x.ind||0),0)/u.length*.9):0))}
function rmShown(P){const p=rmParam(P);if(!(S.rmMax>=p)){S.rmMax=p;save()}return Math.max(p,S.rmMax||0)}
/* point + trail at a position along the path */
function rmAt(p){p=Math.max(0,Math.min(11,p));const a=Math.min(10,Math.floor(p)),f=p-a,n0=RM_MS[a],n1=RM_MS[a+1];
  const seg=[];let tot=0;for(let k=n0;k<n1;k++){const A=RM_PTS[k],B=RM_PTS[k+1],l=Math.hypot(B[0]-A[0],B[1]-A[1]);seg.push([A,B,l]);tot+=l}
  let want=f*tot,pt=RM_PTS[n0],dir=-1,trail=RM_PTS.slice(0,n0+1);
  for(const [A,B,l] of seg){dir=B[0]>A[0]+1?1:B[0]<A[0]-1?-1:dir;if(want<=l){const t=l?want/l:0;pt=[A[0]+(B[0]-A[0])*t,A[1]+(B[1]-A[1])*t];break}want-=l;trail.push(B);pt=B}
  trail.push(pt);return{pt,dir,trail}}
function rmCard(P,cls){const sh=rmShown(P),q=rmSeq(P),w=pathWhere(P),pc=pathPct(P),reg=q.slice(0,Math.floor(sh)).filter(x=>!x.done);
  const a=Math.min(10,Math.floor(sh)),gc=P[2].steps.filter(x=>x.done).length,fr=Math.round((sh-a)*100);
  const ttl=sh>=11?'<span>بلغت قمة جبل الأهداف</span>':a<7?`<span>${(a<4?P[0]:P[1]).t}</span> ← <span>${q[a].t}</span>`:`<span>${P[2].t}</span> · <span class="notr" dir="ltr">${gc} / 4</span>`;
  const card=`<div class="rm-card ${cls||''}" role="status"><small>أنت هنا</small><b>${ttl}</b>${sh<11?`<i class="pth-bar"><i style="width:${fr}%"></i></i>`:''}
    <p><span>تقدّمك في الطريق</span> <span class="notr" dir="ltr">${pc}%</span> ${hintBtn('road')}</p>${reg.length?`<p class="rm-warn"><span>جدّد عهدك هنا:</span> ${reg.map(x=>`<span>${x.t}</span>`).join('، ')}</p>`:''}
    ${w?`<button class="btn small ok" data-go="${reg.length?reg[0].go:w.x.go}">خطوتك التالية</button>`:''}</div>`;
  return card}
function rmLayer(P,mini){const sh=rmShown(P),{pt,dir,trail}=rmAt(sh),q=rmSeq(P),w=pathWhere(P);
  const reg=q.slice(0,Math.floor(sh)).filter(x=>!x.done);
  const ring=(id,cls)=>{const b=RM_BADGE[id];return b?`<circle class="${cls}" cx="${b[0]}" cy="${b[1]}" r="27"/>`:''};
  const rings=[...q,...P[2].steps].map(x=>x.done?ring(x.id,'rm-r-ok'):reg.includes(x)?ring(x.id,'rm-r-warn'):(w&&w.x===x)?ring(x.id,'rm-r-cur'):'').join('');
  const checks=[...q,...P[2].steps].filter(x=>x.done&&RM_BADGE[x.id]).map(x=>{const b=RM_BADGE[x.id];return `<g transform="translate(${b[0]+22},${b[1]-22})"><circle r="12" fill="#3E8C5A" stroke="#fff" stroke-width="2.5"/><path d="M-5.5 0l3.6 3.8 6.6-7.6" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/></g>`}).join('');
  const pts=a=>a.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ');
  const rest=[pt,...RM_PTS.slice(RM_MS[Math.min(10,Math.floor(sh))]+1)];
  return `<svg class="rm-ov" viewBox="0 0 1672 941" preserveAspectRatio="none" aria-hidden="true"><defs><filter id="rmgl${mini?'m':''}"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
    <polyline class="rm-rest" points="${pts(rest)}"/><polyline class="rm-done" points="${pts(trail)}" filter="url(#rmgl${mini?'m':''})"/>${rings}${checks}</svg>
   <button class="rm-me${dir>0?' flip':''}" data-rmme="1" data-p="${sh}" style="left:${pt[0]/16.72}%;top:${pt[1]/9.41}%" aria-label="${esc(Tx('أنت هنا'))}"><i class="rm-halo"></i>${RM_ME}</button>${mini==='zoom'?rmCard(P):''}`}
/* walk from where the seeker was last seen to where he is now */
function rmAnim(root){(root||document).querySelectorAll('.rm-me').forEach(b=>{const to=+b.dataset.p,from=S.rmSeen==null?to:+S.rmSeen,wrap=b.parentElement,dn=wrap.querySelector('.rm-done'),rs=wrap.querySelector('.rm-rest');
  if(Math.abs(to-from)<.005||!dn)return;const t0=performance.now(),D=Math.min(2600,900+Math.abs(to-from)*700);b.classList.add('walk');
  const pts=a=>a.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ');
  const step=now=>{const k=Math.min(1,(now-t0)/D),e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2,p=from+(to-from)*e,{pt,dir,trail}=rmAt(p);
    b.style.left=pt[0]/16.72+'%';b.style.top=pt[1]/9.41+'%';b.classList.toggle('flip',dir>0);dn.setAttribute('points',pts(trail));
    if(rs)rs.setAttribute('points',pts([pt,...RM_PTS.slice(RM_MS[Math.min(10,Math.floor(p))]+1)]));
    if(k<1&&b.isConnected)requestAnimationFrame(step);else b.classList.remove('walk')};requestAnimationFrame(step)});
  const m=document.querySelector('.rm-me');if(m){S.rmSeen=+m.dataset.p;save()}}
function rmClick(d,t){if(d.rmme){const w=t.parentElement;w&&w.classList.toggle('rm-cardon');return true}
  if(d.auend){const uid=d.auend,g=d.g,E=Object.assign({},(adminData.end||{})[uid]||{});E[g]=!E[g];adminData.end=adminData.end||{};adminData.end[uid]=E;render();
    FB.setEndorse(uid,E).catch(e=>{adminData.msg='تعذّر الحفظ: '+(e.code||e.message);render()});return true}
  return false}
/* the sheikh's confirmation of the four goals (endorse/{uid}, written only by the admin) */
let endLoaded=false;
function endLoad(){if(endLoaded||!AUTH.user||!window.FB||!FB.getEndorse)return;endLoaded=true;
  FB.getEndorse(AUTH.user.uid).then(e=>{const v={};['g1','g2','g3','g4'].forEach(g=>{if(e&&e[g])v[g]=true});if(JSON.stringify(v)!==JSON.stringify(S.endorse||{})){S.endorse=v;save();if(['path','roadmap','home','ahdaf'].includes(screen))render()}}).catch(()=>{endLoaded=false})}
function viewRoadmap(){const P=pathData();endLoad();setTimeout(()=>rmAnim(),90);
  return `<section class="rm">
   <div class="rm-img"><button class="rm-imgb" data-rmzoom="1" aria-label="${esc(Tx('تكبير الخريطة'))}"><img src="roadmap2-s.webp" alt="${esc(Tx('خريطة الطريق إلى رضا الله'))}" width="836" height="470" decoding="async"></button>${rmHot()}${rmLayer(P)}
    <button class="rm-zm" data-rmzoom="1"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5M11 8v6M8 11h6"/></svg><span>تكبير الخريطة</span></button></div>
   ${rmCard(P,'rm-below')}
   <button class="btn ok rm-path" data-go="path">افتح مساري: أين أنا في هذا الطريق؟</button>
   ${SIMPLE()?`<div class="sh sm-sh"><h2>زاد الطريق</h2></div>${smTiles(['h_quran','h_ibadat','h_ruh','h_ilm','tazkiya','tools'])}`:''}${SIMPLE()?'<div hidden>':''}
   <p class="meta rm-how rm-tap"><span class="rm-dot"></span><span>اضغط على أي محطة في الصورة لفتح درسها.</span></p>
   <p class="meta rm-how">يبدأ السالك من جبل الشروط، ثم يعبر جسر التزكية مرحلةً مرحلة، حتى يبلغ جبل الأهداف.</p>
   <ol class="rm-st">${RM.map((g,k)=>`<li class="box rm-g0 ${g.c}"><div class="rm-h"><span class="rm-n">${k+1}</span><span><b>${g.t}</b><small>${g.sub}</small></span></div>
    <ol class="rm-it">${g.it.map((x,j)=>RM_GO[x]?`<li><button class="rm-lnk" data-go="${RM_GO[x].go}"><span class="rm-k">${j+1}</span><span class="rm-lt"><span>${x}</span><small>${RM_GO[x].s}</small></span>${RM_GO[x].r?'<svg class="rm-hp" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5c2.7-1 5.3-1 8 .8v13c-2.7-1.8-5.3-1.8-8-.8zM20 5.5c-2.7-1-5.3-1-8 .8v13c2.7-1.8 5.3-1.8 8-.8z"/></svg>':RM_GO[x].v?'<svg class="rm-hp" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M10.5 9.5v5l4.2-2.5z" fill="currentColor"/></svg>':'<svg class="rm-hp" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4.5" height="6.5" rx="1.5"/><rect x="16.5" y="14" width="4.5" height="6.5" rx="1.5"/></svg>'}</button></li>`:`<li><span class="rm-k">${j+1}</span><span>${x}</span></li>`).join('')}</ol></li>`).join('')}</ol>
  ${SIMPLE()?'</div>':''}
  </section>`}
function rmZoom(){const o=document.createElement('div');o.className='rm-full';o.innerHTML=`<div class="rm-sc"><div class="rm-fw"><img src="roadmap2.webp" alt="">${rmHot()}${rmLayer(pathData(),'zoom')}</div></div><button class="rm-x" aria-label="${esc(Tx('إغلاق'))}"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button><p class="rm-tip">${esc(Tx('اسحب لترى الخريطة كاملة'))}</p>`;
  document.body.appendChild(o);const sc=o.querySelector('.rm-sc'),im=sc.querySelector('img');
  const fit=()=>{sc.scrollLeft=sc.scrollWidth}; im.complete?requestAnimationFrame(fit):im.addEventListener('load',fit);
  const close=()=>{o.remove();removeEventListener('keydown',esc_)};const esc_=e=>{if(e.key==='Escape')close()};addEventListener('keydown',esc_);
  o.querySelector('.rm-x').addEventListener('click',close);o.querySelectorAll('.rm-hs').forEach(b=>b.addEventListener('click',()=>setTimeout(close,0)));setTimeout(()=>{const t=o.querySelector('.rm-tip');if(t)t.classList.add('off')},2600)}

/* video lessons (Maliki fiqh): files live in video/<series>/NN - title.mp4, with an optional same-name .jpg poster */
const FQ_K='الفقه_المالكي',FQ_BY='الشيخ نايف آل الشيخ مبارك';let vdCat=null,vdCur=null;
function vdSt(){if(!S.vd)S.vd={pos:{},done:{}};return S.vd}
const vdList=k=>(vdCat||[]).filter(p=>p.startsWith('video/'+k+'/')&&/\.mp4$/i.test(p)).sort((a,b)=>a.localeCompare(b,'en',{numeric:true}));
const vdTitle=p=>auInv(p.split('/').pop()).replace(/\.mp4$/i,'').replace(/^\d+\s*-\s*/,'').replace(/\s+-\s+/,': ');
const vdPoster=p=>{const j=p.replace(/\.mp4$/i,'.jpg');return (vdCat||[]).includes(j)?auUrl(j):''};
function viewFiqh(){return viewVideo(FQ_K,FQ_BY)}
function viewVideo(K,BY){
  let c=null;try{c=JSON.parse(localStorage.getItem('murshid-au-cat2')||'null')}catch(e){}
  if(!vdCat||!c||!c.vid||Date.now()-(c.at||0)>20*60e3)setTimeout(()=>auLoad(!c||!c.vid),0);
  const L=vdList(K),v=vdSt(),cur=vdCur&&L.includes(vdCur)?vdCur:null;
  const now=cur?`<div class="box vd-now"><video id="vdV" src="${auUrl(cur)}" ${vdPoster(cur)?`poster="${vdPoster(cur)}"`:''} controls playsinline preload="metadata"></video>
    <div class="vd-nt"><small><span>الدرس</span> ${L.indexOf(cur)+1}</small><h2 class="notr" dir="rtl">${esc(vdTitle(cur))}</h2><p class="meta">${esc(BY||'')}</p></div></div>`:'';
  const list=!vdCat?'<p class="muted">جاري تحميل قائمة الدروس…</p>':!L.length?`<div class="box pad"><p>ستُضاف الدروس قريبًا بإذن الله.</p>${isAdmin()?`<p class="meta notr" dir="rtl">لإضافة درس: ارفع الفيديو داخل المجلد video/${K} في المستودع، مثال: video/${K}/04 - عنوان الدرس.mp4</p>`:''}</div>`:
    `<div class="vd-list">${L.map((p,i)=>{const on=p===cur,ps=vdPoster(p),st=v.done[p]?'✓':v.pos[p]>5?auFmt(v.pos[p]):'';
      return `<button class="vd-row${on?' on':''}" data-vdplay="${esc(p)}"><span class="vd-th">${ps?`<img src="${ps}" alt="" loading="lazy">`:''}<span class="vd-pi">${AU_IC.play}</span></span>
       <span class="vd-rt"><small><span>الدرس</span> ${i+1}</small><b class="notr" dir="rtl">${esc(vdTitle(p))}</b>${st?`<span class="vd-st notr" dir="ltr">${st}</span>`:''}</span></button>`}).join('')}</div>`;
  return `${auErr&&!vdCat?`<p class="muted au-err">${esc(auErr)}</p>`:''}${now}<div class="sh" style="margin:18px 2px 10px"><h2>الدروس</h2><button class="au-chip" data-vdrefresh="1" ${auBusy?'disabled':''}>تحديث القائمة</button></div>${list}
   <p class="meta" style="margin-top:14px">${esc(BY||'')}</p>`}
function vdBind(){const el=document.getElementById('vdV');if(!el||el.dataset.b)return;el.dataset.b=1;const p=vdCur,v=vdSt();let last=0;
  el.addEventListener('loadedmetadata',()=>{const t=v.pos[p];if(t>5&&t<el.duration-5)el.currentTime=t});
  el.addEventListener('play',()=>{try{if(AU.src&&!AU.paused){auStore(true);AU.pause()}}catch(e){}try{if(ADP.on)adStop()}catch(e){}});
  el.addEventListener('timeupdate',()=>{if(Date.now()-last>5000){last=Date.now();v.pos[p]=el.currentTime;save()}});
  el.addEventListener('pause',()=>{v.pos[p]=el.currentTime;save()});
  el.addEventListener('ended',()=>{v.done[p]=1;delete v.pos[p];save()})}
