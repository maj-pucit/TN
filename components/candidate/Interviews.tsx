"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { Page, PageHeader, Section, SectionHeader, Stack, Text } from "../primitives";
import { DarkCard } from "../ui/DarkCard";
import { Button } from "../ui/Button";
import { Dialog } from "../ui/Dialog";
import { FreeFee } from "../ui/Fee";
import { Disclosure, HowItWorks } from "../ui/Disclosure";
import { CardPicker, PayModal } from "../ui/CardPicker";
import { LevelCard } from "./LevelCard";
import { Field, TextArea } from "../ui/Field";
import { Icon } from "../Icon";
import { useDemo } from "@/lib/demo";
import { atLeast } from "@/lib/demo";
import { AGENTS, HOW_IT_WORKS, PAST, REPORT, SAVED_CARDS, SCENES, SCENES_PRICE, SCENE_STILL, SHARE_NETS, agentByKey, isReinterview, type Agent } from "@/data/interviews";
import { CallRow, When } from "./CallRow";
import s from "./interviews.module.css";

const BASE = "/candidate/interviews";
/* Where "Book" goes: a re-interview pays first (checkout), a first interview
   is complimentary and goes straight to the calendar (Phase 1, 13 Oct 2026). */
export const bookHref = (stage: string, key = "priya") =>
  `${BASE}/${isReinterview(stage) ? "checkout" : "book"}/${key}/`;

/* ============================================================
   /candidate/interviews/ — the module page. Phase 1 V.interviews, stage
   by stage: the agents table (before a booking, and again for the
   re-interview), the scheduled card (booked), the held tile, past
   interviews, and "How It Works" on every stage.
   ============================================================ */
export function InterviewsHome() {
  const { stage } = useDemo();
  const booked = stage === "booked" || stage === "resched";
  const choosing = stage === "new" || stage === "day90";
  const past = PAST[stage] ?? [];
  return (
    <Page>
      <PageHeader title="Interviews" desc="Your interviews with talent agents, past and upcoming, and how a session works." />
      {booked && (
        <DarkCard title="Scheduled" slot={<When>{stage === "resched" ? "In 2 days" : "In 5 minutes"}</When>}>
          <CallRow action={<Stack row gap={3}>
            <Button kind="secondary" icon="calendar" href={`${BASE}/book/priya/`}>Reschedule</Button>
            <Button kind="accent" go disabled>Join call</Button>
          </Stack>} />
        </DarkCard>
      )}
      {stage === "held" && (
        <Section kind="block">
          <div className={s.tile}>
            <Text role="h3">Interview Held</Text>
            <Text role="body">Your interview is being analysed. TALENTnext will assign your level and notify you when your report is ready, within 24 hours.</Text>
          </div>
        </Section>
      )}
      {choosing && (
        <Section kind="block">
          <SectionHeader title="Choose Your Interview Agent" desc="Select an agent to conduct your interview." />
          <AgentsTable />
        </Section>
      )}
      {past.length > 0 && (
        <Section>
          <SectionHeader title="Past interviews" />
          <PastList items={past} />
        </Section>
      )}
      <Section>
        <Disclosure title="How It Works"><HowItWorks {...HOW_IT_WORKS} /></Disclosure>
      </Section>
    </Page>
  );
}

/* /candidate/interviews/agents/ — "View All Agents" from the dashboard. */
export function AgentsPage() {
  return (
    <Page>
      <PageHeader title="All Agents" desc="Select an agent to conduct your interview." back={`${BASE}/`} />
      <Section kind="block"><AgentsTable /></Section>
    </Page>
  );
}

