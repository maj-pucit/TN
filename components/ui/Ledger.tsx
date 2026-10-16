import type { ReactNode } from "react";
import s from "./ledger.module.css";
import { Icon } from "../Icon";
import type { IconName } from "@/lib/icons";

/* <Ledger> — Phase 1's .paytbl (the candidate's Previous Transactions, the
   agent's Earnings payments): an eyebrow header row, a hairline under each
   row, cells 16 deep. Cells take the helpers below for their ink. */
export function Ledger({ head, rows, num = [] }: { head: string[]; rows: ReactNode[][]; num?: number[] }) {
  return (
    <div className={s.tbl} style={{ "--cols": head.length } as React.CSSProperties}>
      <div className={`${s.r} ${s.head}`}>{head.map((h, i) => <span key={h} className={num.includes(i) ? s.num : ""}>{h}</span>)}</div>
      {rows.map((r, j) => (
        <div key={j} className={s.r}>{r.map((c, i) => <span key={i} className={num.includes(i) ? s.num : ""}>{c}</span>)}</div>
      ))}
    </div>
  );
}
/* The row's subject (14 Medium), a date or plain figure (12.5 grey), an amount (12.5 Medium). */
export const LName = ({ children }: { children: ReactNode }) => <b className={s.n}>{children}</b>;
export const LText = ({ children }: { children: ReactNode }) => <span className={s.d}>{children}</span>;
export const LAmt = ({ children }: { children: ReactNode }) => <b className={s.amt}>{children}</b>;
/* A status flag (Phase 1 .flag-t): a 16px mark and the words, quiet grey or a state hue. */
export const LFlag = ({ icon, tone = "quiet", children }: { icon: IconName; tone?: "quiet" | "warn" | "ok" | "err"; children: ReactNode }) => (
  <span className={`${s.flag} ${s[tone]}`}><Icon name={icon} />{children}</span>
);
