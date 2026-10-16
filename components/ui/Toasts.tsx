"use client";
import { Icon } from "../Icon";
import { Text } from "../primitives/Text";
import { toasts, useStore } from "@/lib/store";
import s from "./toasts.module.css";

/* Phase 1 toast: the .note card (a tick and one line), bottom-right of the
   frame, gone after a few seconds. */
export function Toasts() {
  useStore();
  if (!toasts.length) return null;
  return (
    <div className={s.host} role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`${s.t} ${t.kind === "warn" ? s.warn : ""}`}>
          <Icon name={t.kind === "warn" ? "warning" : "checkOutline"} />
          <Text role="body" as="span">{t.msg}</Text>
        </div>
      ))}
    </div>
  );
}
