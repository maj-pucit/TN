/* ==========================================================================
   THE COHORT LEADER PORTAL

   Ported from the Cohort Leader portal in `tn-portals.html` — the same seven
   modules, the same data, the same order — and REDRAWN in this product's
   components rather than transcribed. The wireframe's portal had its own
   vocabulary (`data-ag` dispatch, `.bk` slide-overs, `.card`/`.stat`/`.tb`
   scoped to a `.ui` wrapper, a second state object `G`). None of that crosses:
   what crosses is the flow, the numbers and the decisions.

   WHY THE VIEWS LIVE IN `V`. There is one view registry and one renderer, and
   the leader is a different SIGNED-IN USER, not a different application. Every
   key is prefixed `lead` because `messages`, `dashboard` and `interviews` are
   pages in both portals, and `V` is flat.

   WHAT THE WIREFRAME DECIDED THAT THIS KEEPS
   1. No money anywhere. A cohort leader volunteers. The wireframe replaced its
      Earnings module with Certifications and stripped every fee from the
      leader's pages; a `wallet` on this rail would undo a decision the client
      has already signed off.
   2. The leader is measured on their candidates, not on their throughput —
      "Your standing" reports completion rate and average level movement, which
      is what the wireframe's own standing card reports.

   WHAT THIS CHANGES ON PURPOSE
   The wireframe's leader was Dana Whitfield running three cohorts at E1, B2 and
   T3. Two problems in this codebase: nobody here is Dana, and this product's
   agents each assess a RANGE (`AGENTS.priya.range` is E1–E3), so one leader
   holding a Trailblazer cohort contradicts data already on the candidate side.
   So the leader signed in is Priya Nair — already named in the candidate portal
   as Maryam's agent and the leader of Cohort 41 — and her three cohorts are all
   Explorer, at weeks 1, 5 and 11. Flipping the switcher now shows the other
   side of a cohort the demo was just looking at, which is the whole point of
   putting the two portals behind one control.

   Cohort 41 is Maryam's, and its ten members ARE `COHORT` in views.js — same
   names, same activity. The wireframe's per-member progress numbers are carried
   onto them so the two portals agree about the same ten people.

   AND THE LEADER DOES NOT INTERVIEW ANYBODY — Maryam, 1 Sep 2026. This is the
   largest departure from the wireframe on this side, and it is a correction
   rather than a redraw: the wireframe's leader ran the initial level interview
   AND led the 90 days, which put the same act on two portals at once, because
   the candidate side has always shown a TALENT AGENT doing the interviewing and
   the signing. A cohort leader takes cohort calls. Three consequences run
   through every file here, and each one is written up where it lands:

   1. `LEAD_SESSIONS` and `LEAD_EVALS` are gone, and the diary is derived from
      `LEAD_COHORTS` (`lcall` / `lcalls`, with `LEAD_RUN` for the calls already
      run). The note over those is the argument.
   2. `Sessions` is `Calls` — one rail slot, renamed and repointed, holding this
      week's three calls and the ones behind them. `V.leadCalls` in lead3.js.
   3. `Evaluations` is the 90-day summary alone. Its second queue and the whole
      of `V.leadEval` — Tal's competency read, the transcript quotes, the
      fifteen-rung picker and the override box — are deleted, not hidden.

   What survives untouched is point 2 above it: the leader is still measured on
   their candidates, and a summary that closes 90 days they were in the room for
   is still theirs to sign.
   ========================================================================== */

/* THE SAME PERSON THE CANDIDATE SEES, AND THE FACTS ARE STATED ONCE.
   `COHORT_LEAD` (views.js) is Priya from the candidate's side — the Enroll
   page and the enrolment confirmation both introduce her — and it has to live
   in that file rather than this one: views.js parses first and runs a boot
   `render()` at its foot, so a candidate page reached straight from the hash
   would hit a `LEADER` declared here in the temporal dead zone. Read in this
   direction it is safe, because lead.js parses after that file and nothing
   here renders before it.

   Three fields come across and two do not. The name, the range and how long
   she has been leading are one truth and used to be written out twice, one
   file apart. `i` stays local because the leader portal uses the initials as
   its own avatar fallback in five places, and `img` because `AV` is the
   dictionary both sides read anyway. */
const LEADER = {n:COHORT_LEAD.n, i:'PN', img:AV.priya,
  range:COHORT_LEAD.range, since:COHORT_LEAD.since,
  /* `email` and `bio` added 7 Sep 2026 for `V.leadProfile`'s four-tab rebuild —
     the account address the Privacy tab reads, and the leader's own words the
     General "About" and the Public listing both draw (one string, not two). The
     bio was inline in two places on the old page; it is here now so the card and
     the About cannot drift. */
  email:'priya.nair@nextinleadership.org',
  bio:'I’ve spent 15 years leading operations teams and helping people grow into confident, effective leaders. My approach is direct, practical, and focused on results. I believe in addressing challenges early, giving honest feedback, and turning difficult situations into opportunities to learn.\n\nI specialise in first-line leadership, delegation, prioritisation, and stakeholder management. I work closely with leaders to strengthen their decision-making, navigate team dynamics, and build trust through clear communication. Whether I’m coaching someone through a difficult conversation or helping them manage competing priorities, my goal is to make leadership feel practical and achievable.\n\nHaving led both remote and hybrid teams, I understand the importance of adaptability, accountability, and creating an environment where people can do their best work. I encourage candidates to challenge their assumptions, reflect on their decisions, and put what they learn into practice.',
  /* SPECIALITIES — the chip cloud on the Public Profile listing (9 Sep 2026:
     "improve the cohort leader public profile just like talent agent public
     profile"). AUTHORED PLACEHOLDER copy, the same status as the agent's
     `SPECIALISMS`: the seed has no per-leader speciality list, so these stand in
     from her operations / first-line-leadership domain (the old single
     "Specialism" line said "Operations teams, first-line leadership"). Flagged,
     not real. */
  specs:['Operations teams','First-line leadership','Delegation','Prioritisation','Stakeholder management','Coaching for growth','Remote and hybrid teams']};

/* THE ATTENTION QUEUE'S TWO CONTROLS ARE DELETED (1 Sep 2026) and so is their
   state. `S.leadQ` and `S.leadFilter` were on `S` rather than in a closure so a
   re-render — a nav click, Tal opening — came back to the same filtered view
   instead of silently resetting it; that reasoning was right and the controls
   are gone, so the keys go too rather than sit on `S` with nothing reading them.
   lead2.js's `S.ldrCo` note cites them as the reason ITS keys are prefixed
   `ldr`, which is still worth knowing and is corrected there. */

/* --- the roster ----------------------------------------------------------
   `pc`   chapter progress, per cent
   `avg`  assessment average, per cent (0 = nothing assessed yet)
   `att`  calls attended out of the weeks run so far, as a ratio
   `last` when they were last active, in the words the course platform uses
   `pts`  points earned on the platform's own scale — see below
   Everything the leader sees about a candidate comes back from the course
   platform. Nothing here is entered by hand, which is why there is no field
   the leader can edit — see the note on `flag` below.

   `pts` IS AN EIGHTH FIELD AND IT IS STATED, NOT DERIVED (Maryam, 1 Sep 2026:
   "show the points earned by the candidate"). It is the same scale the candidate
   portal keeps in `GAME[stage].pts` and `PTS` awards against — 25 a chapter, 250
   a course, 10 a post, 50 off for a week away — so a number here means what it
   means on the candidate's own Points page, and the badge ladder in `BDG`
   (Bronze 2,500 / Silver 5,000 / Gold 10,000) reads it without a second table.

   WHY NOT DERIVED FROM `pc`. A formula would be an invented one: points come
   from chapters AND posts AND reactions AND absences, four of which this build
   holds nothing about, so `pc * k` would present a guess as a platform figure.
   Stated per member, each number is ordered with that member's own progress and
   activity — the two 92%/88% candidates closing Cohort 33 are its top two, the
   twelve-days-quiet candidate in Cohort 41 is its lowest — and none of them can
   be contradicted by a figure drawn elsewhere, because nothing else derives it.

   THE BADGE IS THE OTHER HALF AND IT *IS* DERIVED — `lbadge()` below reads `BDG`.
   That is the split worth keeping: the points are data the platform reports, the
   badge is arithmetic on them, so a candidate cannot hold a Silver badge and a
   Bronze number.

   ONLY THE EVALUATIONS CARD READS IT TODAY, and the field is filled for all
   twenty-eight members rather than for the two that card draws: a half-populated
   field is what stops the roster, the member page or a report from picking it up
   later without a data edit first. */
const lmem = (name,ini,img,pc,avg,att,last,pts) => ({name,ini,img,pc,avg,att,last,pts,flag:null});

/* THE HIGHEST BADGE A POINTS TOTAL HAS EARNED, or null below Bronze. `BDG`'s
   first three rows are the points ladder and its fourth ("Get Involved") is
   earned by posting rather than by accumulating, which is why the filter is on
   `need` rather than on the row's position — `need:null` opts that row out of
   this question by construction, and `views.js` uses the same `need` field to
   draw the candidate's own ladder. The array is in ascending order, so the last
   row a total clears is the highest one it has. */
const lbadge = pts => BDG.filter(b => b.need && pts >= b.need).pop() || null;

/* THREE FLAGGED CANDIDATES, ONE SEVERE — Maryam, 1 Sep 2026: "show only three
   attentions in total, from which 1 will be severe and one will be moderate."
   Read as one severe and the remainder moderate, because a flag is one or the
   other and `lflag` has no third severity: **1 severe, 2 moderate.**

   AND IT IS DONE BY MOVING THE ACTIVITY DATA, NOT BY SLICING THE QUEUE. `lflag`
   derives every flag from `pc`, `avg`, `att` and `last`, and the portal's first
   stated rule is that a flag is DERIVED, NEVER SET — a leader cannot mark
   somebody at risk and cannot clear a flag by disagreeing with it. Capping the
   list at three rows would have left twelve flags behind it and made `lattention`
   disagree with the cohort pages, the reports and the figure card, which all
   count the same predicate. So the twelve became three the only honest way: nine
   candidates came back.

   WHO IS FLAGGED AND WHY, all three in Cohort 41:
     Yuki Tanaka       SEVERE    12 days without a sign-in (idle >= 7)
     Chloe Ferreira    moderate  28% against 38% expected (gap <= -5)
     James Whitby      moderate  2.4 attempts at a 65% average (att/avg)

   NINE CHANGED, AND EACH ONE HAD TO CLEAR EVERY TEST rather than just the one
   that was firing — `lflag` runs six in order, so raising progress on somebody
   eight days quiet only moves them from "at risk" to "inactive". Tobias, Ivan
   and Zoe each needed progress AND a recent sign-in AND an attempts figure under
   2.0; Marco and Grace needed progress; Cohort 47's four "Never" needed a first
   sign-in. Nothing else about them moved.

   TWO PLACES OUTSIDE THIS ARRAY HAD TO FOLLOW, and both are hand-written prose
   that names a number this array owns:
     `COHORT` (views.js)   Tobias reads "Active 8 days ago" on the CANDIDATE's
                           own Cohort page. The two portals draw the same ten
                           people and must agree about them.
     `LDR_THREADS` (lead4) Priya's message to Tobias opened "eight days quiet
                           and 18% at week 5", which is now a message about a
                           week that ended.
   Yuki keeps her 12 days and her 9%, so `LEAD_NOTIF`'s row and her own thread
   are untouched — she is the one person this rearrangement had to leave alone. */
/* A COHORT IS AN INTENT GROUP, NOT A COURSE INSTANCE (Client, 9 Sep 2026).
   `intent` is the PRIMARY grouping axis — one of the three `INTENTS`, the same
   list the candidate profile and onboarding read. `level` stays (a cohort is
   still one band, so Trailblazers never sit with Explorers), but it no longer
   IDENTIFIES the cohort and the course no longer does either: `lcourse` is off
   the identity line (see its note). One cohort per intent here so the demo shows
   the axis clearly. */
