"use client";
import { Page, PageHeader, Section, SectionHeader, HeadBand } from "../primitives";
import { DarkCard } from "../ui/DarkCard";
import { CallRow, When } from "../ui/CallRow";
import { QuickActions } from "../ui/QuickActions";
import { ProgressWing } from "../ui/ProgressWing";
import { Stats, Stat } from "../ui/Figures";
import { Button } from "../ui/Button";
import { AGENT as A, IVS, PHOTO, dayDate, kindLabel, levelLine } from "@/data/agent";

/* ============================================================
   AGENT HOME — Phase 1 V.dashboard on the working week, minus the Tal
   summary band (G3): greeting → "Your earnings" → the next interview's
   black card → Quick Actions.
   ============================================================ */
export function AgentDashboard() {
  const next = IVS.find((x) => x.st === "next")!;
  return (
    <Page>
      {/* The greeting and "Your earnings" are ONE head band, as on the candidate dashboard
          (Maryam 16 Oct 2026): no divider between them, the band's own bottom stroke, the
          page wash inside it, the earnings row at full width. */}
      <HeadBand>
      <PageHeader greeting={A.first} desc="Your next interview and what needs your attention today." />
      <Section>
        <ProgressWing full title="Your earnings"
          big={`$${A.earned}`} bigLabel="Earned This Month"
          right={`$${A.escrow}`} rightLabel="Awaiting Release"
          segs={["done", "done", "done", "done", "now", "now", "now"]} />
      </Section>
      {/* The three figures: their own block section of three joint cards inside the band,
          one section gap under the bar, as on the candidate's Week 1 dashboard (Maryam 16 Oct 2026). */}
      <Section kind="block" bare>
        <Stats cols={3}>
          <Stat icon="video" label="Interviews Completed" value={String(A.month)} desc="This month" />
          <Stat icon="wallet" label="Fee per Interview" value={`$${A.share}`} desc="Paid to you in full" />
          <Stat icon="creditCard" label="Gross Held" value={`$${A.grossHeld}`} desc="Released once you send the evaluation" />
        </Stats>
      </Section>
      </HeadBand>
      <DarkCard title="Upcoming Interview" slot={<When>{dayDate(next.day)} · {next.time}</When>}>
        <NextCall id={next.id} />
      </DarkCard>
      <Section kind="block">
        <SectionHeader title="Quick Actions" />
        <QuickActions items={[
          { icon: "video", title: "Recordings to Confirm", desc: "For pending payment release.", href: "/agent/interviews/?tab=eval" },
          { icon: "calendar", title: "Upcoming Interviews", desc: "View your scheduled interviews.", href: "/agent/interviews/?tab=next" },
        ]} />
      </Section>
    </Page>
  );
}

/* The call row for an upcoming interview. Join is the gated accent primary:
   disabled until a minute before the call (DESIGN §3, Phase 1 §81). */
export function NextCall({ id, actions }: { id: string; actions?: React.ReactNode }) {
  const x = IVS.find((i) => i.id === id)!;
  return (
    <CallRow img={PHOTO[x.id]} name={x.n}
      lines={[`${kindLabel(x)} · ${levelLine(x)}`, `45 minutes · Recorded · $${A.fee} already paid and held`]}
      action={actions ?? <Button kind="accent" iconEnd="video" disabled>Join Call</Button>} />
  );
}
