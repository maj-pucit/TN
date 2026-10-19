"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { Page, PageHeader, Section, SectionHeader, Stack, Text } from "../primitives";
import { Table, PersonCell, Status, RowMenu, type RowAction } from "../ui/Table";
import { Tabs } from "../ui/Tabs";
import { KV } from "../ui/KV";
import { Button } from "../ui/Button";
import { Dropdown } from "../ui/Dropdown";
import { Search, Toolbar, Field, TextArea } from "../ui/Field";
import { DateFilter } from "../ui/DateFilter";
import { Sheet } from "../ui/Sheet";
import { Confirm } from "../ui/Confirm";
import { Icon } from "../Icon";
import { UpcomingBody, RecCard, Transcript } from "./People";
import { commit, toast, useStore } from "@/lib/store";
import {
  RAW, BOOKINGS, TXNS, BK_STAGE, BK_STAGE_ORDER, bkStage, bkStageTone, bkType, bkFirst, bkFunding, bkPaid, bkEscrow,
  bkWhen, dpFmt, slot12, emailOf, candEmail, scenesConsent, recStatus, face, money, toneOf, type Tone,
} from "@/data/admin";
import s from "./admin.module.css";
import t from "../candidate/interviews.module.css";
import pr from "../candidate/profile.module.css";

/* ============================================================
   INTERVIEWS — Phase 1 Epic 8: the register (marketBookings), the booking
   detail (marketBooking), the recordings register (marketRecordings) and
   the recording detail (marketRecordingDetail). CUT (rebooking credit):
   Resolve and the "Awaiting candidate" stage — a Not-held booking is final.
   ============================================================ */
const St = ({ v }: { v: [Tone, string] | null }) => (v ? <Status tone={v[0]}>{v[1]}</Status> : <>—</>);
const overdue = (word: string, days: number) => <Status tone="red">{`${word} ${days} day${days === 1 ? "" : "s"} overdue`}</Status>;
const reportDue = (b: any) => bkStage(b) !== "held" ? "—" : b.overdue ? overdue("Recommendation", b.overdueDays) : "Within 24h";
const approvalDue = (b: any) => bkStage(b) !== "await" ? "—" : b.apprOverdue ? overdue("Approval", b.apprOverdueDays) : "Within 24h";
const twoLine = (a: string, b: string) => <span className={s.two}><span>{a}</span><Text role="caption" as="span">{b}</Text></span>;
const inRange = (d: string, from: string, to: string) => (!from || d >= from) && (!to || d <= to);

