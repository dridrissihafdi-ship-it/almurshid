function tabOf(s){if(s.startsWith('adh_')||['dhikr_run','khalwa','aamal'].includes(s))return 'aamal';
  if(['tazkiya','organ','method','tawba','mujahada','ikhlas','ikhl','ikhub','sirr'].includes(s))return 'tazkiya';if(['quran','mushaf'].includes(s))return 'quran';
  if(isMedia(s)||['qa','qalb','umrah','maraka','sira','qiyama','series','h_ruh','h_ilm','mraqib','munajat'].includes(s))return 'more';return 'home'}
/* the background follows the time of day: dawn, day, sunset, night */
function ptKind(){const n=new Date(),h=n.getHours()+n.getMinutes()/60,pt=prayerTimes(n);return h<pt.fajr?'isha':h<pt.sunrise+.5?'fajr':h<pt.asr?'dhuhr':h<pt.maghrib-.4?'asr':h<pt.isha?'maghrib':'isha'}
function skyKind(){const n=new Date(),h=n.getHours()+n.getMinutes()/60,pt=prayerTimes(n);
  return h>=pt.fajr&&h<pt.sunrise+.5?'fajr':h>=pt.sunrise+.5&&h<pt.maghrib-.6?'day':h>=pt.maghrib-.6&&h<pt.isha?'maghrib':'night'}
