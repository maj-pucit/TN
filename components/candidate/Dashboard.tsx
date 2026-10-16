"use client";
import { useEffect, useState } from "react";
import { Stats, Stat } from "../ui/Figures";
import { Page, PageHeader, Section, SectionHeader, Text, HeadBand } from "../primitives";
import { DarkCard, DarkCardActions, DarkHeadCard } from "../ui/DarkCard";
import { LSVT_URL, progressView } from "@/data/progress";
import { QuickActions } from "../ui/QuickActions";
import { ProgressWing } from "../ui/ProgressWing";
import { Button } from "../ui/Button";
import { Icon } from "../Icon";
import { useDemo } from "@/lib/demo";
import { AGENT_PRIYA as A, JOURNEY, stageView, type Card, type Progress } from "@/data/candidate";
import s from "./dashboard.module.css";
import { CallRow, When } from "./CallRow";
import { CourseOffer } from "./CourseOffer";
import { QuizModal, EnrolledDialog } from "./Level";
import { courseByKey } from "@/data/level";
import { BookedDialog, bookHref } from "./Interviews";

/* ============================================================
   CANDIDATE DASHBOARD — Phase 1's dashboard, stage by stage, minus the
   Tal summary band (G3). Order on every stage: greeting → journey (or
   course progress once enrolled) → the one black card → Quick Actions.
   ============================================================ */
export function CandidateDashboard() {
  const { stage } = useDemo();
  const v = stageView(stage);
  const [quiz, setQuiz] = useState(false);
  return (
    <Page>
      <HeadBand>
        <PageHeader greeting="Maryam" desc={v.desc} />
        <Section>{v.progress ? <ProgressBlock p={v.progress} /> : <Journey step={v.journeyStep ?? 0} of={v.journeyOf ?? 4} />}</Section>
        {/* The three insights: their OWN block section, inside the head band but not part of
            the progress row, so they take the section gap (Maryam 16 Oct 2026). */}
        {v.progress && (
          <Section kind="block" bare>
            <Stats cols={3}>{insights(stage).map((f) => <Stat key={f.v} icon={f.icon} label={f.v} desc={f.l} />)}</Stats>
          </Section>
        )}
      </HeadBand>
      <StageCard card={v.card} stage={stage} />
      <Section kind="block">
        <SectionHeader title="Quick Actions" />
        <QuickActions items={v.qa} onPick={(q) => q.title === "Open Quiz Results" ? (setQuiz(true), true) : false} />
      </Section>
      <BookedDialog />
      <EnrolledDialog />
      {quiz && <QuizModal onClose={() => setQuiz(false)} />}
    </Page>
  );
}

