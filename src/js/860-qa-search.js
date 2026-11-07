const qaNorm=t=>(t||'').replace(/[\u064B-\u0652\u0670\u0640]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').toLowerCase();
/* highlight: walk the text, compare letters without harakat, and wrap what matches in <mark> */
function qaUnmark(root){root.querySelectorAll('mark.qa-m').forEach(m=>{const p=m.parentNode;p.replaceChild(document.createTextNode(m.textContent),m);p.normalize()})}
function qaMark(el,words){const tw=document.createTreeWalker(el,NodeFilter.SHOW_TEXT),nodes=[];let t;while(t=tw.nextNode())if(!t.parentNode.closest('.qa-n,.qa-hint'))nodes.push(t);
  nodes.forEach(nd=>{const s=nd.nodeValue;let norm='',map=[];for(let i=0;i<s.length;i++){const c=qaNorm(s[i]);for(const ch of c){norm+=ch;map.push(i)}}
    const R=[];words.forEach(w=>{let k=0;while((k=norm.indexOf(w,k))>=0){R.push([map[k],map[k+w.length-1]+1]);k+=w.length}});if(!R.length)return;
    R.sort((x,y)=>x[0]-y[0]);const M=[];R.forEach(r=>{const l=M[M.length-1];if(l&&r[0]<=l[1])l[1]=Math.max(l[1],r[1]);else M.push(r.slice())});
    let e2=M.map(r=>{let b=r[1];while(b<s.length&&/[ً-ْٰـ]/.test(s[b]))b++;return [r[0],b]});
    const f=document.createDocumentFragment();let pos=0;e2.forEach(([a,b])=>{if(a>pos)f.appendChild(document.createTextNode(s.slice(pos,a)));const m=document.createElement('mark');m.className='qa-m';m.textContent=s.slice(a,b);f.appendChild(m);pos=b});
    if(pos<s.length)f.appendChild(document.createTextNode(s.slice(pos)));nd.parentNode.replaceChild(f,nd)})}
let qaTimer=0;
function qaSearch(v){const words=qaNorm(v.trim()).split(/\s+/).filter(w=>w.length>0),q=words.length>0;let n=0;
  document.querySelectorAll('.qa-daysec,.qa-last').forEach(x=>x.hidden=q);
  document.querySelectorAll('.qa-w').forEach(w=>{qaUnmark(w);const c=w.querySelector('.qa-card');if(c&&c.dataset.sflip){c.classList.remove('flip');delete c.dataset.sflip}
    if(!q){w.hidden=false;return}
    const fq=qaNorm((w.querySelector('.qa-f b')||{}).textContent),fa=qaNorm((w.querySelector('.qa-b>span.notr')||{}).textContent),all=fq+' '+fa;
    const ok=words.every(x=>all.includes(x));w.hidden=!ok;if(!ok)return;n++;
    if(c&&!words.every(x=>fq.includes(x))&&!c.classList.contains('flip')){c.classList.add('flip');c.dataset.sflip='1'}
    qaMark(w,words)});
  document.querySelectorAll('.qa-sh,.qa-ban').forEach(x=>x.hidden=q);
  const no=document.getElementById('qaNone');if(no)no.hidden=!q||n>0;
  const cn=document.getElementById('qaCnt');if(cn){cn.hidden=!q||!n;const k=document.getElementById('qaCntN');if(k)k.textContent=n}}
document.addEventListener('input',e=>{if(e.target.id!=='qaQ')return;const v=e.target.value;clearTimeout(qaTimer);qaTimer=setTimeout(()=>qaSearch(v),180)});
/* share one question by a link that opens it in the app */
async function qaShare(i){const [q]=qaT(i),url=location.origin+location.pathname+'#qa='+i,txt=String(q).replace(/<[^>]+>/g,'');
  try{if(navigator.share){await navigator.share({title:Tx('سؤال وجواب')+' · '+Tx('المرشد'),text:txt,url});return}}catch(e){if(e&&e.name==='AbortError')return}
  const s=txt+'\n'+url;let ok=false;try{await navigator.clipboard.writeText(s);ok=true}catch(e){try{const ta=document.createElement('textarea');ta.value=s;ta.setAttribute('readonly','');ta.style.cssText='position:fixed;opacity:0';document.body.appendChild(ta);ta.select();ok=document.execCommand('copy');ta.remove()}catch(x){}}
  miniToast(ok?Tx('نُسخ الرابط ✓'):url)}
function miniToast(t){let el=document.getElementById('mtoast');if(!el){el=document.createElement('div');el.id='mtoast';el.setAttribute('role','status');document.body.appendChild(el)}el.textContent=t;el.classList.add('on');clearTimeout(miniToast.t);miniToast.t=setTimeout(()=>el.classList.remove('on'),2600)}
