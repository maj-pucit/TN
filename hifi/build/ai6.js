/* ==========================================================================
   EVERY PAGE OPENS WITH TAL SAYING WHAT THIS PAGE IS

   Until now Tal's card at the head of a page was ADVICE — "Before your
   re-interview", "What the 90 days ask of you" — and only nine of the
   twenty-three pages had one. That is a different job from the one this
   pass installs. The card is now a PAGE SUMMARY: two conversational
   sentences that tell you, before you read anything else, what is on this
   page and what is going on. Every page gets one, and they all read in the
   same voice.

   THREE THINGS CHANGE, AND ONLY IN THE HEAD BAND.

   1. The heading goes. "Tal" over a bold title over a grey sentence was
      three levels of hierarchy for one short paragraph, and the title was
      usually the page's own name said a second time. What is left is the
      mark, Tal's name, and the sentence — and with nothing above it to
      compete, the sentence is the prominent thing on the block, which is
      what it should have been all along. §33 gives it the ink to match.

   2. The suggested questions go, everywhere they appear at the top of a
      page. They were an offer made before you had read the page they were
      offering to explain, and on a summary they are noise around the one
      line you are meant to read. Tal is still one press away on the FAB,
      and the questions Tal's own panel offers are untouched — this pass
      only clears the top of a page.

   3. The card stops being a button. Its only visible affordance WAS the
      chips; with those gone, `enhanceTalCards`'s whole-card `role="button"`
      is an invisible control wrapped around a paragraph, which is worse
      than no control. Stripped here rather than in views.js because the
      chips are what justified it, and the chips leave here.

   A PASS, NOT TWENTY-THREE EDITS. The summaries are one voice and belong in
   one table; a page that gains a Tal card, or a whole new page, needs no
   work beyond a row in `PAGESUM`. This also reaches the four pages that
   have no `.ph` at all — report, agent, booking, messages — which
   `placeBand` skips by design, and gives them a band of their own with
   nothing in it but Tal.

   LAST IN THE JS ORDER, and that is load-bearing twice over: `placeBand`
   (ai5) has to have assembled the band before this can find it, and
   `enhanceTalCards` (views.js) has to have added its chips before this can
   take them out again.
   ========================================================================== */

/* --------------------------------------------------------------------------
   THE SUMMARIES

   SHORT. CONVERSATIONAL. THE FEW THINGS THAT MATTER. This table has been
   rewritten three times and every earlier version failed in a way worth
   recording, because the pull is towards all of them.

   The first version NAMED THE SECTIONS: "Points, badges and rank, and what
   moves each one." That is a caption, and a caption under a page the reader
   can already see is furniture. The test that kills it: could the line have
   been written without reading the page?

   The second version over-corrected into PROSE. It had the right facts and
   the wrong register — "The 90 days, closed out and gathered here",
   "This is the page that holds the evidence of what you did". Openers that
   set a scene, closers that explain what the page is for, five sentences
   where two would do. Nobody reads a summary for the writing. The client's
   word for it was "a story", and it is: a paragraph performing rather than
   telling you the two things you needed.

   The third version — the one this replaces — got the register right and
   still lost, on two counts that only show up once you look at the page
   rather than at the table.

   IT SAID WHAT THE GREY LINE ABOVE IT HAD JUST SAID. `ph()`'s second
   argument is a page description, and on nineteen pages it was a SENTENCE
   explaining the page — so the reader met the same fact twice, six
   millimetres apart, in two voices. Profile: "Your details, your
   preferences, and what Tal is allowed to do", then Tal saying "Your
   details, how you want to be contacted, and what Tal is allowed to do."
   Cohort: "Ten people at Explorer – E3, led by Priya Nair · week 5 of 13",
   then Tal saying "Ten of you at E3 with Priya leading, week 5 of 13". On
   Interviews the plate below it made it three times. That is fixed on BOTH
   sides and the split is now a rule: THE DESCRIPTION CARRIES FACTS, TAL
   CARRIES THE READING. Where a page has a factual spine it goes in the
   description as a `·` row — the shape Course Progress and one-candidate
   already used — and where it has none the description is dropped and the
   title stands alone over Tal's sentence. Before adding a summary here,
   read the page's `ph()` and make sure they are not the same sentence.

   IT EXPLAINED THE PRODUCT INSTEAD OF READING THE PAGE. A third of the
   table was policy and mechanism — "each row downloads its receipt",
   "closing your account is at the foot", "this is the only thing that sets
   or changes your level", "the same thread its members read on their own
   Cohort page". None of it is what a person came to catch up on, two of
   them pointed at controls the reader can see, and the last one explains
   the OTHER PORTAL to a leader who does not use it. An AI-native product
   does not get to spend its one paragraph describing itself.

   So the rule, and it is now five things:

     - TWO SENTENCES, 18 TO 28 WORDS. Not three. Say the thing and stop.
     - THE FACTS, IN THE ORDER A PERSON WOULD ASK FOR THEM. Where you are,
       what is open, what is on you. Numbers are the content: "day 34 of 90,
       5 of 13 chapters at 88%" is the whole first sentence.
     - IT MUST BE A CATCH-UP, NOT A DESCRIPTION. The reader is someone
       returning to a page they have seen before and wanting to know what
       moved. If the sentence would read the same next week, it is a caption.
     - NO FRAMING, NO POLICY, NO POINTING AT THE UI. Nothing that describes
       the page rather than what is on it, nothing about how the product
       works in general, and nothing about where a control is. The reader is
       looking at the page.
     - AND NOTHING FROM THE OTHER PORTAL. A candidate is not told they could
       lead a cohort; a leader is not told what their candidates' Cohort page
       looks like. Both were in the last version, twice each, and both are
       the reason a reader stops trusting the paragraph.
     - CONTRACTIONS, PLAIN WORDS. It is Tal talking to one person, not a
       report being filed.
     - Never repeat the page title or its description. Both are directly above.

   A value is a string, a function of the stage's config, or an object keyed
   by stage with `_` as the fallback. Functions get `f` — `cfg(S.stage)` —
   and read the same globals the views do, so the figures cannot drift from
   the page they are summarising.
   -------------------------------------------------------------------------- */

/* about-N-hours, from the minutes the course record holds. Rounded, and
   spoken as "about", because a summary that says 11.7 hours is reading the
   data out rather than summarising it. */
const _hrs = m => Math.round(m / 60);
const _n = x => x.toLocaleString('en-US');
/* "a 88% average" is the tell that a number was dropped into a sentence
   written around a different one. The article follows how the figure is
   SPOKEN, not how it is spelt: eighty, eleven and eighteen all open on a
   vowel, so 8x, 11 and 18x take "an" and everything else takes "a". */
const _an = n => /^(8|11|18)/.test(String(n)) ? 'an' : 'a';
/* SMALL COUNTS ARE SPELT AT THE START OF A SENTENCE, and this is not
   fussiness — it is the single change that did most for the leader side's
   voice. "4 decisions are waiting on your signature" opens on a glyph and
   reads as a figure lifted off a dashboard; "Four decisions are waiting"
   reads as somebody telling you. Twelve is the ceiling: past it the numeral
   IS how a person says the number, and a spelt "twenty-eight" beside a
   numeric 28 elsewhere on the same page is worse than either choice made
   consistently. MID-SENTENCE, ALWAYS THE NUMERAL — "5 of 13 chapters" is
   the figure being read, and spelling it there would be the opposite
   mistake. `_W` capitalises for sentence-start, `_w` does not, for the
   clause-subject case ("and four have never signed in").

   THIS IS NOT A NEW CONVENTION, it is one the product already kept without
   writing down: every "Forty-five minutes" in the build opens a sentence and
   every "45 minutes" sits inside one — eight against twenty-seven, and not a
   single exception either way. The leader side was the half that had drifted
   off it, because those summaries are assembled from counts rather than
   written out, and a template that starts `${n} decisions` has no way to
   know it is starting a sentence. That is what these two exist for. */
const _WORDS = ['no','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve'];
/* AND `a.slot` IS A CARD LABEL, NOT A CLAUSE. It is stored as "Thu, Aug 20
   &middot; 6:30 PM", which is correct on the agent card and wrong inside a
   sentence twice over: a middot mid-prose reads as the sentence breaking, and
   three-letter days and months are an abbreviation a person does not speak.
   Spoken out here only — the card keeps its own compact drawing. */
const _DAYW = {Mon:'Monday',Tue:'Tuesday',Wed:'Wednesday',Thu:'Thursday',Fri:'Friday',Sat:'Saturday',Sun:'Sunday'};
const _MONW = {Jan:'January',Feb:'February',Mar:'March',Apr:'April',May:'May',Jun:'June',
               Jul:'July',Aug:'August',Sep:'September',Oct:'October',Nov:'November',Dec:'December'};
const _slot = s => {
  const m = /^(\w{3}), (\w{3}) (\d+)\s*(?:&middot;|\u00b7)\s*(.+)$/.exec(String(s || ''));
  return m ? `${_DAYW[m[1]] || m[1]} ${m[3]} ${_MONW[m[2]] || m[2]} at ${m[4]}` : s;
};
const _w = n => n >= 0 && n <= 12 ? _WORDS[n] : _n(n);
const _W = n => { const s = _w(n); return s.charAt(0).toUpperCase() + s.slice(1); };

/* THE ONE THING IN THIS FILE THAT READS A CLOCK — Figma 599:7427.
   The three enrolled dashboards open on "Good morning, Maryam!", which is the
   file's line and is the only greeting in the table that can be WRONG: the
   other three say "Welcome Back", which is true at any hour. Rather than take
   the file's words and let the product say good morning at ten at night, or
   drop them and lose the one screen that greets you by time of day, it is
   derived. Four lines, one place.

   THE BOUNDARIES ARE NOON AND SIX, which is the ordinary English division and
   the one the reader will not notice. `getHours` is local time, which is the
   reader's, which is the only one a greeting can mean.

   IT RE-TYPES ACROSS A BOUNDARY, and that is correct rather than a side effect.
   `sumKey` is a function of the summary's own text (see `typeSummary`), so a
   dashboard left open past noon and returned to types the line again — Tal has
   said something new, which is exactly when this table wants the animation. */
const _greet = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
};

