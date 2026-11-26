/* Pilk — brief: five steps, live sizes, estimate and dates */
(function () {
  var P = window.PILK, $ = P.$, $$ = P.$$, form = $('#brief'); if (!form) return;
  var step = 1, N = 5, q = new URLSearchParams(location.search), type = q.get('type'), today = new Date();
  var CH = { google: ['300x250', '336x280', '728x90', '300x600', '160x600', '320x50', '320x100', '970x250'], meta: ['1080x1080', '1080x1350', '1080x1920', '1200x628'], tiktok: ['1080x1920'], linkedin: ['1200x628', '1584x396', '1080x1080'], youtube: ['1280x720'], print: ['rollup', 'a1', 'a5'], outdoor: ['billboard', 'citylight', 'mesh'] };
  function pick(v) { var c = $('input[name=need][value=' + v + ']'); if (c) c.checked = true; }
  if (type === 'campaign') { pick('sets'); pick('motion'); pick('copy'); } else if (type) pick(type);
  var w = P.words.get(); if (w.head) $('#offer').value = w.head;
  function vals(n) { return $$('input[name=' + n + ']:checked').map(function (i) { return i.value; }); }
  function testOnly() { var n = vals('need'); return n.length === 1 && n[0] === 'test'; }
  function sizes() { var s = {}; vals('ch').forEach(function (c) { CH[c].forEach(function (id) { s[id] = 1; }); }); return Object.keys(s); }
  function workDays(from, n) { var d = new Date(from); while (n > 0) { d.setDate(d.getDate() + 1); var k = d.getDay(); if (k && k < 6) n--; } return d; }
  function fdate(d) { return d.toLocaleDateString({ en: 'en-GB', et: 'et-EE', ru: 'ru-RU' }[P.lang] || 'en-GB', { weekday: 'short', day: 'numeric', month: 'short' }); }
  function estimate() {
    var n = vals('need').filter(function (x) { return x !== 'unsure' && x !== 'test'; }), k = sizes().length || 12, l = vals('lang').length || 1, sum = 0;
    if (!n.length) return null;
    n.forEach(function (x) {
      sum += { resize: 190 + Math.max(0, k - 12) * 15, sets: 390 + Math.max(0, k - 12) * 25, motion: 590, copy: 90 * l, templates: 290, always: 890 }[x] || 0;
    });
    return sum;
  }
  function summary() {
    var n = vals('need');
    $('#sNeeds').textContent = n.length ? n.map(function (v) { return $('input[name=need][value=' + v + ']').closest('label').querySelector('b').textContent.trim(); }).join(', ') : '—';
    var s = sizes();
    $('#sSizes').textContent = testOnly() ? P.t('3, free') : s.length ? P.plural(s.length, 'size') : '—';
    $('#sSizeList').textContent = s.length && !testOnly() ? s.map(P.label).join(' · ') : '';
    $('#sLangs').textContent = vals('lang').join(', ') || '—';
    var dv = $('#date').value; $('#sDate').textContent = dv ? fdate(new Date(dv + 'T12:00')) : '—';
    var e = estimate(), est = $('#sEst'), note = $('#sEstNote');
    if (testOnly()) { est.textContent = P.t('Free'); note.textContent = P.t('Three sizes back within 24 working hours.'); }
    else if (e === null) { est.textContent = n.length ? P.t('We’ll suggest') : '—'; note.textContent = P.t(n.length ? 'Tell us the goal; we reply with options and prices.' : 'An estimate appears as you answer.'); }
    else { est.textContent = P.range(e, Math.round(e * 1.2 / 10) * 10); note.textContent = P.t('First sketch by {date}. The final price is fixed in our reply.', { date: fdate(workDays(today, 2)) }) + (n.indexOf('always') > -1 ? ' ' + P.t('Always-on is monthly.') : ''); }
  }
  $('#files').addEventListener('change', function (e) { var f = [].slice.call(e.target.files); $('#fileNames').textContent = f.length ? f.map(function (x) { return x.name; }).join(', ') : P.t('Choose files, or drop them here'); $('#fileErr').hidden = true; });
  var di = $('#date'); di.min = today.toISOString().slice(0, 10);
  di.addEventListener('input', function () {
    if (!di.value) return;
    var need = new Date(di.value + 'T12:00');
    $('#dateNote').innerHTML = need < workDays(today, 3) ? P.ico('triangle-alert') + P.t('Tight. We’ll tell you honestly in our reply whether we can make it.') : P.ico('circle-check') + P.t('Fine. The first sketch would arrive by {date}.', { date: fdate(workDays(today, 2)) });
  });
  form.addEventListener('change', summary); form.addEventListener('input', summary);
  $('#needs').addEventListener('change', function () { $('#needErr').hidden = true; });
  $('#channels').addEventListener('change', function () { $('#chErr').hidden = true; });

  function valid() {
    var f = $('[data-step="' + step + '"]');
    if (step === 1) { var a = vals('need').length > 0; $('#needErr').hidden = a; if (!a) $('input[name=need]').focus(); return a; }
    if (step === 2) { var b = vals('ch').length > 0; $('#chErr').hidden = b; if (!b) $('input[name=ch]').focus(); return b; }
    if (step === 3) { $('#offer').required = !testOnly(); var c = P.check(f); if (testOnly() && !$('#files').files.length) { $('#fileErr').hidden = false; c = false; } return c; }
    return P.check(f);
  }
  function go(n) {
    step = n;
    $$('[data-step]').forEach(function (f) { f.hidden = +f.getAttribute('data-step') !== step; });
    $('#stepNo').textContent = P.t('Step {n} of {N}', { n: step, N: N }); $('#bar').style.transform = 'scaleX(' + step / N + ')';
    $('#back').hidden = step === 1; $('#next').firstChild.textContent = P.t(step === N ? 'Send the brief' : 'Next') + ' ';
    if (step === 3) $('#fileLabel').innerHTML = testOnly() ? P.t('Your banner') + ' <span class="opt-t">' + P.t('(needed for the test)') + '</span>' : P.t('Logo, photos or your current banner') + ' <span class="opt-t">' + P.t('(optional)') + '</span>';
    var top = form.getBoundingClientRect().top + scrollY - 96; if (scrollY > top) scrollTo({ top: top, behavior: P.soft ? 'auto' : 'smooth' });
    var first = $('[data-step="' + step + '"] input'); if (first) first.focus({ preventScroll: true });
    dispatchEvent(new Event('resize'));
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault(); if (!valid()) return;
    if (step < N) { go(step === 1 && testOnly() ? 3 : step + 1); return; }
    var no = 'P-' + (1000 + Math.floor(Math.random() * 9000)), done = $('#briefDone');
    $('#briefWrap').hidden = true; done.hidden = false;
    $('#doneTitle').textContent = P.t('Brief {no} received.', { no: no });
    $('#doneLead').textContent = P.t('Thank you, {name}.', { name: $('#name').value.trim().split(' ')[0] }) + ' ' + (testOnly() ? P.t('Your three free sizes are on their way.') : P.t('We reply to {email} within two working hours.', { email: $('#email').value.trim() }));
    done.setAttribute('tabindex', '-1'); done.focus(); scrollTo({ top: 0 });
  });
  $('#back').addEventListener('click', function () { go(step === 3 && testOnly() ? 1 : step - 1); });
  summary();
})();