/* ---------------- The register ---------------- */
export function AdminInterviews() {
  useStore();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [stage, setStage] = useState("all");
  const [kind, setKind] = useState("all");
  const [from, setFrom] = useState(""), [to, setTo] = useState("");
  const ql = q.toLowerCase();
  const base = BOOKINGS
    .filter((b) => kind === "all" || (kind === "re") === /re-?interview/i.test(b.kind))
    .filter((b) => inRange(b.date || "", from, to))
    .filter((b) => !q || [b.cand, b.agent, candEmail(b.cand), emailOf(b.agent)].some((x) => x.toLowerCase().includes(ql)))
    .sort((a, b) => String(b.date).localeCompare(String(a.date)) || String(b.slot).localeCompare(String(a.slot)));
  const rows = base.filter((b) => stage === "all" || bkStage(b) === stage);
  return (
    <Page>
      <PageHeader title="Interview register" desc="Every interview and the stage it reached. A record of who met whom, and where each one stands."
        actions={<Button kind="ghost" size="sm" icon="download" onClick={() => exportToast(rows.length)}>Export</Button>} />
      <Section kind="tabs">
        <Tabs value={stage} onChange={setStage} items={[{ key: "all", label: "All", count: base.length },
          ...BK_STAGE_ORDER.map((k) => ({ key: k, label: BK_STAGE[k], count: base.filter((b) => bkStage(b) === k).length }))]} />
      </Section>
      <Section kind="block">
        <Toolbar search={<Search value={q} onChange={setQ} placeholder="Search by candidate or agent" />}
          filters={<>
            <Dropdown label="Type" value={kind} onChange={setKind} options={[{ value: "all", label: "All" }, { value: "first", label: "First interview" }, { value: "re", label: "Re-interview" }]} />
            <DateFilter label="From" value={from} onChange={setFrom} />
            <DateFilter label="To" value={to} onChange={setTo} />
          </>} />
        {rows.length ? (
          <Table rows={rows} rowKey={(b) => b.id} href={(b) => `/admin/interviews/all/${b.id}/`} cols={[
            { key: "c", label: "Candidate", cell: (b) => <PersonCell name={b.cand} img={face(b.cand)} sub={candEmail(b.cand)} /> },
            { key: "a", label: "Agent", cell: (b) => <PersonCell name={b.agent} img={face(b.agent)} /> },
            { key: "t", label: "Type", cell: (b) => bkType(b) },
            { key: "w", label: "Scheduled", cell: (b) => twoLine(dpFmt(b.date), slot12(b.slot)) },
            { key: "s", label: "Stage", cell: (b) => <St v={bkStageTone(b)} /> },
            { key: "f", label: "Fee", cell: (b) => (bkFirst(b) || !b.fee ? "Free" : money(b.fee)) },
            { key: "p", label: "Payout state", cell: (b) => <St v={bkEscrow(b.escrow)} /> },
            { key: "r", label: "Recommendation due", cell: reportDue },
            { key: "ap", label: "Approval due", cell: approvalDue },
          ]} actions={(b) => [{ icon: "view", label: "View", onClick: () => router.push(`/admin/interviews/all/${b.id}/`) }]} />
        ) : <Empty title="No interviews match" q={q} />}
      </Section>
    </Page>
  );
}
const exportToast = (n: number) => toast(n ? `Exporting ${n} row${n === 1 ? "" : "s"}. A download link will reach your notifications, valid 7 days.` : "Nothing to export in this filter", n ? "ok" : "warn");
function Empty({ title, q }: { title: string; q?: string }) {
  return <div className={s.empty}><Icon name="video" /><Text role="h4" as="span">{title}</Text><Text role="desc" as="span">{q ? `Nothing matches “${q}” in this filter.` : "Nothing in this filter yet."}</Text></div>;
}

