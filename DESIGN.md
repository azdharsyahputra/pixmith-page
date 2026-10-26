# Design: Pixmith website

Premium editorial on art paper, where the pixels are the artwork. The Pixmith P, built tile by tile, carries the first
viewport; everything else is set like a print catalogue: serif display, tracked capitals, ink rules, framed prints.

## Tokens

| Token | Value | Use |
| --- | --- | --- |
| `--paper` / `--paper-2` / `--card` | `#f3eee3` / `#ebe4d5` / `#f8f4ec` | Page, wells, cards and frames |
| `--ink` / `--ink-2` / `--ink-3` | `#18214d` / `#3c4470` / `#6b6f8a` | Type, rules, secondary text |
| `--rule` | `#d8cfbd` | Hairlines inside cards |
| `--coral` | `#f05a42` | The accent: third headline line, step rule, arrows, dots, focus |
| `--night` | `#1a1533` | The Live Link band |
| Logo ramp | `#a65cf2` → `#5f88ff` → `#dc52a8` → `#ff9445` | Tiles of the P only |

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
