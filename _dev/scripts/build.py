#!/usr/bin/env python3
"""Pilk builder: pages x languages (en at the root, et/ and ru/ folders), static catalogue, SEO files.
  python3 scripts/build.py            build into site/  (inside the repo, _dev/scripts/build.py builds into the repo root)
  python3 scripts/build.py --extract  write src/i18n/en.json: page text to translate (id -> English)
Page syntax: {{i:name}} 18px icon, {{I:name}} 28px icon, {{x:name}} bare svg, {{slot}} filled by the renderers below.
Front matter: <!--@ title="" desc="" js="" nav="" body="" robots="noindex" -->
Translations: src/i18n/<lang>.json maps ids of text runs to translated runs (keep tags and {{...}} as they are);
UI strings and catalogue data for JS and for the renderers live in js/i18n.js."""
import math, re, os, sys, json, shutil, hashlib, pathlib, subprocess, datetime
ROOT = pathlib.Path(__file__).resolve().parent.parent
REPO = ROOT.name == '_dev'
ASSETS = ROOT.parent if REPO else ROOT
OUT = ROOT.parent if REPO else ROOT / 'site'
SRC = ROOT / 'src'
CFG = json.loads((ROOT / 'config.json').read_text())
BASE, LANGS = CFG['base'].rstrip('/'), CFG['langs']
EMAIL = CFG.get('email') or 'hello@pilk.studio'
ICONS = pathlib.Path(os.environ.get('LUCIDE', '/tmp/pk/node_modules/lucide-static/icons'))
OGL = {'en': 'en_US', 'et': 'et_EE', 'ru': 'ru_RU'}
JS_ICONS = ['plus', 'check', 'x', 'trash-2', 'arrow-right', 'layers', 'play', 'monitor', 'smartphone', 'printer',
            'clock', 'download', 'circle-check', 'triangle-alert', 'shopping-bag', 'pen-line', 'key-round', 'rotate-ccw',
            'calendar-days', 'euro', 'file-image', 'file-text', 'clapperboard', 'swatch-book', 'layout-grid', 'receipt']

_cache = {}
def svg(name, cls):
    if name not in _cache:
        s = (ICONS / (name + '.svg')).read_text()
        s = re.sub(r'<!--.*?-->', '', s, flags=re.S).strip()
        s = re.sub(r'\s*\n\s*', ' ', s).replace('stroke-width="2"', 'stroke-width="1.6"')
        _cache[name] = re.sub(r'\s(width|height)="24"', '', s)
    return re.sub(r'class="lucide[^"]*"', 'class="%s" aria-hidden="true" focusable="false"' % cls, _cache[name], count=1)
def icons(h):
    h = re.sub(r'\{\{i:([a-z0-9-]+)\}\}', lambda m: svg(m.group(1), 'ico-s'), h)
    h = re.sub(r'\{\{I:([a-z0-9-]+)\}\}', lambda m: svg(m.group(1), 'ico'), h)
    return re.sub(r'\{\{x:([a-z0-9-]+)\}\}', lambda m: svg(m.group(1), 'ix'), h)
def part(n): return (SRC / 'partials' / (n + '.html')).read_text()
def esc(s): return str(s).replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;')

# ---------- catalogue: data.js + i18n.js evaluated by node for one language ----------
def catalogue(lang):
    code = 'global.window={};global.document={documentElement:{lang:%s}};' % json.dumps(lang)
    code += (ASSETS / 'js/data.js').read_text() + '\n' + (ASSETS / 'js/i18n.js').read_text()
    code += '\nprocess.stdout.write(JSON.stringify(window.PILK));'
    return json.loads(subprocess.run(['node', '-e', code], capture_output=True, text=True, check=True).stdout)
def money(n, lang):
    n = int(round(n))
    if lang == 'en': return '€' + ('{:,}'.format(n) if n >= 1000 else str(n))
    return ('{:,}'.format(n).replace(',', ' ') if n >= 10000 else str(n)) + ' €'
