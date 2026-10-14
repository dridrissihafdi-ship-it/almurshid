// Al-Murshid — sends phone reminders (morning adhkar, evening adhkar, nightly self-review).
// Runs every 15 minutes from GitHub Actions. Needs the secret FIREBASE_SA (service-account JSON).
import admin from 'firebase-admin';

admin.initializeApp({credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SA))});
const db = admin.firestore(), fcm = admin.messaging();

/* ---- prayer times (same method as the app: Fajr 19°, Isha 17°, Shafi'i Asr) ---- */
const rad = d => d * Math.PI / 180, deg = r => r * 180 / Math.PI;
const fix = (a, b) => { a = a - b * Math.floor(a / b); return a < 0 ? a + b : a; };
function sunPos(jd) {
  const D = jd - 2451545, g = fix(357.529 + 0.98560028 * D, 360), q = fix(280.459 + 0.98564736 * D, 360);
  const L = fix(q + 1.915 * Math.sin(rad(g)) + 0.02 * Math.sin(rad(2 * g)), 360), e = 23.439 - 0.00000036 * D;
  const RA = fix(deg(Math.atan2(Math.cos(rad(e)) * Math.sin(rad(L)), Math.cos(rad(L)))) / 15, 24);
  return {decl: deg(Math.asin(Math.sin(rad(e)) * Math.sin(rad(L)))), eqt: q / 15 - RA};
}
function prayerTimes(y, m, d, lat, lng, tz) {
  if (m <= 2) { y--; m += 12; }
  const A = Math.floor(y / 100), B = 2 - A + Math.floor(A / 4);
  const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5 - lng / (15 * 24);
  const noon = t => fix(12 - sunPos(jd + t).eqt, 24);
  const at = (angle, t, ccw) => { const s = sunPos(jd + t), n = noon(t);
    const T = deg(Math.acos((-Math.sin(rad(angle)) - Math.sin(rad(s.decl)) * Math.sin(rad(lat))) / (Math.cos(rad(s.decl)) * Math.cos(rad(lat))))) / 15;
    return n + (ccw ? -T : T); };
  const raw = {fajr: at(19, 5 / 24, 1), sunrise: at(0.833, 6 / 24, 1), maghrib: at(0.833, 18 / 24, 0), isha: at(17, 18 / 24, 0)};
  const night = 24 - (raw.maghrib - raw.sunrise);
  if (!isFinite(raw.fajr)) raw.fajr = raw.sunrise - night / 7;
  if (!isFinite(raw.isha)) raw.isha = raw.maghrib + night / 7;
  const out = {}; for (const k in raw) out[k] = fix(raw[k] + tz - lng / 15, 24);
  return out;
}
/* local date, hour and UTC offset of a time zone */
function local(tzName, now) {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', {timeZone: tzName, hourCycle: 'h23',
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'})
    .formatToParts(now).map(x => [x.type, x.value]));
  const y = +p.year, m = +p.month, d = +p.day, h = +p.hour + p.minute / 60 + p.second / 3600;
  const off = Math.round((Date.UTC(y, m - 1, d, +p.hour, +p.minute, +p.second) - now.getTime()) / 6e4) / 60;
  return {y, m, d, h, off, date: `${p.year}-${p.month}-${p.day}`};
}

function localOff(offMin, now) {
  const t = new Date(now.getTime() + offMin * 6e4), y = t.getUTCFullYear(), m = t.getUTCMonth() + 1, d = t.getUTCDate();
  const h = t.getUTCHours() + t.getUTCMinutes() / 60 + t.getUTCSeconds() / 3600, p = n => String(n).padStart(2, '0');
  return {y, m, d, h, off: offMin / 60, date: `${y}-${p(m)}-${p(d)}`};
}

const TXT = {
  sabah:    {ar: ['أذكار الصباح', 'حان وقت أذكار الصباح. أضئ هالتك لهذا اليوم ✦'], en: ['Morning adhkar', "It's time for the morning adhkar ✦"], fr: ['Adhkar du matin', "C'est l'heure des adhkar du matin ✦"], es: ['Adhkar de la mañana', 'Es la hora de los adhkar de la mañana ✦'], ru: ['Утренние азкары', 'Время утренних азкаров ✦']},
  masa:     {ar: ['أذكار المساء', 'حان وقت أذكار المساء ✦'], en: ['Evening adhkar', "It's time for the evening adhkar ✦"], fr: ['Adhkar du soir', "C'est l'heure des adhkar du soir ✦"], es: ['Adhkar de la tarde', 'Es la hora de los adhkar de la tarde ✦'], ru: ['Вечерние азкары', 'Время вечерних азкаров ✦']},
  hudur:    {ar: ['الحضور مع الله', '﴿وَهُوَ مَعَكُمْ أَيْنَمَا كُنتُمْ﴾ — توقّف لحظة واستحضر أن الله معك'], en: ['Presence with God', '“And He is with you wherever you are.” Pause and remember He is with you.'], fr: ['Présence avec Dieu', '« Et Il est avec vous où que vous soyez. » Arrêtez-vous un instant.'], es: ['Presencia con Dios', '«Y Él está con vosotros dondequiera que estéis.» Detente un momento.'], ru: ['Присутствие с Богом', '«Он с вами, где бы вы ни были». Остановитесь на миг.']},
  muhasaba: {ar: ['محاسبة اليوم', 'قبل النوم: سجّل يومك في التزكية، وحاسب نفسك.'], en: ['Daily self-review', 'Before sleep: log your day and review yourself.'], fr: ['Bilan du jour', 'Avant de dormir : enregistrez votre journée et faites votre bilan.'], es: ['Repaso del día', 'Antes de dormir: registra tu día y haz tu repaso.'], ru: ['Итог дня', 'Перед сном: отметьте день и подведите итог.']},
};
const URL_APP = 'https://dridrissihafdi-ship-it.github.io/almurshid/';

