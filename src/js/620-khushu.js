const KL=()=>KHD[LANG]||KHD.ar,KA=KHD.ar,KU=k=>{const u=KL().u||{};return u[k]!=null?u[k]:KA.u[k]};
const alhRing=(id,p)=>`<div class="alh" id="${id}" style="--p:${p}" aria-hidden="true"><i class="alh-t"></i><i class="alh-p"></i><i class="alh-c"></i></div>`;
const khS=s=>`<span class="notr" dir="auto">${s}</span>`;
let khTab='prep',khPr=null,khRk=null,khStill=0,khStillT=null,khRate=null;
const khPN=k=>{const n=(FIVE.find(f=>f[0]===k)||[k,k])[1];return LANG==='ar'?'صلاة '+n:Tx(n)};
const khDayN=d=>Math.floor(Date.parse(d+'T12:00:00Z')/864e5);
const khRuknOf=(k,d)=>(khDayN(d||TODAY)*5+FIVE.findIndex(f=>f[0]===k))%KA.rukn.length;
function khNow(){const pt=prayerTimes(new Date()),h=dH(),pr=(dayLog().prayers||[]);
  const due=FIVE.filter(([k])=>!pr.includes(k)&&h>=pt[k]).map(f=>f[0]).pop();
  if(due)return{k:due,due:true,t:pt[due]};const n=FIVE.find(([k])=>h<pt[k]);const k=n?n[0]:'fajr';return{k,due:false,t:pt[k]}}
function khLogs(n){const out=[];for(let i=0;i<n;i++){const d=ds(new Date(Date.now()-i*DAY)),L=S.log[d];out.push([d,(L&&L.khs)||{}])}return out}
function khStats(){const W=khLogs(7),per={},dist={},rk={};let sum=0,cnt=0;
  W.forEach(([d,K])=>Object.entries(K).forEach(([k,x])=>{if(!x||!x.h)return;(per[k]=per[k]||[]).push(x.h);sum+=x.h;cnt++;(x.d||[]).forEach(i=>{if(i!=='none')dist[i]=(dist[i]||0)+1});if(x.r)rk[x.r]=(rk[x.r]||0)+1}));
  const avgOf=a=>a.reduce((s,v)=>s+v,0)/a.length,top=o=>Object.entries(o).sort((a,b)=>b[1]-a[1])[0];
  const pa=Object.entries(per).map(([k,a])=>[k,avgOf(a)]).sort((a,b)=>a[1]-b[1]);
  return{cnt,avg:cnt?sum/cnt:0,per:Object.fromEntries(pa),weak:pa.length>1?pa[0][0]:null,dist:top(dist),rk:top(rk)}}
const khF1=v=>(Math.round(v*10)/10).toString();
function khTabs(){const T=[['prep','tPrep'],['arkan','tArkan'],['mine','tMine'],['prog','tProg']];
  return `<div class="rtabs kh-tabs" role="tablist">${T.map(([k,l])=>`<button role="tab" class="${khTab===k?'on':''}" aria-selected="${khTab===k}" data-khtab="${k}">${khS(KU(l))}</button>`).join('')}</div>`}
function viewKhushu(){const X=KL();
  const head=LANG!=='ar'?`<div class="box pad kh-ay"><p class="notr" dir="auto">${X.ayahT}</p><small class="notr" dir="auto">${X.ayahSrc}</small></div>`:'';
  const body=khTab==='arkan'?khArkan():khTab==='mine'?khMine():khTab==='prog'?khProg():khPrep();
  return `<section class="kh kh-${LANG}">${khTabs()}${khTab==='prep'?head:''}${body}</section>`}
