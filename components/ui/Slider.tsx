"use client";
import { useEffect, useLayoutEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import s from "./slider.module.css";
import { Icon } from "../Icon";
import { Text } from "../primitives/Text";

/* <Slider> — the right slider. Renders into the shell's slider slot
   (#p0-slider), so at desktop the page column narrows beside it. `footer`
   is usually <Button kind="secondary">Cancel</Button> + the primary. */
export function Slider({ title, open, onClose, footer, children }: {
  title: string; open: boolean; onClose: () => void; footer?: ReactNode; children: ReactNode;
}) {
  const [host, setHost] = useState<HTMLElement | null>(null);
  useLayoutEffect(() => { setHost(document.getElementById("p0-slider")); }, []);
  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open, onClose]);
  if (!open || !host) return null;
  return createPortal(
    <aside className={s.peek} role="dialog" aria-label={title}>
      <div className={s.h}>
        <Text role="sec">{title}</Text>
        <button className={s.x} onClick={onClose} aria-label="Close"><Icon name="close" /></button>
      </div>
      <div className={s.b}>{children}</div>
      {footer && <div className={s.f}>{footer}</div>}
    </aside>,
    host,
  );
}
