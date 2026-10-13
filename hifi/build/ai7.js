/* ==========================================================================
   BOOKING AN INTERVIEW WITHOUT LEAVING THE CONVERSATION

   Tal could already TALK about booking — "three agents assess at your level"
   — and then had to hand you off: a chip, a page, a rail, four screens. The
   one thing a candidate comes here to do was the one thing the assistant
   could not finish. This pass finishes it. Ask Tal to book an interview and
   the whole flow happens inside the thread: the shortlist, a profile, the day
   and the time, the confirmation. The fee is Stripe's, on Stripe's own page,
   so there is no payment screen here — see the note over `BKW`. When you
   press back, the product behind the conversation has an interview booked.

   FOUR RULES THIS FILE IS BUILT ON, each of them learnt the hard way from
   the surface it is building on.

   1. NOTHING IN A BUBBLE MAY HOLD ITS OWN STATE. The base render replaces
      `device.innerHTML` outright and `placeAsk` (ai4) rebuilds the whole
      `.ask-page` from `S.thread` every time — so a `.on` class put on a slot
      button by a click handler is gone by the next paint. Every widget here
      is therefore a PURE FUNCTION OF `S.bk`, re-run on each render by
      `placeBook`. The thread stores an empty host element, never the drawn
      widget:

        S.thread.push({who:'tal', html: '<div class="bkw" data-bkw="sched">'})

      `placeBook` fills each host from `BKW[name]()`. This is why the day you
      picked survives asking Tal something else in the middle of the flow.

   2. IT IS THE PRODUCT'S OWN UI, NOT A CHAT-SIZED COPY OF IT. `.agh.agh-book`
      is the agent card off the agents page, `.agid` is the profile header,
      `.daystrip`/`.slots` is the picker off the agent page, `.cardrow` is the
      saved card off Payments, `.note.succ` is the confirmation off the
      booking screen. All of it renders in the thread because `.ask-page`
      carries `.page` — every `.app .page ...` rule in the sheet reaches
      inside a bubble already. §35 only pays for what the bubble changes:
      the page gutters those components assume, and the width of a bubble
      that has a card in it.

   3. NO TAL MARK ON A CARD INSIDE TAL. `agentCardH` prints a `talStar` —
      "Ask Tal about this agent" — which is exactly right on the agents page
      and absurd two inches under Tal's own name. The card here is that card
      minus the star, and the space the star held goes to the Book button.

   4. WHAT YOU CHOSE IS WHAT THE PROTOTYPE THEN SHOWS. The booked stage was
      written as fixed prose — Priya Nair, Thursday 20 August, 6:30 PM, $95 —
      because until now nothing could choose otherwise. Book Owen at 2:00 PM
      and every one of those surfaces has to agree, or the flow reads as a
      demo that was not connected to anything. `S.booking` is the record and
      `bkStamp` is what makes the four surfaces read it. See §4 below.
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. WHAT THERE IS TO CHOOSE

   The five days and six times are `V.agent`'s, character for character, and
   the two disabled slots are its two — this is the same picker, not a second
   one that happens to look similar. The default landing (Thursday the 20th,
   6:30 PM) is the booking the rest of the prototype was written around, so
   somebody who takes the offered slot ends up in exactly the state the
   hand-written booked stage describes.

   The shortlist is the three agents the agents page rails and the `new`
   dashboard rails: the ones who assess at Explorer level with a slot inside
   seven days. `AGENTS` holds five; the other two assess higher bands.
   -------------------------------------------------------------------------- */
const BK_DAYS = [['Wed','Wednesday',19],['Thu','Thursday',20],['Fri','Friday',21],
                 ['Mon','Monday',24],['Tue','Tuesday',25]];
const BK_SLOTS = ['9:00 AM','11:30 AM','2:00 PM','4:30 PM','6:30 PM','8:00 PM'];
const BK_OFF = [0,5];                    /* taken — `V.agent` disables the same two */
const BK_MONTH = ['August','Aug'];
const BK_SHORTLIST = ['priya','owen','lena'];
const BK_DAY0 = 1, BK_SLOT0 = 4;         /* Thursday 20 August, 6:30 PM */

/* `S.bk` is the flow in progress and is null until Tal is asked to book.
   `S.booking` is the RESULT and outlives the conversation — `talReset` clears
   the first and never the second, because the thread belongs to the page you
   opened it from and a booked interview belongs to the candidate. */
S.bk = null;
S.booking = null;

function bkStart(){
  S.bk = {open:null, agent:null, day:BK_DAY0, slot:BK_SLOT0};
}

/* the three readings of one booking. Literal '·' rather than `&middot;`
   because `bkStamp` writes some of these through `textContent`, where an
   entity would show as its own source. */