function khPrep(){const X=KL(),N=khNow(),k=khPr||N.k,pt=prayerTimes(new Date()),ri=khRuknOf(k),R=KA.rukn[ri],RX=X.rukn[ri];
  const chips=`<div class="kh-chips">${FIVE.map(([p])=>`<button class="kh-chip${p===k?' on':''}" data-khpr="${p}">${khS(Tx(FIVE.find(x=>x[0]===p)[1]))}<small dir="ltr">${hm(pt[p])}</small></button>`).join('')}</div>`;
  const ring=`<div class="kh-still">${alhRing('khAlh',khStill?(60-khStill)/60*100:0)}<div class="kh-tm"><b id="khSec" dir="ltr">${khStill?'0:'+String(khStill).padStart(2,'0'):'1:00'}</b><small class="notr" dir="auto">${KU('still')}</small></div></div>`;
  const card=(c,i)=>`<div class="box pad kh-c tts-s"><h3 class="notr" dir="auto">${c.t}</h3><p class="notr" dir="auto">${c.x}</p>${c.q?`<p class="kh-q notr" dir="auto">${c.q}</p><small class="notr" dir="auto">${c.src}</small>`:''}</div>`;
  return `<div class="box pad kh-hd"><small class="notr" dir="auto">${!khPr||khPr===N.k?(N.due?KU('now'):KU('next')):KU('pick')}</small><b class="notr" dir="auto">${KU('prepH')} · ${khPN(k)}</b><span dir="ltr">${hm(pt[k])}</span></div>${chips}
   ${ttsBtn()}<p class="muted notr tts-s" dir="auto">${X.lead}</p>
   ${X.prep.map(card).join('')}
   <div class="box pad kh-c kh-focus tts-s"><h3 class="notr" dir="auto">◆ ${KU('prepRukn')}</h3><p class="notr" dir="auto">${KU('prepRuknX')} <b>${RX.n}</b> — ${RX.hal}.</p><button class="btn small" data-khrk="${ri}">${khS(KU('openRukn'))}</button></div>
   ${ring}<div class="btns kh-btns">${khStill?'':`<button class="btn" data-khstill="1">${khS(KU('startStill'))}</button>`}<button class="btn primary" data-khready="${k}">${khS(KU('ready'))}</button></div>
   ${(dayLog().khp||[]).includes(k)?`<p class="logged notr" dir="auto">${KU('readyDone')}</p>`:''}`}
function khArkan(){const X=KL(),i=khRk==null?0:khRk,R=KA.rukn[i],RX=X.rukn[i],n=KA.rukn.length;
  const chips=`<div class="kh-chips kh-rk">${KA.rukn.map((r,j)=>`<button class="kh-chip${j===i?' on':''}" data-khrk="${j}">${khS(X.rukn[j].n)}</button>`).join('')}</div>`;
  const fat=R.id==='qiyam'?`<div class="box pad kh-c kh-fat tts-s"><h3 class="notr" dir="auto">${KU('fatH')}</h3><p class="kh-q notr" dir="auto">${X.fatQ}</p><small class="notr" dir="auto">${X.fatSrc}</small>
     <ol class="kh-dl">${KA.fat.map((a,j)=>`<li><span class="kh-you"><em class="notr">${X.fatYou}</em><b class="kh-v notr">${a[0]}</b>${LANG!=='ar'?`<i class="notr" dir="auto">${X.fat[j][0]}</i>`:''}</span><span class="kh-he"><em class="notr">${X.fatHe}</em><b class="notr" dir="auto">${LANG==='ar'?a[1]:X.fat[j][1]}</b></span></li>`).join('')}</ol></div>`:'';
  return `<p class="muted notr" dir="auto">${KU('arkanLead')}</p>${chips}${ttsBtn()}
   <div class="box pad kh-card tts-s"><small class="kh-lbl notr" dir="auto">${KU('hal')}</small><h3 class="notr" dir="auto">${RX.hal}</h3><p class="kh-dh notr">${R.dh}</p>${LANG!=='ar'?`<p class="kh-dhm notr" dir="auto">${RX.dhm}</p>`:''}
    <p class="notr" dir="auto">${RX.x}</p><p class="kh-q notr" dir="auto">${LANG==='ar'?R.q:RX.q}</p><small class="notr" dir="auto">${LANG==='ar'?R.src:RX.src}</small></div>${fat}
   <div class="kh-nav"><button class="btn" data-khrk="${(i+n-1)%n}">${khS((RTL()?'› ':'‹ ')+X.rukn[(i+n-1)%n].n)}</button><button class="btn" data-khrk="${(i+1)%n}">${khS(X.rukn[(i+1)%n].n+(RTL()?' ‹':' ›'))}</button></div>`}
