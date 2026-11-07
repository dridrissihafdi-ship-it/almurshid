/* --- tasmi' --- */
/* ---------- tasmi' engine: compares what the reciter says with the expected words ---------- */
const TS_MARKS=/[ؐ-ًؚ-ٟۖ-ۭ࣓-ࣿ]/g;
function tsKey(w){w=(w||'').normalize('NFC').replace(/ـ/g,'').replace(/ٰ/g,'ا').replace(TS_MARKS,'')
  .replace(/[ٱأإآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/ؤ/g,'و').replace(/ئ/g,'ي').replace(/ء/g,'').replace(/[^ء-ي]/g,'');
  w=w.replace(/(.)\1/g,'$1');const k1=w.replace(/ا/g,'');return [k1,k1.replace(/[وي]/g,'')]}
function tsLev(a,b){if(a===b)return 0;const m=a.length,n=b.length;if(!m)return n;if(!n)return m;let p=Array.from({length:n+1},(_,j)=>j);
  for(let i=1;i<=m;i++){const c=[i];for(let j=1;j<=n;j++)c[j]=Math.min(p[j]+1,c[j-1]+1,p[j-1]+(a[i-1]===b[j-1]?0:1));p=c}return p[n]}
/* heard key h vs expected key e: [k1,k2] pairs */
/* strict on purpose: a memorisation slip is usually one letter at the start of a word (ي/ت/ن, و/ف) or at its end (هم/كم, ون/ين).
   Only the systematic differences between the mushaf's rasm and ordinary spelling are forgiven:
   long-vowel letters (الربوا/الربا, الملؤا/الملأ), open ta (نعمت/نعمة), a doubled letter written once (والّيل/والليل),
   and one letter inside a long word (the recogniser's own slips). */
function tsSame(h,e){if(!h[0]||!e[0])return false;const a=h[0],b=e[0];if(a===b)return true;
  const WN=x=>x==='ون'||x==='ين';
  if(h[1]&&h[1]===e[1]&&a[0]===b[0]&&!(WN(a.slice(-2))&&WN(b.slice(-2))&&a.slice(-2)!==b.slice(-2)))return true;
  if(a.length===b.length&&a.replace(/ص/g,'س')===b.replace(/ص/g,'س'))return true;
  if(a.length>2&&a.length===b.length&&a.slice(0,-1)===b.slice(0,-1)&&/[ته]/.test(a.slice(-1))&&/[ته]/.test(b.slice(-1)))return true;
  if(Math.max(a.length,b.length)<6)return false;
  return tsLev(a,b)<=1&&a.slice(0,2)===b.slice(0,2)&&a.slice(-2)===b.slice(-2)}
const tsCat=(a,b)=>[a[0]+b[0],a[1]+b[1]];
const TS_IGN=new Set(['اعوذ','بالله','من','الشيطان','الرجيم','بسم','الله','الرحمن','الرحيم','امين','صدق','العظيم'].map(w=>tsKey(w)[0]));
/* E: [{w,k,a(aya index),st}]  st: 0 hidden, 1 ok, 2 error, 3 prompted(fath) */
function tsNew(words){return {E:words,p:0,miss:0,err:0,fath:0,begun:false}}
function tsFeed(T,tokens,cb){cb=cb||{};const E=T.E;let i=0;
  while(i<tokens.length&&T.p<E.length){const h=tsKey(tokens[i]),p=T.p;i++;if(!h[0])continue;
    const ok=(n)=>{for(let j=p;j<p+n;j++)if(E[j].st===0)E[j].st=1;T.p=p+n;T.miss=0;T.begun=true;cb.ok&&cb.ok(p,n)};
    if(tsSame(h,E[p].k)){ok(1);continue}
    if(p+1<E.length&&tsSame(h,tsCat(E[p].k,E[p+1].k))){ok(2);continue}
    if(i<tokens.length){const h2=tsKey(tokens[i]);if(h2[0]&&tsSame(tsCat(h,h2),E[p].k)){i++;ok(1);continue}}
    let jumped=false;
    for(let k=1;k<=2&&p+k<E.length;k++){if(tsSame(h,E[p+k].k)){let soft=true;for(let j=p;j<p+k;j++)if(E[j].k[0].length>3&&!E[j].f)soft=false;if(soft){ok(k+1);jumped=true}break}}
    if(jumped)continue;
    /* resync: the reciter (or the recogniser) is clearly further on — two heard words in a row match the text ahead */
    if(i<tokens.length){const h2=tsKey(tokens[i]);let rs=false;
      for(let k=1;k<=3&&p+k+1<E.length;k++)if(tsSame(h,E[p+k].k)&&h2[0]&&tsSame(h2,E[p+k+1].k)){let ne=false;for(let j=p;j<p+k;j++)if(E[j].st===0){E[j].st=2;T.err++;ne=true}
        T.p=p+k+2;T.miss=0;T.begun=true;i++;if(ne&&cb.err)cb.err(p);cb.ok&&cb.ok(p+k,2);rs=true;break}
      if(rs)continue}
    let back=false;for(let j=Math.max(0,p-10);j<p;j++)if(tsSame(h,E[j].k)){back=true;break}
    if(back){T.miss=0;continue}
    if(!T.begun&&TS_IGN.has(h[0]))continue;
    T.miss++;
    if(T.miss>=2){T.miss=0;E[p].tries=(E[p].tries||0)+1;if(E[p].st!==2&&E[p].st!==3){E[p].st=2;T.err++}
      if(E[p].tries>=2&&!E[p].f){cb.fath?cb.fath(p):tsPrompt(T)}else cb.err&&cb.err(p)}}
  if(T.p>=E.length&&cb.done)cb.done()}
function tsPrompt(T){const E=T.E;if(T.p>=E.length)return -1;if(!E[T.p].f){E[T.p].f=1;T.fath++}if(E[T.p].st!==2)E[T.p].st=3;T.miss=0;return T.p}
