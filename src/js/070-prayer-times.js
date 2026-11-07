/* ---------- prayer times (MWL-style math, Fajr 19°, Isha 17°, Shafi'i Asr) ---------- */
const rad=d=>d*Math.PI/180,deg=r=>r*180/Math.PI;
const fix=(a,b)=>{a=a-b*Math.floor(a/b);return a<0?a+b:a};
function sunPos(jd){const D=jd-2451545,g=fix(357.529+0.98560028*D,360),q=fix(280.459+0.98564736*D,360),
  L=fix(q+1.915*Math.sin(rad(g))+0.02*Math.sin(rad(2*g)),360),e=23.439-0.00000036*D,
  RA=fix(deg(Math.atan2(Math.cos(rad(e))*Math.sin(rad(L)),Math.cos(rad(L))))/15,24),
  decl=deg(Math.asin(Math.sin(rad(e))*Math.sin(rad(L))));return{decl,eqt:q/15-RA}}
/* calculation methods: [name, Fajr angle, Isha angle or minutes after Maghrib] */
const PT_M={ma:['وزارة الأوقاف المغربية',19,17],mwl:['رابطة العالم الإسلامي',18,17],uqura:['أم القرى (مكة)',18.5,'90'],egypt:['الهيئة المصرية العامة للمساحة',19.5,17.5],
 isna:['الجمعية الإسلامية لأمريكا الشمالية',15,15],uoif:['اتحاد المنظمات الإسلامية بفرنسا',12,12],karachi:['جامعة العلوم الإسلامية بكراتشي',18,18],russia:['الإدارة الدينية لمسلمي روسيا',16,15],diyanet:['رئاسة الشؤون الدينية التركية',18,17]};
