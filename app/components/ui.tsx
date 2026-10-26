"use client";

import { useEffect, useRef, useState, type ReactNode, type KeyboardEvent } from "react";

const REPO = "https://github.com/azdharsyahputra/pixmith";

/** A JRPG window: the authored pixel frame around a deep-blue fill. */
export function Win({ title, children, className = "" }: { title?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={`win ${className}`}>
      {title && <div className="win-title">{title}</div>}
      {children}
    </div>
  );
}

/** Types `text` one character at a time; the whole line is in the DOM from the start for readers and search. */
export function Typed({ text, speed = 28, start = 0, onDone }: { text: string; speed?: number; start?: number; onDone?: () => void }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(text.length);
      onDone?.();
      return;
    }
    setN(0);
    let i = 0;
    let id = 0;
    const begin = window.setTimeout(() => {
      id = window.setInterval(() => {
        i += 1;
        setN(i);
        if (i >= text.length) {
          window.clearInterval(id);
          onDone?.();
        }
      }, speed);
    }, start);
    return () => {
      window.clearTimeout(begin);
      window.clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);
  return (
    <span className="typed" aria-label={text}>
      <span aria-hidden="true">{text.slice(0, n)}</span>
      <span aria-hidden="true" className="ghost">{text.slice(n)}</span>
    </span>
  );
}

export type MenuItem = { label: string; href: string; external?: boolean };

/** A JRPG cursor menu: the cursor follows the pointer and the arrow keys; Enter or a click activates. */
export function Menu({ items, label }: { items: MenuItem[]; label: string }) {
  const [at, setAt] = useState(0);
  const refs = useRef<(HTMLAnchorElement | null)[]>([]);
  const key = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const next = (at + (e.key === "ArrowDown" ? 1 : items.length - 1)) % items.length;
      setAt(next);
      refs.current[next]?.focus();
    }
  };
  return (
    <ul className="menu" role="menu" aria-label={label} onKeyDown={key}>
      {items.map((it, i) => (
        <li key={it.label} role="none">
          <a
            role="menuitem"
            ref={(el) => {
              refs.current[i] = el;
            }}
            href={it.href}
            target={it.external ? "_blank" : undefined}
            rel={it.external ? "noreferrer" : undefined}
            className={i === at ? "on" : undefined}
            onPointerEnter={() => setAt(i)}
            onFocus={() => setAt(i)}
          >
            {it.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

export type Os = "mac" | "windows" | "linux";
export type Downloads = { os: Os | null; urls: Record<Os, string>; version: string | null };
export type Asset = { name: string; url: string; size: number };
export type Release = { os: Os | null; arch: "arm" | "x86" | null; version: string | null; date: string | null; assets: Asset[] };

const RELEASES = `${REPO}/releases/latest`;
const API = "https://api.github.com/repos/azdharsyahputra/pixmith/releases/latest";

/** The visitor's desktop system, or null on phones and unknown systems. */
function detectOs(): Os | null {
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  const plat = nav.userAgentData?.platform || navigator.platform || "";
  if (/android|iphone|ipad/i.test(navigator.userAgent)) return null;
  return /mac/i.test(plat) ? "mac" : /win/i.test(plat) ? "windows" : /linux|x11/i.test(plat) ? "linux" : null;
}

type ApiRelease = { tag_name: string; published_at: string; assets: { name: string; size: number; browser_download_url: string }[] };
let cached: Promise<ApiRelease | null> | null = null;
const latest = (): Promise<ApiRelease | null> => (cached ??= fetch(API).then((r) => (r.ok ? r.json() : null)).catch(() => null));

/** The newest release with every file, the visitor's system and, where the browser says, its CPU (arm or x86). */
export function useRelease(): Release {
  const [r, setR] = useState<Release>({ os: null, arch: null, version: null, date: null, assets: [] });
  useEffect(() => {
    const os = detectOs();
    setR((p) => ({ ...p, os }));
    const ua = (navigator as Navigator & { userAgentData?: { getHighEntropyValues?: (h: string[]) => Promise<{ architecture?: string }> } }).userAgentData;
    ua?.getHighEntropyValues?.(["architecture"])
      .then((v) => setR((p) => ({ ...p, arch: v.architecture === "arm" ? "arm" : v.architecture === "x86" ? "x86" : null })))
      .catch(() => {});
    latest().then((rel) => {
      if (!rel) return;
      const assets = rel.assets.map((a) => ({ name: a.name, url: a.browser_download_url, size: a.size }));
      setR((p) => ({ ...p, version: rel.tag_name, date: rel.published_at, assets }));
    });
  }, []);
  return r;
}

/** The first file whose name matches, or the releases page. */
export const pick = (assets: Asset[], re: RegExp): Asset | null => assets.find((a) => re.test(a.name)) ?? null;
export const releasesPage = RELEASES;

/** The visitor's system and the newest release's files for each system (falls back to the releases page). */
export function useDownloads(): Downloads {
  const r = useRelease();
  const url = (re: RegExp) => pick(r.assets, re)?.url || RELEASES;
  return { os: r.os, version: r.version, urls: { mac: url(/\.dmg$/i), windows: url(/setup.*\.exe$/i), linux: url(/linux.*\.tar\.gz$/i) } };
}

export const OS_NAME = { mac: "macOS", windows: "Windows", linux: "Linux" } as const;
export { REPO };
