"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Page, PageHeader, Section, SectionHeader, Text, Stack } from "../primitives";
import { DarkCard } from "../ui/DarkCard";
import { When } from "../ui/CallRow";
import { Tabs } from "../ui/Tabs";
import { PersonRow, PersonList } from "../ui/PersonRow";
import { Table } from "../ui/Table";
import { KV } from "../ui/KV";
import { Stats, Stat } from "../ui/Figures";
import { Button } from "../ui/Button";
import { Confirm } from "../ui/Confirm";
import { Modal } from "../ui/Modal";
import { Dropdown } from "../ui/Dropdown";
import { Field, TextArea } from "../ui/Field";
import { Disclosure, HowItWorks } from "../ui/Disclosure";
import { Icon } from "../Icon";
import { NextCall } from "./Dashboard";
import {
  AGENT as A, IVS, PHOTO, PAST_COUNT, TX, TX_TAGS, LVL_CODES, TALENT, CANCEL_REASONS,
  ivById, first, dayDate, relDay, schedDay, daysOut, kindLabel, levelLine, lvlName, lvlCode, type Iv,
} from "@/data/agent";
import s from "./agent.module.css";

const BASE = "/agent/interviews";

/* ============================================================
   INTERVIEWS — Phase 1 V.interviews: Upcoming / Pending Recommendations /
   Past Interviews. CUT (client, 15 Sep 2026): the New Requests tab and
   accept/decline (a paid booking is a commitment).
   ============================================================ */
export function AgentInterviews() {
  const [tab, setTab] = useState("next");
  useEffect(() => {
    const t = new URLSearchParams(location.search).get("tab");
    if (t === "next" || t === "eval" || t === "done") setTab(t);
  }, []);
  const next = IVS.filter((x) => x.st === "next");
  const report = IVS.filter((x) => x.st === "report");
  const past = IVS.filter((x) => x.st === "report" || x.st === "done");
  return (
    <Page>
      <PageHeader title="Interviews" desc="Your upcoming interviews, the recommendations still to send, and past interviews." />
      <Section kind="tabs">
        <Tabs value={tab} onChange={setTab} items={[
          { key: "next", label: "Upcoming", count: next.length },
          { key: "eval", label: "Pending Recommendations", count: report.length },
          { key: "done", label: "Past Interviews", count: PAST_COUNT },
        ]} />
      </Section>
      {tab === "next" && (
        <>
          <DarkCard title="Your Next Interview" slot={<When>{relDay(next[0].day)} · {next[0].time}</When>}>
            <NextCall id={next[0].id} />
          </DarkCard>
          <Section kind="block">
            <SectionHeader title="Your Schedule" actions={<Button kind="ghost" size="sm" href="/agent/availability/">Availability</Button>} />
            <PersonList>
              {next.slice(1).map((x) => (
                <PersonRow key={x.id} href={`${BASE}/${x.id}/`} img={PHOTO[x.id]} name={x.n}
                  day={schedDay(x.day)} time={x.time}
                  lines={x.kind === "Re-interview"
                    ? ["Re-interview · 45 minutes · Recorded"]
                    : [`First Interview · 45 minutes · Recorded · $${A.fee} already paid and held`]} />
              ))}
            </PersonList>
          </Section>
        </>
      )}
      {tab === "eval" && (
        <Section kind="block">
          <SectionHeader title="Pending Recommendations" />
          <PersonList>
            {report.map((x) => (
              <PersonRow key={x.id} roomy href={`${BASE}/${x.id}/`} img={PHOTO[x.id]} name={x.n}
                lines={[`${kindLabel(x)} · ${dayDate(x.day).replace("August", "Aug")}`]} />
            ))}
          </PersonList>
        </Section>
      )}
      {tab === "done" && <PastTable rows={past} />}
    </Page>
  );
}

function PastTable({ rows }: { rows: Iv[] }) {
  return (
    <Section kind="block">
      <SectionHeader title="Past Interviews" />
      {/* Read-only: a past interview opens no detail page (Maryam 16 Oct 2026). */}
      <Table rows={rows} rowKey={(x) => x.id} cols={[
        { key: "n", label: "Candidate", cell: (x) => x.n },
        { key: "d", label: "Interviewed", cell: (x) => dayDate(x.day) },
        { key: "l", label: "Level", cell: (x) => (x.st === "report" ? "Recording to confirm" : x.level) },
        { key: "f", label: "Follow-up", right: true, cell: (x) => (x.follow ?? "—") },
        { key: "p", label: "Depth", right: true, cell: (x) => (x.depth ?? "—") },
      ]} />
    </Section>
  );
}

/* ============================================================
   ONE INTERVIEW — upcoming (the call card + the brief), pending (the
   recommendation), or done (the outcome). Phase 1 V.interview.
   ============================================================ */
