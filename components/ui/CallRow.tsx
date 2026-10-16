import type { ReactNode } from "react";
import { Text } from "../primitives/Text";
import { Icon } from "../Icon";
import s from "./callrow.module.css";

/* The call row on a black card (Phase 1 crow) and the head row's time slot.
   One component for the candidate's interview with their agent and the
   agent's interview with a candidate: a face, the name (+ the verified seal),
   then grey lines, and the action at the right end. */
export const When = ({ children }: { children: ReactNode }) => (
  <Text role="h4" as="span" className={s.when}><Icon name="time" />{children}</Text>
);

export function CallRow({ img, name, verified, lines, action }: {
  img: string; name: string; verified?: boolean; lines: ReactNode[]; action?: ReactNode;
}) {
  return (
    <div className={s.crow}>
      <div className={s.who}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={s.face} src={img} alt="" />
        <div className={s.b}>
          <span className={s.nameRow}><Text role="h3" as="span">{name}</Text>{verified && <Icon name="verified" className={s.verified} />}</span>
          {lines.map((l, i) => <Text key={i} role="compact" as="span" ink="secondary">{l}</Text>)}
        </div>
      </div>
      {action && <div className={s.act}>{action}</div>}
    </div>
  );
}
