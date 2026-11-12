/* ---- sheets: critic and mirror ---- */
function uyChips(attr,other){return `<div class="uy-chips">${UY.map(([f,n])=>`<button data-${attr}="${f}">${n}</button>`).join('')}${other?`<button data-${attr}="other">أخرى</button>`:''}</div>`}
function uySheet(){const o=uyOpen;if(!o)return;let h='';
  if(o.k==='cr'){if(!o.f)h=`<h3 class="uy-sq">بماذا انتُقدت؟</h3>${uyChips('uycrf',1)}`;
    else if(o.f==='other'&&o.o==null)h=`<h3 class="uy-sq">بماذا انتُقدت؟</h3><input id="uyOther" class="uy-in" maxlength="60" placeholder="${esc(Tx('سطر قصير'))}"><div class="btns"><button class="btn ok" data-uyoth="1">التالي</button></div><p class="meta">«أخرى» يُحفظ للتأمل ولا يدخل في الحساب.</p>`;
    else h=`<h3 class="uy-sq">ممّن؟</h3><p class="meta">دون اسم. الحق يُقبل من كل أحد.</p><div class="uy-chips">${UY_WHO.map((w,i)=>`<button data-uycrw="${i}">${w}</button>`).join('')}</div>`}
  else{if(!o.f)h=`<h3 class="uy-sq">أي عيب رأيت؟</h3><p class="meta">دون ذكر الشخص.</p>${uyChips('uymrf',0)}`;
    else if(o.v==null)h=`<h3 class="uy-sq"><span>هل فيك من</span> «<span>${UYN[o.f]}</span>» <span>شيء؟</span></h3><div class="uy-as">${UY_MV.map(([l,v])=>`<button class="btn" data-uymrv="${v}">${l}</button>`).join('')}</div>`;
    else h=`<p class="uy-k">سُجّل في المرآة ✓</p><div class="uy-do"><small>عمل اليوم</small><p>${UY_DO[o.f]}</p></div><div class="btns"><button class="btn ok" data-bsx="1">تم</button></div>`}
  sheetOpen(`<div class="bs-top"><h2>${o.k==='cr'?'انتُقدتُ':'رأيتُ عيبًا في غيري'}</h2><button class="qa-ed" data-bsx="1">إغلاق</button></div><div class="uy-sh">${h}</div>`)}
function uyDone(){uyOpen=null;sheetClose();if(screen==='uyub')render()}

document.addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;const d=t.dataset,U=()=>uy();
  if(d.uystart){const ord=[...Array(UY_Q.length).keys()];for(let i=ord.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[ord[i],ord[j]]=[ord[j],ord[i]]}
    uyRun={ord,ans:{},i:0,t0:Date.now()};uyF=null;uyProg=false;if(screen!=='uyub')return go('uyub');SCR().scrollTo(0,0);return render()}
  if(d.uya!==undefined&&uyRun){const r=uyRun;r.ans[r.ord[r.i]]=+d.uya;if(r.i<UY_Q.length-1){r.i++;return render()}
    const T={t:Date.now(),d:TODAY,ans:UY_Q.map((q,i)=>r.ans[i]||0),dur:Math.round((Date.now()-r.t0)/1000)};uyRun=null;
    const X=U();X.tests.push(T);while(X.tests.length>12)X.tests.shift();save();SCR().scrollTo(0,0);return render()}
  if(d.uyback&&uyRun){if(uyRun.i)uyRun.i--;return render()}
  if(d.uyquit){uyRun=null;return render()}
  if(d.uycv){const [ts,v]=d.uycv.split(':'),x=U().cr.find(c=>String(c.t)===ts);if(x){if(v==='later')x.nx=Date.now()+UY_DAY;else x.v=+v;save()}return render()}
  if(d.uyf!==undefined&&!d.uyfo){uyF=d.uyf||null;uyUjb=null;uyProg=false;sheetClose();if(screen!=='uyub'){goRaw('uyub')}else{SCR().scrollTo(0,0);render()}return}
  if(d.uyhome){uyProg=false;uyF=null;SCR().scrollTo(0,0);return render()}
  if(d.uyprog){uyProg=true;uyF=null;SCR().scrollTo(0,0);return render()}
  if(d.uyujb!==undefined){uyUjb=uyUjb===+d.uyujb?null:+d.uyujb;return render()}
  if(d.uycurback){qbShowRes=false;return render()}
  if(d.uycr){uyOpen={k:'cr'};return uySheet()}
  if(d.uymr){uyOpen={k:'mr'};return uySheet()}
  if(d.uycrf&&uyOpen){uyOpen.f=d.uycrf;return uySheet()}
  if(d.uyoth&&uyOpen){const i=document.getElementById('uyOther');uyOpen.o=(i&&i.value||'').trim().slice(0,60);return uySheet()}
  if(d.uycrw!==undefined&&uyOpen){const o=uyOpen,x={t:Date.now(),f:o.f,w:+d.uycrw};if(o.f==='other'){x.o=o.o||'';x.v=0}const C=U().cr;C.push(x);
    const cut=Date.now()-100*UY_DAY;U().cr=C.filter(c=>c.t>=cut).slice(-200);save();return uyDone()}
  if(d.uymrf&&uyOpen){uyOpen.f=d.uymrf;return uySheet()}
  if(d.uymrv!==undefined&&uyOpen){const o=uyOpen;o.v=+d.uymrv;const M=U().mr;M.push({t:Date.now(),f:o.f,v:o.v});const cut=Date.now()-40*UY_DAY;U().mr=M.filter(c=>c.t>=cut).slice(-200);save();if(screen==='uyub')render();return uySheet()}
  if(d.uyqb){const B=qb(),id=d.uyqb;if(B.cur&&B.cur.id!==id&&!confirm(Tx('سيُوقف العلاج الحالي ويبدأ علاج جديد. متابعة؟')))return;
    if(!B.diag)B.diag=TODAY;if(!B.cur||B.cur.id!==id){B.cur={id,start:TODAY,log:{},read:{}};const T=uyLast();if(T&&!uyValid(T)){let k=0;UY_Q.forEach((q,i)=>{if(q[0]===id&&k<3)B.ans[id+(k++)]=Math.round(T.ans[i]*2/3)})}}qbShowRes=false;save();return go('qalb')}
});

