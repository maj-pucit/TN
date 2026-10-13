/* ==========================================================================
   TAL'S SCOPE — WHAT THE CANDIDATE'S ASSISTANT ANSWERS, AND WHAT IT HANDS ON

   Every earlier `ai*.js` pass added a CAPABILITY: ai.js searches the
   interview transcripts, ai2.js writes drafts and shows its own memory,
   ai3.js plays the other person in a roleplay, ai7.js books an interview.
   This file adds no capability. It draws the EDGE — the line between what
   Tal answers and what a person has to answer — and it makes the far side of
   that line a real reply rather than a shrug.

   THE SIX THINGS TAL IS FOR. A candidate asks about one of six subjects, and
   this is the whole of it:

     1. The course      the 13 chapters, what is in one, the two hours a week,
                        where you are behind, what the assessment measured.
     2. Your level      the Explorer track, what E3 means, what moves you up,
                        the re-interview at day 91, what is on your report.
     3. Your interviews booking one, preparing for one, practising against the
                        scenarios from one, and searching the transcript of
                        one you have already done.
     4. Your cohort     the Thursday call, the board, who leads it, where you
                        sit against the other nine.
     5. The money       what a fee is for, what the course fee covers, the two
                        refund windows, where the receipts are. Tal states the
                        POLICY and never the LEDGER — see `wLedger`.
     6. Tal itself      what it holds about you, where each line came from,
                        and how to correct it or switch it off.

   THE THREE THINGS IT DOES NOT DO, each with its own kind of answer, because
   "I cannot help" is three different sentences:

     a. A HUMAN DECISION — a refund, a disputed charge, a closed account, a
        level appeal, a date that has to move. Tal states the rule that
        applies and then hands over, because the rule is knowable and the
        decision is not. `wSupport` is that handover.
     b. SOMETHING IT CANNOT SEE — the billing ledger, the one-to-one thread
        with Priya, anything said on a cohort call. This is not modesty: it
        is the `NEVER` list on What Tal knows (ai2.js) and clause 4 of the
        Data use notice, and an answer that contradicts either of those is
        the worst kind of wrong answer, because the product says so on two
        other screens.
     c. NOT THE PRODUCT AT ALL — a salary, a job, an opinion about your boss,
        the answers to an assessment. One honest sentence and the way back.
        No support number: offering a helpdesk for "tell me a joke" is the
        same failure as inventing an answer, one politeness further on.

   AND THE RULE THAT MADE THIS FILE NECESSARY: TAL NEVER GUESSES. Before this
   pass, 50 of 111 plausible candidate questions fell through the router to
   "I can help with your course, your level, the cohort call and your points"
   — including four chips the product itself was printing — and a dozen more
   matched a broad route and came back CONFIDENTLY WRONG, which is worse.
   "Who leads this cohort?" answered with Thursday's agenda. "What does the
   rank number mean?" answered with Priya's note on how cautiously you talk.
   "Can I stop you reading my notes?" offered to write a reflection. Those
   are not gaps, they are a product asserting things about itself that are
   not true, and every one of them is fixed here by a narrower route landing
   in front of the broad one.

   HOW THE ORDER WORKS, AND WHY THIS FILE IS LAST. `talReply` (views.js) walks
   `TAL_ROUTES` and the FIRST match wins. Every pass `unshift`s, so the file
   parsed last is tried first — which is exactly what a correction needs. The
   broad routes in data.js are not edited: they stay as the general case and
   this file states the specific ones in front of them. Nothing here competes
   with ai7's `BK_ASK`: booking is checked immediately after this block, and
   every regex below that mentions an agent requires a comparison or a price
   word, never a bare "which agent".

   A ROUTE MAY DECLINE. `talReply` is wrapped at the foot of this file so that
   a route returning `''` — or throwing — lands on `talNoAnswer` rather than
   on the next route or on a blank bubble. So `return ''` means "I am the
   right route and I have nothing", which is a different statement from "I am
   not the right route", and only the first is expressible.
   ========================================================================== */

/* --------------------------------------------------------------------------
   ONE PLACE FOR THE CONTACT DETAILS
   Written once because they appear in a dozen answers, and because the day
   they change they change in one edit. The email matches the only other
   address the product prints — `hello@talentnext.com` on the verify screen —
   and the number is the house placeholder used by the run-up screens and the
   two earlier prototypes.
   -------------------------------------------------------------------------- */
const SUPPORT = {
  email: 'support@talentnext.com',
  phone: '(555) 123-4567',
  hours: 'Mon&ndash;Fri, 9:00 AM &ndash; 6:00 PM',
  reply: 'One working day'
};

/* --------------------------------------------------------------------------
   THE QUESTION ITSELF, WHICH A ROUTE IS NOT GIVEN

   `talReply` is `for(const [m,fn] of TAL_ROUTES) if(m.test(q)) return fn()` —
   and that call takes NO ARGUMENT. Every route in every earlier pass is a
   closure over `S` and reads nothing from the question beyond the fact that
   it matched, so nobody had noticed: the regex is the whole of the parsing.

   Three routes here need the words. "What do chapters 4 and 12 cover?" has to
   read 4 and 12 out of the sentence, "compare Priya and Owen" has to know
   which two, and a broken-thing report has to tell a missing verification
   email from a video that will not play. Written as `(q) => q.match(...)`
   they threw on `undefined`, which the wrapper at the foot of this file
   swallowed into a support card — the failure mode this file exists to
   remove, arriving through the mechanism meant to prevent it.

   `TAL_Q` is set by that same wrapper, one statement before the router runs,
   so it is the question currently being answered. That is a smaller change
   than widening `talReply`'s call signature, and it does not ask the other
   six pass files to care.
   -------------------------------------------------------------------------- */
let TAL_Q = '';

/* --------------------------------------------------------------------------
   THE ONE THING TO COME AWAY WITH

   Every answer here is even in weight — a table, a note, two buttons — and an
   even answer is one a person skims. `hl` marks the single item in a reply
   that decides what they do next: a deadline, an amount, a refusal, the thing
   that is on them rather than on us.

   THE RULE IS ONE PER REPLY AND NEVER A CLAUSE. Two highlights in one answer
   is two answers; a highlighted sentence is a highlighted paragraph with
   extra steps, and both land back where they started — nothing standing out
   because everything does. One to three words.

   AND IT GOES IN PROSE, NOT IN A FIGURE TABLE. `.tw-lines b` is already the
   emphasis in a grid, and the accent inside a column of numbers reads as a
   data-series colour. See §39.12, which is where the type is drawn and where
   the contrast trade is written down.
   -------------------------------------------------------------------------- */
const hl = (s) => `<b class="tw-hl">${s}</b>`;

/* THE HANDOVER, AND IT NAMES WHAT TO SAY. A support card that gives an
   address and stops has moved the work rather than done it: the candidate
   still has to work out what their question even is. So `wSupport` takes the
   thing to ask for, prints it as the first line, and the address underneath.

   It is a `.tw`, not a `.gen`. `.gen` is the generated-answer shell — it
   carries `talLabel()` and a source line, and it says "I worked this out from
   something". This is the opposite of that: it is the one card on which Tal
   is not the author. It also bleeds to the column edge on `--pad-x`, which is
   trap 10, and `.tw` never does. */
/* FOUR ROWS IN ONE GRID, and the first of them is the instruction. It was a
   `.tw-list` of a single item above the addresses — a bulleted list of one,
   which reads as a list that lost the rest of itself, and the 5px mark sits
   above the cap height so it pulls the eye before the words do. "Ask for" is
   a label like "Email" and "Phone" are labels: what you want, then where to
   send it. One primitive, one grid, and the row that matters is at the top of
   it rather than beside a dot. */
function wSupport(askFor){
  return tw(twIc('helpDesk','acc') + 'TalentNext support',
    `<span class="tw-lines">
       <span><b>Ask for</b>${askFor}</span>
       <span><b>Email</b>${SUPPORT.email}</span>
       <span><b>Phone</b>${SUPPORT.phone}</span>
       <span><b>Hours</b>${SUPPORT.hours}</span>
     </span>
     <span class="tw-k">They answer inside one working day. ${supportCohortLine()}</span>`);
}
/* THE COHORT LINE FOLLOWS THE READER (doc §7). A candidate-leader runs one
   cohort at a time (14 Sep 2026), so "Quote your cohort number, Cohort 41" is
   now literally right for the leader too; the list still pluralises so a
   moderator leading several gets every id. A candidate keeps the one they are
   in. */
function supportCohortLine(){
  if(typeof isLead === 'function' && isLead() && typeof LEAD_COHORTS !== 'undefined'){
    const ids = LEAD_COHORTS.map(c => c.id);
    const list = ids.length > 1
      ? ids.slice(0, -1).join(', ') + ' and ' + ids[ids.length - 1]
      : String(ids[0]);
    return `Say you lead Cohort${ids.length > 1 ? 's' : ''} ${list}.`;
  }
  return 'Quote your cohort number, Cohort 41.';
}

/* THE LAST RESORT, AND IT IS ALLOWED TO BE SHORT. Three sentences: I do not
   have it, here is who does, here is what I do have. The third is not filler
   — a dead end with no way out is how somebody decides the assistant is
   decorative, and the chips are the way out. They come from `TALCTX` so they
   are the questions for the page the person is actually on. */
