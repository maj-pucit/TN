"use client";
import { useState, type ReactNode } from "react";
import s from "./accordion.module.css";
import { Icon } from "../Icon";
import { Text } from "../primitives/Text";

export type AccItem = { title: string; sub?: string; body: ReactNode; lead?: ReactNode };

/* <Accordion> — rows that open in place, one at a time. */
/* `full` lets a body run the whole column (a figure band) instead of the 784 reading cap. */
/* `noTop` drops the first row's top rule where a block sits right above it (the legal notice's
   Short Version box), so the two never draw a line between them (Maryam 16 Oct 2026). */
export function Accordion({ items, full, noTop }: { items: AccItem[]; full?: boolean; noTop?: boolean }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className={`${s.acc} ${noTop ? s.noTop : ""}`}>
      {items.map((it, i) => (
        <div key={it.title} className={`${s.i} ${open === i ? s.on : ""}`}>
          <button className={s.h} aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
            {it.lead}
            <span className={s.hB}>
              <Text role="h4" as="span">{it.title}</Text>
              {it.sub && <Text role="desc" as="span">{it.sub}</Text>}
            </span>
            <span className={s.chev}><Icon name="chevDown" /></span>
          </button>
          {open === i && <div className={`${s.b} ${full ? s.full : ""}`}>{it.body}</div>}
        </div>
      ))}
    </div>
  );
}