function render(){
  if(screen!=='mushaf'||!S.mshFocus)document.body.classList.remove('msh-focus','msh-show');
  if(navRoute&&!gated()&&typeof VIEWS!=='undefined'){const r=navRoute;navRoute=null;if(VIEWS[r]&&r!==screen){setTimeout(()=>go(r),0)}}
  navSync();const app=document.getElementById('app'),nav0=document.querySelector('nav.tabs');
  if(gated()){document.documentElement.dataset.scr='home';document.documentElement.dataset.sky=skyKind();document.documentElement.dataset.pt=ptKind();app.innerHTML=viewAuth();nav0.hidden=true;const rtl=RTL();app.dir=rtl?'rtl':'ltr';app.lang=LANG;document.documentElement.lang=LANG;document.documentElement.dir=rtl?'rtl':'ltr';i18nApply(app);return}
  if(needOnboard()){app.innerHTML=viewOnboard();nav0.hidden=true;const rtl=RTL();app.dir=rtl?'rtl':'ltr';app.lang=LANG;document.documentElement.lang=LANG;document.documentElement.dir=rtl?'rtl':'ltr';i18nApply(app);return}
  if(screen==='admin'&&!isAdmin())screen='home';
  const keepV=isMedia(screen)?document.getElementById('mqVideo'):null,keepU=screen==='umrah'?document.getElementById('umVideo'):null,keepF=(screen==='fiqh'||screen==='series')?document.getElementById('vdV'):null;
  app.innerHTML=screen==='home'?viewHome():heroSub(screen)+`<main class="sheet">${scrBan(screen)}${VIEWS[screen]()}</main>`;
  fzApply();
  const navKey=tabOf(screen);document.documentElement.dataset.sky=skyKind();document.documentElement.dataset.pt=ptKind();document.documentElement.dataset.scr=screen;
  document.querySelectorAll('[data-nav]').forEach(b=>b.toggleAttribute('aria-current',b.dataset.nav===navKey)||b.dataset.nav===navKey&&b.setAttribute('aria-current','page'));
  document.querySelectorAll('[data-nav]').forEach(b=>{const k=SIMPLE()?tabS(screen):['home','aamal','tazkiya','quran'].includes(navKey)?navKey:'more';if(b.dataset.nav===k)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});
  const rtl=RTL(),nav=document.querySelector('nav.tabs');
  [app,nav].forEach(el=>{el.dir=rtl?'rtl':'ltr';el.lang=LANG});document.documentElement.lang=LANG;document.documentElement.dir=rtl?'rtl':'ltr';
  document.title=['المرشد','Al-Murshid','Al-Murshid','Al-Murshid','Аль-Муршид'][rtl?0:LIDX[LANG]+1];
  nav.querySelectorAll('[data-nav]').forEach(b=>{b.dataset.al=b.dataset.al||b.getAttribute('aria-label');b.setAttribute('aria-label',b.dataset.al)});
  nav.querySelectorAll('[data-nav] span').forEach(s=>{s.dataset.ar=s.dataset.ar||s.textContent;s.textContent=s.dataset.ar});
  edApply(app);edApply(nav);iconize(app);i18nApply(app);i18nApply(nav);if(LANG!=='ar')app.querySelectorAll('.btn-ic[title]').forEach(b=>b.title=b.getAttribute('aria-label'));edBar();
  nav.hidden=screen==='dhikr_run'||(screen==='mushaf'&&mshAuto);
  if(isMedia(screen)){const ph=document.getElementById('mqVideo');if(keepV&&ph&&keepV!==ph&&keepV.getAttribute('src')===ph.getAttribute('src'))ph.replaceWith(keepV);mqBind()}
  if(keepU){const ph=document.getElementById('umVideo');if(ph&&ph!==keepU)ph.replaceWith(keepU)}
  if(screen==='fiqh'||screen==='series'){const ph=document.getElementById('vdV');if(keepF&&ph&&keepF!==ph&&keepF.getAttribute('src')===ph.getAttribute('src'))ph.replaceWith(keepF);vdBind()}
  if(screen==='dhikr_run')paintRun();if(screen==='amrad')amBind();
  auUi();try{sndUi()}catch(e){}
  const bd=document.getElementById('badge');if(bd)bd.hidden=!(pendingOrgans().length||prepPendingToday()||!lights().halo);
}
function go(s){if(s==='amrad')s='uyub';if(s==='qalb'){s='uyub';uyF=null;uyProg=true}else if(s==='uyub'){uyF=null;uyProg=false}if(s==='ijtihad'){ruhiTab='week';wkOff=0;goRaw('ruhi');return}if(s==='sura'||s==='muraqabat'||s==='tahlil'){ruhiTab=s;s='ruhi'}if(s==='taammulat')s='h_ruh';if(s==='h_quran')s='quran';if(s==='khr'){khTab='mine';s='khushu'}if(s==='aql'){tzTab='aql';s='tazkiya'}if(/^g[1-4]$/.test(s)){ahTab=s;s='ahdaf'}if(s==='majalis'&&screen!=='majalis')majTab=null;if(s==='jawarih'){tzTab='jawarih';s='tazkiya'}if(s==='qalbruh'){tzTab='qalb';s='tazkiya'}goRaw(s)}
const NAVH=[];let navBack=false,navRoute=null;
function navUrl(s){try{const u=s==='home'?location.pathname+location.search:'#/'+s;if(navBack||!history.state)history.replaceState({s},'',u);else history.pushState({s},'',u)}catch(e){}}
(function(){const m=/^#\/([a-z_0-9]+)$/.exec(location.hash);if(m)navRoute=m[1];try{history.replaceState({s:'home'},'',m||!location.hash?location.pathname+location.search:location.href)}catch(e){}})();
window.addEventListener('popstate',()=>{if(gated())return;const o=document.getElementById('bsheet');if(o&&!o.hidden){sheetClose();try{history.pushState({s:screen},'',screen==='home'?location.pathname:'#/'+screen)}catch(e){}return}
  let prev=null;while(NAVH.length){const x=NAVH.pop();if(x&&x!==screen){prev=x;break}}if(!prev&&screen==='home')return;navBack=true;try{go(prev||'home')}finally{navBack=false}});
function goRaw(s){try{sheetClose()}catch(e){}if(s!=='tasmi'&&typeof tsStop==='function'){tsStop();tsRes=null}if((s==='adh_sabah'||s==='adh_masa'||s==='mushaf')&&s!==screen)try{niyaStart(s)}catch(e){}if(s!==screen&&!navBack){NAVH.push(screen);if(NAVH.length>40)NAVH.shift()}if(s!==screen&&tts.on)ttsStop();if(s!=='mushaf')mshAuto=false;if(s!=='qalb'){qbShowRes=false;qbRetest=null}if(s==='aamal'&&screen!=='aamal')aDate=null;if(s==='tazkiya'&&!['tazkiya','organ'].includes(screen))tzDate=null;if(s!==screen||!isMedia(s)){const v=document.getElementById('mqVideo');if(v&&!v.paused){v.pause();keepAwake(false)}}if(s!=='dhikr_run'&&run&&!run.done&&screen==='dhikr_run'){/* keep running in background */}const moved=s!==screen;screen=s;lightConfirm=null;confirmFor=null;confirmReset=false;redoFor=null;render();SCR().scrollTo(0,0);adhAwake();if(moved)navUrl(s)}
/* keep the screen on while reading the morning / evening adhkar */