/* ONE RUNNING COHORT AT A TIME (Maryam, 14 Sep 2026). A candidate who becomes a
   cohort leader — which is who Priya is — leads ONE cohort at a time; only a
   MODERATOR (a leader an admin added, the admin portal's `u.addedBy`) may run
   several. So `LEAD_COHORTS` holds the single ACTIVE cohort, and every
   current-work surface that reads it (the identity line, the dashboard figures,
   the attention queue, the calls diary, "Your cohorts", the chat's counts) reads
   as one cohort with no per-site filtering — hiding the multiple-cohort
   functionality is one array being length 1.

   "KEEP THE PREVIOUS LED COHORTS." A finished cohort is not deleted, it is done:
   `LEAD_PAST` holds the completed ones, reachable through `lcoOf` / `LEAD_ALL()`
   for the three surfaces that are HISTORY rather than current work — the
   Evaluations queue (its 90-day summaries close a cohort that has finished), the
   Course Reports selector, and the "Past cohorts" band on the Cohorts page. When
   this leader finishes Cohort 41 they take the next one; the shape already
   supports it, and a moderator build simply carries more than one entry here. */
const LEAD_COHORTS = [
  {id:41, level:'E3', intent:INTENTS[2], week:5, day:34, call:'Thursday 6:00 PM', callDay:'Today', callTime:'6:00 PM', callOrd:2, starts:'',
   /* EPIC 12 (12.2/12.5): the cohort's own dates, its weekly-call base Thursday
      (ISO + 24h time in the leader's tz) and the completed-delay captured off the
      course at creation (12.9). Authored placeholder (§74) — day 34 lands "today"
      (29 Sep 2026) with the week-5 call two days out. */
   start:'28 Aug 2026', end:'26 Nov 2026', startISO:'2026-08-28', callBaseISO:'2026-09-03', callTimeH:'18:00', completeDelay:7,
   status:'active', members:[
    lmem('Maryam Naz','MN','hana',46,84,1.3,'Today',1760),
    lmem('Aisha Bello','AB','priya',71,94,1.0,'Today',2610),
    lmem('Daniel Kerr','DK','owen',58,88,1.2,'Today',2140),
    lmem('Sofia Marchetti','SM','lena',41,79,1.0,'2d ago',1520),
    lmem('Ravi Chandran','RC','samuel',39,72,1.8,'Today',1395),
    lmem('Nora Lindqvist','NL','lena',36,81,1.1,'3d ago',1280),
    lmem('James Whitby','JW','owen',31,65,2.4,'Today',1120),
    lmem('Chloe Ferreira','CF','priya',28,77,1.0,'5d ago',1005),
    lmem('Tobias Mensah','TM','samuel',35,61,1.4,'2d ago',1240),
    lmem('Yuki Tanaka','YT','hana',9,0,0,'12d ago',285)]}
];

/* THE PREVIOUSLY LED COHORTS — completed, kept for the record. Cohort 33 is the
   one the Evaluations screen closes: week 11, the two at the top are the ones the
   Evaluations card draws (Owen clears Silver at 5,000, Lena does not — the card
   shows a badge per candidate, and two identical badges would not show whether it
   was derived or printed). It carries the same shape as an active cohort and its
   numbers are unchanged from when it was live, so every historical surface reads
   it exactly as before; only its `status` and the array it sits in are new. Its
   call fields stay for the past-calls history (`LEAD_RUN`) but it never enters the
   upcoming diary — `lcalls` reads `LEAD_COHORTS`, not this. */
const LEAD_PAST = [
  {id:33, level:'E1', intent:INTENTS[0], week:11, day:76, call:'Friday 5:00 PM', callDay:'Tomorrow', callTime:'5:00 PM', callOrd:4, starts:'',
   start:'12 Jun 2026', end:'10 Sep 2026', startISO:'2026-06-12', callBaseISO:'2026-06-19', callTimeH:'17:00', completeDelay:7,
   status:'completed', members:[
    lmem('Owen Clarke','OC','owen',92,87,1.3,'Today',5240),
    lmem('Lena Fischer','LF','lena',88,90,1.0,'Yesterday',4880),
    lmem('Samuel Adeyemi','SA','samuel',84,79,1.6,'Today',4510),
    lmem('Hana Kim','HK','hana',81,83,1.2,'Yesterday',4180),
    lmem('Marco Rossi','MR','owen',80,75,1.9,'2d ago',3940),
    lmem('Grace Mwangi','GM','priya',80,88,1.0,'Today',4265),
    lmem('Ivan Petrov','IP','samuel',80,70,1.7,'3d ago',3780),
    lmem('Zoe Bennett','ZB','lena',80,66,1.6,'2d ago',3410)]}
];

/* Active + past, for the lookups and the history surfaces. `lcoOf` searches
   this so a completed cohort's id (an Evaluations record, a past `LEAD_RUN` row,
   a Reports tab) still resolves; the current-work helpers stay on
   `LEAD_COHORTS`. */
const LEAD_ALL = () => LEAD_COHORTS.concat(LEAD_PAST);

/* Expected progress is linear across the 90 days. It is deliberately the
   crudest possible model: the leader is not being asked to beat a forecast,
   they are being shown who has stopped. */
const lpace = c => Math.round(c.day / 90 * 100);

/* THE FLAG IS DERIVED, NEVER SET. Every flag below is a reading of activity
   data, so a leader cannot mark someone at risk and cannot clear a flag by
   disagreeing with it — the flag goes away when the candidate comes back. The
   order matters: the first test that matches wins, hardest first.

   EACH FLAG NAMES ITS OWN ICON. A single marker per severity would say only
   what the colour already says. Six flags, six causes, and the cause is what a
   leader acts on: you write to someone who has never signed in, you look at
   the assessment scores of someone who is struggling. `ic` is a key into `I`,
   and the icon takes the severity's hue — so the mark carries the cause and its
   colour carries the weight, which is two readings out of one glyph. */
function lflag(m,c){
  const d = m.pc - lpace(c);
  const idle = /(\d+)d ago/.test(m.last) ? +m.last.match(/(\d+)d/)[1] : 0;
  if(m.last === 'Never')          return {k:'bad', t:'Never signed in',        ic:'misuse'};
  if(idle >= 7)                   return {k:'bad', t:'Inactive '+idle+' days', ic:'time'};
  if(d <= -15)                    return {k:'bad', t:'At risk',                ic:'warningAlt'};
  if(m.att >= 2.0 && m.avg < 75)  return {k:'wa',  t:'Struggling',             ic:'chart'};
  if(d <= -5)                     return {k:'wa',  t:'Behind pace',            ic:'growth'};
  if(idle >= 4)                   return {k:'wa',  t:'Slowing',                ic:'time'};
  return null;
}
/* Flags are computed for every cohort, active or past, so a past cohort's roster
   and its Course Report read exactly as they did when it was live. The current
   dashboards never surface a past flag because `lattention`/`lbehind` walk
   `lmembers()`, which is the active set only. */
LEAD_ALL().forEach(c => c.members.forEach(m => m.flag = lflag(m,c)));

/* `lmembers()` IS THE ACTIVE SET (the one running cohort). Every "who needs me
   this week" reading is built on it, so with one active cohort they all speak of
   one cohort. `lallmembers()` is active + past, for the two history readers that
   want every candidate ever led — Course Reports' figure denominators and its
   per-cohort rows. */
const lmembers  = () => LEAD_COHORTS.flatMap(c => c.members.map(m => ({m, c})));
const lallmembers = () => LEAD_ALL().flatMap(c => c.members.map(m => ({m, c})));
/* WITHIN A SEVERITY, ORDER BY THE GAP, NOT BY RAW PROGRESS. Sorted on `pc` the
   queue opened with four people at 0% — and all four were in a cohort that
   started four days ago, where 0% is four points behind and nothing to act on.
   Meanwhile someone at 9% in week five is twenty-nine points behind and was
   below the fold. The gap to expected pace is the reading; the raw number is
   only meaningful next to it, which is why the column prints both. */
const lgap = x => x.m.pc - lpace(x.c);
const lattention = () => lmembers().filter(x => x.m.flag)
  .sort((a,b) => (a.m.flag.k === b.m.flag.k ? lgap(a) - lgap(b) : a.m.flag.k === 'bad' ? -1 : 1));
const lbehind = () => lmembers().filter(x => x.m.pc - lpace(x.c) <= -5);
const lavg = (c,k) => Math.round(c.members.reduce((s,m) => s + m[k], 0) / c.members.length);
const lname = c => 'Cohort ' + c.id;
const llevel = c => 'Explorer &ndash; ' + c.level;
/* THE COHORT'S INTENT — its GROUPING (Client, 9 Sep 2026). This replaces the
   course on the identity line: a cohort is the people following one intent
   track, so `lname · lintent · llevel` is the identity every surface prints
   together now, and `lintent` sits beside `lname`/`llevel` for that reason. */
const lintent = c => c.intent;
/* THE COURSE A COHORT'S TRACK CURRENTLY RUNS — NO LONGER THE COHORT'S IDENTITY
   (Client, 9 Sep 2026). The cohort is not a course instance, so `lcourse` came
   off the `lname · … · llevel` line (replaced by `lintent`). It is retained as
   the reader for the course-as-content surface — a course is recommended and
   chooseable inside a track (Point 3), the candidate dashboard draws that — and
   `courseOf`/the key-by-LEVEL argument are in views.js beside `ENROL_COURSE`.
   THE DIRECTION IS THE RULE views.js's `COHORT_LEAD` note records: views.js
   parses first and lead.js reads back, never the other way. */
const lcourse = c => courseOf(c.level);

/* PER-CANDIDATE COURSE, BECAUSE CANDIDATES IN A COHORT NEED NOT SHARE ONE
   (Maryam, 9 Sep 2026: "the candidates could be taking different courses so
   please show different course names"). `lcourse(c)` is the cohort's own track
   course and every member shared it, so the reports table's Course column read
   the same name on every row. The seed has no per-member course, so `mcourse`
   spreads the four catalog courses (`COURSE_NAME`, in views.js) across members
   by a stable hash of the name — AUTHORED variety, flagged the same as the note
   copy, not a real enrolment. Stable so a candidate keeps one course across
   renders and both tables. */
const LDR_LEVELS = ['E1', 'E2', 'E3', 'E4'];
const mlevel = m => LDR_LEVELS[[...m.name].reduce((a, ch) => a + ch.charCodeAt(0), 0) % LDR_LEVELS.length];
const mcourse = m => courseOf(mlevel(m));

/* THE COURSE'S OWN DESCRIPTION, for the member page's course card (Maryam, 9 Sep
   2026: "show the course image, name and its desc that we are showing on the
   black card while enrolling"). ENROL_COURSE carries name + desc for E3/E4; E1
   and E2 are names in COURSE_NAME only, so their descriptions are AUTHORED
   PLACEHOLDERS here, flagged the same as the rest of the leader copy. */
const COURSE_DESC = {
  E1: 'The everyday foundations of working in a business — how teams organise, how work moves through them, and the basic tools that keep it running. The first step before the deeper courses.',
  E2: 'The software and working habits that make a modern team fast: documents, spreadsheets, planning and communication tools, and how to use them well together rather than one at a time.'
};
const courseDesc = lvl => (ENROL_COURSE[lvl] && ENROL_COURSE[lvl].desc) || COURSE_DESC[lvl] || '';

