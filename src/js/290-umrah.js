const umRed=t=>String(t).replace(/(﴿[^﴾]*﴾|«[^»]*»)/g,'<span class="um-red">$1</span>');
const UMRAH_UR={"st":[{"t":"تیاری اور میقات","img":"miqat","do":["اللہ سے توبہ کیجیے، اور جن پر آپ نے زیادتی کی ہو ان سے معافی مانگ لیجیے۔","ناخن تراشیے، پھر غسل کیجیے۔","مرد دو سفید بغیر سلی چادریں اور چپل پہنے۔ عورت اپنا عام ساتر لباس پہنے۔","ہوائی جہاز سے آنے والے: میقات سے پہلے جہاز ہی میں احرام باندھ لیں، پہنچنے سے پہلے اس کا اعلان کیا جاتا ہے۔ اور جو پہلے مدینہ جائے وہ ابیارِ علی سے احرام باندھے۔"],"note":"مالکیہ کے نزدیک احرام کے وقت خوشبو نہ لگائیں۔ اور میقات سے بغیر احرام کے آگے نہ بڑھیں۔"},{"t":"احرام اور تلبیہ","img":"ihram","do":["دو رکعت نماز پڑھیے۔","دل سے عمرے کی نیت کیجیے اور کہیے: «لَبَّيْكَ عُمْرَةً»۔","راستے میں کثرت سے تلبیہ پڑھتے رہیے۔","مرد قدرے بلند آواز سے پڑھے، اور عورت آہستہ۔"],"dua":[["تلبیہ","لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ"]],"note":"مالکیہ کے نزدیک تلبیہ واجب ہے۔ حرم کی حدود میں داخل ہونے پر اسے روک دیں۔"},{"t":"مسجدِ حرام میں داخلہ","img":"masjid","do":["خشوع کے ساتھ دایاں پاؤں پہلے رکھ کر داخل ہوں۔","جب کعبہ پر نظر پڑے تو جو چاہیں دعا مانگیں۔","فوراً طواف شروع کریں، یہی مسجدِ حرام کا تحیہ ہے۔"],"dua":[["داخل ہوتے وقت","بِسْمِ اللَّهِ، وَالصَّلَاةُ وَالسَّلَامُ عَلَى رَسُولِ اللَّهِ، اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ"]]},{"t":"طواف","img":"tawaf","do":["باوضو رہیے۔","حجرِ اسود سے شروع کیجیے، اور کعبہ کو اپنی بائیں جانب رکھیے۔","سات چکر لگائیے، اور حطیم (کعبہ کے ساتھ نیم دائرہ) کے اندر سے نہ گزریں۔","حجرِ اسود کے پاس: ممکن ہو تو اسے بوسہ دیں، یا ہاتھ سے چھوئیں، ورنہ تکبیر کہہ کر آگے بڑھ جائیں۔ کسی کو دھکا نہ دیں۔","مرد پہلے تین چکروں میں قدرے تیز چلے۔","جو چاہیں دعا مانگیں، ہر چکر کی کوئی مخصوص دعا نہیں۔"],"dua":[["رکنِ یمانی اور حجرِ اسود کے درمیان","رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ"]],"note":"اگر چکروں کی تعداد میں شک ہو تو کم تعداد کو اختیار کریں۔"},{"t":"طواف کی دو رکعتیں اور زمزم","img":"maqam","do":["ممکن ہو تو مقامِ ابراہیم کے پیچھے دو رکعت پڑھیں، ورنہ مسجد میں کہیں بھی۔","ان میں «قل یا ایہا الکافرون» اور «قل ہو اللہ احد» پڑھیں۔","زمزم پئیں اور جو چاہیں دعا مانگیں۔"],"note":"مالکیہ کے نزدیک یہ دو رکعتیں واجب ہیں، انہیں نہ چھوڑیں۔"},{"t":"سعی","img":"sai","do":["صفا پر جائیں، کعبہ کی طرف رخ کریں، تکبیر کہیں اور دعا مانگیں۔","مروہ کی طرف چلیں۔ دونوں سبز روشنیوں کے درمیان مرد تیز چلے۔","مروہ پر بھی وہی کریں جو صفا پر کیا تھا۔","جانا ایک چکر ہے اور واپس آنا ایک چکر۔ سات چکر پورے کریں جو مروہ پر ختم ہوں۔"],"dua":[["صفا اور مروہ پر","اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ"]]},{"t":"حلق یا قصر","img":"halq","do":["مرد پورا سر منڈوائے، یہی افضل ہے، یا پورے سر کے بال کتروائے۔","عورت اپنے بالوں کے سروں سے انگلی کے پور کے برابر کاٹے۔","اس کے ساتھ عمرہ مکمل ہو جاتا ہے، اور احرام کی وجہ سے ممنوع ہر چیز حلال ہو جاتی ہے۔"],"note":"صرف چند بال کاٹنا کافی نہیں۔"},{"t":"عمرے کے بعد","img":"kaaba","do":["اللہ کا شکر ادا کیجیے، اور اپنے لیے، اپنے والدین کے لیے اور مسلمانوں کے لیے دعا کیجیے۔","مسجدِ حرام میں کثرت سے نماز اور طواف کیجیے۔","مکہ سے روانگی سے پہلے طوافِ وداع کیجیے۔","واپسی کے بعد جو پاکیزگی آپ نے حاصل کی ہے اس کی حفاظت کیجیے۔"]}],"do":[["مالکیہ کے نزدیک عمرے کے ارکان","احرام، پھر طواف، پھر سعی۔ ان کے بغیر عمرہ درست نہیں ہوتا۔"],["واجبات","میقات سے احرام، تلبیہ، طواف کی دو رکعتیں، اور حلق یا قصر۔ اور مرد سلا ہوا لباس نہ پہنے۔"],["سنتیں","غسل، حجرِ اسود کو بوسہ دینا یا چھونا، طواف میں اور دونوں سبز روشنیوں کے درمیان مرد کا تیز چلنا، اور صفا و مروہ پر دعا۔"]],"av":[["احرام کی حالت میں ممنوع",["مرد کے لیے سلا ہوا لباس پہننا (قمیص، شلوار، موزے)۔","مرد کا سر ڈھانپنا، اور عورت کا نقاب اور دستانے پہننا۔","خوشبو۔","بال یا ناخن کاٹنا۔","جانوروں کا شکار۔","نکاح یا منگنی۔","ازدواجی تعلق۔"]],["عام غلطیاں",["حجرِ اسود کو بوسہ دینے کے لیے دھکم پیل۔","حطیم کے اندر سے طواف کرنا۔","حجرِ اسود کے علاوہ کہیں اور سے طواف شروع کرنا۔","بلند آواز سے اجتماعی دعائیں پڑھنا۔","تصویریں لینے میں مشغول رہنا۔","طواف کی دو رکعتیں بھول جانا۔","صرف چند بال کاٹنا۔"]],["اگر غلطی ہو جائے","اگر آپ سے کوئی ممنوع کام ہو جائے تو کسی عالم سے پوچھیے کہ آپ پر کیا لازم ہے۔"]],"wo":["اپنا عام ساتر لباس پہنے۔","نقاب اور دستانے نہ پہنے۔","طواف اور سعی میں تیز نہ چلے۔","حیض والی عورت طواف کے سوا سب کچھ کرے، یہاں تک کہ پاک ہو جائے۔","اپنے بالوں سے انگلی کے پور کے برابر کاٹے۔"]};
function viewUmrah(){const U=LANG==='ur'?UMRAH_UR:UMRAH,n=U.st.length,i=Math.max(0,Math.min(n-1,S.umStep||0)),x=U.st[i];
  return `<section class="um">
   <div class="um-vid"><p class="um-vt"><b>فيديو: مراحل العمرة خطوة بخطوة</b><span class="meta"><span>دقيقة ونصف</span></span></p><video id="umVideo" src="umrah.mp4" poster="umrah.jpg" controls playsinline preload="none"></video></div>
   <p class="muted um-in">خطوات العمرة بالصور، على مذهب الإمام مالك.</p>
   <div class="um-dots" role="tablist">${U.st.map((s,k)=>`<button class="${k===i?'on':k<i?'past':''}" role="tab" aria-selected="${k===i}" data-umstep="${k}" aria-label="${k+1}">${k+1}</button>`).join('')}</div>
   <article class="um-card">
    <div class="um-art">${IL_IMG.has('um_'+x.img)&&!IL_BAD.has('um_'+x.img)?ilSvg('um_'+x.img):`<svg viewBox="0 0 320 170" role="img" aria-label="${esc(x.t)}">${UMART[x.img]}</svg>`}</div>
    <div class="um-b"><p class="um-k"><span>المرحلة</span> ${i+1} / ${n}</p><h3>${x.t}</h3>
     <ul>${x.do.map(t=>`<li>${umRed(t)}</li>`).join('')}</ul>
     ${(x.dua||[]).map(([l,t])=>`<div class="um-dua"><small>${l}</small><p>${t}</p></div>`).join('')}
     ${x.note?`<p class="um-note"><b>انتبه:</b> ${x.note}</p>`:''}
    </div></article>
   <div class="msh-nav"><button class="btn" data-umstep="${i-1}"${i?'':' disabled'}>→ السابق</button><span dir="ltr">${i+1} / ${n}</span>${i<n-1?`<button class="btn ok" data-umstep="${i+1}">التالي ←</button>`:`<button class="btn ok" data-umstep="0">من البداية</button>`}</div>
  </section>
  <section><div class="acc-card">
   ${acc('um-do','list','ما يجب فعله',U.do.map(([t,b])=>`<p class="um-h">${t}</p><p>${b}</p>`).join(''))}
   ${acc('um-av','shield','ما يجب اجتنابه',U.av.map(([t,b])=>`<p class="um-h">${t}</p>${Array.isArray(b)?`<ul>${b.map(z=>`<li>${z}</li>`).join('')}</ul>`:`<p>${b}</p>`}`).join(''))}
   ${acc('um-wo','user','خاص بالمرأة',`<ul>${U.wo.map(z=>`<li>${z}</li>`).join('')}</ul>`)}
  </div>
  <p class="meta" style="margin-top:12px">هذا دليل مختصر. إن كان عندك سؤال خاص فاسأل عالمًا.</p></section>`}
