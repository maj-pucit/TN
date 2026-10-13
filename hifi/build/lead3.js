/* ==========================================================================
   THE CALLS AND THE ONE SIGNATURE

   The two remaining pages of the leader's actual job: the cohort calls she
   runs, and the 90-day summaries that close a cohort. lead2.js drew the cohort
   side; this is the diary and the sign-off.

   WHAT THIS FILE WAS UNTIL 1 SEP 2026, and why the whole of it went.
   It was "the interview pipeline" — Sessions, Evaluations and TWO signatures:
   `V.leadSessions` listed five 45-minute level interviews and `V.leadEval` was
   the most consequential page on the portal, reading a transcript, four
   competency readings and two quoted moments before taking a level and a
   reason. All of that is DELETED, because a cohort leader does not interview
   the initial candidates (Maryam, 1 Sep 2026); the talent agent does, one
   portal over, and the candidate side has always drawn it that way. lead.js's
   head is the long version.

   WHAT WENT WITH IT, ALL OF IT DELETED RATHER THAN LEFT UNREACHABLE:
   `LDR_AN` (Tal's per-candidate competency read, two records with four
   readings, two quotes and a confidence each), `ldrConf`, `ldrEvOf`,
   `ldrEvFor`, `LDR_RUNGS`, `V.leadEval`, `S.ldrEv` / `S.ldrPick`, the
   `[data-ldrpick]` and `[data-ldrsign]` handlers, the `ldrWhy` / `ldrNotes`
   drafts, and `ldrRungView` — the post-render pass that centred the chosen rung
   in a fifteen-level scroller on a phone. Two arguments in them were good and
   are not lost, because the SUMMARY makes both: an exception costs a sentence
   (`LDR_RECS` + the required box), and the human call wins with the record
   saying why.

   THE SIGNATURE IS STILL A PAGE, NOT A SLIDE-OVER.
   The wireframe ran it in a right-hand `.bk` sheet. This product has `.sheet`
   and lead2.js uses it for the brief and the note — but those are a thing you
   read and a thing you jot. A 90-day summary reads four figures off the roster
   and then takes a recommendation, a reason and two paragraphs; that is a
   page's worth of work, it wants the page's measure, and it wants a URL of its
   own in the history so the back arrow works. `.sheet` maxes at 520px and 88%
   height, which is where the wireframe's sheet had to scroll its own analysis;
   a page does not.
   ========================================================================== */

const ldrSumOf = id => LEAD_SUMMARIES.filter(s => s.id === id)[0] || LEAD_SUMMARIES[0];

/* `lranChapter` WAS HERE AND IS DELETED WITH "ALREADY RUN" (1 Sep 2026). It read
   the chapter a past call covered off `CH` — the same read `lcall` takes for an
   upcoming one, one week back — so that `LEAD_RUN` only ever had to state the
   ATTENDANCE, which is the one thing about a finished call no other record
   knows. That principle is still how `LEAD_RUN` is shaped and is worth keeping:
   if the list ever comes back, the chapter is derived, not stored. */

S.ldrSum = null;
S.ldrRec = null;
S.ldrErr = false;
/* RESTORE THE SUMMARY A RELOAD WAS ON — views.js writes its id as the hash's
   fourth segment (`#leader/leadSum/<stage>/<id>`). Same prefill the row click
   does, so a saved draft comes back too. */
{ if(S.view === 'leadSum' && S.bootRec){
    const id = S.bootRec;
    if(LEAD_SUMMARIES.some(s => s.id === id)){
      S.ldrSum = id; const d = ldrSumOf(id).draft;
      S.ldrRec = d ? d.rec : 'promote'; S.ldrSumWhy = d ? d.why : ''; S.ldrGrowth = d ? d.growth : ''; S.ldrDev = d ? d.develop : ''; } } }
/* EPIC 12.9 — the two written sections are mandatory, the send confirms, and a
   draft can be kept. */
S.ldrGrowErr = false;
S.ldrDevErr = false;
S.ldrPubAsk = null;
S.ldrDraftSaved = null;

/* EPIC 12.5/12.6 — sessions state: the open schedule/edit form (S.sesForm), the
   open cancel sheet (S.sesCancel) and which session's attendance record is read
   (S.ldrSes). */
S.sesForm = null;
S.sesCancel = null;
S.ldrSes = null;

/* ==========================================================================
   EPIC 12.5 / 12.6 — SESSIONS AND ATTENDANCE

   The cohort's calls are held on the platform. The leader schedules them (with
   the chapter each covers), edits or cancels them, and the platform works out
   who attended from the room. Rooms (Twilio), the real join/leave capture and
   every notification send are STUBBED — a scheduled session gets a room the
   moment it is created (a comment, not a call), a past session's register is
   derived (§74), and one seeded session reads "Attendance unavailable".
   ========================================================================== */

/* THE LEADER SCHEDULES NOTHING (Maryam, 30 Sep 2026: "a cohort leader can not
   schedule a session or edit or cancel it"). The Sessions page is view + join:
   the "Schedule a session" button and every Edit/Cancel control are gone (the
   sheets `leadSessionSheet`/`leadCancelSheet` and their handlers stay defined,
   unreachable). This reverses the 12.5 story's "the leader schedules them" — the
   series is set for them; they read it and join. */

/* AN UPCOMING OR PAST SESSION ROW, ON THE TALENT-AGENT `.bk-row` DIARY SHAPE
   (Maryam, 30 Sep 2026: "for upcoming sessions ui, please use the ui i am
   attaching from talent agent portal but show the data according to cohort
   leader session"). A left day/time column against a hairline, the call mark,
   the call + its chapter, and the session's state at the right end. A cohort
   call is not a person, so the face slot the agent row wears holds the `I.video`
   call mark (§31's own `.bk-row` default; the phone drops it). Time reads 12-hour
   to match the black card above. A past HELD session opens its attendance
   record; an upcoming one is read-only. */
const WDAY = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const sesDayLbl = s => { const d = new Date(s.dISO + 'T00:00:00'); return WDAY[d.getDay()] + ' ' + d.getDate(); };
const t12 = hhmm => { let [h,m] = String(hhmm||'').split(':').map(Number); const ap = h>=12?'PM':'AM'; h = h%12||12; return h + ':' + String(m||0).padStart(2,'0') + ' ' + ap; };
function sesBkRow(c, s){
  const past = sesPast(s), cancelled = s.status === 'cancelled';
  const day = `<span class="bk-day"><span class="d">${sesDayLbl(s)}</span><span class="n">${t12(s.time)}</span></span>`;
  /* THE ROW TITLE IS "Week {n} Cohort Session" (Maryam 30 Sep 2026, was "Cohort N
     call · weekly"). The week is the session's own (`s.week`), or derived from its
     date against the cohort start. The "weekly" repeat tag is dropped — every
     session in the series is weekly, so it said nothing. */
  const wk = s.week || leadWeek(sesDayOf(c, s.dISO));
  /* NO DESC UNDER THE SESSION NAME (Maryam 30 Sep 2026: "remove the desc below the
     session names in both tabs"). The chapter/topic sub-line is dropped from both
     the upcoming and past lists; the day/time column and the right-hand mark carry
     what the row needs. A cancelled row still reads "Cancelled" on the right. */
  const body = `<span class="cardrow-b">
      <span class="cardrow-t">Week ${wk} Cohort Session</span></span>`;
  let mark;
  if(cancelled) mark = `<span class="ses-mark ses-cancelled">Cancelled</span>`;
  else if(!past) mark = `<span class="ses-mark ses-upcoming">${sesCountdown(s)}</span>`;
  else if(s.unavail) mark = `<span class="ses-mark ses-na">Attendance unavailable</span>`;
  else { const reg = leadRegister(c, s); const att = reg.filter(x=>x.r&&x.r.att).length;
    mark = `<span class="ses-mark ses-att">${att} of ${reg.length} attended</span>`; }
  /* NO VIDEO-CALL MARK (Maryam 30 Sep 2026, "remove the video call icon") — the
     day/time column already says what the row is; the glyph added nothing. */
  if(past && !cancelled)
    return `<button class="cardrow bk-row clk" data-go="leadSession" data-ldrses="${s.id}">${day}${body}${mark}<svg class="tile-arrow" viewBox="0 0 24 24">${inner('arrowRight')}</svg></button>`;
  return `<div class="cardrow bk-row">${day}${body}${mark}</div>`;
}

V.leadSessions = () => {
  const c = leadLive();
  if(!c) return `<main class="main"><div class="page">${ph('Sessions')}
    <div class="sec"><div class="empty" style="border:0">${I.calendar}<h3>You are not leading a cohort at the moment.</h3>
      <p>Your sessions appear here while you are leading a cohort.</p></div></div></div></main>`;
  const all = leadSessionsOf(c);
  const next = leadNextSession(c);
  const upcoming = all.filter(s => sesEnd(s) >= LEAD_NOW && s.id !== (next&&next.id));
  const past = all.filter(s => sesEnd(s) < LEAD_NOW).reverse();
  return `<main class="main"><div class="page lead-ses-page">
  ${ph('Sessions')}
  ${''/* THE NEXT SESSION IS THE MY-COHORT BLACK CALL CARD (Maryam, 30 Sep 2026:
        "use the same black call card on my cohorts screen in place of the black card
        on the session screen"). The same `.lcal-next` `lcalCard` the dashboard draws
        (`lcall(c)` is its record) in its `.lcal-row` wrapper, so the two screens read
        identically — only the countdown differs, "In 02:40" here (Maryam: "just
        update the In 2hrs 40mins text to 'In 02:40'"). This replaces `leadCallCard`,
        the older crow-based card. */}
  ${next ? `<div class="sec lead-callsec"><div class="lcal-row">${lcalCard(lcall(c), true, {countdown:'In 02:40'})}</div></div>` : `<div class="sec"><div class="empty" style="border:0">${I.calendar}<h3>No session is scheduled yet.</h3></div></div>`}
  ${''/* TWO TABS — Upcoming / Past sessions (Maryam 30 Sep 2026: "instead of this
        long page, i need 2 tabs of Upcoming and Past Sessions"). The two lists
        were stacked down one scroll; they are one `.sec.sec-cs` strip now, the
        same `.cs` mechanism the cohort page uses (`data-ldrsestab` → `S.ldrSesTab`).
        The count rides each tab. */}
  ${(() => {
    const tab = S.ldrSesTab || 'upcoming';
    const rows = tab === 'past' ? past : upcoming;
    const empty = tab === 'past'
      ? `<div class="empty" style="border:0">${I.calendar}<h3>No past sessions yet</h3><p>Sessions move here once they have run.</p></div>`
      : `<div class="empty" style="border:0">${I.calendar}<h3>Nothing else upcoming</h3><p>The next session is the one above.</p></div>`;
    return `<div class="sec sec-cs">
      <div class="cs">
        <button class="${tab === 'upcoming' ? 'on' : ''}" data-ldrsestab="upcoming">Upcoming${upcoming.length?` <span class="lf-n">${upcoming.length}</span>`:''}</button>
        <button class="${tab === 'past' ? 'on' : ''}" data-ldrsestab="past">Past sessions${past.length?` <span class="lf-n">${past.length}</span>`:''}</button>
      </div>
      ${rows.length ? `<div class="tile-stack ses-list">${rows.map(s=>sesBkRow(c,s)).join('')}</div>` : empty}
    </div>`;
  })()}
</div></main>`;
};

