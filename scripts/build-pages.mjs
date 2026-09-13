// GitHub Pages önizleme derlemesi: https://srdrakncix.github.io/kokluata/
import { spawnSync } from 'node:child_process';
const r = spawnSync('npm', ['run', 'build'], {
  stdio: 'inherit', shell: true,
  env: { ...process.env, BASE_PATH: '/kokluata', SITE_URL: 'https://srdrakncix.github.io' },
});
process.exit(r.status ?? 1);
