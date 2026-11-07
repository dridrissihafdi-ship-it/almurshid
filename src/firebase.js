
/* accounts & cloud save — Firebase (Auth + Firestore) */
const V='10.12.2',B='https://www.gstatic.com/firebasejs/'+V+'/';
const cfg={apiKey:"AIzaSyD4FjornbE6-8fOqugJn6YEhZrENXMB_cs",authDomain:"almurshid-64196.firebaseapp.com",projectId:"almurshid-64196",storageBucket:"almurshid-64196.firebasestorage.app",messagingSenderId:"525420006974",appId:"1:525420006974:web:b7357972bad9c4e4fa4b6f"};
let inFrame=false;try{inFrame=window.self!==window.top}catch(e){inFrame=true}
if(inFrame){window.onFbFail()}else(async()=>{
 try{
  const [A,U,F]=await Promise.all([import(B+'firebase-app.js'),import(B+'firebase-auth.js'),import(B+'firebase-firestore.js')]);
  const app=A.initializeApp(cfg),auth=U.getAuth(app),db=F.getFirestore(app);
  auth.languageCode=document.documentElement.lang||'ar';
  const gp=new U.GoogleAuthProvider();gp.setCustomParameters({prompt:'select_account'});
  const d=(...p)=>F.doc(db,...p);
  window.FB={
   signUp:async(email,pass,name)=>{const c=await U.createUserWithEmailAndPassword(auth,email,pass);
     try{await U.updateProfile(c.user,{displayName:name})}catch(e){}
     if(!/@example\.com$/i.test(email))try{await U.sendEmailVerification(c.user)}catch(e){}return c.user},
   signIn:(email,pass)=>U.signInWithEmailAndPassword(auth,email,pass),
   google:async()=>{try{await U.signInWithPopup(auth,gp)}catch(e){
     if(['auth/popup-blocked','auth/operation-not-supported-in-this-environment','auth/cancelled-popup-request'].includes(e.code))return U.signInWithRedirect(auth,gp);throw e}},
   reset:email=>{auth.languageCode=document.documentElement.lang||'ar';return U.sendPasswordResetEmail(auth,email)},
   signOut:()=>U.signOut(auth),
   resendVerify:()=>auth.currentUser&&U.sendEmailVerification(auth.currentUser),
   claims:async()=>{const r=await auth.currentUser.getIdTokenResult(true);return{email:r.claims.email,v:r.claims.email_verified,p:r.signInProvider}},
   reloadUser:async()=>{if(auth.currentUser){await U.reload(auth.currentUser);await auth.currentUser.getIdToken(true)}return auth.currentUser},
   deleteAccount:async()=>{const u=auth.currentUser;if(!u)return;
     await F.deleteDoc(d('progress',u.uid));await F.deleteDoc(d('users',u.uid));try{await F.deleteDoc(d('push',u.uid))}catch(e){}await U.deleteUser(u)},
   loadProgress:async uid=>{const s=await F.getDoc(d('progress',uid));return s.exists()?s.data():null},
   saveProgress:(uid,data,at)=>F.setDoc(d('progress',uid),{data,updatedAt:at}),
   touchUser:async(u,name,lang)=>{const r=d('users',u.uid),s=await F.getDoc(r);
     const v={email:u.email||'',name:name||'',lang:lang||'ar',lastSeen:F.serverTimestamp()};
     if(!s.exists())v.createdAt=F.serverTimestamp();
     else{const cut=new Date(Date.now()-62*864e5).toISOString().slice(0,10),old=Object.keys((s.data()||{}).days||{}).filter(k=>k<cut);if(old.length){v.days={};old.forEach(k=>v.days[k]=F.deleteField())}}
     return F.setDoc(r,v,{merge:true})},
   addTime:(uid,secs,day,scr)=>{const v={time:F.increment(secs),['days.'+day]:F.increment(secs)};Object.entries(scr||{}).forEach(([k,n])=>{if(n>0&&/^[\w-]+$/.test(k))v['scr.'+k]=F.increment(n)});return F.updateDoc(d('users',uid),v)},
   sendInbox:(uid,text)=>F.addDoc(F.collection(db,'inbox'),{uid,text,createdAt:F.serverTimestamp(),read:false,pushed:false}),
   inboxOf:async uid=>(await F.getDocs(F.query(F.collection(db,'inbox'),F.where('uid','==',uid)))).docs.map(x=>({id:x.id,...x.data()})).sort((a,b)=>((b.createdAt&&b.createdAt.seconds)||0)-((a.createdAt&&a.createdAt.seconds)||0)),
   readInbox:id=>F.updateDoc(d('inbox',id),{read:true}),
   delInbox:id=>F.deleteDoc(d('inbox',id)),
   setAName:(uid,aName)=>F.updateDoc(d('users',uid),{aName}),
   delProfile:async uid=>{await F.setDoc(d('deletions',uid),{uid,at:F.serverTimestamp()});for(const c of ['progress','push','users'])try{await F.deleteDoc(d(c,uid))}catch(e){}},
   addSeeker:async(email,name)=>{const a2=A.getApps().find(x=>x.name==='adder')||A.initializeApp(cfg,'adder'),au2=U.getAuth(a2),db2=F.getFirestore(a2);au2.languageCode='ar';
     const pw=Array.from(crypto.getRandomValues(new Uint8Array(18)),b=>('0'+b.toString(16)).slice(-2)).join('')+'Aa1!';
     const c=await U.createUserWithEmailAndPassword(au2,email,pw);try{await U.updateProfile(c.user,{displayName:name})}catch(e){}
     try{await F.setDoc(F.doc(db2,'users',c.user.uid),{email,name,lang:'ar',createdAt:F.serverTimestamp(),lastSeen:F.serverTimestamp()})}catch(e){}
     try{await U.sendPasswordResetEmail(au2,email)}catch(e){}await U.signOut(au2);return c.user.uid},
   loadContent:async()=>{const s=await F.getDoc(d('content','main'));return s.exists()?s.data():null},
   saveContent:patch=>F.setDoc(d('content','main'),patch,{merge:true}),
   enablePush:async(vapidKey)=>{const Mg=await import(B+'firebase-messaging.js');
     if(!(await Mg.isSupported()))throw{code:'push/unsupported'};
     const reg=await navigator.serviceWorker.ready,msg=Mg.getMessaging(app);
     const token=await Mg.getToken(msg,{vapidKey,serviceWorkerRegistration:reg});
     if(!window.__fbOnMsg){window.__fbOnMsg=1;Mg.onMessage(msg,p=>{const d=p.data||{};if(d.tag==='murshid-hudur'&&window.showHudur&&document.visibilityState==='visible'){window.showHudur();return}reg.showNotification(d.title||'المرشد',{body:d.body||'',icon:'icon-192.png',image:d.image||undefined,tag:d.tag||'murshid',lang:'ar',dir:'rtl',data:{url:d.url||'./'}})})}
     return token},
   savePush:(uid,v)=>F.setDoc(d('push',uid),v,{merge:true}),
   deletePush:uid=>F.deleteDoc(d('push',uid)),
   sendMessage:(u,text,name,lang)=>F.addDoc(F.collection(db,'messages'),{uid:u.uid,email:u.email||'',name:name||u.displayName||'',lang:lang||'ar',text,createdAt:F.serverTimestamp()}),
   listMessages:async()=>(await F.getDocs(F.query(F.collection(db,'messages'),F.orderBy('createdAt','desc'),F.limit(100)))).docs.map(x=>({id:x.id,...x.data()})),
   deleteMessage:id=>F.deleteDoc(d('messages',id)),
   askQ:(u,text,name,lang)=>F.addDoc(F.collection(db,'questions'),{uid:u.uid,email:u.email||'',name:name||u.displayName||'',lang:lang||'ar',text,createdAt:F.serverTimestamp()}),
   myQs:async uid=>(await F.getDocs(F.query(F.collection(db,'questions'),F.where('uid','==',uid)))).docs.map(x=>({id:x.id,...x.data()})),
   allQs:async()=>(await F.getDocs(F.query(F.collection(db,'questions'),F.orderBy('createdAt','desc'),F.limit(200)))).docs.map(x=>({id:x.id,...x.data()})),
   answerQ:(id,answer)=>F.updateDoc(d('questions',id),{answer,answeredAt:F.serverTimestamp()}),
   delQ:id=>F.deleteDoc(d('questions',id)),
   listUsers:async()=>(await F.getDocs(F.collection(db,'users'))).docs.map(x=>({id:x.id,...x.data()})),
   getEndorse:async uid=>{const s=await F.getDoc(d('endorse',uid));return s.exists()?s.data():null},
   setEndorse:(uid,v)=>F.setDoc(d('endorse',uid),{g1:!!v.g1,g2:!!v.g2,g3:!!v.g3,g4:!!v.g4,at:F.serverTimestamp()}),
   /* anonymous counters (see src/js/875-stats.js): +1 per key; milestones also add to stats/all */
   stat:(day,keys)=>{const v={},m={};keys.forEach(k=>{v[k]=F.increment(1);if(k.startsWith('m_'))m[k]=F.increment(1)});
     const b=F.writeBatch(db);b.set(d('stats','d-'+day),v,{merge:true});if(Object.keys(m).length)b.set(d('stats','all'),m,{merge:true});return b.commit()},
   statRead:async days=>{const R=await Promise.all([...days.map(k=>F.getDoc(d('stats','d-'+k)).then(s=>[k,s.exists()?s.data():{}])),F.getDoc(d('stats','all')).then(s=>['all',s.exists()?s.data():{}])]);return Object.fromEntries(R)},
   listEndorse:async()=>Object.fromEntries((await F.getDocs(F.collection(db,'endorse'))).docs.map(x=>[x.id,x.data()]))
  };
  U.getRedirectResult(auth).catch(e=>window.onAuthRedirectError&&window.onAuthRedirectError(e));
  U.onAuthStateChanged(auth,u=>window.onAuthUser(u));
 }catch(e){console.warn('firebase',e);window.onFbFail()}
})();
