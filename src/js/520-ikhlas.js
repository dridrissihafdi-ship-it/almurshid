/* ---------- ikhlas: intention at the start, middle and end; praise; the 90-day sheet; secret deeds ---------- */
const niyaOn=()=>S.niya!==false&&S.niyaOff!==TODAY;
let niyaT=0,niyaLast={};
function niyaStart(scr){if(!niyaOn())return;const k=scr.startsWith('adh_')?scr:'quran';if(Date.now()-(niyaLast[k]||0)<15*60e3)return;niyaLast[k]=Date.now();
  setTimeout(()=>{if(screen!==scr)return;sheetOpen(`<div class="niy"><div class="niy-em"><svg viewBox="0 0 24 24">${QI.heart}</svg></div><h3>جدّد نيتك قبل أن تبدأ</h3><p class="meta">لا لثواب ولا لثناء، بل لوجه الله وحده</p><p class="niy-du">«اللهم اجعل عملي كله صالحًا، واجعله لوجهك خالصًا، ولا تجعل لأحد فيه شيئًا»</p><button class="btn ok niy-b" data-bsx="1">نويتُ لله، ابدأ</button><button class="btn niy-b" data-niyaoff="1">لا تذكّرني اليوم</button></div>`)},350);
  clearTimeout(niyaT);niyaT=setTimeout(()=>{if(screen!==scr||!niyaOn())return;niyaToast()},4*60e3)}
function niyaToast(){let t=document.getElementById('niyT');if(t)t.remove();t=document.createElement('div');t.id='niyT';t.className='niy-t';t.dir=RTL()?'rtl':'ltr';
  t.innerHTML=`<i><svg viewBox="0 0 24 24">${QI.heart}</svg></i><span><b>${Tx('لمن تعمل الآن؟')}</b><small>${Tx('لحظة لتصحيح النية في وسط العمل')}</small></span>`;document.body.appendChild(t);t.addEventListener('click',()=>t.remove());setTimeout(()=>{t.classList.add('out');setTimeout(()=>t.remove(),400)},7000)}
function niyaEnd(w){if(!niyaOn())return;const n={sabah:'أذكار الصباح',masa:'أذكار المساء',quran:'ورد القرآن',dhikr:'الذكر الشخصي'}[w];if(!n)return;
  setTimeout(()=>sheetOpen(`<div class="niy"><h3><span>ختمتَ</span> <span>${n}</span></h3><p class="niy-du">«اللهم تقبّل منّي، وأستغفرك من كل ما لم يكن لوجهك»</p><button class="btn ok niy-b" data-bsx="1">تقبّل الله</button></div>`),300)}
function madhOpen(){const wk=new Date(Date.now()-6*864e5).toISOString().slice(0,10),n=(S.madh||[]).filter(d=>d>=wk).length;
  sheetOpen(`<div class="niy"><h3>مُدِحتَ الآن؟</h3><p class="meta">استحضر أن حاجتك إلى التقدير يقضيها الله</p>
   <div class="nm4"><div><b>البصير</b><small>يرى عملك ولو لم يره أحد</small></div><div><b>السميع</b><small>يسمع كل كلمة وهمسة منك</small></div><div><b>العليم</b><small>يعلم أفكارك وظروفك ونيّتك</small></div><div><b>الشكور</b><small>يكافئ صنيعك بما لا يستطيعه بشر</small></div></div>
   <p class="niy-du">«اللهم لا تؤاخذني بما يقولون، واغفر لي ما لا يعلمون، واجعلني خيرًا مما يظنون»</p><button class="btn ok niy-b" data-madhok="1">قلتُها، والحمد لله</button><p class="meta" style="margin-top:8px"><span>يُسجَّل سرًّا</span> · <span>هذا الأسبوع:</span> ${n}</p></div>`)}
