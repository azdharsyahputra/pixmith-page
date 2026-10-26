"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Footer, Nav, StepRule } from "../components/Chrome";
import { OS_NAME, pick, releasesPage, useRelease, type Asset, type Os } from "../components/ui";
import { useLang } from "../i18n";

const ORDER: Os[] = ["mac", "windows", "linux"];

// The file behind each option, in the order of the options in the dictionary. null is an option not built yet.
const FILES: Record<Os, (RegExp | null)[]> = {
  mac: [/\.dmg$/i, null],
  windows: [/setup.*\.exe$/i, /windows.*\.zip$/i],
  linux: [/linux.*\.tar\.gz$/i],
};

const ICONS: Record<Os, ReactNode> = {
  mac: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M16.4 12.6c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.1 1-4 2.4-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8 1.5 0 1.9.8 3.2.8 1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.3-2.8 0 0-2.5-1-2.5-3.9ZM14 5.5c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1.1.1 2.1-.6 2.8-1.4Z" />
    </svg>
  ),
  windows: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M3 5.1 10.4 4v7.2H3V5.1Zm8.4-1.2L21 2.5v8.7h-9.6V3.9ZM3 12.4h7.4v7.2L3 18.5v-6.1Zm8.4 0H21v8.7l-9.6-1.4v-7.3Z" />
    </svg>
  ),
  linux: (
    <svg viewBox="0 0 24 24" aria-hidden="true" shapeRendering="crispEdges">
      <path fill="currentColor" d="M3 4h18v16H3V4Zm2 2v12h14V6H5Zm2 2h2v2H7V8Zm2 2h2v2H9v-2Zm-2 2h2v2H7v-2Zm5 2h5v2h-5v-2Z" />
    </svg>
  ),
};

function DownloadIcon() {
  return (
    <svg viewBox="0 0 8 8" aria-hidden="true" shapeRendering="crispEdges" className="dl-arrow">
      <path fill="currentColor" d="M3 0h2v4h2v1H6v1H5v1H3V6H2V5H1V4h2V0Zm-3 7h8v1H0V7Z" />
    </svg>
  );
}

const mb = (n: number) => `${(n / 1048576).toFixed(1)} MB`;
const ext = (name: string) => name.match(/\.(tar\.gz|dmg|exe|zip)$/i)?.[1] ?? "";

export default function DownloadPage() {
  const { t, lang } = useLang();
  const d = t.dl;
  const r = useRelease();
  const [hash, setHash] = useState<Os | null>(null);
  const [got, setGot] = useState<Os | null>(null);
  const next = useRef<HTMLElement>(null);

  useEffect(() => {
    const h = location.hash.slice(1);
    if (h === "mac" || h === "windows" || h === "linux") setHash(h);
  }, []);
  useEffect(() => {
    if (got) next.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [got]);

  const mine = hash ?? r.os;
  const date = r.date ? new Date(r.date).toLocaleDateString(lang === "id" ? "id-ID" : "en-US", { day: "numeric", month: "long", year: "numeric" }) : null;
  const godot = pick(r.assets, /live-link-godot.*\.zip$/i);

  return (
    <>
      <Nav />
      <main className="dl wrap">
        <header className="dl-head">
          <h1 className="dl-title">{d.title}</h1>
          <StepRule />
          <p className="lede">{d.lede}</p>
          {r.version && date ? <p className="hero-meta">{d.meta(r.version, date)}</p> : null}
        </header>

        <section className="dl-grid">
          {ORDER.map((os) => (
            <article key={os} id={os} className={os === mine ? "dl-card mine" : "dl-card"}>
              <div className="dl-card-head">
                <span className="dl-os-icon">{ICONS[os]}</span>
                <h2>{OS_NAME[os]}</h2>
                {os === mine ? <span className="dl-badge">{d.yours}</span> : null}
              </div>

              <div className="dl-opts">
                {d[os].opts.map((o, i) => {
                  const re = FILES[os][i];
                  const a: Asset | null = re ? pick(r.assets, re) : null;
                  if (!re)
                    return (
                      <div key={o.t} className="dl-opt off" aria-disabled="true">
                        <span>
                          <b>{o.t}</b>
                          <small>{o.s}</small>
                        </span>
                        <em>{d.soon}</em>
                      </div>
                    );
                  return (
                    <a key={o.t} className={i === 0 ? "dl-opt main" : "dl-opt"} href={a?.url ?? releasesPage} onClick={() => setGot(os)}>
                      <span>
                        <b>{o.t}</b>
                        <small>{o.s}</small>
                      </span>
                      <em>{a ? `.${ext(a.name)} · ${mb(a.size)}` : ""}</em>
                      <DownloadIcon />
                    </a>
                  );
                })}
              </div>

              {os === "mac" && r.os === "mac" && r.arch === "x86" ? <p className="dl-warn">{d.mac.intelHere}</p> : null}
              {os === "mac" ? <p className="dl-which">{d.mac.which}</p> : null}

              <h3>{d.req}</h3>
              <ul className="dl-req">
                {d[os].req.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        {got ? (
          <section ref={next} className="dl-next" aria-live="polite">
            <p className="dl-next-kicker">
              <span className="pulse" aria-hidden="true" />
              {d.started}
            </p>
            <h2>
              {d.next}: {OS_NAME[got]}
            </h2>
            <ol>
              {d[got].steps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          </section>
        ) : null}

        <section className="dl-extra">
          <a className="dl-opt" href={godot?.url ?? releasesPage}>
            <span>
              <b>{d.godot}</b>
              <small>{d.godotSub}</small>
            </span>
            <em>{godot ? `.zip · ${(godot.size / 1024).toFixed(0)} KB` : ""}</em>
            <DownloadIcon />
          </a>
          <a className="dl-all" href={`${releasesPage.replace(/\/latest$/, "")}`}>
            {d.all} →
          </a>
        </section>
      </main>
      <Footer />
    </>
  );
}