/* >>> AND THE GATE GETS NO CHIPS — Maryam, 4 Sep 2026: "in the i dont have an
   answer response, remove the chips."

   THE ARGUMENT ABOVE STILL HOLDS EVERYWHERE ELSE, WHICH IS WHY THIS IS A
   BRANCH AND NOT A DELETION. On the ask page the chips genuinely are the way
   out of a dead end — that surface has a thread, a dock and no other prompt,
   and `TALCTX` makes them the questions for the page the reader is on.

   ON THE ONBOARDING THEY ARE THE WRONG OFFER TWICE OVER. That screen is a
   five-question flow with its OWN live options 100px above and a composer
   directly below, so "here is what I can answer" competes with the question
   Tal has just asked — three chips about the dashboard, on a stage the reader
   has not reached. The way out is the panel they were already looking at.

   THE LEAD-IN SENTENCE GOES WITH THEM. "Here is what I can answer from where
   you are" is the chips' own introduction; kept without them it promises a
   list that never arrives, which is the "gate nothing writes" tell in copy. */
function talNoAnswer(){
  const bare = S.stage === 'onboard';
  const ctx = (isLead() && typeof LEAD_TAL !== 'undefined' ? LEAD_TAL.ctx : TALCTX);
  const set = ctx[S.view] || ctx[isLead() ? 'leadDash' : 'dashboard'];
  return `I ${hl('do not have an answer')} for that one, and I would rather say so than guess at it. Anyone on the support desk can pick it up.`
    + wSupport('this question, worded exactly as you asked me. They will have your account open')
    + (bare ? '' : `<span class="tw-k">Here is what I can answer from where you are.</span>`
        + twChips(set));
}

/* NOT EVERYTHING IS A SUPPORT TICKET. `talOff` is the reply for a question
   that is not about TalentNext at all — a salary, a job, an opinion. It
   states the boundary in one sentence, offers the nearest thing inside it,
   and gives no phone number, because the support desk cannot help with your
   boss either and pretending otherwise is just a longer refusal. */
function talOff(sentence, near){
  return sentence + (near ? twChips(near) : '');
}

/* --------------------------------------------------------------------------
   THE SCOPE, AS AN ANSWER RATHER THAN AS A COMMENT

   "What can you help me with?" is not a nice-to-have: views.js maps the Meet
   Tal card on the dashboard straight to it, and prints it as one of that
   card's two suggested questions — so the product asks Tal this on the
   candidate's behalf, on the first screen, and until now it had no route and
   landed on a capability list. The one question Tal has to answer perfectly
   is the one about itself.

   FIVE ROWS AND A SIXTH LINE THAT IS THE POINT. The rows are what it does;
   the closing line is what it does not, and it is there because an assistant
   that lists only its powers is the reason people stop trusting the answers.
   Naming the edge in the same breath is what makes the five credible.

   It is stage-aware in one place only — the row about the course reads
   differently to somebody who has not enrolled — because a list of five
   things where two do not apply yet is a list somebody has to filter. */
function wScope(){
  if(isLead()) return `I read your side of the product: your cohorts and where each person is, your sessions, your evaluations and the reports. I can tell you who needs attention and why, and draft a note or a brief for you. Nothing I write is sent until you send it.`
    + twChips((typeof LEAD_TAL !== 'undefined' && LEAD_TAL.ctx.leadDash) || ['How are my cohorts doing?']);
  const f = cfg(S.stage);
  const on = f.enrolled || f.complete;
  return tw(twIc('ai') + 'What I can do',
    `<span class="tw-lines">
       <span><b>Course</b>${on
         ? 'what is in a chapter, what your assessments measured, where you are against the other nine, and what to do this week'
         : 'what the 90 days are, what they ask of you each week, and what they cost'}</span>
       <span><b>Level</b>the Explorer track, what ${f.pred ? 'the interview decides' : f.level + ' means'}, and what would move you up</span>
       <span><b>Interviews</b>book one, prepare for one, practise against the real scenarios from yours, and search the transcript of one you have done</span>
       <span><b>Cohort</b>the Thursday call, who leads it, and the board</span>
       <span><b>Me</b>everything I hold about you, where each line came from, and how to correct it or switch me off</span>
     </span>
     <span class="tw-k">What I will not do is ${hl('guess')}. I cannot see your payments, your one-to-one messages with Priya, or anything said on a cohort call, and where I do not have an answer I will say so and give you the support desk rather than invent one.</span>`,
    `${twBtn('See what I hold about you','mem')}<button class="tw-btn ghost" data-ask="1">What should I do next?</button>`);
}

/* CANDIDATE-ONLY ROUTES. The router is shared with the cohort leader — one
   `TAL_ROUTES`, both portals — and most of what follows is written for
   somebody who is ON a course rather than running one. A leader has no fee,
   no level and no chapter of their own, and the leader portal shows no money
   anywhere by design, so wrapping those routes is what stops Tal quoting a
   course fee to the volunteer teaching it. */
const leadNA = (what) => `That is a candidate question: ${what} is not part of the cohort-leader role. I can read your cohorts, your sessions and your evaluations.`
  + twChips((typeof LEAD_TAL !== 'undefined' && LEAD_TAL.ctx.leadDash) || ['How are my cohorts doing?']);
const cand = (re, fn, what) => [re, () => isLead() ? leadNA(what) : fn()];

/* --------------------------------------------------------------------------
   THE MONEY, IN FOUR WIDGETS AND ONE REFUSAL

   Every figure below is read off a page rather than invented: the fee, the
   credit and the total come from `V.enrol` and `V.payment`, the two refund
   windows are the legal lines on `V.booking` and `V.payment`, and the agent
   prices come from `AGENTS`. If one of those changes, this changes with it or
   it is wrong — that is the cost of Tal knowing the number at all, and it is
   worth paying, because "what does this cost" is the question a person asks
   before they will read anything else.
   -------------------------------------------------------------------------- */

/* WHAT IT COSTS, ALL OF IT, INCLUDING THE PART THAT IS ALREADY SPENT. The
   candidate's mental model is one number, and the product charges twice — an
   interview and then a course, with the first credited against the second.
   Stating the lines in the order the money moves keeps the one number honest.
   THE FIRST INTERVIEW IS COMPLIMENTARY NOW (`IV_FIRST_FREE`), so there is no $95
   to credit and the course is $690 in full; the re-interview after day 90 is
   charged at the agent's own fee (8 Oct 2026, every figure re-checked). */
function wCost(){
  return tw(twIc('wallet','acc') + 'What the 90 days cost',
    `<span class="tw-lines">
       <span><b>Free</b>your first interview, the one that sets your level</span>
       <span><b>$690</b>the Explorer &ndash; E3 course, due when you enroll</span>
       <span><b>Agent&rsquo;s fee</b>the re-interview after day 90, if you take it</span>
     </span>
     <span class="tw-k">${hl('One payment')} for the course. Nothing recurs. The re-interview is paid when you book it, at the agent&rsquo;s own fee: $80 to $110 across the twenty-four.</span>`,
    twBtn('Open Enroll','enrol'));
}

/* THE RE-INTERVIEW IS THE ONE PEOPLE ASSUME IS EXTRA, because the first one
   was. Its own route, because folding it into `wCost` buried the answer in
   the fourth line of a table. */
function wReCost(){
  return `The re-interview is ${hl('charged at the agent&rsquo;s own fee')}, paid when you book it. Your first interview was complimentary; the one after day 90 that decides whether you move up is not part of the $690 course fee. With Priya it is $95.`
    + twChips(['What happens at the re-interview?','What would move me to E4?']);
}

/* TWO WINDOWS, AND THEY ARE NOT THE SAME WINDOW. Conflating them is the
   expensive mistake: an interview is refundable on a 24-hour clock and a
   course on a 7-day-and-one-chapter clock, and a candidate who reads the
   first as covering the second finds out on day 12. Both are quoted from the
   pages that carry them, so this cannot drift from the legal line. */
function wRefund(){
  return tw(twIc('time','acc') + 'The two refund windows',
    `<span class="tw-lines">
       <span><b>Interview</b>free to move or cancel up to 24 hours before. Inside 24 hours the fee is not refundable.</span>
       <span><b>Course</b>full refund up to 7 days after your cohort starts, as long as you have not finished more than one chapter.</span>
     </span>
     <span class="tw-k">Both are decided by ${hl('the support desk')}, not by me. I can tell you which window you are in, and they are the ones who action it.</span>`)
    + wSupport('a refund, and say which of the two windows it falls in');
}

/* NO, AND THE HONEST VERSION OF NO. `V.payment` says card details go to the
   processor and TalentNext never stores them; `V.billing` then lists saved
   cards by brand and last four. Both are true and together they read as a
   contradiction, so the answer is the reconciliation: the processor holds the
   card, we hold the four digits that let you point at it again. Saying only
   the first half is what makes the Payments page look like a lie. */
function wCard(){
  return tw(twIc('shield') + 'Where your card actually is',
    `<span class="tw-list">
       <span>The number goes straight to our payment processor. It never reaches a TalentNext server.</span>
       <span>We keep the brand and the last four digits, so a saved card is something you can recognise and choose again, not something we could charge on our own.</span>
       ${''/* THE CAP CAME OFF THE PRODUCT, SO IT CAME OFF THIS ANSWER (2 Sep
              2026). This read "Three saved cards is the maximum, and you can
              remove any of them from Payments" — and `V.billing` no longer
              hides "Add a card" at three or states a limit, so the sentence
              was Tal asserting a rule the page had stopped having. That is the
              exact failure this file's own note warns about: "do not restate a
              number here that a page owns; read it, or the two drift."
              What is left is the half that is still the page's: you can take
              any of them off, there. */}
       <span>You can add another or remove any of them from Payments.</span>
     </span>
     <span class="tw-k">I ${hl('cannot see')} any of it. Card details are on the list of things I have never been shown.</span>`,
    twBtn('Open Payments','billing'));
}

