/* ============================================================
   PORTALS — the one source for every portal's rail, routes,
   signed-in person and (candidate) journey stages.

   The rail, the app-bar title, the switcher and the static routes are
   all generated from this file, so adding a module is one entry here
   plus its page. Module lists are the Phase 0 decisions
   (PHASE0-DECISIONS.md); do not add a module without Maryam's call.
   ============================================================ */
import adminSeed from "@/data/admin.json";
import type { IconName } from "./icons";

export type PortalKey = "candidate" | "agent" | "admin";

export type NavItem = {
  key: string;              // route segment ("" = the portal's home)
  title: string;            // rail label AND page heading default
  icon: IconName;
  subs?: { key: string; title: string }[];
  stages?: string[];        // candidate: only shown at these stages (undefined = always)
  foot?: boolean;           // drawn in the rail foot (Profile, Settings)
};

export type Portal = {
  key: PortalKey;
  name: string;             // "Candidate", used by the switcher
  person: { name: string; first: string; role: string; img: string };
  nav: NavItem[];
  desktopOnly?: boolean;    // Super Admin: designed and checked at desktop only
};

/* Candidate journey stages, in order. Phase 1 minus consult, enrolPre,
   cancelled, rebook and reddemo (cohort- or credit-based, or demo-only). */
export const STAGES: { key: string; title: string }[] = [
  { key: "nil", title: "Next in Leadership run-up" },
  { key: "signup", title: "Account creation" },
  /* "onboard" (the Tal onboarding) is hidden (Maryam 19 Oct 2026): its questions are asked
     before the candidate reaches the product, so Log In lands on "Just joined". Put this
     line back to bring the flow into the stage menu again; /onboarding/ redirects meanwhile. */
  { key: "new", title: "Just joined" },
  { key: "booked", title: "Interview booked" },
  { key: "resched", title: "Interview reschedule" },
  { key: "held", title: "Interview held, report pending" },
  { key: "assessed", title: "Levelled, not enrolled" },
  /* Self-paced course (Maryam 16 Oct 2026): the keys stay as URL values, the names say where the course is. */
  { key: "week1", title: "Course started" },
  { key: "day34", title: "Course in progress" },
  { key: "day90", title: "Course completed" },
  { key: "promoted", title: "Promoted to E4" },
];
export const DEFAULT_STAGE = "day34";

/* Course Enrollment is in the rail only while there is a course to choose: levelled
   and not yet enrolled, or the course finished and the next one open (Phase 1
   NAVSETS assessed / next; story 18.1 closes it once enrolled). */
const CHOOSING = ["assessed", "promoted"];
const ENROLLED = ["week1", "day34", "day90", "promoted"];
/* Coursework (LightspeedVT) while the course runs; it goes at day 90 (Phase 1 full90 / next). */
const STUDYING = ["week1", "day34"];

export const PORTALS: Record<PortalKey, Portal> = {
  candidate: {
    key: "candidate",
    name: "Candidate",
    person: { name: "Maryam Naz", first: "Maryam", role: "Candidate", img: "/images/people/candidate.jpg" },
    nav: [
      { key: "", title: "Dashboard", icon: "dashboard" },
      { key: "level", title: "My Level", icon: "growth" },
      { key: "enrollment", title: "Course Enrollment", icon: "book", stages: CHOOSING },
      { key: "coursework", title: "Coursework", icon: "book", stages: STUDYING },
      { key: "progress", title: "Course Progress", icon: "chart", stages: ENROLLED },
      { key: "interviews", title: "Interviews", icon: "calendar" },
      { key: "payments", title: "Payments", icon: "wallet" },
      { key: "profile", title: "Profile", icon: "user", foot: true },
    ],
  },
  agent: {
    key: "agent",
    name: "Talent Agent",
    person: { name: "Owen Clarke", first: "Owen", role: "Talent Agent", img: "/images/people/agent.jpg" },
    nav: [
      { key: "", title: "Home", icon: "dashboard" },
      { key: "interviews", title: "Interviews", icon: "calendar" },
      { key: "earnings", title: "Earnings", icon: "wallet" },
      { key: "standing", title: "Standing", icon: "chart" },
      { key: "profile", title: "Profile", icon: "user", foot: true },
    ],
  },
  admin: {
    key: "admin",
    name: "Super Admin",
    desktopOnly: true,
    person: { name: "Derek Sole", first: "Derek", role: "Super Admin", img: "/images/people/admin.jpg" },
    nav: [
      { key: "", title: "Dashboard", icon: "dashboard" },
      { key: "users", title: "Users & Roles", icon: "group", subs: [
        { key: "all", title: "All Users" },
        { key: "roles", title: "Roles & Permissions" },
      ] },
      { key: "catalogue", title: "Course Catalogue", icon: "book" },
      { key: "interviews", title: "Interviews", icon: "video", subs: [
        { key: "all", title: "All Interviews" },
        { key: "recordings", title: "Recording, Scenes & Transcripts" },
      ] },
      { key: "levelling", title: "Levelling", icon: "growth", subs: [
        { key: "log", title: "Levelling Log" },
        { key: "approvals", title: "Level Approvals" },
      ] },
      { key: "onboarding", title: "Onboarding Questions", icon: "document" },
      { key: "finance", title: "Finance & Settlement", icon: "wallet", subs: [
        { key: "transactions", title: "Transactions" },
        { key: "payouts", title: "Payouts" },
        { key: "fees", title: "Fee Settings" },
        { key: "discounts", title: "Discount Codes" },
        { key: "reconciliation", title: "Reconciliation" },
      ] },
      { key: "integrations", title: "Integrations", icon: "link" },
      { key: "settings", title: "Settings", icon: "settings", foot: true },
    ],
  },
};

