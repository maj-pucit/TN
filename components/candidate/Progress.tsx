"use client";
import { useState } from "react";
import { Page, PageHeader, Section, SectionHeader, Stack, Text } from "../primitives";
import { Stats, Stat } from "../ui/Figures";
import { DarkHeadCard } from "../ui/DarkCard";
import { PerfChart, PerfLegend } from "../ui/PerfChart";
import { ReviewCapsule } from "../ui/Review";
import { Disclosure } from "../ui/Disclosure";
import { Button } from "../ui/Button";
import { Icon } from "../Icon";
import { CourseOffer } from "./CourseOffer";
import { useDemo } from "@/lib/demo";
import { CHAPTERS, COURSE_AVG, GROWTH, LSVT_URL, PAST_RECORD, progressView, type ProgressView } from "@/data/progress";
import { courseByKey } from "@/data/level";
import s from "./progress.module.css";

/* ============================================================
   /candidate/progress/ — Course Progress (Phase 1 V.transcript), by stage:
   the learning pulse, the four figures, the performance graph against the
   COURSE average, progress by chapter, the day-90 course rating, and on
   Promoted the next-course offer above the closed course's record.
   CUT (G9): points. Coursework is not a Phase 0 module, so "Open Chapter N",
   "Restart" and "Resume" open LightSpeedVT (where the learning happens).
   ============================================================ */
export function ProgressPage() {
  const { stage } = useDemo();
  const v = progressView(stage);
  return (
    <Page>
      <PageHeader title="Course Progress" desc="Explorer Track – E3 · Business Fundamentals" />
      {v.offer ? (
        <>
          <CourseOffer course={courseByKey("E4")} recommended
            slot={<Button kind="onDark" go href="/candidate/enrollment/">View Other Courses</Button>}
            cta={<Button kind="accent" go href="/candidate/enrollment/course/E4/">View Course</Button>} />
          <Section>
            <Disclosure title={PAST_RECORD.title}>
              <Stack gap={6}>
                <Text role="body" ink="secondary">{PAST_RECORD.line}</Text>
                <Figures v={v} />
                <Perf v={v} note={PAST_RECORD.growthNote} />
              </Stack>
            </Disclosure>
          </Section>
        </>
      ) : (
        <>
          {v.pulse && (
            <DarkHeadCard title="Your Learning Pulse"
              desc={<>{v.pulse.lead}<b>{v.pulse.bold}</b>{v.pulse.rest}</>}
              act={<Button kind="accent" size="sm" go href={LSVT_URL} external>{`Open Chapter ${v.pulse.ch}`}</Button>} />
          )}
          <Body v={v} />
          <Chapters v={v} />
          {v.rating && <ReviewCapsule title="How would you rate this course?" />}
        </>
      )}
    </Page>
  );
}

function Figures({ v }: { v: ProgressView }) {
  return <Stats>{v.figures.map((f) => <Stat key={f.label} icon={f.icon} label={f.label} value={f.value} of={f.of} desc={f.desc} />)}</Stats>;
}
const AVG_LABEL = `Course average ${COURSE_AVG}%`;
function Perf({ v, note, legend }: { v: ProgressView; note?: string; legend?: boolean }) {
  return (
    <PerfChart scores={v.scores} count={13} avg={COURSE_AVG} avgLabel={AVG_LABEL} legend={legend}
      average={v.avg} insight={note ? `${v.insight} ${note}` : v.insight} names={CHAPTERS.map((c) => c.t)} />
  );
}

/* The figures + the graph as page sections. */
function Body({ v }: { v: ProgressView }) {
  return (
    <>
      <Section kind="block" bare><Figures v={v} /></Section>
      {v.scores.length > 0 && (
        <Section>
          <SectionHeader title="Your performance" desc="Assessment average across 13 chapters." actions={<PerfLegend avgLabel={AVG_LABEL} />} />
          <Perf v={v} legend={false} />
        </Section>
      )}
    </>
  );
}

/* Progress by chapter (Phase 1 chRow): name (+ the green tick when done), the
   meta line under it, and the trailing control — "Restart" on a finished
   chapter, "Resume" on the open one, an empty ring otherwise. Every chapter is
   open: the course is self-paced (Maryam 16 Oct 2026). No hairlines between rows. */
function Chapters({ v }: { v: ProgressView }) {
  const [all, setAll] = useState(false);
  const rows = all ? CHAPTERS : CHAPTERS.slice(0, 5);
  return (
    <Section tint>
      <SectionHeader title="Your progress by chapter" />
      <div className={s.list}>
        {rows.map((c, i) => {
          const st = v.state(i);
          const score = v.scores[i];
          const meta = st === "open" ? `Started · ${c.min} min`
            : st === "todo" ? `Not started · ${c.min} min`
            : `${c.min} min${score !== undefined ? ` · ${score}% assessment` : ""}`;
          return (
            <div key={c.t} className={`${s.ch} ${s[st]}`}>
              <span className={s.b}>
                <span className={s.n}>
                  <Text role="h4" as="span">{c.t}</Text>
                  {st === "done" && <span className={s.tick}><Icon name="checkFilled" /></span>}
                </span>
                <Text role="desc" as="span" className={s.meta}>
                  {meta}
                  {st === "done" && GROWTH.includes(i) && <><span>·</span><span className={s.growth}><i className={s.sk} />Your growth area</span></>}
                </Text>
              </span>
              {st === "done" || st === "open" ? (
                <a className={`${s.act} t-label`} href={LSVT_URL} target="_blank" rel="noopener noreferrer">{st === "done" ? "Restart" : "Resume"}</a>
              ) : (
                <span className={s.ic}><Icon name="circle" /></span>
              )}
            </div>
          );
        })}
      </div>
      <div className={s.more}>
        <Button kind="text" iconEnd={all ? "chevUp" : "chevDown"} onClick={() => setAll((a) => !a)}>
          {all ? "Show the first five" : `Show all ${CHAPTERS.length}`}
        </Button>
      </div>
    </Section>
  );
}
