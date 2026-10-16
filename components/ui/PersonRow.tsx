import Link from "next/link";
import type { ReactNode } from "react";
import { Text } from "../primitives/Text";
import { Icon } from "../Icon";
import s from "./personrow.module.css";

/* <PersonRow> — a list row about a person (Phase 1 .bk-row / .gcard): an
   optional day/time block against a hairline, a 36px face, the name over
   grey lines, and a trailing arrow (a link) or an action. Rows sit at
   --pad-x with no hairlines between them. */
export function PersonRow({ href, img, name, lines, day, time, action, roomy }: {
  href?: string; img: string; name: string; lines?: ReactNode[];
  day?: string; time?: string; action?: ReactNode; roomy?: boolean;
}) {
  const inner = (
    <>
      {day && (
        <span className={s.day}>
          <Text role="caption" as="span" className={s.d}>{day}</Text>
          <Text role="compact" as="span" strong>{time}</Text>
        </span>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={s.face} src={img} alt="" />
      <span className={s.b}>
        <Text role="h4" as="span">{name}</Text>
        {lines?.map((l, i) => <Text key={i} role="desc" as="span">{l}</Text>)}
      </span>
      {action ? <span className={s.act}>{action}</span> : href && <Icon name="arrowRight" className={s.go} />}
    </>
  );
  const cls = `${s.row} ${roomy ? s.roomy : ""}`;
  return href && !action ? <Link href={href} className={cls}>{inner}</Link> : <div className={cls}>{inner}</div>;
}
export const PersonList = ({ children }: { children: ReactNode }) => <div className={s.list}>{children}</div>;
