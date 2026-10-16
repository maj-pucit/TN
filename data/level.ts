/* ============================================================
   MY LEVEL + COURSE ENROLLMENT DATA — copied from Phase 1 (hifi views.js
   V.level / V.result / quizModal / allCourses / V.enrol / V.payment and
   data.js ENROL_COURSE, COURSE_NAME, COURSE_TOPICS, COURSE_RATE_PH,
   COURSE_DESC, CH, CH_SYL), read 15 Oct 2026.
   ============================================================ */

/* The level card, by stage. Before a level is set it shows the TRACK. */
export type LevelCard =
  | { kind: "track"; desc: string }
  | { kind: "level"; level: string; rung: number; when: string };

export const levelCard = (stage: string): LevelCard => {
  if (["new", "booked", "resched", "nil", "signup", "onboard"].includes(stage))
    return { kind: "track", desc: "Your level will be assigned after your interview." };
  if (stage === "held") return { kind: "track", desc: "Your report is on its way" };
  if (stage === "promoted") return { kind: "level", level: "Explorer – E4", rung: 4, when: "Promoted November 21 · Assigned by TALENTnext" };
  return { kind: "level", level: "Explorer – E3", rung: 3, when: "Confirmed August 21 · Assigned by TALENTnext" };
};

export const LADDER_HOW: [string, string][] = [
  ["The Three Tracks", "Explorer (E1–E5), Builder (B1–B5), and Trailblazer (T1–T5) form a 15-level progression. Advance one level at a time."],
  ["Moving Up", "Each course runs for 90 days. At the end, a re-interview determines whether you advance, maintain your level, or move down one level."],
  ["Who Determines Your Level", "A talent agent conducts your interview, and TALENTnext assigns your level based on the evaluation. After each 90-day course, a re-interview determines your next level."],
];

/* The quiz read (Phase 1 SUMDROP.quiz, drawn by quizModal). */
export const QUIZ = {
  lead: "You scored 64/100 on the Next in Leadership quiz on 12 Aug, placing you on the Explorer track.",
  read: "Your quiz determines your track: Explorer, Builder, or Trailblazer. Your level (E1–E5) will be assigned after your 45-minute interview with an agent.",
  next: "Book an interview to discover your level, strengths, and growth areas.",
};

/* ---- Courses ---- */
export type Course = {
  key: "E1" | "E2" | "E3" | "E4"; name: string; desc: string; rating: number; reviews: number;
  topics: string[]; fee: number; chapters: string; cadence: string;
};
export const COURSE_LIST: Course[] = [
  { key: "E1", name: "Business Essentials", desc: "The everyday foundations of working in a business — how teams organise, how work moves through them, and the basic tools that keep it running. The first step before the deeper courses.", rating: 4.6, reviews: 210, topics: ["Communication", "Teamwork", "Time management"], fee: 690, chapters: "13 chapters", cadence: "One a week" },
  { key: "E2", name: "Business and Productivity Tools", desc: "The software and working habits that make a modern team fast: documents, spreadsheets, planning and communication tools, and how to use them well together rather than one at a time.", rating: 4.4, reviews: 176, topics: ["Tools", "Productivity", "Collaboration"], fee: 690, chapters: "13 chapters", cadence: "One a week" },
  { key: "E3", name: "Business Fundamentals", desc: "Build your business knowledge across strategy, operations, finance, marketing, and decision-making.", rating: 4.5, reviews: 339, topics: ["Strategy", "Operations", "Finance"], fee: 690, chapters: "13 chapters", cadence: "One a week" },
  { key: "E4", name: "Business Leadership", desc: "Build the capabilities that define effective leadership. Learn to delegate with trust, navigate difficult conversations, coach and develop others, and lead through change — turning strong fundamentals into the judgment and presence that leading people demands.", rating: 4.7, reviews: 128, topics: ["Leadership", "Decisions", "Ownership"], fee: 690, chapters: "13 chapters", cadence: "One a week" },
];
export const courseByKey = (k: string) => COURSE_LIST.find((c) => c.key === k) ?? COURSE_LIST[2];
/* The recommended course is the one at the candidate's level. */
export const recommendedKey = (stage: string) => (stage === "promoted" ? "E4" : "E3");

