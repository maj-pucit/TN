"use client";
import { useState } from "react";
import { Page, PageHeader, Section, SectionHeader, Text } from "../primitives";
import { Stats, Stat, Facts, Fact } from "../ui/Figures";
import { PersonRow, PersonList } from "../ui/PersonRow";
import { Table, Status } from "../ui/Table";
import { KV } from "../ui/KV";
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
          <Stat icon="creditCard" label="Each" value={`$${A.share}`} desc={`80% of $${A.fee}`} />
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
        <Table even rows={PAYMENTS} rowKey={(r) => r.n + r.d} cols={[
          { key: "n", label: "Interview", cell: (r) => r.n },
          { key: "d", label: "When", cell: (r) => r.d },
          { key: "f", label: "Fee", right: true, cell: () => `$${A.fee}` },
          { key: "y", label: "Yours", right: true, cell: () => `$${A.share}` },
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
   STANDING — Phase 1 V.standing (13.15): the eight-cell grid and Your
   review. The Agent Score is stars out of 5, approved by a reviewer.
   ============================================================ */
export function AgentStanding() {
  return (
    <Page>
      <PageHeader title="Standing" desc="Your Agent Score, your place in browse and your latest review." />
      <Section kind="block">
        <Facts>
          <Fact icon="starOutline" label="Your score" value={<span className={s.score}>{A.approvedScore}<Icon name="star" className={s.star} /></span>} />
          <Fact icon="trophy" label="Your rank" value={`#${A.rank}`} />
          <Fact icon="chart" label="Interview score" value={`${A.rubric} / 5`} />
          <Fact icon="thumbsUp" label="Candidate rating" value={`${A.rating} / 5`} />
          <Fact icon="video" label="Interviews held" value={String(A.ivsQ)} />
          <Fact icon="view" label="Position in browse" value={`${A.rank} of ${A.pool}`} />
          <Fact icon="close" label="Cancelled interviews" value={String(A.cancels)} />
          <Fact icon="warning" label="Late cancellations" value={String(A.lateCancels)} />
        </Facts>
      </Section>
      <Section>
        <SectionHeader title="Your review" />
        <KV ends rows={[
          ["Reviewed by", (
            <span className={s.who}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={A.manager.img} alt="" />{A.manager.name}
            </span>
          )],
          ["How often", "Every quarter"],
          ["Last review", `${A.scoreAt} · ${A.approvedScore}★`],
          ["Next review", A.reviewNext],
        ]} />
      </Section>
    </Page>
  );
}
