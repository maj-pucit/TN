"use client";
import { useSyncExternalStore } from "react";

/* ============================================================
   THE PROTOTYPE STORE — the seed records are mutable module data (as in
   Phase 1); an action changes them, then `commit()` re-renders every page
   reading them. Toasts ride the same store. A reload resets everything.
   ============================================================ */
let version = 0;
const subs = new Set<() => void>();
const sub = (f: () => void) => { subs.add(f); return () => { subs.delete(f); }; };
const notify = () => { version++; subs.forEach((f) => f()); };
export function useStore() { return useSyncExternalStore(sub, () => version, () => version); }

/* Run a change against the records and re-render. */
export function commit(fn?: () => void, msg?: string, kind: "ok" | "warn" = "ok") {
  fn?.();
  if (msg) toast(msg, kind);
  notify();
}

export type ToastItem = { id: number; msg: string; kind: "ok" | "warn" };
export const toasts: ToastItem[] = [];
let tid = 0;
/* No toasts anywhere in the system (Maryam 16 Oct 2026). Callers keep their message
   so the wording survives, but nothing is queued or drawn. Delete the early return to restore. */
const TOASTS_ON = false;
export function toast(msg: string, kind: "ok" | "warn" = "ok") {
  if (!TOASTS_ON) return;
  const id = ++tid;
  toasts.push({ id, msg, kind });
  notify();
  setTimeout(() => { const i = toasts.findIndex((t) => t.id === id); if (i >= 0) toasts.splice(i, 1); notify(); }, 2700);
}