/* ---------------- One booking ---------------- */
export function AdminBooking({ id }: { id: string }) {
  useStore();
  const router = useRouter();
  const b = BOOKINGS.find((x) => x.id === id);
  if (!b) return null;
  const st = bkStage(b);
  const back = "/admin/interviews/all/";
  if (st === "booked") {
    return (
      <Page>
        <PageHeader back={back} title={`Interview with ${b.cand}`} desc={`${b.agent} · ${bkType(b)} · ${bkWhen(b)}`} actions={<St v={bkStageTone(b)} />} />
        <UpcomingBody b={b} />
      </Page>
    );
  }
  const txn = TXNS.find((x) => x.cat === "interview" && x.who === b.cand);
  const plat = b.fee ? Math.round(b.fee * 0.2) : 0, share = (b.fee || 0) - plat;
  const failed = b.transcript === "Failed";
  const tr = b.transcript === "Ready" ? "green" : b.transcript === "Failed" ? "red" : "warn";
  const consent = scenesConsent(b);
  const report: ReactNodeLike =
    st === "held" ? <KV rows={[["Recommendation", b.overdue ? overdue("Recommendation", b.overdueDays) : "Outstanding, due within 24h of the interview"]]} />
    : st === "await" ? <KV rows={[["Recommendation", `Sent ${b.filed || "—"}`], ["Approval", b.apprOverdue ? overdue("Approval", b.apprOverdueDays) : "Awaiting a reviewer, within 24h"]]} />
    : st === "reported" ? <KV rows={[["Recommendation", `Sent ${b.filed || b.date || "—"}`], ["Level", <Status key="l" tone="green">Settled and live on the record</Status>]]} />
    : st === "nothld" ? <Text role="desc" as="p">No interview took place, so no recommendation is due.</Text>
    : <Text role="desc" as="p">This booking is resolved and needs nothing further.</Text>;
  const menu = b.recExists && !b.recDeleted ? <RowMenu items={[{ icon: "play", label: "Open recording", onClick: () => router.push(`/admin/interviews/recordings/${b.id}/`) }]} /> : null;
  return (
    <Page>
      <PageHeader back={back} title="Interview booking" desc={`${b.cand} with ${b.agent}`} actions={<span className={s.headAct}><St v={bkStageTone(b)} />{menu}</span>} />
      <Section>
        <SectionHeader title="Booking" />
        <KV rows={[
          ["Candidate", `${b.cand} · ${candEmail(b.cand)}`], ["Agent", `${b.agent} · ${emailOf(b.agent)}`],
          ["Scheduled", bkWhen(b)], ["Stage", <St key="s" v={bkStageTone(b)} />], ["Type", bkType(b)],
          ["Reschedule history", b.rescheduled || "None"], ["Stated topic", b.topic || "Not recorded"],
        ]} />
      </Section>
      <Section>
        <SectionHeader title="Recording" />
        {!b.recExists ? <Text role="desc" as="p">The interview did not take place, so there is no recording.</Text>
          : b.recDeleted ? <Text role="desc" as="p">The recording and its transcript were deleted here. The row remains as a record that the interview happened.</Text>
          : <KV rows={[
              ["Recording", <span key="r"><Status tone="green">Available</Status> · {b.recLen}</span>],
              ["Transcript", <span key="t" className={s.two}><Status tone={tr}>{b.transcript}</Status>{failed && <Text role="caption" as="span">No transcript, so this interview was not evaluated by Tal.</Text>}</span>],
              ["SCENES consent", <Status key="c" tone={consent === "Given" ? "green" : consent === "Withdrawn" ? "red" : "plain"}>{consent}</Status>],
            ]} />}
      </Section>
      <Section>
        <SectionHeader title="Recommendation" />
        {report}
      </Section>
      <Section>
        <SectionHeader title="Payment" />
        <KV rows={[["Total booking value", b.fee && !bkFirst(b) ? money(b.fee) : "Free"], ["Candidate paid", money(bkPaid(b))], ["Funding source", bkFunding(b)], ["Payout state", <St key="p" v={bkEscrow(b.escrow)} />]]} />
        {b.fee && !bkFirst(b)
          ? <KV rows={[["Transaction", txn ? txn.ref : "No linked transaction"], ["Agent share", money(share)], ["Platform commission", `${money(plat)} · 20%`]]} />
          : <Text role="desc" as="p">Complimentary first interview — nothing to settle.</Text>}
        <Text role="body" as="p" className="ink-helper">The transaction, agent share and commission are Finance data, shown here because a Super Admin holds Finance: View.</Text>
      </Section>
    </Page>
  );
}
type ReactNodeLike = React.ReactNode;

