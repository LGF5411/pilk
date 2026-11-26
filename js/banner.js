/* Pilk banner engine — one design, every size.
   Layout = geometry per aspect class; text is fitted per size; any two sizes can be morphed. */
(function () {
  var P = window.PILK = window.PILK || {};
  var F = P.formats, uid = 0, SLOTS = ['art', 'logo', 'head', 'sub', 'cta'];
  var FA = "'Anybody Variable','Roboto Flex Variable',system-ui,sans-serif", FM = "'Mona Sans Variable','Roboto Flex Variable',system-ui,sans-serif";
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function smooth(t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); }
  function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  P.clamp = clamp; P.lerp = lerp; P.smooth = smooth; P.ease = ease;
  P.soft = !!(window.Motion && window.Motion.soft);
  P.dims = function (id) { var f = F[id]; return [f.lw || f.w, f.lh || f.h]; };
  P.label = function (id) { var f = F[id]; return f.w + ' × ' + f.h + (f.u ? ' ' + P.t('mm') : ''); };
  P.design = function (id) { if (id === 'pilk') return P.pilk; for (var i = 0; i < P.designs.length; i++) if (P.designs[i].id === id) return P.designs[i]; return P.designs[0]; };

  /* ---------- geometry: rects [x, y, w, h] as fractions of the banner ---------- */
  function geo(W, H, f) {
    var r = W / H, m = Math.min(W, H), g = {}, p, cw, ch, tw;
    if (r >= 5.5) {                                   // thin strip: logo | headline | button | art
      p = H * .16; ch = clamp(H * .46, 18, 60); cw = clamp(ch * 3.1, 62, 210);
      var art = W >= 420 ? Math.min(W * .17, H * 1.5) : 0, lw = W >= 440 ? Math.min(H * 1.8, W * .13) : 0;
      g.art = art ? [W - art, 0, art, H] : null;
      g.cta = [W - art - cw - p * 1.2, (H - ch) / 2, cw, ch];
      g.logo = lw ? [p * 1.2, H * .35, lw, H * .3] : null;
      var hx = lw ? p * 2.4 + lw : p * 1.2;
      g.head = [hx, p * .7, g.cta[0] - p * 1.2 - hx, H - p * 1.4]; g.sub = null;
    } else if (r >= 3.2) {                            // wide strip: text column, button, art
      p = H * .15; ch = clamp(H * .27, 22, 66); cw = clamp(W * .19, 70, 230);
      var art2 = W >= 420 ? W * .22 : 0;
      g.art = art2 ? [W - art2, 0, art2, H] : null;
      g.cta = [W - art2 - cw - p, (H - ch) / 2, cw, ch];
      tw = g.cta[0] - p * 2.2;
      g.logo = [p, p, Math.min(tw * .45, H * 1.1), H * .12];
      g.head = [p, p + H * .19, tw, H * .4];
      g.sub = [p, p + H * .63, tw, H * .13];
    } else if (r >= 1.45) {                           // landscape: words left, art right
      p = m * .085; var aw = W * clamp(.36 + (r - 1.45) * .04, .36, .44);
      g.art = [W - aw, 0, aw, H]; tw = W - aw - p * 2.1;
      ch = clamp(m * .13, 22, 140); cw = Math.min(tw, ch * 3.4);
      g.logo = [p, p, tw * .5, m * .075];
      g.cta = [p, H - p - ch, cw, ch];
      g.sub = [p, g.cta[1] - m * .15, tw, m * .1];
      var hy = p + m * .145; g.head = [p, hy, tw, g.sub[1] - m * .04 - hy];
    } else if (r > .82) {                             // square-ish: art top right, words low
      p = m * .08; g.art = [W * .4, 0, W * .6, H * .5];
      ch = clamp(m * .12, 22, 140); cw = Math.min(W - 2 * p, ch * 3.4);
      g.logo = [p, p, W * .34, m * .07];
      g.cta = [p, H - p - ch, cw, ch];
      g.sub = [p, g.cta[1] - m * .13, W - 2 * p, m * .085];
      g.head = [p, H * .44, W - 2 * p, g.sub[1] - m * .03 - H * .44];
    } else if (r >= .45) {                            // portrait: art on top, logo under it
      p = m * .085; var top = f && f.safe ? .36 : .42, sb = f && f.safe ? H * .19 : 0;
      g.art = [0, 0, W, H * top];
      ch = clamp(m * .13, 22, 160); cw = Math.min(W - 2 * p, ch * 3.6);
      g.logo = [p, H * (top + .03), W * .5, m * .07];
      g.cta = [p, H - p - sb - ch, cw, ch];
      g.sub = [p, g.cta[1] - m * .14, W - 2 * p, m * .09];
      var hy4 = H * (top + .03) + m * .12; g.head = [p, hy4, W - 2 * p, g.sub[1] - m * .035 - hy4];
    } else {                                          // tall
      p = W * .1; ch = clamp(W * .24, 22, 150);
      g.logo = [p, p, W - 2 * p, W * .15];
      g.head = [p, p + W * .26, W - 2 * p, H * .33];
      g.art = [0, H * .5, W, H * .26];
      g.cta = [p, H - p - ch, W - 2 * p, ch];
      g.sub = [p, g.cta[1] - W * .07 - H * .06, W - 2 * p, H * .06];
    }
    var out = {};
    for (var k in g) out[k] = g[k] ? [g[k][0] / W, g[k][1] / H, g[k][2] / W, g[k][3] / H] : null;
    return out;
  }
  function stretch(d, r) { var m = d.font === 'm', wk = d.wk == null ? 1 : d.wk; return clamp(100 + wk * 30 * Math.log(r) / Math.LN2, m ? 78 : 60, m ? 122 : 138); }
  function css(d, k) {
    var fam = 'font-family:' + (d.font === 'm' ? FM : FA) + ';', m = d.font === 'm';
    if (k === 'head') return fam + 'font-weight:' + d.wt + ';line-height:' + (m ? 1.05 : .98) + ';letter-spacing:' + (d.track || -0.01) + 'em;text-transform:' + (d.upper ? 'uppercase' : 'none') + ';';
    if (k === 'sub') return fam + 'font-weight:' + (m ? 460 : 560) + ';line-height:1.14;letter-spacing:' + (d.upper ? .04 : 0) + 'em;';
    if (k === 'cta') return fam + 'font-weight:' + (m ? 620 : 720) + ';font-stretch:100%;line-height:1;text-transform:' + (d.upper ? 'uppercase' : 'none') + ';letter-spacing:' + (d.upper ? .05 : 0) + 'em;';
    return fam + 'font-weight:' + (m ? 700 : 820) + ';line-height:1;letter-spacing:-0.01em;';
  }
  function stOf(k, st) { return k === 'head' ? st : k === 'sub' ? Math.min(st, 112) : k === 'logo' ? clamp(st, 90, 118) : 100; }

  /* ---------- text fitting ---------- */
  var meas = null;
  function fit(text, w, h, style, lo, hi, nowrap) {
    if (!text || w < 2 || h < 2) return 0;
    w = Math.floor(w);   // scrollWidth is whole pixels: a fractional box could never 'fit'
    if (!meas) { meas = document.createElement('div'); meas.setAttribute('aria-hidden', 'true'); document.body.appendChild(meas); }
    meas.style.cssText = 'position:absolute;left:-10000px;top:0;visibility:hidden;pointer-events:none;overflow-wrap:normal;' + style + 'width:' + w + 'px;white-space:' + (nowrap ? 'nowrap' : 'normal') + ';';
    meas.textContent = text;
    var a = lo, b = Math.max(lo, hi), best = 0;
    for (var i = 0; i < 11; i++) {
      var mid = (a + b) / 2; meas.style.fontSize = mid + 'px';
      if (meas.scrollHeight <= h + 1 && meas.scrollWidth <= w) { best = mid; a = mid; } else b = mid;
    }
    return best;
  }
  var cache = {};
  P.state = function (d, id, t) {
    var key = d.id + '|' + id + '|' + t.head + '|' + t.sub + '|' + t.cta + '|' + t.brand;
    if (cache[key]) return cache[key];
    var dm = P.dims(id), W = dm[0], H = dm[1], g = geo(W, H, F[id]), st = stretch(d, W / H), fs = {}, q;
    function px(k) { var a = g[k]; return a && [a[0] * W, a[1] * H, a[2] * W, a[3] * H]; }
    function sty(k) { return css(d, k) + 'font-stretch:' + stOf(k, st).toFixed(1) + '%;'; }
    q = px('head'); fs.head = fit(t.head, q[2], q[3], sty('head'), 4, q[3] * 1.15) || 4;
    q = px('sub'); fs.sub = q && t.sub ? fit(t.sub, q[2], q[3], sty('sub'), 4, Math.min(q[3], fs.head * .52)) : 0; if (fs.sub < 6) fs.sub = 0;
    q = px('cta'); fs.cta = t.cta ? fit(t.cta, q[2] * .8, q[3] * .6, sty('cta'), 4, q[3] * .46, 1) : 0;
    q = px('logo'); fs.logo = q && t.brand ? fit(t.brand, q[2], q[3], sty('logo'), 4, q[3], 1) : 0; if (fs.logo < 6) fs.logo = 0;
    return (cache[key] = { W: W, H: H, g: g, fs: fs, st: st, id: id });
  };
  P.mix = function (a, b, t) {
    if (t <= 0) return a; if (t >= 1) return b;
    // the frame and the art morph; the words keep the nearer layout and cross-fade, so they never collide half-way
    var n = t < .5 ? a : b, o = { W: lerp(a.W, b.W, t), H: lerp(a.H, b.H, t), st: n.st, g: {}, fs: {}, op: {}, id: n.id };
    var dip = smooth((Math.abs(t - .5) - .03) / .3), k = Math.min(o.W / n.W, o.H / n.H);
    SLOTS.forEach(function (s) {
      if (s === 'art') {
        var A = a.g.art, B = b.g.art; if (!A && !B) { o.g.art = null; return; }
        var RA = A || B, RB = B || A;
        o.g.art = [lerp(RA[0], RB[0], t), lerp(RA[1], RB[1], t), lerp(RA[2], RB[2], t), lerp(RA[3], RB[3], t)];
        o.fs.art = 1; o.op.art = lerp(A ? 1 : 0, B ? 1 : 0, t); return;
      }
      if (!n.g[s] || !n.fs[s]) { o.g[s] = null; return; }
      o.g[s] = n.g[s]; o.fs[s] = n.fs[s] * k; o.op[s] = dip;
    });
    return o;
  };

  /* ---------- motifs: 100×100, sliced to any art box ---------- */
  function c(x, y, r, f, cls, ex) { return '<circle' + (cls ? ' class="' + cls + '"' : '') + ' cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + f + '"' + (ex || '') + '/>'; }
  function arch(x, y, w, h, f) { return '<path d="M' + x + ' ' + (y + h) + 'V' + (y + w / 2) + 'a' + w / 2 + ' ' + w / 2 + ' 0 0 1 ' + w + ' 0V' + (y + h) + 'z" fill="' + f + '"/>'; }
  function house(x, y, w, h, f, win) { return '<polygon points="' + x + ',' + (y + h) + ' ' + x + ',' + (y + h * .42) + ' ' + (x + w / 2) + ',' + y + ' ' + (x + w) + ',' + (y + h * .42) + ' ' + (x + w) + ',' + (y + h) + '" fill="' + f + '"/><rect x="' + (x + w * .36) + '" y="' + (y + h * .55) + '" width="' + w * .28 + '" height="' + h * .26 + '" rx="1" fill="' + win + '"/>'; }
  function wheel(x, y, r, d) { return c(x, y, r, 'none', '', ' stroke="' + d.ink + '" stroke-width="3"') + '<g class="m-spin"><path d="M' + (x - r) + ' ' + y + 'H' + (x + r) + 'M' + x + ' ' + (y - r) + 'V' + (y + r) + 'M' + (x - r * .7) + ' ' + (y - r * .7) + 'L' + (x + r * .7) + ' ' + (y + r * .7) + 'M' + (x + r * .7) + ' ' + (y - r * .7) + 'L' + (x - r * .7) + ' ' + (y + r * .7) + '" stroke="' + d.ink + '" stroke-width="1.1"/></g>' + c(x, y, 2.6, d.a3); }
  var M = {
    eye: function (d, u) { var lens = 'M10 50Q50 16 90 50Q50 84 10 50Z';
      return '<defs><clipPath id="pe' + u + '"><path d="' + lens + '"/></clipPath></defs>' + c(50, 50, 36, d.a2) +
        '<g class="m-blink"><path d="' + lens + '" fill="' + d.a1 + '"/><g clip-path="url(#pe' + u + ')"><g class="m-gaze">' + c(50, 50, 15.5, d.a3) + c(50, 50, 7, d.pupil) + c(54, 45.6, 2.6, '#fff') + '</g></g></g>'; },
    sun: function (d) { return c(58, 50, 30, d.a1, 'm-float') + c(58, 50, 16, d.a3, 'm-pulse') + c(24, 70, 7, d.a2, 'm-float'); },
    rings: function (d) { return '<g class="m-spin">' + c(50, 50, 31, d.a2) + c(50, 50, 25, 'none', '', ' stroke="' + d.a1 + '" stroke-width="2.6"') + c(50, 50, 18, d.a3) + c(44, 45, 4.5, d.a1) + c(57, 55, 3.2, d.a1) + c(56, 42, 2.4, d.ink) + '</g>'; },
    cup: function (d) { return c(50, 50, 32, d.a2) + '<rect x="70" y="45" width="15" height="10" rx="5" fill="' + d.a3 + '"/>' + c(50, 50, 23, d.a3) + c(50, 50, 18, d.a1) + '<path class="m-pulse" d="M50 59C42 53 39 49 39 46A5 5 0 0 1 50 44A5 5 0 0 1 61 46C61 49 58 53 50 59Z" fill="' + d.a2 + '"/>'; },
    arcs: function (d) { var s = '', R = [34, 26, 18, 10], C = [d.a1, d.a3, d.a1, d.a3]; for (var i = 0; i < 4; i++) s += '<path d="M' + (50 - R[i]) + ' 74a' + R[i] + ' ' + R[i] + ' 0 0 1 ' + 2 * R[i] + ' 0" fill="none" stroke="' + C[i] + '" stroke-width="6" stroke-linecap="round"/>'; return '<g class="m-float">' + s + '</g>'; },
    arches: function (d) { return arch(16, 34, 26, 42, d.a1) + arch(40, 42, 22, 34, d.a2) + arch(60, 28, 24, 48, d.a3); },
    dots: function (d) { var s = ''; for (var y = 0; y < 5; y++) for (var x = 0; x < 7; x++) { var k = (x * 3 + y * 5) % 7; s += c(14 + x * 12, 26 + y * 12, k ? 3.4 : 4.8, k ? (k < 4 ? d.a1 : d.a2) : d.a3, k ? '' : 'm-pulse'); } return s; },
    orb: function (d, u) { return '<defs><radialGradient id="po' + u + '" cx=".38" cy=".34" r=".7"><stop offset="0" stop-color="' + d.a2 + '"/><stop offset=".5" stop-color="' + d.a1 + '"/><stop offset="1" stop-color="' + d.a1 + '" stop-opacity="0"/></radialGradient></defs>' + c(54, 48, 34, 'url(#po' + u + ')', 'm-float') + c(26, 68, 7, d.a3, 'm-pulse'); },
    burst: function (d) { var p = [], n = 22; for (var i = 0; i < n * 2; i++) { var a = Math.PI * i / n, r = i % 2 ? 26 : 35; p.push((50 + r * Math.cos(a)).toFixed(1) + ',' + (50 + r * Math.sin(a)).toFixed(1)); } return '<polygon class="m-spin" points="' + p.join(' ') + '" fill="' + d.a1 + '"/>' + c(50, 50, 17, d.a3); },
    grid: function (d) { var s = '<g stroke="' + d.a2 + '" stroke-width=".8">'; for (var i = 1; i < 8; i++) s += '<line x1="' + i * 12.5 + '" y1="0" x2="' + i * 12.5 + '" y2="100"/><line x1="0" y1="' + i * 12.5 + '" x2="100" y2="' + i * 12.5 + '"/>'; return s + '</g><polyline class="m-draw" pathLength="100" points="8,70 26,62 42,66 58,46 74,42 92,26" fill="none" stroke="' + d.a1 + '" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>' + c(92, 26, 4.2, d.a3); },
    waves: function (d) { var s = ''; for (var i = 0; i < 5; i++) s += '<path d="M-40 ' + (34 + i * 8) + 'q10 -6 20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0" fill="none" stroke="' + (i % 2 ? d.a3 : d.a1) + '" stroke-width="2.6" stroke-linecap="round"/>'; return '<g class="m-drift">' + s + '</g>'; },
    ripples: function (d) { var st = ' stroke="' + d.a1 + '" stroke-width="1.6"'; return c(50, 52, 30, 'none', 'm-ripple', st) + c(50, 52, 30, 'none', 'm-ripple m-r2', st) + c(50, 52, 14, d.a3) + c(50, 52, 6, d.a1); },
    houses: function (d) { return house(14, 40, 26, 36, d.a1, d.bg) + house(38, 28, 26, 48, d.a3, d.bg) + house(62, 42, 24, 34, d.a2, d.bg); },
    confetti: function (d) { var a = [[18, 30, 0, d.a1], [32, 62, 1, d.a2], [46, 34, 2, d.a3], [62, 58, 0, d.a2], [76, 32, 1, d.a1], [86, 66, 2, d.a1], [24, 72, 1, d.a3], [54, 74, 0, d.a1], [70, 46, 0, d.a3], [40, 50, 1, d.a1], [12, 52, 2, d.a2], [88, 44, 0, d.a2]], s = '';
      a.forEach(function (q, i) { var cl = i % 3 === 0 ? ' class="m-float"' : ''; s += q[2] === 0 ? c(q[0], q[1], 3.6, q[3], i % 3 === 0 ? 'm-float' : '') : q[2] === 1 ? '<rect' + cl + ' x="' + (q[0] - 4) + '" y="' + (q[1] - 2) + '" width="8" height="4" rx="1" fill="' + q[3] + '" transform="rotate(' + (i * 37 % 90 - 45) + ' ' + q[0] + ' ' + q[1] + ')"/>' : '<polygon' + cl + ' points="' + q[0] + ',' + (q[1] - 4) + ' ' + (q[0] + 4) + ',' + (q[1] + 3) + ' ' + (q[0] - 4) + ',' + (q[1] + 3) + '" fill="' + q[3] + '"/>'; });
      return s; },
    wheels: function (d) { return '<path d="M30 58L44 38H62L72 58M44 38L52 58L62 38" fill="none" stroke="' + d.a3 + '" stroke-width="2.6" stroke-linejoin="round"/>' + wheel(30, 58, 16, d) + wheel(72, 58, 16, d); },
    stripes: function (d) { var s = ''; for (var i = -6; i < 14; i++) s += '<rect x="' + i * 10 + '" y="-30" width="4.5" height="160" fill="' + (i % 2 ? d.a1 : d.a2) + '"/>'; return '<g transform="rotate(28 50 50)">' + s + '</g>'; },
    balloons: function (d) { function b(x, y, r, f) { return '<path d="M' + x + ' ' + (y + r * 1.15) + 'Q' + (x + 4) + ' ' + (y + r * 1.15 + 14) + ' 50 86" fill="none" stroke="' + d.ink + '" stroke-width=".8" opacity=".6"/><ellipse cx="' + x + '" cy="' + y + '" rx="' + r + '" ry="' + r * 1.15 + '" fill="' + f + '"/>'; }
      return '<g class="m-sway">' + b(34, 42, 12, d.a1) + b(66, 44, 11, d.a2) + b(50, 32, 13, d.a3) + '</g>'; },
    steps: function (d) { var s = ''; for (var i = 0; i < 5; i++) s += '<rect x="' + (12 + i * 15) + '" y="' + (74 - (i + 1) * 9) + '" width="13" height="' + (i + 1) * 9 + '" rx="1.5" fill="' + (i % 2 ? d.a2 : d.a1) + '"/>'; return s + c(78.5, 22, 5, d.a3, 'm-hop'); },
    squares: function (d) { var s = ''; for (var r = 0; r < 3; r++) for (var k = 0; k < 4; k++) s += '<rect x="' + (14 + k * 19) + '" y="' + (24 + r * 19) + '" width="15" height="15" rx="3" fill="' + (r === 1 && k === 2 ? d.a2 : r === 0 && k === 1 ? d.a3 : d.a1) + '"' + (r === 1 && k === 2 ? ' class="m-pulse"' : '') + '/>'; return s; }
  };
  P.art = function (d) { uid++; return '<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" focusable="false">' + (M[d.motif] || M.sun)(d, uid) + '</svg>'; };
  P.mini = function (id) {
    var dm = P.dims(id), r = dm[0] / dm[1], rw = 20, rh = 14;
    if (r > rw / rh) rh = rw / r; else rw = rh * r;
    rw = Math.max(rw, 2.4); rh = Math.max(rh, 2.4);
    return '<svg class="mini" viewBox="0 0 24 18" aria-hidden="true" focusable="false"><rect x="' + (12 - rw / 2).toFixed(2) + '" y="' + (9 - rh / 2).toFixed(2) + '" width="' + rw.toFixed(2) + '" height="' + rh.toFixed(2) + '" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>';
  };

  /* ---------- a live banner ---------- */
  var lives = [];
  function Live(host, d, opt) {
    opt = opt || {}; this.host = host; this.d = d; this.opt = opt; this.t = {};
    for (var k in d.t) this.t[k] = d.t[k];
    if (opt.text) for (k in opt.text) if (opt.text[k]) this.t[k] = opt.text[k];
    var fr = this.frame = document.createElement('div'), b = this.el = document.createElement('div'), self = this;
    fr.className = 'bnr-frame'; fr.setAttribute('role', 'img');
    b.className = 'bnr' + (d.anim && opt.anim !== false ? ' is-anim' : '');
    b.style.background = d.bg; b.style.color = d.ink; b.setAttribute('aria-hidden', 'true');
    b.innerHTML = '<div class="b-art">' + P.art(d) + '</div><div class="b-logo"></div><div class="b-head"></div><div class="b-sub"></div><div class="b-cta"><span></span></div>';
    this.s = {};
    SLOTS.forEach(function (k) { var el = self.s[k] = b.querySelector('.b-' + k); if (k !== 'art') el.style.cssText = css(d, k); });
    this.s.cta.style.background = d.cta; this.s.cta.style.color = d.ctaInk;
    fr.appendChild(b); host.appendChild(fr); this.words(); lives.push(this);
  }
  Live.prototype.words = function () {
    var t = this.t, s = this.s;
    s.logo.textContent = t.brand || ''; s.head.textContent = t.head || ''; s.sub.textContent = t.sub || ''; s.cta.firstChild.textContent = t.cta || '';
    this.frame.setAttribute('aria-label', P.t('Banner') + ': ' + [t.head, t.sub, t.cta].filter(Boolean).join(' · '));
  };
  Live.prototype.state = function (id) { return P.state(this.d, id, this.t); };
  Live.prototype.inner = function (s) {
    var W = s.W, H = s.H, self = this, d = this.d;
    this.el.style.width = W + 'px'; this.el.style.height = H + 'px';
    SLOTS.forEach(function (k) {
      var el = self.s[k], q = s.g[k], f = k === 'art' ? 1 : s.fs[k], st = el.style;
      if (!q || !f) { st.display = 'none'; return; }
      st.display = ''; st.left = q[0] * W + 'px'; st.top = q[1] * H + 'px'; st.width = q[2] * W + 'px'; st.height = q[3] * H + 'px';
      st.opacity = s.op ? s.op[k] : 1;
      if (k !== 'art') { st.fontSize = f + 'px'; st.fontStretch = stOf(k, s.st).toFixed(1) + '%'; }
      if (k === 'cta') st.borderRadius = (d.r || 0) * q[3] * H + 'px';
    });
  };
  Live.prototype.outer = function (s, box) {
    var fs = this.frame.style;
    fs.transform = 'translate(' + box.x.toFixed(2) + 'px,' + box.y.toFixed(2) + 'px)';
    fs.width = s.W * box.s + 'px'; fs.height = s.H * box.s + 'px';
    this.el.style.transform = 'scale(' + box.s + ')';
  };
  Live.prototype.place = function (s) {
    var o = this.opt, hw = this.host.clientWidth, hh = this.host.clientHeight;
    var sc = Math.min(hw * (o.fw || .94) / s.W, hh * (o.fh || .9) / s.H);
    if (o.area) sc = Math.min(sc, Math.sqrt(hw * hh * o.area / (s.W * s.H)));
    if (o.max) sc = Math.min(sc, o.max);
    var w = s.W * sc, h = s.H * sc;
    return { s: sc, w: w, h: h, x: (hw - w) / 2, y: o.align === 'bottom' ? hh - h : (hh - h) / 2 };
  };
  Live.prototype.render = function (s, box) {
    this.shown = s; this.inner(s); box = box || this.place(s); this.outer(s, box); this.box = box;
    if (this.onrender) this.onrender(s, box);
    return box;
  };
  Live.prototype.go = function (id, dur) {
    var self = this, to = this.state(id), from = this.shown;
    this.fmt = id; cancelAnimationFrame(this.raf);
    if (!dur || !from || P.soft) { this.render(to); return; }
    var t0 = performance.now();
    function step(now) { var k = clamp((now - t0) / dur, 0, 1); self.render(k < 1 ? P.mix(from, to, ease(k)) : to); if (k < 1) self.raf = requestAnimationFrame(step); }
    this.raf = requestAnimationFrame(step);
  };
  Live.prototype.text = function (t) { for (var k in t) this.t[k] = t[k] || this.d.t[k]; this.words(); if (this.fmt) this.render(this.state(this.fmt)); };
  Live.prototype.refresh = function () { if (this.fmt && !this.manual) this.render(this.state(this.fmt)); };
  P.Live = Live;

  /* cycle a banner through sizes while it is on screen */
  P.cycle = function (live, ids, period, delay) {
    var i = 0, timer = 0, on = false;
    live.go(ids[0]);
    function next() { i = (i + 1) % ids.length; live.go(ids[i], 760); if (live.oncycle) live.oncycle(ids[i]); timer = setTimeout(next, period); }
    function start() { if (on) return; on = true; timer = setTimeout(next, delay || period); }
    function stop() { on = false; clearTimeout(timer); }
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) start(); else stop(); }); }).observe(live.host);
    else start();
    return { stop: stop, start: start };
  };

  /* shelf packing: equal visual area, rows standing on one baseline */
  P.pack = function (ids, a, maxW, gap, labelH) {
    var items = ids.map(function (id) { var dm = P.dims(id), sc = a / Math.sqrt(dm[0] * dm[1]); if (dm[0] * sc > maxW) sc = maxW / dm[0]; return { id: id, W: dm[0], H: dm[1], s: sc, w: dm[0] * sc, h: dm[1] * sc }; });
    var rows = [], row = null, y = 0;
    items.forEach(function (it) { if (!row || row.w + gap + it.w > maxW) { row = { items: [], w: -gap, h: 0 }; rows.push(row); } row.items.push(it); row.w += gap + it.w; row.h = Math.max(row.h, it.h); });
    rows.forEach(function (r) { var x = (maxW - r.w) / 2; r.items.forEach(function (it) { it.x = x; it.y = y + r.h - it.h; x += it.w + gap; }); y += r.h + (labelH || 0) + gap; });
    return { items: items, h: Math.max(0, y - gap) };
  };
  P.fitPack = function (ids, maxW, maxH, gap, labelH) {
    var lo = 8, hi = 700, best = null;
    for (var k = 0; k < 16; k++) { var a = (lo + hi) / 2, r = P.pack(ids, a, maxW, gap, labelH); if (r.h <= maxH) { best = r; lo = a; } else hi = a; }
    return best || P.pack(ids, lo, maxW, gap, labelH);
  };
  P.byHeight = function (ids) { return ids.slice().sort(function (a, b) { var A = P.dims(a), B = P.dims(b); return B[1] / B[0] - A[1] / A[0]; }); };

  /* wait for both families before measuring; refit if they arrive late */
  P.ready = function (fn) {
    var done = false; function go() { if (!done) { done = true; fn(); } }
    if (!document.fonts || !document.fonts.load) return go();
    var f = [document.fonts.load("800 20px 'Anybody Variable'"), document.fonts.load("500 20px 'Mona Sans Variable'")];
    if (P.lang === 'ru') f.push(document.fonts.load("800 20px 'Roboto Flex Variable'", 'Яя'));
    Promise.all(f).then(go, go);
    setTimeout(go, 2000);
    document.fonts.addEventListener && document.fonts.addEventListener('loadingdone', function () { if (!done) return; cache = {}; lives.forEach(function (l) { l.refresh(); }); document.dispatchEvent(new Event('pilk:refit')); });
  };
})();
