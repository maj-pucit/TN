/* ==========================================================================
   MESSAGES, CERTIFICATIONS, AND THE LEADER'S OWN PROFILE

   The last three modules. Two of them are about other people and one is the
   only page on this portal that is about Priya.

   THE BOARD IS THE SAME BOARD, AND IT IS NO LONGER READ FROM HERE. `ROOM` in
   views.js is Cohort 41's discussion; the candidate reads it on their own
   Cohort page and the leader reads the identical thread from the other side, so
   a post made on either portal is on the other the moment the switcher flips.
   That is unchanged. What changed on 2 Sep 2026 is the DOOR: Messages used to
   hold the three cohort boards beside the direct threads, and Maryam took that
   section out ("remove the cohort boards section from messages module"). The
   leader now reads and posts to a board from the cohort's own page, where
   `V.leadCohort`'s Discussion tab draws `discussionRoom()`.
   ========================================================================== */

/* --------------------------------------------------------------------------
   THE OTHER TWO BOARDS — KEPT, AND CURRENTLY UNREAD

   Cohort 33 is in week 11 and its board sounds like it: people comparing notes
   on the end of the 90 days. Cohort 47 is four days old, so its board is the
   leader's own opening post and one reply — a thin board is the honest drawing
   of a cohort that has barely started.

   THESE TWO HAVE NO READER SINCE 2 Sep 2026 and they are kept anyway, which is
   a deliberate exception to this build's rule about deleting what nothing
   writes. That rule is about RULES and HANDLERS, where an orphan reads as a
   live capability; this is written CONTENT, and deleting nine posts of prose to
   satisfy a lint is a worse trade than leaving them addressable. `ldrBoard` is
   kept with them for the same reason: it is the one line that maps an id onto a
   board, so re-wiring is one edit rather than a rewrite.

   WHERE THEY BELONG IF THEY COME BACK: `V.leadCohort`'s Discussion tab
   (lead2), which today draws `discussionRoom()` for Cohort 41 and an empty
   state for the other two — so those two cohorts are described as empty while
   their boards sit here. Pointing that tab at `ldrBoard(c.id)` is the fix, and
   it needs `discussionRoom` to take its rows as an argument rather than
   closing over `ROOM`.

   Same row shape as `ROOM` — [name, img, initials, body, when, mine] — so
   `roomLine` draws all three without a branch.
   -------------------------------------------------------------------------- */
const LDR_BOARDS = {
  33: [
    ['day','Yesterday'],
    ['Owen Clarke','owen','OC','Two chapters left and I have started re-reading my own notes from week 1. The delegation stuff reads completely differently now.','5:20 PM'],
    ['Lena Fischer','lena','LF','Same. I went back to chapter 4 last night and it was almost annoying how obvious it seemed.','6:02 PM'],
    ['day','Today'],
    ['Priya Nair','priya','PN','That is exactly what week 11 is supposed to feel like. Bring one thing you would do differently now to Friday and we will spend the hour on those rather than on chapter 12.','8:15 AM',true],
    ['Zoe Bennett','lena','ZB','I am behind the rest of you — is it worth catching up before Friday or just coming as I am?','9:47 AM']
  ],
  47: [
    ['day','Monday'],
    ['Priya Nair','priya','PN','Welcome to Cohort 47. First call is Monday at 6. Before then: open chapter 1, and post one sentence here about what you are hoping to get out of the 90 days.','9:00 AM',true],
    ['Ahmed Farouk','owen','AF','Hoping to stop being the bottleneck on my own team. That is the honest version.','11:34 AM'],
    ['Beatriz Lima','lena','BL','Mine is hard conversations. I avoid them until they are twice as hard.','2:12 PM']
  ]
};

const ldrBoard = id => +id === LEAD_COHORTS[0].id ? ROOM : (LDR_BOARDS[id] || []);
/* `ldrPosts` IS DELETED (2 Sep 2026) — it counted a board's posts for a tab
   chip that had already gone, so it was a helper on a helper with no reader.
   It was `ldrBoard(id).filter(r => r[0] !== 'day').length` if a count is ever
   wanted on a board's own head, which is where that note said it belonged. */

/* --------------------------------------------------------------------------
   THE LEADER'S ONE-TO-ONE THREADS

   Three candidates, and each thread is about the thing their flag says. The
   candidate side draws its own half of the Priya thread in `V.messages`; this
   is not that thread — Maryam's is with her own leader and Maryam is in
   Cohort 41, so it IS the same relationship. It is left out of this list on
   purpose: the three here are the three the flags said Priya owed a message,
   which is what a leader opens this page to do.

   TOBIAS IS NO LONGER FLAGGED AND HIS THREAD STAYS, which is the right way round
   for an inbox. The attention queue was cut to three on 1 Sep 2026 and he was
   one of the nine who came back — so his thread is now what a resolved one looks
   like: Priya's message four days ago about eight days of silence, and his reply
   two days ago saying he is back and at 35%. A message list that only held
   currently-flagged people would delete its own history every time somebody
   recovered, which is the opposite of what `lnotes` and this page are for.
   -------------------------------------------------------------------------- */
/* EPIC 12.8 — a message carries text, a voice note (its duration) or an
   attachment (name/type/size); `readAt` on the thread is the time the candidate
   last read up to, shown as "Read <time>" under the leader's last message. A
   thread whose cohort has closed is read-only (the composer is replaced). */
/* ONE THREAD PER CANDIDATE IN THE LIVE COHORT (Maryam 30 Sep 2026: "show all 10
   candidates chats list here so it looks filled"). The ten are Cohort 41's own
   roster (`LEAD_COHORTS[0].members`), name/initials/photo matched so the inbox
   reads as the cohort. The three worked threads (Yuki, James, Tobias) keep their
   real exchanges; the other seven are authored placeholder last-messages (§74 —
   the seed has no per-candidate thread history), a mix of `me:0` (a reply is
   waiting, the accent dot) and `me:1` (you spoke last) so the list looks lived-in.
   PAST-COHORT THREADS ARE NO LONGER SHOWN (Maryam 30 Sep 2026: "do not show past
   cohort chats") — Owen's Cohort-33 thread stays in the data (readable by deep
   route, `threadActive` false) but the list renders active threads only. */
const LDR_THREADS = [
  {who:'Yuki Tanaka', i:'YT', img:'hana', co:41, readAt:'Tue 9:10 AM', msgs:[
    {me:1, t:'Yuki — you have not been in since week 1 and I would rather ask than assume. Is the course the problem, or is it everything else?', w:'Mon 9:12 AM'},
    {me:0, t:'Sorry. Work went sideways and I kept telling myself I would catch up at the weekend, and then I did not.', w:'Mon 10:40 PM'},
    {me:1, t:'That is the normal version of this, not the shameful one. Do not try to catch up — start at chapter 2 and come to Thursday even if you have done nothing. Turning up is the part that restarts it.', w:'Tue 8:05 AM'}
  ]},
  {who:'James Whitby', i:'JW', img:'owen', co:41, readAt:'Yesterday 8:30 PM', msgs:[
    {me:0, t:'I have re-taken the chapter 4 assessment three times and I am still at 65. Should I keep going at it?', w:'Yesterday 7:15 PM'},
    {me:1, t:'No. Leave it at 65 and move to 5. Four is the one that only makes sense after you have tried the thing at work and it has gone badly once. Come back to it in week 8 and it will score itself.', w:'Yesterday 8:02 PM'},
    {me:1, kind:'file', name:'handover-framework.pdf', size:184320, type:'PDF', w:'Yesterday 8:03 PM'}
  ]},
  {who:'Tobias Mensah', i:'TM', img:'samuel', co:41, readAt:null, msgs:[
    {me:1, t:'Tobias — eight days quiet and 18% at week 5. Not chasing you, just checking the course is still something you want.', w:'4 days ago'},
    {me:0, kind:'voice', dur:'0:22', w:'2 days ago'},
    {me:0, t:'Sorry — work ate the fortnight. I am back in and through to 35%.', w:'2 days ago'}
  ]},
  {who:'Aisha Bello', i:'AB', img:'priya', co:41, readAt:'Wed 7:40 PM', msgs:[
    {me:0, t:'Ran the delegation piece from chapter 6 with my team this morning and it actually landed. Thank you.', w:'Wed 6:55 PM'},
    {me:1, t:'That is the whole point of it. Bring what happened to Thursday and we will pull it apart with the group.', w:'Wed 7:38 PM'}
  ]},
  {who:'Daniel Kerr', i:'DK', img:'owen', co:41, readAt:'Yesterday 4:10 PM', msgs:[
    {me:1, t:'Daniel, you are a week ahead of pace. Slow down on 7 and sit with the hard-conversation drill before you move on.', w:'Yesterday 3:20 PM'},
    {me:0, t:'Noted. I will hold on 7 and bring a real one to work on.', w:'Yesterday 4:05 PM'}
  ]},
  {who:'Sofia Marchetti', i:'SM', img:'lena', co:41, readAt:null, msgs:[
    {me:0, t:'Could we move my one-to-one to after the Thursday call this week? Something has come up at work.', w:'Today 9:15 AM'}
  ]},
  {who:'Ravi Chandran', i:'RC', img:'samuel', co:41, readAt:'Mon 8:05 PM', msgs:[
    {me:1, t:'Ravi — your attempts are creeping up on every chapter. It is not the material, it is that you are grading yourself as you go. Answer first, check after.', w:'Mon 7:50 PM'},
    {me:0, t:'That is exactly it. I will try leaving the checking until the end.', w:'Mon 8:02 PM'}
  ]},
  {who:'Nora Lindqvist', i:'NL', img:'lena', co:41, readAt:'3 days ago', msgs:[
    {me:0, t:'Missed Thursday — was it recorded anywhere I can catch up on?', w:'3 days ago'},
    {me:1, t:'It was. I will send the LightspeedVT link. The part you want is the middle twenty minutes on the week-5 assessment.', w:'3 days ago'}
  ]},
  {who:'Chloe Ferreira', i:'CF', img:'priya', co:41, readAt:null, msgs:[
    {me:1, t:'Chloe — quiet week. Everything alright, or is the course slipping down the list?', w:'5 days ago'}
  ]},
  {who:'Maryam Naz', i:'MN', img:'hana', co:41, readAt:'Today 10:30 AM', msgs:[
    {me:0, t:'Booked my re-interview for next Tuesday. Anything I should go in ready to talk about?', w:'Today 10:05 AM'},
    {me:1, t:'The two calls you ran in weeks 3 and 4, not the chapter scores. They are what moved you.', w:'Today 10:28 AM'}
  ]},
  /* a past-cohort thread (Cohort 33, completed): kept for the record, NOT listed
     (Maryam 30 Sep 2026) — reachable only by an explicit route, never rendered */
  {who:'Owen Clarke', i:'OC', img:'owen', co:33, readAt:'12 Sep', msgs:[
    {me:0, t:'Thank you for the recommendation. The re-interview is next week and I feel ready for it.', w:'11 Sep'},
    {me:1, t:'You earned it. Go in and talk about the calls you ran, not the chapters you finished.', w:'11 Sep'}
  ]}
];

