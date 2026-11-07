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
/* tappable signs on the map image, in % of the picture */
const RM_HOT=[{go:'g1',t:'التعظيم لأمر الله',x:6.4,y:17.4,w:13.8,h:11.6},{go:'g2',t:'التعظيم لأمر رسول الله ﷺ',x:3.8,y:33.8,w:14.2,h:13.6},{go:'g3',t:'الشفقة على الخلق',x:4.8,y:56.2,w:15.2,h:12.8},{go:'g4',t:'الحضور مع الله',x:7.4,y:75.0,w:14.8,h:12.8},{go:'jawarih',t:'تزكية الجوارح',x:61.6,y:41.8,w:9.8,h:9.6},{go:'aql',t:'تزكية العقل',x:50.1,y:41.8,w:9.6,h:9.6},{go:'qalbruh',t:'تزكية القلب والروح',x:28.8,y:41.8,w:19.6,h:9.6},{go:'tawba',t:'التوبة',x:83.6,y:36.4,w:13.2,h:9.2},{go:'mujahada',t:'المجاهدة',x:85.2,y:20.4,w:12.8,h:8.6},{go:'aqida',t:'العقيدة',x:83.6,y:75.6,w:13.2,h:9.2},{go:'fiqh',t:'الفقه',x:85.2,y:55.8,w:12.8,h:9.2}];
const rmHot=()=>RM_HOT.map(h=>`<button class="rm-hs" data-go="${h.go}" style="left:${h.x}%;top:${h.y}%;width:${h.w}%;height:${h.h}%" aria-label="${esc(Tx(h.t))}"><i></i></button>`).join('');
