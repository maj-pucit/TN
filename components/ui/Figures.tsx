import type { ReactNode } from "react";
import s from "./figures.module.css";
import { Icon } from "../Icon";
import { Text } from "../primitives/Text";
import type { IconName } from "@/lib/icons";

/* <Stats> — the figure grid. Two or four cells (the grid draws its lines as
   gaps, so an unfilled row would paint grey). Four across from 900px. */
export function Stats({ children, cols = 4 }: { children: ReactNode; cols?: 3 | 4 }) {
  return <div className={`${s.grid} ${cols === 4 ? s.four : s.three}`}>{children}</div>;
}

/* <Stat> — a figure cell: black title (h4), grey description, value right. */
export function Stat({ icon, label, value, of, desc }: {
  icon: IconName; label: string; value?: ReactNode; of?: string; desc?: ReactNode;
}) {
  return (
    <div className={s.stat}>
      <span className={s.ic}><Icon name={icon} /></span>
      <Text role="h4" as="div" className={s.l}>{label}</Text>
      {value !== undefined && <Text role="h3" as="div" className={s.n}>{value}{of && <> <small>{of}</small></>}</Text>}
      {desc && <Text role="desc" as="div" className={s.d}>{desc}</Text>}
    </div>
  );
}

/* <Facts> — the facts band: label over value, any number of cells.
   cols=4 is the profile band (two rows of four), cols=3 a three-up. */
export function Facts({ children, cols = 4 }: { children: ReactNode; cols?: 3 | 4 }) {
  return <div className={`${s.grid} ${cols === 4 ? s.four : s.three}`}>{children}</div>;
}

export function Fact({ icon, label, value }: { icon?: IconName; label: string; value: ReactNode }) {
  return (
    <div className={s.fact}>
      <span className={s.factL}>{icon && <Icon name={icon} />}{label}</span>
      <span className={s.factV}>{value}</span>
    </div>
  );
}
