/* ---------- umrah: confirm each stage, with counters for the tawaf and the sa'i ----------
   Each stage lists what the seeker confirms (r: required by the Maliki school as the guide states it; others are sunna).
   The tawaf and the sa'i are confirmed by counting seven rounds. Progress is kept for the current umrah. */
const UM_CHK=[
  [['اغْتَسَلْتُ',0],['لَبِسْتُ ثِيَابَ الْإِحْرَامِ (وَالْمَرْأَةُ ثِيَابَهَا السَّاتِرَةَ)',1],['تُبْتُ وَطَلَبْتُ الْمُسَامَحَةَ وَقَضَيْتُ دُيُونِي أَوْ وَكَّلْتُ مَنْ يَقْضِيهَا',0],['نَوَيْتُ الْعُمْرَةَ بِقَلْبِي',1],['لبّيتُ',1]],
  [['أَنَا عَلَى وُضُوءٍ لِلطَّوَافِ',1],['بَدَأْتُ مِنَ الْحَجَرِ الْأَسْوَدِ، وَالْكَعْبَةُ عَنْ يَسَارِي',1],['لَمْ أَدْخُلِ الْحِجْرَ',1],['صَلَّيْتُ رَكْعَتَيِ الطَّوَافِ',1],['شَرِبْتُ مِنْ زَمْزَمَ',0]],
  [['بَدَأْتُ مِنَ الصَّفَا',1],['ذَكَرْتُ اللَّهَ عَلَى الصَّفَا مُسْتَقْبِلًا الْكَعْبَةَ',0]],
  [['حَلَقْتُ أَوْ قَصَّرْتُ مِنْ كُلِّ شَعْرِي (وَالْمَرْأَةُ قَدْرَ أُنْمُلَةٍ)',1],['حَمِدْتُ اللَّهَ وَدَعَوْتُ لِنَفْسِي وَلِوَالِدَيَّ وَلِلْمُسْلِمِينَ',0]]];
const UM_CNT={1:'tw',2:'sa'},UM_LAST=3;
function umS(){if(S.umr&&S.umr.v!==4){S.umr={v:4};S.umStep=0}const R=S.umr=S.umr||{v:4};R.chk=R.chk||{};R.ok=R.ok||[];R.tw=R.tw||0;R.sa=R.sa||0;return R}
const umNeed=i=>{const R=umS(),c=UM_CNT[i];return UM_CHK[i].every(([,r],j)=>!r||R.chk[i+'-'+j])&&(!c||R[c]>=7)};
function umCounter(i){const R=umS(),c=UM_CNT[i],n=R[c];if(!c)return '';
  const sai=c==='sa',dir=n>=7?'':sai?(n%2===0?'مِنَ الصَّفَا إِلَى الْمَرْوَةِ':'مِنَ الْمَرْوَةِ إِلَى الصَّفَا'):'ابْدَأِ الشَّوْطَ عِنْدَ الْحَجَرِ الْأَسْوَدِ';
  return `<div class="umc">
   <p class="umc-h"><span>${sai?'أَشْوَاطُ السَّعْيِ':'أَشْوَاطُ الطَّوَافِ'}</span> <b dir="ltr">${n} / 7</b></p>
   <div class="umc-dots" aria-hidden="true">${Array.from({length:7},(_,k)=>`<i class="${k<n?'on':''}"></i>`).join('')}</div>
   ${n<7?`<p class="umc-next"><span>الشَّوْطُ</span> ${n+1}: <span>${dir}</span></p>${!sai&&umU().tw7?`<ol class="umc-tw">${umTw(umU(),umU().tw7[n],n,1)}</ol>`:''}${sai&&umU().sa7?`<ol class="umc-tw">${umSa(umU(),umU().sa7[n],n,1)}</ol>`:''}<button class="umc-b" data-umc="${c}" data-v="1">${sai?'وَصَلْتُ، أَتْمَمْتُ شَوْطًا':'مَرَرْتُ بِالْحَجَرِ الْأَسْوَدِ، أَتْمَمْتُ شَوْطًا'}</button>`
     :`<p class="umc-done">${sai?'أَتْمَمْتَ السَّعْيَ سَبْعَةَ أَشْوَاطٍ، وَانْتَهَيْتَ عِنْدَ الْمَرْوَةِ ✓':'أَتْمَمْتَ الطَّوَافَ سَبْعَةَ أَشْوَاطٍ ✓'}</p>`}
   ${n?`<button class="lnk umc-u" data-umc="${c}" data-v="-1">تَرَاجَعْ شَوْطًا</button>`:''}
   <p class="meta umc-n">إِنْ شَكَكْتَ فِي الْعَدَدِ فَخُذْ بِالْأَقَلِّ.</p></div>`}