/* THE REFUSAL, AND IT IS THE MOST IMPORTANT ANSWER IN THIS FILE.

   `TALCTX.billing` used to offer "What have I paid so far?" and "Can I get a
   receipt?" — two chips Tal is not permitted to answer. `NEVER` in ai2.js
   says "Your card details and billing history" is something Tal has never
   seen, and clause 4 of the Data use notice says Tal cannot see payment
   details. An assistant that produces a ledger anyway has just made two
   other screens into lies, and the candidate has no way to tell which of the
   three to believe.

   So Tal declines, says why in the product's own words, and points at the
   page where the answer is already sitting with a Receipt button on every
   row. That is not a worse answer than a table. It is the same information,
   one tap away, from the surface that is allowed to hold it. */
function wLedger(){
  return tw(twIc('receipt') + 'Your payments, and why I am not reading them',
    `<span class="tw-list">
       <span>Payments has every charge with its date, the card it went to, and a Receipt button on each row.</span>
       <span>Billing is on the short list of things I have never been shown, along with your messages with Priya and anything said on a cohort call.</span>
     </span>
     <span class="tw-k">So I ${hl('cannot tell you the figure')}. The page can, and it is the same tap as asking me.</span>`,
    `${twBtn('Open Payments','billing')}<button class="tw-btn ghost" data-go="mem">See what I do hold</button>`);
}

/* A WRONG CHARGE IS NOT A QUESTION. It is an incident, and the only useful
   reply is the fastest route to somebody who can reverse it — with the two
   things they will ask for named up front, because a second email asking for
   the date and the last four digits costs another day. */
function wBillingProblem(){
  return `That one ${hl('needs a person')}, and quickly. I cannot see charges and I cannot reverse one, so there is nothing I can check first that would save you the message.`
    + wSupport('a charge to be checked. Give them the amount, the date and the last four digits, and attach the receipt from Payments')
    + twChips(['What is the refund window?','Is my card stored?']);
}

/* --------------------------------------------------------------------------
   THE COURSE
   -------------------------------------------------------------------------- */

/* THE 90 DAYS AS A SHAPE, NOT AS A LIST OF FEATURES. Four dates, in order,
   with the thing that happens on each. It is the single most-asked question
   on the dashboard and it had no route at all. */
function wCycle(){
  return tw(twIc('calendar') + 'How the 90 days run',
    `<span class="tw-lines">
       <span><b>Day 1</b>your cohort of ten starts together, all at the same level</span>
       <span><b>Weekly</b>one chapter, its assessment, and a 60-minute call on Thursday</span>
       <span><b>Day 90</b>13 chapters done, and your 90-day summary written</span>
       <span><b>Day 91</b>the re-interview: you move up, hold, or drop back</span>
     </span>
     <span class="tw-k">About ${hl('two hours a week')}. The cohort is fixed for the whole 90 days and your leader is a volunteer who has already done the level above yours.</span>`,
    twBtn('See the 13 chapters','coursework'));
}

/* WHAT YOU LEAVE WITH. Asked constantly and answered nowhere, and the honest
   answer is two things rather than one: the level is the outcome and the
   summary is the artefact. Note what it does NOT claim — no certificate is
   named, because the candidate side of the product does not issue one; the
   cohort-leader certification is a different thing, earned by leading. */
function wEnd(){
  return tw(twIc('certificate') + 'What you have at the end',
    `<span class="tw-list">
       <span>A confirmed level, decided at the re-interview and signed by an agent.</span>
       <span>Your 90-day summary: the signed record of the 13 chapters, your assessment scores and what your leader wrote. It is yours to read and to share.</span>
       <span>Everything you earned along the way: your points, your badges and your rank stay on the account.</span>
     </span>
     <span class="tw-k">Deleting your account later ${hl('does not')} take a signed summary off you.</span>`,
    twBtn('Open course progress','transcript'));
}

/* WHAT THE 90-DAY SUMMARY IS. Its own route because `V.transcript` calls it a
   signed artefact and nothing anywhere says what is in it. */
function wSummary(){
  const f = cfg(S.stage);
  return tw(twIc('document') + 'What is in the 90-day summary',
    `<span class="tw-list">
       <span>Every chapter you finished and what it was assessed at.</span>
       <span>The growth areas from your level interview, and whether the 90 days moved them.</span>
       <span>What your cohort leader wrote, and their recommendation: move up, hold, or drop back.</span>
     </span>
     <span class="tw-k">${f.complete
        ? 'Yours was signed by Priya on November 21. It is what your re-interview was assessed against.'
        : f.finished
          ? 'Yours is written. Priya signs it once you book the re-interview, and whoever you pick reads it before the call.'
          : 'Yours is being assembled as you go. It is signed at day 90.'}</span>`,
    twBtn('Open course progress','transcript'));
}

/* ANY CHAPTER, FROM THE DATA. data.js answers chapters 1 and 4 in prose and
   the other eleven not at all, which is what left "What do chapters 4 and 12
   cover?" — a chip the report page prints — falling through to the generic
   reply. This reads `CH`, `SCORE`, `GROWTH` and `OPEN_DATES`, so it answers
   all thirteen and cannot disagree with the chapter list.

   The pair form exists because the chip asks about two, and because the two
   it asks about are two of the three growth areas — which is the actual
   answer to why a report is pointing at them. */
function wChapterAny(nums){
  const f = cfg(S.stage);
  const list = nums.filter(n => n >= 1 && n <= 13);
  if(!list.length) return '';
  /* A `.tw-list`, NOT a `.tw-lines`. The label column is a fixed 58px
     (§03.378) and it earns that on a figure — "$690", "88%", "Day 34" — where
     a column of them is a column you read down. A chapter NUMBER is one
     character: the same column left 50px of white beside a "4" and wrapped
     the name and its state into what was left of the row. Here the number
     goes in the line, bolded, and the row runs the full width. */
  const rows = list.map(n => {
    const i = n - 1, name = CH[i][0], mins = CH[i][1];
    const state = i < f.done ? `finished, assessed ${SCORE[i]}%`
      : (i === f.open && f.enrolled) ? 'open now'
      : (OPEN_DATES[i] && f.week < i) ? 'opens ' + OPEN_DATES[i]
      : 'not started';
    return `<span><b>Chapter ${n} &middot; ${name}</b><br>${mins} min &middot; ${state}${GROWTH.includes(i) ? ' &middot; your growth area' : ''}</span>`;
  }).join('');
  const growth = list.filter(n => GROWTH.includes(n - 1));
  return tw(twIc('book') + (list.length > 1 ? 'The chapters you asked about' : 'Chapter ' + list[0]),
    `<span class="tw-list">${rows}</span>
     ${growth.length ? `<span class="tw-k">${growth.length === list.length && list.length > 1
        ? 'Both are growth areas from your report, which is why they are named together.'
        : 'Chapter ' + growth.join(' and ') + ' is a growth area from your report.'} Extra time there moves your level more than extra time anywhere else.</span>` : ''}`,
    twBtn(list.length > 1 ? 'Open Coursework' : 'Open chapter ' + list[0],
          list.length > 1 ? 'coursework' : 'chapter:' + (list[0] - 1)));
}

/* THE LOWEST SCORE, COMPUTED. "Which chapter dragged my average down?" is a
   question with one correct answer and it was falling through. Reading it out
   of `SCORE` rather than writing "chapter 4" means it survives a change to
   the scores, and it refuses honestly before there is anything to average. */
function wLowest(){
  const f = cfg(S.stage);
  if(!f.done) return `Nothing is assessed yet, so there is no average to drag down. Your first score lands when you finish chapter 1.`
    + twChips(['What should I do next?','How are chapters assessed?']);
  const done = SCORE.slice(0, f.done);
  const lo = Math.min(...done), i = done.indexOf(lo);
  return tw(twIc('chart') + 'Your lowest assessment',
    `<span class="tw-lines">
       <span><b>${lo}%</b>chapter ${i + 1}, ${CH[i][0]}</span>
       <span><b>${f.avg}%</b>your average across ${f.done} assessed</span>
       <span><b>79%</b>the cohort average</span>
     </span>
     <span class="tw-k">${lo}% is below the cohort average and well below your own, so it is the one with the most left in it${GROWTH.includes(i) ? ', and your report names it as a growth area' : ''}. Finishing it properly is worth more than any other hour this week.</span>`,
    twBtn('Open chapter ' + (i + 1), 'chapter:' + i));
}

/* WHERE YOU ARE, ONE HONEST PARAGRAPH. Three numbers only, because a status
   answer that lists nine is a report and the person asked a question. */
function wStanding(){
  const f = cfg(S.stage);
  if(!f.enrolled && !f.complete) return `You are not on a course yet, so there is nothing to be doing well or badly at. What is decided so far is your track (Explorer, from the quiz) and the next thing that moves is your level.`
    + twChips(['What should I do next?','How does the ladder work?']);
  return tw(twIc('growth') + 'Where you are',
    `<span class="tw-lines">
       <span><b>${f.done} of 13</b>chapters finished</span>
       <span><b>${f.avg ? f.avg + '%' : '&mdash;'}</b>${f.avg ? 'your average, against a cohort average of 79%' : 'nothing assessed yet'}</span>
       <span><b>Day ${f.day}</b>of 90, week ${f.week} of 13</span>
     </span>
     <span class="tw-k">${f.complete
        ? 'All 13 done and the re-interview signed. You moved to E4 on November 21.'
        : f.finished
          ? 'All 13 done, above the cohort average on every one. The re-interview is the only thing left.'
          : f.avg
            ? 'Comfortably above the cohort on the work you have finished. Pace is the open question, not quality.'
            : 'Too early to say anything about scores. Nothing this week is assessed.'}</span>`,
    twBtn('Open course progress','transcript'));
}

