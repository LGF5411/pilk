#!/usr/bin/env python3
"""Quick screenshots: shots.py page.html WIDTHxHEIGHT out_prefix y1,y2,... (y as px or 'p0.35' = share of page or 'h0.5' = share of #top)"""
import sys, pathlib
from playwright.sync_api import sync_playwright
page_f, vp, out, ys = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4].split(',')
w, h = map(int, vp.split('x'))
url = pathlib.Path(page_f).resolve().as_uri() + (sys.argv[5] if len(sys.argv) > 5 else '')
with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path='/usr/bin/google-chrome')
    mob = w < 600
    ctx = b.new_context(viewport={'width': w, 'height': h}, device_scale_factor=1, is_mobile=mob, has_touch=mob)
    pg = ctx.new_page(); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: m.type == 'error' and errs.append(m.text))
    pg.goto(url, wait_until='load'); pg.wait_for_timeout(900)
    for i, y in enumerate(ys):
        if y.startswith('h'):
            top = pg.evaluate("(()=>{const e=document.querySelector('#top');return e.offsetTop+(e.offsetHeight-innerHeight)*%s})()" % y[1:])
        elif y.startswith('p'):
            top = pg.evaluate("(document.documentElement.scrollHeight-innerHeight)*%s" % y[1:])
        elif y.startswith('#'):
            top = pg.evaluate("document.querySelector('%s').getBoundingClientRect().top+scrollY-70" % y)
        else: top = int(y)
        pg.evaluate("window.scrollTo(0,%d)" % top); pg.wait_for_timeout(1400)
        pg.screenshot(path='%s-%d.png' % (out, i))
    print('errors:', errs[:5])
    b.close()