/* THE COVER IS KEYED BY LEVEL, NOT BY COHORT ID (Maryam, 1 Sep 2026, with three
   images). `COHORT_ART` is embedded by build.py — its note is the argument for
   the crop and the file order — and this is the whole of the lookup.

   BY LEVEL BECAUSE A FOURTH COHORT MUST NOT NEED A FOURTH FILE. There are three
   cohorts today and three covers, so keying on `c.id` would have worked and
   would have been a coincidence: the next cohort would land on `undefined`,
   which `crow`'s own note explains is worse than a missing image (an undefined
   `src` 404s on every render, which `respcheck` reads as a broken screen). The
   level is the one property of a cohort this build guarantees, and it also makes
   the assignment a RULE rather than three arbitrary pairings.

   AND THE BLACK CALL CARD READS THIS SAME LOOKUP, WHICH IS WHY THE ORANGE COVER
   IS E3's (Maryam, 1 Sep 2026: "show the yellow one in the black call cards").
   `leadCall` passes `cohortArt(k)` rather than a cover of its own, because the
   card's subject is one cohort's call and artwork belonging to another cohort
   would be the card lying about it. The next call today is Cohort 41 at E3, so
   E3 holds the orange one and both cards draw it. build.py's note carries the
   consequence: the card follows the next call, so a week where Cohort 33 came
   first would put the E1 cover on it.

   THE FALLBACK IS E1, NOT NOTHING. `AGENTS.priya.range` is E1–E3 so nothing on
   this portal is outside it today, but a leader certified into the Builder band
   is the next thing this page will hold (the Certifications page says so in as
   many words), and a B-band cohort with no cover would be the blank square the
   paragraph above is about. `lc()` lowercases because the record's `level` is
   `E1` and the keys are `e1`. */
const cohortArt = c => COHORT_ART[String(c.level).toLowerCase()] || COHORT_ART.e1;

/* --------------------------------------------------------------------------
   THE CALLS THE LEADER RUNS — AND THERE IS ONLY ONE KIND OF APPOINTMENT

   A COHORT LEADER TAKES COHORT CALLS AND DOES NOT INTERVIEW ANYBODY (Maryam,
   1 Sep 2026: "a cohort leader will only be taking cohort calls, not
   interviewing the initial candidates, so please change this flow overall").
   `LEAD_SESSIONS` — five 45-minute level interviews, each with a face, a quiz
   score and a level to sign afterwards — is DELETED, and so is the whole
   assessment pipeline it fed (`LEAD_EVALS`, `V.leadEval`, `LDR_AN`, the level
   picker and the override box; lead3.js's head is the long version).

   THE INITIAL INTERVIEW IS THE TALENT AGENT'S AND THE PRODUCT ALREADY SAID SO.
   One portal over, Priya interviews the candidate, Priya signs the report, and
   the candidate enrols on the strength of it — `signedSummary` (§74) draws that
   report, `PAGESUM.assessed` dates it, and §73's whole argument is about the
   page it unlocks. A leader signing a level as well was one act performed twice
   by two people, and the leader's half was the half with no evidence under it:
   lead2.js tells them in as many words that "the full recording is never shared
   with you". What the leader keeps is the signature that is genuinely theirs —
   the 90-day summary, which closes thirteen weeks they were in the room for.

   THE DIARY IS DERIVED FROM `LEAD_COHORTS`, NOT STATED A SECOND TIME. Every
   fact about a weekly call — the day, the hour, which week of thirteen, how many
   candidates and at what level — is already on the cohort record that the
   Cohorts page, the roster and the candidate's own Cohort page all read. A
   parallel list of the same three appointments is exactly the drift `bkStamp`
   exists to prevent, so there is not one: `lcall(c)` is a VIEW of a cohort and
   `ord` is the cohort's own `callOrd` (an explicit sort key, because "Today" and
   "Mon" are human strings and parsing them into dates would be a date library's
   job on a fixed demo week).

   WHAT IS NOT DERIVABLE IS WHO TURNED UP. That, and only that, is written down.
   `LEAD_RUN` is the calls already run — cohort, week, the date in words, and the
   attendance — and the chapter each one covered is read off `CH` the way `lcall`
   reads it, because a call in week 4 covered chapter 4 and writing that down
   would be a fourth place for it to disagree. Cohort 47 is in week 1 and has no
   rows here at all, which is the empty half of the list the page has to draw
   anyway.
   -------------------------------------------------------------------------- */
const lcall = c => ({
  id:'c' + c.id, co:c.id, ord:c.callOrd, day:c.callDay, time:c.callTime,
  when:c.callDay + ' ' + c.callTime, mins:60,
  week:c.week, level:c.level, seats:c.members.length,
  /* THE COURSE RIDES THE RECORD, not the card that draws it — `leadCall` builds
     `crow`'s subject out of `k` alone and the Calls page reads the same object,
     so a course name resolved at one call site would be a second lookup that
     could answer differently. Same reason `chapter` is resolved here. */
  course:courseOf(c.level),
  chapter:CH[Math.min(12, c.week - 1)][0]
});
const lcalls = () => LEAD_COHORTS.map(lcall).sort((a,b) => a.ord - b.ord);
const lnext  = () => lcalls()[0];

const LEAD_RUN = [
  {co:41, week:4,  when:'Thursday 28 August', attended:9},
  {co:33, week:10, when:'Friday 22 August',   attended:7},
  {co:41, week:3,  when:'Thursday 21 August', attended:8},
  {co:33, week:9,  when:'Friday 15 August',   attended:8}
];

/* ==========================================================================
   EPIC 12 — THE LEADER WORKSPACE FOUNDATION (stories 12.1-12.9)

   The nine stories reshape this portal into a formal workspace. Three model
   pieces are new and everything downstream reads them:

   1. THE HANDLE / SHOW-REAL-NAME MODEL (22.3). The leader sees a candidate by
      avatar and HANDLE. The real name is shown beside the handle ONLY where the
      candidate switched on "Show my real name to my cohort and cohort leader".
      A member carries no name-visibility field, so it is authored here:
      `SHOW_REAL` is the set who opted in, `HANDLE` overrides the derived handle
      where the candidate portal already fixed one (@maryamsss). `leadName(m)`
      is the one display helper every roster, table, note, thread and register
      calls; `leadPlain(m)` is the text the search matches against.

   2. THE SESSION + ATTENDANCE MODEL (12.5/12.6). Cohort calls are weekly across
      the 90 days. `LEAD_SESSIONS[coId]` is generated once from the cohort's own
      `callBaseISO` (a Thursday) so a convincing schedule is one series, not
      thirteen hand-typed rows; one-offs and cancellations are pushed onto it at
      runtime. Rooms (Twilio), the real join/leave capture, the vendor overlap
      check and every notification/email send are STUBBED — a held session's
      register is DERIVED at read time from each member's own engagement
      (authored §74), and one past session is marked "attendance unavailable" to
      draw that state. `leadAttn(m,c)` is attended-of-held since the member
      joined, the one figure on this portal that does not come from LightspeedVT.

   3. THE FIGURES ARE READ FROM A SYNC (19.1). Nothing here is live; the panels
      state when the figures were last read (`LEAD_SYNC`) in the leader's tz.
   ========================================================================== */

/* 12.2 — the week is DERIVED from the day, ceil(day/7), capped at 13. A stored
   `week` already agrees (day 34 -> 5, day 76 -> 11); this is the reader. */
const leadWeek = day => Math.min(13, Math.max(1, Math.ceil(day / 7)));

/* 12.2/12.3 — the LightspeedVT last-read stamp and the leader's account tz.
   Authored (§74): a static prototype reads no sync. */
const LEAD_SYNC = '29 Sep 2026, 14:30';
const LEAD_TZ   = 'London (UTC+01:00)';

/* --- the handle / show-real-name model (22.3) --------------------------- */
const HANDLE = {'Maryam Naz':'@maryamsss'};
/* accepts a member object or a name string, so every call site can hand it `m` */
const handleOf = x => { const name = typeof x === 'string' ? x : x.name;
  return HANDLE[name] || '@' + name.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g,''); };
/* AUTHORED (§74): who has switched the real-name visibility on. A mix so the
   leader's roster shows both states — most are handle-only. */
const SHOW_REAL = new Set(['Maryam Naz','Aisha Bello','Daniel Kerr','Owen Clarke','Grace Mwangi','Hana Kim']);
const showReal  = m => SHOW_REAL.has(m.name);
/* The display cell: handle always; the real name beside it only where shown.
   `leadName` is HTML (two spans §31 styles); `leadPlain` is what search reads —
   the handle, plus the real name only where the candidate chose to show it. */
const leadName  = m => showReal(m)
  ? `<span class="lnm"><span class="lnm-r">${m.name}</span> <span class="lnm-h">${handleOf(m)}</span></span>`
  : `<span class="lnm"><span class="lnm-h lnm-only">${handleOf(m)}</span></span>`;
const leadPlain = m => (showReal(m) ? m.name + ' ' : '') + handleOf(m);

/* --- when a member joined (12.2/12.3/12.6) ------------------------------- */
/* AUTHORED (§74): two members joined after the cohort started, to draw the
   "joined week N" line and to trim their attendance denominator. */
const LEAD_JOINED = {'Chloe Ferreira':2, 'Tobias Mensah':3};
const memJoinWeek = m => LEAD_JOINED[m.name] || 1;

/* --- sessions (12.5) ---------------------------------------------------- */
/* A session: {id, co, title, chapter, dISO, date, time, dur, repeat, series,
   week, status, reason, unavail, adhoc}. `date` is the display string, `dISO`
   the sortable/comparable one. `past`/`live`/`joinable` are derived at read
   time against LEAD_NOW so they never go stale in the seed. */
const LEAD_NOW = new Date('2026-09-29T15:00:00');
const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const dPretty = iso => { const d = new Date(iso + 'T00:00:00'); return d.getDate() + ' ' + MON[d.getMonth()] + ' ' + d.getFullYear(); };
const dISOadd = (iso, days) => { const d = new Date(iso + 'T00:00:00'); d.setDate(d.getDate() + days); return d.toISOString().slice(0,10); };
const sesDT   = s => new Date(s.dISO + 'T' + (s.time || '00:00') + ':00');
const sesEnd  = s => new Date(sesDT(s).getTime() + s.dur * 60000);
const sesPast = s => sesEnd(s) < LEAD_NOW;               /* the whole session is behind us */
const sesLive = s => sesDT(s) <= LEAD_NOW && sesEnd(s) >= LEAD_NOW;
/* Join Call becomes active 5 minutes before the start and stays live to the end. */
const sesJoinable = s => s.status === 'scheduled' && (sesDT(s) - LEAD_NOW) <= 5*60000 && sesEnd(s) >= LEAD_NOW;

/* THE COUNTDOWN (12.2): whole days until 24h out, then hours, then minutes;
   inside the 5-minute window it reads "Starting now". */
function sesCountdown(s){
  const ms = sesDT(s) - LEAD_NOW;
  if(ms <= 0) return sesEnd(s) >= LEAD_NOW ? 'Live now' : 'Ended';
  const mins = Math.round(ms/60000);
  if(mins <= 5)  return 'Starting now';
  if(mins < 60)  return 'in ' + mins + ' minutes';
  const hrs = Math.floor(mins/60);
  if(hrs < 24)   return 'in ' + hrs + ' hour' + (hrs===1?'':'s');
  return 'in ' + Math.round(hrs/24) + ' day' + (Math.round(hrs/24)===1?'':'s');
}

/* Build the weekly series for a cohort off its own base Thursday, one occurrence
   a week to day 90 and no further (12.5). Chapter = that week's chapter off `CH`
   (the shared curriculum), so a call in week 4 covers chapter 4 and the fact is
   never typed twice. `sid` is stable per (cohort, week) so runtime edits target a
   real occurrence. */
function leadBuildSeries(c){
  const out = [];
  for(let w=1; w<=13; w++){
    const iso = dISOadd(c.callBaseISO, (w-1)*7);
    out.push({
      id:'s'+c.id+'w'+w, co:c.id, series:'wk'+c.id,
      title:'Cohort '+c.id+' call', chapter:CH[w-1][0],
      dISO:iso, date:dPretty(iso), time:c.callTimeH, dur:60,
      repeat:'weekly', week:w, status:'scheduled', unavail:false, adhoc:false
    });
  }
  return out;
}
/* The live session store, generated once. Runtime schedule/edit/cancel mutate
   THIS (never the seed cohort). Registers stay lazy (derived at read). */