const bkRec = () => S.booking || S.bk || {day:BK_DAY0, slot:BK_SLOT0};
const bkAgent = () => AGENTS[(bkRec().agent) || S.agent || 'priya'];
const bkLong = (r) => { r = r || bkRec(); const d = BK_DAYS[r.day] || BK_DAYS[BK_DAY0];
  return `${d[1]}, ${BK_MONTH[0]} ${d[2]} at ${BK_SLOTS[r.slot] || BK_SLOTS[BK_SLOT0]}`; };
const bkShort = (r) => { r = r || bkRec(); const d = BK_DAYS[r.day] || BK_DAYS[BK_DAY0];
  return `${d[0]}, ${BK_MONTH[1]} ${d[2]} · ${BK_SLOTS[r.slot] || BK_SLOTS[BK_SLOT0]}`; };
const bkDate = (r) => { r = r || bkRec(); const d = BK_DAYS[r.day] || BK_DAYS[BK_DAY0];
  return `${d[0]}, ${BK_MONTH[1]} ${d[2]}`; };
/* the weekday alone, spelt in full — for prose that has to name the day
   without restating a date the reader is already looking at */
const bkWeekday = (r) => { r = r || bkRec(); return (BK_DAYS[r.day] || BK_DAYS[BK_DAY0])[1]; };

/* --------------------------------------------------------------------------
   2. THE WIDGETS

   One entry per step, each a function of `S.bk` and nothing else. A widget
   whose step is settled goes read-only rather than disappearing: the thread is
   a record of what you did, and a live "Continue" under a booking that already
   exists is an invitation to make a second one.
   -------------------------------------------------------------------------- */

/* THE SHORTLIST, AND THE PROFILE, ARE ONE WIDGET IN TWO STATES.
   Opening an agent could have pushed a new Tal turn instead, and that is the
   wrong model twice over: reading a profile is not something you said, and
   going back to the list would then mean printing the list a second time. It
   is one card that turns over — which is also what "and go back to all
   agents" asks for. `S.bk.open` is which side is up. */
/* THERE IS NO PAYMENT WIDGET, AND THAT IS A PRODUCT DECISION RATHER THAN AN
   OMISSION. The fee is taken by Stripe, on Stripe's own hosted page, so a card
   form drawn here would be a screen the product does not have — and a
   convincing fake of a payment form is the one thing a prototype should never
   put in front of a candidate. `Continue to payment` is the handoff: in the
   product it opens Stripe, and what comes back is the booking. The flow
   therefore has three steps, not four, and the button's reply is the
   confirmation. `bkBooked` records the saved card because that is what the
   product's own receipt row and Payments module already say. */
const BKW = {
  agents: () => S.bk ? (S.bk.open ? bkProfile(S.bk.open) : bkList()) : '',
  sched:  () => S.bk ? bkSched() : ''
};

const bkHost = (k) => `<div class="bkw" data-bkw="${k}"></div>`;

/* THE CONFIRMATION IS THE ONE WIDGET THAT IS NOT A HOST.
   Every other step is live because it can still change — you can turn the
   card over, pick a different day, switch card. A confirmation cannot: it is
   the record of something that happened, and the moment it re-derives itself
   from `S.booking` it stops being that. Book a second interview later in the
   same thread and the first confirmation would silently become a description
   of the second one, or — while the second flow is still mid-way — of nothing
   at all. So it is drawn once and frozen into the message. `.bkw` with no
   `data-bkw` still gets §35's width; `placeBook` has nothing to fill. */
const bkFrozen = (html) => `<div class="bkw">${html}</div>`;

/* `.rail-wrap > .rail` VERBATIM, because that is where "three across at
   desktop" already lives. §14 turns `.app .rail` into a three-column grid
   inside a container query and restates each card's internal grid to match;
   §07 leaves it a stack below that. Writing my own breakpoint would be a
   second copy of that decision, and the two would drift the first time the
   dashboard's rail changed. Borrowing the container means the cards in the
   chat break to three-up at exactly the width the dashboard's do, and look
   the same when they get there. §35.1 pays the wrapper's page indent. */
/* NO CAPTION UNDER THE CARDS. It read "open a card to read the full profile,
   or book straight from it" — an instruction for two affordances that are
   already on the card, under three cards that are the only thing in the
   bubble. Tal's line above says what these are; the cards say what you can do
   with them. */
function bkList(){
  return `<div class="bk">
    <div class="rail-wrap bk-list"><div class="rail">${BK_SHORTLIST.map(bkCard).join('')}</div></div>
  </div>`;
}