const PAGESUM = {

  /* --- the journey ----------------------------------------------------- */
  /* THE GREETING HAS LEFT THE SUMMARY, AND IT IS THE PAGE'S `<h1>` AGAIN.
     Every entry in this block used to open with `<span class="tal-greet">
     Welcome back, Maryam!</span>`, which §33.9 sizes at 22px and — the other
     half of that decision — hides the page's own `.ph` for. It was the right
     shape while Tal's card was the first thing in the band: one voice, saying
     hello and then saying where you stand.

     §56 gives the band two columns and puts the title, the fact row and the
     steps ABOVE Tal in the left one, so the greeting would have been the
     fourth thing on the page and the second heading in the same column. The
     `.ph` is the heading again — `Welcome back, Maryam` over `Explorer Track
     – E3 · Cohort 41 · week 5 of 13`, which is exactly the pair the leader's
     dashboard has always drawn (`lead.js`, `ph('Welcome back, Priya', …)`) and
     the shape the frame asks for.

     NOTHING IS LOST FROM THE COPY: every `.ph` on the eight dashboard stages
     already carried the same words, because the greeting was written from
     them. What Tal says now starts at the reading, which is what the rest of
     the table has always done — and it means the summary is the only prose in
     the band on the dashboard too, not just on the other nineteen pages.

     `.tal-greet` ITSELF STAYS, in §33.9 and in the design system. It is a real
     component — a greeting line inside a summary — and `tn-agent-portal.html`
     is built on it. This is the candidate portal choosing the other shape, not
     the shape being withdrawn. */
  dashboard: {
    consult: 'Your quiz put you on the Explorer track from a score of 64. Jordan Blake calls on Thursday at 2:00 PM for fifteen minutes. Nothing to prepare, and it doesn&rsquo;t set your level.',

    /* THE ONE ENTRY THAT OPENS ON A GREETING AGAIN, AND THE ONE THAT RUNS LONG.
       578:5966 makes Tal's sentence the whole left column of the band — there is
       no `<h1>` on screen above it (§70 hides the `.ph` for that band; the view's
       own note is the argument) — so the summary has to say hello, and it has
       the room to say more than the table's usual two sentences. Both are
       deliberate exceptions to the rules at the head of this file and both are
       local to this key: the other nine entries keep their 18–28 words under a
       title that is still drawn.

       IT IS NOT `.tal-greet`. That span is the mechanism §33.9 built for exactly
       this shape and it comes with `display:none` on the `.ph` and a 22px line;
       the file draws the greeting at the paragraph's own size and the heading is
       wanted in the accessibility tree. Plain text, so it types with the rest of
       the line rather than being filled in before the clock starts (`SUM_LEAVE`).

       THE THREE HIGHLIGHTS ARE `<b>`, WHICH IS WHAT `.ai-body p b` ALREADY IS.
       The file draws them as absolutely-placed tinted rectangles behind orange
       text; in markup that is one element with a ground, and §70 gives it the
       5%-accent wash and 4px radius the file measures. `sumRuns` walks text
       nodes, so the typing reveals them in place and the ghost holds the same
       box — inline markup here costs nothing.

       "ON THE RIGHT" BECAME "BELOW", AND THAT IS THE ONE COPY EDIT. 581:6671
       points at Priya as being in the right-hand column, which is where the file
       has her; the journey has that column here and the recommendation is the
       section under the band. A sentence that points at the wrong side of the
       screen is worse than one that points at no side. */
    /* 581:6671 VERBATIM, WITH TWO EDITS AND BOTH ARE WRITTEN DOWN. The file
       reads "Considering your strenghts" — a typo — and it points at Priya as
       being "on the right", which she is not on either surface: the file draws
       the recommendation in a section UNDER the band, the same as this page
       does, so the phrase is a leftover from a layout neither of us has. A
       sentence that points at the wrong side of the screen is worse than one
       that points at no side. Everything else is the file's words in the
       file's order, including "E1 - E5" as a range and "analyzed". */
    /* A FUNCTION, BECAUSE THE NAME IN IT IS NOW STATE. "Ask Tal for a different
       agent" swaps the card below for another of the three, and a summary that
       kept saying "Priya Nair" would be Tal naming a match the page is no
       longer showing — the exact drift the note at the head of this table is
       written to prevent. `recKey` and `AGENTS` are views.js's, parsed long
       before this file. It re-types when it changes, which is correct: Tal has
       said something new. */
    /* AND "CONSIDERING YOUR STRENGTHS" NOW HAS SOMETHING BEHIND IT, WHICH IT
       DID NOT FOR AS LONG AS THIS ENTRY EXISTED.

       The clause claims Tal weighed something about this candidate before
       picking an agent, and until the `onboard` stage landed the only inputs
       on this page were a quiz score of 64 and the word Explorer. `REC.priya`
       then stated `match:'98%'` against a "need for System Design" — a band
       `SCORES` does not measure. So the sentence was Tal describing reasoning
       that had not happened, on the page where the product asks for $95.

       THE ONBOARDING IS WHAT MAKES IT TRUE, so the clause is now the
       candidate's own answer, quoted. `S.ob.why` is the option they pressed on
       step 3 and `obLabel` reads its label out of `OB_Q`, so this sentence and
       the read-back they saw one screen earlier cannot word it differently.

       THE OLD CLAUSE IS THE FALLBACK AND IT IS STILL REACHED. `new` is
       reachable from the stage picker and from a returning log-in without the
       gate in front of it, and on those arrivals `S.ob.why` is null. Rather
       than invent a reading, Tal drops to what it can honestly say: the roster
       was analysed, which is true of a shortlist keyed on level range.

       THE GUARD IS `S.obReady` AND `typeof obLabel === 'function'` IS THE
       VERSION THAT THROWS. It shipped that way for one build and respcheck
       caught it on four screens: **`typeof` does not protect against a
       temporal dead zone.** It is safe on an undeclared name and on a hoisted
       `function`, and it throws a ReferenceError on a `let` or `const` that
       has been parsed and not yet evaluated — which is exactly what `const
       obLabel` in ob.js is on every render before that file runs, and this
       file's own boot render is one of them. `S.obReady` is a plain property
       set as ob.js's last statement, so it reads `undefined` instead of
       throwing. views.js's `onboard` render branch records the same lesson
       from the other direction.

       `data-sum="match"` STAYS ON THE NAME IN BOTH BRANCHES — §65's dropdown
       keys on it, and moving the marker would take the working out of the
       phrase it explains.

       THE ANSWER IS QUOTED RATHER THAN LOWERCASED, for the reason `obFit`
       records: three of step 3's options open with the pronoun I, so folding
       one into a sentence with `charAt(0).toLowerCase()` produces "You told me
       i do not trust the handover". Quotation marks need no case surgery and
       they mark the words as the reader's own, which is the point. */
    new: () => {
      const said = (S.obReady && S.ob && S.ob.why)
        ? 'You told me &ldquo;<b>' + obLabel('why') + '</b>&rdquo;, so I have gone through the active roster and '
        : 'Considering your strengths I have analyzed the active roster and ';
      return 'Welcome Back, Maryam! Based on your <b data-sum="quiz">quiz results</b>, you are currently on <b data-sum="track">Explorer track</b>. Your level from E1 - E5 anchors after a 45-minute interview. '
        + said + '<b data-sum="match">matched you with ' + AGENTS[recKey()].n + ' below</b> to specifically anchor your growth areas.';
    },

    /* THE SAME SHAPE AS `new`, ONE STEP ON — greeting, then three phrases that
       open. The facts are the ones this entry already carried; what is added is
       the greeting §70.3 needs (the `.ph` is off-screen on every page with a
       journey column) and the three `data-sum` keys. `track` is the SECOND page
       to use that card, which is the whole point of keying by subject.

       AND IT IS DEAD COPY, KEPT IN SYNC ON PURPOSE. `ai7.js` overrides this key
       outright (`PAGESUM.dashboard.booked = () => …`) so that the name, the
       date and the day come off the booking record rather than being typed —
       ai7 parses after this file and always wins. What is written here is the
       same sentence with the record's four values frozen at their defaults, so
       that reading this table tells you what the page says. Edit the two
       together; a hard-coded fallback that disagrees with the live line is
       worse than no fallback. */
    booked: 'Welcome back, Maryam! Your <b data-sum="interview">interview with Priya Nair</b> is confirmed for Thursday, August 20, at 6:30 PM. The session lasts 45 minutes and will be recorded. Review your interview guide and spend <b data-sum="prep">a few minutes preparing</b> before your call.',
    /* THE RESCHEDULE FORK — `booked`'s entry, copied. See its STAGES row. */
    resched: 'Welcome back, Maryam! Your <b data-sum="interview">interview with Priya Nair</b> is confirmed for Thursday, August 20, at 6:30 PM. The session lasts 45 minutes and will be recorded. Review your interview guide and spend <b data-sum="prep">a few minutes preparing</b> before your call.',

    /* THE 24-HOUR WAIT (17.1). No `data-sum` phrases: there is no next action to
       point a popover at, and every clause here is settled. No em dash (Tal
       voice). The card in the body is `.ai-aura` too, so this replaces it via
       `placePageSummary` — trap 11 needs this entry to exist for the stage. */
    /* 24h PROMISE, WITH THE OVERDUE LINE (Maryam, 1 Oct 2026 — one number, 24h).
       A function so the overdue state can differ; `heldOverdue` is a views.js const,
       parsed before this file. Neither branch has a `data-sum` phrase: no next action. */
    held: () => (typeof heldOverdue === 'function' && heldOverdue())
      ? 'Your interview result is taking a little longer than usual. We will have it to you shortly.'
      : 'Your interview with Priya Nair is complete. TALENTnext is analysing your interview to determine your level. Your report will be ready within <b>24 hours</b>.',

    assessed: 'Welcome back, Maryam! TALENTnext has assigned you <b data-sum="level">Explorer &ndash; E3</b>, rung 3 of 15, following your interview on August 21. Your key growth areas are <b data-sum="growth">delegation and hard conversations</b>. <b data-sum="enrol">Enrolling in a course</b> is your next step.',

    /* ENROLLED, COHORT NOT STARTED (story 15.2). No `data-sum` phrases: the one
       thing to do is a section on the page (meet your cohort), not a popover, and
       the rest is settled. No em dash (Tal voice). trap 11 needs this entry so
       the placeholder card has a summary to become. */
    enrolPre: 'You are enrolled on <b>Cohort 41</b>, led by <b>Priya Nair</b>. It starts in 6 days. You can <b>read the course outline</b> now; your cohort, the chapters, Course Progress and Achievements open on the start day.',

    /* COHORT CANCELLED, MOVED TO A REPLACEMENT (story 7.6 / 15.2). The admin&rsquo;s
       reason is internal and is never shown here. */
    cancelled: 'Your cohort was cancelled, and you have been moved to <b>Cohort 47</b>, which starts on 12 Mar 2026. Your place and your payment carried over, so there is nothing to pay again.',

    /* INTERVIEW COULD NOT TAKE PLACE, REBOOKING CREDIT ACTIVE (story 8.3 / 15.2). */
    rebook: 'Your interview with <b>Priya Nair</b> could not take place. You have a <b>free rebooking</b> with 14 days left to use it, so book another interview whenever you are ready.',

    /* ------------------------------------------------------------------
       THE THREE ENROLLED STAGES — Figma 599:7418, and the same three
       exceptions §70 bought for `new`.

       599:7418 gives the course dashboards the AI-native head, so all three
       of the local rules `new`'s entry records apply here too and for the
       same reasons: the summary OPENS ON A GREETING (§71 hides the `.ph`, so
       there is no `<h1>` on screen above it), it RUNS LONGER than the
       table's usual 18–28 words (it is the band's whole left column rather
       than a paragraph beside a black card), and it CARRIES `<b>` PHRASES,
       which §70.2 grounds and §63 §10 inks.

       THE GREETING IS DERIVED — see `_greet` above. 599:7427 says "Good
       morning, Maryam!" and the other three dashboards say "Welcome Back";
       the file's is the better line and it is the one that can be false, so
       it is read off the clock rather than typed. Nothing else in the build
       knows the time of day, which is the argument for keeping it to four
       lines in one place.

       WHAT CAME OFF ALL THREE IS THE DAY. Every one of these opened on "Day
       N of 90" and that is now the second column's own figure, two inches to
       the right, in 32px type. Restating it is the duplication this table's
       note is mostly written to prevent — and it is what freed the words the
       longer shape needed.

       THE FILE'S SECOND PARAGRAPH IS A `<br>`, NOT A SECOND `<p>`.
       599:7434 draws two blocks with the paragraph spacing set to 0, so what
       it is asking for is a line break inside one paragraph — which is also
       the only shape `typeSummary` can take: `placeSummaryPass` assigns
       `'<p>' + text + '</p>'`, and a `<p>` inside a `<p>` is closed by the
       parser before it is opened. `sumRuns` walks TEXT nodes, so the break
       costs the typer nothing and the ghost holds the same box.
       ------------------------------------------------------------------ */
    /* WEEK 1 IS THE FILE'S OWN COPY WITH THE PRODUCT'S FIGURES IN IT, and it
       is the one entry where the two agree almost word for word: 599:7434
       names chapter 1, "no graded assessments", "4 out of 10 peers", "about
       45 minutes" and a "55-minute time on course target", and `CH[0]` is
       ['Why We Exist', 45] with `WEEK_TARGET` at 55. Every one of those is
       read rather than typed, so the sentence cannot drift from the chapter
       list or from the chart's own target line.

       THE QUOTATION MARKS ARE NOT TAKEN. The file wraps the whole paragraph
       in them; nothing else in this table quotes Tal, and a summary in
       quotes reads as a transcript of something said elsewhere rather than
       as the page's own voice. */
    week1: f => `${_greet()}, Maryam! <b>Chapter 1, ${CH[0][0]},</b> is now available. You&rsquo;ve spent 20 minutes learning this week, and completing this ${CH[0][1]}-minute chapter will help you stay on track.<br><b>Four of your ten cohort members</b> have already completed it. Start today to make progress toward your <b>weekly learning target</b>.`,

    /* DAY 34 KEEPS ITS OWN FACTS AND TAKES THE FILE'S SHAPE. There is no
       599:7418 copy for a stalled week, so the two sentences this entry
       already carried are the first block and the second is what the page
       has never said: what clearing the open chapter actually costs. Both
       figures in it are read — `CH[f.open]` is the chapter's own title and
       minutes, so a stage that moves `open` moves the sentence with it. */
    day34: f => `${_greet()}, Maryam! You are <b>${f.done} of 13 chapters</b> in at ${f.avg}%, ${_n(f.mins)} minutes on the course so far. <b>Chapter ${f.open + 1} (&lsquo;${CH[f.open][0]}&rsquo;)</b> has been opened four times without finishing, and the three furthest ahead in Cohort 41 had it done by now.<br>It is ${CH[f.open][1]} minutes of work. Clearing it this week is what puts you back on the <b>${WEEK_TARGET}-minute weekly target</b> before week ${f.week + 1} adds its own.`,

    /* THE RED ACCENT DEMO — day 34's entry, copied rather than aliased, so
       the two summaries can be edited apart. A `reddemo: PAGESUM.day34` would
       have been shorter and would have re-linked them; see `RED_DEMO` in
       data.js. Trap 11 is why this row has to exist at all: a stage with no
       `PAGESUM` entry leaves the head band's card stripped of its body but
       still holding its `h3`, which renders ~700px wider than the page. */
    reddemo: f => `${_greet()}, Maryam! You are <b>${f.done} of 13 chapters</b> in at ${f.avg}%, ${_n(f.mins)} minutes on the course so far. <b>Chapter ${f.open + 1} (&lsquo;${CH[f.open][0]}&rsquo;)</b> has been opened four times without finishing, and the three furthest ahead in Cohort 41 had it done by now.<br>It is ${CH[f.open][1]} minutes of work. Clearing it this week is what puts you back on the <b>${WEEK_TARGET}-minute weekly target</b> before week ${f.week + 1} adds its own.`,

    /* DAY 90 NOW GUIDES TO THE AGENT, THE WAY `new` DOES (Maryam, 31 Aug 2026:
       "The summary should also guide about booking an agent just like we did on
       the first 'Just Joined' prototype"). The two pages ask one question a
       course apart — which agent sets my level, which agent decides whether it
       moves — and `talRec` is the same block on both, so the sentence above it
       takes the same shape: what the record says, then the roster, then the
       match by name.

       IT STOPPED SHORT OF THE PLATE BEFORE, and the note here said so: "Book
       the re-interview" was the whole of the second clause because the `.plate`
       underneath already spelled out what the re-interview decides. That plate
       is gone (see `V.dashboard`'s day-90 branch), and what replaced it names
       an agent rather than explaining a decision — so the ban this was
       observing no longer applies and the guidance is the sentence's job again.

       THE NAME IS `recKey()`, NOT "Priya". This entry hard-coded her, and "Ask
       Tal for a different agent" swaps the card below to one of three — which
       is exactly the drift `new`'s own note describes: Tal naming a match the
       page is no longer showing. It re-types when it changes, which is correct.

       THE E4/E3/E2 CLAUSE IS NOT CARRIED OVER. It was the plate's, it is
       `V.level`'s "Moving up" accordion verbatim, and this table's second
       content ban is policy. "Decides whether your level moves" is the fact;
       which way it can move is a page away. */
    day90: f => `${_greet()}, Maryam! You&rsquo;ve completed <b>all 13 chapters</b>, achieved an ${f.avg}% assessment average, and invested ${_n(f.mins)} minutes in learning. You also completed <b>Chapters 4 and 12</b>, which focused on your growth areas.<br>Your re-interview will determine whether your level changes. I&rsquo;ve <b>matched you with ${AGENTS[recKey()].n}</b> for your next interview. You&rsquo;ll find her details below.`,

    /* THE DATE CAME OFF THIS LINE, AND IT IS THE CARD THAT HAS IT NOW. The
       sentence used to close on "E4 opens December 1, and at this level you can
       volunteer to lead a cohort" — right while the enrolment card beside it
       stated no date at all. `ENROL_OPENS` (views.js) puts the opening in a band
       on the card, which is where a reader looks for it, and one date said twice
       inside one head band is the duplication this whole table exists to stop.
       Tal keeps the consequence of the level, which is the half the card cannot
       say: 26 words, and the two figures are still `f`'s. */
    promoted: f => `You moved from E3 to E4 in 90 days: 13 chapters, ${f.avg}% average, ${_n(f.mins)} minutes of coursework. At this level you can also volunteer to lead a cohort.`,

    _: 'Where you stand right now, and anything waiting on you today.'
  },

  /* ONE STRING, NOT TWO IDENTICAL ONES. `consult` and `new` were separate
     keys holding the same sentence, which is a thing that stays in step for
     exactly as long as nobody edits one of them. */
  /* AND THE PRE-INTERVIEW ONE IS THE DASHBOARD'S SENTENCE, SHORTENED (Maryam,
     31 Aug 2026). §70's `dashboard.new` narrates the same fact at length —
     "Based on your quiz results, you are currently on Explorer track. Your
     level from E1 - E5 anchors after a 45-minute interview" — and this page
     said it flatly, in Tal's earlier voice, with no accent phrase in it. Two
     summaries of one fact in two registers is the thing this table is mostly
     written to stop, so this one is the dashboard's, cut to the part My Level
     is about.

     WHAT IT DROPS is the whole of the dashboard's second half: the roster, the
     match and Priya. That is a recommendation, and the page it belongs to is
     the one that draws her card underneath it — here the block directly below
     is the ladder, and the note two sections down already carries "an interview
     with an agent sets the level" with the button that books one.

     THREE ACCENT PHRASES, WHICH IS THE DASHBOARD'S COUNT. §70.2's highlight is
     `.modhead .ai-aura.talsum .ai-body p b` and is not scoped to the AI-native
     band, so a `<b>` here gets the same tinted ground; §63 §10 owns the ink.
     They are the three things the sentence is actually about — what you did,
     where it put you, and what decides the rest — and every figure in it is the
     ladder's own (`trackBand` marks exactly those five rungs). */
  /* REWRITTEN TO MARYAM'S COPY, 2 Sep 2026, and three things about it are
     stated rather than quietly adjusted, because each is a rule this table's
     own head sets and this line is now the exception to it.

     IT IS 36 WORDS AGAINST THE STATED 28 CEILING, and it is two full sentences
     rather than a sentence and a clause. The ceiling is the reason `result`'s
     entry names only the lowest band of the two ("28 is the ceiling — see the
     head of this block"), so this is the first entry over it.

     THE SECOND SENTENCE NAMES THE LADDER, which is the fourth of this table's
     four content bans — no pointing at the UI. It reads as a pointer at the
     block 80px below rather than as a fact about the candidate; the mitigation
     is that the three track NAMES and the five-per-track count are facts the
     sentence states, not instructions to look at something.

     THE ARROWS USED TO FALL OUT OF THE FACE AND NO LONGER DO — FIXED 4 SEP
     2026 BY THE PLATFORM FONT CHANGE, and this is kept rather than deleted
     because it is the one place in the build a defect was closed by a face
     rather than by an edit. Söhne's trial file carried 68 glyphs, an arrow
     was not one of them (§64), and §11's stack fell to 'Grotesk Stand-in' —
     so the two `&rarr;` here were the only rendered arrow characters in the
     product and they changed typeface mid-sentence. Plus Jakarta Sans carries
     U+2192 among 721 glyphs and there is no stand-in tier behind it, so both
     arrows are now set in the same face as the words either side of them.
     Nothing here changed; the sentence it is a fact about did.

     THE THREE `<b>` PHRASES ARE THE SAME THREE WORDS as before — quiz result,
     Explorer track, 45-minute interview — so §70.2's tinted ground still lands
     on what you did, where it put you and what decides the rest. */
  level: (() => {
    const pre = 'Your <b data-sum="quiz">quiz results</b> place you on the <b data-sum="track">Explorer track</b>. Your level will be determined through a <b data-sum="ivwhat">45-minute interview</b> with a talent agent. Your growth path spans three tracks (Explorer, Builder, and Trailblazer) with five levels in each.';
    return {
      consult: pre,
      new: pre,
      /* MARYAM'S COPY, 2 Sep 2026. Two accent phrases, the actionable pair —
         the appointment and the band it decides between; "still to be
         determined" and "where you land on the ladder" are the same fact said
         twice and neither is a target, so both stay in ink.

         THE 20 AUGUST IS A LITERAL AND `bkStamp` DOES NOT REACH IT, which is
         pre-existing rather than new — the line it replaces said "the interview
         on 20 August" the same way. That pass (ai7 §4) rewrites the plate, the
         Scheduled tile and `PAGESUM.dashboard.booked`, which it redefines as a
         function; this entry is a plain string in an object literal, so a
         candidate who books Owen on the 21st still reads the 20th here. The fix
         if it ever matters is to make `booked` a function — `pageSummary` calls
         a nested stage value with `cfg(stage)`, and `bkLong()` is in scope at
         render time however much later ai7 parses. Not done here: it is a
         change to what the entry IS, not to what it says. */
      booked: 'Your interview is booked for <b data-sum="interview">20 August</b>, but your exact level is still to be determined. Your quiz placed you on the <b data-sum="track">Explorer track (E1&ndash;E5)</b>, and the interview will establish where you land on the ladder.',
      /* THE RESCHEDULE FORK — `booked`'s entry, copied. See its STAGES row. */
      resched: 'Your interview is booked for <b data-sum="interview">20 August</b>, but your exact level is still to be determined. Your quiz placed you on the <b data-sum="track">Explorer track (E1&ndash;E5)</b>, and the interview will establish where you land on the ladder.',
      promoted: 'E4, level 4 of 15, signed on 21 November after your re-interview, one up from where the 90 days started. Another course and re-interview moves it again.',
      _: 'E3, level 3 of 15 on the Explorer track, confirmed by Priya on 21 August. Only a re-interview at the end of a course moves it.'
    };
  })(),

  report: 'Priya&rsquo;s evaluation confirms your level as Explorer &ndash; E3, based on your August 20 interview. Your key growth areas are delegation and handling difficult conversations. Both are covered in your recommended course.',

  /* THE BREAKDOWN'S READING, AND IT IS TWO FIGURES THE PAGE DRAWS RATHER THAN
     LISTS. The rose is five wedges and five numbers; what a person wants said
     out loud is which is highest, which two are lowest, and what happens to
     the low ones next — so the sentence names them and leaves the other two
     to the chart.

     BOTH FIGURES ARE READ OFF `SCORES` through `qzLow`, the same call the
     page's own closing section makes. Written out as "Composure (84) and
     Coaching (38)" this would be the fourth place those numbers appear and
     the first one that could disagree with the chart above it.

     ONLY THE LOWEST IS NAMED, not both of the two lowest: the closing section
     names the pair with their chapters, and naming them here as well put
     "coaching" in the same sentence twice and took the line to 37 words. 28
     is the ceiling — see the head of this block. */
  /* LEAN, AND SCORELESS (story 15.3, Maryam 30 Sep 2026). The page now shows the
     TRACK and one line that the level is set at the interview — the score, the
     bands and the chart are gone — so the summary names no figure either. It
     reads only what the viewer can see on the surface (15.1). */
  result: 'This is the track from your latest quiz. Your <b>level is set at your interview</b>, not here and not by the quiz.',

  /* THIS ONE HAD NO FACTS IN IT AT ALL. "Every interview you've had and
     every one booked. This is the only thing that sets or changes your
     level, and each finished one links to its report." — a caption, a
     policy statement and a pointer at a link, on a page whose description
     and whose plate both already said the policy. What a person wants off
     this page is how many interviews there have been, when, and whether one
     is owed. Staged, because the answer is different five times. */
  interviews: f => {
    if(f.complete) return 'Two interviews on record: 20 August set Explorer &ndash; E3, and 21 November moved you to E4. Both reports are yours to keep.';
    if(f.reinterview) return 'One interview on record, and the re-interview still to book. Whoever you pick reads your 90-day summary before the call.';
    /* THE `booked` BRANCH IS MARYAM'S COPY, 2 Sep 2026, AND ITS THREE FACTS
       ARE READ OFF THE CARD RATHER THAN TYPED. The name, the expertise and the
       level range are all printed 80px below in `.crow-x` ("Expertise: System
       Architecture, assesses E1&ndash;E3"), and that row is built from
       `CALL_ROW.iv()` — so this reads the same call and the two cannot
       disagree on one screen. The line it replaces hard-coded "Priya Nair",
       which `bkStamp` does not reach on this view (it rewrites the plate, the
       Scheduled tile and `PAGESUM.dashboard.booked`, not this table), so
       booking Owen left the summary naming Priya.

       `x` IS SPLIT RATHER THAN RE-DERIVED, deliberately. Re-deriving means
       copying `CALL_ROW.iv`'s four-step precedence line — the one its own note
       spends fifteen lines on, because a `typeof` guard on a `const` in the
       temporal dead zone THREW and took a whole first paint with it. Splitting
       the string the card already renders keeps one source and one precedence;
       if that format ever changes, both surfaces move together or break
       together, which is the failure worth having.

       "SHE'LL" IS THE ONE WORD THAT DOES NOT FOLLOW THE DERIVED NAME. Book
       Owen or Samuel and the pronoun is wrong while the three facts are right —
       one word against the four it replaces. Left as Maryam wrote it because
       Priya is who the prototype books by default and she is who the demo
       walks; "They'll" is the fix if a second agent is ever demoed.

       ONE ACCENT PHRASE, THE APPOINTMENT — AND THE TIME IS STATED, NOT
       "ready to join" (doc §7, candidate Tal scenarios, 8 Sep 2026). This line
       ended "scheduled and ready to join", a second pressable phrase, while the
       interview is a FUTURE date: the dashboard summary (`PAGESUM.dashboard
       .booked`), `bkStamp` and the hard-coded picker all say Thursday, 20 August
       at 6:30 PM. "Ready to join" was therefore false on the Interviews page
       the same way it would be on the dashboard. The gap's ruling is that the
       summary follows the booking's real TIME and only says "ready to join"
       inside the final minute — which this static demo never reaches for the
       interview — so the phrase is the time now, matching line 326's wording so
       the two booked summaries agree. `SUMDROP.join` is kept as the designed
       final-minute "Join the interview" popover (doc 3.10), dormant until a live
       gate triggers it, rather than deleted with the phrase.

       THE TIME IS A LITERAL, LIKE LINE 326's — `bkStamp` does not reach the date
       (its own note, above), and the picker is Thursday 20 at 6:30 whoever is
       booked, so the literal is safe and is the same string the dashboard uses. */
    if(f.booked){
      const c = CALL_ROW.iv();
      const ex = String(c.x || '').split(', assesses ')[0] || 'your';
      const rng = (c.who && c.who.range) || 'E1&ndash;E3';
      return `Your <b data-sum="interview">interview with ${c.who.n}</b> is scheduled for Thursday, August 20, at 6:30 PM. `
        + `She&rsquo;ll assess your ${ex} skills across levels ${rng}. `
        + `Your level and report will be based on this interview.`;
    }
    /* THE `pred` BRANCH IS MARYAM'S COPY, 2 Sep 2026, and it deliberately does
       what the `agents` note directly below rules out — it describes the
       directory. That entry was DELETED for naming the three leading agents,
       their prices and their slots, on the reasoning that "a summary of a
       directory is the directory read aloud"; this line names the count, the
       length and the three axes the cards are compared on (experience, rating,
       fee), all of which the grid 80px below prints per card. It is the
       instruction, so it stands, and the argument against it stays here rather
       than being deleted with the sentence it lost to.

       THE 24 IS THE SECOND HAND-TYPED COPY OF THAT NUMBER. `AGENTS` is not
       24 records long — the only other place the figure appears is the search
       field's own placeholder in `V.agents` ("Search all 24 agents"), also a
       literal. Two literals cannot disagree today and will the first time the
       roster changes; if a third surface ever wants it, derive it once.

       IT IS 30 WORDS, two over the ceiling this table's head sets.

       TWO ACCENT PHRASES, AND THEY ARE THE TWO ACTIONABLE ONES (Maryam, 2 Sep
       2026 — the actionable text carries the orange and the tinted ground).
       §70.2's `.modhead .ai-aura.talsum .ai-body p b` is not scoped to the
       AI-native band, so a `<b>` on any summary gets the wash and §63 §10 owns
       the ink — there is nothing to add per view. The two are what you DO on
       this page: pick an agent, book the call. "Determine your level" is the
       outcome of both and is deliberately left in ink, because lighting a
       consequence as well makes the accent decoration rather than a target. */
    if(f.pred) return 'You haven&rsquo;t completed an interview yet. Choose from <b data-sum="roster">24 available agents</b> to book a <b data-sum="ivwhat">45-minute conversation</b> and determine your level, with options across different experience areas, ratings, and fees.';
    return 'One on record: 20 August with Priya, which set Explorer &ndash; E3. A re-interview at the end of the 90 days is what moves the level.';
  },

  /* NO `agents` ENTRY (Maryam, 31 Aug 2026). It read "Three agents assess at
     your level and have a slot this week — Priya $95, Owen $85, Lena $80. Same
     45 minutes whoever you pick." Every figure in it is a cell in the grid
     eighty pixels below: the three names lead the list, each card prints its
     own price and its own next slot, and the search field says how many there
     are in total. A summary of a directory is the directory read aloud.

     THE VIEW'S OWN TAL CARD WENT WITH IT — see the note where it was in
     `V.agents`. Trap 11: this pass strips a card before it tests for copy, so
     an entry removed on its own leaves the card in the band unstyled. */


  /* NO `agent` AND NO `booking` ENTRY, AND BOTH ARE DELETIONS RATHER THAN
     REWRITES (Maryam, 31 Aug 2026). The two pages either side of paying are
     the ones where Tal had least left to say, and on both of them the
     sentence was a read-back of the block directly under it:

     `agent` was "<name> assesses E2–B1 and has run 164 interviews, rated 4.6
     out of 5. $85 for 45 minutes, next free Friday 21 August at 5:00 PM." —
     six figures, and the `.agid` block, the three `.kv` rows and the slot
     picker four inches below state every one of them. It also carried the one
     disagreement on the page: `a.slot` is the agent's own next free time and
     the picker is hard-coded to Thursday 20 at 6:30, so for four of the five
     agents Tal named a slot the page was not offering.

     `booking` was "Nothing to prepare and nothing to bring — Thursday is a
     conversation, not a test." The `.note succ` banner is the first thing
     under the title and the page is a receipt; a second voice above a
     confirmation reads as a caveat on it.

     THIS IS NOT THE "A PAGE WITH NO ENTRY IS WORSE THAN WRONG" TRAP (trap 11
     in CLAUDE.md). That one is about a view that HAND-AUTHORS an `.ai-aura`
     card: `placeSummaryPass` strips the card's action and chips before it
     reaches `if(!text) return`, so the card survives stripped and unstyled.
     Neither of these views draws a card — both had theirs removed when this
     file was written — so the pass builds nothing, `placePageSummary` calls
     `sumIdle()` to clear the typing key, and `placeBand` returns at its own
     `if(!aura)`. The band is the title and, on `agent`, the slot plate.

     `_slot` still has readers, so it stays. The `booking` override in ai7 is
     gone with this one — see the note where it was. */

  /* THE COURSE'S SHAPE MOVED TO THE PAGE DESCRIPTION — "90 days · 13
     chapters · a cohort of ten" — because it is a factual spine and this
     summary was saying it word for word underneath. What is left is the
     part a description cannot carry: the commitment.

     AND THE MONEY HAS MOVED TOO, WHICH TOOK THE FIRST HALF OF THIS SENTENCE
     WITH IT. This opened "$595 once, no subscription" and closed on "within
     two weeks of paying", both written when the fee was a `.kv` tile most of
     a page below. The checkout card is in the head band now, eight inches to
     the right of this line: it states $690, the credit, the $595 due and the
     date the cohort opens, and "one payment, and the re-interview is
     included" is printed on it in full. Tal saying any of that again is the
     duplication this file's own note is mostly written to prevent.

     WHAT IS LEFT IS THE HOURS, which is the one thing on the page no figure
     states and the question somebody actually hesitates over. The second
     sentence is the old hand-written Tal card's, which `placePageSummary`
     had been silently replacing — see the note where it used to be in
     `V.enrol`. */
  enrol: 'About an hour a week on the chapter, plus the 60-minute call. People who keep to that finish all 13 and average above 85%.',

  /* NO TAL BAND ON THE PAYMENT SCREEN (Maryam, 7 Sep 2026: "remove the summary
     from paying screen"). With no `payment` key, `pageSummary()` returns falsy for
     the view and `placeSummaryPass` adds no band — the page is the card picker and
     the pay button. */

  /* THE CONFIRMATION'S JOB IS TO SAY THAT NOTHING IS DUE FROM YOU.
     The page's own blocks carry the receipt, the leader and the three things
     that happen next; the title names the cohort and the fact row carries the
     date, so neither is said here. What a person wants after paying $595 is
     permission to close the tab, and that is the sentence. */
  welcome: 'Your place is paid and the cohort is yours for the 90 days. Nothing is due from you until chapter 1 unlocks, and Priya posts to the board before then.',

  /* --- the 90 days --------------------------------------------------- */

  /* PARKED, BOTH OF THEM — `placePageSummary` bails on the LightspeedVT
     frame, so nothing below is on screen today. Kept correct anyway, because
     the moment a chapter shell renders outside the iframe these are the
     copy, and the old pair had a bug that would have shipped with it: at day
     90 they said "13 of 13 chapters done, and chapter 13 is open", and at
     `promoted` "13 of 13 done, and chapter 1, Why We Exist, is open". A page
     cannot have everything finished and something open. The trailing "45 to
     70 minutes each and one unlocks a week" went for its own reason — the
     same clause on all four stages, still being explained on day 90. */
  coursework: f => {
    const cur = CH[f.open];
    if(f.preStart) return `Your cohort has not started yet${f.startIn>0?`, it begins in ${f.startIn} days`:''}. This is the full outline of the thirteen chapters; they unlock in LightSpeed VT on the start day, one a week.`;
    if(f.done >= 13) return `All 13 chapters finished at ${f.avg}%. Nothing left to unlock. The re-interview is what turns the record into a level.`;
    if(!f.done) return `None of the 13 finished yet${cur ? `, and chapter ${f.open + 1}, ${cur[0]}, is open` : ''}. They&rsquo;re 45 to 70 minutes each and one unlocks a week.`;
    return `${f.done} of 13 chapters done at ${f.avg}%${cur ? `, and chapter ${f.open + 1}, ${cur[0]}, is open, ${cur[1]} minutes` : ''}. One more unlocks each week.`;
  },

  chapter: () => {
    const i = cfg(S.stage).open, cur = CH[i];
    return `${cur ? `Chapter ${i + 1}, ${cur[0]}: ${cur[1]} minutes.` : 'You&rsquo;re inside a chapter.'} Video, reading, a roleplay, then an assessment. Only the assessment counts towards your average.`;
  },

  /* THE THIRD BRANCH IS `promoted`, AND WITHOUT IT THE SENTENCE WAS STALE
     (2 Sep 2026). "This is the record an agent reads before your re-interview"
     is true from week 1 to day 90 and false the moment the re-interview has
     happened — at this stage Priya signed it on November 21, which is what
     moved the candidate to E4. The page under it changed with the same edit:
     the black card is the E4 enrolment offer and the closed cohort is one
     collapsed block at the foot (`pastSec` in views.js).

     IT DOES NOT NAME THE START DATE. `enrolOffer`'s date chip is eighteen
     inches to the right in the same band and says "E4 opens on December 1";
     the summary's job is the READING, which here is why the record has stopped
     moving. The figures are the same three the other branch derives, and the
     cohort's NAME is read off `CERTS` through `certsFor` — the same row
     `pastSec` heads its block with, so Tal and the block cannot name two
     different cohorts. Both are views.js consts and views.js is concatenated
     first, so they are in scope by the time a summary is asked for. */
  transcript: f => f.complete
    ? `${certsFor(f).slice(-1)[0].cohort} is closed: ${f.done} chapters at ${f.avg}%, about ${_hrs(f.mins)} hours of coursework. Nothing lands on this record again until you enroll at ${f.level}.`
    : f.done
    ? `${f.done} of 13 chapters at ${f.avg}%, about ${_hrs(f.mins)} hours in. This is the record an agent reads before your re-interview.`
    : 'Your learning journey has just begun. Your progress will appear here as you complete chapters and activities.',

  /* THE PAGE DESCRIPTION HELD THE SAME SENTENCE ("Points, badges and rank
     come from your activity across the course and the community") and is now
     the figure row, so this opens on the figures and closes on the one thing
     a person actually wants to know about points, which is whether they
     count for anything. That last clause repeats across all four stages on
     purpose: it is the answer to the only question this page raises. */
  rewards: () => {
    const g = GAME[S.stage];
    if(!g) return 'Points start when you enroll: 10 for signing in, 25 a chapter, Bronze at 2,500. None of it affects your level.';
    const toB = 2500 - g.pts;
    return `You have ${_n(g.pts)} points and a ${RANKS[g.rank - 1].n} rank. ${toB > 0
      ? `Earn ${_n(toB)} more points to reach Bronze at 2,500.`
      : `You have earned Bronze; Silver is at 5,000.`} You can earn points by signing in, completing chapters, and participating in the community. Points do not affect your TALENTnext level.`;
  },

  /* "Ten of you at E3 with Priya leading, week 5 of 13" was the page
     description verbatim. The description keeps it; this keeps the call,
     which is the thing on the page that has a date on it — WHILE THE COHORT IS
     RUNNING. Once the 90 days are over there is no next call, so the summary
     reads the wrap instead (Maryam, 14 Sep 2026: "since the course has ended the
     summary wont be this"). `f.finished` is day90, `f.complete` is promoted. */
  cohort: (f) => (f.finished || f.complete)
    ? 'Cohort 41 has finished all thirteen weeks with Priya leading. The discussion stays open for the ten of you to keep working through what changed.'
    : f.preStart
    ? `Cohort 41 has not started yet${f.startIn>0?`, it begins in ${f.startIn} days`:''}. The ten of you are listed below with Priya leading; the discussion and the weekly calls open on the start day.`
    : 'Thursday&rsquo;s call is at 6:00 PM on hard conversations, and Priya has asked everyone to bring a real one to talk through.',

  /* PARKED — `.msg-page` is excluded, for the reason written at the pass
     below. Trimmed to match the rule anyway: the policy sentence about what
     Priya can see belongs on Profile, and paraphrasing the last bubble is
     summarising something two inches away. */
  messages: 'Priya can see your chapters, scores and attendance already, so you never have to explain where you are.',

  /* --- account and money ------------------------------------------------- */

  /* WHAT THE OLD LINE GOT WRONG, TWICE. "No card is kept on file" — `S.cards`
     holds a Visa and this page draws it under a heading that says so, three
     sections down. And "each row downloads its receipt" is a caption for a
     button. A total and a count is what a person opens Payments for; the
     rows are the itemisation. Counted from the same conditions `V.billing`
     pushes them on, so the two cannot disagree. */
  /* `billing` IS BACK (Maryam, 31 Aug 2026, later the same day: show Tal's
     summary on this page) AND IT SAYS SOMETHING THE DELETED ONE COULD NOT.

     THE DELETED ONE WAS A COUNT AND A TOTAL, and both reasons it went still
     stand: the table under it is those rows, each with its date, its card and
     its amount, so "one payment, $490" was the table read aloud — and the half
     that was not in the table was the policy clause "nothing here renews",
     which is the second of this table's four content bans. Restoring that
     sentence is not what was asked for and would fail twice over.

     AND THERE IS A HARDER RULE THAN EITHER: TAL HAS NEVER SEEN THIS PAGE. The
     `NEVER` list on What Tal knows (ai2.js) ends on "Your card details and
     billing history", clause 4 of the Data use notice says the same, and
     `wLedger` (ai8) DECLINES "What have I paid so far?" and points here rather
     than answering it. So a summary that names a figure off this table — the
     count, the total, the card, any of it — makes three other surfaces into
     lies, and it is the one kind of wrong answer ai8's own note calls the
     worst: "the product says so on two other screens".

     SO THE SUMMARY IS TAL SAYING WHAT IT CANNOT SEE, which is not a hedge and
     not an apology — it is subject 6 of Tal's six (Tal itself: what it holds
     about you and what it does not), and on the one page whose whole subject is
     outside its reach it is the most useful true thing available. It is also
     not the "no policy" ban: that ban is on product-behaviour filler
     ("nothing renews"), and this is a statement about Tal's own access.

     THE SECOND SENTENCE IS A PROMISE THE PRODUCT KEEPS. `wRefund` (ai8) reads
     the two refund windows off the legal lines on `V.booking` and `V.payment`
     and states the rule before handing to a person, which is answer-kind (a) in
     ai8's table — so "ask about the refund windows" routes to a real answer.
     It is also the ask dock's own placeholder on this view, so the line and the
     field under it are offering the same thing.

     THE VIEW DRAWS NO TAL CARD, so this is an entry and nothing else — trap 11
     only bites where a card is hand-authored (see `agents` above). */
  /* THE LEDGER RECITAL IS GONE, AND THAT RESTORES THE RULE THE THREE PARAGRAPHS
     ABOVE ARGUE FOR (doc §7, candidate Tal scenarios, 8 Sep 2026). Between 2 Sep
     and now this line read out the ledger — "$490 charge for Explorer Track E2 …
     default Visa ending 4242" — which the 2 Sep note flagged as contradicting
     three surfaces that all say Tal never sees billing: `NEVER[2]` (clause 4 of
     the Data use notice), `wLedger` (declines "what have I paid" and links here),
     and the dock placeholder "Is my card stored?". The scenario doc's ruling is
     that the band NAMES THE CARDS ON FILE AND THE REFUND WINDOWS and leaves the
     charge to the "Previous Transactions" table beneath (which prints `PAY_E2`
     already). So it does, and the three surfaces agree again with no further
     edit — a popover is still Tal explaining, so `defcard` and the new `refund`
     card stay inside Tal's six subjects and read no figure off the ledger.

     TWO ACCENT PHRASES, BOTH ALLOWED: the default card, and the refund windows.
     The charge and the E2 purchase are no longer lit because they are not things
     Tal reads — they are rows in the table, with their own receipts. */
  billing: () => { const d = (S.cards||[]).find(c => c.def) || (S.cards||[])[0] || {brand:'Visa', last:'4242'};
    return `Your saved Visa, Mastercard, and Amex cards are available for future payments, with <b data-sum="defcard">${d.brand} ending ${d.last}</b> set as your default. Your course and interview payments are recorded separately, with receipts available for each transaction.`; },

  /* The page description said "Your details, your preferences, and what Tal
     is allowed to do" and this said the same three nouns back. The
     description is gone and this says the one thing worth opening the page
     for, which on an AI-native product is the permissions. */
  account: 'Your profile, experience, and preferences, all in one place. Review your details, manage your settings, and explore what Tal can remember and do with your permission.',

  /* --- Tal's own pages --------------------------------------------------- */
  mem: () => {
    const live = MEMO.length - ((S.memDrop || []).length);
    return `${_W(live)} things I&rsquo;ve learned about you, each traced back to where it came from. Mark anything wrong and I&rsquo;ll stop using it.`;
  },

  rp: 'Rehearse a hard conversation before you have it for real. I play the other person, briefed from your interview. Nothing is recorded or scored.',

  /* The date, the length and the outcome are the page description's `·` row
     directly above, so naming them again was the duplication this rewrite
     is about. What is left is the two things the row cannot say. */
  ivt: () => {
    const iv = IVT[S.iv === 're' ? 're' : 'level'];
    return `Searchable and tagged by topic, all ${iv.len} of it. Everything in your report was drawn from here, and the quotes link back to the minute.`;
  },

  /* --- the cohort leader ------------------------------------------------- */
  leadDash: () => {
    const att = lattention(), pend = lpending();
    const bad = att.filter(x => x.m.flag.k === 'bad').length;
    /* THE NEXT SESSION LEFT THIS SENTENCE. It was the third clause of three
       and it is the one fact on the page that has its own card with its own
       time on it — so the summary was spending a third of itself on the
       thing hardest to miss. What is left is the two things that are only
       findable by reading, and the first is first because it blocks other
       people: an unpublished summary is a candidate whose 90 days cannot close.
       IT WAS "DECISIONS" AND IT IS "SUMMARIES" (1 Sep 2026). A cohort leader
       does not interview, so no level decision reaches this portal; the clause
       about enrolling went with it, because what a summary blocks is the far end
       of the 90 days rather than the near one. */
    /* ZERO-PENDING LEADS WITH THE QUEUE (doc §7, 8 Sep 2026). The one string
       used to run `${_W(pend)}` through the pending template for every count,
       so pend===0 rendered "No 90-day summaries are waiting … and nothing
       reaches those candidates' next agent until you publish" — a consequence
       promised for zero work, over a possessive ("those candidates'") that has
       no candidates behind it. Now zero opens on the queue and names the next
       call; one and two keep the signature lead, with the possessive agreeing
       (that candidate's / those candidates'). */
    const nx = lcalls()[0];
    const look = `${_W(att.length)} candidate${att.length === 1 ? '' : 's'} need${att.length === 1 ? 's' : ''} your review, including ${_w(bad)} who may need urgent attention`;
    if(pend === 0)
      return `Nothing is waiting on your signature. ${look}${nx ? `, and Cohort ${nx.co} meets ${nx.day.toLowerCase()} at ${nx.time}` : ''}.`;
    return `${_W(pend)} 90-day ${pend === 1 ? 'summary is' : 'summaries are'} awaiting your signature. ${pend === 1 ? 'That candidate cannot' : 'Candidates cannot'} move to their next agent until you publish ${pend === 1 ? 'it' : 'them'}. ${look}.`;
  },

  /* THE SEVEN MODULES, AND THE THREE PAGES UNDER THEM.
     An entry here is what turns a hand-authored Tal card at the head of a
     leader page into `.talsum`; a page with NO entry leaves that card in a
     shape §33 does not style — a 1786px head band on a 1068px page. The long
     note above `ldrRead` in lead2.js records the whole mechanism. So every
     leader view has one, and the three detail pages read their subject off
     `S` the way `agent` and `chapter` do on the candidate side. */
  /* `leadSessions` AND `leadEval` WERE HERE AND BOTH ARE DELETED (1 Sep 2026):
     a cohort leader takes cohort calls and does not interview anybody, so the
     five booked interviews and the level decision they produced are off the
     portal. `leadCalls` is the diary that replaced the first; there is no page
     under Evaluations any more except the summary, which already had its own
     entry below. */
  leadCalls: () => {
    const up = lcalls();
    const nx = up[0];
    const run = LEAD_RUN.length;
    const seats = LEAD_RUN.reduce((s,r) => s + lcoOf(r.co).members.length, 0);
    const came = LEAD_RUN.reduce((s,r) => s + r.attended, 0);
    return `${_W(up.length)} calls this week${nx ? `, Cohort ${nx.co} first at ${nx.time.toLowerCase()} ${nx.day.toLowerCase()}` : ''}. ${run ? `Across the ${_w(run)} behind you, ${came} of ${seats} seats were filled. The brief reads from where each cohort actually is.` : 'Your first cohort call is this week.'}`;
  },

  leadEvals: () => {
    const ps = LEAD_SUMMARIES.filter(s => s.status === 'pending');
    const s0 = ps[0];
    if(!ps.length) return 'Nothing is waiting on your signature. Every 90-day summary is published.';
    /* THE SENTENCE NAMES THE COHORT'S SIZE NOW, because the page under it holds
       the whole roster in two lists (1 Sep 2026) and "two are waiting" over
       eight rows read as a count of the page rather than of the work. `two of
       eight` is the shape: the fraction is the reading, and both halves are
       read — `ps.length` and the cohort's own `members.length` — so it cannot
       disagree with either list. Still one sentence and 27 words, inside
       PAGESUM's 18&ndash;28.
       BOTH COUNTS ARE SPELT, and the second one has to be: "33&rsquo;s 8 90-day"
       puts two numerals against each other with a hyphenated third behind them,
       which is three numbers in five characters. `_w` is the lowercase half of
       the pair the leader's other summaries already use for this. */
    const size = _w(lcoOf(s0.cohort).members.length);
    /* THE NOUN IS ALWAYS PLURAL — it names the cohort's roster of summaries
       ("eight 90-day summaries"), and only the VERB agrees with the pending
       count. The old form toggled both, so one pending read "eight 90-day
       summary is" (doc §7). */
    const scs = ps.map(x => `${x.name} scored ${(lmemOf(lcoOf(x.cohort), x.name) || {}).avg}%`);
    const who = scs.length < 3 ? scs.join(', and ') : scs.slice(0,-1).join(', ') + ', and ' + scs[scs.length-1];
    return `${_W(ps.length)} of Cohort ${s0.cohort}&rsquo;s ${size} candidates ${ps.length === 1 ? 'is' : 'are'} awaiting evaluation. ${who}. Review their progress and submit your ${ps.length === 1 ? 'recommendation' : 'recommendations'} to move them forward.`;
  },

  leadSum: () => {
    const s = LEAD_SUMMARIES.filter(x => x.id === S.ldrSum)[0] || LEAD_SUMMARIES[0];
    const c = lcoOf(s.cohort);
    const m = lmemOf(c, s.name);
    if(s.status === 'done') return `Published. You recommended: ${s.rec}.`;
    return `${s.name} finished the 90 days at ${m.pc}% with ${m.avg}% on assessments and ${lchDone(m)} of 13 chapters. The recommendation is the part only you can write.`;
  },

  /* The next call was the third sentence and it is a card on the page with
     its own time on it, the same trade as `leadDash`. What is left is the
     roll-up and the one cohort that needs attention. */
  leadCohorts: () => {
    const flagged = lmembers().filter(x => x.m.flag);
    /* ONE RUNNING COHORT (14 Sep 2026), so this reads the single active cohort
       rather than the widest gap of several; the completed one rides a tail as
       history. `g` is signed (+ ahead), the word is spelt and "point" is
       pluralised so it never prints "1 points" or "0 points behind". */
    const c = LEAD_COHORTS[0];
    const g = lavg(c,'pc') - lpace(c), gp = Math.abs(g);
    const pace = g === 0 ? 'on pace' : `${_w(gp)} point${gp === 1 ? '' : 's'} ${g < 0 ? 'behind' : 'ahead of'} pace`;
    const past = LEAD_PAST.length ? ` Cohort ${LEAD_PAST[0].id} is closed behind you, its last summaries still to sign.` : '';
    return `Cohort ${c.id} is ${pace} in week ${c.week} of 13, and <b>${flagged.length} of its ${lmembers().length} candidates are flagged</b>.${past}`;
  },

  /* "10 candidates at Explorer – E3, week 5 of 13" was the page description
     word for word, and dropping it took a three-sentence paragraph down to
     two without losing a fact. THE GAP ALSO READ WRONG: `gap >= 0` printed
     "0 ahead" when a cohort was exactly on pace, which is not a thing
     anybody says. */
  leadCohort: () => {
    const c = lcoOf(S.ldrCo);
    const gap = lavg(c,'pc') - lpace(c);
    const bad = c.members.filter(m => m.flag && m.flag.k === 'bad').length;
    /* ASSESSMENTS READ `lassess`, NOT `lavg(c,'avg')` (doc §7). `lavg` divides
       by every member, so Cohort 47 — three assessed in week 1 — reported 26%,
       an absent score read as a low one. `lassess` (assessed-only) is what the
       cohort page's own stat cell prints (lead2.js), so the band and the page
       now agree: 41 at 78, 33 at 80, 47 at 88; the ternary shows "nothing
       assessed yet" only when nobody at all has a score. */
    const assess = lassess(c) ? `assessments at ${lassess(c)}%` : 'nothing assessed yet';
    /* the gap is spelt and "point" is pluralised, the same fix as `leadCohorts`
       — it printed "1 points ahead" before (doc §7). */
    const ga = Math.abs(gap);
    const pace = gap === 0 ? 'exactly on pace' : `${_w(ga)} point${ga === 1 ? '' : 's'} ${gap > 0 ? 'ahead' : 'behind'}`;
    return `Averaging ${lavg(c,'pc')}% against ${lpace(c)}% expected, ${pace}, with ${assess}. ${bad ? `${_W(bad)} candidate${bad === 1 ? '' : 's'} ${bad === 1 ? 'is' : 'are'} at risk.` : 'Nobody is at risk this week.'}`;
  },

  leadMember: () => {
    const c = lcoOf(S.ldrCo);
    const m = lmemOf(c, S.ldrMem);
    return ldrRead(m, c);
  },

  /* "Ordered by distance from expected pace" was a caption for a sort order
     the column headings state, so the finding is the first sentence now. */
  leadReports: () => {
    /* THE "ALL COHORTS" TAB IS GONE (Maryam, 2 Sep 2026) and both branches that
       served it go with it — `S.ldrRep` is a cohort id now and cannot be
       `'all'`, so a summary that still tested for it would be a condition that
       is false every time it is evaluated. The sentence always names the
       cohort, which is what the page is always showing. */
    const sel = S.ldrRep;
    /* `lallmembers()` — the selector can be a PAST cohort (14 Sep 2026), so the
       summary reads the same active+past set the report table does; keyed on the
       active-only `lmembers()` a completed cohort's tab summarised zero rows. */
    const rows = lallmembers().filter(x => x.c.id === +sel);
    const behind = rows.filter(x => x.m.pc - lpace(x.c) <= -5);
    const never = rows.filter(x => x.m.last === 'Never');
    const worst = behind.slice().sort((a,b) => (a.m.pc - lpace(a.c)) - (b.m.pc - lpace(b.c)))[0];
    const where = `of the ${rows.length} in cohort ${sel}`;
    if(!behind.length) return `None ${where} is more than five points behind pace${never.length ? `, though ${_w(never.length)} ${never.length === 1 ? 'has' : 'have'} never signed in` : ''}.`;
    return `${_W(behind.length)} ${where} are five points or more behind pace${never.length ? `, and ${_w(never.length)} ${never.length === 1 ? 'has' : 'have'} never signed in` : ''}.${worst ? ` ${worst.m.name} is furthest back at ${worst.m.pc}%.` : ''}`;
  },

  /* THIS WAS THE CLEAREST CASE OF THE RULE ABOUT THE OTHER PORTAL. It spent
     its first sentence explaining the CANDIDATE'S Cohort page to a leader
     who never sees it, and its second defining what "direct" means. Neither
     is a catch-up and the second is a tab label. What a leader wants off
     Messages is who is waiting, and the one consequence worth a reminder is
     that a board post is public to the cohort. */
  /* THE SECOND SENTENCE WAS ABOUT A BOARD THIS PAGE NO LONGER HOLDS. It read
     "Anything you post to Cohort 41's board, all ten of them see" — the one
     consequence worth a reminder while Messages carried the cohort boards
     beside the direct threads. Those came out on 2 Sep 2026, and with them
     `S.ldrBoardCo`, which this was the last reader of: left as it was, the
     summary would have called `lcoOf(undefined)` on every render of the page.
     A page summary is the reading of what is ON the page (`PAGESUM`'s own
     rule), and what is on this one is three one-to-one threads. */
  leadMessages: () => {
    const waiting = LDR_THREADS.filter(t => t.msgs[t.msgs.length - 1].me === 0).length;
    return `${waiting ? `${_W(waiting)} direct thread${waiting === 1 ? '' : 's'} ${waiting === 1 ? 'is' : 'are'} waiting on a reply` : 'Nothing is waiting on a reply'}, out of ${_w(LDR_THREADS.length)} you have open. Everything here is private to you and the candidate.`;
  },

  /* "and 62 interviews run" DROPPED (doc §7): an agent's number on a volunteer's
     page — a cohort leader takes cohort calls and interviews nobody (1 Sep). */
  leadCerts: () => `${_W(LDR_CERTS.length)} earned and one in progress, off eight cohorts led. Candidate Mentoring is the open one, and it opens the Builder band.`,

  /* IT COVERS BOTH TABS SINCE 2 SEP 2026 and does NOT name them — `PAGESUM`'s
     third content ban is pointing at the UI, so the sentence says what the two
     halves HOLD rather than that there are two of them. First clause is the
     listing (the Public tab's whole subject), second is everything a candidate
     never sees. */
  leadProfile: 'Your public profile helps candidates decide if you’re the right fit. Update your bio and <b>specialities</b>, while your certifications determine the levels you can assess.'
};

