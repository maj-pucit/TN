"use client";
import { useEffect, useLayoutEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import s from "./ui.module.css";

/* <Overlay> — every modal renders through this. It portals into the shell's
   #p0-modal layer, which covers the WHOLE frame, app bar included (Phase 1:
   "a modal overlay covers the whole frame"). Escape and a backdrop click close. */
export function Overlay({ children, onClose }: { children: ReactNode; onClose?: () => void }) {
  const [host, setHost] = useState<HTMLElement | null>(null);
  /* The host is found BEFORE the first paint and nothing is drawn until it is: a
     modal first drawn inline in the page and then moved into the frame layer
     flickers and jumps to the centre (Maryam 16 Oct 2026). */
  useLayoutEffect(() => { setHost(document.getElementById("p0-modal")); }, []);
  useEffect(() => {
    if (!onClose) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);
  const node = <div className={s.scrim} onClick={onClose} role="presentation">{children}</div>;
  return host ? createPortal(node, host) : null;
}
