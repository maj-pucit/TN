/* ==========================================================================
   NIL.JS — THE NEXT IN LEADERSHIP RUN-UP, SIX SCREENS
   TEMPORARY, and built to come out in one piece: this file, 30-nil.css, the
   `nil` rows in STAGES and CFG, and the `S.stage==='nil'` branch in render().
   Nothing else in the build knows it is here.

   WHAT IT IS
   Five of these screens are Maryam's screenshots of nextinleadership.com,
   redrawn rather than pasted in; the sixth (`phone`) did not exist and is
   drawn here in the same clothes. Redrawn and not pasted for three reasons,
   in order of how much they mattered:

     1. Screen 1's whole brief was to ADD something — a required mark on
        every label. You cannot edit a PNG.
     2. Screen 2 had no PNG to paste.
     3. "Buttons should be working." A raster with hotspots over it is a
        different thing from a page: it cannot reflow, the inputs cannot be
        typed into, and the hotspots drift the moment the frame is a
        different width. The prototype renders at 390, 744 and 1440.

   WHERE IT SITS IN THE JOURNEY
     quiz  → phone → result → consult1 → consult2 → done → signup/create
   `done`'s one button is the hand-off; past it the product's own Create
   Account screen takes over and everything downstream is unchanged.

   THIS FILE IS THE LAST ONE IN THE BUNDLE, so it ends with render() — same
   reason ai.js .. ai5.js do, spelled out at the foot of ai5.js. It installs
   no render wrapper, but the one delegated listener it adds has to be live
   before the first interaction, and the boot render in views.js has already
   run by the time this is parsed.
   ========================================================================== */

/* --------------------------------------------------------------------------
   MARKS THE PRODUCT SET DOES NOT HAVE
   Five of the six icons these screens need are already in `I` — book, chat,
   lightning, dashboard, checkFilled. Four are not, and rather than grow the
   product's icon set for a temporary front door they live here: the official
   Material FILLED cut of local_shipping, verified, person and work, same
   24px canvas and same one-path-each shape as icons.js.
   -------------------------------------------------------------------------- */
const NILP = {
  /* The result page's category + next-step marks moved to the platform's
     HugeIcons STROKE family (`I.truck` / `I.verified` / `I.user` / `I.work`)
     so they read as one set with `book` / `chat` / `lightning` (Maryam,
     17 Sep 2026) — the old filled Material *Icons* cut is gone from here.
     Only the three brand logos stay: they are the platforms' own glyphs,
     redrawn simply enough to read at 16px and no smaller, and are drawn
     FILLED on purpose (a logo is not a UI mark). */
  ig:'M12 2.2c3.2 0 3.6 0 4.85.07 1.17.05 1.8.25 2.23.42.55.21.95.47 1.37.89.42.42.68.82.89 1.37.17.42.37 1.06.42 2.23C21.83 8.4 21.85 8.8 21.85 12s0 3.6-.07 4.85c-.05 1.17-.25 1.8-.42 2.23-.21.55-.47.95-.89 1.37-.42.42-.82.68-1.37.89-.42.17-1.06.37-2.23.42-1.25.06-1.65.07-4.85.07s-3.6 0-4.85-.07c-1.17-.05-1.8-.25-2.23-.42a3.7 3.7 0 0 1-1.37-.89 3.7 3.7 0 0 1-.89-1.37c-.17-.42-.37-1.06-.42-2.23C2.17 15.6 2.15 15.2 2.15 12s0-3.6.07-4.85c.05-1.17.25-1.8.42-2.23.21-.55.47-.95.89-1.37.42-.42.82-.68 1.37-.89.42-.17 1.06-.37 2.23-.42C8.4 2.17 8.8 2.15 12 2.15zM12 7.1a4.9 4.9 0 1 0 0 9.8 4.9 4.9 0 0 0 0-9.8zm0 8.08a3.18 3.18 0 1 1 0-6.36 3.18 3.18 0 0 1 0 6.36zM18.35 6.9a1.15 1.15 0 1 1-2.3 0 1.15 1.15 0 0 1 2.3 0z',
  li:'M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM3 9h4v12H3V9zm6.5 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.75V21h-4v-5.9c0-1.4-.03-3.2-1.98-3.2-1.98 0-2.28 1.52-2.28 3.1V21h-4V9z',
  yt:'M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.28 5 12 5 12 5s-6.28 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2C2 8.77 2 12 2 12s0 3.23.4 4.8a2.5 2.5 0 0 0 1.76 1.77C5.72 19 12 19 12 19s6.28 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77C22 15.23 22 12 22 12s0-3.23-.4-4.8zM9.98 15.02V8.98L15.2 12l-5.22 3.02z'
};
const NI = new Proxy({}, {
  get: (_, k) => `<svg viewBox="0 0 24 24" aria-hidden="true">${NILP[k] ? `<path d="${NILP[k]}"/>` : ''}</svg>`
});

