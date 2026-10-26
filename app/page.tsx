"use client";

import TileMark from "./components/TileMark";
import LiveLinkDemo from "./components/LiveLinkDemo";
import { OS_NAME, REPO, useDownloads } from "./components/ui";
import { ITEMS, PixelSprite } from "./sprites";
import { useLang } from "./i18n";

const B = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** A staircase rule under the headline: a line drawn the way a pixel line steps. */
function StepRule() {
  return (
    <svg className="step-rule" viewBox="0 0 132 10" aria-hidden="true" shapeRendering="crispEdges">
      <path fill="currentColor" d="M0 6h12v4H0zM12 3h12v4H12zM24 0h12v4H24zM36 3h12v4H36zM48 6h12v4H48zM60 3h12v4H60zM72 0h12v4H72zM84 3h12v4H84zM96 6h12v4H96zM108 3h12v4h-12zM120 0h12v4h-12z" />
    </svg>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 8 8" aria-hidden="true" shapeRendering="crispEdges" className="arrow">
      <path fill="currentColor" d="M3 1h1v1h1v1h1v1h1v1H6v1H5v1H4v1H3V6h1V5H0V3h4V2H3z" />
    </svg>
  );
}

export default function Home() {
  const { t, lang, setLang } = useLang();
  const dl = useDownloads();
  const primary = dl.os ? { label: t.download(OS_NAME[dl.os]), href: dl.urls[dl.os] } : { label: t.downloadAny, href: `${REPO}/releases/latest` };

  return (
    <>
      <header className="nav wrap">
        <a className="brand" href="#top">
          <img src={`${B}/img/logo.png`} alt="" width={44} height={44} />
          <span>
            <b>PIXMITH</b>
            <small>{t.tagline}</small>
          </span>
        </a>
        <nav className="links" aria-label="Sections">
          <a href="#live">{t["nav.live"]}</a>
          <a href="#files">{t["nav.files"]}</a>
          <a href="#godot">{t["nav.godot"]}</a>
          <a href="#install">{t["nav.help"]}</a>
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
        </div>
      </header>

      <main id="top">
        <section className="hero wrap">
          <div className="hero-copy">
            <h1>
              <span>{t["hero.title1"]}</span>
              <span>{t["hero.title2"]}</span>
              <span>{t["hero.title3"]}</span>
            </h1>
            <StepRule />
            <p className="hero-sub">{t["hero.sub"]}</p>
            <div className="ctas">
              <a className="btn btn-ink" href={primary.href}>
                {primary.label}
              </a>
              <a className="btn btn-line" href="#live">
                {t["hero.second"]}
                <span className="dot" aria-hidden="true" />
              </a>
            </div>
            <p className="hero-meta">
              {t["hero.meta"]}
              {dl.version ? ` · ${dl.version}` : ""}
            </p>
          </div>
          <div className="hero-art">
            <TileMark />
          </div>
        </section>

        <section className="cards wrap" aria-label="Highlights">
          <a className="card" href="#live">
            <div className="card-text">
              <h2>{t["card.live.h"]}</h2>
              <p>{t["card.live.p"]}</p>
              <span className="more">{t["card.live.t"]} <Arrow /></span>
            </div>
            <div className="card-img card-sprite">
              <img src={`${B}/img/human-walk.gif`} alt="An animated walking character" width={288} height={408} loading="lazy" />
            </div>
          </a>
          <a className="card" href="#files" id="files">
            <div className="card-text">
              <h2>{t["card.files.h"]}</h2>
              <p>{t["card.files.p"]}</p>
              <span className="more">{t["card.files.t"]} <Arrow /></span>
            </div>
            <div className="card-img">
              <img src={`${B}/img/frames-dark.png`} alt="Layers, frames and tags in Pixmith" width={1280} height={800} loading="lazy" />
            </div>
          </a>
          <a className="card" href="#godot" id="godot">
            <div className="card-text">
              <h2>{t["card.godot.h"]}</h2>
              <p>{t["card.godot.p"]}</p>
              <span className="more">{t["card.godot.t"]} <Arrow /></span>
            </div>
            <div className="card-img">
              <img src={`${B}/img/godot-export-dark.png`} alt="Pixmith's Export to Godot dialog" width={1280} height={800} loading="lazy" />
            </div>
          </a>
        </section>

        <section className="strip wrap" aria-label="Features">
          {t.strip.map((s, i) => (
            <div key={s.t} className="strip-item">
              <span className="strip-icon">
                <PixelSprite sprite={ITEMS[[2, 4, 5, 6][i]]} size={34} />
              </span>
              <div>
                <h3>{s.t}</h3>
                <p>{s.p}</p>
              </div>
            </div>
          ))}
        </section>

        <section id="live" className="live-sec">
          <div className="wrap">
            <h2 className="sec-title">{t["live.title"]}</h2>
            <p className="lede">{t["live.lede"]}</p>
            <LiveLinkDemo />
          </div>
        </section>

        <section className="editor-sec wrap">
          <h2 className="sec-title">{t["editor.title"]}</h2>
          <p className="lede">{t["editor.lede"]}</p>
          <figure className="print">
            <img src={`${B}/img/main-dark.png`} alt="The Pixmith editor with a sprite, layers and the animation timeline" width={1280} height={800} loading="lazy" />
          </figure>
          <div className="duo">
            <figure className="print">
              <img src={`${B}/img/tilemap-autotile-dark.png`} alt="Auto-tiling terrain on a tilemap layer" width={1280} height={800} loading="lazy" />
            </figure>
            <figure className="print">
              <img src={`${B}/img/frames-dark.png`} alt="The animation timeline with tags" width={1280} height={800} loading="lazy" />
            </figure>
          </div>
        </section>

        <section id="install" className="help wrap">
          <div>
            <h2 className="sec-title">{t["help.title"]}</h2>
            <p className="lede">{t["help.lede"]}</p>
          </div>
          <div className="tips">
            {t.tips.map((tip) => (
              <details key={tip.q}>
                <summary>{tip.q}</summary>
                <p>{tip.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="close wrap">
          <h2>{t["close.title"]}</h2>
          <StepRule />
          <a className="btn btn-ink" href={primary.href}>
            {primary.label}
          </a>
        </section>
      </main>

      <footer className="foot wrap">
        <span>© Azdhar Syahputra · {t["foot.license"]}</span>
        <span className="foot-links">
          <a href={REPO}>GitHub</a>
          <a href={`${REPO}/releases`}>Releases</a>
        </span>
      </footer>
    </>
  );
}
