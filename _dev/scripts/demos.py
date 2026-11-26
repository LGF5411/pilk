#!/usr/bin/env python3
"""Screenshots of the example sites for the gallery on the Websites page: img/demo-<id>.jpg (1200 x 750).
Run after build.py whenever an example changes, then build again."""
import pathlib, io
from playwright.sync_api import sync_playwright
from PIL import Image
ROOT = pathlib.Path(__file__).resolve().parent.parent
REPO = ROOT.name == '_dev'
SITE = ROOT.parent if REPO else ROOT / 'site'
IMG = (ROOT.parent if REPO else ROOT) / 'img'
with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path='/usr/bin/google-chrome'); pg = b.new_page(viewport={'width': 1200, 'height': 750})
    for f in sorted(SITE.glob('demo-*.html')):
        pg.goto(f.as_uri()); pg.add_style_tag(content='.dbar{display:none!important}'); pg.wait_for_timeout(1600)
        Image.open(io.BytesIO(pg.screenshot())).convert('RGB').save(IMG / (f.stem + '.jpg'), quality=80)
        print(f.stem)
    b.close()
