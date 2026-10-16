"use client";
import { useEffect, useState, type ReactNode } from "react";
import c from "./chrome.module.css";
import { DemoMenu } from "./AppShell";
import { useDemo } from "@/lib/demo";

/* <Scene> — a full-frame screen with no portal shell (sign-up, log in,
   onboarding): the same prototype frame and demo menu, no rail or bar. */
export function Scene({ children }: { children: ReactNode }) {
  const { frame } = useDemo();
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 50); return () => clearTimeout(t); }, []);
  return (
    <div className={`${c.stage} ${c[frame]}`}>
      <div className={c.device} data-ready={ready || undefined}>
        <div className={`app-root ${c.scene}`}>
          {children}
          <div id="p0-modal" />
        </div>
      </div>
      <DemoMenu portal="candidate" />
    </div>
  );
}
