/* ============================================================
   THE CANDIDATE'S DATA, BY STAGE — copied from Phase 1 as it renders
   (hifi candidate portal, read 15 Oct 2026), with the Phase 0 cuts
   applied. Every cut is marked CUT with the decision it follows
   (PHASE0-DECISIONS.md G-numbers / section 3).
   ============================================================ */
import type { IconName } from "@/lib/icons";
import { PEOPLE } from "./seed";

export type QA = { icon: IconName; title: string; desc: string; href?: string; ring?: number };

export const AGENT_PRIYA = {
  name: "Priya Nair",
  img: PEOPLE.priya.img,
  rating: 4.8,
  interviews: 210,
  price: 95,
  call: "45 mins call",
  role: "Talent agent",
  expertise: "System Architecture, assesses E1–E3",
  why: "Priya’s expertise in Architecture aligns well with your System Design assessment.",
  nextSlot: "Thu, Aug 20 · 6:30 PM",
};


/* The journey list. CUT (G8): step four read "90-Day Cohort Journey". */
export const JOURNEY = ["Next in Leadership Quiz", "Interview & Levelling", "Course Enrollment", "90-Day Journey"];

export type Progress = { pct: number; day: number; seg: number; chapters: string; tasks: string; week: string; time: string };

export type Card =
  | { kind: "rec"; title: string; charged?: boolean }
  | { kind: "call"; when: string; resched?: boolean }
  | { kind: "held" }
  | { kind: "enrol"; level: "E3" | "E4"; opens?: string }
  | { kind: "pulse"; spent: number; left: number; ch: number };

export type StageView = {
  desc: string;                 // the factual line under the greeting
  journeyStep?: number;         // 0-based current step; undefined when progress shows instead
  journeyOf?: number;
  progress?: Progress;
  card: Card;
  qa: QA[];
};

/* Quick actions that open the Tal chat are CUT (G2): "Quick-Start Preparation",
   "What to Bring", "What Happens Next". Points / standing actions are CUT (G9).
   A coursework link is re-pointed to Course Progress (Coursework is not a
   Phase 0 module; the learning itself happens in LightSpeedVT). */
export const STAGE: Record<string, StageView> = {
  new: {
    desc: "Explorer track · quiz 64 of 100 · no level yet",
    journeyStep: 1,
    card: { kind: "rec", title: "Your Next Step: Interview" },
    qa: [
      { icon: "user", title: "Complete Your Profile", desc: "Update your profile details.", href: "/candidate/profile/", ring: 80 },
      { icon: "document", title: "Open Quiz Results", desc: "View your quiz score and results.", href: "/candidate/level/result/" },
    ],
  },
  booked: {
    desc: "Explorer track · interview 20 August · no level yet",
    journeyStep: 1,
    card: { kind: "call", when: "In 5 minutes" },
    qa: [{ icon: "video", title: "Your Session, Step by Step", desc: "Understand your interview process.", href: "/candidate/interviews/" }],
  },
  resched: {
    desc: "Explorer track · interview 20 August · no level yet",
    journeyStep: 1,
    card: { kind: "call", when: "In 2 days", resched: true },
    qa: [{ icon: "video", title: "Your Session, Step by Step", desc: "Understand your interview process.", href: "/candidate/interviews/" }],
  },
  held: {
    desc: "Explorer track · interview held · report within 24 hours",
    journeyStep: 1,
    card: { kind: "held" },
    qa: [{ icon: "video", title: "Your Interview", desc: "Review your interview recording.", href: "/candidate/interviews/" }],
  },
  assessed: {
    desc: "Explorer Track – E3 · level 3 of 15 · not enrolled yet",
    journeyStep: 2,
    card: { kind: "enrol", level: "E3" },
    qa: [
      { icon: "book", title: "What the 90 Days Cover", desc: "Explore the chapters of your course.", href: "/candidate/enrollment/" },
      { icon: "document", title: "What the Interview Found", desc: "Review your agent’s interview evaluation.", href: "/candidate/interviews/report/level/" },
    ],
  },
  week1: {
    desc: "Explorer Track – E3 · week 1 of 13",
    progress: { pct: 0, day: 4, seg: 0, chapters: "0 of 13", tasks: "0 of 3", week: "Week 1", time: "0h 0m" },
    card: { kind: "pulse", spent: 20, left: 45, ch: 1 },
    qa: [
      { icon: "flag", title: "Current Focus", desc: "Complete Chapter 1 in 45 minutes.", href: "/candidate/progress/" },
      { icon: "time", title: "Your Pace", desc: "20 minutes completed this week.", href: "/candidate/progress/" },
    ],
  },
  day34: {
    desc: "Explorer Track – E3 · week 5 of 13",
    progress: { pct: 38, day: 34, seg: 5, chapters: "5 of 13", tasks: "1 of 3", week: "Week 5", time: "4h 20m" },
    card: { kind: "pulse", spent: 12, left: 58, ch: 4 },
    qa: [
      { icon: "flag", title: "Current Focus", desc: "Complete Chapter 4 in 70 minutes.", href: "/candidate/progress/" },
      { icon: "time", title: "Your Pace", desc: "12 minutes completed this week.", href: "/candidate/progress/" },
    ],
  },
  day90: {
    desc: "Explorer Track – E3 · ninety days complete",
    progress: { pct: 100, day: 90, seg: 13, chapters: "13 of 13", tasks: "3 of 3", week: "Week 13", time: "11h 40m" },
    card: { kind: "rec", title: "Your Next Step: Re-interview", charged: true },
    qa: [{ icon: "time", title: "Your Pace", desc: "746 minutes completed in total.", href: "/candidate/progress/" }],
  },
  promoted: {
    desc: "Explorer Track – E4 · level 4 of 15",
    journeyStep: 1,
    journeyOf: 3,
    card: { kind: "enrol", level: "E4", opens: "E4 opens on December 1" },
    qa: [
      { icon: "book", title: "What the 90 days cover", desc: "13 chapters at E4", href: "/candidate/enrollment/" },
      { icon: "document", title: "What the re-interview found", desc: "Write-up by the agent on re-interview", href: "/candidate/interviews/report/re/" },
    ],
  },
};

/* Stages before the product (nil, signup, onboard) have no dashboard: they
   are the auth and onboarding flows. Until those are ported they fall back to
   the "new" dashboard. */
export const stageView = (k: string): StageView => STAGE[k] ?? STAGE.new;