function pageSummary(){
  const e = PAGESUM[S.view];
  const v = (e && typeof e === 'object' && !(typeof e === 'function')) ? (e[S.stage] || e._) : e;
  if(typeof v === 'function'){
    try { return v(cfg(S.stage)) || ''; } catch(err){ console.warn('pagesum copy', S.view, err); return ''; }
  }
  return v || '';
}

/* --------------------------------------------------------------------------
   AND IT TYPES ITSELF

   The summary is the one line on the page that is WRITTEN RATHER THAN
   STORED — it is Tal's reading of where you are, assembled from `S` at the
   moment you arrive. Printed whole it looks like a caption that was always
   there; typed, it reads as something being said to you now, which is what
   it is. That is the whole of the argument, and it is why this animates the
   summary and nothing else at the head of a page.

   THE HEIGHT IS RESERVED BEFORE THE FIRST CHARACTER. A typewriter that
   simply appends text grows its own box, and this box is at the top of the
   page with the whole page under it — two lines arriving one at a time
   would shove the page down 26px mid-read, and on the dashboard the
   `.stp-wing` beside it re-centres as it goes. So the paragraph is drawn
   TWICE: `.tsum-g` is the finished line, `visibility:hidden`, holding the
   final box open, and `.tsum-t` is the visible copy laid over it,
   absolutely positioned, filling in. §52 owns those two rules. Both are
   built from the same `innerHTML`, so they wrap identically and the typed
   text lands exactly where the finished text will be.

   THE GREETING DOES NOT TYPE, WHERE THERE IS ONE. `<span class="tal-greet">`
   is not part of the sentence — §33.9 sets it at 22px and hides the page's own
   `.ph` when it is present, so it IS the page's title, and no other page's
   `<h1>` types itself in. Its text nodes are filled before the clock starts;
   the sentence under it is what animates. The test is `closest()` rather than a
   node count, so a second block-level span in the same paragraph gets the
   same answer without an edit here.

   NO SUMMARY IN THIS BUILD CARRIES ONE ANY MORE — the note over `PAGESUM`'s
   `dashboard` block is where that is written down: §56's two-column band puts
   the title and the fact row above Tal, so the eight dashboards greet you from
   their `.ph` like every other page. `SUM_LEAVE` stays because the shape does:
   `dsTypeSummary` is the same twelve lines in the design system, and
   `tn-agent-portal.html` still opens its dashboard with a greeting.

   ONE RUN PER ARRIVAL, and `sumKey` is what decides what an arrival is —
   the portal, the view, the stage, AND THE TEXT. The first three are the
   page; the text is there because a detail page keeps its view name while
   its subject changes (`S.ldrMem`, `S.ldrCo`), and because a summary that
   has genuinely changed under you — a booking made, a stage advanced — is a
   new reading and reads better re-typed than silently swapped. A re-render
   that leaves the sentence alone does not re-type: it prints instantly,
   which is why every other interaction on the page is unaffected.

   AND IT SURVIVES A RE-RENDER MID-RUN. `render()` replaces
   `device.innerHTML`, so the nodes this is writing into are thrown away by
   any interaction — and at boot by the two passes after this one, each of
   which ends with its own `render()` (trap 8). Resuming from `_sumAt`
   rather than restarting is what stops those three synchronous boot renders
   from showing the line three times from zero; the generation counter is
   what stops the abandoned rAF loops from writing into detached nodes.

   `setTimeout` AND NOT `requestAnimationFrame`, WHICH IS THE ONE THING HERE
   THAT WAS FOUND RATHER THAN CHOSEN. rAF is the right scheduler for anything
   that has to agree with the compositor, and it is the wrong one for this:
   a hidden document does not get frames AT ALL, so the first version left
   the summary showing nothing but the greeting — indefinitely — in any tab
   that was not at the front when the page booted, which includes the preview
   pane this was verified in. `setTimeout` is throttled in the background
   rather than stopped, and because every tick derives what to show from the
   ELAPSED TIME rather than from a counter, a throttled tick simply arrives
   with more characters to reveal. Worst case in a background tab the line
   lands whole in one step, which is the correct answer for a page nobody is
   looking at. `SUM_STEP` at 16ms is a frame's worth, so on screen it is
   indistinguishable from the rAF version.

   `reduce()` (ai4) is the same helper the ask transitions use. Under it the
   line prints whole, immediately — a two-second reveal is exactly the kind
   of motion that setting is asking us not to make.
   -------------------------------------------------------------------------- */
