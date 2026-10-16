import type { ReactNode } from "react";
import s from "./darkcard.module.css";
import { Text } from "../primitives/Text";
import { Sparkle } from "./Sparkle";

/* <DarkCard> — the black card. `slot` is the head row's right side: ONE
   control or ONE time, never both. `tal` adds the "Tal recommends" label. */
export function DarkCard({ title, slot, tal, children, titleRole = "sec-lg" }: {
  title: string; slot?: ReactNode; tal?: boolean; children?: ReactNode;
  /* Phase 1 sets most black-card titles at 18; the level card's at 17 (h3). */
  titleRole?: "sec-lg" | "h3" | "sec";
}) {
  return (
    <section className={`${s.card} on-dark`}>
      <div className={s.hd}>
        <div className={s.hdRow}>
          <Text role={titleRole} className={s.title}>{title}</Text>
          {slot && <div className={s.slot}>{slot}</div>}
        </div>
        {tal && <TalLabel />}
      </div>
      {children && <div className={s.body}>{children}</div>}
    </section>
  );
}

/* The Tal sparkle + "Tal recommends". One of the three places Tal stays (G7). */
export function TalLabel({ children = "Tal recommends" }: { children?: ReactNode }) {
  return (
    <span className={s.tal}>
      <Sparkle />
      <Text role="h4" as="span">{children}</Text>
    </span>
  );
}

export const DarkCardActions = ({ children }: { children: ReactNode }) => <div className={s.actions}>{children}</div>;

/* <DarkHeadCard> — the black card that is one heading row (Phase 1 aiHead on a
   .dark-card, e.g. "Your Learning Pulse"): the sparkle + title, the sentence
   under it, and ONE action centred on the right. No rule inside. */
export function DarkHeadCard({ title, desc, act }: { title: string; desc: ReactNode; act?: ReactNode }) {
  return (
    <section className={`${s.card} on-dark`}>
      <div className={s.ah}>
        <div className={s.ahB}>
          <Text role="sec" className={s.ahT}><Sparkle className={s.ahMk} />{title}</Text>
          <Text role="body" ink="secondary">{desc}</Text>
        </div>
        {act && <div className={s.ahA}>{act}</div>}
      </div>
    </section>
  );
}
