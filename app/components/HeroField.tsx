"use client";

import { useEffect, useRef } from "react";

// The logo ramp, cycled as the pointer paints.
const RAMP = ["#a65cf2", "#8f60f6", "#7a72fa", "#5f88ff", "#c556c4", "#e3529b", "#ff6266", "#ff7a52", "#ff9445"];
const CELL = 24;
const LIFE = 1500;

/** A pixel grid behind the hero: the pointer lights cells in the logo colors and they fade, like a brush on a canvas.
 *  With no pointer (touch, idle) a few cells light on their own. */
export default function HeroField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    const host = c?.parentElement?.parentElement;
    const g = c?.getContext("2d");
    if (!c || !host || !g) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cells = new Map<number, { c: string; t: number }>();
    let w = 0, h = 0, cols = 0, dpr = 1, raf = 0, n = 0, last = -1, lastMove = 0;

    const resize = () => {
      const r = c.getBoundingClientRect();
      dpr = Math.min(2, devicePixelRatio || 1);
      w = r.width;
      h = r.height;
      c.width = Math.round(w * dpr);
      c.height = Math.round(h * dpr);
      cols = Math.ceil(w / CELL);
    };
    const light = (x: number, y: number) => {
      if (x < 0 || y < 0 || x >= cols || y * CELL >= h) return;
      const key = y * cols + x;
      if (key === last) return;
      last = key;
      cells.set(key, { c: RAMP[n++ % RAMP.length], t: performance.now() });
      if (!raf) raf = requestAnimationFrame(draw);
    };
    const draw = (now: number) => {
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, w, h);
      for (const [key, v] of cells) {
        const age = (now - v.t) / LIFE;
        if (age >= 1) {
          cells.delete(key);
          continue;
        }
        const x = (key % cols) * CELL, y = Math.floor(key / cols) * CELL;
        g.globalAlpha = (1 - age) ** 2 * 0.85;
        g.fillStyle = v.c;
        g.beginPath();
        g.roundRect(x + 3, y + 3, CELL - 6, CELL - 6, 4);
        g.fill();
      }
      raf = cells.size ? requestAnimationFrame(draw) : 0;
    };
    const onMove = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      lastMove = performance.now();
      light(Math.floor((e.clientX - r.left) / CELL), Math.floor((e.clientY - r.top) / CELL));
    };
    const idle = window.setInterval(() => {
      if (document.hidden || performance.now() - lastMove < 2500) return;
      light(Math.floor(Math.random() * cols), Math.floor((Math.random() * h) / CELL));
    }, 420);

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(c);
    host.addEventListener("pointermove", onMove);
    return () => {
      ro.disconnect();
      host.removeEventListener("pointermove", onMove);
      window.clearInterval(idle);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="hero-bg" aria-hidden="true">
      <canvas ref={ref} className="hero-field" />
    </div>
  );
}
