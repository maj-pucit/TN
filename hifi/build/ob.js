/* ==========================================================================
   TAL TAKES THE READING THE CONSULTANT CALL USED TO TAKE — stage: `onboard`

   Maryam, 3 Sep 2026: "we had a consultant call prototype before. so we want
   to reimplement that but with tal now, like after account creation, the user
   will land on a screen with tal welcome them and tal will do the consultant
   part before user can go to the real dashboard where they can booking an
   agent next."

   WHAT THE CONSULTANT ACTUALLY DID, so that this can be measured against it.
   data.js states Jordan Blake's job in one sentence — "He asks where you are
   now and what you want next, then points you at the agents whose range fits"
   — and the `consult` dashboard draws it in three parts: the plate (the
   appointment), "What to expect" (nothing here is assessed), and the "How this
   works" accordion (the title, the level, the ninety days). All three are jobs
   Tal can do, and the first one it can do BETTER, because a call's answers
   evaporated into one person's head and these land in `MEMO` with provenance —
   which is what `V.mem` already promises the reader ("Mark anything wrong and
   I will stop using it").

   AND IT CLOSES A LOOP THE PRODUCT WAS FAKING, which is the real reason to
   build it rather than to port the form. `PAGESUM.new` says "Considering your
   strengths I have analyzed the active roster and matched you with Priya" — on
   a stage whose only inputs are a quiz score of 64 and the word Explorer.
   `REC.priya` then claims a 98% match against a "need for System Design", and
   `SCORES` measures five bands of which System Design is not one. The
   recommendation names a need nothing measured. After this the answer to that
   sentence is a thing the candidate said, on the screen before.

   SO TAL DOES NOT ASK WHAT THE QUIZ ALREADY ANSWERED. `qzLow()` already
   derives the two weakest bands — Coaching 38 and Delegation 41 — and step 2's
   own question STATES them rather than asking for them, which is also the one
   place the flow shows the reader a figure. What no quiz can see is CONTEXT: is
   Delegation 41 because there is nobody to hand work to, or because handing it
   over is not trusted? That gap is precisely what fifteen minutes with a
   person was for, and it is the whole of what these five questions collect.

   THE FIVE QUESTIONS EACH HAVE A READER, which is the test each one had to
   pass — a question nothing downstream reads is a survey, not an onboarding:

     where   frames Tal's voice, and answers what "best time for a call" was
             really asking on the old form (between roles wants the earliest
             slot; in a role wants an evening)
     band    `REC`'s need, replacing the invented one
     why     the distinction the call existed to draw; the `MEMO` line the
             level interview later confirms or corrects
     want    which of the enrolment offer's four figures leads
     note    handed to the agent, quoted verbatim, never interpreted

   TWO THINGS THE OLD FORM HAD THAT ARE DELIBERATELY GONE. "Best Time For A
   15-Minute Call" dies with the call. And nil.js's step 1 asked "What are you
   hoping to get out of this?" against options written for the QUIZ ("A Film I
   Can Send Out", "Just Curious"); `want` is that question asked about
   TalentNext, which is a different product with a ladder in it.

   THE FREE TEXT IS QUOTED AND NEVER PARSED. A prototype in which a text box
   visibly changes Tal's next sentence is a claim the demo cannot support, and
   the honest version reads as more capable rather than less: Tal repeats it
   back inside quotation marks on the last screen and hands it to the agent.

   FOUR BOUNDARIES, ALL OF THEM ALREADY STATED SOMEWHERE IN THE BUILD, so this
   is enforcement rather than invention.
     1. NO LEVEL AND NO PREDICTION OF ONE. views.js's own note says the one
        claim the pre-interview dashboards must not make is a current level.
        Tal may say "the agents who assess E1 to E3"; never "you look like E3".
        `CFG.onboard` carries `pred:true` for exactly that reason.
     2. NOTHING IS ASSESSED. That was the whole of Jordan's reassurance and a
        person delivered it by tone. Tal has to carry it in copy, which is why
        it is on the panel of every step rather than said once at the start.
     3. NO MONEY. The screening was free and so is this.
     4. `NEVER` STILL HOLDS — no ledger, no Priya thread, no cohort call.

   IT IS A GATE, NOT A DETOUR (Maryam, 3 Sep 2026). There is no skip: the
   dashboard's black card is the recommendation these answers produce, so
   skipping would land the reader on a page whose one object has nothing behind
   it. The way out is the last screen's button.

   WHY IT IS ONE VIEW AND A STEP NUMBER RATHER THAN SEVEN VIEWS. nil.js's form
   is `consult1` / `consult2`, two view keys, and that works because its two
   steps are independent. Step 3 here is a function of step 2's answer — the
   four options under "Why is it hard right now?" are different for Coaching
   and for Delegation — so a deep link to step 3 with no step 2 behind it is a
   screen with an empty option list. `S.obStep` is state and `obScreen()` is a
   pure function of it, which is trap 9 and the same call §76 makes for
   `S.bkMo`.
   ========================================================================== */

/* WHERE THE ANSWERS LIVE. One object so a step can be re-answered without a
   second record to keep in step, and so `obHeard` can read the lot. */
S.ob = {where:null, band:null, why:null, want:null};
S.obStep = 0;
/* WHETHER THE SPOKEN GREETING HAS ALREADY RUN THIS ARRIVAL — `obSpeak`'s note
   is the argument, and `setStage` clears it so walking away and back speaks
   again. */
S.obSpoken = false;
/* WHICH MODE THE GATE'S FIRST SCREEN IS IN — `'voice'` or `'chat'`. The two
   pills at the foot switch it and `obChatScreen`'s note is why it is a word of
   its own rather than a reuse of `S.askOpen`.

   THE VOICE FLOW IS HIDDEN (Maryam, 9 Sep 2026: "hide the voice flow on the tal
   onboarding, that means we will land user on the chat side directly"). So the
   door opens on chat rather than voice, and `obModes` draws no Voice/Chat pair —
   there is one mode now, so a switch between two would be §60's dead control.
   The voice machinery (`obSpeak`/`obReplay`/`obChat`, the mode handlers) is left
   in place, just no longer reachable, so restoring the pair is a one-line
   reversal of both this default and `obModes`. */
S.obMode = 'chat';
/* AND WHETHER THE CONVERSATION HAS BEGUN. The chat opens on Tal's message and
   a button; the left/right turns and the composer arrive when that button is
   pressed (Maryam, 3 Sep 2026: "the chat left right messages will initiate
   once the user will click on the let's get started button"). Two words rather
   than one because they are two independent facts — you can be in chat mode
   without having started, and pressing the voice screen's own control puts you
   in chat mode ALREADY started. */
S.obChatOpen = false;
/* WHICH QUESTION THE CHAT IS ASKING — 0 before it starts, 1..OB_N while a
   question is on screen, OB_N+1 once they are all answered. `obAsk`'s note is
   the flow. It is a NUMBER rather than a boolean per question because the
   thread has to know which turn is the live one: a past question renders its
   words and no options, the current one renders both. */
S.obQi = 0;
/* THE SURVEY PROGRESS BAR'S LAST WIDTH, so the next render can animate FROM it
   TO the new one (Maryam, 18 Sep 2026: "not smoothly filling"). `render()`
   recreates the bar element, so a plain CSS width transition never tweens — a
   fresh node starts at its final width. Storing the previous percentage lets
   `obSurveyScreen` hand the keyframe a real from/to pair. */
S.obBarFrom = 0;
/* THE 2s LOADER BETWEEN THE WELCOME AND THE QUESTIONS (Maryam, 18 Sep 2026).
   Set true by "Let's Get Started" and cleared by the timeout that then advances
   to question one; `obScreen` paints `obLoaderScreen` while it holds. */
S.obLoading = false;

/* THE TWO WEAKEST BANDS, READ AND NOT TYPED. `qzLow` sorts `SCORES` and takes
   the bottom two, so the question cannot name a band the chart does not draw
   lowest — the exact drift that put "System Design" in `REC`. */
const OB_LOW = () => qzLow(2);

/* ==========================================================================
   THE QUESTIONS

   `o` is [key, label]. Four options where there are four, because §104's
   `.role-pick` is a two-across grid that stacks — four is two tidy rows at
   desktop and a list on a phone, and five would leave an orphan.

   THE LABELS ARE SENTENCE CASE, which is §63 §2's rule stated as house style:
   "the words go in the markup in sentence case". nil.js's form was Title Case
   on every option ("In Between", "Figure Out My Direction") because it is
   somebody else's site.
   ========================================================================== */
/* ==========================================================================
   AN OPTION IS `[key, label, description]` — 3 Sep 2026

   Maryam, with a Claude screenshot: *"the question you are asking are just
   quick tabs… The question you asked should have a block like Claude with each
   option and their should be a little desc below each option for better
   understanding instead user ask all these things separately."*

   THE THIRD FIELD IS THE WHOLE CHANGE AND IT IS NEW COPY — 23 lines of it,
   written rather than derived, the same honest cost §110's `CH_SYL` records.
   What makes it safe under §74's rule against invented claims is WHAT it
   describes: every one of these is a sentence about the READER's own
   situation, offered so they can tell two options apart. None of them is a
   claim about the product, a figure, or a promise. The one line in the flow
   that states a figure is still `obTitle`'s, still assembled from `SCORES`.

   THE LAST CLAUSE OF THE INSTRUCTION IS THE ONE THAT SAVED WORK: *"you do not
   have to give the something else row since we have that already in the form
   of the chat so do not add the question with the type field."* The reference
   closes its list with a pencil row that opens a field — and the composer
   under this panel already IS that, live on every question (`obCompose`'s
   note). A row that opened a second one would be the same affordance twice.

   `band`'s THIRD OPTION IS NOT THAT ROW AND STAYS. "Neither — it is something
   else" is an ANSWER: it re-aims question 3 at four different options, which
   is a branch the flow already carries. It collects no free text and opens no
   field. The distinction is worth holding onto — one is an escape from the
   question, the other is a way of answering it.

   THE STEPPED SCREENS DO NOT DRAW THE DESCRIPTIONS. `obQuestion` destructures
   `[k,l]` and ignores the third field, so §104's radio blocks are unchanged.
   Those five screens are reached only from the read-back's "Change" buttons
   now — a reader correcting one answer already knows what they meant — and
   giving `.role-c` a second line is a change to a component four other pages
   draw. Worth doing if they ever become the main route again.
   ========================================================================== */
/* ==========================================================================
   THE ONBOARDING QUESTIONS (Maryam, 21 Sep 2026) replaced the six quiz-led
   questions with the client's five. NO option DESCRIPTIONS (Maryam: "remove the
   desc against each option as well") so every option is [key, label], and the
   survey no longer draws the `.ob-sv-od` line.

   TWO INPUT TYPES JOIN THE RADIOS. `t:'text'` is a one-line free-text field
   ("What do you do now?") and `t:'dd'` is our dropdown ("What industry is that
   in?"), whose "Other" option opens a text field. The two text fields write into
   `S.ob` on each keystroke WITHOUT a render (the caret trap, trap 9/17) via the
   `[data-obtext]` input listener below; the dropdown is `dd()` and re-renders on
   pick like a radio (its S.ddVal store is read back by obReady / data-obdone).

   THE COMPLETION SCREEN IS KEPT (Maryam: "just keep the last one where we tell
   the step they are on") - `obDoneScreen`, unchanged. The quiz-led questions
   (band / why) and their downstream readers are gone: `obAgent` falls back to the
   first recommended agent, and `obMemo` (guarded on `S.ob.why`) returns nothing.
   ========================================================================== */
const OB_Q = [
  {k:'where',
   q:'Where are you right now?',
   tal:'Before I point you at anybody, I need a few things a quiz cannot tell me.',
   o:[['moveup','In a job I want to move up in'],
      ['leaving',"In a job I don't plan to stay in"],
      ['own','Running something of my own, or trying to start it'],
      ['between','Between things']]},

  {k:'persona',
   q:'Which of these sounds most like you? Pick one.',
   tal:'One word people would use for you. There is no wrong answer.',
   o:[['top','Top Performer'],
      ['athlete','Athlete'],
      ['leader','Leader'],
      ['entrepreneur','Entrepreneur'],
      ['notsure','Not Sure'],
      ['team','Team Player']]},

  {k:'role', t:'text',
   q:'What do you do now?',
   tal:'In your own words is fine.',
   ph:'Operations coordinator, student, own a detailing business'},

  {k:'industry', t:'dd',
   q:'What industry is that in?',
   tal:'Pick the closest one, or Other.',
   o:[['security','Security'],
      ['franchise','Franchise ownership'],
      ['retail','Retail'],
      ['food','Food and hospitality'],
      ['trades','Trades and construction'],
      ['healthcare','Healthcare'],
      ['logistics','Transportation and logistics'],
      ['sales','Sales'],
      ['education','Education'],
      ['technology','Technology'],
      ['student','Student'],
      ['other','Other']],
   ph:'Tell me your industry'},

  {k:'years',
   q:'How many years have you been working?',
   tal:'Roughly is fine.',
   o:[['0','Under 1'],
      ['1','1 to 3'],
      ['3','3 to 7'],
      ['7','7 to 15'],
      ['15','15 or more']]}
];

/* the option list for a step (every remaining question's `o` is a plain array;
   the band-branch resolution went with the quiz questions) */
