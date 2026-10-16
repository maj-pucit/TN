"use client";
import { useSyncExternalStore } from "react";

/* The app bar's breadcrumb (Phase 1 .crumb-bar): a sub-page — one whose
   PageHeader has a `back` — registers its title and where back goes, and
   the bar reads "Parent › This page". A top-level page clears it. */
type Crumb = { title: string; back: string } | null;
let cur: Crumb = null;
const subs = new Set<() => void>();
export function setCrumb(c: Crumb) { cur = c; subs.forEach((f) => f()); }
export function useCrumb() {
  return useSyncExternalStore((f) => { subs.add(f); return () => { subs.delete(f); }; }, () => cur, () => null);
}
