"use client";
import Link from "next/link";
import { useState } from "react";
import { Page, PageHeader, Section, SectionHeader, Text } from "../primitives";
import { Stats, Stat } from "../ui/Figures";
import { Table, PersonCell } from "../ui/Table";
import { Button } from "../ui/Button";
import { Dropdown } from "../ui/Dropdown";
import { DateFilter, isoOf } from "../ui/DateFilter";
import { Icon } from "../Icon";
import { BarChart, LineChart, Rings, Spark, EarnSpark } from "./Charts";
import {
  USERS, CANDS, COURSES, BOOKINGS, TXNS, PAYOUTS, ME, AGENTS, people, money, face, agScore, bkStage,
  heldPayouts, grossProcessed, inProgress, platTake,
} from "@/data/admin";
import s from "./admin.module.css";

/* ============================================================
   SUPER ADMIN DASHBOARD — Phase 1 homeOverview (30 Sep 2026 shape),
   figures read off the same seed. CUT (G8): "Cohorts without a leader",
   "Cohort leaders ready to allot", the Cohort Leaders and Running Cohorts
   figures, the cohort-leader series in Platform Users, Cohort health.
   ============================================================ */
const periodRange = (p: string): [string, string] => {
  const d = new Date();
  if (p === "week") { const m = new Date(d); m.setDate(d.getDate() - ((d.getDay() + 6) % 7)); const e = new Date(m); e.setDate(m.getDate() + 6); return [isoOf(m), isoOf(e)]; }
  if (p === "quarter") { const q = Math.floor(d.getMonth() / 3) * 3; return [isoOf(new Date(d.getFullYear(), q, 1)), isoOf(new Date(d.getFullYear(), q + 3, 0))]; }
  return [isoOf(new Date(d.getFullYear(), d.getMonth(), 1)), isoOf(new Date(d.getFullYear(), d.getMonth() + 1, 0))];
};

const ATTN_ON = false;