const obOpts = (s) => s.o || [];
/* and its heading — a plain string now that no question branches its title */
const obTitle = (s) => s.q;
/* attribute-safe value for the free-text fields (Q3, and Q4's "Other") */
const obAttr = v => (v || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/* HOW MANY STEPS THERE ARE, DERIVED. The spine, the "N of 5" figure and the
   last step's index all read this, so adding a question is one row in `OB_Q`. */
const OB_N = OB_Q.length;
/* step 0 is the welcome, 1..OB_N are the questions, OB_N+1 is the read-back */
const obLast = () => OB_N + 1;

/* WHETHER THE CURRENT STEP HAS BEEN ANSWERED. A radio needs `S.ob[k]`; a text
   field needs a non-blank value; the dropdown always shows a value (dd() defaults
   to its first option) so it is ready unless "Other" is chosen, which then needs
   its own text (`S.ob[k+'Other']`). */
function obReady(){
  const s = OB_Q[S.obStep - 1];
  if(!s) return true;
  if(s.t === 'text'){ const v = S.ob[s.k]; return !!(v && v.trim()); }
  if(s.t === 'dd'){
    const chosen = S.ddVal['ob-' + s.k] || obOpts(s)[0][1];
    if(chosen === 'Other'){ const o = S.ob[s.k + 'Other']; return !!(o && o.trim()); }
    return true;
  }
  return !!S.ob[s.k];
}

/* ==========================================================================
   THE PANEL

   Tal's mark, Tal's line for this step, and the spine. `.ob-brand` is added to
   §27's, §40's and §53's `:is(.tal-panel, .ask-thread)` host lists rather than
   restating the mark here — one token in three layers, at identical
   specificity, against a restatement that would have been forty lines and
   would have drifted the first time §53 changed the mark again. CLAUDE.md's
   note on un-scoping is the reason it is added to the list rather than taken
   out of it: dropping a class from those selectors is a specificity change,
   and §27.1's own `.tal-mk` rules are what would win.

   THE SPINE IS FIVE ROWS AND IT IS NOT §56's `.stps`. That component is the
   journey — four stages of a ninety-day arc, each with a state word under it —
   and it is placed by a render pass into a head band that does not exist here.
   This is a progress spine for one sitting, so it is its own three states and
   nine rules.
   ========================================================================== */
/* THE SPINE'S WORDS ARE NOT THE QUESTIONS. A question is a sentence and the
   spine is a narrow column, so each row is the SUBJECT of its question —
   which is also what makes a completed row readable as a thing that is now
   known rather than as a sentence that has been said. */
/* IN THE NEW ORDER — where, industry, years, band, why, intent (Maryam, 9 Sep
   2026). One label per question, positional, so it moves with `OB_Q`. */
const OB_SPINE = ['Where you are','Who you are','What you do','Your industry','Your experience'];

/* The per-question "theme" big title (`OB_THEME`) was removed on 18 Sep 2026 —
   Maryam wanted the question itself as the heading, with no theme and no
   description line. The question resolves through `obTitle`. */

function obPanel(){
  const step = S.obStep;
  const tal = step === 0
    ? `I am Tal. I am going to be with you for the whole of this, so let me start by telling you what I already know.`
    : step > OB_N
      ? `That is everything. Here it is back, in case I heard any of it wrong.`
      : OB_Q[step - 1].tal;

  return `<div class="auth-brand ob-brand">
    <div class="tal-hero">
      ${borbMark('tal-mk lg', true)}
      <h2>Hello <b>Maryam</b>, I am Tal &#128075;</h2>
      <p>${tal}</p>
    </div>
    <ol class="ob-spine">
      ${OB_Q.map((s,i) => {
        const n = i + 1;
        const st = step > n ? ' done' : step === n ? ' on' : '';
        return `<li class="ob-sp${st}"><i class="ob-sp-m">${
          step > n ? I.checkFilled : ''}</i><span>${OB_SPINE[i]}</span></li>`;
      }).join('')}
    </ol>
    <p class="t-helper-01 auth-foot ob-foot">Nothing here is assessed and none of it sets your level. Your level comes from a 45-minute interview with a talent agent, later, if you choose to go further.</p>
  </div>`;
}

/* ==========================================================================
   STEP 0 — THE INTRO: THE BLOB ARRIVES AND SAYS GOOD MORNING

   Maryam, 3 Sep 2026, with a screen recording of a Figma Make prototype
   ("Signal — AI Native Ops"): *"Check this ui interaction in the video, I do
   not want to start with what you have designed since that is bullshit, I want
   our video blob to first animate like this with a text on bottom, 'Good
   Morning, Maryam!', first add this kinda interaction then we will move towards
   next"*.

   WHAT THE REFERENCE ACTUALLY DOES, read off frames at 3fps because the file
   is 11 seconds of one loop: a soft sphere starts small and centred on a pale
   full-bleed ground, scales up over about two and a half seconds with a slight
   OVERSHOOT and settles back, its wordmark fading in inside it; two or three
   very faint concentric rings sit outside it and drift; and a small
   letterspaced line arrives at the bottom centre a beat after the sphere has
   settled — "TAP TO BEGIN" there, the greeting here. Then it breathes.

   THREE THINGS IT DOES THAT THIS DOES NOT COPY, and each is a decision:

     THE MARK AND LABEL INSIDE THE SPHERE. Signal prints its logo and the words
     "SIGNAL INTELLIGENCE" over the sphere. §53 already refused that on our own
     chat orb, in as many words — the blob is moving footage and "three white
     chevrons flying across moving footage would be a second mark rather than a
     mark on the first". The footage IS Tal's mark. Nothing goes on top of it.

     THE LETTERSPACED CAPS. §63 §2 is that nothing in this product is set in
     capitals and the words go in the markup in sentence case. The greeting is
     the string Maryam typed, unchanged, and it is not transformed.

     THE HUE. Signal's sphere is blue-lavender on cool white. Ours is the blob,
     which is warm, so the rings are mixed from `--accent` rather than being a
     neutral hairline — a cool ring around a warm orb reads as two objects.

   IT IS FULL-BLEED AND NOT THE SPLIT CARD. Every other step is `.auth-card`'s
   two columns, and this one deliberately breaks that: the reference is one
   object on an empty ground, and a 40% panel beside a 608px card is the
   opposite composition. `obScreen()` branches on the step for that reason.

   THE WHOLE SURFACE ADVANCES. The reference says "TAP TO BEGIN" and means the
   sphere; with the greeting in that slot there is no instruction left, so the
   affordance is the screen itself rather than a button — one target, no wrong
   place to press. `data-obgo` on the wrapper is all it takes.

   AND THE OLD STEP 0 IS GONE. It was a `.kv` band of the track, the score and
   the five quiz bands under the heading "What I already know" — the screen the
   instruction calls bullshit. Nothing is lost that the flow does not say
   again: step 2's own question is assembled from `qzLow()` and reads "Your quiz
   put Coaching at 38 and Delegation at 41", which is the two rows of that
   table anybody needed. `obWelcome` is deleted rather than left uncalled.
   ========================================================================== */

/* THE GREETING IS THE STRING AS ASKED, NOT DERIVED. `Date` is available and
   three lines would make this "Good afternoon" after twelve — and it is
   deliberately not doing that: the copy was given verbatim, and a demo that
   silently says something else than the person who asked for it expects is
   worse than one that is fixed. If it should follow the clock, that is one
   `new Date().getHours()` here and nothing else changes. */
const OB_GREET = 'Good Morning, Maryam!';

/* THE BLOB IS ai4's `<video>`, ELEMENT FOR ELEMENT. `TAL_BLOB` and
   `TAL_BLOB_POSTER` are build.py's data URIs and `reduce()` is ai4's media
   query — all three are parsed before this file. Four attributes carry real
   arguments, and ai4's note is where they are made: `muted` is what makes
   `autoplay` legal, `playsinline` stops iOS taking it fullscreen, the `poster`
   is frame 0 at the same size with the same circular alpha so a reduced-motion
   reader gets the mark standing still rather than an empty box, and
   `aria-hidden` because the greeting under it is what says Tal is here.

   IT IS NOT WRAPPED IN `.tal-mk.orb`. That would be the tidy-looking move and
   it does not work: §53's `.tal-blobv` geometry is scoped to
   `.app .ask-page .tal-hero .tal-blobv`, and §40's box to a `.tal-hero` inside
   one of three named hosts — so borrowing the classes here would inherit a
   112px box written for a chat panel and a mark treatment this screen has
   already refused. §107 states the box, which is five declarations. */
const obBlob = () => `<video class="tal-blobv ob-blobv" src="${TAL_BLOB}"`
  + ` poster="${TAL_BLOB_POSTER}"${reduce() ? '' : ' autoplay'}`
  + ` loop muted playsinline preload="auto" aria-hidden="true"></video>`;

/* TWO RINGS, NOT THREE. The reference has two clearly and a third that may be
   the sphere's own falloff; two is what reads at our sizes and each one is an
   element because it has to scale and drift independently of the orb. */
/* THE GREETING IS ABOVE THE BLOB (Maryam, 3 Sep 2026: "take the good morning
   text above the blob and increase the text size"), which is a reversal of the
   reference and of the first build. Signal puts "TAP TO BEGIN" at the foot
   because it is an INSTRUCTION — a caption telling you what to do with the
   thing above it. A greeting is not a caption: it is the first thing said, so
   it comes first and the orb answers it. The markup order is the whole of the
   change; §107 §0b flips the gap from above the line to below it. */
/* ==========================================================================
   TAL SPEAKS, AND THE BARS SAY SO

   Maryam, 3 Sep 2026: *"i want this screen to speak as well after it get's
   loaded, above the blob in it's center there should be a voice bars to show
   tal is speaking."* The clip is an ElevenLabs render of the greeting;
   build.py's note over `TAL_SPEECH` is the asset half.

   THE `<audio>` IS A JS OBJECT AND NEVER GOES IN THE DOM — trap 9, in the one
   form where the trap has teeth rather than being tidy. `render()` replaces
   `device.innerHTML` outright, so an `<audio>` element written into the markup
   would be DESTROYED AND REBUILT on every paint: the clip would restart from
   zero each time anything on the page changed, and on this screen the orb's
   own entrance triggers one. A module-level `Audio` survives every render
   because nothing in the render touches it.

   AND IT IS CREATED ONCE, LAZILY. `new Audio(TAL_SPEECH)` on a 171 KB data URI
   is not free, and the other six steps of this flow never need it.
   ========================================================================== */
let obAud = null;

/* WHETHER THE BARS ARE MOVING IS THE ELEMENT'S STATE, NOT A GUESS. They are
   toggled from the audio's own `playing` / `pause` / `ended` events rather
   than from the attempt to play, because the attempt can fail — see below —
   and a screen that draws a speaking indicator over silence is lying about
   what it is doing.

   IT WRITES THE CLASS IN PLACE AND DOES NOT RE-RENDER, which is `joinArm`'s
   and `callTick`'s pattern (§81, ai10). A `render()` here would restart the
   orb's 1.5s entrance every time the clip started or stopped, so the one bit
   of state that changes mid-screen is written straight onto the element. Trap
   9 does not apply in reverse: the next full render rebuilds the bars from
   `obAud`'s live state below, so the DOM cannot drift from the audio. */
function obBars(on){
  const el = device.querySelector('.ob-bars');
  if(el) el.classList.toggle('on', !!on);
}

/* AUTOPLAY WITH SOUND IS BLOCKED UNTIL THE DOCUMENT HAS BEEN INTERACTED WITH,
   and that is a browser policy rather than a bug to work around. It is also
   the one way this is not like the blob video above: a muted `<video>`
   autoplays anywhere, and `<audio>` with sound does not. Chrome's rule is
   roughly "the user has clicked, tapped or typed in this document at least
   once", so:

     ARRIVING FROM THE VERIFY SCREEN, IT PLAYS. The reader pressed "Verify &
     Continue" to get here, which is the gesture the policy wants — which is
     also the ONLY path the product offers into this stage, so the intended
     journey speaks.

     ON A COLD RELOAD OF `#onboard/ob` IT DOES NOT, and cannot: nobody has
     touched the page. `play()` returns a rejected promise, and rather than
     swallow it this arms a one-shot listener on the first pointer or key event
     anywhere in the document and plays then. So the clip is never lost — it is
     deferred to the first thing the reader does, including the tap that leaves
     this screen.

   `catch` IS NOT OPTIONAL. An unhandled rejection from `play()` is an
   uncaught error in the console, which is exactly what `respcheck` fails a
   screen for — and it would fail every screen in the sweep, since a headless
   run has no gesture either. */
function obPlay(){
  if(!obAud){
    obAud = new Audio(TAL_SPEECH);
    obAud.preload = 'auto';
    obAud.addEventListener('playing', () => obBars(true));
    obAud.addEventListener('pause',   () => obBars(false));
    obAud.addEventListener('ended',   () => obBars(false));
  }
  if(!obAud.paused) return;
  const armed = () => {
    document.removeEventListener('pointerdown', armed, true);
    document.removeEventListener('keydown', armed, true);
    obAud.play().catch(() => {});
  };
  obAud.play().catch(() => {
    document.addEventListener('pointerdown', armed, true);
    document.addEventListener('keydown', armed, true);
  });
}

/* IT SPEAKS ONCE PER ARRIVAL, NOT ONCE PER RENDER, and that distinction is
   the whole reason this is separate from `obPlay`. The render wrapper at the
   foot of this file fires on every paint, and step 0 is repainted by more
   than arriving on it: pressing Voice, the clip ending, and — the case that
   made this necessary — coming BACK from the chat, which `askClose` does with
   a `render()`. Hooked to the render alone, a reader who opened Chat, read the
   four paragraphs and pressed back would be met by the same sixteen seconds
   from the top. Hearing a greeting twice is worse than not hearing it: the
   first time it is a product introducing itself, the second it is a page that
   has lost track of what it already said.

   `S.obSpoken` RATHER THAN A FILE-LOCAL FLAG, so `setStage` can clear it — the
   stage picker walking away and back is a genuine second arrival and should
   speak again, and that function is already where `S.obStep` is reset for the
   same reason.

   AND THE VOICE PILL IS THE WAY TO HEAR IT AGAIN, which is what makes the
   once-only rule affordable rather than a limitation: nothing is lost, it is
   just asked for. `obReplay` rewinds first, because a clip that has run to the
   end is `paused` at `duration` and `play()` from there is a no-op in some
   browsers and a restart in others — stating the rewind makes it the same
   gesture everywhere. */
/* IT WAITS FOR THE GREETING (Maryam, 3 Sep 2026: "the blob should not start
   talking before the page loads and the good morning text appears, it should
   start right with the good morning text appears").

   THE NUMBER IS §107's OWN, NOT A GUESS. `.ob-greet` animates
   `ob-greet-in 700ms ease-out 1200ms both`, so the words become visible at
   1200ms — and `OB_SAY_AT` is that 1200 stated once here rather than typed
   twice. If the entrance is retimed, these two have to move together, which is
   what the constant is for.

   IT IS CANCELLABLE, and that is the part a bare `setTimeout` gets wrong. A
   reader who presses Chat, or the orb, inside that first 1.2 seconds would
   otherwise have Tal start talking over the screen they moved to — the timer
   does not care that its screen has gone. `obHush` clears it, and every exit
   from the intro already calls `obHush`.

   `S.obSpoken` IS SET WHEN THE TIMER IS ARMED, not when it fires, so a render
   inside the delay does not queue a second clip. */
const OB_SAY_AT = 1200;
let obSayTimer = null;
function obSpeak(){
  if(S.obSpoken) return;
  S.obSpoken = true;
  clearTimeout(obSayTimer);
  obSayTimer = setTimeout(() => { obSayTimer = null; obPlay(); }, OB_SAY_AT);
}
function obReplay(){
  if(obAud) obAud.currentTime = 0;
  obPlay();
}

/* AND IT STOPS WHEN THE SCREEN DOES. Leaving the intro with the clip still
   running would have Tal talking over the first question, which is the same
   mistake as two Tal surfaces on one screen (§107's reason for having no ask
   dock here). `pause` plus a rewind, so pressing back into the intro plays it
   from the beginning rather than from wherever it was cut off. */
function obHush(){
  /* THE PENDING TIMER FIRST, because leaving the intro during the greeting's
     1.2s delay is the case a paused-audio check cannot see: there is nothing
     playing yet, so an early `return` would leave the clip armed to start on
     whatever screen the reader has moved to. */
  if(obSayTimer){ clearTimeout(obSayTimer); obSayTimer = null; }
  if(!obAud || obAud.paused) return;
  obAud.pause();
  obAud.currentTime = 0;
}

/* ==========================================================================
   THE BARS SIT ON THE BLOB, IN ITS MIDDLE (Maryam, 3 Sep 2026)

   "when i said add the voice bars icon above the blob i meant that on the blob
   in the middle, and this voice bars needs to be bigger than what it is right
   now." So they are inside `.ob-orb` rather than a sibling of it, absolutely
   centred over the footage, and §107 §0c sizes them off the orb.

   THE FIRST BUILD READ "above the blob" AS A POSITION IN THE COLUMN and put
   them between the greeting and the orb. That is a defensible reading of the
   words and the wrong one: the bars say TAL IS SPEAKING, and the blob is Tal,
   so an indicator floating above it is a label for the thing rather than the
   thing showing its own state. Over the centre it is the orb that is talking.

   THEY GO OVER THE FOOTAGE, WHICH DECIDES THE COLOUR. The blob's middle is a
   pale peach — measured around #fbeee6 — so `--accent` reads on it where white
   would disappear into the highlight. `z-index:2` puts them above the video
   (0) and the gloss ring (1). */
/* THIRTEEN BARS — five, then nine (Maryam, 3 Sep 2026: "increase the voice
   bars count, like add 4 more lines"), then thirteen (4 Sep: "add more voice
   bars like 4 more to these while tal is talking").

   `OB_BARS` IS THE COUNT IN ONE PLACE AND THAT IS LOAD-BEARING, because §107
   §0c states a resting height AND an animation delay per bar — thirteen of
   each. A count living only in this `repeat()` would drift from them silently:
   too few and the last delays match nothing, too many and the extra bars fall
   back to the base height with no phase of their own, which renders as a row
   that is animated in the middle and dead at one end.

   THE PILL's OWN GLYPH STAYS AT FIVE. It is 14px wide, and thirteen 2px bars
   with their gaps would be 50px — an icon that has become a picture. */
const OB_BARS = 13;
const obBarsEl = () => `<span class="ob-bars${
  obAud && !obAud.paused ? ' on' : ''}" aria-hidden="true">${
  '<i></i>'.repeat(OB_BARS)}</span>`;

/* THE ORB IS THE TARGET AND SO IS THE FOOT CONTROL — but the whole SURFACE is
   not, any more. It was `data-obgo` on the wrapper with `role="button"`, which
   was right while the screen held three things; the foot now carries a mute
   toggle and two mode pills, and a surface-wide target with three exceptions
   punched in it is a worse contract than two named targets. Both of these are
   things a reader would press to go on: the orb because the reference invites
   pressing the sphere, and the words because they say so. */
const obIntro = () => `
  <div class="ob-stage">
    <p class="ob-greet">${OB_GREET}</p>
    <div class="ob-orb" data-obgo="1" role="button" tabindex="0"
         aria-label="Let&rsquo;s get started">
      <i class="ob-ring ob-ring-1" aria-hidden="true"></i>
      <i class="ob-ring ob-ring-2" aria-hidden="true"></i>
      <span class="ob-blob">${obBlob()}</span>
      ${obBarsEl()}
    </div>
  </div>`;

/* ==========================================================================
   THE FOOT — MUTE ON THE LEFT, THE WAY ON IN THE MIDDLE, THE MODES RIGHT

   Three asks land on one row (Maryam, 3 Sep 2026): *"Let's get started need to
   be bottom aligned"*, *"I need a speak icon on the left bottom like the
   reference so i can mute the agent as well"*, and — for the chat — *"let me
   go back to the voice with the same experience at the bottom right switching,
   do not hide it on chat."*

   SO IT IS ONE COMPONENT ON BOTH MODES rather than three floating controls.
   The reference has its speaker in the bottom-left corner and its Voice /
   Visual pair in the bottom-right, with the composition between them; putting
   all three in a single flex row with the middle slot growing gives the same
   result and cannot collide, which the absolutely-positioned version did at
   390 (the pills landed on top of the words).

   THE MIDDLE SLOT IS EMPTY ON THE CHAT, and that is why it is a slot rather
   than a member: "Let's Get Started!" is what to do with the orb, and on the
   chat the thing to do is type. The row keeps its three-column shape so the
   mute button and the pills do not move when the mode changes — the one thing
   a persistent control must not do.

   `aria-pressed` ON THE MUTE, because it is a toggle rather than an action:
   the label stays "Mute Tal" and the state is what changes, which is what a
   screen reader needs to hear. The glyph is the pair added to icons.js for
   this, at FILL 0 on the -960 grid like everything else. */
/* `top` IS THE SECOND SLOT AND IT IS THE CONVERSATION. The row grew a row —
   the thread sits in the middle COLUMN one row above the field, which is what
   makes "left aligned with the type field" a structural fact rather than a
   number kept in two places (`obThread`'s note is the argument). The pills
   stay on the last row, in the corner they were asked for, so nothing a
   reader can press moves when the conversation opens.

   THE MUTE IS ON THE VOICE SCREEN ONLY (Maryam, 3 Sep 2026: "the chat screen
   should not have the volume icon"), and the reason is §60's: it is a control
   over the SPOKEN greeting, and the render wrapper at the foot of this file
   calls `obHush` the moment the mode is chat — so in chat there is nothing
   playing for it to silence and nothing it could ever do. A dead control on a
   live surface is worse than a missing one.

   ITS SLOT SURVIVES IT, WHICH IS WHY NOTHING MOVES. §107 places the middle
   and the pills in named grid columns rather than letting them auto-flow, so
   the left track is simply empty in chat — two equal `1fr` tracks keep the
   field centred on the page whether or not there is a disc in one of them.
   Auto-placement would have slid both controls one column left instead. */
const obDock = (mid, top) => `
  <div class="ob-dock">
    ${top || ''}
    ${S.obMode === 'chat' ? '' : `<button class="ob-mute${obAud && obAud.muted ? ' off' : ''}"
            data-obmute="1" aria-pressed="${obAud && obAud.muted}"
            aria-label="Mute Tal" title="${
            obAud && obAud.muted ? 'Unmute Tal' : 'Mute Tal'}">${
      obAud && obAud.muted ? I.volumeOff : I.volume}</button>`}
    <span class="ob-dock-mid">${mid || ''}</span>
    ${obModes()}
  </div>`;

