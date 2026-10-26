"use client";

import { REPO } from "./ui";
import { useLang } from "../i18n";

const B = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** A staircase rule under the headline: a line drawn the way a pixel line steps. */
export function StepRule() {
  return (
    <svg className="step-rule" viewBox="0 0 132 10" aria-hidden="true" shapeRendering="crispEdges">
      <path fill="currentColor" d="M0 6h12v4H0zM12 3h12v4H12zM24 0h12v4H24zM36 3h12v4H36zM48 6h12v4H48zM60 3h12v4H60zM72 0h12v4H72zM84 3h12v4H84zM96 6h12v4H96zM108 3h12v4h-12zM120 0h12v4h-12z" />
    </svg>
  );
}

/** The sticky top bar. Section links point into the home page, so they work from every page. */
export function Nav({ home = false }: { home?: boolean }) {
  const { t, lang, setLang } = useLang();
  const at = home ? "" : `${B}/`;
  return (
    <div className="nav-bar">
      <header className="nav wrap">
        <a className="brand" href={home ? "#top" : `${B}/`}>
          <img src={`${B}/img/logo.png`} alt="" width={44} height={44} />
          <span>
            <b>PIXMITH</b>
            <small>{t.tagline}</small>
          </span>
        </a>
        <nav className="links" aria-label="Sections">
          <a href={`${at}#live`}>{t["nav.live"]}</a>
          <a href={`${at}#files`}>{t["nav.files"]}</a>
          <a href={`${at}#godot`}>{t["nav.godot"]}</a>
          <a href={`${B}/guide/`}>{t["nav.guide"]}</a>
          <a href={`${at}#install`}>{t["nav.help"]}</a>
        </nav>
        <div className="nav-end">
          <div className="lang" role="group" aria-label="Language">
            {(["en", "id"] as const).map((l) => (
              <button key={l} type="button" aria-pressed={lang === l} onClick={() => setLang(l)}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <a className="gh" href={REPO} aria-label="Pixmith on GitHub">
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path fill="currentColor" d="M8 0a8 8 0 0 0-2.53 15.59c.4.07.55-.17.55-.38v-1.34c-2.23.48-2.7-1.07-2.7-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.06-.49.06-.49.8.06 1.23.83 1.23.83.72 1.22 1.88.87 2.34.66.07-.52.28-.87.5-1.07-1.78-.2-3.65-.89-3.65-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.22 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.66 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0 0 8 0Z" />
            </svg>
          </a>
          <a className="nav-dl" href={`${B}/download/`}>
            {t["nav.download"]}
          </a>
        </div>
      </header>
    </div>
  );
}

export function Footer() {
  const { t } = useLang();
  return (
    <footer className="foot wrap">
      <span>© Azdhar Syahputra · {t["foot.license"]}</span>
      <span className="foot-links">
        <a href={`${B}/download/`}>{t["nav.download"]}</a>
        <a href={`${B}/guide/`}>{t["nav.guide"]}</a>
        <a href={REPO}>GitHub</a>
        <a href={`${REPO}/releases`}>Releases</a>
      </span>
    </footer>
  );
}
