"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Chips, Chip } from "../ui/Chip";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Page, PageHeader, Section, SectionHeader, Stack, Text } from "../primitives";
import { Table, Status, StatusChip, RowMenu, BulkBar } from "../ui/Table";
import { Facts, Fact } from "../ui/Figures";
import { Tabs } from "../ui/Tabs";
import { KV } from "../ui/KV";
import { Button } from "../ui/Button";
import { Dropdown } from "../ui/Dropdown";
import { Search, Toolbar, Field, Input, TextArea } from "../ui/Field";
import { DateFilter } from "../ui/DateFilter";
import { Slider } from "../ui/Slider";
import { Sheet } from "../ui/Sheet";
import { Confirm } from "../ui/Confirm";
import { ToggleRow } from "../ui/Toggle";
import { Icon } from "../Icon";
import { commit, toast, useStore } from "@/lib/store";
import { RAW, ONBOARDING_Q, INTEGRATIONS, USERS, ME, FEE_LOG, face, dpFmt, staffRoleName } from "@/data/admin";
import s from "./admin.module.css";
import p from "../candidate/profile.module.css";
import y from "./system.module.css";
import tg from "../ui/toggle.module.css";

/* ============================================================
   ONBOARDING QUESTIONS, INTEGRATIONS, SETTINGS, MY PROFILE, GENERAL —
   Phase 1 onboardingQuestions / systemIntegrations / V.settings /
   settingsProfile / settingsGeneral.
   ============================================================ */
const OB_TYPE: Record<string, string> = Object.fromEntries(RAW.OB_TYPES);

/* ---------------- Onboarding Questions ---------------- */
export function AdminOnboarding() {
  useStore();
  const [q, setQ] = useState("");
  const [edit, setEdit] = useState<string | null>(null);
  const rows = ONBOARDING_Q.filter((x) => !q || x.text.toLowerCase().includes(q.toLowerCase()));
  return (
    <Page>
      <PageHeader title="Onboarding Questions" desc="The intake quiz new candidates answer. Build the questions, set each one’s answer type and weightage, and the answers are scored against it." />
      <Section kind="block">
        <Toolbar search={<Search value={q} onChange={setQ} placeholder="Search questions" />} />
        {rows.length ? (
          <Table rows={rows} rowKey={(x) => x.id} actions={(x) => [{ icon: "edit", label: "Edit", onClick: () => setEdit(x.id) }]} cols={[
            { key: "n", label: "#", cell: (x) => String(ONBOARDING_Q.indexOf(x) + 1) },
            { key: "q", label: "Question", cell: (x) => <button type="button" className={y.rowBtn} onClick={() => setEdit(x.id)}>{x.text}</button> },
            { key: "t", label: "Answer type", cell: (x) => OB_TYPE[x.type] },
            { key: "o", label: "Options", cell: (x) => (x.type === "text" ? "—" : String((x.options || []).length)) },
            { key: "w", label: "Weight", cell: (x) => (x.type === "single" ? "×" + (x.weight || 0) : "—") },
          ]} />
        ) : <div className={s.empty}><Icon name="document" /><Text role="h4" as="span">No questions yet</Text><Text role="desc" as="span">Nothing matches your search.</Text></div>}
      </Section>
      {edit && <QuestionEditor id={edit} close={() => setEdit(null)} />}
    </Page>
  );
}
/* The editor is the right slider. Answer type and weightage are hidden
   (Phase 1, 23 Sep 2026): only the wording and the options are edited. */
function QuestionEditor({ id, close }: { id: string; close: () => void }) {
  const src = ONBOARDING_Q.find((x) => x.id === id)!;
  const [q, setQ] = useState<any>(() => JSON.parse(JSON.stringify(src)));
  const single = q.type === "single", text = q.type === "text";
  const setOpt = (i: number, k: string, v: any) => setQ((o: any) => ({ ...o, options: o.options.map((x: any, j: number) => (j === i ? { ...x, [k]: v } : x)) }));
  const save = () => {
    commit(() => {
      Object.assign(src, { text: q.text.trim(), options: text ? [] : q.options.filter((o: any) => (o.label || "").trim()).map((o: any) => (single ? { label: o.label.trim(), score: +o.score || 0 } : { label: o.label.trim() })),
        ...(text ? { placeholder: q.placeholder || "" } : {}), ...(q.type === "dropdown" ? { other: !!q.other } : {}) });
    }, "Question saved");
    close();
  };
  return (
    <Slider open title="Edit question" onClose={close}
      footer={<><Button kind="secondary" onClick={close}>Cancel</Button><Button kind="primary" disabled={!q.text.trim()} onClick={save}>Save Question</Button></>}>
      <Stack gap={6}>
        <Field label="Question"><Input value={q.text} onChange={(e) => setQ({ ...q, text: e.target.value })} placeholder="Type the question" /></Field>
        {text && <Field label="Placeholder"><Input value={q.placeholder || ""} onChange={(e) => setQ({ ...q, placeholder: e.target.value })} placeholder="Example answer shown in the field" /></Field>}
        {!text && (
          <Field group label={single ? "Options and their score" : "Options"}>
            <Stack gap={3}>
              {q.options.map((o: any, i: number) => (
                <div key={i} className={y.opt}>
                  <Input value={o.label} onChange={(e) => setOpt(i, "label", e.target.value)} placeholder="Option label" aria-label={`Option ${i + 1}`} />
                  {single && <span className={y.score}><Input inputMode="numeric" value={String(o.score ?? 0)} onChange={(e) => setOpt(i, "score", e.target.value.replace(/\D/g, ""))} aria-label="Score" /></span>}
                  <button type="button" className={y.x} aria-label="Remove option" onClick={() => setQ({ ...q, options: q.options.filter((_: any, j: number) => j !== i) })}><Icon name="close" /></button>
                </div>
              ))}
              <span><Button kind="link" size="sm" icon="add" onClick={() => setQ({ ...q, options: [...q.options, { label: "", score: 0 }] })}>Add option</Button></span>
              {q.type === "dropdown" && (
                <label className={y.check}><input type="checkbox" checked={!!q.other} onChange={() => setQ({ ...q, other: !q.other })} />Allow “Other” with a text field</label>
              )}
            </Stack>
          </Field>
        )}
      </Stack>
    </Slider>
  );
}

