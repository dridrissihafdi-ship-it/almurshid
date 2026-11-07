/* ---------- illustration library: faceless, warm watercolor-flat style (viewBox 320x200) ---------- */
const ILC={sand:'#f4ecdd',sand2:'#ead9bd',ink:'#2A201A',teal:'#265661',teal2:'#3d7a85',gold:'#c9a24a',gold2:'#E6C891',green:'#5BAE84',green2:'#3f8f68',rose:'#F08A7A',red:'#c8553d',sky1:'#f7e7cc',sky2:'#e9c99a',night1:'#1d2a3a',night2:'#3a4a63',robe:'#f6f1e8',robe2:'#d9cfbf',skin:'#d6a77a'};
/* soft background: sky gradient + ground + paper grain */
function ilBg(id,k){const C=ILC;
  const sky=k==='night'?[C.night1,C.night2]:k==='dawn'?['#f3d9b8','#e7b48a']:[C.sky1,C.sky2];
  return `<defs><linearGradient id="${id}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset="1" stop-color="${sky[1]}"/></linearGradient>
   <radialGradient id="${id}g" cx=".5" cy=".4" r=".6"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
   <rect width="320" height="200" rx="18" fill="url(#${id}s)"/><ellipse cx="160" cy="80" rx="150" ry="90" fill="url(#${id}g)"/>`}
const ilGround=(c,y)=>`<path d="M0 ${y||162}C60 ${(y||162)-8} 110 ${(y||162)+4} 170 ${(y||162)-3}S280 ${(y||162)-9} 320 ${(y||162)-2}V200H0z" fill="${c||ILC.sand2}"/>`;
const ilClip=id=>`<clipPath id="${id}c"><rect width="320" height="200" rx="18"/></clipPath>`;
/* faceless figure. pose: stand | takbir | ruku | sujud | sit | dua | look (head up) | bow (head down) | sit_phone */
function ilFig(x,y,s,pose,c,c2){c=c||ILC.robe;c2=c2||ILC.robe2;const sk=ILC.skin;let b='';
  const head=(hx,hy)=>`<circle cx="${hx}" cy="${hy}" r="9" fill="${sk}"/><path d="M${hx-9.5} ${hy-1}a9.5 9.5 0 0 1 19 0c0-3-4-7-9.5-7s-9.5 4-9.5 7z" fill="${c2}"/>`;
  if(pose==='stand'||pose==='look'||pose==='bow'||pose==='proud'){const hy=pose==='look'||pose==='proud'?-74:pose==='bow'?-68:-71,hx=pose==='bow'?3:0;
    b=`<path d="M-15 0C-16-22-14-46-11-56C-8-62 8-62 11-56C14-46 16-22 15 0z" fill="${c}"/><path d="M0-58V0" stroke="${c2}" stroke-width="1.4" opacity=".7"/>
     <path d="M-11-54C-14-40-13-30-12-24M11-54C14-40 13-30 12-24" stroke="${c2}" stroke-width="5" stroke-linecap="round" fill="none"/>${head(hx,hy)}`;
    if(pose==='proud')b+=`<path d="M-11-54C-20-44-18-36-6-34M11-54C20-44 18-36 6-34" stroke="${c2}" stroke-width="5" stroke-linecap="round" fill="none"/>`}
  else if(pose==='takbir'){b=`<path d="M-15 0C-16-22-14-46-11-56C-8-62 8-62 11-56C14-46 16-22 15 0z" fill="${c}"/>
     <path d="M-10-54C-19-58-20-66-17-74M10-54C19-58 20-66 17-74" stroke="${c2}" stroke-width="5" stroke-linecap="round" fill="none"/><ellipse cx="-17" cy="-77" rx="3.2" ry="4.5" fill="${sk}"/><ellipse cx="17" cy="-77" rx="3.2" ry="4.5" fill="${sk}"/>${head(0,-71)}`}
  else if(pose==='dua'){b=`<path d="M-15 0C-16-22-14-46-11-56C-8-62 8-62 11-56C14-46 16-22 15 0z" fill="${c}"/>
     <path d="M-10-52C-14-44-10-38-3-38M10-52C14-44 10-38 3-38" stroke="${c2}" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M-7-40q7 6 14 0" stroke="${sk}" stroke-width="5" stroke-linecap="round" fill="none"/>${head(0,-71)}`}
  else if(pose==='ruku'){b=`<path d="M-9 0L-7-34H9L11 0z" fill="${c}"/><path d="M-9-28C-12-40-4-46 6-46H34C40-46 40-36 34-35H4C-2-34-6-30-9-28z" fill="${c}"/>
     <path d="M30-40C24-30 14-22 6-18" stroke="${c2}" stroke-width="5" stroke-linecap="round" fill="none"/><circle cx="5" cy="-17" r="3" fill="${sk}"/>${head(45,-40)}`}
  else if(pose==='sujud'){b=`<path d="M-26 0C-30-8-28-22-18-24C-6-26 10-20 22-10L28-2C24 0 0 1-26 0z" fill="${c}"/>
     <path d="M16-12L26-1" stroke="${c2}" stroke-width="5" stroke-linecap="round"/>${head(32,-6)}`}
  else if(pose==='sit'||pose==='sit_phone'||pose==='salam'||pose==='tash'){b=`<path d="M-20 0C-22-10-16-18-10-20C-12-30-10-44-8-50C-5-56 7-56 10-50C13-42 13-30 11-20C20-18 26-10 26 0z" fill="${c}"/>
     ${pose==='sit_phone'?`<path d="M-7-46C-10-34-2-28 6-30M9-46C12-36 10-30 6-30" stroke="${c2}" stroke-width="5" stroke-linecap="round" fill="none"/><rect x="2" y="-38" width="9" height="14" rx="2" fill="#1b1b22" transform="rotate(-20 6 -31)"/><rect x="3.5" y="-36.5" width="6" height="10" rx="1" fill="#9fd3ff" transform="rotate(-20 6 -31)"/>${head(4,-62)}`
      :`<path d="M-8-46C-12-30-6-22 2-22M10-46C14-30 10-22 4-22" stroke="${c2}" stroke-width="5" stroke-linecap="round" fill="none"/>${head(pose==='salam'?4:0,-64)}`}`}
  if(pose==='salam')b+=`<path d="M14-66q14-2 18 8" stroke="${ILC.gold}" stroke-width="2.4" fill="none" marker-end=""/><path d="M30-62l3 5 4-4" stroke="${ILC.gold}" stroke-width="2.4" fill="none"/>`;
  if(pose==='tash')b+=`<path d="M6-24v-10" stroke="${sk}" stroke-width="3" stroke-linecap="round"/>`;
  return `<g transform="translate(${x} ${y}) scale(${s})">${b}</g>`}