/* `agentCardH` (views.js) with two edits and no third: the Tal star comes off
   (rule 3 at the head of this file), and the two destinations split. Pressing
   the card opens the profile in place; pressing Book skips it. On the agents
   page both of those went to the same screen, because the profile WAS the
   booking screen — here they are two steps and the card can offer both. */
function bkCard(key){
  const a = AGENTS[key];
  const done = S.booking && S.booking.agent === key;
  return `<div class="agh draw agh-book bk-ag" role="button" tabindex="0" data-bkopen="${key}">
    <span class="bd"><i></i><i></i><i></i><i></i></span>
    ${avatar(a,72)}
    <span class="agh-n">${a.n}<span class="ag-price">${a.price}</span></span>
    <span class="agh-r">${stars(a.r)}<span class="num">${a.r.toFixed(1)}</span></span>
    <span class="agh-m">${a.range} · ${a.ivs} interviews</span>
    <span class="agh-f"><span class="agh-slot">Next: ${a.slot}</span>
      <span class="agh-act">${done
        ? `<span class="bk-flag">${I.checkFilled}Booked</span>`
        : `<button class="btn btn-p btn-sm noic" data-bkbook="${key}">Book</button>`}
      </span></span>
  </div>`;
}

/* ONE WAY BACK, NOT TWO. The profile used to close on an "All agents" button
   beside Book, as well as opening with the back link. Same destination twice
   in one card, and the pair at the foot read as a CHOICE — book this agent, or
   go and look at the others — which put a second option next to the one action
   the card exists to offer. Going back is navigation and it belongs at the top
   with the rest of the navigation; the foot is for the step forward. */
function bkProfile(key){
  const a = AGENTS[key];
  const done = S.booking && S.booking.agent === key;
  return `<div class="bk bk-prof">
    <button class="bk-back" data-bkall="1">${I.arrowLeft}<span>All agents</span></button>
    <div class="agid">
      ${avatar(a,72)}
      <div class="agid-b">
        <div class="agid-n">${a.n}</div>
        <div class="agid-r">${stars(a.r)}<span class="num">${a.r.toFixed(1)}</span><span class="agid-iv">· ${a.ivs} interviews</span></div>
        <div class="agid-c"><span>Assesses ${a.range}</span><span class="agid-v">${I.checkFilled}Verified</span></div>
      </div>
    </div>
    ${a.bio ? `<p class="agid-bio">${a.bio}</p>` : ''}
    <div class="kv-bands">
      <div class="kv"><span class="k">Interview fee</span><span class="v">${a.price}</span></div>
      <div class="kv"><span class="k">Length</span><span class="v n">45 minutes, recorded</span></div>
      <div class="kv"><span class="k">Report turnaround</span><span class="v n">Within 24 hours</span></div>
      <div class="kv"><span class="k">Next free slot</span><span class="v n">${a.slot}</span></div>
    </div>
    <div class="bk-a">
      ${done
        ? `<span class="bk-flag">${I.checkFilled}Booked for ${bkDate()}</span>`
        : `<button class="btn btn-p btn-sm" data-bkbook="${key}"><span style="text-transform:none">Book a Call with ${a.n.split(' ')[0]}</span> ${I.arrowRight}</button>`}
    </div>
  </div>`;
}

/* THE PICKER, AND WHY THE DISABLED SLOTS ARE STILL DRAWN.
   Two of the six times are taken, and a picker that simply omitted them would
   say the agent works four hours a day. `V.agent` draws all six and disables
   two; so does this. The line under it is that page's line, and it is the
   reason the flow does not time out: the hold starts when you continue. */
function bkSched(){
  const a = AGENTS[S.bk.agent] || bkAgent();
  const locked = !!S.booking;
  return `<div class="bk bk-sched">
    <div class="bk-h">Pick a day</div>
    <div class="daystrip">
      ${BK_DAYS.map(([d,,n],i) =>
        `<button class="day ${i===S.bk.day?'on':''}" data-bkday="${i}"${locked?' disabled':''}>
          <div class="d">${d}</div><div class="n">${n}</div></button>`).join('')}
    </div>
    <div class="bk-h">Pick a time</div>
    <div class="slots">${BK_SLOTS.map((t,i) =>
      `<button class="slot ${i===S.bk.slot?'on':''}" data-bkslot="${i}"${(BK_OFF.includes(i)||locked)?' disabled':''}>${t}</button>`).join('')}</div>
    <div class="bk-when">
      <span class="bk-when-t">${bkLong(S.bk)}</span>
      <span class="bk-when-p">${a.price}</span>
    </div>
    <div class="bk-a">
      ${locked
        ? `<span class="bk-flag">${I.checkFilled}Confirmed</span>`
        : `<button class="btn btn-p btn-sm" data-bknext="1">Continue to payment ${I.arrowRight}</button>`}
    </div>
    ${locked ? '' : `<p class="bk-note">Two other candidates are looking at Thursday. Slots are held for 10 minutes once you continue.</p>`}
  </div>`;
}