/* ---------------- Integrations ---------------- */
/* CUT (plan): the Email / CRM lead-attribution integration. */
const SVC: Record<string, ["green" | "warn" | "red", string]> = { live: ["green", "Operational"], degraded: ["warn", "Degraded"], off: ["red", "Disconnected"] };
export function AdminIntegrations() {
  useStore();
  const [ask, setAsk] = useState<null | { k: "rotate" | "disconnect"; id: string }>(null);
  const [connect, setConnect] = useState(false);
  const list = INTEGRATIONS.filter((g) => g.id !== "crm");
  return (
    <Page>
      <PageHeader title="Integrations" desc="The external services the platform runs on. Keys are rotated on a schedule."
        actions={<Button kind="primary" size="sm" icon="add" onClick={() => setConnect(true)}>Connect A Service</Button>} />
      <Section kind="block">
        <div className={y.list}>
          {list.map((g) => (
            <div key={g.id} className={y.row}>
              <span className={y.ic}><Icon name="link" /></span>
              <span className={y.rowB}>
                <span className={y.rowT}><Text role="h4" as="span">{g.name}</Text><StatusChip tone={SVC[g.state][0]}>{SVC[g.state][1]}</StatusChip></span>
                <Text role="desc" as="span">{g.cat} · {g.detail} · {g.env} · {g.webhooks} webhooks · {g.events} events · {g.keyAge}</Text>
              </span>
              {g.state === "off"
                ? <Button kind="primary" size="sm" go onClick={() => commit(() => { g.state = g.prev || "live"; }, `${g.name} reconnected`)}>Reconnect</Button>
                : <RowMenu items={[
                    { icon: "renew", label: "Rotate key", onClick: () => setAsk({ k: "rotate", id: g.id }) },
                    { icon: "launch", label: "Open provider console", onClick: () => toast(`${g.name} console opened (prototype)`) },
                    { icon: "close", label: "Disconnect", danger: true, onClick: () => setAsk({ k: "disconnect", id: g.id }) },
                  ]} />}
            </div>
          ))}
        </div>
      </Section>
      {ask && (() => {
        const g = INTEGRATIONS.find((x) => x.id === ask.id)!;
        return ask.k === "rotate"
          ? <Confirm icon="warning" title={`Rotate the ${g.name} key?`} desc="A new key is issued and the old one is revoked after a 10-minute overlap. Webhooks re-sign automatically." ok="Rotate Key"
              onCancel={() => setAsk(null)} onOk={() => { commit(() => { g.keyAge = "key rotated just now"; }, `${g.name} key rotated`); setAsk(null); }} />
          : <Confirm icon="warning" danger title={`Disconnect ${g.name}?`} desc={`${g.detail} stops working across the platform until it is reconnected.${g.cat === "Payments" ? " No charge, held funds or payout can move while it is off." : ""}`} ok="Disconnect"
              onCancel={() => setAsk(null)} onOk={() => { commit(() => { g.prev = g.state; g.state = "off"; }, `${g.name} disconnected`); setAsk(null); }} />;
      })()}
      {connect && <ConnectSheet close={() => setConnect(false)} />}
    </Page>
  );
}
function ConnectSheet({ close }: { close: () => void }) {
  const [v, setV] = useState({ name: "", cat: "Notifications", detail: "", env: "Sandbox" });
  const opts = (a: string[]) => a.map((x) => ({ value: x, label: x }));
  return (
    <Slider open title="Connect a service" onClose={close}
      footer={<><Button kind="secondary" onClick={close}>Cancel</Button><Button kind="primary" disabled={!v.name.trim()} onClick={() => {
        commit(() => { INTEGRATIONS.push({ id: v.name.toLowerCase().replace(/[^a-z0-9]+/g, ""), name: v.name.trim(), cat: v.cat, detail: v.detail || "—", state: "live", env: v.env, webhooks: 0, events: "0", keyAge: "key issued just now" }); }, `${v.name.trim()} connected in ${v.env}`);
        close();
      }}>Connect</Button></>}>
      <Stack gap={6}>
        <Field label="Service" required><Input value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} placeholder="e.g. Slack" /></Field>
        <Field label="Category"><Dropdown variant="form" value={v.cat} onChange={(x) => setV({ ...v, cat: x })} options={opts(["Payments", "Learning", "Media", "Intelligence", "Infrastructure", "Notifications"])} /></Field>
        <Field label="What it does here"><Input value={v.detail} onChange={(e) => setV({ ...v, detail: e.target.value })} /></Field>
        <Field label="Environment"><Dropdown variant="form" value={v.env} onChange={(x) => setV({ ...v, env: x })} options={opts(["Production", "Live mode", "Sandbox"])} /></Field>
        <Text role="desc" as="p">You are sent to the provider to authorise; the key never passes through this screen. It lands in the sandbox until you promote it.</Text>
      </Stack>
    </Slider>
  );
}

/* ---------------- Settings (two tabs) ----------------
   No notifications in Phase 0 (Maryam 16 Oct 2026): the Notification Templates and
   Notifications tabs are gone. <Templates /> and <Prefs /> stay defined, unrouted. */