def label(f, t=lambda s: s): return '%d × %d%s' % (f['w'], f['h'], ' ' + t('mm') if f.get('u') else '')
def mini(f):
    W, H = f.get('lw', f['w']), f.get('lh', f['h']); r = W / H; rw, rh = 20.0, 14.0
    if r > rw / rh: rh = rw / r
    else: rw = rh * r
    rw, rh = max(rw, 2.4), max(rh, 2.4)
    return '<svg class="mini" viewBox="0 0 24 18" aria-hidden="true" focusable="false"><rect x="%.2f" y="%.2f" width="%.2f" height="%.2f" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>' % (12 - rw / 2, 9 - rh / 2, rw, rh)

# ---------- text runs: maximal stretches of text + inline tags between block tags ----------
TAG = re.compile(r'(<!--.*?-->|<[^>]+>)', re.S)
INLINE = {'b', 'strong', 'em', 'q', 'sup', 'sub', 'br', 'time', 'i'}
def norm(s): return re.sub(r'\s+', ' ', s).strip()
def sid(s): return hashlib.sha1(norm(s).encode()).hexdigest()[:7]
def worthy(s): return len(re.findall(r'[A-Za-z]', re.sub(r'\{\{[^}]*\}\}|<[^>]+>|&\w+;', '', s))) >= 3
def runs(src):
    out, pos, cur = [], 0, None
    for p in TAG.split(src):
        if not p: continue
        if p.startswith('<'):
            m = re.match(r'</?([a-zA-Z0-9]+)', p)
            if m and not p.startswith('<!--') and m.group(1).lower() in INLINE:
                if cur is None: cur = pos
            elif cur is not None: out.append((cur, pos)); cur = None
        elif cur is None: cur = pos
        pos += len(p)
    if cur is not None: out.append((cur, pos))
    return out
def tr1(v, D, bag):
    if not worthy(v): return v
    k = sid(v)
    if bag is not None: bag[k] = norm(v)
    return D[k] if D and k in D else v
def translate(src, D, bag):
    out, last = [], 0
    for a, b in runs(src):
        seg = src[a:b]
        if not worthy(seg): continue
        core = seg.strip(); k = sid(core)
        if bag is not None: bag[k] = norm(core)
        if D and k in D:
            out.append(src[last:a] + seg[:len(seg) - len(seg.lstrip())] + D[k] + seg[len(seg.rstrip()):]); last = b
    out.append(src[last:]); src = ''.join(out)
    src = re.sub(r'\s(placeholder|aria-label|title|data-msg|alt)="([^"]*)"', lambda m: ' %s="%s"' % (m.group(1), tr1(m.group(2), D, bag).replace('"', '&quot;')), src)
    def jt(m):
        o = json.loads(m.group(1))
        for k in o: o[k] = tr1(o[k], D, bag).replace("'", '’')
        return "data-text='%s'" % json.dumps(o, ensure_ascii=False)
    return re.sub(r"data-text='([^']*)'", jt, src)

# ---------- renderers for static catalogue HTML ----------
def shop_items(c, t, lang):
    o = []
    for d in c['designs']:
        tr, href = c['tiers'][d['tier']], 'set-%s.html' % d['id']
        o.append('<article class="cat-item" data-reveal data-id="%s" data-cat="%s" data-style="%s" data-anim="%d" data-pop="%d" data-new="%d" data-price="%d">' % (d['id'], d['cat'], d['style'], d.get('anim', 0), d['pop'], d.get('isNew', 0), tr['display']) +
                 '<a class="cat-stage" href="%s" aria-label="%s"></a>' % (href, esc(t('{name} set, preview', name=d['name']))) +
                 '<div class="cat-meta"><div class="cat-top"><span class="cat-size">300 × 250</span>%s</div>' % ('<span class="tag">%s</span>' % t('New') if d.get('isNew') else '') +
                 '<h3><a href="%s">%s</a></h3>' % (href, esc(d['name'])) +
                 '<div class="cat-buy"><span class="cat-price">%s</span><button type="button" class="btn btn-sm btn-line" data-add="%s" aria-label="%s">{{i:plus}}%s</button></div>' % (money(tr['display'], lang), d['id'], esc(t('Add {name}, display pack, to cart', name=d['name'])), t('Add')) +
                 '<p class="cat-sub"><span>{{i:monitor}}%s</span><span>{{i:layers}}%s</span>%s</p></div></article>' % (t('{pack}, {n} sizes', pack=c['packs']['display']['n'], n=12), t('All 26: {price}', price=money(tr['all'], lang)), '<span>{{i:play}}HTML5</span>' if d.get('anim') else ''))
    return ''.join(o)
