// Builds the app from src/ into dist/ (index.html, sw.js, i18n.json).
// The files in src/css and src/js are joined in the order of their names, exactly as written,
// so moving code between files never changes what the browser runs.
// Usage: node scripts/build.mjs [--stamp=VALUE]   (VALUE replaces the build time; used by tests)
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { execFileSync } from 'child_process';
import os from 'os';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SRC = path.join(ROOT, 'src'), OUT = path.join(ROOT, 'dist');
const arg = (k) => (process.argv.find((a) => a.startsWith('--' + k + '=')) || '').split('=').slice(1).join('=');

const fail = (msg) => { console.error('::error::' + msg); process.exit(1); };
const read = (p) => fs.readFileSync(path.join(SRC, p), 'utf8');
const list = (dir, ext) => fs.readdirSync(path.join(SRC, dir)).filter((f) => f.endsWith(ext)).sort();

/* build time in Morocco, e.g. 2026-11-07 10:15 */
function stampNow() {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Casablanca', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })
    .formatToParts(new Date()).map((x) => [x.type, x.value]));
  return `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}`;
}
const STAMP = arg('stamp') || stampNow();
const CACHE = arg('cache') || String(Math.floor(Date.now() / 1000));

/* ---- join the parts ---- */
const cssFiles = list('css', '.css'), jsFiles = list('js', '.js');
const css = cssFiles.map((f) => read('css/' + f)).join('');
const parts = jsFiles.map((f) => ({ f, t: read('js/' + f) }));
const js = parts.map((p) => p.t).join('');
const firebase = read('firebase.js');

/* ---- check the code before anything is written ---- */
function where(line) {
  let n = 1;
  for (const p of parts) {
    const lines = p.t.split('\n').length - 1;
    if (line < n + lines + 1) return `src/js/${p.f}, line ${line - n + 1}`;
    n += lines;
  }
  return 'line ' + line;
}
try {
  new vm.Script(js, { filename: 'app.js' });
} catch (e) {
  const m = /app\.js:(\d+)/.exec(e.stack || '');
  fail(`Syntax error in ${m ? where(+m[1]) : 'the app code'}: ${e.message}`);
}
const tmp = path.join(os.tmpdir(), 'murshid-firebase-check.mjs');
fs.writeFileSync(tmp, firebase);
try { execFileSync(process.execPath, ['--check', tmp], { stdio: 'pipe' }); }
catch (e) { fail('Syntax error in src/firebase.js: ' + String(e.stderr || e.message).split('\n').slice(0, 5).join(' ')); }

let i18n;
try { i18n = JSON.parse(read('i18n.json')); } catch (e) { fail('src/i18n.json is not valid JSON: ' + e.message); }
for (const [k, v] of Object.entries(i18n)) {
  if (!Array.isArray(v) || v.length < 4) fail(`src/i18n.json: the entry «${k}» needs [en, fr, es, ru, ur]`);
}

/* ---- assemble ---- */
let tpl = read('index.html');
for (const mark of ['/*@css*/', '/*@js*/', '/*@firebase*/']) if (!tpl.includes(mark)) fail('src/index.html lost the marker ' + mark);
let html = tpl.replace('/*@css*/', () => css).replace('/*@js*/', () => js).replace('/*@firebase*/', () => firebase);
if (!html.includes("const APP_VER='__BUILD__'")) fail("the code lost const APP_VER='__BUILD__'");
html = html.replace("const APP_VER='__BUILD__'", `const APP_VER='${STAMP}'`);
let sw = read('sw.js');
if (!sw.includes("const CACHE='murshid-__BUILD__'")) fail("src/sw.js lost const CACHE='murshid-__BUILD__'");
sw = sw.replace("const CACHE='murshid-__BUILD__'", `const CACHE='murshid-${CACHE}'`);
try { new vm.Script(sw, { filename: 'sw.js' }); } catch (e) { fail('Syntax error in src/sw.js: ' + e.message); }

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'index.html'), html);
fs.writeFileSync(path.join(OUT, 'sw.js'), sw);
fs.writeFileSync(path.join(OUT, 'i18n.json'), JSON.stringify(i18n));
const kb = (f) => Math.round(fs.statSync(path.join(OUT, f)).size / 1024) + ' KB';
console.log(`built ${STAMP}: index.html ${kb('index.html')} (${cssFiles.length} css + ${jsFiles.length} js files), sw.js, i18n.json ${kb('i18n.json')} (${Object.keys(i18n).length} entries)`);
