/* ---------- install as an app (PWA) ---------- */
let installEvt=null,transferMsg='';
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installEvt=e;if(screen==='install'||screen==='home')render()});
window.addEventListener('appinstalled',()=>{installEvt=null;render()});
function isStandalone(){try{return matchMedia('(display-mode: standalone)').matches||navigator.standalone===true}catch(e){return false}}
function inPreview(){try{return window.self!==window.top}catch(e){return true}}
if('serviceWorker' in navigator&&!inPreview()&&window.isSecureContext){navigator.serviceWorker.register('sw.js').catch(()=>{})}
function installParts(bare){
  const ua=navigator.userAgent||'',ios=/iPhone|iPad|iPod/.test(ua),standalone=isStandalone(),preview=inPreview();
  let top;
  if(standalone)top=`<div class="box pad inst-ok"><b>المرشد مثبّت على شاشتك ✓</b><span class="muted">أنت تستعمله الآن كتطبيق مستقل، ويعمل حتى دون اتصال بالإنترنت.</span></div>`;
  else if(installEvt)top=`<div class="box pad" style="display:flex;flex-direction:column;gap:10px;align-items:flex-start"><b>جاهز للتثبيت</b><span class="muted">سيظهر المرشد بأيقونته على شاشتك ويفتح كتطبيق مستقل.</span><button class="btn ok" data-install="1">ثبّت المرشد على الشاشة</button></div>`;
  else if(preview)top=`<div class="box pad" style="display:flex;flex-direction:column;gap:6px"><b>التثبيت غير متاح من هذه المعاينة</b><span class="muted">أنت تفتح المرشد داخل صفحة أخرى، والمتصفح لا يسمح بالتثبيت من داخلها. افتح المرشد من رابطه الخاص ثم ارجع إلى هذه الخانة.</span></div>`;
  else top='';
  const steps=(t,list)=>bare?`<b class="acc-sub">${t}</b><ol class="inst-steps">${list.map(x=>`<li>${x}</li>`).join('')}</ol>`:`<div class="box pad"><b>${t}</b><ol class="inst-steps">${list.map(x=>`<li>${x}</li>`).join('')}</ol></div>`;
  const iosS=steps('على iPhone أو iPad (متصفح Safari)',['افتح رابط المرشد في Safari العادي، لا في التصفح الخاص.','اضغط زر المشاركة (المربع والسهم للأعلى) أسفل الشاشة.','اختر «إضافة إلى الشاشة الرئيسية».','اضغط «إضافة»، فتظهر أيقونة المرشد على شاشتك.','من الآن افتح المرشد دائمًا من أيقونته، لا من Safari.']);
  const andS=steps('على Android (متصفح Chrome)',['افتح رابط المرشد في Chrome.','اضغط القائمة ⋮ أعلى الشاشة.','اختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية».','أكّد التثبيت، فتظهر أيقونة المرشد مع تطبيقاتك.']);
  const notS=steps('تفعيل التذكيرات',['افتح المرشد من أيقونته، وادخل بحسابك.','اذهب إلى الملف الشخصي، ثم «التذكيرات على الهاتف».','اضغط «فعّل التذكيرات على هاتفي»، ثم «سماح» حين يسألك الهاتف.','اختر ما تريد: أذكار الصباح والمساء، والمحاسبة، والحضور مع الله، وحدّد أوقاتها.','اضغط «جرّب إشعارًا الآن» لتتأكد أن الإشعارات تصلك.']);
  const tipS=steps('إن لم تصلك التذكيرات',ios?['تأكد أن الهاتف ليس على الوضع الصامت أو وضع التركيز.','افتح الإعدادات ← الإشعارات ← المرشد، وفعّل الإشعارات والأصوات.','تعمل التذكيرات على iPhone فقط إذا فتحت المرشد من أيقونته على الشاشة.']:['افتح الإعدادات ← التطبيقات ← Chrome ← البطارية، واختر «غير مقيّد».','تأكد أن إشعارات المرشد مسموحة في إعدادات Chrome.','قد يتأخر التذكير بضع دقائق عن وقته.']);
  const offS=steps('العمل دون إنترنت',['افتح المرشد مرة وأنت متصل بالإنترنت، فيُحفظ على هاتفك.','بعدها يفتح ويعمل دون إنترنت، وتُحفظ تسجيلاتك على الهاتف.','حين يعود الاتصال، تُرسل تسجيلاتك إلى حسابك تلقائيًا.']);
  const transfer=`<p class="muted">كل نسخة من المرشد تحفظ بياناتها في متصفحها. لنقل تقدمك إلى التطبيق المثبّت: انسخ رمز بياناتك هنا، ثم الصقه في نفس الخانة داخل التطبيق المثبّت.</p>
   <div class="btns"><button class="btn primary" data-export="1">انسخ رمز بياناتي</button></div>
   <label for="importCode" class="muted">الصق رمز البيانات هنا</label>
   <textarea id="importCode" placeholder="الصق الرمز المنسوخ…"></textarea>
   <div class="btns"><button class="btn ok" data-import="1">استورد البيانات</button></div>
   ${transferMsg?`<p class="logged${transferMsg.startsWith('!')?' bad':''}">${transferMsg.replace(/^!/,'')}</p>`:''}`;
  return {ios,standalone,top,iosS,andS,notS,tipS,offS,transfer};
}
function viewInstall(){const P=installParts();
  return `<section>${P.top}${P.standalone?'':(P.ios?P.iosS+P.andS:P.andS+P.iosS)}${P.notS}${P.tipS}${P.offS}</section>
  <section><div class="sh"><h2>نقل بياناتك</h2></div>${P.transfer}</section>`;
}
/* roadmap: the path to Allah's pleasure (image + readable legend) */
const RM=[{t:'جبل الشروط الأربعة',c:'rm-c',sub:'نقطة الانطلاق',it:['العقيدة','الفقه','التوبة','المجاهدة']},
 {t:'جسر التزكية',c:'rm-b',sub:'العبور',it:['تزكية الجوارح','تزكية العقل','تزكية القلب والروح']},
 {t:'جبل الأهداف الأربعة',c:'rm-g',sub:'الغاية',it:['التعظيم لأمر الله','التعظيم لأمر رسول الله ﷺ','الشفقة على الخلق','الحضور مع الله']}];
