# Design: Pixmith website

Dark, like the app icon: near-black ground, the Pixmith P built tile by tile and glowing in the logo ramp. A faint
pixel grid sits behind the hero and the pointer paints its cells in the ramp colors, which fade like a brush stroke.
Serif display, tracked capitals, rounded dark cards with a ramp border on hover.

## Tokens

| Token | Value | Use |
| --- | --- | --- |
| `--bg` / `--bg-2` | `#0b0a0f` / `#111017` | Page, ticker and Live Link band |
| `--card` / `--card-2` | `#15141c` / `#1b1a24` | Cards, strip, frames, icon wells |
| `--ink` / `--ink-2` / `--ink-3` | `#f5f2ea` / `#bdb8cc` / `#7f7a93` | Type, secondary text, meta |
| `--rule` / `--rule-2` | white 8% / 16% | Hairlines, outlines |
| `--coral` | `#ff6a4d` | Accent: arrows, dots, wire, focus |
| `--ramp` | violet → blue → pink → coral → amber | Third headline line, nav underline, card hover border, button glow |

## Type

- **Gloock** (`--font-display`): headlines, card titles, the install questions.
- **Hanken Grotesk** (`--font-body`): body text; tracked uppercase (0.16–0.24em) for nav, buttons and labels.
- **JetBrains Mono**: `kbd` only.

## Components

- **Tile P (`TileMark`)**: 16 tiles in a `--tile` grid (gap 8%), rounded 22%, lit top / shaded bottom insets and a
  colored soft shadow; placed in turn on load, loose tiles drift; hover lifts a tile. Settles without motion if the
  animation is held back.
- **Step rule**: an 11-step pixel staircase in coral under headlines (a pixel line in place of a swash).
- **Buttons**: 58px pills; ink-filled with a paper gap ring, or ink outline with a coral dot.
- **Editorial cards**: three across between 1.5px ink rules, text left and image right, coral arrow badge.
- **Feature strip**: four items with circled pixel icons between hairlines.
- **Print**: screenshots in a paper frame with a soft shadow.
- **Live Link demo**: two dark panes joined by a dashed coral wire; a packet runs it on each stroke.

## Motion

Tiles placing and drifting, the packet, gentle hover lifts and image zoom. Exponential ease-out throughout; all of it
stops under `prefers-reduced-motion`.

## Assets

`logo.png` and the editor screenshots from the Pixmith repository; `human-walk.gif` from Pixmith's sample art; pixel
icons drawn in `app/sprites.tsx`; fonts from Google Fonts (OFL), self-hosted in `app/fonts/`.