const TABS = [["platform", "Platform"], ["security", "Login & Security"]];
export function AdminSettings({ tab }: { tab?: string }) {
  const router = useRouter();
  const cur = TABS.some(([k]) => k === tab) ? tab! : "platform";
  return (
    <Page>
      <PageHeader title="Settings" desc="How the platform runs — its standing values and your sign-in." />
      <Section kind="tabs"><Tabs value={cur} onChange={(k) => router.push(`/admin/settings/${k}/`)} items={TABS.map(([key, label]) => ({ key, label }))} /></Section>
      {cur === "platform" ? <Platform /> : <Security />}
    </Page>
  );
}

/* Platform (11.1). CUT (plan): the cohort creation mode and the Cohorts group;
   the rebooking credit window; the Tal question limit (no Tal chat in Phase 0);
   account closure stays hidden as in Phase 1. */
const SET = RAW.SETTINGS;
const GROUPS: Record<string, any> = RAW.SET_GROUPS;
const REVIEW_WINDOW_HRS = 24;
const hintOf = (f: any) => (String(f.hint).startsWith("FN:") ? `How long an agent has to file a report after an interview is held. The candidate's report-ready promise is this plus the fixed ${REVIEW_WINDOW_HRS}-hour review window — currently ${SET.reportDeadline + REVIEW_WINDOW_HRS} hours.` : f.hint);
const SHOWN: [string, string[]][] = [["sessions", ["autoSignout"]], ["exports", ["exportLimit"]], ["interviews", ["reportDeadline"]]];
function Platform() {
  useStore();
  return (
    <>
      <Departments />
      {SHOWN.map(([g, keys]) => <NumGroup key={g} g={g} fields={GROUPS[g].fields.filter((f: any) => keys.includes(f.k))} />)}
      <Money />
      <WorkingDays />
    </>
  );
}
function NumGroup({ g, fields }: { g: string; fields: any[] }) {
  const G = GROUPS[g];
  const [edit, setEdit] = useState(false);
  const [v, setV] = useState<Record<string, string>>({});
  const [ask, setAsk] = useState(false);
  const bad = fields.find((f) => { const x = v[f.k] ?? String(SET[f.k]); return !/^\d+$/.test(x) || +x < f.min || +x > f.max; });
  const changes = fields.filter((f) => v[f.k] != null && +v[f.k] !== SET[f.k]);
  return (
    <Section>
      <SectionHeader title={G.title} desc={G.desc} actions={edit
        ? <Stack row gap={3}><Button kind="secondary" size="sm" onClick={() => { setEdit(false); setV({}); }}>Cancel</Button><Button kind="primary" size="sm" disabled={!!bad || !changes.length} onClick={() => setAsk(true)}>Save</Button></Stack>
        : <Button kind="ghost" size="sm" icon="edit" onClick={() => setEdit(true)}>Edit</Button>} />
      {edit ? (
        <Stack gap={5}>
          {fields.map((f) => {
            const x = v[f.k] ?? String(SET[f.k]); const wrong = !/^\d+$/.test(x) || +x < f.min || +x > f.max;
            return (
              <Field key={f.k} label={`${f.l} (${f.unit})`} help={hintOf(f)} error={wrong ? `Enter a whole number between ${f.min} and ${f.max} ${f.unit}.` : undefined}>
                <Input inputMode="numeric" value={x} onChange={(e) => setV({ ...v, [f.k]: e.target.value.replace(/[^\d]/g, "") })} />
              </Field>
            );
          })}
        </Stack>
      ) : <KV ends rows={fields.map((f) => [f.l, `${SET[f.k]} ${f.unit}`] as [string, string])} />}
      {ask && <Confirm icon="check" title={`Save ${G.title.toLowerCase()} changes?`} ok="Save Changes"
        desc={changes.map((f) => `Change the ${f.l.toLowerCase()} from ${SET[f.k]} ${f.unit} to ${v[f.k]} ${f.unit}?`).join(" ")}
        onCancel={() => setAsk(false)} onOk={() => { commit(() => changes.forEach((f) => { SET[f.k] = +v[f.k]; }), "Settings saved"); setAsk(false); setEdit(false); setV({}); }} />}
    </Section>
  );
}
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
function Money() {
  const [edit, setEdit] = useState(false);
  const [delay, setDelay] = useState(String(SET.payoutDelay)), [day, setDay] = useState(SET.payoutRunDay);
  const [step, setStep] = useState<null | "reason" | "stepup">(null);
  const [why, setWhy] = useState("");
  const ok = /^\d+$/.test(delay) && +delay >= 0 && +delay <= 30;
  const changes: [string, string, string, string][] = [];
  if (ok && +delay !== SET.payoutDelay) changes.push(["Payout release delay", String(SET.payoutDelay), delay, "working days"]);
  if (day !== SET.payoutRunDay) changes.push(["Payout run day", SET.payoutRunDay, day, ""]);
  const reset = () => { setEdit(false); setStep(null); setWhy(""); setDelay(String(SET.payoutDelay)); setDay(SET.payoutRunDay); };
  return (
    <Section>
      <SectionHeader title="Money" desc="When held funds are released and the weekly payout run. These carry the Change fee permission — a reason and a re-authentication step. A change applies to reports filed after it; held funds already releasable are unaffected."
        actions={edit
          ? <Stack row gap={3}><Button kind="secondary" size="sm" onClick={reset}>Cancel</Button><Button kind="primary" size="sm" disabled={!ok || !changes.length} onClick={() => setStep("reason")}>Save</Button></Stack>
          : <Button kind="ghost" size="sm" icon="edit" onClick={() => setEdit(true)}>Edit</Button>} />
      {edit ? (
        <Stack gap={5}>
          <Field label="Payout release delay (working days)" help="How long after a report is filed before held funds become releasable. Counted against the working-days calendar below." error={ok ? undefined : "Enter a whole number between 0 and 30 working days."}>
            <Input inputMode="numeric" value={delay} onChange={(e) => setDelay(e.target.value.replace(/[^\d]/g, ""))} />
          </Field>
          <Field label="Payout run day" help="The payout run executes at 12:00 AM on this day, in your time zone.">
            <Dropdown variant="form" value={day} onChange={setDay} options={DAYS.map((d) => ({ value: d, label: d }))} />
          </Field>
        </Stack>
      ) : <KV ends rows={[["Payout release delay", `${SET.payoutDelay} working days`], ["Payout run day", `${SET.payoutRunDay}, 12:00 AM`]]} />}
      {step === "reason" && (
        <Sheet title="Confirm the money change" onClose={() => setStep(null)} footer={<><Button kind="secondary" onClick={() => setStep(null)}>Cancel</Button><Button kind="primary" disabled={!why.trim()} onClick={() => setStep("stepup")}>Continue</Button></>}>
          <Stack gap={5}>
            <Text role="desc" as="p">{changes.map(([l, a, b, u]) => `${l}: ${a}${u ? " " + u : ""} → ${b}${u ? " " + u : ""}`).join(" · ")}</Text>
            <Field label="Reason" required><TextArea rows={3} maxLength={500} value={why} onChange={(e) => setWhy(e.target.value)} placeholder="Why this change. Recorded on the audit line (1–500 characters)." /></Field>
          </Stack>
        </Sheet>
      )}
      {step === "stepup" && <Confirm icon="check" stepup title="Confirm your identity" desc="Enter the security code to save this money change." ok="Save Changes" onCancel={() => setStep(null)}
        onOk={() => { commit(() => {
          changes.forEach(([l, a, b, u]) => FEE_LOG.unshift({ id: `fl${Date.now()}${l}`, valueType: /delay/i.test(l) ? "delay" : "runday", agent: "", agentEmail: "", from: `${a}${u ? " " + u : ""}`, to: `${b}${u ? " " + u : ""}`, changedBy: ME.name, role: "Super Admin", on: `${new Date().toISOString().slice(0, 10)}, just now`, reason: why.trim() }));
          SET.payoutDelay = +delay; SET.payoutRunDay = day;
        }, "Money settings saved"); reset(); }} />}
    </Section>
  );
}
/* Departments (story 11.1). Columns Department / Users assigned; Add, Rename,
   Delete — no retired state, no Restore. Delete is refused while any user is
   assigned. No staged Discard / Save (Maryam 16 Oct 2026): Add and Rename apply
   from their own sheet, and a delete asks for confirmation in a modal first. */