def home_shelf(c, t, lang):
    o = []
    for i in ['soft-sale', 'launch-day', 'lunch-story', 'glow-serum', 'sea-sound']:
        d = next(x for x in c['designs'] if x['id'] == i)
        o.append('<a class="shelf-item" href="set-%s.html" data-id="%s"><div class="shelf-stage"></div><div class="shelf-meta"><span class="shelf-size">300 × 250</span><b>%s</b><span class="note">{{i:layers}}%s</span></div></a>' % (i, i, esc(d['name']), t('26 sizes · from {price}', price=money(c['tiers'][d['tier']]['print'], lang))))
    return ''.join(o)
def guide_rows(c, t, lang):
    o = []
    for i in c['packs']['all']['sizes']:
        f, r = c['formats'][i], c['rules'][i]
        o.append('<tr data-id="%s" data-g="%s"><td><div class="guide-pv"></div></td><td><a href="size-%s.html"><b>%s</b></a><span>%s</span></td><td>%s</td><td>%s</td><td>%s</td></tr>' % (i, f['g'], i, esc(f['n']), label(f, t), esc(f['where']), esc(r[0]), esc(c['files'][r[1]])))
    return ''.join(o)
def ratio(f):
    w, h = f.get('lw', f['w']), f.get('lh', f['h']); g = math.gcd(w, h); a, b = w // g, h // g
    if max(a, b) <= 20: return '%d:%d' % (a, b)
    return ('%s:1' % ('%.1f' % (w / h)).rstrip('0').rstrip('.')) if w >= h else ('1:%s' % ('%.1f' % (h / w)).rstrip('0').rstrip('.'))
def lay_class(f):
    r = f['w'] / f['h']
    return 'strip' if r >= 5.5 else 'wide' if r >= 3.2 else 'landscape' if r >= 1.45 else 'square' if r > .82 else 'portrait' if r >= .45 else 'tall'
LAY = {'strip': 'Everything sits on one line: logo, headline, button. The second line is dropped, and the button stays big enough to hit.',
       'wide': 'The headline takes the left in up to two lines, the button stands on the right, and the shape closes the edge.',
       'landscape': 'Words on the left, the shape on the right, the button right under the headline.',
       'square': 'The shape gets the top, the headline sits below in two lines, the button comes last.',
       'portrait': 'Tall art on top, words stacked under it, the button at the bottom where the thumb rests.',
       'tall': 'Narrow letters keep their height, words are stacked one under another, logo on top and button at the bottom.'}
GRP = {'display': 'Google Ads accepts uploaded images up to 150 KB and HTML5 banners up to 600 KB. We keep every file under those limits and name it for upload.',
       'social': 'You get PNG and JPG, kept light. The platform puts its own buttons and captions around the picture, so the words stay away from the edges.',
       'print': 'You get a vector PDF in CMYK with 3 mm bleed, the extra edge that trimming needs. Very large formats are made at 1:10 scale, which print shops accept.'}
