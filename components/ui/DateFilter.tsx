"use client";
import { useEffect, useRef, useState } from "react";
import { Icon } from "../Icon";
import s from "./datefilter.module.css";

/* <DateFilter> — Phase 1's date filter (admin): a bordered pill "From:
   10-01-2026" with a clear ×, opening a month grid (Sunday first). Never a
   native date input. Value is ISO yyyy-mm-dd, or "" for Any. */
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const pad = (n: number) => String(n).padStart(2, "0");
export const isoOf = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const label = (iso: string) => { const [y, m, d] = iso.split("-"); return `${m}-${d}-${y}`; };

export function DateFilter({ label: l, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const base = value ? new Date(value + "T00:00:00") : new Date();
  const [ym, setYm] = useState({ y: base.getFullYear(), m: base.getMonth() });
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);
  const first = new Date(ym.y, ym.m, 1).getDay(), days = new Date(ym.y, ym.m + 1, 0).getDate();
  const today = isoOf(new Date());
  const step = (d: number) => setYm(({ y, m }) => { const n = new Date(y, m + d, 1); return { y: n.getFullYear(), m: n.getMonth() }; });
  return (
    <div ref={ref} className={s.f}>
      <button type="button" className={`${s.t} t-compact`} aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <Icon name="calendar" /><span>{l}: {value ? label(value) : "Any"}</span>
      </button>
      {value && <button type="button" className={s.x} aria-label={`Clear ${l}`} onClick={() => onChange("")}><Icon name="close" /></button>}
      {open && (
        <div className={s.pop} role="dialog" aria-label={`${l} date`}>
          <div className={s.h}>
            <button type="button" className={s.nav} aria-label="Previous month" onClick={() => step(-1)}><Icon name="chevLeft" /></button>
            <span className={`${s.m} t-compact w-strong`}>{MONTHS[ym.m]} {ym.y}</span>
            <button type="button" className={s.nav} aria-label="Next month" onClick={() => step(1)}><Icon name="chevRight" /></button>
          </div>
          <div className={`${s.wd} t-caption`}>{["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <span key={i}>{d}</span>)}</div>
          <div className={s.grid}>
            {Array.from({ length: first }, (_, i) => <span key={`x${i}`} />)}
            {Array.from({ length: days }, (_, i) => {
              const iso = `${ym.y}-${pad(ym.m + 1)}-${pad(i + 1)}`;
              return (
                <button key={iso} type="button" className={`${s.d} ${iso === value ? s.on : ""} ${iso === today ? s.today : ""} t-compact`}
                  onClick={() => { onChange(iso); setOpen(false); }}>{i + 1}</button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