const NO_DEPTS = "No departments have been added yet. Users cannot be invited until at least one exists.";
type Dept = { name: string; status: string };
function Departments() {
  useStore();
  const D: Dept[] = RAW.DEPARTMENTS;
  const [sheet, setSheet] = useState<null | { i: number | null }>(null);
  const [blocked, setBlocked] = useState<null | { name: string; n: number }>(null);
  const [del, setDel] = useState<Dept[] | null>(null);
  const [sel, setSel] = useState<string[]>([]);
  const users = (n: string) => USERS.filter((u) => u.internal && u.dept === n).length;
  /* Ask before deleting; a department with users assigned is never deleted. */
  const askDelete = (picked: Dept[]) => {
    const held = picked.filter((d) => users(d.name));
    if (held.length) { setBlocked({ name: held.map((d) => d.name).join(", "), n: held.reduce((n, d) => n + users(d.name), 0) }); return; }
    setDel(picked);
  };
  return (
    <Section kind="block">
      <SectionHeader title="Departments" desc="The list that fills the Department dropdown on every internal user invite and every internal user record."
        actions={<Button kind="link" size="sm" icon="add" onClick={() => setSheet({ i: null })}>Add Department</Button>} />
      {D.length ? (
        <Table rows={D} rowKey={(d) => d.name} pageSize={50} selected={sel} onSelect={setSel} cols={[
          { key: "n", label: "Department", cell: (d) => d.name },
          { key: "u", label: "Users assigned", cell: (d) => { const n = users(d.name); return n ? `${n} user${n === 1 ? "" : "s"}` : "—"; } },
        ]} actions={(d) => [
          { icon: "edit", label: "Rename", onClick: () => setSheet({ i: D.indexOf(d) }) },
          { icon: "delete", label: "Delete", danger: true, onClick: () => askDelete([d]) },
        ]} />
      ) : <Text role="desc" as="p">{NO_DEPTS}</Text>}
      {/* Group actions: one row = Rename + Delete; several = Delete All. */}
      <BulkBar count={sel.length} onClear={() => setSel([])} actions={(() => {
        const picked = D.filter((d) => sel.includes(d.name));
        return picked.length === 1
          ? [{ icon: "edit" as const, label: "Rename", onClick: () => { setSheet({ i: D.indexOf(picked[0]) }); setSel([]); } }, { icon: "delete" as const, label: "Delete", onClick: () => askDelete(picked) }]
          : [{ icon: "delete" as const, label: "Delete All", onClick: () => askDelete(picked) }];
      })()} />
      {sheet && <NameSheet title={sheet.i == null ? "Add department" : `Rename ${D[sheet.i].name}`} label="Department name" ph="e.g. Talent Success" ok={sheet.i == null ? "Add Department" : "Save Changes"}
        init={sheet.i == null ? "" : D[sheet.i].name} taken={(n) => D.some((d, j) => d.name.toLowerCase() === n.toLowerCase() && j !== sheet.i)}
        invalid={(n) => (/^[A-Za-z0-9 &]+$/.test(n) ? null : "Use letters, numbers and spaces only.")} close={() => setSheet(null)}
        onSave={(n) => commit(() => {
          if (sheet.i == null) D.push({ name: n, status: "active" });
          else { const was = D[sheet.i].name; USERS.forEach((u) => { if (u.dept === was) u.dept = n; }); D[sheet.i].name = n; }
        })} />}
      {blocked && <Confirm icon="warning" title={`${blocked.name} can’t be deleted`} desc={`${blocked.n} ${blocked.n === 1 ? "user is" : "users are"} assigned. Move them to another department first.`}
        ok="Got It" onOk={() => setBlocked(null)} onCancel={() => setBlocked(null)} />}
      {del && <Confirm icon="delete" danger title={del.length === 1 ? `Delete ${del[0].name}?` : `Delete ${del.length} departments?`}
        desc={`${del.map((d) => d.name).join(", ")} ${del.length === 1 ? "is" : "are"} removed from the list and from the Department dropdown. This cannot be undone.`}
        ok={del.length === 1 ? "Delete Department" : "Delete All"} onCancel={() => setDel(null)}
        onOk={() => { commit(() => { del.forEach((x) => D.splice(D.indexOf(x), 1)); }); setDel(null); setSel([]); }} />}
    </Section>
  );
}
function NameSheet({ title, label, ph, ok, init, taken, invalid, close, onSave }: { title: string; label: string; ph: string; ok: string; init: string; taken: (n: string) => boolean; invalid?: (n: string) => string | null; close: () => void; onSave: (n: string) => void }) {
  const [n, setN] = useState(init);
  const bad = n.trim() && invalid ? invalid(n.trim()) : null;
  const dup = !bad && !!n.trim() && taken(n.trim());
  return (
    <Sheet title={title} onClose={close} footer={<><Button kind="secondary" onClick={close}>Cancel</Button><Button kind="primary" disabled={!n.trim() || dup || !!bad} onClick={() => { onSave(n.trim()); close(); }}>{ok}</Button></>}>
      <Field label={label} required error={bad || (dup ? "That name already exists." : undefined)}><Input value={n} maxLength={100} onChange={(e) => setN(e.target.value)} placeholder={ph} /></Field>
    </Sheet>
  );
}
function WorkingDays() {
  const H: { date: string; name: string }[] = RAW.HOLIDAYS;
  const [sheet, setSheet] = useState<null | { date: string | null }>(null);
  const rows = [...H].sort((a, b) => a.date.localeCompare(b.date));
  return (
    <Section kind="block">
      <SectionHeader title="Working days" desc="The holiday calendar the payout release delay counts against. Weekends are excluded as a standing rule and cannot be added here."
        actions={<Button kind="link" size="sm" icon="add" onClick={() => setSheet({ date: null })}>Add Holiday</Button>} />
      <Table rows={rows} rowKey={(h) => h.date} pageSize={50} cols={[
        { key: "d", label: "Date", cell: (h) => dpFmt(h.date) }, { key: "n", label: "Name", cell: (h) => h.name }, { key: "y", label: "Year", cell: (h) => h.date.split("-")[0] },
      ]} actions={(h) => [
        { icon: "edit", label: "Edit", onClick: () => setSheet({ date: h.date }) },
        { icon: "delete", label: "Delete", onClick: () => commit(() => { H.splice(H.indexOf(h), 1); }, `Removed ${h.name}, ${dpFmt(h.date)}`) },
      ]} />
      {sheet && <HolidaySheet H={H} date={sheet.date} close={() => setSheet(null)} />}
    </Section>
  );
}
function HolidaySheet({ H, date, close }: { H: { date: string; name: string }[]; date: string | null; close: () => void }) {
  const cur = date ? H.find((h) => h.date === date) : null;
  const [d, setD] = useState(cur?.date ?? ""), [n, setN] = useState(cur?.name ?? "");
  const wd = d ? new Date(d + "T00:00:00").getDay() : -1;
  const err = !d ? "" : wd === 0 || wd === 6 ? "Weekends are already excluded and cannot be added." : H.some((h) => h.date === d && d !== date) ? "That date is already in the calendar." : "";
  return (
    <Sheet title={cur ? `Edit ${dpFmt(cur.date)}` : "Add holiday"} onClose={close}
      footer={<><Button kind="secondary" onClick={close}>Cancel</Button><Button kind="primary" disabled={!d || !n.trim() || !!err} onClick={() => {
        commit(() => { if (cur) { cur.date = d; cur.name = n.trim(); } else H.push({ date: d, name: n.trim() }); }, `${cur ? "Updated" : "Added"} ${n.trim()}, ${dpFmt(d)}`); close();
      }}>{cur ? "Save Changes" : "Add Holiday"}</Button></>}>
      <Stack gap={6}>
        <Field label="Date" required error={err || undefined}><DateFilter label="Date" value={d} onChange={setD} /></Field>
        <Field label="Name" required><Input value={n} maxLength={100} onChange={(e) => setN(e.target.value)} placeholder="e.g. Spring Bank Holiday" /></Field>
      </Stack>
    </Sheet>
  );
}

