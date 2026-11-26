/* Pilk — cart and demo checkout */
(function () {
  var P = window.PILK, $ = P.$, $$ = P.$$, list = $('#cartList'); if (!list) return;
  var CODES = { FIRSTGLANCE: .1 }, promo = P.store.get('pilk-promo', '');
  function sums() { var sub = P.cart.total(), off = CODES[promo] ? Math.round(sub * CODES[promo]) : 0, tot = sub - off; return { sub: sub, off: off, tot: tot, vat: tot - tot / 1.24 }; }
  function totals() {
    var s = sums();
    return '<dt>' + P.t('Subtotal') + '</dt><dd>' + P.money(s.sub) + '</dd>' + (s.off ? '<dt>' + P.t('Code {code}', { code: promo }) + '</dt><dd>−' + P.money(s.off) + '</dd>' : '') +
      '<dt>' + P.t('VAT 24%, included') + '</dt><dd>' + P.cents(s.vat) + '</dd><dt class="grand">' + P.t('Total') + '</dt><dd class="grand">' + P.money(s.tot) + '</dd>';
  }
  function show(v) { $('#cartView').hidden = v !== 'cart'; $('#checkoutView').hidden = v !== 'checkout'; $('#doneView').hidden = v !== 'done'; $('#crumb').textContent = P.t(v === 'checkout' ? 'Checkout' : v === 'done' ? 'Order' : 'Cart'); $('#cartTitle').hidden = v === 'done'; if (v === 'checkout') $('#cartTitle').textContent = P.t('Checkout'); }
  function render() {
    var items = P.cart.items();
    $('#cartTitle').textContent = P.t(items.length ? 'Your cart' : 'Your cart is empty');
    if (!items.length) {
      list.innerHTML = '<div class="empty"><span class="empty-ico">' + P.ico('shopping-bag') + '</span><p class="lead">' + P.t('Every set comes in all its sizes. Pick a design, add your words, and it’s ready.') + '</p><a class="btn" href="shop.html">' + P.t('Browse sets') + ' ' + P.ico('arrow-right') + '</a></div>';
    } else {
      list.innerHTML = items.map(function (it, i) {
        var d = P.design(it.id), pk = P.packs[it.pack], href = 'set-' + d.id + '.html?pack=' + it.pack;
        return '<article class="cart-item"><a class="cart-art" href="' + href + '" aria-label="' + P.t('{name}, open the set', { name: d.name }) + '"></a><div><h3><a href="' + href + '">' + d.name + '</a></h3><p class="note"><span>' + P.ico(pk.icon) + P.t('{pack}, {n} sizes', { pack: pk.n, n: pk.sizes.length }) + '</span>' +
          (it.anim ? '<span>' + P.ico('clapperboard') + P.extras.anim.n + '</span>' : '') + (it.edit ? '<span>' + P.ico('pen-line') + P.extras.edit.n + '</span>' : '') +
          '</p></div><div class="cart-end"><b>' + P.money(P.price(it)) + '</b><button type="button" class="rm" data-rm="' + i + '">' + P.ico('trash-2') + P.t('Remove') + '</button></div></article>';
      }).join('');
      P.ready(function () {
        var w = P.words.get();
        $$('.cart-art', list).forEach(function (el, i) { var it = items[i]; if (!it) return; var l = new P.Live(el, P.design(it.id), { text: w.head ? { head: w.head } : null, fw: .96, fh: .96, anim: false }); l.go(P.packs[it.pack].sizes[0]); });
      });
    }
    $('#totals').innerHTML = totals(); $('#totals2').innerHTML = totals();
    $('#toCheckout').disabled = !items.length;
  }
  list.addEventListener('click', function (e) { var b = e.target.closest('[data-rm]'); if (b) { P.cart.remove(+b.getAttribute('data-rm')); render(); } });
  $('#promo').addEventListener('submit', function (e) {
    e.preventDefault(); var c = $('#code').value.trim().toUpperCase(), m = $('#promoMsg');
    if (CODES[c]) { promo = c; P.store.set('pilk-promo', c); m.innerHTML = P.ico('circle-check') + P.t('Code applied: 10% off.'); }
    else { m.innerHTML = P.ico('triangle-alert') + P.t(c ? 'This code doesn’t work. Check the spelling, please.' : 'Type a code first.'); }
    $('#totals').innerHTML = totals(); $('#totals2').innerHTML = totals();
  });
  $('#toCheckout').addEventListener('click', function () { show('checkout'); history.replaceState(null, '', '#checkout'); scrollTo({ top: 0 }); $('#cEmail').focus({ preventScroll: true }); });
  $('#backCart').addEventListener('click', function () { show('cart'); render(); history.replaceState(null, '', location.pathname); });
  $('#checkout').addEventListener('submit', function (e) {
    e.preventDefault(); if (!P.check(this)) return;
    var no = 'PK-' + (20000 + Math.floor(Math.random() * 70000));
    P.cart.save([]); P.store.set('pilk-promo', '');
    $('#orderNo').textContent = P.t('Order {no} received.', { no: no });
    $('#orderLead').textContent = P.t('Thank you. The invoice and download links go to {email}.', { email: $('#cEmail').value.trim() });
    show('done'); var d = $('#doneView'); d.setAttribute('tabindex', '-1'); d.focus(); scrollTo({ top: 0 });
  });
  render();
  if (location.hash === '#checkout' && P.cart.count()) show('checkout'); else show('cart');
})();
