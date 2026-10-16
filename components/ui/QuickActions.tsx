"use client";
import Link from "next/link";
import s from "./quickactions.module.css";
import { Icon } from "../Icon";
import { Text } from "../primitives/Text";
import type { IconName } from "@/lib/icons";

export type QuickAction = { icon: IconName; title: string; desc: string; href?: string; ring?: number };

/* <QuickActions> — the dashboard's row of action cards. A descriptor is a
   STATIC line about the destination, never the queue's data. */
export function QuickActions({ items, onPick }: { items: QuickAction[]; onPick?: (q: QuickAction) => boolean }) {
  return (
    <div className={`${s.qa} ${items.length === 3 ? s.three : ""}`}>
      {items.map((q) => (
        <Link key={q.title} href={q.href ?? "#"} className={s.c} onClick={(e) => { if (onPick?.(q)) e.preventDefault(); }}>
          {q.ring !== undefined ? <Ring pct={q.ring} /> : <span className={s.ic}><Icon name={q.icon} /></span>}
          <span className={s.b}>
            <Text role="h4" as="span">{q.title}</Text>
            <Text role="compact" as="span" ink="secondary">{q.desc}</Text>
          </span>
          <span className={s.go}><Icon name="arrowRight" /></span>
        </Link>
      ))}
    </div>
  );
}

/* Phase 1's .ring: two circles; the arc is a dasharray LENGTH (2πr × pct). */
function Ring({ pct }: { pct: number }) {
  const r = 17, c = 2 * Math.PI * r;
  return (
    <span className={s.ring}>
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <circle cx="20" cy="20" r={r} fill="none" strokeWidth="3" className={s.ringTrack} />
        <circle cx="20" cy="20" r={r} fill="none" strokeWidth="3" className={s.ringArc} strokeDasharray={`${(c * pct) / 100} ${c}`} />
      </svg>
      <Text role="label" as="span" className={s.ringN}>{pct}%</Text>
    </span>
  );
}
