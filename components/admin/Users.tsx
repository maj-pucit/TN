"use client";
import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Page, PageHeader, Section, Stack, Text } from "../primitives";
import { Table, PersonCell, Status, BulkBar, type RowAction } from "../ui/Table";
import { Button } from "../ui/Button";
import { Dropdown, MultiDropdown } from "../ui/Dropdown";
import { Field, Input, TextArea, Search, Toolbar } from "../ui/Field";
import { Slider } from "../ui/Slider";
import { Sheet } from "../ui/Sheet";
import { KV } from "../ui/KV";
import { Icon } from "../Icon";
import { commit, toast, useStore } from "@/lib/store";
import {
  RAW, USERS, USER_BY_ID, ROLE_FILTER, ROLE_BY_K, STAFF_ROLE_KEYS, USER_STATUS_OPTS, LVL_CODES,
  usersBase, roleGroup, roleMatch, userStatusKey, userStatus, userTypeName, staffRoles, staffRoleName,
  userCand, candLevel, userTrack, agState, agStateTone, agTraining, agTrainTone, agRange, rangeLabel, rangeCovers,
  agScore, face, money, personHref, COMMISSION_PCT, FEE_TRACKS, trackFees, feeRange, priceFor, commissionPct, platformFee, type TrackKey, type U,
} from "@/data/admin";
import s from "./admin.module.css";

/* ============================================================
   ALL USERS — Phase 1 usersAll (7 Oct 2026 "one directory"): every account
   bar Super Admins and employers; the Role filter tells them apart and
   brings that role's own filters and columns. No deletes, ever.
   CUT (G8): the Cohort Leader role, its stage/type filters and columns,
   Invite A Leader, Allot a Cohort, Mark / Remove as Cohort Leader.
   ============================================================ */
/* Read live, so a department added or deleted in Settings shows at once. */
const depts = (): string[] => RAW.DEPARTMENTS.map((d: { name: string }) => d.name);
const NO_DEPTS = "No departments have been added yet. Users cannot be invited until at least one exists.";
const INTERNAL_ROLES: [string, string][] = STAFF_ROLE_KEYS.filter((k) => k !== "admin").map((k) => [k, ROLE_BY_K[k].name]);
const opt = ([value, label]: [string, string]) => ({ value, label });
export type SheetKey = { k: string; id?: string } | null;

