/* ═══════════════════════════════════════════════════════════════
   OutRed — core.js
   Shared utilities: Settings, TabCloak, PanicKey, Navbar, Footer
═══════════════════════════════════════════════════════════════ */

'use strict';

/* ── Settings Store ──────────────────────────────────────────── */
// Exposed on window so settings.js and other scripts can access it
window.OR = {
  get(key, fallback = null) {
    try {
      const v = localStorage.getItem('or_' + key);
      return v !== null ? JSON.parse(v) : fallback;
    } catch { return fallback; }
  },
  set(key, val) {
    try { localStorage.setItem('or_' + key, JSON.stringify(val)); } catch {}
  },
  del(key) {
    try { localStorage.removeItem('or_' + key); } catch {}
  }
};

/* ── Tab Cloak (runs immediately, before DOM ready) ──────────── */
(function applyTabCloak() {
  const title   = OR.get('cloak_title');
  const favicon = OR.get('cloak_favicon');
  if (title) document.title = title;
  if (favicon) {
    let el = document.getElementById('favicon');
    if (!el) {
      el = document.createElement('link');
      el.rel = 'shortcut icon';
      el.id  = 'favicon';
      document.head.appendChild(el);
    }
    el.href = favicon;
  }
})();

/* ── Panic Key ───────────────────────────────────────────────── */
(function setupPanicKey() {
  const key = OR.get('panic_key');
  const url = OR.get('panic_url', 'https://google.com');
  if (!key) return;
  document.addEventListener('keydown', (e) => {
    if (e.key === key) window.location.replace(url);
  });
})();