export function AdminDashboard() {
  const [period, setPeriod] = useState("month");
  const [[from, to], setRange] = useState(periodRange("month"));
  const ppl = people();
  const uActive = ppl.filter((u) => u.status === "active").length;
  const uInvited = ppl.filter((u) => u.status === "invited").length;
  const uInactive = ppl.filter((u) => u.status === "inactive").length;
  const activeCands = CANDS.filter((c) => c.status === "active").length;
  const agentListed = USERS.filter((u) => u.roles.includes("agent") && u.onboarded !== false).length;
  const staff = USERS.filter((u) => u.internal).length;
  const live = COURSES.filter((c) => c.status === "live").length, draft = COURSES.filter((c) => c.status === "draft").length;
  const ivOverdue = BOOKINGS.filter((b) => bkStage(b) === "held" && b.overdue).length;
  const attn = [
    ivOverdue > 0 && { icon: "video" as const, t: "Recommendations overdue", d: `${ivOverdue} held interview${ivOverdue === 1 ? "" : "s"} past 24h`, href: "/admin/interviews/all/" },
    /* No "Payouts to release": payouts are released through QuickBooks / FAS, not here (19 Oct 2026). */
  ].filter(Boolean) as { icon: "video" | "wallet"; t: string; d: string; href: string }[];
  const courseRev = TXNS.filter((t) => t.cat === "course" && t.dir === "in").reduce((n, t) => n + t.amt, 0);
  const ivRev = TXNS.filter((t) => t.cat === "interview" && t.dir === "in").reduce((n, t) => n + t.amt, 0);
  const courseN = TXNS.filter((t) => t.cat === "course" && t.dir === "in").length;
  const paid = PAYOUTS.filter((p) => p.status === "settled").reduce((n, p) => n + p.net, 0);
  const escrow = PAYOUTS.filter((p) => p.status === "held").reduce((n, p) => n + p.net, 0);
  const returned = PAYOUTS.filter((p) => p.status === "returned").reduce((n, p) => n + p.net, 0);
  const byTrack = ["Explorer", "Builder", "Trailblazer"].map((b) => [b, CANDS.filter((c) => c.bucket === b).length] as const);
  const top = AGENTS().filter((a) => a.status !== "invited").sort((a, b) => agScore(b) - agScore(a) || b.interviewed - a.interviewed).slice(0, 3);
  const link = (label: string, href: string) => <Button kind="link" go href={href}>{label}</Button>;

  return (
    <Page>
      <PageHeader greeting={ME.name.split(" ")[0]}
        desc="Monitor platform activity, users, transactions, and overall operations from one place."
        actions={
          <span className={s.dates}>
            <DateFilter label="From" value={from} onChange={(v) => setRange([v, to])} />
            <DateFilter label="To" value={to} onChange={(v) => setRange([from, v])} />
            <Dropdown value={period} onChange={(v) => { setPeriod(v); setRange(periodRange(v)); }}
              options={[{ value: "week", label: "This week" }, { value: "month", label: "This month" }, { value: "quarter", label: "This quarter" }]} />
          </span>
        } />

      {/* Hidden (Maryam 16 Oct 2026). Flip ATTN_ON to bring it back. */}
      {ATTN_ON && attn.length > 0 && (
        <Section kind="block">
          <SectionHeader title="Needs your attention" />
          <div className={s.attn}>
            {attn.map((a) => (
              <Link key={a.t} href={a.href} className={s.attnC}>
                <span className={s.attnIc}><Icon name={a.icon} /></span>
                <span className={s.attnB}><Text role="h4" as="span">{a.t}</Text><Text role="desc" as="span">{a.d}</Text></span>
                <Icon name="arrowRight" className={s.go} />
              </Link>
            ))}
          </div>
        </Section>
      )}

      <Section kind="block">
        <SectionHeader title="Platform at a glance" />
        <Stats cols={3}>
          <Stat icon="group" label="Total Users" value={String(ppl.length)} desc={`${uActive} active`} />
          <Stat icon="user" label="Candidates" value={String(activeCands)} desc={`of ${CANDS.length} accounts`} />
          <Stat icon="verified" label="Talent Agents" value={String(agentListed)} desc="listed & bookable" />
          <Stat icon="shield" label="Internal Users" value={String(staff)} desc="reviewers, managers & admins" />
          <Stat icon="book" label="Courses" value={String(COURSES.length)} desc={`${live} live · ${draft} draft`} />
          <Stat icon="wallet" label="Earnings" value={money(platTake())} desc="platform take" />
        </Stats>
      </Section>

      <Section>
        <SectionHeader title="Platform Users" actions={link("View Users", "/admin/users/all/")} />
        <BarChart vmax={25} step={5} aria="Candidates and talent agents by period" base={[
          { name: "Candidates", color: "var(--text-primary)", pts: [10, 12, 11, 14, 13, 15, 14, 16, 15, 17, 16, 18] },
          { name: "Talent agents", color: "var(--accent)", pts: [7, 9, 8, 11, 10, 12, 11, 13, 12, 14, 13, 15] },
        ]} />
      </Section>

      <Section>
        <SectionHeader title="Users by status" actions={link("View Users", "/admin/users/all/")} />
        <div className={s.sbar}>
          {[[uActive, "var(--accent)"], [uInvited, "var(--text-primary)"], [uInactive, "var(--chart-grey)"]].map(([n, c], i) => (
            <span key={i} style={{ "--n": n, "--c": c } as React.CSSProperties} />
          ))}
        </div>
        <div className={s.sleg}>
          {([["Active", uActive, "var(--accent)"], ["Inactive", uInvited, "var(--text-primary)"], ["Deactivated", uInactive, "var(--chart-grey)"]] as const).map(([l, n, c], i) => (
            <span key={l} className={s.slegI}>
              {i > 0 && <span className={s.sep}>|</span>}
              <i style={{ "--c": c } as React.CSSProperties} /><Text role="body" as="span" ink="secondary">{l}</Text><b>{n}</b>
            </span>
          ))}
        </div>
      </Section>

      <Section kind="block">
        <SectionHeader title="Money at a glance" actions={link("View Finance", "/admin/finance/transactions/")} />
        <Stats>
          <Stat icon="wallet" label="Gross taken" value={money(grossProcessed())} desc="this window" />
          <Stat icon="locked" label="Funds held" value={money(inProgress())} desc="not yet settled" />
          <Stat icon="verified" label="Released to agents" value={money(paid)} desc="paid out" />
          <Stat icon="wallet" label="Moved to TalentNext" value={money(platTake())} desc="platform take" />
        </Stats>
      </Section>

      <Section kind="block">
        <SectionHeader title="Earnings & Payouts" />
        <div className={s.payRow}>
          <div className={s.card}>
            <SectionHeader title="Platform earnings" actions={link("View Transactions", "/admin/finance/transactions/")} />
            <div className={s.figRow}><span className={s.total}>{money(platTake())}</span><span className={`${s.up} t-caption`}>↗ 12%</span></div>
            <div className={s.earn}>
              {([["book", "Course Payments", `${courseN} Purchased Courses`, "course", courseRev], ["video", "Interview Payments", "22 Re-Interviews", "iv", ivRev]] as const).map(([ic, t, d, k, v]) => (
                <div key={t} className={s.earnRow}>
                  <Icon name={ic} className={s.earnIc} />
                  <span className={s.earnTxt}><Text role="h4" as="span">{t}</Text><Text role="label" as="span" ink="secondary">{d}</Text></span>
                  <EarnSpark k={k} />
                  <span className={s.earnV}>{money(v)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className={s.card}>
            <SectionHeader title="Payouts" actions={link("View Payouts", "/admin/finance/payouts/")} />
            <Rings fmt={money} total={paid + escrow + returned} rings={[
              { l: "Funds held", v: escrow, c: "var(--accent)" },
              { l: "Paid", v: paid, c: "var(--text-primary)" },
              { l: "Refunded", v: returned, c: "var(--chart-grey)" },
            ]} />
          </div>
        </div>
      </Section>

      <Section kind="block">
        <SectionHeader title="Candidates by Track" actions={link("View Candidates", "/admin/users/all/?role=candidate")} />
        <div className={s.bcards}>
          {byTrack.map(([name, n]) => (
            <div key={name} className={s.bcard}>
              <span className={s.bcardL}>
                <Text role="caption" as="span">Candidates</Text>
                <span className={s.figRow}><Text role="h4" as="span">{name}</Text><span className={`${s.up} t-caption`}>↗ {Math.round((n / CANDS.length) * 100)}%</span></span>
                <span className={s.total}>{n}</span>
              </span>
              <Spark k={name} className={s.spark} />
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader title="Interviews" actions={link("View Interviews", "/admin/interviews/all/")} />
        <Stats cols={3}>
            <Stat icon="calendar" label="Interviews booked" value={String(BOOKINGS.filter((b) => bkStage(b) === "booked").length)} desc="Scheduled this month" />
            <Stat icon="video" label="Interviews held" value={String(BOOKINGS.filter((b) => bkStage(b) === "held").length)} desc="Conducted so far" />
            <Stat icon="document" label="Recommendations sent within 24h" value={String(BOOKINGS.filter((b) => bkStage(b) === "reported").length)} desc="Submitted on time" />
        </Stats>
        <LineChart vmax={12} step={2} aria="First interviews and re-interviews by period" base={[
          { name: "First interview", color: "var(--accent)", pts: [4, 5, 6, 5, 7, 8, 7, 9, 8, 10, 9, 11] },
          { name: "Re-interview", color: "var(--text-primary)", fillOpacity: 0.04, pts: [2, 2, 3, 3, 4, 4, 5, 4, 6, 5, 7, 6] },
        ]} />
      </Section>

      <Section kind="block">
        <SectionHeader title="Agent standing" />
        <Table rows={top} rowKey={(a) => a.id} href={(a) => `/admin/users/all/${a.id}/`} pageSize={10} cols={[
          { key: "a", label: "Agent", cell: (a) => <PersonCell name={a.name} img={face(a.name)} /> },
          { key: "r", label: "Rank", cell: (a) => `#${top.indexOf(a) + 1}` },
          { key: "s", label: "Agent Score", cell: (a) => <span className={s.score}><Icon name="star" />{agScore(a).toFixed(1)}{a.scoreApproved === false && <Text role="caption" as="span"> · Starting</Text>}</span> },
          { key: "i", label: "Interviews conducted", cell: (a) => <>{a.interviewed} <Text role="caption" as="span">interviews</Text></> },
        ]} />
      </Section>
    </Page>
  );
}