/* ---------------- The recordings register ---------------- */
type RecSheet = { k: "withdraw" | "delete"; id: string } | null;
export function AdminRecordings() {
  useStore();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [f, setF] = useState({ scenes: "all", status: "all", tr: "all" });
  const [from, setFrom] = useState(""), [to, setTo] = useState("");
  const [sheet, setSheet] = useState<RecSheet>(null);
  const ql = q.toLowerCase();
  const rows = BOOKINGS.filter((b) => b.recExists)
    .filter((b) => f.scenes === "all" || scenesConsent(b) === f.scenes)
    .filter((b) => f.status === "all" || recStatus(b) === f.status)
    .filter((b) => f.tr === "all" || b.transcript === f.tr)
    .filter((b) => inRange(b.date || "", from, to))
    .filter((b) => !q || [b.cand, candEmail(b.cand), b.agent].some((x) => x.toLowerCase().includes(ql)))
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));
  const dd = (k: keyof typeof f, label: string, opts: string[]) => (
    <Dropdown label={label} value={f[k]} onChange={(v) => setF((x) => ({ ...x, [k]: v }))} options={["all", ...opts].map((o) => ({ value: o, label: o === "all" ? "All" : o }))} />
  );
  const acts = (b: any): RowAction[] => {
    if (b.recDeleted) return [];
    return [
      { icon: "play", label: "Play", onClick: () => router.push(`/admin/interviews/recordings/${b.id}/`) },
      ...(b.transcript === "Ready" ? [{ icon: "document" as const, label: "Transcript", onClick: () => router.push(`/admin/interviews/recordings/${b.id}/?tab=transcript`) }] : []),
      ...(scenesConsent(b) === "Given" ? [{ icon: "renew" as const, label: "Withdraw SCENES consent", onClick: () => setSheet({ k: "withdraw", id: b.id }) }] : []),
      { icon: "delete", label: "Delete recording", danger: true, onClick: () => setSheet({ k: "delete", id: b.id }) },
    ];
  };
  return (
    <Page>
      <PageHeader title="Recordings & Transcripts" desc="Every interview recording with its consent state, transcript and status. The register shows that a recording exists, not any of its content."
        actions={<Button kind="ghost" size="sm" icon="download" onClick={() => exportToast(rows.length)}>Export</Button>} />
      <Section kind="block">
        <Toolbar search={<Search value={q} onChange={setQ} placeholder="Search by candidate or agent" />}
          filters={<>
            {dd("scenes", "SCENES consent", ["Given", "Withdrawn", "Not asked"])}
            {dd("status", "Status", ["Available", "Deleted"])}
            {dd("tr", "Transcript", ["Generating", "Ready", "Failed"])}
            <DateFilter label="From" value={from} onChange={setFrom} />
            <DateFilter label="To" value={to} onChange={setTo} />
          </>} />
        {rows.length ? (
          <Table rows={rows} rowKey={(b) => b.id} href={(b) => (b.recDeleted ? undefined : `/admin/interviews/recordings/${b.id}/`)} cols={[
            { key: "c", label: "Candidate", cell: (b) => <PersonCell name={b.cand} img={face(b.cand)} sub={candEmail(b.cand)} /> },
            { key: "a", label: "Agent", cell: (b) => <PersonCell name={b.agent} img={face(b.agent)} /> },
            { key: "i", label: "Interview", cell: (b) => twoLine(dpFmt(b.date), bkType(b)) },
            { key: "l", label: "Length", cell: (b) => b.recLen || "—" },
            { key: "t", label: "Transcript", cell: (b) => (
              <span className={s.two}><Status tone={b.transcript === "Ready" ? "green" : b.transcript === "Failed" ? "red" : "warn"}>{b.transcript}</Status>
                {b.transcript === "Failed" && <Text role="caption" as="span">No transcript, so this interview was not evaluated by Tal.</Text>}</span>) },
            { key: "s", label: "SCENES consent", cell: (b) => { const c = scenesConsent(b); return <Status tone={c === "Given" ? "green" : c === "Withdrawn" ? "red" : "plain"}>{c}</Status>; } },
            { key: "st", label: "Status", cell: (b) => <Status tone={recStatus(b) === "Available" ? "green" : "plain"}>{recStatus(b)}</Status> },
          ]} actions={acts} />
        ) : <Empty title="No recordings match" q={q} />}
      </Section>
      {sheet && <RecSheets sheet={sheet} close={() => setSheet(null)} />}
    </Page>
  );
}

