import type { ReactNode } from "react";
import s from "./chip.module.css";

/* <Chips> / <Chip> — Phase 1 .skl / .skl-c: a grey pill, 13.5 regular on a
   19px line, 8 by 16 inside, 12 apart. Skills, specialities, permissions,
   a course's "Skills you'll gain". */
export const Chips = ({ children }: { children: ReactNode }) => <div className={s.skl}>{children}</div>;
export const Chip = ({ children }: { children: ReactNode }) => <span className={s.c}>{children}</span>;