/* the ikhlas sheet: four questions every night, ninety days in a row */
const IKQ=['نويتُ في بداية عباداتي','جدّدتُ النية في وسطها','عملتُ شيئًا ليراه الناس','فرحتُ بمدح أحد'],IKGOOD=[1,1,0,0];
function ikS(){if(!S.ikh)S.ikh={base:null,log:{},breaks:0};return S.ikh}
const ikDone=d=>{const a=(ikS().log[d]||{}).a||[];return IKQ.every((_,i)=>a[i]===0||a[i]===1)};
function ikDays(){const K=ikS();if(!K.base)return{n:0,start:null};let d=ikDone(TODAY)?TODAY:addDays(TODAY,-1),n=0;while(d>=K.base&&ikDone(d)){n++;d=addDays(d,-1)}return{n,start:addDays(d,1)}}
function viewIkhlas(){const K=ikS(),R=ikDays(),n=Math.min(R.n,90),a=(K.log[TODAY]||{}).a||[];
  if(!K.base)return `<section><div class="box pad"><p>ورقة الإخلاص محاسبة قصيرة كل ليلة: أربعة أسئلة بنعم أو لا، تسعين يومًا متواصلة. هي المرحلة الأولى من الإخلاص.</p><div class="btns"><button class="btn ok" data-ikstart="1">ابدأ ورقة الإخلاص</button><button class="btn" data-go="ikhl">اقرأ درس الإخلاص</button></div></div></section>`;
  const dots=Array.from({length:90},(_,i)=>`<i class="${i<n?'d':i===n&&!ikDone(TODAY)?'t':''}"></i>`).join('');
  return `<section><div class="box pad ik-top">${tzRing(n,n>=90?'tanwir':'tathir')}<div><b>${n>=90?'أتممت المرحلة الأولى ✓':'المرحلة الأولى'}</b><small><span>اليوم</span> ${Math.min(n+(ikDone(TODAY)?0:1),90)} <span>من</span> 90</small></div></div>
   <div class="ik-dots">${dots}</div>
   <div class="sh qa-sh"><h2>محاسبة الليلة</h2></div>
   <div class="box ik-q">${IKQ.map((q,i)=>`<div class="ik-r"><span>${q}</span><div class="ik-yn">${[1,0].map(v=>`<button class="${a[i]===v?(v===IKGOOD[i]?'g':'b'):''}" data-ikq="${i}" data-v="${v}">${v?'نعم':'لا'}</button>`).join('')}</div></div>`).join('')}</div>
   <p class="meta">يُحسب اليوم حين تجيب عن الأسئلة الأربعة بصدق، أيًّا كانت الإجابة. اليوم الذي لا تجيب فيه يقطع العدّ.</p>
   <div class="box h2-more tz-more" style="margin-top:12px">${tzRow('data-go="ikhl"',Q2('book'),'درس الإخلاص','')}${tzRow('data-go="sirr"',Q2('moon'),'أعمال السر','')}${tzRow('data-madh="1"',Q2('heart'),'مُدِحتُ الآن','')}</div></section>`}
