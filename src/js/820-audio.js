/* ---------- listening: lessons uploaded to the repo's audio/ folder ---------- */
const AU_REPO='dridrissihafdi-ship-it/almurshid',AU_EXT=/\.(mp3|m4a|aac|ogg|oga|opus|wav)$/i;
const SIRA_K='السيرة_النبوية_العطرة',QIY_K='يوم_القيامة',AQ_K='العقيدة_الأشعرية',auScr=()=>['audio','sira','qiyama','aqida'].includes(screen)||(screen==='series'&&serCur()&&serCur().kind!=='video'),
 auHome=p=>{p=p&&auInv(p);if(!p)return 'sira';if(p.startsWith('audio/'+QIY_K+'/'))return 'qiyama';if(p.startsWith('audio/'+AQ_K+'/'))return 'aqida';const d=(CONTENT.series||[]).find(x=>x.kind!=='video'&&p.startsWith('audio/'+x.k+'/'));if(d){serSet(d.k);return 'series'}return 'sira'},
 auScrK=k=>k===QIY_K?'qiyama':k===AQ_K?'aqida':(CONTENT.series||[]).some(x=>x.k===k)?'series':'sira';
/* title corrections without re-uploading the file: series → episode number → title */
const AU_T={'السيرة_النبوية_العطرة':{1:'ولادته ونشأته صلى الله عليه وسلم'},'يوم_القيامة':{4:'الجنة والنار: كيف هما في الحقيقة؟'}};
const AU=new Audio();AU.preload='metadata';AU.addEventListener('play',()=>{if(ADP.on)adStop()});
let auCat=null,auBusy=false,auErr='',auOpen={},auLastSave=0;
const auSt=()=>{S.au=S.au||{};const a=S.au;a.pos=a.pos||{};a.dur=a.dur||{};a.done=a.done||{};if(a.auto===undefined)a.auto=true;a.rate=a.rate||1;return a};
const auInv=s=>String(s).replace(/[\u200b-\u200f\u202a-\u202e\u2066-\u2069\ufeff]/g,'');
const auClean=s=>{s=auInv(s);return s.replace(AU_EXT,'').replace(/[_]+/g,' ').trim().replace(/^\d+\s*[-.)ـ–]\s*/,'').replace(/^الحلقة\s+[^\s-–:]+\s*[-–:]\s*/,'').trim()||s}
const auFmt=t=>{t=Math.max(0,Math.floor(t||0));const h=Math.floor(t/3600),m=Math.floor(t%3600/60),s=t%60;return (h?h+':'+String(m).padStart(2,'0'):m)+':'+String(s).padStart(2,'0')};
function auBuild(paths){const by={};
  paths.sort((a,b)=>auInv(a).replace(/\/\s+/g,'/').localeCompare(auInv(b).replace(/\/\s+/g,'/'),'ar',{numeric:true})).forEach(p=>{const parts=p.split('/').slice(1),ser=parts.length>1?auInv(parts[0]).trim():'',f=parts[parts.length-1];
    const num=+((auInv(f).trim().match(/^\d+/)||[])[0]||0),ov=(AU_T[ser]||{})[num];
    (by[ser]=by[ser]||[]).push({p,t:ov||auClean(f),s:ser?ser.replace(/_+/g,' '):'دروس متفرقة'})});
  return Object.keys(by).sort((a,b)=>(a===''?1:b===''?-1:a.localeCompare(b,'ar',{numeric:true}))).map(k=>({n:k?k.replace(/_+/g,' '):'دروس متفرقة',k,items:by[k]}))}
