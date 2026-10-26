"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "../i18n";

const B = process.env.NEXT_PUBLIC_BASE_PATH || "";
const SWATCHES = ["#f05a42", "#e3529b", "#8f60f6", "#4f8cff", "#3fa58b", "#ffb347", "#f4f2ff", "#2b2a3a"];

// A sprite sheet exported by Pixmith (Aseprite-style JSON): frame boxes and durations, plus tags.
type Frame = { x: number; y: number; w: number; h: number; ms: number };
type Sheet = { img: HTMLCanvasElement; frames: Frame[]; tags: Record<string, [number, number]> };

async function loadSheet(name: string): Promise<Sheet | null> {
  try {
    const meta = await fetch(`${B}/img/${name}.json`).then((r) => (r.ok ? r.json() : null));
    if (!meta) return null;
    const img = await new Promise<HTMLImageElement>((ok, bad) => {
      const i = new Image();
      i.onload = () => ok(i);
      i.onerror = bad;
      i.src = `${B}/img/${name}.png`;
    });
    const c = document.createElement("canvas");
    c.width = img.width;
    c.height = img.height;
    c.getContext("2d")!.drawImage(img, 0, 0);
    const list = Array.isArray(meta.frames) ? meta.frames : Object.values(meta.frames);
    const frames = (list as { frame: { x: number; y: number; w: number; h: number }; duration: number }[]).map((f) => ({ ...f.frame, ms: f.duration || 100 }));
    const tags: Record<string, [number, number]> = {};
    for (const t of meta.meta?.frameTags ?? []) tags[t.name] = [t.from, t.to];
    return { img: c, frames, tags };
  } catch {
    return null;
  }
}

const hex = (r: number, g: number, b: number) => "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");

function toHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min, s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h * 60, s, l];
}

function fromHsl(h: number, s: number, l: number): [number, number, number] {
  const k = (n: number) => (n + h / 30) % 12, a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}

/** Recolors the clicked color and its shades (one hue family) across the whole sheet, keeping each shade's step. */
function recolor(data: ImageData, p: number[], target: string) {
  const to = parseInt(target.slice(1), 16);
  const [th, ts, tl] = toHsl((to >> 16) & 255, (to >> 8) & 255, to & 255);
  const [ch, cs, cl] = toHsl(p[0], p[1], p[2]);
  const family = cs > 0.12;
  const d = data.data;
  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] === 0) continue;
    const same = d[i] === p[0] && d[i + 1] === p[1] && d[i + 2] === p[2];
    const [h, sat, l] = toHsl(d[i], d[i + 1], d[i + 2]);
    const dh = Math.min(Math.abs(h - ch), 360 - Math.abs(h - ch));
    if (!same && !(family && sat > 0.12 && dh < 16 && Math.abs(sat - cs) < 0.3 && Math.abs(l - cl) < 0.25)) continue;
    const [r, g, b] = fromHsl(th, ts, Math.max(0.04, Math.min(0.96, tl + (l - cl))));
    d[i] = r; d[i + 1] = g; d[i + 2] = b;
  }
}

/**
 * Live Link in the browser: click a color on the fighter to recolor it in every frame; the battle on the right picks
 * the new colors up once the change is sent, the way Pixmith updates a running Godot game.
 */