def size_slots(c, t, lang, i):
    f, r = c['formats'][i], c['rules'][i]; g = f['g']; pk = c['packs'][g]; lab = label(f, t)
    low = min(tr[g] for tr in c['tiers'].values())
    fact = lambda ic, k, v: '<div><dt>{{i:%s}}%s</dt><dd>%s</dd></div>' % (ic, t(k), v)
    facts = (fact('map-pin', 'Where it runs', esc(f['where'])) + fact('scaling', 'Size', lab) + fact('ratio', 'Aspect ratio', ratio(f)) +
             fact('file-text', 'Files', esc(c['files'][r[1]])) + fact('layers', 'In our packs', esc(t('{pack}, {n} sizes', pack=pk['n'], n=len(pk['sizes'])) + ' · ' + t('from {price}', price=money(low, lang)))))
    sibs = ''.join('<li><a href="size-%s.html">%s<b>%s</b><span>%s</span></a></li>' % (x, mini(c['formats'][x]), esc(c['formats'][x]['n']), label(c['formats'][x], t)) for x in pk['sizes'] if x != i)
    crumbs = '<a href="index.html">%s</a><span aria-hidden="true">/</span><a href="sizes.html">%s</a><span aria-hidden="true">/</span><span>%s</span>' % (t('Home'), t('Size guide'), esc(f['n']))
    cta = '<a class="btn" href="brief.html">%s {{i:arrow-right}}</a><a class="link" href="shop.html">%s</a>' % (t('Get this size free'), t('Browse sets'))
    text = json.dumps({'head': t('Your headline here'), 'sub': t('A second line'), 'cta': t('Button'), 'brand': t('Logo')}, ensure_ascii=False).replace("'", '’')
    return {'sz.id': i, 'sz.h1': esc(f['n']) + ', ' + lab, 'sz.rule': esc(r[0]), 'sz.group': esc(pk['short'] + ' · ' + f['where']), 'sz.facts': facts, 'sz.sibs': sibs, 'sz.crumbs': crumbs, 'sz.cta': cta, 'sz.textattr': " data-text='%s'" % esc(text),
            'sz.hlay': t('How we lay it out'), 'sz.lay': t(LAY[lay_class(f)]), 'sz.hfiles': t('Files you get'), 'sz.grp': t(GRP[g]), 'sz.hsib': esc(t('Other sizes in the {pack}', pack=pk['n'])), 'sz.all': t('All 26 sizes'),
            'sz.title': esc(t('{name} banner size {size}: where it runs and the rule', name=f['n'], size=lab)) + ' — Pilk', 'sz.desc': esc(r[0] + ' ' + t('Where it runs') + ': ' + f['where'] + '. ' + t(GRP[g]))}
def set_slots(c, t, lang, d):
    tr = c['tiers'][d['tier']]
    packs = ''.join('<label class="opt-row"><input type="radio" name="pack" value="%s"%s><span><b>{{i:%s}}%s</b><small>%s</small></span><span class="p-t">%s</span></label>' % (k, ' checked' if k == 'display' else '', c['packs'][k]['icon'], esc(t('{pack}, {n} sizes', pack=c['packs'][k]['n'], n=len(c['packs'][k]['sizes']))), esc(c['packs'][k]['plain']), money(tr[k], lang)) for k in ['display', 'social', 'print', 'all'])
    ex = []
    for k, ic in (('anim', 'clapperboard'), ('edit', 'pen-line')):
        x, off = c['extras'][k], k == 'anim' and not d.get('anim')
        ex.append('<label class="opt-row"><input type="checkbox" name="%s"%s><span><b>{{i:%s}}%s</b><small>%s</small></span><span class="p-t">+%s</span></label>' % (k, ' disabled' if off else '', ic, esc(x['n']), esc(t('This design is static only.') if off else x['plain']), money(x['p'], lang)))
    rows = ''.join('<tr><td>%s%s</td><td>%s</td><td>%s</td></tr>' % (mini(c['formats'][i]), label(c['formats'][i], t), esc(c['formats'][i]['n']), esc(c['formats'][i]['where'])) for i in c['packs']['display']['sizes'])
    return {'set.name': esc(d['name']), 'set.about': esc(d['about']), 'set.packs': packs, 'set.extras': ''.join(ex), 'set.sizes': rows,
            'set.total': money(tr['display'], lang), 'set.pack': esc(c['packs']['display']['n']),
            'set.tag': esc(c['cats'][d['cat']] + ' · ' + c['styles'][d['style']] + (' · ' + t('New') if d.get('isNew') else '')),
            'set.title': esc(t('{name} banner set', name=d['name'])) + ' — Pilk', 'set.desc': esc(d['about'] + ' ' + t('Preview it in every size with your own words.'))}

