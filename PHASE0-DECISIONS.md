# TalentNext Phase 0: design decisions

**For the development team.** This is the design side's final call on what Phase 0 contains:
which portals, which modules, which screens and which flows, and what was taken out of Phase 1
and why.

Owner: Maryam Naz (design). Decided 15 Oct 2026.

---

## 1. What Phase 0 is

Phase 0 is the **minimum flow** the product needs by the development deadline. It is a **copy** of
the Phase 1 designs, with a defined set of features removed. Nothing is redesigned. If a screen or
flow is not listed as cut below, it is exactly as it is in Phase 1.

- **Three portals:** Candidate, Talent Agent, Super Admin.
- **Built in:** Next.js (React + TypeScript), on one design system, so all three portals share the
  same type, spacing, colours and components.
- **Lives on:** the `phase-0` branch of the TN repo. Its Vercel preview link is the reference.

## 2. Decisions that apply to every portal

| # | Decision |
|---|---|
| G1 | **Three portals only.** The portal switcher (the account menu under the profile photo, top right) lists Candidate, Talent Agent and Super Admin. **The Cohort Leader portal is not in Phase 0.** |
| G2 | **No Tal chat.** The floating "Ask Tal" bar and the Tal conversation screen are removed from Candidate and Talent Agent. |
| G3 | **No "Summary by Tal".** The summary band at the top of pages is removed everywhere. |
| G4 | **The page gradient stays.** The soft red-to-white gradient that sat behind "Summary by Tal" now belongs to the page itself: the top of every page carries it, on all three portals. |
| G5 | **Every page has a page heading** (title + description), since there is no summary band. |
| G6 | **Dashboards greet the user:** "Good morning / afternoon / evening, {first name}". |
| G7 | **Tal stays in three places only:** "Tal recommends" on the candidate dashboard; "Tal's read" on the talent agent's evaluation screen; Tal's proposal on the Super Admin Level Approval page. |
| G8 | **No cohorts at all.** No cohort pages, cohort calls, members, messages, cohort leaders or leader evaluations. A candidate enrols in a course and takes it on their own. |
| G9 | **No points, ranks, achievements or certifications** anywhere. |
| G10 | **Responsive:** Candidate and Talent Agent work on phone, tablet and desktop (390 / 744 / 1024 / 1280 px). **Super Admin is desktop only.** |
| G11 | **One consistent dataset:** the same people, bookings, payments and courses appear in all three portals. |
| G12 | **Prototype controls stay:** a journey-stage picker (candidate) and a Mobile / Tablet / Desktop frame switch, in the menu at the bottom right. These are for demos and reviews, not product UI. |
| G13 | **The look is Phase 1's, measured.** Buttons, text styles and the Tal mark were checked against Phase 1 in the browser on every screen of all three portals (15 Oct 2026), not copied from memory. Where a screen differs, it is a G2–G9 cut or the G5 page heading. Details for designers are in `DESIGN.md` §3, §6 and §8. |

## 3. Candidate portal

**Journey stages** (the candidate moves through these in order):

Next in Leadership quiz → Account creation → Onboarding → Just joined → Interview booked →
Interview reschedule → Interview held, report pending → Levelled, not enrolled → Week 1 → Day 34 →
Day 90, course finished → Promoted.

**Side navigation:**

| Module | Shown | Notes |
|---|---|---|
| Dashboard | always | |
| My Level | always | |
| Course Enrollment | once levelled | |
| Course Progress | once enrolled | |
| Interviews | always | |
| Payments | always | |
| Profile | always (rail foot) | |
| Logout | always (rail foot) | Asks for confirmation |

### 3.1 Before the product (unchanged from Phase 1)
- **Next in Leadership run-up:** the quiz's last step (contact details), the phone check (6-digit
  code), the result ("You are a Builder"). "Continue your journey on TALENTnext" goes to account
  creation.
  - **Built (15 Oct 2026), `/nil/quiz/` → `/nil/phone/` → `/nil/result/`:** in the microsite's own
    brand (navy and lime, a condensed display face), from its own `--nil-*` tokens. The stage
    picker's "Next in Leadership run-up" opens it. Below 900 the site bar keeps only the mark and
    the quiz button, and the result's two columns stack.
  - **Not ported, because Phase 1 no longer reaches them:** the consultant form (two steps), the
    "You're in!" hand-off and the "Check your email" modal. Phase 1 still defines them, but since
    13 Oct 2026 Continue goes straight to account creation.
  - **Flag:** the NIL logo is a drawing of the mark, and the navy/lime/grey were sampled by eye
    from screenshots. Swap in the real logo file and brand colours when they arrive (one token
    each).
