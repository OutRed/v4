/* ═══════════════════════════════════════════════════════════════
   OutRed — player.js
   Game player: load iframe, controls, related games
═══════════════════════════════════════════════════════════════ */

'use strict';


document.addEventListener('DOMContentLoaded', async () => {
  const iframe    = document.getElementById('game-iframe');
  const titleEl   = document.getElementById('game-title');
  const descEl    = document.getElementById('game-desc');
  const wrap      = document.getElementById('player-wrap');

  const src   = localStorage.getItem('currentgame');
  const title = localStorage.getItem('currenttitle')       || 'Game';
  const desc  = localStorage.getItem('currentdescription') || '';

  // Guard: no game selected
  if (!src) {
    window.location.replace('/games.html');
    return;
  }

  // Populate
  if (iframe)  iframe.src           = src;
  if (titleEl) titleEl.textContent  = title;
  if (descEl)  descEl.textContent   = desc || 'No description available.';
  document.title = `${title} — OutRed`;

  // Fade in once game loads (hides the loading gif)
  if (iframe) {
    iframe.addEventListener('load', () => {
      if (iframe.src && iframe.src !== 'about:blank') {
        iframe.classList.add('loaded');
      }
    });
  }

  // ── Controls ──────────────────────────────────────────────────
  window.toggleFullscreen = function () {
    if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
    } else {
      wrap?.requestFullscreen?.().catch(() => {});
    }
  };

  window.openNewTab = function () {
    window.open(src, '_blank', 'noopener');
  };

  window.shareGame = function () {
    if (navigator.share) {
      navigator.share({ title, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        const btn = document.getElementById('share-btn');
        if (btn) {
          const original = btn.innerHTML;
          btn.innerHTML  = '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>';
          setTimeout(() => { btn.innerHTML = original; }, 1600);
        }
      }).catch(() => {});
    }
  };

  // Fullscreen change — update icon
  document.addEventListener('fullscreenchange', () => {
    const fsBtn = document.getElementById('fs-btn');
    if (!fsBtn) return;
    if (document.fullscreenElement) {
      fsBtn.title     = 'Exit Fullscreen';
      fsBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>`;
    } else {
      fsBtn.title     = 'Fullscreen';
      fsBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>`;
    }
  });

  // ── Related Games ─────────────────────────────────────────────
  const relatedGrid = document.getElementById('related-grid');
  if (relatedGrid && typeof GameLib !== 'undefined') {
    try {
      const games       = await GameLib.load();
      const currentRoot = localStorage.getItem('currentroot') || '';
      const others      = games.filter(g => g.root !== currentRoot);
      const picks       = [...others].sort(() => Math.random() - 0.5).slice(0, 6);
      relatedGrid.innerHTML = '';
      picks.forEach(g => relatedGrid.appendChild(GameLib.createCard(g)));
    } catch (e) {
      relatedGrid.innerHTML = '';
    }
  }

  // ── Sidebar top games ─────────────────────────────────────────
  const sideList = document.getElementById('sidebar-game-list');
  if (sideList && typeof GameLib !== 'undefined') {
    try {
      const games       = await GameLib.load();
      const currentRoot = localStorage.getItem('currentroot') || '';
      const picks       = games.filter(g => g.root !== currentRoot).slice(0, 6);
      picks.forEach((g, i) => {
        const item = document.createElement('div');
        item.className = 'top-game-item';
        item.innerHTML = `
          <span class="top-game-rank">${i + 1}</span>
          <img class="top-game-thumb"
            src="/g/assets/${g.root}/${g.img}" alt="${g.title}"
            onerror="this.onerror=null;this.src='/assets/img/no-img.jpg'"
          />
          <span class="top-game-title">${g.title}</span>
        `;
        item.addEventListener('click', () => GameLib.navigate(g));
        sideList.appendChild(item);
      });
    } catch {}
  }
});
