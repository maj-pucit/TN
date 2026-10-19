/* ============================================================
   THE SUPER ADMIN'S DATA — Phase 1 tn-admin-portal.html's own records,
   exported as they are in the running page (15 Oct 2026) into admin.json.
   Phase 0 cuts applied at export: the Cohort Leader role and every
   person's cohorts (G8). Employers stay in the records (Phase 1 keeps
   them) but no Phase 0 screen lists them (Phase 1 hides them too).
   The helpers below are Phase 1's own (agentFace, bkStage, agScore, …).
   ============================================================ */
/* eslint-disable @typescript-eslint/no-explicit-any */
import raw from "./admin.json";

const D = raw as any;
export type U = any;

export const USERS: U[] = D.USERS;
export const CANDS: any[] = D.CANDS;
export const COURSES: any[] = D.COURSES;
export const BOOKINGS: any[] = D.BOOKINGS;
export const TXNS: any[] = D.TXNS;
export const PAYOUTS: any[] = D.PAYOUTS;
export const FEE_LOG: any[] = D.FEE_LOG;
export const DISCOUNTS: any[] = D.DISCOUNTS;
export const SETTLEMENTS: any[] = D.SETTLEMENTS;
export const PAST_IVS: any[] = D.PAST_IVS;
export const LEVEL_LOG: any[] = D.LEVEL_LOG;
export const ONBOARDING_Q: any[] = D.ONBOARDING_Q;
export const INTEGRATIONS: any[] = D.INTEGRATIONS;
export const ROLES: any[] = D.ROLES;
export const ME: U = D.ME;
export const RAW = D;

/* A person's face (Phase 1 agentFace): an agent whose first name has a
   portrait gets it; everyone else one of the seven by a stable name hash. */
const FACES: Record<string, string> = {
  priya: "/images/people/av-priya.jpg", owen: "/images/people/av-owen.jpg", lena: "/images/people/av-lena.jpg",
  samuel: "/images/people/av-samuel.jpg", hana: "/images/people/av-hana.jpg",
  faceW: "/images/people/call-art-facew.webp", faceM: "/images/people/call-art-facem.webp",
};
const POOL = Object.values(FACES);
export function face(name: string) {
  const n = String(name || "").trim();
  const f = n.toLowerCase().split(/\s+/)[0];
  if (FACES[f]) return FACES[f];
  let h = 0; for (const ch of n) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return POOL[h % POOL.length];
}

export const money = (n: number) => "$" + Math.round(n).toLocaleString("en-US");
/* An interview's price has two fixed parts (Maryam 19 Oct 2026): the talent agent's fee,
   paid to the agent in full, and the platform fee TalentNext adds on top. Candidates pay
   the sum. Both are set by a Super Admin per agent. PLATFORM_FEE is the default for an
   agent with none set (AUTHORED PLACEHOLDER until the client names a figure). */
export const PLATFORM_FEE = 25;
export const agentFee = (u: { fee?: number }) => u.fee || 0;
export const platformFee = (u: { platformFee?: number }) => u.platformFee ?? PLATFORM_FEE;
export const candidatePrice = (u: { fee?: number; platformFee?: number }) => agentFee(u) + platformFee(u);
export const AGENTS = () => USERS.filter((u) => u.roles.includes("agent"));
export const agScore = (a: U) => (a.scoreApproved === false ? a.startingScore : a.approvedScore ?? a.rating) as number;
export const bkStage = (b: any) => (b.stage || "booked") as string;
/* CUT (G-rebook): the rebooking credit is gone from Phase 0, so Resolve and the
   "Awaiting candidate" stage it led to go with it; a Not-held booking is final. */