/* `V.booking`'s confirmation, in a bubble: the success note, the four facts,
   and the two things there are to do next. The dashboard button is the one
   that matters — it closes the conversation onto the stage the booking just
   moved you to, which is the whole point of having done this here. */
function bkDone(){
  const a = AGENTS[S.booking.agent];
  const c = S.booking.card;
  return `<div class="bk bk-done">
    <div class="note succ"><span>${I.checkFilled}</span><div class="nb"><b>Interview booked</b>${bkLong()} with ${a.n}. A calendar invite and joining link are in your email.</div></div>
    <div class="tile">
      <div class="kv"><span class="k">Agent</span><span class="v">${a.n}</span></div>
      <div class="kv"><span class="k">When</span><span class="v">${bkShort()}</span></div>
      <div class="kv"><span class="k">Length</span><span class="v n">45 minutes, recorded</span></div>
      <div class="kv"><span class="k">Paid</span><span class="v n">${a.price} · ${c.brand} ending ${c.last}</span></div>
    </div>
    <div class="bk-a">
      <button class="btn btn-p btn-sm" data-bkgo="dashboard">Back to my dashboard ${I.arrowRight}</button>
      <button class="btn btn-t btn-sm noic" data-bkgo="interviews">Interviews</button>
    </div>
  </div>`;
}

/* --------------------------------------------------------------------------
   3. THE CONVERSATION

   Tal's four turns. Each one is a sentence and a widget, in that order,
   because the widget is the answer and the sentence is what makes it one.

   `bkTurn` is a deliberate second path alongside `talPump`: the router
   answers a QUESTION, and these are answers to a BUTTON, where there is
   nothing to route and the reply is already known. It borrows the pump's
   timing so a pressed button and a typed question feel like the same
   assistant, and it reads `talQueue` on the way out so a question asked
   mid-flow still gets its own turn afterwards.
   -------------------------------------------------------------------------- */
function bkTurn(mine, reply){
  S.thread.push({who:'me', html:mine});
  S.typing = true;
  render();
  setTimeout(() => {
    S.thread.push({who:'tal', html:reply});
    S.typing = talQueue.length > 0;
    render();
  }, TAL_BEAT);
}

/* WHAT COUNTS AS ASKING TO BOOK. Broad on the verb and the noun, because
   this is the one thing people arrive wanting and they will not phrase it
   twice the same way — "book an interview", "I want to be interviewed",
   "suggest me some top profile agents", "who should I book", "show me
   agents". Two things it deliberately does NOT catch:

     reschedule   `\bschedule\b` does not match inside "reschedule", so
                  moving a booking you already have falls through to the
                  interview route rather than starting a second one.
     the 45 minutes  "what happens in the interview" is a question about the
                  thing, not a request to buy it, and it keeps its answer.

   FIRST IN THE TABLE, which is what `unshift` buys: `/interview|45 minutes/`
   sits four rows down and would otherwise take "I want to book an interview"
   and reply with a paragraph about what interviews are. */
const BK_ASK = /\b(book|booking|reserve|arrange|schedule)\b[^.?!]{0,40}\b(interview|agent|slot|session|call with)\b|\b(interview|slot)\b[^.?!]{0,30}\b(book|booking)\b|\b(top|best|good|suggested|recommend\w*)\b[^.?!]{0,25}\bagents?\b|\b(suggest|show|list|find|compare|pick|choose|which)\b[^.?!]{0,30}\bagents?\b|\bagents?\b[^.?!]{0,25}\b(suggest|available|free|recommend\w*)\b|\bi want to (be interviewed|get interviewed)\b/i;

/* ASKING AGAIN STARTS AGAIN. Without clearing the result the flow dead-ends
   after one booking: every Book button is spent, both pickers are read-only,
   and the only way back to a live flow is a reload. Clearing it means the
   surfaces behind the conversation fall back to their hand-written booking
   for as long as the new flow is unfinished — nobody is looking at them, and
   the moment you pay, `bkStamp` puts the new one everywhere. The confirmation
   already in the thread is frozen (see `bkFrozen`), so it keeps saying what
   it said. */
/* ONE LINE, THEN THE WIDGET. The first draft of these four opened with a
   paragraph — what the twenty-four agents are, how the shortlist is ordered,
   what the 45 minutes contain — and every word of it was true and in the way.
   The widget IS the answer here: the shortlist says who, the picker says when,
   the card says how much. A paragraph above it is Tal explaining the thing you
   can already see, and it pushes the thing you can see off the screen. So each
   turn is one short sentence whose only job is to say what the widget is.
   Everything the paragraph used to carry is still one question away — the
   agents page summary, and Tal's own answer to "what happens in the 45
   minutes". */