/* Notification Templates (11.2). CUT (plan): the Cohort Leader recipient and
   every cohort, rebooking-credit, points, badge, rank and certificate event. */
const NT_TYPE: Record<string, string> = RAW.NT_TYPE;
const NT_RCP: Record<string, string> = RAW.NT_RCP;
const NT_SAMPLE: Record<string, string> = RAW.NT_SAMPLE;
const TEMPLATES: any[] = (RAW.NOTIF_TEMPLATES as any[]).filter((t) => t.recipient !== "leader" && !/cohort|rebooking|leader|badge|point|rank|certif/i.test(`${t.name} ${t.ph.join(" ")}`));
const render = (s0: string) => s0.replace(/\{(\w+)\}/g, (m, k) => NT_SAMPLE[k] ?? m);
function Templates() {
  useStore();
  const [q, setQ] = useState(""), [on, setOn] = useState("all"), [rcp, setRcp] = useState("all");
  const [edit, setEdit] = useState<string | null>(null);
  const rows = TEMPLATES.filter((t) => (on === "all" || (on === "on" ? t.on : !t.on)) && (rcp === "all" || t.recipient === rcp) && (!q || t.title.toLowerCase().includes(q.toLowerCase())));
  return (
    <Section kind="block">
      <SectionHeader title="Notification templates" desc="The wording and on/off of every in-app notification. Templates cannot be added or removed — a new event needs a release. English only; email and SMS wording is fixed in the build." />
      <Toolbar search={<Search value={q} onChange={setQ} placeholder="Search by title" />}
        filters={<>
          <Dropdown label="Status" value={on} onChange={setOn} options={[["all", "All"], ["on", "On"], ["off", "Off"]].map(([value, label]) => ({ value, label }))} />
          <Dropdown label="Recipient" value={rcp} onChange={setRcp} options={[["all", "All"], ["staff", "Admin"], ["agent", "Talent Agent"], ["candidate", "Candidate"]].map(([value, label]) => ({ value, label }))} />
        </>} />
      {rows.length ? (
        <Table rows={rows} rowKey={(t) => t.id} actions={(t) => [{ icon: "edit", label: "Edit", onClick: () => setEdit(t.id) }]} cols={[
          { key: "n", label: "Notification", cell: (t) => <button type="button" className={y.rowBtn} onClick={() => setEdit(t.id)}>{t.title}</button> },
          { key: "r", label: "Recipient", cell: (t) => NT_RCP[t.recipient] },
          { key: "t", label: "Type", cell: (t) => NT_TYPE[t.type] },
          { key: "w", label: "Sent when", cell: (t) => t.sentWhen },
          { key: "o", label: "On/Off", cell: (t) => <Status tone={t.on ? "green" : "plain"}>{t.on ? "On" : "Off"}</Status> },
          { key: "e", label: "Last edited", cell: (t) => (t.at ? `${t.by || "You"} · ${t.at}` : "—") },
        ]} />
      ) : <div className={s.empty}><Icon name="notification" /><Text role="h4" as="span">No templates match</Text><Text role="desc" as="span">Clear the filters or search to see the full set.</Text></div>}
      {edit && <TemplateEditor id={edit} close={() => setEdit(null)} />}
    </Section>
  );
}
function TemplateEditor({ id, close }: { id: string; close: () => void }) {
  const t = TEMPLATES.find((x) => x.id === id)!;
  const [e, setE] = useState({ title: t.title, body: t.body, on: t.on });
  const tokens = [...`${e.title} ${e.body}`.matchAll(/\{(\w+)\}/g)].map((m) => m[1]);
  const bad = tokens.find((w) => !t.ph.includes(w));
  const ok = e.title.trim() && e.title.length <= 60 && e.body.trim() && e.body.length <= 500 && !bad;
  return (
    <Slider open title="Edit template" onClose={close}
      footer={<><Button kind="secondary" onClick={close}>Cancel</Button><Button kind="primary" disabled={!ok} onClick={() => {
        commit(() => { const d = new Date(); Object.assign(t, { title: e.title.trim(), body: e.body.trim(), on: e.on, by: "You", at: `${d.getDate()} ${d.toLocaleString("en-GB", { month: "short" })} ${d.getFullYear()}, ${d.toTimeString().slice(0, 5)}` }); }, "Template saved"); close();
      }}>Save</Button></>}>
      <Stack gap={6}>
        <Text role="desc" as="p">{NT_RCP[t.recipient]} · {NT_TYPE[t.type]}</Text>
        <div className={y.tg}>
          <Text role="h4" as="span">Show this notification</Text>
          <button type="button" role="switch" aria-checked={e.on} aria-label="Show this notification" className={tg.sw} onClick={() => setE({ ...e, on: !e.on })} />
        </div>
        <Field label={`Title (${e.title.length}/60)`} required><Input maxLength={60} value={e.title} onChange={(x) => setE({ ...e, title: x.target.value })} placeholder="Notification title" /></Field>
        <Field label={`Body (${e.body.length}/500)`} required error={bad ? `{${bad}} is not an allowed placeholder for this event.` : undefined}>
          <TextArea rows={3} maxLength={500} value={e.body} onChange={(x) => setE({ ...e, body: x.target.value })} placeholder="Notification message" />
        </Field>
        {t.ph.length ? (
          <div>
            <Text role="label" as="span" ink="secondary" className={y.lbl}>Insert a placeholder</Text>
            <div className={y.chips}>{t.ph.map((k: string) => <Button key={k} kind="ghost" size="sm" onClick={() => setE({ ...e, body: `${e.body}{${k}}` })}>{`{${k}}`}</Button>)}</div>
          </div>
        ) : <Text role="desc" as="p">This event has no placeholders.</Text>}
        <div>
          <Text role="label" as="span" ink="secondary" className={y.lbl}>Preview</Text>
          <div className={y.preview}><Text role="h4" as="span">{render(e.title)}</Text><Text role="desc" as="span">{render(e.body)}</Text></div>
        </div>
        <span><Button kind="ghost" size="sm" onClick={() => toast("A test notification was posted to your bell")}>Send a test</Button></span>
      </Stack>
    </Slider>
  );
}

