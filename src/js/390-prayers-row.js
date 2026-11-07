/* ---------- five prayers, one row ---------- */
const FIVE=[['fajr','الصبح'],['dhuhr','الظهر'],['asr','العصر'],['maghrib','المغرب'],['isha','العشاء']];
/* the day shown in «الأعمال»: today (null) or a past date the seeker reviews or corrects */
let aDate=null;
const aLog=()=>aDate?(S.log[aDate]||(S.log[aDate]={awrad:[],heart:null,note:''})):dayLog();
function aDateBar(){const D=aDate||TODAY,min=addDays(TODAY,-365);
  return `<div class="ad-bar"><button class="iconbtn sm" data-adate="-1" aria-label="اليوم السابق"${D<=min?' disabled':''}><svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button>
   <label class="ad-in"><input type="date" id="aDateIn" value="${D}" max="${TODAY}" min="${min}"><span><b>${aDate?fmtD(D):'<span>اليوم</span> · '+fmtD(D)}</b><small>${aDate?WDAYS[new Date(D+'T12:00:00').getDay()]:'اضغط لاختيار يوم آخر'}</small></span></label>
   <button class="iconbtn sm" data-adate="1" aria-label="اليوم التالي"${aDate?'':' disabled'}><svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg></button></div>
   ${aDate?`<div class="ad-note"><span>تراجع أعمال يوم مضى. ما تغيّره هنا يُحفظ في سجلّ ذلك اليوم.</span><button class="btn small ok" data-adate="0">العودة إلى اليوم</button></div>`:''}`}
const prLate=(L,D)=>{const pr=(L&&L.prayers)||[];if(D&&D<TODAY)return FIVE.map(f=>f[0]).filter(k=>!pr.includes(k));const pt=ptDay(),h=dH();return FIVE.filter(([k])=>!pr.includes(k)&&h>=pt[k]).map(f=>f[0])};
const MSJ='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20V11a8 6 0 0 1 16 0v9z"/><path d="M12 5V2.5M9.5 20v-4a2.5 2.5 0 0 1 5 0v4M2.5 20h19"/></svg>';
const inMsj=(L,k)=>(L.masjid||[]).includes(k);
function prayerChips(L){const pr=L.prayers||[],pt=prayerTimes(new Date((aDate||TODAY)+'T12:00:00')),late=prLate(L,aDate);
  return `<span class="pr-row">${FIVE.map(([k,n])=>{const on=pr.includes(k),lt=late.includes(k),m=on&&inMsj(L,k);return `<span class="pr-cell"><button class="pr-chip${on?(m?' on':' home'):lt?' late':''}" data-pray="${k}" aria-pressed="${on}"${lt?' title="لم تُسجَّل بعد"':''}><i>${on?'✓':lt?'!':''}</i><b>${n}</b><small>${hm(pt[k])}</small></button><button class="pr-msj${m?' on':''}" data-masjid="${k}" aria-pressed="${m}" aria-label="في المسجد">${MSJ}<span>المسجد</span></button></span>`}).join('')}</span><span class="pr-key"><span><i class="g"></i><span>في المسجد</span></span><span><i class="b"></i><span>في غير المسجد</span></span><span><i class="r"></i><span>فاتت</span></span></span>`}
document.addEventListener('visibilitychange',()=>{if(document.visibilityState!=='visible')return;if(dayKey()!==TODAY&&screen!=='dhikr_run'&&AU.paused){location.reload();return}});
setInterval(()=>{if(dayKey()!==TODAY&&screen!=='dhikr_run'&&!(document.activeElement&&/INPUT|TEXTAREA/.test(document.activeElement.tagName))&&!mshAuto)location.reload()},60000);
let prLateKey='';setInterval(()=>{try{if(screen!=='aamal'||document.activeElement&&/INPUT|TEXTAREA/.test(document.activeElement.tagName)&&document.activeElement.type!=='checkbox')return;const k=prLate(S.log[TODAY]).join();if(prLateKey&&k!==prLateKey)render();prLateKey=k}catch(e){}},60000);
function setPrayer(k){const L=aLog();L.prayers=L.prayers||[];if(L.prayers.includes(k)&&L.masjid)L.masjid=L.masjid.filter(x=>x!==k);L.prayers=L.prayers.includes(k)?L.prayers.filter(x=>x!==k):[...L.prayers,k];
  applyWird('salat',L.prayers.length===FIVE.length,aDate)}
