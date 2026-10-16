"use client";
import { useEffect, useRef, useState } from "react";
import s from "./dropdown.module.css";
import { Icon } from "../Icon";

export type Option = { value: string; label: string; img?: string; meta?: string };

/* <Dropdown> — our dropdown. `variant="filter"` for a toolbar (shows
   "Label: Value"), `variant="form"` inside a <Field>. `placeholder` leaves
   a form dropdown unselected until the user picks. Click-away closes. */
export function Dropdown({
  options, value, onChange, variant = "filter", label, placeholder, disabled,
}: {
  options: Option[]; value?: string; onChange: (v: string) => void;
  variant?: "filter" | "form"; label?: string; placeholder?: string; disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const cur = options.find((o) => o.value === value);
  return (
    <div ref={ref} className={`${s.dd} ${s[variant]}`}>
      <button type="button" className={`${s.t} t-compact`} aria-haspopup="listbox" aria-expanded={open} disabled={disabled} onClick={() => setOpen((o) => !o)}>
        <span>
          {label && variant === "filter" && <span className={s.lbl}>{label}: </span>}
          {cur ? cur.label : <span className={s.ph}>{placeholder ?? "Select"}</span>}
        </span>
        <Icon name="chevDown" />
      </button>
      {open && (
        <div className={s.menu} role="listbox">
          {options.map((o) => (
            <button key={o.value} type="button" role="option" aria-selected={o.value === value}
              className={`${s.opt} ${o.value === value ? s.on : ""} t-compact`}
              onClick={() => { onChange(o.value); setOpen(false); }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {o.img && <img src={o.img} alt="" />}
              <span>{o.label}</span>
              {o.meta && <span className={`${s.meta} t-label`}>{o.meta}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
