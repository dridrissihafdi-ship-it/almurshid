/* ---------- «المطوّف»: tawaf and sa'i on one calm full screen ----------
   The seven circuits around the Ka'ba, the current one lit; one big button per circuit; the circuit's dhikr and meaning,
   read aloud on request. The phone's location only says whether you are at al-Masjid al-Haram: it never counts for you. */
const MT_C={lat:21.4225,lng:39.8262};   // the Ka'ba
let mtGeo=null,mtGeoAsk=false,mtSay=false;
function mtSeg(){return S.mtSeg==='sa'?'sa':'tw'}
function mtDist(a,b){const R=6371e3,t=Math.PI/180,dl=(b.lat-a.lat)*t,dn=(b.lng-a.lng)*t,x=Math.sin(dl/2)**2+Math.cos(a.lat*t)*Math.cos(b.lat*t)*Math.sin(dn/2)**2;return 2*R*Math.asin(Math.sqrt(x))}
function mtLocate(){if(mtGeoAsk||!navigator.geolocation)return;mtGeoAsk=true;
  try{navigator.geolocation.getCurrentPosition(p=>{mtGeo={d:mtDist(MT_C,{lat:p.coords.latitude,lng:p.coords.longitude}),acc:p.coords.accuracy};if(screen==='mutawwif')render()},
    ()=>{mtGeo={err:1};if(screen==='mutawwif')render()},{enableHighAccuracy:false,timeout:12000,maximumAge:300000})}catch(e){}}
function mtWhere(){if(!mtGeo)return '';if(mtGeo.err)return '';
  return mtGeo.d<700?'<p class="mt-loc in"><i></i><span>أنت في المسجد الحرام</span></p>'
    :'<p class="mt-loc"><i></i><span>أنت خارج نطاق الحرم. ابدأ متى وصلت إلى المطاف، وعُدّ أشواطك بالزر.</span></p>'}
/* the seven circuits: arcs around the Ka'ba (tawaf) or the seven laps between Safa and Marwa (sa'i) */
function mtRing(n,sai){const r=128,c=150,gap=7,seg=360/7;let o='';
  for(let k=0;k<7;k++){const a0=(-90-k*seg-gap/2)*Math.PI/180,a1=(-90-(k+1)*seg+gap/2)*Math.PI/180;
    const p=(a)=>`${(c+r*Math.cos(a)).toFixed(1)} ${(c+r*Math.sin(a)).toFixed(1)}`;
    o+=`<path class="mt-arc${k<n?' on':k===n?' cur':''}" d="M${p(a0)} A${r} ${r} 0 0 0 ${p(a1)}"/>`}
  const kaaba=`<g class="mt-kb"><path d="M120 128l30-14 30 14v40l-30 14-30-14z" class="b"/><path d="M120 128l30 14 30-14" class="e"/><path d="M150 142v40" class="e"/><path d="M120 138l30 14 30-14" class="g"/></g>`;
  const sa=`<g class="mt-sa"><circle cx="150" cy="92" r="16" class="b"/><circle cx="150" cy="176" r="16" class="b"/><path d="M150 110v48" class="e"/><text x="150" y="95" text-anchor="middle">${esc(Tx('الصفا'))}</text><text x="150" y="179" text-anchor="middle">${esc(Tx('المروة'))}</text></g>`;
  return `<svg class="mt-ring" viewBox="0 0 300 300" aria-hidden="true"><circle cx="150" cy="150" r="128" class="mt-tr"/>${o}${sai?sa:kaaba}</svg>`}