function wirdList(items,L,late){late=late||[];
  return `<div class="box">${items.map(a=>`<label class="wird${late.includes(a.id)?' late':''}" for="w-${a.id}"><input type="checkbox" id="w-${a.id}" data-wird="${a.id}" ${L.awrad.includes(a.id)?'checked':''}><span class="t">${a.t}<small>${a.s}</small>${!aDate&&(a.id==='sabah'||a.id==='masa')?`<button class="btn small read" data-adhkar="${a.id}">اقرأ ${a.id==='sabah'?'أذكار الصباح':'أذكار المساء'}</button>`:''}${!aDate&&a.id==='quran'?`<button class="btn small read" data-mshopen="1">اقرأ وردك من المصحف</button>`:''}${a.id==='salat'?prayerChips(L):''}${!aDate&&a.id==='dhikr'&&(S.marks.dhikrList||[]).length?`<button class="btn small read" data-dstart="1">ابدأ الذكر الشخصي</button>`:''}</span>${late.includes(a.id)?'<span class="tag miss">فاتك</span>':a.tag?`<span class="tag${a.tagOn?' on':''}">${a.tag}</span>`:''}</label>`).join('')}</div>`;
}
/* nafila prayers (Maliki): times from the day's prayer times, rak'as chosen by the user */
function naflDefs(pt){const S_=s=>'<span>'+s+'</span>';return [
 {id:'raghiba',t:'الرغيبة (ركعتا الفجر)',s:S_('بعد أذان الصبح وقبل الفريضة')+' · '+hm(pt.fajr)+' – '+hm(pt.sunrise),r:[2],w:[pt.fajr,pt.sunrise]},
 {id:'duha',t:'صلاة الضحى',s:S_('من')+' '+hm(pt.sunrise+1/3)+' '+S_('إلى')+' '+hm(pt.dhuhr-1/6)+' · '+S_('أفضلها حين يشتدّ الضحى'),r:[2,4,6,8],w:[pt.sunrise+1/3,pt.dhuhr-1/6],e:pt.dhuhr},
 {id:'qdhuhr',t:'نافلة قبل الظهر',s:S_('بعد الأذان وقبل الفريضة')+' · '+hm(pt.dhuhr),r:[2,4],w:[pt.dhuhr,pt.asr]},
 {id:'bdhuhr',t:'نافلة بعد الظهر',s:S_('بعد صلاة الظهر'),r:[2,4],w:[pt.dhuhr,pt.asr]},
 {id:'qasr',t:'نافلة قبل العصر',s:S_('بعد الأذان وقبل الفريضة')+' · '+hm(pt.asr)+' · '+S_('ولا نافلة بعد صلاة العصر حتى المغرب'),r:[2,4],w:[pt.asr,pt.asr+.75]},
 {id:'bmaghrib',t:'نافلة بعد المغرب',s:S_('بعد صلاة المغرب')+' · '+hm(pt.maghrib),r:[2,4,6],w:[pt.maghrib,pt.isha]},
 {id:'bisha',t:'نافلة بعد العشاء',s:S_('بعد صلاة العشاء')+' · '+hm(pt.isha),r:[2,4],w:[pt.isha,pt.isha+2],e:24+pt.fajr},
 {id:'witr',t:'الشفع والوتر',s:S_('ركعتان ثم ركعة، من بعد العشاء إلى الفجر')+' · '+S_('وآخر الليل أفضل لمن يقوم'),r:[3],w:[pt.isha,24+pt.fajr]}]}
