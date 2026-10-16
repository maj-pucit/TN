"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Page, PageHeader, Section, SectionHeader, Stack, Text } from "../primitives";
import { Table, PersonCell, RowMenu, type RowAction } from "../ui/Table";
import { Facts, Fact } from "../ui/Figures";
import { Tabs } from "../ui/Tabs";
import { KV } from "../ui/KV";
import { Button } from "../ui/Button";
import { Dropdown } from "../ui/Dropdown";
import { Search, Toolbar, Field, TextArea } from "../ui/Field";
import { DateFilter } from "../ui/DateFilter";
import { Sheet } from "../ui/Sheet";
import { Confirm } from "../ui/Confirm";
import { Icon } from "../Icon";
import { TalOrb } from "../ui/TalOrb";
import { RecSection, TalEval, AgentEval, Transcript } from "./People";
import { commit, toast, useStore } from "@/lib/store";
import {
  RAW, PAST_IVS, LEVEL_LOG, CANDS, BOOKINGS, LVL_CODES, AGENTS, face, emailOf, candEmail, candByName, isRe, USER_BY_ID,
} from "@/data/admin";
import s from "./admin.module.css";
import p from "../candidate/profile.module.css";
import l from "./levelling.module.css";

/* ============================================================
   LEVELLING — Phase 1 Epic 5: the Levelling Log (levellingLog), a level
   change (levellingChange), the Level Approvals queue (levellingQueue) and
   one approval (marketApproval) with its three decisions.
   ============================================================ */