/* `S.ldrMsg` AND `S.ldrBoardCo` ARE BOTH GONE (2 Sep 2026). The first said
   which of three panes was showing — a board, a thread or the new-message
   picker — and the last two of those were removed on the same day, so a key
   with one possible value is not state. The second named which cohort's board
   the pane held. `S.ldrTh` is now the whole of what the pane reads. */
S.ldrTh = 0;
S.ldrDmQ = '';   /* the DM list search query (filters in place, `ldrDmSearch`) */
/* NARROW WIDTHS SHOW ONE OF THE TWO COLUMNS AT A TIME, and this is which.
   Both columns are always rendered — the class on `.ldr-dm` is what §36.17
   reads to decide, so at 900px and up the pair is a two-pane inbox whatever
   this says, and below it the same markup is a list you tap into and come
   back out of. State rather than a DOM class because `render()` rebuilds the
   panel from scratch (trap 9). */
S.ldrThOpen = false;
S.ldrRec = null;   /* EPIC 12.8 — voice-note recording in progress */
S.ldrEditProfile = false;

/* EPIC 12.8 — an attachment (prototype): the file's name/type/size ride the
   message; nothing is uploaded. */
device.addEventListener('change', e => {
  if(e.target.id !== 'ldrFile') return;
  const f = e.target.files && e.target.files[0]; if(!f) return;
  if(f.size > 25*1048576){ e.target.value=''; return; }   /* 25 MB cap */
  const ext = (f.name.split('.').pop()||'').toUpperCase();
  (LDR_THREADS[S.ldrTh] || LDR_THREADS[0]).msgs.push({me:1, kind:'file', name:f.name, size:f.size, type:ext, w:'Just now'});
  render();
});
/* the recording timer: one interval while S.ldrRec is set, driving #ldrRecTime
   by id (render rebuilds the element, so the interval keeps finding it). Uses
   ELAPSED time, not a counter (trap 17), and auto-stops at 5 minutes. */
function ldrRecTick(){
  if(S.ldrRec){
    if(!window.__ldrRecInt) window.__ldrRecInt = setInterval(() => {
      if(!S.ldrRec){ clearInterval(window.__ldrRecInt); window.__ldrRecInt = 0; return; }
      const ms = Date.now() - S.ldrRec.start;
      const el = device.querySelector('#ldrRecTime');
      if(el) el.textContent = Math.floor(ms/60000) + ':' + String(Math.floor(ms/1000)%60).padStart(2,'0');
      if(ms >= 300000){ const stop = device.querySelector('[data-ldrrecstop]'); if(stop) stop.click(); }
    }, 250);
  } else if(window.__ldrRecInt){ clearInterval(window.__ldrRecInt); window.__ldrRecInt = 0; }
}
/* `S.ldrAvail` was the third and is deleted with the weekly-calls sheet
   (2 Sep 2026) — a leader does not reschedule a cohort call. */

/* WHICH HALF OF THE PROFILE IS OPEN — trap 9, and it cannot be anything else.
   `render()` replaces `device.innerHTML`, so a class a click handler moves onto
   a tab button is gone at the next paint; and this tab does not merely SHOW a
   panel, it decides which sections the page emits at all, which is the same
   call `V.leadReports`' cohort strip makes with `S.ldrRep`. General is the
   default because it is the account — the thing you came to Profile to change —
   and the listing is what you came to check. */
S.ldrPfTab = 'general';

/* ==========================================================================
   MESSAGES

   IT IS ONE LIST OF PEOPLE. The wireframe had a pair of buttons for two
   sections and a second list inside each; then this file merged them into one
   rail of boards over threads; and on 2 Sep 2026 the boards came out
   altogether. What is left is the surface the module is named after — the
   leader's one-to-one threads — and a cohort's discussion is read on the
   cohort's own page, where `V.leadCohort`'s Discussion tab draws it.

   THE COMPOSER IS THE PRODUCT'S OWN. `.composer` is what the candidate's
   one-to-one uses, with the same four controls in the same order, so the two
   halves of one conversation are drawn by one component.
   ========================================================================== */
/* EPIC 12.8 — the private one-to-one thread: text, voice notes and attachments,
   read receipts, a past-cohorts section (a thread outlives its cohort), and a
   read-only state once the cohort closes. Voice recording and file uploads are
   PROTOTYPE — the note carries a duration and the file its name/type/size; no
   media leaves the browser. */
const KB = n => n < 1024 ? n + ' B' : n < 1048576 ? Math.round(n/1024) + ' KB' : (n/1048576).toFixed(1) + ' MB';
const dmName = name => SHOW_REAL.has(name)
  ? `<b>${name}</b> <span class="dm-h">${handleOf(name)}</span>`
  : `<b>${handleOf(name)}</b>`;
const threadActive = th => !!leadLive() && th.co === leadLive().id;

/* DM SEARCH — filters the conversation list IN PLACE, no render, so the caret
   stays put while you type (trap 9; same shape as `leadApplyRosterSearch`). The
   count in the list header is the total, not the filtered set — it says how many
   conversations you have, and re-typing it live would make it flicker. */
function ldrDmSearch(inp){
  S.ldrDmQ = inp.value;
  const q = (S.ldrDmQ||'').trim().toLowerCase();
  device.querySelectorAll('.ldr-dm-rows > .ldr-dm-t[data-dmname]').forEach(b=>{
    b.hidden = !!q && !b.getAttribute('data-dmname').includes(q);
  });
}

function msgBubble(msg, th){
  let body;
  if(msg.kind === 'voice') body = `<span class="m-voice">${I.microphone}<span class="m-voice-bar"></span><span class="m-voice-d">${msg.dur}</span></span>`;
  else if(msg.kind === 'file') body = `<span class="m-file">${I.attachment}<span class="m-file-b"><span class="m-file-n">${msg.name}</span><span class="m-file-s">${msg.type} &middot; ${KB(msg.size)}</span></span></span>`;
  else body = msg.t;
  return `<div class="m ${msg.me ? 'me' : 'them'}">
    <span class="m-av">${avatar(msg.me ? {i:LEADER.i, img:LEADER.img} : {i:th.i, img:AV[th.img]}, 32)}</span>
    <div class="m-c">
      <div class="m-b${msg.kind?' m-b-'+msg.kind:''}">${body}</div>
      <div class="m-w">${msg.w}${msg.me ? `<i class="m-tick">${I.check}</i>` : ''}</div>
    </div>
  </div>`;
}