/* Pages reached from the account menu, not the rail. */
export const ACCOUNT_PAGES: Record<PortalKey, { key: string; title: string }[]> = {
  candidate: [{ key: "gallery", title: "Component Gallery" }],
  agent: [],
  admin: [
    { key: "my-profile", title: "My Profile" },
    { key: "general", title: "General Settings" },
  ],
};

export const href = (p: PortalKey, ...seg: string[]) =>
  "/" + [p, ...seg].filter(Boolean).join("/") + "/";

/* Sub-pages a module reaches from inside itself (not rail items). */
/* The agent's interview records (data/agent.ts IVS ids). */
const AGENT_IV_IDS = ["rafael", "amara", "marcus", "yuki", "diego", "sofia", "grace", "omar", "farah", "daniel", "petra", "tom", "nina"];
const AGENT_KEYS = ["priya", "owen", "lena", "samuel", "hana", "camila"];
export const EXTRA_ROUTES: { portal: PortalKey; slug: string[] }[] = [
  { portal: "candidate", slug: ["interviews", "agents"] },
  ...AGENT_KEYS.flatMap((k) => [
    { portal: "candidate" as PortalKey, slug: ["interviews", "book", k] },
    { portal: "candidate" as PortalKey, slug: ["interviews", "checkout", k] },
  ]),
  { portal: "candidate", slug: ["level", "result"] },
  ...["E1", "E2", "E3", "E4"].flatMap((k) => [
    { portal: "candidate" as PortalKey, slug: ["enrollment", "course", k] },
    { portal: "candidate" as PortalKey, slug: ["enrollment", "pay", k] },
  ]),
  { portal: "candidate", slug: ["interviews", "report", "level"] },
  { portal: "candidate", slug: ["interviews", "report", "re"] },
  ...AGENT_IV_IDS.map((id) => ({ portal: "agent" as PortalKey, slug: ["interviews", id] })),
  ...AGENT_IV_IDS.map((id) => ({ portal: "agent" as PortalKey, slug: ["interviews", id, "transcript"] })),
  { portal: "admin", slug: ["users", "import"] },
  ...["platform", "security"].map((k) => ({ portal: "admin" as PortalKey, slug: ["settings", k] })),
  ...(adminSeed.TXNS as { id: string; type: string }[]).filter((x) => x.type !== "rbcredit").map((x) => ({ portal: "admin" as PortalKey, slug: ["finance", "transactions", x.id] })),
  ...(adminSeed.DISCOUNTS as { id: string }[]).map((x) => ({ portal: "admin" as PortalKey, slug: ["finance", "discounts", x.id] })),
  ...(adminSeed.SETTLEMENTS as { id: string }[]).map((x) => ({ portal: "admin" as PortalKey, slug: ["finance", "reconciliation", x.id] })),
  ...(adminSeed.COURSES as { id: string }[]).map((x) => ({ portal: "admin" as PortalKey, slug: ["catalogue", x.id] })),
  ...(adminSeed.BOOKINGS as { id: string; recExists?: boolean }[]).flatMap((b) => [
    { portal: "admin" as PortalKey, slug: ["interviews", "all", b.id] },
    ...(b.recExists ? [{ portal: "admin" as PortalKey, slug: ["interviews", "recordings", b.id] }] : []),
  ]),
  ...(adminSeed.LEVEL_LOG as { id: string }[]).map((r) => ({ portal: "admin" as PortalKey, slug: ["levelling", "log", r.id] })),
  ...(adminSeed.PAST_IVS as { id: string }[]).map((x) => ({ portal: "admin" as PortalKey, slug: ["levelling", "approvals", x.id] })),
  /* Super Admin: every person's record, and each agent's interviews. */
  ...(adminSeed.USERS as { id: string; name: string; roles: string[] }[]).filter((u) => !u.roles.includes("employer")).flatMap((u) => [
    { portal: "admin" as PortalKey, slug: ["users", "all", u.id] },
    ...(u.roles.includes("agent")
      ? [...(adminSeed.BOOKINGS as { id: string; agent: string }[]).filter((b) => b.agent === u.name).map((b) => b.id),
         ...(adminSeed.PAST_IVS as { id: string; agent: string }[]).filter((x) => x.agent === u.name).map((x) => x.id)]
        .map((iv) => ({ portal: "admin" as PortalKey, slug: ["users", "all", u.id, iv] }))
      : []),
  ]),
];

/* Every static route the export must produce. */
export function allRoutes(): { portal: PortalKey; slug: string[] }[] {
  const out: { portal: PortalKey; slug: string[] }[] = [...EXTRA_ROUTES];
  (Object.keys(PORTALS) as PortalKey[]).forEach((p) => {
    PORTALS[p].nav.forEach((n) => {
      out.push({ portal: p, slug: n.key ? [n.key] : [] });
      n.subs?.forEach((s) => out.push({ portal: p, slug: [n.key, s.key] }));
    });
    ACCOUNT_PAGES[p].forEach((a) => out.push({ portal: p, slug: [a.key] }));
  });
  return out;
}

/* The page a route resolves to: its nav item, its sub (if any), and the heading. */
export function resolve(p: PortalKey, slug: string[]) {
  const [a = "", b] = slug;
  const item = PORTALS[p].nav.find((n) => n.key === a);
  const sub = item?.subs?.find((s) => s.key === b) ?? (item?.subs ? item.subs[0] : undefined);
  const acct = ACCOUNT_PAGES[p].find((x) => x.key === a);
  const title = acct?.title ?? sub?.title ?? item?.title ?? "Not found";
  return { item, sub, acct, title };
}
