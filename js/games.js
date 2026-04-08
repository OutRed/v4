/* ═══════════════════════════════════════════════════════════════
   OutRed — games.js
   GameLib: load catalog, render cards, navigate to player
═══════════════════════════════════════════════════════════════ */

'use strict';

const GameLib = (() => {
  let _cache = null;

  /* ── Data ─────────────────────────────────────────────────── */
  async function load() {
    if (_cache) return _cache;
    const res = await fetch('/assets/json/games.json');
    if (!res.ok) throw new Error('Failed to load games.json');
    _cache = await res.json();
    return _cache;
  }

  /* ── Navigation ───────────────────────────────────────────── */
  function navigate(game) {
    localStorage.setItem('currentgame',        `/g/assets/${game.root}/${game.file}`);
    localStorage.setItem('currenttitle',       game.title       || '');
    localStorage.setItem('currentdescription', game.description || '');
    localStorage.setItem('currentroot',        game.root        || '');
    window.location.href = '/g/';
  }

  /* ── Card factory ─────────────────────────────────────────── */
  function createCard(game) {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Play ${game.title}`);

    card.innerHTML = `
      <div class="game-card-thumb">
        <img
          src="/g/assets/${game.root}/${game.img}"
          alt="${escHtml(game.title)}"
          loading="lazy"
          onerror="this.onerror=null;this.src='/assets/img/no-img.jpg'"
        />
        <div class="game-card-overlay">
          <div class="play-circle">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="white" viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg>
          </div>
        </div>
      </div>
      <div class="game-card-info">
        <div class="game-card-title">${escHtml(game.title)}</div>
      </div>
    `;

    const go = () => navigate(game);
    card.addEventListener('click', go);
    card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });

    return card;
  }

  /* ── Skeleton placeholders ────────────────────────────────── */
  function skeletons(container, count = 12) {
    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'skeleton skel-card';
      container.appendChild(el);
    }
  }

  /* ── Helper ───────────────────────────────────────────────── */
  function escHtml(str) {
    return String(str ?? '').replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  return { load, navigate, createCard, skeletons };
})();

/* ═══════════════════════════════════════════════════════════════
   Games Browser Page Logic  (only runs on games.html)
═══════════════════════════════════════════════════════════════ */
if (document.getElementById('games-grid')) {
  (async function initGamesBrowser() {
    const grid      = document.getElementById('games-grid');
    const countEl   = document.getElementById('results-count');
    const searchEl  = document.getElementById('page-search');
    const clearBtn  = document.getElementById('search-clear');
    const catRow    = document.getElementById('cat-row');
    const topList   = document.getElementById('top-games-list');

    // Show skeletons
    GameLib.skeletons(grid, 24);

    let allGames   = [];
    let activeCategory = 'all';
    let searchQuery    = '';

    // Load games
    try {
      allGames = await GameLib.load();
    } catch (e) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1">
          <div class="empty-state-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <h3>Couldn't load games</h3>
          <p>Check your connection and try again.</p>
        </div>`;
      return;
    }

    // Pre-fill search from URL ?q=
    const params = new URLSearchParams(window.location.search);
    if (params.get('q')) {
      searchQuery = params.get('q');
      if (searchEl) searchEl.value = searchQuery;
      updateClearBtn();
    }

    // Render top games in sidebar
    if (topList) {
      const picks = allGames.slice(0, 8);
      picks.forEach((g, i) => {
        const item = document.createElement('div');
        item.className = 'top-game-item';
        item.innerHTML = `
          <span class="top-game-rank">${i + 1}</span>
          <img class="top-game-thumb"
            src="/g/assets/${g.root}/${g.img}"
            alt="${g.title}"
            onerror="this.onerror=null;this.src='/assets/img/no-img.jpg'"
          />
          <span class="top-game-title">${g.title}</span>
        `;
        item.addEventListener('click', () => GameLib.navigate(g));
        topList.appendChild(item);
      });
    }

    // Build category chips
    // Extract categories from game data if available, otherwise use defaults
    const defaultCats = [
      { id: 'all', label: 'All Games' },
      { id: 'action', label: 'Action' },
      { id: 'puzzle', label: 'Puzzle' },
      { id: 'racing', label: 'Racing' },
      { id: 'shooter', label: 'Shooter' },
      { id: 'sports', label: 'Sports' },
      { id: 'strategy', label: 'Strategy' },
      { id: 'adventure', label: 'Adventure' },
      { id: 'idle', label: 'Idle' },
    ];
    if (catRow) {
      defaultCats.forEach(cat => {
        const chip = document.createElement('button');
        chip.className = 'cat-chip' + (cat.id === 'all' ? ' active' : '');
        chip.textContent = cat.label;
        chip.dataset.cat = cat.id;
        chip.addEventListener('click', () => {
          activeCategory = cat.id;
          document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          renderGrid();
        });
        catRow.appendChild(chip);
      });
    }

    // Render grid
    function renderGrid() {
      let games = allGames;

      // Filter by search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        games = games.filter(g => g.title.toLowerCase().includes(q));
      }

      // Filter by category (loose title matching — works without explicit category field)
      if (activeCategory !== 'all') {
        const catKeywords = {
          action:    ['action', 'fight', 'battle', 'war', 'attack', 'ninja', 'kill'],
          puzzle:    ['puzzle', 'brain', '2048', 'match', 'sudoku', 'block', 'word'],
          racing:    ['race', 'racing', 'car', 'drift', 'drive', 'speed', 'moto'],
          shooter:   ['shoot', 'gun', 'bullet', 'fps', 'sniper', 'bow'],
          sports:    ['sport', 'soccer', 'basketball', 'football', 'tennis', 'golf', 'baseball'],
          strategy:  ['strategy', 'tower', 'defense', 'idle', 'build', 'empire', 'clicker'],
          adventure: ['adventure', 'quest', 'dungeon', 'rpg', 'explore', 'mine', 'craft'],
          idle:      ['idle', 'clicker', 'tycoon', 'farm', 'sim'],
        };
        const kw = catKeywords[activeCategory] || [];
        games = games.filter(g =>
          g.category === activeCategory ||
          kw.some(k => g.title.toLowerCase().includes(k))
        );
      }

      // Update count
      if (countEl) {
        countEl.innerHTML = `<strong>${games.length}</strong> game${games.length !== 1 ? 's' : ''} found`;
      }

      // Render
      grid.innerHTML = '';
      if (games.length === 0) {
        grid.innerHTML = `
          <div class="empty-state" style="grid-column:1/-1">
            <div class="empty-state-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </div>
            <h3>No games found</h3>
            <p>Try a different search or category.</p>
          </div>`;
        return;
      }
      games.forEach(g => grid.appendChild(GameLib.createCard(g)));
    }

    renderGrid();

    // Search input
    if (searchEl) {
      searchEl.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        updateClearBtn();
        renderGrid();
      });
      // Sync with navbar search
      searchEl.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') { searchQuery = ''; searchEl.value = ''; updateClearBtn(); renderGrid(); }
      });
    }
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        searchQuery = '';
        if (searchEl) searchEl.value = '';
        updateClearBtn();
        renderGrid();
      });
    }

    function updateClearBtn() {
      const wrap = document.getElementById('page-search-wrap');
      if (wrap) wrap.classList.toggle('has-value', !!searchQuery);
    }
  })();
}