/* ==========================================================================
   THE PROGRESS BAR — Maryam, 9 Sep 2026, with a reference

   A segmented bar in the top middle of the LIVE chat, with an h3 left-aligned
   above it. One segment per question (`OB_N`), filled up to the one on screen
   (`S.obQi`) — so it fills a segment as each question arrives and is all accent
   once the read-back is reached. §107.p states the drawing: a filled segment is
   the accent, the rest are `--surface-2` (#fcfcfc) inside a `--rule` (#efefef)
   hairline, both read as tokens per §63 §14 rather than the hexes typed here.

   LIVE ONLY. The welcome has no question on screen yet, so a bar counting them
   has nothing to show; it arrives with the thread the moment the chat opens. */
function obProgress(){
  /* THE BAR DOES NOT DROP TO ZERO WHILE TAL TYPES THE NEXT QUESTION (Maryam,
     9 Sep 2026: "while tal loads the next question the top progress bar goes to
     zero, this should not happen"). `obAnswer` sets `S.obQi = 0` for the length
     of the typing beat, so a bar keyed on `S.obQi` alone empties in that gap.
     `done` is the greater of the ANSWERED count (which only ever grows) and the
     question currently on screen — so it holds through the beat and still lights
     the live question's segment the moment it arrives. */
  const answered = OB_Q.filter(q => S.ob[q.k] != null && S.ob[q.k] !== '').length;
  const done = Math.min(OB_N, Math.max(answered, S.obQi));
  return `<div class="ob-prog">
    <h3 class="ob-prog-h t-h3">You&rsquo;re almost there!</h3>
    <div class="ob-prog-bar" role="progressbar"
      aria-valuenow="${done}" aria-valuemin="0" aria-valuemax="${OB_N}">
      ${Array.from({length: OB_N}, (_, i) =>
        `<span class="ob-prog-seg${i < done ? ' on' : ''}"></span>`).join('')}
    </div>
  </div>`;
}

/* ==========================================================================
   THE PLATFORM SAYS ITS OWN NAME — Maryam, 3 Sep 2026

   *"on the top their should be a TALENTnext header to have a feel that the
   user is on TALENTnext platform."*

   THE GATE IS THE ONE PLACE IN THE PRODUCT WITH NO FRAME AROUND IT. `shell()`
   and the rail are both behind the dashboard this screen ends on, and §107's
   own note gives that as the reason ("there is nowhere else to be yet") — but
   "no rail" and "no name on the door" are two different decisions, and only
   the first was argued. A signed-up reader meeting a wordless orb has nothing
   on the screen that says whose product this is.

   IT IS `LOGO_K` AT THE APP BAR'S OWN RANK — 24px, 26 at 900 and up, §01 and
   §10's numbers — rather than `.auth-logo`'s 173/291px lockup. The auth
   panel's is a piece of the composition on a page whose left column is the
   brand talking; this is a HEADER, and the header this reader is about to
   spend ninety days looking at is the app bar's. Same asset, same size, so
   crossing into the dashboard is a change of contents and not of chrome.

   THERE IS NO HAIRLINE UNDER IT, and that is the one thing to reverse if the
   bar should read as a bar. §107's ground is one unbroken white by
   instruction; a rule across the top of the voice screen would be the only
   line on it, drawn 400px above an orb whose whole composition is one object
   on an empty field. One declaration on `.ob-head` if that is wanted.

   IT IS ON ALL THREE OF STEP 0's SCREENS, not just the chat the ask was made
   from. The three are one door in three states — the pills switch between two
   of them without leaving — so a name that appeared on one and not the others
   would read as a different page rather than a different mode. The five
   stepped screens after it already carry the brand in `.ob-brand`'s panel. */
const obHead = () => `
  <header class="ob-head">
    <span class="ob-logo"><img src="${LOGO_K}" alt="TalentNext"></span>
  </header>`;

/* ==========================================================================
   VOICE AND CHAT — the pair at the foot, and both of them do something

   Maryam, 3 Sep 2026: *"i want a voice and chat open at right bottom just like
   the image has 2 options of voice and visuals."* The reference draws a filled
   "Voice" pill and a quiet "Visual" one in the bottom-right corner; ours are
   Voice and Chat, because Visual is Signal's word for its own dashboards and
   the second thing this screen can do is talk to you in writing.

   §60's RULE DECIDED WHAT EACH ONE DOES: "a dead control on a live surface is
   worse than a missing one." A selected pill that merely reports the state it
   is already in is that dead control, so:

     VOICE re-plays the spoken greeting. Which also — and this is the useful
     part rather than a side effect — IS THE ANSWER TO THE AUTOPLAY POLICY.
     `obSpeak`'s note explains that a cold reload of this screen cannot play
     audio until the reader has interacted with the document. Pressing Voice
     is that interaction AND the request, in one gesture, so the fallback stops
     being an invisible deferred listener and becomes a control that says what
     it will do.

     CHAT opens the real thread. Not a chat-shaped screen of this file's own —
     `askView` is the product's chat experience and `S.thread` is its state, so
     this seeds the first turn and hands over.

   THE VOICE PILL'S GLYPH IS THE SAME FIVE BARS AS THE INDICATOR, at a smaller
   size, rather than a new icon. Two reasons: the pill and the thing it
   controls read as one object, and trap 7 is avoided entirely — Material
   Symbols has no equalizer at the Rounded cut we hold, so a new mark would
   have meant either a filled-cut outlier or a drawn one. `I.chat` is already
   Maryam's traced mark and needs nothing.

   THEY ARE ON THE INTRO ONLY. The chat has its own way back (`askClose`, which
   the ask page's own band draws), and a mode switch floating over a
   full-screen conversation would be chrome on top of chrome. */
/* THE SELECTED PILL IS DERIVED FROM `S.obMode`, NOT HARDCODED — trap 9, and
   it shipped hardcoded for one build. Voice carried a literal `on` class, so
   opening the chat left the switch claiming you were in voice mode: a control
   that reports the state you just left. `aria-pressed` says the same thing to
   a screen reader, which is what makes the pair a switch rather than two
   buttons that happen to sit together. */