const RM_GO={'التعظيم لأمر الله':{go:'g1',s:'إعطاء الأولوية لله وطاعته',r:1},'التعظيم لأمر رسول الله ﷺ':{go:'g2',s:'إعطاء الأولوية لحب النبي ﷺ واتباع سنته',r:1},'الشفقة على الخلق':{go:'g3',s:'الرحمة بالمخلوقات وخدمتهم',r:1},'الحضور مع الله':{go:'g4',s:'أن تستحضر أنك مع الله في كل حال',r:1},'تزكية الجوارح':{go:'jawarih',s:'تطهير الجوارح ثم تنويرها، ثلاثين يومًا لكل مرحلة',r:1},'تزكية العقل':{go:'aql',s:'عشرة مستويات لتطهير العقل وشغله بذكر الله',r:1},'تزكية القلب والروح':{go:'qalbruh',s:'العهود السماوية: الإخلاص والتواضع والشكر والتوبة',r:1},'التوبة':{go:'tawba',s:'شروط التوبة، وردّ الحقوق، والثبات عليها',r:1},'المجاهدة':{go:'mujahada',s:'معنى المجاهدة والاستقامة وشروطهما',r:1},'العقيدة':{go:'aqida',s:'دروس صوتية في شرح العقيدة الأشعرية'},'الفقه':{go:'fiqh',s:'دروس مرئية في الفقه المالكي',v:1}};
/* the stations on the map: labels drawn over the picture (so they follow the app language), each opening its lesson.
   x,y = the station's lantern in px of the 1672×941 picture; side = where the label sits: l (left of it), r (right), t (above) */
const RM_HOT=[{go:'aqida',n:1,t:'العقيدة',x:1405,y:790,s:'l'},{go:'fiqh',n:2,t:'الفقه',x:1376,y:562,s:'l'},{go:'tawba',n:3,t:'التوبة',x:1550,y:446,s:'l'},{go:'mujahada',n:4,t:'المجاهدة',x:1441,y:336,s:'l'},
 {go:'jawarih',n:1,t:'تزكية الجوارح',x:1030,y:520,s:'b'},{go:'aql',n:2,t:'تزكية العقل',x:808,y:520,s:'b'},{go:'qalbruh',n:3,t:'تزكية القلب والروح',x:573,y:520,s:'b'},
 {go:'g4',n:4,t:'الحضور مع الله',x:268,y:496,s:'r'},{go:'g3',n:3,t:'الشفقة على الخلق',x:230,y:378,s:'r'},{go:'g2',n:2,t:'التعظيم لأمر رسول الله ﷺ',x:208,y:268,s:'r'},{go:'g1',n:1,t:'التعظيم لأمر الله',x:175,y:186,s:'r'}];
const RM_TT=[{t:'جبل الشروط الأربعة',x:1500,y:120,s:'l'},{t:'جسر التزكية',x:808,y:430,s:'c'},{t:'جبل الأهداف الأربعة',x:200,y:110,s:'r'}];
const rmHot=()=>RM_TT.map(h=>`<span class="rm-tt s-${h.s}" style="left:${(h.x/16.72).toFixed(2)}%;top:${(h.y/9.41).toFixed(2)}%">${h.t}</span>`).join('')+RM_HOT.map(h=>`<button class="rm-lb s-${h.s}" data-go="${h.go}" style="left:${(h.x/16.72).toFixed(2)}%;top:${(h.y/9.41).toFixed(2)}%"><i dir="ltr">${h.n}</i><span>${h.t}</span></button>`).join('');