/* secret deeds: no numbers, no statistics */
const SIRR_DEF=[['صدقة لا يعلمها أحد','بلا مبلغ ولا عدد'],['ركعتان في جوف الليل','لا يراك فيهما إلا الله'],['قضاء حاجة دون أن يُعرف','لا تخبر بها أحدًا'],['دعاء لأخ بظهر الغيب','']];
const SIRR_WK=['ادعُ لثلاثة إخوة بظهر الغيب، بأسمائهم','تصدّق بصدقة لا تعرفها يدك الأخرى','أصلح بين اثنين دون أن يُذكر اسمك','صلِّ ركعتين في الليل لا يعلم بهما أحد','اقضِ حاجة جار أو قريب دون أن يعرف أنها منك','اقرأ جزءًا من القرآن في خلوة لا يراك فيها أحد','استغفر لوالديك ولمن أساء إليك سرًّا','أطعم جائعًا أو حيوانًا دون أن تخبر أحدًا'];
function sirrL(){if(!S.sirr)S.sirr={mine:[],d:{}};return S.sirr}
function viewSirr(){const Z=sirrL(),done=Z.d[TODAY]||[],wk=SIRR_WK[Math.floor(Date.now()/(7*864e5))%SIRR_WK.length],L=[...SIRR_DEF.map((x,i)=>({id:'d'+i,t:x[0],s:x[1]})),...Z.mine.map(m=>({id:m.id,t:m.t,s:'',own:1}))];
  return `<section><div class="box pad sirr-w"><small>عمل هذا الأسبوع</small><b>${wk}</b></div>
   <div class="box sirr-l">${L.map(x=>`<div class="sirr-r"><span class="${x.own?'notr':''}" dir="auto">${x.own?esc(x.t):x.t}${x.s?`<small>${x.s}</small>`:''}</span>${x.own?`<button class="sirr-x" data-sirrdel="${x.id}" aria-label="delete">✕</button>`:''}<button class="chk2${done.includes(x.id)?' on':''}" data-sirr="${x.id}" aria-label="done">✓</button></div>`).join('')}</div>
   <div class="ad-inl" style="margin-top:10px"><input id="sirrIn" type="text" dir="auto" placeholder="${esc(Tx('أضف عملًا خفيًّا خاصًّا بك'))}"><button class="btn small" data-sirradd="1">أضف</button></div>
   <p class="meta" style="text-align:center;margin-top:12px">لا عدّاد ولا نسبة هنا. هذه الأعمال بينك وبين الله، ولا تظهر في أي إحصاء، وتُمحى علاماتها كل يوم.</p></section>`}
function ikhClick(d){
  if(d.niyaoff){S.niyaOff=TODAY;save();sheetClose();return true}
  if(d.madh){madhOpen();return true}
  if(d.madhok){if(!S.madh)S.madh=[];S.madh.push(TODAY);S.madh=S.madh.slice(-200);save();sheetClose();return true}
  if(d.ikstart){ikS().base=TODAY;save();render();return true}
  if(d.ikq!==undefined){const K=ikS(),L=K.log[TODAY]||(K.log[TODAY]={a:[]});L.a[+d.ikq]=+d.v;
    save();const y=SCR().scrollTop;render();SCR().scrollTo(0,y);return true}
  if(d.sirr){const Z=sirrL();Object.keys(Z.d).forEach(k=>{if(k<TODAY)delete Z.d[k]});const L=Z.d[TODAY]||(Z.d[TODAY]=[]);const i=L.indexOf(d.sirr);if(i>=0)L.splice(i,1);else L.push(d.sirr);save();const y=SCR().scrollTop;render();SCR().scrollTo(0,y);return true}
  if(d.sirradd){const v=(document.getElementById('sirrIn').value||'').trim();if(!v)return true;sirrL().mine.push({id:'m'+Date.now().toString(36),t:v.slice(0,120)});save();render();return true}
  if(d.sirrdel){const Z=sirrL();Z.mine=Z.mine.filter(m=>m.id!==d.sirrdel);save();render();return true}
  if(d.ikset){if(d.ikset==='ikMode')S.ikMode=!S.ikMode;else S.niya=S.niya===false;save();const y=SCR().scrollTop;render();SCR().scrollTo(0,y);return true}
  return false}
function ikSettings(){const sw=(k,on,t,sub)=>`<button class="ik-sw" data-ikset="${k}"><span>${t}<small>${sub}</small></span><i class="${on?'on':''}"></i></button>`;
  return sw('ikMode',!!S.ikMode,'وضع الإخلاص','يخفي الأرقام والنسب في الصفحة الرئيسية، ويذكّر بما بقي فقط')+sw('niya',S.niya!==false,'تذكير النية','في بداية الأذكار والورد، وفي وسطها، وعند ختامها')}
