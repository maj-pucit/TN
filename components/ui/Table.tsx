"use client";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import s from "./table.module.css";
import { Icon } from "../Icon";
import { Dropdown } from "./Dropdown";
import { Text } from "../primitives/Text";
import type { IconName } from "@/lib/icons";

export type Col<R> = { key: string; label: string; right?: boolean; cell: (r: R) => ReactNode };
export type RowAction = { icon: IconName; label: string; onClick: () => void; danger?: boolean };

/* <Table> — one page at a time (5 rows by default; 5/10/25/50). A row with
   `href` opens it; `actions` adds the one kebab per row. */
export function Table<R>({
  cols, rows, rowKey, href, actions, pageSize = 5, selected, onSelect, even,
}: {
  cols: Col<R>[]; rows: R[]; rowKey: (r: R) => string;
  href?: (r: R) => string | undefined; actions?: (r: R) => RowAction[]; pageSize?: number;
  /* Row selection (Phase 1 admin tables with a kebab): a box per row and a
     select-all that takes the whole list, every page. */
  selected?: string[]; onSelect?: (ids: string[]) => void;
  /* Every column the same width, all left-aligned, so the gaps between them are equal. */
  even?: boolean;
}) {
  const router = useRouter();
  const [size, setSize] = useState(pageSize);
  const [page, setPage] = useState(1);
  const pages = Math.max(1, Math.ceil(rows.length / size));
  const cur = Math.min(page, pages);
  const slice = rows.slice((cur - 1) * size, cur * size);

  return (
    <div>
      <div className={s.wrap}>
        <table className={`${s.tbl} ${even ? s.even : ""}`}>
          <thead>
            <tr>
              {onSelect && (
                <th className={s.sel}>
                  <Check on={rows.length > 0 && rows.every((r) => selected?.includes(rowKey(r)))}
                    label="Select all" onClick={() => onSelect(rows.every((r) => selected?.includes(rowKey(r))) ? [] : rows.map(rowKey))} />
                </th>
              )}
              {cols.map((c) => <th key={c.key} className={`t-compact w-strong ${c.right ? s.right : ""}`}>{c.label}</th>)}
              {actions && <th className={`${s.act} t-compact w-strong`}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {slice.map((r) => {
              const to = href?.(r);
              return (
                <tr key={rowKey(r)} className={to ? s.clk : undefined} onClick={to ? () => router.push(to) : undefined}>
                  {onSelect && (
                    <td className={s.sel} onClick={(e) => e.stopPropagation()}>
                      <Check on={!!selected?.includes(rowKey(r))} label="Select row"
                        onClick={() => { const k = rowKey(r); onSelect(selected?.includes(k) ? selected.filter((x) => x !== k) : [...(selected ?? []), k]); }} />
                    </td>
                  )}
                  {cols.map((c, i) => (
                    <td key={c.key} className={`t-compact ${i === 0 ? "w-strong" : ""} ${c.right ? s.right : ""}`}>{c.cell(r)}</td>
                  ))}
                  {actions && <td className={s.act} onClick={(e) => e.stopPropagation()}><RowMenu items={actions(r)} /></td>}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {rows.length > 5 && (
        <div className={s.pgn}>
          <div className={`${s.pgnSize} t-body`}>
            Rows per page
            <Dropdown value={String(size)} onChange={(v) => { setSize(Number(v)); setPage(1); }}
              options={[5, 10, 25, 50].map((n) => ({ value: String(n), label: String(n) }))} />
          </div>
          <div className={`${s.pgnInfo} t-body`}>{(cur - 1) * size + 1}–{Math.min(cur * size, rows.length)} of {rows.length}</div>
          <div className={s.pgnNav}>
            <button className={s.pgBtn} disabled={cur === 1} onClick={() => setPage(cur - 1)} aria-label="Previous page"><Icon name="chevLeft" /></button>
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <button key={n} className={`${s.pgBtn} ${n === cur ? s.on : ""}`} onClick={() => setPage(n)}>{n}</button>
            ))}
            <button className={s.pgBtn} disabled={cur === pages} onClick={() => setPage(cur + 1)} aria-label="Next page"><Icon name="chevRight" /></button>
          </div>
        </div>
      )}
    </div>
  );
}

/* A row-select box: a quiet light-grey square, the accent with a white
   tick when on (Phase 1 .tbl-cb). A button, never a native input. */
function Check({ on, label, onClick }: { on: boolean; label: string; onClick: () => void }) {
  return (
    <button type="button" role="checkbox" aria-checked={on} aria-label={label} className={`${s.cb} ${on ? s.cbOn : ""}`} onClick={onClick}>
      {on && <Icon name="check" />}
    </button>
  );
}

/* The bulk action bar that stands in for nothing else on the admin: shown
   while rows are selected, centred at the foot of the frame. */
export function BulkBar({ count, actions, onClear }: { count: number; actions: { icon: IconName; label: string; onClick: () => void }[]; onClear: () => void }) {
  /* Portalled into the shell's dock layer: bottom-centre of the content column, 20px up. */
  const [host, setHost] = useState<HTMLElement | null>(null);
  useLayoutEffect(() => { setHost(document.getElementById("p0-dock")); }, []);
  if (!count) return null;
  const bar = (
    <div className={s.bulk} role="toolbar" aria-label="Selected rows">
      <Text role="body" as="span" ink="secondary"><b>{count}</b> selected</Text>
      <span className={s.bulkSep} />
      {actions.map((a) => (
        <button key={a.label} type="button" className={`${s.bulkB} t-body`} onClick={a.onClick}><Icon name={a.icon} />{a.label}</button>
      ))}
      <button type="button" className={s.bulkX} aria-label="Clear selection" onClick={onClear}><Icon name="close" /></button>
    </div>
  );
  return host ? createPortal(bar, host) : null;
}

/* The kebab menu. The table wrapper scrolls sideways, which clips anything
   that overflows it, so the open list is portalled to <body> and placed
   against the kebab: below it, or above when there is no room below.
   Scrolling or resizing closes it. */
export function RowMenu({ items }: { items: RowAction[] }) {
  const [pos, setPos] = useState<{ top: number; right: number; up: boolean } | null>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!pos) return;
    const close = (e: Event) => {
      if (e.type === "mousedown" && (list.current?.contains(e.target as Node) || btn.current?.contains(e.target as Node))) return;
      setPos(null);
    };
    document.addEventListener("mousedown", close);
    window.addEventListener("resize", close);
    document.addEventListener("scroll", close, true);
    return () => {
      document.removeEventListener("mousedown", close);
      window.removeEventListener("resize", close);
      document.removeEventListener("scroll", close, true);
    };
  }, [pos]);
  const toggle = () => {
    if (pos) return setPos(null);
    const r = btn.current!.getBoundingClientRect();
    const up = window.innerHeight - r.bottom < 220;
    setPos({ top: up ? r.top : r.bottom, right: window.innerWidth - r.right, up });
  };
  return (
    <div className={s.rm}>
      <button ref={btn} className={s.rmT} aria-label="Actions" aria-expanded={!!pos} onClick={toggle}><Icon name="overflow" /></button>
      {pos && createPortal(
        <div ref={list} className={`${s.rmList} ${pos.up ? s.up : ""}`} role="menu"
          style={{ "--rm-top": `${pos.top}px`, "--rm-right": `${pos.right}px` } as CSSProperties}>
          {items.map((a) => (
            <button key={a.label} role="menuitem" className={`${s.rmI} ${a.danger ? s.danger : ""} t-compact`}
              onClick={() => { setPos(null); a.onClick(); }}>
              <Icon name={a.icon} />{a.label}
            </button>
          ))}
        </div>,
        document.body,
      )}
    </div>
  );
}

/* A person cell: round face + name (+ optional sub-line). */
export function PersonCell({ name, img, sub }: { name: string; img: string; sub?: string }) {
  return (
    <span className={s.pcell}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={img} alt="" />
      <span className={s.pcellB}>
        <span>{name}</span>
        {sub && <Text role="caption" as="span">{sub}</Text>}
      </span>
    </span>
  );
}

/* Status is coloured text, never a chip. */
/* <StatusChip> — Phase 1 .tag.sm: the state word in its hue inside a round
   hairline pill (a service's state, "This device"). Lists use <Status>. */
export function StatusChip({ tone, children }: { tone: "green" | "warn" | "red" | "plain"; children: ReactNode }) {
  return <span className={`${s.chip} ${s["st-" + tone]}`}>{children}</span>;
}

export function Status({ tone, children }: { tone: "green" | "warn" | "red" | "plain"; children: ReactNode }) {
  return <span className={s[`st-${tone}`]}>{children}</span>;
}
