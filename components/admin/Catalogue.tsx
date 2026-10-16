"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Chips, Chip } from "../ui/Chip";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Page, PageHeader, Section, SectionHeader, Stack, Text } from "../primitives";
import { Table, Status, RowMenu, BulkBar, type RowAction } from "../ui/Table";
import { Facts, Fact } from "../ui/Figures";
import { Tabs } from "../ui/Tabs";
import { Accordion } from "../ui/Accordion";
import { Button } from "../ui/Button";
import { Dropdown } from "../ui/Dropdown";
import { Search, Toolbar, Field, Input, TextArea } from "../ui/Field";
import { Slider } from "../ui/Slider";
import { Sheet } from "../ui/Sheet";
import { Confirm } from "../ui/Confirm";
import { Icon } from "../Icon";
import { commit, useStore } from "@/lib/store";
import { RAW, COURSES, money } from "@/data/admin";
import s from "./admin.module.css";
import l from "./levelling.module.css";
import c from "./catalogue.module.css";
import lv from "../candidate/level.module.css";

/* ============================================================
   COURSE CATALOGUE — Phase 1 cohortsCatalogue / cohortsCourseDetail /
   KINDS.course (Epic 7.1). Track, levels and intent are what Tal reads
   when it recommends a course; they never gate enrolment.
   CUT (G8): every cohort line — a course never makes a cohort.
   ============================================================ */
const INTENTS: [string, string][] = RAW.INTENTS;
const intentName = (k: string) => INTENTS.find(([v]) => v === k)?.[1] ?? "—";
const STATUS: Record<string, [ "green" | "warn" | "plain", string]> = { live: ["green", "Live"], draft: ["warn", "Draft"], archived: ["plain", "Archived"] };
const TRACK_LEVELS: Record<string, string[]> = { Explorer: ["E1", "E2", "E3", "E4", "E5"], Builder: ["B1", "B2", "B3", "B4", "B5"] };
const cover = (x: any) => { const k = String(x.levels?.[0] || "").toLowerCase(); return `/images/covers/cohort-art-${["e1", "e2", "e3"].includes(k) ? k : "e3"}.webp`; };
const CH: [string, number][] = RAW.COURSE_CH;
const SYL: { learn: string[]; skills: string[] }[] = RAW.COURSE_SYL;
type CSheet = null | { k: "new" } | { k: "edit"; id: string } | { k: "price"; id: string } | { k: "status"; id: string; to: string } | { k: "del"; ids: string[] } | { k: "bulkarch"; ids: string[] };

export function AdminCatalogue() {
  useStore();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [st, setSt] = useState("all"), [track, setTrack] = useState("all"), [intent, setIntent] = useState("all");
  const [sel, setSel] = useState<string[]>([]);
  const [sheet, setSheet] = useState<CSheet>(null);
  const ql = q.toLowerCase();
  const base = COURSES.filter((x) => track === "all" || x.track === track).filter((x) => intent === "all" || x.intent === intent).filter((x) => !q || x.name.toLowerCase().includes(ql));
  const rows = base.filter((x) => st === "all" || x.status === st);
  const acts = (x: any) => courseActs(x, setSheet, (h) => router.push(h), true);
  const bulk = sel.length === 1
    ? acts(COURSES.find((x) => x.id === sel[0])).filter((a) => a.label !== "View" && a.label !== "Change price")
    : [{ icon: "locked" as const, label: "Archive All", onClick: () => setSheet({ k: "bulkarch", ids: sel }) }, { icon: "delete" as const, label: "Delete All", onClick: () => setSheet({ k: "del", ids: sel }) }];
  return (
    <Page>
      <PageHeader title="Course catalogue" desc="The courses candidates can enrol on, the chapter count each runs over, and the track, levels and intents Tal recommends them for."
        actions={<Button kind="primary" size="sm" icon="add" onClick={() => setSheet({ k: "new" })}>Add Course</Button>} />
      <Section kind="tabs">
        <Tabs value={st} onChange={setSt} items={[["all", "All"], ["live", "Live"], ["draft", "Draft"], ["archived", "Archived"]].map(([k, label]) => ({ key: k, label, count: base.filter((x) => k === "all" || x.status === k).length }))} />
      </Section>
      <Section kind="block">
        <Toolbar search={<Search value={q} onChange={setQ} placeholder="Search courses" />}
          filters={<>
            <Dropdown label="Track" value={track} onChange={setTrack} options={[{ value: "all", label: "All tracks" }, { value: "Explorer", label: "Explorer" }, { value: "Builder", label: "Builder" }]} />
            <Dropdown label="Intent" value={intent} onChange={setIntent} options={[{ value: "all", label: "All intents" }, ...INTENTS.map(([value, label]) => ({ value, label }))]} />
          </>} />
        {rows.length ? (
          <Table rows={rows} rowKey={(x) => x.id} href={(x) => `/admin/catalogue/${x.id}/`} actions={acts} selected={sel} onSelect={setSel} cols={[
            { key: "n", label: "Course", cell: (x) => x.name },
            { key: "t", label: "Track", cell: (x) => x.track },
            { key: "l", label: "Levels", cell: (x) => (x.levels || []).join(", ") },
            { key: "i", label: "Intent", cell: (x) => intentName(x.intent) },
            { key: "s", label: "Status", cell: (x) => <Status tone={STATUS[x.status][0]}>{STATUS[x.status][1]}</Status> },
            { key: "d", label: "Length", cell: (x) => `${x.days || 90} days` },
            { key: "c", label: "Chapters", right: true, cell: (x) => String(x.chapters) },
            { key: "p", label: "Price", right: true, cell: (x) => money(x.price) },
          ]} />
        ) : <div className={s.empty}><Icon name="book" /><Text role="h4" as="span">No courses match</Text><Text role="desc" as="span">Nothing in this filter yet.</Text></div>}
        <BulkBar count={sel.length} actions={bulk} onClear={() => setSel([])} />
      </Section>
      <CourseSheets sheet={sheet} close={() => setSheet(null)} after={() => setSel([])} />
    </Page>
  );
}