const obModes = () => {
  /* HIDDEN — the voice flow is off (Maryam, 9 Sep 2026), so the switch between
     two modes has only one mode to point at and is not drawn. §107 places the
     dock's middle and pill columns by name, so an empty `.ob-modes` slot leaves
     the composer centred rather than sliding it. Restore by deleting this line. */
  return '';
  const m = S.obMode === 'chat' ? 'chat' : 'voice';
  return `
  <div class="ob-modes" role="group" aria-label="How Tal talks to you">
    <button class="ob-mode${m === 'voice' ? ' on' : ''}" data-obmode="voice"
            aria-pressed="${m === 'voice'}">
      <span class="ob-mode-bars" aria-hidden="true">${'<i></i>'.repeat(5)}</span>
      <span>Voice</span>
    </button>
    <button class="ob-mode${m === 'chat' ? ' on' : ''}" data-obmode="chat"
            aria-pressed="${m === 'chat'}">${I.chat}<span>Chat</span></button>
  </div>`;
};

/* ==========================================================================
   WHAT TAL SAYS IN WRITING — Maryam's copy, 3 Sep 2026, verbatim

   Four paragraphs, and they are the SAME greeting the voice clip speaks, which
   is the point: the two modes are one message in two media, not two different
   welcomes. Read together they also do the job the old step 0 was trying to do
   and the intro cannot — they say who Tal is, what is about to happen, and how
   long it will take, which is the reassurance the consultant call opened with.

   IT ENDS ON A QUESTION AND THAT IS WHY THE THREAD IS THE RIGHT SURFACE.
   "Shall we get started?" wants an answer, and a bubble in a conversation is
   somewhere an answer can go. The same words under the orb would be a
   paragraph asking a question of a screen with one button on it.

   THE CASING IS MARYAM'S IN BOTH PLACES AND THE TWO DIFFER BY ONE LETTER —
   the intro's `OB_GREET` is "Good Morning, Maryam!" and this opens "Good
   morning, Maryam!". Both are quoted as typed rather than normalised, because
   silently changing supplied copy is how a demo comes to disagree with the
   brief it was written from. Worth deciding once and applying to both.
   ========================================================================== */
const OB_CHAT = [
  /* "Welcome to TALENTnext, Maryam!" (Maryam, 9 Sep 2026), replacing "Good
     morning, Maryam!". Kept EXACTLY as supplied — the wordmark casing is hers,
     and the note above is explicit that supplied copy is not silently
     normalised (that is how a demo comes to disagree with its brief). */
  'Welcome to TALENTnext, Maryam!',
  'I&rsquo;m Tal, your guide throughout your TALENTnext journey.',
  'Before we get started, I have a few quick questions to learn more about you and personalize your experience.'
];

/* THE FOURTH PARAGRAPH BECAME THE CONTROL — 3 Sep 2026, and the two halves of
   that instruction only make sense together. Maryam asked for *"the 'Shall we
   get started?' should be 'Let's get started!'"* and, in the same breath, that
   the chat's "Let's Get Started!" take *"same font size same color same
   formatting as of we have on the voice screen"*.

   Read as two edits they collide: the message would end on "Let's get
   started!" with a control directly under it saying "Let's Get Started!" —
   the same five words twice, one line apart, differing only in case. So they
   are one edit. The line that asked the question is now the thing that answers
   it, which is also what the sentence was doing: "Shall we get started?" is a
   question with exactly one answer available on the screen, and a question
   whose only answer is a button is better drawn AS the button.

   IF THAT READING IS WRONG the fix is one row back in this array and one
   `data-obstart` span in `obChatScreen`. */

/* OPENING THE CHAT IS TWO STATEMENTS NOW, AND IT USED TO BE FOUR.

   THE THREAD IS SEEDED BEFORE `S.askOpen`, which is the reverse of `askOpen`'s
   own sequence and is correct here for the opposite reason. That function asks
   a question and its note explains why the ask must come AFTER the render —
   `ask()` renders, and until `askOpen` is true that render draws the page you
   are still on. Nothing is being asked here: Tal speaks first, unprompted, so
   the turn is pushed straight onto `S.thread` and the single render that
   follows finds it already there. No `ask()`, so no typing dots and no
   `TAL_ROUTES` lookup for a question nobody asked.

   `ASK_FRESH` IS SET SO THE PAGE MAKES ITS ENTRANCE. `placeAsk` reads it once
   and clears it; without it the thread appears with no transition, which on the
   one screen that is a deliberate mode change reads as a failed navigation.

   AND IT IS PUSHED ONLY ONCE. Pressing Chat, going back and pressing it again
   would otherwise stack four more paragraphs under the first four. */
function obChat(){
  obHush();
  S.obMode = 'chat';
  render();
}

/* ==========================================================================
   THE CHAT IS THIS SCREEN'S OWN, AND THAT REVERSES ONE BUILD

   Maryam, 3 Sep 2026: *"when i open the chat, do not show this ui that you are
   showing, it needs to be better than this"*, with two reference frames.

   THE FIRST VERSION HANDED OVER TO `askView` and the reasoning was sound —
   one conversation surface, one `S.thread`, no second chat to keep in step. It
   was also the wrong surface for this moment, and the reference says why: that
   page is a MESSAGING screen. It opens with a back arrow and a titled band,
   sets the thread hard against the left rail, and frames every turn as a chat
   bubble — the shape you want on the twentieth message and not on the first.
   The reference is a centred column with the orb at the top of it, the message
   read as prose rather than as a bubble, and one composer at the foot: an
   assistant introducing itself, not an inbox.

   SO WHAT IS SHARED IS `S.thread` AND NOTHING ELSE. The turns live in the same
   array the rest of the product uses, `ask()` still drives them and Tal's
   routes still answer, so nothing about the conversation is a copy — only the
   drawing is this screen's. That is the same split §51 makes: the ask PAGE is
   its own composition over the same thread the panel used.

   AND THE MODE IS `S.obMode`, NOT `S.askOpen`. Reusing that flag was what let
   `placeAsk` build into this screen; with the composition our own, borrowing
   it would mean fighting that pass for the same `.main` on every render. A
   separate word also states the truth: this is the gate in its chat mode, not
   the product's ask page opened from the gate. ai4's guard goes back to
   skipping this stage outright.

   TAL'S TURNS ARE PROSE WITH A MARK, THE READER'S ARE A FILLED BUBBLE, which
   is reference 4 exactly — and it is the right asymmetry rather than a copied
   one: Tal is the voice of the screen and its words are the content, while
   what the reader said is a quoted interjection. §63 §45 inks both.

   THE ORB AT THE TOP IS THE SAME ELEMENT, SMALLER, AND IT KEEPS THE BARS. So
   the two modes are one object in two states rather than two screens — press
   Voice and the orb grows back to the middle of the frame. It is `.ob-orb-sm`
   on the same markup, which is why the bars, the rings and the footage need no
   second copy.
   ========================================================================== */
const obChatMsg = (m) => m.who === 'me'
  ? `<div class="ob-m ob-m-me"><span class="ob-m-b">${m.html}</span></div>`
  : `<div class="ob-m ob-m-tal">
       <span class="ob-m-mk">${obBlob()}</span>
       <div class="ob-m-t">${
         m.q ? obChatQ(m.q) : m.done ? obChatDone() : m.html}</div>
     </div>`;

/* ==========================================================================
   THE QUESTIONS RUN IN THE CHAT — Maryam, 3 Sep 2026

   *"on this to get started, the agent will asked the first question then,
   after that the chat will start."* So "Let's Get Started!" is not a route to
   the stepped screens any more — it is the first turn of a conversation, and
   the five questions `OB_Q` already holds are what that conversation is.

   A TURN IS `{who, q}` OR `{who, html}`, AND THE FIRST SHAPE IS THE WHOLE
   TRICK. A question turn stores its INDEX, not its markup, so the options are
   emitted at render only for the question that is currently live — trap 9,
   and the reason it matters here: an answered question must stop being
   answerable, and baking four buttons into a string leaves them clickable
   three turns later. Past questions render as Tal's words alone.

   THE FLOW IS THE STEPPED SCREENS' FLOW, NOT A SECOND ONE. `OB_Q`, `obTitle`,
   `obOpts` and `S.ob` are all shared, so the branch at question 3 (its four
   options differ for Coaching and for Delegation) works here for free, and an
   answer given in the chat is the same answer the read-back reads. Two
   surfaces, one set of questions — which is the whole reason the questions
   were data rather than markup in the first place.

   THE FIFTH IS FREE TEXT AND THE COMPOSER IS WHERE IT GOES, which is what
   makes the field on this screen more than decoration.
   ========================================================================== */

/* TAL ASKS. The turn carries the index; `obChatQ` below draws it. */
function obAsk(i){
  S.obQi = i;
  S.thread.push({who:'tal', q:i});
}

/* ==========================================================================
   TAL TAKES A BEAT BEFORE IT ANSWERS — Maryam, 3 Sep 2026

   *"whenever i click on any answer, their is no nice interaction like tal
   typing, or a smooth message send."* And there was none: `obAnswer` pushed
   the reader's turn and Tal's next question in the same statement, so both
   arrived in one paint. Two turns of a conversation appearing simultaneously
   is not a fast assistant, it is a form validating.

   `TAL_BEAT` IS THE PRODUCT'S OWN NUMBER AND IS NOT RE-PICKED HERE. views.js
   states 1400ms once for exactly this reason — "every surface Tal answers on
   takes the same beat; two different speeds would be two different
   assistants" — and this is a fifth surface, not a special case. Five
   questions at 1.4s is seven seconds of the ninety-day gate, spent saying
   that somebody is on the other end.

   `S.typing` IS THE SAME FLAG THE REST OF THE PRODUCT USES, so `obThread`'s
   dots are `.ai-stream` — the same three, at the same rhythm, in the same
   place a reply is about to appear.

   IT GUARDS ITSELF AT BOTH ENDS RATHER THAN NEEDING A CANCEL PATH. The
   `clearTimeout` stops a second press stacking two questions, and the check
   inside the callback is what makes leaving the screen mid-beat safe: the
   stage picker, the Voice pill and `setStage`'s own reset can all fire inside
   those 1.4 seconds, and a question pushed onto a thread nobody is reading
   would surface later as a conversation that answered itself. Trap 9 in its
   timer form — `joinArm` and `callTick` take the same shape. */
/* HOW LONG THE WELCOME TAKES TO LEAVE. Stated here rather than typed into the
   handler because §107 §0g animates for exactly this long, and the two have to
   move together — a fade that outlasts the timer is a screen that jumps at the
   end of its own transition. */
const OB_LEAVE = 220;
let obTimer = null;
function obSay(fn){
  clearTimeout(obTimer);
  S.typing = true;
  render();
  obTimer = setTimeout(() => {
    obTimer = null;
    S.typing = false;
    if(S.stage !== 'onboard' || !S.obChatOpen) return;
    fn();
    render();
  }, TAL_BEAT);
}

/* AND THE READER ANSWERS. One function for all four tap questions, because
   `OB_Q` already says which key each one writes.

   `band` CLEARS `why` HERE TOO, and it has to be stated again rather than
   inherited: the stepped screens clear it in their own click handler, and a
   reader who answers Coaching in the chat after answering Delegation would
   otherwise carry an option that is not in the new list. Same bug, second
   surface — which is the cost of two front ends over one record, and is why
   the check lives beside the write in both. */
/* THE ANSWER LANDS FIRST AND ALONE, and Tal replies a beat later — `obSay`'s
   note is the argument. `S.obQi` moves inside the callback with the turn it
   describes, so the options on the question just answered disappear on the
   paint that shows the answer, and the next question's arrive with it. */
function obAnswer(k, v){
  if(k === 'band' && S.ob.band !== v) S.ob.why = null;
  S.ob[k] = v;
  const s = OB_Q.find(x => x.k === k);
  const hit = obOpts(s).find(o => o[0] === v);
  S.thread.push({who:'me', html: hit ? hit[1] : v});
  const next = S.obQi + 1;
  S.obQi = 0;
  obSay(() => {
    if(next > OB_N){ S.obQi = OB_N + 1; S.thread.push({who:'tal', done:true}); }
    else obAsk(next);
  });
}

/* ==========================================================================
   A LIVE QUESTION IS A PANEL; AN ANSWERED ONE IS A SENTENCE

   Maryam, 3 Sep 2026, with a Claude screenshot: *"the question you are asking
   are just quick tabs i want experience like claude do… The question you asked
   should have a block like Claude with each option and their should be a
   little desc below each option."*

   THE PILLS WERE THE PROBLEM AND THE WORD FOR IT IS "TABS". A row of four
   hairline pills is a filter strip — four things of equal, unexplained weight
   that you flick between — and these are four readings of the reader's own
   situation, one of which decides which agent they meet. The panel gives each
   one a line of its own, a number, and a sentence saying what it means, which
   is what turns four labels into four things you can actually choose between.

   WHAT IT TAKES FROM THE REFERENCE: the bordered block, the question as its
   own heading inside it, the numbered chips, the description under each label,
   and the hairline between rows. What it does NOT take is three controls —
   the `<` `>` pager, the `X`, and the pencil "Something else" row — and each
   omission is §60's rule rather than a simplification:

     THE PAGER AND THE CLOSE HAVE NOWHERE TO GO. A past question in this thread
     is history that already has its answer printed under it, so a `<` would
     step back into a turn that cannot be re-opened, and an `X` would dismiss a
     question with no way to get it back. `N of 5` stays, because a COUNT is
     the useful half of a pager and it is the one thing the reader wants from
     it — how much of this is left.

     THE PENCIL ROW IS THE COMPOSER. Stated in the instruction and stated again
     in `OB_Q`'s note; the field under the panel is live on every question.

   >>> THE FREE QUESTION'S OWN PANEL IS DELETED WITH THE QUESTION (3 Sep 2026),
   and its argument is kept because it is a general one. That question had two
   bare paragraphs over a composer while the four around it had a block of
   pressable rows, so a reader with nothing to add had exactly one way past it:
   a 40px arrow in the corner of a field they had not typed in. It read as a
   dead end and it is where this flow was actually stopping. The lesson is the
   `.ob-qp-skip` row that answered it — **if a question is ever optional again,
   the way to skip it is a ROW in the panel, not the arrow.** `.ob-qp-o` is the
   shape; the dash in the chip rather than a numeral is what stopped it reading
   as option one of one.

   THE HEADING MOVES INSIDE THE PANEL WHEN IT IS LIVE AND COMES BACK OUT WHEN
   IT IS NOT, which is the one structural decision here. A live question is an
   OBJECT — a thing with a border, a count and a list — and an answered one is
   a line Tal said, with the reply beneath it. Keeping the panel around a
   question that can no longer be answered would leave a framed dead form in
   the middle of a conversation, which is exactly what the old pills got right
   by disappearing. */