/* --------------------------------------------------------------------------
   THE MARK IS A STAND-IN AND IT SAYS SO HERE
   Next In Leadership's logo is a speech bubble with the name knocked out of
   it, and the real asset is not in this repo. This is a drawing of it: the
   bubble outline, the name on two lines, the second line reversed out of a
   lime bar. It is close at 38px and it is not the file. Drop the real PNG in
   as a data URI when it is to hand — one <img> replaces this whole function.
   -------------------------------------------------------------------------- */
function nilLogo(){
  return `<svg class="nil-logo" viewBox="0 0 98 58" role="img" aria-label="Next in Leadership">
    <path d="M3 3h92v40H64l-9.5 13-1.5-13H3Z" fill="none" stroke="#c8fa4b" stroke-width="3.6"/>
    <text x="11" y="24" fill="#c8fa4b" font-family="Arial Narrow, Inter, sans-serif"
      font-size="18" font-weight="700" letter-spacing=".4">NEXT IN</text>
    <rect x="10" y="28" width="72" height="13" fill="#c8fa4b"/>
    <text x="13" y="38" fill="#0b2245" font-family="Arial Narrow, Inter, sans-serif"
      font-size="10.5" font-weight="700" letter-spacing=".9">LEADERSHIP</text>
  </svg>`;
}

/* The site bar is identical on all six screens, so it is written once. The
   five nav words are spans: this run-up is one line and none of them leads
   anywhere, so none of them is a control. */
function nilBar(){
  return `<header class="nil-bar">
    ${nilLogo()}
    <nav class="nil-nav" aria-label="Next in Leadership">
      ${['Home','Leadership','Entrepreneurship','Podcast','About']
        .map(x=>`<span>${x}</span>`).join('')}
    </nav>
    <span class="nil-cta">What&rsquo;s Next Quiz ${I.arrowRight}</span>
  </header>`;
}
const nilPage = (cls, inner, tail) =>
  `${nilBar()}<div class="nil-scroll"><div class="nil-wrap ${cls||''}">${inner}</div>${tail||''}</div>`;

/* A required field, drawn the same way six times. `required` and
   `aria-required` are on the input; the asterisk is decoration on top of
   them, which is why it is aria-hidden — see 30-nil.css §3. */
function nilField(id, label, type, ph, span){
  return `<div class="nil-f${span?' span2':''}">
    <label for="${id}">${label}<span class="req" aria-hidden="true">*</span></label>
    <input id="${id}" type="${type}" placeholder="${ph}" required aria-required="true">
  </div>`;
}

/* THE "CHECK YOUR EMAIL" MODAL shown when Continue is pressed on the result page.
   Centred content: the Gmail mark, a heading, the confirmation line and a Close.
   The address is the one the rest of the prototype uses (`PF.general.email`, in
   views.js which loads before this) rather than retyped; the quiz's own email
   field is a prototype input that does not persist. Authored placeholder (§74). */
const NIL_EMAIL = (typeof PF !== 'undefined' && PF.general && PF.general.email) || 'you@example.com';
/* The mail mark is a clean stroke-rounded envelope (24-box), reproduced as inline
   SVG so it needs no asset. Maryam asked to drop the Gmail brand logo for a generic
   mail icon (27 Sep 2026); a stroke glyph, so it reads in the NIL navy
   (`currentColor`, set on `.nil-modal-logo`).
   NOT Hugeicons' `mail-01` — that glyph puts its flap crease at y=6, INSIDE the
   body's top-corner curve, so the crease endpoints overshoot the rounded sides
   ("the lines are still coming out of the icon", Maryam 28 Sep 2026). This envelope
   (the Lucide `mail` geometry, same stroke language) drops the crease to y=7, below
   the rx=2 corner, so the endpoints land on the straight vertical sides and nothing
   pokes out. §30-nil sizes it to 28px. */