export function AdminUsers() {
  useStore();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [f, setF] = useState<Record<string, string>>({ role: "all", status: "all" });
  const [sel, setSel] = useState<string[]>([]);
  const [sheet, setSheet] = useState<SheetKey>(null);
  useEffect(() => { const r = new URLSearchParams(location.search).get("role"); if (r) setF((x) => ({ ...x, role: r })); }, []);
  const g = roleGroup(f.role);
  const fv = (k: string) => f[k] ?? "all";
  const setRole = (v: string) => setF({ role: v, status: "all" });

  let rows = usersBase().filter((u) => roleMatch(u, f.role)).filter((u) => fv("status") === "all" || userStatusKey(u) === fv("status"));
  if (g === "candidate") rows = rows.filter((u) => fv("ctrack") === "all" || userTrack(u) === fv("ctrack")).filter((u) => fv("clevel") === "all" || userCand(u)?.level === fv("clevel"));
  if (g === "agent") rows = rows.filter((u) => fv("agstate") === "all" || agState(u) === fv("agstate")).filter((u) => fv("agtrain") === "all" || agTraining(u) === fv("agtrain"))
    .filter((u) => fv("agrange") === "all" || rangeCovers(agRange(u), fv("agrange"))).sort((a, b) => (a.rank || 99) - (b.rank || 99) || a.name.localeCompare(b.name));
  if (g === "internal") rows = rows.filter((u) => fv("dept") === "all" || u.dept === fv("dept"));
  const ql = q.toLowerCase();
  rows = rows.filter((u) => !q || [u.name, u.email, u.job, userCand(u)?.level].some((x) => String(x || "").toLowerCase().includes(ql)));

  const dd = (k: string, label: string, opts: [string, string][]) => (
    <Dropdown key={k} label={label} value={fv(k)} onChange={(v) => setF((x) => ({ ...x, [k]: v }))} options={opts.map(opt)} />
  );
  const filters = [
    <Dropdown key="role" label="Role" value={f.role} onChange={setRole} options={ROLE_FILTER.map(opt)} />,
    g !== "agent" && dd("status", "Status", USER_STATUS_OPTS),
    ...(g === "candidate" ? [dd("ctrack", "Track", [["all", "All"], ["Explorer", "Explorer"], ["Builder", "Builder"], ["Trailblazer", "Trailblazer"]]), dd("clevel", "Level", [["all", "All"], ...LVL_CODES.map((l) => [l, l] as [string, string])])] : []),
    ...(g === "agent" ? [
      dd("agstate", "Listing", [["all", "All"], ["listed", "Listed"], ["paused", "Paused"], ["notlisted", "Not listed"], ["invited", "Invited"], ["deactivated", "Deactivated"]]),
      dd("agtrain", "Training", [["all", "All"], ["complete", "Complete"], ["notcomplete", "Not complete"], ["overridden", "Overridden"]]),
      dd("agrange", "Assesses", [["all", "All"], ...LVL_CODES.map((l) => [l, l] as [string, string])]),
    ] : []),
    ...(g === "internal" ? [dd("dept", "Department", [["all", "All"], ...depts().map((d) => [d, d] as [string, string])])] : []),
  ].filter(Boolean);

  const st = (u: U) => { const [t, l] = userStatus(u); return <Status tone={t}>{l}</Status>; };
  const dash = <Text role="caption" as="span">—</Text>;
  const name = { key: "u", label: "User", cell: (u: U) => <PersonCell name={u.name} img={face(u.name)} sub={u.email} /> };
  const cols = g === "candidate" ? [name,
      { key: "l", label: "Level", cell: (u: U) => userCand(u)?.level ?? candLevel(u) },
      { key: "t", label: "Track", cell: (u: U) => userTrack(u) },
      { key: "s", label: "Status", cell: st }, { key: "a", label: "Last active", cell: (u: U) => u.last }]
    : g === "agent" ? [name,
      { key: "r", label: "Rank", cell: (u: U) => (u.rank ? String(u.rank) : "—") },
      { key: "sc", label: "Agent Score", cell: (u: U) => (u.status === "invited" ? "—" : <span className={s.score}><Icon name="star" />{agScore(u)?.toFixed(1)}</span>) },
      { key: "i", label: "Interviews", cell: (u: U) => String(u.interviewed || 0) },
      { key: "tr", label: "Training", cell: (u: U) => { if (u.status === "invited") return "—"; const [t, l] = agTrainTone(u); return <Status tone={t}>{l}</Status>; } },
      { key: "as", label: "Assesses", cell: (u: U) => rangeLabel(agRange(u)) },
      { key: "fe", label: "Fee", cell: (u: U) => (u.fee || u.fees ? feeRange(u) : "—") },
      { key: "sa", label: "State", cell: (u: U) => { if (u.status === "invited") return st(u); const [t, l] = agStateTone(u); return <Status tone={t}>{l}</Status>; } }]
    : g === "internal" ? [name,
      { key: "j", label: "Job title", cell: (u: U) => u.job || "—" }, { key: "d", label: "Department", cell: (u: U) => u.dept || "—" },
      { key: "s", label: "Status", cell: st }, { key: "ls", label: "Last signed in", cell: (u: U) => u.last || "Never" }, { key: "ad", label: "Added", cell: (u: U) => u.joined }]
    : [name,
      { key: "ty", label: "Type", cell: (u: U) => userTypeName(u) },
      { key: "l", label: "Level", cell: (u: U) => (u.roles.includes("candidate") ? candLevel(u) : dash) },
      { key: "s", label: "Status", cell: st }, { key: "j", label: "Joined", cell: (u: U) => u.joined }, { key: "a", label: "Last active", cell: (u: U) => u.last }];

  const selUsers = sel.map((id) => USER_BY_ID[id]).filter(Boolean);
  const anyActive = selUsers.some((u) => u.status === "active" || u.status === "ok");
  const allInactive = selUsers.length > 0 && selUsers.every((u) => u.status === "inactive");
  const bulk = anyActive
    ? [{ icon: "deactivate" as const, label: sel.length > 1 ? "Deactivate All" : "Deactivate", onClick: () => setSheet({ k: "bulkdeact" }) }]
    : allInactive ? [{ icon: "play" as const, label: sel.length > 1 ? "Reactivate All" : "Reactivate", onClick: () => commit(() => { selUsers.forEach((u) => (u.status = "active")); setSel([]); }, `${selUsers.length} account${selUsers.length === 1 ? "" : "s"} reactivated`) }] : [];

  return (
    <Page>
      <PageHeader title="All users" desc="Everyone with an account on the platform. Pick a role to filter by what matters for it. A row opens the full record."
        actions={
          <Stack row gap={3}>
            <Button kind="ghost" size="sm" icon="download" href="/admin/users/import/">Bulk Import</Button>
            <Button kind="ghost" size="sm" icon="download" onClick={() => toast(rows.length ? `Exporting ${rows.length} row${rows.length === 1 ? "" : "s"}. A download link will reach your notifications, valid 7 days.` : "Nothing to export in this filter", rows.length ? "ok" : "warn")}>Export</Button>
            <Button kind="primary" size="sm" icon="add" onClick={() => setSheet({ k: "adduser" })}>Invite User</Button>
          </Stack>
        } />
      <Section kind="block">
        <Toolbar search={<Search value={q} onChange={setQ} placeholder={g === "candidate" ? "Search by name, email or level" : "Search by name or email"} />} filters={<>{filters}</>} />
        {rows.length ? (
          <Table rows={rows} rowKey={(u) => u.id} href={personHref} cols={cols} actions={(u) => rowActs(u, setSheet, router.push)} selected={sel} onSelect={setSel} />
        ) : (
          <div className={s.empty}><Icon name="group" /><Text role="h4" as="span">No accounts match</Text><Text role="desc" as="span">{q ? `Nothing matches “${q}” in this filter.` : "Nothing in this filter yet."}</Text></div>
        )}
        <BulkBar count={sel.length} actions={bulk} onClear={() => setSel([])} />
      </Section>
      <UserSheets sheet={sheet} close={() => setSheet(null)} sel={selUsers} clearSel={() => setSel([])} />
    </Page>
  );
}

