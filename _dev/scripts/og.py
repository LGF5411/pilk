#!/usr/bin/env python3
"""Social images, drawn by the banner engine itself (1200 x 630, JPG):
   img/og-<lang>.jpg      Pilk's own banner, per language (home and other pages)
   img/set-<id>.jpg       each set in English; set-<id>-et.jpg, set-<id>-ru.jpg in Estonian and Russian
   img/logo.png           512 x 512 mark for the Organization schema
Run: python3 scripts/og.py, then build.py again. Needs playwright + Chrome."""
import json, pathlib, subprocess
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
REPO = ROOT.name == '_dev'
ASSETS = ROOT.parent if REPO else ROOT
LANGS = json.loads((ROOT / 'config.json').read_text())['langs']
IMG = ASSETS / 'img'; IMG.mkdir(exist_ok=True)
ids = json.loads(subprocess.run(['node', '-e', "global.window={};require('%s');console.log(JSON.stringify(window.PILK.designs.map(d=>d.id)))" % (ASSETS / 'js' / 'data.js')], capture_output=True, text=True).stdout)

PAGE = '''<!doctype html><html><head><meta charset="utf-8">
<script>var Q=new URLSearchParams(location.search);document.documentElement.lang=Q.get('l')||'en'</script>
<link rel="stylesheet" href="css/palette.css"><link rel="stylesheet" href="css/site.css">
<style>html,body{margin:0;padding:0;display:block;background:var(--bg)}#c{position:relative;width:1200px;height:630px;overflow:hidden}
.bnr-frame{border-radius:0!important;box-shadow:none!important}#L{width:512px;height:512px;display:grid;place-items:center}#L .logo{font-size:168px;padding:0}#L .logo-eye{animation:none}</style>
</head><body><div id="c"></div><div id="L" hidden><span class="logo"><span>p<span class="logo-i">ı<i class="logo-eye"><b></b></i></span>lk</span></span></div>
<script src="js/data.js"></script><script src="js/i18n.js"></script><script src="js/banner.js"></script>
<script>var P=window.PILK;P.ready(function(){
 if(Q.get('logo')){document.getElementById('c').hidden=true;document.getElementById('L').hidden=false;document.body.dataset.done=1;return}
 var d=P.design(Q.get('id')||'pilk'),c=document.getElementById('c');c.style.background=d.bg;
 var l=new P.Live(c,d,{fw:1,fh:1,anim:false});l.go('1200x628');setTimeout(function(){document.body.dataset.done=1},700)})</script></body></html>'''

tmp = ASSETS / '_og.html'; tmp.write_text(PAGE)
try:
    with sync_playwright() as pw:
        b = pw.chromium.launch(executable_path='/usr/bin/google-chrome')
        pg = b.new_page(viewport={'width': 1200, 'height': 630}); errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        def shot(q, out, **kw):
            pg.goto(tmp.as_uri() + q); pg.wait_for_selector('body[data-done]', state='attached', timeout=8000)
            pg.screenshot(path=str(IMG / out), **kw)
        jobs = [('?l=%s' % l, 'og-%s.jpg' % l) for l in LANGS]
        jobs += [('?l=%s&id=%s' % (l, i), 'set-%s%s.jpg' % (i, '' if l == 'en' else '-' + l)) for i in ids for l in LANGS]
        for q, out in jobs: shot(q, out, type='jpeg', quality=82)
        pg.set_viewport_size({'width': 512, 'height': 512}); shot('?logo=1', 'logo.png')
        b.close()
    print('images:', len(jobs) + 1, '-> %s' % IMG, '| errors:', errs[:3])
finally:
    tmp.unlink()
