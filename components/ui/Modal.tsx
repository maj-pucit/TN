"use client";
import type { ReactNode } from "react";
import s from "./ui.module.css";
import { Overlay } from "./Overlay";

/* <Modal> — a plain sheet: content, then a footer of actions. */
export function Modal({ children, footer, onClose, label }: { children: ReactNode; footer?: ReactNode; onClose: () => void; label: string }) {
  return (
    <Overlay onClose={onClose}>
      <div className={s.sheet} role="dialog" aria-modal="true" aria-label={label} onClick={(e) => e.stopPropagation()}>
        <div className={s.sheetB}>{children}</div>
        {footer && <div className={s.sheetF}>{footer}</div>}
      </div>
    </Overlay>
  );
}
