# Design: Pixmith website

A 16-bit JRPG the visitor is already playing. Night-scene pixel art carries the first viewport; every action lives
in a JRPG window and is chosen with a cursor menu.

## Tokens

| Token | Value | Use |
| --- | --- | --- |
| `--night` | `#120d2b` | Page ground, scene sky top |
| `--night-2` | `#171036` | Alternate band, with a 32px checkerboard (`#1c1440`) |
| `--win-top` → `--win-bottom` | `#2d3aa8` → `#121a63` | Window fill (vertical) |
| `--ink` / `--ink-2` / `--ink-3` | `#f4f2ff` / `#d4d0f2` / `#a9a4d6` | Text, secondary, captions |
| `--gold` | `#ffd36b` | Window titles, the selected item, focus rings, links |
| `--coral` | `#ff6a4d` | Live Link wire and packet |
| `--violet` `--blue` `--pink` `--amber` | `#8c5cff` `#5b95ff` `#f0508a` `#ffb347` | Sprites and scene light (the logo ramp) |
| `--outline` | `#0a0b26` | Sprite outlines, pixel text shadow |

## Type

- **Pixelify Sans** (self-hosted, `--font-pixel`): headings, window titles, menus, dialogue, labels.
- **Bricolage Grotesque** (`--font-body`): reading text (ledes, descriptions, answers).
- **JetBrains Mono** (`--font-mono`): `kbd` and code only.
- Headings carry a 3–4px pixel drop shadow in `--outline`, the SNES text convention; nothing else uses hard shadows.

## Components

- **Window (`.win`)**: 18px border from `public/img/frame.svg` (an 18×18 pixel frame, 9-sliced at 6), fill gradient
  inside the frame, optional gold title. Every surface that holds content is a window.
- **Cursor menu (`Menu`)**: pixel-font links; the selected one turns gold with the `cursor.svg` arrow stepping beside
  it. Pointer hover, focus and the arrow keys move the cursor; Enter or click acts.
- **Typed dialogue (`Typed`)**: types a line in place; the full text is in the DOM from the start; reduced motion
  shows it at once.
- **Inventory**: 4-column slot grid (selected slot gets a 3px gold inset) plus one description window.
- **Scene / Live Link demo**: canvases at native pixel size scaled with `image-rendering: pixelated`.

## Motion

One language: stepped (`steps(2)`) loops for the cursor and the "next" arrow, a single eased packet along the Live
Link wire per stroke, parallax of a few whole pixels on the scene. All of it stops under `prefers-reduced-motion`.

## Assets

`public/img/frame.svg` and `cursor.svg`: drawn for this site. `logo.png` and the editor screenshots: from the
Pixmith repository (`assets/`, `docs/design/screens/`). Scene and sprites: drawn in code (`app/components/Scene.tsx`,
`app/sprites.tsx`). Fonts: Google Fonts, OFL, self-hosted in `app/fonts/`.