/* Withdraw SCENES consent / Delete recording: a reason, then a confirmation. */
function RecSheets({ sheet, close }: { sheet: NonNullable<RecSheet>; close: () => void }) {
  const b = BOOKINGS.find((x) => x.id === sheet.id)!;
  const [why, setWhy] = useState("");
  const [ask, setAsk] = useState(false);
  const del = sheet.k === "delete";
  if (ask) {
    return del
      ? <Confirm icon="warning" danger title={`Delete the recording and transcript for ${b.cand}?`} desc="This cannot be undone. Their level is unaffected." ok="Delete Recording"
          onCancel={close} onOk={() => { commit(() => { b.recDeleted = true; }, "Recording deleted"); close(); }} />
      : <Confirm icon="warning" danger title={`Withdraw SCENES consent for ${b.cand}?`} desc="Their SCENES stop being used immediately. The recording and their level are unaffected." ok="Withdraw Consent"
          onCancel={close} onOk={() => { commit(() => { b.scenesWithdrawn = true; }, `SCENES consent withdrawn for ${b.cand}`); close(); }} />;
  }
  return (
    <Sheet title={del ? `Delete recording — ${b.cand} with ${b.agent}` : `Withdraw SCENES consent — ${b.cand}`} onClose={close}
      footer={<><Button kind="secondary" onClick={close}>Cancel</Button><Button kind="danger" disabled={!why.trim()} onClick={() => setAsk(true)}>{del ? "Delete Recording" : "Withdraw Consent"}</Button></>}>
      <Stack gap={6}>
        <KV rows={[["Candidate", `${b.cand} · ${candEmail(b.cand)}`], ["Interview", bkWhen(b)], del ? ["Transcript", b.transcript || "—"] : ["SCENES consent", scenesConsent(b)]]} />
        <Field label="Reason" required><TextArea rows={3} value={why} onChange={(e) => setWhy(e.target.value)} placeholder="Required — written to the audit log" /></Field>
        <Text role="desc" as="p">{del
          ? "The recording, its transcript and every SCENE cut from it are deleted at the platform and at Twilio. This cannot be undone. The candidate’s level and the agent’s report both stand."
          : "Every SCENE cut from this interview stops being used immediately and is hidden from the candidate’s profile. The recording itself and the candidate’s level are unaffected."}</Text>
      </Stack>
    </Sheet>
  );
}

/* ---------------- One recording: Interview Assets ---------------- */
export function AdminRecording({ id }: { id: string }) {
  useStore();
  const b = BOOKINGS.find((x) => x.id === id);
  const [tab, setTab] = useState(() => (typeof location !== "undefined" && new URLSearchParams(location.search).get("tab") === "transcript" ? "transcript" : "recording"));
  if (!b) return null;
  const desc = `${b.cand} with ${b.agent} · ${bkType(b)} · ${bkWhen(b)} · ${b.recLen} recorded`;
  const menu = <RowMenu items={[{ icon: "download", label: "Download Transcript", onClick: () => toast("Transcript downloaded") }]} />;
  return (
    <Page>
      <PageHeader back="/admin/interviews/recordings/" title="Interview Assets" desc={desc} actions={b.recDeleted ? undefined : menu} />
      {b.recDeleted ? (
        <Section><Text role="desc" as="p">The recording and its transcript were deleted. The row remains as a record that the interview happened.</Text></Section>
      ) : (
        <>
          <Section kind="tabs"><Tabs value={tab} onChange={setTab} items={[{ key: "recording", label: "Recording & Scenes" }, { key: "transcript", label: "Transcript" }]} /></Section>
          {tab === "recording" ? (
            <>
              <Section>
                <SectionHeader title="Recording" desc={`The recorded interview of ${b.cand} with ${b.agent}.`} />
                <RecCard cand={b.cand} len={b.recLen} />
              </Section>
              <Section kind="block">
                <SectionHeader title="Interview scenes" />
                <div className={pr.scvRow}>
                  {(RAW.ADM_SCENE_SET as [string, string][]).map(([title, at]) => (
                    <div key={title} className={pr.scv}>
                      <span className={t.still} style={{ "--still": `url(${face(b.cand)})` } as CSSProperties}>
                        <span className={t.play}><Icon name="play" /></span>
                        <Text role="caption" as="span" className={t.len}>{at}</Text>
                      </span>
                      <Text role="h4" as="span">{title}</Text>
                      <span className={pr.att}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={face(b.agent)} alt="" />
                        <Text role="caption" as="span">Talent Agent: {b.agent}</Text>
                      </span>
                    </div>
                  ))}
                </div>
              </Section>
            </>
          ) : <Transcript cand={b.cand} />}
        </>
      )}
    </Page>
  );
}
