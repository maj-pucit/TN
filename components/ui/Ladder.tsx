import s from "./ladder.module.css";
import { Text } from "../primitives/Text";

const RUNGS = ["E1", "E2", "E3", "E4", "E5", "B1", "B2", "B3", "B4", "B5", "T1", "T2", "T3", "T4", "T5"];

/* <Ladder rung={3}> — the 15 levels, 1-based current rung. On a dark card. */
export function Ladder({ rung }: { rung: number }) {
  return (
    <div>
      <div className={s.ladder} aria-label={`Level ${rung} of 15`}>
        {RUNGS.map((r, i) => (
          <i key={r} className={`${s.r} ${i + 1 < rung ? s.done : i + 1 === rung ? s.on : ""}`}>
            <b>{r}</b>
          </i>
        ))}
      </div>
      <div className={s.lab}>
        {["Explorer", "Builder", "Trailblazer"].map((t) => <Text key={t} role="eyebrow" as="span">{t}</Text>)}
      </div>
    </div>
  );
}