V.leadMessages = () => {
  const th = LDR_THREADS[S.ldrTh] || LDR_THREADS[0];
  const waiting = t => t.msgs.length && t.msgs[t.msgs.length - 1].me === 0;
  const current = LDR_THREADS.map((t,i)=>({t,i})).filter(x=>threadActive(x.t));
  const lastMine = (() => { for(let i=th.msgs.length-1;i>=0;i--) if(th.msgs[i].me) return i; return -1; })();
  const active = threadActive(th);
  const rec = S.ldrRec;

  const dmRow = ({t,i}) => {
    const last = t.msgs[t.msgs.length - 1];
    const on = i === S.ldrTh;
    const lastTxt = last ? (last.me ? 'You: ' : '') + (last.kind==='voice'?'Voice note':last.kind==='file'?last.name:last.t) : 'No messages yet';
    /* what the DM search matches: the real name AND the handle, both lowercased,
       so a leader can find a thread by either (`ldrDmSearch` filters in place) */
    const key = (t.who + ' ' + handleOf(t.who)).toLowerCase();
    return `<button class="ldr-dm-t${on ? ' on' : ''}" data-ldrpick="${i}" data-dmname="${key.replace(/"/g,'&quot;')}" role="tab" aria-selected="${on}">
      <span class="mem-av mem-ph">${avatar({i:t.i, img:AV[t.img]}, 36)}</span>
      <span class="ldr-dm-tb">
        <span class="ldr-dm-tn">${dmName(t.who)}${waiting(t) ? '<i class="ldr-dm-dot" aria-label="waiting on your reply"></i>' : ''}</span>
        <span class="ldr-dm-tx">${lastTxt}</span>
      </span>
      <span class="ldr-dm-tw">${last ? last.w.replace(/ \d?\d:\d\d [AP]M/,'') : ''}</span>
    </button>`;
  };

  return `<main class="main"><div class="page msg-mod">
  ${crumb(['My Cohort','leadDash'],'Messages')}
  ${ph('Messages')}
  <div class="sec ldr-dm-sec">
    <div class="ldr-dm${S.ldrThOpen ? ' show-thread' : ''}">
      <div class="ldr-dm-list" role="tablist" aria-label="Your conversations">
        <div class="ldr-dm-lh">Direct messages<span class="t-helper-01">${current.length}</span></div>
        <label class="ldr-dm-srch">${I.search}
          <input type="search" placeholder="Search conversations" value="${(S.ldrDmQ||'').replace(/"/g,'&quot;')}" oninput="ldrDmSearch(this)" aria-label="Search conversations"></label>
        <div class="ldr-dm-rows">${current.map(dmRow).join('')}</div>
      </div>
      <div class="ldr-dm-thread">
        <div class="ldr-dm-h">
          <button class="ph-back ldr-dm-back" data-ldrthback="1" aria-label="Back to your conversations">${I.arrowLeft}</button>
          <span class="mem-av mem-ph">${avatar({i:th.i, img:AV[th.img]}, 36)}</span>
          <span class="ldr-dm-hb"><b>${SHOW_REAL.has(th.who)?th.who:handleOf(th.who)}</b><span>Private &middot; Cohort ${th.co}${active?'':' &middot; closed'}</span></span>
        </div>
        <div class="msgs">
          ${th.msgs.length ? '' : `<div class="m-day"><span>No messages yet &mdash; this one starts with you</span></div>`}
          ${th.msgs.map((msg,i) => msgBubble(msg, th) + (i===lastMine && th.readAt ? `<div class="m-read">Read ${th.readAt}</div>` : '')).join('')}
        </div>
        ${!active
          ? `<div class="dm-closed">This cohort has closed. You can still read your messages.</div>`
          : rec
          ? `<div class="composer composer-rec">
              <button class="composer-act dm-rec-x" data-ldrrecdiscard="1" aria-label="Discard">${I.close}</button>
              <span class="dm-rec-live"><span class="dm-rec-dot"></span>Recording <span id="ldrRecTime">0:00</span></span>
              <button class="composer-send" data-ldrrecstop="1" aria-label="Send voice note">${I.send}</button>
            </div>`
          : `<div class="composer">
              <label class="composer-act composer-lead" aria-label="Attach a file">${I.attachment}
                <input type="file" id="ldrFile" hidden accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.png,.jpg,.jpeg,.gif,.heic"></label>
              <input class="inp" id="ldrReply" placeholder="${th.msgs.length ? 'Reply to' : 'Message'} ${th.who.split(' ')[0]}" aria-label="${th.msgs.length ? 'Reply' : 'Message'}">
              <button class="composer-act" data-ldrrecstart="1" aria-label="Record a voice message">${I.microphone}</button>
              <button class="composer-send" data-ldrreply="1" aria-label="Send">${I.send}</button>
            </div>`}
      </div>
    </div>
  </div>
</div></main>`;
};

/* ==========================================================================
   CERTIFICATIONS

   WHAT LEADING EARNS, AND IT IS NOT MONEY. This is the module that replaced
   Earnings, and the replacement is the whole argument: a cohort leader
   volunteers, and certifications are how the contribution is recognised. The
   note saying so is the one wireframe note that IS for the leader, so it
   crosses.

   A CERTIFICATION IS A `.cert`, THE COMPONENT THE CANDIDATE GETS AT THE END
   OF A COURSE. Same object, same drawing: a mark, an eyebrow, a name, the
   date and the signature, and something to download. The wireframe drew them
   as a four-column table; a table is right for comparing cohorts and wrong
   for a thing you earned and want to look at.

   THE ONE IN PROGRESS IS NOT A `.cert`, because there is nothing to download
   and a greyed-out certificate is a certificate you have not got. It is a
   requirements list — the three things it takes and which are done — which is
   the only page on this portal that tells the leader what to do next for
   themselves.
   ========================================================================== */
/* `k` IS THE BADGE ARTWORK AND IT IS STATED PER ROW, NOT DERIVED (Maryam, 2 Sep
   2026: "this certifications page on cohort leader should look like the
   certifications experience on the candidate portal"). `CERT_ART` is the six
   embedded WebPs `build.py` carries, and the candidate's own tab reads it the
   same way through `certAll`'s `k`. Deriving the key from the name would be a
   string match on product copy — the thing `factIcon`'s `\bstar\b` bug is the
   worked example of, one file over.
   THE THREE PICKED HERE ARE ABOUT THE SUBJECT: `cohort` for leading one,
   `assess` for levelling, `course` for facilitating the 90 days. Nothing is
   minted; a fourth certification takes whichever of the six fits. */
const LDR_CERTS = [
  {k:'cohort', n:'Certified Cohort Leader', track:'Foundation', on:'February 12, 2026', by:'TalentNext'},
  {k:'assess', n:'Assessment &amp; Levelling', track:'Core', on:'March 3, 2026', by:'TalentNext'},
  {k:'course', n:'90-Day Programme Facilitation', track:'Core', on:'April 21, 2026', by:'TalentNext'}
];

/* ==========================================================================
   THE CERTIFICATIONS PAGE IS THE CANDIDATE'S, ONE PORTAL OVER — 2 Sep 2026

   `certsTab` (views.js) was rebuilt the same day against two screenshots of a
   Credly profile: a black card headed "Congratulations on your most recent
   certification" holding the badge, the name and the issuer with the two
   controls at the end of the row, then "All certifications" over a grid of
   upright cards. This page had the same content in the shapes that preceded
   it — a `.cert` hero and a `.tile-stack` of `.cardrow`s — so what changes is
   the drawing and not one figure.

   IT IS THE SAME CLASSES, NOT A CALL TO `certHero` / `certGrid`. Both of those
   read `CERT_ART[c.k]` (which crosses) and then do two things that do not: the
   hero's Download is `data-go="transcript"`, a CANDIDATE view, and every grid
   card is a `data-go="transcript"` target. A leader's certificate has no page
   of its own in this build, so the leader's cards are `<div>`s — §60's rule,
   arrived at from the honest side: rather than draw a control that goes
   nowhere, do not draw a control.

   THE HERO IS `.dark-card` AND IT LEADS THE PAGE. It was the third section,
   under the figure band and a `.note`; the reference puts the certification
   first because it is what the page is about, which is also §75's own test for
   who may be black. It is NOT `.cert` any more, and that is the fix for the
   trap the old note here recorded at length: `.cert` is in ai5's `DARK_CARD`,
   so `placeDark` hoisted it into the head band and the page had to be written
   around that. `.dark-card` is in no pass's list, so the card simply stays
   where it is written and the band keeps its own full-width summary.
   ========================================================================== */
const ldrCertHero = c => `<div class="sec dark-card crt-dark">
    <div class="dc-hd"><div class="dc-hd-r">
      <h2 class="dc-t">Congratulations on your most recent certification &#127881;</h2>
    </div></div>
    <div class="crt-hero">
      <span class="crt-art"><img src="${CERT_ART[c.k]}" alt=""></span>
      <span class="crt-hero-b">
        <span class="crt-hero-n">${c.n}</span>
        <span class="crt-hero-i">TALENTnext</span>
      </span>
      ${''/* Download leads and takes the accent, Share link is the quiet one —
            the order and the fill the candidate's card settled on 2 Sep, and
            the reason is the same on both: this product's certificate is a
            thing you TAKE, and a share link is something you generate after. */}
      <span class="crt-hero-a">
        <button class="btn btn-p btn-sm ic-l">${I.download} Download</button>
        <button class="btn btn-sm ic-l">${I.link} Share link</button>
      </span>
    </div>
  </div>`;

/* THE NEWEST ONE IS IN THE GRID TOO, which is the candidate tab's own decision
   and its note is the argument: an "all" that silently drops the newest is a
   collection with a hole in it. Newest first, so the grid opens on the card the
   hero is about. */
