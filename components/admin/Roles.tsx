"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { useState } from "react";
import { Page, PageHeader, Section, SectionHeader, Stack, Text } from "../primitives";
import { Table, RowMenu } from "../ui/Table";
import { Button } from "../ui/Button";
import { Confirm } from "../ui/Confirm";
import { Slider } from "../ui/Slider";
import { Field, Input, TextArea } from "../ui/Field";
import { Dropdown } from "../ui/Dropdown";
import { Icon } from "../Icon";
import { commit, toast, useStore } from "@/lib/store";
import { RAW, ROLES, USERS, ROLE_BY_K, staffRole } from "@/data/admin";
import s from "./roles.module.css";

/* ============================================================
   ROLES & PERMISSIONS — Phase 1 usersRoles (12 Oct 2026 shape): the
   internal roles table, a divider with air, then one collapsed row per
   role opening to the one permissions grid (Module / Permission · View ·
   Create · Edit · Delete). Super Admin holds every permission. Edit is per
   row. CUT (G8): the Cohorts permission row.
   ============================================================ */
const ACTS = ["view", "create", "edit", "delete"];
const ROWS: [string, string, string[]][] = RAW.PERM_ROWS;
const PERMSET: Record<string, string[]> = RAW.PERMSET;
const TOTAL = ROWS.reduce((n, r) => n + r[2].length, 0);
const internal = () => ROLES.filter((r) => r.kind === "internal");
const holders = (k: string) => USERS.filter((u) => u.internal && staffRole(u) === k && u.status !== "deleted").length;

export function AdminRoles() {
  useStore();
  const [open, setOpen] = useState<string[]>([]);
  const [edit, setEdit] = useState<string | null>(null);
  const [draft, setDraft] = useState<string[]>([]);
  const [sheet, setSheet] = useState<null | { k: "new" } | { k: "edit"; id: string }>(null);
  const [del, setDel] = useState<string | null>(null);
  const roles = [...internal()].sort((a, b) => (a.k === "admin" ? -1 : b.k === "admin" ? 1 : 0));

  return (
    <Page>
      <PageHeader title="Roles & Permissions" desc="The internal roles and what each one is allowed to do, module by module." />
      <Section kind="block">
        <SectionHeader title="Roles" desc="Every role and what it grants. Super Admin ships with the platform; custom roles are yours to shape."
          actions={<Button kind="primary" size="sm" icon="add" onClick={() => setSheet({ k: "new" })}>New Role</Button>} />
        <Table rows={roles} rowKey={(r) => r.k} cols={[
          { key: "r", label: "Role", cell: (r) => <span className={s.role}>{r.name}{r.k === "admin" && <Text role="label" as="span" strong className={s.default}>Default</Text>}</span> },
          { key: "d", label: "Description", cell: (r) => <span className={s.desc}>{r.desc}</span> },
          { key: "n", label: "Accounts", right: true, cell: (r) => r.k === "admin" ? String(holders(r.k)) : <Link className={s.acct} href={`/admin/users/all/?role=${r.k}`}>{holders(r.k)}</Link> },
          { key: "a", label: "Actions", right: true, cell: (r) => r.k === "admin" ? null : (
            <RowMenu items={[{ icon: "edit", label: "Edit", onClick: () => setSheet({ k: "edit", id: r.k }) }, { icon: "delete", label: "Delete", danger: true, onClick: () => setDel(r.k) }]} />
          ) },
        ]} pageSize={10} />
      </Section>
      <div className={s.div} />
      <Section kind="block">
        <SectionHeader title="Permissions" desc="Each role lists what it can do across every module. A tick is a granted permission; the Super Admin holds them all." />
        <div className={s.acc}>
          {roles.map((r) => {
            const isOpen = open.includes(r.k) || edit === r.k;
            const set = edit === r.k ? draft : PERMSET[r.k] ?? [];
            const sa = r.k === "admin";
            const toggle = () => setOpen((o) => (o.includes(r.k) ? o.filter((x) => x !== r.k) : [...o, r.k]));
            return (
              <div key={r.k} className={s.item}>
                <div className={s.head}>
                  <button type="button" className={s.t} aria-expanded={isOpen} onClick={toggle}>
                    <Text role="h4" as="span">{r.name}</Text>
                    <Text role="desc" as="span">{sa ? "Every permission, always" : `${set.length} of ${TOTAL} permissions granted`}</Text>
                  </button>
                  <span className={s.a}>
                    {!sa && (edit === r.k ? (
                      <>
                        <Button kind="secondary" size="sm" onClick={() => setEdit(null)}>Cancel</Button>
                        <Button kind="primary" size="sm" disabled={sameSet(draft, PERMSET[r.k] ?? [])}
                          onClick={() => { commit(() => { PERMSET[r.k] = draft; }, `${r.name} permissions updated`); setEdit(null); }}>Update Permissions</Button>
                      </>
                    ) : !edit && <Button kind="ghost" size="sm" icon="edit" onClick={() => { setDraft([...(PERMSET[r.k] ?? [])]); setEdit(r.k); }}>Edit</Button>)}
                  </span>
                  <button type="button" className={`${s.chev} ${isOpen ? s.flip : ""}`} aria-label={isOpen ? "Collapse" : "Expand"} onClick={toggle}><Icon name="chevDown" /></button>
                </div>
                {isOpen && <Grid sa={sa} set={set} editing={edit === r.k} onToggle={(key) => setDraft((d) => (d.includes(key) ? d.filter((x) => x !== key) : [...d, key]))} />}
              </div>
            );
          })}
        </div>
      </Section>
      {sheet && <RoleSheet sheet={sheet} close={() => setSheet(null)} />}
      {del && (() => {
        const n = holders(del), r = ROLE_BY_K[del];
        return n ? (
          <Confirm icon="warning" title={`${r.name} can’t be deleted yet`} ok="OK" desc={`${n} account${n === 1 ? "" : "s"} hold this role. Move every holder to another role first.`} onCancel={() => setDel(null)} onOk={() => setDel(null)} />
        ) : (
          <Confirm icon="delete" danger stepup title={`Delete ${r.name}?`} ok="Delete" desc="The role leaves the role list and the permissions grid. This can’t be undone."
            onCancel={() => setDel(null)} onOk={() => { commit(() => { const i = ROLES.findIndex((x) => x.k === del); if (i >= 0) ROLES.splice(i, 1); }, `${r.name} deleted`); setDel(null); }} />
        );
      })()}
    </Page>
  );
}
const sameSet = (a: string[], b: string[]) => a.length === b.length && a.every((x) => b.includes(x));

