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

export type Downloads = { os: "mac" | "windows" | "linux" | null; urls: Record<"mac" | "windows" | "linux", string>; version: string | null };

const RELEASES = `${REPO}/releases/latest`;

/** The visitor's system and the newest release's files for each system (falls back to the releases page). */
export function useDownloads(): Downloads {
  const [d, setD] = useState<Downloads>({ os: null, urls: { mac: RELEASES, windows: RELEASES, linux: RELEASES }, version: null });
  useEffect(() => {
    const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
    const plat = nav.userAgentData?.platform || navigator.platform || "";
    const mobile = /android|iphone|ipad/i.test(navigator.userAgent);
    const os = mobile ? null : /mac/i.test(plat) ? "mac" : /win/i.test(plat) ? "windows" : /linux|x11/i.test(plat) ? "linux" : null;
    setD((p) => ({ ...p, os }));
    fetch("https://api.github.com/repos/azdharsyahputra/pixmith/releases/latest")
      .then((r) => (r.ok ? r.json() : null))
      .then((rel: { tag_name: string; assets: { name: string; browser_download_url: string }[] } | null) => {
        if (!rel) return;
        const pick = (re: RegExp) => rel.assets.find((a) => re.test(a.name))?.browser_download_url || RELEASES;
        setD({ os, version: rel.tag_name, urls: { mac: pick(/\.dmg$/i), windows: pick(/setup.*\.exe$/i), linux: pick(/linux.*\.tar\.gz$/i) } });
      })
      .catch(() => {});
  }, []);
  return d;
}

export const OS_NAME = { mac: "macOS", windows: "Windows", linux: "Linux" } as const;
export { REPO };
