"use client";
import type { ReactNode } from "react";
import s from "./ui.module.css";
import { Overlay } from "./Overlay";
import { Icon } from "../Icon";
import { Text } from "../primitives/Text";

/* <Sheet> — Phase 1's centred .sheet with a header: the title and its ×
   over an inset rule (bottom inset 12, DESIGN §3 modal frame), the body,
   then the footer of actions. For a form that is not a slider. */
export function Sheet({ title, children, footer, onClose }: { title: string; children: ReactNode; footer: ReactNode; onClose: () => void }) {
  return (
    <Overlay onClose={onClose}>
      <div className={s.sheet} role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className={s.sheetH}>
          <Text role="h3" as="h2">{title}</Text>
          <button type="button" className={s.sheetX} aria-label="Close" onClick={onClose}><Icon name="close" /></button>
        </div>
        <div className={s.sheetB}>{children}</div>
        <div className={s.sheetF}>{footer}</div>
      </div>
    </Overlay>
  );
}