/* ── SVG Icons ───────────────────────────────────────────────── */
const Icons = {
  search:     `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>`,
  settings:   `<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`,
  discord:    `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.03.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>`,
  github:     `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`,
  play:       `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg>`,
  fullscreen: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>`,
  newtab:     `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
  share:      `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,
  games:      `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 12h4M8 10v4M15 12h.01M17.5 12h.01"/></svg>`,
  grid:       `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>`,
  bolt:       `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,
  x:          `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>`
};

/* ── Navbar ──────────────────────────────────────────────────── */
function buildNavbar() {
  const path = window.location.pathname;
  const active = (href) => {
    const clean = href.replace('.html', '');
    if (clean === '/' || clean === '/index') {
      return path === '/' || path === '/index.html' ? 'active' : '';
    }
    return path.startsWith(clean) ? 'active' : '';
  };

  const nav = document.createElement('nav');
  nav.className = 'navbar';
  nav.setAttribute('role', 'navigation');
  nav.setAttribute('aria-label', 'Main navigation');
  nav.innerHTML = `
    <div class="nav-inner">
      <a href="/" class="nav-logo" aria-label="OutRed Home">
        <span class="out">Out</span><span class="red">Red</span>
      </a>
      <div class="nav-links" role="menubar">
        <a href="/games.html" class="${active('/games.html')}" role="menuitem" style="display:inline-flex;align-items:center;gap:6px;">${Icons.games} Games</a>
      </div>
      <div class="nav-search" role="search">
        <span class="s-icon" aria-hidden="true">${Icons.search}</span>
        <input
          type="search" id="nav-search" autocomplete="off"
          placeholder="Search games…" aria-label="Search games"
        />
      </div>
      <div class="nav-actions">
        <a href="/settings/" class="nav-btn" title="Settings" aria-label="Settings">
          ${Icons.settings}
        </a>
        <button class="nav-btn nav-hamburger" id="nav-menu-toggle" aria-label="Menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
    <!-- Mobile nav drawer -->
    <div class="nav-mobile-drawer" id="nav-drawer" aria-hidden="true" style="
      display:none; position:absolute; top:100%; left:0; right:0;
      background:rgba(11,11,18,0.97); border-bottom:1px solid var(--border);
      backdrop-filter:blur(20px); padding:16px 28px 20px;
    ">
      <a href="/games.html" style="display:block;padding:10px 0;border-bottom:1px solid var(--border);font-weight:500;">Games</a>
      <a href="/settings/" style="display:block;padding:10px 0;font-weight:500;">Settings</a>
      <div style="margin-top:14px;position:relative;">
        <span style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--text-dim);">${Icons.search}</span>
        <input id="mobile-search" type="search" placeholder="Search games…"
          style="width:100%;background:var(--surface-2);border:1px solid var(--border);border-radius:var(--radius);padding:10px 16px 10px 38px;font-size:0.9rem;"
        />
      </div>
    </div>
  `;
  document.body.prepend(nav);

  // Search logic
  const searchNav    = document.getElementById('nav-search');
  const searchMobile = document.getElementById('mobile-search');
  const params       = new URLSearchParams(window.location.search);

  const doSearch = (val) => {
    if (val.trim()) window.location.href = `/games.html?q=${encodeURIComponent(val.trim())}`;
  };
  const onKey = (e) => { if (e.key === 'Enter') doSearch(e.target.value); };

  if (searchNav) {
    if (params.get('q')) searchNav.value = params.get('q');
    searchNav.addEventListener('keydown', onKey);
  }
  if (searchMobile) {
    searchMobile.addEventListener('keydown', onKey);
  }

  // Mobile drawer toggle
  const toggle = document.getElementById('nav-menu-toggle');
  const drawer = document.getElementById('nav-drawer');
  if (toggle && drawer) {
    toggle.addEventListener('click', () => {
      const open = drawer.style.display === 'block';
      drawer.style.display = open ? 'none' : 'block';
      drawer.setAttribute('aria-hidden', open ? 'true' : 'false');
      toggle.setAttribute('aria-expanded', open ? 'false' : 'true');
    });
  }
}

/* ── Footer ──────────────────────────────────────────────────── */
function buildFooter() {
  const footer = document.createElement('footer');
  footer.className = 'footer';
  footer.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="/" class="nav-logo"><span class="out">Out</span><span class="red">Red</span></a>
          <p>Hundreds of free browser games, zero downloads. Play instantly on any device.</p>
          <div class="footer-social">
            <a href="https://discord.gg/MUqwxXUHS7" target="_blank" rel="noopener" class="footer-social-btn" aria-label="Discord">${Icons.discord}</a>
            <a href="https://github.com/OutRed/v4" target="_blank" rel="noopener" class="footer-social-btn" aria-label="GitHub">${Icons.github}</a>
          </div>
        </div>
        <div class="footer-col">
          <h4>Play</h4>
          <a href="/games.html">All Games</a>
        </div>
        <div class="footer-col">
          <h4>Settings</h4>
          <a href="/settings/">General</a>
          <a href="/settings/appearance.html">Appearance</a>
          <a href="/settings/tabcloak.html">Tab Cloak</a>
          <a href="/settings/panickey.html">Panic Key</a>
        </div>
        <div class="footer-col">
          <h4>Community</h4>
          <a href="https://discord.gg/FB6NtPkfwY" target="_blank" rel="noopener">Discord Server</a>
          <a href="https://github.com/OutRed/v4" target="_blank" rel="noopener">GitHub</a>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; ${new Date().getFullYear()} outred.org &mdash; All rights reserved.</p>
        <div style="display:flex;gap:20px;">
          <a href="/settings/tabcloak.html">Tab Settings</a>
          <a href="/settings/panickey.html">Panic Key</a>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(footer);
}

/* ── Snow Effect ─────────────────────────────────────────────── */
function startSnow() {
  if (document.getElementById('snow-container')) return; // already running
  const container = document.createElement('div');
  container.id = 'snow-container';
  container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9997;overflow:hidden;';
  const count = 60;
  for (let i = 0; i < count; i++) {
    const flake = document.createElement('div');
    flake.className = 'flake';
    const size = (Math.random() * 4 + 2).toFixed(1);
    const left = (Math.random() * 100).toFixed(2);
    const delay = (Math.random() * 12).toFixed(2);
    const duration = (Math.random() * 8 + 7).toFixed(2);
    const drift = ((Math.random() - 0.5) * 60).toFixed(1);
    flake.style.cssText = `
      width:${size}px;height:${size}px;
      left:${left}%;top:-10px;
      opacity:${(Math.random() * 0.5 + 0.3).toFixed(2)};
      animation:snowfall ${duration}s ${delay}s linear infinite;
      --drift:${drift}px;
    `;
    container.appendChild(flake);
  }
  document.body.appendChild(container);
}

function stopSnow() {
  const el = document.getElementById('snow-container');
  if (el) el.remove();
}

// Expose so settings.js can call them live
window.OR_startSnow = startSnow;
window.OR_stopSnow  = stopSnow;

/* ── Init ────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  buildNavbar();
  if (!document.body.classList.contains('no-footer')) buildFooter();

  // Apply saved theme
  const savedTheme = OR.get('theme', 'dark');
  document.documentElement.setAttribute('data-theme', savedTheme);

  // Start snow if enabled
  if (OR.get('snow', false)) startSnow();

  // Register service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/js/sw.js').catch(() => {});
  }
});
