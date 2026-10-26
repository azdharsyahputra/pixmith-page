"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "id";

const MCP = "https://github.com/azdharsyahputra/pixmith-mcp";
const ISSUES = "https://github.com/azdharsyahputra/pixmith/issues";

// Every string on the page, in both languages. Values may hold markup.
const DICT = {
  en: {
    "hud.level": "LV",
    "dlg.speaker": "PIXMITH",
    "dlg.title": "Draw it. Your game already has it.",
    "dlg.sub": "A pixel art editor that opens your .aseprite files and talks to your running Godot game, so every stroke lands where it will be played.",
    "dlg.more": "Free open beta · macOS, Windows, Linux",
    "menu.download": (os: string) => `Download for ${os}`,
    "menu.downloadAny": "Download",
    "menu.other": "Other platforms",
    "menu.live": "See Live Link",
    "menu.source": "Source code",
    "menu.help": "Arrow keys + Enter",
    "live.title": "LIVE LINK",
    "live.lede": "Paint on the sprite. The game on the right picks it up the moment you lift the brush, the way Pixmith updates your running Godot game.",
    "live.editor": "hero.aseprite",
    "live.game": "game.tscn · running",
    "live.hint": "Click or drag to paint",
    "live.reset": "Reset",
    "live.demo": "A browser demo of Live Link.",
    "inv.title": "INVENTORY",
    "inv.lede": "What you carry into every project.",
    "inv.select": "Select an item",
    "items": [
      { name: "Aseprite Tome", desc: "Opens and saves .aseprite and .ase as they are: layers, tags, slices, tilemaps, user data. Aseprite Lua scripts run too." },
      { name: "Godot Gate", desc: "Exports SpriteFrames and TileSets for Godot 4 with stable ids. Live Link updates the sprite in your running game." },
      { name: "Tile Brush", desc: "Tilesets, tilemap layers, an auto-tiling terrain brush and a diamond grid for isometric tiles." },
      { name: "Onion Lantern", desc: "Layers, groups, blend modes, frames, tags, onion skin, tweening and a preview that plays your animations." },
      { name: "Palette Gem", desc: "RGBA, indexed and grayscale modes, palette ramps and presets, color wheel and sliders, shading ink." },
      { name: "Scroll of Lua", desc: "An Aseprite-compatible Lua API: Color, Image, Sprite, app.command, dialogs, plugins. Scripts ask before touching files." },
      { name: "Familiar", desc: "The Pixmith MCP server lets AI assistants such as Claude edit the open document, one undo step each, and look at your running game." },
      { name: "Format Bag", desc: "PNG, GIF, WebP, JPEG, BMP, TGA, ICO, PCX, FLI/FLC and sprite sheets with JSON, in and out." },
    ],
    "map.title": "WORLD MAP",
    "map.lede": "The whole editor, the same on macOS, Windows and Linux.",
    "map.main": "Editor",
    "map.frames": "Timeline",
    "map.tiles": "Tilemaps",
    "map.godot": "Godot export",
    "tips.title": "TAVERN TIPS",
    "tips.lede": "Pixmith is an open beta and not code-signed yet, so your system may ask once before it opens.",
    "tips": [
      { q: "Windows says “Windows protected your PC”", a: <>Click <kbd>More info</kbd>, then <kbd>Run anyway</kbd>. The installer is built from the public source on GitHub; the warning only means it has no paid signature yet.</> },
      { q: "macOS says it can’t verify Pixmith", a: <>Drag Pixmith to Applications and open it once. Then open <kbd>System Settings → Privacy &amp; Security</kbd> and click <kbd>Open Anyway</kbd>.</> },
      { q: "Linux", a: <>Unpack the archive and run <kbd>./Pixmith</kbd>. Linux support is best effort during the beta.</> },
      { q: "Found a bug or have an idea?", a: <>Open an issue on <a href={ISSUES}>GitHub</a>. Every report shapes the beta.</> },
      { q: "Let an AI draw with you", a: <>Install the <a href={MCP}>Pixmith MCP server</a> and your assistant can edit the open document and check the result in your running game.</> },
    ],
    "save.title": "SAVE YOUR GAME?",
    "save.yes": "Yes, download Pixmith",
    "save.no": "Not yet, view the source",
    "foot.license": "MIT license",
  },
  id: {
    "hud.level": "LV",
    "dlg.speaker": "PIXMITH",
    "dlg.title": "Gambar sekali. Game kamu langsung berubah.",
    "dlg.sub": "Editor pixel art yang membuka file .aseprite kamu dan tersambung ke game Godot yang sedang berjalan, jadi setiap goresan langsung terlihat di tempat ia dimainkan.",
    "dlg.more": "Beta terbuka, gratis · macOS, Windows, Linux",
    "menu.download": (os: string) => `Download untuk ${os}`,
    "menu.downloadAny": "Download",
    "menu.other": "Platform lain",
    "menu.live": "Lihat Live Link",
    "menu.source": "Source code",
    "menu.help": "Tombol panah + Enter",
    "live.title": "LIVE LINK",
    "live.lede": "Warnai sprite-nya. Game di sebelah kanan langsung berubah begitu kuas kamu angkat, sama seperti Pixmith memperbarui game Godot kamu yang sedang berjalan.",
    "live.editor": "hero.aseprite",
    "live.game": "game.tscn · berjalan",
    "live.hint": "Klik atau seret untuk mewarnai",
    "live.reset": "Ulang",
    "live.demo": "Demo Live Link di browser.",
    "inv.title": "INVENTORY",
    "inv.lede": "Bekal kamu di setiap project.",
    "inv.select": "Pilih sebuah item",
    "items": [
      { name: "Kitab Aseprite", desc: "Buka dan simpan .aseprite dan .ase apa adanya: layer, tag, slice, tilemap, user data. Script Lua Aseprite juga jalan." },
      { name: "Gerbang Godot", desc: "Export SpriteFrames dan TileSet untuk Godot 4 dengan id stabil. Live Link memperbarui sprite di game yang sedang berjalan." },
      { name: "Kuas Tile", desc: "Tileset, layer tilemap, kuas terrain auto-tiling dan grid diamond untuk tile isometrik." },
      { name: "Lentera Onion", desc: "Layer, grup, blend mode, frame, tag, onion skin, tweening dan preview yang memutar animasi kamu." },
      { name: "Permata Palet", desc: "Mode RGBA, indexed dan grayscale, ramp dan preset palet, color wheel dan slider, shading ink." },
      { name: "Gulungan Lua", desc: "API Lua yang kompatibel dengan Aseprite: Color, Image, Sprite, app.command, dialog, plugin. Script minta izin sebelum menyentuh file." },
      { name: "Familiar", desc: "Server MCP Pixmith membuat asisten AI seperti Claude bisa mengedit dokumen yang terbuka, satu langkah undo per edit, dan melihat game yang berjalan." },
      { name: "Tas Format", desc: "PNG, GIF, WebP, JPEG, BMP, TGA, ICO, PCX, FLI/FLC dan sprite sheet dengan JSON, masuk maupun keluar." },
    ],
    "map.title": "PETA DUNIA",
    "map.lede": "Editor lengkap, sama di macOS, Windows dan Linux.",
    "map.main": "Editor",
    "map.frames": "Timeline",
    "map.tiles": "Tilemap",
    "map.godot": "Export Godot",
    "tips.title": "TIPS DARI KEDAI",
    "tips.lede": "Pixmith masih beta terbuka dan belum ditandatangani (code signing), jadi sistem mungkin bertanya sekali sebelum membukanya.",
    "tips": [
      { q: "Windows bilang “Windows protected your PC”", a: <>Klik <kbd>More info</kbd>, lalu <kbd>Run anyway</kbd>. Installer-nya dibuat dari source publik di GitHub; peringatan itu hanya karena belum punya tanda tangan berbayar.</> },
      { q: "macOS bilang tidak bisa memverifikasi Pixmith", a: <>Seret Pixmith ke Applications lalu buka sekali. Setelah itu buka <kbd>System Settings → Privacy &amp; Security</kbd> dan klik <kbd>Open Anyway</kbd>.</> },
      { q: "Linux", a: <>Ekstrak arsipnya lalu jalankan <kbd>./Pixmith</kbd>. Dukungan Linux masih best effort selama beta.</> },
      { q: "Nemu bug atau punya ide?", a: <>Buka issue di <a href={ISSUES}>GitHub</a>. Setiap laporan ikut membentuk beta ini.</> },
      { q: "Biarkan AI ikut menggambar", a: <>Pasang <a href={MCP}>server MCP Pixmith</a> dan asisten kamu bisa mengedit dokumen yang terbuka lalu mengecek hasilnya di game yang berjalan.</> },
    ],
    "save.title": "SIMPAN PERMAINAN?",
    "save.yes": "Ya, download Pixmith",
    "save.no": "Nanti dulu, lihat source",
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
