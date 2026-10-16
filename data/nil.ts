/* ============================================================
   THE NEXT IN LEADERSHIP RUN-UP — Phase 1 nil.js, copied as it renders.
   The live path is quiz → phone → result → Create Account. Phase 1 also
   defines consult1 / consult2 / done and a "Check your email" modal, but
   nothing reaches them any more (Continue goes straight to Create Account,
   Maryam 13 Oct 2026), so they are not ported. PHASE0-DECISIONS.md C-NIL.
   ============================================================ */
import type { IconName } from "@/lib/icons";

export const NIL_SCREENS = ["quiz", "phone", "result"] as const;
export type NilScreen = (typeof NIL_SCREENS)[number];

export const NIL_NAV = ["Home", "Leadership", "Entrepreneurship", "Podcast", "About"];

export const NIL_FIELDS: { id: string; label: string; type: string; ph: string; span?: boolean }[] = [
  { id: "first", label: "First name", type: "text", ph: "First name" },
  { id: "last", label: "Last name", type: "text", ph: "Last name" },
  { id: "email", label: "Email address", type: "email", ph: "you@example.com", span: true },
  { id: "phone", label: "Phone number", type: "tel", ph: "(555) 123-4567" },
  { id: "zip", label: "Zip code", type: "text", ph: "12345" },
];

export const NIL_RESULT = {
  hey: "Hey Maryam! You are a",
  type: "Builder",
  title: "The Independent Expert",
  body: "You enjoy creating results through quality work, independence, and ownership. You’d rather build something than simply maintain it.",
  traits: ["Values quality over complexity.", "Builds trusted relationships.", "Wants control over their schedule."],
  ideas: [
    ["truck", "Supply Chain Manager", "Streamlines logistics and operations flow."],
    ["verified", "Quality Assurance Manager", "Ensures product standards and quality."],
    ["user", "Product Owner", "Drives product vision and priorities."],
    ["lightning", "Electrician Business Owner", "Runs electrical services company operations."],
    ["dashboard", "Process Improvement Specialist", "Optimizes workflows and reduces costs."],
  ] as [IconName, string, string][],
  next: "Download the Builder Playbook, access the Builder Toolkit, or connect with a TALENT Next Agent.",
  share: "Know someone else trying to figure out their next step? Share this quiz with them.",
};

/* The three platform logos on the share pill: the platforms' own glyphs,
   drawn filled (a logo is not a UI mark). 24-box paths from Phase 1 NILP. */
export const NIL_SOCIAL = {
  ig: "M12 2.2c3.2 0 3.6 0 4.85.07 1.17.05 1.8.25 2.23.42.55.21.95.47 1.37.89.42.42.68.82.89 1.37.17.42.37 1.06.42 2.23C21.83 8.4 21.85 8.8 21.85 12s0 3.6-.07 4.85c-.05 1.17-.25 1.8-.42 2.23-.21.55-.47.95-.89 1.37-.42.42-.82.68-1.37.89-.42.17-1.06.37-2.23.42-1.25.06-1.65.07-4.85.07s-3.6 0-4.85-.07c-1.17-.05-1.8-.25-2.23-.42a3.7 3.7 0 0 1-1.37-.89 3.7 3.7 0 0 1-.89-1.37c-.17-.42-.37-1.06-.42-2.23C2.17 15.6 2.15 15.2 2.15 12s0-3.6.07-4.85c.05-1.17.25-1.8.42-2.23.21-.55.47-.95.89-1.37.42-.42.82-.68 1.37-.89.42-.17 1.06-.37 2.23-.42C8.4 2.17 8.8 2.15 12 2.15zM12 7.1a4.9 4.9 0 1 0 0 9.8 4.9 4.9 0 0 0 0-9.8zm0 8.08a3.18 3.18 0 1 1 0-6.36 3.18 3.18 0 0 1 0 6.36zM18.35 6.9a1.15 1.15 0 1 1-2.3 0 1.15 1.15 0 0 1 2.3 0z",
  li: "M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM3 9h4v12H3V9zm6.5 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.75V21h-4v-5.9c0-1.4-.03-3.2-1.98-3.2-1.98 0-2.28 1.52-2.28 3.1V21h-4V9z",
  yt: "M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.28 5 12 5 12 5s-6.28 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2C2 8.77 2 12 2 12s0 3.23.4 4.8a2.5 2.5 0 0 0 1.76 1.77C5.72 19 12 19 12 19s6.28 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77C22 15.23 22 12 22 12s0-3.23-.4-4.8zM9.98 15.02V8.98L15.2 12l-5.22 3.02z",
};