/* THE PACE, AND IT IS A BUDGET RATHER THAN A RATE. `SUM_MS` is what a whole
   line may take and the per-character interval is derived from it, so a
   28-word summary and an 18-word one both finish in about the same time —
   which is what makes the effect read as one consistent habit of Tal's
   rather than as a page-by-page delay.

   3400ms, AND IT GOT THERE IN TWO STEPS FROM 1500 — BY EYE, WHICH IS THE
   ONLY WAY TO SET THIS. The first version divided 1500ms across the line: at
   the ~150 characters these summaries run to that is 10ms each, and 10ms
   reads as the sentence APPEARING rather than as being written, which is the
   whole point of doing it at all. 2300 was better and still hurried. At 3400
   the interval lands near 22ms and the line reads as somebody typing it,
   which is what was asked for both times.

   THE NUMBER TO CHANGE IS THIS ONE, and the floor and the ceiling only guard
   the division. Measured across all 128 summaries the build actually draws:
   the longest is 192 characters and prices at 17.7ms, so `SUM_MS` alone sets
   the pace for the body of the table; the shortest is 63 (`transcript`) and
   would crawl at 54ms a character, so the 34ms ceiling catches it and it
   lands in 2.1s instead of 3.4. `SUM_MIN` is never reached today — it is
   there for a summary longer than about 240 characters, which the 18-28 word
   rule in `PAGESUM`'s own note is supposed to prevent. */