function viewMutawwif(){mtLocate();const U=umU(),R=umS(),sai=mtSeg()==='sa',c=sai?'sa':'tw',n=R[c]||0,done=n>=7;
  const card=!done?(sai?(U.sa7?umSa(U,U.sa7[n],n,1):''):(U.tw7?umTw(U,U.tw7[n],n,1):'')):'';
  const dir=sai?(n%2===0?'مِنَ الصَّفَا إِلَى الْمَرْوَةِ':'مِنَ الْمَرْوَةِ إِلَى الصَّفَا'):'ابْدَأِ الشَّوْطَ عِنْدَ الْحَجَرِ الْأَسْوَدِ';
  const btn=done?(sai?`<button class="mt-go" data-go="umrah" data-umstep="3">أَتْمَمْتُ السَّعْيَ · انتقل إلى الحلق</button>`:`<button class="mt-go" data-mtseg="sa">أَتْمَمْتُ الطَّوَافَ · ابدأ السعي</button>`)
    :n===0&&!R[c+'Go']?`<button class="mt-go" data-mtstart="${c}">${sai?'ابدأ السعي':'ابدأ الطواف'}</button>`
    :`<button class="mt-go" data-umc="${c}" data-v="1"><span>${sai?'وَصَلْتُ، أَتْمَمْتُ الشَّوْطَ':'مَرَرْتُ بِالْحَجَرِ الْأَسْوَدِ، أَتْمَمْتُ الشَّوْطَ'}</span> <b dir="ltr">${n+1}</b></button>`;
  return `<section class="mt">
   <div class="mt-top"><div class="mt-seg" role="tablist"><button role="tab" aria-selected="${!sai}" class="${sai?'':'on'}" data-mtseg="tw">الطواف</button><button role="tab" aria-selected="${sai}" class="${sai?'on':''}" data-mtseg="sa">السعي</button></div>
    ${TTS_OK&&!done?`<button class="mt-say${mtSay?' on':''}" data-mtsay="1" aria-label="${esc(Tx('استمع'))}" aria-pressed="${mtSay}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/></svg></button>`:''}</div>
   ${mtWhere()}
   <div class="mt-stage">${mtRing(n,sai)}<p class="mt-count"><b dir="ltr">${n} / 7</b><span>${done?'تمّت الأشواط ✓':`<span>الشَّوْطُ</span> ${n+1}`}</span></p></div>
   ${done?'':`<p class="mt-dir">${dir}</p>`}
   <div class="mt-act">${btn}${n?`<button class="lnk mt-undo" data-umc="${c}" data-v="-1">تَرَاجَعْ شَوْطًا</button>`:''}</div>
   ${card?`<ol class="mt-card">${card}</ol>`:''}
   <p class="meta mt-note">إِنْ شَكَكْتَ فِي الْعَدَدِ فَخُذْ بِالْأَقَلِّ. يبقى الهاتف مضيئًا في هذه الشاشة.</p>
  </section>`}
/* read the current circuit aloud: the Arabic dhikr, then its meaning in the reader's language */
function mtSpeak(){if(!TTS_OK)return;try{speechSynthesis.cancel()}catch(e){}if(!mtSay)return;
  const U=umU(),R=umS(),sai=mtSeg()==='sa',n=R[sai?'sa':'tw']||0;if(n>=7)return;const w=sai?(U.sa7||[])[n]:(U.tw7||[])[n];if(!w)return;
  const say=(t,lg)=>{if(!t)return;const u=new SpeechSynthesisUtterance(String(t).replace(/<[^>]+>/g,''));u.lang=lg;const v=ttsVoices(lg)[0];if(v)u.voice=v;u.rate=.92;speechSynthesis.speak(u)};
  say(w[1],'ar');say((LANG==='ar'?'':Tx('الشوط')+' '+(n+1)+'. ')+(sai?w[2]:w[2]),LANG==='ar'?'ar':LANG)}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-mtseg],[data-mtstart],[data-mtsay],[data-umstep],[data-mtopen]');if(!b)return;const d=b.dataset;
  if(d.mtseg){S.mtSeg=d.mtseg;save();render();setTimeout(mtSpeak,200);e.stopPropagation();return}
  if(d.mtstart){const R=umS();R[d.mtstart+'Go']=1;S.umStep=d.mtstart==='sa'?2:1;save();render();setTimeout(mtSpeak,200);e.stopPropagation();return}
  if(d.mtsay){mtSay=!mtSay;if(mtSay)mtSpeak();else try{speechSynthesis.cancel()}catch(x){}render();e.stopPropagation();return}
  if(d.mtopen){S.mtSeg=d.mtopen;save();go('mutawwif');e.stopPropagation();return}
  if(d.umstep!==undefined){S.umStep=+d.umstep;save()}},true);
VIEWS.mutawwif=viewMutawwif;
TITLES.mutawwif='المطوّف';VERSES.mutawwif='﴿وَلْيَطَّوَّفُوا بِالْبَيْتِ الْعَتِيقِ﴾';
