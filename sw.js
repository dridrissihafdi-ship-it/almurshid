const CACHE='murshid-1791756372';
const SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','maskable-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(r.mode==='navigate'){ // network first for the page, so updates arrive; cache when offline
    e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(CACHE).then(x=>x.put('index.html',c));return res}).catch(()=>caches.match('index.html')));return}
  if(u.origin===location.origin&&/\.(mp4|mp3)$/.test(u.pathname)){e.respondWith((async()=>{const c=await caches.open(CACHE);let res=await c.match(u.href);
    if(!res){try{res=await fetch(u.href);if(res.status===200)await c.put(u.href,res.clone())}catch(x){return new Response('',{status:504})}}
    const range=r.headers.get('range');if(!range||res.status!==200)return res;
    const buf=await res.blob(),m=/bytes=(\d*)-(\d*)/.exec(range)||[],st=+m[1]||0,en=m[2]?Math.min(+m[2],buf.size-1):buf.size-1;
    return new Response(buf.slice(st,en+1),{status:206,headers:{'Content-Range':`bytes ${st}-${en}/${buf.size}`,'Content-Length':String(en-st+1),'Content-Type':res.headers.get('Content-Type')||'video/mp4','Accept-Ranges':'bytes'}})})());return}
  if(u.origin===location.origin||/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)||(u.hostname==='www.gstatic.com'&&u.pathname.startsWith('/firebasejs/'))){
    e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{if(res.ok||res.type==='opaque'){const c=res.clone();caches.open(CACHE).then(x=>x.put(r,c))}return res})))}
});

self.addEventListener('push',e=>{let d={};try{d=e.data?e.data.json():{}}catch(x){}
  const n=d.notification||{},v=d.data||d;
  e.waitUntil(self.registration.showNotification(v.title||n.title||'المرشد',{body:v.body||n.body||'',icon:'icon-192.png',badge:'icon-192.png',tag:v.tag||'murshid',lang:'ar',dir:'rtl',data:{url:v.url||'./'}}))});
self.addEventListener('notificationclick',e=>{e.notification.close();const url=(e.notification.data&&e.notification.data.url)||'./';
  e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(ws=>{for(const w of ws){if('focus' in w)return w.focus()}return clients.openWindow(url)}))});
