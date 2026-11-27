(() => {
  'use strict';

  const app = document.getElementById('app');
  const collator = new Intl.Collator('ko', { numeric: true, sensitivity: 'base' });
  const BASE_URL = new URL('.', location.href);
  const BASE_PATH = decodeURIComponent(BASE_URL.pathname);
  const RECENT_KEY = 'study:recent';
  const POS_KEY = 'study:pos:';

  let files = [];
  let byPath = new Map();
  let tree = null;
  let generated = null;
  let query = '';
  let queryDir = null;
  let docView = null;

  // ── 아이콘 ──
  const svg = (d) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const ICON = {
    back: svg('<path d="M19 12H5M12 19l-7-7 7-7"/>'),
    prev: svg('<path d="M15 18l-6-6 6-6"/>'),
    next: svg('<path d="M9 18l6-6-6-6"/>'),
    open: svg('<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>'),
    folder: svg('<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>'),
    file: svg('<path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z"/><path d="M14 3v5h5"/>'),
  };

  // ── 유틸 ──
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const enc = (p) => p.split('/').map(encodeURIComponent).join('/');
  const dirOf = (p) => (p.includes('/') ? p.slice(0, p.lastIndexOf('/')) : '');
  const baseName = (p) => p.slice(p.lastIndexOf('/') + 1);
  const displayName = (p) => baseName(p).replace(/\.html?$/i, '').replace(/_/g, ' ');
  const dirHref = (p) => (p ? `#/${enc(p)}/` : '#/');
  const fileHref = (p) => `#/${enc(p)}`;
  const fileUrl = (p) => new URL(enc(p), BASE_URL).href;
  const isHtml = (p) => /\.html?$/i.test(p);

  function fmtDate(iso) {
    const d = new Date(iso);
    if (isNaN(d)) return '';
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  }

  function store(key, value) {
    try { localStorage.setItem(key, value); } catch { /* 저장 공간 부족 등은 무시 */ }
  }

  function getRecent() {
    try { return JSON.parse(localStorage.getItem(RECENT_KEY)) || []; } catch { return []; }
  }

  function addRecent(path) {
    const list = [path, ...getRecent().filter((p) => p !== path)].slice(0, 20);
    store(RECENT_KEY, JSON.stringify(list));
  }

  // ── 폴더 트리 ──
  function buildTree(list) {
    const root = { name: '', path: '', dirs: new Map(), files: [], count: 0 };
    for (const f of list) {
      const parts = f.path.split('/');
      let node = root;
      node.count++;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!node.dirs.has(parts[i])) {
          node.dirs.set(parts[i], {
            name: parts[i],
            path: parts.slice(0, i + 1).join('/'),
            dirs: new Map(),
            files: [],
            count: 0,
          });
        }
        node = node.dirs.get(parts[i]);
        node.count++;
      }
      node.files.push(f);
    }
    (function sort(node) {
      node.files.sort((a, b) => collator.compare(baseName(a.path), baseName(b.path)));
      node.dirList = [...node.dirs.values()].sort((a, b) => collator.compare(a.name, b.name));
      node.dirList.forEach(sort);
    })(root);
    return root;
  }

  function findDir(path) {
    let node = tree;
    if (!path) return node;
    for (const part of path.split('/')) {
      node = node.dirs.get(part);
      if (!node) return null;
    }
    return node;
  }

  // ── 라우팅 ──
  function parseRoute() {
    const raw = location.hash.replace(/^#\/?/, '');
    try {
      return raw.split('/').map(decodeURIComponent).join('/');
    } catch {
      return raw;
    }
  }

  function route() {
    const r = parseRoute();
    if (isHtml(r)) showDoc(r);
    else showFolder(r.replace(/\/+$/, ''));
  }

  // ── 목록 화면 ──
  const label = (text) => `<div class="label">${esc(text)}</div>`;
  const list = (items) => `<div class="list">${items.join('')}</div>`;

  function dirItem(d) {
    return `<a class="item dir" href="${dirHref(d.path)}">${ICON.folder}
      <span class="txt"><span class="name">${esc(d.name)}</span></span>
      <span class="count">${d.count}</span></a>`;
  }

  function fileItem(f, { showDir = false, prefix = '' } = {}) {
    const meta = [];
    if (showDir && f.dir) meta.push(f.dir.slice(prefix.length).split('/').filter(Boolean).join(' › '));
    if (f.updated) meta.push(fmtDate(f.updated));
    return `<a class="item" href="${fileHref(f.path)}">${ICON.file}
      <span class="txt"><span class="name">${esc(f.name)}</span>
      ${meta.length ? `<span class="meta">${esc(meta.join(' · '))}</span>` : ''}</span></a>`;
  }

  function showFolder(path) {
    teardownDoc();
    const node = findDir(path);
    if (!node) {
      location.replace('#/');
      return;
    }
    if (queryDir !== path) query = '';
    queryDir = path;

    const isRoot = !path;
    document.title = isRoot ? 'Study' : `${node.name} · Study`;

    let crumbs = '';
    if (!isRoot) {
      const parts = path.split('/');
      const links = [`<a href="#/">홈</a>`];
      parts.slice(0, -1).forEach((part, i) => {
        links.push(`<a href="${dirHref(parts.slice(0, i + 1).join('/'))}">${esc(part)}</a>`);
      });
      links.push(`<span>${esc(node.name)}</span>`);
      crumbs = `<nav class="crumbs">${links.join('<span aria-hidden="true">›</span>')}</nav>`;
    }

    const sub = isRoot
      ? `문서 ${files.length}개${generated ? ` · ${fmtDate(generated)} 갱신` : ''}`
      : `문서 ${node.count}개`;

    app.innerHTML = `
      <header class="bar">
        ${isRoot ? '' : `<a class="icon" href="${dirHref(dirOf(path))}" aria-label="상위 폴더">${ICON.back}</a>`}
        <div class="title"><b>${esc(isRoot ? 'Study' : node.name)}</b><small>${esc(sub)}</small></div>
      </header>
      <main class="wrap">
        ${crumbs}
        <div class="search">
          <input type="search" enterkeyhint="search" autocomplete="off"
            placeholder="${esc(isRoot ? '전체 검색' : `'${node.name}'에서 검색`)}" value="${esc(query)}">
        </div>
        <div id="list"></div>
      </main>`;

    const input = app.querySelector('input');
    input.addEventListener('input', () => {
      query = input.value;
      renderList(node);
    });
    renderList(node);
    window.scrollTo(0, 0);
  }

  function renderList(node) {
    const el = document.getElementById('list');
    const q = query.trim().toLowerCase();

    if (q) {
      const terms = q.split(/\s+/);
      const prefix = node.path ? `${node.path}/` : '';
      const hits = files.filter((f) => f.path.startsWith(prefix) && terms.every((t) => f.key.includes(t)));
      el.innerHTML = hits.length
        ? label(`검색 결과 ${hits.length}개`) + list(hits.map((f) => fileItem(f, { showDir: true, prefix })))
        : `<div class="empty">검색 결과가 없습니다</div>`;
      return;
    }

    let html = '';
    if (!node.path) {
      const recent = getRecent().filter((p) => byPath.has(p)).slice(0, 5);
      if (recent.length) html += label('최근 본 문서') + list(recent.map((p) => fileItem(byPath.get(p), { showDir: true })));
    }
    if (node.dirList.length) html += label('폴더') + list(node.dirList.map(dirItem));
    if (node.files.length) html += label('문서') + list(node.files.map((f) => fileItem(f)));
    if (!html) html = `<div class="empty">HTML 문서가 없습니다</div>`;
    el.innerHTML = html;
  }

  // ── 문서 화면 ──
  function teardownDoc() {
    if (!docView) return;
    docView = null;
    document.body.classList.remove('doc');
  }

  function buildDocView() {
    app.innerHTML = `
      <div class="doc-view">
        <header class="bar">
          <a class="icon" data-k="up" aria-label="목록으로">${ICON.back}</a>
          <div class="title"><b></b><small></small></div>
          <a class="icon" data-k="prev" aria-label="이전 문서">${ICON.prev}</a>
          <a class="icon" data-k="next" aria-label="다음 문서">${ICON.next}</a>
          <a class="icon" data-k="open" target="_blank" rel="noopener" aria-label="새 탭에서 열기">${ICON.open}</a>
        </header>
        <iframe title="문서"></iframe>
      </div>`;
    document.body.classList.add('doc');
    const q = (k) => app.querySelector(`[data-k="${k}"]`);
    docView = {
      iframe: app.querySelector('iframe'),
      title: app.querySelector('.title b'),
      sub: app.querySelector('.title small'),
      up: q('up'),
      prev: q('prev'),
      next: q('next'),
      open: q('open'),
      current: null,
      loaded: null,
    };
    docView.iframe.addEventListener('load', onFrameLoad);
  }

  function setNav(a, f) {
    if (f) {
      a.href = fileHref(f.path);
      a.title = f.name;
      a.removeAttribute('aria-disabled');
    } else {
      a.removeAttribute('href');
      a.removeAttribute('title');
      a.setAttribute('aria-disabled', 'true');
    }
  }

  function updateDocHeader(f) {
    const v = docView;
    v.current = f.path;
    v.title.textContent = f.name;
    v.sub.textContent = f.dir ? f.dir.split('/').join(' › ') : '홈';
    v.up.href = dirHref(f.dir);
    v.open.href = fileUrl(f.path);
    const siblings = findDir(f.dir).files;
    const i = siblings.indexOf(f);
    setNav(v.prev, siblings[i - 1]);
    setNav(v.next, siblings[i + 1]);
    document.title = `${f.name} · Study`;
    addRecent(f.path);
  }

  function showDoc(path) {
    const f = byPath.get(path);
    if (!f) {
      teardownDoc();
      app.innerHTML = `
        <header class="bar">
          <a class="icon" href="#/" aria-label="홈">${ICON.back}</a>
          <div class="title"><b>문서를 찾을 수 없습니다</b><small>${esc(path)}</small></div>
        </header>
        <main class="wrap"><div class="empty">삭제되었거나 이름이 바뀐 문서입니다.<br><a href="#/" style="color:var(--accent)">홈으로</a></div></main>`;
      return;
    }
    if (!docView) buildDocView();
    updateDocHeader(f);
    if (docView.loaded !== path) {
      // location.replace는 iframe 쪽 히스토리를 쌓지 않아서 뒤로가기가 한 번에 동작함
      try {
        docView.iframe.contentWindow.location.replace(fileUrl(path));
      } catch {
        docView.iframe.src = fileUrl(path);
      }
    }
  }

  function onFrameLoad() {
    const v = docView;
    if (!v) return;
    let w, doc;
    try {
      w = v.iframe.contentWindow;
      doc = w.document;
      if (w.location.href === 'about:blank') return;
    } catch {
      v.loaded = null; // 외부 사이트로 이동한 경우
      return;
    }
    const pathname = decodeURIComponent(w.location.pathname);
    const rel = pathname.startsWith(BASE_PATH) ? pathname.slice(BASE_PATH.length) : null;
    v.loaded = rel;

    // 문서 안의 링크로 다른 문서로 이동한 경우 주소와 헤더를 맞춰줌
    if (rel && rel !== v.current && byPath.has(rel)) {
      history.replaceState(null, '', fileHref(rel));
      updateDocHeader(byPath.get(rel));
    }

    enhance(w, doc);
    if (rel) restoreScroll(w, rel);
  }

  // 원본 HTML을 건드리지 않는 선에서 모바일 가독성 보정
  const FIX_CSS = `
    html { -webkit-text-size-adjust: 100%; }
    body { overflow-wrap: break-word; }
    img, video { max-width: 100%; height: auto; }
    svg, canvas, iframe { max-width: 100%; }
    pre { max-width: 100%; overflow-x: auto; }
    .katex-display, mjx-container[display="true"], .MathJax_Display { max-width: 100%; overflow-x: auto; overflow-y: hidden; }
    .__sv-x { max-width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; }
  `;

  function enhance(w, doc) {
    if (!doc.getElementById('__sv-style')) {
      const style = doc.createElement('style');
      style.id = '__sv-style';
      style.textContent = FIX_CSS;
      (doc.head || doc.documentElement).appendChild(style);

      // 외부 링크는 새 탭으로 (iframe 안에서는 대부분 차단됨)
      doc.addEventListener('click', (e) => {
        const a = e.target.closest && e.target.closest('a[href]');
        if (!a) return;
        try {
          if (new URL(a.href, doc.baseURI).origin !== location.origin) {
            a.target = '_blank';
            a.rel = 'noopener';
          }
        } catch { /* 잘못된 URL은 무시 */ }
      }, true);
    }

    // 화면을 넘치는 표만 가로 스크롤 박스로 감싸기
    const vw = doc.documentElement.clientWidth;
    if (doc.documentElement.scrollWidth > vw + 1) {
      doc.querySelectorAll('table').forEach((t) => {
        if (t.closest('.__sv-x') || t.getBoundingClientRect().right <= vw + 1) return;
        const box = doc.createElement('div');
        box.className = '__sv-x';
        t.before(box);
        box.append(t);
      });
    }
  }

  function restoreScroll(w, rel) {
    const key = POS_KEY + rel;
    const y = Number(localStorage.getItem(key)) || 0;
    if (y > 0 && !w.location.hash) {
      w.scrollTo(0, y);
      // 수식 렌더링 등으로 높이가 늦게 바뀌는 경우 한 번 더
      setTimeout(() => {
        if (w.scrollY < 50) w.scrollTo(0, y);
      }, 400);
    }
    let timer;
    w.addEventListener('scroll', () => {
      clearTimeout(timer);
      timer = setTimeout(() => store(key, String(Math.round(w.scrollY))), 250);
    }, { passive: true });
  }

  // 데스크톱: ← → 키로 이전/다음 문서
  document.addEventListener('keydown', (e) => {
    if (!docView || e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.target.closest && e.target.closest('input, textarea')) return;
    const a = e.key === 'ArrowLeft' ? docView.prev : e.key === 'ArrowRight' ? docView.next : null;
    if (a && a.href) location.hash = a.getAttribute('href');
  });

  // ── 시작 ──
  async function init() {
    try {
      const res = await fetch('files.json', { cache: 'no-cache' });
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      files = data.files || [];
      generated = data.generated || null;
    } catch {
      app.innerHTML = `<main class="wrap"><div class="empty">
        files.json을 불러오지 못했습니다.<br>
        로컬에서는 <code>node scripts/build-manifest.mjs</code>를 먼저 실행하세요.</div></main>`;
      return;
    }
    for (const f of files) {
      f.name = displayName(f.path);
      f.dir = dirOf(f.path);
      f.key = `${f.name} ${f.title || ''} ${f.path}`.toLowerCase();
      byPath.set(f.path, f);
    }
    tree = buildTree(files);
    addEventListener('hashchange', route);
    route();
  }

  init();
})();
