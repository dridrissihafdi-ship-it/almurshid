const I18N_W={"صباحًا":["morning","matin","mañana","утро","صبح"],"مساءً":["evening","soir","tarde","вечер","شام"]};

/* (moved to i18n.json) */

const LIDX={en:0,fr:1,es:2,ru:3,ur:4};const RTL=()=>LANG==='ar'||LANG==='ur';
const LOC={ar:'ar-MA-u-nu-latn',en:'en-GB',fr:'fr-FR',es:'es-ES',ru:'ru-RU',ur:'ur-PK-u-nu-latn'};
const LANGS=[['ar','ع','العربية'],['en','EN','English'],['fr','FR','Français'],['es','ES','Español'],['ru','RU','Русский'],['ur','اردو','اردو']];
let LANG='ar';
const deDigits=s=>s.replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d));
const hasAr=s=>/[؀-ۿ]/.test(s);
/* the translations live in i18n.json (built from I18N_D): Arabic readers never download them */
let I18N_OK=false;
function i18nLoad(){if(I18N_OK||Object.keys(I18N_D).length>200){I18N_OK=true;return Promise.resolve()}
  return fetch('i18n.json').then(r=>{if(!r.ok)throw new Error(r.status);return r.json()}).then(j=>{I18N_D=j;I18N_OK=true}).catch(e=>console.warn('i18n',e))}
function Tx(s){if(LANG==='ar')return s;const i=LIDX[LANG];let k=deDigits(s.trim());
  if(!I18N_D[k]&&/[\u064B-\u0652\u0670]/.test(k)){const k2=k.replace(/[\u064B-\u0652\u0670]/g,'');if(I18N_D[k2])k=k2}
  if(I18N_D[k])return I18N_D[k][i]||k;if(I18N_W[k])return I18N_W[k][i]||k;
  for(const [re,tr] of I18N_P){const m=k.match(re);if(m&&tr[i])return tr[i].replace(/\{(\d)(t|w)?\}/g,(_,n,f)=>{const g=m[n]||'';
    if(f==='t')return Tx(g);
    if(f==='w')return g.split('، ').map(p=>{const t=Tx(p);return hasAr(t)?p.split(' ').map(Tx).join(' '):t}).join(', ');
    return g})}
  return k}
const I18N_SKIP='.tq,.adh-t,.bas,.verse,.dr-text,.notr,input,textarea,script,style';
function i18nApply(root){if(LANG==='ar'||!root)return;
  const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];let n;while(n=w.nextNode())nodes.push(n);
  nodes.forEach(n=>{const v=n.nodeValue;if(!/[؀-ۿ٠-٩]/.test(v))return;if(n.parentElement&&n.parentElement.closest(I18N_SKIP))return;
    const lead=v.match(/^\s*/)[0],trail=v.match(/\s*$/)[0];n.nodeValue=lead+Tx(v)+trail});
  [root,...root.querySelectorAll('[placeholder],[aria-label],[title]')].forEach(e=>{if(e.closest('.notr'))return;if(e.closest('.tq'))return;['placeholder','aria-label','title'].forEach(a=>{const v=e.getAttribute(a);if(v&&/[؀-ۿ٠-٩]/.test(v))e.setAttribute(a,Tx(v))})})}
