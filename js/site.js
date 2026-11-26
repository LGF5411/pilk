/* Pilk — shared: header, menu, cart, toasts, buy bar, gaze, counters, forms */
(function () {
  var P = window.PILK, root = document.documentElement, body = document.body;
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return [].slice.call((c || document).querySelectorAll(s)); }
  P.$ = $; P.$$ = $$;
  P.ico = function (n) { return (P.icons && P.icons[n]) || ''; };
  P.store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  function grp(n, sep) { var s = String(n); return n >= (sep === ',' ? 1000 : 10000) ? s.replace(/\B(?=(\d{3})+(?!\d))/g, sep) : s; }
  P.money = function (n) { n = Math.round(n); return P.lang === 'en' ? '€' + grp(n, ',') : grp(n, '\u00a0') + '\u00a0€'; };
  P.range = function (a, b) { return P.lang === 'en' ? P.money(a) + '–' + P.money(b) : P.money(a).replace(/\u00a0€$/, '') + '–' + P.money(b); };
  P.cents = function (n) { var s = n.toFixed(2); return P.lang === 'en' ? '€' + s : s.replace('.', ',') + '\u00a0€'; };
  P.esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  /* visitor's own words, shared by hero, shop and set pages */
  P.words = {
    get: function () { return P.store.get('pilk-words', {}); },
    set: function (o) { var w = P.words.get(); for (var k in o) { if (o[k]) w[k] = o[k]; else delete w[k]; } P.store.set('pilk-words', w); }
  };

  /* ---------- cart ---------- */
  P.price = function (it) { var d = P.design(it.id); return P.tiers[d.tier][it.pack] + (it.anim ? P.extras.anim.p : 0) + (it.edit ? P.extras.edit.p : 0); };
  P.cart = {
    items: function () { return P.store.get('pilk-cart', []); },
    save: function (a) { P.store.set('pilk-cart', a); sync(); },
    add: function (it) {
      var a = P.cart.items(), same = a.filter(function (x) { return x.id === it.id && x.pack === it.pack; })[0];
      if (same) { same.anim = it.anim; same.edit = it.edit; } else a.push(it);
      P.cart.save(a);
      var d = P.design(it.id);
      P.toast(P.ico('circle-check') + '<span><b>' + P.esc(d.name) + '</b> · ' + P.t('{pack} added', { pack: P.packs[it.pack].n }) + '</span><a href="cart.html">' + P.t('View cart') + '</a>');
    },
    remove: function (i) { var a = P.cart.items(); a.splice(i, 1); P.cart.save(a); },
    count: function () { return P.cart.items().length; },
    total: function () { return P.cart.items().reduce(function (s, it) { return s + P.price(it); }, 0); }
  };
  function sync() { var n = P.cart.count(); $$('[data-cart-count]').forEach(function (el) { el.textContent = n; el.hidden = !n; }); }
  sync();

  /* ---------- toast ---------- */
  var tbox = $('.toasts');
  P.toast = function (html) {
    if (!tbox) return;
    var t = document.createElement('div'); t.className = 'toast'; t.innerHTML = html; tbox.appendChild(t);
    requestAnimationFrame(function () { t.classList.add('is-on'); });
    setTimeout(function () { t.classList.remove('is-on'); setTimeout(function () { t.remove(); }, 500); }, 3800);
  };

  /* ---------- header: glass on scroll, hides on the way down ---------- */
  var hdr = $('#hdr'), lastY = scrollY, menuOpen = false, tick = false;
  function onScroll() {
    tick = false; var y = scrollY;
    if (hdr) {
      hdr.classList.toggle('is-scrolled', y > 8);
      if (!menuOpen && !body.classList.contains('no-hide')) {
        if (y > lastY + 6 && y > 140) hdr.classList.add('is-hidden');
        else if (y < lastY - 6 || y < 140) hdr.classList.remove('is-hidden');
      }
    }
    lastY = y; bars();
  }
  addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(onScroll); } }, { passive: true });

  /* ---------- phone menu ---------- */
  var menu = $('#menu'), mbtn = $('.menu-btn');
  function setMenu(on) {
    if (!menu) return; menuOpen = on;
    menu.classList.toggle('is-open', on); menu.inert = !on; body.classList.toggle('is-locked', on);
    if (mbtn) mbtn.setAttribute('aria-expanded', on);
    if (on) { hdr && hdr.classList.remove('is-hidden'); var f = $('a', menu); f && f.focus(); } else mbtn && mbtn.focus();
  }
  if (menu) {
    menu.inert = true;
    mbtn && mbtn.addEventListener('click', function () { setMenu(!menuOpen); });
    $$('[data-menu-close]', menu).forEach(function (b) { b.addEventListener('click', function () { setMenu(false); }); });
    $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    addEventListener('keydown', function (e) { if (e.key === 'Escape' && menuOpen) setMenu(false); });
  }

  /* ---------- buy bar: after the first screen, gone at the final call ---------- */
  var bar = $('[data-buybar]');
  function bars() {
    if (!bar) return;
    var after = $(bar.getAttribute('data-after') || 'main'), hide = $$(bar.getAttribute('data-hide') || '.none');
    var on = after ? after.getBoundingClientRect().bottom < innerHeight * .35 : scrollY > innerHeight;
    hide.forEach(function (h) { var r = h.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) on = false; });
    bar.classList.toggle('is-on', on);
  }
  P.bars = bars; bars();

  /* ---------- gaze: every eye on the page looks at the pointer ---------- */
  var idle = 0;
  function look(x, y) {
    root.style.setProperty('--gx', ((x / innerWidth - .5) * 2).toFixed(3));
    root.style.setProperty('--gy', ((y / innerHeight - .5) * 2).toFixed(3));
    root.classList.remove('gaze-idle'); clearTimeout(idle);
    idle = setTimeout(function () { root.classList.add('gaze-idle'); }, 2600);
  }
  root.classList.add('gaze-idle');
  addEventListener('pointermove', function (e) { look(e.clientX, e.clientY); }, { passive: true });
  addEventListener('pointerdown', function (e) { look(e.clientX, e.clientY); }, { passive: true });

  /* ---------- reduce motion: the visitor's own choice ---------- */
  $$('[data-motion-toggle]').forEach(function (b) {
    var soft = root.classList.contains('motion-soft');
    b.lastChild.textContent = ' ' + P.t(soft ? 'Full motion' : 'Reduce motion');
    b.setAttribute('aria-pressed', soft);
    b.addEventListener('click', function () { window.Motion && Motion.setReduced(!soft); });
  });

  /* ---------- counters that tick once ---------- */
  function count(el) {
    var to = parseFloat(el.getAttribute('data-count')), suf = (el.getAttribute('data-suffix') || '').trim(), pre = el.getAttribute('data-prefix') || '', t0 = 0;
    suf = suf ? ' ' + P.t(suf) : '';
    if (P.soft) { el.textContent = pre + to + suf; return; }
    function f(now) { t0 = t0 || now; var k = Math.min(1, (now - t0) / 1100), v = Math.round(to * P.ease(k)); el.textContent = pre + v + suf; if (k < 1) requestAnimationFrame(f); }
    requestAnimationFrame(f);
  }
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { count(e.target); cio.unobserve(e.target); } }); });
    $$('[data-count]').forEach(function (el) { cio.observe(el); });
  }

  /* ---------- active section in the nav (home) ---------- */
  $$('.nav a[href*="#"]').forEach(function (a) {
    var id = a.getAttribute('href').split('#')[1], sec = document.getElementById(id);
    if (!sec || !('IntersectionObserver' in window)) return;
    new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); }); }, { rootMargin: '-45% 0px -50% 0px' }).observe(sec);
  });

  /* ---------- forms: validate visible required fields, show plain messages ---------- */
  P.check = function (scope) {
    var ok = true, first = null;
    $$('input,select,textarea', scope).forEach(function (f) {
      if (f.disabled || f.closest('[hidden]')) return;
      var field = f.closest('.field') || f.parentElement, err = field && $('.err', field), msg = '';
      if (f.type === 'checkbox' && f.required && !f.checked) msg = f.getAttribute('data-msg') || P.t('Please tick this box.');
      else if (f.required && !String(f.value).trim()) msg = f.getAttribute('data-msg') || P.t('Please fill this in.');
      else if (f.type === 'email' && f.value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.value)) msg = P.t('This email looks short of a letter. Check it, please.');
      f.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (err) { err.innerHTML = msg ? P.ico('triangle-alert') + msg : ''; err.hidden = !msg; }
      if (msg) { ok = false; first = first || f; }
    });
    if (first) first.focus();
    return ok;
  };
  document.addEventListener('input', function (e) { var f = e.target; if (f.getAttribute && f.getAttribute('aria-invalid') === 'true') { f.setAttribute('aria-invalid', 'false'); var fl = f.closest('.field'), er = fl && $('.err', fl); if (er) er.hidden = true; } });

  var y = $('[data-year]'); if (y) y.textContent = new Date().getFullYear();
})();

