/* ============================================================
   THE TALENT AGENT'S DATA — copied from Phase 1 tn-agent-portal.html as it
   renders on the `working` stage (read 15 Oct 2026). Phase 0 keeps the
   working week only (decision §4). Cuts are marked CUT with the decision.
   CUT (client, 15 Sep 2026): booking requests / accept-decline (Nadia, Joel,
   Inès were `st:'req'`), so their open slots stay open slots.
   ============================================================ */
import { PEOPLE } from "./seed";

export const AGENT = {
  name: "Owen Clarke", first: "Owen", email: "owen.clarke@fieldstone.co",
  img: "/images/people/agent.jpg",
  range: "Explorer E2 – Builder B1", rangeShort: "E2 – B1",
  fee: 85, share: 68, cut: 17,
  rating: 4.6, ivs: 164, month: 9,
  rank: 12, pool: 38,
  manager: { name: "Nadia Rahman", img: PEOPLE.lena.img },
  approvedScore: 4.5, rubric: 4.5, scoreAt: "1 July", reviewNext: "1 October",
  ivsQ: 47, cancels: 2, lateCancels: 1,
  escrow: 204, earned: 612, grossHeld: 255,
};

/* Five portraits across more than five people — Phase 1's own fidelity
   choice (PHOTOS), the design system's five shared portraits reused. */
const P = { lena: PEOPLE.lena.img, hana: "/images/people/av-hana.jpg", priya: PEOPLE.priya.img, samuel: PEOPLE.samuel.img };
export const PHOTO: Record<string, string> = {
  rafael: P.lena, amara: P.hana, sofia: P.priya, tom: P.samuel, nina: P.hana,
  marcus: P.samuel, yuki: P.priya, diego: P.hana,
  grace: P.lena, omar: P.samuel, farah: P.hana, daniel: P.samuel, petra: P.priya,
  leah: P.lena, owenp: P.samuel,
};

export type Iv = {
  id: string; n: string; st: "next" | "report" | "done";
  day: string; time: string; kind: "First interview" | "Re-interview";
  band?: string; asked?: string; paid?: string; summary?: boolean; level?: string;
  talLevel?: string; talType?: string; talEval?: string;
  seedWhy?: string; seedStrength?: string; seedGrowth?: string;
  signed?: string; money?: string; follow?: number; depth?: number;
};

