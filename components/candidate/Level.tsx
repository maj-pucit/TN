"use client";
import { Chips, Chip } from "../ui/Chip";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Page, PageHeader, Section, SectionHeader, Text } from "../primitives";
import { Accordion } from "../ui/Accordion";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { Dialog } from "../ui/Dialog";
import { CardPicker, PayModal } from "../ui/CardPicker";
import { Icon } from "../Icon";
import { LevelCard } from "./LevelCard";
import { CourseOffer } from "./CourseOffer";
import { bookHref } from "./Interviews";
import { useDemo } from "@/lib/demo";
import { CHAPTERS, COURSE_LIST, LADDER_HOW, QUIZ, courseByKey, levelCard, recommendedKey, type Course } from "@/data/level";
import { SAVED_CARDS } from "@/data/interviews";
import s from "./level.module.css";
import t from "./interviews.module.css";
import e from "./enrollment.module.css";

/* ============================================================
   /candidate/level/ — My Level (Phase 1 V.level): the level card, then
   "How the Ladder Works". CUT (G9): the Ranking board and the
   certificate banner.
   ============================================================ */
export function LevelPage() {
  const { stage } = useDemo();
  return (
    <Page>
      <PageHeader title="My Level" desc="Where you sit on the 15-level ladder and how you move up it." />
      <LevelCard card={levelCard(stage)} />
      <Section tint>
        <SectionHeader title="How the Ladder Works" />
        <Accordion items={LADDER_HOW.map(([title, body]) => ({ title, body: <Text role="body" ink="secondary">{body}</Text> }))} />
      </Section>
    </Page>
  );
}

/* /candidate/level/result/ — the quiz result (Phase 1 V.result, lean). */
export function ResultPage() {
  const { stage } = useDemo();
  return (
    <Page>
      <PageHeader title="Explorer track" back="/candidate/level/" desc="Your quiz result and the track it places you on." />
      <Section>
        <SectionHeader title="Your track" desc="Your latest quiz put you on the Explorer track." />
        <Text role="body" ink="secondary">Your track is the band you start in. Your level is set at your interview, not by the quiz.</Text>
      </Section>
      <Section kind="block"><Button kind="primary" go href={bookHref(stage)}>Book Your Interview</Button></Section>
    </Page>
  );
}

/* The quiz read, opened from the dashboard's "Open Quiz Results". */
export function QuizModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal label="Quiz results" onClose={onClose} footer={<Button kind="secondary" onClick={onClose}>Close</Button>}>
      <div className={s.quiz}>
        <Text role="body" strong>{QUIZ.lead}</Text>
        <Text role="body" ink="secondary">{QUIZ.read}</Text>
        <div className={s.next}>
          <Text role="h4" as="span">Your Next Step</Text>
          <Text role="body" ink="secondary">{QUIZ.next}</Text>
        </div>
      </div>
    </Modal>
  );
}

/* ============================================================
   /candidate/enrollment/ — Course Enrollment opens on the COURSE LIST
   (Phase 0 change: it used to open on the one recommended course). The
   list is Phase 1's "Explore Courses" (allCourses).
   ============================================================ */
export function CoursesPage() {
  const { stage } = useDemo();
  const rec = recommendedKey(stage);
  return (
    <Page>
      <PageHeader title="Course Enrollment" desc="Browse courses in your track, with your recommended course highlighted." />
      <Section kind="block">
        <div className={`${t.agt} ${e.crsT}`}>
          <div className={`${t.agtH} ${e.crs}`}>
            {["Course", "What it covers", "Length", "Fee", ""].map((h, i) => <Text key={i} role="compact" as="span" strong ink="primary">{h}</Text>)}
          </div>
          {COURSE_LIST.map((c) => (
            <div key={c.key} className={`${t.agtR} ${e.crs}`}>
              <div className={t.wb}>
                <span className={t.nm}><Text role="h4" as="span">{c.name}</Text>{c.key === rec && <Text role="caption" as="span" className={t.recTag}>Recommended</Text>}</span>
                <span className={t.rate}><span className={t.stars}>{[1, 2, 3, 4, 5].map((i) => <Icon key={i} name={i <= Math.round(c.rating) ? "star" : "starOutline"} />)}</span><Text role="label" as="span">{c.rating}</Text></span>
                <Text role="caption" as="span">{c.reviews} reviews</Text>
              </div>
              <div className={`${t.tags} ${t.tagsC}`}>{c.topics.slice(0, 2).map((x) => <Text key={x} role="label" as="span" className={t.tag}>{x}</Text>)}{c.topics.length > 2 && <Text role="label" as="span" className={t.tag}>+{c.topics.length - 2}</Text>}</div>
              <div className={e.len}><Text role="caption" as="span" className={t.cellL}>Length</Text><Text role="compact" as="span">{c.chapters}</Text><Text role="caption" as="span" ink="secondary">{c.cadence}</Text></div>
              <div><Text role="caption" as="span" className={t.cellL}>Fee</Text><Text role="compact" as="span" strong>${c.fee}</Text></div>
              <div className={t.act}><Button kind="primary" size="sm" href={`/candidate/enrollment/course/${c.key}/`}>View Course</Button></div>
            </div>
          ))}
        </div>
      </Section>
    </Page>
  );
}