const LETTERS: { k: string; ltr: string; name: string; meaning: string }[] = RAW.TALENT_LETTERS;
const ORDER = LETTERS.map((x) => x.k);
export const lettersLabel = (arr: string[] = []) => [...arr].sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b)).map((k) => LETTERS.find((x) => x.k === k)?.ltr ?? k).join(", ");
export const levelLetters = (lvl: string, arr?: string[]) => `${lvl || "—"}${arr && arr.length ? ` (${lettersLabel(arr)})` : ""}`;
const direction = (from: string, to: string) => { if (!from) return ""; const a = LVL_CODES.indexOf(from), b = LVL_CODES.indexOf(to); return b > a ? "Up" : b < a ? "Down" : "Held"; };
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const logISO = (d: string) => {
  const m = String(d || "").match(/(\d{1,2})\s+([A-Za-z]{3})\w*\s+(\d{4})/);
  if (m) return `${m[3]}-${String(MONTHS.indexOf(m[2]) + 1).padStart(2, "0")}-${m[1].padStart(2, "0")}`;
  const n = String(d || "").match(/^(\d{2})-(\d{2})-(\d{4})$/);
  return n ? `${n[3]}-${n[1]}-${n[2]}` : "";
};
const todayStr = () => { const d = new Date(); return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`; };
const pending = () => PAST_IVS.filter((x) => !x.decision).sort((a, b) => (a.dueInMin ?? 1e9) - (b.dueInMin ?? 1e9));
const dueLabel = (m: number) => m <= 0 ? "Overdue" : m < 60 ? `${Math.round(m)} min left` : m < 1440 ? `${Math.round(m / 60)} hr left` : `${Math.round(m / 1440)} day${Math.round(m / 1440) === 1 ? "" : "s"} left`;
const Due = ({ iv }: { iv: any }) => iv.dueInMin == null ? <>{iv.deadline || "—"}</> : <span className={iv.dueInMin < 60 ? l.urgent : l.soon}>{dueLabel(iv.dueInMin)}</span>;
const Face = ({ name }: { name: string }) => name === "System" ? <>System</> : (
  // eslint-disable-next-line @next/next/no-img-element
  <span className={l.face}><img src={face(name)} alt="" />{name}</span>
);
const exportToast = (n: number) => toast(n ? `Exporting ${n} row${n === 1 ? "" : "s"}. A download link will reach your notifications, valid 7 days.` : "Nothing to export in this filter", n ? "ok" : "warn");

/* ---------------- 5.1 The Levelling Log ---------------- */
export function AdminLevellingLog() {
  useStore();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [src, setSrc] = useState("all"), [dir, setDir] = useState("all");
  const [from, setFrom] = useState(""), [to, setTo] = useState("");
  const [ovr, setOvr] = useState<string | null>(null);
  const ql = q.toLowerCase();
  const rows = LEVEL_LOG
    .filter((r) => src === "all" || r.source === src)
    .filter((r) => dir === "all" || r.direction === dir)
    .filter((r) => { const d = logISO(r.date); return !d || ((!from || d >= from) && (!to || d <= to)); })
    .filter((r) => !q || [r.cand, r.email || candEmail(r.cand)].some((x) => String(x).toLowerCase().includes(ql)));
  const acts = (r: any): RowAction[] => {
    const c = candByName(r.cand);
    const live = c && !PAST_IVS.some((x) => !x.decision && x.cand === r.cand);
    return [{ icon: "view", label: "View", onClick: () => router.push(`/admin/levelling/log/${r.id}/`) },
      ...(live ? [{ icon: "edit" as const, label: "Override", onClick: () => setOvr(c.id) }] : [])];
  };
  return (
    <Page>
      <PageHeader title="Levelling Log" desc="Every level change that has gone live, across every candidate. Who moved, who proposed it, who approved it and when it happened."
        actions={<Button kind="ghost" size="sm" icon="download" onClick={() => exportToast(rows.length)}>Export</Button>} />
      <Section kind="block">
        <Toolbar search={<Search value={q} onChange={setQ} placeholder="Search by candidate name or email" />}
          filters={<>
            <Dropdown label="Source" value={src} onChange={setSrc} options={["all", "Preliminary quiz", "First interview", "Re-interview"].map((v) => ({ value: v, label: v === "all" ? "All" : v }))} />
            <Dropdown label="Direction" value={dir} onChange={setDir} options={["all", "Up", "Down", "Held"].map((v) => ({ value: v, label: v === "all" ? "All" : v }))} />
            <DateFilter label="From" value={from} onChange={setFrom} />
            <DateFilter label="To" value={to} onChange={setTo} />
          </>} />
        {rows.length ? (
          <Table rows={rows} rowKey={(r) => r.id} href={(r) => `/admin/levelling/log/${r.id}/`} actions={acts} cols={[
            { key: "c", label: "Candidate", cell: (r) => <PersonCell name={r.cand} img={face(r.cand)} sub={r.email || candEmail(r.cand)} /> },
            { key: "f", label: "From", cell: (r) => (r.from ? levelLetters(r.from, r.fromLetters) : "—") },
            { key: "t", label: "To", cell: (r) => levelLetters(r.to, r.toLetters) },
            { key: "d", label: "Direction", cell: (r) => r.direction || "—" },
            { key: "p", label: "Proposed by", cell: (r) => r.proposedBy || "—" },
            { key: "a", label: "Approved by", cell: (r) => r.approvedBy || "—" },
            { key: "s", label: "Source", cell: (r) => r.source || "—" },
            { key: "dt", label: "Date", cell: (r) => r.date },
          ]} />
        ) : <div className={s.empty}><Icon name="growth" /><Text role="h4" as="span">No level changes match</Text><Text role="desc" as="span">Nothing in this filter yet.</Text></div>}
      </Section>
      {ovr && <CandOverride id={ovr} close={() => setOvr(null)} />}
    </Page>
  );
}

/* ---------------- 5.4 One level change (read-only) ---------------- */
export function AdminLevelChange({ id }: { id: string }) {
  useStore();
  const r = LEVEL_LOG.find((x) => x.id === id);
  const [ovr, setOvr] = useState(false);
  if (!r) return null;
  const c = (r.candId && CANDS.find((x) => x.id === r.candId)) || candByName(r.cand);
  const quiz = r.source === "Preliminary quiz";
  const bk = BOOKINGS.find((b) => b.cand === r.cand && b.recExists && !b.recDeleted);
  const live = c && !PAST_IVS.some((x) => !x.decision && x.cand === r.cand);
  return (
    <Page>
      <PageHeader back="/admin/levelling/log/" title="Level change" desc="One level decision: what was proposed, by whom, and what was approved." />
      <Section kind="block">
        <div className={p.idhead}>
          <span className={p.photo}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={face(r.cand)} alt="" />
          </span>
          <span className={p.idB}>
            <span className={s.nameRow}><Text role="h3" as="span">{r.cand}</Text><Icon name="verified" className={s.verify} /></span>
            <Text role="desc" as="span">{[c?.bucket, c?.level, r.email || candEmail(r.cand)].filter(Boolean).join(" · ")}</Text>
          </span>
          <span className={p.idAct}>{live && <RowMenu items={[{ icon: "edit", label: "Override", onClick: () => setOvr(true) }]} />}</span>
        </div>
        <Facts>
          <Fact icon="growth" label="Levelling" value={r.from ? `${r.from} to ${r.to}` : r.to} />
          <Fact icon="user" label="Talent Agent" value={r.proposedBy ? <Face name={r.proposedBy} /> : "—"} />
          <Fact icon="shield" label="Approved by" value={r.approvedBy ? <Face name={r.approvedBy} /> : "—"} />
          <Fact icon="chart" label="Direction" value={r.direction || "—"} />
          <Fact icon="skill" label="Acronyms" value={lettersLabel(r.toLetters) || "—"} />
          <Fact icon="calendar" label="Date" value={r.date} />
          <Fact icon="flag" label="Source" value={r.source || "—"} />
          <Fact icon="document" label="Transcript" value={quiz || !bk ? "—" : <Link href={`/admin/interviews/recordings/${bk.id}/?tab=transcript`} className={l.tx}>Ready<Icon name="arrowRight" /></Link>} />
        </Facts>
      </Section>
      {quiz ? (
        <Section>
          <SectionHeader title="Preliminary quiz result" desc="The level the candidate’s quiz answers derived, before any interview." />
          <KV rows={[["Result", r.quiz?.result || levelLetters(r.to, r.toLetters)], ...((r.quiz?.answers || []) as [string, string][])]} />
        </Section>
      ) : (
        <>
          {bk && <RecSection cand={r.cand} agent={r.proposedBy} />}
          {r.tal && <TalEval x={{ ...r, agent: r.proposedBy }} kv />}
          {r.agentLevel && <AgentEval x={{ ...r, agent: r.proposedBy }} />}
          {r.reason && (
            <Section>
              <SectionHeader title="Override reason" desc="Internal, never shown to the candidate or the agent." />
              <Text role="body" as="p" ink="secondary">{r.reason}</Text>
            </Section>
          )}
        </>
      )}
      {ovr && c && <CandOverride id={c.id} close={() => setOvr(false)} />}
    </Page>
  );
}

/* ---------------- 5.2 The Level Approvals queue ---------------- */
export function AdminApprovals() {
  useStore();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [kind, setKind] = useState("all"), [agent, setAgent] = useState("all");
  const ql = q.toLowerCase();
  const rows = pending()
    .filter((x) => kind === "all" || (kind === "re") === isRe(x.kind))
    .filter((x) => agent === "all" || x.agent === agent)
    .filter((x) => !q || [x.cand, x.agent, x.kind].some((v) => String(v).toLowerCase().includes(ql)));
  return (
    <Page>
      <PageHeader title="Level Approvals" desc="Interviews the agent has submitted with a recording, a level recommendation and their notes. Open one to read Tal’s take and approve or override it." />
      <Section kind="block">
        <Toolbar search={<Search value={q} onChange={setQ} placeholder="Search by candidate or agent" />}
          filters={<>
            <Dropdown label="Type" value={kind} onChange={setKind} options={[{ value: "all", label: "All" }, { value: "first", label: "First interview" }, { value: "re", label: "Re-interview" }]} />
            <Dropdown label="Talent agent" value={agent} onChange={setAgent} options={[{ value: "all", label: "All" }, ...AGENTS().map((u) => ({ value: u.name, label: u.name }))]} />
          </>} />
        {rows.length ? (
          <Table rows={rows} rowKey={(x) => x.id} href={(x) => `/admin/levelling/approvals/${x.id}/`}
            actions={(x) => [{ icon: "view", label: "Review & decide", onClick: () => router.push(`/admin/levelling/approvals/${x.id}/`) }]} cols={[
            { key: "c", label: "Candidate", cell: (x) => <PersonCell name={x.cand} img={face(x.cand)} sub={candEmail(x.cand)} /> },
            { key: "a", label: "Agent", cell: (x) => <PersonCell name={x.agent} img={face(x.agent)} /> },
            { key: "w", label: "Interview Date", cell: (x) => x.when },
            { key: "ap", label: "Agent Proposed", cell: (x) => levelLetters(x.agentLevel, x.agentLetters) },
            { key: "tp", label: "Tal Proposed", cell: (x) => (x.talLevel ? levelLetters(x.talLevel, x.talLetters) : "—") },
            { key: "f", label: "Report filed", cell: (x) => x.filed || x.submitted || "—" },
            { key: "d", label: "Due Time", cell: (x) => <Due iv={x} /> },
          ]} />
        ) : <div className={s.empty}><Icon name="checkOutline" /><Text role="h4" as="span">Nothing waiting on you</Text><Text role="desc" as="span">Every submitted interview has a decision.</Text></div>}
      </Section>
    </Page>
  );
}

/* ---------------- One approval ---------------- */
function decide(iv: any, decision: string, level: string, letters: string[], decidedOn: string, reason?: string) {
  commit(() => {
    iv.decision = decision; iv.finalLevel = level; iv.finalLetters = letters;
    const c = candByName(iv.cand);
    const from = c?.level || "", fromLetters = (c?.letters || []).slice();
    if (c) { c.level = level; c.letters = letters; const u = USER_BY_ID[c.id]; if (u) u.level = level; }
    const num = Math.max(100, ...LEVEL_LOG.map((x) => parseInt(String(x.id).slice(2)) || 0)) + 1;
    LEVEL_LOG.unshift({ id: `lc${num}`, candId: c?.id ?? null, cand: iv.cand, email: emailOf(iv.cand), from, fromLetters, to: level, toLetters: letters,
      direction: direction(from, level), proposedBy: iv.agent, decidedOn, approvedBy: "Derek Sole", approvedRole: "Super Admin",
      source: from ? "Re-interview" : "First interview", date: todayStr(), filed: iv.filed, rating: iv.rating, talType: iv.talType,
      agentLevel: iv.agentLevel, agentLetters: iv.agentLetters, talLevel: iv.talLevel, talLetters: iv.talLetters,
      strengths: iv.strengths, growth: iv.growth, note: iv.note, tal: iv.tal, ...(reason ? { reason } : {}) });
  }, `${iv.cand} set to ${levelLetters(level, letters)}`);
}
export function AdminApproval({ id }: { id: string }) {
  useStore();
  const iv = PAST_IVS.find((x) => x.id === id);
  const [tab, setTab] = useState("recommendation");
  const [ask, setAsk] = useState<null | "agent" | "tal">(null);
  const [ovr, setOvr] = useState(false);
  if (!iv) return null;
  const decided = !!iv.decision;
  const type = isRe(iv.kind) ? "Re-interview" : "First interview";
  return (
    <Page>
      <PageHeader back="/admin/levelling/approvals/" title="Level approval" desc={`${iv.cand} · ${iv.agent} · ${iv.when}`} />
      <Section kind="tabs"><Tabs value={tab} onChange={setTab} items={[{ key: "recommendation", label: "Recommendation" }, { key: "transcript", label: "Transcript" }]} /></Section>
      {tab === "transcript" ? (
        iv.transcript === "Failed"
          ? <Section><Text role="desc" as="p">No transcript exists for this interview. Settle the level on the agent’s report in the Recommendation tab.</Text></Section>
          : <Transcript cand={iv.cand} />
      ) : (
        <>
          <Section kind="block">
            <Facts>
              <Fact icon="starOutline" label="Candidate rating" value={Number(iv.rating).toFixed(1)} />
              <Fact icon="document" label="Report filed" value={iv.filed || iv.submitted || "—"} />
              <Fact icon="flag" label="Source" value={type} />
              <Fact icon="video" label="Interview" value={isRe(iv.kind) ? "Re-interview" : "First Interview"} />
            </Facts>
          </Section>
          <RecSection cand={iv.cand} agent={iv.agent} />
          <TalEval x={iv} kv />
          <AgentEval x={iv} />
          <Section kind="block" noline>
            {decided ? (
              <Text role="body" as="p" ink="secondary">Decided: {iv.cand} set to <b>{levelLetters(iv.finalLevel, iv.finalLetters)}</b>{iv.decision === "override" ? " by a reviewer override" : ""}.</Text>
            ) : (
              <Stack row gap={5}>
                <Button kind="primary" icon="checkFilled" onClick={() => setAsk("agent")}>Approve agent proposal</Button>
                {iv.talLevel && <span className={l.apprOut}><Button kind="ghost" onClick={() => setAsk("tal")}><TalOrb size={18} className={l.orb} />Approve Tal proposal</Button></span>}
                <span className={l.apprOut}><Button kind="ghost" icon="edit" onClick={() => setOvr(true)}>Reviewer override</Button></span>
              </Stack>
            )}
          </Section>
        </>
      )}
      {ask === "agent" && <Confirm icon="check" title={`Approve the agent’s ${iv.agentLevel} for ${iv.cand}?`} ok="Approve"
        desc={`This confirms the agent’s proposal. ${iv.cand}’s level and letters are set to ${levelLetters(iv.agentLevel, iv.agentLetters)}. The candidate and the agent are notified.`}
        onCancel={() => setAsk(null)} onOk={() => { decide(iv, "approved", iv.agentLevel, [...iv.agentLetters], "Agent proposal"); setAsk(null); }} />}
      {ask === "tal" && <Confirm icon="check" title={`Approve Tal’s ${iv.talLevel} for ${iv.cand}?`} ok="Approve"
        desc={`This settles the result on Tal’s proposal. ${iv.cand}’s level and letters are set to ${levelLetters(iv.talLevel, iv.talLetters)}. The candidate and the agent are notified.`}
        onCancel={() => setAsk(null)} onOk={() => { decide(iv, "approved", iv.talLevel, [...iv.talLetters], "Tal proposal"); setAsk(null); }} />}
      {ovr && <OverrideSheet title={`Reviewer override for ${iv.cand}`} ok="Set Level"
        ctx={[["Agent’s proposal", levelLetters(iv.agentLevel, iv.agentLetters)], ["Tal’s proposal", iv.talLevel ? levelLetters(iv.talLevel, iv.talLetters) : "—"]]}
        level={iv.agentLevel} letters={iv.agentLetters} close={() => setOvr(false)}
        onSave={(lv, lt, why) => decide(iv, "override", lv, lt, "Reviewer override", why)} />}
    </Page>
  );
}

/* ---------------- The override sheets ---------------- */
function OverrideSheet({ title, ok, ctx, level, letters, close, onSave, gate, confirm }: {
  title: string; ok: string; ctx: [string, string][]; level: string; letters: string[]; close: () => void;
  onSave: (level: string, letters: string[], why: string) => void; gate?: (lv: string, lt: string[]) => boolean;
  confirm?: (lv: string, lt: string[]) => { title: string; desc: string };
}) {
  const [lv, setLv] = useState(level);
  const [lt, setLt] = useState<string[]>(letters || []);
  const [why, setWhy] = useState("");
  const [asking, setAsking] = useState(false);
  const ready = !!lv && lt.length > 0 && !!why.trim() && (!gate || gate(lv, lt));
  if (asking && confirm) {
    const c = confirm(lv, lt);
    return <Confirm icon="growth" title={c.title} desc={c.desc} ok={ok} onCancel={close} onOk={() => { onSave(lv, lt, why.trim()); close(); }} />;
  }
  return (
    <Sheet title={title} onClose={close}
      footer={<><Button kind="secondary" onClick={close}>Cancel</Button><Button kind="primary" disabled={!ready} onClick={() => (confirm ? setAsking(true) : (onSave(lv, lt, why.trim()), close()))}>{ok}</Button></>}>
      <Stack gap={6}>
        <KV rows={ctx} />
        <Field label="Set level to" required>
          <Dropdown variant="form" value={lv} onChange={setLv} options={LVL_CODES.map((c) => ({ value: c, label: c }))} />
        </Field>
        <Field group label="TALENT letters" required>
          <div className={l.pick}>
            {LETTERS.map((x) => {
              const on = lt.includes(x.k);
              return (
                <button key={x.k} type="button" title={`${x.name} — ${x.meaning}`} aria-pressed={on} className={`${l.chip} ${on ? l.on : ""} t-label`}
                  onClick={() => setLt((a) => (on ? a.filter((k) => k !== x.k) : [...a, x.k]))}><b>{x.ltr}</b>{x.name}</button>
              );
            })}
          </div>
        </Field>
        <Field label="Reason" required><TextArea rows={3} maxLength={500} value={why} onChange={(e) => setWhy(e.target.value)} placeholder="Required — written to the audit log" /></Field>
      </Stack>
    </Sheet>
  );
}

/* 5.3 Override a candidate's live level (from the log or a change). */
function CandOverride({ id, close }: { id: string; close: () => void }) {
  const c = CANDS.find((x) => x.id === id);
  if (!c) return null;
  const same = (a: string[], b: string[]) => a.length === b.length && a.every((x) => b.includes(x));
  const cur = LEVEL_LOG.find((r) => r.cand === c.name);
  return (
    <OverrideSheet title={`Override the level for ${c.name}`} ok="Apply Override" level={c.level} letters={c.letters || []} close={close}
      ctx={[["Candidate", c.name], ["Email", candEmail(c.name)], ["Current level", levelLetters(c.level, c.letters)], ["Became current", cur?.date || "—"],
        ["Source", cur && cur.source !== "Preliminary quiz" ? "Human-approved" : "Preliminary quiz"]]}
      gate={(lv, lt) => !(lv === c.level && same(lt, c.letters || []))}
      confirm={(lv, lt) => ({ title: `Change ${c.name} from ${levelLetters(c.level, c.letters)} to ${levelLetters(lv, lt)}?`, desc: "They will be notified." })}
      onSave={(lv, lt, why) => commit(() => {
        const from = c.level, fromLetters = (c.letters || []).slice();
        c.level = lv; c.letters = lt; const u = USER_BY_ID[c.id]; if (u) u.level = lv;
        const num = Math.max(100, ...LEVEL_LOG.map((x) => parseInt(String(x.id).slice(2)) || 0)) + 1;
        LEVEL_LOG.unshift({ id: `lc${num}`, candId: c.id, cand: c.name, email: candEmail(c.name), from, fromLetters, to: lv, toLetters: lt,
          direction: direction(from, lv), proposedBy: "", decidedOn: "Admin override", approvedBy: "Derek Sole", approvedRole: "Super Admin", source: "", date: todayStr(), reason: why });
      }, `${c.name} set to ${levelLetters(lv, lt)}`)} />
  );
}