function AgentsTable() {
  const { stage } = useDemo();
  const charged = isReinterview(stage);
  return (
    <div className={s.agt}>
      <div className={s.agtH}>
        {["Agent", "Expertise", "Experience", "Rate", ""].map((h, i) => <Text key={i} role="compact" as="span" strong ink="primary">{h}</Text>)}
      </div>
      {AGENTS.map((a) => (
        <div key={a.key} className={s.agtR}>
          <div className={s.who}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={a.img} alt="" />
            <span className={s.wb}>
              <span className={s.nm}>
                <Text role="h4" as="span">{a.name}</Text>
                {a.recommended && <Text role="caption" as="span" className={s.recTag}>Recommended</Text>}
              </span>
              <span className={s.rate}><Stars n={a.rating} /><Text role="label" as="span">{a.rating}</Text></span>
              <Text role="caption" as="span">{a.range} · {a.ivs} interviews</Text>
            </span>
          </div>
          <div className={`${s.tags} ${s.tagsC}`}>
            {/* Two chips and a count keep the row on one line (Maryam 16 Oct 2026). */}
            {a.tags.slice(0, 2).map((t) => <Text key={t} role="label" as="span" className={s.tag}>{t}</Text>)}
            {a.tags.length > 2 && <Text role="label" as="span" className={s.tag}>+{a.tags.length - 2}</Text>}
          </div>
          <div><Text role="caption" as="span" className={s.cellL}>Experience</Text><Text role="compact" as="span">{a.yrs} yrs</Text></div>
          <div><Text role="caption" as="span" className={s.cellL}>Rate</Text><Text role="h4" as="span">{charged ? `$${a.price}` : <FreeFee />}</Text></div>
          <div className={s.act}><Button kind="primary" size="sm" href={bookHref(stage, a.key)}>Book</Button></div>
        </div>
      ))}
    </div>
  );
}

const Stars = ({ n }: { n: number }) => (
  <span className={s.stars} aria-label={`${n} out of 5`}>
    {[1, 2, 3, 4, 5].map((i) => <Icon key={i} name={i <= Math.round(n) ? "star" : "starOutline"} />)}
  </span>
);

function PastList({ items }: { items: (typeof PAST)[string] }) {
  const a = agentByKey("priya");
  return (
    <div className={s.ivlist}>
      {items.map((p) => (
        <a key={p.kind} href={`${BASE}/report/${p.kind}/`} className={s.ivrow}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={a.img} alt="" />
          <span className={s.ivB}>
            <Text role="h4" as="span" className={s.ivN}>{a.name}</Text>
            <Text role="compact" as="span" className={s.ivOut}>{p.outcome}</Text>
            <Text role="eyebrow" as="span" className={s.ivEb}>{p.date}</Text>
          </span>
          <Icon name="chevRight" />
        </a>
      ))}
    </div>
  );
}

/* The agent's head on the booking and checkout pages (Phase 1 .bkp). */
function AgentHead({ a, charged }: { a: Agent; charged: boolean }) {
  return (
    <div className={s.bkp}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={a.img} alt="" />
      <div className={s.bkpB}>
        <span className={s.nameRow}><Text role="h3" as="span">{a.name}</Text><Icon name="verified" className={s.verified} /></span>
        <Text role="compact" as="span" className={s.rating}><Icon name="star" />{a.rating} · {a.ivs} interviews</Text>
        <Text role="compact" as="span" className={s.meta}>
          {charged
            ? <span><Icon name="wallet" />${a.price} Interview Fee</span>
            : <span><FreeFee quiet /></span>}
          <span><Icon name="video" />45 mins call</span>
        </Text>
      </div>
    </div>
  );
}

/* ============================================================
   /candidate/interviews/book/<agent>/ — pick a slot (Phase 1 V.agent).
   Calendly is third-party UI, so it is EMBEDDED as its picture, never
   redrawn. "Confirm booking" books: stage → booked (a reschedule keeps
   its stage), then the dashboard opens on "Interview Booked!".
   ============================================================ */
export function BookPage({ agent }: { agent: string }) {
  const a = agentByKey(agent);
  const { stage, setStage, setUi } = useDemo();
  const router = useRouter();
  const charged = isReinterview(stage);
  const confirm = () => {
    setUi({ ivBooked: { agent: a.key, charged } });
    if (stage !== "resched") setStage("booked");
    router.push("/candidate/");
  };
  return (
    <Page>
      <PageHeader title={`Book ${a.name}`} back={`${BASE}/`} desc="Pick a time that suits you for your 45-minute recorded interview." />
      <Section><AgentHead a={a} charged={charged} /></Section>
      <Section kind="block">
        <div className={s.col}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={s.shot} src="/images/art/calendly-shot.png" alt="Calendly booking calendar" />
          <Field label="What do you want to talk about?">
            <TextArea rows={3} maxLength={300} placeholder="A real leadership situation from the last few months works best." />
          </Field>
          <div className={s.go}><Button kind="primary" go onClick={confirm}>Confirm booking</Button></div>
        </div>
      </Section>
    </Page>
  );
}

