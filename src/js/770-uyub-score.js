/* ---- the arithmetic ---- */
function uyReason(d,id){const r=(S.qmr||{})[d];if(r&&r[id])return r[id];const o=S.organs&&S.organs[id];
  if(o){if(o.hist&&o.hist[d]&&o.hist[d].r)return o.hist[d].r;const s=(o.slips||[]).find(x=>x.date===d);if(s&&s.reason)return s.reason}return ''}
function uyMuh(ref){const A={},Q=S.qm||{};let nights=0;
  Object.keys(Q).forEach(d=>{const t=uyDT(d);if(t>ref+UY_DAY||ref-t>30*UY_DAY)return;const D=Q[d]||{};const ks=Object.keys(D);if(!ks.length)return;nights++;
    ks.forEach(id=>{if(D[id]!==0)return;const m=UY_RS[uyReason(d,id)];
      if(m)Object.entries(m).forEach(([f,v])=>A[f]=(A[f]||0)+v);
      else if(id==='lisan'||id==='p_samt')['ghiba','kadhib','fudul'].forEach(f=>A[f]=(A[f]||0)+1/3)})});
  return {A,nights}}
function uyCV(e,ref){if(e.v!=null)return e.v;if(ref-e.t>7*UY_DAY)return 0;return null}/* not judged within 7 days = "no" */
function uyScore(T,ref){const U=uy(),S9={};UY_Q.forEach(([f],i)=>S9[f]=(S9[f]||0)+(T.ans[i]||0));
  const cr=U.cr.filter(e=>e.f&&e.t<=ref&&ref-e.t<=90*UY_DAY).map(e=>({f:e.f,v:uyCV(e,ref)})).filter(e=>e.v!=null),crOn=cr.length>0;
  const mr=U.mr.filter(e=>e.t<=ref&&ref-e.t<=30*UY_DAY&&e.v!=null),mrOn=mr.length>0;
  const {A,nights}=uyMuh(ref),aOn=nights>=7,out={};
  UY.forEach(([f],i)=>{const C=cr.filter(e=>e.f===f).reduce((a,e)=>a+e.v,0),M=mr.filter(e=>e.f===f).reduce((a,e)=>a+e.v,0),Af=A[f]||0;
    const src={s:(S9[f]||0)/9};let num=UY_W.s*src.s,den=UY_W.s;
    if(crOn){src.c=Math.min(1,C/3);num+=UY_W.c*src.c;den+=UY_W.c}
    if(mrOn){src.m=Math.min(1,M/4);num+=UY_W.m*src.m;den+=UY_W.m}
    if(aOn&&UY_AF.has(f)){src.a=Math.min(1,Af/8);num+=UY_W.a*src.a;den+=UY_W.a}
    const F=num/den,n35=Object.values(src).filter(v=>v>=.35).length;
    out[f]={f,i,F,S:S9[f],C,M,A:Af,src,n35,conf:n35>=2,lv:uyLv(F)}});
  return out}
const uyLv=F=>F<.15?0:F<.35?1:F<.6?2:3;
const uyRank=R=>Object.values(R).sort((a,b)=>b.F-a.F||b.n35-a.n35||a.i-b.i);
function uyValid(T){if(T.ans.every(v=>v===T.ans[0]))return 'same';return ''}
const uyLast=()=>{const t=uy().tests;return t[t.length-1]||null};
const uyPrevValid=()=>{const t=uy().tests.filter(x=>!uyValid(x));return t.length>1?t[t.length-2]:null};
function uyPend(){const n=Date.now();return uy().cr.filter(e=>e.f&&e.v==null&&n-e.t>=UY_DAY&&n-e.t<=7*UY_DAY&&(!e.nx||n>=e.nx))}