const NAFL_IDS=['raghiba','duha','qdhuhr','bdhuhr','qasr','bmaghrib','bisha','witr'],AW_PICK=['sabah','masa','quran','dhikr','qiyam'];
/* extra voluntary deeds: Monday / Thursday fasts appear only on their day */
const AW_X=['sawm_mon','sawm_thu','sadaqa','help'],AW_DAY={sawm_mon:1,sawm_thu:4};
const awDayOk=(i,D)=>AW_DAY[i]===undefined||new Date((D||TODAY)+'T12:00:00').getDay()===AW_DAY[i];
const awList=(P,D)=>P.aw.filter(i=>awDayOk(i,D));
const nfFull=(x,n)=>n>=Math.max(...x.r);
/* what the seeker committed to: global choice, frozen into each day's log so past days keep their own list */
function amPick(L){if(!S.amX2){S.amX2=1;const G=S.amPick||(S.amPick={aw:AW_PICK.slice(),nf:['raghiba','witr']});AW_X.forEach(i=>{if(!G.aw.includes(i))G.aw.push(i)});const T=S.log[TODAY];if(T&&T.pick)AW_X.forEach(i=>{if(!T.pick.aw.includes(i))T.pick.aw.push(i)})}const P=S.amPick||{aw:AW_PICK.slice(),nf:['raghiba','witr']};if(L&&L.pick)return L.pick;if(L&&!aDate){L.pick={aw:P.aw.slice(),nf:P.nf.slice()};}return L&&L.pick||P}
function naflLate(x,L,pt){if((L.nafl||{})[x.id])return false;if(aDate)return true;const h=dH();return h>=(x.e||x.w[1])}
function awLate(id,L,pt){if(L.awrad.includes(id))return false;if(aDate)return true;const h=dH();return (id==='sabah'||id==='sawm_mon'||id==='sawm_thu')&&h>=pt.maghrib}
let amPickOpen=false;const amOpen=new Set();
function amPickBox(P,pt){const D=naflDefs(pt),T=Object.fromEntries(AWRAD.map(a=>[a.id,a.t]));
  const ch=(k,id,t,on)=>`<label class="pk"><input type="checkbox" data-ampick="${k}:${id}"${on?' checked':''}><span>${t}</span></label>`;
  return `<div class="box pad am-pick"><p class="muted" style="margin:0 0 8px">اختر ما تلتزم به كل يوم. ما تختاره يظهر في أعمالك ويُحسب في يومك، وإن فات وقته دون أن تسجّله صار أحمر مثل الصلوات المفروضة.</p>
   <p class="pk-h">الأذكار والأوراد</p><div class="pk-g">${AW_PICK.map(id=>ch('aw',id,T[id],P.aw.includes(id))).join('')}</div>
   <p class="pk-h">النوافل</p><div class="pk-g">${D.map(x=>ch('nf',x.id,x.t,P.nf.includes(x.id))).join('')}${AW_X.map(id=>ch('aw',id,T[id],P.aw.includes(id))).join('')}</div>
   <button class="btn ok" data-ampickdone="1" style="margin-top:10px">تم</button></div>`}
const NAFL_SLOT={fajr:['raghiba','duha'],dhuhr:['qdhuhr','bdhuhr'],asr:['qasr'],maghrib:['bmaghrib'],isha:['bisha','witr']};
function naflRows(ids,L,pt){const N=L.nafl||{},h=dH(),D=naflDefs(pt);
  return ids.map(id=>{const x=D.find(z=>z.id===id),n=N[id]||0,hh=h,act=!aDate&&!n&&hh>=x.w[0]&&hh<x.w[1];
   const lt=naflLate(x,L,pt),full=n&&nfFull(x,n);return `<div class="wird nf${full?' on':n?' part':lt?' late':''}"><button class="nf-c" data-nafl="${id}" data-nfn="${n||x.r[0]}" aria-pressed="${!!n}" aria-label="${esc(x.t.replace(/<[^>]+>/g,''))}">${n?'✓':lt?'!':''}</button><span class="t">${x.t}<small>${x.s}</small><span class="nf-r"><em>ركعات:</em>${x.r.map(k=>`<button class="nf-b${n===k?(nfFull(x,k)?' on':' part'):''}" data-nafl="${id}" data-nfn="${k}">${k===3?'2+1':k}</button>`).join('')}${n&&!full?'<em class="nf-pt">أدّيت بعضها</em>':''}</span></span>${act?'<span class="tag on">وقتها الآن</span>':lt?'<span class="tag miss">فاتتك</span>':''}</div>`}).join('')}
