// Pixel art drawn for this page: the hero and the inventory items. One character per pixel, "." is clear.

export type Sprite = { rows: string[]; pal: Record<string, string> };

const OUT = "#0a0b26";

export const HERO: Sprite = {
  rows: [
    "......OOOO......",
    ".....OHHHHO.....",
    "....OHHHHHHO....",
    "....OHSSSSHO....",
    "....OSESSESO....",
    "....OSSSSSSO....",
    ".....OSSSSO.....",
    "....OTTTTTTO....",
    "...OSTTTTTTSO...",
    "...OSOTTTTOSO...",
    "....OTYTTYTO....",
    "....OTTTTTTO....",
    "....OLLOOLLO....",
    "....OLLOOLLO....",
    "...OKKO..OKKO...",
    "...OOOO..OOOO...",
  ],
  pal: { O: OUT, H: "#8c5cff", S: "#f2a65a", E: OUT, T: "#5b95ff", Y: "#ffb347", L: "#3a3150", K: "#7a4a32" },
};

export const ITEMS: Sprite[] = [
  {
    rows: [
      "............",
      "..OOOOOOOO..",
      ".OVVVVVVVWO.",
      ".OVWWWWWVWO.",
      ".OVVVVVVVWO.",
      ".OVWWWWVVWO.",
      ".OVVVVVVVWO.",
      ".OVWWWWWVWO.",
      ".OVVVVVVVWO.",
      ".OOOOOOOOOO.",
      ".OPPPPPPPPO.",
      "..OOOOOOOO..",
    ],
    pal: { O: OUT, V: "#8c5cff", W: "#c9b6ff", P: "#f4f2ff" },
  },
  {
    rows: [
      "....OOOO....",
      "..OOBBBBOO..",
      ".OBBccccBBO.",
      ".OBccCCccBO.",
      "OBccCCCCccBO",
      "OBcCCCCCCcBO",
      "OBcCCCCCCcBO",
      "OBcCCCCCCcBO",
      "OBcCCCCCCcBO",
      "OBBBBBBBBBBO",
      "OSSSSSSSSSSO",
      "OOOOOOOOOOOO",
    ],
    pal: { O: OUT, B: "#5b95ff", c: "#a9c8ff", C: "#1f2a6b", S: "#6b6680" },
  },
  {
    rows: [
      "........OO..",
      ".......OYYO.",
      "......OYYO..",
      ".....OYYO...",
      "....OKKO....",
      "...OKKO.....",
      "..OGGO......",
      ".OGGGO......",
      "OGGGO.......",
      "OGGO..TTTT..",
      ".OO..TTTTTT.",
      "......TTTT..",
    ],
    pal: { O: OUT, Y: "#ffb347", K: "#b9b4e0", G: "#7bd389", T: "#4f9d5d" },
  },
  {
    rows: [
      "....OOOO....",
      "....O..O....",
      "...OOOOOO...",
      "..OAAAAAAO..",
      ".OAYYYYYYAO.",
      ".OAYWWWWYAO.",
      ".OAYWWWWYAO.",
      ".OAYYYYYYAO.",
      "..OAAAAAAO..",
      "...OOOOOO...",
      "....OAAO....",
      ".....OO.....",
    ],
    pal: { O: OUT, A: "#c97a2b", Y: "#ffb347", W: "#fff3c4" },
  },
  {
    rows: [
      ".....OO.....",
      "....OPPO....",
      "...OPpPPO...",
      "..OPpPPPPO..",
      ".OPpPPPPPPO.",
      "OPPPPPPPPPkO",
      "OkPPPPPPPkkO",
      ".OkPPPPPkkO.",
      "..OkPPPkkO..",
      "...OkPkkO...",
      "....OkkO....",
      ".....OO.....",
    ],
    pal: { O: OUT, P: "#f0508a", p: "#ffc2d8", k: "#a02a5c" },
  },
  {
    rows: [
      "............",
      ".OOOOOOOOOO.",
      "OSSSSSSSSSSO",
      ".OppppppppO.",
      ".OpLLLLLLpO.",
      ".OppppppppO.",
      ".OpLLLLLppO.",
      ".OppppppppO.",
      ".OpLLLppppO.",
      ".OppppppppO.",
      "OSSSSSSSSSSO",
      ".OOOOOOOOOO.",
    ],
    pal: { O: OUT, S: "#c97a2b", p: "#f3e2b8", L: "#5b95ff" },
  },
  {
    rows: [
      "...OOOOOO...",
      "..OCCCCCCO..",
      ".OCCCCCCCCO.",
      ".OCWOCCWOCO.",
      ".OCWOCCWOCO.",
      ".OCCCCCCCCO.",
      ".OCCCMMCCCO.",
      ".OCCCCCCCCO.",
      ".OCCCCCCCCO.",
      ".OCCOCCOCCO.",
      ".OOO.OO.OOO.",
      "............",
    ],
    pal: { O: OUT, C: "#ff6a4d", W: "#f4f2ff", M: OUT },
  },
  {
    rows: [
      "....OOOO....",
      "...OYYYYO...",
      "....OOOO....",
      "..OOBBBBOO..",
      ".OBBBBBBBBO.",
      "OBBBBBBBBBBO",
      "OBBBBDDBBBBO",
      "OBBBBDDBBBBO",
      "OBBBBBBBBBBO",
      "OBBBBBBBBBBO",
      ".OBBBBBBBBO.",
      "..OOOOOOOO..",
    ],
    pal: { O: OUT, B: "#7a4a32", D: "#ffb347", Y: "#c97a2b" },
  },
];

/** A sprite as crisp SVG rects. */
export function PixelSprite({ sprite, size, title }: { sprite: Sprite; size: number; title?: string }) {
  const h = sprite.rows.length;
  const w = Math.max(...sprite.rows.map((r) => r.length));
  const rects = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const c = sprite.rows[y][x];
      const fill = c && c !== "." ? sprite.pal[c] : undefined;
      if (fill) rects.push(<rect key={`${x},${y}`} x={x} y={y} width={1} height={1} fill={fill} />);
    }
  }
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={size}
      height={(size * h) / w}
      shapeRendering="crispEdges"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {rects}
    </svg>
  );
}