export function AgentInterview({ id }: { id: string }) {
  const x = ivById(id);
  if (!x) return null;
  if (x.st === "next") return <Upcoming x={x} />;
  if (x.st === "report") return <Recommend x={x} />;
  return <Done x={x} />;
}

const STEPS = [
  ["Review the Brief", "Take two minutes to review the candidate’s goals and assessment priorities."],
  ["Open the Room Early", "Join before the scheduled time. Recording starts when you both join, and the candidate is notified."],
  ["Submit Your Recommendation", "Tal drafts a recommendation from the transcript. Review it and submit your recommendation. TALENTnext determines the final level after analysis."],
] as const;

function Upcoming({ x }: { x: Iv }) {
  const [cancel, setCancel] = useState(false);
  const f = first(x.n);
  const level = x.kind === "First interview" ? levelLine(x) : (x.band ?? "").replace(", set ", " · Set ");
  return (
    <Page>
      <PageHeader back={`${BASE}/`} title={x.n} desc={`${x.kind} · ${x.day} · ${x.time}`} />
      <DarkCard title={`Upcoming ${x.kind === "First interview" ? "First Interview" : "Re-Interview"}`} slot={<When>{dayDate(x.day)} · {x.time}</When>}>
        <NextCall id={x.id} actions={
          <>
            <Button kind="onDark" icon="calendar" asIs>Add to Calendar</Button>
            <Button kind="onDark" onClick={() => setCancel(true)}>Cancel Interview</Button>
            <Button kind="accent" iconEnd="video" disabled>Join Call</Button>
          </>
        } />
      </DarkCard>
      <Section>
        <SectionHeader title="Candidate Brief" desc="Their priorities, in their own words." />
        <Text role="body" as="p" className={s.briefSub}>What {f} Wants to Focus On</Text>
        <KV rows={[
          ["Current Level", level],
          ["Assessment Areas", `${(x.asked ?? "").replace(", and ", " and ")}.`],
          ["Booking Status", `Booked · ${(x.paid ?? "").replace("Paid at booking, ", "Paid at booking on ")}`],
          ["Interview Fee", `$${A.fee}`],
          /* CUT (G8): "Cohort Leader Evaluation" and its 90-day summary sheet. */
        ]} />
      </Section>
      <Section tint>
        <Disclosure title="Before the Interview">
          <Text role="desc">Three steps to prepare. Sending your recommendation after the call releases your payout.</Text>
          <HowItWorks steps={STEPS} />
        </Disclosure>
      </Section>
      {cancel && <CancelSheet x={x} onClose={() => setCancel(false)} />}
    </Page>
  );
}

/* Cancel with a reason (13.5). Within 24 hours it is a late cancellation. */
function CancelSheet({ x, onClose }: { x: Iv; onClose: () => void }) {
  const router = useRouter();
  const [reason, setReason] = useState<string>();
  const out = daysOut(x.day);
  const when = out === 0 ? "Starts today" : out === 1 ? "Starts tomorrow" : `Starts in ${out} days`;
  return (
    <Modal label="Cancel this interview" onClose={onClose} footer={
      <>
        <Button kind="secondary" onClick={onClose}>Keep the Interview</Button>
        <Button kind="danger" disabled={!reason} onClick={() => { onClose(); router.push(`${BASE}/`); }}>Cancel Interview</Button>
      </>
    }>
      <Stack gap={5}>
        <Text role="h3">Cancel this interview</Text>
        <KV rows={[["Candidate", x.n], ["When", `${dayDate(x.day)} · ${x.time}`], ["Kind", x.kind], ["Starts", when]]} />
        {out <= 1 && <Text role="body" as="p" className={s.warn}><b>This is less than 24 hours away.</b> Late cancellations are counted against you and are seen at your review.</Text>}
        <Field label="Reason">
          <Dropdown variant="form" placeholder="Choose a reason" value={reason} onChange={setReason}
            options={CANCEL_REASONS.map((r) => ({ value: r, label: r }))} />
        </Field>
        <Field label={reason === "Other" ? "Anything else" : "Anything else (optional)"}>
          <TextArea rows={3} placeholder="Only TalentNext sees this. The candidate is told the reason in general terms only." />
        </Field>
        <Text role="desc">{first(x.n)} is refunded in full and told straight away, and the slot reopens so someone else can take the time.</Text>
      </Stack>
    </Modal>
  );
}

