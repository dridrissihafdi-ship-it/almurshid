/* ---------- the tree of constancy ----------
   It pictures regularity only, never a spiritual rank: it grows with the days kept in the last thirty, and if it
   goes back a step, the seeker is told plainly that this measures regularity, not his standing with Allah. */
function treeDays(){let n=0;for(let i=0;i<30;i++){const d=ds(new Date(Date.now()-i*DAY)),l=(S.log||{})[d];if(l&&((l.prayers||[]).length>=3||(l.awrad||[]).length))n++}return n}
const TREE_ST=['بذرة','نبتة','غرسة','شجرة','شجرة مثمرة'];
function treeCard(){const n=treeDays(),st=Math.min(4,Math.floor(n/7)),C=ILC;
  const svg=IL_IMG.has('tree'+st)?ilSvg('tree'+st):`<svg class="il" viewBox="0 0 320 200" aria-hidden="true">${ilBg('tr',skyKind()==='night'?'night':'dawn')}${ilGround('#cfe0b6',168)}${st===0?`<ellipse cx="160" cy="168" rx="16" ry="6" fill="#8a5a3a"/><path d="M160 166c0-8 4-12 10-14-2 6-6 10-10 14z" fill="${C.green}"/>`:ilTree(160,168,.7+st*.22,st,C.green)}${st===4?[[132,92],[188,84],[160,70],[146,112],[176,108]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="5" fill="${C.rose}"/>`).join(''):''}</svg>`;
  const prev=S.treeSt,down=prev!=null&&st<prev;if(prev!==st){S.treeSt=st;if(!down)S.treeDown=null;else S.treeDown=TODAY;save()}
  const next=st<4?7*(st+1)-n:0,dn=S.treeDown&&S.treeDown>=addDays(TODAY,-2);
  return `<section class="box tr-c">${svg}<div class="tr-t"><small class="tr-k">شجرة المداومة</small><b>${TREE_ST[st]}</b>
   <span><span>تنمو بانتظامك: كل يوم صلّيت فيه ثلاث صلوات على الأقل أو أتممت وردًا، من آخر ثلاثين يومًا.</span> <span dir="ltr">${n}/30</span> ${hintBtn('tree')}</span>
   <i class="tr-bar"><b style="width:${n/30*100}%"></b></i>
   ${next?`<p class="meta tr-n">${next} <span>${next===1?'يوم آخر':'أيام أخرى'} وتصير</span> «<span>${TREE_ST[st+1]}</span>»</p>`:''}
   ${dn?`<p class="meta tr-dn">قلّت أيام انتظامك في الثلاثين الأخيرة، فرجعت الشجرة خطوة. هي مقياس للمداومة لا لمنزلتك عند الله، وكل يوم تحافظ فيه يعيدها.</p>`:''}
   <p class="meta tr-nb">الشجرة صورة لانتظامك في الأعمال، لا حكم على حالك عند الله.</p></div></section>`}