export const IVS: Iv[] = [
  { id: "rafael", n: "Rafael Ortiz", st: "next", day: "Thursday 20 August", time: "3:00 PM", kind: "First interview", band: "Explorer, predicted by the quiz", asked: "Delegation, and being new to managing former peers", paid: "Paid at booking, 19 August" },
  { id: "amara", n: "Amara Osei", st: "next", day: "Monday 24 August", time: "6:00 PM", kind: "Re-interview", band: "Builder – B1, set 4 March", asked: "Hard conversations, and holding a line under pressure", paid: "Paid at booking, 18 August", summary: true },
  { id: "marcus", n: "Marcus Bell", st: "next", day: "Thursday 27 August", time: "4:00 PM", kind: "First interview", band: "Explorer, predicted by the quiz", asked: "Giving feedback that lands without bruising", paid: "Paid at booking, 22 August" },
  { id: "yuki", n: "Yuki Tanaka", st: "next", day: "Monday 31 August", time: "5:00 PM", kind: "Re-interview", band: "Builder – B2, set 10 June", asked: "Delegating the work she is best at", paid: "Paid at booking, 25 August", summary: true },
  { id: "diego", n: "Diego Ramos", st: "next", day: "Wednesday 2 September", time: "6:00 PM", kind: "First interview", band: "Explorer, predicted by the quiz", asked: "Running a standup that does not run long", paid: "Paid at booking, 28 August" },

  /* Pending recommendations. Tal's read, the seeds and the levels are
     authored placeholder in the shape a transcript pass would fill (Phase 1 flag). */
  { id: "sofia", n: "Sofia Marek", st: "report", day: "Tuesday 18 August", time: "5:00 PM", kind: "First interview", band: "Explorer, predicted by the quiz", level: "Explorer – E2", asked: "Running her first team of four", talLevel: "Explorer – E3", talType: "Leader",
    talEval: "<p>Tal suggests <b>Explorer – E3</b>. The transcript presents Sofia as a <b>planner rather than an announcer</b>: she gives specific, evidence-based examples of delegation and describes one well-planned handover, but offers less evidence of initiating difficult conversations herself.</p><p>What supports E3: Two delegation examples with <b>named owners and checkpoints</b>, plus a <b>detailed plan for handing over the vendor review</b>. She discusses her team of four with specific examples rather than generalities.</p><p>What holds her below E4: Her examples of difficult conversations were <b>situations she was brought into</b>, rather than ones she initiated. There is not yet evidence of addressing problems before they become urgent or asking for what she needs. Ask her about a conflict she initiated and how it turned out. A concrete outcome could support consideration for <b>E4</b>.</p>",
    seedStrength: "Plans handovers rather than simply announcing them. Described the vendor review handover in detail and gave specific examples of managing her team of four.",
    seedGrowth: "Initiating difficult conversations and asking for support before problems become urgent.",
    seedWhy: "E3 reflects Sofia’s demonstrated delegation skills, including a detailed plan for handing over the vendor review. E4 is not yet supported because her examples of difficult conversations involved situations she was asked to handle, rather than ones she initiated." },
  { id: "grace", n: "Grace Liu", st: "report", day: "Monday 17 August", time: "4:30 PM", kind: "First interview", band: "Explorer, predicted by the quiz", level: "Explorer – E2", asked: "Picking up a team halfway through a project", talLevel: "Explorer – E2",
    talEval: "<p>Tal suggests <b>Explorer – E2</b>. Grace is <b>calm on a handover</b> and reads a half-built plan quickly, but most of what she described was <b>keeping a plan running</b> rather than setting one.</p><p>What holds it at E2: the decisions she named were <b>continuations of someone else's</b>. One call she made from scratch, and the trade-off behind it, is what would move it.</p>",
    seedWhy: "E2 matches what she evidenced: steady continuation of an inherited plan, read and kept moving. Below E3 because the decisions were continuations, not ones she originated.",
    seedStrength: "Reads a half-finished plan fast and keeps it moving without dropping threads. Steady on a mid-project handover.",
    seedGrowth: "Owning a decision from the start: naming the trade-off and making the call, not only maintaining one already made." },
  { id: "omar", n: "Omar Sethi", st: "report", day: "Friday 14 August", time: "3:00 PM", kind: "Re-interview", band: "Builder – B1, set 20 May", level: "Builder – B1", asked: "A deadline he had to move, and how he told the client", talLevel: "Builder – B2",
    talEval: "<p>Tal suggests <b>Builder – B2</b>. Since the last read Omar has started <b>naming problems early</b>. He opened the deadline conversation himself, with a plan, before it slipped.</p><p>What earns B2: a <b>renegotiation he initiated</b> and a clean account of the trade-off he offered the client. Thinner still on delegating the parts he is best at.</p>",
    seedWhy: "B2 matches the shift since May. He now opens the hard conversation rather than waiting for it. Held below B3 because he still holds the work he could hand off.",
    seedStrength: "Opens a difficult conversation early and comes with the trade-off already worked out. Clear with a client under pressure.",
    seedGrowth: "Delegating the work he is strongest at instead of keeping it, and trusting the team with the parts he defaults to owning." },
  { id: "farah", n: "Farah Nasser", st: "report", day: "Thursday 13 August", time: "5:30 PM", kind: "First interview", band: "Explorer, predicted by the quiz", level: "Explorer – E3", asked: "Turning around a report that had gone quiet", talLevel: "Explorer – E3",
    talEval: "<p>Tal suggests <b>Explorer – E3</b>. Farah is <b>specific about people</b>. She named where a report had disengaged and what she changed, with dates.</p><p>What earns E3: a <b>re-engagement she planned and ran</b>, evidenced move by move. What holds it below E4: the strategy behind it was mostly her manager's.</p>",
    seedWhy: "E3 matches the planned, evidenced re-engagement she ran. Below E4 because the strategy was set above her. She executed it well rather than shaping it.",
    seedStrength: "Reads where a person has checked out and acts on it early, with concrete steps and dates rather than a general read.",
    seedGrowth: "Shaping the strategy, not only running it: bringing the plan she would set if the call were hers." },
  { id: "daniel", n: "Daniel Okafor", st: "report", day: "Wednesday 12 August", time: "2:00 PM", kind: "Re-interview", band: "Builder – B2, set 2 June", level: "Builder – B2", asked: "A call that went wrong, and what he did next", talLevel: "Builder – B2",
    talEval: "<p>Tal suggests <b>Builder – B2</b>, unchanged. Daniel is <b>honest about a miss</b>. He walked through a call that went wrong and the repair without softening it.</p><p>What would move it to B3: the repair was sound but <b>reactive</b>. Evidence of a check he put in so the same miss cannot recur is what is missing.</p>",
    seedWhy: "B2 holds: a clear-eyed account of a mistake and a sound repair. Not yet B3 because the fix was reactive, with no system change to stop a repeat.",
    seedStrength: "Names his own miss plainly and repairs it without defensiveness. Quick to make an unhappy stakeholder whole.",
    seedGrowth: "Turning a repair into a guardrail: the change that stops the same failure happening twice." },
  { id: "petra", n: "Petra Nowak", st: "report", day: "Wednesday 12 August", time: "11:00 AM", kind: "First interview", band: "Explorer, predicted by the quiz", level: "Explorer – E1", asked: "Running her first weekly one-to-one", talLevel: "Explorer – E2",
    talEval: "<p>Tal suggests <b>Explorer – E2</b>, one above the quiz. Petra is <b>early but deliberate</b>. She set up her one-to-ones with a real structure rather than a chat.</p><p>What earns E2 over E1: a <b>routine she designed and stuck to</b>, and one example of acting on what it surfaced. Little yet on the harder conversations the routine will eventually raise.</p>",
    seedWhy: "E2 rather than the quiz E1. She designed a real one-to-one routine and acted on it, which is past the E1 line. Below E3 because it has not yet met a hard conversation.",
    seedStrength: "Builds a deliberate routine early rather than winging it, and follows through on what it surfaces.",
    seedGrowth: "The harder conversations a one-to-one eventually raises: naming an issue with someone she has only just started managing." },

  { id: "tom", n: "Tom Whelan", st: "done", day: "Monday 17 August", time: "6:30 PM", kind: "Re-interview", level: "Builder – B1", signed: "17 August", money: "Releases Thursday 20 August", follow: 4.6, depth: 4.8 },
  { id: "nina", n: "Nina Haddad", st: "done", day: "Friday 14 August", time: "4:00 PM", kind: "First interview", level: "Explorer – E4", signed: "15 August", money: "Paid 19 August", follow: 4.3, depth: 4.7 },
];
export const ivById = (id: string) => IVS.find((x) => x.id === id);
export const first = (n: string) => n.split(" ")[0];
/* "Thursday 20 August" → "20 August" (Phase 1 drops the weekday on a card). */
export const dayDate = (d: string) => d.replace(/^\w+ /, "");

