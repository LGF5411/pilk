/* Pilk — home: the resizing hero, blink test, shelf, services, process */
(function () {
  var P = window.PILK, $ = P.$, $$ = P.$$, words = P.words.get();

  /* ================= HERO: one banner through six formats, then all 26 ================= */
  var hero = $('#top');
  if (hero) (function () {
    var stage = $('.hero-stage', hero), canvas = $('#heroCanvas'), spreadEl = $('#heroSpread'), sel = $('.sel', hero), dim = $('.sel-dim', hero),
      glow = $('.hero-glow', hero), end = $('.hero-end', hero), cap = $('.hero-cap', hero), rail = $('.rail', hero), hint = $('.hint', hero),
      input = $('#heroWords'), reset = $('.words-reset', hero), safe = $('.safe', hero);
    var KEYS = ['300x250', '728x90', '160x600', '1080x1080', '1080x1920', 'billboard'];
    var SHORT = ['300 × 250', '728 × 90', '160 × 600', '1080²', P.t('Story'), P.t('6 × 3 m')];
    var NOTE = {
      '300x250': P.t('The size advertisers buy most. Two lines of headline, the button where the eye ends.'),
      '728x90': P.t('Everything on one line. The second line steps out, the button stays big enough to hit.'),
      '160x600': P.t('Letters narrow to keep their height. Logo on top, action at the bottom.'),
      '1080x1080': P.t('Feed size. The shape gets room, the words sit low where thumbs stop.'),
      '1080x1920': P.t('Words stay out of the top 13% and bottom 19%. That is where the app puts its buttons.'),
      'billboard': P.t('Read at driving speed: four words, letters about 40 cm tall.')
    };
    var MORPH = .74, SP0 = .8, d = P.pilk;
    var live = new P.Live($('#heroArt'), d, { text: words.head ? { head: words.head } : null, area: innerWidth < 700 ? .5 : .34, fw: .92, fh: .78 });
    live.manual = true;
    var states = [], spread = [], ids = [], mainSlot = null, cur = 0, target = 0, last = 0, raf = 0, near = -1, ready = false, small = innerWidth < 700, lastSp = -1, railPos = [];

    rail.innerHTML = KEYS.map(function (id, i) { var f = P.formats[id]; return '<button type="button" data-i="' + i + '" aria-label="' + P.t('Show {name}, {size}', { name: f.n, size: P.label(id) }) + '">' + P.mini(id) + '<span>' + SHORT[i] + '</span></button>'; }).join('') + '<i class="rail-bar" aria-hidden="true"></i>';
    var railBtns = $$('button', rail), bar = $('.rail-bar', rail);
    function railMeasure() { railPos = railBtns.map(function (b) { return [b.offsetLeft, b.offsetWidth]; }); }
    rail.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      var p = (+b.getAttribute('data-i') / (KEYS.length - 1)) * MORPH, top = hero.getBoundingClientRect().top + scrollY + p * (hero.offsetHeight - innerHeight);
      scrollTo({ top: top + 2, behavior: P.soft ? 'auto' : 'smooth' });
    });

    function spreadList() {
      return small ? ['300x250', '728x90', '160x600', '1080x1080', '1080x1920', 'billboard', '300x600', '1200x628', '320x50', '970x250', 'rollup', 'citylight', '1584x396', 'a1'] : P.packs.all.sizes;
    }
    function buildSpread() {
      spreadEl.innerHTML = ''; spread = [];
      var list = P.byHeight(spreadList()).filter(function (id) { return id !== 'billboard'; });
      ids = list.slice(); ids.splice(Math.floor(ids.length * .6), 0, 'billboard');
      list.forEach(function (id) { var l = new P.Live(spreadEl, d, { text: live.t, anim: false }); l.manual = true; l.id = id; l.st = l.state(id); l.inner(l.st); l.frame.style.visibility = 'hidden'; spread.push(l); });
      layoutSpread();
    }
    function layoutSpread() {
      var cw = canvas.clientWidth, ch = canvas.clientHeight, gap = cw < 520 ? 7 : 12;
      if (!cw || !ch) return;
      var room = ch - end.offsetHeight - 18, pk = P.fitPack(ids, cw, room * .94, gap, 0), y0 = Math.max(0, (room - pk.h) / 2);
      pk.items.forEach(function (it) {
        var box = { s: it.s, w: it.w, h: it.h, x: it.x, y: it.y + y0 };
        if (it.id === 'billboard') { mainSlot = box; return; }
        spread.forEach(function (l) { if (l.id === it.id) { l.slot = box; l.outer(l.st, box); } });
      });
      var mx = 1;
      spread.forEach(function (l) { var dx = l.slot.x + l.slot.w / 2 - mainSlot.x - mainSlot.w / 2, dy = l.slot.y + l.slot.h / 2 - mainSlot.y - mainSlot.h / 2; l.dist = Math.sqrt(dx * dx + dy * dy); mx = Math.max(mx, l.dist); });
      spread.forEach(function (l) { l.delay = l.dist / mx * .5; });
      lastSp = -1;
    }
    function build() { states = KEYS.map(function (id) { return live.state(id); }); buildSpread(); railMeasure(); ready = true; kick(); }

    function dimText(i, te) {
      var A = P.formats[KEYS[i]], B = P.formats[KEYS[i + 1]];
      if (!A.u && !B.u) return Math.round(P.lerp(A.w, B.w, te)) + ' × ' + Math.round(P.lerp(A.h, B.h, te));
      return P.label(KEYS[te < .5 ? i : i + 1]);
    }
    function caption(n) {
      var f = P.formats[KEYS[n]];
      cap.innerHTML = '<p class="cap-name"><b>' + f.n + '</b> <span>' + P.label(KEYS[n]) + ' · ' + f.where + '</span></p><p class="cap-note">' + NOTE[KEYS[n]] + '</p>';
      cap.classList.remove('flip'); void cap.offsetWidth; cap.classList.add('flip');
      railBtns.forEach(function (b, k) { b.setAttribute('aria-current', k === n ? 'true' : 'false'); });
    }
    function draw(p) {
      var mp = P.clamp(p / MORPH, 0, 1), f = mp * (KEYS.length - 1), i = Math.min(KEYS.length - 2, Math.floor(f)), te = P.smooth((f - i - .22) / .56);
      var s = P.mix(states[i], states[i + 1], te), n = te < .5 ? i : i + 1, sp = P.smooth((p - SP0) / .16);
      var box = live.place(s);
      if (sp > 0 && mainSlot) box = { s: P.lerp(box.s, mainSlot.s, sp), x: P.lerp(box.x, mainSlot.x, sp), y: P.lerp(box.y, mainSlot.y, sp) };
      box.w = s.W * box.s; box.h = s.H * box.s;
      live.render(s, box);
      sel.style.transform = 'translate(' + box.x.toFixed(1) + 'px,' + box.y.toFixed(1) + 'px)';
      sel.style.width = box.w + 'px'; sel.style.height = box.h + 'px'; sel.style.opacity = (1 - sp).toFixed(3);
      safe.style.opacity = Math.max(0, 1 - Math.abs(f - 4) * 2.2).toFixed(3);
      dim.textContent = dimText(i, te);
      glow.style.transform = 'translate(' + (box.x - box.w * .1) + 'px,' + (box.y - box.h * .05) + 'px)';
      glow.style.width = box.w * 1.2 + 'px'; glow.style.height = box.h * 1.15 + 'px'; glow.style.opacity = (.55 * (1 - sp * .6)).toFixed(3);
      if (n !== near) { near = n; caption(n); }
      if (railPos.length) { var a = railPos[i], b = railPos[i + 1], k = te; bar.style.transform = 'translateX(' + P.lerp(a[0], b[0], k) + 'px) scaleX(' + P.lerp(a[1], b[1], k) / 100 + ')'; }
      if (sp !== lastSp) {
        lastSp = sp;
        spread.forEach(function (l) {
          var k = P.smooth((sp - l.delay) / .5), fs = l.frame.style;
          fs.visibility = k > 0 ? 'visible' : 'hidden'; fs.opacity = k.toFixed(3);
          if (l.slot) fs.transform = 'translate(' + l.slot.x.toFixed(1) + 'px,' + l.slot.y.toFixed(1) + 'px) scale(' + (.8 + .2 * k).toFixed(3) + ')';
        });
        end.style.opacity = P.smooth((sp - .6) / .4).toFixed(3);
        end.style.visibility = sp > .6 ? 'visible' : 'hidden';
        cap.style.opacity = (1 - sp).toFixed(3);
      }
      stage.classList.toggle('is-on', p > .02);
      hint.style.opacity = (1 - P.clamp(p / .03, 0, 1)).toFixed(2);
    }
    function measure() { var r = hero.getBoundingClientRect(); target = P.clamp(-r.top / Math.max(1, r.height - innerHeight), 0, 1); }
    function frame(now) {
      raf = 0; if (!ready) return;
      var dt = Math.min(50, now - (last || now - 16)); last = now;
      if (P.soft) cur = target; else { cur += (target - cur) * (1 - Math.exp(-dt / 120)); if (Math.abs(target - cur) < .0003) cur = target; }
      draw(cur);
      if (cur !== target) raf = requestAnimationFrame(frame); else last = 0;
    }
    function kick() { measure(); if (!raf) raf = requestAnimationFrame(frame); }
    addEventListener('scroll', kick, { passive: true });
    addEventListener('resize', function () { var s = innerWidth < 700; live.opt.area = s ? .5 : .34; if (ready && s !== small) { small = s; buildSpread(); } railMeasure(); kick(); });
    if (window.ResizeObserver) new ResizeObserver(function () { if (ready) { layoutSpread(); kick(); } }).observe(canvas);
    document.addEventListener('pilk:refit', function () { if (ready) build(); });

    if (words.head) { input.value = words.head; reset.hidden = false; }
    var tw = 0;
    function setWords(v) {
      P.words.set({ head: v }); live.text({ head: v }); reset.hidden = !v;
      clearTimeout(tw); tw = setTimeout(function () {
        states = KEYS.map(function (id) { return live.state(id); });
        spread.forEach(function (l) { l.text({ head: v }); l.st = l.state(l.id); l.inner(l.st); });
        lastSp = -1; kick(); P.shelfWords && P.shelfWords(v);
      }, 60);
    }
    input.addEventListener('input', function () { setWords(input.value.trim()); });
    reset.addEventListener('click', function () { input.value = ''; setWords(''); input.focus(); });
    P.ready(build);
  })();

  /* ================= BLINK TEST: half a second, twice ================= */
  var B = $('#blink');
  if (B) (function () {
    var scr = $('.blink-screen', B), cnt = $('.blink-count', B), q = $('.blink-q', B), step = $('.blink-step', B), opts = $('.blink-opts', B), go = $('#blinkGo'), busy = $('.busy', B);
    var clean = new P.Live($('#blinkB'), P.design('soft-sale'), { text: { head: P.t('Coats −30%'), sub: P.t('Until Sunday'), cta: P.t('Shop coats') }, fw: .98, fh: .98, anim: false });
    var OPTS = [P.t('Shoes −20%'), P.t('Coats −30%'), P.t('Bags −50%')], RIGHT = 1, round = 0, ans = [];
    function fitBusy() { var w = scr.clientWidth, h = scr.clientHeight; busy.style.setProperty('--bs', Math.min(w / 300, h / 250) * .98); }
    addEventListener('resize', function () { fitBusy(); clean.refresh(); });
    P.ready(function () { fitBusy(); clean.go('300x250'); });
    function show(v) { scr.setAttribute('data-show', v); }
    function run() {
      go.hidden = true; opts.hidden = true; step.textContent = P.t('Round {n} of 2', { n: round + 1 }); q.textContent = P.t('Keep your eyes on the frame.');
      var n = 3; show('count'); cnt.textContent = n;
      var iv = setInterval(function () {
        if (--n > 0) { cnt.textContent = n; return; }
        clearInterval(iv); show(round ? 'b' : 'a');
        setTimeout(function () { show('off'); ask(); }, 500);
      }, 650);
    }
    function ask() {
      q.textContent = P.t('What was on sale, and how much?');
      opts.innerHTML = OPTS.map(function (o, i) { return '<button type="button" class="opt" data-i="' + i + '">' + o + '</button>'; }).join('');
      opts.hidden = false; $('button', opts).focus();
    }
    opts.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      ans[round] = +b.getAttribute('data-i');
      if (!round) { round = 1; opts.hidden = true; q.textContent = P.t('Noted. Now the same offer, designed by us.'); setTimeout(run, 1300); }
      else result();
    });
    function line(i, label) { var ok = ans[i] === RIGHT; return '<li>' + P.ico(ok ? 'circle-check' : 'triangle-alert') + '<span><b>' + label + ':</b> ' + P.t('you picked “{opt}”.', { opt: OPTS[ans[i]] }) + ' ' + P.t(ok ? 'Right.' : i ? 'Half a second is short. That is the point.' : 'The loudest number won, not the offer.') + '</span></li>'; }
    function result() {
      opts.hidden = true; show('both'); step.textContent = P.t('Result');
      q.innerHTML = P.t('The offer was <b>{offer}</b> both times.', { offer: OPTS[RIGHT] }) + '<ul class="blink-res">' + line(0, P.t('Busy banner')) + line(1, P.t('Our banner')) + '</ul>';
      go.hidden = false; go.lastChild.textContent = ' ' + P.t('Try again'); round = 0; ans = [];
    }
    go.addEventListener('click', function () { round = 0; ans = []; run(); });
  })();

  /* ================= SHELF: five sets that keep changing size ================= */
  var shelf = $('#homeShelf');
  if (shelf) P.ready(function () {
    var ORDER = ['300x250', '1080x1920', '728x90', '1080x1080', '160x600', '1200x628'], lives = [];
    $$('.shelf-item', shelf).forEach(function (el, i) {
      var l = new P.Live($('.shelf-stage', el), P.design(el.getAttribute('data-id')), { text: words.head ? { head: words.head } : null, align: 'bottom', area: .52, fw: .96, fh: .98 }), lab = $('.shelf-size', el);
      var o = ORDER.slice(i % ORDER.length).concat(ORDER.slice(0, i % ORDER.length));
      l.oncycle = function (id) { lab.textContent = P.label(id); }; lab.textContent = P.label(o[0]);
      P.cycle(l, o, 3000, 1200 + i * 520); lives.push(l);
    });
    addEventListener('resize', function () { lives.forEach(function (l) { l.refresh(); }); });
    var wl = $('[data-words-line]');
    P.shelfWords = function (v) { lives.forEach(function (l) { l.text({ head: v }); }); if (wl) { wl.hidden = !v; $('q', wl).textContent = v; } };
    if (words.head) P.shelfWords(words.head);
    if (wl) $('button', wl).addEventListener('click', function () { var i = $('#heroWords'); if (i) { i.value = ''; i.dispatchEvent(new Event('input')); } else P.shelfWords(''); P.words.set({ head: '' }); });
  });

  /* ================= SERVICES: a live sample opens with each row ================= */
  $$('.svc-row').forEach(function (row) {
    var started = false;
    row.addEventListener('toggle', function () {
      if (!row.open || started) return; started = true;
      var host = $('.svc-demo', row);
      P.ready(function () { var l = new P.Live(host, P.design(row.getAttribute('data-design')), { fw: .96, fh: .92 }); P.cycle(l, row.getAttribute('data-sizes').split(','), 2400, 1400); addEventListener('resize', function () { l.refresh(); }); });
    });
    if (row.open) row.dispatchEvent(new Event('toggle'));
  });

  /* ================= PROCESS: a playhead runs through four steps ================= */
  var proc = $('#process');
  if (proc) (function () {
    var steps = $$('.steps li', proc), fill = $('.track-fill', proc), t = false;
    function upd() {
      t = false; var r = proc.getBoundingClientRect(), p = P.clamp((innerHeight * .75 - r.top) / (r.height * .8), 0, 1);
      fill.style.transform = 'scaleX(' + p.toFixed(3) + ')';
      steps.forEach(function (li, i) { li.classList.toggle('is-on', p >= i / steps.length + .02); });
    }
    addEventListener('scroll', function () { if (!t) { t = true; requestAnimationFrame(upd); } }, { passive: true }); upd();
  })();
})();