const ldrCertGrid = list => list.slice().reverse().map(c => `<div class="crt-card">
    <span class="crt-art"><img src="${CERT_ART[c.k]}" alt=""></span>
    <span class="crt-n">${c.n}</span>
    <span class="crt-i">${c.by}</span>
    <span class="crt-on">Issued ${c.on}</span>
  </div>`).join('');

V.leadCerts = () => {
  const led = 8, hours = 42;
  const promoted = 34;
  /* `calls` IS DELETED WITH "THE RECORD BEHIND THEM" (2 Sep 2026), which was its
     only reader. It was `led * 13` — thirteen calls a cohort, derived rather than
     typed so the figure could not disagree with the cohorts closed — and the cell
     it filled replaced an "Interviews conducted: 62" that was an AGENT's number on
     a volunteer's record. Worth restoring in that derived form if a call count
     ever comes back; it belongs on `V.leadProfile` with the other four. */
  return `<main class="main"><div class="page">
  ${crumb(['Dashboard','leadDash'],'Certifications')}
  ${''/* Three blocks in a row were explaining this page: this line, Tal's
        summary, and a 44-word `.note` about the volunteer role. The stat
        cells below state the four figures, Tal reads them, and the note
        makes the one point neither can. This line was the redundant third.
        THE NOTE IS NOW GONE TOO (Maryam, 2 Sep 2026 — "remove the 'Leading is
        a volunteer role' part"), so of the three only Tal's summary is left,
        which is where a page's own reading belongs. */}
  ${ph('Certifications')}
  ${ldrCertHero(LDR_CERTS[LDR_CERTS.length - 1])}
  <div class="sec">
    <div class="stats">
      ${statCell(I.certificate, 'Certifications', LDR_CERTS.length, 'one more in progress')}
      ${statCell(I.group, 'Cohorts led', led, 'as a volunteer')}
      ${statCell(I.trophy, 'Candidates promoted', promoted, 'across those eight cohorts')}
      ${statCell(I.time, 'Training hours', hours, 'this year')}
    </div>
  </div>
  ${''/* THE VOLUNTEER NOTE STOOD HERE AND IS DELETED (Maryam, 2 Sep 2026:
         "remove the 'Leading is a volunteer role' part") — a `.note` with
         `I.info`, a bold lead-in and 44 words about there being no fees and no
         settlements on this side of TalentNext.

         WHY IT WAS HERE, so it is not rebuilt by accident: this page replaced
         an Earnings page, and the note was the replacement's explanation of
         itself. "No money anywhere" is one of the four rules the wireframe
         settled for this portal, and a page of certifications standing where a
         balance used to stand is the one place a reader might ask where the
         money went.

         WHY IT CAN GO. Nothing on this portal has said anything about a fee
         for two builds — there is no Earnings slot in the rail, no figure with
         a currency on any leader page — so the note was answering a question
         the product no longer prompts. What it actually asserted survives in
         two places that are not explanations: `V.leadProfile`'s Role row reads
         "Volunteer cohort leader · unpaid", and the figure cell 40px above this
         said "as a volunteer" under Cohorts led. A fact stated in a record beats
         the same fact stated in a panel about the record.

         THE `.note` COMPONENT IS UNTOUCHED and has readers on both portals —
         this is one caller, not the class. */}
  ${''/* "EARNED" IS "ALL CERTIFICATIONS" AND ITS ROWS ARE CARDS. The list was
         a `.tile-stack` of `.cardrow`s — a 40px glyph, the name with an
         "Active" tag, the track and date, and a "Certificate" button at the far
         end — and the candidate tab's own note is why that shape lost: the
         badge IS the object rather than an icon standing in for it, and a 40px
         slot cannot hold a 90px disc with type around its rim.
         TWO THINGS WENT WITH THE ROW AND NEITHER IS A LOSS. The "Active" tag
         said the same thing for all three, on a page where nothing expires;
         and the per-row "Certificate" button was the only control on the page
         that did nothing, which the hero's Download now does — once, on the
         card the page is about. */}
  <div class="sec">
    <div class="sec-h"><h2>All certifications</h2><span class="t-helper-01">Yours to keep and to share</span></div>
    <div class="crt-grid">${ldrCertGrid(LDR_CERTS)}</div>
  </div>
  ${''/* "IN PROGRESS" AND "THE RECORD BEHIND THEM" ARE BOTH DELETED (Maryam,
         2 Sep 2026). The page is now the hero certificate and the grid of all
         of them, which is what "Certifications" is.

         WHAT "IN PROGRESS" WAS: the Candidate Mentoring / Advanced track
         requirement — a `.kv` pair (what it opens, awarded when) over a
         three-step `ol.steps` with two ticked and one counted, and a paragraph
         explaining what "reviewed" means. It was the longest block on the page
         and it was about a certificate that does not exist yet, under a heading
         that says the page is about the ones that do.

         WHAT "THE RECORD BEHIND THEM" WAS: a four-cell `.facts` band — leading
         since, cohorts closed, cohort calls led, assessing range. Every one of
         those four is on `V.leadProfile`, which is where a fact about the
         LEADER belongs rather than on a page about their certificates.

         ONLY `calls` LOSES ITS READER. `led` and `hours` are still the third
         and fourth cells of the `.stats` band at the top of this page, so they
         stay; `LEADER.since` and `LEADER.range` are drawn on `V.leadProfile`.
         The one figure with nowhere left to go is the call count, and its
         derivation is recorded where it was declared rather than deleted in
         silence. */}
</div></main>`;
};

/* ==========================================================================
   THE LEADER'S PROFILE

   THE MONEY PROBLEM, STATED. Priya is in `AGENTS` on the candidate side with
   a price of $95, because as a TALENT AGENT she is paid for a 45-minute
   interview. As a COHORT LEADER she volunteers. Both are true of the same
   person and the wireframe never had to face it, because its leader was a
   different human from any of its agents.

   So this page does NOT draw `agentCardH('priya')`, which would be the neat
   reuse: that component prints `a.price`, and a fee on the volunteer portal
   would contradict the rule lead.js is built on in the one place a leader
   looks at themselves. What it draws instead is the part of the public listing
   that IS about leading — the rating, the cohorts, the range and the bio — and
   it says which of the two roles the page is about.

   AND SINCE 1 SEP 2026 THE SEPARATION IS THE WHOLE PAGE, NOT A CAVEAT ON IT.
   A cohort leader does not interview, so three things on this page were the
   agent's record standing on the volunteer's page: "62 interviews" on the
   public card and again under Your standing, a 45-minute "session length", and
   an availability calendar whose entire purpose was letting candidates book an
   interview. Each is replaced by the leading equivalent rather than deleted,
   because the page still has to answer the same four questions — who you are,
   what candidates see, when you are on, and how you are measured.

   EDITING IS A SHEET, READING IS THE PAGE. Same shape as the candidate's own
   Profile: `.idhead` with the photo, a `.tile` of `.kv` rows for what is set,
   and an Edit control on the row it edits (§29.10). A page of live inputs
   would be the wireframe's drawing, and this product does not have one.

   AND IT IS TWO TABS SINCE 2 SEP 2026 — General Profile and Public Profile
   (Maryam: "this page should have 2 tabs right after the summary section …
   divide the content in both profile tabs accordingly").

   THE LINE BETWEEN THEM IS *WHO THE BLOCK IS FOR*, which this page had already
   half-drawn: "What candidates see" is a section whose whole heading is that
   distinction, and every note above about the money problem is the same
   question asked once. **Public is what a candidate reads when they choose you.
   General is the account behind it — nobody else ever sees a line of it.**

     Public   the card, the bio, the three listing fields that MAKE the card
              (specialism, assessing range, call length), and Your standing —
              the four figures the card's "4.9 · 8 cohorts led" is the summary of
     General  who you are and how to reach you, when you are on, who reviews
              you, and what you are told about

   THE `.kv` TILE IS THE ONE BLOCK THAT HAD TO BE CUT IN TWO, and the cut is not
   arbitrary — it is the EDIT SHEET's own list. `ldrProfileSheet` edits display
   name, specialism, bio and call length, and four of those five rows are
   therefore listing copy; only Role is a fact about the account. So General
   keeps Display name and Role, and Public takes Specialism, Assessing range and
   Call length under a heading that says what they are for. A reader who wants
   to change the bio and a reader who wants to change their notifications were
   being sent to the same undifferentiated tile.

   YOUR STANDING GOES PUBLIC AND THAT IS THE ONE JUDGEMENT WORTH ARGUING. It is
   headed "Read-only · across every cohort you have closed", which sounds like a
   private performance record — but 4.9 and "8 cohorts led" are printed on the
   card 200px above it, so the section is the working behind two numbers a
   candidate is already reading. On the General tab it would be the only block
   there that somebody else can see.

   THE STRIP IS `.sec.sec-cs` + `.cs`, WHICH IS `V.leadReports`' OWN SHAPE —
   §16 zeroes a section holding a tab strip and §20 knows the marker, so the
   two grounds meet on one line with no rule of its own. It sits directly after
   `ph()` so it is the first thing under the head band, which is what "right
   after the summary section" names: `placeBand`'s run walks forward from the
   `.ph` taking Tal's card, the ask line and any declared `.head-sec`, and a
   plain `.sec` is none of those — so the run stops HERE and the band closes
   above the tabs rather than swallowing them.
   ========================================================================== */
