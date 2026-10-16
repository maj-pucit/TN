"use client";
import s from "./tabs.module.css";

export type TabItem = { key: string; label: string; count?: number | string };

/* <Tabs> — the tab strip. Put it in its own <Section kind="tabs">. */
export function Tabs({ items, value, onChange }: { items: TabItem[]; value: string; onChange: (k: string) => void }) {
  return (
    <div className={s.cs} role="tablist">
      {items.map((t) => (
        <button key={t.key} role="tab" aria-selected={t.key === value}
          className={`${s.tab} ${t.key === value ? s.on : ""}`} onClick={() => onChange(t.key)}>
          {t.label}
          {t.count !== undefined && <span className={`${s.n} t-caption`}>{t.count}</span>}
        </button>
      ))}
    </div>
  );
}