const ilStar=(x,y,r,o)=>`<path d="M${x} ${y-r}L${x+r*.28} ${y-r*.28}L${x+r} ${y}L${x+r*.28} ${y+r*.28}L${x} ${y+r}L${x-r*.28} ${y+r*.28}L${x-r} ${y}L${x-r*.28} ${y-r*.28}z" fill="#fff6dc" opacity="${o||.9}"/>`;
const ilMoon=(x,y,r)=>`<path d="M${x} ${y-r}a${r} ${r} 0 1 0 ${r*.9} ${r*1.55}a${r*.8} ${r*.8} 0 1 1-${r*.9}-${r*1.55}z" fill="#f6e3a8"/>`;
const ilHeart=(x,y,s,c,extra)=>`<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 18C-18 6-26-4-26-14a13 13 0 0 1 26-5 13 13 0 0 1 26 5C26-4 18 6 0 18z" fill="${c}"/>${extra||''}</g>`;
const ilMat=(x,y,w,c)=>`<g transform="translate(${x} ${y})"><rect x="${-w/2}" y="-5" width="${w}" height="10" rx="2" fill="${c||ILC.red}"/><path d="M${-w/2+6} -2h${w-12}M${-w/2+6} 2h${w-12}" stroke="${ILC.gold2}" stroke-width="1" opacity=".8"/></g>`;
const ilKaaba=(x,y,s)=>`<g transform="translate(${x} ${y}) scale(${s||1})"><path d="M-22-40L0-46L22-40V0L0 4L-22 0z" fill="#1e1b1a"/><path d="M0-46V4" stroke="#000" opacity=".4"/><path d="M-22-31L0-36L22-31V-27L0-32L-22-27z" fill="${ILC.gold}"/></g>`;
const ilMosque=(x,y,s,c)=>`<g transform="translate(${x} ${y}) scale(${s||1})" fill="${c||ILC.teal}"><path d="M-30 0V-26H30V0z"/><path d="M-20-26a20 20 0 0 1 40 0z"/><path d="M0-48v8" stroke="${c||ILC.teal}" stroke-width="2"/><rect x="38" y="-56" width="8" height="56"/><path d="M37-56l5-9 5 9z"/><rect x="-6" y="-14" width="12" height="14" rx="6" fill="${ILC.gold2}"/></g>`;
const ilBook=(x,y,s,glow)=>`<g transform="translate(${x} ${y}) scale(${s||1})">${glow?`<circle cx="0" cy="-14" r="34" fill="${ILC.gold2}" opacity=".35"/>`:''}<path d="M0-6C-10-14-24-16-36-14V12C-24 10-10 12 0 20 10 12 24 10 36 12V-14C24-16 10-14 0-6z" fill="#fffaf0" stroke="${ILC.gold}" stroke-width="2"/><path d="M0-6V20" stroke="${ILC.gold}" stroke-width="2"/><path d="M-30-6h22M-30 0h22M-30 6h18M8-6h22M8 0h22M8 6h18" stroke="${ILC.teal2}" stroke-width="1.6" opacity=".55"/><path d="M-38 14C-24 12-10 14 0 22 10 14 24 12 38 14" stroke="${ILC.green2}" stroke-width="4" fill="none"/></g>`;
const ilTree=(x,y,s,stage,c)=>{stage=stage||3;c=c||ILC.green;let leaves='';const L=[[0,-62,26],[-22,-50,18],[22,-50,18],[-14,-74,16],[14,-74,16],[0,-88,15],[-30,-36,12],[30,-36,12]];
  for(let i=0;i<Math.min(L.length,stage*2);i++){const[a,b,r]=L[i];leaves+=`<circle cx="${a}" cy="${b}" r="${r}" fill="${c}" opacity="${.75+.03*i}"/>`}
  return `<g transform="translate(${x} ${y}) scale(${s||1})"><path d="M-4 0C-3-20-3-36 0-${20+stage*8}C3-36 3-20 4 0z" fill="#8a5a3a"/>${stage>1?`<path d="M0-30C-8-36-14-40-20-48M0-36C8-42 14-46 20-52" stroke="#8a5a3a" stroke-width="3" fill="none"/>`:''}${leaves}</g>`};