const Q2=k=>`<g transform="scale(2)" style="stroke-width:1">${QI[k]}</g>`;
function viewIkhub(){const K=ikS(),R=ikDays(),wk=new Date(Date.now()-6*864e5).toISOString().slice(0,10),nm=(S.madh||[]).filter(d=>d>=wk).length,sd=((sirrL().d||{})[TODAY]||[]).length;
  return `<section><p class="muted" style="margin:0 2px 12px">«إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى»</p>
   <div class="box h2-more tz-more">${tzRow('data-go="ikhlas"',Q2('star'),'ورقة الإخلاص',K.base?`<span>اليوم</span> ${Math.min(R.n+(ikDone(TODAY)?0:1),90)} <span>من</span> 90${ikDone(TODAY)?' · <span>أجبت الليلة ✓</span>':''}`:'<span>تسعون يومًا من المحاسبة الليلية</span>')}
    ${tzRow('data-madh="1"',Q2('heart'),'مُدِحتُ الآن','<span>الأسماء الأربعة ودعاء أبي بكر رضي الله عنه</span>')}
    ${tzRow('data-go="sirr"',Q2('moon'),'أعمال السر',sd?'<span>عملتَ اليوم عملًا خفيًّا ✓</span>':'<span>بلا أرقام ولا إحصاء</span>')}
    ${tzRow('data-go="ikhl"',Q2('book'),'درس الإخلاص','<span>ملخص الدرس في ستة أقسام</span>')}</div>
   <div class="sh qa-sh"><h2>الإعدادات</h2></div><div class="box pad">${ikSettings()}</div></section>`}
const ttsBtn=(t,from)=>TTS_OK?`<button class="tts-all" ${from?`data-ttsfrom="${from}"`:'data-ttsall="1"'}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12"/></svg><span>${t||'استمع إلى النص كاملًا'}</span></button>`:'';
function viewLesson(k){const X=lessonGet(k);
  return `<section class="ls">${LANG!=='ar'&&!lsL(k)?'<p class="ls-ar">هذا الدرس متوفر بالعربية فقط.</p>':''}<button class="st-btn" data-story="${k}">${ilSvg(ST_MOTIF[k]||'m_path')}<span><b>اعرضه كقصص مصوّرة</b><small>صورة وفكرة في كل صفحة</small></span></button>${ttsBtn('استمع إلى الدرس كاملًا')}<div class="box pad ls-lead tts-s notr" ${lsDir(k)}>${X.lead}</div>
   ${lsAcc(X,0)}
   <div class="btns">${X.go.map(([g,t],i)=>`<button class="btn${i?' small':' ok'}" data-go="${g}">${t}</button>`).join('')}</div>
   <p class="meta">ملخّص منقّح لمادة الدرس. يُستحسن مراجعته مع الشيخ.</p></section>`}