- **Account creation:** create account → set password (consent boxes; the CTA stays disabled until
  both required boxes are ticked) → log in. Forgot password: Reset Password → Enter Code → Set New
  Password → Log In. Terms.
  - **Built (15 Oct 2026), `/auth/<screen>/`:** create, login, forgot, reset (with the code step),
    terms, on the photo-slider brand panel.
- **Onboarding:**
  - The welcome → a 2-second loader → the five onboarding questions (one per screen, with a
    progress bar, Previous / Next) → "You're all set" → "Find an Agent" (loader) → dashboard.
  - The questions are the ones Super Admin manages in **Onboarding Questions**.
  - **Built (15 Oct 2026), `/onboarding/`.**

### 3.2 Dashboard
- The greeting heading, then the content for the candidate's stage, as in Phase 1:
  - **Just joined:** "Tal recommends" black card (agent recommendation; first interview shown as
    "~~$95~~ Free"), quick actions (including Open Quiz Results → quiz results modal).
  - **Interview booked / reschedule:** the scheduled interview card; Join (disabled until 1 minute
    before the start); "Interview booked" confirmation. On the reschedule stage the card reads
    "In 2 days" with a Reschedule button.
  - **Interview held:** "your report is on its way" (24-hour promise).
  - **Levelled:**
    - The level reveal modal on first landing.
    - The recommended-course black card with "View Course" and "View other courses".
  - **Enrolled (Week 1 / Day 34 / Day 90):** the 90-day progress and quick actions.
  - **Promoted:** the next-level offer.
- **Removed:** the cohort pre-start block, the points pulse, the certificate banner, any cohort copy.
- **Layout on every stage:** greeting, then "Your journey so far" (before enrolling) or "Your
  90-Day Progress" (once enrolled), then one black card, then Quick Actions.
- **Detail cuts that follow from G2 / G8 / G9:**
  - Quick actions that opened the Tal chat are removed: "Quick-Start Preparation", "What to
    Bring", "What Happens Next".
  - "Your Standing" (points) is removed.
  - "Current Focus" now opens Course Progress, because Coursework is not a Phase 0 module.
  - The Learning Pulse card keeps its sentence but drops "Open chapter N" and the "Your Next
    Call · Cohort Leader" row.
  - The course offer drops "Cohort starts …", "Cohort Leader: …" and the Cohort seats cell.
  - The journey's fourth step reads "90-Day Journey" (was "90-Day Cohort Journey").

### 3.3 My Level
- Kept:
  - level card (level, provenance "set by TalentNext")
  - "How the Ladder Works"
  - quiz results
  - **Report** (interview report, with Scenes)
  - **Result** sub-pages
- **Removed:** the Ranking board (points) and the certificate banner.
- **Built (15 Oct 2026):**
  - `/candidate/level/`: the level card (before the interview it shows the Explorer track, 1–5 of
    15; after, the level and its rung) and "How the Ladder Works".
  - `/candidate/level/result/`: the quiz result.
  - The dashboard's "Open Quiz Results" opens the quiz modal.
  - The interview report lives at `/candidate/interviews/report/`.

### 3.4 Course Enrollment (changed)
- **The module opens on the course list**: the same list "View other courses" shows on the
  dashboard. Previously it opened straight on the one recommended course.
