"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "id";

const MCP = "https://github.com/azdharsyahputra/pixmith-mcp";
const ISSUES = "https://github.com/azdharsyahputra/pixmith/issues";

// Every string on the page, in both languages. Values may hold markup.
const DICT = {
  en: {
    tagline: "Every pixel, placed.",
    "nav.live": "Live Link",
    "nav.files": "Aseprite",
    "nav.godot": "Godot",
    "nav.help": "Install",
    "hero.title1": "Draw it.",
    "hero.title2": "Your game",
    "hero.title3": "already has it.",
    "hero.sub": "A pixel art editor that opens your .aseprite files and stays wired to your running Godot game. Every stroke lands where it will be played.",
    download: (os: string) => `Download for ${os}`,
    downloadAny: "Download Pixmith",
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
      { t: "AI that draws along", p: "MCP server for Claude and friends." },
    ],
    "live.title": "Paint the sprite. Watch the game.",
    "live.lede": "This is Live Link in your browser: paint on the left, and the game on the right picks the sprite up when you lift the brush, the way Pixmith updates your running Godot game.",
    "live.editor": "hero.aseprite",
    "live.game": "game.tscn · running",
    "live.hint": "Click or drag to paint",
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
      { q: "Let an AI draw with you", a: <>Install the <a href={MCP}>Pixmith MCP server</a>: your assistant edits the open document and checks the result in your running game.</> },
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
    "hero.title1": "Gambar sekali.",
    "hero.title2": "Game kamu",
    "hero.title3": "langsung berubah.",
    "hero.sub": "Editor pixel art yang membuka file .aseprite kamu dan tetap tersambung ke game Godot yang sedang berjalan. Setiap goresan langsung terlihat di tempat ia dimainkan.",
    download: (os: string) => `Download untuk ${os}`,
    downloadAny: "Download Pixmith",
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
      { t: "AI ikut menggambar", p: "Server MCP untuk Claude dan lainnya." },
    ],
    "live.title": "Warnai sprite-nya. Lihat game-nya.",
    "live.lede": "Ini Live Link di browser kamu: warnai di kiri, dan game di kanan mengambil sprite-nya begitu kuas kamu angkat, sama seperti Pixmith memperbarui game Godot yang sedang berjalan.",
    "live.editor": "hero.aseprite",
    "live.game": "game.tscn · berjalan",
    "live.hint": "Klik atau seret untuk mewarnai",
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
      { q: "Biarkan AI ikut menggambar", a: <>Pasang <a href={MCP}>server MCP Pixmith</a>: asisten kamu mengedit dokumen yang terbuka dan mengecek hasilnya di game yang berjalan.</> },
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