const SUM_LEAVE = '.tal-greet';   /* filled before the clock starts */
const SUM_MS    = 3400;           /* the longest a whole line may take */
const SUM_MIN   = 14;             /* ms per character, floor */
const SUM_MAX   = 34;             /* ms per character, ceiling */
const SUM_STEP  = 16;             /* ms between ticks — see below */

let SUM_GEN  = 0;      /* invalidates the rAF loop of every earlier run */
let SUM_KEY  = null;   /* the arrival the current run belongs to */
let SUM_AT   = 0;      /* characters revealed, so a re-render can resume */
let SUM_DONE = false;

const sumKey = (text) =>
  (S.portal || 'candidate') + '/' + S.view + '/' + S.stage + '/' + text;

/* every text node under `root`, in reading order */
function sumRuns(root){
  const out = [];
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for(let n = w.nextNode(); n; n = w.nextNode()){
    if(!n.nodeValue) continue;
    if(n.parentElement && n.parentElement.closest(SUM_LEAVE)) continue;
    out.push([n, n.nodeValue]);
  }
  return out;
}

/* A PAGE WITH NO SUMMARY CLEARS THE KEY, and forgetting this was a real bug
   rather than a tidiness point. Eight pages get no summary at all — Messages,
   the courseware frame, the ask thread, the auth screens — and on those the
   pass returns before it ever reaches the typer. With the key left standing,
   `dashboard → messages → dashboard` came back to a key that had not changed
   and printed the line instantly: you left the page and returned, which is an
   arrival by any reading, and the one case where nothing typed. Clearing here
   makes the next summary that appears a new arrival whatever you did in
   between. It is also what makes `starter.html`'s three-page skeleton behave,
   where two of the three pages have no head band at all. */
