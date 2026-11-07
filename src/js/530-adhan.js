/* ---------- adhan: plays at prayer time while the app is open ---------- */
const ADZ=new Audio();ADZ.preload='none';let adzUnlocked=false,adzShown=null;
function adzP(){S.adhan=S.adhan||{on:false,p:{fajr:true,dhuhr:true,asr:true,maghrib:true,isha:true},played:{}};S.adhan.played=S.adhan.played||{};return S.adhan}
// iPhone only lets a page play sound after a tap: prime the player on the first tap
document.addEventListener('click',()=>{if(adzUnlocked||!(S.adhan&&S.adhan.on))return;adzUnlocked=true;try{ADZ.src='adhan.mp3';ADZ.muted=true;const pr=ADZ.play();if(pr&&pr.then)pr.then(()=>{ADZ.pause();ADZ.currentTime=0;ADZ.muted=false}).catch(()=>{ADZ.muted=false})}catch(e){}},true);
function adzPlay(k){const A=adzP();try{if(AU&&AU.src&&!AU.paused){auStore(true);AU.pause()}}catch(e){}try{if(ADP.on)adStop()}catch(e){}
  ADZ.src='adhan.mp3';ADZ.muted=false;ADZ.currentTime=0;const pr=ADZ.play();if(pr&&pr.catch)pr.catch(()=>{});adzShown=k||null;adzUi()}
function adzStop(){try{ADZ.pause();ADZ.currentTime=0}catch(e){}adzShown=null;adzUi()}
ADZ.addEventListener('ended',()=>{adzShown=null;adzUi()});
function adzUi(){let b=document.getElementById('adzBar');const on=!ADZ.paused;if(!on&&!adzShown){if(b)b.remove();return}
  if(!b){b=document.createElement('div');b.id='adzBar';b.className='adz';document.body.appendChild(b);b.addEventListener('click',e=>{if(e.target.closest('[data-adzstop]'))adzStop()})}
  const PN=Object.fromEntries(FIVE);b.dir=RTL()?'rtl':'ltr';
  b.innerHTML=`<span class="adz-i">🕌</span><span class="adz-t"><b>${Tx(adzShown?'حان الآن وقت صلاة':'الأذان')} ${adzShown?Tx(PN[adzShown]):''}</b><small>${Tx('«أرحنا بها يا بلال»')}</small></span><button class="adz-x" data-adzstop="1" aria-label="${esc(Tx('إيقاف'))}"><svg viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"/></svg></button>`}
function adzTick(){const A=adzP();if(!A.on)return;const now=new Date(),h=now.getHours()+now.getMinutes()/60+now.getSeconds()/3600,pt=ptDay(),key=TODAY;
  for(const [k] of FIVE){if(!A.p[k])continue;const d=h-pt[k];if(d>=0&&d<2/60&&A.played[key+k]!==1){A.played={[key+k]:1,...Object.fromEntries(Object.entries(A.played).filter(([x])=>x.startsWith(key)))};save();adzPlay(k);break}}}
setInterval(adzTick,15000);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')setTimeout(adzTick,800)});
/* adhan screen: a quiet full-screen clock that keeps the app awake so the adhan can sound (phone on charger) */
function adzBox(){const A=adzP(),PN=Object.fromEntries(FIVE),pt=prayerTimes(new Date());
  return `<div class="box pad adz-box"><label class="adz-sw"><input type="checkbox" data-adzon="1" ${A.on?'checked':''}><span><b>الأذان عند دخول الوقت</b><small>يُرفع الأذان في وقت كل صلاة ما دام التطبيق مفتوحًا.</small></span></label>
   ${A.on?`<div class="adz-ps">${FIVE.map(([k,n])=>`<label class="mine-d"><input type="checkbox" data-adzp="${k}" ${A.p[k]?'checked':''}><span>${n} <span class="notr" dir="ltr">${hm(pt[k])}</span></span></label>`).join('')}</div>`:''}
   <div class="btns"><button class="btn small" data-adztest="1">${!ADZ.paused?'إيقاف':'استمع إلى الأذان'}</button></div>
   <p class="meta" style="margin:6px 0 0">عندما يكون التطبيق مغلقًا لا يسمح الهاتف بتشغيل الأذان، فيصلك التذكير بصوت الإشعار العادي إن فعّلته.</p></div>`}
function adzClick(d){if(d.adztest){if(!ADZ.paused)adzStop();else adzPlay(null);const y=SCR().scrollTop;render();SCR().scrollTo(0,y);return true}return false}