/* Phase 1 counts Past Interviews as the agent's lifetime total. */
export const PAST_COUNT = AGENT.ivs;

export type PayRow = { n: string; d: string; s: string; st: "quiet" | "warn" | "green" };
export const PAYMENTS: PayRow[] = [
  { n: "Rafael Ortiz", d: "19 Aug", s: "Funds held", st: "quiet" },
  { n: "Sofia Marek", d: "18 Aug", s: "Recording to confirm", st: "warn" },
  { n: "Tom Whelan", d: "17 Aug", s: "Releases 20 Aug", st: "quiet" },
  { n: "Leah Carr", d: "15 Aug", s: "On hold", st: "warn" },
  { n: "Nina Haddad", d: "14 Aug", s: "Paid 19 Aug", st: "green" },
  { n: "Owen Pryce", d: "13 Aug", s: "Returned", st: "quiet" },
  { n: "Marcus Bell", d: "12 Aug", s: "Paid 17 Aug", st: "green" },
];

/* The payout destination: ONE Stripe reference, not a card wallet (13.1). */
export const PAYOUT = { bank: "Wells Fargo", last: "4417", verified: "12 Jun 2026" };

export const PUB = {
  about: "I came to interviewing from running delivery teams, which is where I learned that what somebody says about a week and what they did in it are two different accounts. I ask for the second one. Eleven years in delivery, six of them managing managers, means most of what I probe for I have had to do myself under a deadline. In the room I am listening for how a decision actually got made — who was there, what was traded off, what you would do differently — not for the version that sounds best in an interview. You will leave with one thing to work on, named plainly, and a report you can point at the evidence for.",
  industries: ["Technology", "Sales"],
  intents: ["Develop in my current role", "Develop for ownership"],
  yrs: "11 yrs", hoursFig: "2–3h",
};
export const SPECIALISMS = ["Delegation", "Hard conversations", "First-time managers", "Delivery under pressure", "Prioritisation", "Stakeholder management", "Coaching for growth", "Remote and hybrid teams"];
export const INDUSTRIES = ["Security", "Franchise ownership", "Retail", "Food and hospitality", "Trades and construction", "Healthcare", "Transportation and logistics", "Sales", "Education", "Technology"];
export const INTENTS = ["Develop in my current role", "Develop for another role", "Develop for ownership"];