function khMine(){const X=KL(),st=khStats(),L=dayLog(),K=L.khs||{},pr=L.prayers||[];
  const today=`<div class="sh"><h2 class="notr" dir="auto">${KU('today')}</h2></div><div class="box kh-today">${FIVE.map(([k])=>{const x=K[k];return `<div class="kh-trow"><span class="notr" dir="auto">${khPN(k)}</span>${x&&x.h?`<b class="kh-h${x.h}">${khS(X.scale[x.h-1])}</b><button class="btn small" data-khrate="${k}">${khS(KU('edit'))}</button>`:pr.includes(k)?`<button class="btn small ok" data-khrate="${k}">${khS(KU('rateNow'))}</button>`:'<i class="kh-dash">—</i>'}</div>`}).join('')}</div>`;
  if(!st.cnt)return today+`<p class="muted notr" dir="auto" style="margin-top:14px">${KU('noData')}</p>${khAskRow()}`;
  const bars=`<div class="kh-bars">${FIVE.map(([k])=>{const v=st.per[k]||0;return `<div><b dir="ltr">${v?khF1(v):''}</b><s style="height:${Math.max(4,v/5*96)}px;${v?'':'opacity:.25'}"></s><span class="notr" dir="auto">${Tx(FIVE.find(f=>f[0]===k)[1])}</span></div>`}).join('')}</div>`;
  const D=st.dist&&X.dist.find((x,j)=>KA.dist[j].id===st.dist[0]),Rk=st.rk&&X.rukn[KA.rukn.findIndex(r=>r.id===st.rk[0])];
  const sum=[st.dist?`<li><small class="notr" dir="auto">${KU('mostDist')}</small><b class="notr" dir="auto">${D.t}</b>${D.tip?`<p class="notr" dir="auto">${D.tip}</p>`:''}</li>`:'',st.weak?`<li><small class="notr" dir="auto">${KU('weakest')}</small><b class="notr" dir="auto">${khPN(st.weak)} · <span dir="ltr">${khF1(st.per[st.weak])} / 5</span></b></li>`:'',Rk?`<li><small class="notr" dir="auto">${KU('strongest')}</small><b class="notr" dir="auto">${Rk.n}</b></li>`:''].join('');
  return today+`<div class="sh" style="margin-top:20px"><h2 class="notr" dir="auto">${KU('mineH')}</h2></div><div class="box pad"><div class="kh-avg"><span class="notr" dir="auto">${KU('avg')}</span><b dir="ltr">${khF1(st.avg)} / 5</b></div>${bars}</div>
   ${sum?`<div class="sh" style="margin-top:20px"><h2 class="notr" dir="auto">${KU('sumH')}</h2></div><ul class="box pad kh-sum tts-s">${sum}</ul>`:''}${khAskRow()}`}
function khAskRow(){const P=pushPrefs();return `<label class="wird kh-ask" for="khAsk"><input type="checkbox" id="khAsk" data-khask="1" ${S.khAsk!==false?'checked':''}><span class="t notr" dir="auto">${KU('askAfter')}</span></label>${P.enabled&&P.on.khushu===true?'':`<p class="meta notr" dir="auto">${KU('remindNote')}</p><div class="btns"><button class="btn small" data-khpush="1">${khS(KU('remindGo'))}</button></div>`}`}
function khProgDay(){if(!S.khP||!S.khP.start)return 0;return khDayN(TODAY)-khDayN(S.khP.start)+1}
function khProg(){const X=KL(),d=khProgDay(),cur=KA.prog.findIndex(p=>d>=p.d[0]&&d<=p.d[1]);
  const stage=(p,i)=>{const PX=X.prog[i],on=i===cur;return `<div class="box pad kh-st${on?' on':''}${d>KA.prog[i].d[1]?' done':''} ${on?'tts-s':''}"><div class="kh-sth"><span class="notr" dir="auto">${KU('stage')} ${i+1} · ${KU('days')} <span dir="ltr">${p.d[0]}–${p.d[1]}</span></span>${on?`<em class="notr">${KU('current')}</em>`:d>p.d[1]?'<em>✓</em>':''}</div><h3 class="notr" dir="auto">${PX.t}</h3>${on||!d?`<p class="notr" dir="auto">${PX.x}</p>`:''}${on&&PX.q?`<p class="kh-q notr" dir="auto">${LANG==='ar'?KA.prog[i].q:PX.q}</p><small class="notr" dir="auto">${LANG==='ar'?KA.prog[i].src:PX.src}</small>`:''}${on?`<h4 class="notr" dir="auto">${KU('practice')}</h4><ul class="kh-do">${PX.do.map(t=>`<li class="notr" dir="auto">${t}</li>`).join('')}</ul>`:''}</div>`};
  const top=!d?`<p class="muted notr" dir="auto">${KU('progLead')}</p><div class="btns"><button class="btn primary" data-khpstart="1">${khS(KU('progStart'))}</button></div>`
    :d>40?`<div class="box pad kh-hd"><b class="notr" dir="auto">${KU('progDone')}</b></div><div class="btns"><button class="btn" data-khpstart="1">${khS(KU('progRestart'))}</button></div>`
    :`<div class="box pad kh-hd"><small class="notr" dir="auto">${KU('progH')}</small><b class="notr" dir="auto">${KU('day')} <span dir="ltr">${d}</span> ${KU('of')} <span dir="ltr">40</span></b><div class="kh-pg"><s style="width:${d/40*100}%"></s></div></div>`;
  return `${top}${d&&d<=40?ttsBtn():''}${KA.prog.map(stage).join('')}${d?`<div class="btns"><button class="btn small" data-khpstart="1">${khS(KU('progRestart'))}</button></div>`:''}`}
