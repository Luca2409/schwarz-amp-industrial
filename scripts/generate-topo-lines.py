"""Generates src/assets/topo-lines.svg: contour lines of a made-up rolling relief,
used as the background pattern of the about section (a nod to the Black Forest).

Run from the project root: python3 scripts/generate-topo-lines.py
Requires numpy and matplotlib. The seed makes the output reproducible.
"""
import numpy as np, matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

W, H = 1600, 900
rng = np.random.default_rng(7)
x = np.linspace(0, W, 400); y = np.linspace(0, H, 225)
X, Y = np.meshgrid(x, y)
Z = np.zeros_like(X)
# rolling Black Forest-like relief: broad ridges, smaller knolls, smoothed noise
hills = [(1250, 260, 260, 1.0), (1450, 720, 200, .7), (850, 780, 280, .55), (300, 140, 230, .55),
         (980, 400, 160, .45), (560, 560, 170, .35), (120, 760, 190, .4), (1580, 120, 150, .35)]
for _ in range(14):
    hills.append((rng.uniform(0, W), rng.uniform(0, H), rng.uniform(50, 110), rng.uniform(.06, .16)))
for cx, cy, s_, h in hills:
    Z += h * np.exp(-(((X - cx) ** 2 + (Y - cy) ** 2) / (2 * s_ ** 2)))
Z += 0.07 * np.sin(X / 190 + 1.3) * np.cos(Y / 150 + .4)
noise = rng.standard_normal(Z.shape)
for _ in range(40):  # cheap smoothing for organic wiggles
    noise = (noise + np.roll(noise, 1, 0) + np.roll(noise, -1, 0) + np.roll(noise, 1, 1) + np.roll(noise, -1, 1)) / 5
Z += 0.25 * noise

cs = plt.contour(X, Y, Z, levels=np.linspace(Z.min() + .05, Z.max() - .02, 22))
paths = []
for level_path in cs.get_paths():
    for seg in level_path.to_polygons(closed_only=False):
        if len(seg) < 60:  # drop tiny islands
            continue
        seg = seg[::3]
        d = "M" + " L".join(f"{px:.0f} {py:.0f}" for px, py in seg)
        paths.append(d)
svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" preserveAspectRatio="xMidYMid slice" '
       f'fill="none" stroke="currentColor" stroke-width="1">\n'
       + "\n".join(f'  <path d="{d}"/>' for d in paths) + "\n</svg>\n")
open("src/assets/topo-lines.svg", "w").write(svg)
print(len(paths), "paths,", len(svg) // 1024, "KB")