const ilDrop=(x,y,s,c)=>`<path transform="translate(${x} ${y}) scale(${s||1})" d="M0-20C6-11 10-5 10 1a10 10 0 0 1-20 0c0-6 4-12 10-21z" fill="${c||'#7cc4e4'}"/>`;
const ilWater=(x1,y1,x2,y2)=>`<path d="M${x1} ${y1}C${x1} ${(y1+y2)/2} ${x2} ${(y1+y2)/2} ${x2} ${y2}" stroke="#8fd0ee" stroke-width="7" stroke-linecap="round" fill="none" opacity=".85"/><path d="M${x1} ${y1}C${x1} ${(y1+y2)/2} ${x2} ${(y1+y2)/2} ${x2} ${y2}" stroke="#e6f7ff" stroke-width="2" stroke-linecap="round" fill="none"/>`;
const ilTap=(x,y)=>`<g transform="translate(${x} ${y})"><rect x="-26" y="-6" width="40" height="10" rx="4" fill="#9aa4ad"/><rect x="6" y="-2" width="10" height="16" rx="3" fill="#8b949c"/><circle cx="-14" cy="-10" r="5" fill="#b8c1c9"/></g>`;
const ilHand=(x,y,s,r,c)=>`<g transform="translate(${x} ${y}) rotate(${r||0}) scale(${s||1})"><path d="M-14 6C-18-2-16-14-10-16L-8-26C-7-30-2-30-2-26V-16L0-30C1-34 6-34 6-30L5-16 8-28C9-32 14-31 13-27L11-14 14-22C16-26 20-24 19-20L15-4C13 6 6 12-2 12-8 12-12 10-14 6z" fill="${c||ILC.skin}"/></g>`;

/* each illustration: k -> svg body (320x200) */