/* Your own notification preferences. */
function Prefs() {
  const e = RAW.NOTIF_PREFS.email, a = RAW.NOTIF_PREFS.inapp;
  return (
    <>
      <Section>
        <SectionHeader title="Email" desc="What lands in your inbox." />
        <ToggleRow title="Vetting queue" desc="New items waiting for a decision." on={e.vetting} />
        <ToggleRow title="Payouts & settlement" desc="Runs, failures and discrepancies." on={e.payouts} />
        <ToggleRow title="New accounts" desc="Every new account on the platform." on={e.accounts} />
        <ToggleRow title="Weekly summary" desc="One email on Monday with last week’s figures." on={e.summary} />
      </Section>
      <Section>
        <SectionHeader title="In-app" desc="What shows in the bell and on the dashboard." />
        <ToggleRow title="Show the bell badge" desc="The unread count on the bell." on={a.badge} />
        <ToggleRow title="Open decisions" desc="Approvals waiting on you." on={a.decisions} />
        <ToggleRow title="Compliance alerts" desc="Anything that needs a compliance look." on={a.compliance} />
      </Section>
    </>
  );
}

/* Login & Security: read-only first, one button per item (Maryam 8 Oct 2026). */
function Security() {
  useStore();
  const [pw, setPw] = useState(false), [ph, setPh] = useState(false);
  const [out, setOut] = useState<string | null>(null);
  const SESS: any[] = RAW.SESSIONS;
  return (
    <>
      <Section>
        <SectionHeader title="Password" desc="Changing it signs out every other session and keeps this one." actions={<Button kind="ghost" size="sm" icon="edit" onClick={() => setPw(true)}>Change Password</Button>} />
      </Section>
      <Section>
        <SectionHeader title="Phone number" desc="Where a one-time code is sent when you choose SMS at sign-in." actions={<Button kind="ghost" size="sm" icon="edit" onClick={() => setPh(true)}>Change Phone Number</Button>} />
        <Text role="body" as="p">{ME.phone || "—"}</Text>
      </Section>
      <Section kind="block">
        <SectionHeader title="Signed-in sessions" desc="Where your account is signed in. End any you do not recognise." />
        <div className={y.list}>
          {SESS.filter((x) => !x.gone).map((x) => (
            <div key={x.id} className={y.row}>
              <span className={y.ic}><Icon name={/iphone|android|phone/i.test(x.dev) ? "phone" : "dashboard"} /></span>
              <span className={y.rowB}>
                <span className={y.rowT}><Text role="h4" as="span">{x.dev}</Text>{x.current && <StatusChip tone="green">This device</StatusChip>}</span>
                <Text role="desc" as="span">{x.browser} · {x.loc} · started {x.started} · {x.current ? "active now" : "last active " + x.when}</Text>
              </span>
              {!x.current && <Button kind="dangerText" onClick={() => setOut(x.id)}>Sign Out</Button>}
            </div>
          ))}
        </div>
      </Section>
      <Section>
        <SectionHeader title="Two-factor" desc="A one-time code is required at every sign-in, on every device. It is sent to the email address on your account — email is the only destination." />
        <div className={y.tg}><Text role="h4" as="span">Two-factor at sign-in</Text><Status tone="green">Always on</Status></div>
        <ToggleRow title="Step-up password on the highest-severity actions" desc="A fresh code before a fee change, a role delete or an early release." on={RAW.SEC.stepup !== false} />
      </Section>
      {pw && <PasswordSheet close={() => setPw(false)} />}
      {ph && <PhoneSheet close={() => setPh(false)} />}
      {out && <Confirm icon="logout" title="Sign this session out?" desc="That device will need to sign in again." ok="Sign Out" onCancel={() => setOut(null)}
        onOk={() => { commit(() => { const x = SESS.find((z) => z.id === out); if (x) x.gone = true; }, "Session signed out"); setOut(null); }} />}
    </>
  );
}
const PW_RULES: [string, string][] = RAW.PW_RULE_LIST;
const pwOk = (v: string) => v.length >= 12 && /[A-Z]/.test(v) && /[a-z]/.test(v) && /\d/.test(v) && /[^A-Za-z0-9]/.test(v);
function PasswordSheet({ close }: { close: () => void }) {
  const [c, setC] = useState(""), [n, setN] = useState(""), [r, setR] = useState("");
  const err = n && !pwOk(n) ? "The new password does not meet every rule." : n && n === c ? "It must differ from your current password." : r && r !== n ? "The two passwords do not match." : "";
  return (
    <Sheet title="Change password" onClose={close} footer={<><Button kind="secondary" onClick={close}>Cancel</Button><Button kind="primary" disabled={!c || !n || !r || !!err} onClick={() => { toast("Password changed. Every other session was signed out."); close(); }}>Change Password</Button></>}>
      <Stack gap={5}>
        <Field label="Current password" required><Input type="password" value={c} onChange={(e) => setC(e.target.value)} placeholder="Your current password" autoComplete="current-password" /></Field>
        <Field label="New password" required><Input type="password" value={n} onChange={(e) => setN(e.target.value)} placeholder="Enter a new password" autoComplete="new-password" /></Field>
        <Field label="Confirm new password" required error={err || undefined}><Input type="password" value={r} onChange={(e) => setR(e.target.value)} placeholder="Re-enter the new password" autoComplete="new-password" /></Field>
        <Text role="desc" as="p">{PW_RULES.map(([, l]) => l).join(", ")}. It must differ from your current password. Changing it signs out every other session.</Text>
      </Stack>
    </Sheet>
  );
}
function PhoneSheet({ close }: { close: () => void }) {
  const [step, setStep] = useState<"num" | "code">("num");
  const [num, setNum] = useState(""), [pw, setPwd] = useState(""), [code, setCode] = useState("");
  return step === "num" ? (
    <Sheet title="Change phone number" onClose={close} footer={<><Button kind="secondary" onClick={close}>Cancel</Button><Button kind="primary" disabled={num.replace(/\D/g, "").length < 7 || !pw} onClick={() => { setStep("code"); toast("A code was sent to the new number"); }}>Send Code</Button></>}>
      <Stack gap={5}>
        <Field label="New number" required><Input type="tel" value={num} onChange={(e) => setNum(e.target.value)} placeholder="+1 (415) 555-0100" /></Field>
        <Field label="Current password" required><Input type="password" value={pw} onChange={(e) => setPwd(e.target.value)} placeholder="Your current password" autoComplete="current-password" /></Field>
        <Text role="desc" as="p">We send a code to the new number; it takes over once the code is entered.</Text>
      </Stack>
    </Sheet>
  ) : (
    <Sheet title="Change phone number" onClose={close} footer={<><Button kind="secondary" onClick={close}>Cancel</Button><Button kind="primary" disabled={code.length < 6} onClick={() => { commit(() => { ME.phone = num.trim(); }, "Phone number updated"); close(); }}>Verify & Save</Button></>}>
      <Stack gap={5}>
        <KV rows={[["New number", num.replace(/.(?=.{4})/g, "•")]]} />
        <Field label="Code sent to the new number" required><Input inputMode="numeric" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="6-digit code" /></Field>
        <Text role="desc" as="p">The old number stays in force until the new one is verified.</Text>
      </Stack>
    </Sheet>
  );
}

