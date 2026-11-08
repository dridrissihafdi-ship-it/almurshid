/* ---------- dates ---------- */
const pad=n=>String(n).padStart(2,'0');
const ds=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
const addDays=(s,n)=>{const d=new Date(s+'T12:00:00');d.setDate(d.getDate()+n);return ds(d)};
let TODAY=ds(new Date());
let hijriDay=0,hijriLabel='';
try{const f=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura-nu-latn',{day:'numeric',month:'long',year:'numeric'});
  hijriLabel=f.format(new Date());const p=f.formatToParts(new Date()).find(x=>x.type==='day');hijriDay=p?+p.value:0}catch(e){}
const DOW=new Date().getDay();

function seasonal(){
  const s=[];
  if(DOW===1||DOW===4)s.push({id:'sawm',t:DOW===1?'صيام الاثنين':'صيام الخميس',s:'سنة نبوية',tag:'اليوم'});
  if(hijriDay>=13&&hijriDay<=15)s.push({id:'bid',t:'صيام الأيام البيض',s:'13 و14 و15 من الشهر الهجري',tag:'اليوم'});
  if(DOW===5)s.push({id:'kahf',t:'سورة الكهف',s:'من سنن الجمعة',tag:'الجمعة'},{id:'jsal',t:'الإكثار من الصلاة على النبي ﷺ',s:'في يوم الجمعة وليلتها',tag:'الجمعة'},{id:'ghusl',t:'غسل الجمعة',s:'قبل الذهاب إلى الصلاة',tag:'الجمعة'},{id:'tabkir',t:'التبكير إلى الجمعة',s:'والدنوّ من الإمام والإنصات',tag:'الجمعة'});
  s.push({id:'khalwa',t:'خلوة أسبوعية',s:'ساعة مع الله: ذكر ومحاسبة وتفكر',tag:'أسبوعي'});
  return s;
}