function umCheck(i){const R=umS(),L=UM_CHK[i]||[],done=R.ok.includes(i),can=umNeed(i);
  const before=Array.from({length:Math.min(i,UM_LAST+1)},(_,k)=>k).filter(k=>!R.ok.includes(k)&&UM_CHK[k].some(([,r])=>r));
  const U=umU();
  return `<div class="umv${done?' ok':''}">
   ${done?'<p class="umv-h">✓ <span>أَتْمَمْتَ هَذِهِ الْمَرْحَلَةَ</span></p>':L.some(([,r])=>r)?'<p class="umv-h"><span>قَبْلَ أَنْ تَنْتَقِلَ، تَأَكَّدْ:</span></p>':''}
   ${L.some(([,r])=>r)?`<ul class="umv-l">${L.map(([t,r],j)=>{if(!r)return '';const on=!!R.chk[i+'-'+j];return `<li><button class="umv-i${on?' on':''}" data-umchk="${i}-${j}" aria-pressed="${on}"><i aria-hidden="true">${on?'✓':''}</i><span>${t}</span></button></li>`}).join('')}</ul>`:''}
   ${before.length&&!done?`<p class="umv-w"><span>لَمْ تُؤَكِّدْ بَعْدُ:</span> ${before.map(k=>`<button class="lnk" data-umstep="${k}">${U.st[k].t}</button>`).join('، ')}</p>`:''}
   ${done?`<button class="btn small" data-umok="${i}" data-v="0">أَلْغِ التَّأْكِيدَ</button>`
     :`<button class="btn ok umv-b" data-umok="${i}" data-v="1"${can?'':' disabled'}>${i===UM_LAST?'أَتْمَمْتُ عُمْرَتِي':'أَتْمَمْتُ هَذِهِ الْمَرْحَلَةَ'}</button>${can?'':`<p class="meta umv-m">${UM_CNT[i]&&R[UM_CNT[i]]<7?'أَكْمِلِ الْأَشْوَاطَ السَّبْعَةَ أَوَّلًا.':'أَكِّدْ مَا فَوْقَهُ أَوَّلًا.'}</p>`}`}
  </div>`}
/* the umrah is complete: thanks, and a new one can begin */
function umDoneCard(){const R=umS();if(!R.doneAt)return '';
  return `<div class="box pad umd"><p class="umd-t">تَقَبَّلَ اللَّهُ عُمْرَتَكَ</p><p class="umd-v" dir="rtl" lang="ar">﴿رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ﴾</p>
   <p class="meta"><span>أَتْمَمْتَهَا يَوْمَ</span> <span class="notr" dir="ltr">${esc(R.doneAt)}</span>. <span>قَبْلَ أَنْ تُغَادِرَ مَكَّةَ، طُفْ طَوَافَ الْوَدَاعِ.</span></p>
   <button class="btn small" data-umnew="1">${umNewArm?'اضْغَطْ مَرَّةً أُخْرَى لِتَبْدَأَ عُمْرَةً جَدِيدَةً':'ابْدَأْ عُمْرَةً جَدِيدَةً'}</button></div>`}
let umNewArm=0;
document.addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;const d=t.dataset;
  if(d.umchk){const R=umS();R.chk[d.umchk]=!R.chk[d.umchk];save();const y=SCR().scrollTop;render();SCR().scrollTo(0,y);return}
  if(d.umc){const R=umS(),c=d.umc;R[c]=Math.max(0,Math.min(7,(R[c]||0)+(+d.v)));if(+d.v>0)try{navigator.vibrate&&navigator.vibrate(R[c]>=7?[40,60,40]:30)}catch(x){}
    save();const y=SCR().scrollTop;render();SCR().scrollTo(0,y);return}
  if(d.umok!==undefined){const R=umS(),i=+d.umok;
    if(+d.v){if(!umNeed(i))return;if(!R.ok.includes(i))R.ok.push(i);if(!R.start)R.start=TODAY;
      if(i===UM_LAST&&!R.doneAt){R.doneAt=TODAY;(S.umH=S.umH||[]).push(TODAY)}
      const U=umU();if(i<U.st.length-1)S.umStep=i+1}
    else{R.ok=R.ok.filter(k=>k!==i);if(i===UM_LAST)R.doneAt=null}
    save();render();const c=document.querySelector('.um-dots');SCR().scrollTo({top:c?c.getBoundingClientRect().top+SCR().scrollTop-20:0});return}
  if(d.umnew){if(!umNewArm){umNewArm=1;render();setTimeout(()=>{umNewArm=0;if(screen==='umrah')render()},4000);return}
    umNewArm=0;S.umr={v:4,chk:{},ok:[],tw:0,sa:0};S.umStep=0;save();render();return}
});