/* One menu per person (Phase 1 userMenuActs), shared by the row and the detail page. */
export function rowActs(u: U, open: (s: SheetKey) => void, go?: (href: string) => void): RowAction[] {
  const view: RowAction[] = go ? [{ icon: "view", label: "View", onClick: () => go(personHref(u)) }] : [];
  const active = u.status === "active" || u.status === "ok";
  if (u.status === "invited") return [...view,
    { icon: "renew", label: "Resend Invite", onClick: () => commit(() => { u.invitedOn = mdy(new Date()); }, `Invite re-sent to ${u.email}`) },
    { icon: "close", label: "Cancel Invite", onClick: () => commit(() => { const i = USERS.indexOf(u); if (i >= 0) USERS.splice(i, 1); }, `Invite to ${u.name} cancelled`) }];
  const off: RowAction = active
    ? { icon: "deactivate", label: "Deactivate", onClick: () => open({ k: u.internal ? "deactivate" : "deactext", id: u.id }) }
    : { icon: "play", label: "Reactivate", onClick: () => open({ k: u.internal ? "reactivate" : "reactext", id: u.id }) };
  /* The agent's own steps, shared by an agent and by a staff member who is also one. */
  const agentActs = (editLabel: string): RowAction[] => {
    const stt = agState(u);
    return [
      { icon: "edit", label: editLabel, onClick: () => open({ k: "editagent", id: u.id }) },
      ...(stt === "listed" ? [{ icon: "pause", label: "Pause Listing", onClick: () => open({ k: "agpause", id: u.id }) } as RowAction] : []),
      ...(stt === "paused" ? [{ icon: "play", label: "Restore Listing", onClick: () => open({ k: "agrestore", id: u.id }) } as RowAction] : []),
      { icon: "flag", label: "Set Assessment Range", onClick: () => open({ k: "agrange", id: u.id }) },
      ...(agTraining(u) === "notcomplete" ? [{ icon: "check", label: "Override Training Gate", onClick: () => open({ k: "agoverride", id: u.id }) } as RowAction] : []),
    ];
  };
  if (u.internal) {
    if (!active) return [...view, off];
    const prot = u.orig ? "The original Super Admin account is protected" : null;
    const both = u.roles.includes("agent");
    return [...view,
      ...(prot ? [] : [{ icon: "edit", label: both ? "Edit Staff Details" : "Edit", onClick: () => open({ k: "editstaff", id: u.id }) } as RowAction,
        { icon: "group", label: "Change Roles", onClick: () => open({ k: "changerole", id: u.id }) } as RowAction]),
      ...(both ? agentActs("Edit Agent Details") : [{ icon: "verified", label: "Mark as Talent Agent", onClick: () => open({ k: "markagent", id: u.id }) } as RowAction]),
      ...(prot ? [] : [off])];
  }
  if (u.roles.includes("agent") && !u.roles.includes("candidate")) return [...view, ...agentActs("Edit"), off];
  return [...view, ...(userCand(u) ? [{ icon: "edit", label: "Edit", onClick: () => open({ k: "editcand", id: u.id }) } as RowAction] : []), off];
}
const mdy = (d: Date) => `${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}-${d.getFullYear()}`;