BOOKINGS.forEach((b) => { if (b.stage === "awaitcand") b.stage = "resolved"; });
export const BK_STAGE: Record<string, string> = Object.fromEntries(Object.entries(D.BK_STAGE as Record<string, string>).filter(([k]) => k !== "awaitcand"));
export const BK_STAGE_ORDER: string[] = (D.BK_STAGE_ORDER as string[]).filter((k) => k !== "awaitcand");
const BK_STAGE_HUE: Record<string, string> = D.BK_STAGE_HUE;
export const bkStageTone = (b: any): [Tone, string] => [toneOf(BK_STAGE_HUE[bkStage(b)] || ""), BK_STAGE[bkStage(b)]];
export const isRe = (kind: string) => /re-?interview/i.test(String(kind || ""));
export const bkFirst = (b: any) => /first/i.test(String(b.kind || ""));
export const bkType = (b: any) => (isRe(b.kind) ? "Re-interview" : "First interview");
export const bkFunding = (b: any) => (bkFirst(b) ? "First-interview discount" : "Candidate");
export const bkPaid = (b: any) => (bkFirst(b) ? 0 : b.fee || 0);
const BK_ESCROW: Record<string, [string, string]> = D.BK_ESCROW;
export const bkEscrow = (e: string): [Tone, string] | null => { const m = BK_ESCROW[e]; return m ? [toneOf(m[0]), m[1]] : null; };
/* Dates: MM-DD-YYYY and a bare 12-hour time (Phase 1 dpFmt / slot12). */
export const dpFmt = (iso: string) => { const m = String(iso || "").match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? `${m[2]}-${m[3]}-${m[1]}` : String(iso || ""); };
export function slot12(slot: string) {
  const m = String(slot || "").match(/(\d{1,2}):(\d{2})/);
  if (!m) return String(slot || "");
  let h = +m[1]; const ap = h < 12 ? "AM" : "PM"; h = h % 12 || 12;
  return `${h}:${m[2]} ${ap}`;
}
export const bkWhen = (b: any) => `${dpFmt(b.date)}${b.slot ? " · " + slot12(b.slot) : ""}`;
export const emailOf = (n: string) => USERS.find((u) => u.name === n)?.email || "";
export const candEmail = (n: string) => emailOf(n) || (n ? String(n).trim().toLowerCase().replace(/[^a-z\s]/g, "").replace(/\s+/g, ".") + "@talentnext.io" : "");
export const candByName = (n: string) => CANDS.find((c) => c.name === n);
export const scenesConsent = (b: any) => b.scenesWithdrawn ? "Withdrawn" : candByName(b.cand)?.consent?.scenes ? "Given" : "Not asked";
export const recStatus = (b: any) => (b.recDeleted ? "Deleted" : "Available");

/* Platform figures, exactly as Phase 1 reads them off the seed. */
export const people = () => USERS.filter((u) => !u.roles.includes("employer"));
export const heldPayouts = () => PAYOUTS.filter((p) => p.status === "held" && p.net).length;
export const grossProcessed = () => TXNS.filter((t) => t.dir === "in" && t.amt).reduce((n, t) => n + t.amt, 0);
export const inProgress = () => TXNS.filter((t) => t.status === "pending").reduce((n, t) => n + t.amt, 0);
export const platTake = () => PAYOUTS.reduce((n, p) => n + p.gross, 0) - PAYOUTS.reduce((n, p) => n + p.net, 0);

/* ---- Status as coloured text (Phase 1 tag + TAGV) ---- */
export type Tone = "green" | "warn" | "red" | "plain";
const TAGV: Record<string, string> = D.TAGV;
export const toneOf = (key: string): Tone => ((TAGV[String(key || "").toLowerCase()] || "plain") as Tone);
const cap = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s);
export { cap };

/* ---- Roles ---- */
export const ROLE_BY_K: Record<string, any> = Object.fromEntries(ROLES.map((r) => [r.k, r]));
export const STAFF_ROLE_KEYS: string[] = D.STAFF_ROLE_KEYS;
export const staffRole = (u: U) => (u.roles || []).find((r: string) => (ROLE_BY_K[r] || {}).kind === "internal") || (u.roles || [])[0];
export const staffRoleName = (u: U) => (ROLE_BY_K[staffRole(u)] || {}).name || "—";
const mainRole = (u: U) => ["candidate", "agent", "employer"].find((r) => u.roles.includes(r)) || u.roles[0] || "—";
export const userTypeName = (u: U) => (u.internal ? staffRoleName(u) : (ROLE_BY_K[mainRole(u)] || {}).name || "—");
/* Role filter (CUT G8: Cohort Leader). Internal roles by their own names. */
export const ROLE_FILTER: [string, string][] = [["all", "All"], ["candidate", "Candidate"], ["agent", "Talent Agent"],
  ...STAFF_ROLE_KEYS.filter((k) => k !== "admin").map((k) => [k, ROLE_BY_K[k]?.name] as [string, string])];
export const roleGroup = (rf: string) => (rf === "all" ? "all" : STAFF_ROLE_KEYS.includes(rf) ? "internal" : rf);
export const roleMatch = (u: U, rf: string) => rf === "all" ? true
  : STAFF_ROLE_KEYS.includes(rf) ? !!u.internal && staffRole(u) === rf
  : !u.internal && u.roles.includes(rf);
