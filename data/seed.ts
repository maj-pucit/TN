/* ============================================================
   THE SHARED SEED — one dataset for all three portals (decision G11).
   The candidate the Candidate portal signs in as, the agents she can
   book, the bookings an agent sees, and the rows Super Admin lists are
   the SAME records. Ported from Phase 1's seeds as each module lands;
   where Phase 1's three seeds disagree on a name or figure, the
   candidate portal's value wins. Authored placeholder data is flagged.
   ============================================================ */

/* Names are Phase 1 AGENTS (data.js:629-640). Emails are authored placeholder.
   FLAG: Phase 1 uses the av-hana photo for BOTH the candidate (Maryam) and the
   agent Hana Kim; a shared seed shows that face twice. Needs a call. */
export type Person = { id: string; name: string; email: string; img: string };

export const PEOPLE = {
  maryam: { id: "u4", name: "Maryam Naz", email: "maryam.naz@example.com", img: "/images/people/candidate.jpg" },
  priya: { id: "a1", name: "Priya Nair", email: "priya.nair@example.com", img: "/images/people/av-priya.jpg" },
  owen: { id: "a2", name: "Owen Clarke", email: "owen.clarke@example.com", img: "/images/people/av-owen.jpg" },
  lena: { id: "a3", name: "Lena Fischer", email: "lena.fischer@example.com", img: "/images/people/av-lena.jpg" },
  samuel: { id: "a4", name: "Samuel Adeyemi", email: "samuel.adeyemi@example.com", img: "/images/people/av-samuel.jpg" },
  derek: { id: "u9", name: "Derek Sole", email: "derek.sole@example.com", img: "/images/people/admin.jpg" },
} satisfies Record<string, Person>;
