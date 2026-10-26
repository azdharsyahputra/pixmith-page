"use client";

import { useEffect, useRef, useState } from "react";
import { HERO } from "../sprites";
import { useLang } from "../i18n";
import { Win } from "./ui";

const N = 16;
const SWATCHES = ["#0a0b26", "#f2a65a", "#8c5cff", "#5b95ff", "#f0508a", "#ff6a4d", "#ffb347", "#7bd389", "#f4f2ff"];

type Px = (string | null)[][];
const fresh = (): Px => HERO.rows.map((r) => r.split("").map((c) => (c === "." ? null : HERO.pal[c])));

/** Paint on the left; the game on the right picks the sprite up when the stroke ends, like Live Link. */
export default function LiveLinkDemo() {
  const { t } = useLang();
  const ed = useRef<HTMLCanvasElement>(null);
  const gm = useRef<HTMLCanvasElement>(null);
  const px = useRef<Px>(fresh());
  const live = useRef<Px>(fresh());
  const [color, setColor] = useState<string | null>(SWATCHES[2]);
  const [pulse, setPulse] = useState(0);
  const colorRef = useRef(color);
  colorRef.current = color;

  const drawEditor = () => {
    const g = ed.current?.getContext("2d");
    if (!g) return;
    const c = ed.current!.width / N;
    for (let y = 0; y < N; y++)
      for (let x = 0; x < N; x++) {
        g.fillStyle = (x + y) % 2 ? "#2a2833" : "#23212b";
        g.fillRect(x * c, y * c, c, c);
        const v = px.current[y][x];
        if (v) {
          g.fillStyle = v;
          g.fillRect(x * c, y * c, c, c);
        }
      }
  };

  const send = () => {
    setPulse((p) => p + 1);
    window.setTimeout(() => {
      live.current = px.current.map((r) => r.slice());
    }, 420);
  };

  useEffect(() => {
    drawEditor();
    const cv = ed.current!;
    let painting = false;
    let changed = false;
    const at = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      return [Math.floor(((e.clientX - r.left) / r.width) * N), Math.floor(((e.clientY - r.top) / r.height) * N)];
    };
    const paint = (e: PointerEvent) => {
      const [x, y] = at(e);
      if (x < 0 || y < 0 || x >= N || y >= N) return;
      if (px.current[y][x] !== colorRef.current) {
        px.current[y][x] = colorRef.current;
        changed = true;
        drawEditor();
      }
    };
    const down = (e: PointerEvent) => {
      painting = true;
      cv.setPointerCapture(e.pointerId);
      paint(e);
    };
    const move = (e: PointerEvent) => painting && paint(e);
    const up = () => {
      if (!painting) return;
      painting = false;
      if (changed) {
        changed = false;
        send();
      }
    };
    cv.addEventListener("pointerdown", down);
    cv.addEventListener("pointermove", move);
    cv.addEventListener("pointerup", up);
    cv.addEventListener("pointercancel", up);

    // The game: a tiny level where the sprite walks back and forth.
    const g = gm.current!.getContext("2d")!;
    const W = gm.current!.width, H = gm.current!.height, GY = H - 34;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const t0 = performance.now();
    const frame = (now: number) => {
      const tt = (now - t0) / 1000;
      g.fillStyle = "#24194f"; g.fillRect(0, 0, W, H);
      g.fillStyle = "#2c1f5c"; g.fillRect(0, 30, W, 30);
      g.fillStyle = "#fff3c4"; g.fillRect(W - 30, 16, 10, 10);
      g.fillStyle = "#3b2c7c";
      for (let i = 0; i < 7; i++) g.fillRect(i * 26 - 6, GY - 34 - (i % 2) * 10, 24, 34 + (i % 2) * 10);
      g.fillStyle = "#3f7d4a"; g.fillRect(0, GY, W, 5);
      g.fillStyle = "#3b2a3f"; g.fillRect(0, GY + 5, W, H - GY - 5);
      g.fillStyle = "#4c3650";
      for (let j = 0; j < W; j += 18) g.fillRect(j + ((j / 18) % 2) * 6, GY + 14, 7, 3);
      const span = W - 56, ph = still ? 30 : (tt * 24) % (span * 2), x = ph < span ? ph : span * 2 - ph;
      const flip = ph >= span, bob = still ? 0 : Math.floor(tt * 6) % 2;
      const ox = Math.round(4 + x), oy = GY - 48 + bob;
      for (let y = 0; y < N; y++)
        for (let xx = 0; xx < N; xx++) {
          const c = live.current[y][flip ? N - 1 - xx : xx];
          if (c) {
            g.fillStyle = c;
            g.fillRect(ox + xx * 3, oy + y * 3, 3, 3);
          }
        }
      if (!still) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      cv.removeEventListener("pointerdown", down);
      cv.removeEventListener("pointermove", move);
      cv.removeEventListener("pointerup", up);
      cv.removeEventListener("pointercancel", up);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="live">
      <Win title={t["live.editor"]} className="live-pane">
        <canvas ref={ed} width={320} height={320} className="live-editor" aria-label="16 by 16 pixel canvas" />
        <div className="swatches" role="group" aria-label="Colors">
          {SWATCHES.map((c) => (
            <button key={c} type="button" style={{ background: c }} aria-label={`Color ${c}`} aria-pressed={color === c} onClick={() => setColor(c)} />
          ))}
          <button type="button" className="erase" aria-label="Eraser" aria-pressed={color === null} onClick={() => setColor(null)}>
            <svg viewBox="0 0 8 8" shapeRendering="crispEdges" aria-hidden="true">
              <path fill="currentColor" d="M4 1h2v1h1v2H6v1H5v1H4v1H1V6H0V4h1V3h1V2h1V1zm-2 3v2h2V5h1V4z" />
            </svg>
          </button>
        </div>
        <div className="live-foot">
          <span>{t["live.hint"]}</span>
          <button
            type="button"
            onClick={() => {
              px.current = fresh();
              drawEditor();
              send();
            }}
          >
            {t["live.reset"]}
          </button>
        </div>
      </Win>
      <div className="wire" aria-hidden="true">
        <span className="wire-label">LIVE LINK</span>
        <span key={pulse} className={pulse ? "packet go" : "packet"} />
      </div>
      <Win title={t["live.game"]} className="live-pane">
        <canvas ref={gm} width={180} height={220} className="live-game" aria-label="A tiny game where the sprite you draw walks" />
        <div className="live-foot">
          <span>{t["live.demo"]}</span>
        </div>
      </Win>
    </div>
  );
}