/* Every sheet a user row (or the detail page) opens. */
export function UserSheets({ sheet, close, sel = [], clearSel }: { sheet: SheetKey; close: () => void; sel?: U[]; clearSel?: () => void }) {
  if (!sheet) return null;
  const u: U | undefined = sheet.id ? USER_BY_ID[sheet.id] : undefined;
  switch (sheet.k) {
    case "adduser": return <AddUser close={close} />;
    case "editagent": return u ? <EditAgent u={u} close={close} /> : null;
    case "editcand": return u ? <EditCand u={u} close={close} /> : null;
    case "editstaff": return u ? <EditStaff u={u} close={close} /> : null;
    case "deactext": case "deactivate":
      return u ? <Reason title={`Deactivate ${u.name}`} ok="Deactivate" danger close={close}
        ph={sheet.k === "deactext" ? "Why this account is being removed. Internal only." : "Why this account is being switched off. Internal only — they never see it."}
        help={sheet.k === "deactivate" ? "They are signed out immediately and can’t sign in again. The record, role and history stay intact so the account can be reactivated later." : undefined}
        onOk={() => commit(() => { u.status = "inactive"; u.deactivatedOn = mdy(new Date()); }, `${u.name} deactivated`)} /> : null;
    case "reactext": case "reactivate":
      return u ? <Reason title={`Reactivate ${u.name}`} ok="Reactivate" close={close} ph="Why access is being restored. Internal only."
        extra={sheet.k === "reactivate" ? <Field label="Role restored"><Input value={staffRoleName(u)} readOnly /></Field> : undefined}
        help={sheet.k === "reactivate" ? "Their password is unchanged, so they sign in exactly as before — a one-time code to their email at each sign-in, as always." : undefined}
        onOk={() => commit(() => { u.status = "active"; delete u.deactivatedOn; }, `${u.name} reactivated`)} /> : null;
    case "bulkdeact":
      return <Reason title={`Deactivate ${sel.length} account${sel.length === 1 ? "" : "s"}`} ok={sel.length > 1 ? "Deactivate All" : "Deactivate"} danger close={close}
        ph="Why these accounts are being removed. Internal only."
        onOk={() => commit(() => { sel.forEach((x) => { x.status = "inactive"; x.deactivatedOn = mdy(new Date()); }); clearSel?.(); }, `${sel.length} account${sel.length === 1 ? "" : "s"} deactivated`)} />;
    case "agpause":
      return u ? <Reason title={`Pause ${u.name}’s listing`} ok="Pause Listing" close={close} ph="Required — written to the audit log; never shown to the agent"
        top={<KV rows={[["Agent", u.name], ["Email", u.email], ["Upcoming interviews", "6 in the diary"]]} />}
        onOk={() => commit(() => { u.paused = true; }, `${u.name}’s listing is paused`)} /> : null;
    case "agrestore":
      return u ? <Reason title={`Restore ${u.name}’s listing`} ok="Restore Listing" close={close} ph="Required — written to the audit log; never shown to the agent"
        top={<KV rows={[["Agent", u.name], ["Email", u.email]]} />}
        help="They reappear in the marketplace immediately and can receive new bookings. They regain a rank at the next weekly recalculation."
        onOk={() => commit(() => { u.paused = false; if (u.status === "inactive") u.status = "active"; }, `${u.name}’s listing is restored`)} /> : null;
    case "agrange": return u ? <AgRange u={u} close={close} /> : null;
    case "agoverride":
      return u ? <Reason title={`Override training gate — ${u.name}`} ok="Override and List" close={close} ph="Required — recorded against your account; never shown to the agent"
        top={<KV rows={[["Agent", u.name], ["Email", u.email], ["LightspeedVT training", "Not complete"]]} />}
        help={<>Lists this agent without completing the LightspeedVT training module. The Training column will read <b>Overridden</b> with your name and the date. The account, payout-destination and profile-and-fee gates still apply — the agent is listed only where those also pass. The override stays until normal training completion replaces it.</>}
        onOk={() => commit(() => { u.training = "overridden"; }, `Training gate overridden for ${u.name}`)} /> : null;
    case "changerole": return u ? <ChangeRole u={u} close={close} /> : null;
    case "markagent": return u ? <MarkAgent u={u} close={close} /> : null;
  }
  return null;
}

const Foot = ({ ok, onOk, disabled, danger, close }: { ok: string; onOk: () => void; disabled?: boolean; danger?: boolean; close: () => void }) => (
  <><Button kind="secondary" onClick={close}>Cancel</Button><Button kind={danger ? "danger" : "primary"} disabled={disabled} onClick={onOk}>{ok}</Button></>
);

/* A centred sheet whose one required field is a reason. */
function Reason({ title, ok, ph, onOk, close, danger, top, help, extra }: {
  title: string; ok: string; ph: string; onOk: () => void; close: () => void; danger?: boolean; top?: ReactNode; help?: ReactNode; extra?: ReactNode;
}) {
  const [why, setWhy] = useState("");
  return (
    <Sheet title={title} onClose={close} footer={<Foot ok={ok} danger={danger} disabled={!why.trim()} close={close} onOk={() => { onOk(); close(); }} />}>
      {top}
      <Field label="Reason" required><TextArea rows={3} value={why} onChange={(e) => setWhy(e.target.value)} placeholder={ph} /></Field>
      {extra}
      {help && <Text role="desc" as="p">{help}</Text>}
    </Sheet>
  );
}