/* the after-prayer sheet */
function khRateHtml(){const X=KL(),r=khRate,Q=[[1,0,'😔'],[3,2,'😐'],[5,4,'😊']];
  /* step 1: one tap, three answers (غائب / متقطّع / خاشع = 1, 3, 5 on the old scale). Present: saved at once. Otherwise: what distracted you? */
  const lv=r.h?(r.h<=2?1:r.h>=4?5:3):0,two=lv&&lv<5;
  return `<div class="kh-rt"><div class="bs-top"><h2 class="notr" dir="auto">${KU('after')} ${khPN(r.k)}</h2></div>
   <p class="kh-lbl notr" dir="auto">${KU('rateH')}</p><div class="kh-q3">${Q.map(([v,s,f])=>`<button class="${lv===v?'on':''}" data-khq="${v}"><i aria-hidden="true">${f}</i><span class="notr" dir="auto">${X.scale[s]}</span></button>`).join('')}</div>
   ${two?`<p class="kh-lbl notr" dir="auto">${KU('distH')}</p><div class="kh-chips kh-wrap">${KA.dist.map((x,i)=>x.id==='none'?'':`<button class="kh-chip${r.d.includes(x.id)?' on':''}" data-khd="${x.id}">${khS(X.dist[i].t)}</button>`).join('')}</div>
   ${(()=>{const j=KA.dist.findIndex(x=>r.d.includes(x.id)&&x.id!=='none');return j>=0&&X.dist[j].tip?`<div class="box pad kh-tip"><small class="notr" dir="auto">${KU('tip')}</small><p class="notr" dir="auto">${X.dist[j].tip}</p></div>`:''})()}
   <div class="btns"><button class="btn primary" data-khsave="1">${khS(KU('save'))}</button><button class="btn" data-bsx="1">${khS(KU('skip'))}</button></div>`
   :`<div class="btns"><button class="btn" data-bsx="1">${khS(KU('skip'))}</button></div>`}${r.day===TODAY?`<button class="lnk kh-never" data-khnever="1">${esc(Tx('لا تسألني بعد كل صلاة'))}</button>`:''}</div>`}
function khRateOpen(k,d){const L=S.log[d||TODAY]||{},x=(L.khs||{})[k]||{};khRate={k,day:d||TODAY,h:x.h||0,d:(x.d||[]).slice(),r:x.r||null};sheetOpen(khRateHtml(),'tall')}
function khRateRedraw(){const o=document.querySelector('#bsheet .kh-rt');if(o)o.outerHTML=khRateHtml()}
function khStillTick(){khStill--;const a=document.getElementById('khAlh'),s=document.getElementById('khSec');
  if(khStill<=0||!a){clearInterval(khStillT);khStillT=null;khStill=0;if(a&&screen==='khushu'){try{navigator.vibrate&&navigator.vibrate(60)}catch(e){}render()}return}
  a.style.setProperty('--p',(60-khStill)/60*100);if(s)s.textContent='0:'+String(khStill).padStart(2,'0')}
