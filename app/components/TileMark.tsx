"use client";

import { useEffect, useState, type CSSProperties } from "react";

// The Pixmith P, tile by tile, in the logo's ramp: violet across the top, blue down the bowl, pink into the
// crossbar, coral to amber down the stem. Each tile is placed in turn when the page opens.
const P: [number, number, string][] = [
  [0, 0, "#a65cf2"], [1, 0, "#8f60f6"], [2, 0, "#7a72fa"], [3, 0, "#5f88ff"],
  [4, 1, "#4f8cff"], [4, 2, "#6a7cff"],
  [3, 3, "#a85fe0"], [2, 3, "#c556c4"], [1, 3, "#dc52a8"],
  [0, 1, "#b85ad6"], [0, 2, "#cc55bd"], [0, 3, "#e3529b"], [0, 4, "#f2557f"],
  [0, 5, "#ff6266"], [0, 6, "#ff7a52"], [0, 7, "#ff9445"],
];

// Loose tiles drifting around the mark, like pixels not yet placed.
const LOOSE: [number, number, string, number][] = [
  [6.2, 0.4, "#f4f2ff", 0.9], [7.4, 1.6, "#5f88ff", 0.55], [8.2, 4.1, "#a65cf2", 0.4], [6.9, 6.4, "#ff9445", 0.5],
  [-1.6, 8.1, "#ff6266", 0.45], [2.6, 8.6, "#dc52a8", 0.35], [5.8, 8.3, "#8f60f6", 0.3], [-1.4, 0.4, "#4f8cff", 0.3],
  [7.6, 2.9, "#e3529b", 0.3], [5.9, 5.2, "#ffb347", 0.4],
];

export default function TileMark() {
  // If the browser holds the placing animation back (a hidden tab, a capture), show the mark settled anyway.
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setSettled(true), 2600);
    return () => window.clearTimeout(id);
  }, []);
  return (
    <div className={settled ? "mark settled" : "mark"} role="img" aria-label="The Pixmith logo, a letter P made of colored pixel tiles">
      {LOOSE.map(([x, y, c, o], i) => (
        <span
          key={`l${i}`}
          className="tile loose"
          style={{ "--x": x, "--y": y, "--c": c, "--o": o, "--d": `${1.2 + i * 0.13}s`, "--f": `${5 + (i % 4)}s` } as CSSProperties}
        />
      ))}
      {P.map(([x, y, c], i) => (
        <span key={i} className="tile" style={{ "--x": x, "--y": y, "--c": c, "--d": `${0.15 + i * 0.07}s` } as CSSProperties} />
      ))}
      <span className="tile spark" style={{ "--x": 4.25, "--y": -0.25, "--c": "#f4f2ff", "--d": "1.4s" } as CSSProperties} />
    </div>
  );
}