function sumIdle(){ SUM_KEY = null; SUM_AT = 0; SUM_DONE = false; }

function typeSummary(p){
  /* THE SOURCE IS THE GHOST WHEN THERE IS ONE. After a run the paragraph's
     `innerHTML` is no longer the sentence — it is the ghost and the overlay —
     so reading it back would wrap the pair in a second pair, and it would also
     make the key a function of the previous run's markup rather than of the
     words. `placeSummaryPass` rebuilds the paragraph from `PAGESUM` one
     statement before calling this, so the portal cannot reach that state; the
     design system's port of this can, and does (`gallery.html`'s replay types
     the same element again with no render in between). Both are written the
     same way so the two stay one component. */
  const prior = p.querySelector(':scope > .tsum-g');
  const html  = prior ? prior.innerHTML : p.innerHTML;

  const key = sumKey(html);
  if(key !== SUM_KEY){ SUM_KEY = key; SUM_AT = 0; SUM_DONE = false; }
  if(SUM_DONE || reduce()){ SUM_DONE = true; return; }

  const gen = ++SUM_GEN;

  const ghost = document.createElement('span');
  ghost.className = 'tsum-g';
  ghost.setAttribute('aria-hidden', 'true');
  ghost.innerHTML = html;

  const live = document.createElement('span');
  live.className = 'tsum-t';
  live.innerHTML = html;

  p.innerHTML = '';
  p.classList.add('tsum');
  p.appendChild(ghost);
  p.appendChild(live);

  const runs  = sumRuns(live);
  const total = runs.reduce((a, r) => a + r[1].length, 0);
  if(!total){ SUM_DONE = true; return; }

  /* THE CARET CONTRIBUTES NO WIDTH. It is 2px with a -3px right margin, so
     its inline advance is zero and it can never be the character that wraps
     a line — which would put the visible copy one line taller than the box
     the ghost is holding open. §52 states the geometry; this is only why. */
  const caret = document.createElement('span');
  caret.className = 'tsum-c';
  caret.setAttribute('aria-hidden', 'true');

  const per = Math.max(SUM_MIN, Math.min(SUM_MAX, SUM_MS / total));
  const t0  = performance.now() - SUM_AT * per;

  (function tick(now){
    if(gen !== SUM_GEN || !live.isConnected) return;
    const shown = Math.max(0, Math.min(total, Math.round((now - t0) / per)));
    SUM_AT = shown;

    /* `host` is the first run that is not finished — the run the caret is
       sitting in. Null means the line is whole. */
    let left = shown, host = null;
    for(const [n, s] of runs){
      const k = Math.min(left, s.length);
      n.nodeValue = s.slice(0, k);
      left -= k;
      if(host === null && k < s.length) host = n;
    }

    if(host){
      if(host.nextSibling !== caret) host.parentNode.insertBefore(caret, host.nextSibling);
      setTimeout(() => tick(performance.now()), SUM_STEP);
    } else {
      caret.remove();
      SUM_DONE = true;
    }
  })(performance.now());
}

/* --------------------------------------------------------------------------
   THE PASS

   TWO FUNCTIONS RATHER THAN ONE, AND ONLY TO GET THE BAIL PATH RIGHT. The pass
   below has eight early returns — the ask thread, the auth screens, the
   courseware frame, both Messages surfaces, a page with no `.main`, a view
   with no `PAGESUM` row — and every one of them means "this page has no
   summary", which is exactly when the typer's key has to be cleared. Doing
   that at eight `return` sites is eight places to forget it, and the one that
   was forgotten is the one that would go unnoticed. So the pass keeps its
   plain returns and says so by returning nothing; the wrapper reads that as
   idle. The successful path ends `return true`, which is the only signal
   either function needs.
   -------------------------------------------------------------------------- */
function placePageSummary(){
  if(placeSummaryPass() !== true) sumIdle();
}

function placeSummaryPass(){
  const main = device.querySelector('.view-col > .main') || device.querySelector('.main');
  if(!main) return;
  const page = main.querySelector('.page');
  if(!page) return;
  /* the ask thread and the sign-up screens are not modules and Tal does not
     summarise them — same two exclusions `placeBand` makes, for the same
     reasons, written down there */
  if(page.classList.contains('ask-page')) return;
  if(page.closest('.auth-card')) return;

  /* AND NEITHER IS THE COURSEWARE. `coursework` and `chapter` render one empty
     slot for the LightspeedVT iframe and nothing else — see the note over
     `lsvtFrame` in views.js: the whole module is somebody else's interface, so
     anything we draw here is a second set of chrome around a screen that has
     its own. That note lists `placeBand` (ai5) and `placeAI` (ai2) as bailing
     of their own accord because both need a `.ph` to hang off; this pass does
     NOT need one — the branch below BUILDS a `.modhead` when there is no band —
     so it put a Tal card above the frame that nothing else in the module would
     have. It is the one pass that has to be told.

     Tested on the slot rather than on the two view names, for the reason the
     composer exclusion in ai4 gives: the condition is "this page is a frame we
     do not own", and a third view that embeds one would want the same answer
     without having to be added to a list. `PAGESUM.coursework` and
     `PAGESUM.chapter` stay where they are, unreached, alongside `PARKED` in
     views.js — they are the copy for whatever turns out to live outside the
     frame once the LightspeedVT screens are confirmed. */
  if(page.querySelector(':scope > .lsvt-slot')) return;

  /* AND NEITHER IS THE CONVERSATION WITH PRIYA. Every other page in the product
     is a set of blocks that a reader has to be told the shape of; this one is a
     thread, and the last message in it — visible, two inches below — IS the
     summary. Tal's `messages` entry said Priya can see your chapters and that
     her last message asked for the vendor review example: the first half is a
     policy statement that belongs on the account page, and the second is a
     paraphrase of a bubble already on screen.

     It also cost the thread real height, on the one page in the product whose
     footer has to be reachable without scrolling (§37.7): the band took ~116px
     off a box that the composer sits at the bottom of.

     `.msg-page` is the candidate's Messages and nothing else — the leader's
     Messages is a list of threads, not a thread — so the class is the whole
     test. `PAGESUM.messages` stays where it is, unreached, for the same reason
     the courseware's entries do. */
  if(page.classList.contains('msg-page')) return;

  /* AND NEITHER IS THE LEADER'S MESSAGES MODULE, `msg-mod`, for the argument
     above plus one of its own. Both of its tabs are a conversation — a cohort
     board or a one-to-one — so the last thing said is the summary either way;
     and the Direct tab is a two-column inbox whose right-hand column has to
     fit the frame with its composer at the foot, which is the height the band
     was taking. A separate class rather than reusing `.msg-page` because that
     class also carries the candidate page's own flex layout (§16, §37.7), and
     this page is a tab strip over two surfaces, not one thread. */
  if(page.classList.contains('msg-mod')) return;

  /* AND `nosum` IS THE GENERAL FORM OF THE SAME OPT-OUT — a view saying "not on
     this page" without the class also having to name a surface. The two above
     are `.msg-*` because both were arguments about what a MESSAGES page is; this
     one is for a page whose reason is its own content, and `V.leadSum` is the
     first (Maryam, 1 Sep 2026): the 90-day summary page IS a summary, so Tal's
     line was reprinting the recommendation the page states as a `.kv` row and
     the four figures it states as a `.stats` band.

     IT MUST BE CHECKED HERE, BEFORE STEP 1, and that is the whole reason this is
     a `return` at the top rather than a `PAGESUM` entry deleted. Trap 11: the
     stripping passes run FIRST — `talFirst` hoists, `placeBand` claims, and only
     then does this function look for text — so a page with no entry gets its
     card stripped of its action and its words and then left in a shape §33 does
     not style, which renders the head band ~700px wider than the page. An early
     return means no card is inserted at all.

     THE KEY IS STILL CLEARED, because `placePageSummary` is the two-line wrapper
     that exists for exactly this: only the success path returns `true`, so an
     opt-out cannot leave a stale typing key behind and make the NEXT page print
     instantly (the eight-plain-`return`s note above says why). */
  if(page.classList.contains('nosum')) return;

  const band = page.querySelector(':scope > .modhead');

  /* 1. THE QUESTIONS LEAVE THE TOP OF THE PAGE.
     Both containers, because a card can hold either: `.ai-foot` is what the
     view prints and `.ai-asks` is what ai4 appends, and ai5 merges one into
     the other only when both exist. `.sec.ask-chips` is the row Points draws
     with no card around it. Scoped to the band — or, on a page that has no
     band, to the head of the page — so the chips inside `weekCard` and on
     the agent cards further down are untouched. */
  const top = band || page;
  top.querySelectorAll(':scope > .sec.ask-chips').forEach(el => el.remove());
  if(band) band.querySelectorAll('.ai-asks, .ai-foot').forEach(el => el.remove());

  /* 1b. AND A CHIP WITH NO CARD AROUND IT LEAVES THE PAGE ENTIRELY.
     `askChip` was used two ways. Inside a Tal card it is Tal's own suggested
     next question and it belongs there — the card says who is asking. Dropped
     straight into page flow (`<div class="mt5">${askChip(…)}</div>` on the
     report, the clip list, the cohort card) it is a lone pill in the middle of
     a column of prose: nothing says it is Tal's, nothing says why it is there,
     and the ask bar at the foot of the frame is the standing answer to
     "anything else?" on every page in the product. Two invitations to ask,
     the floating one quieter and less explicable than the docked one.

     THE TEST IS "IS IT IN SOMETHING THAT IS TAL'S" — the aura card, the panel,
     the thread, a sheet, or the band this pass has just built. Anything else
     is page flow. The empty wrapper goes with it, because `.mt5` on a div with
     nothing left in it is 24px of space nobody can see the reason for.
     `.chip-tal` is also what the Tal panel's suggestions and the thread's
     follow-ups are made of, which is why the closest() list is the guard
     rather than a blanket removal. */
  page.querySelectorAll('.chip-tal').forEach(chip => {
    if(chip.closest('.ai-aura, .tal-panel, .ask-page, .sheet, .modhead, .ai-asks, .ai-foot')) return;
    const host = chip.parentElement;
    chip.remove();
    if(host && host !== page && !host.children.length && !host.textContent.trim()) host.remove();
  });

  /* AND SO DOES THE ACTION THAT RODE TAL'S HEAD ROW.
     `placeBand` promotes each Tal card's one next step onto the row Tal's
     name is on — and converts three cards' text links into buttons to do it.
     That was right when the row held a heading for the button to sit beside;
     with the heading gone the button is the whole row, and §25's `act` area
     draws it as a full-width black bar between Tal's name and the sentence
     it is meant to be about. It reads as the summary, and it is the loudest
     thing in a band whose job is to be read first.

     Removed rather than restyled: every one of these steps is also on the
     page under it — the plate's own button, the section's "View more", the
     rail — so the band loses a duplicate, not a route. */
  if(band) band.querySelectorAll('.ai-aura > .ai-head > .ai-do, .ai-aura > .ai-head > .btn-p, .ai-aura > .ai-head > .btn').forEach(el => el.remove());

  const text = pageSummary();
  if(!text) return;

  /* 2. FIND TAL'S CARD, OR MAKE ONE.
     ONLY EVER INSIDE THE BAND. An earlier version fell back to searching the
     whole page when there was no band, and that is not the same question:
     `V.booking` and `V.agent` both carry a Tal card in the BODY, doing the
     job Tal cards did before this pass existed — advice about the thing next
     to it. Searching the page found one of those, rewrote it as the page
     summary, and left it where it was, halfway down. A page with no header
     has no Tal card at the head of it by definition, so the answer there is
     always to build one. */
  let aura = band ? band.querySelector('.ai-aura') : null;
  if(!aura){
    const sec = document.createElement('div');
    sec.className = 'sec';
    sec.innerHTML = '<div class="ai-aura tile tight">' +
      '<div class="ai-head"><span class="ai-label">Tal</span></div>' +
      '<div class="ai-body"><p></p></div></div>';
    aura = sec.querySelector('.ai-aura');

    if(band){
      /* after the page header, which is where every hand-written Tal card
         already sits — the band's own grid does the rest */
      const ph = band.querySelector(':scope > .ph');
      if(ph) ph.insertAdjacentElement('afterend', sec);
      else band.appendChild(sec);
    } else {
      /* NO PAGE HEADER, SO NO BAND — report, agent, booking and messages all
         open on their own object instead of a title. They still get the
         wash and the closing rule, because the summary has to read as the
         same block it is on every other page; the band simply has one
         member. It goes under the crumb, which is navigation and belongs
         above anything Tal says. */
      const nb = document.createElement('div');
      nb.className = 'modhead';
      nb.appendChild(sec);
      const crumb = page.querySelector(':scope > .crumb');
      if(crumb) crumb.insertAdjacentElement('afterend', nb);
      else page.insertBefore(nb, page.firstChild);
    }
  }

  /* 3. THE HEADING GOES AND THE SENTENCE TAKES ITS PLACE. */
  const head = aura.querySelector(':scope > .ai-head');
  if(head) head.querySelectorAll('h3').forEach(h => h.remove());

  /* AND THE LABEL SAYS WHAT THE BLOCK IS — Figma 578:5966 (581:6670).
     Every Tal card in the build is labelled "Tal", which is right for a card
     that is Tal offering something and thin for the one at the head of a page:
     with the `h3` removed one line above, "Tal" was a name with nothing after
     it, over a paragraph that could as easily have been the page's own lede.
     "Summary by Tal" names the object and keeps the attribution.

     HERE RATHER THAN IN `talLabel`, for the reason step 4 below is here: what
     makes a card a summary is this pass, not the view that printed it. The
     twenty-odd cards further down pages — `V.agent`'s advice, `V.booking`'s —
     are Tal offering something about the thing beside them and keep the name.
     The view stays free to write `talLabel()` and not know which it will be.

     THE MARK IS STILL TAL'S OWN. 581:6669 draws a four-point sparkle here and
     §33.2 replaced exactly that with the artwork, on the argument that the
     sparkle is the generic "there is AI here" mark while `--tal-mark` is Tal's
     face everywhere else in the product. That argument did not stop being true
     when the words changed, so the file's words are taken and its mark is not;
     §70 gives the words the gradient the file paints them in. */
  const lab = head && head.querySelector(':scope > .ai-label');
  if(lab && lab.textContent.trim() === 'Tal') lab.textContent = 'Summary by Tal';
  /* AND THE MARK IS THE ORB ITSELF, not a picture of it. §70.632 painted
     `--tal-mark` as a 28px background on this label's `::before`; §133 turns
     that off once a real `.borb` is in here and sizes this one to the same
     28px, so the band's geometry is unchanged and only the mark is live
     artwork. It is emitted WITHOUT `live`, which is the point: orb-wire pins
     every orb that did not ask for a state to idle, and a page summary is an
     attribution, not a status — it must not start thinking because the reader
     happens to be asking Tal something elsewhere on the page.
     Text first, then the orb: the assignment above is `textContent`, which
     would wipe a child element written before it. */
  if(lab && !lab.querySelector(':scope > .borb')){
    lab.insertAdjacentHTML('afterbegin', borbMark('tal-mk'));
  }

  let body = aura.querySelector(':scope > .ai-body');
  if(!body){
    body = document.createElement('div');
    body.className = 'ai-body';
    aura.appendChild(body);
  }
  body.innerHTML = '<p>' + text + '</p>';

  /* 4. AND IT IS NOT A BUTTON. See the note at the head of this file. */
  aura.classList.remove('ai-clickable', 'ai-act-top');
  aura.removeAttribute('data-tal-ask');
  aura.removeAttribute('role');
  aura.removeAttribute('tabindex');
  aura.removeAttribute('aria-label');

  /* the flag §33 styles against, so nothing here reaches a Tal card that is
     further down a page doing its old job */
  aura.classList.add('talsum');

  /* 5. AND TAL SAYS IT RATHER THAN HAVING SAID IT.
     Last, after the flag: `typeSummary` splits the paragraph into a hidden
     ghost and a visible copy, and §52's rules are all gated on `.talsum`
     being there. It is also after the class removals above because those
     read the card, not the paragraph, and this is the only step that leaves
     the paragraph in a shape nothing else in the build expects — so it is
     the last thing that happens to this card. */
  const para = body.querySelector(':scope > p');
  if(!para) return;
  typeSummary(para);
  return true;   /* read by placePageSummary — see the note above it */
}

