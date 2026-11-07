function adhAwake(){const adh=screen==='adh_sabah'||screen==='adh_masa'||screen==='mushaf'||screen==='subha',v=document.getElementById('mqVideo');
  if(adh)keepAwake(true);else if(!(v&&!v.paused)&&!(run&&!run.done&&!run.paused))keepAwake(false)}
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')adhAwake()});
function logOrgan(id,ok,reason,D){D=D||TODAY;
  const o=S.organs[id];if(o.ready&&ok!==null)return render();if(!o.base)orgMigrate(o);
  if(o.base){if(ok===null){delete o.hist[D];Object.keys(o.hist).forEach(k=>{if(o.hist[k].f===D)delete o.hist[k]})}
    else{const prev=Object.keys(o.hist).filter(k=>k<D).sort().pop();let s=prev?addDays(prev,1):o.base.d;
      for(let d=s;d<D;d=addDays(d,1))if(!o.hist[d])o.hist[d]=ok?{v:'ok',f:D}:{v:'miss',f:D};
      o.hist[D]={v:ok?'ok':'slip',r:(reason||'').trim()}}
    orgSim(o);confirmFor=null;tzConf=null;save();render();return}
  o.broken=false;
  if(ok){if(o.days===0&&(!o.attemptStart||o.attemptStart>D))o.attemptStart=D;
    o.days++;if(o.days>=30){if(o.phase==='tathir'){o.days=30;o.ready=true}else{o.phase='done';o.days=30}}}
  else{o.slips.push({date:D,phase:o.phase,day:o.days,reason:(reason||'').trim()});o.days=0;o.resets++;o.attempt++;o.attemptStart=addDays(D,1)}
  o.last=D;o.today=D===TODAY?(ok?'ok':'slip'):null;confirmFor=null;save();render();
}
document.addEventListener('click',e=>{
  const t=e.target.closest('button');if(!t)return;const d=t.dataset;if(d.tzx)try{sheetClose()}catch(er){}
  if(ikhClick(d))return;
  if(khClick(d))return;
  if(rmClick(d,t))return;
  if(d.qago){qaGo(d.qago);return}
  if(d.qaedit){qaEditOpen();return}
  if(auClick(d))return;
  if(adClick(d))return;
  if(mineClick(d))return;
  if(askClick(d))return;
  if(tsClick(d))return;
  if(toolsClick(d))return;
  if(adzClick(d))return;
  if(serClick(d))return;
  if(d.pathman){const m=pathMan();if(m[d.pathman])delete m[d.pathman];else m[d.pathman]=TODAY;save();const y=SCR().scrollTop;render();SCR().scrollTo(0,y);return}
  if(d.ptadj){if(d.ptadj==='reset')S.ptAdj={};else{const[k,v]=d.ptadj.split(':');S.ptAdj=S.ptAdj||{};S.ptAdj[k]=Math.max(-30,Math.min(30,(S.ptAdj[k]||0)+(+v)))}save();const y=SCR().scrollTop;render();SCR().scrollTo(0,y);return}
  if(edClick(d))return;
  if(d.rmzoom){rmZoom();return}
  if(d.vdplay){vdCur=d.vdplay;render();SCR().scrollTo({top:0,behavior:'smooth'});const el=document.getElementById('vdV');if(el){const pr=el.play();if(pr&&pr.catch)pr.catch(()=>{})}return}
  if(d.vdrefresh){auLoad(true);return}
  if(d.back!==undefined&&screen==='majalis'&&majTab){majTab=null;render();SCR().scrollTo(0,0);return}
  if(d.back!==undefined){let prev=null;while(NAVH.length){const x=NAVH.pop();if(x&&x!==screen){prev=x;break}}navBack=true;try{go(prev||d.back||'home')}finally{navBack=false}SCR().scrollTo(0,0);return}
  if(ttsClick(d))return;
  if(d.amode||d.google||d.signout||d.resend||d.verified||d.delacct||d.delno||d.delyes||d.adminreload||d.adpub||d.adhide||d.adxadd||d.adxdel!==undefined||d.anndismiss!==undefined){authClick(d);return}
  if(d.ob){obClick(d.ob);return}
  if(d.tzdate!==undefined){const v=+d.tzdate;if(v===0)tzDate=null;else{const n=addDays(tzDate||TODAY,v);tzDate=n>=TODAY?null:n}tzConf=null;render();return}
  if(d.tzok){logOrgan(d.tzok,true,'',tzDate);return}
  if(d.tzslip){tzConf=d.tzslip;render();return}
  if(d.tzslipno){tzConf=null;render();return}
  if(d.tzslipyes){const n=document.getElementById('tzn-'+d.tzslipyes);logOrgan(d.tzslipyes,false,n?n.value:'',tzDate);return}
  if(d.tzclr){logOrgan(d.tzclr,null,'',tzDate);return}
  if(trClick(d))return;
  if(d.ahtab){ahTab=d.ahtab;render();SCR().scrollTo(0,0);return}
  if(d.ahdsel){ahdSel=d.ahdsel;render();return}
  if(d.tzmap){const m=document.getElementById('tzMap');if(m)m.scrollIntoView({behavior:'smooth'});return}
  if(d.tztab){tzTab=d.tztab;if(screen!=='tazkiya')go('tazkiya');else{render();SCR().scrollTo(0,0)}return}
  if(d.organ){orgSel=d.organ;go('organ');return}
  if(d.qa!==undefined){const i=+d.qa;S.qaLast=i;document.querySelectorAll('[data-qa="'+i+'"]').forEach(c=>c.classList.toggle('flip'));if(!(S.qaSeen2||[]).includes(i)){S.qaSeen2=[...(S.qaSeen2||[]),i];save()}return}
  if(d.qasec!==undefined){qaSec=+d.qasec;qaFocus=null;render();return}
  if(d.qashare!==undefined){qaShare(+d.qashare);return}
  if(d.qastar!==undefined){const i=+d.qastar,F=S.qaFav=S.qaFav||[],k=F.indexOf(i);k>=0?F.splice(k,1):F.push(i);save();const y=SCR().scrollTop;render();SCR().scrollTo(0,y);return}
  if(d.qaopen!==undefined){openQA(d.qaopen);return}
  if(d.wk!==undefined){wkOff=Math.max(0,wkOff+(+d.wk));render();return}
  if(d.wkshare){wkShare();return}
  if(d.fz){S.fz=+d.fz;applyFz();save();render();return}
  if(d.bkexp){backupExport();return}
  if(d.bkyes){if(bkPending){S=bkPending;S.updatedAt=Date.now();bkPending=null;save();setTimeout(()=>location.reload(),300)}return}
  if(d.bkno){bkPending=null;bkMsg='';render();return}
  if(d.adopen){aboutOpen.add('ad-'+d.adopen);render();const el=document.querySelector('details[data-acc=ad-'+d.adopen+']');if(el)el.scrollIntoView({block:'start'});return}
  if(d.rtab){ruhiTab=d.rtab;render();return}
  if(d.ijmin){S.ijMin=+d.ijmin;wkHowOpen=true;save();const y=SCR().scrollTop;render();SCR().scrollTo(0,y);return}
  if(d.wkopen){ruhiTab='week';wkOff=0;go('ruhi');return}
  if(d.mhsave){const M=mhState(),k=tzDate||nowStr(),g=(document.getElementById('mh-good').value||'').trim(),sl=(document.getElementById('mh-slip').value||'').trim();
    if(!g&&!sl){mhMsg='اكتب ولو سطرًا واحدًا.';render();setTimeout(()=>{mhMsg=''},3000);return}
    M[k]={good:g,slip:sl,saved:Date.now()};save();mhMsg='سُجّلت محاسبة اليوم ✓ تقبّل الله منك.';render();setTimeout(()=>{mhMsg=''},4000);return}
  if(d.ctsend){contactSend();return}
  if(d.tqask){tqAskSend();return}
  if(d.tqclr){tqQuery='';const i=document.getElementById('tqQ');if(i){i.value='';i.focus()}tqSearch();return}
  if(d.tqasknow){const t=document.getElementById('tqAsk'),bx=document.getElementById('tqAskBox');if(t&&!t.value.trim()){t.value=tqQuery.trim()+' ';tqAskDraft=t.value}if(bx)bx.scrollIntoView({block:'center',behavior:'smooth'});setTimeout(()=>t&&t.focus(),350);return}
  if(d.admsgdel){adminMsgDel(d.admsgdel);return}
  if(d.adpush){adminPush();return}
  if(d.mq){mqToggle();return}
  if(d.wsave){const t=(document.getElementById('waredIn').value||'').trim();if(!t){waredMsg='اكتب الوارد أولًا.';return render()}
    (S.wared=S.wared||[]).push({ts:Date.now(),text:t,k:screen});(S.waredDrafts=S.waredDrafts||{})[screen]='';if(screen==='mraqib')S.waredDraft='';save();waredMsg='حُفظ الوارد ✓';render();setTimeout(()=>{waredMsg=''},3000);return}
  if(d.wdel){S.wared=(S.wared||[]).filter(w=>String(w.ts)!==d.wdel);save();return render()}
  if(d.lang){LANG=d.lang;S.lang=LANG;save();computeHijri();pushSync();if(LANG!=='ar'&&!I18N_OK){i18nLoad().then(()=>render());return}return render()}
  if(d.nav==='more'){moreOpen();return}
  if(d.nav==='tariq')return go('roadmap');
  if(d.htadd!==undefined){htPick(+d.htadd);return}
  if(d.htchg!==undefined){htPick(+d.htchg);return}
  if(d.htdel!==undefined){htGet()[+d.htdel]=null;save();sheetClose();render();return}
  if(d.htset!==undefined){const T=htGet(),i=+d.htset,j=T.indexOf(d.id);if(j>=0&&j!==i)T[j]=T[i];T[i]=d.id;save();sheetClose();render();return}
  if(d.vctry){vcTry(d.vctry);return}
  if(d.uimode){S.ui=d.uimode==='classic'?'classic':'';save();screen='home';NAVH.length=0;render();SCR().scrollTo({top:0});return}
  if(d.qm){S.qm=S.qm||{};const D=S.qm[TODAY]=S.qm[TODAY]||{},v=+d.qv;if(D[d.qm]===v)delete D[d.qm];else D[d.qm]=v;const ks=Object.keys(S.qm).sort();while(ks.length>60)delete S.qm[ks.shift()];save();
    const o=S.organs[d.qm],live=o&&activeOrgans().some(g=>g.id===d.qm)&&!o.today&&!o.ready;qmSlip=null;
    if(d.qm.startsWith('p_')){if(D[d.qm]===0){qmSlip=d.qm;return render()}const td=tzDate;tzDate=null;prepSet(d.qm.slice(2),D[d.qm]===2?'ok':null);tzDate=td;return}
    if(D[d.qm]!==0&&S.qmr&&S.qmr[TODAY])delete S.qmr[TODAY][d.qm];if(live&&D[d.qm]===2)return logOrgan(d.qm,true);if(D[d.qm]===0){qmSlip=d.qm;return render()}return render()}
  if(d.qmwhy!==undefined){const id=qmSlip;qmSlip=null;if(id){S.qmr=S.qmr||{};(S.qmr[TODAY]=S.qmr[TODAY]||{})[id]=d.qmwhy;const ks=Object.keys(S.qmr).sort();while(ks.length>60)delete S.qmr[ks.shift()];
    if(id.startsWith('p_')){const td=tzDate;tzDate=null;prepSet(id.slice(2),'fail',d.qmwhy);tzDate=td;return}const o=S.organs[id];if(o&&activeOrgans().some(g=>g.id===id)&&!o.today&&!o.ready)return logOrgan(id,false,d.qmwhy);save()}return render()}
  if(d.tzmore){tzMore(d.tzmore);return}
  if(d.amsel){S.amEx={id:d.amsel,start:TODAY,done:{}};save();pushSync();return render()}
  if(d.amdone){if(S.amEx){(S.amEx.done=S.amEx.done||{})[TODAY]=1;save();pushSync()}return render()}
  if(d.amgo!==undefined){amI=+d.amgo;const c=document.querySelectorAll('#amRow .am-c')[amI];if(c)c.scrollIntoView({inline:'center',block:'nearest',behavior:'smooth'});return}
  if(d.gstep){const [k,j]=d.gstep.split(':');S.gStep=S.gStep||{};S.gStep[k]=+j;save();render();const c=document.querySelector('.um-dots');SCR().scrollTo({top:c?c.getBoundingClientRect().top+SCR().scrollTop-20:0});return}
  if(d.story){storyOpen(d.story);return}
  if(d.nav)return go(d.nav);
  if(d.adhkar){e.preventDefault();return go('adh_'+d.adhkar)}
  if(d.adate!==undefined){const v=+d.adate;if(v===0)aDate=null;else{const n=addDays(aDate||TODAY,v);aDate=n>=TODAY?null:n}render();return}
  if(d.qbstart){qb().started=true;qbI=0;save();return render()}
  if(d.qbans!==undefined){const k=+d.qbans;if(qbRetest){const it=qbRetest.list[qbRetest.i];qbRetest.ans[it.id+it.k]=k}else{const L=QALB.flatMap(x=>x.q.map((q,j)=>({id:x.id,k:j})));const it=L[qbI];qb().ans[it.id+it.k]=k;save()}return render()}
  if(d.qbprev){if(qbRetest)qbRetest.i=Math.max(0,qbRetest.i-1);else qbI=Math.max(0,qbI-1);return render()}
  if(d.qbnext){if(qbRetest){if(qbRetest.i<qbRetest.list.length-1){qbRetest.i++;return render()}
      const B=qb(),c=B.cur,pre=qbScore(c.id),post=qbScore(c.id,qbRetest.ans);B.hist.push({id:c.id,start:c.start,end:TODAY,pre,post});Object.assign(B.ans,qbRetest.ans);B.cur=null;qbRetest=null;save();SCR().scrollTo(0,0);return render()}
    if(qbI<23){qbI++;return render()}const B=qb();B.diag=TODAY;save();SCR().scrollTo(0,0);return render()}
  if(d.qbgo){const B=qb();if(B.cur&&!confirm(Tx('سيُوقف العلاج الحالي ويبدأ علاج جديد. متابعة؟')))return;B.cur={id:d.qbgo,start:TODAY,log:{},read:{}};qbShowRes=false;save();SCR().scrollTo(0,0);return render()}
  if(d.qbrediag){const B=qb();B.diag=null;B.started=true;qbI=0;qbShowRes=false;save();return render()}
  if(d.qbread){const c=qb().cur;(c.read=c.read||{})[TODAY]=1;save();return render()}
  if(d.qblog!==undefined){const c=qb().cur;c.log=c.log||{};if(d.qblog)c.log[TODAY]=d.qblog;else delete c.log[TODAY];save();return render()}
  if(d.qbsubha){const d0=qbD(qb().cur.id),B=sb();let i=B.list.findIndex(x=>x.t===d0.wird[0]);if(i<0){B.list.push({t:d0.wird[0],n:d0.wird[1]});i=B.list.length-1}B.cur=i;save();return go('subha')}
  if(d.qbretest){const c=qb().cur,dd=qbD(c.id);qbRetest={list:dd.q.map((q,k)=>({id:dd.id,k,q,n:dd.n})),i:0,ans:{}};return render()}
  if(d.qbres){qbShowRes=true;return render()}
  if(d.qbstop){qbStop=true;return render()}
  if(d.qbstopno){qbStop=false;return render()}
  if(d.qbstopyes){qb().cur=null;qbStop=false;save();return render()}
  if(d.khnew){khEdit=khNew(d.khnew);khEdit._new=true;khMsg='';return render()}
  if(d.khedit){const r=khList().find(x=>x.id===d.khedit);if(r){khEdit=JSON.parse(JSON.stringify(r));khMsg=''}return render()}
  if(d.khcancel){khEdit=null;khMsg='';return render()}
  if(d.khpadd){khReadForm();khEdit.p.push({d:0,t:'',x:''});return render()}
  if(d.khpdel!==undefined){khReadForm();khEdit.p.splice(+d.khpdel,1);return render()}
  if(d.khtpl){khReadForm();khEdit.p=khTemplate(khEdit);return render()}
  if(d.khsave){khReadForm();const R=khEdit;if(!R.s||!R.e||khMs(R.e)<=khMs(R.s)){khMsg='تأكد أن النهاية بعد البداية.';return render()}
    R.p=R.p.filter(p=>p.t&&p.x);delete R._new;const L=khList(),i=L.findIndex(x=>x.id===R.id);if(i>=0)L[i]=R;else L.push(R);khEdit=null;khMsg='حُفظ البرنامج.';save();pushSync();setTimeout(()=>{khMsg='';if(screen==='khalwa')render()},3000);return render()}
  if(d.khdel){khDel=d.khdel;return render()}
  if(d.khdelno){khDel=null;return render()}
  if(d.khdelyes){S.khal=khList().filter(x=>x.id!==d.khdelyes);khDel=null;save();pushSync();return render()}
  if(d.khlog){const r=khList().find(x=>x.id===d.khlog);if(r){r.logged=true;S.marks.khalwa.push({ts:Math.min(Date.now(),khMs(r.e)),type:r.type})}save();return render()}
  if(d.amview){S.amView=d.amview;save();return render()}
  if(d.sbmore){sbMore();return}
  if(d.sbtap){sndInit();sbTick();return}
  if(d.sbpick!==undefined){sb().cur=+d.sbpick;sbReset=false;save();return render()}
  if(d.sbadd){sbAdd=!sbAdd;render();if(sbAdd)setTimeout(()=>{const t=document.getElementById('sbT');t&&t.focus()},50);return}
  if(d.sbcancel){sbAdd=false;return render()}
  if(d.sbsave){const t=(document.getElementById('sbT').value||'').trim(),n=Math.max(0,parseInt(document.getElementById('sbN').value,10)||0);if(!t)return;const B=sb();B.list.push({t,n});B.cur=B.list.length-1;sbAdd=false;save();return render()}
  if(d.sbundo){const B=sb(),T=B.day[TODAY];if(T[B.cur])T[B.cur]--;save();return render()}
  if(d.sbreset){sbReset=true;return render()}
  if(d.sbresetno){sbReset=false;return render()}
  if(d.sbresetyes){const B=sb();delete B.day[TODAY][B.cur];sbReset=false;save();return render()}
  if(d.sbzero){sbZero=true;sbReset=false;return render()}
  if(d.sbzerono){sbZero=false;return render()}
  if(d.sbzeroyes){const B=sb();B.day[TODAY]={};B.cur=0;sbZero=false;save();return render()}
  if(d.sbedit){sbEdit=!sbEdit;return render()}
  if(d.sbup!==undefined){const B=sb(),k=+d.sbup;if(k>0){[B.list[k-1],B.list[k]]=[B.list[k],B.list[k-1]];const T=B.day[TODAY],a=T[k-1],b=T[k];if(b!==undefined)T[k-1]=b;else delete T[k-1];if(a!==undefined)T[k]=a;else delete T[k];if(B.cur===k)B.cur=k-1;else if(B.cur===k-1)B.cur=k}save();return render()}
  if(d.sbdel!==undefined){const B=sb(),k=+d.sbdel;if(B.list.length<2)return;B.list.splice(k,1);const T=B.day[TODAY],N={};Object.keys(T).forEach(x=>{x=+x;if(x<k)N[x]=T[x];else if(x>k)N[x-1]=T[x]});B.day[TODAY]=N;B.cur=Math.min(B.cur,B.list.length-1);save();return render()}
  if(d.mshopen){e.preventDefault();mshMsg='';mshBr=null;return go('mushaf')}
  if(d.mshauto!==undefined){mshAuto=d.mshauto==='1';mshRun=true;mshLast=0;mshEndAt=0;render();if(mshAuto){mshToTop();mshHold=performance.now()+800;if(!mshRaf)mshRaf=requestAnimationFrame(mshTick)}return}
  if(d.mshspd){const M=msh();M.spd=Math.max(1,Math.min(10,mshSpd()+(+d.mshspd)));save();const v=document.getElementById('mshSpdV');if(v)v.textContent=M.spd;return}
  if(d.mshplay){mshRun=!mshRun;mshLast=0;const b=document.getElementById('mshPlay');if(b)b.innerHTML=mshRun?IC_PAUSE:IC_PLAY;return}
  if(d.mshgo){mshMsg='';return mushafGo(mshCP()+(+d.mshgo),+d.mshgo>0)}
  if(d.mshback){mshBr=null;mshMsg='';render();SCR().scrollTo(0,0);return}
  if(d.mshlast){const M=msh();mshMsg='';mshBr=S.mshLast!==M.p?S.mshLast:null;render();SCR().scrollTo(0,0);return}
  if(d.mshfocus){S.mshFocus=!S.mshFocus;document.body.classList.remove('msh-show');save();render();return}
  if(d.mshset){const M=msh();if(mshBr!=null)M.p=mshBr;mshBr=null;mshMsg='سيبدأ وردك اليومي من هذه الصفحة.';save();render();return}
  if(d.mshsur){mshSur=!mshSur;render();if(mshSur){const c=document.querySelector('.msh-sr[data-mshsura="'+suraAt(mshCP())+'"]');if(c){c.classList.add('cur');c.parentNode.scrollTop=c.offsetTop-c.parentNode.offsetTop-60}}return}
  if(d.qrcont){mshMsg='';mshBr=null;return go('mushaf')}
  if(d.mshsura!==undefined&&screen==='quran'){const s=SURAS[+d.mshsura];mshMsg='';mshSur=false;mshY=s[2]>.12?s[2]:null;mshBr=s[1];return go('mushaf')}
  if(d.mshsura!==undefined){const s=SURAS[+d.mshsura];mshSur=false;mshMsg='';mshY=s[2]>.12?s[2]:null;mshBr=s[1];render();SCR().scrollTo(0,0);return}
  if(d.mshjump){const hz=+document.getElementById('mshHz').value,th=+document.getElementById('mshTh').value;const i=QIDX.findIndex(x=>x[0]===hz&&x[3]===th);mshMsg='';if(i>=0){mshBr=i;render();SCR().scrollTo(0,0)}return}
  if(d.mshfat){mshMsg='';mshBr=0;render();SCR().scrollTo(0,0);return}
  if(d.mshwird){const M=msh();M.wird=+d.mshwird;if(!M.day.done&&M.day.read.length>=M.wird){M.day.done=true;applyWird('quran',true)}save();return render()}
  if(d.mshq){msh().orig=d.mshq==='orig';save();return render()}
  if(d.mshdl){if(!(mshDl&&mshDl.on))mushafDownload();return}
  if(d.umstep!==undefined){S.umStep=+d.umstep;save();render();const c=document.querySelector('.um-dots');SCR().scrollTo({top:c?c.getBoundingClientRect().top+SCR().scrollTop-20:0});return}
  if(d.amslot){amOpen.has(d.amslot)?amOpen.delete(d.amslot):amOpen.add(d.amslot);const y=SCR().scrollTop;render();SCR().scrollTo(0,y);return}
  if(d.ampickopen){amPickOpen=!amPickOpen;render();return}
  if(d.ampickdone){amPickOpen=false;render();SCR().scrollTo(0,0);return}
  if(d.tzprep){tzPrepOpen=!tzPrepOpen;render();return}
  if(d.nafl){e.preventDefault();const L=aLog(),k=+d.nfn;L.nafl=L.nafl||{};if(L.nafl[d.nafl]===k)delete L.nafl[d.nafl];else L.nafl[d.nafl]=k;save();const y=SCR().scrollTop;render();SCR().scrollTo(0,y);return}
  if(d.masjid){e.preventDefault();const L=aLog(),k=d.masjid;L.masjid=L.masjid||[];if(L.masjid.includes(k))L.masjid=L.masjid.filter(x=>x!==k);else{L.masjid.push(k);if(!(L.prayers||[]).includes(k))setPrayer(k)}save();const y=SCR().scrollTop;render();SCR().scrollTo(0,y);return}
  if(d.pray){e.preventDefault();setPrayer(d.pray);khAfterPray(d.pray);const y=SCR().scrollTop;render();SCR().scrollTo(0,y);return}
  if(d.go){if(d.cityfocus)aboutOpen.add('city');if(d.openacc)aboutOpen.add(d.openacc);go(d.go);const fx=d.openacc||(d.cityfocus?'city':'');if(fx){const el=document.querySelector('details[data-acc='+fx+']');if(el)setTimeout(()=>el.scrollIntoView({block:'start',behavior:'smooth'}),60)}return}
  if(d.prepstart){const P=prepState();P.status='active';P.start=TODAY;P.log={};save();return render()}
  if(d.prepok)return prepSet(d.prepok,'ok');
  if(d.prepfail){prepFail=d.prepfail;return render()}
  if(d.prepfailyes){const n=document.getElementById('prepnote-'+d.prepfailyes);return prepSet(d.prepfailyes,'fail',n?n.value:'')}
  if(d.prepno){prepFail=null;return render()}
  if(d.prepundo){const P=prepState();if(P.status==='done')P.status='active';return prepSet(d.prepundo,null)}
  if(d.prepredo){prepRedo=true;return render()}
  if(d.prepredono){prepRedo=false;return render()}
  if(d.prepredoyes){const P=prepState();(P.history=P.history||[]).push({date:TODAY,days:prepDays(),log:P.log});P.log={};P.status='active';P.start=TODAY;P.cycle=(P.cycle||1)+1;prepRedo=false;save();return render()}
  if(d.ok)return logOrgan(d.ok,true);
  if(d.slip){confirmFor=d.slip;return render()}
  if(d.slipyes){const n=document.getElementById('slipnote-'+d.slipyes);return logOrgan(d.slipyes,false,n?n.value:'')}
  if(d.slipno){confirmFor=null;return render()}
  if(d.start){if(activeOrgans().length>=MAX_ACTIVE){tzMsg='يمكنك تزكية جارحتين معًا على الأكثر. أتمم إحداهما ثم ابدأ غيرها.';render();setTimeout(()=>{tzMsg='';render()},4000);return}Object.assign(S.organs[d.start],{phase:'tathir',days:0,last:null,today:null,attempt:1,attemptStart:TODAY});orgBase(S.organs[d.start],'tathir');save();return render()}
  if(d.tzedit){tzEdit={id:d.tzedit,mode:d.mode};confirmFor=null;tzConf=null;return render()}
  if(d.tzeditno){tzEdit=null;return render()}
  if(d.tzdrop){orgDrop(d.tzdrop);tzEdit=null;save();return render()}
  if(d.tzswap){orgDrop(d.tzswap);orgTake(d.to);tzEdit=null;save();return render()}
  if(d.unpark){if(activeOrgans().length>=MAX_ACTIVE){tzMsg='يمكنك تزكية جارحتين معًا على الأكثر. ألغِ إحداهما أو بدّلها أولًا.';render();setTimeout(()=>{tzMsg='';render()},4000);return}orgTake(d.unpark);save();return render()}
  if(d.tanwirgo){const o=S.organs[d.tanwirgo];if(!o.ready)return;const st=d.when==='tomorrow'?addDays(TODAY,1):TODAY;
    Object.assign(o,{phase:'tanwir',days:0,ready:false,last:null,today:null,broken:false,attempt:1,attemptStart:st});o.base={d:st,ph:'tanwir',slips:(o.slips||[]).slice(),resets:o.resets||0,at:1};o.hist={};orgSim(o);save();return render()}
  if(d.redo){redoFor={id:d.redo,kind:d.kind};confirmFor=null;return render()}
  if(d.redono){redoFor=null;return render()}
  if(d.redoyes&&S.organs[d.redoyes].phase==='done'&&activeOrgans().length>=MAX_ACTIVE){tzMsg='يمكنك تزكية جارحتين معًا على الأكثر. أتمم إحداهما ثم جدّد هذه.';redoFor=null;render();setTimeout(()=>{tzMsg='';render()},4000);return}
  if(d.redoyes){const o=S.organs[d.redoyes],n=document.getElementById('redonote-'+d.redoyes),k=redoFor.kind;
    (o.history=o.history||[]).push({date:TODAY,kind:k,from:o.phase,day:o.days,reason:n?n.value.trim():''});
    Object.assign(o,{phase:k,days:0,last:null,today:null,broken:false,attempt:1,attemptStart:TODAY,cycle:(o.cycle||1)+1});orgBase(o,k);
    redoFor=null;save();return render()}
  if(d.adh!==undefined&&screen.startsWith('adh_')){const k=screen.slice(4),st=adhState(k),a=adhList(k)[+d.adh];
    if(st[+d.adh]<a.n){st[+d.adh]++;save();const y=SCR().scrollTop;render();SCR().scrollTo(0,y);
      if(st[+d.adh]>=a.n){const nx=document.querySelector('.adh:not(.full)');if(nx&&nx.getBoundingClientRect().top>window.innerHeight*.6)nx.scrollIntoView({behavior:'smooth',block:'center'})}}return}
  if(d.adhsize){adhSize=Math.max(16,Math.min(30,adhSize+2*(+d.adhsize)));try{localStorage.setItem('murshid-adh-size',adhSize)}catch(x){};const y=SCR().scrollTop;render();SCR().scrollTo(0,y);return}
  if(d.adhreset){const k=screen.slice(4);dayLog().ad[k]=adhList(k).map(()=>0);save();return render()}
  if(d.adhconfirm!==undefined){const k=screen.slice(4);applyWird(k,d.adhconfirm==='1');const y=SCR().scrollTop;render();SCR().scrollTo(0,y);return}
  if(d.dstart){if(run&&!run.done)return go('dhikr_run');return startRun()}
  if(d.dskip){run.i++;run.el=0;run.last=Date.now();run.paused=false;if(run.i>=run.list.length){run.done=true;run.i=run.list.length-1;run.el=run.list[run.i].ms;clearInterval(runTimer);soundEnd();keepAwake(false)}else soundStep();return render()}
  if(d.dend){stopRun();return go('aamal')}
  if(d.dconfirm){applyWird('dhikr',true);return render()}
  if(d.dladd){dlOpen=true;dlList().push({text:'',min:10});save();render();const n=document.querySelectorAll('[data-dlt]');n[n.length-1]&&n[n.length-1].focus();return}
  if(d.dldel!==undefined){dlList().splice(+d.dldel,1);save();return render()}
  if(d.dlup!==undefined||d.dldown!==undefined){const l=dlList(),i=+(d.dlup??d.dldown),j=d.dlup!==undefined?i-1:i+1;if(j<0||j>=l.length)return;[l[i],l[j]]=[l[j],l[i]];save();return render()}
  if(d.light)return setLight(d.light,true);
  if(d.unlight)return setLight(d.unlight,false);
  if(d.lightask){lightConfirm=d.lightask;return render()}
  if(d.lightno){lightConfirm=null;return render()}
  if(d.install&&installEvt){installEvt.prompt();installEvt.userChoice.finally(()=>{installEvt=null;render()});return}
  if(d.export){const code=JSON.stringify(S);
    navigator.clipboard.writeText(code).then(()=>{transferMsg='نُسخ رمز بياناتك. الصقه الآن في التطبيق المثبّت.';render()})
      .catch(()=>{const t=document.getElementById('importCode');t.value=code;t.select();transferMsg='!لم يُسمح بالنسخ التلقائي. الرمز محدّد في الخانة: انسخه يدويًا.';
        const m=document.createElement('p');m.className='logged bad';m.textContent=Tx(transferMsg.slice(1));t.after(m)});return}
  if(d.import){const t=document.getElementById('importCode');
    try{const v=JSON.parse(t.value.trim());if(!v||!v.organs||!v.log)throw 0;S=v;
      ORGANS.forEach(g=>{if(!S.organs[g.id])S.organs[g.id]=blankOrgan()});if(!S.marks)S.marks=emptyMarks();
      applyLoc();save();transferMsg='استُورِدت بياناتك بنجاح.'}catch(e){transferMsg='!الرمز غير صالح. انسخه كاملًا من النسخة الأخرى ثم أعد المحاولة.'}
    return render()}
  if(d.khundo){S.marks.khalwa.pop();save();return render()}
  if(d.lightyes){S.marks.khalwa.push({ts:Date.now(),type:d.lightyes});lightConfirm=null;save();return render()}
  if(d.heart){dayLog().heart=+d.heart;save();return render()}
  if(d.reset){confirmReset=true;return render()}
  if(d.resetno){confirmReset=false;return render()}
  if(d.geoloc){geoLocate();return}
  if(d.pushon1){pushEnable();return}
  if(d.pushoff){pushDisable();return}
  if(d.pushtest){pushTest();return}
  if(d.hudurtest){hudurTest();return}
  if(d.photodel){delete S.photo;save();return render()}
  if(d.resetyes){S=freshState(S.name);confirmReset=false;save();return render()}
});
function applyWird(w,on,D){if(on&&(!D||D===TODAY)&&!dayLog().awrad.includes(w))try{niyaEnd(w)}catch(e){}
  if(D&&D!==TODAY){const L=S.log[D]||(S.log[D]={awrad:[],heart:null,note:''}),M=S.marks;
    L.awrad=on?[...new Set([...L.awrad,w])]:L.awrad.filter(x=>x!==w);
    if(w==='quran'||w==='dhikr'){M[w]=M[w].filter(x=>ds(new Date(x))!==D);if(on)M[w].push(atH(D,21))}
    if(w==='sabah'||w==='masa'){if(on)M[w][D]=atH(D,w==='sabah'?8:19);else delete M[w][D]}
    save();return}
  const L=dayLog();
  L.awrad=on?[...new Set([...L.awrad,w])]:L.awrad.filter(x=>x!==w);
  const p=period(),M=S.marks;
  if((w==='sabah'||w==='masa')&&p.kind===w&&(p.key===nowStr()||w==='masa')){if(on)M[w][p.key]=Date.now();else delete M[w][p.key]}
  if(w==='quran'||w==='dhikr'){M[w]=M[w].filter(x=>ds(new Date(x))!==nowStr());if(on)M[w].push(Date.now())}
  save();
}