const LEAD_SESSIONS = {};
LEAD_ALL().forEach(c => { LEAD_SESSIONS[c.id] = leadBuildSeries(c); });
/* AUTHORED demo states on the active cohort (§74): one extra ad-hoc Q&A was
   scheduled then cancelled with a reason. The week-2 "Attendance unavailable"
   demo state was dropped (Maryam 30 Sep 2026: "do not show unavailable
   attendance, show attendance") — every held session now reads its computed
   register, so no past row is a no-data state. */
(function(){
  const ss = LEAD_SESSIONS[41]; if(!ss) return;
  ss.push({id:'s41x1', co:41, series:null, title:'Extra Q&A before assessment', chapter:'Hard Conversations',
    dISO:'2026-09-15', date:dPretty('2026-09-15'), time:'19:00', dur:45, repeat:'none', week:leadWeek(19),
    status:'cancelled', reason:'Clashed with the LightspeedVT maintenance window. I will fold the questions into Thursday.', unavail:false, adhoc:true});
})();

/* Every session for a cohort, soonest first. */
const leadSessionsOf = c => (LEAD_SESSIONS[c.id] || []).slice().sort((a,b) => sesDT(a) - sesDT(b));
/* The next upcoming, scheduled (not cancelled) session — the dashboard header
   and the Sessions page both read this, so "next" is one answer. */
const leadNextSession = c => leadSessionsOf(c).find(s => s.status === 'scheduled' && sesEnd(s) >= LEAD_NOW) || null;
/* Held = a past, non-cancelled session that produced participation data. */
const leadHeld = c => leadSessionsOf(c).filter(s => s.status === 'scheduled' && sesPast(s) && !s.unavail);

/* Overlap (12.5): two sessions on the same cohort may not overlap. Returns the
   clashing session or null. A cancelled session is never an overlap. */
function leadOverlap(c, dISO, time, dur, exceptId){
  const a0 = new Date(dISO + 'T' + time + ':00'), a1 = new Date(a0.getTime() + dur*60000);
  return leadSessionsOf(c).find(s => s.id !== exceptId && s.status === 'scheduled'
    && a0 < sesEnd(s) && a1 > sesDT(s)) || null;
}

/* --- attendance (12.6) -------------------------------------------------- */
/* The register is DERIVED (authored §74) — the seed has no room telemetry. A
   member's chance of attending tracks their engagement; someone idle >= 7 days
   or who never signed in mostly misses. Stable per (member, session) so it does
   not flicker across renders. Returns {att, mins} or null (not yet in cohort). */
function leadHash(str){ let h=2166136261; for(let i=0;i<str.length;i++){ h ^= str.charCodeAt(i); h = (h*16777619)>>>0; } return h; }
function memAttended(m, s){
  if(memJoinWeek(m) > s.week) return null;
  const idle = /(\d+)d ago/.test(m.last) ? +m.last.match(/(\d+)d/)[1] : 0;
  const chance = m.last === 'Never' ? 0 : idle >= 7 ? 20 : Math.min(96, 55 + Math.round(m.pc/2));
  const att = (leadHash(m.name + s.id) % 100) < chance;
  const mins = att ? Math.max(5, Math.round(s.dur * (0.55 + (leadHash(s.id + m.name) % 45)/100)))
                   : Math.round(s.dur * (leadHash('x'+m.name+s.id) % 4)/100);
  return {att:att && mins >= 5, mins};
}
/* Attended of held since the member joined, leaving out cancelled sessions and
   sessions with no data (12.6): totals read 4 of 5, not 4 of 6. */
function leadAttn(m, c){
  const held = leadHeld(c).filter(s => memJoinWeek(m) <= s.week);
  let att = 0; held.forEach(s => { const r = memAttended(m, s); if(r && r.att) att++; });
  return {att, held: held.length};
}
/* The register for one held session: every member who belonged when it ran. */
const SESSION_NOTES = {};   /* runtime session notes, keyed by session id (12.6) */
function leadRegister(c, s){
  return c.members.filter(m => memJoinWeek(m) <= s.week)
    .map(m => ({m, r: memAttended(m, s)}));
}

/* THE ATTENDANCE MINIMUM AND THE ABSENT-LEADER GAP are Settings defaults
   (12.5/12.6), shipped as stated constants here. */
const ATTEND_MIN_MIN = 5;      /* minutes in the room to count as Attended */
const LEADER_GAP_MIN = 10;     /* a leader offline this long is treated as left */

/* the cohort's last day, ISO (12.5 — a session must fall within the 90 days) */
const cohortEndISO = c => dISOadd(c.startISO, 89);
/* the day-of-90 an ISO date falls on for this cohort (1-based) */
const sesDayOf = (c, dISO) => Math.round((new Date(dISO+'T00:00:00') - new Date(c.startISO+'T00:00:00'))/86400000) + 1;

/* ONE LIVE COHORT AT A TIME (12.1). The leader holds a single active assignment;
   `leadLive()` is it, or null when they lead none. The workspace opens that
   assignment automatically and carries no cohort selector. */
const leadLive = () => LEAD_COHORTS[0] || null;

/* The persistent header context (12.1): cohort name + week, shown throughout the
   workspace; omitted when there is no live cohort. */
function leadHeaderChip(){
  const c = leadLive(); if(!c) return '';
  return `<span class="lead-hdr"><span class="lead-hdr-n">Cohort ${c.id}</span><span class="lead-hdr-w">Week ${leadWeek(c.day)} of 13</span></span>`;
}
/* --------------------------------------------------------------------------
   THE WHOLE COHORT IS HERE, NOT ONLY THE TWO STILL WAITING
   Maryam, 1 Sep 2026: "this evaluation screen will come when a cohort is
   completed, so all members of the cohort will be there not only 2 … so since
   we are showing 2 on the dashboard we can take this scenario as, the other
   members' evaluations have been sent but these two are awaiting."

   THE LIST IS THE ROSTER, AND THE ROSTER IS EIGHT. The ask guessed at three
   others; `LEAD_COHORTS[33].members` says six, and that array is the source of
   truth every other surface on this portal counts from — the Cohorts page, the
   roster, the reports, the figure cards. Typing a different number here would
   have made this page the one place the cohort has a different size, which is
   the drift `lcall` and `bkStamp` exist to prevent. So: **two pending, six
   done, eight members.**

   `status:'done'` IS THE EXISTING SHAPE, NOT A NEW ONE. The publish handler in
   lead3 sets exactly these four fields (`status`, `rec`, `why`, `growth`,
   `develop`) and `V.leadEvals` has always had a `done` branch — it simply had
   nothing to draw until you signed one in-session. Adding the six is data, not
   machinery: the second list, the published summary page and Tal's sentence all
   already read them.

   THE RECOMMENDATION IS THE ONE THING NOT DERIVED, WHICH IS THE POINT OF THE
   PAGE ("the recommendation is the part only you can write"). It is therefore
   stated per record rather than computed off `pc` / `avg` — but it does not
   CONTRADICT the figures either: promote where assessments are 79+ on 1.6 or
   fewer attempts a chapter, hold where they are not. Marco (75 on 1.9), Ivan
   (70 on 1.7) and Zoe (66 on 1.6) are the three holds, and every one of them
   is at 80% progress, which is the case the summary exists to describe — the
   course finished, the assessments not landed.

   EACH HOLD CARRIES A `why` BECAUSE THE PRODUCT'S OWN RULE REQUIRES ONE. The
   sign flow refuses to publish anything but `promote` without a reason
   (`data-ldrpub`'s guard), so six published records where a hold had no reason
   would be a state the product says cannot exist — and `V.leadSum` prints the
   row. Each sentence is a reading of that candidate's own two figures, not a
   new claim about them; `growth` and `develop` are left unset, and the page
   renders them conditionally for exactly that reason.
   -------------------------------------------------------------------------- */
const LEAD_SUMMARIES = [
  {id:'m1', name:'Owen Clarke',     i:'OC', img:'owen',   cohort:33, status:'pending'},
  {id:'m2', name:'Lena Fischer',    i:'LF', img:'lena',   cohort:33, status:'pending'},
  {id:'m3', name:'Samuel Adeyemi',  i:'SA', img:'samuel', cohort:33, status:'done',
   rec:'Promote by One Level',
   growth:'Samuel started quietly and finished by leading half of the Hard Conversations call himself. His answers shifted from repeating chapter concepts to sharing what he had put into practice.',
   develop:'Samuel retakes every assessment twice, even when his scores suggest he doesn&rsquo;t need to. Building confidence in his first attempt will help him keep pace at the next level.'},
  {id:'m4', name:'Hana Kim',        i:'HK', img:'hana',   cohort:33, status:'done',
   rec:'Promote by One Level',
   growth:'83% on the assessments at 1.2 attempts a chapter, which is the most consistent record in the cohort. She was also the one who brought the group back to the point on the weeks it drifted.',
   develop:'She defers on anything she has not read twice. At E2 the room will expect an opinion before she is certain of it.'},
  {id:'m5', name:'Marco Rossi',     i:'MR', img:'owen',   cohort:33, status:'done',
   rec:'Hold at Current Level',
   why:'Finished the chapters but sat every assessment twice to clear 75%. Another cohort at E1 is the cheaper way to make that stick.',
   growth:'Attendance never slipped and Conflict and Repair clearly landed — he brought a real disagreement from work to the call and worked it through in front of the group.',
   develop:'The reading is the gap, not the effort. Another 90 days at E1 with one chapter at a time rather than three in a weekend.'},
  {id:'m6', name:'Grace Mwangi',    i:'GM', img:'priya',  cohort:33, status:'done',
   rec:'Promote by One Level',
   growth:'88% first time on every assessment and 1.0 attempts a chapter — she is through the course as cleanly as anyone has been. She asks the question the rest of the room is avoiding.',
   develop:'She has not had to carry a call yet. The re-interview should ask what she does when the group goes quiet.'},
  {id:'m7', name:'Ivan Petrov',     i:'IP', img:'samuel', cohort:33, status:'done',
   rec:'Hold at Current Level',
   why:'70% on assessments at 1.7 attempts a chapter. He is close, and the gap is the reading rather than the effort.',
   growth:'Turned up to every call in the second half after a slow start, and the Why We Exist chapter is the one he can now argue rather than recite.',
   develop:'Assessments at 70% with almost two goes each. He is guessing where he should be checking, and one more cohort at E1 is where that becomes a habit.'},
  {id:'m8', name:'Zoe Bennett',     i:'ZB', img:'lena',   cohort:33, status:'done',
   rec:'Hold at Current Level',
   why:'66% is the lowest in the cohort and it did not move after week 8. Repeating E1 with the calls she missed is the honest answer.',
   growth:'She finished 80% of the course while missing four calls, which took real work on her own.',
   develop:'The calls are the half she skipped and the scores show it. Repeating E1 with the group in the room is the whole of my recommendation.'}
];

/* ONE QUEUE, NOT TWO. This was level decisions plus summaries, and the note
   over `V.leadEvals` argued the pair well — "a level decision opens a
   candidate's 90 days; a 90-day summary closes them". Only the closing half is
   the leader's now, so the sum has one term. It is still a function rather than
   a literal because publishing a summary empties it live. */
const lpending = () => LEAD_SUMMARIES.filter(s => s.status === 'pending').length;

/* WHAT A CALL IS CALLED AND WHAT IT COMMITS YOU TO, stated once and read by
   three surfaces — the dashboard's black card, its Booked list and the Calls
   page. Two copies of these strings is the failure `bkStamp` exists to prevent
   on the candidate side, one portal over. */
const lcTitle  = k => 'Cohort ' + k.co + ' call';
const lcDetail = k => k.mins + ' minutes &middot; week ' + k.week + ' of 13 &middot; ' + k.chapter;