TAL_ROUTES.unshift([BK_ASK, () => {
  S.booking = null;
  bkStart();
  return `Here are the top profile agents you should consider.`
    + bkHost('agents');
}]);

/* AND IT IS OFFERED, NOT ONLY ANSWERED. `TALCTX` is the per-view suggestion
   set: the chips the open thread shows before you have said anything, and the
   rotating example on the docked line. Interviews and Choosing an agent are
   the two pages whose whole purpose is this, so on those two the first thing
   Tal offers is the thing the page is for. Nowhere else — the suggestion is
   only honest where booking is what you came to do, and `TALCTX` is keyed by
   view rather than by stage, so a third entry would put it in front of
   somebody on day 34 as well. */
const BK_CHIP = 'Book an interview with a top agent';
for(const v of ['interviews','agents']){
  if(TALCTX[v] && TALCTX[v][0] !== BK_CHIP) TALCTX[v].unshift(BK_CHIP);
}

/* --------------------------------------------------------------------------
   THE HANDLERS

   Every branch ends in `render()` and nothing else: the widgets are functions
   of `S.bk`, so moving the state IS redrawing them. Note that views.js's own
   listener runs first and has generic `.slot` / `.day` branches that move an
   `.on` class about — harmless here, because the render that follows throws
   away whatever they touched and draws the selection from `S.bk`.
   -------------------------------------------------------------------------- */
device.addEventListener('click', e => {
  const t = e.target;

  /* Book is INSIDE the card, and the card opens the profile — so it has to be
     asked about first or the button would only ever open a profile. */
  const bb = t.closest('[data-bkbook]');
  if(bb){
    if(!S.bk) bkStart();
    if(S.booking) return;                        /* already booked, see bkCard */
    const k = bb.dataset.bkbook;
    S.bk.agent = k; S.bk.open = null;
    S.agent = k;                                 /* the agent pages agree with the chat */
    const a = AGENTS[k];
    bkTurn(`Book an interview with ${a.n}`,
      `Pick a day and a time that suits you.`
      + bkHost('sched'));
    return;
  }

  const bo = t.closest('[data-bkopen]');
  if(bo){ if(!S.bk) bkStart(); S.bk.open = bo.dataset.bkopen; render(); return; }

  const ba = t.closest('[data-bkall]');
  if(ba){ if(!S.bk) bkStart(); S.bk.open = null; render(); return; }

  const bd = t.closest('[data-bkday]');
  if(bd && !bd.disabled){ if(!S.bk) bkStart(); S.bk.day = +bd.dataset.bkday; render(); return; }

  const bs = t.closest('[data-bkslot]');
  if(bs && !bs.disabled){ if(!S.bk) bkStart(); S.bk.slot = +bs.dataset.bkslot; render(); return; }

  /* THE HANDOFF IS THE LAST STEP. In the product this is where Stripe takes
     over; the prototype has nothing to draw for that, so pressing it books
     the interview and Tal says so. */
  const bn = t.closest('[data-bknext]');
  if(bn){
    if(!S.bk || S.booking) return;
    bkBooked();
    return;
  }

  /* the two ways out of the confirmation. `askClose` puts you back on the
     page the conversation was opened from, and `bkBooked` has already changed
     which page that is — so this only has to name a destination. */
  const bg = t.closest('[data-bkgo]');
  if(bg){
    S.askFrom = bg.dataset.bkgo;
    S.view = bg.dataset.bkgo;
    S.hist = [];
    askClose();
    return;
  }
});

/* CONFIRMING IS THE MOMENT THE PROTOTYPE MOVES, and it does four things.

   It records the booking, including which card the fee lands on, so nothing
   downstream has to guess. Stripe takes the payment, so there is no card to
   read off a field here — it is the candidate's default saved card, which is
   what the Payments module and the receipt row already name.

   It advances the stage — but only from the stages where the interview is
   genuinely not booked yet. Booking a RE-interview on day 90 is the same
   flow and must not throw the candidate back to week zero, so `booked` is
   set only from the four stages before it. Everywhere else the booking is
   recorded and the stage is left alone.

   It moves where BACK goes. `S.askFrom` was the page you opened Tal on —
   `agents`, or the dashboard of a stage that no longer exists. The
   conversation now ends somewhere else, and the header says so before you
   press it.

   And it answers. The turn goes last so the render it triggers already sees
   the new stage. What YOU said is the slot, in full: the button was pressed,
   and the thing you committed to is the day and the time rather than the
   press. */