V.leadProfile = () => `<main class="main"><div class="page">
  ${crumb(['Dashboard','leadDash'],'Your profile')}
  ${ph('Your profile',`${LEADER.range} &middot; leading since ${LEADER.since}`)}

  ${''/* FOUR TABS, THE CANDIDATE'S PROFILE MODULE MIRRORED (Maryam, 7 Sep 2026:
        "the cohort leader profile module needs to be same as the candidate profile
        module", then "notifications will be a different tab, add privacy settings
        tab as well"). General is the candidate's My Profile shape — a 72px idhead,
        a four-fact band and an About paragraph, with the four figures and the bio
        made leader-appropriate. Notifications and Privacy Settings are their own
        tabs now; Privacy is the candidate's `pfPrivacy` composition (Sign in and
        security over Closing your account), reusing `S.pfPw`/`data-pfpw` and the
        shared delete confirm. */}
  <div class="sec sec-cs">
    <div class="cs" role="tablist" aria-label="Profile sections">
      <button class="${S.ldrPfTab === 'general' ? 'on' : ''}" role="tab"
        aria-selected="${S.ldrPfTab === 'general'}" data-ldrpf="general">General Profile</button>
      <button class="${S.ldrPfTab === 'public' ? 'on' : ''}" role="tab"
        aria-selected="${S.ldrPfTab === 'public'}" data-ldrpf="public">Public Profile</button>
      <button class="${S.ldrPfTab === 'notif' ? 'on' : ''}" role="tab"
        aria-selected="${S.ldrPfTab === 'notif'}" data-ldrpf="notif">Notifications</button>
      <button class="${S.ldrPfTab === 'privacy' ? 'on' : ''}" role="tab"
        aria-selected="${S.ldrPfTab === 'privacy'}" data-ldrpf="privacy">Privacy Settings</button>
    </div>
  </div>

  ${S.ldrPfTab === 'general' ? `
  ${''/* GENERAL — idhead + four facts + About, the candidate's `pfSecView.general`
        shape. The four are the leader's standing (candidate rating, cohorts led,
        completion, level movement) — the figures that used to sit under "Your
        standing" on the Public tab; here they are the reader's own dashboard, and
        the Public card keeps the two a candidate reads (rating and cohorts). */}
  <div class="sec">
    <div class="idhead">
      <span class="idphoto"><span class="av-ph" style="width:72px;height:72px"><i>${LEADER.i}</i><img src="${LEADER.img}" alt=""></span><i class="av-on" aria-hidden="true"></i></span>
      <div class="idhead-b">
        <span class="idname">${LEADER.n}</span>
        ${''/* "Leading since …" ALONE (Maryam, 9 Sep 2026: "remove the line
              'Volunteer cohort leader · ' and make the next word 'Leading' L
              capital"). The unpaid/volunteer fact lives elsewhere; the sub-line
              is the tenure. */}
        <span class="idmeta">Leading since ${LEADER.since} · Assesses ${LEADER.range}</span>
        ${''/* THE ASSESS RANGE IS A BORDERLESS LINE, LEFT-ALIGNED WITH THE NAME
              (Maryam, 9 Sep 2026: "remove the border of Assesses E1–E3 and align
              it with other above content"). It was a `.tag sm` chip, indented by
              its own border and padding; a plain `.idmeta` line sits at the same
              left edge as the name and the tenure. */}
      </div>
      <div class="idhead-a"><button class="btn btn-g" data-ldrprof="1">Edit Profile ${I.edit}</button></div>
    </div>
    <div class="facts pf-facts">
      ${pfFact(I.starOutline, '--mk-2', 'Candidate Rating', '4.9')}
      ${pfFact(I.group, '--mk-1', 'Cohorts Led', '8')}
      ${pfFact(I.chart, '--mk-3', 'Completion Rate', '84%')}
      ${pfFact(I.growth, '--mk-4', 'Average Level Movement', '+0.8 levels')}
    </div>
  </div>
  <div class="sec">
    <div class="sec-h"><h2>About</h2></div>
    ${LEADER.bio.split('\n\n').map(t => `<p class="t-body pfe-about">${t}</p>`).join('')}
  </div>
  ${''/* SPECIALITIES ON THE GENERAL TAB TOO (Maryam, 9 Sep 2026: "the cohort
         leader profile should have specialities as well"). The same `.skl` chip
         cloud and `LEADER.specs` the Public tab draws — the leader's own record
         of what they lead on, on both tabs. */}
  <div class="sec">
    <div class="sec-h"><h2>Specialities</h2></div>
    <div class="skl">${LEADER.specs.map(t => `<span class="skl-c">${t}</span>`).join('')}</div>
  </div>` : ''}

  ${S.ldrPfTab === 'public' ? `
  ${''/* PUBLIC — REBUILT ON THE TALENT AGENT'S PUBLIC PROFILE (Maryam, 9 Sep 2026:
        "improve the cohort leader public profile just like talent agent public
        profile"). The agent's tab is: a large 72px identity with the rating and
        assess range on one `.idmeta` line, a four-cell figure band, an About me
        paragraph and a Specialities chip cloud — no "public profile" heading, no
        description and no edit button (editing lives one tab over, on General's
        "Edit details"). This tab now reads the same, with the leader's own facts.

        THE FOUR CELLS are the leader's, not the agent's: the agent's Interview
        Fee / Availability / Evaluation Time / Experience become Cohorts led /
        Call length / Cadence / Leading since — a cohort leader is unpaid and
        nobody books them from this card (the old disclaimer's point), so there is
        no fee cell; the rating and range stay in the `.idmeta` line, so the cells
        do not repeat them. The old "Your listing" kv (Specialism / Assessing
        range / Call length) is folded in: range to the idmeta, call length to a
        cell, and Specialism becomes the chip cloud (`LEADER.specs`).

        `.sec-noline` on the first two so identity, figures, About and
        Specialities read as ONE band, exactly as the agent's do; no `.av-on` dot
        — the green marker is the owner's own view, not the listing (§09). */}
  <div class="sec sec-noline">
    <div class="idhead">
      <span class="idphoto"><span class="av-ph" style="width:72px;height:72px"><i>${LEADER.i}</i><img src="${LEADER.img}" alt=""></span></span>
      <div class="idhead-b">
        <span class="idname">${LEADER.n}</span>
        <span class="idmeta"><span style="color:var(--star)">&#9733;</span> 4.9 &middot; Assesses ${LEADER.range}</span>
      </div>
    </div>
    <div class="facts pf-facts">
      ${pfFact(I.group, '--mk-1', 'Cohorts led', '8')}
      ${pfFact(I.time, '--mk-2', 'Call length', '60 min')}
      ${pfFact(I.calendar, '--mk-3', 'Cadence', 'Weekly')}
      ${pfFact(I.shield, '--mk-4', 'Leading since', LEADER.since)}
    </div>
  </div>
  <div class="sec sec-noline">
    <div class="sec-h"><h2>About</h2></div>
    ${LEADER.bio.split('\n\n').map(t => `<p class="t-body pfe-about">${t}</p>`).join('')}
  </div>
  <div class="sec">
    <div class="sec-h"><h2>Specialities</h2></div>
    <div class="skl">${LEADER.specs.map(t => `<span class="skl-c">${t}</span>`).join('')}</div>
  </div>` : ''}

  ${S.ldrPfTab === 'notif' ? `
  <div class="sec">
    <div class="sec-h"><h2>Notifications</h2></div>
    <label class="tg"><div class="tb"><b>Candidate Inactivity</b><span>Notify me when a candidate hasn’t signed in for four days.</span></div><input type="checkbox" checked><span class="sw"></span></label>
    <label class="tg"><div class="tb"><b>Upcoming Cohort Call</b><span>Send one reminder an hour before a cohort call.</span></div><input type="checkbox" checked><span class="sw"></span></label>
    <label class="tg"><div class="tb"><b>Cohort Board Activity</b><span>Send a daily digest of new cohort posts.</span></div><input type="checkbox" checked><span class="sw"></span></label>
    <label class="tg"><div class="tb"><b>90-Day Summary Reminder</b><span>Remind me one week before a cohort reaches day 90.</span></div><input type="checkbox"><span class="sw"></span></label>
  </div>` : ''}

  ${S.ldrPfTab === 'privacy' ? `
  <div class="sec">
    <div class="sec-h"><h2>Sign-In &amp; Security</h2></div>
    <div class="tile-stack">
      <div class="cardrow pfe-row pf-sr">
        <span class="pf-sr-ic" style="--mk:var(--mk-1)">${I.email}</span>
        <span class="cardrow-b"><span class="cardrow-t">${LEADER.email}</span>
          <span class="cardrow-d">Your email address is used to sign in and cannot be changed.</span></span>
      </div>
      <div class="cardrow pfe-row pf-sr">
        <span class="pf-sr-ic" style="--mk:var(--mk-3)">${I.locked}</span>
        <span class="cardrow-b"><span class="cardrow-t">Password</span>
          <span class="cardrow-d">Last changed ${PF_PW_SET}.</span></span>
        ${S.pfPw
          ? `<button class="btn btn-g btn-sm" data-pfpw="0">Cancel ${I.close}</button>`
          : `<button class="btn btn-g btn-sm noic" data-pfpw="1">${I.renew} Reset Password</button>`}
      </div>
    </div>
    ${S.pfPw ? `
    ${pfFields('pw', [
      ['cur','Current password','x',{t:'pw', ac:'current-password', w:1, ph:'The one you use now'}],
      ['new','New password','x',{t:'pw', ph:'At least 12 characters'}],
      ['rep','Repeat new password','x',{t:'pw', ph:'The same again'}]
    ])}
    <div class="pfe-foot pfe-foot-in">
      <button class="btn btn-g" data-pfpw="0">Cancel ${I.close}</button>
      <button class="btn btn-p noic" data-pfpw="0">Update password ${I.check}</button>
    </div>` : ''}
  </div>
  <div class="sec">
    <div class="sec-h"><h2>Close Your Account</h2></div>
    <div class="close-b">
      <p class="t-body close-x">Deleting your account permanently removes your profile, cohort notes, and leadership history. Any certificates you’ve earned remain valid and available to download.</p>
      <div class="close-a">
        <button class="btn btn-p danger" data-del="1">Delete Account</button>
      </div>
    </div>
  </div>` : ''}
</div></main>`;

