// 저장소 안의 모든 HTML 파일을 찾아 files.json으로 정리한다.
// 사용법: node scripts/build-manifest.mjs
import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SKIP_ROOT_DIRS = new Set(['app', 'scripts', 'node_modules']);
const SKIP_ROOT_FILES = new Set(['index.html', '404.html']);

async function walk(dir, rel = '') {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.')) continue;
    const r = rel ? `${rel}/${e.name}` : e.name;
    if (e.isDirectory()) {
      if (!rel && SKIP_ROOT_DIRS.has(e.name)) continue;
      out.push(...(await walk(path.join(dir, e.name), r)));
    } else if (/\.html?$/i.test(e.name) && !(!rel && SKIP_ROOT_FILES.has(e.name))) {
      out.push(r);
    }
  }
  return out;
}

// 파일별 마지막 커밋 시각 (git log 한 번으로 전부 계산)
function gitDates() {
  const map = new Map();
  try {
    const log = execFileSync(
      'git',
      ['-c', 'core.quotepath=false', 'log', '--format=%x00%cI', '--name-only', '--', '*.html', '*.htm'],
      { cwd: ROOT, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] },
    );
    for (const chunk of log.split('\0')) {
      const lines = chunk.split('\n').map((l) => l.trim()).filter(Boolean);
      const date = lines.shift();
      for (const file of lines) if (!map.has(file)) map.set(file, date);
    }
  } catch {
    // git이 없으면 파일 수정 시각을 사용
  }
  return map;
}

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
function extractTitle(html) {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!m) return '';
  return m[1]
    .replace(/&(#x?[0-9a-f]+|\w+);/gi, (all, e) => {
      if (e[0] === '#') return String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
      return ENTITIES[e.toLowerCase()] ?? all;
    })
    .replace(/\s+/g, ' ')
    .trim();
}

const paths = await walk(ROOT);
const dates = gitDates();
const files = [];
for (const p of paths) {
  const full = path.join(ROOT, p);
  const html = await readFile(full, 'utf8');
  const updated = dates.get(p) ?? (await stat(full)).mtime.toISOString();
  files.push({ path: p, title: extractTitle(html), updated });
}
files.sort((a, b) => a.path.localeCompare(b.path, 'ko', { numeric: true }));

await writeFile(
  path.join(ROOT, 'files.json'),
  JSON.stringify({ generated: new Date().toISOString(), files }, null, 1),
);
console.log(`files.json: HTML ${files.length}개`);
