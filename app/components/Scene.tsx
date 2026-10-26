"use client";

import { useEffect, useRef } from "react";
import { HERO } from "../sprites";

// The night scene behind the first viewport, drawn at 384x216 and scaled up crisp. Layers move a few pixels with the
// pointer (parallax); stars twinkle, fireflies drift, the inn's windows flicker and the hero breathes.
const W = 384;
const H = 216;
const GROUND = 140;

const SKY = ["#120d2b", "#171036", "#1d1442", "#24194f", "#2c1f5c", "#352569", "#3f2c76"];

// A small deterministic generator so the sky is the same on every visit.
function rng(seed: number) {
  let s = seed;
  return () => ((s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
}

function ridge(seed: number, base: number, amp: number, step: number) {
  const r = rng(seed);
  const pts: number[] = [];
  let h = base;
  for (let x = 0; x <= W + 64; x += step) {
    h = Math.max(base - amp, Math.min(base + amp / 3, h + (r() - 0.5) * amp * 0.9));
    pts.push(Math.round(h));
  }
  return (x: number) => {
    const i = Math.floor(x / step);
    const t = (x % step) / step;
    return Math.round(pts[i] + (pts[i + 1] - pts[i]) * t);
  };
}

export default function Scene() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const g = cv.getContext("2d");
    if (!g) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const r = rng(7);
    const stars = Array.from({ length: 70 }, () => ({ x: Math.floor(r() * W), y: Math.floor(r() * 110), p: r() * 6, big: r() > 0.88 }));
    const flies = Array.from({ length: 9 }, (_, i) => ({ x: 20 + i * 41 + r() * 20, y: 96 + r() * 40, p: r() * 6 }));
    const far = ridge(11, 90, 24, 24);
    const mid = ridge(23, 118, 12, 16);
    const pines = [12, 30, 44, 150, 166, 181, 330, 352, 371].map((x, i) => ({ x, h: 12 + ((i * 7) % 9) }));

    let px = 0;
    const onMove = (e: PointerEvent) => {
      px = (e.clientX / window.innerWidth) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);

    const dot = (x: number, y: number, c: string) => {
      g.fillStyle = c;
      g.fillRect(Math.round(x), Math.round(y), 1, 1);
    };

    let raf = 0;
    const t0 = performance.now();
    const draw = (now: number) => {
      const t = (now - t0) / 1000;
      const o1 = Math.round(px * 2), o2 = Math.round(px * 5), o3 = Math.round(px * 9);

      // Sky in flat bands, moon, stars.
      SKY.forEach((c, i) => {
        g.fillStyle = c;
        g.fillRect(0, i * 18, W, 18);
      });
      g.fillStyle = SKY[SKY.length - 1];
      g.fillRect(0, SKY.length * 18, W, H);
      for (let y = -11; y <= 11; y++)
        for (let x = -11; x <= 11; x++) {
          const d = x * x + y * y;
          if (d <= 121) dot(318 - o1 + x, 42 + y, d > 100 ? "#d9c98f" : (x - 3) * (x - 3) + (y + 2) * (y + 2) < 10 ? "#e8d79c" : "#fff3c4");
        }
      for (const s of stars) {
        const on = still || Math.sin(t * 1.7 + s.p * 3) > -0.6;
        if (!on) continue;
        const c = s.big ? "#fff3c4" : "#b9b4e0";
        dot(s.x - o1, s.y, c);
        if (s.big && (still || Math.sin(t * 2.3 + s.p) > 0.3)) {
          dot(s.x - o1 - 1, s.y, "#6d5fb0"); dot(s.x - o1 + 1, s.y, "#6d5fb0");
          dot(s.x - o1, s.y - 1, "#6d5fb0"); dot(s.x - o1, s.y + 1, "#6d5fb0");
        }
      }

      // Far mountains with snow caps, then mid hills with pines and the inn.
      for (let x = 0; x < W; x++) {
        const h = far(x + 32 + o1);
        g.fillStyle = "#3b2c7c"; g.fillRect(x, h, 1, H - h);
        g.fillStyle = "#9b8fd8"; g.fillRect(x, h, 1, h < 76 ? 2 : 0);
      }
      for (let x = 0; x < W; x++) {
        const h = mid(x + 32 + o2);
        g.fillStyle = "#2a1f63"; g.fillRect(x, h, 1, H - h);
      }
      for (const p of pines) {
        const bx = p.x - o2, by = mid(p.x + 32) ;
        g.fillStyle = "#1c1548";
        for (let i = 0; i < p.h; i++) {
          const w = Math.floor(i / 2) + 1;
          g.fillRect(bx - w, by - p.h + i, w * 2 + 1, 1);
        }
        g.fillRect(bx, by, 1, 3);
      }
      // The inn: walls, roof, chimney smoke, lit windows.
      const ix = 252 - o2, iy = GROUND - 30;
      g.fillStyle = "#4a3557"; g.fillRect(ix, iy, 44, 30);
      g.fillStyle = "#5c4369"; g.fillRect(ix, iy, 44, 3);
      g.fillStyle = "#8c3a5c";
      for (let i = 0; i < 14; i++) g.fillRect(ix - 4 + i, iy - 14 + i, 52 - i * 2, 1);
      g.fillStyle = "#6b2d4a"; g.fillRect(ix - 4, iy - 1, 52, 1);
      g.fillStyle = "#3a2a46"; g.fillRect(ix + 32, iy - 20, 5, 10);
      if (!still) for (let i = 0; i < 4; i++) {
        const sy = iy - 24 - ((t * 6 + i * 7) % 28);
        dot(ix + 34 + Math.round(Math.sin(t + i) * 2), sy, "#6d5fb0");
      }
      const flick = still || Math.sin(t * 9) > -0.85 ? "#ffb347" : "#e89a3a";
      g.fillStyle = flick;
      g.fillRect(ix + 6, iy + 9, 6, 6); g.fillRect(ix + 32, iy + 9, 6, 6);
      g.fillStyle = "#2b1d33"; g.fillRect(ix + 18, iy + 14, 8, 16);
      g.fillStyle = "#ffd36b"; g.fillRect(ix + 24, iy + 20, 1, 1);
      g.fillStyle = "#ffb34733"; g.fillRect(ix + 4, iy + 30, 36, 3);

      // Ground: grass lip, dirt, a stone path.
      g.fillStyle = "#3f7d4a"; g.fillRect(0, GROUND, W, 4);
      g.fillStyle = "#5fa865";
      for (let x = (o3 % 6 + 6) % 6; x < W; x += 6) g.fillRect(x, GROUND - 1, 2, 1);
      g.fillStyle = "#3b2a3f"; g.fillRect(0, GROUND + 4, W, H - GROUND);
      g.fillStyle = "#4c3650";
      for (let x = ((o3 % 22) + 22) % 22; x < W; x += 22) { g.fillRect(x, GROUND + 12, 9, 3); g.fillRect(x + 11, GROUND + 22, 7, 3); }

      // Fireflies.
      for (const f of flies) {
        const fx = f.x + Math.sin(t * 0.7 + f.p) * 10 - o2, fy = f.y + Math.cos(t * 0.9 + f.p) * 6;
        if (still || Math.sin(t * 3 + f.p * 2) > -0.2) { dot(fx, fy, "#ffd36b"); g.fillStyle = "#ffd36b40"; g.fillRect(Math.round(fx) - 1, Math.round(fy) - 1, 3, 3); }
      }

      // The hero, breathing, at twice the scene's pixel size: the one speaking in the dialogue box.
      const bob = still ? 0 : Math.floor(t * 2) % 2;
      const hx = 150 - o3, hy = GROUND - 32 + bob * 2;
      g.fillStyle = "#0a0b2666"; g.fillRect(hx + 6, GROUND, 20, 2);
      HERO.rows.forEach((row, y) => {
        for (let x = 0; x < row.length; x++) {
          const c = HERO.pal[row[x]];
          if (c && !(bob && y === 15)) { g.fillStyle = c; g.fillRect(hx + x * 2, hy + y * 2, 2, 2); }
        }
      });

      if (!still) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);
  return <canvas ref={ref} width={W} height={H} className="scene" aria-hidden="true" />;
}