/* 12.6 — the attendance record for one held session (read-only register + note) */
V.leadSession = () => {
  const c = leadLive() || LEAD_COHORTS[0];
  const s = leadSessionsOf(c).find(x => x.id === S.ldrSes) || leadHeld(c)[0];
  if(!s) return `<main class="main"><div class="page">${crumb(['Sessions','leadSessions'],'Attendance')}
    ${ph('Attendance')}<div class="sec"><div class="empty" style="border:0">${I.calendar}<h3>No session</h3></div></div></div></main>`;
  const reg = leadRegister(c, s);
  const attended = reg.filter(x=>x.r&&x.r.att).length;
  return `<main class="main"><div class="page">
  ${crumb(['Sessions','leadSessions'], s.title)}
  ${ph(s.title)}
  ${''/* THE FOUR FACTS ARE A BLOCK BAND, NOT A kv (Maryam 30 Sep 2026: "make the
         top 4 rows into 4 blocks in a row"). A "Session" fact leads — "Week N
         Cohort Call" (Maryam: "add session - Week (n) Cohort Call") — then Chapter
         reads "Chapter N" (the week's chapter number, not its title — Maryam:
         'change "Delegation Without Drop-Off" to "Chapter 5"'), the date drops its
         "(London (UTC+01:00))" zone (Maryam: "remove (London (UTC+01:00))"), and
         Attendance. `.facts pf-facts` is the fixed-4 band `leadCounters` uses. */}
  <div class="sec">
    <div class="facts pf-facts">
      ${pfFact(I.video,    '--mk-3', 'Session', `Week ${s.week} Cohort Call`)}
      ${pfFact(I.book,     '--mk-1', 'Chapter', `Chapter ${s.week}`)}
      ${pfFact(I.calendar, '--mk-4', 'Date and time', `${s.date} &middot; ${s.time}`)}
      ${pfFact(I.group,    '--mk-2', 'Attendance', s.unavail?'Unavailable':attended+' of '+reg.length+' attended')}
    </div>
  </div>
  ${s.unavail ? `<div class="sec"><div class="ses-warn"><span class="ses-warn-mk">${I.warningAlt}</span>
      <div class="ses-warn-b"><h3>Attendance unavailable</h3><p>The platform received no participation data for this session, so no candidate is marked. It is left out of every attendance total.</p></div></div></div>`
  : `<div class="sec ses-reg-sec">
    ${''/* THE "Worked out from the room · 5 min minimum" CAPTION IS GONE (Maryam
           30 Sep 2026: "remove ... text"); the heading stands alone. */}
    <div class="sec-h"><h2>Register</h2></div>
    <div class="tile-stack ses-reg">
      ${reg.map(({m,r})=>`<div class="atd-row">
        <span class="atd-b"><span class="rname">${mAv(m,28)}${leadName(m)}</span></span>
        <span class="atd-mark ${r&&r.att?'atd-yes':'atd-no'}">${r&&r.att?`Attended &middot; ${r.mins} min`:`Did not attend${r?` &middot; ${r.mins} min`:''}`}</span>
      </div>`).join('')}
    </div>
  </div>`}
  ${''/* THE "Note on the session" SECTION IS REMOVED (Maryam 30 Sep 2026: "remove
         notes section from the end of this page"). `SESSION_NOTES` and the
         `data-sesnotesave` handler stay defined, just not drawn here. */}
</div></main>`;
};

/* --------------------------------------------------------------------------
   THE SCHEDULE / EDIT SHEET (12.5)
   Native controls, read on Save so typing never triggers a render (the caret
   trap). S.sesForm holds the last-entered values, so an overlap error can
   re-render with everything the leader typed still in place.
   -------------------------------------------------------------------------- */
function leadSessionSheet(){
  const f = S.sesForm; if(!f) return `<div class="modal" data-sesclose="1"></div>`;
  const c = leadLive() || LEAD_COHORTS[0];
  const editing = !!f.edit;
  const series = editing && (leadSessionsOf(c).find(s=>s.id===f.edit)||{}).series;
  const today = LEAD_NOW.toISOString().slice(0,10);
  return `<div class="modal on" data-sesclose="1">
    <div class="sheet">
      <div class="sheet-h"><h2>${editing?'Edit session':'Schedule a session'}</h2>
        <button class="x" data-sesclose="1" aria-label="Close">${I.close}</button></div>
      <div class="sheet-b">
        ${f.err ? `<div class="ses-err">${I.warningAlt} ${f.err}</div>` : ''}
        <div class="f"><label for="sesTitle">Title</label>
          <input class="inp" id="sesTitle" maxlength="100" value="${(f.title||'').replace(/"/g,'&quot;')}" placeholder="Cohort ${c.id} call"></div>
        <div class="f"><label for="sesChapter">Chapter covered</label>
          <select class="inp" id="sesChapter">
            <option value=""${f.chapter?'':' selected'} disabled>Choose a chapter</option>
            ${CH.map((ch,i)=>`<option value="${ch[0]}"${f.chapter===ch[0]?' selected':''}>${i+1}. ${ch[0]}</option>`).join('')}
          </select></div>
        <div class="f-row">
          <div class="f"><label for="sesDate">Date</label>
            <input class="inp" type="date" id="sesDate" min="${today}" max="${cohortEndISO(c)}" value="${f.date||''}"></div>
          <div class="f"><label for="sesTime">Start time <span class="f-tz">${LEAD_TZ}</span></label>
            <input class="inp" type="time" id="sesTime" value="${f.time||'18:00'}"></div>
        </div>
        <div class="f-row">
          <div class="f"><label for="sesDur">Duration (minutes)</label>
            <input class="inp" type="number" id="sesDur" min="15" max="240" value="${f.dur||60}"></div>
          <div class="f"><label for="sesRepeat">Repeat</label>
            <select class="inp" id="sesRepeat"${editing?' disabled':''}>
              <option value="none"${f.repeat==='none'?' selected':''}>Does not repeat</option>
              <option value="weekly"${f.repeat==='weekly'?' selected':''}>Weekly</option>
              <option value="fortnightly"${f.repeat==='fortnightly'?' selected':''}>Fortnightly</option>
            </select></div>
        </div>
        <div class="f"><label for="sesCover">What it covers <span class="f-opt">(optional)</span></label>
          <textarea class="inp" id="sesCover" rows="2" maxlength="1000" placeholder="Anything the cohort should read or bring">${f.cover||''}</textarea></div>
        ${editing && series ? `<div class="f"><span class="f-lbl">Apply to</span>
          <div class="ses-scope">
            <label class="ses-scope-o"><input type="radio" name="sesScope" value="this" ${f.scope!=='all'?'checked':''}> This session only</label>
            <label class="ses-scope-o"><input type="radio" name="sesScope" value="all" ${f.scope==='all'?'checked':''}> This and every later session</label>
          </div></div>` : ''}
      </div>
      <div class="sheet-f">
        <button class="btn btn-s noic" data-sesclose="1">Cancel</button>
        <button class="btn btn-p noic" data-sessave="1">${editing?'Save changes':'Schedule session'}</button>
      </div>
    </div>
  </div>`;
}

/* THE CANCEL SHEET (12.5) — reason (mandatory) + this-or-series, confirmation copy */
function leadCancelSheet(){
  const x = S.sesCancel; if(!x) return `<div class="modal" data-cxclose="1"></div>`;
  const c = leadLive() || LEAD_COHORTS[0];
  const s = leadSessionsOf(c).find(y=>y.id===x.id); if(!s) return `<div class="modal" data-cxclose="1"></div>`;
  return `<div class="modal on" data-cxclose="1">
    <div class="sheet sheet-narrow">
      <div class="sheet-h"><h2>Cancel session</h2>
        <button class="x" data-cxclose="1" aria-label="Close">${I.close}</button></div>
      <div class="sheet-b">
        <p class="t-body mb5">Cancel <b>${s.title}</b> on ${s.date}? Everyone in the cohort will be told.</p>
        ${x.err ? `<div class="ses-err">${I.warningAlt} ${x.err}</div>` : ''}
        <div class="f"><label for="cxReason">Reason <span class="f-req">Shown to candidates</span></label>
          <textarea class="inp" id="cxReason" rows="3" maxlength="500" placeholder="Why are you cancelling?">${x.reason||''}</textarea></div>
        ${s.series ? `<div class="f"><span class="f-lbl">Which sessions</span>
          <div class="ses-scope">
            <label class="ses-scope-o"><input type="radio" name="cxScope" value="this" ${x.scope!=='all'?'checked':''}> This session only</label>
            <label class="ses-scope-o"><input type="radio" name="cxScope" value="all" ${x.scope==='all'?'checked':''}> This and every later session</label>
          </div></div>` : ''}
      </div>
      <div class="sheet-f">
        <button class="btn btn-s noic" data-cxclose="1">Go back</button>
        <button class="btn btn-p danger noic" data-sesdocancel="${s.id}">Cancel session</button>
      </div>
    </div>
  </div>`;
}