const BK_PRE = ['nil','signup','consult','new'];
function bkBooked(){
  const saved = (S.cards || []).find(c => c.def) || (S.cards || [])[0]
             || {brand:'Visa', last:'4242'};
  S.booking = {agent:S.bk.agent, day:S.bk.day, slot:S.bk.slot,
               card:{brand:saved.brand, last:saved.last}};
  if(BK_PRE.includes(S.stage)) S.stage = 'booked';
  S.askFrom = 'dashboard';
  S.view = 'dashboard';
  S.hist = [];
  bkTurn(bkLong(),
    `Done. Your interview is booked.`
    + bkFrozen(bkDone()));
}

/* A NEW CONVERSATION IS A NEW FLOW. `talReset` runs whenever the thread is
   thrown away — leaving the module, switching portal, closing the panel — and
   a half-finished booking that outlived its own thread would reappear in the
   next one at whatever step it had reached. The RESULT is not touched: an
   interview in the diary is not part of a conversation. */
const _bkReset = talReset;
talReset = function(){ _bkReset(); S.bk = null; };

/* --------------------------------------------------------------------------
   THE PASS
   -------------------------------------------------------------------------- */
function placeBook(){
  device.querySelectorAll('[data-bkw]').forEach(host => {
    const build = BKW[host.dataset.bkw];
    if(!build) return;
    try { host.innerHTML = build() || ''; }
    catch(err){ console.warn('bkw', host.dataset.bkw, err); }
  });
  try { bkStamp(); } catch(err){ console.warn('bkstamp', err); }
}

/* ==========================================================================
   4. THE PROTOTYPE BEHIND THE CONVERSATION AGREES WITH IT

   The booked stage names its agent and its slot in six places, all of them
   written as prose before anything could choose otherwise: the dashboard
   plate, the "where you are" stepper, the Scheduled tile on Interviews, the
   booking confirmation, the receipt row on Payments, and Tal's own page
   summaries. Leave them and the flow is a demo that ends in a screen about
   somebody else's interview.

   A DOM PASS RATHER THAN SIX REWRITTEN VIEWS, and the reason is the same one
   `placePageSummary` gives for its own: `V.dashboard` is one function with a
   branch per stage, and copying it here to change two spans would fork the
   dashboard. Every step below is guarded and keyed on STRUCTURE — the class
   the view prints, or the label in the key column — so a view that changes
   shape loses the correction rather than getting a broken one. It runs only
   at the booked stage and only once something has actually been booked, so
   the hand-written stage is untouched until the flow has been through it.
   ========================================================================== */