/* ==========================================================================
   THE TWO SHEETS THIS PAGE OWNS
   Pushed onto lead2.js's registry rather than mounted separately, so every
   leader-side sheet lives in the one host that pass already maintains.
   ========================================================================== */
function ldrProfileSheet(){
  return `<div class="modal ${S.ldrEditProfile ? 'on' : ''}" data-ldrclose="prof">
    <div class="sheet">
      <div class="sheet-h"><h2>Edit your details</h2>
        <button class="x" data-ldrclose="prof" aria-label="Close">${I.close}</button></div>
      <div class="sheet-b">
        <div class="idhead mb6">
          <span class="av-ph" style="width:64px;height:64px"><i>${LEADER.i}</i><img src="${LEADER.img}" alt=""></span>
          <div class="idhead-b">
            <span class="idname">Your photo</span>
            <span class="idmeta">Shown on your card and to every cohort you lead.</span>
            <button class="lk">Change photo</button>
          </div>
        </div>
        <div class="f"><label for="ldrPn">Display name</label>
          <input class="inp" id="ldrPn" value="${LEADER.n}"></div>
        <div class="f"><label for="ldrPs">Specialism</label>
          <input class="inp" id="ldrPs" value="Operations teams, first-line leadership"></div>
        <div class="f"><label for="ldrPb">Bio shown on your card</label>
          <textarea class="inp" id="ldrPb" rows="8">${LEADER.bio}</textarea></div>
        <div class="f"><label for="ldrPl">Cohort call length</label>
          <select class="inp" id="ldrPl"><option>60 minutes</option><option>45 minutes</option><option>90 minutes</option></select></div>
        <p class="t-helper-01">Your assessing range comes from your certifications and cannot be set here.</p>
      </div>
      <div class="sheet-f">
        <button class="btn btn-s noic" data-ldrclose="prof">Cancel</button>
        <button class="btn btn-p noic" data-ldrclose="prof">Save changes</button>
      </div>
    </div>
  </div>`;
}

/* THE WEEKLY-CALLS SHEET IS DELETED — `ldrAvailSheet`, `ldrDays` and
   `LDR_DAY_NAMES` with it (Maryam, 2 Sep 2026: "a cohort leader can not
   reschedule a weekly call so remove that flow").

   IT WAS A WEEK OF `.tg` TOGGLES, one row per weekday, each cohort's hour read
   off `LEAD_COHORTS` so the sheet could not drift from the three other surfaces
   that state the same string — and its own helper line is the sentence that
   ended it: "moving one moves it for every candidate in that cohort, so the
   change is announced on their board." A control that reschedules ten people's
   week is not a leader's, which is the same boundary 1 Sep drew when the level
   decision came off this portal.

   THE DERIVATION IS WORTH KEEPING IN WORDS, because the next sheet that lists a
   leader's week will want it: the day column was `c.call.split(' ')[0]` rather
   than a typed list, after this sheet had already drifted once — its Monday row
   said "Cohort 47 call at 6:00 PM" while `LEAD_COHORTS[2].call` said the same
   thing in two other places. `lcall` / `lcTitle` / `lcDetail` in lead.js are
   that rule as it survives, with three readers each.

   `S.ldrAvail`, THE `data-ldravail` BRANCH AND THE `'avail'` CLOSE BRANCH GO
   TOO, and so do both call sites — the Calls page's Reschedule (lead3) and this
   page's own Manage row. A sheet nothing opens is the "gate nothing writes"
   tell one level up. `.tg` / `.sw` are untouched: the notification switches
   three sections above are the component's real caller. */

/* EPIC 12.7 — discussion state */
S.discReplyTo = null;
S.discEdit = null;
S.discPinAsk = null;

/* ==========================================================================
   EPIC 12.7 — THE COHORT DISCUSSION

   Threaded posts, most recent thread first: pin (one at a time, leader only),
   reply (one level deep), react (a single thumbs up, toggled), edit for one hour
   after posting, a "Cohort Leader" badge on the leader's posts and "You" on your
   own. There is NO delete and NO moderation in V1 — a post, once made, stands.
   Leader-side only; the same board is the candidates' Discussion tab (built with
   the candidate portal, out of this pass).
   ========================================================================== */
const LEAD_ME = {n:'Priya Nair', handle:'@priya', img:AV.priya, ini:'PN', leader:true};
const discWho = m => ({n:m.name, handle:handleOf(m.name), img:AV[m.img], ini:m.ini});
/* seed authors off the active roster so faces/handles agree with the rest */
const discM = name => { const c = leadLive(); const m = c && c.members.find(x=>x.name===name);
  return m ? discWho(m) : {n:name, handle:handleOf(name), img:AV.hana, ini:name.slice(0,2).toUpperCase()}; };

/* AUTHORED (§74): the seed has no discussion store. Threads are newest-first;
   `at` is old on every seed so nothing is inside the 1-hour edit window. */
let LEAD_DISC = [
  {id:'t1', who:LEAD_ME, text:'Thursday we run chapter 5, Hard Conversations. Bring one real example from your own week, not a hypothetical. It does not have to have gone well.', when:'2 days ago', at:0, pinned:true, reacts:['Aisha Bello','Daniel Kerr','Ravi Chandran','Sofia Marchetti'], replies:[
    {id:'r1', who:discM('Daniel Kerr'), text:'Mine went badly, so this is good timing.', when:'2 days ago', at:0, reacts:['Aisha Bello']}]},
  {id:'t2', who:discM('Daniel Kerr'), text:'Did anyone else find chapter 4 harder than the three before it? I have read the handover section twice.', when:'Yesterday', at:0, pinned:false, reacts:['Aisha Bello','Ravi Chandran','Nora Lindqvist'], replies:[
    {id:'r2', who:discM('Aisha Bello'), text:'Yes. It is the first one that asks you to change something at work rather than understand something.', when:'Yesterday', at:0, reacts:['Daniel Kerr','Sofia Marchetti']},
    {id:'r3', who:LEAD_ME, text:'That is the point of it. The reading is the easy half. Try one small handover this week and we will look at it on the call.', when:'Yesterday', at:0, reacts:['Daniel Kerr']}]},
  {id:'t3', who:discM('Sofia Marchetti'), text:'Bringing my example on Thursday. Mine is a vendor review that went badly and I still think I was right to take it back.', when:'5 hours ago', at:0, pinned:false, reacts:['Ravi Chandran'], replies:[]}
];

const DISC_EDIT_MS = 60*60*1000;
const discEditable = p => !!p.at && (Date.now() - p.at) < DISC_EDIT_MS && p.who.handle === LEAD_ME.handle;
const discPinned = () => LEAD_DISC.find(t => t.pinned);
const discFind = id => { for(const t of LEAD_DISC){ if(t.id===id) return t; const r=t.replies.find(x=>x.id===id); if(r) return r; } return null; };

