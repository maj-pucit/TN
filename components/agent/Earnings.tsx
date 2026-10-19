"use client";
import { useState } from "react";
import { Page, PageHeader, Section, SectionHeader, Text } from "../primitives";
import { Stats, Stat } from "../ui/Figures";
import { PersonRow, PersonList } from "../ui/PersonRow";
import { Table, Status } from "../ui/Table";
import { Button } from "../ui/Button";
import { PayModal } from "../ui/CardPicker";
import { Icon } from "../Icon";
import { AGENT as A, IVS, PAYMENTS, PAYOUT, PHOTO, dayDate } from "@/data/agent";
import s from "./money.module.css";

/* ============================================================
   EARNINGS — Phase 1 V.earnings on the working week: this month's four
   figures, what's holding up your pay (at most two rows), the payments
   ledger, and the one payout destination (a Stripe reference, 13.1).
   ============================================================ */
export function AgentEarnings() {
  const [pay, setPay] = useState(false);
  const owed = IVS.filter((x) => x.st === "report").slice(0, 2);
  return (
    <Page>
      <PageHeader title="Earnings" desc="What you have earned, what is held, and where your payouts go." />
      {/* Every section on Earnings closes with a divider (Maryam 16 Oct 2026), so they are
          text sections even where they hold figures or a table. */}
      <Section>
        <SectionHeader title="This month" />
        <Stats>
          <Stat icon="wallet" label="Earned" value={`$${A.earned}`} desc="released to your account" />
          <Stat icon="locked" label="Held for you" value={`$${A.escrow}`} desc={`of $${A.grossHeld} gross held`} />
          <Stat icon="video" label="Interviews" value={String(A.month)} desc={`${A.ivs} in total`} />
          <Stat icon="creditCard" label="Each" value={`$${A.share}`} desc="Your fee, paid in full" />
        </Stats>
      </Section>
      <Section>
        <SectionHeader title="What’s holding up your pay" />
        <PersonList>
          {owed.map((x) => (
            <PersonRow key={x.id} img={PHOTO[x.id]} name={x.n}
              lines={[`Interviewed ${dayDate(x.day)} · $${A.share} waiting on the recording`]}
              action={<Button kind="link" go href={`/agent/interviews/${x.id}/`}>Send Recommendation</Button>} />
          ))}
        </PersonList>
      </Section>
      <Section>
        <SectionHeader title="Payments" />
        {/* The admin Table itself (Maryam 16 Oct 2026): black header over one rule, no row
            lines, first column the black anchor, status as plain coloured text, paged. */}
        <Table rows={PAYMENTS} rowKey={(r) => r.n + r.d} cols={[
          { key: "n", label: "Interview", cell: (r) => r.n },
          { key: "d", label: "When", cell: (r) => r.d },
          { key: "f", label: "Fee", cell: () => `$${A.fee}` },
          { key: "y", label: "Yours", cell: () => `$${A.share}` },
          { key: "s", label: "Status", cell: (r) => <Status tone={r.st === "green" ? "green" : r.st === "warn" ? "warn" : "plain"}>{r.s}</Status> },
        ]} />
      </Section>
      <Section>
        <SectionHeader title="Where you get paid" />
        <div className={s.dest}>
          <span className={s.destIc}><Icon name="wallet" /></span>
          <span className={s.destB}>
            <Text role="h4" as="span" className={s.destT}>{PAYOUT.bank} •••• {PAYOUT.last}<Icon name="checkFilled" className={s.tick} /></Text>
            <Text role="desc" as="span">Verified {PAYOUT.verified}</Text>
          </span>
          <Button kind="link" go onClick={() => setPay(true)}>Update Payout Destination</Button>
        </div>
      </Section>
      {pay && <PayModal onClose={() => setPay(false)} />}
    </Page>
  );
}

/* ============================================================
   STANDING — the Phase 0 MVP cut of 13.15 (Maryam's senior, 19 Oct 2026),
   with Maryam's useful additions from her own sketch (19 Oct 2026). Four
   figure cards (the same <Stats> band the admin agent detail opens with),
   each with a one-line sub-line, then how the score works. Maryam tried the
   sketch's lower blocks (score by quarter, reliability, recent activity) the
   same day and asked for them back out.
   ============================================================ */
export function AgentStanding() {
  const top = Math.round((A.rank / A.pool) * 100);
  return (
    <Page>
      <PageHeader title="Standing" desc="Your Agent Score, your rank among listed agents and your reliability." />
      <Section kind="block">
        <Stats>
          <Stat icon="starOutline" label="Agent Score" desc="Out of 5"
            value={<span className={s.score}>{A.approvedScore}<Icon name="star" className={s.star} /></span>} />
          <Stat icon="trophy" label="Your rank" value={`#${A.rank}`} of={`of ${A.pool}`} desc={`Top ${top}%`} />
          <Stat icon="video" label="Interviews held" value={String(A.ivsQ)} desc="This quarter" />
          <Stat icon="close" label="Cancellations" value={String(A.cancels)}
            desc={`${A.lateCancels} late cancellation${A.lateCancels === 1 ? "" : "s"}`} />
        </Stats>
      </Section>
      <Section>
        <SectionHeader title="How your score works" />
        <Text role="desc" as="p">
          Your Agent Score combines your interview score and your candidates’ ratings. Candidates browse agents in score
          order, and your rank is refreshed every week. Cancellations are counted here but do not change your score.
        </Text>
      </Section>
    </Page>
  );
}
