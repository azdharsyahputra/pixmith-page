"use client";

import { useEffect } from "react";
import TileMark from "./components/TileMark";
import HeroField from "./components/HeroField";
import LiveLinkDemo from "./components/LiveLinkDemo";
import { Footer, Nav, StepRule } from "./components/Chrome";
import { OS_NAME, useDownloads } from "./components/ui";
import { ITEMS, PixelSprite } from "./sprites";
import { useLang } from "./i18n";

const B = process.env.NEXT_PUBLIC_BASE_PATH || "";

const TICKER = [".aseprite in, .aseprite out", "Godot 4 SpriteFrames", "Live Link", "Tilemaps", "Isometric grid", "Lua scripts", "Onion skin", "Shading ink", "Indexed palettes", "macOS · Windows · Linux"];

/** Sections fade up as they enter the viewport. Without JS or with reduced motion they are simply there. */
function useReveal() {
  useEffect(() => {
    if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -8% 0px" },
    );
    els.forEach((el) => io.observe(el));
    document.documentElement.classList.add("reveal-on");
    return () => io.disconnect();
  }, []);
}

function Arrow() {
  return (
    <svg viewBox="0 0 8 8" aria-hidden="true" shapeRendering="crispEdges" className="arrow">
      <path fill="currentColor" d="M3 1h1v1h1v1h1v1h1v1H6v1H5v1H4v1H3V6h1V5H0V3h4V2H3z" />
    </svg>
  );
}

export default function Home() {
  const { t } = useLang();
  const dl = useDownloads();
  useReveal();
  const primary = { label: dl.os ? t.download(OS_NAME[dl.os]) : t.downloadAny, href: `${B}/download/${dl.os ? `#${dl.os}` : ""}` };

  return (
    <>
      <Nav home />

      <main id="top">
        <div className="hero-band">
        <HeroField />
        <section className="hero wrap">
          <div className="hero-copy">
            <a className="eyebrow" href="#live">
              <span className="pulse" aria-hidden="true" />
              {t["hero.eyebrow"]}
              {dl.version ? <b>{dl.version}</b> : null}
            </a>
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
            </p>
          </div>
          <div className="hero-art">
            <TileMark />
          </div>
        </section>
        </div>

        <div className="ticker" aria-hidden="true">
          <div className="ticker-run">
            {[...TICKER, ...TICKER].map((x, i) => (
              <span key={i}>{x}</span>
            ))}
          </div>
        </div>

        <section data-reveal className="cards wrap" aria-label="Highlights">
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

        <section data-reveal className="strip wrap" aria-label="Features">
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
          <div className="wrap" data-reveal>
            <h2 className="sec-title">{t["live.title"]}</h2>
            <p className="lede">{t["live.lede"]}</p>
            <LiveLinkDemo />
          </div>
        </section>

        <section data-reveal className="editor-sec wrap">
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

        <section data-reveal id="install" className="help wrap">
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

        <section data-reveal className="close wrap">
          <h2>{t["close.title"]}</h2>
          <StepRule />
          <a className="btn btn-ink" href={primary.href}>
            {primary.label}
          </a>
        </section>
      </main>

      <Footer />
    </>
  );
}
