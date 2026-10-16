import type { ReactNode } from "react";
import { Text } from "../primitives/Text";
import s from "./kv.module.css";

/* <KV> — Phase 1 .kv: a label column (184px from 600) over a hairline,
   the value in the strong weight. Below 600 the label stacks over its value.
   `ends` right-aligns the values (a compact record, e.g. Your review). */
export function KV({ rows, ends }: { rows: [string, ReactNode][]; ends?: boolean }) {
  return (
    <div className={`${s.kv} ${ends ? s.ends : ""}`}>
      {rows.map(([k, v]) => (
        <div key={k} className={s.row}>
          <Text role="compact" as="span" ink="secondary" className={s.k}>{k}</Text>
          <Text role="compact" as="span" strong className={s.v}>{v}</Text>
        </div>
      ))}
    </div>
  );
}
