/* ============================================================
   CANDIDATE INTERVIEWS DATA — copied from Phase 1 (hifi data.js AGENTS,
   views.js report / scenes / checkout / modals), read 15 Oct 2026.
   ============================================================ */
import { PEOPLE } from "./seed";

export type Agent = {
  key: string; name: string; img: string; rating: number; range: string; ivs: number;
  slot: string; price: number; yrs: string; tags: string[]; recommended?: boolean;
};

/* Phase 1 AGENTS (data.js:629-660). Camila's photo is Phase 1's CALL_ART.faceW. */
export const AGENTS: Agent[] = [
  { key: "priya", name: "Priya Nair", img: PEOPLE.priya.img, rating: 4.8, range: "E1–E3", ivs: 210, slot: "Thu, Aug 20 · 6:30 PM", price: 95, yrs: "3", tags: ["Leadership", "Strategy", "Communication", "Operations"], recommended: true },
  { key: "owen", name: "Owen Clarke", img: PEOPLE.owen.img, rating: 4.6, range: "E2–B1", ivs: 164, slot: "Fri, Aug 21 · 5:00 PM", price: 85, yrs: "2.5", tags: ["Technical", "Problem Solving", "Systems", "Retail Operations"] },
  { key: "lena", name: "Lena Fischer", img: PEOPLE.lena.img, rating: 4.5, range: "E1–E4", ivs: 98, slot: "Mon, Aug 24 · 7:00 PM", price: 80, yrs: "4", tags: ["Product", "Communication", "Leadership", "Engineering Management"] },
  { key: "samuel", name: "Samuel Adeyemi", img: PEOPLE.samuel.img, rating: 4.4, range: "E3–B2", ivs: 143, slot: "Wed, Sep 2 · 6:00 PM", price: 90, yrs: "2", tags: ["Data", "Analytics", "Problem Solving", "Reporting", "Forecasting"] },
  { key: "hana", name: "Hana Kim", img: "/images/people/av-hana.jpg", rating: 4.3, range: "B1–B4", ivs: 121, slot: "Thu, Sep 3 · 5:30 PM", price: 110, yrs: "3", tags: ["UX Research", "Design", "Strategy", "Research Ops"] },
  { key: "camila", name: "Camila Rocha", img: "/images/people/call-art-facew.webp", rating: 4.7, range: "E4–B1", ivs: 176, slot: "Tue, Aug 25 · 5:30 PM", price: 100, yrs: "3", tags: ["Product", "Growth", "Communication", "Go-to-Market"] },
];
export const agentByKey = (k: string) => AGENTS.find((a) => a.key === k) ?? AGENTS[0];

/* The first interview is complimentary; the re-interview (day 90) is charged
   at the agent's fee (Phase 1 IV_FIRST_FREE / ivCharged). */
export const isReinterview = (stage: string) => stage === "day90";

export const HOW_IT_WORKS = {
  facts: [["Duration", "45 minutes"], ["Format", "Recorded video call"], ["Your Report", "Within 24 hours"], ["Fee", "First interview free"]] as const,
  steps: [
    ["Choose Your Agent", "Browse available agents and choose your preferred interview slot."],
    ["Complete Your Interview", "Join a 45-minute video call to discuss real-life situations based on your answers. No preparation or passing score required."],
    ["Get Your Level", "Within 24 hours, your interview is evaluated to determine your level, strengths, and growth areas."],
    ["Access Your Report", "Your report stays in your account, and you control who can access it. Your confirmed level determines which course you can enroll in."],
  ] as const,
};

export const SAVED_CARDS = [
  { brand: "Visa", last4: "4242", exp: "09/29", def: true },
  { brand: "Mastercard", last4: "8210", exp: "04/28" },
  { brand: "Amex", last4: "1005", exp: "11/27" },
];

/* Past interviews, by stage. */
export const PAST: Record<string, { kind: "level" | "re"; outcome: string; date: string }[]> = {
  assessed: [{ kind: "level", outcome: "Confirmed Explorer – E3", date: "August 20, 2026" }],
  week1: [{ kind: "level", outcome: "Confirmed Explorer – E3", date: "August 20, 2026" }],
  day34: [{ kind: "level", outcome: "Confirmed Explorer – E3", date: "August 20, 2026" }],
  day90: [{ kind: "level", outcome: "Confirmed Explorer – E3", date: "August 20, 2026" }],
  promoted: [
    { kind: "re", outcome: "Promoted to Explorer – E4", date: "November 21, 2026" },
    { kind: "level", outcome: "Confirmed Explorer – E3", date: "August 20, 2026" },
  ],
};

export const SCENES = [
  ["1:48", "The reorganization call"], ["2:10", "Handing over the vendor review"], ["1:22", "The Friday rhythm"],
  ["2:41", "Managing up"], ["1:56", "Conflict with a peer"], ["1:11", "Closing reflection"],
] as const;
export const SCENES_PRICE = "$29"; // authored placeholder in Phase 1 (§74)
export const SCENE_STILL = PEOPLE.maryam.img; // Phase 1 draws every still from the candidate's photo

/* The report. FLAG: Phase 1's re-interview report (promoted) shows the E4 level
   card over the FIRST interview's details (Aug 20, "an E3, not an E2"). Copied
   as Phase 1 has it; needs a real re-interview write-up. */
export const REPORT = {
  level: { level: "Explorer – E3", rung: 3, when: "Confirmed August 21 · Assigned by TALENTnext" },
  re: { level: "Explorer – E4", rung: 4, when: "Promoted November 21 · Assigned by TALENTnext" },
  details: {
    agent: "Priya Nair · Talent Agent",
    date: "August 20, 2026",
    strengths: "You consider both outcomes and people when making decisions, supported by specific examples from your interview.",
    growth: "Delegation and coaching instead of taking over. Chapters 4 and 12 address these skills.",
    note: "“She talks cautiously, but she has already run a reorganization and can explain every call she made in it. That is an E3, not an E2.”",
  },
};
export const LADDER = ["E1", "E2", "E3", "E4", "E5", "B1", "B2", "B3", "B4", "B5", "T1", "T2", "T3", "T4", "T5"];
export const SHARE_NETS = ["LinkedIn", "Instagram", "X"];