const now = new Date();
const snap = await db.collection('push').get();
let sent = 0, removed = 0;
for (const doc of snap.docs) {
  const u = doc.data();
  if (!u.token || !u.tz || !isFinite(u.lat) || !isFinite(u.lng)) continue;
  // the phone's own UTC offset wins: servers can carry outdated time-zone rules (Morocco moved to GMT)
  let L; try { L = Number.isFinite(u.off) ? localOff(u.off, now) : local(u.tz, now); } catch (e) { continue; }
  const pt = prayerTimes(L.y, L.m, L.d, u.lat, u.lng, L.off);
  const [bh, bm] = String(u.bed || '22:00').split(':').map(Number);
  const bed = (bh || 0) + (bm || 0) / 60;
  const win = {                                   // [from, to) in local hours
    sabah:    [pt.fajr + 20 / 60, pt.fajr + 3],
    masa:     [pt.maghrib - 15 / 60, pt.maghrib + 3],
    muhasaba: [bed, bed + 2],
  };
  const on = u.on || {}, last = u.lastSent || {}, upd = {};
  for (const k of ['sabah', 'masa', 'muhasaba']) {
    if (on[k] === false || last[k] === L.date) continue;
    const [a, b] = win[k];
    if (!(L.h >= a && L.h < b)) continue;
    const [title, body] = (TXT[k][u.lang] || TXT[k].ar);
    try {
      await fcm.send({token: u.token, data: {title, body, tag: 'murshid-' + k, url: URL_APP + (k === 'muhasaba' ? '#muhasaba' : '')},
        webpush: {headers: {TTL: '7200', Urgency: 'high'}}});
      upd['lastSent.' + k] = L.date; sent++;
    } catch (e) {
      const c = e.errorInfo && e.errorInfo.code || e.code || '';
      if (/registration-token-not-registered|invalid-registration-token|invalid-argument/.test(c)) {
        await doc.ref.update({token: admin.firestore.FieldValue.delete()}); removed++; break;
      }
      console.warn(doc.id, k, c);
    }
  }
  // hourly reminder of God's presence: on the hour, between the user's chosen hours (only if turned on)
  if (on.hudur === true) {
    const hh = v => { const [x, y] = String(v || '').split(':').map(Number); return isFinite(x) ? x + (y || 0) / 60 : NaN; };
    const H = Math.floor(L.h), mins = (L.h - H) * 60, key = L.date + ' ' + H;
    const from = isFinite(hh(u.hFrom)) ? hh(u.hFrom) : pt.fajr + 0.5, to = isFinite(hh(u.hTo)) ? hh(u.hTo) : bed;
    // inclusive of both ends; a range like 22:00 → 02:00 crosses midnight
    const awake = to >= from ? (H >= from && H <= to) : (H >= from || H <= to);
    if (mins < 15 && awake && last.hudur !== key && u.token) {
      const [title, body] = (TXT.hudur[u.lang] || TXT.hudur.ar);
      try {
        await fcm.send({token: u.token, data: {title, body, tag: 'murshid-hudur', url: URL_APP + '#hudur', image: URL_APP + 'maiya-wide.jpg'},
          webpush: {headers: {TTL: '900', Urgency: 'high'}}});
        upd['lastSent.hudur'] = key; sent++;
      } catch (e) { console.warn(doc.id, 'hudur', e.errorInfo && e.errorInfo.code || e.code || ''); }
    }
  }
  if (Object.keys(upd).length) await doc.ref.update(upd);
}
/* a message the admin wrote in the app ("إشعار على هواتف المستعملين"): sent once to everyone with reminders on */
try {
  const main = (await db.doc('content/main').get()).data() || {}, P = main.push;
  const stRef = db.doc('content/pushState'), st = (await stRef.get()).data() || {};
  if (P && P.id && P.title && P.text && st.lastId !== P.id && Date.now() - (P.at || 0) < 24 * 3600e3) {
    await stRef.set({lastId: P.id, at: Date.now()});            // mark first, so a slow run never sends twice
    let n = 0;
    for (const doc of snap.docs) {
      const u = doc.data(); if (!u.token) continue;
      try { await fcm.send({token: u.token, data: {title: P.title, body: P.text, tag: 'murshid-admin-' + P.id, url: URL_APP},
        webpush: {headers: {TTL: '86400', Urgency: 'high'}}}); n++; } catch (e) {}
    }
    console.log(`admin message "${P.title}" sent to ${n}`);
  }
} catch (e) { console.warn('admin push', e.message); }
console.log(`users: ${snap.size} · sent: ${sent} · removed tokens: ${removed}`);