const AHDAF=[
 {id:'g1',tab:'أمر الله',t:'التَّعْظِيمُ لِأَمْرِ اللَّهِ',h:'إِعْطَاءُ الْأَوْلَوِيَّةِ لِلَّهِ وَطَاعَتِهِ',
  def:'أَنْ تَكُونَ فِي طَاعَةٍ كَامِلَةٍ لِأَوَامِرِ اللَّهِ، بِعِبَادَتِهِ وَحْدَهُ دُونَ غَيْرِهِ، وَأَلَّا تَتَّخِذَ مَعَهُ آلِهَةً أُخْرَى، وَأَنْ تُعْطِيَ الْأَوْلَوِيَّةَ لِجَمِيعِ أَوَامِرِهِ عَلَى أَيِّ أَوَامِرَ أُخْرَى. فَتَكُونَ الْأَوْلَوِيَّةُ فِي حَيَاتِكَ لِلَّهِ وَلِأَوَامِرِهِ.',
  ev:'﴿قُلْ إِنَّ صَلَاتِي وَنُسُكِي وَمَحْيَايَ وَمَمَاتِي لِلَّهِ رَبِّ الْعَالَمِينَ ۝ لَا شَرِيكَ لَهُ ۖ وَبِذَٰلِكَ أُمِرْتُ وَأَنَا أَوَّلُ الْمُسْلِمِينَ﴾ <small>(الْأَنْعَامُ: 162-163)</small>',
  sign:'الْمُبَادَرَةُ إِلَى الْفَرَائِضِ فِي أَوْقَاتِهَا، وَالْوُقُوفُ عِنْدَ حُدُودِ اللَّهِ.',
  go:[['jawarih','تزكية الجوارح'],['fiqh','دروس الفقه'],['aamal','أعمال اليوم']]},
 {id:'g2',tab:'أمر الرسول ﷺ',t:'التَّعْظِيمُ لِأَمْرِ رَسُولِ اللَّهِ ﷺ',h:'إِعْطَاءُ الْأَوْلَوِيَّةِ لِحُبِّ النَّبِيِّ ﷺ وَاتِّبَاعِ سُنَّتِهِ',
  def:'أَنْ تُعْطِيَ الْأَوْلَوِيَّةَ لِاتِّبَاعِ حَيَاةِ رَسُولِ اللَّهِ ﷺ عَلَى سَائِرِ طُرُقِ الْحَيَاةِ الْأُخْرَى، وَأَنْ تُحِبَّ الرَّسُولَ ﷺ أَكْثَرَ مِمَّا تُحِبُّ سَائِرَ الْخَلْقِ، بِمَنْ فِيهِمْ نَفْسُكَ.',
  ev:'قَالَ رَسُولُ اللَّهِ ﷺ: «لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى أَكُونَ أَحَبَّ إِلَيْهِ مِنْ وَالِدِهِ وَوَلَدِهِ وَالنَّاسِ أَجْمَعِينَ» <small>(الْبُخَارِيُّ وَمُسْلِمٌ)</small>. وَقَالَ لِعُمَرَ رَضِيَ اللَّهُ عَنْهُ حِينَ قَالَ لَهُ: لَأَنْتَ أَحَبُّ إِلَيَّ مِنْ كُلِّ شَيْءٍ إِلَّا مِنْ نَفْسِي: «لَا، وَالَّذِي نَفْسِي بِيَدِهِ، حَتَّى أَكُونَ أَحَبَّ إِلَيْكَ مِنْ نَفْسِكَ» <small>(الْبُخَارِيُّ)</small>.',
  sign:'الْحِرْصُ عَلَى السُّنَنِ وَالنَّوَافِلِ، وَالْإِكْثَارُ مِنَ الصَّلَاةِ عَلَيْهِ ﷺ.',
  go:[['duas','سنن الرسول ﷺ'],['sira','السيرة النبوية'],['aql','تزكية العقل: المستوى التاسع']]},
 {id:'g3',tab:'الخلق',t:'الشَّفَقَةُ عَلَى الْخَلْقِ',h:'الشَّفَقَةُ عَلَى الْمَخْلُوقَاتِ',
  def:'أَنْ تَرْحَمَ الْمَخْلُوقَاتِ وَتَعْطِفَ عَلَيْهَا: فَتُسَاعِدَ الْبَشَرَ، وَتَخْدُمَ الْبِيئَةَ، بِثَرْوَتِكَ وَمُمْتَلَكَاتِكَ وَوَفَائِكَ، وَأَنْ تَحْمِيَ الْإِنْسَ وَالْجِنَّ مِنْ عَذَابِ يَوْمِ الْقِيَامَةِ، بِأَنْ تُذَكِّرَهُمْ بِسُبُلِ النَّجَاحِ فِي ضَوْءِ الْقُرْآنِ وَالسُّنَّةِ.',
  ev:'قَالَ رَسُولُ اللَّهِ ﷺ: «الرَّاحِمُونَ يَرْحَمُهُمُ الرَّحْمَنُ، ارْحَمُوا مَنْ فِي الْأَرْضِ يَرْحَمْكُمْ مَنْ فِي السَّمَاءِ» <small>(أَبُو دَاوُدَ وَالتِّرْمِذِيُّ)</small>.',
  sign:'الصَّدَقَةُ، وَقَضَاءُ الْحَوَائِجِ، وَالْكَلِمَةُ الطَّيِّبَةُ، وَالدَّعْوَةُ إِلَى الْخَيْرِ بِالْحِكْمَةِ.',
  go:[['aamal','أعمال اليوم'],['majalis','المجالس']]},
 {id:'g4',tab:'الحضور',t:'الْحُضُورُ مَعَ اللَّهِ',h:'الْحُضُورُ مَعَ اللَّهِ',
  def:'أَنْ تَسْتَحْضِرَ وَتَتَذَكَّرَ وَتَشْعُرَ وَتُؤْمِنَ بِأَنَّكَ مَعَ الْخَالِقِ، وَأَنَّ اللهَ يُرَاقِبُ كُلَّ تَحَرُّكَاتِكَ، وَيَعْلَمُ مَا يَجُولُ بِخَاطِرِكَ، وَهُوَ مَعَكَ أَيْنَمَا كُنْتَ وَفِي أَيِّ مَوْقِفٍ كُنْتَ.',
  ev:'﴿وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ ۚ وَاللَّهُ بِمَا تَعْمَلُونَ بَصِيرٌ﴾ <small>(الْحَدِيدُ: 4)</small>. وَفِي حَدِيثِ جِبْرِيلَ عَلَيْهِ السَّلَامُ: «الْإِحْسَانُ أَنْ تَعْبُدَ اللَّهَ كَأَنَّكَ تَرَاهُ، فَإِنْ لَمْ تَكُنْ تَرَاهُ فَإِنَّهُ يَرَاكَ» <small>(مُسْلِمٌ)</small>.',
  sign:'الذِّكْرُ بِالْقَلْبِ فِي كُلِّ حَالٍ، وَمُرَاقَبَةُ اللَّهِ فِي السِّرِّ وَالْعَلَنِ.',
  go:[['aql','تزكية العقل: المستوى العاشر'],['muraqabat','المراقبات'],['khalwa','الخلوة والاعتكاف']]}];