/* HOW FAR BEHIND, AND THE PRODUCT ALREADY HAD THE SENTENCE. `WEEKLY[stage].tal`
   is the comparison the dashboard's week card prints — the three furthest
   ahead in Cohort 41, and what stands between you and their pace. Tal saying
   something DIFFERENT here would put a fourth number on a screen that already
   has three, so it quotes the card rather than recomputing it. */
function wPace(){
  const f = cfg(S.stage);
  const w = WEEKLY[S.stage];
  if(!f.enrolled) return `There is no pace to be behind yet. The 90 days start when your cohort does.`
    + twChips(['What should I do next?','Explain the 90-day cycle']);
  if(f.finished || f.complete) return `You are not behind. All 13 chapters are done and the 90 days are finished. What is outstanding is the re-interview, and that is a booking rather than a backlog.`
    + twChips(['What happens at the re-interview?','What is in the 90-day summary?']);
  if(!w) return '';
  return tw(twIc('time','acc') + 'Against your cohort',
    `<span class="tw-lede">${w.tal}</span>`,
    `${twBtn('Open Coursework','coursework')}<button class="tw-btn ghost" data-ask="1">${w.ask[0]}</button>`);
}

/* THE ONE THING TO DO NEXT, PER STAGE. Every stage has exactly one, and
   naming two is how "what should I do next" becomes a to-do list nobody
   reads. Keyed rather than derived because the answer is a JUDGEMENT about
   which of several open things matters most, and `cfg()` carries flags, not
   priorities — see the note over `WEEKLY` in data.js for the same argument. */
const NEXT = {
  consult:  ['Nothing, and that is the point', 'Your call with Jordan Blake is Thursday, August 13 at 2:00 PM. Fifteen minutes, nothing assessed, nothing to prepare. He points you at the agents whose range fits, and you book after that.', 'What happens on the consultant call?', 'interviews'],
  new:      ['Book the interview that sets your level', 'Your quiz put you on the Explorer track, and that is a title rather than a level. Forty-five minutes with an agent is what turns it into E1 to E5, and the course you can enroll on follows from it.', 'Book an interview with a top agent', 'agents'],
  booked:   ['Spend ten minutes preparing', 'Priya Nair, Thursday 20 August, 6:30 PM. She opens with a situation from your own answers, so the useful preparation is one story you can actually tell, not revision. I can run it with you now.', 'Run a mock interview with me', 'interviews'],
  /* THE RESCHEDULE FORK — `booked`'s row, copied. See its STAGES row. */
  resched:  ['Spend ten minutes preparing', 'Priya Nair, Thursday 20 August, 6:30 PM. She opens with a situation from your own answers, so the useful preparation is one story you can actually tell, not revision. I can run it with you now.', 'Run a mock interview with me', 'interviews'],
  assessed: ['Enroll in the Explorer &ndash; E3 course', 'Your report is signed and E3 is confirmed. The cohort is assigned for you and the 90 days start when it does. The course is $690.', 'What do the 90 days ask of me?', 'enrol'],
  week1:    ['Finish chapter 1', 'Forty-five minutes, and nothing this week is assessed. Four of the ten in Cohort 41 have already done it, so the only thing between you and their pace is the chapter itself.', 'What is next week about?', 'coursework'],
  day34:    ['Finish chapter 4', 'You are 12 minutes into it after four opens, it is 70 minutes long, and it is the growth area Priya named in your report. It is the one place extra time changes your level rather than your average.', 'How do I catch up?', 'chapter:3'],
  day90:    ['Book the re-interview', 'All 13 chapters are done at 83% and your 90-day summary is written. Priya signs it once the re-interview is booked, and whoever you pick reads it before the call. There is nothing further to pay.', 'What happens at the re-interview?', 'interviews'],
  promoted: ['Enroll in the E4 course', 'You moved up on November 21. The next 90 days are built for E4, and your returning-candidate credit comes off the fee.', 'What is different about E4?', 'enrol'],
  /* THE RED ACCENT DEMO — day 34's row, copied. See `RED_DEMO` in data.js. */
  reddemo:  ['Finish chapter 4', 'You are 12 minutes into it after four opens, it is 70 minutes long, and it is the growth area Priya named in your report. It is the one place extra time changes your level rather than your average.', 'How do I catch up?', 'chapter:3']
};

function wNext(){
  const n = NEXT[S.stage];
  if(!n) return '';
  const [title, body, chip, go] = n;
  /* `.tw-lede`, not a one-item `.tw-list` — see §39.3. The headline is the
     answer; a bullet beside it reads as a list whose other items are missing. */
  return tw(twIc('flag','acc') + 'Next',
    `<span class="tw-lede">${title}</span>
     <span class="tw-k">${body}</span>`,
    `${twBtn(go === 'enrol' ? 'Open Enroll' : go === 'agents' ? 'See the agents' : go === 'coursework' ? 'Open Coursework' : go === 'interviews' ? 'Open Interviews' : 'Open chapter 4', go)}<button class="tw-btn ghost" data-ask="1">${chip}</button>`);
}

/* WHAT WOULD MOVE ME UP, which is the chip on My Level and the question the
   whole product is about. It was missing by one word: data.js matches `move
   up` and the chip says "move me up", so it fell through to the capability
   list. `wLadder` answers HOW THE LADDER WORKS, generically; this answers what
   moves THIS person, and the difference is `GROWTH` — the two chapters Priya
   named in the report are the whole of the answer, and they are already on
   three other screens. */
function wMoveUp(){
  const f = cfg(S.stage);
  if(f.pred) return `Nothing yet, because you are not on the ladder. The quiz gave you a track and an interview gives you a level (E1 to E5) and until an agent has done that there is no rung to move off.`
    + twChips(['What happens in the 45 minutes?', 'How does the ladder work?']);
  if(f.complete) return `You moved on November 21. E5 is the top of the Explorer track and the next 90 days are what decide it; the shape is the same: the chapters, the leader&rsquo;s recommendation, the re-interview.`
    + twChips(['What is different about E4?', 'What is in the 90-day summary?']);
  return tw(twIc('growth','acc') + 'What moves you from ' + f.level + ' to E4',
    `<span class="tw-list">
       <span>The two growth areas Priya named in your report: <b>chapter 4, Delegation Without Drop-Off</b> and <b>chapter 5, Hard Conversations</b>. Those are what she will re-test.</span>
       <span>Your cohort leader&rsquo;s recommendation at day 90, which is written from your weekly tasks and the calls, not from your average.</span>
       <span>The re-interview at day 91. It is the same 45 minutes and the same questions, and what is assessed is whether the answers changed.</span>
     </span>
     <span class="tw-k">${f.avg ? 'Your average is ' + f.avg + '% against a cohort average of 79%, so scores are not what is holding you. ' : ''}A high average with the growth areas untouched ${hl('holds you at ' + f.level)}.</span>`,
    `${twBtn('Open my level','level')}<button class="tw-btn ghost" data-go="report">Read the report</button>`);
}

/* WHEN IT ENDS, in days rather than in a date. The prototype has one calendar
   anchor for the end — November 21, the day Priya signed the re-interview
   decision — and it belongs to the `promoted` stage. Quoting a date at day 34
   would mean deriving one from `OPEN_DATES`, which stops at chapter 13's open
   and not at the end, so the honest unit here is the one the whole product
   counts in: day N of 90. */
function wFinish(){
  const f = cfg(S.stage);
  if(!f.enrolled && !f.complete) return `Ninety days from the day your cohort starts, and the cohort starts when it is full. The re-interview is day 91.`
    + twChips(['Explain the 90-day cycle', 'What should I do next?']);
  if(f.complete) return `It is finished. All 13 chapters, the summary signed on November 21, and the re-interview decided. You moved to E4. What is open now is the next course, not this one.`
    + twChips(['What is different about E4?', 'What do I have at the end?']);
  return tw(twIc('calendar') + 'What is left',
    `<span class="tw-lines">
       <span><b>Day ${f.day}</b>of 90, ${90 - f.day} days to go</span>
       <span><b>Week ${f.week}</b>of 13, ${13 - f.week} chapters still to open</span>
       <span><b>Day 91</b>the re-interview, which is the last thing in the course</span>
     </span>
     <span class="tw-k">Your cohort finishes together. The ten of you started on the same day and the calls stop on the same week.</span>`,
    twBtn('Open course progress','transcript'));
}

/* PAUSING, EXTENDING, LEAVING. All three are one answer, because all three
   are the same decision and it is not Tal's: the cohort is a fixed group of
   ten moving together, so a person cannot be quietly moved out of the middle
   of it. Tal says what the constraint IS — which is the part nobody explains
   — and then hands the exception to the two people who can grant one. */
function wPause(){
  return tw(twIc('pause') + 'Pausing, or moving cohort',
    `<span class="tw-list">
       <span>A cohort is a fixed ten moving together for 90 days, with one live call a week. There is no self-service pause, because pausing means leaving the group you are in.</span>
       <span>Your cohort leader can carry you through a bad fortnight. That is what the flag on their dashboard is for, and it clears itself when you come back.</span>
       <span>Anything longer than that is a transfer to a later cohort, and the support desk decides those case by case.</span>
     </span>
     <span class="tw-k">${hl('Tell your leader')} first. Most of what people ask a pause for, a leader can just absorb.</span>`,
    twBtn('Message your leader','messages'))
    + wSupport('a transfer to a later cohort, and say which weeks you would miss');
}

/* --------------------------------------------------------------------------
   THE INTERVIEW, AND THE THINGS PEOPLE ASK ONCE IT IS BOOKED
   -------------------------------------------------------------------------- */

/* MOVING IT. The 24-hour rule is the whole answer and it was unreachable:
   "Can I reschedule my interview?" matched data.js's broad interview route
   and came back with what an interview IS. */