async function auLoad(force){
  if(!auCat){try{const c=JSON.parse(localStorage.getItem('murshid-au-cat2')||'null');if(c){auCat=c.cat;vdCat=c.vid||null;if(!force&&c.vid&&Date.now()-c.at<20*60e3)return}}catch(e){}}
  if(auBusy)return;auBusy=true;auErr='';if(auScr()||screen==='fiqh'||screen==='series')render();
  try{const r=await fetch(`https://api.github.com/repos/${AU_REPO}/git/trees/main?recursive=1`,{cache:'no-store'});
    if(!r.ok)throw new Error(r.status);const j=await r.json();
    auCat=auBuild((j.tree||[]).filter(x=>x.type==='blob'&&/^audio\//.test(x.path)&&AU_EXT.test(x.path)).map(x=>x.path));
    vdCat=(j.tree||[]).filter(x=>x.type==='blob'&&/^video\//.test(x.path)).map(x=>x.path);
    lsSet('murshid-au-cat2',JSON.stringify({at:Date.now(),cat:auCat,vid:vdCat}))}
  catch(e){auErr=navigator.onLine===false?'لا يوجد اتصال بالإنترنت.':'تعذّر تحميل قائمة الدروس. أعد المحاولة بعد قليل.'}
  auBusy=false;if(auScr()||screen==='fiqh'||screen==='series')render()}
const auAll=()=>(auCat||[]).flatMap(g=>g.items);
const auFind=p=>auAll().find(x=>x.p===p);
/* lessons stream from GitHub Pages, which answers byte-range requests (iPhone needs them to play audio/video);
   the new host serves them without ranges for now */
const MEDIA_BASE=/github\.io$|^localhost$|^127\./.test(location.hostname)?'':'https://dridrissihafdi-ship-it.github.io/almurshid/';
const auUrl=p=>MEDIA_BASE+p.split('/').map(encodeURIComponent).join('/');
function auNext(p,d){for(const g of auCat||[]){const i=g.items.findIndex(x=>x.p===p);if(i>-1)return g.items[i+d]||null}return null}
function auPlay(p,from){const a=auSt(),it=auFind(p)||{p,t:auClean(p.split('/').pop()),s:''};
  if(a.last!==p||!AU.src){a.last=p;a.lastT=it.t;a.lastS=it.s;AU.src=auUrl(p);
    const start=from!==undefined?from:(a.pos[p]||0);AU.addEventListener('loadedmetadata',()=>{const d=AU.duration||0;if(start&&(!d||start<d-3))AU.currentTime=start},{once:true});save()}
  AU.playbackRate=a.rate;AU.play().catch(()=>{});auMeta(it);if(auScr())render();else auUi()}
function auToggle(){if(!AU.src){const a=auSt();if(a.last)auPlay(a.last);return}AU.paused?AU.play().catch(()=>{}):AU.pause()}
function auSkip(s){if(!AU.src)return;AU.currentTime=Math.max(0,Math.min((AU.duration||1e9)-0.5,AU.currentTime+s))}
function auMeta(it){if(!('mediaSession' in navigator))return;try{navigator.mediaSession.metadata=new MediaMetadata({title:it.t,artist:it.s||'المرشد',album:'المرشد',artwork:[{src:'icon-512.png',sizes:'512x512',type:'image/png'},{src:'icon-192.png',sizes:'192x192',type:'image/png'}]})}catch(e){}}
function auPos(){if(!('mediaSession' in navigator)||!navigator.mediaSession.setPositionState||!AU.duration||!isFinite(AU.duration))return;try{navigator.mediaSession.setPositionState({duration:AU.duration,playbackRate:AU.playbackRate,position:Math.min(AU.currentTime,AU.duration)})}catch(e){}}
if('mediaSession' in navigator){const ms=navigator.mediaSession,h=(k,f)=>{try{ms.setActionHandler(k,f)}catch(e){}};
  h('play',()=>MS_SRC==='sal'?salStart():ADP.on?ADA.play():AU.play());h('pause',()=>MS_SRC==='sal'?salStop():ADP.on?ADA.pause():AU.pause());h('seekbackward',e=>auSkip(-((e&&e.seekOffset)||15)));h('seekforward',e=>auSkip((e&&e.seekOffset)||30));
  h('seekto',e=>{if(e&&e.seekTime!=null)AU.currentTime=e.seekTime;auPos()});
  h('previoustrack',()=>{if(ADP.on)return;const a=auSt(),p=a.last&&auNext(a.last,-1);if(AU.currentTime>5||!p)AU.currentTime=0;else auPlay(p.p,0)});
  h('nexttrack',()=>{if(ADP.on)return;const a=auSt(),n=a.last&&auNext(a.last,1);if(n)auPlay(n.p,0)})}
function auStore(force){const a=auSt(),p=a.last;if(!p||!AU.src)return;a.pos[p]=AU.currentTime;if(AU.duration&&isFinite(AU.duration))a.dur[p]=AU.duration;
  if(force)save();else if(Date.now()-auLastSave>5000){auLastSave=Date.now();S.updatedAt=Date.now();lsSet(KEY,JSON.stringify(S))}}
AU.addEventListener('timeupdate',()=>{auStore(false);auUi(true)});
AU.addEventListener('pause',()=>{auStore(true);auUi()});
AU.addEventListener('play',()=>{auUi()});
AU.addEventListener('loadedmetadata',()=>{auPos();auUi()});
AU.addEventListener('ratechange',auPos);
AU.addEventListener('ended',()=>{const a=auSt(),p=a.last;a.done[p]=1;a.pos[p]=0;save();const n=a.auto&&auNext(p,1);if(n)auPlay(n.p,0);else auUi()});
AU.addEventListener('error',()=>{if(AU.src){auErr='تعذّر تشغيل هذا الملف. تأكد من الاتصال.';if(auScr())render();auUi()}});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')auStore(true)});
window.addEventListener('pagehide',()=>auStore(true));
const AU_IC={play:'<svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg>',pause:'<svg viewBox="0 0 24 24"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor"/></svg>',
 back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 12a8 8 0 1 0 2.5-5.8"/><path d="M4 4v4h4"/><text x="12" y="15.5" font-size="7.5" text-anchor="middle" fill="currentColor" stroke="none" font-family="sans-serif">15</text></svg>',
 fwd:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 12a8 8 0 1 1-2.5-5.8"/><path d="M20 4v4h-4"/><text x="12" y="15.5" font-size="7.5" text-anchor="middle" fill="currentColor" stroke="none" font-family="sans-serif">30</text></svg>',
 prev:'<svg viewBox="0 0 24 24"><path d="M6 5h2v14H6zM19 5v14L9 12z" fill="currentColor"/></svg>',next:'<svg viewBox="0 0 24 24"><path d="M16 5h2v14h-2zM5 5v14l10-7z" fill="currentColor"/></svg>',
 head:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 30v-6a16 16 0 0 1 32 0v6"/><rect x="6" y="28" width="8" height="12" rx="3"/><rect x="34" y="28" width="8" height="12" rx="3"/></svg>'};
function auPct(p){const a=auSt();if(a.done[p]&&!a.pos[p])return 100;const d=a.dur[p];return d?Math.min(100,100*(a.pos[p]||0)/d):0}
function viewAudio(only){if(!auCat||Date.now()-((JSON.parse(localStorage.getItem('murshid-au-cat2')||'{}').at)||0)>20*60e3)setTimeout(()=>auLoad(false),0);
  const a=auSt(),cat=(auCat||[]).filter(g=>only?g.k===only:g.k!==SIRA_K),cur0=a.last?auFind(a.last)||{p:a.last,t:a.lastT||'',s:a.lastS||''}:null,cur=cur0&&auHome(cur0.p)===auScrK(only)?cur0:null,playing=!!AU.src&&!AU.paused;
  const dur=AU.src&&AU.duration&&isFinite(AU.duration)?AU.duration:(cur&&a.dur[cur.p])||0,pos=AU.src?AU.currentTime:(cur&&a.pos[cur.p])||0;
  const now=cur?`<div class="box pad au-now"><p class="au-ser">${esc(cur.s||'')}</p><h2 class="au-tt">${esc(cur.t)}</h2>
    <input type="range" id="auSeek" class="au-seek" min="0" max="${Math.max(1,Math.floor(dur))}" step="1" value="${Math.floor(pos)}" dir="ltr" aria-label="الموضع">
    <div class="au-times notr" dir="ltr"><span id="auCur">${auFmt(pos)}</span><span id="auDur">${dur?auFmt(dur):'--:--'}</span></div>
    <div class="au-ctl" dir="ltr"><button class="au-b" data-auprev="1" aria-label="السابق">${AU_IC.prev}</button><button class="au-b" data-auskip="-15" aria-label="رجوع 15 ثانية">${AU_IC.back}</button>
     <button class="au-b au-big" data-autoggle="1" id="auBig" aria-label="${playing?'إيقاف مؤقت':'تشغيل'}">${playing?AU_IC.pause:AU_IC.play}</button>
     <button class="au-b" data-auskip="30" aria-label="تقديم 30 ثانية">${AU_IC.fwd}</button><button class="au-b" data-aunext="1" aria-label="التالي">${AU_IC.next}</button></div>
    <div class="au-opts"><button class="au-chip" data-aurate="1"><span>السرعة</span> <b class="notr" dir="ltr">×${a.rate}</b></button>
     <button class="au-chip${a.auto?' on':''}" data-auauto="1" aria-pressed="${a.auto}">${a.auto?'<span class="notr">✓ </span>':''}<span>تشغيل الدرس الموالي تلقائيًا</span></button></div></div>`:'';
  const list=!auCat?(auBusy?'<p class="muted">جاري تحميل قائمة الدروس…</p>':''):!cat.length?`<div class="box pad"><p>${only?'ستُضاف الحلقات قريبًا بإذن الله.':'لا توجد دروس صوتية بعد.'}</p>${isAdmin()?`<p class="meta notr" dir="rtl">لإضافة ${only?'حلقة':'درس'}: ارفع الملف داخل المجلد audio/${only||'اسم_السلسلة'} في المستودع، مثال: audio/${only||'شرح_الطريقة_المحمدية'}/01 - ${only?'المولد الشريف':'المقدمة'}.mp3</p>`:''}</div>`:
    cat.map((g,gi)=>{const open=auOpen[g.k]!==undefined?auOpen[g.k]:(cat.length===1||(cur&&auFind(cur.p)?g.items.some(x=>x.p===cur.p):gi===0));const dn=g.items.filter(x=>a.done[x.p]).length;
      return `<details class="au-g" data-aug="${esc(g.k)}"${open?' open':''}><summary><span class="au-gn">${esc(g.n)}</span><span class="meta notr" dir="ltr">${dn} / ${g.items.length}</span></summary>${g.items.map((x,xi)=>{const on=cur&&x.p===cur.p,pc=auPct(x.p),st=a.done[x.p]&&!a.pos[x.p]?'✓':a.pos[x.p]>3?auFmt(a.pos[x.p]):'';
        return `<button class="au-row${on?' on':''}" data-auplay="${esc(x.p)}"><span class="au-pi">${on&&playing?AU_IC.pause:AU_IC.play}</span><span class="au-rt">${only?`<small class="au-ep"><span>الحلقة</span> ${xi+1}</small>`:''}<b>${esc(x.t)}</b><i class="au-pb"><i style="width:${pc}%"></i></i></span><span class="au-st notr" dir="ltr">${st}${a.dur[x.p]&&st!=='✓'?(st?' / ':'')+auFmt(a.dur[x.p]):''}</span></button>`}).join('')}</details>`}).join('');
  return `${auErr?`<p class="muted au-err">${esc(auErr)}</p>`:''}${now}<div class="sh" style="margin:18px 2px 10px"><h2>${only?'الحلقات':'الدروس'}</h2><button class="au-chip" data-aurefresh="1" ${auBusy?'disabled':''}>تحديث القائمة</button></div>${list}
   <p class="meta" style="margin-top:14px">يُحفظ موضع توقفك في كل درس، ويستمر الاستماع عند الخروج من التطبيق أو قفل الشاشة.</p>`}
/* mini player that stays above the tab bar on every screen */
function auUi(light){let m=document.getElementById('auMini');const a=S.au||{};
  const show=!!AU.src&&!auScr()&&!gated()&&screen!=='dhikr_run';document.body.classList.toggle('au-on',show);
  if(!show){if(m)m.hidden=true;if(auScr())auNowUi();return}
  if(!m){m=document.createElement('div');m.id='auMini';m.className='au-mini';document.body.appendChild(m);
    m.addEventListener('click',e=>{if(e.target.closest('[data-aux]')){auClose();return}if(e.target.closest('[data-aumt]')){auToggle();return}go(auHome((S.au||{}).last))})}
  m.hidden=false;m.dir=RTL()?'rtl':'ltr';const pc=AU.duration?100*AU.currentTime/AU.duration:0;
  if(light&&m.firstChild){const f=m.querySelector('.au-mf');if(f)f.style.width=pc+'%';return}
  m.innerHTML=`<i class="au-mbar"><i class="au-mf" style="width:${pc}%"></i></i><span class="au-mi">${AU_IC.head}</span><span class="au-mt notr"><b>${esc(a.lastT||'')}</b><small>${esc(a.lastS||'')}</small></span><button class="au-b" data-aumt="1" aria-label="تشغيل">${AU.paused?AU_IC.play:AU_IC.pause}</button><button class="au-b au-x" data-aux="1" aria-label="إغلاق المشغّل"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>`}
function auClose(){try{auStore(true);AU.pause();AU.removeAttribute('src');AU.load()}catch(e){}if('mediaSession' in navigator)try{navigator.mediaSession.metadata=null}catch(e){}auUi()}
function auNowUi(){const s=document.getElementById('auSeek');if(!s)return;const d=AU.duration&&isFinite(AU.duration)?AU.duration:0;
  if(d&&+s.max!==Math.floor(d)){s.max=Math.floor(d);const D=document.getElementById('auDur');if(D)D.textContent=auFmt(d)}
  if(!s.dataset.drag)s.value=Math.floor(AU.currentTime);const c=document.getElementById('auCur');if(c)c.textContent=auFmt(AU.currentTime);
  const b=document.getElementById('auBig');if(b){const pl=!AU.paused;if(b.dataset.pl!==String(pl)){b.dataset.pl=pl;b.innerHTML=pl?AU_IC.pause:AU_IC.play;
    document.querySelectorAll('.au-row').forEach(r=>{const on=r.classList.contains('on');r.querySelector('.au-pi').innerHTML=on&&pl?AU_IC.pause:AU_IC.play})}}}
document.addEventListener('toggle',e=>{const d=e.target;if(d.classList&&d.classList.contains('au-g'))auOpen[d.dataset.aug]=d.open},true);
function auClick(d){const a=auSt();
  if(d.auplay!==undefined){if(a.last===d.auplay&&AU.src)auToggle();else auPlay(d.auplay);return true}
  if(d.autoggle){auToggle();return true}
  if(d.auskip){if(AU.src)auSkip(+d.auskip);else if(a.last){a.pos[a.last]=Math.max(0,(a.pos[a.last]||0)+(+d.auskip));save();render()}return true}
  if(d.auprev){const p=a.last&&auNext(a.last,-1);if(AU.src&&(AU.currentTime>5||!p))AU.currentTime=0;else if(p)auPlay(p.p,0);return true}
  if(d.aunext){const n=a.last&&auNext(a.last,1);if(n)auPlay(n.p,0);return true}
  if(d.aurate){const R=[1,1.25,1.5,1.75,2,0.75],i=R.indexOf(a.rate);a.rate=R[(i+1)%R.length];AU.playbackRate=a.rate;save();render();return true}
  
  if(d.auauto){a.auto=!a.auto;save();render();return true}
  if(d.aurefresh){auLoad(true);return true}
  return false}
document.addEventListener('input',e=>{if(e.target.id!=='auSeek')return;e.target.dataset.drag=1;const c=document.getElementById('auCur');if(c)c.textContent=auFmt(+e.target.value)});
document.addEventListener('change',e=>{if(e.target.id!=='auSeek')return;delete e.target.dataset.drag;const v=+e.target.value,a=auSt();
  if(AU.src)AU.currentTime=v;else if(a.last){a.pos[a.last]=v;save()}});