function AgRange({ u, close }: { u: U; close: () => void }) {
  const r = agRange(u);
  const [from, setFrom] = useState(r[0]), [to, setTo] = useState(r[1]), [why, setWhy] = useState("");
  const lv = LVL_CODES.map((l) => ({ value: l, label: l }));
  return (
    <Sheet title={`Set assessment range — ${u.name}`} onClose={close}
      footer={<Foot ok="Save Range" disabled={!why.trim()} close={close} onOk={() => { commit(() => { u.range = [from, to]; }, `${u.name} now assesses ${rangeLabel([from, to])}`); close(); }} />}>
      <KV rows={[["Agent", u.name], ["Current range", rangeLabel(r)]]} />
      <Field label="From level"><Dropdown variant="form" value={from} onChange={setFrom} options={lv} /></Field>
      <Field label="To level"><Dropdown variant="form" value={to} onChange={setTo} options={lv} /></Field>
      <Field label="Reason" required><TextArea rows={3} value={why} onChange={(e) => setWhy(e.target.value)} placeholder="Required — written to the audit log; never shown to the agent" /></Field>
    </Sheet>
  );
}

/* Change roles: the internal roles a person holds, as a set. A person may hold
   several (23 Oct 2026); the sheet replaces the whole set and needs at least one. */
function ChangeRole({ u, close }: { u: U; close: () => void }) {
  const [roles, setRoles] = useState<string[]>(staffRoles(u).filter((k) => k !== "admin"));
  const names = andList(roles.map((k) => ROLE_BY_K[k].name));
  return (
    <Sheet title={`Change ${u.name}’s roles`} onClose={close}
      footer={<Foot ok="Confirm" disabled={!roles.length} close={close} onOk={() => { commit(() => { u.roles = [...u.roles.filter((r: string) => !STAFF_ROLE_KEYS.includes(r) || r === "admin"), ...roles]; }, `${u.name} is now ${names}`); close(); }} />}>
      <Field label="User"><Input value={`${u.name} · ${u.email}`} readOnly /></Field>
      <Field label="Current roles"><Input value={staffRoleName(u)} readOnly /></Field>
      <Field label="Roles" required><MultiDropdown value={roles} onChange={setRoles} options={INTERNAL_ROLES.map(opt)} placeholder="Select roles" /></Field>
      <Text role="desc" as="p">These replace the roles they hold now. They are notified and their access changes immediately.</Text>
    </Sheet>
  );
}

/* The 5-star starting Agent Score (Phase 1 starPick). */
function StarPick({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <span className={s.stars} role="radiogroup" aria-label="Initial rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" role="radio" aria-checked={value === n} aria-label={`${n} star${n > 1 ? "s" : ""}`} className={n <= value ? s.on : ""} onClick={() => onChange(n)}>
          <Icon name={n <= value ? "star" : "starOutline"} />
        </button>
      ))}
    </span>
  );
}
const RatingField = ({ value, onChange }: { value: number; onChange: (n: number) => void }) => (
  <Field label="Initial rating" required>
    <StarPick value={value} onChange={onChange} />
  </Field>
);

/* The fees that make up an interview's price, with the candidate's price worked out live
   underneath. Used by every form that creates or edits an agent. THE AGENT'S FEE IS SET
   PER TRACK (Maryam 26 Oct 2026): an Explorer, a Builder and a Trailblazer fee, each paid
   to the agent in full. Then ONE Commission (%), separate from all three, prefilled at 20
   (was a $25 "Platform fee"); it is a share of the candidate's price (data/fees.ts). The
   labels name the level group, not the word "track". */
const num = (x: string) => Number(String(x).replace(/[^\d.]/g, "")) || 0;
/* AN AGENT INTERVIEWS ONLY THE TRACKS PICKED (Maryam 2 Nov 2026): a "Tracks" picker comes
   first and each picked track grows its own fee field below it, so an agent can cover
   Explorers only, Builders and Trailblazers only, or all three. A key present in FeeStr
   is a picked track; its value is the fee typed for it. An unpicked track saves as 0. */