/* generic live banners: data-banner + data-size | data-cycle | data-pack */
(function () {
  var P = window.PILK;
  P.ready(function () {
    P.$$('[data-banner]').forEach(function (el) {
      var d = P.design(el.getAttribute('data-banner')), raw = el.getAttribute('data-text'), text = raw ? JSON.parse(raw) : null, pack = el.getAttribute('data-pack');
      if (pack) {
        var ids = pack.split(','), lives = ids.map(function (id) { var l = new P.Live(el, d, { text: text }); l.manual = true; l.st = l.state(id); l.inner(l.st); return l; });
        var lay = function () { var pk = P.fitPack(ids, el.clientWidth, el.clientHeight * .96, el.clientWidth < 500 ? 8 : 14, 0), y0 = (el.clientHeight - pk.h) / 2; pk.items.forEach(function (it, i) { lives[i].outer(lives[i].st, { s: it.s, x: it.x, y: it.y + y0 }); }); };
        lay(); addEventListener('resize', lay); return;
      }
      var l = new P.Live(el, d, { text: text, align: el.getAttribute('data-align') || 'center', fw: +el.getAttribute('data-fw') || .92, fh: +el.getAttribute('data-fh') || .9, area: +el.getAttribute('data-area') || 0 }), cyc = el.getAttribute('data-cycle');
      if (cyc) P.cycle(l, cyc.split(','), +el.getAttribute('data-period') || 2600, 1400); else l.go(el.getAttribute('data-size') || '300x250');
      addEventListener('resize', function () { l.refresh(); });
    });
  });
})();