function viewTaammulat(){if(!auCat||!auBusy)setTimeout(()=>{const had=JSON.stringify(auCat);auLoad(false).then(()=>{if(screen==='taammulat'&&JSON.stringify(auCat)!==had)render()})},0);const B=qb(),c=B.cur,d=c&&qbD(c.id),[m]=qaDayIdx(),q=qaT(m)[0];
  const day=c?Math.min(qbDay(c),40):0;
  const feat=c&&d?`<button class="tm-feat" data-go="qalb"><small><span>برنامج أمراض القلب</span> · <span>اليوم</span> ${day} <span>من</span> 40</small><b class="notr">${d.n}</b><span class="tm-v notr" dir="rtl">${d.v}</span><i><b style="width:${day/40*100}%"></b></i></button>`
    :`<button class="tm-feat" data-go="qalb"><small>أمراض القلب</small><b>ابدأ بتشخيص صادق لقلبك</b><span class="tm-v" dir="rtl" lang="ar">﴿إِلَّا مَنْ أَتَى اللَّهَ بِقَلْبٍ سَلِيمٍ﴾</span></button>`;
  const T=(go,ic,t,s)=>`<button class="tm-tile" data-go="${go}"><svg viewBox="0 0 48 48" aria-hidden="true">${ic}</svg><span>${t}<small>${s}</small></span></button>`;
  const serCard=(k,go,t,v)=>{const sg=(auCat||[]).find(g=>g.k===k),sd=sg?sg.items.filter(x=>(S.au&&S.au.done||{})[x.p]).length:0;
    return `<button class="tm-feat tm-sira" data-go="${go}"><small><span>سلسلة صوتية</span> · ${sg?`<span>استمعت إلى</span> ${sd} <span>من</span> ${sg.items.length}`:'<span>حلقات مسموعة</span>'}</small><b>${t}</b><span class="tm-v" dir="rtl" lang="ar">${v}</span>${sg?`<i><b style="width:${sd/sg.items.length*100}%"></b></i>`:''}</button>`};
  const sira=serCard(SIRA_K,'sira','السيرة النبوية العطرة','﴿لَقَدْ كَانَ لَكُمْ فِي رَسُولِ اللَّهِ أُسْوَةٌ حَسَنَةٌ﴾')+serCard(QIY_K,'qiyama','يوم القيامة','﴿يَوْمَ يَقُومُ النَّاسُ لِرَبِّ الْعَالَمِينَ﴾');
  return `<section>${feat}${sira}${serCards()}
   <button class="tm-qa" data-go="qa"><small>سؤال اليوم</small><b class="notr" dir="auto">${esc(q)}</b><span>اضغط لترى الجواب</span></button>
   <div class="tm-grid">
    ${T('mraqib','<circle cx="24" cy="18" r="8"/><path d="M12 42c2-6 7-9 12-9s10 3 12 9"/>','مراقبات','مقطع وتدوين الواردات')}
    ${T('munajat','<path d="M17 30c-3-2-5-6-5-10 0-1 1-2 2-1l7 6"/><path d="M31 30c3-2 5-6 5-10 0-1-1-2-2-1l-7 6"/><path d="M18 31c2 6 10 6 12 0"/><path d="M24 6l2 5 5 1-4 3 1 5-4-3-4 3 1-5-4-3 5-1z"/>','مناجاة','مناجاة صوتية 21 دقيقة')}
    ${T('umrah','<path d="M14 16l10-5 10 5v20l-10 5-10-5z"/><path d="M14 16l10 5 10-5M24 21v20"/>','العمرة','خطواتها بالصور')}
    ${T('qa','<rect x="9" y="11" width="22" height="28" rx="4"/><path d="M17 9h18a4 4 0 0 1 4 4v24"/><path d="M16 21a4 4 0 1 1 5 4c-1 .5-1 1.5-1 2.5M20 32v.5"/>','سؤال وجواب','200 سؤال في بطاقات')}
   </div></section>`}
