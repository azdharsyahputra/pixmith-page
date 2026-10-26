"use client";

import { useState } from "react";
import Scene from "./components/Scene";
import LiveLinkDemo from "./components/LiveLinkDemo";
import Inventory from "./components/Inventory";
import { Menu, OS_NAME, REPO, Typed, Win, useDownloads } from "./components/ui";
import { useLang } from "./i18n";

const B = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default function Home() {
  const { t, lang, setLang } = useLang();
  const dl = useDownloads();
  const [typed, setTyped] = useState(false);
  const primary = dl.os ? { label: t["menu.download"](OS_NAME[dl.os]), href: dl.urls[dl.os] } : { label: t["menu.downloadAny"], href: `${REPO}/releases/latest` };

  return (
    <>
      <header className="hud">
        <Win className="hud-win">
          <a className="hud-brand" href="#top">
            <img src={`${B}/img/logo.png`} alt="" width={26} height={26} />
            PIXMITH
          </a>
          <span className="hud-lv">
            {t["hud.level"]} {dl.version ? dl.version.replace(/^v/, "") : "0.5"}
          </span>
          <div className="hud-lang" role="group" aria-label="Language">
            {(["en", "id"] as const).map((l) => (
              <button key={l} type="button" aria-pressed={lang === l} onClick={() => setLang(l)}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </Win>
      </header>

      <main id="top">
        <section className="hero" aria-label="Pixmith">
          <Scene />
          <div className="hero-ui">
            <Win className="dialogue" title={t["dlg.speaker"]}>
              <h1>
                <Typed key={lang} text={t["dlg.title"]} start={400} onDone={() => setTyped(true)} />
              </h1>
              <p className={typed ? "dlg-sub shown" : "dlg-sub"}>{t["dlg.sub"]}</p>
              <p className={typed ? "dlg-more shown" : "dlg-more"}>
                {t["dlg.more"]}
                <span className="next" aria-hidden="true" />
              </p>
            </Win>
            <Win className="menu-win">
              <Menu
                label="Pixmith"
                items={[
                  primary,
                  { label: t["menu.other"], href: `${REPO}/releases/latest`, external: true },
                  { label: t["menu.live"], href: "#live" },
                  { label: t["menu.source"], href: REPO, external: true },
                ]}
              />
              <p className="menu-help">{t["menu.help"]}</p>
            </Win>
          </div>
        </section>

        <section id="live" className="band">
          <div className="wrap">
            <h2>{t["live.title"]}</h2>
            <p className="lede">{t["live.lede"]}</p>
            <LiveLinkDemo />
          </div>
        </section>

        <section className="band band-alt">
          <div className="wrap">
            <h2>{t["inv.title"]}</h2>
            <p className="lede">{t["inv.lede"]}</p>
            <Inventory />
          </div>
        </section>

        <section className="band">
          <div className="wrap">
            <h2>{t["map.title"]}</h2>
            <p className="lede">{t["map.lede"]}</p>
            <div className="map">
              <Win className="map-main" title={t["map.main"]}>
                <img src={`${B}/img/main-dark.png`} alt="The Pixmith editor with a sprite, layers and the animation timeline" width={1280} height={800} loading="lazy" />
              </Win>
              <Win title={t["map.frames"]}>
                <img src={`${B}/img/frames-dark.png`} alt="Frames, tags and onion skin" width={1280} height={800} loading="lazy" />
              </Win>
              <Win title={t["map.tiles"]}>
                <img src={`${B}/img/tilemap-autotile-dark.png`} alt="Auto-tiling terrain on a tilemap layer" width={1280} height={800} loading="lazy" />
              </Win>
              <Win title={t["map.godot"]}>
                <img src={`${B}/img/godot-export-dark.png`} alt="Export to Godot options" width={1280} height={800} loading="lazy" />
              </Win>
            </div>
          </div>
        </section>

        <section className="band band-alt" id="tips">
          <div className="wrap tips">
            <div>
              <h2>{t["tips.title"]}</h2>
              <p className="lede">{t["tips.lede"]}</p>
            </div>
            <Win className="tips-win">
              {t.tips.map((tip) => (
                <details key={tip.q}>
                  <summary>{tip.q}</summary>
                  <p>{tip.a}</p>
                </details>
              ))}
            </Win>
          </div>
        </section>

        <section className="save">
          <Win className="save-win" title={t["save.title"]}>
            <Menu
              label={t["save.title"]}
              items={[
                { label: t["save.yes"], href: primary.href },
                { label: t["save.no"], href: REPO, external: true },
              ]}
            />
          </Win>
        </section>
      </main>

      <footer className="foot">
        <div className="wrap foot-row">
          <span>© Azdhar Syahputra · {t["foot.license"]}</span>
          <span>
            <a href={REPO}>GitHub</a>
            <a href={`${REPO}/releases`}>Releases</a>
            <a href="https://github.com/azdharsyahputra/pixmith-mcp">MCP</a>
          </span>
        </div>
      </footer>
    </>
  );
}