const obChatQ = (i) => {
  const s = OB_Q[i - 1];
  if(i !== S.obQi)
    return `<p class="ob-q-tal">${s.tal}</p><p class="ob-q-ask">${obTitle(s)}</p>`;
  return `<p class="ob-q-tal">${s.tal}</p>
  <div class="ob-qp">
    <div class="ob-qp-h">
      <p class="ob-qp-t">${obTitle(s)}</p>
      <span class="ob-qp-n">${i} of ${OB_N}</span>
    </div>
    ${obOpts(s).map(([k,l,d], n) => `<button class="ob-qp-o" data-obans="${s.k}:${k}">
      <span class="ob-qp-i">${n + 1}</span>
      <span class="ob-qp-b"><span class="ob-qp-l">${l}</span>${
        d ? `<span class="ob-qp-d">${d}</span>` : ''}</span>
    </button>`).join('')}
  </div>`;
};

/* ==========================================================================
   THE CLOSING TURN IS THE ROUTE, NOT A RECEIPT — Maryam, 3 Sep 2026

   *"the last tal response should guide me about my steps I have to go through
   on talentnext to achieve what i am looking for, and a button at the end of
   'Continue to TALENTnext'."*

   IT USED TO SAY "Here it is back, in case I heard any of it wrong" AND OPEN
   THE READ-BACK, which answered a question the chat had already answered. In
   the stepped flow the read-back earns its place — five screens went past one
   at a time and the reader cannot see what they said. In the chat every answer
   is still on screen, in their own words, in a bubble they can scroll to. So
   the last thing Tal says was spending itself on a correction the surface
   already offers, on the one turn that should be pointing forward.

   WHAT IT SAYS INSTEAD IS THE JOURNEY, AND IT OPENS ON WHAT THEY ASKED FOR.
   `OB_WANT_NEXT` is one sentence per answer to question 4 — the question whose
   stated reader is "which of the enrolment offer's four figures leads" — so
   the plan is framed by the thing they said they came for rather than by the
   product's own running order.

   THE FOUR STEPS ARE THE PRODUCT'S ACTUAL SHAPE and every figure in them is
   one another screen already states: 45 minutes and recorded (`CALL_ROW.iv`,
   `REC[k].mins`), the 24-hour turnaround (`V.booking`'s own legal line), 13
   chapters (`CH`), a cohort of ten (`COHORT_SIZE`), and the re-interview at
   the end (`V.transcript`, the `promoted` stage). Nothing here is a promise
   the build does not draw somewhere — §74's rule, on the turn most tempted to
   break it.

   IT ALSO ABSORBS THE READ-BACK'S RECOMMENDATION, which is what makes losing
   that screen cheap rather than lossy. `obFit()` is called unchanged — the
   candidate's own words beside the agent's own claim, no percentage — so the
   one thing the read-back said that the chat had not is said here.

   AND `data-obdone` IS THE BUTTON, WHICH IS THE WHOLE POINT OF THE LABEL. It
   sets `S.recKey` and calls `setStage('new')`, so "Continue to TALENTnext"
   continues to TALENTnext. Routing it at `obLast()` would have put another
   gate screen with another button behind a control that says it is leaving.

   >>> `obReadback` IS NOW REACHED BY NOTHING FROM THE CHAT, and that is worth
   saying out loud rather than discovering. It is still in the build, still at
   step 6, still reachable from the stepped screens' own "See what I heard" and
   from `#onboard` with `S.obStep` set — and the stepped screens are themselves
   only reached from its "Change" buttons, so the two now form a loop with one
   way in. Left rather than deleted because taking it out takes `obHeard`,
   `obLabel`, `OB_PICK`'s only other reader, `obEsc`, §107's `.ob-heard` /
   `.ob-hr` / `.ob-rec` families and §63 §45's six rules with it — a screen's
   worth of deletion this ask does not name. `V.welcome` is the same case and
   CLAUDE.md's rule for it holds here: say so before deleting it. To put it
   back in the flow, this button carries `data-obgo` at `obLast()` again —
   one attribute, and the read-back's own "Go to my dashboard" is then the
   control that leaves.
   ========================================================================== */

/* THE FOUR STEPS ARE `JRN_AI`'s AND THE SECOND LINES ARE STATED HERE.

   THE LABELS ARE LOOKED UP, NEVER TYPED. `JRN_AI` (views.js) is the four words
   the dashboard's own "Your journey so far" prints, and this list is the same
   list one screen earlier — so it reads them rather than copying them. A fifth
   step, or a renamed one, moves both.

   `journey()` ITSELF CANNOT BE CALLED HERE, WHICH IS WHY THE STATES ARE
   LITERAL. That function switches on `S.stage`, and the stage is still
   `onboard` while this turn is drawn — it would fall through to `default` and
   return the `assessed` list, which has the interview already signed. What
   this turn is describing is the state the reader is about to be IN, which is
   the `new` stage's row: quiz done, interview open, two ahead. The second
   lines are that stage's `sec` strings said in the second person, because a
   diary entry ("Not booked yet &middot; 45 minutes") is not a sentence. */
const OB_JRN = [
  ['done', 'You have taken it. Explorer track.'],
  ['on',   'You are here. 45 minutes with a talent agent, and it is what sets your level.'],
  ['',     'Locks in your cohort and your price.'],
  ['',     '13 chapters, one a week.']
];

/* THE JOURNEY IS THE QUESTION PANEL WITH ITS ROWS STILL, and reusing that
   shape is the argument for it: the reader has just answered four numbered
   lists in a bordered block, so a fifth block in the same shape reads as the
   last item of the same conversation rather than as a new screen. `.ob-qp-r`
   is `.ob-qp-o` with the button taken out — no cursor, no hover, no
   `data-obans` — because these four are being told to you rather than chosen
   between.

   THE COUNT IN THE HEADER IS DERIVED THE WAY `jrnList` DERIVES ITS PILL —
   the index of the `on` row — so "Step 2 of 4" cannot disagree with which row
   is lit. */
/* >>> THE MARK IS THE STATE, AND IT IS `jrnList`'s OWN THREE GLYPHS (Maryam,
   4 Sep 2026: "instead of these icons with each step, please use the icons we
   are using on the dashboard steps"). A tick for done, an hourglass for the
   step you are standing on, a clock for one still ahead — `I.checkFilled` /
   `I.hourglass` / `I.time`, in that order, which is exactly what views.js
   emits for the same four rows one screen later.

   THE NUMERALS WERE THE MISTAKE AND THEY CAME FROM THE WRONG COMPONENT. This
   panel borrows the question panel's row, and a question's rows really are
   numbered — four things you pick ONE of, where the numeral is a reading
   order. A journey is four things that happen in sequence and each has a
   STATE, so the same column has to say done / here / ahead rather than 1 / 2 /
   3 / 4. §70's own note makes this call for the dashboard in as many words:
   "the mark is the state, not the subject."

   IT IS `.ob-jr-ic` AND NOT `.ob-qp-i`, so the chip's ground goes with the
   numeral. A bare glyph is what the dashboard draws and what §29 and §72
   settled on product-wide; a coloured mark inside a grey chip would be the
   box-in-a-box those layers took out. */
const OB_JRN_IC = {done:'checkFilled', on:'hourglass'};
const obJourney = () => {
  const now = OB_JRN.findIndex(([st]) => st === 'on') + 1;
  return `<div class="ob-qp ob-plan">
    <div class="ob-qp-h">
      <p class="ob-qp-t">Your journey</p>
      <span class="ob-qp-n">Step ${now} of ${OB_JRN.length}</span>
    </div>
    ${OB_JRN.map(([st,d], n) => `<div class="ob-qp-r${st ? ' ' + st : ''}">
      <span class="ob-jr-ic">${I[OB_JRN_IC[st] || 'time']}</span>
      <span class="ob-qp-b"><span class="ob-qp-l">${JRN_AI[n]}</span><span class="ob-qp-d">${d}</span></span>
    </div>`).join('')}
  </div>`;
};

/* ==========================================================================
   THE CLOSING TURN — Maryam, 3 Sep 2026, and this is the third version

   *"do not ask any question about agent or what so ever instead in the last
   response, you need to tell the user that you have got enough information to
   get better understanding about your interests and pain points and now they
   have to continue to talentnext platform and they are on the second step of
   the journey and give them a button 'Find an Agent'."*

   SO THE AGENT IS OFF THE TURN ENTIRELY. The version before this closed on
   `obFit()` — the candidate's words beside the agent's own claim — plus a line
   about who was on the dashboard, which was the read-back's recommendation
   folded in and is exactly what the instruction rules out. Naming an agent
   here answers a question the reader has not been asked yet, and the button's
   own word for what happens next is FIND: the choosing is the dashboard's job
   and the gate should hand over rather than pre-empt it.

   WHAT IT SAYS IS THE THREE THINGS THE INSTRUCTION NAMES, in that order: I
   have enough, here is where you are, here is the way in.

   `S.recKey` IS STILL SET ON THE WAY OUT AND THAT IS NOT A CONTRADICTION. The
   instruction is about what this TURN says; the key is silent, and it is what
   makes the agent waiting on the dashboard the one their answers point at
   rather than views.js's hardcoded default. Take that line out and "Find an
   Agent" lands on a recommendation the five questions had no bearing on, which
   is the loop this whole gate exists to close.
   ========================================================================== */
const obChatDone = () => `
  <p>That is everything I needed. I have enough now to understand what you are after and where it is getting stuck.</p>
  <p>From here it is the platform's turn, and you are already on step two.</p>
  ${obJourney()}
  <div class="ob-opts"><button class="ob-opt ob-opt-go" data-obdone="1">Find an Agent</button></div>`;

/* ==========================================================================
   THE CHAT IS TWO SCREENS AND THEY WERE ONE — Maryam, 3 Sep 2026

   With the built page in front of her: *"these are two different screen
   interactions merged."* And they were. `S.obChatOpen` was APPENDING the
   thread to the welcome, so a reader who pressed Let's Get Started kept the
   orb, the greeting and the three paragraphs of introduction standing above a
   conversation that had already begun — a screen doing two jobs, and the
   second one starting halfway down it.

   SO THE FLAG SWITCHES THE SCREEN RATHER THAN GROWING IT, and the three
   screens of the gate's front door are now stated as three:

     VOICE — the orb, the greeting spoken, "Let's Get Started!" at the foot.
     Pressing it crosses to the third screen, already started.

     CHAT, NOT STARTED (`obChatScreen`) — the same welcome in writing: orb,
     greeting and description in the middle of the page, "Let's Get Started!"
     at the end of the description, and a DISABLED field at the foot, because
     nothing has been asked yet. Same purpose as the voice screen, different
     medium — which is the whole reason the two share `OB_CHAT`'s words with
     the clip and share this file's dock.

     CHAT, CONVERSATION STARTED (`obThread`) — no orb, no greeting, no
     welcome. It opens on Tal's first question and nothing else.

   THE WELCOME IS NOT HIDDEN, IT IS NOT RENDERED, and the old note here argued
   the other way: the opening message had to stay at the top of the thread
   "because scrolling back to an introduction that has vanished is the one
   thing a conversation must not do". That is true of a MESSAGE and this is
   not one — it is the screen that stood before this one, exactly as the voice
   screen's spoken greeting is not a turn either. Neither mode keeps its door
   inside the room.
   ========================================================================== */
const obChatScreen = () => `
  <div class="ob-stage ob-stage-chat">
    ${''/* THE SMALL ORB CARRIES NO BARS (Maryam, 3 Sep 2026: "remove the voice
          icon from the blob"). It is right on the voice screen, where the orb
          IS the speaking thing and the clip is playing; in chat Tal is writing
          rather than talking, so an indicator of speech over a silent mark is
          a control reporting a state the screen is not in. `obBarsEl` is not
          called here — the class is simply absent, which is cheaper than
          hiding it and means the `em` base has nothing to resolve. */}
    <div class="ob-chat-head">
      ${''/* THE WELCOME ORB IS THE `borb` COMPONENT (Maryam, 18 Sep 2026), the
            same orb the chat hero and the voice intro use, not the older
            `obBlob()` video. `live` so it breathes like a hero mark; §133 sizes
            it into the `.ob-orb-sm` slot. */}
      <div class="ob-orb ob-orb-sm">${borbMark('tal-mk', true)}</div>
      <div class="ob-chat-lede">${OB_CHAT.map(t => `<p>${t}</p>`).join('')}</div>
      ${''/* IT IS `.ob-go`, THE SAME ELEMENT THE VOICE SCREEN DRAWS — not a
            restyled button. "Same font size same color same formatting" is
            satisfied by emitting the same class rather than by copying three
            declarations onto a `.btn-p`, which is how two controls come to
            drift apart. §44 types it and §107 gives it the accent underline;
            both apply here with nothing stated.

            IT SITS AT THE END OF THE DESCRIPTION, which is where the
            instruction puts it and is also §29.10's rule — the control is on
            the thing it acts on. The dock's middle slot holds the disabled
            field in this mode, not this. */}
      <div class="ob-chat-act"><span class="ob-go" data-obstart="1" role="button" tabindex="0">Let&rsquo;s Get Started</span></div>
    </div>
  </div>`;

