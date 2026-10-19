"use client";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
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
  const ref = useRef<HTMLElement>(null);
  useLayoutEffect(() => { setHost(document.getElementById("p0-slider")); }, []);
  /* SMOOTH OPEN AND CLOSE (Maryam 19 Oct 2026). Opening: the panel mounts collapsed and
     grows to its width on the next frame, so the page narrows beside it. Closing: every
     form unmounts its slider the moment Cancel / Save / the X is pressed, so a copy of the
     panel is left in the slot and collapsed instead, then removed. Timers, not
     animation frames (a hidden tab never runs frames), and no motion when reduced. */
  const mounted = !!(open && host);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!mounted || !el) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!still) { el.dataset.state = "closed"; void el.offsetWidth; el.dataset.state = "open"; }
    return () => {
      const slot = el.parentElement ?? host;
      if (still || !slot) return;
      const ghost = el.cloneNode(true) as HTMLElement;
      ghost.setAttribute("aria-hidden", "true");
      ghost.dataset.ghost = "true"; /* the shell ignores it, so the page margin returns as it shrinks */
      ghost.style.pointerEvents = "none";
      slot.appendChild(ghost);
      void ghost.offsetWidth;
      ghost.dataset.state = "closed";
      window.setTimeout(() => ghost.remove(), 320);
    };
  }, [mounted, host]);
  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open, onClose]);
  if (!open || !host) return null;
  return createPortal(
    <aside ref={ref} className={s.peek} role="dialog" aria-label={title} data-state="open">
      <div className={s.in}>
        <div className={s.h}>
          <Text role="sec">{title}</Text>
          <button className={s.x} onClick={onClose} aria-label="Close"><Icon name="close" /></button>
        </div>
        <div className={s.b}>{children}</div>
        {footer && <div className={s.f}>{footer}</div>}
      </div>
    </aside>,
    host,
  );
}