LDR_SHEETS.push(leadSessionSheet, leadCancelSheet);

/* ==========================================================================
   CALLS — THE LEADER'S DIARY

   IT IS "CALLS" AND IT WAS "SESSIONS" (Maryam, 1 Sep 2026). The rail slot
   survives the interviews leaving because a leader still needs one page that
   answers "when am I on", and the word that named a diary of two kinds now
   names one: three cohort calls a week, sixty minutes each, and the ones
   already behind them.

   IT EARNED ITS PLACE ON THE PAST AND NO LONGER HOLDS ONE. The page opened with
   "This week" and "Already run", and the second was the argument for the module:
   `V.leadCohorts` had been listing the week's three calls too, so the calls
   BEHIND the leader were the half nothing else held. Maryam took that section
   off on 1 Sep 2026 (its own note in the view is the record), which leaves this
   as the diary and nothing else — and the reason it still earns the slot is the
   simpler one: `V.leadCohorts` gave its call list up to this page in the same
   pass, so this is now the only place the week's appointments are listed at all.
   Worth knowing before anything else is moved here or away.

   THE MONEY IS GONE AND SO IS THE FEE COLUMN. `SESSIONS` in the wireframe
   carried `fee:180` on every row; lead.js states the rule this portal is built
   on — a cohort leader volunteers — so the fact band reports what the leader is
   committing rather than what anybody is paying.
   ========================================================================== */
V.leadCalls = () => {
  const up = lcalls();
  const next = up[0];
  /* `run`, `seats` and `came` were read here for "Already run"'s heading count
     and went with the section. `LEAD_RUN` is still summed — in
     `PAGESUM.leadCalls`, which is its one remaining reader. */

  return `<main class="main"><div class="page">
  ${crumb(['Dashboard','leadDash'],'Upcoming Sessions')}
  ${''/* THE AVAILABILITY BUTTON CAME OFF THE HEADING (Maryam, 31 Aug 2026).
         It was a `ph()` action, so it sat above Tal's summary as the first
         thing on the page — a settings link introducing a page about this
         week's appointments. It came off the DASHBOARD's own list in the same
         pass, so the route lives where the setting does: `V.leadProfile`,
         reachable from the rail and the account menu. Two buttons pointing at
         one settings page from two lists of appointments was the thing to
         remove, not the page. The sentence it sat beside has changed with the
         subject: the leader is not booked BY anybody now, so the spine states
         the shape of the commitment instead. */}
  ${ph('Upcoming Sessions',`${up.length} cohorts &middot; one call a week each &middot; 60 minutes, not recorded`)}
  ${''/* THE PLATE IS NOW THE BLACK CARD, AND IT IS THE DASHBOARD'S OWN
         (Maryam, 31 Aug 2026 — "follow the same summary and beneath that
         black call card layout"). `leadCallCard` states that shape one file
         up: §75's `.dark-card` recipe, the time in `.dc-when` at the end of
         the heading row, `lcTitle` / `lcDetail` for the two strings. Calling
         it here rather than copying it is the `bkStamp` rule — one
         appointment, two pages, one drawing.
         WHY THE PLATE HAD TO GO RATHER THAN BE RESTYLED: `.plate` is in
         ai5's `DARK_CARD`, so `placeDark` hoists it into the head band —
         which is exactly what put it beside the summary in the first
         place. `.dark-card` is in no pass's list, so the summary keeps the
         full width and the card lands under it, in flow. §81's note on the
         leader dashboard is the long version of that same move.
         THE SECONDARY IS THE CALLER'S AGAIN, and this page is why. The
         dashboard's card says "View all calls" and points here (Maryam,
         1 Sep 2026); on THIS page that would be a link to the page you are
         already on — the "gate nothing writes" tell wearing a different hat,
         and the reason this call site used to pass `second:false` and end
         with no action at all. The brief is per-CALL rather than per-page, so
         it is the right action here and the card keeps one. */}
  ${next ? leadCallCard(next, {second:{at:`data-ldrbrief="${next.co}"`, ic:I.edit, t:'Generate the brief'}}) : ''}
  <div class="sec">
    <div class="sec-h"><h2>This week</h2><span class="t-helper-01">${up.length} call${up.length === 1 ? '' : 's'} &middot; sixty minutes each</span></div>
    ${up.length ? `<div class="tile-stack">
      ${up.map(k => `<div class="cardrow bk-row${/^today$/i.test(k.day) ? ' bk-now' : ''}">
        <span class="day bk-day"><div class="d">${k.day}</div><div class="n">${k.time}</div></span>
        ${''/* `I.video`, NOT `I.group` — and for one build this slot held the
               cohort's cover instead. Both changes followed `bookedRow`'s and
               for the same reason: these are the dashboard's three rows drawn a
               second time, so a mark that differed between the two lists would
               be the drift `lcTitle` / `lcDetail` exist to prevent. The
               argument for the glyph and against the picture is written over
               `bookedRow` (lead.js). */}
        <span class="cardrow-ic">${I.video}</span>
        <span class="cardrow-b">
          <span class="cardrow-t">${lcTitle(k)}</span>
          <span class="cardrow-d">${k.seats} candidates at Explorer &ndash; ${k.level} &middot; ${lcDetail(k)}</span>
        </span>
        ${''/* THE ROW HAS NO ACTION, AND THAT IS THE POINT (Maryam, 2 Sep 2026:
               "a cohort leader can not reschedule a weekly call so remove that
               flow"). It carried Reschedule for one day — `.btn-t btn-sm ic-l`
               with `I.calendar`, opening lead4's weekly-calls sheet — and the
               whole flow is deleted with it: the sheet, `S.ldrAvail`, the
               `data-ldravail` handler and the Profile row's Manage control.

               THE ASK IS ABOUT AUTHORITY, NOT ABOUT A BUTTON. A weekly cohort
               call is the PROGRAMME's — ten candidates, a fixed hour, thirteen
               weeks — and the sheet said so itself in its own helper line:
               "moving one moves it for every candidate in that cohort". That is
               not a leader's decision to make from a diary row, so there is
               nothing for a control here to open. This is the same correction
               as 1 Sep's "a cohort leader does not interview anybody", one
               surface smaller: the portal keeps drifting toward giving this
               person an agent's powers.

               SO THE ROW IS A FACT, and a diary you read is a legitimate page —
               `.cardrow` with no `.cardrow-a` is the shape §02 already draws
               for one. What a leader DOES on this page is at the top of it, on
               the black card: "Generate the brief".

               THE CANDIDATE'S RESCHEDULE IS UNTOUCHED. `CALL_ROW.iv`'s control
               moves an INTERVIEW the candidate booked and paid for with an
               agent who sets their own availability, which is a different
               appointment with a different owner. It keeps `I.calendar`, so the
               one-word-one-mark rule this note used to make is still true —
               there is simply one caller now instead of two. */}
      </div>`).join('')}
    </div>` : `<div class="empty" style="border:0">${I.calendar}
      <h3>Nothing this week</h3><p>Every cohort you lead has a weekly call, and they all show up here.</p></div>`}
    ${''/* THE CLOSING LINE WENT WITH THE BRIEF BUTTON (Maryam, same pass). "A
           brief is generated from where the cohort actually is, not from where
           the syllabus says it should be" was an explanation of the control on
           every row; with the control gone it explained nothing on the page. The
           sentence still earns its place next to a Brief button, and there is one
           on `V.leadCohort`. */}
  </div>
  ${''/* "ALREADY RUN" IS DELETED (Maryam, 1 Sep 2026). It was the calls behind
         this leader — cohort, week, the date, the chapter it covered and who
         turned up — and it was this page's whole claim to a rail slot of its
         own: the note at the head of this view argues that `V.leadCohorts`
         already lists the week's three calls, so the PAST was the half nothing
         else held. That argument is now spent, and what is left is the diary.
         Keeping it written down because the next person to ask "why is Calls a
         module" will find the answer here and it is no longer this.

         `LEAD_RUN` STAYS AND STILL HAS ONE READER. `PAGESUM.leadCalls` counts
         the seats across it — "across the four behind you, 32 of 36 seats were
         filled" — which is now the only place attendance appears anywhere in
         the product, and a figure read once is exactly what a Tal summary is
         for. `lranChapter` went with the rows; it had no other caller.
         `V.leadProfile`'s "Calls already run" row pointed at this section for
         the attendance and has been re-pointed at Tal. */}
</div></main>`;
};