function ptAuto(){if(inMorocco(LAT,LNG))return 'ma';if(LAT>22&&LAT<31.7&&LNG>24.7&&LNG<35)return 'egypt';if(LAT>16&&LAT<32.5&&LNG>=35&&LNG<55.7)return 'uqura';if(LNG<-50&&LNG>-170&&LAT>15)return 'isna';return 'mwl'}
function ptMethod(){const m=(typeof S!=='undefined'&&S&&S.ptM)||'auto';return m!=='auto'&&PT_M[m]?m:ptAuto()}
function prayerTimes(date){
  let y=date.getFullYear(),m=date.getMonth()+1,d=date.getDate();if(m<=2){y--;m+=12}
  const A=Math.floor(y/100),B=2-A+Math.floor(A/4);
  const jd=Math.floor(365.25*(y+4716))+Math.floor(30.6001*(m+1))+d+B-1524.5-LNG/(15*24);
  const tz=-date.getTimezoneOffset()/60;
  const noon=t=>fix(12-sunPos(jd+t).eqt,24);
  const at=(angle,t,ccw)=>{const s=sunPos(jd+t),n=noon(t);
    const T=deg(Math.acos((-Math.sin(rad(angle))-Math.sin(rad(s.decl))*Math.sin(rad(LAT)))/(Math.cos(rad(s.decl))*Math.cos(rad(LAT)))))/15;
    return n+(ccw?-T:T)};
  const asrAngle=t=>{const s=sunPos(jd+t);return -deg(Math.atan(1/(1+Math.tan(rad(Math.abs(LAT-s.decl))))))};
  const PM=PT_M[ptMethod()];const raw={fajr:at(PM[1],5/24,1),sunrise:at(0.833,6/24,1),dhuhr:noon(12/24),asr:at(asrAngle(13/24),13/24,0),maghrib:at(0.833,18/24,0),isha:0};raw.isha=typeof PM[2]==='string'?raw.maghrib+(+PM[2])/60:at(PM[2],18/24,0);
  const night=24-(raw.maghrib-raw.sunrise);
  if(!isFinite(raw.fajr))raw.fajr=raw.sunrise-night/7;
  if(!isFinite(raw.isha))raw.isha=raw.maghrib+night/7;
  const out={};for(const k in raw)out[k]=fix(raw[k]+tz-LNG/15,24);
  // Morocco: the Ministry of Habous tables add 5 minutes to Dhuhr and Maghrib (precaution) and round Asr up
  if(ptMethod()==='ma'&&inMorocco(LAT,LNG)){out.dhuhr+=5/60;out.maghrib+=5/60;out.asr+=0.5/60}
  // the seeker's own correction to match the local mosque, in minutes
  try{const A=(typeof S!=='undefined'&&S&&S.ptAdj)||{};for(const k in out)if(A[k])out[k]=fix(out[k]+A[k]/60,24)}catch(e){}
  return out;
}
/* manual correction per prayer (minutes), to match the mosque's timetable */
function ptAdjBox(){const A=S.ptAdj||{},pt=prayerTimes(new Date());
  return `<div class="box pad pa-box"><b>تعديل المواقيت يدويًا</b>${(()=>{const m=ptMethod(),M=PT_M[m],cur=S.ptM||'auto';return `<label for="ptMSel" class="muted" style="display:block;margin:6px 0 4px">طريقة الحساب</label><select id="ptMSel" class="pt-sel"><option value="auto"${cur==='auto'?' selected':''}>${Tx('تلقائيًا حسب المدينة')} · ${Tx(PT_M[ptAuto()][0])}</option>${Object.keys(PT_M).map(k=>`<option value="${k}"${cur===k?' selected':''}>${Tx(PT_M[k][0])}</option>`).join('')}</select>
    <p class="meta" style="margin:6px 0 8px"><span>الفجر</span> <span dir="ltr">${M[1]}°</span> · <span>العشاء</span> <span dir="ltr">${typeof M[2]==='string'?M[2]+' min':M[2]+'°'}</span> · <span>العصر على المذهب المالكي والشافعي (ظل المثل)</span>. <span>إن اختلف وقت مسجدك فعدّله بالدقائق هنا.</span></p>`})()}
   ${PRAYERS.map(([k,n])=>`<div class="pa-row"><span class="pa-n">${n}</span><span class="pa-t notr" dir="ltr">${hm(pt[k])}</span><span class="pa-c"><button class="btn small" data-ptadj="${k}:-1" aria-label="ناقص دقيقة">−</button><b class="notr" dir="ltr">${(A[k]||0)>0?'+':''}${A[k]||0}</b><button class="btn small" data-ptadj="${k}:1" aria-label="زائد دقيقة">+</button></span></div>`).join('')}
   ${Object.values(A).some(Boolean)?'<div class="btns" style="margin-top:8px"><button class="btn small" data-ptadj="reset">إرجاع الحساب الأصلي</button></div>':''}</div>`}
function inMorocco(lat,lng){return lat>=20.5&&lat<=36.2&&lng>=-17.6&&lng<=-0.9}
const hm=h=>{let m=Math.round(h*60);return pad(Math.floor(m/60)%24)+':'+pad(m%60)};
const PRAYERS=[['fajr','الفجر'],['sunrise','الشروق'],['dhuhr','الظهر'],['asr','العصر'],['maghrib','المغرب'],['isha','العشاء']];
const PICONS={
 fajr:'<path d="M8 12a4 4 0 0 1 7.5-2A3 3 0 0 1 17 15H7.5A2.5 2.5 0 0 1 8 12z"/><path d="M5 18h14M7 21h10"/>',
 sunrise:'<path d="M7 15a5 5 0 0 1 10 0M12 4v3M5 8l2 2M19 8l-2 2M3 15h3M18 15h3M5 18h14M8 21h8"/>',
 dhuhr:'<circle cx="12" cy="12" r="3.5"/><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8"/>',
 asr:'<path d="M14 6.5a4 4 0 0 1 5 5.5M15 3v1.5M20.5 5.5l-1 1M5.5 19h11a3.5 3.5 0 0 0 0-7 5 5 0 0 0-9.5 1A3 3 0 0 0 5.5 19z"/>',
 maghrib:'<path d="M7 16a5 5 0 0 1 10 0M12 6v3M5 9.5l1.8 1.5M19 9.5 17.2 11M3 16h18M8 19.5h8"/>',
 isha:'<path d="M14 4a6 6 0 1 0 6 8 5 5 0 0 1-6-8z"/><path d="M4 17h12M6 20h12"/>'
};

