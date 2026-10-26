"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "id";

const ISSUES = "https://github.com/azdharsyahputra/pixmith/issues";

// Every string on the page, in both languages. Values may hold markup.
const DICT = {
  en: {
    tagline: "Every pixel, placed.",
    "nav.live": "Live Link",
    "nav.files": "Aseprite",
    "nav.godot": "Godot",
    "nav.help": "Install",
    "nav.download": "Download",
    "nav.guide": "Guide",
    dl: {
      title: "Download Pixmith",
      lede: "Pick your system. Every build has the full editor, Live Link and Godot export.",
      meta: (v: string, d: string) => `${v} · released ${d} · open beta`,
      yours: "Your system",
      req: "Requirements",
      soon: "Not available yet",
      mac: {
        opts: [
          { t: "Apple Silicon", s: "M1, M2, M3, M4 and newer" },
          { t: "Intel Mac", s: "Most Macs from 2020 and earlier" },
        ],
        which: <>Which Mac is this? Open <kbd>Apple menu → About This Mac</kbd>. <b>Chip: Apple M…</b> is Apple Silicon, <b>Processor: Intel</b> is an Intel Mac.</>,
        intelHere: "This looks like an Intel Mac. The Intel build is not out yet.",
        req: ["macOS 13 Ventura or newer", "Apple Silicon (M1 or newer)"],
        steps: [<>Open the <b>.dmg</b> and drag Pixmith to <b>Applications</b>.</>, <>Open Pixmith. If macOS says it cannot verify the app, open <kbd>System Settings → Privacy &amp; Security</kbd> and click <kbd>Open Anyway</kbd>.</>],
      },
      windows: {
        opts: [
          { t: "Installer", s: "Recommended · adds Pixmith to the Start menu" },
          { t: "Portable zip", s: "No install: unpack and run" },
        ],
        req: ["Windows 10 or 11, 64-bit", "A graphics driver with OpenGL"],
        steps: [<>Run the installer.</>, <>If Windows says <b>Windows protected your PC</b>, click <kbd>More info</kbd>, then <kbd>Run anyway</kbd>.</>, <>Open Pixmith from the Start menu.</>],
      },
      linux: {
        opts: [{ t: "x64 archive", s: ".tar.gz: unpack and run" }],
        req: ["64-bit x86 with glibc 2.34 or newer (Ubuntu 22.04, Debian 12, Fedora 35 and up)", "X11 or Wayland with OpenGL"],
        steps: [<>Unpack it: <kbd>tar -xzf Pixmith-linux.tar.gz</kbd></>, <>Run <kbd>./Pixmith</kbd> inside the folder.</>],
      },
      started: "Your download has started",
      next: "Next steps",
      godot: "Godot Live Link addon",
      godotSub: "Unzip into your Godot 4 project's addons folder and enable it. Works in debug builds.",
      all: "All releases",
    },
    "hero.title1": "Draw it.",
    "hero.title2": "Your game",
    "hero.title3": "already has it.",
    "hero.sub": "A pixel art editor that opens your .aseprite files and stays wired to your running Godot game. Every stroke lands where it will be played.",
    download: (os: string) => `Download for ${os}`,
    downloadAny: "Download Pixmith",
    "hero.eyebrow": "New: Godot Live Link",
    "hero.second": "See Live Link",
    "hero.meta": "Free open beta · macOS, Windows, Linux",
    "card.live.t": "Live Link",
    "card.live.h": "Draw here, see it in the game.",
    "card.live.p": "Your running Godot game picks up each stroke the moment you lift the pen.",
    "card.files.t": "Aseprite files",
    "card.files.h": "Open what you already have.",
    "card.files.p": "Layers, tags, slices and tilemaps come in and go out untouched. Aseprite scripts run too.",
    "card.godot.t": "Godot 4",
    "card.godot.h": "One export, stable forever.",
    "card.godot.p": "SpriteFrames and TileSets with ids that survive every re-export.",
    "more": "Read more",
    "strip": [
      { t: "Pixel-perfect tools", p: "Pencil, shapes, shading ink, symmetry." },
      { t: "Tilemaps & isometric", p: "Auto-tiling terrain, diamond grid." },
      { t: "Lua, Aseprite-style", p: "Color, Image, Sprite, app.command." },
      { t: "Palettes & indexed", p: "Ramps, presets, indexed and grayscale." },
    ],
    "live.title": "Recolor the fighter. Watch the fight.",
    "live.lede": "This is Live Link in your browser. Change a color in the editor and the battle on the right carries on with it, the way Pixmith updates your running Godot game.",
    "live.editor": "hero.aseprite",
    "live.game": "game.tscn · running",
    "live.hint": "Pick a color, then click any part of the fighter: every frame of every move changes.",
    "live.palette": "Palette",
    "live.under": "Under cursor",
    "live.reset": "Reset",
    "live.demo": "A browser demo",
    "editor.title": "A complete editor, made for game art.",
    "editor.lede": "Animation timeline, tilemaps, palettes, filters and exports in one window, the same on macOS, Windows and Linux.",
    "help.title": "Installing the beta",
    "help.lede": "Pixmith is not code-signed yet, so your system may ask once before it opens.",
    "tips": [
      { q: "Windows: “Windows protected your PC”", a: <>Click <kbd>More info</kbd>, then <kbd>Run anyway</kbd>. The installer is built from the public source on GitHub; the warning only means it has no paid signature yet.</> },
      { q: "macOS: “cannot verify Pixmith”", a: <>Drag Pixmith to Applications and open it once. Then open <kbd>System Settings → Privacy &amp; Security</kbd> and click <kbd>Open Anyway</kbd>.</> },
      { q: "Linux", a: <>Unpack the archive and run <kbd>./Pixmith</kbd>. Linux support is best effort during the beta.</> },
      { q: "Found a bug or have an idea?", a: <>Open an issue on <a href={ISSUES}>GitHub</a>. Every report shapes the beta.</> },
    ],
    "close.title": "Start placing pixels.",
    "foot.license": "MIT license",
  },
  id: {
    tagline: "Setiap pixel, pada tempatnya.",
    "nav.live": "Live Link",
    "nav.files": "Aseprite",
    "nav.godot": "Godot",
    "nav.help": "Install",
    "nav.download": "Download",
    "nav.guide": "Panduan",
    dl: {
      title: "Download Pixmith",
      lede: "Pilih sistem kamu. Setiap versi punya editor lengkap, Live Link dan export Godot.",
      meta: (v: string, d: string) => `${v} · rilis ${d} · beta terbuka`,
      yours: "Sistem kamu",
      req: "Kebutuhan",
      soon: "Belum tersedia",
      mac: {
        opts: [
          { t: "Apple Silicon", s: "M1, M2, M3, M4 dan yang lebih baru" },
          { t: "Mac Intel", s: "Kebanyakan Mac tahun 2020 ke bawah" },
        ],
        which: <>Mac kamu yang mana? Buka <kbd>Apple menu → About This Mac</kbd>. <b>Chip: Apple M…</b> berarti Apple Silicon, <b>Processor: Intel</b> berarti Mac Intel.</>,
        intelHere: "Sepertinya ini Mac Intel. Versi Intel belum dirilis.",
        req: ["macOS 13 Ventura atau lebih baru", "Apple Silicon (M1 atau lebih baru)"],
        steps: [<>Buka file <b>.dmg</b> lalu seret Pixmith ke <b>Applications</b>.</>, <>Buka Pixmith. Kalau macOS bilang tidak bisa memverifikasi aplikasinya, buka <kbd>System Settings → Privacy &amp; Security</kbd> lalu klik <kbd>Open Anyway</kbd>.</>],
      },
      windows: {
        opts: [
          { t: "Installer", s: "Disarankan · Pixmith masuk ke Start menu" },
          { t: "Zip portable", s: "Tanpa install: ekstrak lalu jalankan" },
        ],
        req: ["Windows 10 atau 11, 64-bit", "Driver grafis dengan OpenGL"],
        steps: [<>Jalankan installer-nya.</>, <>Kalau muncul <b>Windows protected your PC</b>, klik <kbd>More info</kbd> lalu <kbd>Run anyway</kbd>.</>, <>Buka Pixmith dari Start menu.</>],
      },
      linux: {
        opts: [{ t: "Arsip x64", s: ".tar.gz: ekstrak lalu jalankan" }],
        req: ["x86 64-bit dengan glibc 2.34 atau lebih baru (Ubuntu 22.04, Debian 12, Fedora 35 ke atas)", "X11 atau Wayland dengan OpenGL"],
        steps: [<>Ekstrak: <kbd>tar -xzf Pixmith-linux.tar.gz</kbd></>, <>Jalankan <kbd>./Pixmith</kbd> di dalam foldernya.</>],
      },
      started: "Download kamu sudah mulai",
      next: "Langkah berikutnya",
      godot: "Addon Godot Live Link",
      godotSub: "Ekstrak ke folder addons di project Godot 4 kamu lalu aktifkan. Jalan di debug build.",
      all: "Semua rilis",
    },
    "hero.title1": "Gambar sekali.",
    "hero.title2": "Game kamu",
    "hero.title3": "langsung berubah.",
    "hero.sub": "Editor pixel art yang membuka file .aseprite kamu dan tetap tersambung ke game Godot yang sedang berjalan. Setiap goresan langsung terlihat di tempat ia dimainkan.",
    download: (os: string) => `Download untuk ${os}`,
    downloadAny: "Download Pixmith",
    "hero.eyebrow": "Baru: Godot Live Link",
    "hero.second": "Lihat Live Link",
    "hero.meta": "Beta terbuka, gratis · macOS, Windows, Linux",
    "card.live.t": "Live Link",
    "card.live.h": "Gambar di sini, lihat di game.",
    "card.live.p": "Game Godot yang sedang berjalan mengambil setiap goresan begitu pena kamu angkat.",
    "card.files.t": "File Aseprite",
    "card.files.h": "Buka yang sudah kamu punya.",
    "card.files.p": "Layer, tag, slice dan tilemap masuk dan keluar tanpa berubah. Script Aseprite juga jalan.",
    "card.godot.t": "Godot 4",
    "card.godot.h": "Sekali export, stabil selamanya.",
    "card.godot.p": "SpriteFrames dan TileSet dengan id yang bertahan di setiap export ulang.",
    "more": "Selengkapnya",
    "strip": [
      { t: "Alat pixel-perfect", p: "Pensil, bentuk, shading ink, simetri." },
      { t: "Tilemap & isometrik", p: "Terrain auto-tiling, grid diamond." },
      { t: "Lua ala Aseprite", p: "Color, Image, Sprite, app.command." },
      { t: "Palet & indexed", p: "Ramp, preset, mode indexed dan grayscale." },
    ],
    "live.title": "Ganti warnanya. Lihat pertarungannya.",
    "live.lede": "Ini Live Link di browser kamu. Ganti satu warna di editor dan pertarungan di kanan langsung berlanjut dengan warna barunya, sama seperti Pixmith memperbarui game Godot yang sedang berjalan.",
    "live.editor": "hero.aseprite",
    "live.game": "game.tscn · berjalan",
    "live.hint": "Pilih warna, lalu klik bagian mana saja dari petarungnya: semua frame di setiap gerakan ikut berubah.",
    "live.palette": "Palet",
    "live.under": "Di bawah kursor",
    "live.reset": "Ulang",
    "live.demo": "Demo di browser",
    "editor.title": "Editor lengkap, dibuat untuk aset game.",
    "editor.lede": "Timeline animasi, tilemap, palet, filter dan export dalam satu jendela, sama di macOS, Windows dan Linux.",
    "help.title": "Memasang versi beta",
    "help.lede": "Pixmith belum ditandatangani (code signing), jadi sistem mungkin bertanya sekali sebelum membukanya.",
    "tips": [
      { q: "Windows: “Windows protected your PC”", a: <>Klik <kbd>More info</kbd>, lalu <kbd>Run anyway</kbd>. Installer-nya dibuat dari source publik di GitHub; peringatan itu hanya karena belum punya tanda tangan berbayar.</> },
      { q: "macOS: “tidak bisa memverifikasi Pixmith”", a: <>Seret Pixmith ke Applications lalu buka sekali. Setelah itu buka <kbd>System Settings → Privacy &amp; Security</kbd> dan klik <kbd>Open Anyway</kbd>.</> },
      { q: "Linux", a: <>Ekstrak arsipnya lalu jalankan <kbd>./Pixmith</kbd>. Dukungan Linux masih best effort selama beta.</> },
      { q: "Nemu bug atau punya ide?", a: <>Buka issue di <a href={ISSUES}>GitHub</a>. Setiap laporan ikut membentuk beta ini.</> },
    ],
    "close.title": "Mulai susun pixel kamu.",
    "foot.license": "Lisensi MIT",
  },
} as const;

type Dict = (typeof DICT)["en"];

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: Dict }>({
  lang: "en",
  setLang: () => {},
  t: DICT.en,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem("pixmith-lang");
    } catch {}
    const initial = saved === "id" || saved === "en" ? saved : /^id\b/i.test(navigator.language || "") ? "id" : "en";
    setLangState(initial);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("pixmith-lang", l);
    } catch {}
  };
  return <Ctx.Provider value={{ lang, setLang, t: DICT[lang] as unknown as Dict }}>{children}</Ctx.Provider>;
}

export const useLang = () => useContext(Ctx);
