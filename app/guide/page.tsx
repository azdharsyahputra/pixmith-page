"use client";

import { useEffect, useState } from "react";
import { Footer, Nav, StepRule } from "../components/Chrome";
import { useLang } from "../i18n";
import { GUIDE } from "./content";
import ToolDemo from "./demos";

const B = process.env.NEXT_PUBLIC_BASE_PATH || "";

// Entries with a real app screenshot in public/img/guide/<id>.webp.
const SHOTS = new Set<string>(["blur", "brush-size", "bucket", "colors", "contour", "curve", "ellipse", "eraser", "export-godot", "eyedropper", "frames", "gradient", "ink", "iso", "jumble", "lasso", "line", "marquee", "move", "onion", "pencil", "pixel-perfect", "polygon", "polylasso", "rectangle", "slice", "spray", "symmetry", "terrain", "text", "tilemap", "transform", "view", "wand"]);

/** A shortcut short enough for a key cap: ⇧⌘G rather than Shift+Cmd+G. */
const cap = (k: string) => k.replace(/Shift\+/g, "⇧").replace(/Cmd\+/g, "⌘").replace(/Option\+/g, "⌥").replace(/ /g, "");

/** Splits "Shift+drag" into keys so each one gets its own cap. */
function Keys({ k }: { k: string }) {
  return (
    <span className="keys">
      {k.split("+").map((p, i) => (
        <span key={i}>
          {i > 0 ? <i>+</i> : null}
          <kbd>{p}</kbd>
        </span>
      ))}
    </span>
  );
}

export default function GuidePage() {
  const { lang } = useLang();
  const g = GUIDE[lang];
  const [active, setActive] = useState(g.groups[0].items[0].id);

  // Highlight the entry being read in the side list.
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".doc[id]");
    const io = new IntersectionObserver(
      (entries) => {
        const seen = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (seen[0]) setActive(seen[0].target.id);
      },
      { rootMargin: "-90px 0px -65% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [lang]);

  // Keep the highlighted entry visible in the side list (a row of chips on phones).
  useEffect(() => {
    const side = document.querySelector<HTMLElement>(".guide-side");
    const a = side?.querySelector<HTMLElement>('[aria-current="true"]');
    if (!side || !a) return;
    if (side.scrollWidth > side.clientWidth) side.scrollTo({ left: a.offsetLeft - side.clientWidth / 2 + a.offsetWidth / 2, behavior: "smooth" });
    else side.scrollTo({ top: a.offsetTop - side.clientHeight / 2, behavior: "smooth" });
  }, [active]);

  return (
    <>
      <Nav />
      <main className="guide wrap">
        <header className="guide-head">
          <h1 className="dl-title">{g.title}</h1>
          <StepRule />
          <p className="lede">{g.lede}</p>
        </header>

        <div className="guide-body">
          <aside className="guide-side" aria-label={g.title}>
            {g.groups.map((grp) => (
              <div key={grp.id} className="side-grp">
                <p>{grp.title}</p>
                {grp.items.map((it) => (
                  <a key={it.id} href={`#${it.id}`} aria-current={active === it.id ? "true" : undefined}>
                    {it.name}
                    {it.key ? <kbd>{cap(it.key)}</kbd> : null}
                  </a>
                ))}
              </div>
            ))}
          </aside>

          <div className="guide-docs">
            {g.groups.map((grp) => (
              <section key={grp.id} className="doc-grp" aria-labelledby={`g-${grp.id}`}>
                <h2 id={`g-${grp.id}`} className="doc-grp-title">
                  {grp.title}
                </h2>
                {grp.intro ? <p className="doc-grp-intro">{grp.intro}</p> : null}
                {grp.items.map((it) => (
                  <article key={it.id} id={it.id} className={SHOTS.has(it.id) ? "doc has-shot" : "doc"}>
                    {SHOTS.has(it.id) ? (
                      <figure className="doc-shot">
                        <img src={`${B}/img/guide/${it.id}.webp`} alt={`${it.name} in Pixmith`} loading="lazy" />
                        <ToolDemo id={it.id} />
                      </figure>
                    ) : (
                      <ToolDemo id={it.id} />
                    )}
                    <div className="doc-main">
                    <div className="doc-head">
                      <span className="doc-key" aria-hidden="true">
                        {it.key ? cap(it.key) : "·"}
                      </span>
                      <div>
                        <h3>{it.name}</h3>
                        <p>{it.what}</p>
                      </div>
                    </div>
                    <ol className="doc-steps">
                      {it.how.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ol>
                    {it.mods?.length ? (
                      <dl className="doc-mods">
                        {it.mods.map(([k, v]) => (
                          <div key={k}>
                            <dt>
                              <Keys k={k} />
                            </dt>
                            <dd>{v}</dd>
                          </div>
                        ))}
                      </dl>
                    ) : null}
                    {it.tip ? <p className="doc-tip">{it.tip}</p> : null}
                    </div>
                  </article>
                ))}
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