/* ==========================================================================
   EVALUATIONS — ONE QUEUE NOW, AND IT IS THE 90-DAY SUMMARY

   IT WAS TWO QUEUES AND THE ARGUMENT FOR THE PAIR WAS GOOD: "a level decision
   opens a candidate's 90 days; a 90-day summary closes them. Both are a
   signature you owe somebody." Only the closing half is the leader's (Maryam,
   1 Sep 2026) — the opening half is the talent agent's, one portal over, and
   lead.js's head is the argument. So the first section, its `.stats` cells and
   the page it opened are deleted.

   THE MODULE KEEPS THE NAME "EVALUATIONS", which is a judgement rather than
   inertia. A 90-day summary IS the leader's evaluation of a candidate — four
   figures off the roster, a recommendation and a reason — and "Summaries" names
   the artefact rather than the act. The heading inside the page names the
   artefact, which is where that word belongs.

   THE PAGE DOES NOT DRAW A TAL CARD, and the long note above `ldrRead` in
   lead2.js is why: `talFirst` hoists one, `placeBand` claims it, ai6 strips its
   action and overwrites its words with `PAGESUM`. Tal's reading is therefore a
   `PAGESUM.leadEvals` / `PAGESUM.leadSum` entry — the band at the top of each
   page — and the ROUTE the card would have offered is on the page instead,
   which is the condition ai6's own note sets for removing it: every pending
   summary is a row you press.

   THE PAGE IS TWO LISTS AND IT USED TO BE ONE (Maryam, 1 Sep 2026: "all members
   of the cohort will be there, not only 2 … the other members' evaluations have
   been sent but these two are awaiting. Show these two on top and add another
   section below with the name Evaluated Candidates").

   THE SCENARIO IS WHAT THE DASHBOARD ALREADY CLAIMS. Cohort 33 is in week 11 and
   this page opens when a cohort closes, so the queue is not a list of two people
   — it is a list of two people who are LEFT. `LEAD_SUMMARIES` now carries all
   eight, six of them `done`, and lead.js's note is the argument for reading the
   roster rather than picking a number.

   ONE LIST COULD NOT SAY THAT. The published rows were in the same `.tile-stack`
   as the waiting ones, separated only by a green tag on row three — so the
   section heading said "2 waiting" over a stack of eight, and the eye had to
   read every row's tag to find the two that are the work. Two sections, two
   headings, two counts.

   THE FOUR FIGURE CELLS ARE DELETED WITH THEIR SECTION AND THEIR HAIRLINE
   (Maryam, same day: "remove the top 4 blocks and the divider below those
   blocks"). Every one of them was a count the page now draws as a list:
   "90-day summaries 2" is the first heading's own `2 waiting`, "Published by
   you 0" is the second heading's count and was WRONG as written — it said 0 on
   a page where six are published, because it counted this SESSION's signatures
   — "Cohort closing 33" is on every row of both lists, and "Due by Day 90" is
   the page's premise rather than a figure. `c0` goes with them and `statCell`
   does NOT — `V.leadSum` draws four of them about one candidate, which is the
   band this page was borrowing the shape from. The divider was that `.sec`'s own
   §10.2 closing rule, so removing the section removes the line.

   WHAT THE BAND WAS FOR is worth keeping: it was written when the page opened on
   a queue of one to four and needed to say which cohort and by when. The list
   answers both now that it holds the whole cohort.
   ========================================================================== */
V.leadEvals = () => {
  const ps = LEAD_SUMMARIES.filter(s => s.status === 'pending');
  const published = LEAD_SUMMARIES.filter(s => s.status === 'done');
  /* EPIC 12.9 — the recommendation window (its close date used to head this page)
     now lives only in Tal's summary; the on-page window line was removed 30 Sep
     2026, so `evalCo`/`closeDate` are no longer derived here. */

  /* BOTH ROWS ARE THE SAME COMPONENT AND THE DIFFERENCE IS THE SUBTITLE, which
     is what made the split cheap. A published row says what you decided; a
     waiting row says what the numbers are and what pressing it does. Both open
     `V.leadSum` — the published state of that page is fully drawn (the
     recommendation, the reason, the four figures), and it was previously
     reachable only in the seconds after signing, which is §60's dead-content
     tell wearing the other hat: the page existed and nothing pointed at it.

     THE "PUBLISHED" TAG IS GONE (Maryam, 1 Sep 2026). It was a green pill after
     every name in the second list — eight rows, six pills, all saying the same
     word — and by the time it shipped the list itself was already saying it: a
     row is under the heading "Evaluated Candidates" and its own subtitle opens
     "you recommended". The tag was written when both kinds of row sat in ONE
     stack and it was the only thing telling them apart; the split retired it and
     it stayed a build too long. It is the "gate nothing writes" test applied to
     COPY rather than CSS — a word that is true of every row in a list is the
     list's heading, not the row's. */
  /* A PUBLISHED ROW SAYS THE RECOMMENDATION IN A CHIP AND THE SCORE IN WORDS
     (Maryam, 2 Sep 2026: "against each evaluated user next to their name their
     should be a chips that tell their recommendation … instead of the bottom
     cohort name, show the score of the candidate").

     THE CHIP GOES INSIDE THE `<h3>`, WHICH IS THE PRODUCT'S OWN IDIOM FOR THIS
     — `V.leadReports`' roster writes `${m.name} ${lflagTag(m.flag)}` into a
     `.cardrow-t` and `V.leadMember`'s identity row does the same one level
     down. No new class and no new rule: `.tag` is `inline-flex` and §63 §14
     types it at `--t-label` wherever it lands, so it keeps its own rank inside
     a heading rather than inheriting the name's.

     "you recommended:" CAME OFF WITH THE COHORT NAME, and that is the half the
     instruction does not name but follows from it. The chip IS the
     recommendation, so the words would be the same verdict twice sixteen
     pixels apart — §60's test applied to copy, which is the reason the
     "Published" tag was deleted from this very list on 1 Sep.

     THE SCORE IS `m.avg`, THE ASSESSMENT AVERAGE, and it is read off the roster
     rather than stored on the summary — `lmemOf` is already how this page and
     `V.leadSum` get every other figure, and this note's own file records why:
     "the wireframe's `SUMMARIES` carried its own `pc`, `avg`, `mins` and
     `calls`, which is the same candidate's numbers written down twice".

     IT IS WORDED "Scored 79%" AND THAT IS THE PAGE'S OWN WORD (Maryam, 2 Sep
     2026: "not assessment score, just 'Scored 78%'"). It shipped for one build
     as "Assessment score 79%", which named the FIGURE — and the black card 200px
     above this list already labels the same number under its ring with the
     single word "Scored". One word, one meaning, twice on one page.

     THE COHORT IS NOT LOST. Every row in this list is opened into `V.leadSum`,
     whose crumb and header both name the cohort, and the page above this
     section is already filtered to the leader's own three. */
  const sumRow = s => {
    const c = lcoOf(s.cohort);
    const m = lmemOf(c, s.name);
    const done = s.status === 'done';
    return `<button class="tile clk gcard face-row" data-ldrsum="${s.id}" data-go="leadSum">
      <span class="mem-av mem-ph">${avatar({i:s.i, img:AV[s.img]}, 36)}</span>
      <span class="gcard-b"><h3>${s.name}${done ? ' ' + ldrRecTag(s.rec) : ''}</h3>
        <span class="sub">Scored ${m.avg}%</span></span>
      ${''/* THE ARROW'S LABEL — `.row-cta`, §112 (Maryam, 2 Sep 2026: "with
             right side arrows, give text 'View Evaluation' on the left of the
             arrow"). Written here rather than through `faceRow`'s fifth
             argument because this row is `sumRow`'s own markup: the two
             functions draw the same shape and only this one puts a chip in the
             heading.
             ONE VERB PER STATE: a published row VIEWs the evaluation, a waiting
             row opens the same page to WRITE it — "Evaluate Candidate" (Maryam
             30 Sep 2026). The black card that used to carry that verb is gone —
             the two states are now the SAME ROW under two tabs, so the label is
             what tells you which action the row opens. */}
      <span class="row-cta">${done ? 'View Evaluation' : 'Evaluate Candidate'}</span>
      <svg class="tile-arrow" viewBox="0 0 24 24">${inner('arrowRight')}</svg>
    </button>`;
  };

  /* TWO TABS — "Awaiting Evaluations" / "Evaluated Candidates" (Maryam, 30 Sep
     2026: "this page should have 2 tabs Awaiting Evaluations and Evaluated
     Candidates"). The black card is GONE (Maryam: "in awaiting evaluations do not
     show the black card just show the candidate row like ... evaluated
     candidates") — a waiting candidate is now the SAME `.tile` `sumRow` as a
     published one, under its own tab, differing only by its cta verb ("Evaluate
     Candidate" vs "View Evaluation") and the absence of a recommendation chip.
     `evCol` and its `.ev-*` column drawing (§90) are RETIRED with the card — §90
     is now dead CSS (nothing writes `.ev-c`/`.ev-row`/`.ev-top`/`.ev-ring`/
     `.ev-bdg`/`.ev-pts`/`.ev-id`/`.ev-nm`); flag to drop the layer.
     The strip is the leader's own tab mechanism (`data-ldrevtab` → `S.ldrEvTab`),
     the same `.sec.sec-cs > .cs` the Sessions and Cohort pages use. The window
     line stays above the tabs — it is the page's status, true on both tabs. */
  const tab = S.ldrEvTab || 'awaiting';
  const listSec = (rows, empty) => rows.length
    ? `<div class="sec lead-evbody"><div class="tile-stack">${rows.map(sumRow).join('')}</div></div>`
    : `<div class="sec lead-evbody"><div class="empty" style="border:0">${I.checkFilled}${empty}</div></div>`;

  /* THE WINDOW LINE IS GONE and the STRIP ATTACHES TO THE TAL SUMMARY (Maryam
     30 Sep 2026: "remove '2 recommendations outstanding …', attach tabs with the
     top tal summary since the line will be removed, reduce the gap of tabs and
     the bottom content"). With the `.sec.sec-noline` window line removed the strip
     is the first section after the summary band, so §15's `.modhead + .sec > .cs`
     drops its top border and it reads as one block with the summary;
     `.lead-evtabs`/`.lead-evbody` (§31) then tighten the strip→content gap to
     `--s05`. The `closeDate`/outstanding count now live only in Tal's summary. */
  return `<main class="main"><div class="page">
  ${crumb(['Dashboard','leadDash'],'Evaluations')}
  ${ph('Evaluations')}
  <div class="sec sec-cs lead-evtabs">
    <div class="cs">
      <button class="${tab === 'awaiting' ? 'on' : ''}" data-ldrevtab="awaiting">Awaiting Evaluation${ps.length ? ` <span class="lf-n">${ps.length}</span>` : ''}</button>
      <button class="${tab === 'evaluated' ? 'on' : ''}" data-ldrevtab="evaluated">Evaluations Completed${published.length ? ` <span class="lf-n">${published.length}</span>` : ''}</button>
    </div>
  </div>
  ${tab === 'awaiting'
    ? listSec(ps, '<h3>Nothing waiting</h3><p>Every 90-day summary in this cohort is published.</p>')
    : listSec(published, '<h3>No evaluations yet</h3><p>Nothing has been signed off in this cohort.</p>')}
</div></main>`;
};