const MEDIA={mraqib:{src:'muraqaba.mp4',poster:'muraqaba.jpg',dur:'2:02'},munajat:{src:'munajat.mp3',poster:'munajat.jpg',dur:'20:52',audio:1}};
const isMedia=k=>!!MEDIA[k];
function viewMraqib(){
  const M=MEDIA[screen],W=(S.wared||[]).filter(w=>(w.k||'mraqib')===screen).reverse(),draft=(S.waredDrafts||{})[screen]||(screen==='mraqib'?S.waredDraft||'':'');
  return `<section><div class="mq" id="mqWrap">
    ${M.audio?`<img class="mq-poster" src="${M.poster}" alt=""><audio id="mqVideo" src="${M.src}" preload="metadata" aria-label="مقطع المناجاة"></audio>`:`<video id="mqVideo" src="${M.src}" poster="${M.poster}" playsinline webkit-playsinline preload="metadata" aria-label="مقطع المراقبة"></video>`}
    <button class="mq-btn" id="mqBtn" data-mq="1" aria-label="تشغيل أو إيقاف"><span class="mq-ic"></span></button>
    <div class="mq-bar"><i id="mqProg"></i></div><div class="mq-time"><span id="mqT">0:00</span><span id="mqD">${M.dur}</span></div>
   </div>
   <p class="muted" style="text-align:center">اضغط على الصورة للبدء، واضغط مرة أخرى للإيقاف.</p></section>
  <section><div class="sh"><h2>الواردات</h2><span>${W.length}</span></div>
   <label for="waredIn" class="muted">${screen==='munajat'?'دوّن ما ورد على قلبك أثناء المناجاة':'دوّن ما ورد على قلبك أثناء المراقبة'}</label>
   <textarea id="waredIn" dir="auto" placeholder="خاطر، معنى، حال، أو شعور…">${esc(draft)}</textarea>
   <div class="btns"><button class="btn ok" data-wsave="1">حفظ الوارد</button></div>
   ${waredMsg?`<p class="logged">${esc(waredMsg)}</p>`:''}
   ${W.length?`<div class="box">${W.map(w=>`<div class="notif"><div class="t"><small>${fmtD(ds(new Date(w.ts)))} · ${hm(new Date(w.ts).getHours()+new Date(w.ts).getMinutes()/60)}</small><span class="notr wared" dir="auto">${esc(w.text)}</span></div><button class="btn small dl-del" data-wdel="${w.ts}" aria-label="حذف">حذف</button></div>`).join('')}</div>`:'<p class="muted">لم تدوّن أي وارد بعد.</p>'}
  </section>`}
const fmtS=t=>{t=Math.max(0,Math.floor(t||0));return Math.floor(t/60)+':'+String(t%60).padStart(2,'0')};
function mqBind(){const v=document.getElementById('mqVideo'),w=document.getElementById('mqWrap');if(!v||!w)return;
  const sync=()=>{w.classList.toggle('playing',!v.paused);const pr=document.getElementById('mqProg');if(pr&&v.duration)pr.style.width=(v.currentTime/v.duration*100)+'%';
    const t=document.getElementById('mqT');if(t)t.textContent=fmtS(v.currentTime);const dd=document.getElementById('mqD');if(dd&&v.duration)dd.textContent=fmtS(v.duration)};
  if(!v.__b){v.__b=1;['play','pause','timeupdate','loadedmetadata','ended'].forEach(ev=>v.addEventListener(ev,sync));v.addEventListener('ended',()=>{v.currentTime=0;keepAwake(false)})}
  sync()}
function mqToggle(){const v=document.getElementById('mqVideo');if(!v)return;if(v.paused){v.play().catch(()=>{});keepAwake(true)}else{v.pause();keepAwake(false)}}