export const AGENT_NOTIF_TOGGLES: [string, string, boolean][] = [
  ["New Interview Booking", "Get notified when a candidate books a slot, with their brief attached.", true],
  ["Recommendation Needed", "Get notified after a call when a recommendation is ready to submit.", true],
  ["Payout Updates", "Get notified when held funds are released and payouts arrive.", true],
  ["Product Updates", "Receive portal updates no more than once a month.", false],
];

/* ---- Availability (Phase 1 SLOTS; today is Wed 19 Aug 2026, 2:20 PM) ---- */
export type Slot = { id: string; y: number; m: number; d: number; t: string; iv?: string };
export const CAL_TODAY = { y: 2026, m: 7, d: 19 };
export const CAL_NOW_MIN = 14 * 60 + 20;
export const SLOTS: Slot[] = [
  { id: "s19", y: 2026, m: 7, d: 19, t: "3:00 PM" }, { id: "s19b", y: 2026, m: 7, d: 19, t: "7:00 PM" },
  { id: "s20", y: 2026, m: 7, d: 20, t: "3:00 PM", iv: "rafael" }, { id: "s20b", y: 2026, m: 7, d: 20, t: "5:30 PM" },
  { id: "s21", y: 2026, m: 7, d: 21, t: "5:00 PM" }, { id: "s21b", y: 2026, m: 7, d: 21, t: "7:00 PM" },
  { id: "s22", y: 2026, m: 7, d: 22, t: "1:00 PM" },
  { id: "s24", y: 2026, m: 7, d: 24, t: "6:00 PM", iv: "amara" }, { id: "s24b", y: 2026, m: 7, d: 24, t: "3:00 PM" },
  { id: "s25", y: 2026, m: 7, d: 25, t: "5:00 PM" }, { id: "s25b", y: 2026, m: 7, d: 25, t: "7:30 PM" },
  { id: "s26", y: 2026, m: 7, d: 26, t: "7:00 PM" },
  { id: "s27", y: 2026, m: 7, d: 27, t: "3:00 PM" }, { id: "s27b", y: 2026, m: 7, d: 27, t: "4:00 PM", iv: "marcus" },
  { id: "s27c", y: 2026, m: 7, d: 27, t: "6:00 PM" }, { id: "s27d", y: 2026, m: 7, d: 27, t: "7:30 PM" },
  { id: "s28", y: 2026, m: 7, d: 28, t: "5:00 PM" }, { id: "s28b", y: 2026, m: 7, d: 28, t: "7:00 PM" },
  { id: "s31", y: 2026, m: 7, d: 31, t: "5:00 PM", iv: "yuki" }, { id: "s31b", y: 2026, m: 7, d: 31, t: "3:00 PM" },
  { id: "sp1", y: 2026, m: 8, d: 1, t: "1:30 PM" }, { id: "sp1b", y: 2026, m: 8, d: 1, t: "4:00 PM" },
  { id: "sp2", y: 2026, m: 8, d: 2, t: "6:00 PM", iv: "diego" }, { id: "sp2b", y: 2026, m: 8, d: 2, t: "3:00 PM" },
  { id: "sp3", y: 2026, m: 8, d: 3, t: "5:00 PM" },
  { id: "sp4", y: 2026, m: 8, d: 4, t: "3:00 PM" }, { id: "sp4b", y: 2026, m: 8, d: 4, t: "6:30 PM" },
];
export const SLOT_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
export const SLOT_TIMES = (() => {
  const out: string[] = [];
  for (let m = 8 * 60; m <= 21 * 60; m += 30) {
    const h = Math.floor(m / 60), mm = m % 60;
    out.push(`${((h + 11) % 12) + 1}:${mm === 0 ? "00" : mm} ${h < 12 ? "AM" : "PM"}`);
  }
  return out;
})();
export const CANCEL_REASONS = ["Unwell", "Emergency", "Double booked", "Candidate asked me to", "Other"];