/* `lbooked` STOOD HERE AND IS DELETED WITH THE LIST IT FED (4 Sep 2026). It
   was `lcalls()` with three presentation fields glued on — a title, a
   description and a `go` — for `bookedRow`, and the dashboard's Cohort Calls
   list was its only reader. The upcoming-calls row (§113) draws the same three
   appointments out of `lcalls()` directly, so the mapped copy is a second shape
   of one record with nobody left to hand it to. What it was FOR survives in
   `lcTitle` / `lcDetail`, which is where those strings were always stated. */

/* --------------------------------------------------------------------------
   THE FOUR CARDS AND THE FOUR SECTIONS ARE ONE LIST

   Each figure cell counts a section of this page, so pressing it goes there.
   That only holds together if three things stay in step: the order of the
   cards, the order of the sections down the page, and the four hues §31 keys
   by `nth-child`. Stating them here once is what keeps them in step — the
   cards are generated from this array and the sections carry these ids, so the
   only way to reorder either is to reorder this.

   PAGE ORDER FOLLOWS CARD ORDER, left to right — AND SINCE 4 SEP 2026 ONE OF
   THE FOUR IS ABOVE THE STRIP RATHER THAN BELOW IT. The calls section is now
   the upcoming-calls row directly under Tal's summary (§113), so the document
   runs calls, attention, waiting, cohorts while the cards still run in the
   order Maryam set on 1 Sep. `leadStick` therefore reads the live section by
   DOCUMENT POSITION instead of by this array's order; the note there is the
   argument, and the coupling this paragraph is about — one array driving the
   cards, the ids and §31's four hues — is unchanged. -------------------------
   -------------------------------------------------------------------------- */
/* `BOOKED_SHOWN` STOOD HERE AND IS DELETED WITH THE LIST IT CAPPED (4 Sep
   2026). Its argument was good and is worth keeping, because the next list on
   this page will want it: it was three "with 'All calls' in the heading row for
   the rest — the full list is a page of its own and printing it twice made that
   link a route to the same content", and it was NAMED rather than written as a
   literal because it is a decision about the DASHBOARD and not a fact about the
   data ("it happens to equal the number of cohorts today, and a fourth cohort
   must not turn this section into the whole list with a link pointing at
   itself").
   THE UPCOMING-CALLS ROW SLICES NOTHING, DELIBERATELY. A cap is what a COLUMN
   of rows needs, because a fourth row makes the page longer; the row is a grid
   that wraps, so a fourth cohort is a fourth cell in the space already there.
   `View all sessions` on the heading row is still the way to the full page, and
   it stops being a route to the same content the moment `V.leadCalls` holds
   anything this row does not — which it does, since that page draws the brief
   for each call. */

/* THE ORDER AND THE FOUR WORDS ARE MARYAM'S, 1 SEP 2026, and both halves of
   the note above apply to the change: the cards are generated from this array
   and the page's four sections carry these ids, so reordering here reorders the
   page — but §31's four hues are keyed by `nth-child` and had to be re-pointed
   with it, which is stated where they are.

   THE TWO DEMANDS COME FIRST NOW. Attention and the signature queue are the two
   cells that are somebody waiting on this leader; Calls and Cohorts are counts
   of what they hold. Reading order follows that, and the hues agree with it —
   red, amber, ink, ink — where before the red sat in cell 2 with a count in
   front of it.

   EVERY LABEL NAMES A NOUN AND ITS STATE. "Attention" and "Calls" were
   categories; "Attention required" and "Cohort calls" say what the figure is
   about, and "Awaiting decisions" replaces "Waiting on you", which named the
   direction rather than the thing. `lead-calls` is the id that came with it —
   it was `lead-booked`, from the week the diary held interviews somebody had
   booked, and nobody books a cohort leader. */
const LEAD_JUMPS = [
  {id:'lead-attention', ic:'warningAlt', l:'Attention Required'},
  /* "AWAITING EVALUATIONS", NOT "AWAITING DECISIONS" (Maryam, 1 Sep 2026), AND
     THE LABEL IS STATED TWICE BY DESIGN — here for the figure card and again on
     the section's own `.sec-h`, because a card and a heading are two elements
     and this list drives only the first. Both were changed together; if a third
     surface ever names it, the fix is to read `LEAD_JUMPS[n].l` rather than to
     type it a third time.
     WHY THE WORD IS BETTER: the module it points at is Evaluations, and what is
     waiting there is a 90-day summary — the leader's evaluation of a candidate.
     "Decision" is the word this portal used while the level-interview queue
     existed (a decision was a rung you signed), and that queue went on 1 Sep
     2026 with the interviews. The card now names the same thing the rail slot,
     the page and the second list on it name. */
  {id:'lead-waiting',   ic:'edit',       l:'Awaiting Evaluations'},
  {id:'lead-calls',     ic:'video',      l:'Cohort Calls'},
  {id:'lead-cohorts',   ic:'group',      l:'Cohorts'}
];

/* --- the bell -----------------------------------------------------------
   Read by `notifList()` in views.js. Same row shape as the candidate's
   `NOTIF` entries so `notifPanel()` renders both without a branch. Every one
   of them is somebody else's work arriving, which is the character of this
   portal: a leader's day is made of other people finishing things.        */
/* `var`, DELIBERATELY, and the same for LEAD_TAL below. views.js guards both
   with `typeof X !== 'undefined'` because this file is parsed after it — and
   that guard is a LIE for a `const`: a const in its temporal dead zone makes
   `typeof` throw a ReferenceError rather than answer 'undefined'. `var` is
   hoisted, so the guard means what it says and deleting this file degrades to
   an empty bell instead of a broken render. */
/* TWO OF THESE FIVE WERE THE INTERVIEWER'S AND BOTH ARE REPLACED IN KIND
   (1 Sep 2026). "Thomas Beck is waiting on a level decision" pointed at a queue
   that no longer exists; the summary it becomes is the signature that IS the
   leader's, and it still blocks somebody. "Femi Adebayo booked you for 4:30 PM"
   was the bookable-slot model in one line — nobody books a cohort leader now —
   so the calendar row is the appointment the leader actually has today, read off
   the same cohort record `lcall` reads. */
var LEAD_NOTIF = [
  {ic:'edit',       t:'Owen Clarke is waiting on his 90-day summary',b:'Cohort 33 closes next week. Nothing goes to his next agent until you publish it.', w:'25 min ago', go:'leadEvals',    unread:1},
  {ic:'warningAlt', t:'Yuki Tanaka has not signed in for 12 days',  b:'Cohort 41, week 5. Nine per cent through the chapters.',                w:'2h ago',     go:'leadReports',  unread:1},
  {ic:'chat',       t:'3 new posts in Cohort 41',                    b:'Chapter 4 came up again on the discussion board.',                     w:'4h ago',     go:'leadMessages', unread:1},
  {ic:'calendar',   t:'Cohort 41 meets today at 6:00 PM',            b:'Week 5 of 13. Sixty minutes, ten candidates.',                         w:'Today',      go:'leadCalls',    unread:0},
  {ic:'certificate',t:'Your fourth cohort completed',                b:'Cohort 26 closed with eight of ten promoted.',                         w:'Yesterday',  go:'leadCerts',    unread:0}
];

/* --- what Tal knows here -------------------------------------------------
   Read by `talPanel()` in views.js. Tal's ANSWERS are not ported: the router
   in views.js answers candidate questions with candidate widgets, and a
   leader-side router is its own piece of work. What the panel gets now is an
   accurate opener and leader-shaped suggestions, so nothing in it claims to
   know something it does not.                                             */
var LEAD_TAL = {   /* `var` for the reason given above LEAD_NOTIF */
  where: {leadDash:'Dashboard', leadCalls:'Upcoming Sessions', leadEvals:'Evaluations',
          leadCohorts:'Cohorts', leadReports:'Course reports', leadMessages:'Messages',
          leadCerts:'Certifications', leadProfile:'Your profile'},
  state: () => (LEAD_COHORTS.length===1 ? 'one cohort' : LEAD_COHORTS.length + ' cohorts')
             + ', ' + lmembers().length + ' candidates, '
             + lpending() + ' summar' + (lpending()===1?'y':'ies') + ' waiting',
  ctx: {
    leadDash: ['Brief me for Thursday&rsquo;s call','Who should I worry about this week?','What is waiting on my signature?'],
    leadCalls: ['Brief me for tonight&rsquo;s call','Who missed the last one?'],
    leadEvals: ['Is Owen Clarke ready to be promoted?','What should the summary say?'],
    leadCohorts: ['Where is Cohort 41 stuck?','How is my cohort doing?'],
    leadReports: ['Who has stopped in the last week?','Which chapter is losing people?'],
    leadMessages: ['Draft a check-in to Yuki Tanaka','What came up on the board this week?'],
    leadCerts: ['What do I need for the next certification?'],
    leadProfile: ['How is my standing calculated?']
  }
};

/* --------------------------------------------------------------------------
   A ROW ABOUT A PERSON

   A FACE, NOT A GLYPH. The leading slot on a list row is normally
   `.cardrow-ic` — a 40px plate holding a document or a pencil. On this portal
   every row in a queue is a PERSON, and four rows carrying the same pencil say
   nothing except "these are the same kind of task", which the heading above
   them already said. A face is the one mark that distinguishes the rows from
   each other, and recognising who is waiting is the actual work. It reuses
   `mem()`'s slot verbatim rather than a new one, because this IS that slot.

   AN ARROW, NOT A VERB. Each row ended in a small "Decide" or "Recommend"
   button. Three problems: two different words for one destination (both open
   Evaluations), a 60px target on a 700px row that is otherwise dead, and a
   label that promises the decision happens HERE when it happens on the page it
   opens. The whole row becomes the target and takes `.tile-arrow`, which is
   what every other openable row in this product wears — `gcard`, the chapter
   list, the settings rows. What you do is on the page you land on.
   -------------------------------------------------------------------------- */
/* --------------------------------------------------------------------------
   A ROW ABOUT AN APPOINTMENT

   THE DATE IS A CHIP, because a column of appointments is read down the date
   and across the detail. `.day` is the chip the booking flow already uses for
   exactly this — a bordered box, the word over the figure — so the leader's
   diary and the candidate's slot picker draw a date the same way.

   THE MARK IS THE ICON BLOCK AGAIN, AND THE GLYPH IS THE CALL (Maryam, 1 Sep
   2026: "take back the cohort icon with block instead of cohort images, but show
   call icon instead of the cohort icon"). `I.video`, in `.cardrow-ic`'s 36px
   plate.

   THE COVERS WERE HERE FOR ONE BUILD AND WHAT THEY COST IS WORTH WRITING DOWN,
   because the argument for them was sound and the drawing was not. §86's cover
   is a 112 × 62 title card, three times the plate's area, so on a row that is
   otherwise a date, a title and a line of detail the picture became the object
   the eye landed on — and it is the one thing on the row that is not about THIS
   appointment: the artwork belongs to the course the cohort is taking, and it is
   the same three pictures the Your cohorts list draws eighty pixels below. A
   diary is scanned down the date; a mark on it is there to say what KIND of
   thing the row is, not to be looked at.

   `I.video` IS THE PRODUCT'S OWN "THIS IS A VIDEO CALL" MARK, not a new glyph:
   it is on every Join button in both portals, on the recording chips, and on
   ai10's camera control. So the row's mark now says the same word its title
   does — the trade §31's `faceRow` note warns about (a glyph repeated down a
   column says only "these are the same kind of task") is accepted here on
   purpose, because with one kind of appointment left on this portal that IS the
   fact, and it is `I.group` claiming to say who you are meeting that was the
   misleading half.

   THE OLD FACE BRANCH IS STILL GONE AND ITS ARGUMENT STILL HOLDS. This slot
   used to answer "who am I meeting" two ways — a face for an interview, a group
   for a cohort call — and with interviews off the portal there was one kind
   left, so the branch was deleted (1 Sep 2026). The reason the mark is not a
   PHOTOGRAPH is unchanged: for ten people it is not any one of them.

   THE CHIP IS ONE WIDTH FOR EVERY ROW, set in §31.5 — not sized to its own
   words. "TODAY", "TOMORROW" and "NOV 21" are three different lengths, so a
   chip that hugged its text started each row's face and title at a different
   x and the column read as ragged. A diary is scanned down the date and across
   the detail, and both of those need a straight edge.

   AN ARROW, NOT A VERB — the same argument `faceRow` above makes, and it
   applies here for one extra reason. The two words in this slot were "Join"
   and "Brief", which named the KIND of appointment as much as the action, and
   neither happened here: both opened another page. So the row is the target,
   it carries the arrow every openable row in this product wears. `go` survives
   on the row data; `cta` does not, because nothing prints it any more.
   -------------------------------------------------------------------------- */