# ---------- SEO ----------
def url_of(lang, fname): return BASE + '/' + ('' if lang == 'en' else lang + '/') + ('' if fname == 'index.html' else fname)
def jsonld(fname, lang, c, t, d, title, desc, fid=None):
    g, home = [], url_of(lang, 'index.html')
    def crumbs(items): return {'@type': 'BreadcrumbList', 'itemListElement': [{'@type': 'ListItem', 'position': i + 1, 'name': n, 'item': u} for i, (n, u) in enumerate(items)]}
    names = {'shop.html': t('Shop'), 'web.html': t('Websites'), 'studio.html': t('Services'), 'sizes.html': t('Size guide'), 'faq.html': 'FAQ', 'contact.html': t('Contact'), 'brief.html': t('Brief')}
    if fname == 'index.html':
        g.append({'@type': 'Organization', '@id': BASE + '/#org', 'name': 'Pilk Studio', 'url': BASE + '/', 'logo': BASE + '/img/logo.png', 'email': EMAIL,
                  'address': {'@type': 'PostalAddress', 'addressLocality': 'Tallinn', 'addressCountry': 'EE'}, 'areaServed': ['EE', 'LV', 'LT', 'FI'], 'knowsLanguage': ['en', 'et', 'ru']})
        g.append({'@type': 'WebSite', 'name': 'Pilk', 'url': home, 'inLanguage': lang, 'publisher': {'@id': BASE + '/#org'}})
    elif d:
        tr = c['tiers'][d['tier']]
        g.append({'@type': 'Product', 'name': t('{name} banner set', name=d['name']), 'description': d['about'], 'sku': 'PILK-' + d['id'].upper(), 'brand': {'@type': 'Brand', 'name': 'Pilk'},
                  'category': c['cats'][d['cat']], 'image': BASE + '/img/set-%s%s.jpg' % (d['id'], '' if lang == 'en' else '-' + lang), 'url': url_of(lang, fname),
                  'offers': {'@type': 'AggregateOffer', 'priceCurrency': 'EUR', 'lowPrice': tr['print'], 'highPrice': tr['all'], 'offerCount': 4, 'availability': 'https://schema.org/InStock'}})
        g.append(crumbs([(t('Home'), home), (t('Shop'), url_of(lang, 'shop.html')), (d['name'], url_of(lang, fname))]))
    elif fid:
        g.append(crumbs([(t('Home'), home), (t('Size guide'), url_of(lang, 'sizes.html')), (c['formats'][fid]['n'], url_of(lang, fname))]))
    elif fname in names:
        g.append(crumbs([(t('Home'), home), (names[fname], url_of(lang, fname))]))
        if fname == 'shop.html':
            g.append({'@type': 'ItemList', 'itemListElement': [{'@type': 'ListItem', 'position': i + 1, 'url': url_of(lang, 'set-%s.html' % x['id']), 'name': x['name']} for i, x in enumerate(c['designs'])]})
    return {'@context': 'https://schema.org', '@graph': g} if g else None
def seo(fname, lang, title, desc, noindex, ld, d):
    img = BASE + ('/img/set-%s%s.jpg' % (d['id'], '' if lang == 'en' else '-' + lang) if d else '/img/og-%s.jpg' % lang)
    h = ['<link rel="canonical" href="%s">' % url_of(lang, fname)]
    if noindex: h.append('<meta name="robots" content="noindex">')
    else: h += ['<link rel="alternate" hreflang="%s" href="%s">' % (l, url_of(l, fname)) for l in LANGS] + ['<link rel="alternate" hreflang="x-default" href="%s">' % url_of('en', fname)]
    h += ['<meta property="og:type" content="website">', '<meta property="og:site_name" content="Pilk">', '<meta property="og:title" content="%s">' % title,
          '<meta property="og:description" content="%s">' % desc, '<meta property="og:url" content="%s">' % url_of(lang, fname), '<meta property="og:image" content="%s">' % img,
          '<meta property="og:image:width" content="1200">', '<meta property="og:image:height" content="630">', '<meta property="og:locale" content="%s">' % OGL[lang]]
    h += ['<meta property="og:locale:alternate" content="%s">' % OGL[l] for l in LANGS if l != lang] + ['<meta name="twitter:card" content="summary_large_image">']
    if ld: h.append('<script type="application/ld+json">%s</script>' % json.dumps(ld, ensure_ascii=False).replace('</', '<\\/'))
    return '\n'.join(h)