/* ==========================================================================
   ONE NINETY-DAY SUMMARY

   THE RECORD IS READ-ONLY AND THE RECOMMENDATION IS NOT. Everything above the
   recommendation comes back from the course platform for a candidate the
   leader has watched for thirteen weeks — and it is READ OFF THE ROSTER, not
   stored on the summary. The wireframe's `SUMMARIES` carried its own `pc`,
   `avg`, `mins` and `calls`, which is the same candidate's numbers written
   down twice; here `lmemOf` reads the member record the roster and the reports
   both read, so a summary cannot disagree with the page the leader was just
   looking at.

   FIVE RECOMMENDATIONS, AND FOUR OF THEM COST A SENTENCE. One level after
   90 days that went well is the expected end, and it is the only one that
   costs nothing: it is what the course is for and the numbers above it are the
   argument. Every other answer is the leader departing from that, in one
   direction or the other, and a departure carries a reason for one reason: the
   human call wins, and the record says why. This USED to be stated as "for
   exactly the reason an override does on a level decision", and with that page
   gone (1 Sep 2026) this is the only place in the portal that makes the
   argument — which is why it is now made in full here rather than by reference.

   TWO LEVELS IS A DEPARTURE UPWARDS, and it was the case the four could not
   say. A leader who thinks 90 days moved somebody two levels had no way to
   write it down: they could recommend the promotion the platform expected, or
   they could hold, and the extra level went in prose that nothing acts on. It
   is the same shape as "hold" — an exception the next agent has to know about
   before the re-interview — so it is offered as an option and gated by the same
   required box, and the question above the box changes direction with it.

   WHY THE COPY BRANCHES ON `up` RATHER THAN ON THE KEY. There are two kinds of
   exception here and one field: asking "why not a promotion?" of a leader who
   has just chosen a DOUBLE promotion is asking the opposite of what happened,
   and asking "why two levels?" of a hold is worse. One boolean, three strings.
   ========================================================================== */
/* EACH ONE CARRIES A LINE NOW, and the lines are this note's own argument said
   in five short forms rather than new product copy (1 Sep 2026, with a reference
   screen that puts a sentence under every option). The reference's own wording
   ("Strong performance. Ready to fast-track.") describes the CANDIDATE, which is
   the one thing an option list must not do — it would be praising somebody
   before the leader has chosen. These say what the CHOICE means, which is what
   the paragraphs above already establish: the expected end, the two departures
   upwards, and the two downwards.
   THE THIRD FIELD IS OPTIONAL BY POSITION, so `LDR_RECS.map(([k,l]) => …)` at any
   other call site keeps working — `ldrDraftRead`'s publish handler reads `r[1]`
   by index and is untouched.

   AND THE FOURTH IS THE CHIP'S HUE (Maryam, 2 Sep 2026: "against each evaluated
   user next to their name their should be a chips that tell their recommendation
   … the chip color should be based on the recommendation"). It is a TOKEN NAME,
   so the five decisions are stated once here rather than as a `switch` inside
   whatever draws them — the same reason the label and the line live on this row,
   and the same shape §72's `pulseCol` uses to name a hue per instance.

   THREE HUES FOR FIVE ROWS, AND THE PAIRING IS THE DECISION. The question a
   colour answers here is "what KIND of news is this", not "how far up or down":
   **green** for the two that move a candidate UP (the end the 90 days are built
   for), **amber** for a hold — another 90 days at the same level is a delay, not
   a failure — and **red** for a move down, which is the only one that takes
   something away.

   THEY ARE §31's THREE INKS AND NOT `.tag`'s OWN, which is what keeps this
   portal speaking one language. `.tag.green` / `.red` / `.warn` carry
   `--on-success-bg` / `--on-error-bg` / `--on-warning-bg`, inks tuned to sit on
   §02's pale FILLS — and §10.293 turns those fills off, so a `.tag.warn` in this
   build is an outlined chip with `--on-warning-bg` words and a neutral `--rule`
   border. Three of those in a column read as three grey outlines that happen to
   have differently-coloured text. The leader already has a chip that does this
   properly: §31's attention-table flags, which Maryam asked for by name ("round
   chips, the red item will have a light red chip bg"). This reuses that
   formula and its three tokens, so a red on the Evaluations page is the red on
   the dashboard's queue.

   `notready` IS DELIBERATELY UNTONED and keeps §10's outlined chip. It is not a
   verdict on the candidate at all — its line says "not enough here to assess
   yet" — and giving it a hue would sort it beside one of the four that are.
   The empty string is what `ldrRecTag` reads, so no `--mk` is written and
   nothing in §31.6 matches. */
const LDR_RECS = [
  ['promote',  'Promote by One Level',        'The end 90 days are built for.',        '--support-success-ink'],
  ['promote2', 'Promote by Two Levels',      'More than 90 days can normally move.',  '--support-success-ink'],
  ['hold',     'Hold at Current Level',      'Another 90 days at the same level.',    '--support-attention'],
  ['down',     'Move Down One Level',       'The level was set too high.',           '--danger-ink'],
  ['notready', 'Not Ready for Re-Interview','Not enough here to assess yet.',       '']];

/* THE CHIP, KEYED ON THE LABEL BECAUSE THAT IS WHAT THE RECORD HOLDS.
   `LEAD_SUMMARIES[].rec` is the string a leader chose ("Ready to promote"),
   not the key — `ldrDraftRead` writes `r[1]` — so the lookup runs the other
   way. An unknown string falls through to the untoned chip rather than to
   `undefined`, which is the shape `cohortArt` and `courseOf` both take: a
   record that grows a sixth recommendation draws a plain chip, never a broken
   one. */
const ldrRecHue = rec => (LDR_RECS.filter(r => r[1] === rec)[0] || [])[3] || '';
const ldrRecTag = rec => { const h = ldrRecHue(rec);
  return `<span class="tag sm rec-tag"${h ? ` style="--mk:var(${h})"` : ''}>${rec}</span>`; };