function wMove(){
  return tw(twIc('renew') + 'Moving or cancelling an interview',
    `<span class="tw-lines">
       <span><b>Up to 24h</b>free to move to any of the agent&rsquo;s other slots, or to cancel for a full refund</span>
       <span><b>Inside 24h</b>you can still move it, but the fee is not refundable</span>
       <span><b>No-show</b>treated as inside 24 hours</span>
     </span>
     <span class="tw-k">Rescheduling is on the booking itself. It ${hl('does not need a person')}, and it does not go back to the start of the queue.</span>`,
    twBtn('Open Interviews','interviews'));
}

/* NO, AND THE REASON IS THE PRODUCT'S WHOLE ASSESSMENT MODEL. There is no
   question list to send, because the questions are generated from what you
   say in the first ten minutes. Answering this with "no" and nothing else
   sounds like a policy; answering it with the reason sounds like the truth,
   and it also happens to tell the person how to prepare. */
function wNoQuestions(){
  return `There is no list to send you, and that is deliberate rather than cagey. The agent opens on something from your own first few answers and follows it, so the second half of the interview is built out of the first half: ${hl('nobody')} has the questions in advance, including them.`
    + tw(twIc('checkOutline') + 'So preparation is three things, not revision',
      `<span class="tw-check">
         <span>One story where you handed work over and it went wrong</span>
         <span>What you would do differently, in one sentence</span>
         <span>One decision you changed after listening to someone</span>
       </span>`);
      /* the "Practise it with me" button opened candidate AI roleplay — removed
         9 Sep 2026; the prep list stands on its own. */
}

/* WHAT NOT TO DO. Four things, and each is a real failure mode from the
   transcripts this prototype already contains — hedging, tidying, arguing
   with the level, and answering in the abstract. Written as behaviour rather
   than as advice, because "be confident" is not actionable and "do not
   qualify the answer while you are giving it" is. */
function wNotDo(){
  return tw(twIc('warningAlt','acc') + 'The four that cost people most',
    `<span class="tw-list">
       <span>Do not qualify your answer while you are giving it. Say the thing, then say what you would change.</span>
       <span>Do not bring the story where you were right. Bring the one that went wrong. The judgement is in what you did next.</span>
       <span>Do not answer in the abstract. &ldquo;I would usually&rdquo; cannot be assessed; &ldquo;in March I&rdquo; can.</span>
       <span>Do not negotiate the level in the room. The report comes 24 hours later and there is a proper route to a review.</span>
     </span>
     <span class="tw-k">None of this is about polish. Priya assesses ${hl('judgement under pressure')} rather than vocabulary, and she says so on her profile.</span>`);
    /* the "Practise one" button opened candidate AI roleplay — removed 9 Sep
       2026; the list stands on its own. */
}

/* WHEN THE LEVEL LANDS. `wAgent` already promises a report inside 24 hours in
   a list item; the question deserves the sentence rather than the bullet,
   and it was matching the ladder route instead. */
function wWhenLevel(){
  return `${hl('Inside 24 hours')}. The agent writes the report after the call rather than during it, and your level appears on My Level the moment they sign it. There is no panel and no waiting list. If you disagree with what they set, you can ask for a review by a second agent.`
    + twChips(['What is on my report?','How do I ask for a review?']);
}

/* THE STAR NUMBER, WHICH IS NOT A RANK. The agents page shows four numbers
   per card — a rating, a level range, an interview count and a price — and
   people read the first as a league position. It is a rating from past
   candidates, and the ORDERING is a different thing entirely: the page says
   the shortlist is ordered by how their past candidates progressed. Both
   halves matter, because the useful conclusion is that neither number is a
   prediction about you. */
function wRank(){
  return tw(twIc('star') + 'The number on an agent card',
    `<span class="tw-lines">
       <span><b>4.8</b>the average score past candidates gave Priya after their interview, out of 5, across 210 of them</span>
       <span><b>E1&ndash;E3</b>the levels she is certified to assess, not the levels she tends to give</span>
       <span><b>210</b>interviews conducted</span>
     </span>
     <span class="tw-k">The shortlist itself is ordered by how each agent&rsquo;s past candidates went on to progress, which is a different measure from the rating. ${hl('Neither one predicts')} the level you will get. That comes out of your own 45 minutes.</span>`,
    twBtn('See the agents','agents'));
}

/* PRICE AND QUALITY, AND THE DATA SAYS NO. This is answerable from `AGENTS`
   without an opinion: the most expensive of the five has the lowest rating
   and the cheapest is mid-table, so the claim refutes itself. Worth a route
   because "does paying more get me a better level" is the question underneath
   it, and the answer to THAT one has to be an unambiguous no. */
function wPrice(){
  return tw(twIc('wallet') + 'What the price is and is not',
    `<span class="tw-lines">
       <span><b>$80</b>Lena Fischer &middot; 4.5 &middot; E1&ndash;E4</span>
       <span><b>$95</b>Priya Nair &middot; 4.8 &middot; E1&ndash;E3</span>
       <span><b>$110</b>Hana Kim &middot; 4.3 &middot; B1&ndash;B4</span>
     </span>
     <span class="tw-k">The dearest of the three is the lowest rated and the cheapest is not the worst, so price is not a quality ranking. It is the agent&rsquo;s own rate, and it tracks the level band they assess and how booked they are. It buys you a different person, ${hl('never a different level')}. The level comes out of the 45 minutes.</span>`,
    twBtn('Compare the agents','agents'));
}

/* TWO AGENTS, SIDE BY SIDE. "Compare Priya and Owen for me" is a chip the
   agents page prints, and it was matching ai.js's `IVT_COMPARE` — which
   compares your August and November INTERVIEWS. A question about two people
   answered with a diff of your own transcripts is the single most confusing
   wrong answer in the old set. Reads `AGENTS`, so it works for any pair. */
function wAgentPair(){
  const q = TAL_Q;
  const keys = Object.keys(AGENTS).filter(k => new RegExp('\\b' + k + '\\b|' + AGENTS[k].n.split(' ')[1], 'i').test(q));
  const pick = keys.length >= 2 ? keys.slice(0, 2) : ['priya', 'owen'];
  const [a, b] = pick.map(k => AGENTS[k]);
  return tw(null,
    `<span class="tw-ag">${avatar(a, 40)}<span><b>${a.n}</b><span class="tw-k">${a.range} &middot; ${a.r.toFixed(1)} &middot; ${a.ivs} interviews &middot; ${a.price}</span></span></span>
     <span class="tw-ag">${avatar(b, 40)}<span><b>${b.n}</b><span class="tw-k">${b.range} &middot; ${b.r.toFixed(1)} &middot; ${b.ivs} interviews &middot; ${b.price}</span></span></span>
     <span class="tw-list">
       <span>${a.n.split(' ')[0]} pushes hardest on how you decide under pressure and will tell you plainly where you are.</span>
       <span>${b.n.split(' ')[0]} works on incomplete information. Expect &ldquo;and then what happened&rdquo; more than once.</span>
     </span>
     <span class="tw-k">Both assess Explorer candidates and both report inside 24 hours. The difference you will feel is the register, not the standard.</span>`,
    twBtn('See both profiles','agents'));
}

/* --------------------------------------------------------------------------
   THE COHORT
   -------------------------------------------------------------------------- */

/* WHO RUNS IT, and this is the correction that mattered most. `/cohort/` in
   data.js is four rows from the bottom of the base list, so every question
   with the word "cohort" in it — who leads it, how big it is, when it
   finishes, how it is doing — came back with Thursday's agenda and a link to
   the board. Priya being both the agent and the leader is a fact of this
   prototype (views.js says so where it prints the app bar), and it is the
   first thing to say, because otherwise the two roles read as one. */
function wLeader(){
  const p = AGENTS.priya;
  return tw(null,
    `<span class="tw-ag">${avatar(p, 40)}<span><b>Priya Nair</b><span class="tw-k">Cohort leader, Cohort 41 &middot; leading since March 2024</span></span></span>
     <span class="tw-list">
       <span>She runs the Thursday call, reads your weekly tasks and writes the recommendation at day 90.</span>
       <span>She is also the agent who interviewed you and set your level at E3, the same person in two roles, which is common but not required.</span>
       <span>It is a ${hl('volunteer role')}. Cohort leaders are unpaid; what they earn is the cohort-leader certification.</span>
     </span>
     <span class="tw-k">She can only lead cohorts below her own level, so she is always a step ahead of the ten of you.</span>`,
    `${twBtn('Open Cohort 41','cohort')}<button class="tw-btn ghost" data-go="messages">Message her</button>`);
}

/* THE CALL, AS LOGISTICS RATHER THAN AS AN AGENDA. data.js's `wCall` answers
   "what is on Thursday". This answers the four that come after it — when, how
   long, what if I miss it, is it recorded — and the last one is load-bearing:
   the calls are NOT recorded, which is on Tal's own `NEVER` list and is the
   reason missing one cannot be fixed by watching it later. */
function wCallLogistics(){
  return tw(twIc('video') + 'The weekly call',
    `<span class="tw-lines">
       <span><b>When</b>Thursday, 6:00 PM, every week for 13 weeks</span>
       <span><b>Long</b>60 minutes, video, you and the other nine</span>
       <span><b>Missed</b>tell your leader beforehand and it is fine. It is not recorded, so there is nothing to catch up on afterwards. Ask on the board instead</span>
     </span>
     <span class="tw-k">Times follow the time zone on your profile. Reminders go out 24 hours and 1 hour before unless you have turned them off.</span>`,
    `${twBtn('Open Cohort 41','cohort')}<button class="tw-btn ghost" data-go="account">Change your time zone</button>`);
}