/* `bookedRow` IS DELETED (4 Sep 2026) AND EVERY PARAGRAPH ABOVE IS KEPT,
   because all of them are decisions about how this portal draws an appointment
   and three of them are cited from other files. What went is the FUNCTION and
   its one caller — the dashboard's Cohort Calls list, which since §113 draws
   the same three appointments as cards at the top of the page. `V.leadCalls`
   has always written its own `.cardrow` markup rather than calling this, so the
   Calls page is untouched.
   THE ONE THING THAT DID NOT SURVIVE IS THE DATE CHIP, and it is worth saying
   which of these paragraphs the new row answers differently: `.day.bk-day` is a
   fixed-width box holding the word over the figure, and the argument for it —
   "a diary is scanned down the date and across the detail, and both of those
   need a straight edge" — is an argument about a COLUMN. §113's cells sit side
   by side, so there is no column to keep straight and the date is a line of
   type at the top right of each card. `bk-now`'s full-ink "today" goes with it
   for the same reason: with three cards abreast, which one is next is said by
   its being first and by its being the black one.
   `.day` / `.bk-day` / `.bk-row` ARE NOT DELETED FROM §31 — `.day` is the
   booking flow's own chip on the candidate portal and the design system ships
   it; `.bk-*` are §31's and `gallery.html` documents the row. */

/* ==========================================================================
   THE NEXT COHORT CALL IS THE BLACK CALL CARD

   IT WAS THE NEXT INTERVIEW UNTIL 1 SEP 2026, and everything below about HOW it
   is drawn is unchanged — the card is still §75's `.dark-card` with §77's row in
   it, still directly after Tal's `.sec`, still the reason the summary has the
   band to itself. What changed is its SUBJECT: with interviews off this portal
   the leader's next appointment is a cohort call, so the card reads the same
   cohort record the Cohorts page and the roster read (`lcall`) instead of a
   session record that no longer exists.

   THREE THINGS THE NEW SUBJECT CHANGES, AND `crow` WAS ALREADY BUILT FOR ALL
   THREE — its own note names this card as the case it was widened for:

     the mark      a cohort is not a person, so the record carries `i:'41'` and
                   NO `img`. `crow` omits the `<img>` rather than writing an
                   undefined `src` (its note is the argument: a 404 on every
                   render is what `respcheck` reads as a broken screen), §71.405
                   normalises the `<i>` out of italic for exactly this row, and
                   §77/§63 §17 give the square the card's own register so a
                   label reads as a mark rather than as a failed photograph.
     the ONE ACTION is "Generate the brief", and it is the first action on this
                   card that actually does something. It was "All sessions" — a
                   way out of a set of one — and before that a Join that §81 had
                   to gate shut for twenty-three hours a day. The brief is
                   `data-ldrbrief="<id>"`, a SHEET rather than a route, which is
                   what `second.at` exists for; `go` still wins where a caller
                   has one.
     no tick       `v:false` for a new reason. It was "a candidate nobody has
                   assessed is not a checked identity"; now the subject is not
                   an identity at all.

   Maryam, 31 Aug 2026, on the shape itself:
   "The call card from the top will be out and will be next to the summary
   section. Just like the black call card we have on the candidate portal.
   Content will be the same just the ui changes."

   So this is a MOVE and a re-drawing, not a rewrite: every fact on the card is
   the fact the plate carried, in the same order, and the black card is §75's
   recipe with §77's row inside it. The candidate portal's `booked` dashboard
   is the reference and it is one call site of the same two layers.

   1. IT IS NOT A `.plate` ANY MORE, WHICH IS THE WHOLE OF "OUT OF THE TOP".
   `.plate` is in ai5's `DARK_CARD`, so `placeDark` lifted whichever page child
   contained it into the head band — that is why the card was at the top, above
   the four figures, in a 330px column beside Tal's sentence. `.dark-card` is in
   no pass's list (§75 exists so that a black card is one class and no
   machinery), so the section stays exactly where this view writes it.

   AND THE SUMMARY TAKES THE WIDTH BACK BY ITSELF. §56's two-column band is
   gated on `.modhead:has(> .sec-dark .plate)`; with no plate on the page the
   gate does not match and the band is `minmax(0,1fr)` — one column, full width,
   with nothing restated. That is the second half of the ask answered by the
   first half's mechanism.

   2. DIRECTLY AFTER TAL'S CARD, WHICH IS THE SLOT `talRec` AND `crow` BOTH TAKE
   ON THE CANDIDATE SIDE. §77's note is the argument: on `new` the page's next
   step is "book an interview", on `booked` it is "join the one you booked", and
   here it is "the cohort you meet next" — one slot, one object, three readings
   of the same sentence. It also has to be after Tal's `.sec` rather than before
   it: `placeBand`'s run walks forward from the `.ph` and stops at the first
   section that is not head furniture, so a card written between the two would
   leave Tal's summary in the page body (trap 11's neighbourhood).

   3. THE CONTENT IS ONE COHORT RECORD, ROW FOR ROW.

     `lcall(c)` reads              the card draws
     `callDay` + `callTime`        `.dc-when` in the heading row (§75)
     the cohort's id              `.dc-t` "Cohort 41 call" (`lcTitle`)
     the cohort's id              `.crow-ph`'s label + `.crow-n` at 78
     `members.length`, `level`    `.crow-role` "10 candidates at Explorer – E3"
     `week` + `CH[week-1]`        `.crow-x` (`lcDetail`, stated once)
     the brief sheet              `.crow-a`, one button

   4. THE JOIN IS GONE AND THE GATE WENT WITH IT (Maryam, 31 Aug 2026). §81 built
   `joinLive` because the button was live for fifty minutes a day and a control
   that looks pressable and is not reads as a broken page; the gate was the
   honest answer to that. What it could not fix is that the card then spent
   almost all of its life showing a DISABLED primary — §60's "a dead control on
   a live surface is worse than a missing one", arrived at from the other side.
   So the card's one action is the way onward, and `crow`'s `join:false` is
   where the shape of that is stated. It reads better still now that the one
   action DOES something: `callOpen` builds the CANDIDATE's interview, so every
   leader-side Join in this build is unwired (§60's note), and the brief sheet is
   the leader's real next move on a call sixty minutes long.
   §81'S MACHINERY IS NOT DELETED. `joinLive` / `joinArm` / `JOIN_NOW` still
   run for `crow`'s gated call sites and the layer's disabled treatment on
   `.dark-card` is what any future gated action there will want; this card
   simply stops asking for it. Removing the gate as well would be deleting a
   decision, not a button.
   ========================================================================== */
/* THE SECONDARY IS THE RECORD'S AND IT IS THE SAME ON BOTH PAGES NOW. It used
   to be the caller's, because "All sessions" from the Sessions page was a link
   to the page you were already on — the "gate nothing writes" tell wearing a
   different hat — so that page passed `second:false` and the card ended with no
   action at all. The brief is per-CALL rather than per-page, so it is correct on
   the dashboard and on Calls alike, and the parameter survives for a caller that
   genuinely has nothing to offer. */
const leadCall = (k, second) => ({
  /* NO MARK AT ALL ON A COHORT (Client, 9 Sep 2026: first "remove the course
     images from cohorts", then "remove the circle 41 from the black card"). `img`
     was `cohortArt(k)`, a course cover; then the crow drew the cohort NUMBER as a
     disc; now there is no `i` either, so `crow` draws no `.crow-ph` and the detail
     sits flush left. The record is the appointment, named in `who.n`. */
  who:{n:'Cohort ' + k.co},
  cover:false,
  role:`${k.seats} candidates at Explorer &ndash; ${k.level} &middot; ${k.course}`,
  x:lcDetail(k),
  xl:'',            /* the line is the appointment, not the cohort */
  v:false,          /* a cohort is not an identity, checked or otherwise */
  when:k.when, mins:k.mins,
  second:second === undefined
    ? {go:'leadCalls', ic:I.calendar, t:'View all sessions'}
    : second
  /* no `kind`, so no `data-call` — see 4 above */
});

const leadCallCard = (k, o) => `<div class="sec dark-card crow-dark">
    <div class="dc-hd">
      ${''/* THE HEADER IS "Upcoming Cohort Session", NOT "Cohort 41 call" (Maryam,
             9 Sep 2026: "in black cohort call cards, change the 'Cohort 41 call'
             title to 'Upcoming Cohort Session'"). The crow below still names the
             cohort ("Cohort 41" + the detail), so the header can be the generic
             kind of appointment. `lcTitle` is untouched — the dashboard's
             upcoming-calls cards still title themselves "Cohort N call". */}
      ${''/* THE TITLE IS "Week N Cohort Session" (Maryam 30 Sep 2026: "change black
             card session name format to the one we are using Week (n) Cohort
             Session"), matching the dashboard call card. The week is the record's
             own (`k.week`). Was "Upcoming Cohort Session". */}
      <div class="dc-hd-r"><h2 class="dc-t">Week ${k.week} Cohort Session</h2>
        <span class="dc-when">${I.time}${k.when}</span></div>
    </div>
    ${''/* THE ACTION IS A GATED JOIN, NOT "GENERATE THE BRIEF" (Maryam, 9 Sep 2026:
           "instead of generate brief show Join Call button but disabled"). The
           card now draws `crow`'s primary Join and no secondary (`second:false`);
           §81/§119 gate it, so it is the disabled grey Join while the call is more
           than a minute away — which is the state a leader reads it in. The `o`
           param (the caller's brief action) is no longer used by this card. */}
    ${crow(leadCall(k, false), {when:false, second:false})}
  </div>`;

