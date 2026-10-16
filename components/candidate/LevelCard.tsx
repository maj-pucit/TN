import { DarkCard } from "../ui/DarkCard";
import { Ladder } from "../ui/Ladder";
import { Text } from "../primitives";
import type { LevelCard as LC } from "@/data/level";
import s from "./level.module.css";

/* The level card: before a level is set it shows the TRACK ("Where You Are
   on the Ladder", Explorer, 1–5 of 15); once set, the level and its rung. */
export function LevelCard({ card }: { card: LC }) {
  if (card.kind === "track") {
    return (
      <DarkCard title="Where You Are on the Ladder" titleRole="h3">
        <div className={s.top}>
          <div className={s.l}><Text role="h2" as="span">Explorer</Text><Text role="compact" as="span" className="ink-secondary">{card.desc}</Text></div>
          <div className={s.r}><Text role="compact" as="span" strong className={s.n}>1–5<small> of 15 levels</small></Text><Text role="compact" as="span" className="ink-secondary">Levels in this track</Text></div>
        </div>
        <Ladder rung={0} />
      </DarkCard>
    );
  }
  return (
    <DarkCard title="Your Level" titleRole="h3">
      <div className={s.top}>
        <div className={s.l}><Text role="h2" as="span">{card.level}</Text><Text role="body" as="span" className="ink-secondary">{card.when}</Text></div>
        <Text role="body" as="span" className={s.n}><small>Level </small>{card.rung}<small> of 15</small></Text>
      </div>
      <Ladder rung={card.rung} />
    </DarkCard>
  );
}