/* ============================================================
   /candidate/interviews/checkout/<agent>/ — a charged re-interview pays
   first (Phase 1 V.checkout): saved cards, "Add a Card" (the Stripe
   picture), "Pay $X" → "Payment successful" → "Pick a slot" → calendar.
   ============================================================ */
export function CheckoutPage({ agent }: { agent: string }) {
  const a = agentByKey(agent);
  const router = useRouter();
  const [add, setAdd] = useState(false);
  const [paid, setPaid] = useState(false);
  return (
    <Page>
      <PageHeader title="Checkout" back={`${BASE}/`} desc="Choose a saved card to pay for your interview." />
      <Section><AgentHead a={a} charged /></Section>
      <Section kind="block">
        <div className={s.col}>
          <div>
            <SectionHeader small title="Pay with" actions={<Button kind="link" icon="add" asIs onClick={() => setAdd(true)}>Add a Card</Button>} />
            <CardPicker cards={SAVED_CARDS} />
          </div>
          <div className={s.go}><Button kind="primary" go onClick={() => setPaid(true)}>Pay ${a.price}</Button></div>
        </div>
      </Section>
      {add && <PayModal onClose={() => setAdd(false)} />}
      {paid && (
        <Dialog icon="checkFilled" title="Payment successful"
          fee={{ label: "Interview Fee", value: `$${a.price}` }}
          desc="Your payment was successfully processed. You can now continue to select a time for your interview."
          actions={<Button kind="primary" onClick={() => router.push(`${BASE}/book/${a.key}/`)}>Pick a slot</Button>} />
      )}
    </Page>
  );
}

/* The "Interview Booked!" dialog, raised on the dashboard after booking. */
export function BookedDialog() {
  const { ui, setUi } = useDemo();
  const b = ui.ivBooked as { agent: string; charged: boolean } | undefined;
  if (!b) return null;
  const a = agentByKey(b.agent);
  const close = () => setUi({ ivBooked: undefined });
  return (
    <Dialog icon="checkFilled" title="Interview Booked!" onClose={close}
      desc={<>{b.charged ? <>You have booked an interview with {a.name} for ${a.price}.</> : <>You have booked a <FreeFee /> interview with {a.name}.</>} Join the interview on your selected slot and get to know of your level.</>}
      actions={<Button kind="primary" onClick={close}>View My Dashboard</Button>} />
  );
}

/* ============================================================
   /candidate/interviews/report/<level|re>/ — Phase 1 V.report: the level
   card (black, with the ladder), Choose Your Scenes (pick three → save →
   offer the rest), the kept scenes with share, Interview Details, Enroll.
   CUT (G2): "Ask Tal: Why were these scenes selected…".
   ============================================================ */