/* ==========================================================================
   AND ON THE DASHBOARD IT IS A ROW OF THEM — `lcalCard` / `leadCallsSec`, §113

   Maryam, 4 Sep 2026, with a reference screen: "update the cohort dashboard
   view from showing one call on top to multiple calls, for that I have attached
   a reference, please follow that for multiple calls."

   THE DASHBOARD SHOWED ONE CALL AND LISTED ALL THREE 1000px LOWER DOWN, which
   is what makes this a merge rather than an addition. `leadCallCard` above drew
   `lnext()` under Tal's summary and the Cohort Calls section drew `lcalls()` as
   `bookedRow`s — and with three cohorts there are three calls, so the page held
   one list twice. The row IS the Cohort Calls section now: it carries
   `id="lead-calls"`, the figure cell and the sticky tab still point at it, and
   the lower section is deleted along with `bookedRow`, `lbooked` and
   `BOOKED_SHOWN`. Each of those keeps its argument in place.

   `leadCallCard` IS NOT TOUCHED AND STILL HAS TWO CALLERS — `V.leadCohort` (one
   cohort's own page) and `V.leadCalls` (the Calls page's head). Both are pages
   ABOUT one appointment, where a full-width black card with the whole record on
   it is right; this is a dashboard, where the question is "what is coming up".

   WHAT THE REFERENCE DECIDES AND WHAT IT DOES NOT:

     it decides    the shape — a headed band with a sentence and `View all
                   sessions` at the right end, over a row of appointment cards,
                   the first black with a Join on it and the rest light with an
                   arrow. Each card is a mark, a time, a title, a line of
                   detail, a duration and one control.
     it does NOT   the visual language. Its cards are rounded with tinted icon
                   chips; `--radius` is `0px` by token and §72's argument
                   against a chip inside a bordered card both hold, so these are
                   square, hairlined, and the mark is the cohort's own course
                   cover (§86) rather than a glyph — which is also what tells
                   three cards of the same KIND apart.
     it does NOT   the contents. The reference's other four cards are a 1:1
                   check-in, a cohort session, career guidance and an
                   evaluations review — four kinds of appointment a cohort
                   leader does not have (1 Sep 2026: "a cohort leader will only
                   be taking cohort calls, not interviewing the initial
                   candidates"). Inventing them would be §74's rule broken in
                   the one place it matters: product copy the rest of the build
                   contradicts. THE ROW IS `lcalls()`, so it is as long as the
                   leader has cohorts — three today, five if they take five.

   THE JOIN IS BACK ON THE FIRST CARD AND IT IS GATED, which turns over half of
   §77's decision and keeps the other half. That note removed the leader's Join
   because "the card then spent almost all of its life showing a DISABLED
   primary — §60's dead control on a live surface, arrived at from the other
   side". What changed since is Maryam's 3 Sep ruling that a shut Join is the
   right drawing rather than a defect ("in cards where the time left in the call
   is more than a minute, show a grey disabled join call button"), so §81's
   unlit treatment on `.dark-card` is now the intended state and not an apology
   for one. `joinLive` is unchanged and still narrow: the card is live from five
   minutes before the call until it ends, and `joinShut` states why on the
   button's `title` for the rest of the day. `joinArm`'s 20-second timer already
   owns anything carrying `data-joinwhen`, so the button arms itself with no
   render.

   `data-call="cohort"` IS WIRED, WITH ONE THING FLAGGED. `CALL.cohort` (ai10)
   builds the room out of `COHORT` — the ten members of Cohort 41, which is the
   cohort this card draws — so the leader joining it sees the right roster. What
   is wrong is the "you" tile: `callMe()` reads the member flagged `mine`, who is
   Maryam the CANDIDATE. A leader-side `CALL` entry is its own piece of work and
   is not this ask; the alternative was a Join wired to nothing, which is the
   dead control §60 refuses outright.
   ========================================================================== */
const lcalCard = (k, lead, opts) => {
  const o = opts || {};
  /* THE LIGHT CARDS OPEN THE COHORT, NOT THE CALLS PAGE. `data-go` alone can
     only name a view, so the cohort's own id rides beside it as `data-ldrco`
     and lead2's capture-phase listener sets `S.ldrCo` before `go()` runs —
     `gcard`'s seventh argument is the same idiom on the Your cohorts rows
     forty pixels below, and the reason is the one Maryam gave on 1 Sep 2026:
     a row that opens a LIST of the rows you just pressed is not a route. */
  const act = lead
    ? `<button class="btn btn-p btn-sm noic" data-call="cohort" data-joinwhen="${k.when}" data-joinmins="${k.mins}"${
        joinLive(k.when, k.mins) ? '' : ` disabled title="${joinShut(k.when)}"`}>Join call ${I.arrowRight}</button>`
    : `<svg class="tile-arrow" viewBox="0 0 24 24">${inner('arrowRight')}</svg>`;
  /* A `<div>` FOR THE BLACK ONE AND A `<button>` FOR THE REST, because the
     black card holds a control and a `<button>` inside a `<button>` is invalid
     markup with two targets doing one job — §112's rule for `.row-cta`. It also
     reads correctly: on the first card the thing to do is Join, on the others
     it is to go and look. */
  if(lead){
    /* THE BLACK CALL CARD, REDRAWN (Maryam, 28 Sep 2026, four asks on one card):
       the scheduled time moves LEFT into a square accent block (day over time,
       centred, both lines); the header's right slot now holds a LIVE COUNTDOWN
       to the call (`.lcal-timer`, `callTimerArm`'s 1s clock, derived from the
       clock like `joinArm`/`heldArm` so a background tick lands right — trap 17);
       the member count sits under the title (`k.seats`, the same figure the
       "Cohorts" stat cell counts); and the Join is a WHITE disabled primary
       (§113.4 fills it white, §63 §20b inks the label dark — see both notes).
       The accent block's day/time inherit `--on-dark` (white) from §63 §6a like
       every other string on the card, so no colour is set here. */
    const till = (typeof joinClock === 'function') ? joinClock(k.when) : null;
    /* THE TWO FACES ARE THE FIRST TWO ROSTER PHOTOS, read off the cohort record
       (the `lcall` record carries only the count). `avatar`/`AV` are globals
       from views.js; `.lcal-faces` overlaps them with a card-ground ring so they
       read as a stack on the black ground. */
    const co = (typeof LEAD_COHORTS !== 'undefined') ? LEAD_COHORTS.find(c => c.id === k.co) : null;
    const faces = co ? co.members.slice(0, 2).map(m => avatar({i:m.ini, img:AV[m.img]}, 22)).join('') : '';
    /* THE OVERFLOW COUNT rides the face stack as a third disc — a card-ground white
       circle carrying "+N" (the roster minus the two shown) in the accent, small
       and semibold so it reads inside the 22px disc (Maryam 30 Sep 2026). */
    const moreFaces = Math.max(0, k.seats - 2);
    return `<div class="lcal lcal-next dark-card">
    <span class="lcal-slot">
      <span class="lcal-slot-ic">${I.calendar}</span>
      <span class="lcal-slot-day t-desc">${k.day}</span>
      <span class="lcal-slot-tm t-h3">${k.time}</span>
    </span>
    <span class="lcal-body">
      <span class="lcal-h">
        ${''/* THE TITLE IS "Week N Cohort Session" (Maryam 30 Sep 2026), the
               week off the cohort record; `lcTitle`'s "Cohort N call" stays on the
               other call surfaces. */}
        <span class="lcal-t t-h3">Next Cohort Session</span>
        ${''/* A STATIC COUNTDOWN LABEL in the HH:MM form, "In 02:40" (Maryam 2 Oct
               2026: "the black card time count should be In 02:40" — the dashboard
               now matches the Sessions page). No `data-calltill`, so `callTimerArm`
               leaves it alone — the demo card reads the call as still ahead, which
               also keeps the Join in its accent-disabled state. Callers may still
               override it. */}
        <span class="lcal-timerbox">${I.time}<span class="lcal-timer t-h4">${o.countdown || 'Starts in 2h 40m'}</span></span>
      </span>
      <span class="lcal-seatsrow">
        ${faces ? `<span class="lcal-faces">${faces}${moreFaces ? `<span class="lcal-face-more">+${moreFaces}</span>` : ''}</span>` : ''}
        <span class="lcal-seats t-desc">${k.seats} candidates</span>
      </span>
      <span class="lcal-f">
        ${''/* "N minutes session" (Maryam 30 Sep 2026), the black dashboard card only. */}
        <span class="lcal-m t-desc">${k.mins}-minute session</span>
        ${act}
      </span>
    </span>
  </div>`;
  }
  return `<button class="lcal" data-go="leadCohort" data-ldrco="${k.co}">
    ${''/* THE TITLE LEADS THE HEADER ROW, AND THE COHORT-NUMBER COVER IS GONE
           (Maryam, 9 Sep 2026: "remove the cohort number from the all cards top
           left"). The date stays the word-over-figure block (`.lcal-when`) at the
           right end. This light path is unchanged; the black card is above. */}
    <span class="lcal-h">
      <span class="lcal-t t-h3">${lcTitle(k)}</span>
      <span class="lcal-when">
        <span class="lcal-day t-desc">${k.day}</span>
        <span class="lcal-tm t-h4">${k.time}</span>
      </span>
    </span>
    <span class="lcal-f">
      <span class="lcal-m t-desc">${k.mins} minutes</span>
      ${act}
    </span>
  </button>`;
};

/* THE SENTENCE IS DERIVED AND SAYS THE ONE THING THE CARDS DO NOT — that these
   repeat. Every other fact in the block is on a card; what a row of three
   cannot say is that it is three because there are three cohorts and each meets
   once a week. `PAGESUM` owns the head band's summary and this is the section's
   own opening line, which is §72's split between the two.
   NO SPARKLE ON THIS HEADING, which is where the reference is not followed:
   it draws one, and §73's rule is one star per page region — Tal's card is 40px
   above with `talLabel()`'s mark on it, and a second says the page has stopped
   attributing and started decorating. `mark:true` is the one-word reversal. */
const leadCallsSec = () => {
  const up = lcalls();
  return `<div class="sec" id="lead-calls">
    ${''/* NO DESCRIPTION (Maryam, 9 Sep 2026: "remove the desc of this"). The
           section title and the cards say what this is; the one-line lede came
           off the same way §72/§73 took the repeated ledes off the candidate
           dashboard. */}
    ${aiHead({title:'Your upcoming calls',
      act:up.length ? `<button class="btn btn-g btn-sm noic" data-go="leadCalls">View all sessions</button>` : ''})}
    ${up.length
      ? `<div class="lcal-row">${up.map((k, i) => lcalCard(k, i === 0)).join('')}</div>`
      : `<div class="empty" style="border:0">${I.calendar}<h3>Nothing this week</h3><p>Every cohort you lead has a weekly call, and they all show up here.</p></div>`}
  </div>`;
};

/* THE FOURTH ARGUMENT IS A RAW ATTRIBUTE, and it exists because a row in a
   QUEUE has to carry its own subject (Maryam, 1 Sep 2026: "it should not take me
   there instead open the detail view of that awaiting decision even when i click
   it from the dashboard").

   `data-go` alone can only name a VIEW, so both of these rows opened the
   Evaluations list — which then showed the same two rows again, one click from
   the same two rows the leader had just pressed. The detail page reads its
   subject off `S.ldrSum`, set by lead3's capture-phase listener on
   `[data-ldrsum]`, so the row needs that attribute beside its `data-go`; this is
   the same shape `crow`'s `second.at` takes and the same reason.

   IT IS OPTIONAL, so the other caller is untouched — `V.leadDash`'s queue is the
   only one that had this problem, because the Evaluations page's own rows have
   always written `data-ldrsum`.

   AND THE FIFTH IS THE ARROW'S LABEL — `.row-cta`, §112, the same argument and
   the same class `gcard` takes (Maryam, 2 Sep 2026: "instead of arrows only,
   add text on left of the arrow 'Evaluate Candidate'").

   IT TURNS OVER "AN ARROW, NOT A VERB", WHICH IS STATED TWICE IN THIS FILE and
   is worth reading before it is turned back. `bookedRow`'s note makes the case
   at length: the two words in that slot were "Join" and "Brief", they named the
   KIND of appointment as much as the action, and neither of them happened on
   the row — both opened another page — so the row was made the target and given
   the arrow every openable row in this product wears. **That argument is about
   a VERB THAT LIES, not about a label as such.** "Evaluate Candidate" is what
   the page this row opens is for, and it is one destination rather than one of
   two, so the objection does not reach it. `bookedRow` is untouched.

   A `<span>`, NOT A `<button>` — the row is the control and a `<button>` inside
   a `<button>` is invalid markup with two targets doing one job. */
function faceRow(p, detail, go, at, cta){
  return `<button class="tile clk gcard face-row" data-go="${go}"${at ? ' ' + at : ''}>
    <span class="mem-av mem-ph">${avatar({i:p.i, img:AV[p.img]}, 36)}</span>
    <span class="gcard-b"><h3>${p.name}</h3><span class="sub">${detail}</span></span>
    ${cta ? `<span class="row-cta">${cta}</span>` : ''}
    <svg class="tile-arrow" viewBox="0 0 24 24">${inner('arrowRight')}</svg>
  </button>`;
}