V.leadSum = () => {
  const s = ldrSumOf(S.ldrSum);
  const c = lcoOf(s.cohort);
  const m = lmemOf(c, s.name);
  const rec = S.ldrRec || 'promote';
  const needsWhy = rec !== 'promote';
  /* the one exception that goes UP. `next` is the level two above where they
     are, printed so the question names the thing being asked for rather than
     asking about "two levels" in the abstract. */
  const up = rec === 'promote2';
  const rung = +llevel(c).replace(/\D/g,'') || 1;
  const twoUp = llevel(c).replace(/\d+/, Math.min(5, rung + 2));
  const done = s.status === 'done';
  const first = s.name.split(' ')[0];
  const retakes = m.att > 1.4 ? 3 : m.att > 1.1 ? 2 : 1;

  /* `nosum` IS HOW A PAGE DECLINES TAL'S SUMMARY (Maryam, 1 Sep 2026: "do
         not show tal summary on this page"), and ai6's `placeSummaryPass` reads
         it beside `.msg-page` and `.msg-mod` — the class is the whole test.
         WHY THIS PAGE. It is the one page in the portal that IS a summary, and
         Tal's line was reprinting what the page states in its own words 500px
         below: published, the band read "Published. You recommended: Ready to
         promote." over a `.kv` row reading "Recommendation — Ready to promote";
         waiting, it restated the four figures in the band directly above them.
         That is the duplication CLAUDE.md's two-copy-slots rule exists to stop,
         and here the second copy is not a sentence in a grey line but the whole
         body of the page.
         `PAGESUM.leadSum` STAYS IN ai6, UNREACHED, which is that file's own
         convention for `PAGESUM.messages` and the courseware's entries — the
         words are the record of what the band used to say. */
  /* ------------------------------------------------------------------------
     THE PAGE IS THE CANDIDATE BESIDE THE DECISION (1 Sep 2026, with a reference
     screen: "this page should look like the reference, obviously with our design
     language"). §91 draws it. What was here was four stacked sections — an
     identity header, a four-cell figure band, and then either the record or the
     form — so on a 1280 frame the decision the page exists for started 700px
     down and the figures it turns on had scrolled off the top.

     TWO COLUMNS, ONE SECTION. Left: who this is and what the 90 days produced.
     Right: the recommendation and the prose. The reference draws each as a
     bordered, rounded card; §76 is the precedent for refusing that and it is the
     same argument Maryam made about the Evaluations columns a moment earlier
     ("do not close the candidates in cards since this is not our ui language") —
     `--radius` is 0, and a column beside a hairline is how this product says
     "two things, side by side".

     WHAT THE REFERENCE GETS RIGHT AND THIS TAKES: the candidate's figures beside
     the decision rather than above it; a ring on the progress figure; the five
     options shown as a strip with the chosen one lit, so a published summary
     records what was chosen *out of what was available*; the three prose blocks
     under it as headed paragraphs; the sharing notice at the top where it is a
     condition of the page rather than a footnote to the form; and a signature
     line at the foot.

     WHAT IT REFUSES: "Days to Close 90 days" and "Sign to Close 90 days" — the
     same number twice, and neither is a figure this build holds; the round
     tinted glyph behind every mark, because a mark in this product has been a
     bare 20px glyph since 1 Sep 2026 (CLAUDE.md states it: "the icons should not
     have the background … increase the size of the icons"); and the `···`
     overflow control, which would open a menu of nothing.
     ------------------------------------------------------------------------ */
  const figRow = (ic, hue, label, val) => `<div class="sump-f">
    <span class="sump-fi" style="--mk:${hue}">${ic}</span>
    <span class="sump-fl">${label}</span>
    <span class="sump-fv">${val}</span>
  </div>`;

  /* ------------------------------------------------------------------------
     THE TWO STATES ARE TWO PAGES NOW, AND THAT IS THE CORRECTION (Maryam, 1 Sep
     2026: "we will not change the ui for the candidate evaluation page that are
     not done yet. I need the ui of this page back").

     §91's two-column shape came in for the whole view, and it should not have:
     the reference it was drawn from is a PUBLISHED summary, and the two states
     are not the same kind of screen. Published, this is a record — the figures
     and the decision are read side by side, which is what the columns are for.
     Waiting, it is a FORM: a stack you work down, and the four figures are the
     brief you read before you fill it in. Restated as one rule, the rule the
     restructure broke: **a two-column layout is for reading, a single column is
     for filling in.**

     SO THE WAITING BRANCH IS THE PAGE IT WAS, restored slot for slot — the
     `.idhead` header with "Their full record", the `.stats` band under "What the
     90 days produced", and the tinted "Your recommendation" section holding the
     `.btn-set` of five, the reason box, the two prose boxes, the sharing line
     and the two buttons. The placeholders say "the numbers above" again, because
     in this layout they are above.

     WHAT DOES NOT COME BACK IS TAL'S CARD, and that was a separate instruction
     one message earlier ("do not show tal summary on this page") rather than
     part of the restructure: `nosum` stays on the page, so neither state draws
     it. Waiting, the sentence it printed was the four figures directly below it
     said again; published, it was the recommendation printed twice.
     ------------------------------------------------------------------------ */
  if(!done) return `<main class="main"><div class="page nosum">
  ${crumb(['Evaluations','leadEvals'], s.name)}
  ${ph(`90-day summary &middot; ${s.name}`, `${lname(c)} &middot; ${llevel(c)} &middot; waiting on your signature`)}
  <div class="sec">
    <div class="idhead">
      <span class="av-ph" style="width:72px;height:72px"><i>${s.i}</i><img src="${AV[s.img]}" alt=""></span>
      <div class="idhead-b">
        <span class="idname">${s.name}</span>
        <span class="idmeta">${lname(c)} &middot; 90-day journey complete</span>
        <span class="tag sm">${llevel(c).replace(' &ndash; ', ' &middot; ')}</span>
      </div>
      <div class="idhead-a"><button class="btn btn-g" data-ldrco="${c.id}" data-ldrmem="${s.name}" data-go="leadMember">View Candidate Progress ${I.arrowRight}</button></div>
    </div>
  </div>
  ${''/* NO "read-only" HELPER AND NO FOOT DIVIDER (Maryam, 9 Sep 2026: "remove
         these lines" for the two `.t-helper-01` captions, and "remove divider
         below 4 cards"). `sec-noline` drops §10.2's foot hairline so the figures
         run straight into "Your recommendation". */}
  <div class="sec sec-noline">
    <div class="sec-h"><h2>90-Day Performance</h2></div>
    <div class="stats">
      ${statCell(I.book,  'Chapters Completed', lchDone(m) + '<small> of 13</small>', m.pc + '% complete')}
      ${statCell(I.chart, 'Assessment Average', m.avg + '<small>%</small>', m.avg >= 85 ? 'Well above the pass mark' : 'Above the pass mark')}
      ${statCell(I.time,  'Learning Time', lhrs(lmins(m)), Math.round(lmins(m)/lchDone(m)) + 'min per chapter')}
      ${statCell(I.renew, 'Chapter Retakes', retakes, 'Completed chapters')}
    </div>
  </div>
  ${''/* EPIC 12.9 — attendance, read-only, from the register the platform keeps.
         Sessions with no participation data are left out of both figures. */}
  ${(() => { const a = leadAttn(m, c); return `<div class="sec sec-noline">
    <div class="att-stack" style="display:flex;flex-direction:column;gap:var(--s02)"><span class="t-label" style="color:var(--text-secondary)">Session Attendance</span><span class="t-body" style="color:var(--text-primary)">${a.held ? a.att + ' of ' + a.held + ' sessions attended' : 'No sessions held'}</span></div>
  </div>`; })()}
  ${''/* THE LEADER'S OWN NOTES ON THIS CANDIDATE (Maryam, 9 Sep 2026: "there
         needs to be a section of the notes taken by the cohort leader about this
         candidate on this evaluation screen"). The same `S.ldrNotes` store and
         `.note-list` / `.note-row` styling the cohort page writes, drawn READ-ONLY
         here — no edit/delete chips, because this page has no composer to open (a
         chip would set state nothing on this page renders). It sits between the
         figures the leader reads and the recommendation they write, which is the
         order the note at 769 already assumes ("the numbers above" and the
         private notes). Nothing when the candidate has no notes yet. */}
  ${lnotes(s.name).length ? `
  <div class="sec">
    <div class="sec-h"><h2>Your Observations</h2></div>
    ${ldrNotesRead(s.name)}
  </div>` : ''}
  ${/* ONE BAND OF FIGURES, NOT TWO. A `.facts` row of four sat directly under
        the `.stats` row of four — the same object twice, one with an icon and
        a sub-line and one without, and nothing said why "calls attended"
        belonged in the plain row while "chapters retaken" belonged in the
        marked one. Two identical grids stacked also read as one eight-cell
        table that had wrapped, which put a border between rows four and five
        for no reason a reader could name.

        The four that stayed are the four the recommendation turns on: how much
        of the course is done, how well it was assessed, how long it took, how
        much was retaken. Calls attended, tasks on time and last-active are the
        roster's numbers and they are one click away on "Their full record",
        which is the button this page already puts beside the person's name.
        The leader's own note count is not a fact about the candidate at all. */''}
  ${/* THE SECTION IS WHITE (Maryam, 2 Sep 2026: "remove the grey background from
        Your recommendation section"). It was `.sec tint` — §55's tinted panel —
        and the tint was doing the job the `.tile` inside it already does: a 4%
        grey band wrapping a bordered white card is two frames around one form,
        which is §39's "one frame" argument and §74's ("a 5%-tinted card on a 4%
        grey ground is two washes a shade apart"). The published branch has no
        tint either, so the two states of this page now stand on the same
        ground. */''}
  <div class="sec">
    <div class="sec-h"><h2>Your Recommendation</h2></div>
    <div class="tile">
      ${/* THE CHOICE IS A RADIO LIST, NOT A BUTTON STRIP (Maryam, 2 Sep 2026:
            "instead of arrows and full button type selection, give radio buttons
            to each one"). Five `.btn`s in a `.btn-set` drew the one selected
            option as a solid black `.btn-p` and the other four as outlined
            `.btn-g` with §64's trailing arrow — so the control read as five
            ACTIONS, four of which promised to navigate somewhere, when it is one
            question with five answers. §60's rule from the other side: an arrow
            that goes nowhere is a dead control.
            `.rad` IS §02's OWN RADIO and needed no new component — a real
            `<label>` + `<input type="radio">`, which this can host because it is
            a form rather than §76's `<button>` grid. The `checked` attribute is
            written FROM `rec` on every render (trap 9: `render()` replaces
            `device.innerHTML`, so a natively-toggled input would be gone at the
            next paint); `data-ldrrec` stays on the label, so the existing
            handler — which calls `ldrDraftRead()` to keep the typed text — is
            untouched.
            IT IS VERTICAL, which is what makes the dependent field legible: the
            "Why not a promotion?" box below is a consequence of this answer, and
            a five-across strip put the cause and the effect on the same line. */''}
      <div class="f">
        <label>Where ${first} Stands After 90 Days</label>
        <p class="t-desc" style="margin-bottom:var(--s04)">Choose the recommendation that best reflects ${first}&rsquo;s progress and readiness for the next stage.</p>
        <div class="ldr-recs">
          ${LDR_RECS.map(([k,l]) => `<label class="rad ldr-rec" data-ldrrec="${k}"><input type="radio" name="ldrrec"${rec === k ? ' checked' : ''}><span class="box"></span><span class="txt">${l}</span></label>`).join('')}
        </div>
      </div>
      ${needsWhy ? `
      <div class="f mt5"><label for="ldrSumWhy">${up
          ? `Why two levels, to ${twoUp}?`
          : 'Why not a promotion?'}</label>
        <textarea class="inp" id="ldrSumWhy" rows="3" placeholder="${up
          ? 'Two levels is more than 90 days is built to move. Say what they did that the numbers above do not show.'
          : '90 days that did not end in a promotion needs a reason on the record.'}"></textarea></div>
      ${S.ldrErr ? `<div class="note"><span>${I.warningAlt}</span><div class="nb"><b>This one needs a reason</b>${up
          ? 'A double promotion is you saying 90 days did more than they are built to. Say why, and it goes on the summary the next agent reads.'
          : 'Anything other than a promotion is you saying the 90 days did not do what they were meant to. Say why, and it goes on the summary.'}</div></div>` : ''}
      ` : ''}
      <h3 class="t-h4 mt6">Growth &amp; Development</h3>
      <div class="f mt5"><label for="ldrGrowth">Where ${first} Grew${S.ldrGrowErr?' <span class="f-req-err">Required</span>':''}</label>
        <textarea class="inp" id="ldrGrowth" rows="3" maxlength="2000" placeholder="What changed over the 90 days that the performance metrics alone don&rsquo;t capture?"></textarea></div>
      <div class="f mt5"><label for="ldrDev">Areas to Develop Next${S.ldrDevErr?' <span class="f-req-err">Required</span>':''}</label>
        <textarea class="inp" id="ldrDev" rows="3" maxlength="2000" placeholder="What should the next 90 days or re-interview focus on?"></textarea></div>
      <div class="note mt5"><span>${I.info}</span><div class="nb"><b>Before You Submit</b><span style="color:var(--text-secondary)">Your recommendation will be shared with ${first} and the agent conducting the re-interview. Your private notes will remain confidential.</span></div></div>
    </div>
    ${/* ONE BUTTON, AND ITS WORDS ARE THE ACT (Maryam, 2 Sep 2026). "Send
          Recommendation" rather than "Publish the summary": the section above it
          is headed "Your recommendation" and the radio list asks for one, so the
          button now names the thing the page has just been filling in. It is the
          only place in either portal that says "publish", which was the odd word
          — the candidate's side never uses it.
          "FINISH LATER" IS GONE. It was `data-go="leadEvals"`, a plain route
          back to the list that saved nothing — `ldrDraftRead()` runs on the
          recommendation change, not on that press — so it promised a draft the
          build does not keep. The crumb and the rail already go back, and §60's
          rule is that a control which cannot do what it says should not be
          drawn. `.btn-set` stays on the wrapper for the spacing even with one
          child, which is what `.mt5` is measured against. */''}
    <div class="btn-set mt5 ldr-eval-a">
      <button class="btn btn-s noic" data-ldrdraft="${s.id}">Save Draft</button>
      <button class="btn btn-p" data-ldrpub="${s.id}">Send Evaluation</button>
    </div>
    ${S.ldrDraftSaved === s.id ? `<p class="ldr-draft-note">Draft saved. ${first} stays in Awaiting until you send it.</p>` : ''}
  </div>
</div></main>`;

  return `<main class="main"><div class="page nosum">
  ${crumb(['Evaluations','leadEvals'], s.name)}
  ${ph(`90-day summary &middot; ${s.name}`, `${lname(c)} &middot; ${llevel(c)} &middot; published`)}
  ${/* THE PUBLISHED STATE NO LONGER ANNOUNCES ITSELF (Maryam, 2 Sep 2026:
        "remove the top published row and the Shared with Samuel and with
        whichever agent runs their re-interview banner beneath that").

        BOTH HALVES SAID THE SAME THING TWICE. The green "Published" pill and the
        green `.note succ` under it were the reference's title block, and between
        them they spent the whole first screen on the page's STATE — but `ph()`'s
        own fact row already ends in `&middot; published`, and the recommendation
        strip below is drawn in the settled register (§91.3's green cell and tick)
        precisely so the document reads as decided without a banner saying so.
        WHAT IS ACTUALLY LOST is the privacy sentence — "your private notes stay
        private" — and it is not lost, because the DRAFT states it directly over
        the button that does the sending, which is where a reader needs it. A
        page that only reports is the wrong place for a rule about what happens
        next.
        §91.5's `.sump-top` / `.sump-st` RULES GO WITH IT rather than being left
        as the "gate nothing writes" tell; `.note succ` is §02's and has other
        callers, so it stays. */''}
  ${''/* THE PUBLISHED SUMMARY IS ONE COLUMN NOW (Maryam, 7 Oct 2026: "four cards
         on top that tells the stats which are on the left right now and the
         right side content should be below the cards"). §91's two columns
         (candidate + figures left, recommendation right) give way to the same
         stack the WAITING branch draws: the `.idhead` (with "View Candidates
         Progress" in place of the column-foot "Their full record"), the four
         figures as a `.stats` band, then "Your recommendation" below them. The
         ring's figure becomes the Chapters cell; the recommendation strip and
         the prose blocks are unchanged. */}
  <div class="sec">
    <div class="idhead">
      <span class="av-ph" style="width:72px;height:72px"><i>${s.i}</i><img src="${AV[s.img]}" alt=""></span>
      <div class="idhead-b">
        <span class="idname">${s.name} ${ldrRecTag(s.rec)}</span>
        <span class="idmeta">${lname(c)} &middot; 90-day journey complete</span>
        <span class="tag sm">${llevel(c).replace(' &ndash; ', ' &middot; ')}</span>
      </div>
      <div class="idhead-a"><button class="btn btn-g" data-ldrco="${c.id}" data-ldrmem="${s.name}" data-go="leadMember">View Candidate Progress ${I.arrowRight}</button></div>
    </div>
  </div>
  <div class="sec sec-noline">
    <div class="sec-h"><h2>90-Day Performance</h2></div>
    <div class="stats">
      ${statCell(I.book,  'Overall Progress', m.pc + '<small>%</small>', lchDone(m) + '/13 chapters')}
      ${statCell(I.chart, 'Assessment Average', m.avg + '<small>%</small>', m.avg >= 85 ? 'Well above pass mark' : 'Above pass mark')}
      ${statCell(I.time,  'Learning Time', lhrs(lmins(m)), Math.round(lmins(m)/Math.max(1,lchDone(m))) + 'm/chapter')}
      ${statCell(I.renew, 'Chapter Retakes', retakes, 'chapters')}
    </div>
  </div>
  <div class="sec">
    <div class="sump-b">
      <div class="sec-h"><h2 style="font-size:var(--t-sec-size);line-height:var(--t-sec-lh)">Your Evaluation</h2></div>
        ${''/* NO GREEN BANNER (Maryam, 7 Oct 2026: "remove the green banner and
              show a ready to promote chip next to the name just like we have on
              the previous page"). The recommendation is `ldrRecTag(s.rec)` beside
              the name in the `.idhead`, the Evaluated list's own chip. */}
        ${/* THE THREE PROSE BLOCKS ARE HEADED PARAGRAPHS, NOT `.kv` ROWS. That
              band gave a three-sentence answer a 184px label column and set it
              in the value's own 13.5px — which is right for "Recommendation —
              Ready to promote" and wrong for the paragraph this page exists to
              carry. A heading over its own prose is what the reference draws and
              what §63's body role is for.
              THE HEADINGS FOLLOW THE BOXES THEY CAME OUT OF, and the first one
              is `why` — the exception's reason, which only exists when the
              recommendation is not a promotion, so it is the one that can be
              absent on a legitimate record. */''}
        <div class="sump-prose">
          ${s.why ? `<div class="sump-p"><h3>${s.rec === 'Promote by Two Levels'
            ? 'Why two levels' : 'Why this rather than a promotion'}</h3><p>${s.why}</p></div>` : ''}
          ${s.growth ? `<div class="sump-p"><h3>Where ${s.name.split(' ')[0]} Grew</h3><p>${s.growth}</p></div>` : ''}
          ${s.develop ? `<div class="sump-p"><h3>Areas to Develop Next</h3><p>${s.develop}</p></div>` : ''}
          ${!s.why && !s.growth && !s.develop
            ? `<p class="t-helper-01">No notes were added to this summary.</p>` : ''}
        </div>
    </div>
  </div>
</div></main>`;
};