let ahTab='g1';
function viewAhdaf(){const G0=AHDAF.find(g=>g.id===ahTab)||AHDAF[0],GA=lsL('AHDAF'),G=Object.assign({},G0,GA&&GA[G0.id]||{}),gd=GA?'dir="auto"':'dir="rtl"',man=pathMan(),m=!!man[G.id];
  return `<section><p class="muted" style="margin:0 2px 12px">جبل الأهداف هو غاية الطريق: يبلغه السالك بعد جبل الشروط وجسر التزكية، وتُعرف كل غاية بعلامتها في حياته.</p>
   <div class="rtabs tz-stg" role="tablist">${AHDAF.map((g,i)=>`<button role="tab" aria-selected="${g.id===G.id}" class="${g.id===G.id?'on':''}${man[g.id]?' dn':''}" data-ahtab="${g.id}"><i>${man[g.id]?'✓':i+1}</i><span>${g.tab}</span></button>`).join('')}</div>
   ${ttsBtn('استمع إلى هذه الغاية')}<div class="box pad tz-sh tts-s"><b class="notr">${G.t}</b><p class="notr" ${gd} style="color:var(--ink);font-size:15px">${G.def}</p></div>
   <div class="box pad ah-b tts-s"><h3 class="notr">${G.h}</h3><div class="ls-b notr" ${gd} style="padding:0"><p class="ls-q">${G.ev}</p></div></div>
   <div class="box pad ah-b tts-s"><h3>عَلَامَتُهُ فِي حَيَاةِ السَّالِكِ</h3><p class="notr" ${gd}>${G.sign}</p>
    <div class="btns"><button class="btn${m?' ok':''}" data-pathman="${G.id}">${m?'✓ أجد هذا في نفسي':'أجد هذا في نفسي'}</button></div></div>
   <div class="sh" style="margin:18px 2px 8px"><h2>ما يعينك عليه في التطبيق</h2></div>
   <div class="box h2-more tz-more">${G.go.map(([g,t])=>tzRow(`data-go="${g}"`,TZI.book,t,'')).join('')}</div>
   <p class="meta">الدليل والعلامة من إضافة التطبيق، يُستحسن مراجعتهما مع الشيخ.</p></section>`}