/* one post's byline + body + actions; `reply` marks a nested reply (no Reply/Pin) */
function discPost(p, tid, reply){
  const mine = p.who.handle === LEAD_ME.handle;
  const reacted = p.reacts.includes(LEAD_ME.n);
  const editing = S.discEdit === p.id;
  return `<div class="disc-post${reply?' disc-reply':''}${p.pinned?' disc-pinned':''}">
    <span class="disc-av"><span class="av-ph" style="width:${reply?28:36}px;height:${reply?28:36}px"><i>${p.who.ini}</i><img src="${p.who.img}" alt=""></span></span>
    <div class="disc-b">
      <div class="disc-head">
        <span class="disc-nm">${p.who.n}</span>
        ${p.who.leader?'<span class="disc-badge">Cohort Leader</span>':''}
        ${mine?'<span class="disc-you">You</span>':`<span class="disc-h">${p.who.handle}</span>`}
        <span class="disc-w">&middot; ${p.when}${p.edited?' &middot; edited':''}</span>
        ${p.pinned?`<span class="disc-pin-tag">${I.location} Pinned</span>`:''}
      </div>
      ${editing
        ? `<div class="disc-edit"><textarea class="inp" id="discEditTa" rows="3" maxlength="2000">${p.text}</textarea>
            <div class="disc-edit-a"><button class="btn btn-s btn-sm noic" data-disccancel="1">Cancel</button>
              <button class="btn btn-p btn-sm noic" data-disceditsave="${p.id}">Save</button></div></div>`
        : `<p class="disc-text">${p.text}</p>`}
      <div class="disc-acts">
        <button class="disc-act${reacted?' on':''}" data-discreact="${p.id}">${reacted?I.thumbsUpFilled:I.thumbsUp} ${p.reacts.length||''}</button>
        ${!reply?`<button class="disc-act" data-discreply="${tid}">${I.chat} Reply</button>`:''}
        ${LEAD_ME.leader && !reply ? (p.pinned
          ? `<button class="disc-act" data-discunpin="${p.id}">${I.location} Unpin</button>`
          : `<button class="disc-act" data-discpin="${p.id}">${I.location} Pin</button>`) : ''}
        ${discEditable(p) && !editing ? `<button class="disc-act" data-discedit="${p.id}">${I.edit} Edit</button>` : ''}
      </div>
    </div>
  </div>`;
}

function discThread(t){
  const replying = S.discReplyTo === t.id;
  return `<div class="disc-thread">
    ${discPost(t, t.id, false)}
    ${t.replies.length ? `<div class="disc-replies">${t.replies.map(r=>discPost(r, t.id, true)).join('')}</div>` : ''}
    ${replying ? `<div class="disc-reply-box">
      <textarea class="inp" id="discReplyTa" rows="2" maxlength="2000" placeholder="Write a reply"></textarea>
      <div class="disc-reply-a"><button class="btn btn-s btn-sm noic" data-disccancel="1">Cancel</button>
        <button class="btn btn-p btn-sm noic" data-discsendreply="${t.id}">Reply</button></div>
    </div>` : ''}
  </div>`;
}

V.leadDiscussion = () => {
  const c = leadLive();
  if(!c) return `<main class="main"><div class="page">${ph('Discussion')}
    <div class="sec"><div class="empty" style="border:0">${I.chat}<h3>You are not leading a cohort at the moment.</h3>
      <p>Your past cohorts&rsquo; discussions stay readable.</p></div></div></div></main>`;
  const pin = discPinned();
  const threads = LEAD_DISC.filter(t => !t.pinned);
  return `<main class="main"><div class="page">
  ${ph('Discussion')}
  <div class="sec">
    <div class="disc-compose">
      <span class="disc-av"><span class="av-ph" style="width:36px;height:36px"><i>PN</i><img src="${LEAD_ME.img}" alt=""></span></span>
      <div class="disc-compose-b">
        <textarea class="inp" id="discMsg" rows="2" maxlength="2000" placeholder="Post to your cohort"></textarea>
        <div class="disc-compose-a">
          <label class="disc-pin-cb"><input type="checkbox" id="discPinNew"> Pin to the top</label>
          <button class="btn btn-p btn-sm noic" data-discpost="1">Post</button>
        </div>
      </div>
    </div>
  </div>
  ${pin ? `<div class="sec"><div class="sec-h"><h2>Pinned</h2></div><div class="disc-thread">${discThread(pin)}</div></div>` : ''}
  <div class="sec">
    <div class="sec-h"><h2>Discussion</h2></div>
    ${threads.length ? threads.map(discThread).join('') : `<div class="empty" style="border:0">${I.chat}<h3>No posts yet</h3><p>Start the cohort&rsquo;s conversation above.</p></div>`}
  </div>
</div></main>`;
};

/* the pin-replace confirmation (12.7) — a `.conf` modal via LDR_SHEETS */
function discPinSheet(){
  const id = S.discPinAsk; if(!id) return `<div class="modal" data-dpclose="1"></div>`;
  return `<div class="modal on" data-dpclose="1">
    <div class="sheet conf" role="dialog" aria-modal="true" aria-label="Pin post">
      <div class="sheet-b conf-b">
        <span class="conf-mk">${I.location}</span>
        <h2 class="conf-t">Pin this post?</h2>
        <p class="conf-x">It replaces the post currently pinned.</p>
      </div>
      <div class="sheet-f conf-a">
        <button class="btn btn-s noic" data-dpclose="1">Go back</button>
        <button class="btn btn-p noic" data-discdopin="${id}">Pin</button>
      </div>
    </div>
  </div>`;
}
LDR_SHEETS.push(discPinSheet);

LDR_SHEETS.push(ldrProfileSheet);

/* ==========================================================================
   THE LISTENERS
   ========================================================================== */
device.addEventListener('click', e => {
  const t = e.target;

  /* `data-ldrmsg` AND `data-ldrboard` ARE BOTH DELETED, and both were already
     dead: nothing in the build had written either attribute since the tab strip
     and the cohort picker came out. A handler for markup that no view emits is
     the "gate nothing writes" tell in JS, where it is worse than in CSS — it
     reads as a live capability rather than as an unused rule.

     THE RAIL IS ONE KIND NOW, so a row carries a bare index rather than
     `kind:id`. The split on the first colon is gone with the boards it was
     written for. `S.ldrThOpen` is what §36.17 reads below 900, where the list
     and the pane are two screens. */
  const pk = t.closest('[data-ldrpick]');
  if(pk){
    S.ldrTh = +pk.dataset.ldrpick;
    S.ldrThOpen = true;
    render();
    return;
  }



  const th = t.closest('[data-ldrth]');
  if(th){ S.ldrTh = +th.dataset.ldrth; S.ldrThOpen = true; render(); return; }
  if(t.closest('[data-ldrthback]')){ S.ldrThOpen = false; render(); return; }

  /* ------------------------------------------------------------------------
     CONTACT A CANDIDATE BY NAME — `data-ldrdm`
     Maryam, 1 Sep 2026: the attention queue's last column "takes the user on
     the direct chat with that candidate on click".

     IT RESOLVES A NAME, NOT AN INDEX, and that is the whole reason it is a
     function rather than a `data-ldrth`. `LDR_THREADS` is an inbox in
     most-recent order — the note over it says so, and Tobias is in it because a
     resolved thread keeps its history — so an index written into the attention
     table would point at whoever happened to be third the day it was written.
     The queue is derived from `lflag` and the inbox is not, so the only stable
     thing the two share is the person.

     A CANDIDATE WITH NO THREAD GETS AN EMPTY ONE, WHICH IS THE POINT. Two of
     the three flagged candidates have been written to and Chloe Ferreira has
     not, so the alternatives were to leave her button dead — §60's dead control
     on a live surface — or to write her a conversation, which is inventing the
     product copy §74 rules out. An empty thread is neither: it is what "you
     have not messaged her yet" actually looks like, and `V.leadMessages` draws
     it (three readers guard for it, see the note on `unread`).

     THE FACE AND THE COHORT COME OFF THE MEMBER RECORD, never typed here —
     `lmembers()` is the same walk the queue itself is built from, so the
     initials, the photograph and the cohort number in the thread header are the
     ones the roster shows. A name that is in no cohort simply does not
     navigate, rather than opening a thread with somebody who does not exist.

     IT NAVIGATES ITSELF because it has two things to set that `data-go` cannot
     carry — the tab and the person. `S.ldrThOpen` is `true` for the same reason
     the row-press sets it: below 900 the list and the thread are two screens,
     and arriving on the list having asked for one person is a press wasted.
     ------------------------------------------------------------------------ */
  const dm = t.closest('[data-ldrdm]');
  if(dm){
    const who = dm.dataset.ldrdm;
    let i = LDR_THREADS.findIndex(x => x.who === who);
    if(i < 0){
      const rec = lmembers().find(x => x.m.name === who);
      if(!rec) return;
      LDR_THREADS.push({who, i:rec.m.ini, img:rec.m.img, co:rec.c.id, msgs:[]});
      i = LDR_THREADS.length - 1;
    }
    S.ldrTh = i;
    S.ldrThOpen = true;
    go('leadMessages');
    return;
  }

  /* POSTING TO A BOARD IS NOT THIS MODULE'S JOB ANY MORE (2 Sep 2026). The
     handler pushed onto `ldrBoard(S.ldrBoardCo)` — Cohort 41's board IS `ROOM`,
     so a post made here was on the candidate's Cohort page the moment the
     switcher flipped, which was the whole reason the two sides share one array.
     THAT IS STILL TRUE AND STILL REACHABLE, from the cohort rather than from
     the inbox: `V.leadCohort`'s Discussion tab draws `discussionRoom()` — the
     candidate's own component, with its own composer writing to the same
     `ROOM`. Nothing about the shared board changed; only the door into it. */
  if(t.closest('[data-ldrreply]')){
    const box = device.querySelector('#ldrReply');
    const text = box ? box.value.trim() : '';
    if(!text){ if(box) box.focus(); return; }
    (LDR_THREADS[S.ldrTh] || LDR_THREADS[0]).msgs.push({me:1, t:text, w:'Just now'});
    render();
    return;
  }
  /* EPIC 12.8 — voice note (prototype: a real timer, no captured audio). Record
     stops at 5 minutes. */
  if(t.closest('[data-ldrrecstart]')){ S.ldrRec = {start:Date.now()}; render(); return; }
  if(t.closest('[data-ldrrecdiscard]')){ S.ldrRec = null; render(); return; }
  if(t.closest('[data-ldrrecstop]')){
    const ms = S.ldrRec ? Math.min(300000, Date.now() - S.ldrRec.start) : 0;
    const dur = Math.floor(ms/60000) + ':' + String(Math.floor(ms/1000)%60).padStart(2,'0');
    (LDR_THREADS[S.ldrTh] || LDR_THREADS[0]).msgs.push({me:1, kind:'voice', dur: dur==='0:00'?'0:01':dur, w:'Just now'});
    S.ldrRec = null; render(); return;
  }

  /* THE PROFILE TABS. `render()` rather than an `.on` class move, because the
     tab decides which sections the page EMITS — trap 9's other half: a class
     move is only ever right when the thing that changes is a class. Read
     BEFORE `[data-ldrprof]` is tested, not for a specificity reason but so the
     two attribute names cannot be confused by a future reader; they are
     different controls on the same page and `ldrpf` is the shorter one. */
  const tab = t.closest('[data-ldrpf]');
  if(tab){ S.ldrPfTab = tab.dataset.ldrpf; render(); return; }

  const pf = t.closest('[data-ldrprof]');
  if(pf){ S.ldrEditProfile = true; render(); return; }

  /* THE `data-ldravail` BRANCH AND THE `'avail'` CLOSE ARE DELETED with the
     weekly-calls sheet (2 Sep 2026 — the long note is where the sheet was).
     One sheet left, so the close branch tests one key rather than two. */
  const cl = t.closest('[data-ldrclose]');
  if(cl && cl.dataset.ldrclose === 'prof'){
    if(cl.classList.contains('modal') && t !== cl) return;
    S.ldrEditProfile = false;
    render();
    return;
  }
});

