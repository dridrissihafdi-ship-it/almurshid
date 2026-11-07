// Adds translations to src/i18n.json without touching the existing ones.
// Usage: node scripts/add-i18n.mjs file.json   — the file holds {"النص":["en","fr","es","ru","ur"], ...}
import fs from 'fs';
const P = new URL('../src/i18n.json', import.meta.url);
const cur = JSON.parse(fs.readFileSync(P, 'utf8'));
const add = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
let n = 0;
for (const [k, v] of Object.entries(add)) { if (!cur[k]) { cur[k] = v; n++; } }
fs.writeFileSync(P, '{\n' + Object.entries(cur).map(([a, b]) => JSON.stringify(a) + ':' + JSON.stringify(b)).join(',\n') + '\n}\n');
console.log('added', n, 'of', Object.keys(add).length);
