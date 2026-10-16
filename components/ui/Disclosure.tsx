"use client";
import { useState, type ReactNode } from "react";
import s from "./disclosure.module.css";
import { Icon } from "../Icon";
import { Text } from "../primitives/Text";

/* <Disclosure> — a section heading that opens and closes its body (.found). */
export function Disclosure({ title, children, open: start = false }: { title: string; children: ReactNode; open?: boolean }) {
  const [open, setOpen] = useState(start);
  return (
    <div>
      <button className={s.t} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <Icon name="chevDown" /><Text role="sec" as="span">{title}</Text>
      </button>
      {open && <div className={s.b}>{children}</div>}
    </div>
  );
}

/* The "How It Works" body: four facts, then numbered steps. */
export function HowItWorks({ facts, steps }: { facts?: readonly (readonly [string, string])[]; steps: readonly (readonly [string, string])[] }) {
  return (
    <>
      {facts && <div className={s.facts}>
        {facts.map(([l, v]) => (
          <div key={l} className={s.fact}><Text role="eyebrow" as="span" ink="primary">{l}</Text><Text role="h3" as="span">{v}</Text></div>
        ))}
      </div>}
      <ol className={s.steps}>
        {steps.map(([t, d], i) => (
          <li key={t} className={s.step}>
            <Text role="label" as="span" className={s.n}>{i + 1}</Text>
            <Text role="body" as="span" ink="secondary" className={s.sb}><b>{t}</b> {d}</Text>
          </li>
        ))}
      </ol>
    </>
  );
}
