(function () {
  var root = document.documentElement, params = new URLSearchParams(location.search);
  var stored = null; try { stored = localStorage.getItem('motion-pref'); } catch (e) {}
  var soft = params.get('motion') === 'reduce' || (stored === 'reduce' && params.get('motion') !== 'full');   // never the OS setting
  root.classList.add('motion-ready'); if (soft) root.classList.add('motion-soft');
  var items = [].slice.call(document.querySelectorAll('[data-reveal]'));
  items.forEach(function (el) { var d = el.getAttribute('data-delay'); if (d) el.style.setProperty('--delay', d + 'ms'); });
  function show(el) { el.classList.add('is-in'); }
  if (!('IntersectionObserver' in window)) { items.forEach(show); }
  else {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } }); }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
    var tio = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) document.body.setAttribute('data-tone-now', e.target.getAttribute('data-tone')); }); }, { rootMargin: '-45% 0px -45% 0px' });
    [].slice.call(document.querySelectorAll('[data-tone]')).forEach(function (t) { tio.observe(t); });
  }
  function sweep() { var vh = innerHeight; items.forEach(function (el) { if (!el.classList.contains('is-in') && el.getBoundingClientRect().top < vh) show(el); }); }
  var scrubs = [].slice.call(document.querySelectorAll('[data-scrub]')), ticking = false;
  function update() {
    ticking = false; var vh = innerHeight;
    root.style.setProperty('--page', (scrollY / Math.max(1, root.scrollHeight - vh)).toFixed(4));
    scrubs.forEach(function (el) { var r = el.getBoundingClientRect();
      var p = el.getAttribute('data-scrub') === 'sticky' ? -r.top / Math.max(1, r.height - vh) : (vh - r.top) / (vh + r.height);
      el.style.setProperty('--p', Math.min(1, Math.max(0, p)).toFixed(4)); });
    sweep();
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll); addEventListener('load', update); update();
  if (window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches && !soft) {
    [].slice.call(document.querySelectorAll('[data-magnet]')).forEach(function (el) {
      el.addEventListener('pointermove', function (e) { var r = el.getBoundingClientRect();
        el.style.setProperty('--mx', ((e.clientX - r.left) / r.width - 0.5).toFixed(3)); el.style.setProperty('--my', ((e.clientY - r.top) / r.height - 0.5).toFixed(3)); });
      el.addEventListener('pointerleave', function () { el.style.setProperty('--mx', 0); el.style.setProperty('--my', 0); });
    });
  }
  window.Motion = { show: show, update: update, soft: soft,
    setReduced: function (on) { try { localStorage.setItem('motion-pref', on ? 'reduce' : 'full'); } catch (e) {} location.reload(); },
    add: function (els) { [].slice.call(els).forEach(function (el) { items.push(el); if (io) io.observe(el); }); sweep(); } };
})();