/* Tal's read: paragraphs with highlighted phrases (Phase 1 .tal-eval). */
export function Rich({ html, className }: { html: string; className?: string }) {
  const paras = html.split(/<\/?p[^>]*>/).map((p) => p.trim()).filter(Boolean);
  return (
    <div className={className}>
      {paras.map((p, i) => (
        <Text key={i} role="desc" as="p">
          {p.split(/(<b>.*?<\/b>)/).map((seg, j) => seg.startsWith("<b>") ? <b key={j}>{seg.slice(3, -4)}</b> : seg)}
        </Text>
      ))}
    </div>
  );
}

function Recommend({ x }: { x: Iv }) {
  const router = useRouter();
  const f = first(x.n);
  const pr = x.n === "Omar Sethi" || x.n === "Daniel Okafor" ? "him" : "her";
  const pos = pr === "him" ? "his" : "her";
  const talCode = lvlCode(x.talLevel);
  const [pick, setPick] = useState(talCode);
  const [letters, setLetters] = useState<string[]>(x.talType ? ["l"] : []);
  const [confirm, setConfirm] = useState<null | "send" | "draft">(null);
  const diff = LVL_CODES.indexOf(pick) - LVL_CODES.indexOf(talCode);
  return (
    <Page>
      <PageHeader back={`${BASE}/?tab=eval`} title={x.n} desc={`${x.kind} · ${x.day} · ${x.time}`} />
      <Section kind="block" noline>
        <SectionHeader title="The Interview" />
        <Stats>
          <Stat icon="calendar" label="Held" desc={`${dayDate(x.day).replace("August", "Aug")} · ${x.time}`} />
          <Stat icon="time" label="Total Duration" desc="48 min" />
          <Stat icon="document" label="Transcript" desc={<Link className={s.statLink} href={`${BASE}/${x.id}/transcript/`}>Ready<Icon name="arrowRight" /></Link>} />
          <Stat icon="video" label="Recording" desc="Ready for recommendation" />
        </Stats>
      </Section>
      <Section>
        <SectionHeader title="Interview recording" />
        <Link href={`${BASE}/${x.id}/transcript/`} className={s.rec}>
          <span className={s.recThumb} />
          <span className={s.recB}>
            <Text role="body" as="span">Interview with {x.n}.mp4</Text>
            <Text role="desc" as="span">Video recording · 48:00</Text>
          </span>
          <span className={s.recOpen}><Icon name="play" /></span>
        </Link>
      </Section>
      <Section>
        <SectionHeader title="Tal’s Recommendation" />
        <div className={s.talEval}>
          <Rich html={x.talEval ?? ""} />
          {x.talType && <Text role="desc" as="p">Tal identifies {f} as a <b>{x.talType}</b>.</Text>}
        </div>
      </Section>
      <Section>
        <SectionHeader title="Your Recommendation" />
        <div className={s.evalForm}>
          <Text role="compact" as="p" className={s.evalLede}>Tal suggests <b>{x.talLevel}</b> based on the transcript. Select the level you would recommend for {f} across the 15 rungs and the TALENT letters that best describe {pr}. TALENTnext will determine {pos} final level after analysis.</Text>
          <div>
            <Text role="label" as="span" strong ink="primary" className={s.lbl}>Your suggested level</Text>
            <div className={s.ladder} role="radiogroup" aria-label="Your suggested level">
              {LVL_CODES.map((c, i) => (
                <button key={c} type="button" role="radio" aria-checked={c === pick} aria-label={lvlName(c)}
                  className={i < LVL_CODES.indexOf(pick) ? s.done : c === pick ? s.on : ""} onClick={() => setPick(c)}>
                  <b>{c}</b>
                </button>
              ))}
            </div>
            <div className={s.ladderLab}><span>Explorer</span><span>Builder</span><span>Trailblazer</span></div>
            {diff !== 0 && (
              <Text role="desc" as="p" className={s.diverge}>This is <b>{Math.abs(diff)} rung{Math.abs(diff) > 1 ? "s" : ""} {diff > 0 ? "higher" : "lower"}</b> than Tal&apos;s suggestion. The difference and your reason are recorded for the reviewer.</Text>
            )}
          </div>
          <div>
            <Text role="label" as="span" strong ink="primary" className={s.lbl}>TALENT Letters</Text>
            <div className={s.ltrs}>
              {TALENT.map((t) => (
                <button key={t.k} type="button" aria-pressed={letters.includes(t.k)}
                  className={`${s.ltr} ${letters.includes(t.k) ? s.on : ""}`}
                  onClick={() => setLetters((l) => l.includes(t.k) ? l.filter((k) => k !== t.k) : [...l, t.k])}>
                  <span className={s.ltrC}>{t.c}</span><span>— {t.n}</span>
                </button>
              ))}
            </div>
          </div>
          <Field label="Why This Level?"><TextArea rows={3} defaultValue={x.seedWhy} /></Field>
          {diff !== 0 && <Field label={`Why not ${x.talLevel}`}><TextArea rows={3} /></Field>}
          <Field label="Strengths"><TextArea rows={3} defaultValue={x.seedStrength} /></Field>
          <Field label="Growth Areas"><TextArea rows={3} defaultValue={x.seedGrowth} /></Field>
          <Field label={`Additional Notes About ${f} (Optional)`}><TextArea rows={3} /></Field>
        </div>
      </Section>
      {/* The action row is a block: no divider above it (Maryam 16 Oct 2026). */}
      <Section kind="block" noline>
        <Stack row gap={3}>
          <Button kind="ghost" onClick={() => setConfirm("draft")}>Save Draft</Button>
          <Button kind="primary" onClick={() => setConfirm("send")}>Send Recommendation</Button>
        </Stack>
      </Section>
      {confirm === "send" && (
        <Confirm icon="send" title="Send this recommendation?" ok="Send Recommendation"
          desc="Your proposed level and TALENT letters go to a reviewer, who has 24 hours to approve them. You cannot change them after sending. This files your report and releases your payout three working days after the call."
          onCancel={() => setConfirm(null)} onOk={() => { setConfirm(null); router.push(`${BASE}/`); }} />
      )}
      {confirm === "draft" && (
        <Confirm icon="checkOutline" title="Draft saved" ok="Done"
          desc="Your evaluation is saved and visible only to you. The interview stays in Evaluations and your payout stays blocked until you send it."
          onCancel={() => setConfirm(null)} onOk={() => setConfirm(null)} />
      )}
    </Page>
  );
}

