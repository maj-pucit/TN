"use client";
import { useEffect, useRef, useState } from "react";
import s from "./dropdown.module.css";
import t from "./table.module.css";
import { Icon } from "../Icon";

export type Option = { value: string; label: string; img?: string; meta?: string };

/* Open state, click-away and the room left below the trigger, shared by both
   dropdowns. The menu always opens DOWNWARD (Phase 1 §127) and is never cut off
   by the screen edge: on open it measures the room below the trigger and caps
   its height to it, so a long list scrolls inside the menu instead. */
function useMenu() {
  const [open, setOpen] = useState(false);
  const [room, setRoom] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const toggle = () => {
    if (!open && ref.current) setRoom(Math.max(120, Math.floor(window.innerHeight - ref.current.getBoundingClientRect().bottom - 16)));
    setOpen((o) => !o);
  };
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);
  const menuStyle = room ? ({ "--menu-room": `${room}px` } as React.CSSProperties) : undefined;
  return { open, setOpen, toggle, ref, menuStyle };
}

/* <Dropdown> — our dropdown. `variant="filter"` for a toolbar (shows
   "Label: Value"), `variant="form"` inside a <Field>. `placeholder` leaves
   a form dropdown unselected until the user picks. Click-away closes. */
export function Dropdown({
  options, value, onChange, variant = "filter", label, placeholder, disabled,
}: {
  options: Option[]; value?: string; onChange: (v: string) => void;
  variant?: "filter" | "form"; label?: string; placeholder?: string; disabled?: boolean;
}) {
  const { open, setOpen, toggle, ref, menuStyle } = useMenu();
  const cur = options.find((o) => o.value === value);
  return (
    <div ref={ref} className={`${s.dd} ${s[variant]}`}>
      <button type="button" className={`${s.t} t-compact`} aria-haspopup="listbox" aria-expanded={open} disabled={disabled} onClick={toggle}>
        <span>
          {label && variant === "filter" && <span className={s.lbl}>{label}: </span>}
          {cur ? cur.label : <span className={s.ph}>{placeholder ?? "Select"}</span>}
        </span>
        <Icon name="chevDown" />
      </button>
      {open && (
        <div className={s.menu} role="listbox" style={menuStyle}>
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

/* <MultiDropdown> — the form dropdown that takes several picks (Phase 1
   formDdMulti). Each option leads with the table's own row-select box, the
   menu stays open while picking, and the picks show INSIDE the trigger as small
   round chips, each with its own remove cross. `value` keeps
   the order things were picked in. */
/* `allLabel` adds an "All …" row on top (Maryam 26 Oct 2026). Ticked, the value is ["*"]:
   EVERY option, including ones added later, so it is saved as "all", not as today's list.
   It shows as one chip. Unticking one option while "all" is on keeps the others. */
export const ALL = "*";
export function MultiDropdown({
  options, value, onChange, placeholder, disabled, allLabel,
}: {
  options: Option[]; value: string[]; onChange: (v: string[]) => void; placeholder?: string; disabled?: boolean; allLabel?: string;
}) {
  const { open, toggle, ref, menuStyle } = useMenu();
  const isAll = !!allLabel && value.includes(ALL);
  const flip = (v: string) => {
    if (isAll) return onChange(options.map((o) => o.value).filter((x) => x !== v));
    const next = value.includes(v) ? value.filter((x) => x !== v) : [...value, v];
    onChange(allLabel && next.length === options.length ? [ALL] : next);
  };
  const picked = isAll ? [{ value: ALL, label: allLabel! }] : (value.map((v) => options.find((o) => o.value === v)).filter(Boolean) as Option[]);
  const remove = (o: Option) => (o.value === ALL ? onChange([]) : flip(o.value));
  /* THE PICKS SIT INSIDE THE FIELD as chips, in place of an "N selected" count (Maryam
     2 Nov 2026); the field grows a line when they wrap. The trigger is a focusable div,
     not a <button>, because each chip carries its own remove button and buttons cannot
     nest. A chip's × stops its click so removing one never opens the menu. */
  const key = (e: React.KeyboardEvent) => { if (!disabled && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); toggle(); } };
  /* A <Field> is a <label>, and a click anywhere inside a label is replayed on the first
     button in it — here a chip's × or the first menu option, so opening the field picked an
     option and picking an option removed a chip (2 Nov 2026). Cancelling the click's default
     action stops that replay; every button's own onClick still runs. */
  return (
    <div className={s.multi} onClick={(e) => e.preventDefault()}>
      <div ref={ref} className={`${s.dd} ${s.form}`}>
        <div role="combobox" tabIndex={disabled ? -1 : 0} className={`${s.t} ${s.tMulti} t-compact`} aria-haspopup="listbox" aria-expanded={open}
          aria-disabled={disabled || undefined} onClick={() => !disabled && toggle()} onKeyDown={key}>
          {picked.length ? (
            <span className={s.picks}>
              {picked.map((o) => (
                <span key={o.value} className={s.pick}>
                  {o.label}
                  {!disabled && (
                    <button type="button" aria-label={`Remove ${o.label}`} onClick={(e) => { e.stopPropagation(); remove(o); }}><Icon name="close" /></button>
                  )}
                </span>
              ))}
            </span>
          ) : <span className={s.ph}>{placeholder ?? "Select"}</span>}
          <Icon name="chevDown" />
        </div>
        {open && (
          <div className={s.menu} role="listbox" aria-multiselectable="true" style={menuStyle}>
            {allLabel && (
              <button type="button" role="option" aria-selected={isAll}
                className={`${s.opt} ${s.optMulti} t-compact`} onClick={() => onChange(isAll ? [] : [ALL])}>
                <span className={`${t.cb} ${isAll ? t.cbOn : ""}`} aria-hidden="true">{isAll && <Icon name="check" />}</span>
                <span>{allLabel}</span>
              </button>
            )}
            {options.map((o) => {
              const on = isAll || value.includes(o.value);
              return (
                <button key={o.value} type="button" role="option" aria-selected={on}
                  className={`${s.opt} ${s.optMulti} t-compact`} onClick={() => flip(o.value)}>
                  <span className={`${t.cb} ${on ? t.cbOn : ""}`} aria-hidden="true">{on && <Icon name="check" />}</span>
                  <span>{o.label}</span>
                  {o.meta && <span className={`${s.meta} t-label`}>{o.meta}</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