/* The course outline. FLAG: Phase 1 draws this one syllabus (CH / CH_SYL) for
   every course; per-course chapters are not in the seed. */
export const CHAPTERS: { t: string; min: number; learn: string[]; skills: string[] }[] = [
  { t: "Why We Exist", min: 45, learn: ["Say what the business is for in one sentence other people repeat", "Trace your own work back to the outcome it is paid for", "Tell a value the company lives from a slogan on a wall"], skills: ["Purpose", "Business literacy", "Strategic context", "Storytelling"] },
  { t: "The Operator Mindset", min: 60, learn: ["Take a problem end to end instead of passing it on", "Pick the smallest change that moves the number", "Tell being busy apart from being effective"], skills: ["Ownership", "Prioritisation", "Execution", "Bias to action"] },
  { t: "Reading the Room", min: 50, learn: ["Notice what a room is not saying, and name it safely", "Read when agreement in a meeting is not agreement", "Change how you say a thing for who is in front of you"], skills: ["Situational awareness", "Listening", "Reading stakeholders", "Influence"] },
  { t: "Delegation Without Drop-Off", min: 70, learn: ["Hand work over without it dropping, and without taking it back", "Agree the check-in before the work starts, not after it slips", "Match how closely you follow up to how much is at stake"], skills: ["Delegation", "Accountability", "Trust", "Follow-through"] },
  { t: "Hard Conversations", min: 55, learn: ["Open a hard conversation without it being an ambush", "Say the thing once, plainly, and early", "Stay in the conversation after the other person reacts"], skills: ["Directness", "Difficult conversations", "Candour", "Composure"] },
  { t: "Building Trust at Speed", min: 60, learn: ["Be useful enough to be trusted inside the first week", "Make small commitments in public and keep them", "Repair trust quickly when you get something wrong"], skills: ["Trust", "Credibility", "Reliability", "Building relationships"] },
  { t: "Decisions Under Incomplete Information", min: 65, learn: ["Decide with incomplete information and explain the call afterwards", "Separate a decision you can reverse from one you cannot", "Name what would change your mind before you commit"], skills: ["Decisiveness", "Judgement", "Weighing risk", "Reasoning out loud"] },
  { t: "Managing Up", min: 50, learn: ["Give your manager the version of the problem they can act on", "Ask for a decision rather than for permission", "Disagree with someone senior and keep the relationship"], skills: ["Managing up", "Escalation", "Written updates", "Stakeholder management"] },
  { t: "Feedback That Lands", min: 55, learn: ["Give feedback that changes what happens next", "Separate what somebody did from who they are", "Ask for feedback in a way that gets you the real answer"], skills: ["Feedback", "Directness", "Developing people", "Growth conversations"] },
  { t: "Running the Weekly Rhythm", min: 45, learn: ["Run a weekly meeting people leave knowing what to do", "Keep one list that tells you what is actually moving", "Close last week before you open this one"], skills: ["Operating rhythm", "Running meetings", "Planning", "Follow-through"] },
  { t: "Conflict and Repair", min: 60, learn: ["Take the heat out of a disagreement without avoiding it", "Hold a team steady while two people are still angry", "Repair a working relationship after it has broken"], skills: ["Handling conflict", "Repair", "Mediation", "Composure"] },
  { t: "Coaching vs Fixing", min: 55, learn: ["Coach people through a problem instead of fixing it for them", "Ask the question instead of giving the answer", "Know when coaching is the wrong tool and step in"], skills: ["Coaching", "Questioning", "Developing people", "Restraint"] },
  { t: "Leading Through Change", min: 60, learn: ["Keep the work going while the ground moves", "Say what you know, what you do not, and when you will know", "Take a team through a change nobody chose"], skills: ["Leading change", "Communication", "Resilience", "Composure"] },
];