function Done({ x }: { x: Iv }) {
  return (
    <Page>
      <PageHeader back={`${BASE}/?tab=done`} title={x.n} desc={`${x.kind} · ${x.day} · ${x.time}`} />
      <Section>
        <SectionHeader title="The outcome" />
        <KV rows={[
          ["Level set by TalentNext", x.level], ["Recording confirmed", x.signed],
          ["Follow-up scored", String(x.follow)], ["Depth scored", String(x.depth)],
        ]} />
      </Section>
      <Section>
        <SectionHeader title="The recording" desc={`Confirmed ${x.signed} · ${x.level}`}
          actions={<Button kind="ghost" size="sm" href={`${BASE}/${x.id}/transcript/`}>Transcript</Button>} />
        <Text role="body" as="p" ink="secondary">{x.n}&apos;s level was set by TalentNext at {x.level} from the transcript. You ran the interview and confirmed the recording; the level decision was not yours to make.</Text>
      </Section>
      <Section>
        <SectionHeader title="The fee" />
        <KV rows={[["Candidate paid", `$${A.fee}`], ["TalentNext kept", `$${A.cut}`], ["Your share", `$${A.share}`], ["Status", x.money]]} />
      </Section>
    </Page>
  );
}

/* ============================================================
   THE TRANSCRIPT — Phase 1 V.transcript (§124): search, topic chips,
   the lines; a marked scene carries its tag.
   ============================================================ */
export function AgentTranscript({ id }: { id: string }) {
  const x = ivById(id);
  const [f, setF] = useState("all");
  const [q, setQ] = useState("");
  if (!x) return null;
  const them = first(x.n);
  const lines = TX.filter(([, , text, tag, scene]) =>
    (f === "all" || (f === "scene" ? scene : tag === f)) && (!q || text.toLowerCase().includes(q.toLowerCase())));
  return (
    <Page>
      <PageHeader back={`${BASE}/${x.id}/`} title="Interview Transcript" desc={`${x.n} · ${dayDate(x.day)} · ${x.time}`} />
      <Section>
        <label className={s.txSrch}>
          <Icon name="search" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a word in the transcript" aria-label="Find a word in the transcript" />
        </label>
        <div className={s.txFilters}>
          {TX_TAGS.map(([k, l]) => (
            <button key={k} type="button" className={`${s.txF} ${f === k ? s.on : ""} t-caption`} aria-pressed={f === k} onClick={() => setF(k)}>{l}</button>
          ))}
        </div>
        <div>
          {lines.map(([t, who, text, , scene]) => (
            <div key={t} className={`${s.txLine} ${who === "you" ? s.me : ""}`}>
              <Text role="caption" as="span">{t}</Text>
              <div className={s.txB}>
                <Text role="label" as="span" strong className={s.txW}>
                  {who === "you" ? "You" : them}
                  {scene && <span className={`${s.txScene} t-caption`}><Icon name="video" />Marked scene</span>}
                </Text>
                <Text role="body" as="p">{text}</Text>
              </div>
            </div>
          ))}
          {lines.length === 0 && <Text role="desc">Nothing in this transcript matches.</Text>}
        </div>
      </Section>
    </Page>
  );
}

