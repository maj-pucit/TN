"use client";
import { setCrumb } from "@/lib/crumb";
import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import s from "./primitives.module.css";
import { Text } from "./Text";
import { Icon } from "../Icon";

export { Text } from "./Text";

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

/* <Page> — every screen's root. Owns the ground, the page wash and the bottom air. */
export function Page({ children }: { children: ReactNode }) {
  return <div className={s.page}>{children}</div>;
}

/* <HeadBand> — a dashboard's head as ONE section: the greeting and the journey stepper
   together, no divider between them, the band closing with its own full-width bottom
   stroke (Phase 1's .modhead under "Summary by Tal" + the journey). The page wash moves
   off the page and into the band (Maryam 16 Oct 2026). */
export function HeadBand({ children }: { children: ReactNode }) {
  return <div className={s.band}>{children}</div>;
}

/* <PageHeader> — every page has one (Phase 0: no Tal summary band).
   `greeting` swaps the title for "Good morning, {first}" by local time.
   A DETAIL page (one with a `back`) shows its title alone, no description: only a module's
   first page carries one (Maryam 16 Oct 2026). Stated here once so no page can drift. */
export function PageHeader({
  title, desc, actions, back, greeting,
}: {
  title?: string;
  desc?: ReactNode;
  actions?: ReactNode;
  back?: string;
  greeting?: string;
}) {
  const hello = useGreeting(greeting);
  useEffect(() => {
    if (!back || !title) return;
    setCrumb({ title, back });
    return () => setCrumb(null);
  }, [back, title]);
  return (
    <header className={s.ph}>
      {back && (
        <Link href={back} className={s.phBack} aria-label="Back">
          <Icon name="arrowLeft" />
        </Link>
      )}
      <div className={s.phText}>
        <Text role="page">{greeting ? hello : title}</Text>
        {desc && !back && <Text role="desc" className="ph-desc">{desc}</Text>}
      </div>
      {actions && <div className={s.phActs}>{actions}</div>}
    </header>
  );
}

function useGreeting(first?: string) {
  // Server render says "Welcome back" so the static HTML never lies about the hour;
  // the client corrects it on mount.
  const [word, setWord] = useState("Welcome back");
  useEffect(() => {
    const h = new Date().getHours();
    setWord(h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening");
  }, []);
  return first ? `${word}, ${first}` : word;
}

/* <Section> — the unit of page rhythm.
   kind="text"  : a heading/prose section → closes with a hairline (default)
   kind="block" : cards, figures, a table → closes on air, no line
   bare         : a block row with no heading (two in a row sit 20 apart) */
export function Section({
  children, kind = "text", bare, tint, noline, id,
}: {
  children: ReactNode;
  kind?: "text" | "block" | "tabs";
  bare?: boolean;
  tint?: boolean;
  noline?: boolean;
  id?: string;
}) {
  return (
    <section id={id} className={cx(s.sec, kind === "block" && s.block, kind === "tabs" && s.tabs, bare && s.bare, tint && s.tint, noline && s.noline)}>
      {children}
    </section>
  );
}

/* <SectionHeader> — section heading (always --t-sec 16px), optional description, actions right. */
export function SectionHeader({ title, desc, actions, small }: { title: string; desc?: ReactNode; actions?: ReactNode; small?: boolean }) {
  return (
    <div className={s.sh}>
      <div className={s.shText}>
        <Text role={small ? "h4" : "sec"}>{title}</Text>
        {desc && <Text role="desc" className="sh-desc">{desc}</Text>}
      </div>
      {actions && <div className={s.shActs}>{actions}</div>}
    </div>
  );
}

type Gap = 1 | 2 | 3 | 4 | 5 | 6;
/* <Stack> — vertical (or row) spacing on the space scale: gap 1..6 = 4/8/12/16/24/32. */
export function Stack({ children, gap = 4, row }: { children: ReactNode; gap?: Gap; row?: boolean }) {
  return <div className={cx(row ? s.row : s.stack, s[`g${gap}`])}>{children}</div>;
}

/* <Grid> — responsive columns: 1 on a phone, 2 from 600, `cols` from 900. */
export function Grid({ children, cols = 2 }: { children: ReactNode; cols?: 2 | 3 | 4 }) {
  return <div className={cx(s.grid, s[`c${cols}`])}>{children}</div>;
}