function courseActs(x: any, open: (s: CSheet) => void, go: (h: string) => void, view: boolean): RowAction[] {
  return [
    ...(view ? [{ icon: "view" as const, label: "View", onClick: () => go(`/admin/catalogue/${x.id}/`) }] : []),
    { icon: "edit", label: "Edit", onClick: () => open({ k: "edit", id: x.id }) },
    { icon: "wallet", label: "Change price", onClick: () => open({ k: "price", id: x.id }) },
    x.status === "draft"
      ? { icon: "launch", label: "Publish", onClick: () => open({ k: "status", id: x.id, to: "live" }) }
      : x.status === "archived" ? { icon: "renew", label: "Restore", onClick: () => open({ k: "status", id: x.id, to: "live" }) }
      : { icon: "locked", label: "Archive", onClick: () => open({ k: "status", id: x.id, to: "archived" }) },
    { icon: "delete", label: view ? "Delete" : "Delete Course", danger: true, onClick: () => open({ k: "del", ids: [x.id] }) },
  ];
}

/* ---------------- One course ---------------- */
export function AdminCourse({ id }: { id: string }) {
  useStore();
  const router = useRouter();
  const [sheet, setSheet] = useState<CSheet>(null);
  const x = COURSES.find((v) => v.id === id);
  if (!x) return null;
  return (
    <Page>
      <PageHeader back="/admin/catalogue/" title="Course details" desc="The course record, its price and status, and its chapter outline." />
      <Section kind="block">
        <div className={c.head}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={c.cover} src={cover(x)} alt="" />
          <span className={c.headB}>
            <Text role="sec" as="span">{x.name}</Text>
            <Text role="desc" as="span">{x.track} · {(x.levels || []).join(", ")}</Text>
          </span>
          <span className={s.headAct}><Status tone={STATUS[x.status][0]}>{STATUS[x.status][1]}</Status><RowMenu items={courseActs(x, setSheet, router.push, false)} /></span>
        </div>
        <Facts>
          <Fact icon="flag" label="Track" value={x.track} />
          <Fact icon="growth" label="Levels" value={(x.levels || []).join(", ")} />
          <Fact icon="idea" label="Intent" value={intentName(x.intent)} />
          <Fact icon="time" label="Length" value={`${x.days || 90} days`} />
          <Fact icon="book" label="Chapters" value={String(x.chapters)} />
          <Fact icon="launch" label="Learning platform" value={x.lsvt || "—"} />
          <Fact icon="wallet" label="Price" value={money(x.price)} />
          <Fact icon="checkOutline" label="Status" value={<Status tone={STATUS[x.status][0]}>{STATUS[x.status][1]}</Status>} />
        </Facts>
      </Section>
      <Section>
        <SectionHeader title="Description" />
        <Text role="desc" as="p">{x.desc}</Text>
      </Section>
      <Section>
        <SectionHeader title="Course Outline" />
        <Accordion items={CH.map(([title, min], i) => ({
          title, sub: `Chapter ${i + 1} · ${min} min`,
          body: <>
            <Text role="h4" as="p">What you’ll learn</Text>
            <ul className={lv.learn}>{SYL[i].learn.map((t) => <li key={t}><Icon name="checkOutline" /><Text role="body" as="span" ink="secondary">{t}</Text></li>)}</ul>
            <Text role="h4" as="p">Skills you’ll gain</Text>
            <div className={lv.skills}><Chips>{SYL[i].skills.map((t) => <Chip key={t}>{t}</Chip>)}</Chips></div>
          </>,
        }))} />
      </Section>
      <CourseSheets sheet={sheet} close={() => setSheet(null)} after={(gone) => gone && router.push("/admin/catalogue/")} />
    </Page>
  );
}