/* ==========================================================================
   THE LISTENERS

   Same capture-phase trick lead2.js records: the parameter travels in its own
   attribute so `data-go` stays a plain view name and `go()` needs no branch.
   Opening a summary also RESETS the recommendation — `S.ldrRec` from the last
   candidate published would otherwise be the answer offered for the next one.

   `[data-ldrev]` WENT WITH THE LEVEL DECISION (1 Sep 2026), and so did the
   `[data-ldrpick]` and `[data-ldrsign]` handlers below. Nothing in either
   portal writes those attributes any more; a listener matching a selector no
   markup emits is the "gate nothing writes" tell in JS, and it costs more than
   a dead CSS rule because it reads as a live flow to whoever greps for it.
   ========================================================================== */
device.addEventListener('click', e => {
  const su = e.target.closest('[data-ldrsum]');
  if(su){ S.ldrSum = su.dataset.ldrsum; S.ldrErr = false; S.ldrGrowErr = false; S.ldrDevErr = false; S.ldrDraftSaved = null;
    /* EPIC 12.9 — a saved draft returns the leader to where they left off. */
    const s = ldrSumOf(su.dataset.ldrsum), d = s.draft;
    S.ldrRec = d ? d.rec : 'promote'; S.ldrSumWhy = d ? d.why : ''; S.ldrGrowth = d ? d.growth : ''; S.ldrDev = d ? d.develop : ''; }
}, true);

/* WHAT IS TYPED SURVIVES A PICK. Choosing a different recommendation
   re-renders the page, and the render rebuilds the form — so every box is read
   into `S` BEFORE anything that renders, and printed back as the textarea's
   content. The same trap ai4.js records for the ask thread and lead.js for the
   queue's search field, met here by carrying the draft rather than by not
   rendering. */
function ldrDraftRead(){
  const sw = device.querySelector('#ldrSumWhy');
  if(sw) S.ldrSumWhy = sw.value;
  const g = device.querySelector('#ldrGrowth');
  if(g) S.ldrGrowth = g.value;
  const d = device.querySelector('#ldrDev');
  if(d) S.ldrDev = d.value;
}