function viewFatur(){const blk=(t,x)=>`<div class="box pad fat tts-s"><h3 class="fat-h">${t}</h3><p>${x}</p></div>`;
  return `<section>${ttsBtn()}<p class="muted tts-s">الْفُتُورُ يَعْرِضُ لِكُلِّ سَالِكٍ، وَلَيْسَ عَلَامَةً عَلَى الْفَشَلِ. قَالَ النَّبِيُّ ﷺ: «إِنَّ لِكُلِّ عَمَلٍ شِرَّةً، وَلِكُلِّ شِرَّةٍ فَتْرَةً، فَمَنْ كَانَتْ فَتْرَتُهُ إِلَى سُنَّتِي فَقَدِ اهْتَدَى».</p>
   ${blk('حَافِظْ عَلَى الْحَدِّ الْأَدْنَى','لَا تَتْرُكِ الْفَرَائِضَ مَهْمَا ضَعُفَتْ هِمَّتُكَ، وَاكْتَفِ مُؤَقَّتًا بِالْقَلِيلِ مِنَ النَّوَافِلِ وَالْأَذْكَارِ. الْمُهِمُّ أَلَّا يَنْقَطِعَ الْحَبْلُ.')}
   ${blk('جَدِّدِ النِّيَّةَ وَالتَّوْبَةَ','ارْجِعْ إِلَى اللَّهِ بِلَا جَلْدٍ لِلذَّاتِ: «كُلُّ ابْنِ آدَمَ خَطَّاءٌ، وَخَيْرُ الْخَطَّائِينَ التَّوَّابُونَ».')}
   ${blk('غَيِّرِ الْوَسِيلَةِ لَا الْغَايَةِ','إِنْ مَلَّتْ نَفْسُكَ مِنْ عَمَلٍ فَجَرِّبْ غَيْرَهُ: اسْتَمِعْ إِلَى دَرْسٍ بَدَلَ الْقِرَاءَةِ، أَوِ امْشِ إِلَى الْمَسْجِدِ، أَوِ اذْكُرِ اللَّهَ فِي الطَّرِيقِ.')}
   ${blk('اعْتَنِ بِجَسَدِكَ','النَّوْمُ وَالطَّعَامُ وَالرَّاحَةُ عَوْنٌ عَلَى الْعِبَادَةِ: «إِنَّ لِبَدَنِكَ عَلَيْكَ حَقًّا».')}
   ${blk('لَا تَبْقَ وَحْدَكَ','الصُّحْبَةُ الصَّالِحَةُ تَحْمِلُ السَّالِكَ فِي ضَعْفِهِ. احْضُرْ مَجْلِسًا، أَوْ تَحَدَّثْ مَعَ شَيْخِكَ بِمَا تَجِدُهُ.')}
   ${blk('إِنِ اشْتَدَّ الضِّيقُ','إِنْ كَانَ ضِيقُ الصَّدْرِ شَدِيدًا أَوْ طَوِيلًا، أَوْ صَارَ يَمْنَعُكَ مِنْ حَيَاتِكَ الْيَوْمِيَّةِ، فَتَحَدَّثْ مَعَ شَخْصٍ تَثِقُ بِهِ، وَاسْتَشِرْ طَبِيبًا أَوْ مُخْتَصًّا نَفْسِيًّا. طَلَبُ الْمُسَاعَدَةِ لَا يَتَعَارَضُ مَعَ الْإِيمَانِ.')}
   <div class="btns"><button class="btn ok" data-go="majalis">المجالس القادمة</button></div></section>`}