function bkStamp(){
  if(!S.booking || !isBooked(S.stage)) return;
  const a = AGENTS[S.booking.agent];
  const c = S.booking.card;
  const page = device.querySelector('.view-col .page');
  if(!page || page.classList.contains('ask-page')) return;

  /* 1. THE PLATE — the dashboard's one object, and the first thing read. */
  const plate = page.querySelector('.plate');
  if(plate){
    const ph = plate.querySelector('.plate-who .av-ph');
    if(ph){
      const im = ph.querySelector('img'); if(im) im.src = a.img;
      const ini = ph.querySelector('i');  if(ini) ini.textContent = a.i;
    }
    const nm = plate.querySelector('.plate-wb b');
    if(nm) nm.textContent = a.n;
    const sub = nm && nm.nextElementSibling;
    if(sub) sub.textContent = 'Talent agent · assesses ' + a.range;
    /* AND THE DETAIL LINE IS RE-SPLIT INTO ITS ICON ROWS. `splitPlateBody`
       (ai5) turns `.plate-b`'s `&middot;` run into one `.plate-bi` per fact,
       and it runs BEFORE this pass on every render — so assigning
       `textContent` here put the run back as one grey line, on the one stage
       where a booking had actually been made. Same string, then split again.
       `splitPlateBody` is a plain function declaration in the same bundle, so
       it is in scope from here however much later this file is parsed. */
    const when = plate.querySelector('.plate-b');
    if(when){
      when.textContent = bkLong() + ' · 45 minutes, recorded';
      splitPlateBody(plate);
    }
  }

  /* 2. THE JOURNEY ROW's interview step, found by its label rather than by
        index — §56 made the five steps one list (`journey()` in views.js) and
        the label is the stable handle either way.

        TWO SELECTORS AND TWO LABELS, because the step exists in two shapes: the
        open row's `.stps-i` (this build) and §33.7's dropdown `.pi-step`, which
        the design system still ships and the agent's portal still draws. The
        label was "Interview booked" while each stage wrote its own step list;
        the shared list calls it "Interview and level" at every stage.

        AND THE DETAIL IS FOUND THROUGH THE PARENT, not `nextElementSibling`:
        the row's second line is the state word (`.stps-st`) and `.pi-sec` is
        third, so the sibling walk landed on "In progress". */
  page.querySelectorAll('.stps-i .pi-lab, .pi-step .pi-lab').forEach(lab => {
    if(!/^Interview (and level|booked)$/.test(lab.textContent.trim())) return;
    const sec = lab.parentElement && lab.parentElement.querySelector('.pi-sec');
    if(sec) sec.textContent = a.n + ' · ' + bkDate();
  });

  /* 3. THE FACT ROWS, wherever they are. Interviews prints Agent/When/Paid in
        its Scheduled tile and the booking screen prints the same four; both
        are `.kv`, and the key column is the reliable handle on which row is
        which. Nothing else at this stage uses these three keys. */
  page.querySelectorAll('.kv').forEach(kv => {
    const k = kv.querySelector('.k'), v = kv.querySelector('.v');
    if(!k || !v) return;
    const key = k.textContent.trim();
    if(key === 'Agent')     v.textContent = a.n;
    else if(key === 'When') v.textContent = bkShort();
    else if(key === 'Paid') v.textContent = a.price + ' · ' + c.brand + ' ending ' + c.last;
  });

  /* 4. THE SUCCESS NOTE on the booking screen, which says the same thing in a
        sentence. Only the one that opens "Interview booked". */
  page.querySelectorAll('.note.succ .nb').forEach(nb => {
    const b = nb.querySelector('b');
    if(!b || b.textContent.trim() !== 'Interview booked') return;
    b.nextSibling && nb.removeChild(b.nextSibling);
    b.insertAdjacentText('afterend',
      bkLong() + ' with ' + a.n + '. A calendar invite and joining link are in your email.');
  });

  /* 5. THE RECEIPT ROW on Payments. `V.billing` pushes one row per payment and
        the interview's is the only one naming an agent. */
  page.querySelectorAll('.payrow .pay-n').forEach(n => {
    if(!/^Interview · /.test(n.textContent)) return;
    n.textContent = 'Interview · ' + a.n;
    const row = n.parentElement;
    const amt = row.querySelector('.pay-a'); if(amt) amt.textContent = a.price;
    const last = row.querySelector('.pay-c .n');
    if(last) last.textContent = '•••• ' + c.last;
    /* the brand mark as well as the digits — the row prints both, and half a
       correction reads as a Visa with somebody else's last four */
    const mk = row.querySelector('.pay-c .bmk');
    if(mk) mk.innerHTML = BMK[c.brand] || BMK.card;
  });
}

/* AND SO DOES TAL. Two of ai6's page summaries state the booking as fact and
   both are rebuilt from the record; a third — My Level at this stage — is a
   paragraph about the LADDER that happens to name the agent twice, so it
   keeps its argument and gets the right name. The substitution is confined to
   the booked stage, where "Priya" can only mean the agent: from week 1 she is
   also the cohort leader, and swapping her name there would be a different
   person's sentence. */
PAGESUM.dashboard.booked = () => {
  const a = AGENTS[(S.booking || {}).agent || 'priya'];
  /* TWO SENTENCES, IN AI6'S VOICE. These two overrides exist for the FACTS —
     the agent actually chosen, rather than the hard-coded Priya the stage was
     written around — and they have to read like the other twenty-odd
     summaries or the one page you reached through the booking flow is the one
     page written by somebody else. The rule they follow is in the note over
     `PAGESUM` in ai6.js: say the thing and stop, no framing, no closing line
     about what the page is for. */
  /* AND IT CARRIES THE GREETING AND THE THREE KEYS, because §70.3 takes the
     `.ph` off the screen on every dashboard with a journey column — so this
     sentence is the page's opening line, not its second one. The `data-sum`
     phrases are ai6's `SUMDROP` mechanism; `track` is shared with `new` and
     `interview`/`prep` are this stage's. This override still exists for the
     FACTS, which is why the name and the date are still `a.n` and `bkLong()`
     rather than the hard-coded pair the stage was written around. */
  /* THE ORDER OF THE THREE CLAUSES IS THE ORDER OF THE QUESTIONS (Maryam,
     31 Aug 2026): what is booked and when, what that person weights, and what
     to do about it before the day. It reads as a recommendation with its
     reasoning shown rather than three facts in a row, which is why the
     "Explorer track" phrase moved from the head of the sentence into the
     middle of the last clause — it is now the PREMISE of the advice rather
     than a standing statement about you, and the `track` card behind it says
     the same thing either way.

     FOUR THINGS ARE STILL DERIVED AND NONE OF THEM ARE TYPED: the agent's
     full name and first name (`a.n`), the date (`bkLong()`) and the day the
     preparation is due by (`bkWeekday()`). Change the booking in the flow and
     all four follow — which is the whole reason this override exists.

     THREE SPELLINGS THAT ARE THE BUILD'S, NOT THE BRIEF'S. "levelling" with
     two l's is what `views.js`'s journey step and `lead4.js` say, and this
     sentence sits ~300px from that step; "quiz" and "delegation frameworks"
     are common nouns and the house rule is sentence case in the markup
     (§63's note on capitals). The words are otherwise verbatim. */
  return `Welcome back, Maryam! Your <b data-sum="interview">interview with ${a.n}</b> `
    + `is confirmed for ${bkLong().replace(' at ', ', at ')}. The session lasts 45 minutes and will be recorded. `
    + `Review your interview guide and spend <b data-sum="prep">a few minutes preparing</b> before your call.`;
};
/* THE RESCHEDULE FORK READS THE SAME LIVE SENTENCE. An ALIAS here, where every
   other record `resched` owns is a copy — and the difference is what the two
   things ARE. Those are CONTENT and the point of forking them is that they can
   be edited apart. This is the mechanism that puts the real agent and the real
   date into whichever sentence is drawn; a copy of it would be a second parser
   of the same booking record, which is the "hard-coded fallback that disagrees
   with the live line" ai6's own note calls worse than no fallback.

   AFTER the assignment above rather than beside it, because it reads that
   function object — and this file parses after ai6, so ai6's frozen string for
   this key is replaced here exactly as `booked`'s is. */
