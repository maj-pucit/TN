"use client";
import { useState } from "react";
import s from "./toggle.module.css";
import { Text } from "../primitives/Text";

/* <ToggleRow> — a setting that switches on and off. */
export function ToggleRow({ title, desc, on: start = true }: { title: string; desc: string; on?: boolean }) {
  const [on, setOn] = useState(start);
  return (
    <div className={s.row}>
      <span className={s.b}><Text role="h4" as="span">{title}</Text><Text role="desc" as="span">{desc}</Text></span>
      <button className={s.sw} role="switch" aria-checked={on} aria-label={title} onClick={() => setOn((o) => !o)} />
    </div>
  );
}