- The candidate opens any course → the course page → pays → enrolled.
- **Course price:** $690, charged in full, no interview credit.
- Payment uses a saved card (the card picker), or adds one through the Stripe modal.
- **Built (15 Oct 2026):**
  - `/candidate/enrollment/`: the course list, four courses, the recommended one marked.
  - `course/<E1..E4>/`: the course card with "Continue to payment", then the Course Outline
    (13 chapters, each with what you'll learn and skills).
  - `pay/<E1..E4>/`: saved cards, "Pay $690 and start".
- **Paying moves the candidate to Week 1** and shows "Enrollment Confirmed". Phase 1 went to
  "Enrolled, cohort not started", which is cut (G8).
- **Removed (G8 / G9):** "Cohort starts …", "Cohort Leader: …", the Cohort seats cell, and "Earn
  your … certificate".
- **Flagged:** Phase 1 shows the same 13-chapter outline for every course; per-course chapters are
  not in its data.

### 3.5 Course Progress
- Kept:
  - the four course figures
  - the **performance graph**
  - **Progress by chapter** (read-only; the learning itself happens in LightSpeedVT)
  - the course rating (day 90)
  - the next-course offer
- **Changed:** the graph's dashed comparison line is the **course average**, not the cohort average.
- **Removed:** points, cohort wording, links to Coursework and Messages.
- **Built (15 Oct 2026), `/candidate/progress/`:**
  - Week 1, Day 34 and Day 90: the learning pulse (until Day 90), the four figures, the
    performance graph against the **course average 79%**, and progress by chapter (5 shown, "Show
    All 13").
  - Day 90 adds the "How would you rate this course?" capsule at the foot.
  - Promoted shows the E4 course offer above "Your Explorer Track – E3 record".
- **Matched to Phase 1 (Maryam's recording, 15 Oct 2026):**
  - The Learning Pulse card is one heading row: sparkle + title, the sentence ("12 minutes" in
    bold), and **Open Chapter N →** on the right.
  - The graph's legend sits at the right of the "Your performance" heading. The key insight has
    the red sparkle, a hairline above it, and an edgeless "View Scores".
  - Chapter rows have no hairlines: the green tick sits after a finished chapter's name, a growth
    area is a small red mark + "Your growth area", and the right end is **Restart** (done),
    **Resume** (open), the padlock with "Opens <date>" (a later week) or an empty ring (not
    started). "Show all 13 ⌄" / "Show the first five ⌃".
  - **Open Chapter N, Restart and Resume open LightSpeedVT in a new tab.** In Phase 1 they opened
    Coursework, which is not a Phase 0 module; the learning itself happens in LightSpeedVT.
- **Detail cuts:**
  - The cohort name in the record's title (G8).
- **Flagged:** Phase 1 marks chapters 4, 5 and 12 as growth areas on the rows, but its record
  text names 4 and 12. Copied as Phase 1 has it.

### 3.6 Interviews
- **Booking:**
  - Choose an agent (agents list / marketplace).
  - **First interview is free:** it goes straight to the calendar → pick a slot → "Interview
    booked".
  - **Re-interview is paid:** payment step (saved card or add card) → payment success → calendar →
    pick a slot → "Interview booked".
  - The candidate can add "What to talk about" at booking.
- **Upcoming:** the scheduled card with Join (gated) and **Reschedule** (reopens the agent's
  calendar, no new charge).
- **The live interview call screen** (when the candidate presses Join).
- **Interview report:**
  - the summary
  - **Scenes:** choose scenes, buy additional scenes
  - the agent rating (asked while the report is pending)
- **Past interviews.**
- **Removed:** cancel-interview (with reason) and the rebooking-credit flow ("interview could not
  take place").
- **Built (15 Oct 2026), routes under `/candidate/interviews/`:**
  - the module page
  - `agents/` (All Agents)
  - `book/<agent>/` (the calendar: Calendly embedded as a picture)
  - `checkout/<agent>/` (re-interview only)
  - `report/<level|re>/`
- **Detail cuts that follow from G2:**
  - The "Ask Tal" control on each agent row is removed.
  - "Ask Tal: Why were these scenes selected…" under the scene chooser is removed.
- **Flagged, copied as Phase 1 has it:**
  - The re-interview report (Promoted) shows the E4 level card over the first interview's
    details (August 20, "an E3, not an E2"). A real re-interview write-up is needed.
  - Agent Hana Kim and the candidate Maryam share one photo.
  - Phase 1's "Interview Booked!" dialog said "$95 Free" after a paid re-interview. Phase 0
    shows the charged amount.

### 3.7 Payments
- Unchanged:
  - previous transactions
  - receipt (opens as a modal)
  - your cards
  - add card (Stripe modal)
- **Built (15 Oct 2026), `/candidate/payments/`:** Previous Transactions (what has been paid by
  the stage: E2 course, the complimentary interview, the E3 course, the re-interview) with a
  receipt modal, and Your Cards. Remove asks for confirmation first.

### 3.8 Profile
- **Tabs:** My Profile · Linked Accounts · My Courses · Notifications · Privacy Settings.
- **My Profile:**
  - general details (in-place edit)
  - photo picker (profile image / avatar)
  - work, education, licences, skills
  - interview scenes (with share)
- **Privacy Settings:** sign-in and security, legal notices, close account.
- **Removed:** "Volunteer to lead a Cohort", the rank chip.
- **Built (15 Oct 2026), `/candidate/profile/`:**
  - **My Profile:**
    - The identity head with Edit Details (in place; the photo pencil opens the picker, Profile
      Image / Avatar).
    - The facts band: track, level, courses taken, role, industry, years, aspiration.
    - About Me and the interview scenes row.
    - Experience, Education, and Licenses & certifications, each with an in-place edit form.
    - Skills (chips, add/remove) and Log Out.
  - **Linked Accounts:** six networks; tapping one connects or disconnects it.
  - **My Courses:** the three course rows, each opening to the four figures.
  - **Notifications:** email toggles, plus the Always On list.
  - **Privacy Settings:** Sign-In & Security (Reset Password in place), Delete My Account (with
    confirmation), and the four legal notices.
- **Detail cuts:**
  - The Points figure and the Rank chip (G9).
  - "Ask Tal" under the scenes (G2).
  - "Weekly Call Reminders" and the always-on "Your Cohort" row (G8).
  - Data Use clause 4, "Tal, Your Assistant" (G2).
  - Legal clauses about cohort calls, the cohort leader, points and certificates.
- **Changed:** "Employment type" is our dropdown, not a native select (DESIGN.md rule).
- **Flagged:** the legal notices need legal review before launch.

## 4. Talent Agent portal

**One stage only: the working week** (booked interviews, evaluations, earnings). The "setting up"
and "after a review" stages are not in Phase 0, so the agent portal has no stage picker.

**Side navigation** (Phase 1's own words and marks): Home · Interviews · Availability · Earnings ·
Standing · rail foot: Profile, Log out. Log out returns to the candidate portal's Log In screen,
which is where an agent signs in (Phase 1, 4 Sep 2026).

**Built (15 Oct 2026), every module below, at 390 / 744 / 1024 / 1280.** Copied from Phase 1 as it
renders on the working week (`tn-agent-portal.html`, read the same day). The calendar and
interview dates sit on Phase 1's fixed "today", Wednesday 19 August 2026, 2:20 PM.

### 4.1 Dashboard
- The greeting heading, **Your earnings** ($612 earned this month, $204 awaiting release, the
  segmented bar, 9 interviews · $68 fee · $255 gross held), the upcoming interview card with
  **Join Call** (gated), and quick actions (Recordings to Confirm, Upcoming Interviews).
- "Your earnings" is the same component as the candidate's "Your 90-Day Progress".

### 4.2 Interviews
- **Tabs:** Upcoming · Pending Recommendations · Past Interviews.
- **Interview detail, upcoming:**
  - candidate brief
  - "Before the interview"
  - cancel (with reason; Keep the interview)
- **Evaluation (pending recommendation):**
  - the interview figures and the recording
  - **Tal's read** (one paragraph, Tal's suggested level, TALENT letters)
  - the agent's recommendation:
    - the 15-level ladder picker
    - TALENT letters (pick 1–6)
    - why this level
    - why not Tal's level (only when they differ)
    - strengths
    - growth areas
    - anything else
  - **Save Draft** / **Send Recommendation** (confirmation; sending returns to Interviews)
  - Tal's read renders as Phase 1 renders it today: a few short paragraphs with the key phrases
    highlighted, then "Tal identifies {name} as a {letter}".
- **Done:** outcome, recording, fee.
- **Transcript page:** search, topic filters.
- **Removed:** the "Cohort Leader Evaluation" row and sheet.

### 4.3 Availability
- Calendar with Daily / Weekly / Monthly views and Today plus previous/next arrows.
- **Add a slot:** day + start/end time, Save Slot. The new slot appears on the calendar.
- Close a slot (with confirmation).

### 4.4 Earnings
- This month.
- "What's holding up your pay" (up to two, each with **Send Recommendation**, which is what Phase 1
  renders today; DESIGN.md's 2 Oct note says "Evaluate {name} →").
- Payments.
- **Where you get paid:** one payout destination and its state, plus Update Payout Destination
  through the Stripe modal.

### 4.5 Standing
- The eight-figure grid:
  - your score
  - your rank in browse
  - interview score
  - candidate rating
  - interviews held
  - position in browse
  - cancelled
  - late cancellations
- Your review (reviewer with photo, cadence, last and next review).

### 4.6 Profile
- **Tabs:** My Profile · Public Profile · Notifications · Privacy Settings.
- My Profile: general details (in-place edit, including the interview fee with a live "you keep"
  line and a fee-change confirmation), about, specialities, industries, intents.
- Public Profile: the identity (★ rating · range), Interview Fee / Availability / Evaluation
  Time / Experience, about, specialities, industries, intents.
- Notifications: the four switches. Privacy: sign-in and security (inline password reset) and
  Delete Account (confirmation).
- **Removed:** the training-module status and certification copy.
- **Not built in either portal yet:** the notification panel behind the bell (the bell and its
  count are drawn).

## 5. Super Admin portal (desktop only)

**Side navigation:**
- Dashboard
- Users & Roles
  - All Users
  - Roles & Permissions
- Course Catalogue
- Interviews
  - All Interviews
  - Recording, Scenes & Transcripts
- Levelling
  - Levelling Log
  - Level Approvals
- Onboarding Questions
- Finance & Settlement
  - Transactions
  - Payouts
  - Fee Settings
  - Discount Codes
  - Reconciliation
- Integrations
- Settings (rail foot)
- Logout (rail foot)

**From the account menu:** My Profile, General Settings.

**Sign-in:** email + password, then a one-time code by email or SMS; invite activation. *(Not built
in the Phase 0 prototype yet: Log out goes to the candidate Log In screen. Phase 1's screens are the
reference.)*

### 5.1 Dashboard
- The greeting heading, the period dropdown and the From/To dates.
- Kept:
  - Needs your attention: overdue reports, held payouts
  - Platform at a glance
  - Platform Users chart
  - Users by status
  - Money at a glance
  - Earnings & Payouts
  - Candidates by Track
  - Interviews
  - Agent standing table
- **Removed:**
  - "Cohorts without a leader" and "Leaders ready to allot"
  - the Cohort Leaders and Running Cohorts figures
  - the cohort-leader series in Platform Users
  - the Cohort health table

### 5.2 Users & Roles
- **All Users:**
  - **Role filter:** All, Candidate, Talent Agent, and each internal role (Reviewer, Supervisor,
    Manager of Agents, Admin). There is no Cohort Leader role.
  - **Kept:**
    - per-role filters and columns
    - Status filter (Invited, Active, Deactivated)
    - search
    - **Invite User**
    - **Bulk Import**
    - **Export** (toast only)
    - row menu: View, Edit, agent listing controls (Pause/Restore listing, Set assessment range,
      Override training gate), Change role, Mark as Talent Agent, Resend/Cancel invite,
      Deactivate/Reactivate
    - bulk deactivate
    - no deletes (deactivate only)
  - **Removed:**
    - the cohort and cohort-leader columns and filters
    - Invite a Leader
    - Allot a Cohort
    - Mark / Remove as Cohort Leader
    - the replacement-leader step when deactivating
- **Person detail pages, all kept:**
  - **candidate:** facts, courses, interviews, payments, CV, linked accounts, quiz results
  - **talent agent:** figures, payouts to release, upcoming and past interviews, interview detail
  - **internal staff:** permissions, recent activity
  - Cohort information is removed from all of them. The separate cohort-leader detail page is
    removed.
- **Roles & Permissions:**
  - the roles table: Role · Description · Accounts (a link to All Users filtered to that role) ·
    Actions. Super Admin carries a "Default" label and no menu.
  - **New Role** (slider: unique name, description, the permissions grid with nothing ticked) and
    **Edit** (name and description).
  - **Delete** is refused while anyone holds the role; otherwise it asks for the security code.
  - **Permissions:** one collapsed row per role ("N of M permissions granted"; Super Admin "Every
    permission, always"), opening to one grid: Module / Permission · View · Create · Edit · Delete.
    Each row has its own Edit, which turns the cells into ticks with Cancel + Update Permissions.
  - The Cohorts permission row is removed.
- **Bulk Import:** Upload → Review → Done. A CSV of first_name, last_name, email, role (choose a
  file, paste rows, or load the sample); an editable review table that checks every row (missing
  names, invalid or duplicate email, refused roles); "Import N users". Super Admin, candidates and
  employers cannot be imported, and there is no Cohort Leader role to import.

### 5.3 Course Catalogue
- The course list (Status tabs; Track, Intent filters), Add Course, course detail.
- Edit, Change price (with a step-up code), Archive / Publish, Delete.
- Cohort wording is removed.

### 5.4 Interviews
- **All Interviews:**
  - the stage register (Booked, Held, Awaiting approval, Reported, Not held, Resolved), with the
    stage as tabs, Type and From / To date filters, search, and Export
  - booking detail: a booked interview shows its facts, the candidate's quiz and what they want to
    talk about; any other stage shows Booking, Recording, Report and Payment
- **Removed (follows from the rebooking credit being cut, 3.6):** **Resolve** and the **Awaiting
  candidate** stage it led to. A Not-held booking is final; it no longer issues a credit.
- **Recording, Scenes & Transcripts:** the recordings register (SCENES consent, Status and
  Transcript filters, date range; row actions Play, Transcript, Withdraw SCENES consent, Delete
  recording, each with a reason and a confirmation), and the "Interview Assets" detail page with two
  tabs (Recording & Scenes · Transcript).
- **Removed:** the "Cohort journey" and cohort-leader evaluation on a re-interview's detail.

### 5.5 Levelling
- **Levelling Log:**
  - the log (Source, Direction, date filters)
  - change detail
  - admin override
- **Level Approvals:**
  - the queue with due times
  - approval detail with two tabs, Recommendation and Transcript
  - actions: Approve agent proposal / Approve Tal proposal / Reviewer override
- **Removed:** the "Tracks, Levels & Acronyms" page.

### 5.6 Onboarding Questions
- The question list and the edit slider (single choice with scores and weight, free text,
  dropdown).
- These feed the candidate onboarding questions (3.1).

### 5.7 Finance & Settlement
All five pages are as in Phase 1:
- **Transactions:** type tabs (All, Course fees, Interview fees, Payouts), Status, Party type and
  date filters, transaction detail. **Removed:** the Rebooking credit tab, its rows and its Active /
  Used / Expired statuses (the credit is cut).
- **Payouts:** state tabs, Release early, Run Weekly Run.
- **Fee Settings:** change log; commission is set on the agent record.
- **Discount Codes:**
  - create, edit, deactivate
  - enable / disable the automatic first-interview discount
  - code detail with redemptions
- **Reconciliation:** settlement batches, batch detail, Re-check, Mark reviewed.

### 5.8 Integrations
- The service list: Connect a service, Rotate key, Open console, Disconnect, Reconnect.
- **Removed:** the Email / CRM (lead attribution) integration.

### 5.9 Settings
- **Four tabs:** Platform · Notification Templates · Notifications · Login & Security.
- **Platform** keeps Departments, Sessions, Exports, Interviews (report deadline), Money (with a
  reason and the security code) and Working days. Each group reads as a record with its own Edit.
- **Removed:**
  - the cohort creation mode and the Cohorts group (attendance, leader reconnection)
  - the rebooking credit window (the credit is cut)
  - the Tal question limit (there is no Tal chat in Phase 0, G2)
  - every cohort, cohort-leader, rebooking-credit, points, badge, rank and certificate notification
    template, and the Cohort Leader recipient filter
- Everything else is kept.

### 5.10 My Profile, General Settings
- As Phase 1.

### 5.11 Not in Phase 0
- Rulings Register
- CRM & Attribution
- Employers & Hiring
- Vetting & Approvals
- Reports
- Audit Log
- the hidden Finance pages (Overview, Invoices, Refunds)

## 6. Open points for the dev team

- **Flags for design review (not yet decided):**
  - **Tal outside its three places (G7).** The Super Admin's agent-interview detail and the level
    change detail also show "Tal's Evaluation", as in Phase 1. G7 names only the Level Approval page.
    Kept as Phase 1 until ruled on.
  - **Talent agent's evaluation button** reads "Send Recommendation" (Phase 1 build); Phase 1's
    DESIGN.md calls the action "Evaluate {name}".
  - **Notification panel** behind the bell is not built on any portal yet.

- Third-party services are pictures in the prototype, not integrations:
  - **Stripe** (payment and payout forms)
  - **Calendly** (the booking calendar)
  - **LightSpeedVT** (course content)
  - **Twilio** (video calls)
- Sends (email, SMS, notifications), file exports and uploads are simulated.