/* All Users lists every account bar Super Admins and employers (Phase 1 usersBase). */
export const usersBase = () => USERS.filter((u) => !u.roles.includes("employer") && !(u.internal && staffRole(u) === "admin"));

/* ---- Account status: Invited (pending / expired) · Active · Deactivated ---- */
export function inviteDaysLeft(u: U) {
  if (!u.invitedOn) return null;
  const [mm, dd, yy] = String(u.invitedOn).split("-").map(Number);
  return Math.ceil((new Date(yy, mm - 1, dd).getTime() + 7 * 864e5 - Date.now()) / 864e5);
}
export const userStatusKey = (u: U) => u.status === "invited"
  ? ((inviteDaysLeft(u) ?? 1) <= 0 ? "invexpired" : "invpending")
  : u.status === "ok" ? "active" : u.status;
export const USER_STATUS_OPTS: [string, string][] = D.USER_STATUS_OPTS;
const STATUS_LABEL: Record<string, string> = D.USER_STATUS_LABEL;
/* [tone, words] for an account's status cell. */
export function userStatus(u: U): [Tone, string] {
  if (u.status === "invited") {
    const d = inviteDaysLeft(u);
    if (d == null) return ["warn", "Invited"];
    return d <= 0 ? ["red", "Invitation Expired"] : ["warn", `Expires in ${d} day${d === 1 ? "" : "s"}`];
  }
  const k = u.status === "ok" ? "active" : u.status;
  return [toneOf(k), STATUS_LABEL[u.status] || cap(u.status)];
}

/* ---- Candidates ---- */
export const CAND_BY_ID: Record<string, any> = Object.fromEntries(CANDS.map((c) => [c.id, c]));
export const userCand = (u: U) => CAND_BY_ID[u.id] || null;
export const candLevel = (u: U) => { const c = CAND_BY_ID[u.id]; return (c && c.level) || (u.level && u.level !== "—" ? u.level : "") || "Not yet levelled"; };
export const userTrack = (u: U) => (userCand(u)?.bucket) || "—";
export const LVL_CODES = ["E1", "E2", "E3", "E4", "E5", "B1", "B2", "B3", "B4", "B5", "T1", "T2", "T3", "T4", "T5"];

/* ---- Talent agents: listing state is gate-derived (6.4) ---- */
export const agRange = (a: U) => (a.range || ["E2", "B1"]) as [string, string];
export const rangeLabel = (r: [string, string]) => (r[0] === r[1] ? r[0] : `${r[0]} to ${r[1]}`);
export const rangeCovers = (r: [string, string], l: string) => LVL_CODES.indexOf(l) >= LVL_CODES.indexOf(r[0]) && LVL_CODES.indexOf(l) <= LVL_CODES.indexOf(r[1]);
export const agTraining = (a: U) => (a.training || "complete") as "complete" | "notcomplete" | "overridden";
const agDeactivated = (a: U) => a.status === "inactive" && (a.erasure || a.deactivatedOn);
export function gateReasons(a: U) {
  const r: string[] = [];
  if (a.status === "invited" || agDeactivated(a)) r.push("Account is not active");
  if (!(a.payoutMethod || PAYOUTS.some((p) => p.agent === a.name && p.method && p.method !== "—"))) r.push("No payout destination on file");
  if (agTraining(a) === "notcomplete") r.push("LightspeedVT training not complete");
  if (!(a.profileOK !== false && !!a.fee)) r.push("Public profile or fee not complete");
  return r;
}
export const agState = (a: U) => a.status === "invited" ? "invited"
  : agDeactivated(a) ? "deactivated"
  : a.paused || a.status === "inactive" ? "paused"
  : gateReasons(a).length === 0 ? "listed" : "notlisted";
export const AG_STATE: Record<string, [string, string]> = D.AG_STATE;
export const agStateTone = (a: U): [Tone, string] => { const [v, l] = AG_STATE[agState(a)]; return [toneOf(v), l]; };
export const agTrainTone = (a: U): [Tone, string] => {
  const t = agTraining(a);
  return t === "overridden" ? ["warn", "Overridden"] : t === "notcomplete" ? ["warn", "Not complete"] : ["green", "Complete"];
};

/* ---- Where a person's record lives (Phase 0 routes) ---- */
export const personHref = (u: U) => `/admin/users/all/${u.id}/`;
export const USER_BY_ID: Record<string, U> = Object.fromEntries(USERS.map((u) => [u.id, u]));
export const userByName = (n: string) => USERS.find((u) => u.name === n);
