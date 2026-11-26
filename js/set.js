/* Pilk — set page: content is static HTML; this adds the live preview in every size, your words and the price */
(function () {
  var P = window.PILK, $ = P.$, $$ = P.$$, q = new URLSearchParams(location.search), canvas = $('#setCanvas'); if (!canvas) return;
  var d = P.design(document.body.getAttribute('data-set') || q.get('id') || 'soft-sale');
  var pack = P.packs[q.get('pack')] ? q.get('pack') : 'display', fmt = P.packs[pack].sizes[0], view = 'one', real = false, opt = { anim: false, edit: false };
  var w = P.words.get(), text = { head: w.head, sub: w.sub, cta: w.cta }, dimEl = $('#setDim'), sizes = $('#sizes'), sheetEl = $('#sheet'), pad = $('.real-pad', canvas), live = null;
  var pr = $('input[name=pack][value=' + pack + ']'); if (pr) pr.checked = true;

  function price() { return P.price({ id: d.id, pack: pack, anim: opt.anim, edit: opt.edit }); }
  function updPrice() { var t = P.money(price()); $('#total').textContent = t; $('#barTotal').textContent = t; $('#barPack').textContent = P.packs[pack].n + (opt.anim ? ' + HTML5' : '') + (opt.edit ? ' + ' + P.t('our edit') : ''); }
  function renderSizes() {
    sizes.innerHTML = P.packs[pack].sizes.map(function (id) { var f = P.formats[id]; return '<button type="button" data-id="' + id + '" aria-pressed="' + (id === fmt) + '" title="' + f.n + ', ' + f.where + '">' + P.mini(id) + P.label(id) + '</button>'; }).join('');
    $('#sizeTbl tbody').innerHTML = P.packs[pack].sizes.map(function (id) { var f = P.formats[id]; return '<tr><td>' + P.mini(id) + P.label(id) + '</td><td>' + f.n + '</td><td>' + f.where + '</td></tr>'; }).join('');
  }
  function realOk() { return !P.formats[fmt].u; }
  function show(dur) {
    $$('.seg button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-view') === view)); });
    var r = $('#real'); r.disabled = !realOk() || view === 'all'; if (r.disabled) { r.checked = false; real = false; }
    $('#realWrap').title = realOk() ? '' : P.t('Print sizes are shown to scale');
    canvas.classList.toggle('is-sheet', view === 'all'); canvas.classList.toggle('is-real', real);
    if (view === 'all') { live.frame.hidden = true; dimEl.hidden = true; sheetEl.hidden = false; buildSheet(); return; }
    sheetEl.hidden = true; live.frame.hidden = false; dimEl.hidden = false;
    dimEl.textContent = P.label(fmt) + ' · ' + P.formats[fmt].n;
    live.go(fmt, dur);
  }
  function buildSheet() {
    var ids = P.byHeight(P.packs[pack].sizes), cw = sheetEl.clientWidth;
    sheetEl.innerHTML = '';
    var a = P.clamp(cw / 5.4, 84, 190), pk = P.pack(ids, a, cw, 22, 28);
    sheetEl.style.height = pk.h + 28 + 'px';
    pk.items.forEach(function (it) {
      var l = new P.Live(sheetEl, d, { text: text, anim: false }); l.manual = true; l.st = l.state(it.id); l.inner(l.st); l.outer(l.st, { s: it.s, x: it.x, y: it.y });
      var lab = document.createElement('span'); lab.className = 'sheet-l'; lab.textContent = P.label(it.id);
      lab.style.left = it.x + it.w / 2 + 'px'; lab.style.top = it.y + it.h + 7 + 'px'; sheetEl.appendChild(lab);
    });
  }
  sizes.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    fmt = b.getAttribute('data-id'); view = 'one';
    $$('button', sizes).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
    show(650);
  });
  $$('.seg button').forEach(function (b) { b.addEventListener('click', function () { view = b.getAttribute('data-view'); show(0); }); });
  $('#real').addEventListener('change', function (e) { real = e.target.checked; show(0); });
  $('#packs').addEventListener('change', function (e) {
    pack = e.target.value; if (P.packs[pack].sizes.indexOf(fmt) < 0) fmt = P.packs[pack].sizes[0];
    renderSizes(); updPrice(); show(650);
  });
  $('#extras').addEventListener('change', function (e) { opt[e.target.name] = e.target.checked; updPrice(); });
  function add() { P.cart.add({ id: d.id, pack: pack, anim: opt.anim, edit: opt.edit }); }
  $('#add').addEventListener('click', add); $('#barAdd').addEventListener('click', add);
  $('#buyNow').addEventListener('click', function () { add(); location.href = 'cart.html#checkout'; });

  var F = { head: $('#wHead'), sub: $('#wSub'), cta: $('#wCta') }, tw = 0;
  Object.keys(F).forEach(function (k) {
    F[k].placeholder = d.t[k]; if (text[k]) F[k].value = text[k];
    F[k].addEventListener('input', function () {
      var v = F[k].value.trim(), o = {}; o[k] = v; text[k] = v; P.words.set(o);
      clearTimeout(tw); tw = setTimeout(function () { if (live) { live.text(o); if (view === 'all') buildSheet(); } }, 70);
    });
  });
  $('#wReset').addEventListener('click', function () { Object.keys(F).forEach(function (k) { F[k].value = ''; text[k] = ''; }); P.words.set({ head: '', sub: '', cta: '' }); live.text({ head: '', sub: '', cta: '' }); if (view === 'all') buildSheet(); });

  renderSizes(); updPrice();
  P.ready(function () {
    live = new P.Live(canvas, d, { text: text, fw: .86, fh: .8 });
    var base = live.place;
    live.place = function (s) {
      if (!real) { pad.style.width = pad.style.height = '0px'; return base.call(live, s); }
      var hw = canvas.clientWidth, hh = canvas.clientHeight;
      pad.style.width = s.W + 48 + 'px'; pad.style.height = s.H + 48 + 'px';
      return { s: 1, w: s.W, h: s.H, x: Math.max(24, (hw - s.W) / 2), y: Math.max(24, (hh - s.H) / 2) };
    };
    show(0);
    addEventListener('resize', function () { if (view === 'all') buildSheet(); else live.refresh(); });
    var rel = P.designs.filter(function (x) { return x.id !== d.id && (x.style === d.style || x.cat === d.cat); }).slice(0, 3), host = $('#related');
    host.innerHTML = rel.map(function (x) { return '<a class="shelf-item" href="set-' + x.id + '.html"><div class="shelf-stage"></div><div class="shelf-meta"><span class="shelf-size"></span><b>' + x.name + '</b><span class="note">' + P.ico('layers') + P.t('26 sizes · from {price}', { price: P.money(P.tiers[x.tier].print) }) + '</span></div></a>'; }).join('');
    $$('.shelf-item', host).forEach(function (el, i) {
      var l = new P.Live($('.shelf-stage', el), rel[i], { text: text.head ? { head: text.head } : null, align: 'bottom', area: .5, fw: .96, fh: .98 }), lab = $('.shelf-size', el), o = ['1080x1080', '728x90', '300x600', '1200x628'];
      lab.textContent = P.label(o[i % 4]); l.oncycle = function (id) { lab.textContent = P.label(id); };
      P.cycle(l, o.slice(i % 4).concat(o.slice(0, i % 4)), 3000, 900 + i * 500);
      addEventListener('resize', function () { l.refresh(); });
    });
  });
})();