export default function LiveLinkDemo() {
  const { t } = useLang();
  const ed = useRef<HTMLCanvasElement>(null);
  const gm = useRef<HTMLCanvasElement>(null);
  const hero = useRef<Sheet | null>(null); // the editor's copy
  const live = useRef<Sheet | null>(null); // what the game has received
  const enemy = useRef<Sheet | null>(null);
  const original = useRef<ImageData | null>(null);
  const [color, setColor] = useState(SWATCHES[3]);
  const colorRef = useRef(color);
  colorRef.current = color;
  const [pulse, setPulse] = useState(0);
  const [hover, setHover] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const editorFrame = () => (hero.current ? hero.current.frames[hero.current.tags.idle?.[0] ?? 0] : null);

  const drawEditor = () => {
    const cv = ed.current, h = hero.current, f = editorFrame();
    if (!cv || !h || !f) return;
    cv.width = f.w;
    cv.height = f.h;
    const g = cv.getContext("2d")!;
    for (let y = 0; y < f.h; y++)
      for (let x = 0; x < f.w; x++) {
        g.fillStyle = (Math.floor(x / 4) + Math.floor(y / 4)) % 2 ? "#2f2d3a" : "#282634";
        g.fillRect(x, y, 1, 1);
      }
    g.drawImage(h.img, f.x, f.y, f.w, f.h, 0, 0, f.w, f.h);
  };

  const send = () => {
    setPulse((p) => p + 1);
    window.setTimeout(() => {
      if (!hero.current || !live.current) return;
      const g = live.current.img.getContext("2d")!;
      g.clearRect(0, 0, live.current.img.width, live.current.img.height);
      g.drawImage(hero.current.img, 0, 0);
    }, 420);
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const h = (await loadSheet("fighter-sheet")) ?? (await loadSheet("human-sheet"));
      const e = await loadSheet("enemy-sheet");
      if (cancelled || !h) return;
      hero.current = h;
      const copy = document.createElement("canvas");
      copy.width = h.img.width;
      copy.height = h.img.height;
      copy.getContext("2d")!.drawImage(h.img, 0, 0);
      live.current = { ...h, img: copy };
      original.current = h.img.getContext("2d")!.getImageData(0, 0, h.img.width, h.img.height);
      enemy.current = e;
      drawEditor();
      setReady(true);
    })();

    // The battle: a PS1-style stage, the fighter on the left and the enemy on the right. The fighter idles, dashes in,
    // plays its attack, the enemy flashes and shakes, a damage number floats up, and the fighter steps back.
    const gc = gm.current!;
    const g = gc.getContext("2d")!;
    const W = gc.width, H = gc.height, GY = H - 28;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const t0 = performance.now();

    const tagFrames = (s: Sheet, name: string, fallback: string) => {
      const r = s.tags[name] ?? s.tags[fallback] ?? [0, Math.min(3, s.frames.length - 1)];
      const out: number[] = [];
      for (let i = r[0]; i <= r[1]; i++) out.push(i);
      return out;
    };
    const play = (s: Sheet, frames: number[], ms: number, loop: boolean) => {
      const total = frames.reduce((a, f) => a + s.frames[f].ms, 0);
      let at = loop ? ms % total : Math.min(ms, total - 1);
      for (const f of frames) {
        if (at < s.frames[f].ms) return f;
        at -= s.frames[f].ms;
      }
      return frames[frames.length - 1];
    };
    const duration = (s: Sheet, frames: number[]) => frames.reduce((a, f) => a + s.frames[f].ms, 0);

    const stage = (tt: number) => {
      ["#1d1a3a", "#262250", "#302a63", "#3b3275", "#4a3d86"].forEach((c, i) => {
        g.fillStyle = c;
        g.fillRect(0, i * 18, W, 18);
      });
      g.fillStyle = "#4a3d86";
      g.fillRect(0, 90, W, H);
      g.fillStyle = "#f4f2ff";
      [[20, 12], [70, 26], [118, 8], [168, 22], [206, 10], [228, 30]].forEach(([x, y], i) => {
        if (still || Math.sin(tt * 2 + i) > -0.5) g.fillRect(x, y, 1, 1);
      });
      g.fillStyle = "#5a4a98";
      for (let x = 0; x < W; x++) g.fillRect(x, GY - 38 - Math.round(Math.sin(x / 26) * 8 + Math.sin(x / 11) * 3), 1, 60);
      g.fillStyle = "#3a2f6e";
      for (let x = 0; x < W; x++) g.fillRect(x, GY - 16 - Math.round(Math.sin(x / 18 + 1) * 5), 1, 40);
      // A floor in perspective: bands that widen toward the viewer.
      ["#2c6b55", "#327a60", "#38896b", "#3f9876"].forEach((c, i) => {
        g.fillStyle = c;
        g.fillRect(0, GY + i * 6 + i * i, W, 6 + i * 2);
      });
      g.fillStyle = "#2a5f4b";
      for (let i = 0; i < 9; i++) g.fillRect(i * 40 - 10, GY + 2, 1, H);
    };

    const frame = (now: number) => {
      const tt = (now - t0) / 1000;
      g.imageSmoothingEnabled = false;
      stage(tt);
      const h = live.current, e = enemy.current;
      if (h) {
        const idle = tagFrames(h, "idle", "walk");
        const atk = tagFrames(h, "attack", "walk");
        const hasAttack = Boolean(h.tags.attack);
        const fw = h.frames[0].w, fh = h.frames[0].h;
        const homeX = 20, enemyX = W - 70;
        const idleMs = 1600, dashMs = 220, atkMs = hasAttack ? duration(h, atk) : 900, backMs = 320;
        const cycle = idleMs + dashMs + atkMs + backMs;
        const c = still ? 0 : (tt * 1000) % cycle;
        let x = homeX, f = idle[0], phase = "idle", local = c;
        if (c < idleMs) f = play(h, idle, c, true);
        else if ((local = c - idleMs) < dashMs) { phase = "dash"; x = homeX + (enemyX - fw * 0.75 - homeX) * (local / dashMs); f = play(h, atk, 0, false); }
        else if ((local = c - idleMs - dashMs) < atkMs) { phase = "attack"; x = enemyX - fw * 0.75; f = play(h, atk, local, false); }
        else { local = c - idleMs - dashMs - atkMs; phase = "back"; x = enemyX - fw * 0.75 - (enemyX - fw * 0.75 - homeX) * (local / backMs); f = play(h, idle, 0, true); }

        // Enemy: idles; flashes, shakes and shows damage during the second half of the attack.
        const hitStart = idleMs + dashMs + atkMs * 0.45, hitEnd = hitStart + 420;
        const hit = !still && c > hitStart && c < hitEnd;
        if (e) {
          const ei = tagFrames(e, "idle", "idle"), eh = tagFrames(e, "hurt", "idle");
          const ef = hit ? play(e, eh, c - hitStart, true) : play(e, ei, tt * 1000, true);
          const fr = e.frames[ef];
          const shake = hit ? Math.round(Math.sin(c / 18) * 3) : 0;
          g.fillStyle = "rgba(10,8,30,.35)";
          g.fillRect(enemyX + 8, GY + 1, fr.w - 16, 4);
          g.drawImage(e.img, fr.x, fr.y, fr.w, fr.h, enemyX + shake, GY - fr.h + 4, fr.w, fr.h);
        } else {
          const shake = hit ? Math.round(Math.sin(c / 18) * 3) : 0;
          g.fillStyle = hit ? "#ffffff" : "#ff7a52";
          g.fillRect(enemyX + 10 + shake, GY - 26, 30, 26);
          g.fillStyle = "#1d1a3a";
          g.fillRect(enemyX + 18 + shake, GY - 18, 3, 4);
          g.fillRect(enemyX + 30 + shake, GY - 18, 3, 4);
        }
        if (!still && c > hitStart && c < hitStart + 900) {
          const k = (c - hitStart) / 900;
          g.globalAlpha = k < 0.8 ? 1 : (1 - k) * 5;
          g.fillStyle = "#1d1a3a";
          g.font = "bold 13px monospace";
          g.fillText("128", enemyX + 13, GY - 50 - k * 18 + 1);
          g.fillStyle = "#ffd36b";
          g.fillText("128", enemyX + 12, GY - 50 - k * 18);
          g.globalAlpha = 1;
        }
        // Fighter with a contact shadow.
        const fr = h.frames[f];
        g.fillStyle = "rgba(10,8,30,.35)";
        g.fillRect(Math.round(x) + fw * 0.25, GY + 1, fw * 0.5, 4);
        g.drawImage(h.img, fr.x, fr.y, fr.w, fr.h, Math.round(x), GY - fh + 4 + (phase === "dash" ? -2 : 0), fr.w, fr.h);
      }
      if (!still) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const cv = ed.current!;
    const at = (ev: PointerEvent) => {
      const f = editorFrame();
      if (!f) return null;
      const r = cv.getBoundingClientRect();
      const x = Math.floor(((ev.clientX - r.left) / r.width) * f.w), y = Math.floor(((ev.clientY - r.top) / r.height) * f.h);
      if (x < 0 || y < 0 || x >= f.w || y >= f.h || !hero.current) return null;
      const d = hero.current.img.getContext("2d")!.getImageData(f.x + x, f.y + y, 1, 1).data;
      return d[3] > 0 ? [d[0], d[1], d[2]] : null;
    };
    const move = (ev: PointerEvent) => {
      const p = at(ev);
      setHover(p ? hex(p[0], p[1], p[2]) : null);
    };
    const click = (ev: PointerEvent) => {
      const p = at(ev);
      const h = hero.current;
      if (!p || !h) return;
      const ctx = h.img.getContext("2d")!;
      const data = ctx.getImageData(0, 0, h.img.width, h.img.height);
      recolor(data, p, colorRef.current);
      ctx.putImageData(data, 0, 0);
      drawEditor();
      send();
    };
    cv.addEventListener("pointermove", move);
    cv.addEventListener("pointerdown", click);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      cv.removeEventListener("pointermove", move);
      cv.removeEventListener("pointerdown", click);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="live">
      <div className="app-win">
        <div className="app-bar">
          <span className="lights" aria-hidden="true"><i /><i /><i /></span>
          <b>{t["live.editor"]}</b>
          <span className="app-zoom">600%</span>
        </div>
        <div className="app-body">
          <canvas ref={ed} width={64} height={64} className={ready ? "live-editor" : "live-editor loading"} aria-label={t["live.hint"]} />
          <div className="app-side">
            <span className="side-label">{t["live.palette"]}</span>
            <div className="swatches" role="group" aria-label={t["live.palette"]}>
              {SWATCHES.map((c) => (
                <button key={c} type="button" style={{ background: c }} aria-label={c} aria-pressed={color === c} onClick={() => setColor(c)} />
              ))}
            </div>
            <span className="side-label">{t["live.under"]}</span>
            <span className="probe" style={{ background: hover ?? "transparent" }} />
            <button
              type="button"
              className="reset"
              onClick={() => {
                const h = hero.current;
                if (!h || !original.current) return;
                h.img.getContext("2d")!.putImageData(original.current, 0, 0);
                drawEditor();
                send();
              }}
            >
              {t["live.reset"]}
            </button>
          </div>
        </div>
        <p className="app-hint">{t["live.hint"]}</p>
      </div>
      <div className="wire" aria-hidden="true">
        <span className="wire-label">LIVE LINK</span>
        <span key={pulse} className={pulse ? "packet go" : "packet"} />
      </div>
      <div className="game-win">
        <div className="app-bar">
          <span className="lights" aria-hidden="true"><i /><i /><i /></span>
          <b>{t["live.game"]}</b>
        </div>
        <canvas ref={gm} width={240} height={160} className="live-game" aria-label={t["live.demo"]} />
      </div>
    </div>
  );
}
