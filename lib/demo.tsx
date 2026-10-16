"use client";
/* ============================================================
   DEMO STATE — the prototype's chrome, not the product.
   `stage`  : the candidate journey stage (?stage=day34, remembered)
   `frame`  : Mobile / Tablet / Desktop (this reader's preference)
   ============================================================ */
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { DEFAULT_STAGE, STAGES } from "./portals";

export type Frame = "mobile" | "tablet" | "desktop";
/* `ui` holds prototype flow flags that must survive a page change but not a
   reload (e.g. "show the Interview booked dialog on the dashboard"). */
type UI = Record<string, unknown>;
type Demo = { stage: string; setStage: (s: string) => void; frame: Frame; setFrame: (f: Frame) => void; ui: UI; setUi: (patch: UI) => void };

const Ctx = createContext<Demo>({ stage: DEFAULT_STAGE, setStage: () => {}, frame: "desktop", setFrame: () => {}, ui: {}, setUi: () => {} });

const read = (k: string) => { try { return localStorage.getItem(k); } catch { return null; } };
const write = (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* private mode */ } };

export function DemoProvider({ children }: { children: ReactNode }) {
  const [stage, setStageS] = useState(DEFAULT_STAGE);
  const [frame, setFrameS] = useState<Frame>("desktop");
  const [ui, setUiS] = useState<UI>({});
  const setUi = useCallback((patch: UI) => setUiS((u) => ({ ...u, ...patch })), []);

  useEffect(() => {
    const q = new URLSearchParams(location.search).get("stage");
    const s = q ?? read("p0-stage");
    if (s && STAGES.some((x) => x.key === s)) setStageS(s);
    const f = read("p0-frame") as Frame | null;
    if (f) setFrameS(f);
  }, []);

  const setStage = useCallback((s: string) => {
    setStageS(s); write("p0-stage", s);
    const u = new URL(location.href); u.searchParams.set("stage", s); history.replaceState(null, "", u);
  }, []);
  const setFrame = useCallback((f: Frame) => { setFrameS(f); write("p0-frame", f); }, []);

  return <Ctx.Provider value={{ stage, setStage, frame, setFrame, ui, setUi }}>{children}</Ctx.Provider>;
}

export const useDemo = () => useContext(Ctx);
export const stageIndex = (k: string) => STAGES.findIndex((s) => s.key === k);
/* true when the current stage is at or after `k` in the journey */
export const atLeast = (cur: string, k: string) => stageIndex(cur) >= stageIndex(k);