/* SWITCHING COHORT, which is a chip on the Enroll page and had no answer.
   Same constraint as `wPause` but a different moment — before you have paid,
   the answer is simply no, and the reason is that the group is the product.
   Kept separate so the pre-enrolment version does not open with advice about
   telling a leader you do not have yet. */
function wSwitch(){
  return `${hl('Not once it has started')}. Your cohort is ten people at the same level moving through the same 13 weeks together, and the group is a large part of what you are paying for, so it is assigned for you and it is fixed for the 90 days.`
    + tw('What can change',
      `<span class="tw-list">
         <span>Before your cohort starts, the support desk can move you to a later intake.</span>
         <span>Once it has started, a bad fortnight is something your leader absorbs rather than something you move cohort for.</span>
       </span>`)
    + twChips(['What is the refund window?','What happens on the weekly call?']);
}

/* --------------------------------------------------------------------------
   WHO SEES WHAT, AND WHAT TAL IS
   Every claim in these three is quoted from the Data use notice or from
   `NEVER` on What Tal knows. That is not laziness — it is the only way an
   assistant can answer a privacy question at all. An assistant that
   paraphrases its own privacy policy has written a second policy.
   -------------------------------------------------------------------------- */

/* WHO SEES YOUR REPORT AND YOUR RECORDING. Two of the four TALCTX privacy
   chips landed on the transcript-search route, which offered to look things
   up in the recording rather than saying who else can. */
function wSeen(){
  return tw(twIc('group') + 'Who sees your interview',
    `<span class="tw-list">
       <span>The agent who interviewed you, and the cohort leader who runs your course. Nobody else, unless you share your report yourself.</span>
       <span>Recordings are video and audio, transcribed so the agent can write the report, kept for 24 months and then deleted.</span>
       <span>You can ask for a specific recording to be deleted at any time. Deleting the recording behind a confirmed level does not reverse the level.</span>
       <span>Your weekly cohort calls are not recorded at all.</span>
     </span>
     <span class="tw-k">TalentNext ${hl('does not sell')} your data and does not share your individual progress with an employer without your written instruction.</span>`,
    twBtn('Read the data use notice','terms'));
}

/* WHAT TAL IS ALLOWED TO SEE, AND HOW TO STOP IT. "How do I turn you off?"
   is a chip on Profile and it had no route, which is a bad look for the
   assistant being asked. The `NEVER` list is printed rather than summarised
   so this answer and What Tal knows cannot drift apart. */
function wTalScope(){
  const live = (typeof MEMO !== 'undefined')
    ? MEMO.filter((m, i) => !(S.memDrop || []).includes(i)).length : 0;
  return tw(twIc('view') + 'What I can and cannot see',
    `<span class="tw-lines">
       <span><b>I see</b>your course progress, your chapter notes, your points, your interview transcripts and your report</span>
       <span><b>I never</b>${(typeof NEVER !== 'undefined' ? NEVER : []).map(n => n.replace(/\.$/, '')).join('; ') || 'see your messages, your calls or your card'}</span>
     </span>
     <span class="tw-k">${live} things are held about you right now and every one of them opens the thing it came from. Mark a line wrong and I stop using it; forget it and it is gone. Profile is where you pause me altogether. Nothing breaks, the pages just stop carrying my summaries.</span>`,
    `${twBtn('See everything I hold','mem')}<button class="tw-btn ghost" data-go="account">Open Profile</button>`);
}

/* CLOSING THE ACCOUNT, AND DOWNLOADING EVERYTHING. Not an action Tal takes —
   the control is on Profile behind a confirmation, which is where a
   destructive action belongs. Tal's job is to say exactly what goes and what
   survives, because that is the part people get wrong. */
function wClose(){
  return tw(twIc('warning') + 'Closing your account',
    `<span class="tw-list">
       <span>It removes your profile, your notes and your interview recordings.</span>
       <span>Certificates and signed summaries you have already earned stay valid and stay downloadable.</span>
       <span>Profile also holds &ldquo;download everything we hold&rdquo;, which is worth doing first.</span>
     </span>
     <span class="tw-k">The control is on Profile, under Closing your account, and it asks you to confirm. I ${hl('cannot do it for you')} and I would not want to be the one that could.</span>`,
    twBtn('Open Profile','account'));
}

/* --------------------------------------------------------------------------
   TROUBLE, AND THE THINGS THAT ARE NOT THE PRODUCT
   -------------------------------------------------------------------------- */

/* SOMETHING IS BROKEN. Tal cannot see a browser, a network or a video player,
   so the only honest structure is: the one thing that fixes most of these,
   then a person. Naming the verification sender is the exception — that IS a
   fix, and the product already prints it on the verify screen. */
function wBroken(){
  const q = TAL_Q;
  if(/verif|confirmation email|activation|did ?n.?t get the email|no email/i.test(q))
    return `Give it a minute and then look in your spam folder. The sender is hello@talentnext.com. If it is not there after five minutes, the address on the account is usually the reason, and support can check it and resend.`
    + wSupport('the verification email again, with the address you signed up with');
  if(/sign ?in|log ?in|password|locked out|cannot get in/i.test(q))
    return `I cannot see anything to do with signing in. I only exist once you are already inside. Reset the password from the log-in screen first; that clears most of these, and it does not touch your course record.`
    + wSupport('a password reset by hand, if the reset email does not arrive either. Give them the address you signed up with');
  return `That is not something I can see from in here. I have your course and your interviews, not your browser or the video player.`
    + tw(twIc('renew') + 'Worth trying once',
      `<span class="tw-list">
         <span>${hl('Reload the page')}. Coursework runs inside LightspeedVT, and it is usually the frame rather than the course.</span>
         <span>If it is the same on a second browser, it is our end, not yours.</span>
       </span>`)
    + wSupport('the page you were on, what you were doing and which browser. A screenshot saves a round trip');
}

/* THE ONE I WILL NOT ANSWER, and it should not be a lecture. Somebody asking
   for the assessment answers is usually behind rather than dishonest, so the
   reply declines in one clause and then offers the thing they actually
   needed. */
function wNoAnswers(){
  return talOff(`I ${hl('will not')} do that one. The assessment is what tells your leader where you are, and an answer I handed you tells them something false. It comes out of your level at the re-interview, not out of a mark.`
    + `<span class="tw-k">If it is the time rather than the material, say so and I will tell you the shortest honest route through this week.</span>`,
    ['How do I catch up?', 'Explain this chapter in 60 seconds', 'I am stuck, ask me a question instead']);
}

/* THE TWO CHAPTER PATTERNS ARE NAMED, because each is used twice — once as
   the route's test and once inside the handler to pull the numbers out. Two
   copies of a regex that must stay identical is a bug with a delay on it. */
const CH_PAIR = /chapters?\s*(\d{1,2})\s*(?:and|&|,|\+|to|through|–|-)\s*(\d{1,2})/i;
const CH_ONE  = /chapters?\s*(1[0-3]|[235-9])\b(?!\d)/i;

/* --------------------------------------------------------------------------
   THE ROUTES
   Unshifted as one block, so they are tried in the order written and all of
   them before ai7's booking route and everything under it. Narrow first
   within the block: `wMove` has to see "cancel my interview" before `wRefund`
   sees "cancel", and `wRefund` has to see "is the fee refundable" before
   `wCost` sees "fee".
   -------------------------------------------------------------------------- */
/* --------------------------------------------------------------------------
   WHY THESE SCENES — THE CHOOSER'S ONE QUESTION, ANSWERED FROM `SCENES`

   Maryam, 1 Sep 2026: the six cards on the Interviews module lost their
   descriptions, and the section gained one line under the grid — "Ask Tal why
   these scenes were chosen from your interview?" — with the head band's own
   star on it. Pressing it opens Tal, "then tal will response back with the
   reasoning".

   THE REASONING IS THE SIX DESCRIPTIONS THAT CAME OFF THE CARDS. `SCENES`
   holds `[title, why, from, length]` and the second field is exactly the line
   each card used to print — "Where you changed your mind". So
   nothing is written here: the copy moved from the strip into the reply, and
   `SCENES` stays the one record it was, which is the `bkStamp` rule (one
   place, many readers) applied to six sentences. Editing a scene's `why`
   changes the strip and the answer together, because there is only one of it.

   AND THE ANSWER IS NOT AN ANSWER TO "WHO CHOSE THEM", WHICH IS THE ONE
   CONSTRAINT THE COPY HAS. The note over `SCENES` is explicit: nothing in the
   product says where the six came from, because "the moment the copy names a
   sender, the choice reads as approving somebody else's shortlist rather than
   picking your own three". So Tal says what each moment IS and what keeping
   three does, and never that anybody picked them — the honest reading of "why
   these" being what is in them, not whose list it was.

   THE SET FOLLOWS `S.iv`, WHICH IS WHAT THE PAGE IS ABOUT. The re-interview
   has its own six on `promoted`, and `V.report` / `ivRow` already write `S.iv`
   on the way past, so the reply describes the interview the reader was last
   looking at rather than always the first one.

   THE STATE LINE IS DERIVED THREE WAYS because the block has three states and
   they are genuinely different answers: nothing saved yet (the chooser is on
   screen and this is what saving does), a set saved (the three are named), and
   a set part-picked. `sceneKeep` / `scenePicked` are the two arrays views.js
   already keeps apart, and the note over them is why.
   -------------------------------------------------------------------------- */