/* ---------------- Sheets ---------------- */
function CourseSheets({ sheet, close, after }: { sheet: CSheet; close: () => void; after?: (gone?: boolean) => void }) {
  if (!sheet) return null;
  if (sheet.k === "new" || sheet.k === "edit") return <CourseForm id={sheet.k === "edit" ? sheet.id : undefined} close={close} />;
  if (sheet.k === "price") return <PriceSheet id={sheet.id} close={close} />;
  if (sheet.k === "status") {
    const x = COURSES.find((v) => v.id === sheet.id)!;
    const verb = sheet.to === "archived" ? "Archive" : x.status === "draft" ? "Publish" : "Restore";
    return <Confirm icon={sheet.to === "archived" ? "locked" : "launch"} title={`${verb} ${x.name}?`} ok={verb}
      desc={sheet.to === "archived" ? "It closes to new enrolments. Candidates already on it keep their place." : "Candidates can enrol on it, and Tal can recommend it."}
      onCancel={close} onOk={() => { commit(() => { x.status = sheet.to; }, `${x.name} ${sheet.to === "archived" ? "archived" : "is live"}`); close(); }} />;
  }
  if (sheet.k === "bulkarch") {
    return <Confirm icon="locked" title={`Archive ${sheet.ids.length} courses?`} ok="Archive All" desc="They close to new enrolments. Candidates already on them keep their place."
      onCancel={close} onOk={() => { commit(() => sheet.ids.forEach((i) => { const x = COURSES.find((v) => v.id === i); if (x) x.status = "archived"; }), `${sheet.ids.length} courses archived`); close(); after?.(); }} />;
  }
  const n = sheet.ids.length, one = n === 1 ? COURSES.find((v) => v.id === sheet.ids[0]) : null;
  return <Confirm icon="delete" danger title={one ? `Delete ${one.name}?` : `Delete ${n} courses?`} ok={n === 1 ? "Delete" : "Delete All"}
    desc="It leaves the catalogue for good. This can’t be undone."
    onCancel={close} onOk={() => { commit(() => sheet.ids.forEach((i) => { const k = COURSES.findIndex((v) => v.id === i); if (k >= 0) COURSES.splice(k, 1); }), n === 1 ? `${one?.name} deleted` : `${n} courses deleted`); close(); after?.(true); }} />;
}

/* Add / edit a course (Phase 1 KINDS.course). Price is set on create; on
   edit it is read-only and changes through "Change price" (step-up). */