/* /candidate/enrollment/course/<key>/ — the course page (Phase 1 V.enrol):
   the course card with "Continue to payment", then the Course Outline.
   CUT (G9): "Earn your Explorer Track – E3 certificate". */
export function CoursePage({ k }: { k: string }) {
  const { stage } = useDemo();
  const c = courseByKey(k);
  return (
    <Page>
      <PageHeader title={c.name} back="/candidate/enrollment/" desc="What the course covers, chapter by chapter, over 90 days." />
      <CourseOffer course={c} recommended={c.key === recommendedKey(stage)}
        slot={<Button kind="accent" go href={`/candidate/enrollment/pay/${c.key}/`}>Continue to payment</Button>} />
      <Section>
        <SectionHeader title="Course Outline" />
        <Accordion items={CHAPTERS.map((ch, i) => ({
          title: ch.t, sub: `Chapter ${i + 1} · ${ch.min} min`,
          body: <>
            <Text role="h4" as="p">What you’ll learn</Text>
            <ul className={s.learn}>{ch.learn.map((l) => <li key={l}><Icon name="checkOutline" /><Text role="body" as="span" ink="secondary">{l}</Text></li>)}</ul>
            <Text role="h4" as="p">Skills you’ll gain</Text>
            <div className={s.skills}><Chips>{ch.skills.map((x) => <Chip key={x}>{x}</Chip>)}</Chips></div>
          </>,
        }))} />
      </Section>
    </Page>
  );
}

/* /candidate/enrollment/pay/<key>/ — course payment (Phase 1 V.payment):
   the course card, Pay with (saved cards), "Pay $690 and start". The full
   $690, no interview credit (Phase 1, 8 Oct 2026). Paying enrols: stage →
   Week 1 (the cohort-not-started stage is cut) and "Enrollment Confirmed". */
export function CoursePayPage({ k }: { k: string }) {
  const { stage, setStage, setUi } = useDemo();
  const router = useRouter();
  const c = courseByKey(k);
  const [add, setAdd] = useState(false);
  const pay = () => { setUi({ enrolled: c.key }); setStage("week1"); router.push("/candidate/"); };
  return (
    <Page>
      <PageHeader title="Payment" back={`/candidate/enrollment/course/${c.key}/`} desc="Choose a saved card to pay for the course and start your 90 days." />
      <CourseOffer course={c} recommended={c.key === recommendedKey(stage)} />
      <Section kind="block">
        <div className={s.col}>
          <div>
            <SectionHeader small title="Pay with" actions={<Button kind="ghost" icon="add" asIs onClick={() => setAdd(true)}>Add a Card</Button>} />
            <CardPicker cards={SAVED_CARDS} />
          </div>
          <div className={s.go}><Button kind="primary" go onClick={pay}>Pay ${c.fee} and start</Button></div>
        </div>
      </Section>
      {add && <PayModal onClose={() => setAdd(false)} />}
    </Page>
  );
}

/* "Enrollment Confirmed", raised on the dashboard after paying. */
export function EnrolledDialog() {
  const { ui, setUi } = useDemo();
  const k = ui.enrolled as Course["key"] | undefined;
  if (!k) return null;
  const close = () => setUi({ enrolled: undefined });
  return (
    <Dialog icon="checkFilled" title="Enrollment Confirmed" onClose={close}
      fee={{ label: "Course Fee", value: `$${courseByKey(k).fee}` }}
      desc="Your payment was successful, and your enrollment is confirmed. You’re ready to begin your learning journey on TALENTnext."
      actions={<Button kind="secondary" onClick={close}>Close</Button>} />
  );
}
