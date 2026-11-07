/* ---------- the heart: anatomical drawing, 7 regions, one channel per organ ---------- */
const HC={dark:'#141414',grey:'#8e8e8e',white:'#f8f6f1'};
function organShade(o){return o.phase==='done'?'white':o.phase==='tanwir'?'grey':'dark'}
const HEART_BODY='M170 165 C130 160 100 190 102 232 C104 262 118 280 128 300 C150 345 205 395 268 418 C290 425 305 412 318 392 C352 340 368 280 360 225 C356 195 344 175 322 166 C300 160 285 165 272 170 C250 158 215 156 196 162 C186 164 178 165 170 165 Z';
// entrance point on the body edge and outward direction, one per organ (same order as ORGANS)
const HEART_PORTS=[[128,174,-.72,-.69],[109,263,-.97,-.2],[152,334,-.8,.6],[198,380,-.45,.89],[300,416,.4,.92],[355,310,.97,.25],[348,188,.8,-.6]];
function heartSection(){
  const N=ORGANS.length;
  const sc=o=>o.phase==='done'?1:o.phase==='tanwir'?.5+.5*Math.min(o.days,30)/30:o.phase==='tathir'?.15+.3*Math.min(o.days,30)/30:0;
  const p=ORGANS.reduce((a,g)=>a+sc(S.organs[g.id]),0)/N;
  // where each organ's channel enters the heart (inside) and where its label sits (outside), in % of the picture
  const POS={lisan:[[40,28],[15,12]],ayn:[[33,42],[11,35]],udhun:[[35,58],[11,58]],yad:[[43,70],[20,85]],qadam:[[57,72],[66,90]],batn:[[66,52],[88,57]],farj:[[61,32],[85,16]]};
  let stains='',glows='',nodes='';
  ORGANS.forEach(g=>{const o=S.organs[g.id],[[ix,iy],[lx,ly]]=POS[g.id]||[[50,50],[50,50]];
    const dark=o.phase==='idle'?.9:o.phase==='tathir'?.75-.45*Math.min(o.days,30)/30:0;
    if(dark>0)stains+=`<i style="left:${ix}%;top:${iy}%;opacity:${dark.toFixed(2)}"></i>`;
    if(o.phase==='tanwir'||o.phase==='done')glows+=`<i style="left:${ix}%;top:${iy}%;opacity:${o.phase==='done'?1:(.35+.5*Math.min(o.days,30)/30).toFixed(2)}"></i>`;
    const st=o.phase==='done'?'تنوّرت ✓':o.phase==='tanwir'?`<span>تنوير</span> <span dir="ltr">${o.days}/30</span>`:o.phase==='tathir'?`<span>تطهير</span> <span dir="ltr">${o.days}/30</span>`:'مفتوح';
    nodes+=`<button class="hq-n ${o.phase}" style="left:${lx}%;top:${ly}%" data-organ="${g.id}"><i></i><b>${g.name}</b><small>${st}</small></button>`});
  const closedN=ORGANS.filter(g=>S.organs[g.id].phase==='tanwir'||S.organs[g.id].phase==='done').length;
  const pureN=ORGANS.filter(g=>S.organs[g.id].phase==='done').length;
  const msg=pureN===N?'أُغلقت مجاري القلب كلها، فانقطع سيل ظلمات الذنوب وصفا القلب بنور الذكر والطاعة.'
    :closedN===0?'مجاري القلب كلها مفتوحة: كل جارحة لم تُطهَّر بعدُ مدخلٌ تتسرّب منه ظلمة الذنوب إلى القلب.'
    :`أغلقت ${closedN} من ${N} مجارٍ${pureN?`، وتنوّر منها ${pureN}`:''}. ما بقي مفتوحًا يُدخل الظلمة من جديد، فأغلقه مجرًى مجرًى حتى يصفو القلب كله.`;
  const pc=Math.round(p*100);
  return `<section><div class="sh"><h2>قلبك ومجاريه</h2><span>${closedN} / ${N} مغلقة</span></div>
   <div class="box pad heart-box">
    <div class="hq" style="--p:${p.toFixed(3)}" role="group" aria-label="صورة القلب: صفاؤه ${pc}%">
     <div class="hq-glow"></div><img class="hq-rays" src="rays.webp" alt="" aria-hidden="true">
     <div class="hq-h"><img src="heart.webp" alt="" aria-hidden="true"><div class="hq-dark"></div><div class="hq-st">${stains}</div><div class="hq-gl">${glows}</div></div>
     ${nodes}
    </div>
    <div class="hq-bar"><span>صفاء القلب</span><i><b style="width:${pc}%"></b></i><em dir="ltr">${pc}%</em></div>
    <div class="legend"><span><i style="background:#1a1512;border:1px solid #6b5d52"></i>مفتوح</span><span><i style="background:var(--teal)"></i>تطهير</span><span><i style="background:#E6C891"></i>تنوير</span><span><i style="background:#fff7e6"></i>تنوّرت</span></div>
    <p class="heart-msg">${msg}</p>
   </div></section>`}

