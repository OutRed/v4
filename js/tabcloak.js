/* ═══════════════════════════════════════════════════════════════
   OutRed — tabcloak.js
   Loaded in <head> — runs synchronously before paint.
   Applies theme + tab cloak before the browser renders anything.
═══════════════════════════════════════════════════════════════ */
(function () {
  try {
    // ── Theme (prevents flash of wrong theme) ──────────────────
    var theme = localStorage.getItem('or_theme');
    if (theme) {
      try { document.documentElement.setAttribute('data-theme', JSON.parse(theme)); } catch (e) {}
    }

    // ── Tab cloak title (set before tab title renders) ─────────
    var title = localStorage.getItem('or_cloak_title');
    if (title) {
      try { document.title = JSON.parse(title); } catch (e) {}
    }

    // ── Tab cloak favicon (after DOM so link element exists) ───
    var fav = localStorage.getItem('or_cloak_favicon');
    if (fav) {
      var favUrl;
      try { favUrl = JSON.parse(fav); } catch (e) {}
      if (favUrl) {
        document.addEventListener('DOMContentLoaded', function () {
          var el = document.getElementById('favicon') ||
                   document.querySelector("link[rel*='icon']");
          if (!el) {
            el = document.createElement('link');
            el.rel = 'shortcut icon';
            document.head.appendChild(el);
          }
          el.href = favUrl;
        });
      }
    }
  } catch (e) {}
})();