/* comparison tables: each cell carries its column name, so phones can stack rows */
(function () {
  [].forEach.call(document.querySelectorAll('table.cmp'), function (t) {
    var h = [].map.call(t.querySelectorAll('thead th'), function (x) { return x.textContent.trim(); });
    [].forEach.call(t.querySelectorAll('tbody tr'), function (r) { [].forEach.call(r.children, function (c, i) { if (c.tagName === 'TD' && h[i]) c.setAttribute('data-th', h[i]); }); });
  });
})();

/* forms: with "form" set in _dev/config.json they are really sent; without it the site stays a demo */
(function () {
  var P = window.PILK; P.cfg = P.cfg || {};
  P.send = function (form, done) {
    if (!P.cfg.form) { done(); return; }
    var fd = new FormData(), b = form.querySelector('[type=submit]');
    [].forEach.call(form.elements, function (el) {
      var k = el.name || el.id; if (!k || el.type === 'submit' || el.type === 'button' || el.type === 'file') return;
      if (el.type === 'checkbox' || el.type === 'radio') { if (el.checked) fd.append(k, el.value || 'yes'); } else if (el.value) fd.append(k, el.value);
    });
    fd.append('page', location.href); if (b) b.disabled = true;
    fetch(P.cfg.form, { method: 'POST', headers: { Accept: 'application/json' }, body: fd }).then(function (r) { if (!r.ok) throw 0; done(); }).catch(function () {
      if (b) b.disabled = false;
      var m = form.querySelector('.send-err'); if (!m) { m = document.createElement('p'); m.className = 'err send-err'; m.setAttribute('role', 'alert'); form.appendChild(m); }
      m.textContent = P.t('It didn’t send. Please write to {email}.', { email: P.cfg.email });
    });
  };
})();