const _baseSum = render;
render = function(){
  _baseSum();
  try { placePageSummary(); } catch(e){ console.warn('pagesum', e); }
};

/* ==========================================================================
   A PHRASE IN THE SUMMARY OPENS A SECOND SUMMARY — Figma 596:7020 (596:7379)

   The three accent phrases in Tal's sentence were a ground and an ink; they are
   controls now. Press one and a card opens under it with the reading BEHIND
   that phrase — where the claim came from, what it means, and the one thing to
   do about it. That is the difference between a page that states a conclusion
   and one you can ask "why".

   THE KEYS ARE SUBJECTS, NOT POSITIONS, WHICH IS WHAT MAKES THIS REUSABLE.
   `data-sum="quiz"` is written into the summary string itself, so any entry in
   `PAGESUM` — this dashboard's, another stage's, the leader's — can mark a
   phrase and get the same card with no new code. Three exist; a fourth is one
   row in `SUMDROP` and one attribute. Nothing here is keyed to `new`.

   EVERY FIGURE IS READ, NONE RESTATED. The quiz card counts its own bands out
   of `SCORES`, the match card reads `AGENTS` and `REC` for whoever `recKey()`
   currently names, and the track card is the file's copy verbatim. So swapping
   the agent changes the third card with the sentence above it, and a change to
   a score moves the first one.

   A VALUE IS A FUNCTION OR AN OBJECT, the same shape `PAGESUM` uses, with four
   parts: `lead` (what is true), `label` + `read` (what it means, the label in
   its own hue), `next` (what to do), and `act` (the way to do it).
   ========================================================================== */
const _sumTop = () => SCORES.slice().sort((a,b) => b[1] - a[1])[0];

/* THE INTERVIEW ACTION, ONCE, FOR EVERY CARD THAT WANTS TO POINT AT IT.
   Three keys need the same button and the right answer depends on whether an
   interview exists: book one, or go and look at the one you have. Written out
   per card it was three copies of the same conditional and one of them was
   already wrong (see `track`).

   IT ALSO ANSWERS "THE PAGE I AM ALREADY ON". `V.interviews` is where a
   booking is listed, so offering "See the booking" from the Interviews page is
   a button that reloads the page under it — §60's dead control by another
   route. From there it goes one level deeper, to `V.booking`, which is the
   appointment's own page. */
const _bookedAct = () => {
  /* THE TEST IS THE STAGE, NOT `S.booking`, AND THAT DISTINCTION IS THE WHOLE
     BUG THIS HELPER WAS WRITTEN TO FIX — it shipped once with `if(S.booking)`
     and still offered "Book your interview with Priya Nair" on the booked
     stage, which is what it exists to prevent.

     `S.booking` is only written when a reader actually walks ai7's flow in the
     thread. Arriving at `#booked` from the stage picker or a link leaves it
     null while every other surface on the page reads the appointment perfectly
     — `bkRec()` is `S.booking || S.bk || {defaults}`, which is why `bkLong()`
     prints the date either way. So `S.booking` answers "did this reader book
     it just now", and the question here is "is there an interview", which is
     `cfg(S.stage)`.

     AND `f.pred` ALONE IS NOT THAT QUESTION — the second half of the same bug.
     `CFG.booked` is `{pred:true, booked:true}`: `pred` means the LEVEL is only
     predicted, which stays true right up until an agent signs it, so it is
     true on the booked stage as well. `PAGESUM.interviews` encodes this by
     testing `f.booked` BEFORE `f.pred`, and the order is the whole of its
     correctness. Same order here. */
  const f = (typeof cfg === 'function' ? cfg(S.stage) : null) || {};
  if(f.pred && !f.booked && !S.booking){
    const k = recKey();
    return {ic: I.calendar, go: 'agent:' + k, t: 'Book your interview with ' + AGENTS[k].n};
  }
  /* AND FROM THE INTERVIEWS PAGE IT GOES ONE LEVEL DEEPER. That page is where
     a booking is listed, so "See the booking" from it reloads the page under
     the reader's finger; `V.booking` is the appointment's own page. */
  if(S.view === 'interviews') return {ic: I.calendar, go: 'booking', t: 'See the booking details'};
  /* once the interview has run, the module is a list of interviews and their
     reports rather than one appointment */
  return f.booked || S.booking
    ? {ic: I.calendar, go: 'interviews', t: 'See the booking'}
    : {ic: I.document, go: 'interviews', t: 'See your interviews'};
};

