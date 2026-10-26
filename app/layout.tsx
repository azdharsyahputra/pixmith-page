import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import type { CSSProperties, ReactNode } from "react";
import { LangProvider } from "./i18n";
import "./globals.css";

const pixel = localFont({ src: "./fonts/pixelify-latin.woff2", variable: "--font-pixel", weight: "400 700", display: "swap" });
const body = localFont({
  src: [
    { path: "./fonts/bricolage-latin.woff2", weight: "400 800" },
    { path: "./fonts/bricolage-latin-ext.woff2", weight: "400 800" },
  ],
  variable: "--font-body",
  display: "swap",
});
const mono = localFont({ src: "./fonts/jetbrains-mono-latin.woff2", variable: "--font-mono", weight: "400 700", display: "swap" });

const B = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const metadata: Metadata = {
  title: "Pixmith — draw it, your game already has it",
  description:
    "Pixmith is a free pixel art editor for macOS, Windows and Linux. It opens .aseprite files, exports to Godot 4, and updates the sprites in your running game as you draw.",
  icons: { icon: `${B}/img/logo.png` },
  openGraph: {
    title: "Pixmith — draw it, your game already has it",
    description: "Free pixel art editor. Opens .aseprite files, exports to Godot 4, and your running game updates as you draw.",
    images: [`${B}/img/main-dark.png`],
  },
};

export const viewport: Viewport = { themeColor: "#120d2b" };

export default function RootLayout({ children }: { children: ReactNode }) {
  const vars = { "--frame": `url(${B}/img/frame.svg)`, "--cursor": `url(${B}/img/cursor.svg)` } as CSSProperties;
  return (
    <html lang="en" className={`${pixel.variable} ${body.variable} ${mono.variable}`}>
      <body style={vars}>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
