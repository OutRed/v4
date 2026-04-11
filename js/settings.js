/* ═══════════════════════════════════════════════════════════════
   OutRed — settings.js
   Handles all settings page interactions
═══════════════════════════════════════════════════════════════ */

'use strict';

// Bind a setting toggle
function bindToggle(id, settingKey, onChange) {
  const el = document.getElementById(id);
  if (!el) return;
  el.checked = OR.get(settingKey, false);
  el.addEventListener('change', () => {
    OR.set(settingKey, el.checked);
    if (onChange) onChange(el.checked);
  });
}

// Bind a text input
function bindInput(id, settingKey, onChange) {
  const el = document.getElementById(id);
  if (!el) return;
  el.value = OR.get(settingKey, '');
  el.addEventListener('input', () => {
    OR.set(settingKey, el.value.trim() || null);
    if (onChange) onChange(el.value);
  });
}

// Bind a select/radio
function bindSelect(id, settingKey, onChange) {
  const el = document.getElementById(id);
  if (!el) return;
  el.value = OR.get(settingKey, el.value);
  el.addEventListener('change', () => {
    OR.set(settingKey, el.value);
    if (onChange) onChange(el.value);
  });
}

// Toast notification
function toast(msg, type = 'info') {
  const t = document.createElement('div');
  t.style.cssText = `
    position:fixed; bottom:24px; right:24px; z-index:9999;
    background:${type === 'success' ? 'var(--accent)' : 'var(--surface-3)'};
    color:#fff; padding:12px 20px; border-radius:var(--radius);
    font-size:0.875rem; font-weight:600;
    box-shadow:var(--shadow-lg);
    animation:slideInToast 0.25s ease;
  `;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity 0.3s'; setTimeout(() => t.remove(), 300); }, 2500);
}

