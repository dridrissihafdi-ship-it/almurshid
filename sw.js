const CACHE='murshid-1793311989',LIB='murshid-lib-v1',MEDIA='murshid-media-v1',QURAN='murshid-quran-v2';
const SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','maskable-512.png','apple-touch-icon.png','maiya.jpg','maiya-wide.jpg','madina.jpg','bg-tazkiya.jpg','bg-aamal.jpg','bg-taammulat.jpg','bg-ruhi.jpg','bg-quran.jpg','bg-method.jpg','bg-about.jpg','heart.webp','rays.webp','roadmap.webp','roadmap-s.webp'];
const SDK='https://www.gstatic.com/firebasejs/10.12.2/';
const LIBS=[SDK+'firebase-app.js',SDK+'firebase-auth.js',SDK+'firebase-firestore.js',SDK+'firebase-messaging.js',
 'https://fonts.googleapis.com/css2?family=Readex+Pro:wght@300;400;500;600;700&family=Amiri&family=Amiri+Quran&display=swap'];
async function cacheMedia(){try{const c=await caches.open(MEDIA),u=new URL('hudur.mp3',self.registration.scope).href;if(!(await c.match(u))){const r=await fetch(u);if(r.ok)await c.put(u,r)}}catch(x){}}
async function cacheLibs(){try{const c=await caches.open(LIB);await Promise.all(LIBS.map(async l=>{if(await c.match(l))return;try{const r=await fetch(l,{mode:'cors'});if(r.ok)await c.put(l,r)}catch(x){}}))}catch(x){}}
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(cacheLibs).then(cacheMedia).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>![CACHE,LIB,MEDIA,QURAN].includes(k)).map(k=>caches.delete(k)))).then(()=>self.clients.claim()).then(cacheLibs))});
const pageFromCache=async()=>(await caches.match('index.html',{ignoreSearch:true}))||(await caches.match('./',{ignoreSearch:true}));
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(r.mode==='navigate'){ // fresh page when the network answers quickly; the saved copy when offline or the network is slow
    const net=fetch(r.url,{cache:'no-cache',credentials:'same-origin'}).then(res=>{if(res.ok){const c=res.clone();e.waitUntil(caches.open(CACHE).then(x=>x.put('index.html',c)))}return res});
    e.waitUntil(net.catch(()=>{}));
    e.respondWith((async()=>{const saved=await pageFromCache();if(!saved)return net;
      return Promise.race([net.then(res=>res.ok?res:saved,()=>saved),new Promise(ok=>setTimeout(()=>ok(saved),3500))])})());return}
  if(u.origin===location.origin&&/\/[qm]\d\d\.bin$/.test(u.pathname)){e.respondWith((async()=>{const c=await caches.open(QURAN),hit=await c.match(u.pathname);if(hit)return hit;
    const res=await fetch(r);if(res.ok)await c.put(u.pathname,res.clone());return res})());return}
  if(u.origin===location.origin&&(u.pathname.includes('/audio/')||u.pathname.includes('/video/')))return; // long lessons stream straight from the network
  if(u.origin===location.origin&&/\.(mp4|mp3)$/.test(u.pathname)){e.respondWith((async()=>{const c=await caches.open(MEDIA);let res=await c.match(u.href);
    if(!res){try{res=await fetch(u.href);if(res.status===200)await c.put(u.href,res.clone())}catch(x){return new Response('',{status:504})}}
    const range=r.headers.get('range');if(!range||res.status!==200)return res;
    const buf=await res.blob(),m=/bytes=(\d*)-(\d*)/.exec(range)||[],st=+m[1]||0,en=m[2]?Math.min(+m[2],buf.size-1):buf.size-1;
    return new Response(buf.slice(st,en+1),{status:206,headers:{'Content-Range':`bytes ${st}-${en}/${buf.size}`,'Content-Length':String(en-st+1),'Content-Type':res.headers.get('Content-Type')||'video/mp4','Accept-Ranges':'bytes'}})})());return}
  if(u.origin===location.origin||/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)||(u.hostname==='www.gstatic.com'&&u.pathname.startsWith('/firebasejs/'))){
    e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{if(res.ok||res.type==='opaque'){const c=res.clone();caches.open(u.origin===location.origin?CACHE:LIB).then(x=>x.put(r,c))}return res})))}
});

self.addEventListener('push',e=>{let d={};try{d=e.data?e.data.json():{}}catch(x){}
  const n=d.notification||{},v=d.data||d,tag=v.tag||'murshid',hud=tag==='murshid-hudur';
  const title=v.title||n.title||'المرشد',base={body:v.body||n.body||'',icon:'icon-192.png',tag,lang:'ar',dir:'rtl',data:{url:v.url||(hud?'./#hudur':'./')}};
  const ios=/iPhone|iPad|iPod|Macintosh/.test(self.navigator.userAgent||'');
  const rich=ios?base:Object.assign({badge:'icon-192.png'},base,hud?{image:v.image||'maiya-wide.jpg',renotify:true,vibrate:[200,120,200]}:{});
  e.waitUntil(self.registration.showNotification(title,rich).catch(()=>self.registration.showNotification(title,base)))});
self.addEventListener('notificationclick',e=>{e.notification.close();const url=(e.notification.data&&e.notification.data.url)||'./',hud=url.includes('#hudur');
  e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(ws=>{for(const w of ws){if('focus' in w){if(hud)w.postMessage({t:'hudur'});else if(url.includes('#muhasaba'))w.postMessage({t:'go',s:'muhasaba'});else if(url.includes('#khalwa'))w.postMessage({t:'go',s:'khalwa'});else if(url.includes('#qa='))w.postMessage({t:'qa',n:+url.split('#qa=')[1]});return w.focus()}}return clients.openWindow(url)}))});
