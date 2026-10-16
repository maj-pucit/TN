/* ============================================================
   COURSE PROGRESS DATA — copied from Phase 1 V.transcript as it renders
   (read 15 Oct 2026). Chapter scores are read back off Phase 1's own
   plotted line (y = 156 − 1.44 × score). Phase 0 change: the dashed
   comparison line is the COURSE average, not the cohort average (Maryam).
   ============================================================ */
import { CHAPTERS } from "./level";

export const COURSE_AVG = 79; // Phase 1 COHORT_AVG, now named for the course
export const GROWTH = [3, 4, 11]; // 0-based chapter indices marked "Your growth area" (Phase 1 GROWTH)
/* The day each chapter opens (Phase 1 OPEN_DATES); a chapter whose week is
   still ahead reads "Opens <date>" with the padlock. */
export const OPEN_DATES = ["", "", "", "", "", "Mon, Aug 18", "Mon, Aug 25", "Mon, Sep 1", "Mon, Sep 8", "Mon, Sep 15", "Mon, Sep 22", "Mon, Sep 29", "Mon, Oct 6"];
/* The learning itself happens in LightSpeedVT (Coursework is not a Phase 0
   module), so "Open Chapter N", "Restart" and "Resume" open it in a new tab. */
export const LSVT_URL = "https://www.lightspeedvt.com/";
export type ChState = "done" | "open" | "todo" | "locked";

/* Assessment scores by chapter, for the stages that have them. */
const SCORES_ALL = [75, 80, 78, 50, 92, 90, 83, 88, 91, 85, 87, 84, 94];

export type ProgressView = {
  figures: { icon: "book" | "chart" | "time" | "checkOutline"; label: string; value: string; of?: string; desc: string }[];
  scores: number[];            // assessed chapters only, in order
  avg?: number;
  insight?: string;
  pulse?: { lead: string; bold: string; rest: string; ch: number }; // the learning pulse sentence + the chapter its button opens
  state: (i: number) => ChState;
  rating?: boolean;            // day 90: the course rating capsule
  offer?: boolean;             // promoted: the next-course offer + the past course record
};

export const PROGRESS: Record<string, ProgressView> = {
  week1: {
    figures: [
      { icon: "book", label: "Chapters done", value: "0", of: "of 13", desc: "0%" },
      { icon: "chart", label: "Assessment average", value: "Not yet", desc: "Nothing assessed yet" },
      { icon: "time", label: "Time invested", value: "0h 0m", desc: "Not started" },
      { icon: "checkOutline", label: "Tasks on time", value: "0", of: "of 0", desc: "None due yet" },
    ],
    scores: [],
    pulse: { lead: "You’ve spent ", bold: "20 minutes", rest: " learning this week. Complete Chapter 1, Why We Exist, to stay on track with your learning goal.", ch: 1 },
    state: (i) => (i === 0 ? "open" : OPEN_DATES[i] && 1 < i ? "locked" : "todo"),
  },
  day34: {
    figures: [
      { icon: "book", label: "Chapters done", value: "5", of: "of 13", desc: "38%" },
      { icon: "chart", label: "Assessment average", value: "75%", desc: `Course average ${COURSE_AVG}%` },
      { icon: "time", label: "Time invested", value: "4h 20m", desc: "52 min per chapter" },
      { icon: "checkOutline", label: "Tasks on time", value: "4", of: "of 5", desc: "One overdue" },
    ],
    scores: SCORES_ALL.slice(0, 5),
    avg: 75,
    insight: "Five chapters are assessed so far. Chapter 4, Delegation Without Drop-Off, is your lowest at 50%.",
    pulse: { lead: "You’ve spent ", bold: "12 minutes", rest: " learning this week. Complete Chapter 4, Delegation Without Drop-Off, to stay on track with your learning goal.", ch: 4 },
    state: (i) => (i < 5 ? "done" : OPEN_DATES[i] && 5 < i ? "locked" : "todo"),
  },
  day90: {
    figures: [
      { icon: "book", label: "Chapters done", value: "13", of: "of 13", desc: "100%" },
      { icon: "chart", label: "Assessment average", value: "83%", desc: `Course average ${COURSE_AVG}%` },
      { icon: "time", label: "Time invested", value: "11h 40m", desc: "54 min per chapter" },
      { icon: "checkOutline", label: "Tasks on time", value: "12", of: "of 13", desc: "One overdue" },
    ],
    scores: SCORES_ALL,
    avg: 83,
    insight: `Your average is 13 points higher from chapter 6 on than across the first five, and 10 of 13 chapters are at or above the course average of ${COURSE_AVG}%.`,
    state: () => "done",
    rating: true,
  },
};
/* Promoted: the E3 course is closed; the page leads with the E4 offer and
   keeps the E3 record in a disclosure (Phase 1 "Your Cohort 41 record";
   CUT G8: the cohort name). */
PROGRESS.promoted = { ...PROGRESS.day90, rating: false, offer: true };
export const PAST_RECORD = {
  title: "Your Explorer Track – E3 record",
  line: "Explorer Track – E3, closed November 21, 2026 and signed by Priya Nair.",
  growthNote: "Delegation Without Drop-Off and Coaching vs Fixing (chapters 4 and 12) are the two your report names as growth areas.",
};

export const progressView = (stage: string): ProgressView => PROGRESS[stage] ?? PROGRESS.day34;
export { CHAPTERS };