function wScenes(){
  const kind = S.iv === 're' ? 're' : 'level';
  const set = (typeof SCENES === 'object' && SCENES[kind]) || [];
  if(!set.length) return '';
  const kept = (typeof sceneKeep === 'function' && sceneKeep(kind)) || null;
  const picked = (typeof scenePicked === 'function' && scenePicked(kind)) || [];
  const which = kind === 're' ? 're-interview' : 'level interview';
  return tw(twIc('play') + `The six moments from your ${which}`,
    `<span class="tw-lede">Each one is a stretch of the recording where you were doing
       something the interview was looking for, not a highlight, and not a
       verdict.</span>
     <span class="tw-list">
       ${set.map(s => `<span><b>${s[0]}</b><br>${s[1]} &middot; ${s[3]}</span>`).join('')}
     </span>
     <span class="tw-k">${kept
        ? 'You kept ' + kept.map(i => set[i][0]).join(', ') + '. Those three are what shows on your interview; the other three are not published anywhere.'
        : picked.length
          ? 'You have ' + picked.length + ' of three chosen. Save them and those three are what shows on your interview from now on. The other three are not published anywhere.'
          : 'Keep three of the six. Those three are what shows on your interview from now on, and the other three are not published anywhere.'}</span>`,
    twBtn('Open Interviews','interviews'));
}