type FeeStr = Partial<Record<TrackKey, string>>;
const NO_FEES: FeeStr = {};
const COM_DEFAULT = String(COMMISSION_PCT);
const picked = (f: FeeStr) => FEE_TRACKS.filter((t) => t.key in f);
const feeStr = (u: U): FeeStr => { const f = trackFees(u), o: FeeStr = {}; FEE_TRACKS.forEach((t) => { if (f[t.key] > 0) o[t.key] = String(f[t.key]); }); return o; };
const feeNum = (f: FeeStr) => ({ explorer: num(f.explorer ?? ""), builder: num(f.builder ?? ""), trailblazer: num(f.trailblazer ?? "") });
/* A commission is required and 0–99 (100 would leave no price to divide). */
const comOk = (com: string) => com.trim() !== "" && num(com) < 100;
/* The platform fee is a required flat dollar amount ($0 allowed). */
const platOk = (pf: string) => pf.trim() !== "";
/* At least one track, and a fee on every track picked. */
const feesReady = (f: FeeStr, com: string, pf: string) => { const p = picked(f); return p.length > 0 && p.every((t) => num(f[t.key] ?? "") > 0) && comOk(com) && platOk(pf); };
/* What a save writes: the three fees (0 = not interviewed), `fee` (the first picked track's fee) for the single-fee reads, the commission and the platform fee. */
const feeSave = (f: FeeStr, com: string, pf: string) => { const n = feeNum(f); return { fees: n, fee: picked(f).map((t) => n[t.key])[0] ?? 0, commission: num(com), platformFee: num(pf) }; };
const TRACK_OPTS = FEE_TRACKS.map((t) => ({ value: t.key, label: t.label }));
function FeeFields({ fees, com, pf, setFees, onCom, onPf }: { fees: FeeStr; com: string; pf: string; setFees: (f: FeeStr) => void; onCom: (x: string) => void; onPf: (x: string) => void }) {
  const on = picked(fees);
  const set = on.filter((t) => num(fees[t.key] ?? "") > 0);
  /* Picking keeps any fee already typed; unpicking drops that track's field and value. */
  const pick = (keys: string[]) => { const o: FeeStr = {}; FEE_TRACKS.forEach((t) => { if (keys.includes(t.key)) o[t.key] = fees[t.key] ?? ""; }); setFees(o); };
  return (
    <>
      <Field label="Tracks they interview" required>
        <MultiDropdown value={on.map((t) => t.key)} onChange={pick} options={TRACK_OPTS} placeholder="Select tracks" />
      </Field>
      {on.length > 0 && (
        <Stack gap={6}>
          {on.map((t) => (
            <Field key={t.key} label={`${t.label} fee`} required>
              <Input value={fees[t.key] ?? ""} onChange={(e) => setFees({ ...fees, [t.key]: e.target.value })} inputMode="decimal" placeholder="$100" />
            </Field>
          ))}
        </Stack>
      )}
      <Field label="Interview commission (%)" required>
        <Input value={com} onChange={(e) => onCom(e.target.value)} inputMode="decimal" placeholder={COM_DEFAULT} />
      </Field>
      {/* Platform fee: a flat $ amount after the commission (Maryam 26 Oct 2026). */}
      <Field label="Platform fee" required>
        <Input value={pf} onChange={(e) => onPf(e.target.value)} inputMode="decimal" placeholder="$25" />
      </Field>
      {/* The price line shows only once a fee is set; no placeholder line before that (Maryam 26 Oct 2026). */}
      {set.length > 0 && comOk(com) && platOk(pf) && (
        <Text role="body" as="p">
          Candidates pay {set.map((t, i) => <span key={t.key}>{i ? (i === set.length - 1 ? " and " : ", ") : ""}<b>{money(priceFor(num(fees[t.key] ?? ""), num(com), num(pf)))}</b> ({t.label})</span>)} per interview.
        </Text>
      )}
    </>
  );
}

function MarkAgent({ u, close }: { u: U; close: () => void }) {
  const [rating, setRating] = useState(0), [fees, setFees] = useState<FeeStr>(NO_FEES), [com, setCom] = useState(COM_DEFAULT), [pf, setPf] = useState("");
  return (
    <Sheet title={`Invite ${u.name} to be a talent agent`} onClose={close}
      footer={<Foot ok="Send Invite" disabled={!rating || !feesReady(fees, com, pf)} close={close} onOk={() => { commit(() => { u.roles = [...u.roles, "agent"]; Object.assign(u, feeSave(fees, com, pf)); u.startingScore = rating; u.scoreApproved = false; u.onboarded = false; }, `Agent invite sent to ${u.email}`); close(); }} />}>
      <Text role="desc" as="p">{u.name} keeps their current account and role. Set their interview fees and starting Agent Score; an invitation to the agent workspace is sent.</Text>
      <FeeFields fees={fees} com={com} pf={pf} setFees={setFees} onCom={setCom} onPf={setPf} />
      <RatingField value={rating} onChange={setRating} />
    </Sheet>
  );
}

/* Invite User: one slider, one invite, ANY combination of roles (Maryam, 23 Oct
   2026). The Roles field is a multi-select of every role an admin may add (Phase 1
   ADDUSER_ROLES; CUT G8: Cohort Leader). Name and email are asked once; each picked
   role kind then adds its own headed section. Phone, job title and department
   belong to the PERSON, so every picked internal role shares ONE staff section,
   headed with their names. Values typed into a section survive removing and
   re-adding its role. */
const ROLE_OPTS = [{ value: "agent", label: "Talent Agent" }, ...INTERNAL_ROLES.map(opt)];
/* One picked role's fields, in a block of their own: a white panel inside a hairline,
   its heading at the top (Maryam 26 Oct 2026: a divider alone "is looking very confusing"). */
/* Its top-right carries a red delete icon that takes the role(s) back out of the pick, for a
   role added by mistake (Maryam 26 Oct 2026). */
