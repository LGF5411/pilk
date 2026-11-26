#!/usr/bin/env python3
import random, math, argparse
def oklch_to_rgb(L, C, h):
    a, b = C*math.cos(math.radians(h)), C*math.sin(math.radians(h))
    l_, m_, s_ = L+0.3963377774*a+0.2158037573*b, L-0.1055613458*a-0.0638541728*b, L-0.0894841775*a-1.2914855480*b
    l, m, s = l_**3, m_**3, s_**3
    rgb = (4.0767416621*l-3.3077115913*m+0.2309699292*s, -1.2684380046*l+2.6097574011*m-0.3413193965*s, -0.0041960863*l-0.7034186147*m+1.7076147010*s)
    f = lambda x: 12.92*x if x <= 0.0031308 else 1.055*x**(1/2.4)-0.055
    return [f(x) for x in rgb]
def in_gamut(L, C, h): return all(-0.001 <= x <= 1.001 for x in oklch_to_rgb(L, C, h))
def fit(L, C, h):
    while C > 0 and not in_gamut(L, C, h): C -= 0.004
    return (L, max(C, 0), h % 360)
def hexc(c): return "#" + "".join(f"{round(min(1,max(0,x))*255):02x}" for x in oklch_to_rgb(*c))
def lum(c):
    g = lambda x: x/12.92 if x <= 0.04045 else ((x+0.055)/1.055)**2.4
    r, gg, b = [g(min(1, max(0, x))) for x in oklch_to_rgb(*c)]; return 0.2126*r+0.7152*gg+0.0722*b
def contrast(a, b): A, B = sorted([lum(a), lum(b)]); return (B+0.05)/(A+0.05)
def near(h, hs, d): return any(min(abs(h-x), 360-abs(h-x)) < d for x in hs)
def make(seed, avoid, dark):
    R = random.Random(seed); d = 35
    while True:
        for _ in range(300):
            h = R.uniform(0, 360)
            if not (250 < h < 320 or near(h, avoid, d)): break
        else:
            d -= 5; continue
        break
    scheme = R.choice(["analogous", "split", "triad", "complement-soft", "mono-pop"])
    off = {"analogous": R.choice([-1, 1])*R.uniform(25, 45), "split": R.uniform(140, 165)*R.choice([-1, 1]), "triad": 120*R.choice([-1, 1]), "complement-soft": 180+R.uniform(-15, 15), "mono-pop": R.uniform(60, 90)}[scheme]
    h2 = (h + off) % 360
    if dark:
        bg, surf = fit(R.uniform(.17, .22), R.uniform(.015, .035), h), fit(.25, .03, h); ink, mute = fit(.96, .01, h), fit(.74, .03, h)
        acc, acc2 = fit(R.uniform(.78, .86), R.uniform(.09, .14), h), fit(R.uniform(.74, .84), R.uniform(.08, .13), h2)
    else:
        bg, surf = fit(R.uniform(.965, .985), R.uniform(.008, .025), h), fit(R.uniform(.93, .955), R.uniform(.015, .035), h2); ink, mute = fit(R.uniform(.2, .26), R.uniform(.02, .045), h), fit(.48, .035, h)
        acc, acc2 = fit(R.uniform(.72, .84), R.uniform(.08, .135), h), fit(R.uniform(.8, .9), R.uniform(.06, .11), h2)
    accink = fit(R.uniform(.38, .46), min(.16, acc[1]+.05), h)
    for _ in range(20):
        if contrast(accink, bg) >= 4.6: break
        accink = fit(accink[0]-.03, accink[1], h) if not dark else fit(accink[0]+.03, accink[1], h)
    return scheme, dict(bg=bg, surface=surf, ink=ink, muted=mute, accent=acc, accent2=acc2, accent_ink=accink)
ap = argparse.ArgumentParser(); ap.add_argument("--seed", type=int); ap.add_argument("--avoid", default=""); ap.add_argument("--dark", action="store_true"); a = ap.parse_args()
seed = a.seed if a.seed is not None else random.SystemRandom().randrange(10**6)
scheme, p = make(seed, [float(x) for x in a.avoid.split(",") if x], a.dark)
print(f"/* palette seed {seed} | {scheme} | base hue {p['accent'][2]:.0f} | ink/bg {contrast(p['ink'], p['bg']):.1f}:1 */\n:root{{")
for k, c in p.items(): print(f"  --{k.replace('_','-')}: {hexc(c)};")
print("}\n@supports (color: oklch(0 0 0)){:root{")
for k, c in p.items(): print(f"  --{k.replace('_','-')}: oklch({c[0]:.3f} {c[1]:.3f} {c[2]:.1f});")
print("}}")
