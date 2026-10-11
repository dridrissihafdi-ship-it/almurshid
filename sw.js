const CACHE='murshid-1791721790';
const SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','maskable-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(r.mode==='navigate'){ // network first for the page, so updates arrive; cache when offline
    e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(CACHE).then(x=>x.put('index.html',c));return res}).catch(()=>caches.match('index.html')));return}
  if(u.origin===location.origin||/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)||(u.hostname==='www.gstatic.com'&&u.pathname.startsWith('/firebasejs/'))){
    e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{if(res.ok||res.type==='opaque'){const c=res.clone();caches.open(CACHE).then(x=>x.put(r,c))}return res})))}
});

self.addEventListener('push',e=>{let d={};try{d=e.data?e.data.json():{}}catch(x){}
  const n=d.notification||{},v=d.data||d;
  e.waitUntil(self.registration.showNotification(v.title||n.title||'المرشد',{body:v.body||n.body||'',icon:'icon-192.png',badge:'icon-192.png',tag:v.tag||'murshid',lang:'ar',dir:'rtl',data:{url:v.url||'./'}}))});
self.addEventListener('notificationclick',e=>{e.notification.close();const url=(e.notification.data&&e.notification.data.url)||'./';
  e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(ws=>{for(const w of ws){if('focus' in w)return w.focus()}return clients.openWindow(url)}))});