/* ---- The transcript (Phase 1 TX_LINES, Sofia; authored placeholder) ---- */
export const TX_TAGS: [string, string][] = [["all", "Everything"], ["scene", "Marked scenes"], ["delegation", "Delegation"], ["conflict", "Hard conversations"], ["decisions", "Decisions"]];
export const TX: [string, "you" | "them", string, string, boolean][] = [
  ["00:42", "you", "Before we start — nothing here is a test you can fail. Tell me about a handover you planned rather than announced.", "", false],
  ["01:58", "them", "The vendor review. I wrote down who owned each thread and set two checkpoints before I handed it over.", "delegation", true],
  ["03:10", "you", "Who did it go to, and what did you keep hold of?", "", false],
  ["03:24", "them", "It went to my second, Sam. I kept the two checkpoints and the final sign-off, nothing in between.", "delegation", false],
  ["06:47", "you", "Tell me about a conversation you had to open yourself — one nobody handed you.", "", false],
  ["07:05", "them", "Honestly, most of those came to me. I handle them once they land, but I could be earlier.", "conflict", true],
  ["09:31", "you", "When a deadline moved on that review, who made the call to change scope?", "", false],
  ["09:49", "them", "I did. I cut the second checkpoint rather than push the date, and told the team why the same afternoon.", "decisions", true],
  ["12:15", "them", "If I am honest, I planned the handover well but I did not start the hard conversation that the delay needed.", "conflict", false],
  ["14:02", "you", "What would you do differently next time?", "", false],
  ["14:20", "them", "Name the problem before it is urgent, and ask for the time I need instead of absorbing it.", "decisions", false],
];

/* ---- The 15 rungs and the six TALENT letters (agent evaluation, 13.13) ---- */
export const LVL_CODES = ["E1", "E2", "E3", "E4", "E5", "B1", "B2", "B3", "B4", "B5", "T1", "T2", "T3", "T4", "T5"];
export const lvlName = (c: string) => ({ E: "Explorer", B: "Builder", T: "Trailblazer" } as Record<string, string>)[c[0]] + " – " + c;
export const lvlCode = (name?: string) => (name?.match(/[EBT]\d/) ?? [""])[0];
export const TALENT = [
  { k: "t1", c: "T", n: "Top Performer" }, { k: "a", c: "A", n: "Athlete" }, { k: "l", c: "L", n: "Leader" },
  { k: "e", c: "E", n: "Entrepreneur" }, { k: "n", c: "N", n: "Not Sure" }, { k: "t2", c: "T", n: "Team Player" },
];

/* ---- Dates against Phase 1's fixed "today" (Wed 19 Aug 2026) ---- */
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export const ivDate = (day: string) => {
  const [, d, mon] = day.split(" ");
  return new Date(2026, MONTHS.indexOf(mon), Number(d));
};
export const daysOut = (day: string) =>
  Math.round((ivDate(day).getTime() - new Date(CAL_TODAY.y, CAL_TODAY.m, CAL_TODAY.d).getTime()) / 864e5);
/* "Tomorrow" / "Today" / "In 5 days" (Phase 1 crow-x). */
export const relDay = (day: string) => {
  const n = daysOut(day);
  return n === 0 ? "Today" : n === 1 ? "Tomorrow" : `In ${n} days`;
};
const ord = (n: number) => n + (n % 10 === 1 && n !== 11 ? "st" : n % 10 === 2 && n !== 12 ? "nd" : n % 10 === 3 && n !== 13 ? "rd" : "th");
/* The schedule's day block: the weekday alone within a week, else "Thursday, 27th". */
export const schedDay = (day: string) => {
  const wd = day.split(" ")[0];
  return daysOut(day) <= 7 ? wd : `${wd}, ${ord(ivDate(day).getDate())}`;
};
/* The level line a card prints: "Explorer track predicted by quiz" for a first
   interview, "Builder – B1 · Level set 4 March" for a re-interview. */
export const levelLine = (x: Iv) =>
  x.kind === "First interview"
    ? `${(x.band ?? "").split(",")[0]} track predicted by quiz`
    : (x.band ?? "").replace(/, set /, " · Level set ");
export const kindLabel = (x: Iv) => (x.kind === "First interview" ? "First Interview" : "Re-interview");