// Add toast animation to page
const style = document.createElement('style');
style.textContent = `@keyframes slideInToast { from { transform: translateY(12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.settingsPage;

  /* ── General ─────────────────────────────────────────────── */
  if (!page || page === 'general') {
    // Nothing specific here yet
  }

  /* ── Appearance ──────────────────────────────────────────── */
  if (page === 'appearance') {
    // Theme selector
    const themeButtons = document.querySelectorAll('[data-theme-btn]');
    themeButtons.forEach(btn => {
      if (btn.dataset.themeBtn === (OR.get('theme', 'dark'))) {
        btn.classList.add('active');
      }
      btn.addEventListener('click', () => {
        const t = btn.dataset.themeBtn;
        OR.set('theme', t);
        // Apply immediately — no reload needed
        document.documentElement.setAttribute('data-theme', t);
        themeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        toast('Theme applied!', 'success');
      });
    });

    // Snow toggle
    bindToggle('snow-toggle', 'snow', (val) => {
      toast(val ? 'Snow enabled!' : 'Snow disabled.', 'success');
    });
  }

  /* ── Tab Cloak ───────────────────────────────────────────── */
  if (page === 'tabcloak') {
    const REAL_FAVICON = '/assets/favicon.png';

    // Live-update the favicon element in the DOM immediately
    function setFavicon(url) {
      let el = document.getElementById('favicon') || document.querySelector("link[rel*='icon']");
      if (!el) {
        el = document.createElement('link');
        el.rel = 'shortcut icon';
        el.id = 'favicon';
        document.head.appendChild(el);
      }
      el.href = url;
    }

    // Live-update the tab title immediately
    function setTitle(title) {
      document.title = title || 'OutRed';
    }

    const presets = [
      { label: 'Google Classroom', title: 'Classroom', favicon: 'https://ssl.gstatic.com/classroom/favicon.png' },
      { label: 'Google Docs',      title: 'Untitled document - Google Docs', favicon: 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico' },
      { label: 'Khan Academy',     title: 'Khan Academy', favicon: 'https://cdn.kastatic.org/images/favicon.ico' },
      { label: 'Quizlet',          title: 'Quizlet', favicon: 'https://quizlet.com/favicon.ico' },
      { label: 'Duolingo',         title: 'Duolingo', favicon: 'https://d35aaqx5ub95lt.cloudfront.net/favicon.ico' },
      { label: 'Wikipedia',        title: 'Wikipedia', favicon: 'https://www.wikipedia.org/static/favicon/wikipedia.ico' },
    ];

    const presetGrid = document.getElementById('cloak-presets');
    if (presetGrid) {
      presets.forEach(p => {
        const btn = document.createElement('button');
        btn.className = 'btn btn-secondary btn-sm';
        btn.style.cssText = 'display:flex;align-items:center;gap:8px;';
        btn.innerHTML = `<img src="${p.favicon}" width="16" height="16" style="border-radius:3px;" onerror="this.style.display='none'"> ${p.label}`;
        btn.addEventListener('click', () => {
          OR.set('cloak_title',   p.title);
          OR.set('cloak_favicon', p.favicon);
          const ti = document.getElementById('cloak-title');
          const fi = document.getElementById('cloak-favicon');
          if (ti) ti.value = p.title;
          if (fi) fi.value = p.favicon;
          // Apply immediately to live tab
          setFavicon(p.favicon);
          setTitle(p.title);
          toast(`Cloaked as ${p.label}!`, 'success');
        });
        presetGrid.appendChild(btn);
      });
    }

    // Manual title input — apply live as user types
    const titleInput = document.getElementById('cloak-title');
    if (titleInput) {
      titleInput.value = OR.get('cloak_title', '');
      titleInput.addEventListener('input', () => {
        const val = titleInput.value.trim();
        OR.set('cloak_title', val || null);
        setTitle(val || 'OutRed');
      });
    }

    // Manual favicon input — apply live on change
    const faviconInput = document.getElementById('cloak-favicon');
    if (faviconInput) {
      faviconInput.value = OR.get('cloak_favicon', '');
      faviconInput.addEventListener('input', () => {
        const val = faviconInput.value.trim();
        OR.set('cloak_favicon', val || null);
        setFavicon(val || REAL_FAVICON);
      });
    }

    const clearBtn = document.getElementById('cloak-clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        OR.del('cloak_title');
        OR.del('cloak_favicon');
        if (titleInput)   titleInput.value = '';
        if (faviconInput) faviconInput.value = '';
        // Revert live tab back to real OutRed favicon and title
        setFavicon(REAL_FAVICON);
        setTitle('OutRed — Unblocked Games for School 2026');
        toast('Tab cloak cleared.', 'info');
      });
    }
  }

  /* ── Panic Key ───────────────────────────────────────────── */
  if (page === 'panickey') {
    // Capture key press
    const keyDisplay = document.getElementById('key-display');
    const keyInput   = document.getElementById('panic-key-hidden');
    const captureBtn = document.getElementById('capture-key-btn');

    if (captureBtn && keyDisplay && keyInput) {
      const currentKey = OR.get('panic_key', '');
      keyDisplay.textContent = currentKey ? `"${currentKey}"` : 'None set';
      if (keyInput) keyInput.value = currentKey;

      let capturing = false;
      captureBtn.addEventListener('click', () => {
        capturing = true;
        captureBtn.textContent = 'Press any key…';
        captureBtn.classList.add('active');
      });
      document.addEventListener('keydown', (e) => {
        if (!capturing) return;
        e.preventDefault();
        capturing = false;
        OR.set('panic_key', e.key);
        keyDisplay.textContent = `"${e.key}"`;
        if (keyInput) keyInput.value = e.key;
        captureBtn.textContent = 'Change Key';
        captureBtn.classList.remove('active');
        toast(`Panic key set to "${e.key}"`, 'success');
      });
    }

    bindInput('panic-url', 'panic_url');

    const clearBtn = document.getElementById('panic-clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        OR.del('panic_key');
        OR.del('panic_url');
        if (keyDisplay) keyDisplay.textContent = 'None set';
        if (keyInput)   keyInput.value = '';
        const urlEl = document.getElementById('panic-url');
        if (urlEl)     urlEl.value = '';
        toast('Panic key cleared.', 'info');
      });
    }
  }
});