export function ReportPage({ kind }: { kind: "level" | "re" }) {
  const { stage, ui, setUi } = useDemo();
  const lv = REPORT[kind];
  const d = REPORT.details;
  const key = `scenes-${kind}`;
  const kept = ui[key] as number[] | undefined;
  const [pick, setPick] = useState<number[]>([]);
  const [upsell, setUpsell] = useState(false);
  const toggle = (i: number) => setPick((p) => p.includes(i) ? p.filter((x) => x !== i) : p.length < 3 ? [...p, i] : p);
  const save = () => { setUi({ [key]: pick.slice() }); setUpsell(true); };
  const enrolled = atLeast(stage, "week1");

  return (
    <Page>
      <PageHeader title="Interview Report" back={`${BASE}/`} desc="Your level, what your agent saw in the interview, and the scenes you kept." />
      <LevelCard card={{ kind: "level", level: lv.level, rung: lv.rung, when: lv.when }} />

      {kept ? (
        <Section>
          <SectionHeader title="Scenes" />
          <div className={s.kept}>
            {kept.map((i) => <SceneCell key={i} i={i} share />)}
          </div>
        </Section>
      ) : (
        <Section>
          <SectionHeader title="Choose Your Scenes" desc="Six moments were selected from your interview. Choose three you’re comfortable sharing."
            actions={<Button kind="primary" size="sm" go disabled={pick.length !== 3} onClick={save}>Save Scenes</Button>} />
          <div className={s.pick}>
            {SCENES.map((_, i) => <SceneCell key={i} i={i} selectable selected={pick.includes(i)} onToggle={() => toggle(i)} />)}
          </div>
        </Section>
      )}

      <Section>
        <SectionHeader title="Interview Details" />
        <div className={s.sigH}>
          <span className={s.sigWho}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={agentByKey("priya").img} alt="" />
            <span className={s.sigB}><Text role="desc" as="span">Interviewed By</Text><Text role="h4" as="span">{d.agent}</Text></span>
          </span>
          <span className={s.sigWhen}>
            <Icon name="calendar" />
            <span className={s.sigB}><Text role="desc" as="span">Interview Date</Text><Text role="h4" as="span">{d.date}</Text></span>
          </span>
        </div>
        <div className={s.pair}>
          <SigCard tone="green" icon="growth" title="Strengths" tag="Strong" text={d.strengths} />
          <SigCard tone="violet" icon="flag" title="Growth Areas" tag="Focus" text={d.growth} />
        </div>
        <div className={s.note}><SigCard tone="blue" icon="comment" title="Priya’s Note" text={d.note} /></div>
      </Section>

      {!enrolled && (
        <Section kind="block"><Button kind="primary" go asIs href="/candidate/enrollment/">Enroll in Course</Button></Section>
      )}

      {upsell && (
        <Dialog icon="video" title="Get All Scenes" fee={{ label: "Only in", value: SCENES_PRICE }} onClose={() => setUpsell(false)}
          desc="You’ve selected your 3 included scenes. Want to keep the rest? Purchase the remaining interview scenes and get access to the complete set."
          actions={<>
            <Button kind="secondary" onClick={() => setUpsell(false)}>Continue with 3</Button>
            <Button kind="primary" go onClick={() => { setUi({ [key]: SCENES.map((_, i) => i) }); setUpsell(false); }}>Get All Scenes</Button>
          </>} />
      )}
    </Page>
  );
}

export function SigCard({ tone, icon, title, tag, text }: { tone: "green" | "violet" | "blue"; icon: "growth" | "flag" | "comment"; title: string; tag?: string; text: string }) {
  return (
    <div className={`${s.sigC} ${s[tone]}`}>
      <Icon name={icon} />
      <div className={s.sigCB}>
        <span className={s.sigTop}><Text role="h4" as="span" className={s.sigT}>{title}</Text>{tag && <span className={s.sigTag}>{tag}</span>}</span>
        <Text role="body" as="p" className={s.sigX}>{text}</Text>
      </div>
    </div>
  );
}

function SceneCell({ i, selectable, selected, onToggle, share }: {
  i: number; selectable?: boolean; selected?: boolean; onToggle?: () => void; share?: boolean;
}) {
  const [len, title] = SCENES[i];
  return (
    <div className={s.cell}>
      <button className={`${s.scene} ${selected ? s.sel : ""}`} onClick={onToggle} aria-pressed={selectable ? selected : undefined}>
        <span className={s.still} style={{ "--still": `url(${SCENE_STILL})` } as CSSProperties}>
          <span className={s.play}><Icon name="play" /></span>
          <span className={s.len}>{len}</span>
          {selectable && <span className={s.box}>{selected && <Icon name="check" />}</span>}
        </span>
        <span className={s.sceneT}>{title}</span>
      </button>
      {share && <ShareMenu />}
    </div>
  );
}

/* Share: a round disc on the still → Share on LinkedIn / Instagram / X. Also on the Profile scenes. */
export function ShareMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);
  return (
    <div className={s.share} ref={ref}>
      <button className={s.shareT} aria-label="Share scene" aria-expanded={open} onClick={() => setOpen((o) => !o)}><Icon name="share" /></button>
      {open && (
        <div className={s.shareM} role="menu">
          {SHARE_NETS.map((n) => (
            <button key={n} role="menuitem" className={`${s.shareI} t-body`} onClick={() => setOpen(false)}>Share on {n}</button>
          ))}
        </div>
      )}
    </div>
  );
}