function viewSura(){
  const days=[];for(let i=13;i>=0;i--)days.push(addDays(TODAY,-i));
  const vals=days.map(d=>S.log[d]?S.log[d].awrad.filter(x=>AWRAD.some(a=>a.id===x)).length/AWRAD.length:0);
  const W=340,H=150,pl=32,pb=22,pt=10,bw=(W-pl-6)/14,y=v=>pt+(H-pt-pb)*(1-v);
  let svg=`<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="نسبة إتمام الأوراد في آخر 14 يومًا">`;
  [0,.5,1].forEach(v=>{svg+=`<line x1="${pl}" x2="${W-4}" y1="${y(v)}" y2="${y(v)}" stroke="var(--card-line)"/><text x="${pl-6}" y="${y(v)+4}" font-size="10" fill="var(--muted)" text-anchor="end">${v*100}%</text>`});
  vals.forEach((v,i)=>{const x=pl+4+i*bw,h=Math.max(2,(H-pt-pb)*v),isT=i===13;
    svg+=`<rect x="${x}" y="${y(v)-(h-(H-pt-pb)*v)}" width="${bw-6}" height="${h}" rx="3" fill="${isT?'var(--amber)':'var(--teal)'}"/>`;
    if(i%2===1||isT)svg+=`<text x="${x+(bw-6)/2}" y="${H-6}" font-size="9" fill="var(--muted)" text-anchor="middle">${isT?'اليوم':+days[i].slice(8)}</text>`});
  svg+='</svg>';
  const logged=days.filter(d=>S.log[d]&&S.log[d].awrad.length).length;
  const avg=Math.round(vals.reduce((a,b)=>a+b,0)/14*100);
  const dDays=new Set(S.marks.dhikr.map(x=>ds(new Date(x))).filter(d=>d>=days[0])).size;
  const weak=AWRAD.map(a=>({a,n:days.filter(d=>S.log[d]&&S.log[d].awrad.includes(a.id)).length})).sort((p,q)=>p.n-q.n)[0];
  const done=ORGANS.filter(g=>S.organs[g.id].phase==='done').length;
  return heartSection()+`<section><div class="stats"><div class="stat"><b>${avg}%</b><span>متوسط الأوراد</span></div><div class="stat"><b>${logged}</b><span>أيام عامرة</span></div><div class="stat"><b>${dDays}</b><span>أيام الذكر الشخصي</span></div></div>
   <div class="box pad"><div class="sh" style="margin-bottom:8px"><h2 style="font-size:15px">إتمام الأوراد · آخر 14 يومًا</h2></div>${svg}</div></section>
  <section><div class="sh"><h2>مسار الجوارح</h2><span>${done} / ${ORGANS.length} مكتملة</span></div>
   <div class="box pad" style="display:flex;flex-direction:column;gap:10px">${ORGANS.map(g=>{const o=S.organs[g.id];const tot=o.phase==='done'?60:o.phase==='tanwir'?30+o.days:o.phase==='tathir'?o.days:0;const a=Math.min(tot,30),b=Math.max(0,tot-30);
     return `<div class="trow"><span>${g.name}</span><div class="bar"><i style="width:${a/60*100}%;background:var(--amber)"></i><i style="width:${b/60*100}%;background:var(--green)"></i></div><em>${tot}/60</em></div>`}).join('')}
   <div class="meta">البرتقالي: أيام التطهير · الأخضر: أيام التنوير</div></div></section>
  <section><div class="sh"><h2>توجيه</h2></div><div class="box pad">أقل الأوراد مواظبة في هذه الفترة: <b>${weak.a.t}</b> (${weak.n} من 14 يومًا). اجعل له وقتًا ثابتًا، فأحبّ الأعمال إلى الله أدومها وإن قلّ.</div></section>`;
}
let TQ=null;
let tqQuery='',tqAskMsg='',tqAskBusy=false,tqAskDraft='';
const TQUI={
 ar:{lall:'استمع إلى المنهج كاملًا',lone:'استمع إلى هذا الباب',lprev:'الفقرة السابقة',lnext:'الفقرة التالية',lpause:'إيقاف مؤقت',lstop:'إيقاف القراءة',ph:'ابحث في المنهج… (مثال: الكبر، البدعة، الوسوسة)',n:'عدد النتائج',none:'لا توجد نتائج لهذا البحث.',clr:'مسح',ask:'لم تجد جوابك؟ اطرح سؤالك',askp:'اكتب سؤالك عن المنهج المحمدي أو أبوابه…',send:'أرسل السؤال',sent:'وصل سؤالك إلى الإدارة، وسيُراجَع بإذن الله. جزاك الله خيرًا.',empty:'اكتب سؤالك أولًا.',off:'لإرسال السؤال يلزم الاتصال بالإنترنت وتسجيل الدخول بحسابك.',fail:'تعذّر الإرسال. تأكد من اتصالك ثم أعد المحاولة.',hint:'يصل سؤالك إلى مشرف التطبيق مع بريدك الإلكتروني.',start:'ابدأ تزكية الجوارح',secs:'أبواب المنهج',use:'اسأل عن هذه الكلمة'},
 en:{lall:'Listen to the whole method',lone:'Listen to this chapter',lprev:'Previous paragraph',lnext:'Next paragraph',lpause:'Pause',lstop:'Stop reading',ph:'Search the method… (e.g. arrogance, innovation, obsessive doubts)',n:'Results',none:'No results for this search.',clr:'Clear',ask:'Didn’t find your answer? Ask a question',askp:'Write your question about the Muhammadan Path or its chapters…',send:'Send question',sent:'Your question has reached the administration and will be reviewed, God willing. May God reward you.',empty:'Write your question first.',off:'To send a question you need an internet connection and to be signed in.',fail:'Could not send. Check your connection and try again.',hint:'Your question reaches the app’s supervisor together with your email.',start:'Start purifying the limbs',secs:'Chapters of the method',use:'Ask about this word'},
 fr:{lall:'Écouter toute la méthode',lone:'Écouter ce chapitre',lprev:'Paragraphe précédent',lnext:'Paragraphe suivant',lpause:'Pause',lstop:'Arrêter la lecture',ph:'Rechercher dans la méthode… (ex. : orgueil, innovation, waswasa)',n:'Résultats',none:'Aucun résultat pour cette recherche.',clr:'Effacer',ask:'Vous n’avez pas trouvé de réponse ? Posez votre question',askp:'Écrivez votre question sur la Voie muhammadienne ou ses chapitres…',send:'Envoyer la question',sent:'Votre question est parvenue à l’administration et sera examinée, si Dieu le veut. Qu’Allah vous récompense.',empty:'Écrivez d’abord votre question.',off:'Pour envoyer une question, il faut une connexion Internet et être connecté à votre compte.',fail:'Échec de l’envoi. Vérifiez votre connexion et réessayez.',hint:'Votre question parvient au superviseur de l’application avec votre e-mail.',start:'Commencer la purification des membres',secs:'Chapitres de la méthode',use:'Poser une question sur ce mot'},
 es:{lall:'Escuchar todo el método',lone:'Escuchar este capítulo',lprev:'Párrafo anterior',lnext:'Párrafo siguiente',lpause:'Pausa',lstop:'Detener la lectura',ph:'Buscar en el método… (p. ej.: soberbia, innovación, waswasa)',n:'Resultados',none:'No hay resultados para esta búsqueda.',clr:'Borrar',ask:'¿No encontraste la respuesta? Haz tu pregunta',askp:'Escribe tu pregunta sobre la Vía Muhammadiana o sus capítulos…',send:'Enviar pregunta',sent:'Tu pregunta ha llegado a la administración y será revisada, si Dios quiere. Que Dios te recompense.',empty:'Escribe primero tu pregunta.',off:'Para enviar una pregunta necesitas conexión a internet y haber iniciado sesión.',fail:'No se pudo enviar. Comprueba tu conexión e inténtalo de nuevo.',hint:'Tu pregunta llega al supervisor de la aplicación junto con tu correo.',start:'Empezar la purificación de los miembros',secs:'Capítulos del método',use:'Preguntar por esta palabra'},
 ru:{lall:'Слушать весь метод',lone:'Слушать этот раздел',lprev:'Предыдущий абзац',lnext:'Следующий абзац',lpause:'Пауза',lstop:'Остановить чтение',ph:'Поиск по методу… (напр.: высокомерие, нововведение, васваса)',n:'Найдено',none:'По этому запросу ничего не найдено.',clr:'Очистить',ask:'Не нашли ответа? Задайте вопрос',askp:'Напишите вопрос о Мухаммадовом пути или его разделах…',send:'Отправить вопрос',sent:'Ваш вопрос получен администрацией и будет рассмотрен, если пожелает Аллах. Да вознаградит вас Аллах.',empty:'Сначала напишите вопрос.',off:'Чтобы отправить вопрос, нужно подключение к интернету и вход в аккаунт.',fail:'Не удалось отправить. Проверьте подключение и попробуйте снова.',hint:'Ваш вопрос получит куратор приложения вместе с вашим e-mail.',start:'Начать очищение членов тела',secs:'Разделы метода',use:'Спросить об этом слове'},
ur:{lall:'پورا منہج سنیں',lone:'یہ باب سنیں',lprev:'پچھلا پیراگراف',lnext:'اگلا پیراگراف',lpause:'عارضی وقفہ',lstop:'پڑھنا روکیں',ph:'منہج میں تلاش کریں… (مثال: تکبر، بدعت، وسوسہ)',n:'نتائج کی تعداد',none:'اس تلاش کا کوئی نتیجہ نہیں۔',clr:'مٹائیں',ask:'جواب نہیں ملا؟ اپنا سوال پوچھیں',askp:'منہجِ محمدی یا اس کے ابواب کے بارے میں اپنا سوال لکھیں…',send:'سوال بھیجیں',sent:'آپ کا سوال انتظامیہ تک پہنچ گیا، ان شاء اللہ اس کا جائزہ لیا جائے گا۔ جزاک اللہ خیرا۔',empty:'پہلے اپنا سوال لکھیں۔',off:'سوال بھیجنے کے لیے انٹرنیٹ کنکشن اور اپنے اکاؤنٹ سے لاگ اِن ضروری ہے۔',fail:'بھیجا نہیں جا سکا۔ اپنا کنکشن چیک کریں پھر دوبارہ کوشش کریں۔',hint:'آپ کا سوال آپ کے ای میل کے ساتھ ایپ کے نگران تک پہنچتا ہے۔',start:'اعضا کا تزکیہ شروع کریں',secs:'منہج کے ابواب',use:'اس لفظ کے بارے میں پوچھیں'}
};
const tqU=()=>TQUI[LANG]||TQUI.ar;
const tqNorm=s=>RTL()?normAr(s):String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/ё/g,'е');
function tqBlock([k,c]){
  if(k==='h')return `<h4>${c}</h4>`;
  if(k==='note')return `<p class="tq-note">${c}</p>`;
  if(k==='ul'||k==='ol')return `<${k}>${c.map(x=>`<li>${x}</li>`).join('')}</${k}>`;
  if(k==='dl')return `<dl class="tq-dl">${c.map(([n,d])=>`<div><dt>${n}</dt><dd>${d}</dd></div>`).join('')}</dl>`;
  return `<p>${c}</p>`}