TAL_ROUTES.unshift(
  /* FIRST IN THE LIST, and narrow enough to afford it. The button sends "Why
     were these scenes chosen from my interview?"; a person typing it will
     write it some other way, so the test is the word `scene` next to the
     product's own vocabulary for the block rather than the exact sentence.
     `\bscenes?\b` alone would be too wide — "what happens to the scene" is a
     different question and the chapter player has scenes in it — so it is
     paired with choosing, keeping or publishing. */
  [/\bscenes?\b[^.?!]{0,40}\b(chosen|choose|choosing|cut|keep|kept|pick|picked|show|shown|publish\w*|mean)\b|\b(why|which|what)\b[^.?!]{0,30}\bscenes?\b|six moments/i, wScenes],

  /* --- what are you for ------------------------------------------------ */
  /* FIRST, because the dashboard's Meet Tal card asks it and because it is
     the only question whose answer is the whole of this file. */
  [/what can you (help|do)|what do you do|what are you (for|able)|how can you help|who are you|what is tal|are you (a )?(human|real|bot|ai)|what can i ask/i, wScope],

  /* --- not the product ------------------------------------------------ */
  [/\b(answers?|solutions?)\b[^.?!]{0,25}\b(assessment|quiz|test|chapter)\b|\b(assessment|quiz|test)\b[^.?!]{0,25}\banswers?\b|do (it|the assessment) for me|pass it for me/i, wNoAnswers],

  [/\b(salary|salaries|earn|pay(ing)? me|paid|worth|market rate|compensation)\b[^.?!]{0,30}\b(e[1-5]|b[1-4]|level|explorer|promotion)\b|\b(e[1-5]|level|explorer)\b[^.?!]{0,25}\b(salary|worth|earn|pays?)\b/i,
    () => talOff(`I do not have that, and TalentNext does not publish it. A level is an assessment of how you operate, made by an agent inside this product. It is not a pay band and it is not benchmarked against a market. Anyone who told you an E4 is worth a number would be making it up, and so would I.`,
      ['What would move me to E4?', 'What is on my report?'])],

  [/\bget me a job\b|find me a (job|role|position)|place me|do you place|recruit|hiring|apply for (a )?(job|role)|introduce me to (an )?employer/i,
    () => talOff(`TalentNext does not place people. It assesses how you operate and gives you a level and a record you can show. What you do with that is yours. There is no job board in here and I cannot introduce you to anyone.`,
      ['What is in the 90-day summary?', 'What do I have at the end?'])],

  /* PERFORMANCE REVIEWS SIT JUST OUTSIDE, and the line is worth drawing
     precisely because Tal DOES write things — a reply to Priya, a reflection
     on a chapter. Both are about the candidate's own work on this course. A
     review of somebody else is a document that goes in another company's HR
     system off the back of a judgement Tal has no part of, so the answer names
     the two it will write rather than just refusing. */
  [/performance review|appraisal|write (my|a) review|review for (my|one of my)|\b1:1 (notes|doc)\b|write up my (report|team)/i,
    () => talOff(`Not that one. I write about your work on this course: a reply in the messages thread, or your chapter note turned into a proper reflection. A review of somebody on your team is a judgement I have no part of and a document I have never seen the shape of.`,
      ['Help me word a reply', 'Turn my note into a reflection'])],

  [/\b(joke|weather|football|recipe|who won|your favourite|favorite)\b|what do you think of (my|the) (boss|manager|company|employer)|should i (quit|resign|leave my job)|\b(is|are) my (boss|manager) \b/i,
    () => talOff(`That is outside what I am for. I am the assistant inside your course: the 13 chapters, your level, your interviews, your cohort and what I hold about you. I am not the one to ask about your job or the people in it, and I would rather say so than have an opinion.`,
      ['What should I do next?', 'How am I doing overall?'])],

  /* --- something is broken -------------------------------------------- */
  /* "did not" IS IN THE LIST, and it was the one omission that mattered:
     "My progress did not save" matched the standing route on `my progress`
     and came back with how well she is doing, which is a status report
     answering a bug. A negated verb is the whole signal here, so all four
     spellings of it are listed. */
  [/\b(will ?not|won.?t|does ?not|doesn.?t|did ?not|didn.?t|cannot|can.?t|unable to|failed to)\b[^.?!]{0,22}\b(play|load|open|sign in|log ?in|save|saved|submit|start|work|working|upload)\b|\b(broken|blank|stuck loading|crash(ed|ing)?|frozen|not working|lost my progress|locked out)\b|\b(verif\w+|confirmation|activation)\b[^.?!]{0,20}\bemail\b|did ?n.?t get the email|forgot my password|reset my password/i,
    wBroken],

  /* --- money ----------------------------------------------------------- */
  cand(/\b(card)\b[^.?!]{0,25}\b(stored|store|kept|keep|safe|secure|held)\b|\b(store|keep|saving|hold)\b[^.?!]{0,20}\bcard\b|\bpci\b|is my (card|payment) (data|info\w*) safe/i, wCard, 'a card'),

  [/\b(reschedul\w+|move|cancel\w*|postpone|push back|change the (date|time|slot))\b[^.?!]{0,30}\b(interview|slot|booking|appointment|re-?interview)\b|\b(interview|slot|booking)\b[^.?!]{0,30}\b(reschedul\w+|cancel\w*|postpone|moved?)\b|\bno.?show\b/i, wMove],

  cand(/charged twice|double charge|charged (me )?(twice|again|two)|wrong amount|overcharg\w+|dispute|unauthori[sz]ed|took the money twice|refund my/i, wBillingProblem, 'a charge'),

  cand(/\b(paid|payments? history|receipt|invoice|statement|charges?|charged|transaction)\b|what have i (paid|spent)|how much have i|\b(change|update|remove|add|new)\b[^.?!]{0,20}\bcard\b/i, wLedger, 'a payment'),

  cand(/refund|money back|cancellation policy|cancel the course|\bfee\b[^.?!]{0,20}\brefund\w*\b|is it refundable/i, wRefund, 'a refund'),

  cand(/\b(who pays|cost|costs|price|priced|fee|charge|pay|paid|free|included|extra)\b[^.?!]{0,30}\bre-?interview\b|\bre-?interview\b[^.?!]{0,30}\b(cost|costs|price|fee|paid|pay|free|included|extra)\b/i, wReCost, 'a fee'),

  cand(/how much (does|is|do|will) (it|this|the course|the whole)|what does (it|the course|this) cost|\b(total )?cost\b|\bprice of\b|course fee|\bfees?\b|instal(l)?ment|payment plan|pay monthly|split the payment|discount|coupon|promo|cheaper|bursary|scholarship/i, wCost, 'a fee'),

  /* --- the interview --------------------------------------------------- */
  [/questions (in advance|first|beforehand|up front)|see the questions|know the questions|what will (they|she|he) ask|list of questions/i, wNoQuestions],

  [/what should i not do|what not to do|things to avoid|\bavoid\b[^.?!]{0,25}\binterview\b|common mistakes|get it wrong|mess (it|this) up|put (them|her|him) off/i, wNotDo],

  [/how (soon|long|quickly)[^.?!]{0,30}\b(level|report|result|score)\b|when (do|will) i (get|know|see)[^.?!]{0,25}\b(level|report|result)\b|\breport\b[^.?!]{0,20}\b(back|ready|when)\b/i, wWhenLevel],

  [/\b(rank|ranking|rating|star|stars|score|number)\b[^.?!]{0,30}\b(mean|means|meaning|based on|calculated|for)\b|what does the (rank|rating|star|number)|how are agents (ranked|rated|ordered|sorted)/i, wRank],

  [/pricier|more expensive|expensive agent|cheaper agent|\bprice\b[^.?!]{0,30}\b(mean|matter|better|higher|quality|score|level)\b|does paying more|worth paying more|\bcost\b[^.?!]{0,25}\bbetter (agent|level|report)\b/i, wPrice],

  [/\bcompare\b[^.?!]{0,30}\b(priya|owen|lena|samuel|hana|agents?)\b|\b(priya|owen|lena|samuel|hana)\b[^.?!]{0,15}\b(vs|versus|or)\b[^.?!]{0,15}\b(priya|owen|lena|samuel|hana)\b|difference between (priya|owen|lena|the agents|two agents)|which of them|\bwhich agent\b[^.?!]{0,20}\b(better|right for me|should i)\b/i,
    wAgentPair],

  /* --- the cohort ------------------------------------------------------ */
  [/who (leads|runs|is)[^.?!]{0,25}\b(cohort|leader|my leader)\b|\b(cohort )?leader\b[^.?!]{0,20}\b(who|name|is)\b|who is my (leader|mentor)|about my leader|contact (my )?(cohort )?leader|message my leader|is (the|my) leader paid/i, wLeader],

  [/\b(miss|missed|missing|skip)\b[^.?!]{0,30}\b(call|session|thursday)\b|\b(call|session)\b[^.?!]{0,25}\b(recorded|recording|replay|catch up)\b|what time (is|are)[^.?!]{0,20}\b(call|calls|session)\b|time ?zone|how long is the call|how often (is|are) the call/i, wCallLogistics],

  cand(/change (my )?cohort|switch (my )?cohort|different cohort|another cohort|move cohort|join a (later|different) cohort|swap cohort/i, wSwitch, 'a cohort place'),

  cand(/when (does|do|will)[^.?!]{0,30}\b(finish|end|ends|over|done|complete|graduat\w+)\b|how (much )?(long|many (days|weeks))[^.?!]{0,25}\b(left|to go|remaining|until)\b|\b(finish|end) date\b|last (day|week) of the course/i, wFinish, 'a course'),

  cand(/\bpause\b|\bdefer\b|\bextension\b|extend (my|the) course|take a break|freeze my|put (it|the course) on hold|drop out|quit the course|\bwithdraw\b/i, wPause, 'a course place'),

  /* --- who sees what --------------------------------------------------- */
  [/who (can |else )?(see|sees|read|reads|has access)|who else (sees|can)|\bshare\b[^.?!]{0,25}\b(employer|manager|boss|company)\b|\bemployer\b[^.?!]{0,25}\b(see|told|know|share)\b|\brecording(s)?\b[^.?!]{0,25}\b(deleted|delete|kept|keep|stored|store|how long|retain\w*)\b|\b(delete|deleted|how long)\b[^.?!]{0,25}\brecording(s)?\b|sell my data|\bgdpr\b|my data|is (my|the) (data|interview) private/i, wSeen],

  [/turn (you|tal) off|switch (you|tal) off|disable (you|tal)|stop (you|tal) (from )?(reading|seeing|using|watching)|opt out of (you|tal|ai)|do not use my|stop reading my (notes|messages)|can you see my (messages|card|payments)|what can(o|')?t you see|what do you not see/i, wTalScope],

  [/delete (my )?account|close (my )?account|deactivate|remove my account|download (everything|my data|all my data)|export my data/i, wClose],

  /* --- the course ------------------------------------------------------ */
  [CH_PAIR, () => { const m = TAL_Q.match(CH_PAIR); return m ? wChapterAny([+m[1], +m[2]]) : ''; }],

  /* SINGLE CHAPTERS EXCEPT 1 AND 4. Those two have prose answers in data.js
     that are better than anything read out of `CH` — chapter 4's is the
     argument the chapter turns on — so the regex declines them by construction
     rather than this route deciding to pass. */
  [CH_ONE, () => { const m = TAL_Q.match(CH_ONE); return m ? wChapterAny([+m[1]]) : ''; }],

  cand(/\b(move|moving|get|getting|step|progress|promot\w+|climb)\b[^.?!]{0,25}\b(me )?up\b|move me up|\b(get|getting) to (e[1-5]|the next level)\b|how do i (progress|advance|get promoted)|next level|what would move me/i, wMoveUp, 'a level'),

  cand(/\b(lowest|worst|weakest|dragged|dragging|pulling|pulled|bringing)\b[^.?!]{0,30}\b(average|score|down|mark)\b|\baverage\b[^.?!]{0,25}\b(down|lowest|worst)\b|which chapter did i do (worst|badly)/i, wLowest, 'an assessment score'),

  cand(/how (am i|is it) (doing|going)|how am i doing|am i doing (ok|okay|well|badly|alright)|how do i compare (with|to) (my )?cohort|where do i stand|my (overall )?progress|how far (through|along) am i/i, wStanding, 'a course record'),

  cand(/how far behind|am i behind|\bbehind\b[^.?!]{0,25}\b(others|cohort|schedule|pace)\b|catch up|caught up|falling behind|\bon track\b|keeping up/i, wPace, 'a course pace'),

  cand(/what should i do next|what (do i|should i) do now|what next|whats next|what is next(?! week)|where do i (start|begin)|what now|priorit(y|ies)|most important thing/i, wNext, 'a course'),

  cand(/90.?day (cycle|course|structure|programme|program)|explain the 90|how (does|do) the (90|course|cycle) work|how is the course structured|what are the 90 days|structure of the course/i, wCycle, 'the 90 days'),

  cand(/90.?day summary|what is in the summary|the summary document/i, wSummary, 'a summary'),

  cand(/\b(certificate|certification|certified|diploma|qualification|credential)\b|what do i (get|have|leave with) at the end|what do i get out of|end of the (course|90)/i, wEnd, 'a certification'),

  /* --- the transcript, one theme the theme table does not name --------- */
  /* `IVT_THEMES` has a `conflict` tag but its regex does not say "hard
     conversation", which is both the chapter 5 title and the words Priya
     actually used. The chip "Find the part on hard conversations" is printed
     by `TALCTX.ivt`, so it has to land somewhere. */
  [/hard conversation|difficult conversation|awkward conversation/i,
    () => (typeof ivtAnswer === 'function'
      ? ivtAnswer('Priya asked you for a real hard conversation, and this is the exchange it turned into. Chapter 5 is built on the same thing.',
          ivtFind(S.iv === 're' ? 're' : 'level', 'conflict'), S.iv === 're' ? 're' : 'level')
        || wChapterAny([5])
      : wChapterAny([5]))]
);

/* --------------------------------------------------------------------------
   THE LAST ROUTE, WHICH MATCHES EVERYTHING

   Three fallbacks existed and all three were placeholders: `talReply`'s own
   "I can help with your course, your level, the cohort call and your points",
   `talPump`'s "I did not follow that one", and `askSend`'s. The first is a
   capability list pretending to be an answer.

   `talReply` is `for … if(m.test(q)) return fn()`, so a route at the END of
   the array that matches any string means the loop always returns and the
   internal fallback becomes unreachable. That is a smaller and more honest
   change than editing views.js: the sentence stays where it was written, it
   simply stops being the thing a person reads.

   PUSHED, NOT UNSHIFTED — the only route in this file that is, and getting it
   the wrong way round would make Tal answer every question with the support
   desk. */
TAL_ROUTES.push([/[\s\S]/, talNoAnswer]);

/* AND THE WRAPPER, FOR THE TWO THINGS A ROUTE TABLE CANNOT DO.

   It captures the question — see the note over `TAL_Q`; the router does not
   pass it, and three routes here need the words rather than just the match.

   And it catches a throw. Every pass in this family wraps its render in a
   try/catch that warns, on the argument that a broken pass should be a
   console warning rather than a blank screen; the same argument applies to a
   broken answer, and more sharply, because the person is waiting for it. A
   route that throws now produces the support card and a warning, which is
   exactly what it would produce if it had honestly declined.
   -------------------------------------------------------------------------- */
const _talReplyBase = talReply;
talReply = function(q){
  TAL_Q = String(q || '');
  let html = null;
  try { html = _talReplyBase(TAL_Q); } catch(e){ console.warn('talReply', e); }
  return twTop(html || talNoAnswer());
};

/* --------------------------------------------------------------------------
   A WIDGET THAT OPENS THE BUBBLE DOES NOT NEED A GAP ABOVE IT

   §39.1 gives `.tw` a 16px top margin, which is what separates it from the
   sentence above it. Most of Tal's answers are a sentence and then a widget,
   so most of the time that is right. Some are the widget alone — `wNext`,
   `wRefund`, `wLeader` — and there the margin lands on top of the bubble's
   own 17px padding: 34px above the label, against 17px at the sides.

   CSS CANNOT TELL THE TWO APART. A bubble is built by assigning a string to
   `innerHTML`, so leading prose is a TEXT NODE — and `:first-child` counts
   elements only. The widget is `:first-child` whether or not a sentence sits
   above it, which makes the one selector that would answer this unable to.

   So it is answered here, where the string still exists. The test is a
   prefix, not a parse: does the reply BEGIN with a widget. One replacement,
   anchored, on the first occurrence only — and because every reply in the
   product passes through this wrapper it covers data.js's and ai2's answers
   as well as this file's, which a per-widget marker never would.
   -------------------------------------------------------------------------- */
function twTop(html){
  return /^\s*<span class="tw">/.test(html)
    ? html.replace('<span class="tw">', '<span class="tw tw-top">')
    : html;
}

/* --------------------------------------------------------------------------
   THE CHIPS THAT WERE ASKING FOR THE ONE ANSWER TAL MAY NOT GIVE

   Every other dead chip in `TALCTX` is answered by a route above. These two
   cannot be, and they are the reason `wLedger` exists: Payments offered "What
   have I paid so far?" and "Can I get a receipt?", and both ask Tal to read a
   ledger that two other screens say it has never seen. A chip is a promise
   the product makes on Tal's behalf, so the fix is at the chip and not only
   at the route — the questions become the two things Tal can answer fully on
   that page, and the ledger questions still route to `wLedger` if somebody
   types them.
   -------------------------------------------------------------------------- */
TALCTX.billing = ['What does the course fee cover?', 'What is the refund window?', 'Is my card stored?'];

/* Three pages whose chips were the strongest questions in the set and had no
   answer until this file. Left as they were — they work now. */

/* TRAP 8: every pass ends with its own render, because the boot render is the
   last statement in views.js and has already run. This file registers routes
   and wraps a function rather than adding a render pass, so there is nothing
   for a paint to pick up — but `TALCTX.billing` above is read at render time
   by `talPanel` and by `placeAsk`, and a Payments page already on screen when
   this parses would keep the old chips until the next interaction. */
render();
