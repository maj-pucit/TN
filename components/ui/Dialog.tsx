"use client";
import type { ReactNode } from "react";
import s from "./ui.module.css";
import { Overlay } from "./Overlay";
import { Icon } from "../Icon";
import { Text } from "../primitives/Text";
import type { IconName } from "@/lib/icons";

/* <Dialog> — the .conf dialog with any set of actions (Phase 1 §134): one
   solid accent disc + white glyph, title, an optional fee row (label over
   amount), description, then the action row. `Confirm` is this with Cancel. */
export function Dialog({ icon, title, fee, desc, actions, onClose }: {
  icon: IconName; title: string; fee?: { label: string; value: ReactNode }; desc?: ReactNode;
  actions: ReactNode; onClose?: () => void;
}) {
  return (
    <Overlay onClose={onClose}>
      <div className={s.conf} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className={s.confB}>
          <span className={s.confMk}><Icon name={icon} /></span>
          <Text role="h3">{title}</Text>
          {fee && (
            <span className={s.fee}>
              <Text role="label" as="span" ink="secondary">{fee.label}</Text>
              <Text role="h2" as="span">{fee.value}</Text>
            </span>
          )}
          {desc && <Text role="desc">{desc}</Text>}
        </div>
        <div className={s.confA}>{actions}</div>
      </div>
    </Overlay>
  );
}