device.addEventListener('click', e => {
  const rc = e.target.closest('[data-ldrrec]');
  if(rc){ ldrDraftRead(); S.ldrRec = rc.dataset.ldrrec; S.ldrErr = false; render(); return; }

  /* PUBLISHING MUTATES THE QUEUE, and that is the point: `lpending()` on the
     dashboard, its "Waiting on you" list and the figure band on Evaluations all
     read `status`, so publishing here empties them everywhere at once rather
     than in one place. */
  /* EPIC 12.9 — Send opens a confirmation first (the recommendation cannot be
     changed once sent). Both written sections are mandatory; a non-promotion also
     needs its reason. */
  const pb = e.target.closest('[data-ldrpub]');
  if(pb){
    ldrDraftRead();
    S.ldrDraftSaved = null;
    const rec = S.ldrRec || 'promote';
    if(rec !== 'promote' && !(S.ldrSumWhy || '').trim()){
      S.ldrErr = true; render();
      const box = device.querySelector('#ldrSumWhy'); if(box) box.focus(); return;
    }
    if(!(S.ldrGrowth || '').trim()){ S.ldrGrowErr = true; render();
      const box = device.querySelector('#ldrGrowth'); if(box) box.focus(); return; }
    if(!(S.ldrDev || '').trim()){ S.ldrDevErr = true; render();
      const box = device.querySelector('#ldrDev'); if(box) box.focus(); return; }
    S.ldrGrowErr = false; S.ldrDevErr = false;
    S.ldrPubAsk = pb.dataset.ldrpub; render(); return;
  }
  const dp = e.target.closest('[data-ldrdopub]');
  if(dp){
    const s = ldrSumOf(dp.dataset.ldrdopub);
    const rec = S.ldrRec || 'promote';
    s.status = 'done';
    s.rec = (LDR_RECS.filter(r => r[0] === rec)[0] || LDR_RECS[0])[1];
    s.why = (S.ldrSumWhy || '').trim();
    s.growth = (S.ldrGrowth || '').trim();
    s.develop = (S.ldrDev || '').trim();
    delete s.draft;
    S.ldrSumWhy = ''; S.ldrGrowth = ''; S.ldrDev = ''; S.ldrErr = false;
    S.ldrPubAsk = null; render(); return;
  }
  /* Save draft (12.9): keeps the candidate in Awaiting, visible to nobody else. */
  const dd = e.target.closest('[data-ldrdraft]');
  if(dd){
    ldrDraftRead();
    const s = ldrSumOf(dd.dataset.ldrdraft);
    s.draft = {rec:S.ldrRec || 'promote', why:(S.ldrSumWhy||'').trim(), growth:(S.ldrGrowth||'').trim(), develop:(S.ldrDev||'').trim()};
    S.ldrDraftSaved = s.id; render(); return;
  }
  const epc = e.target.closest('[data-epclose]');
  if(epc){ if(epc.classList.contains('modal') && e.target !== epc) return; S.ldrPubAsk = null; render(); return; }
});

/* the send confirmation (12.9) — a `.conf` via LDR_SHEETS */
function leadEvalConfirmSheet(){
  const id = S.ldrPubAsk; if(!id) return `<div class="modal" data-epclose="1"></div>`;
  const s = ldrSumOf(id);
  return `<div class="modal on" data-epclose="1">
    <div class="sheet conf" role="dialog" aria-modal="true" aria-label="Send recommendation">
      <div class="sheet-b conf-b">
        <span class="conf-mk">${I.send}</span>
        <h2 class="conf-t">Send your recommendation for ${handleOf(s.name)}?</h2>
        <p class="conf-x">It goes to the agent running their re-interview and cannot be changed afterwards.</p>
      </div>
      <div class="sheet-f conf-a">
        <button class="btn btn-s noic" data-epclose="1">Cancel</button>
        <button class="btn btn-p noic" data-ldrdopub="${id}">Send Evaluation</button>
      </div>
    </div>
  </div>`;
}
LDR_SHEETS.push(leadEvalConfirmSheet);

/* THE DRAFT IS PRINTED BACK INTO THE BOXES after every render, rather than
   inlined into the markup: a `value` attribute on a textarea is its INITIAL
   content, and setting it from `S` inside the template would also mean
   escaping whatever was typed. Writing `.value` after the paint has neither
   problem, and it is the same shape as `leadFilterApply`. */
function ldrDraftWrite(){
  const put = (id,v) => { const el = device.querySelector('#' + id); if(el && v) el.value = v; };
  put('ldrSumWhy', S.ldrSumWhy);
  put('ldrGrowth', S.ldrGrowth);
  put('ldrDev', S.ldrDev);
}

/* `ldrRungView` WAS THE SECOND POST-RENDER PASS HERE AND IT IS GONE WITH THE
   PICKER (1 Sep 2026). It centred the chosen rung in `.ldr-rungs`, which below
   900px is a fifteen-level scroller (§36.5) — a leader who signed B3 on a phone
   was otherwise looking at a row that starts at E1 and shows five. Nothing
   writes `.ldr-rungs` now, so the pass and §36.5's rules both go; the reasoning
   is worth keeping because `LDR_RECS` is a `.btn-set` in the same shape and
   would want the same pass if it ever grew past a phone's width. It has five
   entries and wraps, so it does not. */
/* ==========================================================================
   EPIC 12.5/12.6 — the session handlers. Native form controls read on Save, so
   typing never triggers a render (the caret trap); an overlap or missing-field
   error re-renders with the last-entered values kept on S.sesForm. Rooms,
   notifications and the vendor's own overlap check are stubbed.
   ========================================================================== */
device.addEventListener('click', e => {
  const cRec = leadLive() || LEAD_COHORTS[0];
  const g = sel => device.querySelector(sel);
  const today = LEAD_NOW.toISOString().slice(0,10);

  if(e.target.closest('[data-sesnew]')){
    S.sesForm = {edit:null, title:'', chapter:'', date:'', time:cRec.callTimeH||'18:00', dur:60, cover:'', repeat:'none', scope:'this', err:''};
    render(); return;
  }
  const se = e.target.closest('[data-sesedit]');
  if(se){ const s = leadSessionsOf(cRec).find(x=>x.id===se.dataset.sesedit);
    if(s) S.sesForm = {edit:s.id, title:s.title, chapter:s.chapter, date:s.dISO, time:s.time, dur:s.dur, cover:s.cover||'', repeat:s.repeat, scope:'this', err:''};
    render(); return;
  }

  if(e.target.closest('[data-sessave]')){
    const f = S.sesForm; if(!f) return;
    const title=(g('#sesTitle').value||'').trim(), chapter=g('#sesChapter').value,
      date=g('#sesDate').value, time=g('#sesTime').value, dur=+g('#sesDur').value,
      cover=(g('#sesCover').value||'').trim(), repeat=g('#sesRepeat')?g('#sesRepeat').value:'none',
      scopeEl=device.querySelector('input[name=sesScope]:checked'), scope=scopeEl?scopeEl.value:'this';
    S.sesForm = {...f, title, chapter, date, time, dur, cover, repeat, scope};
    let err='';
    if(!title) err='Add a title.';
    else if(!chapter) err='Choose the chapter this session covers.';
    else if(!date) err='Choose a date.';
    else if(date < today) err='The date must be today or later.';
    else if(date > cohortEndISO(cRec)) err='The date must fall within the cohort’s 90 days.';
    else if(!time) err='Choose a start time.';
    else if(!(dur>=15 && dur<=240)) err='Duration must be between 15 and 240 minutes.';
    else { const clash = leadOverlap(cRec, date, time, dur, f.edit);
      if(clash) err='This overlaps '+clash.title+' on '+clash.date+'. Change the time or the date.'; }
    if(err){ S.sesForm.err=err; render(); return; }
    const arr = LEAD_SESSIONS[cRec.id];
    if(f.edit){
      const s = arr.find(x=>x.id===f.edit);
      const apply = t => { t.title=title; t.chapter=chapter; t.time=time; t.dur=dur; t.cover=cover; t.week=leadWeek(sesDayOf(cRec,t.dISO)); };
      if(scope==='all' && s.series){ arr.filter(x=>x.series===s.series && sesDT(x)>=sesDT(s) && x.status==='scheduled').forEach(apply); }
      else { apply(s); s.dISO=date; s.date=dPretty(date); s.week=leadWeek(sesDayOf(cRec,date)); }
    } else {
      const sid = repeat!=='none' ? 'u'+Date.now() : null;
      let n=0; const mk = dISO => ({id:'s'+cRec.id+'u'+Date.now()+'_'+(n++), co:cRec.id, series:sid,
        title, chapter, dISO, date:dPretty(dISO), time, dur, cover, repeat,
        week:leadWeek(sesDayOf(cRec,dISO)), status:'scheduled', unavail:false, adhoc:true});
      const step = repeat==='weekly'?7:repeat==='fortnightly'?14:0;
      const endISO = cohortEndISO(cRec);
      let d = date;
      arr.push(mk(d));
      if(step){ d = dISOadd(d, step); while(d <= endISO){ arr.push(mk(d)); d = dISOadd(d, step); } }
    }
    S.sesForm=null; render(); return;
  }

  const cx = e.target.closest('[data-sescancel]');
  if(cx){ S.sesCancel = {id:cx.dataset.sescancel, reason:'', scope:'this', err:''}; render(); return; }
  const dcx = e.target.closest('[data-sesdocancel]');
  if(dcx){
    const arr = LEAD_SESSIONS[cRec.id], s = arr.find(x=>x.id===dcx.dataset.sesdocancel); if(!s) return;
    const reason=(g('#cxReason').value||'').trim();
    const scopeEl=device.querySelector('input[name=cxScope]:checked'), scope=scopeEl?scopeEl.value:'this';
    if(!reason){ S.sesCancel={...S.sesCancel, reason, scope, err:'Add a reason. It is shown to candidates.'}; render(); return; }
    const cancel = t => { t.status='cancelled'; t.reason=reason; };
    if(scope==='all' && s.series){ arr.filter(x=>x.series===s.series && sesDT(x)>=sesDT(s) && x.status==='scheduled').forEach(cancel); }
    else cancel(s);
    S.sesCancel=null; render(); return;
  }

  const sn = e.target.closest('[data-sesnotesave]');
  if(sn){ const ta=g('#sesNote'); if(ta) SESSION_NOTES[sn.dataset.sesnotesave]=ta.value.trim(); render(); return; }

  /* the close branches come LAST: the sheet's own controls carry data-sesclose /
     data-cxclose ON THE BUTTON, but the backdrop `.modal` carries it too, so a
     click on Save (inside the modal) reaches the modal via closest(). Checking
     these after every action means a Save is handled before the backdrop can
     swallow it; here they only close on the modal backdrop itself or a close
     button. */
  const sc = e.target.closest('[data-sesclose]');
  if(sc){ if(sc.classList.contains('modal') && e.target !== sc) return; S.sesForm = null; render(); return; }
  const cxc = e.target.closest('[data-cxclose]');
  if(cxc){ if(cxc.classList.contains('modal') && e.target !== cxc) return; S.sesCancel = null; render(); return; }
});

const _baseLdr3 = render;
render = function(){
  _baseLdr3();
  try { ldrDraftWrite(); } catch(e){ console.warn('ldr draft', e); }
};

render();
