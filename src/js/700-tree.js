/* ---------- the tree of constancy ----------
   Fruits = today's deeds (each completed deed adds fruit; all done = full tree).
   Leaves = the last seven days: when deeds fall away the tree wilts, dries, then dies; deeds bring it back.
   Growth from seed to tree = days on which at least half the day's deeds were done.
   It pictures regularity only, never a spiritual rank. */
function trDay(d){const L=(S.log||{})[d];if(!L)return [0,0];if(d===TODAY)return amProgress(L);
  const P=L.pick||S.amPick||{aw:AW_PICK.slice(),nf:['raghiba','witr']},aw=awList(P,d),nf=(P.nf||[]).filter(i=>NAFL_IDS.includes(i)),A=L.awrad||[],my=(S.mine||[]).filter(m=>mineDue(m,d));
  return [(L.prayers||[]).length+aw.filter(i=>A.includes(i)).length+nf.filter(i=>(L.nafl||{})[i]).length+my.filter(m=>A.includes(m.id)).length,FIVE.length+aw.length+nf.length+my.length]}
const trR=([a,b])=>b?Math.min(1,a/b):0;
let trMemo=null;
function treeState(){const key=TODAY+'|'+JSON.stringify(S.log[TODAY]||0);if(trMemo&&trMemo.k===key&&Date.now()-trMemo.at<4000)return trMemo.v;
  const T=trDay(TODAY),t=trR(T),days=Object.keys(S.log||{}).filter(k=>k<=TODAY).sort(),first=days[0]||TODAY;
  let s=0,n=0;for(let i=1;i<=7;i++){const d=addDays(TODAY,-i);if(d<first)break;s+=trR(trDay(d));n++}
  const past=n?s/n:t,h=n?Math.max(past,(past*(n)+t)/(n+1)):t;
  let g=0;days.forEach(k=>{if(trR(k===TODAY?T:trDay(k))>=.5)g++});
  const st=g<2?0:g<5?1:g<10?2:3,hs=h>=.7?0:h>=.45?1:h>=.2?2:h>=.07?3:4;
  const v={t,dn:T[0],tot:T[1],h,st,hs,g};trMemo={k:key,at:Date.now(),v};return v}
/* kept for older callers: a 0..30 figure */
function treeDays(){return Math.round(treeState().h*30)}
const TREE_ST=['بذرة','نبتة','غرسة','شجرة'];
const TREE_HS=['شجرة نضرة','بدأت تذبل','شجرة ذابلة','شجرة يابسة','شجرة ميتة'];
const TR_FP=[[470,95],[390,205],[600,175],[330,160],[510,150],[430,255],[630,140],[545,215],[380,110],[650,215],[460,200],[560,105],[355,265],[610,250],[420,150],[575,285],[330,215],[500,260]];
function treeArt(T){const C=ILC;
  if(T.st<3){const k='tree'+T.st;return `<div class="tr-im${T.hs>=2&&T.st?' tr-h'+T.hs:''}">${IL_IMG.has(k)?ilSvg(k):`<svg class="il" viewBox="0 0 320 200" aria-hidden="true">${ilBg('tr','dawn')}${ilGround('#cfe0b6',168)}${ilTree(160,168,.7+T.st*.22,T.st,C.green)}</svg>`}</div>`}
  const own={2:'tree_wilt',3:'tree_dry',4:'tree_dead'}[T.hs],img=own&&IL_IMG.has(own)?own:'tree3',cls=own&&img==='tree3'?' tr-h'+T.hs:T.hs===1?' tr-h1':'';
  const nf=T.hs<=2&&img==='tree3'?Math.round(TR_FP.length*T.t):0;
  const fr=TR_FP.slice(0,nf).map(([x,y],i)=>`<i class="tr-f" style="left:${(x/9.6).toFixed(2)}%;top:${(y/6).toFixed(2)}%;--s:${[1,.88,.96,.92,1.04][i%5]}"><img src="il/tr_f${i%3+1}.webp" alt=""></i>`).join('');
  return `<div class="tr-im${cls}">${ilSvg(img)}${fr}</div>`}
function treeCard(){const T=treeState();
  const title=T.st<3?TREE_ST[T.st]:T.hs===0?(T.t>=1?'شجرة مثمرة كاملة':T.t>0?'شجرة مثمرة':'شجرة نضرة'):TREE_HS[T.hs];
  const need=[2,5,10][T.st],left=T.st<3?need-T.g:0;
  const msg=T.st<3?'':T.hs===4?'ماتت أغصانها لأن الأعمال انقطعت في الأيام الأخيرة، لكن جذورها باقية: كل عمل تتمه اليوم يعيد إليها الحياة.':T.hs>=2?'ذبلت لأن أعمالك قلّت في الأيام الأخيرة. كل عمل تتمه اليوم يسقيها، ومع الأيام تعود نضرة.':'';
  return `<section class="box tr-c">${treeArt(T)}<div class="tr-t"><small class="tr-k">شجرة المداومة</small><b>${title}</b>
   <span><span>ثمارها أعمال يومك: كل عمل تتمه يضيف ثمرة، وتكتمل حين تتم أعمال اليوم كلها. وأوراقها انتظامك في الأيام السبعة الأخيرة: إن قلّت أعمالك ذبلت، وإن انقطعت يبست ثم ماتت.</span> ${hintBtn('tree')}</span>
   ${T.st<3?`<p class="meta tr-n">${left} <span>${left===1?'يوم آخر تتم فيه نصف أعمالك على الأقل وتصير':'أيام أخرى تتم فيها نصف أعمالك على الأقل وتصير'}</span> «<span>${T.st<2?TREE_ST[T.st+1]:'شجرة'}</span>»</p>`:''}
   <div class="tr-m"><small>ثمار اليوم</small><b dir="ltr">${T.dn} / ${T.tot}</b></div><i class="tr-bar tr-bf"><b style="width:${T.t*100}%"></b></i>
   <div class="tr-m"><small>نضارة الأوراق</small><b dir="ltr">${Math.round(T.h*100)}%</b></div><i class="tr-bar"><b style="width:${T.h*100}%"></b></i>
   ${msg?`<p class="meta tr-dn">${msg}</p>`:''}
   <p class="meta tr-nb">الشجرة صورة لانتظامك في الأعمال، لا حكم على حالك عند الله.</p></div></section>`}