# leftovers too short to be text runs (numbers with units), then euro amounts in ET/RU style: "€1,490" -> "1490 €"
FIX = {'et': [('>€890/mo<', '>890 €/kuu<')],
       'ru': [('>€890/mo<', '>890 €/мес<'), ('>50 ms<', '>50 мс<'), ('>1 s<', '>1 с<'), ('>48 h<', '>48 ч<'), ('>150 KB<', '>150 КБ<')]}
MONEY = re.compile(r'(\+?)€(\d{1,3}(?:,\d{3})+|\d+)(?:–€?(\d{1,3}(?:,\d{3})+|\d+))?')
def loc_money(src, lang):
    if lang == 'en': return src
    def g(x): n = int(x.replace(',', '')); return '{:,}'.format(n).replace(',', '\u00a0') if n >= 10000 else str(n)
    f = lambda m: m.group(1) + g(m.group(2)) + ('–' + g(m.group(3)) if m.group(3) else '') + '\u00a0€'
    return ''.join(p if p.startswith('<') else MONEY.sub(f, p) for p in TAG.split(src))

def build(extract=False):
    bag = {} if extract else None
    if not extract and not REPO:
        if OUT.exists(): shutil.rmtree(OUT)
        OUT.mkdir()
        for dd in ('css', 'js', 'fonts', 'img'):
            if (ASSETS / dd).exists(): shutil.copytree(ASSETS / dd, OUT / dd)
    if not extract: (OUT / 'js' / 'icons.js').write_text('window.PILK=window.PILK||{};PILK.icons=' + json.dumps({n: svg(n, 'ico-s') for n in JS_ICONS}) + ';PILK.cfg=' + json.dumps({'form': CFG.get('form', ''), 'email': EMAIL}) + ';\n')
    sources = {f.name: f.read_text() for f in sorted((SRC / 'pages').glob('*.html'))}
    indexable, today, count = [], datetime.date.today().isoformat(), 0
    for lang in (['en'] if extract else LANGS):
        c = catalogue(lang); T = (c.get('T') or {}).get(lang, {}) if lang != 'en' else {}
        def t(s, **o):
            r = T.get(s, s)
            for k, v in o.items(): r = r.replace('{' + k + '}', str(v))
            return r
        D = None if lang == 'en' else json.loads((SRC / 'i18n' / (lang + '.json')).read_text())
        odir = OUT if lang == 'en' else OUT / lang
        if not extract: odir.mkdir(exist_ok=True)
        jobs = ([(n, s, None, None) for n, s in sources.items() if n not in ('set.html', 'size.html')] + [('set-%s.html' % d['id'], sources['set.html'], d, None) for d in c['designs']] +
                [('size-%s.html' % i, sources['size.html'], None, i) for i in c['packs']['all']['sizes']])
        for fname, raw, d, fid in jobs:
            m = re.match(r'<!--@(.*?)-->\s*', raw, re.S)
            meta = dict(re.findall(r'(\w+)="(.*?)"', m.group(1))) if m else {}
            bare, raw_only = meta.get('layout') == 'bare', meta.get('i18n') == 'off'   # example sites: own layout, text left as written
            body = raw[m.end():] if raw_only else translate(raw[m.end():] if m else raw, D, bag)
            if not raw_only:
                for x, y in FIX.get(lang, []): body = body.replace(x, y)
                body = loc_money(body, lang)
            title, desc = (meta.get('title', 'Pilk'), meta.get('desc', '')) if raw_only else (tr1(meta.get('title', 'Pilk'), D, bag), tr1(meta.get('desc', ''), D, bag))
            dbar = translate(part('demobar'), D, bag)
            head, hdr, foot = translate(part('head'), D, bag), translate(part('header'), D, bag), translate(part('footer'), D, bag)
            if extract: continue
            S = set_slots(c, t, lang, d) if d else size_slots(c, t, lang, fid) if fid else {}
            if '{{shopItems}}' in body: S['shopItems'] = shop_items(c, t, lang)
            if '{{homeShelf}}' in body: S['homeShelf'] = home_shelf(c, t, lang)
            if '{{guideRows}}' in body: S['guideRows'] = guide_rows(c, t, lang)
            for k, v in S.items(): body, title, desc = body.replace('{{%s}}' % k, v), title.replace('{{%s}}' % k, v), desc.replace('{{%s}}' % k, v)
            pre = '' if lang == 'en' else '../'
            links = ''.join('<a href="%s%s%s" hreflang="%s" lang="%s"%s>%s</a>' % (pre, '' if l == 'en' else l + '/', fname, l, l, ' aria-current="true"' if l == lang else '', l.upper()) for l in LANGS)
            nav = meta.get('nav')
            if nav: hdr = hdr.replace('data-nav="%s"' % nav, 'data-nav="%s" aria-current="page"' % nav)
            noindex = meta.get('robots') == 'noindex'
            head = (head.replace('{{lang}}', lang).replace('{{title}}', title).replace('{{desc}}', desc).replace('{{body}}', meta.get('body', ''))
                    .replace('{{bodyattr}}', ' data-set="%s"' % d['id'] if d else '').replace('{{seo}}', seo(fname, lang, title, desc, noindex, jsonld(fname, lang, c, t, d, title, desc, fid), d)))
            js = ''.join('<script src="js/%s.js"></script>' % j for j in meta.get('js', '').split() if j)
            if bare:
                html = icons(head.replace('</head>', '<link rel="stylesheet" href="css/demo.css">\n</head>') + dbar.replace('{{demo.href}}', 'brief.html?type=%s&amp;ex=%s' % (meta.get('type', 'site'), meta.get('ex', ''))) +
                             '<main id="main">' + body + '</main><script src="js/motion-core.js"></script><script src="js/demo.js"></script>\n</body>\n</html>\n')
            else: html = icons(head + hdr.replace('{{langs}}', links) + '<main id="main">' + body + '</main>' + foot.replace('{{pagejs}}', js))
            soc = ''.join('<a class="link" href="%s" rel="me noopener">%s</a>' % (CFG[k], n) for k, n in (('instagram', 'Instagram'), ('tiktok', 'TikTok')) if CFG.get(k))
            html = html.replace('{{social}}', icons('<p class="note ftr-soc">{{i:at-sign}}%s</p>' % soc) if soc else '').replace('hello@pilk.studio', EMAIL)
            if not CFG.get('demo', True): html = re.sub(r'<span data-demo>.*?</span>', '', html)
            if pre: html = html.replace('href="css/', 'href="../css/').replace('src="js/', 'src="../js/').replace('src="img/', 'src="../img/')
            (odir / fname).write_text(html); count += 1
            if lang == 'en' and not noindex: indexable.append(fname)
    if extract:
        (SRC / 'i18n').mkdir(exist_ok=True)
        (SRC / 'i18n' / 'en.json').write_text(json.dumps(bag, ensure_ascii=False, indent=0))
        for lang in LANGS[1:]:
            p = SRC / 'i18n' / (lang + '.json')
            have = json.loads(p.read_text()) if p.exists() else {}
            print(lang, 'missing', len([k for k in bag if k not in have]), 'of', len(bag))
        return
    sm = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">']
    for f in indexable:
        for l in LANGS:
            sm.append('<url><loc>%s</loc><lastmod>%s</lastmod>%s<xhtml:link rel="alternate" hreflang="x-default" href="%s"/></url>' % (url_of(l, f), today, ''.join('<xhtml:link rel="alternate" hreflang="%s" href="%s"/>' % (x, url_of(x, f)) for x in LANGS), url_of('en', f)))
    (OUT / 'sitemap.xml').write_text('\n'.join(sm + ['</urlset>']) + '\n')
    (OUT / 'robots.txt').write_text('User-agent: *\nAllow: /\nDisallow: /_dev/\n\nSitemap: %s/sitemap.xml\n' % BASE)
    print('built', count, 'pages in', len(LANGS), 'languages ->', OUT)

if __name__ == '__main__': build('--extract' in sys.argv)