/* Enter sends, because a composer that only responds to a button is one you
   have to reach for the mouse to use. One composer left. */
device.addEventListener('keydown', e => {
  if(e.key !== 'Enter' || e.shiftKey) return;
  if(e.target.id === 'ldrReply'){ e.preventDefault(); device.querySelector('[data-ldrreply]').click(); }
});

/* ==========================================================================
   THE PAGES UNDER A MODULE NAME THEMSELVES

   `LEAD_TAL.where` is the leader's map of view to page name, written in
   lead.js for the Tal panel's own header and copied into `ASK_WHERE` for the
   ask field's "Back to ..." label. It has an entry per module, which was
   every leader page there was. These four are pages UNDER a module — a
   roster, a candidate, a summary — and without an entry each one would be
   labelled "TalentNext" by ai4's fallback. `leadEval` was the fourth and is
   deleted with the level decision (1 Sep 2026).

   `.ctx` is the same story for Tal's suggested questions: a page with no
   entry falls back to the dashboard's three, which ask about the wrong page.
   Extended from here rather than edited in lead.js, so the module map and the
   detail map are each written where the pages they name are built.
   ========================================================================== */
Object.assign(LEAD_TAL.where, {
  leadCohort:'a cohort', leadMember:'a candidate',
  leadSum:'a 90-day summary'
});
Object.assign(LEAD_TAL.ctx, {
  leadCohort: ['Where is this cohort stuck?','Brief me for this call','Who here needs me most?'],
  leadMember: ['What should I say to them?','Is this recoverable?','Draft a check-in'],
  leadSum:    ['Are they ready to be promoted?','What should I write here?']
});
Object.assign(ASK_WHERE, LEAD_TAL.where);

/* ==========================================================================
   THE THREAD OPENS AT ITS FOOT — `ldrPinThread`
   Maryam, 2 Sep 2026: "the latest one appears at the bottom".

   §36.18b's `margin-top:auto` answers a SHORT thread — the messages sit on the
   composer instead of floating at the top of an empty pane. It cannot answer a
   long one: once the content is taller than the scroller, a fresh `scrollTop`
   of 0 shows the OLDEST message and the newest is below the fold. One line of
   geometry, after the paint.

   IT IS NOT `scrollIntoView` AND NOT `behavior:'smooth'`. The pane is inside
   `#device`, which is itself a scroller inside a scaled frame, and
   `scrollIntoView` walks every ancestor — it scrolls the page as well as the
   thread, so opening Messages jumped the whole app down. Setting `scrollTop` on
   the one element moves the one element. Smooth would animate on every render,
   including the render that only moved a class.

   RUN AFTER `_baseLead`, NOT INSIDE A VIEW, because `render()` replaces
   `device.innerHTML` and the element this measures does not exist until it has.
   Wrapping is lead.js's own idiom for the same reason `leadStick` is wrapped
   there, and this file is parsed after it, so the wrapper composes rather than
   competing.

   NO STICK-TO-BOTTOM STATE, unlike ai3's thread pin. That one tracks whether
   the reader has scrolled up so an arriving message does not yank them back;
   here every render is a navigation or a sent message — both of which SHOULD
   land at the foot — and there is no background arrival to fight with.
   ========================================================================== */
function ldrPinThread(){
  if(S.portal !== 'leader' || S.view !== 'leadMessages') return;
  const box = device.querySelector('.ldr-dm-thread > .msgs');
  if(box) box.scrollTop = box.scrollHeight;
}
/* ==========================================================================
   EPIC 12.7 — the discussion handlers. Post / reply / edit read the DOM on
   submit so the caret survives typing; react, pin and unpin are pure state.
   ========================================================================== */
device.addEventListener('click', e => {
  const g = sel => device.querySelector(sel);
  const now = () => 'Just now';

  if(e.target.closest('[data-discpost]')){
    const ta = g('#discMsg'); const text = ta ? ta.value.trim() : '';
    if(!text){ if(ta) ta.focus(); return; }
    const pin = g('#discPinNew') && g('#discPinNew').checked;
    if(pin) LEAD_DISC.forEach(t => t.pinned = false);
    LEAD_DISC.unshift({id:'t'+Date.now(), who:LEAD_ME, text, when:now(), at:Date.now(), pinned:!!pin, reacts:[], replies:[]});
    render(); return;
  }
  const rp = e.target.closest('[data-discreply]');
  if(rp){ S.discReplyTo = rp.dataset.discreply; S.discEdit = null; render(); return; }
  const sr = e.target.closest('[data-discsendreply]');
  if(sr){ const t = LEAD_DISC.find(x=>x.id===sr.dataset.discsendreply); const ta=g('#discReplyTa');
    const text = ta ? ta.value.trim() : ''; if(!text){ if(ta) ta.focus(); return; }
    if(t) t.replies.push({id:'r'+Date.now(), who:LEAD_ME, text, when:now(), at:Date.now(), reacts:[]});
    S.discReplyTo = null; render(); return; }
  const rc = e.target.closest('[data-discreact]');
  if(rc){ const p = discFind(rc.dataset.discreact); if(p){ const i=p.reacts.indexOf(LEAD_ME.n);
    if(i>=0) p.reacts.splice(i,1); else p.reacts.push(LEAD_ME.n); } render(); return; }
  const pn = e.target.closest('[data-discpin]');
  if(pn){ const id=pn.dataset.discpin;
    if(discPinned()){ S.discPinAsk = id; } else { const p=discFind(id); if(p) p.pinned=true; }
    render(); return; }
  const dp = e.target.closest('[data-discdopin]');
  if(dp){ const id=dp.dataset.discdopin; LEAD_DISC.forEach(t=>t.pinned=false);
    const p=LEAD_DISC.find(t=>t.id===id); if(p) p.pinned=true; S.discPinAsk=null; render(); return; }
  const up = e.target.closest('[data-discunpin]');
  if(up){ const p=discFind(up.dataset.discunpin); if(p) p.pinned=false; render(); return; }
  const ed = e.target.closest('[data-discedit]');
  if(ed){ S.discEdit = ed.dataset.discedit; S.discReplyTo = null; render(); return; }
  const es = e.target.closest('[data-disceditsave]');
  if(es){ const p=discFind(es.dataset.disceditsave); const ta=g('#discEditTa');
    const text = ta ? ta.value.trim() : ''; if(!text){ if(ta) ta.focus(); return; }
    if(p){ p.text=text; p.edited=true; } S.discEdit=null; render(); return; }
  if(e.target.closest('[data-disccancel]')){ S.discReplyTo=null; S.discEdit=null; render(); return; }
  const dpc = e.target.closest('[data-dpclose]');
  if(dpc){ if(dpc.classList.contains('modal') && e.target !== dpc) return; S.discPinAsk=null; render(); return; }
});

const _baseLead4 = render;
render = function(){
  _baseLead4();
  try { ldrPinThread(); } catch(e){ console.warn('thread pin', e); }
  try { ldrRecTick(); } catch(e){ console.warn('rec tick', e); }
};

render();