PAGESUM.dashboard[RESCHED] = PAGESUM.dashboard.booked;
/* AND THIS PAGE HAS NO SUMMARY AT ALL NOW (Maryam, 31 Aug 2026).
   Two overrides stood here. The first stated the booking — "Booked — Priya
   Nair, Thursday 20 August, $95 on a Visa ending 4242" — and was cut on the
   argument that the `.note succ` banner two inches below says the agent, the
   day, the time and where the invite is. What replaced it was the part the
   banner could not answer, "nothing to prepare and nothing to bring".

   That is now gone too, and the argument is the same one carried one step
   further: `V.booking` is a RECEIPT. Its whole job is to confirm that what
   happened is what was meant to happen, the green banner does that in one
   line, and a second voice above a confirmation reads as a caveat on it —
   "nothing to prepare" answers a question nobody asks while checking a
   booking went through. The preparation offer already lives on the `booked`
   dashboard, which is where somebody is when they come back to prepare.

   `PAGESUM.booking` is deleted in ai6 rather than left for this file to
   overwrite, so there is one place to look. `bkWeekday()` keeps its other
   readers (`PAGESUM.dashboard.booked` above), and `bkLong()` keeps `bkStamp`'s. */

const _bkSum = pageSummary;
pageSummary = function(){
  let text = _bkSum();
  if(!text || !S.booking || !isBooked(S.stage)) return text;
  const a = AGENTS[S.booking.agent];
  if(!a || S.booking.agent === 'priya') return text;
  return text.split('Priya Nair').join(a.n).split('Priya').join(a.n.split(' ')[0]);
};

/* --------------------------------------------------------------------------
   AND THE THREAD HAS TO STAY WHERE IT WAS

   `askSync` (ai4) scrolls the thread to the bottom after every build, which is
   right for a conversation: something was said and the new thing is at the
   end. It is wrong for a widget, twice over.

   Pressing a slot says nothing. The thread is the same length it was a moment
   ago and the only thing that changed is inside a bubble you were already
   looking at — so being moved at all is the surface telling you something
   arrived when nothing did. Below, an unchanged thread keeps its exact
   scroll position.

   And when a turn DOES arrive carrying a widget, ai4's scroll misses it:
   `askSync` runs inside the base render and this pass fills the hosts after
   it, so the smooth scroll it starts is aimed at a height the page had before
   the widget was in it — it glides to what was the bottom and stops several
   hundred pixels short. The instant pin below is measured after the fill, so
   it lands.

   Gated on there being a widget in the thread at all: every other
   conversation keeps ai4's behaviour, smooth scroll included. */
let BK_AT = {n:-1, top:0};
const _baseBook = render;
render = function(){
  const before = device.querySelector('#askThread');
  const held = (before && before.querySelector('.bkw') && S.thread.length === BK_AT.n)
    ? before.scrollTop : null;
  _baseBook();
  try { placeBook(); } catch(e){ console.warn('book', e); }
  const th = device.querySelector('#askThread');
  if(th && th.querySelector('.bkw')){
    th.scrollTop = held === null ? th.scrollHeight : held;
  }
  BK_AT.n = S.thread.length;
};
render();