/* ---------------- My Profile (account menu) ---------------- */
export function AdminProfile() {
  useStore();
  const [edit, setEdit] = useState(false);
  const parts = String(ME.name).trim().split(/\s+/);
  const [first, setFirst] = useState(parts[0] || ""), [last, setLast] = useState(parts.slice(1).join(" "));
  const PERMS = (RAW.PERM_ROWS as [string, string, string[]][]).map(([, l]) => l);
  return (
    <Page>
      <PageHeader title="My Profile" desc="Your account details, role and permissions." />
      <Section kind="block">
        <div className={`${p.idhead} ${p.fit}`}>
          <span className={p.photo}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={face(ME.name)} alt="" />
          </span>
          <span className={p.idB}><Text role="h3" as="span">{ME.name}</Text><Text role="desc" as="span">{ME.email}</Text></span>
          <span className={p.idAct}>{edit
            ? <Stack row gap={3}>
                <Button kind="link" size="sm" icon="delete" onClick={() => { setEdit(false); setFirst(parts[0] || ""); setLast(parts.slice(1).join(" ")); }}>Discard Changes</Button>
                <Button kind="primary" size="sm" iconEnd="check" disabled={!first.trim() || !last.trim()} onClick={() => { commit(() => { ME.name = `${first.trim()} ${last.trim()}`; }, "Profile saved"); setEdit(false); }}>Save Changes</Button>
              </Stack>
            : <Button kind="ghost" size="sm" iconEnd="edit" onClick={() => setEdit(true)}>Edit Details</Button>}</span>
        </div>
      </Section>
      {/* The facts grid is its own section, one section gap under the identity head (Maryam 16 Oct 2026). */}
      <Section kind="block">
        {edit ? (
          <div className={y.g3}>
            <Field label="First name" required><Input value={first} onChange={(e) => setFirst(e.target.value)} /></Field>
            <Field label="Last name" required><Input value={last} onChange={(e) => setLast(e.target.value)} /></Field>
            <Field label="Email address"><Input value={ME.email} readOnly /></Field>
            <Field label="Job title"><Input value={ME.job || "—"} readOnly /></Field>
            <Field label="Department"><Input value={ME.dept || "—"} readOnly /></Field>
          </div>
        ) : (
          <Facts>
            <Fact icon="shield" label="Role" value={staffRoleName(ME)} />
            <Fact icon="user" label="Job title" value={ME.job || "—"} />
            <Fact icon="group" label="Department" value={ME.dept || "—"} />
            <Fact icon="checkOutline" label="Status" value="Active" />
            <Fact icon="calendar" label="Member since" value={ME.joined || "—"} />
            <Fact icon="add" label="Invited by" value={ME.orig ? "The platform" : "—"} />
            <Fact icon="time" label="Last signed in" value={ME.last || "—"} />
            <Fact icon="phone" label="Phone" value={ME.phone || "—"} />
          </Facts>
        )}
      </Section>
      {!edit && (
        <Section>
          <SectionHeader title="Permissions" />
          <Chips>{PERMS.map((l) => <Chip key={l}>{l}</Chip>)}</Chips>
        </Section>
      )}
    </Page>
  );
}