/* the seeker's own deeds: S.mine = [{id,t,s,days:[0-6]}], ticked like any other deed in the day log */
let mineForm=null;
const myDeeds=()=>S.mine||(S.mine=[]);
const mineDue=(m,D)=>!m.days||!m.days.length||m.days.includes(new Date(D+'T12:00:00').getDay());
const mineDays=m=>!m.days||!m.days.length||m.days.length===7?'<span>كل يوم</span>':m.days.slice().sort().map(i=>`<span>${WDAYS[i]}</span>`).join('، ');
function mineBlock(L,D,past){const all=myDeeds(),due=all.filter(m=>mineDue(m,D)),dn=due.filter(m=>L.awrad.includes(m.id)).length;
  const F=mineForm,form=F?`<div class="box pad mine-f"><label class="muted" for="mi-t">العمل</label><input id="mi-t" type="text" dir="auto" maxlength="80" value="${esc(F.t||'')}" placeholder="مثال: صلة الرحم بالاتصال">
    <label class="muted" for="mi-s">ملاحظة قصيرة (اختياري)</label><input id="mi-s" type="text" dir="auto" maxlength="80" value="${esc(F.s||'')}" placeholder="مثال: بعد صلاة العصر">
    <span class="muted mine-l">الأيام</span><div class="mine-days">${WDAYS.map((w,i)=>`<label class="mine-d"><input type="checkbox" data-mineday="${i}" ${(F.days||[]).includes(i)?'checked':''}><span>${w}</span></label>`).join('')}</div>
    <p class="meta" style="margin:6px 0 0">اترك الأيام فارغة ليكون العمل كل يوم.</p>
    <div class="btns"><button class="btn ok" data-minesave="1">حفظ</button><button class="btn small" data-minecancel="1">إلغاء</button></div></div>`:'';
  const list=due.length?wirdList(due.map(m=>({id:m.id,t:'<span class="notr" dir="auto">'+esc(m.t)+'</span>',s:(m.s?'<span class="notr" dir="auto">'+esc(m.s)+'</span> · ':'')+mineDays(m)})),L)
    :all.length?'<p class="muted">لا عمل لك اليوم من أعمالك الخاصة.</p>':(F?'':'<p class="muted">أضف أعمالك الخاصة لتتابعها كل يوم مع باقي أعمالك.</p>');
  const manage=all.length?`<details class="slips mine-m"${F&&F.id?' open':''}><summary><span>إدارة أعمالي</span> (${all.length})</summary><div class="ad-list">${all.map(m=>`<div class="ad-row ad-x"><div><b class="notr" dir="auto">${esc(m.t)}</b><small>${mineDays(m)}</small></div><div class="btns" style="margin:0"><button class="btn small" data-mineedit="${m.id}">تعديل</button><button class="btn small dl-del" data-minedel="${m.id}">حذف</button></div></div>`).join('')}</div></details>`:'';
  return `<section><div class="sh"><h2>أعمالي الخاصة</h2>${due.length?`<span>${dn} / ${due.length}</span>`:''}</div>${list}${past?'':form||`<div class="btns" style="margin-top:10px"><button class="btn" data-mineadd="1">+ أضف عملًا</button></div>`}${past?'':manage}</section>`}
function mineClick(d){
  if(d.mineadd){mineForm={};render();setTimeout(()=>{const t=document.getElementById('mi-t');if(t){t.focus();t.scrollIntoView({block:'center'})}},50);return true}
  if(d.minecancel){mineForm=null;render();return true}
  if(d.mineedit){const m=myDeeds().find(x=>x.id===d.mineedit);if(m){mineForm={...m,days:(m.days||[]).slice()};render();setTimeout(()=>{const t=document.getElementById('mi-t');if(t)t.scrollIntoView({block:'center'})},50)}return true}
  if(d.minedel){const m=myDeeds().find(x=>x.id===d.minedel);if(m&&confirm(Tx('حذف هذا العمل من أعمالك؟')+'\n'+m.t)){S.mine=myDeeds().filter(x=>x.id!==m.id);if(mineForm&&mineForm.id===m.id)mineForm=null;save();render()}return true}
  if(d.minesave){const t=(document.getElementById('mi-t').value||'').trim(),sv=(document.getElementById('mi-s').value||'').trim();
    if(!t){const i=document.getElementById('mi-t');i.focus();i.classList.add('bad');return true}
    const days=[...document.querySelectorAll('[data-mineday]')].filter(x=>x.checked).map(x=>+x.dataset.mineday);
    const ob={t,s:sv,days:days.length===7?[]:days};
    if(mineForm&&mineForm.id){const m=myDeeds().find(x=>x.id===mineForm.id);if(m)Object.assign(m,ob)}else myDeeds().push(Object.assign({id:'m'+Date.now().toString(36)},ob));
    mineForm=null;save();render();return true}
  return false}
