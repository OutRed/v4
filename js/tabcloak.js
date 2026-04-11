/* ═══════════════════════════════════════════════════════════════
   OutRed — tabcloak.js
   Loaded in <head> — runs synchronously before paint.
   Applies theme + tab cloak before the browser renders anything.
═══════════════════════════════════════════════════════════════ */
(function () {
  try {
    // ── Theme — plain string, no JSON encoding ─────────────────
    // Stored as: localStorage.setItem('outred_theme', 'midnight')
    var theme = localStorage.getItem('outred_theme');
    if (theme) {
      document.documentElement.setAttribute('data-theme', theme);
    }

    // ── Tab cloak title ────────────────────────────────────────
    var rawTitle = localStorage.getItem('or_cloak_title');
    if (rawTitle) {
      var title = rawTitle;
      try { title = JSON.parse(rawTitle); } catch (e) {}
      if (title) document.title = title;
    }

    // ── Tab cloak favicon ──────────────────────────────────────
    var rawFav = localStorage.getItem('or_cloak_favicon');
    if (rawFav) {
      var fav = rawFav;
      try { fav = JSON.parse(rawFav); } catch (e) {}
      if (fav) {
        document.addEventListener('DOMContentLoaded', function () {
          var el = document.getElementById('favicon') ||
                   document.querySelector("link[rel*='icon']");
          if (!el) {
            el = document.createElement('link');
            el.rel = 'shortcut icon';
            el.id  = 'favicon';
            document.head.appendChild(el);
          }
          // Cache-bust so browser actually loads the new favicon
          el.href = fav + '?v=' + Date.now();
        });
      }
    }
  } catch (e) {}
})();
