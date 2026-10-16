import type { ReactNode } from "react";
import s from "./progresswing.module.css";
import { Text } from "../primitives/Text";
import { Icon } from "../Icon";
import type { IconName } from "@/lib/icons";

/* <ProgressWing> — Phase 1's `.prog` head-band figure: a big number left, a
   second figure right (link blue), a segmented bar, and a row of small
   figures. The candidate’s "Your Course Progress" and the agent's "Your
   earnings" are this one component. A segment is done (accent), now (a
   light accent) or empty. */
export function ProgressWing({ title, big, bigLabel, right, rightLabel, segs, figs, full, below }: {
  title: string; big: ReactNode; bigLabel: string; right: ReactNode; rightLabel: string;
  segs: ("done" | "now" | "")[]; figs?: { icon: IconName; v: string; l: string }[];
  /* `below`: any block under the bar instead of the inline figures. Leave both out for a bare bar. */
  below?: ReactNode;
  /* `full` drops the 784px cap: the candidate dashboard's head band (Maryam 16 Oct 2026). */
  full?: boolean;
}) {
  return (
    <div className={`${s.prog} ${full ? s.full : ""}`}>
      <Text role="h3" as="h2">{title}</Text>
      <div className={s.top}>
        <div className={s.pct}>
          <Text role="display" as="span">{big}</Text>
          <Text role="compact" as="span" ink="secondary">{bigLabel}</Text>
        </div>
        <div className={s.day}>
          <Text role="compact" as="span" strong className={s.dn}>{right}</Text>
          <Text role="compact" as="span" ink="secondary">{rightLabel}</Text>
        </div>
      </div>
      <div className={s.seg} aria-hidden="true">
        {segs.map((st, i) => <i key={i} className={st ? s[st] : ""} />)}
      </div>
      {below}
      {figs && <div className={s.figs}>
        {figs.map((f) => (
          <span key={f.l} className={`${s.fig} t-compact`}>
            <Icon name={f.icon} />
            <span className={s.figB}><b>{f.v}</b><span>{f.l}</span></span>
          </span>
        ))}
      </div>}
    </div>
  );
}
