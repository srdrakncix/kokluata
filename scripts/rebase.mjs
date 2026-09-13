// GitHub Pages alt yol (ör. /kokluata) için dist içindeki mutlak yolları öne ekler.
// Astro kendi _astro/ varlıklarını base ile üretir; bu script bizim yazdığımız /img /fonts /models ve iç linkleri düzeltir.
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const base = (process.env.BASE_PATH || '/').replace(/\/$/, '');
if (!base) process.exit(0);

const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
const fix = (path) => (path.startsWith('/') && !path.startsWith('//') && !path.startsWith(base + '/') && path !== base ? base + path : path);

let n = 0;
for (const file of walk('dist')) {
  if (!/\.(html|css|js)$/.test(file)) continue;
  let s = readFileSync(file, 'utf8');
  const before = s;
  // href="/x" src="/x" content="/x" action="/x"
  s = s.replace(/((?:href|src|content|action)=)(["'])([^"']*)\2/g, (m, k, q, v) => `${k}${q}${fix(v)}${q}`);
  // css url(/x)
  s = s.replace(/url\((["']?)([^"')]+)\1\)/g, (m, q, v) => `url(${q}${fix(v)}${q})`);
  // js string literals for our public assets
  s = s.replace(/(["'`])\/(img|fonts|models)\//g, (m, q, d) => `${q}${base}/${d}/`);
  if (s !== before) { writeFileSync(file, s); n++; }
}
console.log(`rebase: ${n} dosya ${base}/ altına taşındı`);