const SUMDROP = {
  /* WHERE THE TRACK CAME FROM. The two figures are the quiz's own — its score
     is the one the `.ph` fact row prints, and its date is `qzTaken()`, which
     all three `quizResults` call sites and `V.result` also read. */
  quiz: () => {
    const [hiN, hiV] = _sumTop();
    const low = qzLow(2);
    return {
      lead: `You scored 64/100 on the Next in Leadership quiz on ${qzTaken()}, placing you on the Explorer track.`,
      label: '',
      read: `Your quiz determines your track: Explorer, Builder, or Trailblazer. Your level (E1&ndash;E5) will be assigned after your 45-minute interview with an agent.`,
      next: 'Book an interview to discover your level, strengths, and growth areas.'
      /* NO ACTION BUTTON (Maryam, 1 Oct 2026: "remove open quiz button from this
         summary highlight modal"). The popover is a read, not a launcher; the
         quiz breakdown is its own modal off the Quick Action now. `sumDropCard`
         renders no `.sd-act` when `act` is absent. */
    };
  },

  /* 596:7379, THE FILE'S OWN WORDS. The only thing computed is the agent's
     name in the action, which follows `recKey()` like everything else.

     THE ACTION IS NOW STAGE-AWARE, AND THAT WAS A PRE-EXISTING WRONG BUTTON.
     This key is written on `new` (`PAGESUM.dashboard.new`) AND on `booked`
     (ai7's assembled line, and `PAGESUM.level.booked` since 2 Sep 2026), and
     it offered "Book your interview with Priya" on all of them — on a stage
     whose whole subject is that the interview is already booked. `_bookedAct`
     is the shared answer: the appointment if there is one, booking one if
     there is not. §60's rule is that a control which cannot do anything is
     worse than no control; this one could act, it just acted on a decision
     already taken. */
  track: () => ({
    lead: 'According to the Next in leadership quiz, you are evaluated as an Explorer.',
    label: 'Discovering your direction:',
    read: 'You&rsquo;re exploring what fits you best, and that&rsquo;s a strength. Stay curious, ask questions, and keep trying new experiences.',
    next: 'Connect with Talent Next Agent to get yourself evaluated and get a level. Your level anchors after a 45-minute interview.',
    act: _bookedAct()
  }),

  /* WHY THIS PERSON. `REC` holds the overlap and `AGENTS` the record, so this
     card and the block below it cannot disagree about the match, the fee or
     the slot — and both move together when Tal finds another agent. */
  match: () => {
    const k = recKey(), a = AGENTS[k], r = REC[k];
    return {
      lead: `${a.n} assesses ${a.range} and has run ${a.ivs} interviews, rated ${a.r.toFixed(1)}.`,
      label: 'Why this pair:',
      read: `Your growth area is ${r.need.toLowerCase()} and their strength is ${r.strength.toLowerCase()}. ${r.match} of what your quiz surfaced overlaps with what they assess.`,
      next: `Their next opening is ${a.slot}, 45 minutes, ${a.price}. Nothing is charged until you confirm the slot.`,
      act: {ic: I.calendar, go: 'agent:' + k, t: 'Book your interview with ' + a.n}
    };
  }
,

  /* --- the booked stage --------------------------------------------------
     THE APPOINTMENT, AND WHAT IS INSIDE IT. The four facts are the plate's own
     — `bkStamp` (ai7) is what makes every hand-written mention of the booking
     read the actual choice, and this card states the same ones in the same
     words so it moves with them. */
  interview: () => ({
    /* THE RECORD, NOT THE STAGE'S HARD-CODED PAIR — and `try` rather than the
       `typeof` guard that was here. `bkLong` is `const bkLong = …` (ai7:90), and
       `typeof` does NOT shield a const in the temporal dead zone: it throws on
       one instead of returning 'undefined'. This particular call is safe either
       way — it only runs when a reader presses a phrase, long after every pass
       has parsed — but the guard was stating a protection it did not provide,
       and the identical line in `CALL_ROW.iv` DID blank the page on a cold load
       at `#booked`. Same pattern, so the same correction. */
    lead: `Your interview with ${AGENTS[(S.booking || {}).agent || 'priya'].n} is `
      + (() => { try { return bkLong(); }
                 catch(e){ return 'booked for Thursday 20 August at 6:30 PM'; } })() + '.',
    label: 'What happens in it:',
    read: '45 minutes, recorded, and real situations rather than hypotheticals. She confirms which of E1 to E5 you sit on and signs a report you keep.',
    next: 'Nothing has to be prepared. If you want to, ten minutes on delegation is the most useful ten minutes you can spend.',
    act: _bookedAct()
  }),

  /* WHY DELEGATION AND NOT SOMETHING ELSE. The band and the chapter are both
     read rather than typed: `SCORES` has the score and `CH` has the chapter it
     is built on, which is the same pair `V.result` and `signedSummary` print. */
  prep: () => {
    /* DELEGATION BY NAME, NOT BY RANK. The first cut read `qzLow(2)[0]`, which
       is Coaching at 38 — the lowest band, and not what the product says about
       Priya. "Delegation is the question she asks most often" is a claim about
       the AGENT, made in `PAGESUM.booked` and in the view; the rank is a fact
       about the QUIZ. Looking it up by name keeps the sentence true and still
       reads its score out of `SCORES` rather than typing it. */
    const d = SCORES.find(b => b[0] === 'Delegation') || qzLow(2)[0];
    return {
      lead: `${d[0]} is the question Priya asks most often, and it is one of your two lowest quiz bands at ${d[1]}.`,
      label: 'How to spend ten minutes:',
      read: 'Have one real example ready: something you handed over, what actually happened, and what you would do differently. She is assessing judgement, not vocabulary.',
      next: 'Tal can run a mock interview on it whenever you want one, and it does not go on your record.',
      act: {ic: I.chat, ask: 'Run a mock interview on delegation', t: 'Run a mock interview'}
    };
  },

  /* --- the assessed stage ------------------------------------------------ */
  level: () => ({
    lead: 'You were confirmed at Explorer &ndash; E3 on 21 August after your interview, rung 3 of the fifteen-rung ladder.',
    label: 'What a level is:',
    read: 'Explorer is rungs 1 to 5 of 15, and the interview is the only thing that sets one. A quiz cannot. E3 opens the course built for E3, and 90 days later you re-interview.',
    next: 'The ladder shows all fifteen rungs and the three tracks they sit in.',
    act: {ic: I.certificate, go: 'level', t: 'See where you are on the ladder'}
  }),

  growth: () => {
    const low = qzLow(2);
    const ch = low.map(b => QZ_CH && QZ_CH[b[0]] ? CH.findIndex(c => c[0] === QZ_CH[b[0]]) + 1 : 0).filter(Boolean);
    return {
      lead: `Your two lowest bands were ${low[0][0]} at ${low[0][1]} and ${low[1][0]} at ${low[1][1]}.`,
      label: 'Where the course meets them:',
      read: ch.length === 2
        ? `Chapters ${ch[0]} and ${ch[1]} are built on exactly these two, which is why they are the two Priya wrote up.`
        : 'Two of the thirteen chapters are built on exactly these, which is why they are the two Priya wrote up.',
      next: 'The full report has her write-up on both, in her own words, with the evidence she based it on.',
      act: {ic: I.document, go: 'report', t: 'Read the full report'}
    };
  },

  /* NO FIGURES. The fee, the credit and what is due today are `V.enrol`'s three
     `.kv` rows and the note over `enrolPlate` is explicit that they live there;
     a fourth statement of them in a popover is the drift that note exists to
     stop. This card says what enrolling IS and sends you to the page that
     costs it. */
  enrol: () => ({
    lead: 'Enrolling locks in your place in the next cohort and the price you were quoted.',
    label: 'What the 90 days are:',
    read: '13 chapters, one a week, each closing on an assessment, with a cohort of ten and a live leader running a weekly call. The average of the thirteen is what an agent reads at your re-interview.',
    next: 'The next cohort starts within two weeks of paying, and the interview you have already paid for comes off the price.',
    act: {ic: I.wallet, go: 'enrol', t: 'See what enrolling costs'}
  }),

  /* ======================================================================
     SIX MORE, FOR THE FIVE SUMMARIES REWRITTEN ON 2 Sep 2026 (Maryam). The
     standing rule from that ask: a phrase is highlighted ONLY if pressing it
     says something — *"if you feel somewhere that there should not be any
     popover against a highlighted text then you can remove the highlight from
     that text so user does not expect anything"*. So the accent and the card
     are one decision, and every phrase those five lines light has a row here.

     THREE PHRASES REUSE EXISTING KEYS rather than getting near-duplicates:
     `quiz` and `track` for the two the dashboard already explains, and
     `interview` for the appointment on both booked pages. That is what the
     head of this block means by "the keys are subjects, not positions".
     ====================================================================== */

  /* WHAT A LEVEL INTERVIEW IS, BEFORE THERE IS ONE. Two phrases across two
     pages point here — "45-minute interview" on My Level and "45-minute
     conversation" on Interviews — because they are the same subject named
     twice, and one card is what stops the two pages explaining it differently.

     IT IS NOT `interview`, AND THAT IS THE WHOLE REASON IT EXISTS. That key
     opens "Your interview with Priya Nair is booked for…", which is false on
     every stage before one is. This card names no agent and no date, so it is
     true whether or not anything is booked, and its action is `_bookedAct`'s
     — which on those stages is "book one". */
  ivwhat: () => ({
    lead: 'A level interview is 45 minutes with a talent agent, video-recorded, and it is the only thing that sets a level.',
    label: 'What happens in it:',
    read: 'Real situations rather than hypotheticals. The agent decides which of E1 to E5 you sit on and signs a report you keep. A quiz can predict the track, but it cannot set the rung.',
    next: 'Any agent whose range covers your track can run it. Nothing is charged until you confirm a slot.',
    act: _bookedAct()
  }),

  /* HOW TO CHOOSE ONE — for "24 available agents" on the Interviews page.

     IT STATES NO COUNT, DELIBERATELY. The phrase it hangs off says 24 and
     `AGENTS` holds six, so any count in this card either contradicts the
     sentence above it or invents a relationship between the two numbers ("18
     have no slot") that no record supports. The fee and rating spreads ARE
     read off `AGENTS`, so every figure here is one the grid below prints. The
     literal 24 is noted where `PAGESUM.interviews` states it. */
  roster: () => {
    const ks = Object.keys(AGENTS);
    const ps = ks.map(k => Number(String(AGENTS[k].price).replace(/[^0-9.]/g, ''))).filter(Boolean);
    const rs = ks.map(k => AGENTS[k].r);
    return {
      lead: `Every agent sets their own fee and assesses their own band of levels: $${Math.min(...ps)} to $${Math.max(...ps)} here, rated ${Math.min(...rs).toFixed(1)} to ${Math.max(...rs).toFixed(1)}.`,
      label: 'What has to match:',
      read: 'The range, and only the range. An agent assesses a band of the fifteen rungs, and yours has to sit inside it. Fee, rating and what they assess for are yours to weigh after that.',
      next: 'Tal already has a pick, on the strength of what your quiz surfaced.',
      act: _bookedAct()
    };
  },

  /* --- Payments -----------------------------------------------------------
     BOTH OF THESE POINT AT SOMETHING TAL IS ALLOWED TO KNOW, AND THAT IS THE ONE
     DESIGN CONSTRAINT ON THIS PAGE. `NEVER` (ai2) and clause 4 of the Data use
     notice both say Tal has never seen billing, and `wLedger` (ai8) declines a
     "what have I paid" question outright. `PAGESUM.billing` no longer recites
     the ledger either (its own note above, and doc §7, 8 Sep 2026), so the page
     is honest end to end — and a popover is Tal EXPLAINING, so these two are
     written about the refund windows and how a card is held, both inside Tal's
     six subjects. `refund`'s action is a real routed question (`wRefund`);
     `defcard` reads `S.cards`, not the ledger.

     THE `charge` AND `tracke2` POPOVERS ARE GONE with the phrases that opened
     them — `charge` read out `PAY_E2`'s five fields (the ledger, aloud) and
     `tracke2` hung off "Explorer Track E2", a purchase the band no longer names.
     The charge lives in the "Previous Transactions" table, which is where the
     doc puts it. */

  refund: () => ({
    lead: 'A course and an interview are refunded on different clocks.',
    label: 'Two windows, not one:',
    read: 'A course purchase and an interview fee are always separate rows, and each keeps its own receipt and its own refund window for as long as the account is open.',
    next: 'Tal can state both windows against your charges. The figures come from the terms, not from a billing ledger Tal cannot see.',
    act: {ic: I.time, ask: 'What is the refund window?', t: 'Ask about the refund windows'}
  }),

  /* THE DEFAULT CARD. Every figure is `S.cards`, which is also what the list
     under the table is drawn from, so the two cannot disagree about which card
     is default or how many are on file. It states no cap, and as of 2 Sep 2026
     there is no cap to state: `V.billing` used to hide "Add a card" at three
     and the list happened to hold three, so deriving a maximum from
     `S.cards.length` would have been reading a coincidence. The control is
     unconditional now and the sentence under the list is gone, so this card was
     right by accident and is right on purpose. `wCard` (ai8) is the one place
     that DID assert the cap; it no longer does. */
  defcard: () => {
    const cs = S.cards || [];
    const def = cs.find(c => c.def) || cs[0] || {brand: 'Visa', last: '4242', exp: '09/29'};
    const others = Math.max(0, cs.length - 1);
    return {
      lead: `${def.brand} ending ${def.last} is your default card, expiring ${def.exp}.`,
      label: 'What default means:',
      read: 'It is the card a new charge is offered against first, and it is a preference rather than a commitment. You can switch it, or take a card off, without touching anything already paid.',
      next: others
        ? `The other ${others === 1 ? 'one is' : _w(others) + ' are'} on file for later, and each can be made the default from the list below.`
        : 'It is the only card on file.',
      act: {ic: I.shield, ask: 'Is my card stored?', t: 'Ask how your card is held'}
    };
  },

  /* --- joining ------------------------------------------------------------
     THE WINDOW IS READ, NOT TYPED. `JOIN_EARLY` (views.js) is the five minutes
     `joinLive` actually opens the door on, so the card and the gate cannot
     drift. The candidate's Joins are deliberately UNGATED (the `{gate:true}`
     note on `leadCallCard`), so this button opens the call whenever it is
     pressed, exactly like the other three candidate Joins.

     `act.call` IS A THIRD ACTION KIND and `sumDropCard` now emits `data-call`
     for it. Nothing else was needed: ai10 already listens for `[data-call]` on
     `device`, and ai6's own click handler leaves controls inside `.sumdrop`
     alone. The card then clears itself on the next render, because the call
     screen has no `.ai-body` for `placeSumDrop` to anchor in. */
  join: () => ({
    lead: `The call opens ${_w(JOIN_EARLY)} minutes before the start and stays open until the session ends.`,
    label: 'What you are joining:',
    read: 'A video call in the browser: camera, microphone, screen share and captions. It is recorded, and the recording goes to your agent rather than to Tal.',
    next: 'Nothing has to be prepared. If the time no longer works, reschedule from the card below.',
    act: {ic: I.video, call: 'iv', t: 'Join the interview'}
  })
};

function sumDropCard(key){
  const src = SUMDROP[key];
  if(!src) return '';
  const d = typeof src === 'function' ? src() : src;
  return `<div class="sd-b">
      <p class="sd-lead">${d.lead}</p>
      <p class="sd-read">${d.label ? `<b>${d.label}</b> ` : ''}${d.read}</p>
    </div>
    <div class="sd-next">
      <p class="sd-nt">Your Next Step</p>
      <p class="sd-nb">${d.next}</p>
    </div>
    ${d.act ? `<button class="sd-act" ${d.act.ask
      ? `data-tal-ask="${d.act.ask}"`
      : d.act.call
        ? `data-call="${d.act.call}"`
        : `data-go="${d.act.go}"`}><span class="sd-ic">${d.act.ic}</span>${d.act.t}</button>` : ''}`;
}

/* THE QUIZ-RESULTS MODAL (Maryam, 1 Oct 2026: "on clicking quiz results action
   item, do not open right slider, just open a modal and show the content we are
   showing in the summary quiz results highlight modal and a secondary button of
   'Close'"). The Quick Action used to open `quizPeek` as a right-hand column
   (`data-peek="quiz"`); it opens this centred dialog instead. The body is the
   EXACT `SUMDROP.quiz` read `sumDropCard` draws in the highlight popover — now
   with no action button — wrapped in `.sumdrop.sd-flat` so the `.sd-*`
   typography applies while §70 drops the floating card's own position, border,
   shadow and width cap. `S.quizModal` gates it; `data-quizclose` and the
   backdrop close it. `quizPeek`/`peekPanel` stay defined (reachable by nothing
   on the dashboard now). */
function quizModal(){
  if(!S.quizModal) return '';
  return `<div class="modal on" data-quizclose="1">
    <div class="sheet" role="dialog" aria-modal="true" aria-label="Your quiz results">
      <div class="sheet-b"><div class="sumdrop sd-flat">${sumDropCard('quiz')}</div></div>
      <div class="sheet-f"><button class="btn btn-s noic" data-quizclose="1">Close</button></div>
    </div>
  </div>`;
}

/* --- the pass -------------------------------------------------------------
   IT RUNS AFTER `placePageSummary` AND IT MEASURES THE GHOST.
   `typeSummary` draws the paragraph twice — `.tsum-g` is the finished line held
   hidden to keep the box open, `.tsum-t` is the visible copy laid over it. The
   visible one is BUILT UP a character at a time, so mid-type its copy of the
   phrase is half a word wide or not there at all; the ghost is complete from
   the first frame. So the card is positioned against the ghost and clicked on
   the live copy, which is the one on top and the only one that can take a
   pointer (`visibility:hidden` does not).

   IT DOES NOT CALL `render()` — §65's lesson. `render()` replaces
   `device.innerHTML` and resets the scroller, and this pass is also what the
   click handler calls, so opening a card two thirds down a scrolled page would
   throw the reader back to the top. The card is added and removed on its own;
   `S.sumDrop` is what survives the next real render.

   THE POSITION IS INLINE STYLE AND THAT IS NOT TRAP 1. Trap 1 is about DESIGN
   declarations losing to inline styles no stylesheet can answer; these two are
   measured pixels that only exist at runtime, which is the one thing inline
   style is for. Everything about how the card LOOKS is in §70.8. */
function placeSumDrop(){
  /* `:not(.sd-flat)` — the floating popover is a `.sumdrop` this pass appends and
     removes; the quiz MODAL (`quizModal`) reuses `.sumdrop` for its typography and
     carries `.sd-flat`, and it is part of the base render's own HTML, so this
     cleanup must leave it alone or the modal body empties on the next tick
     (Maryam, 1 Oct 2026). */
  device.querySelectorAll('.sumdrop:not(.sd-flat)').forEach(n => n.remove());
  /* the open phrase is marked in BOTH copies — the live one because that is
     what the reader sees, the ghost because it is the one holding the box and
     a class that changes its metrics would shift the line under the other */
  device.querySelectorAll('[data-sum].on').forEach(n => n.classList.remove('on'));
  if(!S.sumDrop) return;
  device.querySelectorAll(`[data-sum="${S.sumDrop}"]`).forEach(n => n.classList.add('on'));
  const body = device.querySelector('.modhead .ai-aura.talsum .ai-body');
  if(!body) return;
  const sel = `[data-sum="${S.sumDrop}"]`;
  const anchor = body.querySelector('.tsum-g ' + sel) || body.querySelector(sel);
  if(!anchor){ S.sumDrop = null; return; }

  const card = document.createElement('div');
  card.className = 'sumdrop';
  card.innerHTML = sumDropCard(S.sumDrop);
  body.appendChild(card);

  /* clamped to the paragraph's own box so a phrase near the right edge does not
     push the card off the panel — the file has it left-aligned under the
     phrase, and that is what this is until there is no room for it */
  const bb = body.getBoundingClientRect(), ab = anchor.getBoundingClientRect();
  const max = Math.max(0, body.offsetWidth - card.offsetWidth);
  card.style.left = Math.round(Math.max(0, Math.min(ab.left - bb.left, max))) + 'px';
  card.style.top  = Math.round(ab.bottom - bb.top + 8) + 'px';
}

const _baseDrop = render;
render = function(){
  _baseDrop();
  try { placeSumDrop(); } catch(e){ console.warn('sumdrop', e); }
};

/* Toggle, click away, Escape. All three go through the pass rather than a
   render, for the reason written over it. */
device.addEventListener('click', e => {
  const b = e.target.closest('[data-sum]');
  if(b){
    S.sumDrop = S.sumDrop === b.dataset.sum ? null : b.dataset.sum;
    placeSumDrop();
    return;
  }
  /* a control inside the card is doing its own job — `data-go` navigates, and
     the render that follows clears the card anyway */
  if(S.sumDrop && !e.target.closest('.sumdrop')){ S.sumDrop = null; placeSumDrop(); }
});
document.addEventListener('keydown', e => {
  if(e.key === 'Escape' && S.sumDrop){ S.sumDrop = null; placeSumDrop(); }
});

/* the boot render is the last statement in views.js and ran long before this
   file was parsed, so this pass has to draw the first paint itself */
render();