/* ==========================================================================
   THE THREAD — AND IT LIVES IN THE DOCK, WHICH IS THE ALIGNMENT

   Maryam, 3 Sep 2026: *"this question placement is right above the type field
   and left aligned with the type field."*

   THE OBVIOUS BUILD IS A CENTRED COLUMN IN `.ob-stage` AND IT CANNOT HOLD.
   The field is the dock's MIDDLE GRID TRACK — `1fr minmax(0,720px) 1fr` — so
   its left edge is wherever that track lands, and that depends on the width
   of the two outer tracks, which hold the mute disc and the two pills. A
   separate `max-width:720px; margin:0 auto` column agrees with it only while
   the middle track is at its 720 cap. Measured at a 744 frame the two
   disagree by ~200px, because there the pills force the outer tracks wide and
   the field is ~300 while a free column would be ~680.

   SO THE THREAD IS A CELL OF THE SAME GRID — `grid-column:2`, one row above
   the field. Alignment is then structural: there is no second measure to keep
   in step, and a longer pill label moves both together or neither. `obDock`
   takes the block as an argument for exactly this reason, which is also what
   its own note already says the middle slot is for one row down.

   IT SCROLLS `column-reverse`, WHICH IS THE ONE TRICK HERE. The newest turn
   has to sit against the field and the oldest has to stay reachable, and
   `justify-content:flex-end` gives the first at the cost of the second — an
   overflowing flex-end column puts its head above the scroll origin. A
   reversed column with ONE child does both: short, the block rests on the
   bottom; long, it scrolls from the bottom with the top still there. §107 §0f
   is the drawing.

   AND IT MAKES NO ENTRANCE. This block is re-rendered by every answer, so an
   animation on it would replay on every answer — the dock's own note is the
   general rule and this is a second case of it. */
const obThread = () => `
  <div class="ob-dock-thread">
    ${''/* THE TYPING TURN CARRIES `.ob-m-typing`, AND IT IS A CLASS RATHER THAN
          A `:has()` BECAUSE OF WHAT IT IS FOR. Every other Tal turn is a block
          of text whose first line sits against the top of the 28px mark, which
          is why `.ob-m-tal` is `align-items:flex-start`; this one is a 6px row
          and top-aligning it puts the dots against the mark's crown instead of
          its middle (Maryam, 4 Sep 2026). §107 gives the cell the mark's own
          height and centres in it — one rule, keyed on the one turn that is
          not prose. */}
    <div class="ob-msgs">${S.thread.map(obChatMsg).join('')}${
      S.typing ? `<div class="ob-m ob-m-tal ob-m-typing"><span class="ob-m-mk">${obBlob()}</span><div class="ob-m-t"><div class="ai-stream"><i></i><i></i><i></i></div></div></div>` : ''}</div>
  </div>`;

/* ==========================================================================
   THE FIELD IS BACK, AND NOW IT HAS A JOB — 3 Sep 2026

   Maryam: *"please add the chat field on this page as well"*, in the same
   breath as the questions running in the chat. Those two are one change: the
   reason taking the field out was right an hour ago is the reason putting it
   back is right now.

   WHAT WAS WRONG WITH IT BEFORE: it promised a conversation the prototype
   could not have. Anything typed fell through to `TAL_ROUTES`, which answered
   "I do not have an answer for that one" with a support-desk card — on the
   screen whose whole job is to make Tal feel like a companion. The field was
   not the problem; having nothing for it to do was.

   NOW IT IS QUESTION FIVE'S ANSWER. Four of the five questions are taps and
   the fifth is free text ("Anything you want your agent to know before the
   interview?"), so the field is where that one is answered — and `OB_Q` has
   said so since the flow was written, on the stepped screens, as a
   `<textarea>`.

   THE ONE THING THAT DECIDES IT IS WHETHER THE CONVERSATION HAS STARTED, and
   that reverses what shipped (Maryam, 3 Sep 2026: *"a chat field but disabled
   since user didn't started yet"*, and of the started screen, *"user can
   always type or ask anything during this conversation"*).

     NOT STARTED — `disabled`. There is nobody to reply to yet: Tal has said
     hello and asked nothing, so a live field would invite an answer to a
     question that has not been put. This is the honest drawing of the door,
     and it is the same bounded-range distinction §76's month chevrons make
     rather than §60's dead control.

     STARTED — live, always, INCLUDING while a tap question is on screen. It
     was disabled there on the reasoning that the field could not answer that
     question and would fall through to `TAL_ROUTES`; the instruction settles
     it the other way, and the reading behind it is better: an option is a
     shortcut, not a cage, and a companion you cannot interrupt is a form. The
     options stay live on their own turn while the aside is answered, so
     nothing is lost by typing — `obChatQ` draws them for whichever turn
     `S.obQi` names, wherever it has scrolled to.

   THE PLACEHOLDER CARRIES THE DIFFERENCE, so the field never looks broken and
   never looks like the only way forward when there are four buttons above it.

   IT LIVES IN THE DOCK'S MIDDLE SLOT, which is where Maryam put it two
   instructions ago ("bottom middle aligned with the left and right items") and
   where `obDock` has been taking markup ever since.
   ========================================================================== */
const obCompose = () => {
  const off = !S.obChatOpen;
  const tap = S.obQi >= 1 && S.obQi <= OB_N;
  return `
  <div class="ob-compose${off ? ' off' : ''}">
    <input class="ob-in" id="obIn"${off ? ' disabled' : ''}
      placeholder="${off ? 'Press Let&rsquo;s Get Started to begin'
        : tap ? 'Choose an option, or type anything' : 'Reply to Tal'}"
      aria-label="Reply to Tal">
    <button class="ob-send" data-obsend="1"${off ? ' disabled' : ''}
      aria-label="Send">${I.send}</button>
  </div>`;
};

/* ==========================================================================
   THE FIELD'S EARLIER LIFE — BUILT, MOVED, TAKEN BACK, RESTORED

   It went in with the chat, then moved into the dock's middle slot ("the reply
   to tal field should be bottom middle aligned with the left and right
   items"), then came out entirely ("take back the reply to tal field. on this
   screen as well"). The argument is kept because the SLOT is still there and
   the next thing to fill it is already known.

   WHAT THE MOVE PROVED, and it is why `obDock` takes markup rather than a
   boolean: the dock's middle is whatever the current mode's way-forward is —
   the voice screen's words, the chat's black button, a field, or nothing. Each
   mode names its own middle and the mute button and the two pills never move.
   That is the shape the onboarding questions will arrive into.

   WHY REMOVING IT IS RIGHT AND NOT JUST INSTRUCTED: a free-text field on this
   screen promised a conversation the prototype cannot have. Typing anything
   fell through to `TAL_ROUTES`, which answered "I do not have an answer for
   that one" with a support-desk card — on the screen whose whole job is to
   make Tal feel like a companion. The five questions are option taps, so what
   belongs here is those, not a field.

   WHAT IS STILL LIVE: `S.obChatOpen`, the `.ob-msgs` list and `obChatMsg`'s
   two turn shapes. Pressing the black button still opens the conversation
   area; there is simply nothing to type into it yet, which is the honest state
   of a flow whose questions have not been wired in.
   ========================================================================== */


/* ==========================================================================
   THE SCREEN THAT WAS STEP 0 — DELETED, ARGUMENT KEPT

   `obWelcome()` drew the track, the quiz score and the five `SCORES` bands as
   a `.kv` band inside a `.tile`, under a lede saying the quiz came across with
   the account and would not be retaken. Two things about it were right and are
   worth not losing: every figure was READ (`qzLow` marked the two lowest so
   the chip could not disagree with the chart), and it had no heading, because
   the panel beside it already said "let me start by telling you what I already
   know" and a `<h2>` repeating that is the `ph()` / `PAGESUM` duplication this
   repo has a rule about.

   What was wrong is what the instruction says: it opened a conversation with a
   table. The intro above is the opening now.
   ========================================================================== */
/* ==========================================================================
   A QUESTION

   The options are §104's `.role-c` — a real `<label>` + `<input type="radio">`
   in a tinted block — and that is the whole of why this layer draws no option
   of its own. That component is already "radio on the left, light orange
   ground and orange ring when chosen, grey with no border when not", which is
   the same control this needs and is the state `--brand-tint-2` is reserved
   for by name (§10.29, "the candidate's own selection"). It comes free because
   the page carries `.form-page`, which is what §104 keys on.

   `name` IS PER STEP so the browser's own radio grouping cannot join two
   questions, and the `checked` attribute is written from `S.ob` on every paint
   rather than left to the input — trap 9, and §104's note says the same thing
   about `S.role`.
   ========================================================================== */
/* ==========================================================================
   THE STEPPED SURVEY (Maryam, 18 Sep 2026, with a reference)

   The onboarding questions used to be a chat thread (bubbles, a composer, a
   segmented "You're almost there!" spine). This is the replacement: one dark
   question per screen, radio pills, Back/Next, and a single progress bar pinned
   to the very top of the frame that fills as each question arrives. The `borb`
   orb sits top-left above every question so it reads as Tal asking it.

   IT REUSES THE STEP MACHINERY WHOLE. Selection is `data-ob`/`data-obv`
   (the handler sets `S.ob[k]` and re-renders); Back/Next is `obFoot()`'s
   `data-obgo` gated by `obReady()`. So this is a new SKIN over the same state,
   not a new flow — the read-back, the completion and the answer readers are
   untouched. `obChatScreen` (the welcome) still opens it; its "Let's Get
   Started" now advances to step 1 rather than opening the old chat.

   DARK, IN TOKENS. The ground is `--gray-100` and the inks are the black-card
   tokens `--on-dark` / `--on-dark-2` (the §75 recipe's own inks), so no hex is
   written and it tracks the palette. Radius stays 0 on the pills and buttons
   (our system, not the reference's rounded corners — CLAUDE.md's "build the
   reference in our components"); only the radio marks are round. */
function obSurveyScreen(){
  const s = OB_Q[S.obStep - 1];
  /* THE BAR TRACKS THE STEP, filling on Next and retreating on Previous — NOT on
     selecting an option (Maryam, 18 Sep 2026: "the top bar should fill in when I
     click on next, not when I select an option ... on going back the bar should
     also go back"). `(step-1)/OB_N` leaves question one at 0% and lands the
     completion screen at 100%; selecting re-renders the SAME step, so `to` is
     unchanged and the bar holds. `from`/`to` drive the keyframe so it animates
     (the element is recreated each render, so a transition alone cannot tween). */
  const to = Math.round((S.obStep - 1) / OB_N * 100);
  const from = S.obBarFrom || 0;
  S.obBarFrom = to;
  const prev = S.obStep > 1
    ? `<button class="btn btn-t noic ob-sv-prev" data-obgo="${S.obStep - 1}">${I.arrowLeft} Previous</button>`
    : '';
  const next = `<button class="btn btn-p noic ob-sv-next" data-obgo="${S.obStep + 1}"${
    obReady() ? '' : ' disabled'}>Next ${I.arrowRight}</button>`;
  return `<div class="ob-survey">
    <div class="ob-sv-top"><i style="--ob-from:${from}%;--ob-to:${to}%"></i></div>
    ${''/* THE BRAND ROW (Maryam, 18 Sep 2026): the wordmark top-left and
          "You're almost there!" top-right, aligned on one row under the bar. */}
    <div class="ob-sv-head">
      <span class="ob-logo"><img src="${LOGO_K}" alt="TalentNext"></span>
      <span class="ob-sv-hint">You&rsquo;re almost there!</span>
    </div>
    <main class="main"><div class="ob-sv-wrap">
      ${''/* THE QUESTION IS THE HEADING (Maryam, 18 Sep 2026: "i want the
            questions to be a heading and forget about a description") — no theme
            title, no sub-line. */}
      <div class="ob-sv-orb">${borbMark('tal-mk', true)}</div>
      <h1 class="ob-sv-title">${obTitle(s)}</h1>
      <div class="ob-sv-opts${s.t === 'text' || s.t === 'dd' ? ' ob-sv-opts-field' : ''}">
        ${s.t === 'text'
          ? `<input class="inp ob-sv-text" type="text" data-obtext="${s.k}"
               value="${obAttr(S.ob[s.k])}" placeholder="${s.ph || ''}"
               aria-label="${obTitle(s)}">`
          : s.t === 'dd'
            ? `${dd('ob-' + s.k, obOpts(s).map(o => o[1]), S.ddVal['ob-' + s.k])}${
                (S.ddVal['ob-' + s.k] || obOpts(s)[0][1]) === 'Other'
                  ? `<input class="inp ob-sv-text ob-sv-other" type="text" data-obtext="${s.k}Other"
                       value="${obAttr(S.ob[s.k + 'Other'])}" placeholder="${s.ph || ''}"
                       aria-label="Your industry">`
                  : ''}`
            : obOpts(s).map(([k,l]) => {
                const on = S.ob[s.k] === k;
                return `<label class="ob-sv-o${on ? ' on' : ''}" data-ob="${s.k}" data-obv="${k}">
                  <input type="radio" name="ob-${s.k}"${on ? ' checked' : ''}>
                  <span class="ob-sv-rad" aria-hidden="true"></span>
                  <span class="ob-sv-ot"><span class="ob-sv-ol">${l}</span></span>
                </label>`;
              }).join('')}
      </div>
      <div class="ob-sv-foot">${prev}${next}</div>
    </div></main>
  </div>`;
}

/* `obQuestion` (the old light stepped screen) was replaced by `obSurveyScreen`
   on 18 Sep 2026 and removed — `obFoot`, `obOpts` and `obTitle` all still have
   callers (the survey and the read-back). */

/* >>> `obFree` IS DELETED WITH ITS QUESTION (3 Sep 2026) AND ITS ARGUMENT IS
   KEPT, because the next control anybody types into on these screens will hit
   the same trap. `render()` replaces `device.innerHTML`, so a keystroke that
   re-rendered would destroy the field and take the caret with it; the value
   was read out of the DOM on the way past instead (`obTake`, also gone), which
   is the shape CLAUDE.md records for the leader's search field. The composer
   in the chat is the one field left and it is built the same way — read and
   cleared inside `obSend`, before the render that consumes it.

/* `obFoot` (the old shared Back/Next row) was inlined into `obSurveyScreen` on
   18 Sep 2026 — the survey needs a conditional Previous (hidden on question one)
   and content-width buttons, and the read-back has its own foot — so there is
   nothing left to share. */

/* ==========================================================================
   THE READ-BACK

   The old flow's terminal state was "A talent consultant will be contacting
   you soon to schedule some time to chat" — a dead end on somebody else's
   site. This is the thing the call was FOR: the recommendation, already made.

   AND IT IS THE CORRECTION STEP, which is the second reason it exists. Every
   line has a way back to the question that produced it, because these four
   answers become `MEMO` rows and `V.mem`'s promise is that a wrong one can be
   marked and dropped. Correcting before it is written is better than
   correcting after.

   THE MATCH IS IN WORDS, NOT IN A PERCENTAGE. `REC` carries `match:'98%'` and
   this screen deliberately does not print it: a number is a claim about how
   the answer was weighed, and nothing here weighs anything. What it prints is
   the agent's own sentence about what they assess, beside the candidate's own
   sentence about what is hard — which is the whole argument, and it is two
   quotations rather than an arithmetic.
   ========================================================================== */