const MAIL_MARK = `<svg viewBox="0 0 24 24" role="img" aria-label="Email" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
  <rect x="2" y="4" width="20" height="16" rx="2"/>
  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
</svg>`;
function nilResultModal(){
  return `<div class="nil-modal-scrim" data-nilclose="scrim">
    <div class="nil-modal" role="dialog" aria-modal="true" aria-labelledby="nil-modal-h">
      <button class="nil-modal-x" data-nilclose="x" aria-label="Close">${I.close}</button>
      <span class="nil-modal-logo">${MAIL_MARK}</span>
      <h2 id="nil-modal-h" class="nil-modal-h">Check your email</h2>
      <p class="nil-modal-d">We sent a confirmation link to <b>${NIL_EMAIL}</b>. Click the link in the email to finish setting up your account.</p>
      <button class="nil-modal-btn" data-nilclose="btn">Close</button>
    </div>
  </div>`;
}

/* `var`, not `const`, ON PURPOSE: views.js's boot render() reads `NIL` before
   this file is parsed, and a `const` in its temporal dead zone throws a hard
   ReferenceError there (even `typeof` throws) that halts the whole bundle. A
   `var` is hoisted to `undefined`, so views.js's `NIL ? …` guard can skip the
   nil branch safely at boot; the render() at the foot of this file then paints
   the screen once the table exists. (Maryam, 17 Sep 2026 — the blank-on-reload.) */