function RoleBlock({ title, onRemove, children }: { title: string; onRemove: () => void; children: ReactNode }) {
  return (
    <section className={s.roleBlock}>
      <div className={s.roleBlockH}>
        <Text role="sec" as="h3">{title}</Text>
        <button type="button" className={s.roleBlockX} onClick={onRemove} aria-label={`Remove ${title}`} title={`Remove ${title}`}>
          <Icon name="delete" />
        </button>
      </div>
      <Stack gap={6}>{children}</Stack>
    </section>
  );
}
const andList = (xs: string[]) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);
function AddUser({ close }: { close: () => void }) {
  const [roles, setRoles] = useState<string[]>([]);
  const [v, setV] = useState({ first: "", last: "", email: "", phone: "", job: "", dept: "", com: COM_DEFAULT, pf: "" });
  const [fees, setFees] = useState<FeeStr>(NO_FEES);
  const [rating, setRating] = useState(0);
  const set = (k: keyof typeof v) => (e: { target: { value: string } }) => setV((x) => ({ ...x, [k]: e.target.value }));
  const agent = roles.includes("agent");
  const staff = roles.filter((r) => r !== "agent");
  const staffNames = staff.map((k) => ROLE_BY_K[k].name);
  const ready = roles.length > 0 && v.first.trim() && v.last.trim() && v.email.trim()
    && (!agent || (rating > 0 && feesReady(fees, v.com, v.pf)))
    && (!staff.length || (v.job.trim() && v.dept && v.phone.trim()));
  const send = () => {
    commit(() => {
      USERS.push({
        id: `u${Date.now()}`, name: `${v.first.trim()} ${v.last.trim()}`, email: v.email.trim(), roles: [...roles], status: "invited", invitedOn: mdy(new Date()),
        joined: mdy(new Date()), last: "Never", level: "—",
        ...(staff.length ? { internal: true, job: v.job, dept: v.dept, phone: v.phone } : {}),
        ...(agent ? { ...feeSave(fees, v.com, v.pf), startingScore: rating, scoreApproved: false, interviewed: 0, onboarded: false, training: "notcomplete" } : {}),
      });
    }, `Invite sent to ${v.email.trim()} as ${andList(roles.map((r) => ROLE_OPTS.find((o) => o.value === r)!.label))}`);
    close();
  };
  return (
    <Slider title="Add a user" open onClose={close} footer={<Foot ok="Send Invite" disabled={!ready} close={close} onOk={send} />}>
      {/* The person first, then their roles (Maryam 26 Oct 2026): name and email, the Roles
          pick under them, and each picked role's fields in a block of their own. */}
      <Stack gap={6}>
        <Field label="First name" required><Input value={v.first} onChange={set("first")} placeholder="First name" /></Field>
        <Field label="Last name" required><Input value={v.last} onChange={set("last")} placeholder="Last name" /></Field>
        <Field label="Email address" required><Input value={v.email} onChange={set("email")} type="email" placeholder="name@company.com" /></Field>
        <Field label="Roles" required>
          <MultiDropdown value={roles} onChange={setRoles} options={ROLE_OPTS} placeholder="Select roles" />
        </Field>
        {agent && (
          <RoleBlock title="Talent Agent" onRemove={() => setRoles((r) => r.filter((k) => k !== "agent"))}>
            <FeeFields fees={fees} com={v.com} pf={v.pf} setFees={setFees} onCom={(x) => setV((y) => ({ ...y, com: x }))} onPf={(x) => setV((y) => ({ ...y, pf: x }))} />
            <RatingField value={rating} onChange={setRating} />
          </RoleBlock>
        )}
        {staff.length > 0 && (
          /* The internal roles share one block (phone, job title, department are the person's), so its delete removes all of them. */
          <RoleBlock title={andList(staffNames)} onRemove={() => setRoles((r) => r.filter((k) => k === "agent"))}>
            <Field label="Job title" required><Input value={v.job} onChange={set("job")} placeholder="e.g. Level Reviewer" /></Field>
            <Field label="Department" required help={depts().length ? undefined : NO_DEPTS}><Dropdown variant="form" disabled={!depts().length} placeholder="Select a department" value={v.dept || undefined} onChange={(d) => setV((x) => ({ ...x, dept: d }))} options={depts().map((d) => ({ value: d, label: d }))} /></Field>
            {/* Last in the block and required (Maryam 26 Oct 2026). */}
            <Field label="Phone number" required><Input value={v.phone} onChange={set("phone")} inputMode="tel" placeholder="+1 (415) 555-0100" /></Field>
          </RoleBlock>
        )}
      </Stack>
    </Slider>
  );
}

const split = (n: string) => { const [first, ...rest] = String(n).split(" "); return { first, last: rest.join(" ") }; };

