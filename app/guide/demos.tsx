"use client";

import { useEffect, useRef } from "react";

// Small looping pixel demos, one per guide entry: each shows what the tool does on a 64×36 canvas.

const W = 64, H = 36, LOOP = 3200;
type Pt = [number, number];
type Ctx = CanvasRenderingContext2D;

const K = "#0b0a0f", INK = "#f5f2ea", BG = "#1a1825", BG2 = "#201e2c";
const V = "#a65cf2", B = "#5f88ff", P = "#e3529b", C = "#ff6266", A = "#ff9445", G1 = "#3fa58b", G2 = "#2c6b55", DK = "#2b2a3a";
const RAMP = ["#ffe0b0", "#ff9445", "#ff6266", "#c556c4", "#7a4bd6", "#3c2d7a"];

const clamp = (v: number) => Math.max(0, Math.min(1, v));
const prog = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const ease = (v: number) => 1 - (1 - v) ** 3;
const rnd = (i: number) => {
  const s = Math.sin(i * 12.9898) * 43758.5453;
  return s - Math.floor(s);
};
const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const mix = (a: string, b: string, f: number) => {
  const x = hex(a), y = hex(b);
  return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * f)).join(",")})`;
};

const px = (g: Ctx, x: number, y: number, c: string) => {
  g.fillStyle = c;
  g.fillRect(Math.round(x), Math.round(y), 1, 1);
};
const rect = (g: Ctx, x: number, y: number, w: number, h: number, c: string) => {
  g.fillStyle = c;
  g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
};
const dots = (g: Ctx, pts: Pt[], c: string) => pts.forEach(([x, y]) => px(g, x, y, c));

function line(x0: number, y0: number, x1: number, y1: number): Pt[] {
  [x0, y0, x1, y1] = [x0, y0, x1, y1].map(Math.round);
  const out: Pt[] = [];
  const dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1, dy = -Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  for (;;) {
    out.push([x0, y0]);
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) { err += dy; x0 += sx; }
    if (e2 <= dx) { err += dx; y0 += sy; }
  }
  return out;
}
function path(vs: Pt[], closed = false): Pt[] {
  const list = closed ? [...vs, vs[0]] : vs;
  const out: Pt[] = [];
  for (let i = 1; i < list.length; i++) out.push(...line(...list[i - 1], ...list[i]).slice(i > 1 ? 1 : 0));
  return out;
}
function uniq(pts: Pt[]): Pt[] {
  const seen = new Set<string>();
  return pts.filter(([x, y]) => (seen.has(`${x},${y}`) ? false : (seen.add(`${x},${y}`), true)));
}
function ellipse(cx: number, cy: number, rx: number, ry: number): Pt[] {
  const n = Math.max(12, Math.ceil(Math.PI * 2 * Math.max(rx, ry) * 2));
  return uniq(Array.from({ length: n }, (_, i) => [Math.round(cx + rx * Math.cos((i / n) * Math.PI * 2 - Math.PI / 2)), Math.round(cy + ry * Math.sin((i / n) * Math.PI * 2 - Math.PI / 2))] as Pt));
}
function rectPath(x: number, y: number, w: number, h: number): Pt[] {
  return path([[x, y], [x + w - 1, y], [x + w - 1, y + h - 1], [x, y + h - 1]], true);
}
const head = (pts: Pt[], f: number) => pts.slice(0, Math.max(1, Math.ceil(pts.length * f)));
const at = (pts: Pt[], f: number): Pt => pts[Math.min(pts.length - 1, Math.floor(f * (pts.length - 1)))];
const inPoly = (x: number, y: number, vs: Pt[]) => {
  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const [xi, yi] = vs[i], [xj, yj] = vs[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
};
function fillPoly(g: Ctx, vs: Pt[], c: string) {
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (inPoly(x + 0.5, y + 0.5, vs)) px(g, x, y, c);
}
/** Marching ants along a path. */
const ants = (g: Ctx, pts: Pt[], ms: number) => pts.forEach(([x, y], i) => px(g, x, y, ((i + Math.floor(ms / 110)) >> 1) % 2 ? "#ffffff" : K));

const CURSOR = ["K", "KK", "KWK", "KWWK", "KWWWK", "KWWWWK", "KWWKKK", "KWK", "KK"];
function cursor(g: Ctx, x: number, y: number) {
  CURSOR.forEach((row, j) => [...row].forEach((ch, i) => px(g, x + i, y + j, ch === "K" ? K : "#ffffff")));
}
/** A ring that grows from a click. */
function click(g: Ctx, x: number, y: number, age: number) {
  if (age < 0 || age > 1) return;
  const r = Math.round(1 + age * 4);
  g.globalAlpha = 1 - age;
  dots(g, rectPath(x - r, y - r, r * 2 + 1, r * 2 + 1), "#ffffff");
  g.globalAlpha = 1;
}

const SMILEY = ["..yyyy..", ".yyyyyy.", "yykyykyy", "yyyyyyyy", "ykyyyyky", "yykkkkyy", ".yyyyyy.", "..yyyy.."];
function sprite(g: Ctx, rows: string[], x: number, y: number, s = 1, map: Record<string, string> = { y: A, k: DK }) {
  rows.forEach((row, j) => [...row].forEach((ch, i) => map[ch] && rect(g, x + i * s, y + j * s, s, s, map[ch])));
}
const FONT: Record<string, string[]> = {
  P: ["xx.", "x.x", "xx.", "x..", "x.."],
  I: ["xxx", ".x.", ".x.", ".x.", "xxx"],
  X: ["x.x", "x.x", ".x.", "x.x", "x.x"],
  E: ["xxx", "x..", "xx.", "x..", "xxx"],
  L: ["x..", "x..", "x..", "x..", "xxx"],
};
/** Some content to select or move: a little scene. */
function scene(g: Ctx) {
  rect(g, 6, 22, 52, 8, G2);
  rect(g, 6, 22, 52, 2, G1);
  sprite(g, SMILEY, 26, 8, 1);
  rect(g, 12, 14, 6, 8, B);
  rect(g, 44, 12, 8, 10, V);
}
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

type Demo = (g: Ctx, t: number, ms: number) => void;

const DEMOS: Record<string, Demo> = {
  colors: (g, t, ms) => {
    const swapped = t > 0.86;
    rect(g, 4, 4, 9, 9, swapped ? A : V);
    rect(g, 9, 9, 9, 9, K);
    rect(g, 10, 10, 7, 7, swapped ? V : A);
    const l1 = line(24, 10, 58, 10), l2 = line(24, 24, 58, 24);
    const f1 = prog(t, 0.05, 0.4), f2 = prog(t, 0.45, 0.8);
    dots(g, head(l1, f1).flatMap(([x, y]) => [[x, y], [x, y + 1]] as Pt[]), V);
    if (f2 > 0) dots(g, head(l2, f2).flatMap(([x, y]) => [[x, y], [x, y + 1]] as Pt[]), A);
    const [cx, cy] = t < 0.42 ? at(l1, f1) : at(l2, f2);
    cursor(g, cx, cy);
    if (swapped) click(g, 13, 13, (ms % LOOP) / LOOP * 7 - 6);
  },
  "brush-size": (g, t) => {
    [1, 3, 5].forEach((s, i) => {
      const f = prog(t, i * 0.27, i * 0.27 + 0.24);
      const pts = head(line(6, 7 + i * 11, 58, 7 + i * 11), f);
      pts.forEach(([x, y]) => rect(g, x - (s >> 1), y - (s >> 1), s, s, [B, V, P][i]));
      if (f > 0 && f < 1) cursor(g, ...at(pts, 1));
    });
  },
  view: (g, t) => {
    const s = 1 + Math.round(ease(prog(t, 0.1, 0.6)) * 3);
    const x = 32 - 4 * s, y = 18 - 4 * s;
    if (s >= 3) for (let i = 0; i <= 8; i++) {
      rect(g, x + i * s, y, 1, 8 * s, "rgba(255,255,255,.08)");
      rect(g, x, y + i * s, 8 * s, 1, "rgba(255,255,255,.08)");
    }
    sprite(g, SMILEY, x, y, s);
  },
  pencil: (g, t) => {
    const pts = uniq(Array.from({ length: 200 }, (_, i) => [Math.round(6 + i * 0.26), Math.round(18 + 9 * Math.sin((6 + i * 0.26) / 6))] as Pt));
    const drawn = head(path(pts), prog(t, 0.05, 0.75));
    dots(g, drawn, V);
    cursor(g, ...drawn[drawn.length - 1]);
  },
  eraser: (g, t) => {
    const route = path([[8, 10], [56, 14], [10, 22], [54, 27]]);
    const done = head(route, prog(t, 0.05, 0.8));
    const gone = new Set(done.flatMap(([x, y]) => [-1, 0, 1].flatMap((a) => [-1, 0, 1].map((b) => `${x + a},${y + b}`))));
    for (let y = 6; y < 31; y++) for (let x = 6; x < 58; x++) if (!gone.has(`${x},${y}`)) px(g, x, y, B);
    cursor(g, ...done[done.length - 1]);
  },
  spray: (g, t) => {
    const route = path([[8, 26], [26, 10], [40, 24], [56, 10]]);
    const f = prog(t, 0.05, 0.85), n = Math.floor(f * 160);
    for (let k = 0; k < n; k++) {
      const [x, y] = at(route, k / 160), a = rnd(k) * Math.PI * 2, r = rnd(k + 99) * 5;
      px(g, x + Math.cos(a) * r, y + Math.sin(a) * r, k % 3 ? P : V);
    }
    cursor(g, ...at(route, f));
  },
  blur: (g, t) => {
    const f = prog(t, 0.1, 0.8), yy = 4 + f * 28;
    for (let y = 4; y < 32; y++) for (let x = 8; x < 56; x++) {
      const passed = y < yy && x >= 28 && x <= 35;
      const v = passed ? clamp((x - 27.5) / 8) : x < 32 ? 0 : 1;
      px(g, x, y, mix(V, A, v));
    }
    cursor(g, 31, yy);
  },
  jumble: (g, t) => {
    const f = prog(t, 0.05, 0.8), xx = 8 + f * 48;
    for (let y = 6; y < 30; y++) for (let x = 8; x < 56; x++) {
      let sx = x, sy = y;
      if (x < xx && Math.abs(y - 18) < 7 && rnd(x * 97 + y) > 0.45) { sx += rnd(x + y * 31) > 0.5 ? 1 : -1; sy += rnd(x * 7 + y) > 0.5 ? 1 : 0; }
      px(g, x, y, (sx >> 1) % 2 ? G1 : G2);
    }
    cursor(g, xx, 16);
  },
  bucket: (g, t, ms) => {
    const cx = 32, cy = 18, rx = 22, ry = 12, outline = ellipse(cx, cy, rx, ry);
    const f = prog(t, 0.3, 0.75), maxd = 24;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (((x - cx) / (rx - 0.6)) ** 2 + ((y - cy) / (ry - 0.6)) ** 2 < 1 && Math.hypot(x - 36, y - 20) < f * maxd) px(g, x, y, V);
    }
    dots(g, outline, INK);
    cursor(g, 36, 20);
    click(g, 36, 20, ((ms % LOOP) / LOOP - 0.3) * 6);
  },
  gradient: (g, t) => {
    const f = prog(t, 0.05, 0.4);
    if (t > 0.45) for (let y = 4; y < 32; y++) for (let x = 4; x < 60; x++) {
      const v = clamp((x - 8) / 48), th = (BAYER[(y % 4) * 4 + (x % 4)] + 0.5) / 16;
      const lv = Math.min(3, Math.floor(v * 4)), frac = v * 4 - lv, ramp = [V, P, C, A];
      px(g, x, y, frac > th && lv < 3 ? ramp[lv + 1] : ramp[lv]);
    }
    else {
      const pts = head(line(8, 18, 56, 18), f);
      dots(g, pts.filter((_, i) => i % 3 !== 2), INK);
      cursor(g, ...at(pts, 1));
    }
  },
  line: (g, t) => {
    const pts = head(line(8, 30, 56, 6), prog(t, 0.05, 0.6));
    dots(g, pts, A);
    cursor(g, ...at(pts, 1));
  },
  rectangle: (g, t) => {
    const f = ease(prog(t, 0.05, 0.6)), w = 4 + f * 40, h = 3 + f * 22;
    if (t > 0.75) rect(g, 10, 6, w, h, mix(V, BG, 0.45));
    dots(g, rectPath(10, 6, Math.round(w), Math.round(h)), V);
    cursor(g, 10 + w - 1, 6 + h - 1);
  },
  ellipse: (g, t) => {
    const f = ease(prog(t, 0.05, 0.6)), rx = 3 + f * 20, ry = 2 + f * 12;
    dots(g, ellipse(32, 18, Math.round(rx), Math.round(ry)), B);
    cursor(g, 32 + rx, 18 + ry);
  },
  curve: (g, t) => {
    const f1 = prog(t, 0.05, 0.3), f2 = ease(prog(t, 0.38, 0.7));
    const cy = 28 - f2 * 34;
    const pts = f2 > 0
      ? uniq(Array.from({ length: 120 }, (_, i) => {
          const u = i / 119;
          return [Math.round((1 - u) ** 2 * 6 + 2 * (1 - u) * u * 32 + u * u * 58), Math.round((1 - u) ** 2 * 28 + 2 * (1 - u) * u * cy + u * u * 28)] as Pt;
        }))
      : head(line(6, 28, 58, 28), f1);
    dots(g, path(pts.length > 1 ? pts : [...pts, ...pts]), P);
    if (f2 > 0) {
      dots(g, line(32, 28, 32, Math.round(cy)).filter((_, i) => i % 2 === 0), "rgba(255,255,255,.35)");
      cursor(g, 32, Math.max(0, cy));
    } else cursor(g, ...at(pts, 1));
  },
  polygon: (g, t, ms) => {
    const vs: Pt[] = [[10, 28], [18, 6], [42, 4], [56, 18], [36, 32]];
    const n = Math.min(vs.length, 1 + Math.floor(prog(t, 0.05, 0.7) * vs.length));
    const done = t > 0.75;
    if (done) fillPoly(g, vs, mix(C, BG, 0.4));
    dots(g, path(vs.slice(0, n), done), C);
    vs.slice(0, n).forEach(([x, y]) => rect(g, x - 1, y - 1, 3, 3, INK));
    if (!done) {
      const next = vs[Math.min(n, vs.length - 1)], prev = vs[n - 1];
      const k = (prog(t, 0.05, 0.7) * vs.length) % 1;
      const cur: Pt = [prev[0] + (next[0] - prev[0]) * k, prev[1] + (next[1] - prev[1]) * k];
      dots(g, line(...prev, ...cur).filter((_, i) => i % 2 === 0), "rgba(255,255,255,.5)");
      cursor(g, ...cur);
    } else click(g, 36, 32, ((ms % LOOP) / LOOP - 0.75) * 6);
  },
  contour: (g, t) => {
    const vs = Array.from({ length: 48 }, (_, i) => {
      const a = (i / 48) * Math.PI * 2, r = 1 + 0.25 * Math.sin(a * 3);
      return [Math.round(32 + 22 * r * Math.cos(a)), Math.round(18 + 12 * r * Math.sin(a))] as Pt;
    });
    const f = prog(t, 0.05, 0.7);
    if (t > 0.74) fillPoly(g, vs, mix(B, BG, 0.4));
    const pts = path(vs, t > 0.74);
    dots(g, t > 0.74 ? pts : head(pts, f), B);
    if (t <= 0.74) cursor(g, ...at(pts, f));
  },
  marquee: (g, t, ms) => {
    scene(g);
    const f = ease(prog(t, 0.05, 0.55)), w = 3 + f * 30, h = 3 + f * 18;
    ants(g, rectPath(10, 6, Math.round(w), Math.round(h)), ms);
    cursor(g, 10 + w, 6 + h);
  },
  lasso: (g, t, ms) => {
    scene(g);
    const vs = Array.from({ length: 40 }, (_, i) => {
      const a = (i / 40) * Math.PI * 2, r = 1 + 0.2 * Math.sin(a * 4 + 1);
      return [Math.round(30 + 13 * r * Math.cos(a)), Math.round(13 + 9 * r * Math.sin(a))] as Pt;
    });
    const f = prog(t, 0.05, 0.7), pts = path(vs, t > 0.72);
    ants(g, t > 0.72 ? pts : head(pts, f), ms);
    if (t <= 0.72) cursor(g, ...at(pts, f));
  },
  polylasso: (g, t, ms) => {
    scene(g);
    const vs: Pt[] = [[22, 4], [42, 6], [46, 24], [24, 26], [16, 14]];
    const n = Math.min(vs.length, 1 + Math.floor(prog(t, 0.05, 0.7) * vs.length));
    ants(g, path(vs.slice(0, n), t > 0.74), ms);
    if (t <= 0.74) cursor(g, ...vs[n - 1]);
  },
  wand: (g, t, ms) => {
    rect(g, 6, 4, 52, 28, B);
    const blob = (x: number, y: number) => ((x - 30) / 14) ** 2 + ((y - 18) / 9) ** 2 < 1 || ((x - 44) / 8) ** 2 + ((y - 12) / 6) ** 2 < 1;
    for (let y = 4; y < 32; y++) for (let x = 6; x < 58; x++) if (blob(x, y)) px(g, x, y, V);
    if (t > 0.35) {
      const edge: Pt[] = [];
      for (let y = 4; y < 32; y++) for (let x = 6; x < 58; x++) if (blob(x, y) && (!blob(x + 1, y) || !blob(x - 1, y) || !blob(x, y + 1) || !blob(x, y - 1))) edge.push([x, y]);
      edge.forEach(([x, y]) => px(g, x, y, ((x + y + Math.floor(ms / 110)) >> 1) % 2 ? "#ffffff" : K));
    }
    cursor(g, 28, 18);
    click(g, 28, 18, ((ms % LOOP) / LOOP - 0.32) * 6);
  },
  move: (g, t, ms) => {
    rect(g, 6, 24, 52, 6, G2);
    const x = 8 + ease(prog(t, 0.2, 0.7)) * 30;
    sprite(g, SMILEY, x + 2, 12, 1);
    rect(g, x + 1, 20, 10, 4, B);
    ants(g, rectPath(Math.round(x), 10, 12, 15), ms);
    cursor(g, x + 6, 15);
  },
  transform: (g, t) => {
    const a = ease(prog(t, 0.15, 0.7)) * (Math.PI / 6), s = 1 + ease(prog(t, 0.15, 0.7)) * 0.3;
    const cx = 32, cy = 18, hw = 10 * s, hh = 6 * s, co = Math.cos(-a), si = Math.sin(-a);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const dx = x + 0.5 - cx, dy = y + 0.5 - cy, u = dx * co - dy * si, v = dx * si + dy * co;
      if (Math.abs(u) < hw && Math.abs(v) < hh) px(g, x, y, Math.abs(v) < hh / 3 ? A : V);
    }
    const corners: Pt[] = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([sx, sy]) => [cx + sx * (hw + 2) * Math.cos(a) - sy * (hh + 2) * Math.sin(a), cy + sx * (hw + 2) * Math.sin(a) + sy * (hh + 2) * Math.cos(a)] as Pt);
    dots(g, path(corners.map(([x, y]) => [Math.round(x), Math.round(y)] as Pt), true).filter((_, i) => i % 2 === 0), "rgba(255,255,255,.6)");
    corners.forEach(([x, y]) => rect(g, x - 1, y - 1, 3, 3, INK));
    rect(g, cx - 1, cy - 1, 2, 2, A);
    cursor(g, corners[2][0] + 1, corners[2][1] + 1);
  },
  text: (g, t, ms) => {
    const word = "PIXEL", n = Math.min(5, Math.floor(prog(t, 0.05, 0.7) * 6));
    [...word.slice(0, n)].forEach((ch, i) => sprite(g, FONT[ch], 13 + i * 8, 13, 2, { x: [V, B, P, C, A][i] }));
    if (Math.floor(ms / 400) % 2) rect(g, 13 + n * 8, 12, 1, 12, INK);
  },
  eyedropper: (g, t, ms) => {
    const sw: [number, string][] = [[8, V], [24, B], [40, C]];
    sw.forEach(([x, c]) => rect(g, x, 8, 12, 12, c));
    const k = Math.min(2, Math.floor(prog(t, 0.05, 0.9) * 3));
    const local = (prog(t, 0.05, 0.9) * 3) % 1;
    const tx = sw[k][0] + 6, ty = 14;
    const px0 = k === 0 ? 2 : sw[k - 1][0] + 6;
    const cx = px0 + (tx - px0) * ease(Math.min(1, local * 2));
    rect(g, 52, 24, 9, 9, K);
    rect(g, 53, 25, 7, 7, local > 0.5 || k > 0 ? sw[local > 0.5 ? k : k - 1][1] : INK);
    cursor(g, cx, ty);
    if (local > 0.5) click(g, tx, ty, (local - 0.5) * 3);
    void ms;
  },
  slice: (g, t, ms) => {
    scene(g);
    const f = ease(prog(t, 0.05, 0.5)), w = 4 + f * 36, h = 3 + f * 22, x = 12, y = 5;
    dots(g, rectPath(x, y, Math.round(w), Math.round(h)).filter((_, i) => i % 3 !== 2), B);
    if (t > 0.55) {
      const gx = [x + 8, x + w - 9], gy = [y + 6, y + h - 7];
      gx.forEach((v) => dots(g, line(v, y, v, y + h - 1).filter((_, i) => i % 2 === 0), "rgba(95,136,255,.6)"));
      gy.forEach((v) => dots(g, line(x, v, x + w - 1, v).filter((_, i) => i % 2 === 0), "rgba(95,136,255,.6)"));
      [[x, y], [x + w - 1, y], [x, y + h - 1], [x + w - 1, y + h - 1]].forEach(([a, b]) => rect(g, a - 1, b - 1, 3, 3, INK));
    }
    cursor(g, x + w, y + h);
    void ms;
  },
  ink: (g, t) => {
    RAMP.forEach((c, i) => rect(g, 8 + i * 8, 29, 7, 4, c));
    const route = path([[10, 6], [54, 10], [12, 16], [54, 22]]);
    const done = head(route, prog(t, 0.05, 0.85));
    const hit = new Set(done.flatMap(([x, y]) => [-1, 0, 1].flatMap((a) => [-1, 0, 1].map((b) => `${x + a},${y + b}`))));
    for (let y = 4; y < 25; y++) for (let x = 8; x < 56; x++) px(g, x, y, RAMP[hit.has(`${x},${y}`) ? 3 : 2]);
    rect(g, 24, 28, 9, 6, "rgba(0,0,0,0)");
    dots(g, rectPath(23, 28, 9, 6), INK);
    dots(g, rectPath(31, 28, 9, 6), "#ffffff");
    cursor(g, ...done[done.length - 1]);
  },
  "pixel-perfect": (g, t) => {
    const stair: Pt[] = [];
    let x = 0, y = 0;
    for (let i = 0; i < 22; i++) { stair.push([x, y]); if (i % 2) y++; else x++; }
    const f = prog(t, 0.05, 0.7);
    const n = Math.ceil(stair.length * f);
    stair.slice(0, n).forEach(([a, b]) => px(g, 6 + a + a, 6 + b + b, C));
    stair.slice(0, n).forEach(([a, b]) => px(g, 6 + a + a + 1, 6 + b + b, C));
    stair.slice(0, n).forEach(([a, b], i) => i % 2 === 0 && px(g, 36 + a + a, 6 + b + b, G1));
    stair.slice(0, n).forEach(([a, b], i) => i % 2 === 0 && px(g, 37 + a + a, 7 + b + b, G1));
    dots(g, line(32, 4, 32, 32).filter((_, i) => i % 2 === 0), "rgba(255,255,255,.15)");
  },
  symmetry: (g, t) => {
    dots(g, line(32, 2, 32, 34).filter((_, i) => i % 3 !== 2), P);
    const vs = Array.from({ length: 30 }, (_, i) => [Math.round(28 - i * 0.7 - 4 * Math.sin(i / 4)), Math.round(4 + i * 0.95)] as Pt);
    const pts = head(path(vs), prog(t, 0.05, 0.8));
    dots(g, pts, V);
    dots(g, pts.map(([x, y]) => [63 - x, y] as Pt), V);
    cursor(g, ...pts[pts.length - 1]);
  },
  frames: (g, t) => {
    const ys = [6, 12, 18, 12];
    const k = Math.floor((t * 8) % 4);
    sprite(g, SMILEY, 18, ys[k], 1);
    rect(g, 10, 26, 24, 1, G1);
    ys.forEach((yy, i) => {
      rect(g, 38 + (i % 2) * 12, 4 + Math.floor(i / 2) * 14, 11, 12, i === k ? "#2f2b45" : BG2);
      dots(g, rectPath(38 + (i % 2) * 12, 4 + Math.floor(i / 2) * 14, 11, 12), i === k ? V : "rgba(255,255,255,.12)");
      rect(g, 42 + (i % 2) * 12, 6 + Math.floor(i / 2) * 14 + Math.round(yy / 3), 3, 3, A);
    });
  },
  onion: (g, t) => {
    const ys = [6, 9, 14, 20, 14, 9];
    const k = Math.floor((t * 6) % 6);
    const show = (i: number, alpha: number, tint: string) => {
      g.globalAlpha = alpha;
      sprite(g, SMILEY, 14 + i * 6, ys[i], 1, { y: tint, k: tint });
      g.globalAlpha = 1;
    };
    if (k > 1) show(k - 2, 0.25, C);
    if (k > 0) show(k - 1, 0.45, C);
    if (k < 5) show(k + 1, 0.45, B);
    sprite(g, SMILEY, 14 + k * 6, ys[k], 1);
  },
  tilemap: (g, t) => {
    for (let x = 0; x <= 8; x++) rect(g, x * 8, 0, 1, H, "rgba(255,255,255,.06)");
    for (let y = 0; y <= 4; y++) rect(g, 0, y * 8 + 2, W, 1, "rgba(255,255,255,.06)");
    const cells: Pt[] = [[0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3], [2, 2], [3, 2], [4, 2], [5, 1], [6, 1]];
    const n = Math.ceil(prog(t, 0.05, 0.8) * cells.length);
    cells.slice(0, n).forEach(([cx, cy], i) => {
      const x = cx * 8, y = cy * 8 + 3;
      rect(g, x + 1, y, 7, 7, cy === 3 ? "#7a4f36" : G2);
      rect(g, x + 1, y, 7, 2, G1);
      if (i % 2) px(g, x + 3, y + 4, "#5a3a28");
    });
    const [cx, cy] = cells[Math.max(0, n - 1)];
    cursor(g, cx * 8 + 4, cy * 8 + 6);
  },
  terrain: (g, t) => {
    const route = path([[1, 1], [5, 1], [6, 3], [2, 3]]);
    const n = Math.ceil(prog(t, 0.05, 0.8) * route.length);
    const on = new Set<string>();
    route.slice(0, n).forEach(([x, y]) => [0, 1].forEach((a) => [0, 1].forEach((b) => on.add(`${x + a},${y + b}`))));
    const has = (x: number, y: number) => on.has(`${x},${y}`);
    for (let y = 0; y < 5; y++) for (let x = 0; x < 9; x++) {
      if (!has(x, y)) continue;
      const X = x * 7, Y = y * 7;
      rect(g, X, Y, 7, 7, G1);
      if (!has(x, y - 1)) rect(g, X, Y, 7, 2, "#7fd6a8");
      if (!has(x, y + 1)) rect(g, X, Y + 5, 7, 2, G2);
      if (!has(x - 1, y)) rect(g, X, Y, 1, 7, G2);
      if (!has(x + 1, y)) rect(g, X + 6, Y, 1, 7, G2);
    }
    const [cx, cy] = route[Math.max(0, n - 1)];
    cursor(g, cx * 7 + 5, cy * 7 + 5);
  },
  iso: (g, t, ms) => {
    for (let k = -4; k < 12; k++) {
      dots(g, line(k * 16 - 32, 0, k * 16 + 40, 36).filter((_, i) => i % 2 === 0), "rgba(255,255,255,.12)");
      dots(g, line(k * 16 + 40, 0, k * 16 - 32, 36).filter((_, i) => i % 2 === 0), "rgba(255,255,255,.12)");
    }
    const spots: Pt[] = [[24, 9], [40, 9], [32, 17], [24, 25]];
    const [x, y] = spots[Math.floor(t * 4) % 4];
    const d: Pt[] = [[x, y - 4], [x + 8, y], [x, y + 4], [x - 8, y]];
    fillPoly(g, d, mix(V, BG, 0.3));
    ants(g, path(d, true), ms);
    cursor(g, x + 2, y + 1);
  },
  "export-godot": (g, t) => {
    rect(g, 4, 8, 20, 20, BG2);
    sprite(g, SMILEY, 6, 10, 2);
    const f = prog(t, 0.1, 0.5);
    dots(g, line(26, 18, 36, 18).filter((_, i) => i % 2 === 0), "rgba(255,255,255,.3)");
    if (f > 0 && f < 1) rect(g, 26 + f * 10, 17, 3, 3, C);
    [0, 1, 2].forEach((i) => {
      if (t < 0.5 + i * 0.12) return;
      rect(g, 40 + (i % 2) * 11, 6 + Math.floor(i / 2) * 13, 10, 11, "#2f2b45");
      sprite(g, SMILEY, 41 + (i % 2) * 11, 7 + Math.floor(i / 2) * 13 + (i === 1 ? 1 : 0), 1);
    });
    rect(g, 51, 19, 10, 11, "#478cbf");
    rect(g, 53, 22, 2, 2, "#ffffff");
    rect(g, 57, 22, 2, 2, "#ffffff");
  },
  "live-link": (g, t) => {
    const paint = t > 0.15 && t < 0.98, f = prog(t, 0.15, 0.45), arrive = t > 0.62;
    const left = { y: f > 0.5 ? B : A, k: DK };
    rect(g, 2, 6, 24, 24, BG2);
    dots(g, rectPath(2, 6, 24, 24), "rgba(255,255,255,.12)");
    sprite(g, SMILEY, 6, 10, 2, paint ? left : { y: A, k: DK });
    rect(g, 38, 6, 24, 24, "#2a2552");
    rect(g, 38, 24, 24, 6, G2);
    dots(g, rectPath(38, 6, 24, 24), "rgba(255,255,255,.12)");
    sprite(g, SMILEY, 42, 10, 2, arrive && paint && f > 0.5 ? { y: B, k: DK } : { y: A, k: DK });
    dots(g, line(27, 18, 37, 18).filter((_, i) => i % 2 === 0), C);
    const p = prog(t, 0.47, 0.62);
    if (p > 0 && p < 1) rect(g, 27 + p * 8, 17, 3, 3, C);
    if (t < 0.47) cursor(g, 10 + f * 8, 14 + f * 4);
  },
};

function background(g: Ctx) {
  for (let y = 0; y < H; y += 4) for (let x = 0; x < W; x += 4) rect(g, x, y, 4, 4, ((x + y) / 4) % 2 ? BG : BG2);
}

/** The demo for one guide entry; runs only while it is on screen. */
export default function ToolDemo({ id }: { id: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current, g = c?.getContext("2d"), demo = DEMOS[id];
    if (!c || !g || !demo) return;
    const draw = (ms: number) => {
      background(g);
      demo(g, (ms % LOOP) / LOOP, ms);
    };
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      draw(LOOP * 0.99);
      return;
    }
    let raf = 0, on = false;
    const tick = (ms: number) => {
      draw(ms);
      raf = on ? requestAnimationFrame(tick) : 0;
    };
    const io = new IntersectionObserver(([e]) => {
      on = e.isIntersecting;
      if (on && !raf) raf = requestAnimationFrame(tick);
    });
    draw(LOOP * 0.99);
    io.observe(c);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      on = false;
    };
  }, [id]);
  if (!DEMOS[id]) return null;
  return <canvas ref={ref} width={W} height={H} className="doc-demo" aria-hidden="true" />;
}