function computeHijri(){try{const f=new Intl.DateTimeFormat((LANG==='ar'?'ar-SA':LOC[LANG].replace(/-u-.*$/,''))+'-u-ca-islamic-umalqura-nu-latn',{day:'numeric',month:'long',year:'numeric'});
  hijriLabel=f.format(new Date());const p=new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn',{day:'numeric'}).formatToParts(new Date()).find(x=>x.type==='day');hijriDay=p?+p.value:0}catch(e){}}

const KEY='murshid-v2';
let LAT=34.0331, LNG=-5.0003; // default: Fez
const CITIES=[["ma", "فاس", "Fez", 34.0331, -5.0003], ["ma", "الرباط", "Rabat", 34.0209, -6.8416], ["ma", "الدار البيضاء", "Casablanca", 33.5731, -7.5898], ["ma", "مراكش", "Marrakesh", 31.6295, -7.9811], ["ma", "طنجة", "Tangier", 35.7595, -5.834], ["ma", "مكناس", "Meknes", 33.8935, -5.5473], ["ma", "أكادير", "Agadir", 30.4278, -9.5981], ["ma", "وجدة", "Oujda", 34.6814, -1.9086], ["ma", "تطوان", "Tetouan", 35.5889, -5.3626], ["ma", "القنيطرة", "Kenitra", 34.261, -6.5802], ["ma", "سلا", "Salé", 34.0531, -6.7985], ["ma", "الجديدة", "El Jadida", 33.2316, -8.5007], ["ma", "آسفي", "Safi", 32.2994, -9.2372], ["ma", "بني ملال", "Beni Mellal", 32.3373, -6.3498], ["ma", "الناظور", "Nador", 35.1681, -2.9335], ["ma", "تازة", "Taza", 34.2133, -4.0103], ["ma", "الحسيمة", "Al Hoceima", 35.2517, -3.9372], ["ma", "إفران", "Ifrane", 33.5228, -5.1106], ["ma", "الرشيدية", "Errachidia", 31.9314, -4.4246], ["ma", "ورزازات", "Ouarzazate", 30.9189, -6.8934], ["ma", "العيون", "Laayoune", 27.1536, -13.2033], ["ma", "الداخلة", "Dakhla", 23.6848, -15.958], ["w", "مكة المكرمة", "Makkah", 21.4225, 39.8262], ["w", "المدينة المنورة", "Madinah", 24.4672, 39.6111], ["w", "القدس", "Jerusalem", 31.7683, 35.2137], ["w", "القاهرة", "Cairo", 30.0444, 31.2357], ["w", "تونس", "Tunis", 36.8065, 10.1815], ["w", "الجزائر", "Algiers", 36.7538, 3.0588], ["w", "نواكشوط", "Nouakchott", 18.0735, -15.9582], ["w", "الرياض", "Riyadh", 24.7136, 46.6753], ["w", "دبي", "Dubai", 25.2048, 55.2708], ["w", "الدوحة", "Doha", 25.2854, 51.531], ["w", "عمّان", "Amman", 31.9454, 35.9284], ["w", "إسطنبول", "Istanbul", 41.0082, 28.9784], ["w", "باريس", "Paris", 48.8566, 2.3522], ["w", "ليون", "Lyon", 45.764, 4.8357], ["w", "مرسيليا", "Marseille", 43.2965, 5.3698], ["w", "بروكسل", "Brussels", 50.8503, 4.3517], ["w", "أمستردام", "Amsterdam", 52.3676, 4.9041], ["w", "لندن", "London", 51.5074, -0.1278], ["w", "مدريد", "Madrid", 40.4168, -3.7038], ["w", "برشلونة", "Barcelona", 41.3874, 2.1686], ["w", "ميلانو", "Milan", 45.4642, 9.19], ["w", "روما", "Rome", 41.9028, 12.4964], ["w", "برلين", "Berlin", 52.52, 13.405], ["w", "فرانكفورت", "Frankfurt", 50.1109, 8.6821], ["w", "جنيف", "Geneva", 46.2044, 6.1432], ["w", "مونتريال", "Montreal", 45.5019, -73.5674], ["w", "تورونتو", "Toronto", 43.6532, -79.3832], ["w", "نيويورك", "New York", 40.7128, -74.006], ["w", "موسكو", "Moscow", 55.7558, 37.6173], ["w", "قازان", "Kazan", 55.7963, 49.1088]];
const cityName=L=>L?(RTL()?L.ar:L.lt):(RTL()?'فاس':'Fez');
function applyLoc(){if(S&&S.loc&&isFinite(S.loc.lat)&&isFinite(S.loc.lng)){LAT=S.loc.lat;LNG=S.loc.lng}else{LAT=34.0331;LNG=-5.0003}}
function nearestCity(lat,lng){let best=null,bd=1e9;CITIES.forEach(c=>{const dy=(c[3]-lat)*111,dx=(c[4]-lng)*111*Math.cos(lat*Math.PI/180),dd=Math.hypot(dx,dy);if(dd<bd){bd=dd;best=c}});return{c:best,km:bd}}

