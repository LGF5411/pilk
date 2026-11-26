#!/usr/bin/env python3
import sys, os, glob, shutil, argparse, pathlib
from playwright.sync_api import sync_playwright
PROFILES = [("pc-1920", dict(viewport={"width": 1920, "height": 1080}), None), ("pc-1440", dict(viewport={"width": 1440, "height": 900}), None),
    ("pc-1920-anim-off", dict(viewport={"width": 1920, "height": 1080}), "reduce"),
    ("phone-390", dict(viewport={"width": 390, "height": 844}, device_scale_factor=2, is_mobile=True, has_touch=True), None)]
PROBE = r"""() => {
 const vis = e => { const s = getComputedStyle(e), r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
 const reveals = [...document.querySelectorAll('[data-reveal]')];
 const hidden = reveals.filter(e => vis(e) && parseFloat(getComputedStyle(e).opacity) < 0.5).map(e => (e.getAttribute('class') || e.tagName) + ': ' + (e.textContent || '').trim().slice(0, 40));
 const texts = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6,p,li,a,button,label,small,span,figcaption,dt,dd,td,th,summary,time')]
   .filter(e => vis(e) && [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())).filter(e => !e.closest('[aria-hidden="true"],[data-allow-overlap]'))
   .filter(e => { for (let n = e; n && n !== document.body; n = n.parentElement) if (parseFloat(getComputedStyle(n).opacity) < 0.1) return false; return true; });
 const lines = texts.map(e => { const r = document.createRange(); r.selectNodeContents(e); const fs = parseFloat(getComputedStyle(e).fontSize);
   return [...r.getClientRects()].filter(b => b.width > 0).map(b => { const cut = Math.max(0, (b.height - fs) / 2); return { left: b.left, right: b.right, top: b.top + cut, bottom: b.bottom - cut }; }); });
 const hit = (A, B, g) => A.left < B.right - g && B.left < A.right - g && A.top < B.bottom - g && B.top < A.bottom - g;
 const inFixed = e => { for (let n = e; n; n = n.parentElement) if (getComputedStyle(n).position === 'fixed') return true; return false; };
 const clash = [];
 for (let i = 0; i < texts.length && clash.length < 15; i++) for (let j = i + 1; j < texts.length; j++) {
   const a = texts[i], b = texts[j]; if (a.contains(b) || b.contains(a)) continue;
   if (!lines[i].some(A => lines[j].some(B => hit(A, B, 2)))) continue; if (inFixed(a) || inFixed(b)) continue;
   clash.push(a.textContent.trim().slice(0, 30) + '  <->  ' + b.textContent.trim().slice(0, 30)); }
 return { reveals: reveals.length, hidden, clash, overflowX: document.documentElement.scrollWidth - innerWidth,
   soft: document.documentElement.classList.contains('motion-soft'), ready: document.documentElement.classList.contains('motion-ready') };
}"""
def pages(t):
    if t.startswith("http"): return [t]
    return [pathlib.Path(f).resolve().as_uri() for f in sorted(glob.glob(os.path.join(t, "**", "*.html"), recursive=True)) if "/vendor/" not in f and "/node_modules/" not in f]
def main():
    ap = argparse.ArgumentParser(); ap.add_argument("target"); ap.add_argument("--out", default="motion-check"); ap.add_argument("--only", default=""); ap.add_argument("--prof", default=""); a = ap.parse_args(); os.makedirs(a.out, exist_ok=True); fails = 0
    exe = next((shutil.which(p) for p in ("google-chrome", "chromium", "chromium-browser") if shutil.which(p)), None)
    with sync_playwright() as pw:
        b = pw.chromium.launch(**({"executable_path": exe} if exe else {}))
        for url in pages(a.target):
            name = url.rstrip("/").split("/")[-1].replace(".html", "") or "index"
            if url.split("/")[-2] in ("et", "ru"): name = url.split("/")[-2] + "-" + name
            if a.only and name not in a.only.split(","): continue
            for prof, opts, rm in PROFILES:
                if a.prof and prof not in a.prof.split(","): continue
                ctx = b.new_context(**opts, reduced_motion=rm or "no-preference"); pg = ctx.new_page()
                errs = []; pg.on("pageerror", lambda e: errs.append(str(e))); pg.on("console", lambda m: m.type == "error" and errs.append(m.text))
                pg.goto(url, wait_until="load"); pg.wait_for_timeout(600); pg.screenshot(path=f"{a.out}/{name}-{prof}-top.png")
                anim = pg.evaluate("() => document.getAnimations().length")
                h = pg.evaluate("document.documentElement.scrollHeight"); vh = opts["viewport"]["height"]; y = 0
                while y < h:
                    if opts.get("has_touch"): pg.evaluate(f"window.scrollTo(0,{y})")
                    else: pg.mouse.wheel(0, vh * 0.6)
                    y += int(vh * 0.6); pg.wait_for_timeout(120); h = pg.evaluate("document.documentElement.scrollHeight")
                pg.wait_for_timeout(1300); r = pg.evaluate(PROBE); pg.screenshot(path=f"{a.out}/{name}-{prof}-full.png", full_page=True)
                bad = []
                if not r["ready"]: bad.append("motion-core did not start")
                if r["hidden"]: bad.append(f"{len(r['hidden'])} reveal blocks stayed invisible: {r['hidden'][:5]}")
                if r["reveals"] and anim == 0: bad.append("no animation was running on first screen")
                if rm and r["soft"]: bad.append("OS reduced-motion softened the site: full motion must be the default on every PC")
                if r["overflowX"] > 1: bad.append(f"horizontal overflow {r['overflowX']}px")
                if r["clash"]: bad.append(f"text touching/overlapping: {r['clash'][:6]}")
                if errs: bad.append(f"JS errors: {errs[:3]}")
                print(("FAIL " if bad else "ok   ") + f"{name:<14} {prof:<18} reveals={r['reveals']} soft={r['soft']}")
                for x in bad: print("       - " + x)
                fails += bool(bad); ctx.close()
        b.close()
    print(f"\n{fails} problem run(s). Screenshots: {a.out}/"); sys.exit(1 if fails else 0)
if __name__ == "__main__": main()