function CourseForm({ id, close }: { id?: string; close: () => void }) {
  const x = id ? COURSES.find((v) => v.id === id) : null;
  const [f, setF] = useState({ name: x?.name ?? "", desc: x?.desc ?? "", track: x?.track ?? "", levels: (x?.levels ?? []) as string[], intent: x?.intent ?? "",
    chapters: String(x?.chapters ?? ""), lsvt: x?.lsvt ?? "", price: String(x?.price ?? ""), status: x?.status === "live" ? "live" : "draft" });
  const set = (k: string, v: any) => setF((o) => ({ ...o, [k]: v }));
  const ch = Number(f.chapters);
  const taken = COURSES.some((v) => v.name.toLowerCase() === f.name.trim().toLowerCase() && v.id !== id);
  const ok = f.name.trim() && !taken && f.desc.trim() && f.track && f.levels.length && f.intent && ch >= 1 && ch <= 90 && f.lsvt && (x || f.price !== "");
  const save = () => {
    commit(() => {
      const rec = { name: f.name.trim(), desc: f.desc.trim(), track: f.track, levels: f.levels, intent: f.intent, chapters: ch, lsvt: f.lsvt, status: f.status };
      if (x) Object.assign(x, rec);
      else COURSES.unshift({ id: `co${Date.now()}`, ...rec, price: Number(f.price), days: 90 });
    }, x ? `${f.name.trim()} updated` : `${f.name.trim()} added`);
    close();
  };
  return (
    <Slider open title={x ? `Edit ${x.name}` : "Add a course"} onClose={close}
      footer={<><Button kind="secondary" onClick={close}>Cancel</Button><Button kind="primary" disabled={!ok} onClick={save}>{x ? "Save Changes" : "Add Course"}</Button></>}>
      <Stack gap={6}>
        <Field label="Course name" required error={taken ? "A course with this name already exists." : undefined}><Input value={f.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Foundations of Leadership" /></Field>
        <Field label="Description" required help="Tal reads this description when it chooses which course to recommend."><TextArea rows={4} value={f.desc} onChange={(e) => set("desc", e.target.value)} placeholder="What the course teaches and what it is for" /></Field>
        <Field label="Track" required>
          <Dropdown variant="form" placeholder="Choose a track" value={f.track || undefined} onChange={(v) => setF((o) => ({ ...o, track: v, levels: [] }))} options={["Explorer", "Builder"].map((v) => ({ value: v, label: v }))} />
        </Field>
        <Field group label="Levels" required help={f.track ? "Pick the levels this course suits. They need not be next to each other." : "Choose a track first."}>
          <div className={l.pick}>
            {(TRACK_LEVELS[f.track] || []).map((k) => {
              const on = f.levels.includes(k);
              return <button key={k} type="button" aria-pressed={on} className={`${l.chip} ${on ? l.on : ""} t-label`} onClick={() => set("levels", on ? f.levels.filter((v) => v !== k) : [...f.levels, k])}><b>{k}</b></button>;
            })}
          </div>
        </Field>
        <Field label="Intent" required>
          <Dropdown variant="form" placeholder="Choose an intent" value={f.intent || undefined} onChange={(v) => set("intent", v)} options={INTENTS.map(([value, label]) => ({ value, label }))} />
        </Field>
        <Field label="Length"><Input value="90 days" readOnly /></Field>
        <Field label="Chapter count" required help={ch >= 1 && ch <= 90 ? `90 days over ${ch} chapters, about ${(90 / ch).toFixed(1)} days per chapter.` : "Between 1 and 90."}>
          <Input inputMode="numeric" value={f.chapters} onChange={(e) => set("chapters", e.target.value.replace(/\D/g, ""))} placeholder="e.g. 12" />
        </Field>
        <Field label="LightSpeedVT Courses" required>
          <Dropdown variant="form" placeholder="Choose a LightSpeedVT course" value={f.lsvt || undefined} onChange={(v) => set("lsvt", v)} options={(RAW.LS_COURSES as string[]).map((n) => ({ value: `${n} (LSVT)`, label: n }))} />
        </Field>
        <Field label="Price ($)" required={!x} help={x ? "Change the price from the course’s menu. It needs a security code." : undefined}>
          <Input inputMode="numeric" value={x ? money(x.price) : f.price} readOnly={!!x} onChange={(e) => set("price", e.target.value.replace(/\D/g, ""))} placeholder="e.g. 690" />
        </Field>
        <Field group label="Status" required>
          <div className={l.pick}>
            {[["draft", "Draft"], ["live", "Live"]].map(([k, label]) => (
              <button key={k} type="button" aria-pressed={f.status === k} className={`${l.chip} ${f.status === k ? l.on : ""} t-label`} onClick={() => set("status", k)}>{label}</button>
            ))}
          </div>
        </Field>
      </Stack>
    </Slider>
  );
}

/* Change price: the new price and a reason, then a step-up confirmation. */
function PriceSheet({ id, close }: { id: string; close: () => void }) {
  const x = COURSES.find((v) => v.id === id)!;
  const [price, setPrice] = useState(String(x.price)), [why, setWhy] = useState(""), [ask, setAsk] = useState(false);
  if (ask) {
    return <Confirm icon="warning" stepup title={`Change ${x.name} price?`} ok="Change Price"
      desc={`New enrolments will be charged ${money(Number(price))}. ${money(x.price)} → ${money(Number(price))}.`}
      onCancel={close} onOk={() => { commit(() => { x.price = Number(price); }, `${x.name} price changed`); close(); }} />;
  }
  return (
    <Sheet title={`Change price — ${x.name}`} onClose={close}
      footer={<><Button kind="secondary" onClick={close}>Cancel</Button><Button kind="primary" disabled={!price || Number(price) === x.price || !why.trim()} onClick={() => setAsk(true)}>Continue</Button></>}>
      <Stack gap={6}>
        <Field label="New price ($)" required><Input inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value.replace(/\D/g, ""))} /></Field>
        <Field label="Reason" required><TextArea rows={3} value={why} onChange={(e) => setWhy(e.target.value)} placeholder="Why the price is changing" /></Field>
        <Text role="desc" as="p">Changing a price needs a fresh security code (step-up) and applies to new enrolments only.</Text>
      </Stack>
    </Sheet>
  );
}
