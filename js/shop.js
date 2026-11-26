/* Pilk — shop: items are static HTML; this adds filters, sort and live previews with the visitor's headline */
(function () {
  var P = window.PILK, $ = P.$, $$ = P.$$, grid = $('#grid'); if (!grid) return;
  var q = new URLSearchParams(location.search), st = { cat: P.cats[q.get('cat')] ? q.get('cat') : 'all', style: '', anim: false, sort: 'pop' };
  var cats = $('#cats'), count = $('#count'), empty = $('#empty'), input = $('#shopWords'), reset = $('.words-reset'), w = P.words.get(), lives = [];
  var CYC = ['300x250', '1080x1920', '728x90', '1080x1080', '160x600', '1200x628', '970x250'];
  var items = $$('.cat-item', grid).map(function (el) {
    function a(k) { return el.getAttribute('data-' + k); }
    return { el: el, id: a('id'), cat: a('cat'), style: a('style'), anim: a('anim') === '1', pop: +a('pop'), isNew: +a('new'), price: +a('price') };
  });
  cats.innerHTML = ['all'].concat(Object.keys(P.cats)).map(function (k) {
    var n = k === 'all' ? items.length : items.filter(function (it) { return it.cat === k; }).length;
    return '<button type="button" data-cat="' + k + '" aria-pressed="false">' + (k === 'all' ? P.t('All') : P.cats[k]) + ' <sup>' + n + '</sup></button>';
  }).join('');

  function apply() {
    var list = items.filter(function (it) { return (st.cat === 'all' || it.cat === st.cat) && (!st.style || it.style === st.style) && (!st.anim || it.anim); });
    list.sort(function (a, b) {
      if (st.sort === 'new') return (b.isNew - a.isNew) || (b.pop - a.pop);
      if (st.sort === 'low') return a.price - b.price || b.pop - a.pop;
      if (st.sort === 'high') return b.price - a.price || b.pop - a.pop;
      return b.pop - a.pop;
    });
    items.forEach(function (it) { it.el.hidden = true; });
    list.forEach(function (it) { it.el.hidden = false; grid.appendChild(it.el); });
    count.textContent = P.plural(list.length, 'set');
    empty.hidden = !!list.length;
    $$('button', cats).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-cat') === st.cat)); });
    try { var u = new URL(location.href); if (st.cat === 'all') u.searchParams.delete('cat'); else u.searchParams.set('cat', st.cat); history.replaceState(null, '', u); } catch (e) {}
    requestAnimationFrame(function () { lives.forEach(function (l) { l.refresh(); }); window.Motion && Motion.update(); });
  }
  cats.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) { st.cat = b.getAttribute('data-cat'); apply(); } });
  $('#fStyle').addEventListener('change', function (e) { st.style = e.target.value; apply(); });
  $('#fSort').addEventListener('change', function (e) { st.sort = e.target.value; apply(); });
  $('#fAnim').addEventListener('change', function (e) { st.anim = e.target.checked; apply(); });
  $('#clear').addEventListener('click', function () { st = { cat: 'all', style: '', anim: false, sort: st.sort }; $('#fStyle').value = ''; $('#fAnim').checked = false; apply(); });
  grid.addEventListener('click', function (e) { var b = e.target.closest('[data-add]'); if (b) P.cart.add({ id: b.getAttribute('data-add'), pack: 'display', anim: false, edit: false }); });
  apply();

  P.ready(function () {
    items.forEach(function (it, i) {
      var l = new P.Live($('.cat-stage', it.el), P.design(it.id), { text: w.head ? { head: w.head } : null, align: 'bottom', area: .5, fw: .96, fh: .98 }), lab = $('.cat-size', it.el);
      var o = CYC.slice(i % CYC.length).concat(CYC.slice(0, i % CYC.length));
      lab.textContent = P.label(o[0]); l.oncycle = function (id) { lab.textContent = P.label(id); };
      P.cycle(l, o, 3200, 1000 + (i % 6) * 430); lives.push(l);
    });
    addEventListener('resize', function () { lives.forEach(function (l) { l.refresh(); }); });
  });

  if (w.head) { input.value = w.head; reset.hidden = false; }
  var tw = 0;
  function words(v) { P.words.set({ head: v }); reset.hidden = !v; clearTimeout(tw); tw = setTimeout(function () { lives.forEach(function (l) { l.text({ head: v }); }); }, 90); }
  input.addEventListener('input', function () { words(input.value.trim()); });
  reset.addEventListener('click', function () { input.value = ''; words(''); input.focus(); });
})();