function Journey({ step, of }: { step: number; of: number }) {
  return (
    <div className={s.jrn}>
      <div className={s.jrnH}>
        <Text role="h4" as="h2">Your journey so far</Text>
        <Text role="label" as="span" className={s.pill}>Step {step + 1} of {of}</Text>
      </div>
      <ol className={s.steps}>
        {JOURNEY.slice(0, of).map((l, i) => {
          const st = i < step ? "done" : i === step ? "on" : "next";
          /* A line takes the state of the step it leads INTO: orange into the current step,
             green into a finished one, grey into one still ahead (reference, 16 Oct 2026). */
          const to = i + 1 < step ? s.toDone : i + 1 === step ? s.toOn : "";
          return (
            <li key={l} className={`${s.step} ${st === "done" ? s.done : st === "on" ? s.on : ""}`}>
              <span className={s.stepTop}>
                <span className={s.stepMk}><Icon name={st === "done" ? "checkFilled" : st === "on" ? "hourglass" : "time"} /></span>
                {i < of - 1 && <span className={`${s.stepLine} ${to}`} aria-hidden="true" />}
              </span>
              <span className={s.stepTx}>
                <Text role="h4" as="span">{l}</Text>
                <Text role="label" as="span" className={s.stepSt}>{st === "done" ? "Completed" : st === "on" ? "In Progress" : "Upcoming"}</Text>
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* The three insights under the bar. Learning Time and Chapter Retakes are Maryam's supplied
   copy (authored placeholder, Phase 1 §74). The third was Session Attendance, which counted
   cohort calls: Phase 0 has no cohorts, so it is the stage's Assessment Average, read off
   the Course Progress data so the two pages agree (Maryam 16 Oct 2026). */
const insights = (stage: string): { icon: "time" | "restart" | "chart"; v: string; l: string }[] => {
  const pv = progressView(stage), n = pv.scores.length;
  return [
    { icon: "time", v: "Learning Time", l: "14h 31m - 73 minutes per chapter" },
    { icon: "restart", v: "Chapter Retakes", l: "2 - 1 attempt per chapter on average" },
    { icon: "chart", v: "Assessment Average", l: pv.avg ? `${pv.avg}% - across ${n} assessed chapter${n === 1 ? "" : "s"}` : "No chapters assessed yet" },
  ];
};

function ProgressBlock({ p }: { p: Progress }) {
  return (
    /* Self-paced (Maryam 16 Oct 2026): no days, no weeks; the course is its chapters. */
    <ProgressWing full title="Your Course Progress"
      big={<>{p.pct}<small>%</small></>} bigLabel="Course completed"
      right={<>{p.seg}<small> of 13 chapters</small></>} rightLabel="Chapters done"
      segs={Array.from({ length: 13 }, (_, i) => (i < p.seg ? "done" : ""))}
      /* The three insights under the bar (Maryam 16 Oct 2026, supplied copy, kept as written), as
         three JOINT stat blocks (the hairline grid): each a black title over its figure line; attempts are whole numbers, never a decimal. Authored placeholder (Phase 1 §74), the same on every
         enrolled stage until real course telemetry lands. */
 />
  );
}

function StageCard({ card, stage }: { card: Card; stage: string }) {
  switch (card.kind) {
    case "rec":
      return (
        <DarkCard title={card.title} tal slot={<Button kind="onDark" go href="/candidate/interviews/agents/">View All Agents</Button>}>
          <div className={s.rec}>
            <div className={s.recL}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className={s.face} src={A.img} alt="" />
              <div className={s.recB}>
                <span className={s.nameRow}><Text role="h3" as="span">{A.name}</Text><Icon name="verified" className={s.verified} /></span>
                <Text role="compact" as="span" className={s.rating}><Icon name="star" />{A.rating} · {A.interviews} interviews</Text>
                <Text role="compact" as="p" strong>{A.why}</Text>
                <Text role="compact" as="p" className={s.meta}>
                  {card.charged
                    ? <span><Icon name="wallet" />${A.price} Interview Fee</span>
                    : <span><Icon name="wallet" /><span className={s.free}>Free</span></span>}
                  <span><Icon name="video" />{A.call}</span>
                  {card.charged && <span><Icon name="calendar" />Next slot: {A.nextSlot}</span>}
                </Text>
              </div>
            </div>
            <DarkCardActions><Button kind="accent" go asIs href={bookHref(stage)}>Book a Call with Priya</Button></DarkCardActions>
          </div>
        </DarkCard>
      );
    case "call":
      return (
        <DarkCard title="Your Next Step: Interview" slot={<When>{card.when}</When>}>
          <CallRow action={card.resched
            ? <Button kind="secondary" go href="/candidate/interviews/book/priya/">Reschedule</Button>
            : <Button kind="accent" go disabled>Join call</Button>} />
        </DarkCard>
      );
    case "held":
      return (
        <DarkCard title="Your interview is complete" slot={<When>Results in <HeldTimer /></When>}>
          <CallRow />
        </DarkCard>
      );
    case "enrol":
      return (
        <CourseOffer course={courseByKey(card.level)} recommended opens={card.opens}
          slot={<Button kind="onDark" go href="/candidate/enrollment/">View Other Courses</Button>}
          cta={<Button kind="accent" go href={`/candidate/enrollment/course/${card.level}/`}>View Course</Button>} />
      );
    case "pulse":
      return (
        <DarkHeadCard title="Your Learning Pulse" desc={<>You’ve spent <b>{card.spent} minutes</b> learning this week, with <b>{card.left} minutes</b> remaining in Chapter {card.ch}. Complete the chapter to stay on pace.</>}
          act={<Button kind="accent" size="sm" go href={LSVT_URL} external>{`Open chapter ${card.ch}`}</Button>} />
      );
  }
}


/* The held card's countdown: 24 hours from the moment the interview ended
   (Phase 1: one 24h promise on every held surface). Elapsed-time based. */
function HeldTimer() {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const till = Date.now() + 24 * 3600 * 1000 - 27_000;
    const tick = () => setLeft(Math.max(0, till - Date.now()));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);
  if (left === null) return <>24:00:00</>;
  const h = Math.floor(left / 3.6e6), m = Math.floor((left % 3.6e6) / 6e4), sec = Math.floor((left % 6e4) / 1000);
  const p = (n: number) => String(n).padStart(2, "0");
  return <>{p(h)}:{p(m)}:{p(sec)}</>;
}
