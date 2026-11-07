const DAY=864e5;
function emptyMarks(){return{sabah:{},masa:{},dhikr:[],quran:[],khalwa:[],dhikrText:'',dhikrList:[]}}
const atH=(dateStr,h)=>{const d=new Date(dateStr+'T00:00:00');d.setMinutes(Math.round(h*60));return d.getTime()};
const nowStr=()=>ds(new Date());
/* the day of works starts at Fajr: before Fajr we are still in yesterday's day */
function dayKey(){const n=new Date(),h=n.getHours()+n.getMinutes()/60;let f=5;try{f=prayerTimes(n).fajr}catch(e){}return h<f?ds(new Date(n.getTime()-864e5)):ds(n)}
/* hours since the start of the current day of works (past midnight counts as 24+) */
const dH=()=>{const n=new Date(),h=n.getHours()+n.getMinutes()/60;return ds(n)!==TODAY?h+24:h};
const ptDay=()=>prayerTimes(new Date(TODAY+'T12:00:00'));
function period(){
  const now=new Date(),t=now.getTime(),today=ds(now),pt=prayerTimes(now);
  const fajr=atH(today,pt.fajr),magh=atH(today,pt.maghrib-0.25); // evening adhkar open 15 min before Maghrib
  if(t>=fajr&&t<magh)return{kind:'sabah',key:today,start:fajr,end:magh,endName:'المغرب'};
  if(t>=magh){const tm=addDays(today,1);return{kind:'masa',key:today,start:magh,end:atH(tm,prayerTimes(new Date(tm+'T12:00:00')).fajr),endName:'الفجر'}}
  const y=addDays(today,-1);return{kind:'masa',key:y,start:atH(y,prayerTimes(new Date(y+'T12:00:00')).maghrib-0.25),end:fajr,endName:'الفجر'};
}
const lastTs=a=>a.length?Math.max(...a):0;
function lights(){
  const M=S.marks,p=period(),t=Date.now();
  const halo=!!M[p.kind][p.key];
  const hq=lastTs(M.quran),hd=lastTs(M.dhikr),kh=M.khalwa.length?Math.max(...M.khalwa.map(k=>k.ts)):0;
  return{p,halo,head:t-hq<DAY,headEnd:hq+DAY,heart:t-hd<DAY,heartEnd:hd+DAY,body:t-kh<30*DAY,bodyEnd:kh+30*DAY,
    quranToday:M.quran.some(x=>ds(new Date(x))===nowStr()),dhikrToday:M.dhikr.some(x=>ds(new Date(x))===nowStr())};
}
const litCount=()=>{const l=lights();return[l.halo,l.heart,l.head,l.body].filter(Boolean).length};
const tHM=ts=>{const d=new Date(ts);return pad(d.getHours())+':'+pad(d.getMinutes())};
const dayLbl=ts=>{const s=ds(new Date(ts));return s===nowStr()?'اليوم':s===addDays(nowStr(),1)?'غدًا':fmtD(s)};
function syncWird(id,on,dateKey){const k=dateKey||nowStr();const L=S.log[k]||(S.log[k]={awrad:[],heart:null,note:''});
  L.awrad=on?[...new Set([...L.awrad,id])]:L.awrad.filter(x=>x!==id)}
let lightConfirm=null;

function figureSVG(l){
  const W=320,H=710;
  return `<svg class="figure" viewBox="-70 -45 460 800" role="img" aria-label="حالتك الروحية اليومية: ${[l.halo?'الهالة مضيئة':'الهالة مطفأة',l.head?'الرأس مستنير':'',l.heart?'القلب مستنير':'',l.body?'الجسد كله مستنير':''].filter(Boolean).join('، ')}">
   <defs>
    <mask id="bm" maskUnits="userSpaceOnUse" x="-70" y="-45" width="460" height="800"><image href="${BODY_MASK}" x="0" y="0" width="${W}" height="${H}"/></mask>
    <filter id="haloF" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="22"/></filter>
    <filter id="haloF2" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="7"/></filter>
    <radialGradient id="gHeart"><stop offset="0" stop-color="#fff8dc"/><stop offset=".35" stop-color="#f6e3a8" stop-opacity=".9"/><stop offset="1" stop-color="#f6e3a8" stop-opacity="0"/></radialGradient>
    <radialGradient id="gHead"><stop offset="0" stop-color="#fffbe8"/><stop offset=".45" stop-color="#f6e3a8" stop-opacity=".85"/><stop offset="1" stop-color="#f6e3a8" stop-opacity="0"/></radialGradient>
    <radialGradient id="gBody" cx="50%" cy="35%" r="75%"><stop offset="0" stop-color="#fffaf0"/><stop offset=".55" stop-color="#f6e6b8"/><stop offset="1" stop-color="#e6cf92"/></radialGradient>
    <linearGradient id="gOff" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9a8673"/><stop offset=".5" stop-color="#7b6a5b"/><stop offset="1" stop-color="#5c4f45"/></linearGradient>
    <radialGradient id="gRim" cx="50%" cy="40%" r="65%"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#2a1f18" stop-opacity=".45"/></radialGradient>
    <filter id="wcT" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".018 .03" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 .95  0 0 0 0 .85  0 0 0 0 .7  0 0 0 1.1 -.35"/></filter>
   </defs>
   ${l.halo||l.body?`<g class="halo"><g filter="url(#haloF)" opacity="${l.body?1:.9}"><rect x="-70" y="-45" width="460" height="800" fill="#ffe39a" mask="url(#bm)"/></g><g filter="url(#haloF2)" opacity=".85"><rect x="-70" y="-45" width="460" height="800" fill="#fff1c4" mask="url(#bm)"/></g></g>`:''}
   <g mask="url(#bm)">
    <rect x="0" y="0" width="${W}" height="${H}" fill="url(#gOff)"/>
    <rect x="0" y="0" width="${W}" height="${H}" filter="url(#wcT)" opacity=".38"/>
    <rect x="0" y="0" width="${W}" height="${H}" fill="url(#gRim)"/>
    ${l.body?`<rect class="bodylit" x="0" y="0" width="${W}" height="${H}" fill="url(#gBody)" opacity=".92"/>`:''}
    ${l.heart?`<ellipse class="pulse" cx="159" cy="246" rx="78" ry="118" fill="url(#gHeart)"/>`:''}
    ${l.head?`<circle class="pulse" cx="159" cy="62" r="80" fill="url(#gHead)"/>`:''}
   </g>
  </svg>`;
}
function lightRow(on,title,desc,status,actions){
  return `<div class="lrow${on?' on':''}"><i class="lamp" aria-hidden="true"></i><div class="t"><b>${title}</b><small>${desc}</small><span class="st">${status}</span>${actions?`<div class="btns">${actions}</div>`:''}</div></div>`;
}
function setLight(kind,on){
  const M=S.marks,p=period(),t=Date.now(),today=nowStr();
  if(kind==='halo'){if(on){M[p.kind][p.key]=t}else delete M[p.kind][p.key];syncWird(p.kind,on,p.key)}
  else{M[kind]=M[kind].filter(x=>ds(new Date(x))!==today);if(on)M[kind].push(t);if(kind==='quran')syncWird('quran',on)}
  save();render();
}