/* The one grid: rows down, View / Create / Edit / Delete across. A dash where
   a module has no such action; the Super Admin row is all ticks. */
function Grid({ sa, set, editing, onToggle }: { sa: boolean; set: string[]; editing?: boolean; onToggle?: (k: string) => void }) {
  return (
    <div className={s.wrap}>
      <table className={s.grid}>
        <thead><tr><th className="t-compact w-strong">Module / Permission</th>{ACTS.map((a) => <th key={a} className="t-compact w-strong">{a[0].toUpperCase() + a.slice(1)}</th>)}</tr></thead>
        <tbody>
          {ROWS.map(([k, label, acts]) => (
            <tr key={k}>
              <td className="t-compact">{label}</td>
              {ACTS.map((a) => {
                const has = acts.includes(a), key = `${k}:${a}`, on = sa || (has && set.includes(key));
                return (
                  <td key={a}>
                    {editing && has ? (
                      <button type="button" className={`${s.tog} ${on ? s.on : ""}`} aria-pressed={on} aria-label={`${label}: ${a}`} onClick={() => onToggle?.(key)}>
                        <Icon name={on ? "checkFilled" : "checkOutline"} />
                      </button>
                    ) : on ? <Icon name="checkFilled" className={s.yes} /> : <span className={s.no}>—</span>}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* New Role / Edit role (Phase 1 KINDS.role): a name (unique), a description,
   and on create the permissions, nothing granted on open. */
function RoleSheet({ sheet, close }: { sheet: { k: "new" } | { k: "edit"; id: string }; close: () => void }) {
  const cur = sheet.k === "edit" ? ROLE_BY_K[sheet.id] : null;
  const [name, setName] = useState(cur?.name ?? ""), [desc, setDesc] = useState(cur?.desc ?? ""), [perms, setPerms] = useState<string[]>([]);
  const taken = ROLES.some((r) => r.name.toLowerCase() === name.trim().toLowerCase() && r.k !== cur?.k);
  const ok = name.trim() && desc.trim() && !taken;
  const save = () => {
    commit(() => {
      if (cur) { cur.name = name.trim(); cur.short = name.trim(); cur.desc = desc.trim(); }
      else { const k = `custom${Date.now()}`; ROLES.push({ k, name: name.trim(), short: name.trim(), kind: "internal", desc: desc.trim() }); ROLE_BY_K[k] = ROLES[ROLES.length - 1]; PERMSET[k] = perms; }
    }, cur ? `${name.trim()} updated` : `${name.trim()} created`);
    close();
  };
  return (
    <Slider title={cur ? `Edit role — ${cur.name}` : "Create Role"} open onClose={close}
      footer={<><Button kind="secondary" onClick={close}>Cancel</Button><Button kind="primary" disabled={!ok} onClick={save}>{cur ? "Save Changes" : "Create Role"}</Button></>}>
      <Stack gap={6}>
        <Field label="Role name" required error={taken ? "A role with this name already exists." : undefined}><Input value={name} onChange={(e) => setName(e.target.value)} maxLength={50} placeholder="e.g. Finance Reviewer" /></Field>
        <Field label="Description" required><TextArea rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} maxLength={255} placeholder="What this role is for" /></Field>
        {!cur && (
          <div>
            <Text role="label" as="span" strong ink="primary" className={s.lbl}>Permissions</Text>
            <Grid sa={false} set={perms} editing onToggle={(k) => setPerms((p) => (p.includes(k) ? p.filter((x) => x !== k) : [...p, k]))} />
          </div>
        )}
      </Stack>
    </Slider>
  );
}

/* ============================================================
   BULK IMPORT — Phase 1 usersImport: Upload → Review → Done. The CSV is
   first_name,last_name,email,role; Super Admin, candidates and employers
   are refused. CUT (G8): the leader role is not importable.
   ============================================================ */
const IMP_ROLES = ["agent", ...["reviewer", "supervisor", "manager", "admin2"]];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
type Row = { first: string; last: string; email: string; role: string; st?: { k: "ok" | "warn" | "err"; t: string } };
function validate(rows: Row[]) {
  const seen: Record<string, boolean> = {}, existing = new Set(USERS.map((u) => u.email.toLowerCase()));
  return rows.map((r) => {
    const first = (r.first || "").trim(), last = (r.last || "").trim(), email = (r.email || "").trim(), role = (r.role || "").trim().toLowerCase();
    let st: Row["st"];
    if (!first) st = { k: "err", t: "Missing first name" };
    else if (!last) st = { k: "err", t: "Missing last name" };
    else if (!EMAIL.test(email)) st = { k: "err", t: "Invalid email" };
    else if (!role) st = { k: "warn", t: "Missing role" };
    else if (["admin", "super admin", "superadmin"].includes(role)) st = { k: "err", t: "Super Admin can’t be imported" };
    else if (role === "candidate") st = { k: "err", t: "Candidates join on their own" };
    else if (role === "employer") st = { k: "err", t: "Employers can’t be imported" };
    else if (!IMP_ROLES.includes(role)) st = { k: "err", t: `Unknown role "${(r.role || "").trim()}"` };
    else if (existing.has(email.toLowerCase()) || seen[email.toLowerCase()]) st = { k: "err", t: "Duplicate email" };
    else st = { k: "ok", t: "Ready" };
    if (email) seen[email.toLowerCase()] = true;
    return { ...r, st };
  });
}
const SAMPLE: Row[] = (RAW.IMP_SAMPLE as string[][]).map(([first, last, email, role]) => ({ first, last, email, role: role === "leader" ? "reviewer" : role }));

export function AdminImport() {
  const [step, setStep] = useState<"upload" | "review" | "done">("upload");
  const [text, setText] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [count, setCount] = useState(0);
  const ready = rows.filter((r) => r.st?.k === "ok").length;
  const parse = (t: string) => t.split(/\r?\n/).map((l) => l.trim()).filter(Boolean).filter((l) => !/^\s*(first[\s_]*name|name)\s*,/i.test(l))
    .map((l) => { const c = l.split(",").map((x) => x.trim()); if (c.length <= 3) { const [f, ...rest] = (c[0] || "").split(" "); return { first: f, last: rest.join(" "), email: c[1] || "", role: c[2] || "" }; } return { first: c[0], last: c[1], email: c[2], role: c[3] }; });
  const setCell = (i: number, k: keyof Row, v: string) => setRows((rs) => validate(rs.map((r, j) => (j === i ? { ...r, [k]: v } : r))));
  const idx = step === "upload" ? 0 : step === "review" ? 1 : 2;
  return (
    <Page>
      <PageHeader back="/admin/users/all/" title="Bulk Import" desc="Add many users at once from a CSV file." />
      <div className={s.steps}>
        {["Upload", "Review", "Done"].map((t, i) => (
          <span key={t} className={s.step}>
            {i > 0 && <span className={s.stepLine} />}
            <span className={`${s.disc} ${i < idx ? s.done : i === idx ? s.now : ""} t-label`}>{i + 1}</span>
            <Text role="body" as="span" ink={i <= idx ? "primary" : "secondary"}>{t}</Text>
          </span>
        ))}
      </div>
      {step === "upload" && (
        <Section>
          <div className={s.up}>
            <label className={s.drop}>
              <span className={s.dropIc}><Icon name="upload" /></span>
              <Text role="h4" as="span">Choose a CSV file</Text>
              <Text role="desc" as="span">Click to browse. Columns: first_name, last_name, email, role.</Text>
              <input type="file" accept=".csv,text/csv" hidden onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; const r = parse(await f.text()); if (r.length) { setRows(validate(r)); setStep("review"); } }} />
            </label>
            <div className={s.row}>
              <Button kind="ghost" size="sm" icon="download" onClick={() => toast("Template downloaded (first_name, last_name, email, role)")}>Download template</Button>
              <Button kind="ghost" size="sm" onClick={() => { setRows(validate(SAMPLE)); setStep("review"); }}>Load sample data</Button>
            </div>
            <div className={s.rule} />
            <Text role="h4" as="h3">Or paste CSV rows</Text>
            <TextArea rows={4} value={text} onChange={(e) => setText(e.target.value)} placeholder={"first_name,last_name,email,role\nMax,Lee,max@example.com,agent"} />
            <Text role="desc" as="p">Accepted roles: {IMP_ROLES.join(", ")}.</Text>
            <div className={s.end}><Button kind="primary" go disabled={!text.trim()} onClick={() => { const r = parse(text); if (!r.length) { toast("Nothing to parse — paste rows or load the sample", "warn"); return; } setRows(validate(r)); setStep("review"); }}>Parse rows</Button></div>
          </div>
        </Section>
      )}
      {step === "review" && (
        <Section>
          <div className={s.wrap}>
            <table className={s.imp}>
              <thead><tr>{["Sr. #", "First name", "Last name", "Email", "Role", "Status"].map((h) => <th key={h} className="t-compact w-strong">{h}</th>)}</tr></thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i}>
                    <td><Text role="caption" as="span">{i + 1}</Text></td>
                    <td><input className={s.cell} value={r.first} onChange={(e) => setCell(i, "first", e.target.value)} aria-label={`Row ${i + 1} first name`} /></td>
                    <td><input className={s.cell} value={r.last} onChange={(e) => setCell(i, "last", e.target.value)} aria-label={`Row ${i + 1} last name`} /></td>
                    <td><input className={s.cell} value={r.email} onChange={(e) => setCell(i, "email", e.target.value)} aria-label={`Row ${i + 1} email`} /></td>
                    <td><Dropdown variant="form" placeholder="Choose role…" value={IMP_ROLES.includes(r.role.toLowerCase()) ? r.role.toLowerCase() : undefined} onChange={(v) => setCell(i, "role", v)} options={IMP_ROLES.map((k) => ({ value: k, label: ROLE_BY_K[k]?.name ?? k }))} /></td>
                    <td><span className={r.st?.k === "ok" ? s.ok : r.st?.k === "warn" ? s.warnT : s.err}>{r.st?.t}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={s.between}>
            <Button kind="ghost" icon="arrowLeft" onClick={() => setStep("upload")}>Previous Step</Button>
            <Button kind="primary" go disabled={!ready} onClick={() => {
              const ok = rows.filter((r) => r.st?.k === "ok");
              commit(() => ok.forEach((r) => { const role = r.role.trim().toLowerCase(), intl = role !== "agent"; USERS.push({ id: `u${Date.now()}${r.email}`, name: `${r.first.trim()} ${r.last.trim()}`, email: r.email.trim(), roles: [role], level: "—", status: intl ? "invited" : "active", joined: "today", last: intl ? "Never" : "invited", ...(intl ? { internal: true } : {}) }); }));
              setCount(ok.length); setStep("done");
            }}>{`Import ${ready} user${ready === 1 ? "" : "s"}`}</Button>
          </div>
        </Section>
      )}
      {step === "done" && (
        <Section>
          <div className={s.doneB}>
            <span className={s.doneMk}><Icon name="check" /></span>
            <Text role="h3" as="h3">Imported {count} user{count === 1 ? "" : "s"}</Text>
            <Text role="desc" as="p">Users have been successfully added to the platform.</Text>
            <div className={s.row}>
              <Button kind="secondary" href="/admin/users/all/">View all users</Button>
              <Button kind="primary" icon="upload" onClick={() => { setRows([]); setText(""); setStep("upload"); }}>Import more users</Button>
            </div>
          </div>
        </Section>
      )}
    </Page>
  );
}