function khClick(d){
  if(d.khtab){khTab=d.khtab;if(khTab!=='prep'){clearInterval(khStillT);khStill=0}render();SCR().scrollTo(0,0);return true}
  if(d.khpush){try{aboutOpen.add('push')}catch(e){}go('profile');return true}
  if(d.khmine){khTab='mine';go('khushu');return true}
  if(d.khgo){khPr=d.khgo;khTab='prep';go('khushu');return true}
  if(d.khpr){khPr=d.khpr;render();return true}
  if(d.khrk!==undefined){khRk=+d.khrk;if(khTab!=='arkan'){khTab='arkan'}render();SCR().scrollTo(0,0);return true}
  if(d.khstill){if(TTS_OK&&tts.on)ttsStop();khStill=60;clearInterval(khStillT);khStillT=setInterval(khStillTick,1000);const y=SCR().scrollTop;render();SCR().scrollTo(0,y);return true}
  if(d.khready){const L=dayLog();L.khp=L.khp||[];if(!L.khp.includes(d.khready))L.khp.push(d.khready);save();clearInterval(khStillT);khStill=0;if(TTS_OK&&tts.on)ttsStop();const y=SCR().scrollTop;render();SCR().scrollTo(0,y);return true}
  if(d.khrate){khRateOpen(d.khrate,TODAY);return true}
  if(d.khh&&khRate){khRate.h=+d.khh;khRateRedraw();return true}
  if(d.khq&&khRate){khRate.h=+d.khq;if(khRate.h>=5){khRate.d=['none'];khRate.r=null;return khClick({khsave:'1'})}khRate.d=khRate.d.filter(x=>x!=='none');khRateRedraw();return true}
  if(d.khd&&khRate){const a=khRate.d,id=d.khd;if(id==='none')khRate.d=a.includes('none')?[]:['none'];else{khRate.d=a.filter(x=>x!=='none');const i=khRate.d.indexOf(id);i>=0?khRate.d.splice(i,1):khRate.d.push(id)}khRateRedraw();return true}
  if(d.khr&&khRate){khRate.r=khRate.r===d.khr?null:d.khr;khRateRedraw();return true}
  if(d.khsave&&khRate&&khRate.h){const L=S.log[khRate.day]||(S.log[khRate.day]={awrad:[],heart:null,note:''});L.khs=L.khs||{};L.khs[khRate.k]={h:khRate.h,d:khRate.d,r:khRate.r};save();khRate=null;sheetClose();if(screen==='khushu'||screen==='aamal'||screen==='ruhi'){const y=SCR().scrollTop;render();SCR().scrollTo(0,y)}return true}
  if(d.khpstart){S.khP={start:TODAY};save();render();return true}
  return false}
document.addEventListener('change',e=>{const t=e.target;if(t&&t.dataset&&t.dataset.khask){S.khAsk=t.checked;save()}});
function khAfterPray(k){if(aDate||S.khAsk===false)return;const L=dayLog();if(!(L.prayers||[]).includes(k)||(L.khs&&L.khs[k]&&L.khs[k].h))return;setTimeout(()=>khRateOpen(k,TODAY),260)}
function khAamalLink(){const K=dayLog().khs||{},v=Object.values(K).filter(x=>x&&x.h),a=v.length?v.reduce((s,x)=>s+x.h,0)/v.length:0;
  return `<button class="kh-lnk" data-go="khushu"><span class="h2-ri"><svg viewBox="0 0 24 24" aria-hidden="true">${QI.n_khushu}</svg></span><span class="tx notr" dir="auto">${KU('khLink')}<small>${a?KU('muhLine')+': <span dir="ltr">'+khF1(a)+' / 5</span>':KU('khLinkS')}</small></span><svg class="h2-chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg></button>`}
function khMuhLine(){const K=(dayLog().khs)||{},v=Object.values(K).filter(x=>x&&x.h);if(!v.length)return '';const a=v.reduce((s,x)=>s+x.h,0)/v.length;
  return `<div class="box pad kh-mh"><span class="notr" dir="auto">${KU('muhLine')}: <b dir="ltr">${khF1(a)} / 5</b></span><button class="btn small" data-khmine="1">${khS(KU('open'))}</button></div>`}
const viewKhushuR=()=>{return `<section class="kh kh-${LANG}">${khMine()}<div class="btns"><button class="btn" data-go="khushu">${khS(KU('khLink'))}</button></div></section>`};

