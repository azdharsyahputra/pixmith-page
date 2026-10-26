"use client";

import { useState } from "react";
import { ITEMS, PixelSprite } from "../sprites";
import { useLang } from "../i18n";
import { Win } from "./ui";

/** Features as an RPG inventory: a grid of item slots and one description box for the item under the cursor. */
export default function Inventory() {
  const { t } = useLang();
  const [at, setAt] = useState(0);
  const items = t.items;
  return (
    <div className="inv">
      <Win className="inv-grid">
        <ul role="listbox" aria-label={t["inv.title"]}>
          {items.map((it, i) => (
            <li key={it.name}>
              <button
                type="button"
                role="option"
                aria-selected={i === at}
                className={i === at ? "slot on" : "slot"}
                onPointerEnter={() => setAt(i)}
                onFocus={() => setAt(i)}
                onClick={() => setAt(i)}
              >
                <PixelSprite sprite={ITEMS[i]} size={52} />
                <span className="slot-name">{it.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </Win>
      <Win className="inv-desc" title={items[at].name}>
        <div className="inv-desc-body">
          <PixelSprite sprite={ITEMS[at]} size={96} title={items[at].name} />
          <p aria-live="polite">{items[at].desc}</p>
        </div>
      </Win>
    </div>
  );
}