/* ==========================================================================
   THE DASHBOARD
   The wireframe's leader dashboard opened with a banner picking the single
   most urgent thing, then four stats, then three lists. That reading order is
   right and it is kept. What changes is what draws each part:

   THE BANNER BECOMES TAL'S CARD. The wireframe drew a bespoke `.bnr` — icon,
   eyebrow, headline, sentence, one button — for "the one thing to do about
   right now". This product already has that object and it is the Tal card in
   the module head band: eyebrow, sentence, and the required action riding the
   head row (see ai5.js). Drawing a second one would be two components for one
   idea, which is the mistake §29.4 records for the level card.

   THE SESSION BECOMES A PLATE — AND SINCE 31 AUG 2026 IT IS THE BLACK CALL
   CARD INSTEAD, which is the same argument arriving at a component that did not
   exist when this was written. An appointment is a subject at a time that you
   join, and every one of those in this product WAS a `.plate` — the black wall
   with a face. `.plate` moves itself into the head band (`placeDark`), so the
   card sat above the four figures in a 330px column; Maryam took it out of the
   band and put it where the candidate portal puts the same object, directly
   under Tal's summary, as §75's `.dark-card` with §77's row in it. The note over
   `leadCallCard` is the long version. What survives from this paragraph is its
   conclusion: the card says "this is an appointment" without a heading having to
   say it, and it is still the only appointment drawn on the page — which since
   1 Sep 2026 is the next COHORT CALL, the only kind of appointment a cohort
   leader has.

   THE ATTENTION QUEUE STAYS A TABLE. It is five aligned facts about each of
   several people, read by scanning down a column — the one shape on either
   portal that genuinely is tabular. `.tbl` already exists.

   THE FIGURE CELLS GO THROUGH `statCell()`, NOT INLINE MARKUP. §29.17 moved the
   label and the figure onto one line inside a `.stat-top` wrapper; a hand-built
   `.stat` with `.l` and `.n` as direct children still matches the OLD grid
   areas in §24 and lands with the note in the label's slot. The helper is the
   only correct way to draw one — it is also why its `.d` note is three or four
   words in every existing call site, and these match that register.

   NO ACTION IN THE STANDING CARD'S HEADING. A section whose body is a tile
   keeps the desktop label column — §10.15 opts out sections of ROWS, and a tile
   is not a row — and that column is 184px wide. §10 records exactly what
   happens when a heading inside it also carries an unshrinkable button: the
   button takes the width and the h2 renders one letter per line. So that
   heading stays a heading and its action goes under the tile, which is where
   the transcript's "Show all 13" sits for the same reason.

   YOUR STANDING IS FOUR CELLS, NOT FIVE. `.facts` is an auto-fit grid, so a
   fifth cell lands alone on a second row and §10 spans it the full width — a
   band of four tidy figures with one stretched underneath it. Four is also what
   the fact band on Interviews holds and what the stats band at the top of this
   page holds, so the page keeps one rhythm instead of two. "Leading since" was
   the cell to lose: it is a fact ABOUT the leader rather than a measure OF
   them, and it reads better in the line that dates the other four.

   COMMENTS INSIDE A VIEW STAY OUT OF THE TEMPLATE LITERAL. An HTML comment in
   the returned markup is inside a backtick string, so a backtick in the prose —
   which this file's own convention puts around every class name — closes the
   string and the next line is parsed as a tagged template. It fails as
   "(intermediate value).tile is not a function", nowhere near the comment.
   Reasoning about a view belongs in a block like this one, above it.
   ========================================================================== */
/* THE CERTIFIED-COHORT-LEADER BADGE — the candidate's completion banner
   (`certBanner` / `.certban`, views.js) brought to the leader dashboard, after
   the call cards (Maryam, 9 Sep 2026: "just like how we show the badge on
   candidate portal ... show on the cohort leader dashboard after the call cards
   ... this badge will be mostly about the Certified Cohort Leader badge"). The
   `.certban` shape ships in the design system, so this is only the leader's copy
   of it — the mark, the two lines and the View button, no dismiss (it is a
   standing credential, not a one-off notice). `CERT_ART.explorer` is the
   platform's certification-badge art, reused as a PLACEHOLDER because the seed
   holds no Certified-Cohort-Leader asset (§74; a real badge WebP is the file to
   drop in). "View" opens the leader profile, where the credential lives. */
const leadCertBanner = () => `<div class="sec">
  <div class="certban">
    <span class="certban-mk"><img src="${CERT_ART.explorer}" alt=""></span>
    <span class="certban-b">
      <span class="certban-t">Certified Cohort Leader</span>
      <span class="certban-m">Verified by TalentNext &middot; Volunteer cohort leader</span>
    </span>
    <span class="certban-a">
      <button class="btn btn-p btn-sm noic" data-go="leadProfile">View</button>
    </span>
  </div>
</div>`;

/* ==========================================================================
   ALL SEVEN MODULES ARE DRAWN, AND NOT IN THIS FILE

   This is where `LEAD_SOON` used to be: seven "coming in the next pass" empty
   states, one per module, so that a rail offering seven modules from the first
   paint was not offering seven dead ends. All seven are now real pages, and
   four more sit under them:

     lead2.js   Cohorts, one cohort's roster, one candidate, Course Reports
     lead3.js   Calls, Evaluations, one 90-day summary
     lead4.js   Messages, Certifications, the leader's own profile

   Two things a reader of this file needs from those three, both of which cost
   an afternoon to find out:

   1. A LEADER PAGE MUST HAVE A `PAGESUM` ENTRY (ai6.js). `talFirst` in
      views.js hoists any section holding an `.ai-aura` to the top of the page,
      `placeBand` pulls it into the module head band, and ai6 then replaces its
      words with `pageSummary()` — so a page's Tal copy is a `PAGESUM` row, not
      markup in the view. With no row, the card is left in a shape §33 does not
      style and the band renders 700px wider than the page.

   2. A DARK CARD MOVES. `.plate` and `.cert` are in ai5's `DARK_CARD` list,
      and `placeDark` lifts whichever page child contains one into the band.
      One per page; a second is a slab.
   ========================================================================== */

/* ==========================================================================
   THE STICKY POSITION-INDICATOR IS GONE (Maryam, 9 Sep 2026: "hide the fix
   tabs interaction, go with the generic scroll just like other pages").
   `leadStick` made the figure band stick to the top of the scroller and turn
   into a tab strip that lit the section you were in, and a capture-phase scroll
   listener on `device` drove it; a click handler scrolled to a pressed card's
   section. All of it is removed — the four figures are now plain stat cells and
   the page scrolls like every other dashboard. The `.lead-bar` markup and the
   `data-jump` cells went with it in `V.leadDash`; the section ids stay for the
   figure counts. §31.4's `.lead-bar` / `.lead-tabs` / `.is-stuck` / `.is-gone`
   CSS is now dead — left in place because it is interleaved with `.stat-jump`,
   which lead2's "Next call" cell still uses (statCell's `at` arg), and the
   `.lead-bar` rules match nothing so they are harmless. A tidy-up can lift them.
   ========================================================================== */

/* ==========================================================================
   SEARCH AND FILTER — DELETED 1 SEP 2026, AND THE ONE IDEA WORTH KEEPING

   This was `leadFilterApply` and two listeners: a search field and three
   severity chips over a twelve-row queue. Maryam took all of it off with the
   helper line and the count, and the view records why — three rows do not need
   finding, and a filter whose every state is legible in the thing it filters is
   chrome.

   THE TECHNIQUE IS THE PART TO REMEMBER, because the next control that lives
   over a list will hit it. It filtered the DOM and did NOT re-render: `render()`
   replaces the whole view column, which destroys an `<input>` on every keystroke
   and takes the caret and the focus with it — the same trap ai4.js records for
   the ask thread. So typing updated `S.leadQ` and toggled a class on each row,
   the state lived on `S` so a render triggered by something else (opening Tal,
   the bell) could not silently reset it, and the render wrapper re-applied it
   after every paint. Anything typed into a leader page wants that shape.
   ========================================================================== */
/* ==========================================================================
   THE LEADER'S PAGES NAME THEMSELVES IN THE ASK

   The ask line used to be the fourth member of the module head band, and this
   block is where the leader's landing page opted into it (`ASK_ON.push`). It
   does not have to opt in any more: ai4 moved the field out of the band and
   onto the bottom edge of the view column, on every page of both portals, so
   the list it was pushing to is gone — every leader page has the field,
   including the five module landings that are still stubs. That is the right
   answer for a stub too: "this page is not built yet" is a reasonable thing
   to want to ask Tal about, and the field is no longer part of the page's own
   composition, so it cannot make a thin page look thinner.

   What is still needed is the LABEL. `askView` prints "Back to ${where}", and
   ASK_WHERE is ai4's map of view to page name — the candidate's half only.
   `LEAD_TAL.where` is the same map for the leader, already written above for
   the Tal panel's own header, so the two surfaces name a page identically
   rather than each keeping a copy that can drift.
   ========================================================================== */
Object.assign(ASK_WHERE, LEAD_TAL.where);

/* ==========================================================================
   THE APP SAYS WHICH PORTAL IT IS SHOWING
   Same reasoning as `stampView` in ai5.js: a handful of corrections are true
   of one portal and not the other, and there was no way to say so in CSS.
   Wrapping rather than editing `render` keeps this file the only place the
   leader portal touches the runtime.
   ========================================================================== */
const _baseLead = render;
render = function(){
  _baseLead();
  try {
    const app = device.querySelector('.app');
    if(app) app.dataset.portal = S.portal || 'candidate';
    /* EPIC 12.2 — the roster search now filters the DATA (so pagination works),
       so after the render a keystroke triggers, put the caret back where it was
       (`leadRestoreRosterFocus`, the admin's SRCH_FOCUS). And position the open
       roster kebab (§125 `placeLeadRowMenu`, lifted out of the sideways-clipping
       `.tbl-wrap`). Both no-op off the My Cohort page. */
    /* keep the page where it was on a roster re-render (kebab / pagination /
       sort / filter / search) before positioning the kebab — else `.main`
       resets to the top. The stash is set by `ldrRerender`. */
    if(S.ldrKeepScroll != null){ const m = device.querySelector('.main'); if(m){ void m.scrollHeight; /* force layout so scrollTop is not clamped to 0 before the new content measures */
      /* `.main` is `scroll-behavior:smooth`, so a plain scrollTop assignment
         ANIMATES from the reset 0 back down — the visible "jerk from the top to
         here" Maryam saw opening/closing the roster level filter. Force `auto`
         for the one assignment so it lands instantly (the agent portal's idiom). */
      m.style.scrollBehavior = 'auto'; m.scrollTop = S.ldrKeepScroll; m.style.scrollBehavior = ''; } S.ldrKeepScroll = null; }
    if(typeof leadRestoreRosterFocus === 'function') leadRestoreRosterFocus();
    /* PLACE THE KEBAB AGAIN ONCE THE RENDER HAS SETTLED (Maryam, 8 Oct 2026: "i have
       clicked on the first row menu and the dropdown opened this far"). This wrapper
       runs before the later render passes (the head band, the page summary), which
       still move the content above the roster, so a menu measured here landed ~130px
       off its row. A zero-delay timeout runs after every synchronous pass (setTimeout,
       not rAF — trap 17). The first call stays so the menu is never unplaced. */
    if(typeof placeLeadRowMenu === 'function'){ placeLeadRowMenu(); setTimeout(placeLeadRowMenu, 0); }
    /* `leadStick()` was called here to drive the sticky position-indicator; the
       bar and its scroll-spy were removed 9 Sep 2026 (see the note above), so the
       wrapper now only stamps `data-portal`, which both stylesheets scope on. */
  } catch(e){ console.warn('portal stamp', e); }
};

/* THE LAST STATEMENT, FOR THE REASON ai5.js RECORDS. The boot render is the
   final line of views.js and runs before this file is parsed, so the page on
   screen at that moment was drawn without `data-portal` and without any of the
   leader views in `V`. One call, at the foot, same as every pass before it. */
render();