/* ---------------- General Settings (account menu) ---------------- */
export function AdminGeneral() {
  const G = RAW.GENERAL;
  const [v, setV] = useState({ ...G });
  const opts = (a: string[]) => a.map((x) => ({ value: x, label: x }));
  const dirty = Object.keys(G).some((k) => G[k] !== (v as any)[k]);
  return (
    <Page>
      <PageHeader title="General Settings" desc="The platform’s identity and how dates, currency and the timezone read across the admin." />
      <Section>
        <SectionHeader title="Identity" desc="How the platform names itself to the team and in email."
          actions={<Button kind="primary" size="sm" disabled={!dirty} onClick={() => commit(() => Object.assign(G, v), "General settings saved")}>Save</Button>} />
        <div className={y.g2}>
          <Field label="Organisation name"><Input value={v.org} onChange={(e) => setV({ ...v, org: e.target.value })} /></Field>
          <Field label="Support email"><Input type="email" value={v.support} onChange={(e) => setV({ ...v, support: e.target.value })} /></Field>
          <Field label="Support phone"><Input value={v.phone} onChange={(e) => setV({ ...v, phone: e.target.value })} /></Field>
          <Field label="Timezone"><Dropdown variant="form" value={v.tz} onChange={(x) => setV({ ...v, tz: x })} options={opts(["Europe/London (GMT+1)", "UTC", "America/New_York (GMT-4)", "Asia/Karachi (GMT+5)"])} /></Field>
          <Field label="Language"><Dropdown variant="form" value={v.lang} onChange={(x) => setV({ ...v, lang: x })} options={opts(["English (United Kingdom)", "English (United States)"])} /></Field>
          <Field label="Date format"><Dropdown variant="form" value={v.dates} onChange={(x) => setV({ ...v, dates: x })} options={opts(["MM-DD-YYYY", "DD-MM-YYYY", "YYYY-MM-DD"])} /></Field>
          <Field label="Display currency"><Dropdown variant="form" value={v.ccy} onChange={(x) => setV({ ...v, ccy: x })} options={opts(["USD ($)", "GBP (£)", "EUR (€)"])} /></Field>
        </div>
      </Section>
    </Page>
  );
}
