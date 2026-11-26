/* Pilk — small pages: FAQ search, contact form, size guide previews, 404 */
(function () {
  var P = window.PILK, $ = P.$, $$ = P.$$;

  var fs = $('#faqSearch');
  if (fs) fs.addEventListener('input', function () {
    var v = fs.value.trim().toLowerCase(), any = false;
    $$('.faq-group').forEach(function (g) {
      var shown = 0;
      $$('details', g).forEach(function (d) { var hit = !v || d.textContent.toLowerCase().indexOf(v) > -1; d.hidden = !hit; if (hit) { shown++; if (v) d.open = true; } });
      g.hidden = !shown; any = any || !!shown;
    });
    $('#faqNone').hidden = any;
  });

  var cf = $('#contactForm');
  if (cf) {
    $('#ctCall').addEventListener('change', function (e) { $('#ctPhoneF').hidden = !e.target.checked; });
    cf.addEventListener('submit', function (e) { e.preventDefault(); if (!P.check(cf)) return; cf.hidden = true; var d = $('#contactDone'); d.hidden = false; d.setAttribute('tabindex', '-1'); d.focus(); });
  }

  /* size guide: rows are static HTML, previews are live */
  var guide = $('#guide');
  if (guide) {
    var G = { id: 'guide', bg: '#ffffff', ink: '#21101f', a1: '#f6dcef', a2: '#fbeef8', a3: '#de9ad2', cta: '#701067', ctaInk: '#ffffff', font: 'a', wt: 760, wk: 1, r: .25, motif: 'squares', anim: 0,
      t: { brand: P.t('Logo'), head: P.t('Your headline here'), sub: P.t('A second line'), cta: P.t('Button') } };
    var lives = [];
    P.ready(function () { $$('tr[data-id]', guide).forEach(function (tr) { var l = new P.Live($('.guide-pv', tr), G, { fw: .98, fh: .96 }); l.go(tr.getAttribute('data-id')); lives.push(l); }); });
    $('#guideTabs').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return; var g = b.getAttribute('data-g');
      $$('button', this).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      $$('tr[data-g]', guide).forEach(function (tr) { tr.hidden = g !== 'all' && tr.getAttribute('data-g') !== g; });
      lives.forEach(function (l) { l.refresh(); });
    });
  }

  var a = $('#art404');
  if (a) {
    P.formats['404x404'] = { w: 404, h: 404, n: 'Not found', where: '', g: 'x' };
    P.ready(function () { var l = new P.Live(a, P.pilk, { text: { head: P.t('404 × 404 of nothing.'), sub: P.t('But the eye is still here'), cta: P.t('Go home') }, fw: .86, fh: .86 }); l.go('404x404'); addEventListener('resize', function () { l.refresh(); }); });
  }
})();