/* WHICH AGENT, AND WHY THAT MAPPING. The shortlist is `REC_ORDER` — the three
   who assess Explorer candidates — and each of the three has a stated
   specialism in `AGENTS[k].bio` that this maps onto:
     coaching    -> Priya, who "will tell you plainly where you are"; plain
                    feedback is the thing somebody who does not coach has to
                    learn to give
     delegation  -> Lena, whose bio is "expect a lot of 'and then what
                    happened'", which is a handover walked step by step
     other       -> Owen, who looks for "how you decide when the information is
                    incomplete" — the broadest of the three, and the one whose
                    subject the third branch's four options all sit inside
   It is a table rather than a score because three agents and three answers is
   a table; a formula here would be arithmetic invented to look like judgement. */
const OB_PICK = {coaching:'priya', delegation:'lena', other:'owen'};
const obAgent = () => OB_PICK[S.ob.band] || REC_ORDER[0];

/* THE ANSWER'S OWN WORDS, LOOKED UP RATHER THAN RESTATED. Each row prints the
   option label out of `OB_Q`, so the read-back cannot word an answer
   differently from the button that was pressed — which is the same reason
   `bkStamp` exists for the booking. `obOpts` resolves `why`'s branch. */
const obLabel = (k) => {
  const s = OB_Q.find(x => x.k === k);
  const hit = obOpts(s).find(o => o[0] === S.ob[k]);
  return hit ? hit[1] : '&mdash;';
};

/* THE COMPLETION SCREEN (Maryam, 18 Sep 2026) — REPLACES THE READ-BACK. The
   old terminal screen recapped the six answers with a "Change" per row and named
   the recommended agent; Maryam dropped it ("I am not sure this screen is
   required") for a plain "You're all set" that shows the journey — the quiz done,
   the interview & levelling next — and hands over with "Find an Agent".

   IT IS THE SURVEY'S OWN LIGHT COMPOSITION (`.ob-survey`), so it reads as the
   last screen of the flow: the orb top-left, the bar full, the same 720 column.
   `obJourney()` is the SAME steps component the old chat's done card drew
   (`OB_JRN` + `JRN_AI`, marks by state), so the steps are not typed twice.
   "Find an Agent" is `data-obdone` — the handler still sets `S.recKey` from the
   answers and writes the three profile fields on the way to the dashboard. */
function obDoneScreen(){
  const from = S.obBarFrom || 100;
  S.obBarFrom = 100;
  return `<div class="ob-survey ob-done">
    <div class="ob-sv-top"><i style="--ob-from:${from}%;--ob-to:100%"></i></div>
    ${''/* THE WORDMARK ROW (Maryam, 28 Sep 2026: "show the logo on this screen as
          well, keep things consistent"). Same `.ob-sv-head` the survey steps carry
          — logo top-left — but NO "You're almost there!" hint: the journey is done
          on this screen, so that copy would contradict "You're all set". The row is
          `space-between`, so a lone logo sits left as it should. */}
    <div class="ob-sv-head">
      <span class="ob-logo"><img src="${LOGO_K}" alt="TalentNext"></span>
    </div>
    <main class="main"><div class="ob-sv-wrap">
      <div class="ob-sv-orb">${borbMark('tal-mk', true)}</div>
      <h1 class="ob-sv-title">You&rsquo;re all set</h1>
      <p class="ob-sv-q">That is everything I needed. Here is where you are, and what comes next.</p>
      ${obJourney()}
      <div class="ob-sv-foot">
        <button class="btn btn-p noic ob-sv-next" data-obdone="1">Find an Agent ${I.arrowRight}</button>
      </div>
    </div></main>
  </div>`;
}

/* WHY THIS AGENT, IN ONE SENTENCE, AND BOTH HALVES ARE QUOTED RATHER THAN
   ASSERTED. The first clause is the candidate's own chosen option and the
   second is the agent's own claim about what they assess — so the page puts
   two existing strings beside each other instead of writing a third claim
   about the fit, and neither half is a number.

   THE AGENT'S HALF IS A CLAUSE OF `bio`, STATED HERE RATHER THAN PARSED OUT
   OF IT. The first draft cut `bio` at its first full stop, which works for
   Lena and Owen — one sentence each — and picks the wrong half of Priya's:
   hers opens "Fifteen years running operations teams in logistics", which is
   a CV line, and the thing she assesses is in the second sentence. A string
   whose meaning depends on where a full stop happens to fall is not a
   mechanism, so the three clauses are named. They are `bio`'s own words; if a
   bio is rewritten, this is the second place to look. */
/* THE CLAUSES CARRY NO PRONOUN, AND THAT IS DELIBERATE TWICE OVER. `AGENTS`
   states a name, a rating, a range and a fee and says nothing about how any of
   these five people are addressed — so a "she" here would be this file
   inventing a fact about a person. The sentence uses the NAME instead, which
   also reads better than a pronoun whose antecedent is a heading two lines up.
   The rest of each clause is `bio`'s own wording, with the leading pronoun
   dropped and the verb agreed. */
const OB_FIT = {
  priya:'assesses for judgement under pressure rather than vocabulary, and will tell you plainly where you are',
  owen:'looks for how you decide when the information is incomplete, which is most of the time',
  lena:'came up through engineering management, and expects a lot of &ldquo;and then what happened&rdquo;'
};

/* THE ANSWER IS QUOTED, NOT LOWERCASED — and lowercasing was the first version
   and a bug. `charAt(0).toLowerCase()` folds an option into the sentence
   nicely for "Having the hard conversations" and produces **"You said i do not
   trust the handover"** for the three options that begin with the pronoun I.
   Quotation marks need no case surgery, and they match how the free-text note
   is presented forty pixels below — which is right, because both are the
   candidate's own words being read back. */
function obFit(){
  const k = obAgent();
  /* QUOTE THE `why` ANSWER BY KEY, not by a read-back index. It used to read
     `obHeard()[2][1]` — the third row, which was `why` — but the 9 Sep reorder
     put `band` third, so the index would now quote the wrong answer. `obLabel`
     is the same value the row prints and cannot drift with the order. */
  return `You said &ldquo;<b>${obLabel('why')}</b>&rdquo;, and ${
    AGENTS[k].n} ${OB_FIT[k]}.`;
}

/* ==========================================================================
   THE SCREEN

   `.auth-card` UNCHANGED, WHICH IS THE WHOLE OF THE LAYOUT. §57 splits it
   52.6 / 47.4 at 900 and up, stacks it below, centres the card in the right
   column and gives the accent button its auth treatment — so the onboarding
   is continuous with the screen the reader just came off (Verify your email)
   and §107 states only what is different about the left panel.

   NO SHELL AND NO RAIL, for the reason the `signup` branch has none: there is
   nowhere else to be yet. The rail's modules are all behind the dashboard this
   screen ends on.
   ========================================================================== */
/* THE LOADER — three relay blades on the survey's own light ground, shown for 2s
   between "Let's Get Started" and question one (Maryam, 18 Sep 2026, off the
   `loader.html` asset). `.ob-survey` gives the full frame, the centred `.main`
   and the rail-line suppression; §107 draws the blades. */
function obLoaderScreen(){
  return `<div class="ob-survey ob-loading">
    <main class="main">
      <div class="tn-loader" role="status" aria-label="Loading">
        <span class="tn-loader__blade tn-loader__blade--a"></span>
        <span class="tn-loader__blade tn-loader__blade--b"></span>
        <span class="tn-loader__blade tn-loader__blade--c"></span>
      </div>
    </main>
  </div>`;
}

function obScreen(){
  const step = S.obStep;
  if(S.obLoading) return obLoaderScreen();

  /* THE INTRO IS ITS OWN COMPOSITION AND TAKES THE FRAME. Not `.auth-card`,
     because the reference is one object on an empty ground and this screen has
     no form on it — a 40% panel with a spine in it beside a 608px card holding
     nothing would be the split fighting the thing it contains. It is also why
     the spine does not count this step: five rows for five questions, and the
     intro is the door. */
  /* THE CHAT IS AN EMPTY `.main` AND `placeAsk` FILLS IT. That pass builds
     `askView` into the first `.main` it finds whenever `S.askOpen` is true, so
     the whole chat experience — the thread, the bubbles, the composer, the
     typing dots, `askSync`'s append-only patching — arrives without this file
     drawing any of it. ai4's own stage guard was relaxed to allow exactly this
     case and no other; its note says so.

     IT IS CHECKED BEFORE THE STEP, because the chat is a mode rather than a
     step: it opens over the intro and `askClose` returns to it. */
  /* THE DOCK'S MIDDLE IS THE MODE'S WAY FORWARD, and there are two of them:
     the voice screen's words, and the composer — disabled on the chat's
     welcome, live once the conversation has begun. The mute button and the
     two pills do not move between any of the three screens, which is the
     whole reason they live in a row that outlives the content.

     THE STAGE IS THE WELCOME AND ONLY THE WELCOME. Once the conversation is
     open there is no stage at all — the thread is the dock's own top row
     (`obThread`), so the screen is the conversation and the field it is
     spoken into, with nothing above them. That is the merged screen taken
     apart: three states, three compositions, one set of controls. */
  if(step === 0){
    const chat = S.obMode === 'chat';
    const live = chat && S.obChatOpen;
    /* THE CHAT WELCOME CARRIES NO FIELD AT THE FOOT (Maryam, 9 Sep 2026: "remove
       the bottom field from this screen only ... once the user will click on get
       started then the chat field appears with the list of questions"). The
       disabled composer used to sit in the dock on this screen too, saying
       "Press Let's Get Started to begin" — but the way forward here is the
       "Let's Get Started!" button in the body, and a dead field under it is the
       §60 dead control. So the welcome (chat, not yet started) draws NO dock at
       all; the composer and the thread arrive together the moment the button
       opens the conversation (`live`), which is exactly the ask. Voice keeps its
       dock (the orb's own control lives there). */
    const mid = chat ? obCompose()
      : `<span class="ob-go" data-obstart="1" role="button" tabindex="0">Let&rsquo;s Get Started</span>`;
    const welcome = chat && !live;
    return `<div class="ob-open${chat ? ' ob-open-chat' : ''}${live ? ' ob-open-live' : ''}">${
      obHead()}${
      live ? obProgress() : ''}${
      live ? '' : chat ? obChatScreen() : obIntro()}${
      welcome ? '' : obDock(mid, live ? obThread() : '')}</div>`;
  }

  /* STEPS 1..OB_N ARE THE STEPPED SURVEY; step > OB_N is the completion screen,
     both the survey's own light full-frame composition. */
  if(step >= 1 && step <= OB_N) return obSurveyScreen();
  return obDoneScreen();
}

/* ==========================================================================
   THE HANDLERS

   THEY RUN BEFORE views.js's, and that is load-bearing rather than tidy.
   `data-ob` sits on a `<label class="rad role-c">`, so views.js's own
   `[data-lrole]` branch does not reach it — but its generic `.slot` / `.cs`
   handlers and `data-go` would happily match other things on this screen, and
   more to the point a `<label>` click sends a synthetic second click through
   its own input. Attaching in the CAPTURE phase and stopping there is the same
   shape lead2.js uses for `data-ldrco`, and §76's note on `S.bkSlot` is the
   worked example of what ordering costs when it is wrong.
   ========================================================================== */

