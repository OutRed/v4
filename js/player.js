/* ═══════════════════════════════════════════════════════════════
   OutRed — player.js
   Game player: load iframe, controls, related games
═══════════════════════════════════════════════════════════════ */

'use strict';

/* ── Fullscreen Ad Gate ───────────────────────────────────────────
   Shows a short ad before granting fullscreen access.
   Replace the comment block below with your Monetag
   Interstitial zone script when you have it.
═══════════════════════════════════════════════════════════════ */
function showFullscreenAd(onComplete) {
  // Inject overlay styles once
  if (!document.getElementById('fs-ad-style')) {
    const s = document.createElement('style');
    s.id = 'fs-ad-style';
    s.textContent = `
      #fs-ad-overlay {
        position: fixed; inset: 0; z-index: 99999;
        background: rgba(0,0,0,0.96);
        display: flex; flex-direction: column;
        align-items: center; justify-content: center;
        gap: 20px; padding: 24px;
        animation: fsAdIn 0.2s ease;
      }
      @keyframes fsAdIn {
        from { opacity: 0; transform: scale(0.97); }
        to   { opacity: 1; transform: scale(1); }
      }
      #fs-ad-label {
        font-family: 'Inter', sans-serif;
        font-size: 0.8rem; font-weight: 600;
        letter-spacing: 0.08em; text-transform: uppercase;
        color: rgba(255,255,255,0.35);
      }
      #fs-ad-box {
        width: 100%; max-width: 728px;
        min-height: 90px;
        display: flex; align-items: center; justify-content: center;
        background: #111; border-radius: 8px; overflow: hidden;
      }
      #fs-ad-continue {
        font-family: 'Inter', sans-serif;
        padding: 12px 32px; border-radius: 10px;
        background: #e63946; color: #fff; border: none;
        font-size: 0.95rem; font-weight: 700;
        cursor: pointer; opacity: 0; pointer-events: none;
        transition: opacity 0.3s, transform 0.2s;
      }
      #fs-ad-continue.ready {
        opacity: 1; pointer-events: all;
      }
      #fs-ad-continue:hover { transform: translateY(-2px); }
      #fs-ad-timer {
        font-family: 'Inter', sans-serif;
        font-size: 0.82rem; color: rgba(255,255,255,0.4);
        min-height: 20px;
      }
    `;
    document.head.appendChild(s);
  }

  // Build overlay
  const overlay = document.createElement('div');
  overlay.id = 'fs-ad-overlay';
  overlay.innerHTML = `
    <div id="fs-ad-label">Watch a short ad to enable fullscreen</div>
    <div id="fs-ad-box">
      <!-- ═══════════════════════════════════════════════════
           PASTE YOUR MONETAG INTERSTITIAL ZONE CODE HERE
           e.g. <script src="..." data-zone="XXXXXX"><\/script>
      ════════════════════════════════════════════════════ -->
    </div>
    <div id="fs-ad-timer">Please wait <span id="fs-countdown">5</span>s…</div>
    <button id="fs-ad-continue">Enter Fullscreen →</button>
  `;
  document.body.appendChild(overlay);

  // Countdown then unlock button
  let secs = 5;
  const countEl  = document.getElementById('fs-countdown');
  const timerEl  = document.getElementById('fs-ad-timer');
  const continueBtn = document.getElementById('fs-ad-continue');

  const tick = setInterval(() => {
    secs--;
    if (secs <= 0) {
      clearInterval(tick);
      if (timerEl)   timerEl.style.display = 'none';
      if (continueBtn) continueBtn.classList.add('ready');
    } else {
      if (countEl) countEl.textContent = secs;
    }
  }, 1000);

  // Continue button → close overlay + go fullscreen
  if (continueBtn) {
    continueBtn.addEventListener('click', () => {
      clearInterval(tick);
      overlay.remove();
      onComplete();
    });
  }
}

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
      // Already fullscreen — just exit, no ad
      document.exitFullscreen?.().catch(() => {});
    } else {
      // Show ad gate first, then go fullscreen
      showFullscreenAd(() => {
        wrap?.requestFullscreen?.().catch(() => {});
      });
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
