/* Example sites: the small piece of behaviour each idea needs. */
(function () {
  var $ = function (s) { return document.querySelector(s); }, $$ = function (s) { return [].slice.call(document.querySelectorAll(s)); };
  function eur(n) { return '€' + n; }
  function swap(el) { el.classList.remove('is-swap'); void el.offsetWidth; el.classList.add('is-swap'); }

  /* café: open now? */
  var op = $('[data-open]');
  if (op) {
    var h = op.getAttribute('data-open').split('-'), now = new Date(), t = now.getHours() + now.getMinutes() / 60, wd = now.getDay() > 0 && now.getDay() < 6;
    if (wd && t >= +h[0] && t < +h[1]) { op.classList.add('is-open'); op.querySelector('span').textContent = 'Lunch is on until ' + h[1] + ':00'; }
    var td = $('[data-today]'); if (td) td.textContent = now.toLocaleDateString('en-GB', { weekday: 'long' });
  }

  /* salon: the visit adds itself up */
  var boxes = $$('.sl-groups input');
  if (boxes.length) {
    var upd = function () {
      var p = 0, m = 0, li = '';
      boxes.forEach(function (b) { if (b.checked) { p += +b.dataset.p; m += +b.dataset.m; li += '<li><span>' + b.parentNode.querySelector('b').textContent + '</span><span>' + eur(b.dataset.p) + '</span></li>'; } });
      $('#slList').innerHTML = li; $('#slEmpty').hidden = !!li;
      $('#slTime').textContent = m >= 60 ? Math.floor(m / 60) + ' h ' + (m % 60 ? m % 60 + ' min' : '') : m + ' min'; $('#slTotal').textContent = eur(p);
    };
    boxes.forEach(function (b) { b.addEventListener('change', upd); }); boxes[0].checked = boxes[3].checked = true; upd();
  }

  /* bike workshop: symptom -> fix */
  var FIX = [['Worn or glazed brake pads', 'We clean the rims or discs, replace the pads and set the levers so both brakes bite evenly.', '€18', '30 min', 'pads from €8'],
    ['A stretched cable or a bent hanger', 'We straighten the hanger, set the cable tension and index every gear on the stand.', '€15', '25 min', 'cable €6 if needed'],
    ['Something is still in the tyre', 'We find the thorn or glass, check the rim tape and fit a new tube, not a patch.', '€12', '15 min', 'tube €7'],
    ['A dry or worn chain', 'We measure the wear. A good chain is cleaned and oiled; a stretched one is replaced before it eats the cassette.', '€10', '20 min', 'chain from €16'],
    ['Soft tyres and dry bearings', 'Pressure first: it fixes half of these. Then hubs, bottom bracket and brakes that rub.', '€25', '45 min', 'usually none']];
  var sy = $$('.bk-sym button');
  sy.forEach(function (b) {
    b.addEventListener('click', function () {
      var f = FIX[+b.dataset.s]; sy.forEach(function (x) { x.setAttribute('aria-selected', x === b); });
      $('#bkFix').textContent = f[0]; $('#bkDo').textContent = f[1]; $('#bkP').textContent = f[2]; $('#bkT').textContent = f[3]; $('#bkPa').textContent = f[4]; swap($('.bk-ans'));
    });
  });

  /* concert: countdown and the day's line-up */
  var cd = $('#cnDays');
  if (cd) {
    var n = new Date(), d = new Date(n.getFullYear(), 5, 12); if (d < n) d.setFullYear(d.getFullYear() + 1);
    var left = Math.ceil((d - n) / 864e5), k = 0, tick = function () { k = Math.min(left, k + Math.ceil(left / 40)); cd.textContent = k; if (k < left) requestAnimationFrame(tick); }; tick();
    var DAYS = [[['17:00', 'Kajakas', 'folk, opening the small stage'], ['19:00', 'Soolane', 'indie pop'], ['21:30', 'Tuulepesa', 'headliner, main stage']],
      [['15:00', 'Laste hommik', 'songs for children'], ['18:00', 'Rand & Co', 'jazz quartet'], ['20:00', 'Meri Kutsub', 'electronic'], ['22:00', 'Põhjatäht', 'headliner, main stage']],
      [['14:00', 'Koorilaul', 'two choirs, one pier'], ['17:00', 'Vaikne Vesi', 'acoustic'], ['19:30', 'Lõpukontsert', 'everyone, together']]];
    var tabs = $$('.cn-tabs button'), show = function (i) {
      tabs.forEach(function (x, j) { x.setAttribute('aria-selected', i === j); });
      $('#cnList').innerHTML = DAYS[i].map(function (r, j) { return '<li style="animation-delay:' + j * 70 + 'ms"><time>' + r[0] + '</time><b>' + r[1] + '</b><span>' + r[2] + '</span></li>'; }).join('');
    };
    tabs.forEach(function (x, i) { x.addEventListener('click', function () { show(i); }); }); show(0);
  }

  /* spa: nights and extras -> one bill */
  var sn = $('#spN');
  if (sn) {
    var nights = 2, bill = function () { $('#spT').textContent = eur(nights * 139 - (nights > 1 ? 29 * (nights - 1) : 0) + ($('#spMas').checked ? 60 : 0) + ($('#spDin').checked ? 48 : 0)); sn.textContent = nights; };
    $('#spMinus').addEventListener('click', function () { nights = Math.max(1, nights - 1); bill(); }); $('#spPlus').addEventListener('click', function () { nights = Math.min(5, nights + 1); bill(); });
    $('#spMas').addEventListener('change', bill); $('#spDin').addEventListener('change', bill); bill();
  }

  /* course: twelve weeks, one open at a time */
  var wk = $('#crWeeks');
  if (wk) {
    var W = [['What UX is, and is not', 'You take apart three apps you use every day and find where they lose people.', 'Start'], ['Asking people', 'Five interviews with real users. You learn to stay quiet.', 'Research'], ['What you heard', 'Notes become patterns, patterns become one sentence about the problem.', 'Research'],
      ['Flows', 'You draw the shortest way from wanting to done, on paper.', 'Structure'], ['Wireframes', 'Grey boxes, real words. No colour yet, on purpose.', 'Structure'], ['First test', 'Five people try your grey boxes. Three things break.', 'Testing'],
      ['Type and spacing', 'Why one screen feels calm and another shouts.', 'Visual'], ['Colour and states', 'Buttons that look pressable, errors that help.', 'Visual'], ['Prototype', 'It clicks, it scrolls, it almost feels real.', 'Visual'],
      ['Second test', 'The same five tasks. You measure what got better.', 'Testing'], ['The case', 'You write the story: problem, choices, result.', 'Portfolio'], ['Show it', 'Ten minutes in front of people who hire designers.', 'Portfolio']];
    var auto = true, cur = 0, det = $('.cr-detail');
    wk.innerHTML = W.map(function (w, i) { return '<li><button type="button" aria-pressed="' + (i === 0) + '" aria-label="Week ' + (i + 1) + ': ' + w[0] + '">' + (i + 1) + '<small>' + w[2] + '</small></button></li>'; }).join('');
    var bs = $$('#crWeeks button'), open = function (i) { cur = i; bs.forEach(function (b, j) { b.setAttribute('aria-pressed', i === j); }); $('#crNo').textContent = 'Week ' + (i + 1); $('#crT').textContent = W[i][0]; $('#crD').textContent = W[i][1]; swap(det); };
    bs.forEach(function (b, i) { b.addEventListener('click', function () { auto = false; open(i); }); });
    setInterval(function () { if (auto) open((cur + 1) % 12); }, 2600);
    var qs = $$('#crQ button'), res = $('#crRes'), TXT = ['Answer honestly. Nobody is watching.', 'One yes. Maybe read the weeks again first.', 'Two out of three. Come to the open evening and decide there.', 'Three out of three. There is a seat with your name on it.'];
    qs.forEach(function (b) { b.addEventListener('click', function () { b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') !== 'true'); res.textContent = TXT[qs.filter(function (x) { return x.getAttribute('aria-pressed') === 'true'; }).length]; }); });
  }
})();