function EditAgent({ u, close }: { u: U; close: () => void }) {
  const r = agRange(u);
  const [v, setV] = useState({ ...split(u.name), com: String(commissionPct(u)), pf: String(platformFee(u)), from: r[0], to: r[1] });
  const [fees, setFees] = useState<FeeStr>(() => feeStr(u));
  const lv = LVL_CODES.map((l) => ({ value: l, label: l }));
  return (
    <Slider title={`Edit talent agent — ${u.name}`} open onClose={close}
      footer={<Foot ok="Save Changes" disabled={!v.first.trim() || !v.last.trim() || !feesReady(fees, v.com, v.pf)} close={close} onOk={() => { commit(() => { u.name = `${v.first.trim()} ${v.last.trim()}`; Object.assign(u, feeSave(fees, v.com, v.pf)); u.range = [v.from, v.to]; }, `${u.name} updated`); close(); }} />}>
      <Stack gap={6}>
        <Field label="First name" required><Input value={v.first} onChange={(e) => setV({ ...v, first: e.target.value })} /></Field>
        <Field label="Last name" required><Input value={v.last} onChange={(e) => setV({ ...v, last: e.target.value })} /></Field>
        <Field label="Email address"><Input value={u.email} readOnly /></Field>
        <FeeFields fees={fees} com={v.com} pf={v.pf} setFees={setFees} onCom={(x) => setV({ ...v, com: x })} onPf={(x) => setV({ ...v, pf: x })} />
        <Field label="Assessment range (from)"><Dropdown variant="form" value={v.from} onChange={(x) => setV({ ...v, from: x })} options={lv} /></Field>
        <Field label="Assessment range (to)"><Dropdown variant="form" value={v.to} onChange={(x) => setV({ ...v, to: x })} options={lv} /></Field>
      </Stack>
    </Slider>
  );
}

/* CUT (G8): the Cohort field. The course is read-only (it follows enrolment). */
function EditCand({ u, close }: { u: U; close: () => void }) {
  const c = userCand(u);
  const [v, setV] = useState({ ...split(u.name), level: c?.level || "E1", status: u.status === "inactive" ? "inactive" : "active" });
  return (
    <Slider title={`Edit candidate — ${u.name}`} open onClose={close}
      footer={<Foot ok="Save Changes" disabled={!v.first.trim() || !v.last.trim()} close={close} onOk={() => { commit(() => { u.name = `${v.first.trim()} ${v.last.trim()}`; if (c) { c.level = v.level; c.name = u.name; } u.status = v.status; }, `${u.name} updated`); close(); }} />}>
      <Stack gap={6}>
        <Field label="First name" required><Input value={v.first} onChange={(e) => setV({ ...v, first: e.target.value })} placeholder="e.g. Ava" /></Field>
        <Field label="Last name" required><Input value={v.last} onChange={(e) => setV({ ...v, last: e.target.value })} placeholder="e.g. Stone" /></Field>
        <Field label="Level"><Dropdown variant="form" value={v.level} onChange={(x) => setV({ ...v, level: x })} options={LVL_CODES.map((l) => ({ value: l, label: l }))} /></Field>
        <Field label="Course"><Input value="Communicating with Impact" readOnly /></Field>
        <Field label="Status"><Dropdown variant="form" value={v.status} onChange={(x) => setV({ ...v, status: x })} options={[{ value: "active", label: "Active" }, { value: "inactive", label: "Deactivated" }]} /></Field>
      </Stack>
    </Slider>
  );
}

function EditStaff({ u, close }: { u: U; close: () => void }) {
  const [v, setV] = useState({ ...split(u.name), phone: u.phone || "", job: u.job || "", dept: u.dept || "" });
  return (
    <Slider title={`Edit ${u.name}`} open onClose={close}
      footer={<Foot ok="Save Changes" disabled={!v.first.trim() || !v.last.trim() || !v.job.trim() || !v.dept || !v.phone.trim()} close={close} onOk={() => { commit(() => { u.name = `${v.first.trim()} ${v.last.trim()}`; u.phone = v.phone; u.job = v.job; u.dept = v.dept; }, `${u.name} updated`); close(); }} />}>
      <Stack gap={6}>
        <Field label="First name" required><Input value={v.first} onChange={(e) => setV({ ...v, first: e.target.value })} /></Field>
        <Field label="Last name" required><Input value={v.last} onChange={(e) => setV({ ...v, last: e.target.value })} /></Field>
        <Field label="Email address"><Input value={u.email} readOnly /></Field>
        <Field label="Job title" required><Input value={v.job} onChange={(e) => setV({ ...v, job: e.target.value })} /></Field>
        <Field label="Department" required><Dropdown variant="form" value={v.dept} onChange={(x) => setV({ ...v, dept: x })} options={depts().map((d) => ({ value: d, label: d }))} /></Field>
        {/* Below Department and required, as on the invite (Maryam 26 Oct 2026). */}
        <Field label="Phone number" required><Input value={v.phone} onChange={(e) => setV({ ...v, phone: e.target.value })} inputMode="tel" placeholder="+1 (415) 555-0100" /></Field>
      </Stack>
    </Slider>
  );
}