var NIL = {

/* ==========================================================================
   1 · THE QUIZ'S LAST STEP
   Their screen, plus the one change asked for: every label carries a
   required mark, because every field on it is mandatory and the screenshot
   said so nowhere.
   ========================================================================== */
quiz: () => nilPage('', `
  <div class="nil-card">
    <p class="nil-eyebrow">What&rsquo;s Next Quiz</p>
    <span class="nil-pill">Final step</span>
    <h1 class="dsp nil-h1">Where should we send your results and resources?</h1>
    <div class="nil-grid">
      ${nilField('nq-first','First name','text','First name')}
      ${nilField('nq-last','Last name','text','Last name')}
      ${nilField('nq-email','Email address','email','you@example.com',true)}
      ${nilField('nq-phone','Phone number','tel','(555) 123-4567')}
      ${nilField('nq-zip','Zip code','text','12345')}
    </div>
    <div class="nil-acts">
      <button class="nil-btn ghost" disabled>${I.arrowLeft} Back</button>
      <button class="nil-btn" data-go="phone">Get my results ${I.arrowRight}</button>
    </div>
    <p class="nil-priv">We respect your privacy. Unsubscribe anytime.</p>
  </div>`),

/* ==========================================================================
   2 · VERIFY THE NUMBER — the screen that did not exist
   Drawn in the quiz card, because that is what it interrupts: same card,
   same eyebrow, same pill, same two-button foot. The number it names is the
   one screen 1 asks for, and "Change it" goes back to that field rather than
   to a dead link — a verification screen with no way to correct a typo is
   where a real sign-up stops.
   ========================================================================== */
phone: () => nilPage('', `
  <div class="nil-card">
    <p class="nil-eyebrow">What&rsquo;s Next Quiz</p>
    <span class="nil-pill">Verify your number</span>
    <h1 class="dsp nil-h1">Enter the 6-digit code we sent you</h1>
    <p class="nil-sub">We texted a verification code to <b>(555) 123-4567</b>. Enter it below
      and we will send your results straight through.
      Wrong number? <span class="nil-lnk" data-go="quiz">Change it</span>.</p>
    <div class="nil-otp" role="group" aria-label="6-digit verification code">
      ${[1,2,3,4,5,6].map(i=>`<input inputmode="numeric" autocomplete="one-time-code"
        maxlength="1" size="1" aria-label="Digit ${i} of 6">`).join('')}
    </div>
    <p class="nil-resend">Didn&rsquo;t get it? <b>Resend code in 0:40</b></p>
    <div class="nil-acts">
      <button class="nil-btn ghost" data-go="quiz">${I.arrowLeft} Back</button>
      <button class="nil-btn" data-go="result">Verify &amp; continue ${I.arrowRight}</button>
    </div>
    <p class="nil-priv">We respect your privacy. Unsubscribe anytime.</p>
  </div>`),

/* ==========================================================================
   3 · THE RESULT
   As it is. One of the three next-step tiles is wired — "Connect with Talent
   Next Agent", which is the door into the consultant form — and the other
   two are drawn without an affordance so nothing offers a press it cannot
   answer. There is no Back control on their page and none is invented here;
   the prototype bar's own back arrow walks the run-up in reverse, because
   go() pushes every one of these views onto S.hist.
   ========================================================================== */
result: () => nilPage('wide', `
  <div class="nil-res">
    <div class="nil-res-tab">Quiz results</div>
    <div class="nil-res-grid">
      <div class="nil-you">
        <div class="nil-you-head">
          <p class="nil-you-hey">Hey Maryam! You are a</p>
          <p class="nil-you-type">Builder</p>
        </div>
        <div class="nil-you-body">
          <h3>The Independent Expert</h3>
          <p>You enjoy creating results through quality work, independence, and
            ownership. You&rsquo;d rather build something than simply maintain it.</p>
          <div class="grp">
            <h3>Characteristics of a Builder</h3>
            <ul class="nil-ticks">
              ${['Values quality over complexity.','Builds trusted relationships.',
                 'Wants control over their schedule.']
                .map(t=>`<li>${I.checkFilled}<span>${t}</span></li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
      <div class="nil-side">
        <div class="nil-side-box">
          <h2>Career ideas</h2>
          <ul class="nil-ideas">
            ${[[I.truck,'Supply Chain Manager','Streamlines logistics and operations flow.'],
               [I.verified,'Quality Assurance Manager','Ensures product standards and quality.'],
               [I.user,'Product Owner','Drives product vision and priorities.'],
               [I.lightning,'Electrician Business Owner','Runs electrical services company operations.'],
               [I.dashboard,'Process Improvement Specialist','Optimizes workflows and reduces costs.']]
              .map(([ic,role,what])=>`<li>${ic}<span>${role} &ndash; ${what}</span></li>`).join('')}
          </ul>
        </div>
        <div class="nil-side-box">
          <h2>Your next step</h2>
          <p>Download the Builder Playbook, access the Builder Toolkit, or connect
            with a TALENT Next Agent.</p>
        </div>
        <div class="nil-steps">
          <span class="nil-step"><span class="nil-step-l">${I.book}<span>Builder Playbook</span></span>${I.arrowRight}</span>
          <span class="nil-step"><span class="nil-step-l">${I.work}<span>Builder Toolkit</span></span>${I.arrowRight}</span>
          ${''/* CONTINUE OPENS THE "CHECK YOUR EMAIL" MODAL (Maryam, 17 Sep 2026):
                the confirmation-email step of sign-up, drawn as a centred dialog
                (`nilResultModal`) over the result page rather than a navigation.
                It supersedes the 16 Sep `data-go="stage:signup/create"` jump. The
                consultant-form steps (`consult1`, `consult2`) and the "You're in"
                hand-off (`done`) stay defined and deep-link reachable.
                MODAL HIDDEN AGAIN (Maryam, 13 Oct 2026: "hide this modal for now.
                on click to the button take me to the account creation
                prototype"): Continue is back on `data-go="stage:signup/create"`.
                `nilResultModal` and the `data-nilmodal` handler stay defined, so
                restoring the modal is putting `data-nilmodal="1"` back here. */}
          <button class="nil-step live nil-step-cta" data-go="stage:signup/create"><span class="nil-step-l">${I.chat}<span>Continue your journey on TALENTnext</span></span>${I.arrowRight}</button>
        </div>
      </div>
    </div>
  </div>
  <div class="nil-share">
    <em>Know someone else trying to figure out their next step? Share this quiz with them.</em>
    <span class="nil-share-pill">Share &nbsp;&ndash;&nbsp; ${NI.ig}${NI.li}${NI.yt}</span>
  </div>`,
  /* the band goes in the tail slot — outside .nil-wrap — so it runs the full
     width of the frame and gets clipped at both ends, which is the whole
     effect. 18 copies is more than fits at 1440 and that is the point. */
  `<div class="nil-band" aria-hidden="true">
    ${Array.from({length:18},()=>'<span>Builder</span>').join('')}
  </div>`) + (S.nilModal ? nilResultModal() : ''),

/* ==========================================================================
   4 · THE CONSULTANT FORM, STEP 1 OF 3
   The checkboxes are real inputs and they toggle, so the two that arrive
   ticked can be unticked and the answer walked back. The progress figure is
   the form's own — 33% of three steps — and it is left as the form states it
   rather than recalculated, because 33 is what the candidate saw.
   ========================================================================== */
consult1: () => nilPage('plain', `
  <div class="nil-form">
    <h2>Fill out the form below to get connected with a Talent Consultant</h2>
    <div class="nil-qgrp">
      <p class="nil-q">Where are you right now?<span class="req">*</span></p>
      <div class="nil-opts">
        ${nilOpt('In School')}${nilOpt('Playing a Sport')}
        ${nilOpt('Working',1)}${nilOpt('In Between')}
      </div>
    </div>
    <div class="nil-qgrp">
      <p class="nil-q">What are you hoping to get out of this?<span class="req">*</span></p>
      <div class="nil-opts">
        ${nilOpt('Figure Out My Direction',1)}${nilOpt('See How I Come Across')}
        ${nilOpt('A Film I Can Send Out')}${nilOpt('Just Curious')}
      </div>
    </div>
    ${nilProg(33)}
    <div class="nil-frow">
      <button class="nil-fbtn right" data-go="consult2">Next</button>
    </div>
  </div>`),

/* ==========================================================================
   5 · THE CONSULTANT FORM, STEP 2 OF 3
   Previous and Next both wired, so this step is walkable in either
   direction — which is the point of the whole exercise.
   ========================================================================== */
consult2: () => nilPage('plain', `
  <div class="nil-form">
    <div class="nil-qgrp" style="margin-top:0">
      <p class="nil-q">Best Time For A 15-Minute Call<span class="req">*</span></p>
      <div class="nil-opts">
        ${nilOpt('Mornings')}${nilOpt('Afternoons',1)}${nilOpt('Evenings')}
      </div>
    </div>
    <div class="nil-qgrp">
      <p class="nil-q">What&rsquo;s Next For You, In One Sentence?</p>
      <div class="nil-text">
        <input id="nc-one" type="text" placeholder="Say it however you&rsquo;d say it">
      </div>
    </div>
    ${nilProg(66)}
    <div class="nil-frow">
      <button class="nil-fbtn" data-go="consult1">Previous</button>
      <button class="nil-fbtn right" data-go="done">Next</button>
    </div>
  </div>`),

/* ==========================================================================
   6 · YOU'RE IN — AND THE HAND-OFF
   Their confirmation, with one control added: the seam. Everything before
   this button happened on nextinleadership.com and everything after it is
   TalentNext, so it goes to `stage:signup/create` — the product's own Create
   Account screen, unchanged, with the rest of the portal behind it.
   ========================================================================== */
done: () => nilPage('plain', `
  <div class="nil-note">
    <h2>You&rsquo;re in!</h2>
    <p>A talent consultant will be contacting you soon to schedule some time to chat.</p>
  </div>
  <hr class="nil-rule">
  <div class="nil-recv">
    <h2 class="dsp">What you&rsquo;ll receive:</h2>
    <div class="nil-recv-grid">
      <p class="dsp">One-on-one peer interviews and personalized feedback</p>
      <p class="dsp">Analyzation of strengths and weaknesses</p>
      <p class="dsp">Next steps on how to further your skills</p>
    </div>
  </div>
  <div class="nil-hand">
    <button class="nil-btn" data-go="stage:signup/create">Continue to TALENTnext ${I.arrowRight}</button>
  </div>`, '<div class="nil-foot-band" aria-hidden="true"></div>')

};

function nilOpt(label, on){
  return `<label class="nil-opt"><input type="checkbox"${on?' checked':''}>
    <span class="bx">${I.check}</span><span>${label}</span></label>`;
}
function nilProg(pct){
  return `<div class="nil-prog">
    <span class="pct">${pct}%</span>
    <div class="trk" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0"
      aria-valuemax="100"><i style="width:${pct}%"></i></div>
  </div>`;
}

/* --------------------------------------------------------------------------
   THE CODE BOXES CARRY THE CARET FORWARD
   Six single-character inputs are only usable if typing moves you along
   them, and the same is true backwards: backspace on an empty box steps back
   rather than sitting there. Delegated on `device`, and it filters on
   `.nil-otp` so it cannot touch the product's own `.otp` on the email
   verification screen, which prefills its digits and needs none of this.
   -------------------------------------------------------------------------- */
device.addEventListener('input', e => {
  const el = e.target;
  if(!el.closest || !el.closest('.nil-otp')) return;
  el.value = el.value.replace(/\D/g,'').slice(0,1);
  if(el.value) { const n = el.nextElementSibling; if(n && n.tagName==='INPUT') n.focus(); }
});
device.addEventListener('keydown', e => {
  const el = e.target;
  if(e.key !== 'Backspace' || !el.closest || !el.closest('.nil-otp')) return;
  if(el.value) return;
  const p = el.previousElementSibling;
  if(p && p.tagName==='INPUT'){ p.focus(); p.value=''; e.preventDefault(); }
});

/* The boot render in views.js ran before this file was parsed, and so did
   every re-render at the foot of ai.js .. ai5.js. Nothing in here wraps
   render, but the run-up's views did not exist for any of those calls — so
   the page is drawn once more, now that they do. Same reason as ai5.js's
   closing call, and this file is now the one that closes the bundle. */
render();
