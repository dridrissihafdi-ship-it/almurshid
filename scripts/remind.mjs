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
  // Morocco (Ministry of Habous tables): Maghrib is 5 minutes after the computed sunset
  if (lat >= 20.5 && lat <= 36.2 && lng >= -17.6 && lng <= -0.9) out.maghrib += 5 / 60;
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
const URL_APP = 'https://dridrissihafdi-ship-it.github.io/almurshid/', URL_OLD = URL_APP;
/* the 200 questions (qa.json, published with the app): one after Fajr, one after Isha */
let QA = null;
for (const base of [URL_APP, URL_OLD]) { try { QA = await (await fetch(base + 'qa.json', {cache: 'no-store'})).json(); break; } catch (e) { console.warn('qa.json', base, e.message); } }
const QA_T = {ar: 'سؤال اليوم · الطريق إلى رضوان الله', en: 'Question of the day', fr: 'Question du jour', es: 'Pregunta del día', ru: 'Вопрос дня'};
const qaIdx = date => { const x = Date.parse(date + 'T00:00:00Z') / 864e5; const N = QA ? QA.qa.length : 200; return [(x * 2) % N, (x * 2 + 1) % N]; };

const now = new Date();
/* Firestore sometimes answers slowly or drops a request: try again before giving up */
async function retry(fn, label, tries = 4) {
  for (let i = 1; ; i++) {
    try { return await fn(); }
    catch (e) { if (i >= tries) throw e; console.warn(`${label}: attempt ${i} failed (${e.code || e.message}), retrying`); await new Promise(r => setTimeout(r, 4000 * i)); }
  }
}
const snap = await retry(() => db.collection('push').get(), 'read users');
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
  // question & answer: 15 min after Fajr and 30 min after Isha (on unless turned off)
  if (QA && on.qa !== false && u.token) {
    const [iM, iE] = qaIdx(L.date);
    for (const [k, a, b, n] of [['qa1', pt.fajr + 15 / 60, pt.fajr + 2, iM], ['qa2', pt.isha + 30 / 60, Math.min(pt.isha + 2.5, 24), iE]]) {
      if (last[k] === L.date || !(L.h >= a && L.h < b)) continue;
      const item = QA.qa[n]; if (!item) continue;
      try {
        await fcm.send({token: u.token, data: {title: QA_T[u.lang] || QA_T.ar, body: (QA.tr && QA.tr[u.lang] && QA.tr[u.lang].qa[n] || [item[1]])[0], tag: 'murshid-' + k, url: URL_APP + '#qa=' + n},
          webpush: {headers: {TTL: '7200', Urgency: 'high'}}});
        upd['lastSent.' + k] = L.date; sent++;
      } catch (e) { console.warn(doc.id, k, e.errorInfo && e.errorInfo.code || e.code || ''); }
    }
  }
  // scheduled retreats (khalwa / i'tikaf): start, each programme item on time, end
  if (Array.isArray(u.kh) && u.kh.length && u.token) {
    const nowL = Date.UTC(L.y, L.m - 1, L.d) + L.h * 3600e3;          // "local time" on a UTC scale
    const P = v => { const [d, t] = String(v || '').split('T'), [y, m, dd] = d.split('-').map(Number), [h, mi] = (t || '0:0').split(':').map(Number); return Date.UTC(y, m - 1, dd, h || 0, mi || 0); };
    const sentKh = new Set(u.khSent || []), add = [];
    const KT = {ar: ['خلوة', 'اعتكاف'], en: ['Retreat', 'I‘tikaf'], fr: ['Retraite', 'I‘tikaf'], es: ['Retiro', 'I‘tikaf'], ru: ['Уединение', 'Итикаф']};
    const KS = {ar: ['بدأت الآن. اقطع عنك كل شاغل، واستحضر أن الله يراك.', 'انتهت. تقبّل الله منك، وسجّل إتمامها في التطبيق.'], en: ['It begins now. Leave every distraction.', 'It has ended. May God accept it.'], fr: ['Elle commence. Laissez toute distraction.', 'Elle est terminée. Que Dieu l’accepte.'], es: ['Empieza ahora. Deja toda distracción.', 'Ha terminado. Que Dios lo acepte.'], ru: ['Начинается. Оставьте всё отвлекающее.', 'Завершено. Да примет Бог.']};
    for (const r of u.kh) {
      const st = P(r.s), en = P(r.e); if (!(en > st)) continue;
      const nm = (KT[u.lang] || KT.ar)[r.type === 'itikaf' ? 1 : 0], ms = KS[u.lang] || KS.ar;
      const ev = [{at: st, key: r.id + ':s', body: ms[0]}, {at: en, key: r.id + ':e', body: ms[1]}];
      const d0 = Date.UTC(new Date(st).getUTCFullYear(), new Date(st).getUTCMonth(), new Date(st).getUTCDate()), nd = Math.ceil((en - d0) / 864e5);
      (r.p || []).forEach((p, i) => { const [h, mi] = String(p.t || '').split(':').map(Number); if (!isFinite(h)) return;
        const days = +p.d ? [+p.d - 1] : Array.from({length: nd}, (_, k) => k);
        for (const k of days) { const at = d0 + k * 864e5 + (h * 60 + (mi || 0)) * 6e4; if (at >= st && at <= en) ev.push({at, key: r.id + ':' + i + ':' + k, body: p.x}); } });
      for (const e of ev) {
        if (nowL < e.at || nowL >= e.at + 15 * 6e4 || sentKh.has(e.key)) continue;
        const hh = new Date(e.at), tm = String(hh.getUTCHours()).padStart(2, '0') + ':' + String(hh.getUTCMinutes()).padStart(2, '0');
        try {
          await fcm.send({token: u.token, data: {title: nm + ' · ' + tm, body: String(e.body || '').slice(0, 180), tag: 'murshid-kh-' + e.key, url: URL_APP + '#khalwa'},
            webpush: {headers: {TTL: '900', Urgency: 'high'}}});
          add.push(e.key); sent++;
        } catch (x) { console.warn(doc.id, 'khalwa', x.errorInfo && x.errorInfo.code || x.code || ''); }
      }
    }
    if (add.length) upd.khSent = admin.firestore.FieldValue.arrayUnion(...add);
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
/* private messages the admin sent to one seeker: one notification per new message */
const INBOX_T = {ar: 'رسالة خاصة من الإدارة', en: 'A private message from the administration', fr: 'Un message privé de l’administration', es: 'Un mensaje privado de la administración', ru: 'Личное сообщение от администрации'};
try {
  const ib = await retry(() => db.collection('inbox').where('pushed', '==', false).limit(50).get(), 'inbox');
  for (const m of ib.docs) {
    const v = m.data(); let ok = false;
    try {
      const p = await db.collection('push').doc(v.uid).get(), u = p.exists ? p.data() : {};
      if (u.token) {
        await fcm.send({token: u.token, data: {title: INBOX_T[u.lang] || INBOX_T.ar, body: String(v.text || '').slice(0, 180), tag: 'murshid-inbox-' + m.id, url: URL_APP},
          webpush: {headers: {TTL: '86400', Urgency: 'high'}}});
        ok = true;
      }
    } catch (e) { console.warn('inbox', m.id, e.errorInfo && e.errorInfo.code || e.code || e.message); }
    await m.ref.update({pushed: true, pushOk: ok});
  }
  if (ib.size) console.log(`private messages: ${ib.size}`);
} catch (e) { console.warn('inbox', e.message); }
/* profiles the admin deleted in the app: remove the sign-in account and every remaining record */
try {
  const dq = await db.collection('deletions').limit(20).get();
  for (const r of dq.docs) {
    const uid = r.data().uid || r.id;
    try { await admin.auth().deleteUser(uid); } catch (e) { if (e.code !== 'auth/user-not-found') console.warn('delete account', uid, e.code); }
    for (const c of ['users', 'progress', 'push']) { try { await db.collection(c).doc(uid).delete(); } catch (e) {} }
    try { const ib = await db.collection('inbox').where('uid', '==', uid).get(); for (const x of ib.docs) await x.ref.delete(); } catch (e) {}
    await r.ref.delete(); console.log('deleted profile', uid);
  }
} catch (e) { console.warn('deletions', e.message); }
