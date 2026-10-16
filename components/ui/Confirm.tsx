"use client";
import { useState, type ReactNode } from "react";
import s from "./ui.module.css";
import { Overlay } from "./Overlay";
import { Icon } from "../Icon";
import { Text } from "../primitives/Text";
import { Button } from "./Button";
import type { IconName } from "@/lib/icons";

/* The .conf confirmation (Phase 1 §134): one solid accent disc with a white
   glyph, title, description, Cancel (secondary) + confirm. Every delete and
   every log-out goes through this. */
export function Confirm({
  icon, title, desc, ok, onOk, onCancel, danger, stepup,
}: {
  icon: IconName; title: string; desc?: ReactNode; ok: string;
  onOk: () => void; onCancel: () => void; danger?: boolean;
  /* Step-up (Phase 1 story 1.6): a fresh six-digit code before a
     high-severity action commits; OK stays shut until it is entered. */
  stepup?: boolean;
}) {
  const [code, setCode] = useState("");
  return (
    <Overlay onClose={onCancel}>
      <div className={s.conf} role="alertdialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className={s.confB}>
          <span className={s.confMk}><Icon name={icon} /></span>
          <Text role="h3">{title}</Text>
          {desc && <Text role="desc">{desc}</Text>}
          {stepup && (
            <label className={s.confCode}>
              <Text role="label" as="span" strong ink="primary">Security code</Text>
              <input className={s.confCodeIn} inputMode="numeric" maxLength={6} value={code} placeholder="6-digit code"
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} aria-label="Six-digit security code" />
              <Text role="caption" as="span">We sent a code to your email. Enter it to confirm.</Text>
            </label>
          )}
        </div>
        <div className={s.confA}>
          <Button kind="secondary" onClick={onCancel}>Cancel</Button>
          <Button kind={danger ? "danger" : "primary"} disabled={stepup && code.length < 6} onClick={onOk}>{ok}</Button>
        </div>
      </div>
    </Overlay>
  );
}