device.addEventListener('click', e => {
  if(S.stage !== 'onboard') return;
  const t = e.target;

  /* THE MODE PILLS COME FIRST, and they have to: both sit inside `.ob-intro`,
     which carries `data-obgo="1"` so that a press anywhere on the screen
     advances. Tested after the step branch, a press on Voice would replay the
     clip AND leave for question one. Capture phase plus `stopPropagation` is
     what makes "the whole surface is the target" and "except these two" both
     true. */
  const md = t.closest('[data-obmode]');
  if(md){
    e.preventDefault(); e.stopPropagation();
    if(md.dataset.obmode === 'chat') obChat();
    /* AND VOICE IS THE WAY BACK (Maryam, 3 Sep 2026: "when i opened chat, let
       me go back to the voice with the same experience at the bottom right
       switching, do not hide it on chat"). From chat it returns to the voice
       screen; from the voice screen it replays the clip. One control, two jobs
       decided by which mode it is pressed in — which is what a mode switch is,
       and it means the pair never has a press that does nothing. */
    else if(S.obMode === 'chat'){ S.obMode = 'voice'; S.obSpoken = false; render(); }
    else obReplay();
    return;
  }

  /* MUTE. It writes `muted` on the element and re-renders so the glyph, the
     `title` and `aria-pressed` all follow from one source — trap 9's rule, and
     cheap here because the audio object is not in the DOM and so survives the
     paint untouched. Muting does NOT pause: the clip runs on silently and the
     bars keep moving, which is the honest drawing of "the agent is talking and
     you cannot hear it". Pausing instead would lose the reader's place. */
  const mu = t.closest('[data-obmute]');
  if(mu){
    e.preventDefault(); e.stopPropagation();
    if(!obAud) obPlay();
    if(obAud) obAud.muted = !obAud.muted;
    render(); return;
  }


  /* AN ANSWER. `band` CLEARS `why`, which is the one piece of bookkeeping this
     flow needs: step 3's options are a function of step 2, so an answer given
     under Delegation is not a valid answer under Coaching and would otherwise
     survive into a list that does not contain it — a `.role-c.on` with no
     matching option, which renders as a step that is answered and shows
     nothing chosen. */
  const o = t.closest('[data-ob]');
  if(o){
    const k = o.dataset.ob;
    if(k === 'band' && S.ob.band !== o.dataset.obv) S.ob.why = null;
    S.ob[k] = o.dataset.obv;
    e.preventDefault(); e.stopPropagation();
    render(); return;
  }

  /* A STEP. Clamped here rather than at the call sites so every control can
     write a plain number, and the guard on `obReady` is what makes the
     disabled Next honest — a keyboard press on a disabled button does not
     fire, but a click on the SVG inside it did. */
  /* THE VOICE SCREEN'S "Let's Get Started!" CROSSES INTO THE CHAT, ALREADY
     STARTED (Maryam, 3 Sep 2026: "the let's get started button on voice view
     will take the user to the chat view where the let's get started button has
     already been clicked"). So the two controls are one act reached two ways,
     and the reader never has to press the same words twice.

     IT IS TESTED BEFORE `data-obgo` because that is the attribute it carries —
     the orb and the words both advanced the STEP before this, and the words
     now change mode instead. The orb keeps `data-obgo` and still advances,
     which is the one thing on the voice screen that goes straight to the
     questions. */
  /* ==========================================================================
     THE WAY IN — AND IT IS THE ONE TRANSITION IN THE GATE

     Maryam, 3 Sep 2026: *"no smooth transition from the welcome screen to the
     chat screen."* The press used to change three flags and repaint, so the
     orb, the greeting and three paragraphs were replaced by a question
     between one frame and the next — the hardest cut in the product, on the
     one press that is a change of screen rather than a change of content.

     IT IS A LEAVE ANIMATION, WHICH IS THE HALF `render()` CANNOT DO. Entrances
     are free here (a new element carries its own `animation`); an EXIT needs
     the old element still in the document, and `render()` replaces
     `device.innerHTML` outright. So the welcome is asked to leave first —
     `.ob-leave` on the stage, §107 §0g's 220ms fade and lift — and the state
     change waits for it. The thread's own first message then animates in on
     the paint after, so the two halves read as one movement rather than as a
     dissolve followed by a jump.

     220ms IS UNDER THE PRESS's OWN LATENCY BUDGET. It has to be short enough
     that the button feels like it responded, and the fade starting instantly
     is what does that — the screen is already moving while the timer runs.

     THE PRESS IS RECORDED AS A TURN (Maryam, 3 Sep 2026: "show the user side
     message above the tal message 'Let's Get Started!' since we are recording
     the clicks of the user"). It is the reader's first click and it is an
     answer to what the welcome asked, so the conversation opens the way every
     other exchange in it runs: what the reader said, then Tal. It is pushed on
     BOTH paths — the voice screen's control and the chat's — because the two
     are one act reached two ways and the thread should not be able to tell
     which door was used.

     `S.obQi` GUARDS THE WHOLE THING, so pressing it twice, or arriving from
     the voice screen after the chat has already run, does not re-ask question
     one or record a second click on top of a conversation in progress. */
  const st = t.closest('[data-obstart]');
  if(st){
    e.preventDefault(); e.stopPropagation();
    /* "Let's Get Started" SHOWS THE 2s LOADER, THEN THE SURVEY (Maryam, 18 Sep
       2026). The welcome's leave animation is kept (the half `render()` cannot
       do, §107 §0g); after it, the loader is shown for 2s, then question one.
       `setTimeout` (not rAF) drives the delay so it still fires in a background
       tab (trap 17). */
    obHush();
    const stage = device.querySelector('.ob-stage');
    const load = () => {
      S.obLoading = true; render();
      setTimeout(() => { S.obLoading = false; S.obStep = 1; render(); }, 2000);
    };
    if(stage){ stage.classList.add('ob-leave'); setTimeout(load, OB_LEAVE); }
    else load();
    return;
  }

  /* AN OPTION. `data-obans` is `key:value`, split rather than two attributes
     because the pair is meaningless apart and one attribute cannot go stale
     against the other. */
  const an = t.closest('[data-obans]');
  if(an){
    e.preventDefault(); e.stopPropagation();
    const [k, v] = an.dataset.obans.split(':');
    obAnswer(k, v);
    render(); return;
  }

  /* THE COMPOSER. It answers question five and nothing else — the field is
     `disabled` while a tap question is live, so this only fires on the free
     one or after the flow has finished. The value is read and cleared BEFORE
     the render that consumes it, because `render()` replaces
     `device.innerHTML` and the input goes with it (ai4's caret trap). */
  const sd = t.closest('[data-obsend]');
  if(sd && !sd.disabled){
    e.preventDefault(); e.stopPropagation();
    obSend();
    return;
  }

  const g = t.closest('[data-obgo]');
  if(g && !g.disabled){
    const n = Math.max(0, Math.min(obLast(), +g.dataset.obgo));
    if(n > S.obStep && !obReady()){ e.preventDefault(); e.stopPropagation(); return; }
    S.obStep = n;
    e.preventDefault(); e.stopPropagation();
    render(); return;
  }

  /* THE WAY OUT, AND IT CARRIES ONE THING WITH IT.

     `S.ob` outlives the stage change on its own — the way `S.booking` outlives
     ai7's conversation — and `setStage` is called rather than `S.stage`
     assigned, because that function is what resets the rest of the world
     (scenes, history, the view) and what forwards a hidden stage.

     WHAT IT HAS TO SET IS `S.recKey`, and that is the whole point of the gate.
     `talRec` on the `new` dashboard draws whichever agent that key names, and
     it is initialised to `'priya'` in views.js — so without this line the
     candidate answers five questions, is shown Lena on the read-back, presses
     the button and lands on a dashboard recommending somebody else. The two
     surfaces would be reading different sources for one decision, which is the
     `bkStamp` problem in miniature: one fact, two places, no link.

     IT IS SET HERE RATHER THAN READ INSIDE `recKey()`, and the difference
     matters. `recKey()` is called by the dashboard, by `PAGESUM.new`, by the
     rail of agents and by the cycle button that steps to the NEXT
     recommendation — and that last one writes `S.recKey`. A `recKey()` that
     preferred `S.ob` would make the cycle button dead on the one stage it
     exists for, because every render would snap the choice back to the
     onboarding's answer. Writing the key once, on the way out, makes the
     onboarding the DEFAULT and leaves the reader free to look at the other
     two — which is what the read-back's own helper line promises ("Lena is on
     your dashboard with the other two"). */
  const d = t.closest('[data-obdone]');
  if(d){
    S.recKey = obAgent();
    /* THE THREE ONBOARDING FIELDS LAND ON THE PROFILE (Client, 9 Sep 2026),
       written once on the way out exactly like `S.recKey` above, so what the
       candidate picked in the flow is what their profile shows. Guarded on a
       real answer so a deep-link that skipped the flow keeps the seeded values.
       Role is the free-text answer (Q3); industry is the dropdown's label out of
       `S.ddVal` (its "Other" value is the free text); years is the radio label
       via `obLabel`. Each is guarded on a real answer so a deep-link that skipped
       the flow keeps the seeded values. (The old intent / student-flag writes
       went with the questions that fed them.) */
    if(S.ob.role)  PF.general.role  = S.ob.role;
    if(S.ob.years) PF.general.years = obLabel('years');
    const ind = S.ddVal['ob-industry'];
    if(ind === 'Other'){ if(S.ob.industryOther) PF.general.industry = S.ob.industryOther; }
    else if(ind)       PF.general.industry = ind;
    e.preventDefault(); e.stopPropagation();
    /* THE GATE'S CONVERSATION STAYS AT THE GATE — Maryam, 4 Sep 2026: "it
       shows that convo I had at the onboarding time, it should not show here."
       §107 shares `S.thread` with the ask page, and its messages are the gate's
       shape (`{who:'tal', q:i}`, `{who:'tal', done:true}`) which `askBubble`
       prints as "undefined". `talReset()` rather than `S.thread = []` — the
       thread has a timer (views.js's note). And the ask page itself is closed:
       the dashboard is the destination, not the chat over it. */
    /* THE LOADER PLAYS AGAIN FOR 2s, THEN THE DASHBOARD (Maryam, 18 Sep 2026).
       Stay on the onboard stage so `obScreen` keeps painting `obLoaderScreen`;
       the handover — reset the thread, close the ask page, `setStage('new')` —
       runs in the timeout. `setTimeout` (not rAF) so it fires in a background
       tab (trap 17). */
    S.obLoading = true; render();
    setTimeout(() => {
      S.obLoading = false;
      talReset(); S.askOpen = false; S.tal = false;
      setStage('new'); render();
    }, 2000);
    return;
  }
}, true);

/* ==========================================================================
   THE LAST TWO STATEMENTS, AND THE ORDER OF THEM IS THE WHOLE POINT

   `S.obReady` IS THE RENDER BRANCH'S GUARD, AND IT HAS TO BE A RUNTIME FACT.
   views.js's `onboard` branch was first written `typeof obScreen ===
   'function'`, copied from ai10's `callScreen` guard, and it throws on a hard
   reload of `#onboard/ob`: a `function` declaration is hoisted for the whole
   script at parse time, so that test passes from the bundle's first statement
   — while `OB_Q`, `OB_N` and everything else here is still in its temporal
   dead zone. The boot reader restores the stage from the hash, the boot render
   takes the branch, `obScreen` runs, and `OB_N` throws. The throw then kills
   the rest of the script's top-level execution, so every const in this file
   stays in TDZ for the life of the page while every function in it stays
   callable — the app paints once, empty, and nothing recovers.

   A property on `S` cannot be hoisted, so this line is only true once
   everything above it has evaluated. The branch reads it and falls through to
   the shell on any earlier render.

   IT IS SET BEFORE `render()` RATHER THAN AFTER, so the one paint at the foot
   of this file is already the real screen. Set after, a deep link would draw
   the fallback dashboard first and the onboarding a frame later — a visible
   flash of the page this gate exists to stand in front of.

   AND THE `render()` IS TRAP 8: views.js's boot render is the last statement
   of that file and has already run, as has the one at the foot of every ai*
   pass, so each pass re-renders at its own foot. This file closes the bundle.
   ========================================================================== */
/* SENDING IS ONE FUNCTION FOR THE BUTTON AND THE RETURN KEY, so the two
   cannot come to disagree about what a submit does.

   ON QUESTION FIVE IT IS THE ANSWER; anywhere else in the conversation it is a
   plain question for Tal, answered by `TAL_ROUTES` like every other surface.

   THAT SECOND BRANCH IS NOW REACHABLE DURING A TAP QUESTION, which it was not
   before — `obCompose`'s note is the instruction. The pending question is NOT
   consumed or skipped by it: `S.obQi` is untouched, so the four options stay
   drawn on their own turn and the aside sits between them and the field. Ask
   Tal something, read the answer, then answer the question. Before the
   conversation opens there is nothing to reach — the field is `disabled`.

   >>> ITS OTHER BRANCH WENT WITH QUESTION 5 (3 Sep 2026) AND THE FUNCTION IS
   NOW ONE LINE. That branch wrote `S.ob.note`, pushed the reader's words as a
   turn and fired the closing turn — the only place in the flow an ANSWER came
   from the field rather than from a row. With every question a tap, the field
   does one thing on every screen it appears on, which is what it was always
   supposed to do. */
function obSend(){
  const el = device.querySelector('#obIn');
  const q = el ? el.value.trim() : '';
  if(el) el.value = '';
  if(q) ask(q);
}

/* THE SURVEY'S FREE-TEXT FIELDS, CARET-SAFE (Maryam, 21 Sep 2026 questions).
   Q3 ("What do you do now?") and Q4's "Other" write into `S.ob` on every
   keystroke WITHOUT a render — `render()` rebuilds `device.innerHTML` and would
   take the field and its caret with it (trap 9/17). The only live thing that has
   to react is the Next button's disabled state, so it is toggled in place off
   `obReady()` rather than by repainting. The value is read back from `S.ob` the
   next time the screen legitimately renders (Next/Previous). */
device.addEventListener('input', e => {
  if(S.stage !== 'onboard') return;
  const el = e.target.closest('[data-obtext]');
  if(!el) return;
  S.ob[el.dataset.obtext] = el.value;
  const next = device.querySelector('.ob-sv-next[data-obgo]');
  if(next) next.disabled = !obReady();
});

/* ENTER IS THREE SPELLINGS AND TESTING FOUND THE THIRD THE HARD WAY. `e.key`
   is `'Enter'` on every modern browser, and the handler tested that alone —
   which is correct by the spec and stalled the flow dead on the one question
   that has no option to press: some input stacks (legacy WebKit, a few
   automation and IME paths) still report the old `'Return'`, and one of them
   reached this field. Nothing throws. The text simply stays in the box, the
   question stays on screen, and the reader concludes the product is broken —
   which is exactly what it looks like from the outside.

   `keyCode === 13` IS THE THIRD, AND IT IS DEPRECATED ON PURPOSE. It is the
   only one of the three every stack has always agreed on, so it is here as
   the floor rather than as the test. Three cheap comparisons against a
   question with no other way past it. */
device.addEventListener('keydown', e => {
  const enter = e.key === 'Enter' || e.key === 'Return' || e.keyCode === 13;
  if(!enter || !e.target.closest || !e.target.closest('#obIn')) return;
  e.preventDefault();
  if(!e.target.disabled) obSend();
});

/* THE SPEECH IS DRIVEN FROM A RENDER WRAPPER, which is ai11's and tmpaccent's
   idiom (`const _base = render; render = function(){ … }`) and is the only
   place that can know the intro is on screen. Two jobs, and they are opposite
   sides of one rule — the clip plays on the intro and nowhere else:

     ARRIVING ON STEP 0 SPEAKS. Including the boot render below, so a deep link
     to `#onboard/ob` talks as soon as the browser lets it.

     LEAVING STEP 0 STOPS IT. Pressing "Let's Get Started!" while Tal is
     mid-sentence would otherwise have the voice running over question one, and
     `obHush` rewinds so coming back plays from the top rather than from the
     middle of a word.

   IT IS WRAPPED IN try/catch LIKE EVERY OTHER PASS, so a browser that refuses
   to construct an `Audio` from a data URI degrades to a silent screen rather
   than a blank one — and `console.warn` is what `respcheck` reads, so a
   failure here is a test failure rather than a mystery. */
const _baseOb = render;
render = function(){
  _baseOb.apply(null, arguments);
  try {
    if(S.stage === 'onboard' && S.obStep === 0 && S.obMode !== 'chat') obSpeak();
    else obHush();
  } catch(e){ console.warn('ob speech', e); }
};

S.obReady = true;
render();
