# TalentNext email templates

The full set of emails the platform sends, with the content of each so Design can lay them out
and the client can sign off the wording. Written 22 Oct 2026.

## 1. Scope

Three user stories decide which emails exist:

- **11.2, Manage Notification Templates.** The Super Admin edits IN-APP notifications only. Email
  and SMS wording is fixed in the build, so every email below is a fixed template that only a
  release can change. 11.2 also names the essential account emails that Auth0 sends.
- **13.17, Agent notifications.** Eight agent events the agent may also receive by Email and/or SMS.
- **22.5, Candidate notifications.** Eight candidate events the candidate may also receive by Email
  and/or SMS.

Two kinds of email:

| Kind | Sent by | Can the person turn it off? |
|---|---|---|
| **Essential** (group A) | Auth0 | No. Always sent, whatever the notification settings say. |
| **Opt-in** (groups B and C) | the platform | Yes. Off by default; the person turns it on per event in Profile, Notifications tab. |

Internal staff and Cohort Leaders have no opt-in events, so they only ever receive group A.
"Your commission has changed" (13.5) is in-app only and has no email.

**Phase key.** **P0** = needed for Phase 0. **P1** = Phase 1 only. Phase 0 has no cohorts (G8) and
no points, ranks or promotions (G9), so those emails wait for Phase 1.

## 2. The inventory: 20 templates (15 for Phase 0)

| ID | Template | Recipient | Kind | Story | Phase |
|---|---|---|---|---|---|
| A1 | Invitation to join | Talent Agent, internal staff (P1: Cohort Leader) | Essential | 11.2 | P0 |
| A2 | Reset your password | Everyone | Essential | 11.2 | P0 |
| A3 | Your account has been deactivated | Everyone | Essential | 11.2, 13.17 | P0 |
| A4 | Your account is active again | Everyone | Essential | 11.2, 13.17 | P0 |
| B1 | Interview slot booked | Talent Agent | Opt-in | 13.17 | P0 |
| B2 | Interview reminder, 24 hours before | Talent Agent | Opt-in | 13.17 | P0 |
| B3 | Interview reminder, one hour before | Talent Agent | Opt-in | 13.17 | P0 |
| B4 | Interview report due | Talent Agent | Opt-in | 13.17 | P0 |
| B5 | Interview report overdue | Talent Agent | Opt-in | 13.17 | P0 |
| B6 | Your proposed level was approved | Talent Agent | Opt-in | 13.17 | P0 |
| B7 | Marketplace listing paused | Talent Agent | Opt-in | 13.17 | P0 |
| B8 | Marketplace listing restored | Talent Agent | Opt-in | 13.17 | P0 |
| C1 | Interview confirmed | Candidate | Opt-in | 22.5 | P0 |
| C2 | Interview report pending | Candidate | Opt-in | 22.5 | P0 |
| C3 | Your level was changed | Candidate | Opt-in | 22.5 | P0 |
| C4 | Enrolled in a cohort | Candidate | Opt-in | 22.5 | P1 |
| C5 | Cohort call scheduled | Candidate | Opt-in | 22.5 | P1 |
| C6 | Moved to another cohort | Candidate | Opt-in | 22.5 | P1 |
| C7 | Cohort start date changed | Candidate | Opt-in | 22.5 | P1 |
| C8 | Promotion earned | Candidate | Opt-in | 22.5 | P1 |

## 3. Open points

1. **Sign-in code by email.** Staff choose email or SMS for their one-time sign-in code (stories
   1.2 / 1.4), but 11.2 only names the code as an SMS. If the email route stays, it needs one more
   essential template (A5, "Your sign-in code").
2. **SMS wording.** The same 16 opt-in events (B1 to C8) also need fixed SMS text. Not in this file
   yet; it would follow as a section per event, under 160 characters each.
3. **Candidate invitation.** Candidates sign up themselves, so A1 has no candidate version. Bulk
   Import refuses candidates for the same reason.
4. **Who to contact.** A3 must say who to contact (13.17). This file uses the support address from
   General Settings, `support@talentnext.io`; confirm that is the right contact.
5. **Auth0 layout.** Group A is sent by Auth0. Confirm Auth0's templates can carry the shared shell
   below, or whether they keep Auth0's own layout with our wording.

## 4. The shared email shell

Every email uses one layout, so a change to it reaches all twenty.

- **Header:** the TALENTnext wordmark, left-aligned, on white.
- **Greeting:** "Hi {first_name},"
- **Body:** one to three short paragraphs. Facts first (who, what, when), then what to do next.
- **Detail card** (optional): a bordered box of label/value rows for dates, names and amounts.
- **Button:** one primary button per email, never two. Black fill, white label, square corners,
  Title Case label.
- **Sign-off:** "The TalentNext team"
- **Footer:**
  - "Questions? Write to support@talentnext.io."
  - On opt-in emails only: "You get this email because you turned on email for {event_name}.
    Change it in Profile, Notifications."
  - The legal address line (to be supplied by the client).

**Look:** Plus Jakarta Sans at 400 and 500 only. Text #111111, descriptions and footer #828282,
links and the wordmark accent #F9423A, hairlines #EFEFEF, corners 0. Body 15px for email legibility
(the portal's 13.5px is too small in mail clients). Single column, 600px wide, stacking cleanly on
a phone.

**Writing rules:** sentence case (titles and buttons in Title Case), no em dashes, dates as
MM-DD-YYYY, times in 12-hour form with the time zone, e.g. "6:30 PM New York (UTC-04:00)". Never
name a figure the Super Admin can change (a fee split, a deadline length) unless the email has to
state it. Never say the agent sets a level: the agent recommends, TalentNext sets it.

## 5. Templates

### A. Essential account emails (Auth0)

#### A1 · Invitation to join · P0
- **Recipient:** a Talent Agent or internal staff member a Super Admin invited (Invite User,
  Bulk Import, Mark as Talent Agent).
- **Trigger:** the invitation is sent or resent. The link lasts 7 days.
- **Subject:** You're invited to TalentNext as {role_name}
- **Preview text:** Set your password to get started. This link works for 7 days.
- **Body:**
  > {inviter_name} has invited you to join TalentNext as {role_name}.
  >
  > Set your password to activate your account. The link works for 7 days, until {expiry_date}.
- **Role line** (one sentence after the first paragraph, by role):
  - Talent Agent: "Once you're in, finish your profile and add your payout details to appear in the
    marketplace."
  - Internal staff: "Once you're in, you'll see the parts of the console your role gives you."
  - P1 Cohort Leader: "Once you're in, you can be placed on a cohort to lead."
- **Button:** Accept Invitation → the activation screen.
- **Placeholders:** {first_name}, {inviter_name}, {role_name}, {expiry_date}
- **Context:** The only way an agent or staff member gets an account. If the link expires, the
  admin sees "Invitation Expired" on All Users and can resend it, which sends this email again.
  Mirrors the invited row's "Expires in N days" status.

#### A2 · Reset your password · P0
- **Recipient:** anyone who asked to reset their password (Forgot Password on Log In).
- **Trigger:** Send Code on the Reset Password screen.
- **Subject:** Your TalentNext password reset code
- **Preview text:** Use this code to set a new password.
- **Body:**
  > Use this code to reset your password:
  >
  > **{reset_code}**
  >
  > It expires in {code_minutes} minutes. If you didn't ask for this, you can ignore this email.
  > Your password stays the same.
- **Button:** none. The code is the action; the person types it into the Enter Code screen.
- **Placeholders:** {first_name}, {reset_code}, {code_minutes}
- **Context:** Pairs with the Reset Password → Enter Code → Set New Password flow. Shows a code
  rather than a link because the portal's flow asks for six digits.

#### A3 · Your account has been deactivated · P0
- **Recipient:** anyone whose account was deactivated.
- **Trigger:** a Super Admin deactivates the account (story 3.4), or the person closes it
  themselves from Privacy Settings (13.17).
- **Subject:** Your TalentNext account has been deactivated
- **Preview text:** You've been signed out.
- **Body, deactivated by an administrator:**
  > Your TalentNext account has been deactivated and you've been signed out.
  >
  > If you think this is a mistake, or want to know more, write to support@talentnext.io.
- **Body, closed by you (Talent Agent):**
  > You closed your TalentNext account on {date}. You've been signed out and your listing is no
  > longer shown to candidates.
  >
  > Payments already held for your interviews still go to your payout destination on their normal
  > timetable. Your account is never deleted: sign in at any time to reopen it.
- **Button:** none for the admin version; "Reopen My Account" → Log In for the self-closed version.
- **Placeholders:** {first_name}, {date}
- **Context:** Required by 13.17 ("saying the account has been deactivated and who to contact"),
  sent regardless of preferences. A user is never deleted, only deactivated (Super Admin rule,
  7 Oct 2026), so neither version mentions deletion.

#### A4 · Your account is active again · P0
- **Recipient:** anyone whose account was reactivated or reopened.
- **Trigger:** a Super Admin reactivates it (3.5), or the person reopens it at sign-in (13.17).
- **Subject:** Your TalentNext account is active again
- **Preview text:** You can sign in as usual.
- **Body, reactivated by an administrator:**
  > Your TalentNext account has been reactivated. You can sign in as usual.
- **Body, reopened by you:**
  > You reopened your TalentNext account on {date}. Welcome back.
- **Talent Agent line** (added for agents): "Your listing returns once your profile, payout details
  and training are all in place."
- **Button:** Sign In → Log In.
- **Placeholders:** {first_name}, {date}
- **Context:** 13.17 calls this the "Auth0 account-status email". The in-app notification
  "Your account access has been restored" fires at the same moment.

### B. Talent Agent opt-in emails (13.17)

All eight are off by default. The agent turns each on in Profile, Notifications.

#### B1 · Interview slot booked · P0
- **Trigger:** a candidate books one of the agent's open slots and pays.
- **Subject:** {candidate_name} booked an interview on {interview_date}
- **Preview text:** {interview_time}, {interview_length} minutes.
- **Body:**
  > {candidate_name} booked an interview with you.
- **Detail card:** Candidate {candidate_name} · Date {interview_date} · Time {interview_time} ·
  Type {interview_type} · They want to talk about "{candidate_topic}"
- **Closing line:** "A paid booking is a commitment. If you can't make it, cancel from Interviews
  with a reason, as early as you can."
- **Button:** View Interview → the agent's Interviews, Upcoming tab.
- **Placeholders:** {first_name}, {candidate_name}, {interview_date}, {interview_time},
  {interview_length}, {interview_type}, {candidate_topic}
- **Context:** There is no accept or decline. A paid booking holds the slot. The topic is what the
  candidate wrote when booking.

#### B2 · Interview reminder, 24 hours before · P0
- **Trigger:** 24 hours before a booked interview.
- **Subject:** Tomorrow: your interview with {candidate_name}
- **Preview text:** {interview_date} at {interview_time}.
- **Body:**
  > Your interview with {candidate_name} is tomorrow, {interview_date} at {interview_time}.
  >
  > They want to talk about "{candidate_topic}". You can join from your dashboard one minute before
  > the start.
- **Button:** View Interview → Interviews, Upcoming.
- **Placeholders:** {first_name}, {candidate_name}, {interview_date}, {interview_time},
  {candidate_topic}

#### B3 · Interview reminder, one hour before · P0
- **Trigger:** one hour before a booked interview.
- **Subject:** In one hour: your interview with {candidate_name}
- **Preview text:** Starts at {interview_time}.
- **Body:**
  > Your interview with {candidate_name} starts at {interview_time}. Join opens one minute before
  > the start. The interview is recorded automatically.
- **Button:** Open Dashboard → agent dashboard.
- **Placeholders:** {first_name}, {candidate_name}, {interview_time}
- **Context:** The recording sentence is there because 13.17 says the room does not ask for consent
  again; the candidate agreed at booking.

#### B4 · Interview report due · P0
- **Trigger:** the interview has ended and the report is waiting.
- **Subject:** Your report for {candidate_name} is due by {report_deadline}
- **Preview text:** Send your recommendation to release your payment.
- **Body:**
  > Your interview with {candidate_name} has ended. Send your level recommendation by
  > {report_deadline}.
  >
  > Your payment for this interview is released once the report is in.
- **Button:** Write Recommendation → the interview's evaluation screen.
- **Placeholders:** {first_name}, {candidate_name}, {report_deadline}
- **Context:** Mirrors Evaluations on the agent's Interviews page and "What's holding up your pay"
  on Earnings.

#### B5 · Interview report overdue · P0
- **Trigger:** the report deadline passes with no report filed.
- **Subject:** Overdue: your report for {candidate_name}
- **Preview text:** Your payment for this interview is on hold.
- **Body:**
  > Your report for {candidate_name} was due on {report_deadline} and hasn't been sent.
  >
  > {candidate_name} is waiting for their level, and your payment for this interview stays on hold
  > until the report is in.
- **Button:** Write Recommendation → the evaluation screen.
- **Placeholders:** {first_name}, {candidate_name}, {report_deadline}

#### B6 · Your proposed level was approved · P0
- **Trigger:** a reviewer approves the agent's recommendation.
- **Subject:** Your recommendation for {candidate_name} was approved
- **Preview text:** {candidate_name} is now {level_name}.
- **Body:**
  > TalentNext approved your recommendation. {candidate_name} is now {level_name}.
  >
  > Thank you for a clear report.
- **Button:** View Interview → Interviews, Past Interviews.
- **Placeholders:** {first_name}, {candidate_name}, {level_name}
- **Context:** Sent only on approval of the agent's proposal. If the reviewer chose Tal's proposal
  or overrode it, this event does not fire.

#### B7 · Marketplace listing paused · P0
- **Trigger:** a Super Admin pauses the agent's listing.
- **Subject:** Your marketplace listing is paused
- **Preview text:** Candidates can't book you for now.
- **Body:**
  > Your listing has been paused, so candidates can't book new interviews with you for now.
  >
  > Interviews already booked go ahead as planned, and payments already held release as normal.
  > If you have questions, write to support@talentnext.io.
- **Button:** Open Dashboard → agent dashboard.
- **Placeholders:** {first_name}
- **Context:** The admin's pause reason is internal and never shown to the agent (story 6.2), so
  the email gives no reason.

#### B8 · Marketplace listing restored · P0
- **Trigger:** a Super Admin restores the listing.
- **Subject:** Your marketplace listing is back
- **Preview text:** Candidates can book you again.
- **Body:**
  > Your listing has been restored. Candidates can see you and book your open slots again.
- **Button:** Check Availability → Availability.
- **Placeholders:** {first_name}

### C. Candidate opt-in emails (22.5)

All eight are off by default. The candidate turns each on in Profile, Notifications.

#### C1 · Interview confirmed · P0
- **Trigger:** the booking is complete.
- **Subject:** Your interview with {agent_name} is booked
- **Preview text:** {interview_date} at {interview_time}.
- **Body:**
  > Your interview with {agent_name} is confirmed.
- **Detail card:** Talent agent {agent_name} · Date {interview_date} · Time {interview_time} ·
  Length 45 minutes · Fee {fee_line}
- **Fee line by version:**
  - First interview: "Complimentary. Nothing was charged."
  - Re-interview: "{amount} paid"
- **Closing line:** "You can join from your dashboard one minute before the start. The interview is
  recorded, as you agreed when booking."
- **Button:** View Interview → candidate Interviews.
- **Placeholders:** {first_name}, {agent_name}, {interview_date}, {interview_time}, {fee_line},
  {amount}
- **Context:** Mirrors the "Interview booked" confirmation and the "Interview confirmed"
  in-app notification. The first interview is complimentary (IV_FIRST_FREE), so that version never
  shows a charge.

#### C2 · Interview report pending · P0
- **Trigger:** the interview has been held and the report is not ready yet.
- **Subject:** Your interview is done. Your report is on its way.
- **Preview text:** Expect your level within 24 hours.
- **Body:**
  > Thanks for your interview with {agent_name}. TalentNext is reviewing it now, and your report
  > and level usually arrive within 24 hours.
  >
  > There's nothing you need to do in the meantime.
- **Button:** Open Dashboard → candidate dashboard.
- **Placeholders:** {first_name}, {agent_name}
- **Context:** Mirrors the held stage ("interview held, report pending") and its 24-hour promise.
  It credits TalentNext, not the agent, with setting the level.

#### C3 · Your level was changed · P0
- **Trigger:** a Super Admin overrides the candidate's level.
- **Subject:** Your TalentNext level has been updated
- **Preview text:** You're now {level_name}.
- **Body:**
  > Your level has changed from {old_level} to {level_name}.
  >
  > Your course recommendations follow your new level.
- **Button:** View My Level → My Level.
- **Placeholders:** {first_name}, {old_level}, {level_name}
- **Context:** The admin's override reason is internal, so it is not included.

#### C4 · Enrolled in a cohort · P1
- **Trigger:** the candidate is placed in a cohort after enrolling in a course.
- **Subject:** You're in {cohort_name}
- **Preview text:** Your cohort starts on {start_date}.
- **Body:**
  > You've been placed in {cohort_name}. It starts on {start_date}, and {leader_name} leads it.
  >
  > You'll meet your cohort on the first call.
- **Button:** Meet Your Cohort → Cohort.
- **Placeholders:** {first_name}, {cohort_name}, {start_date}, {leader_name}

#### C5 · Cohort call scheduled · P1
- **Trigger:** the Cohort Leader schedules a session.
- **Subject:** New cohort call: {session_title}
- **Preview text:** {session_date} at {session_time}.
- **Body:**
  > {leader_name} scheduled a call for {cohort_name}.
- **Detail card:** Call {session_title} · Date {session_date} · Time {session_time} ·
  Length {session_length} minutes
- **Button:** View Cohort → Cohort.
- **Placeholders:** {first_name}, {leader_name}, {cohort_name}, {session_title}, {session_date},
  {session_time}, {session_length}

#### C6 · Moved to another cohort · P1
- **Trigger:** a Super Admin moves the candidate to a different cohort.
- **Subject:** You've moved to {cohort_name}
- **Preview text:** Your progress came with you.
- **Body:**
  > You've been moved from {old_cohort_name} to {cohort_name}, led by {leader_name}.
  >
  > Your course progress came with you, and nothing changes about what you paid.
- **Button:** Meet Your Cohort → Cohort.
- **Placeholders:** {first_name}, {old_cohort_name}, {cohort_name}, {leader_name}

#### C7 · Cohort start date changed · P1
- **Trigger:** a Super Admin moves the start date of a cohort that has not started.
- **Subject:** {cohort_name} now starts on {start_date}
- **Preview text:** The start date has changed.
- **Body:**
  > The start date for {cohort_name} has moved from {old_start_date} to {start_date}.
- **Button:** View Cohort → Cohort.
- **Placeholders:** {first_name}, {cohort_name}, {old_start_date}, {start_date}

#### C8 · Promotion earned · P1
- **Trigger:** the candidate earns a promotion (story 15.x gamification, cut from Phase 0 by G9).
- **Subject:** You earned a promotion
- **Preview text:** {promotion_name}
- **Body:**
  > Congratulations. You've earned {promotion_name}.
- **Button:** View Achievements → Achievements.
- **Placeholders:** {first_name}, {promotion_name}
- **Context:** The client needs to confirm what a promotion is (a rank step in the points system, or
  a level move after a re-interview). If it means a level move, this email and C3 overlap.

## 6. Placeholder glossary

| Placeholder | Meaning | Sample |
|---|---|---|
| {first_name} | Recipient's first name | Sofia |
| {role_name} | The role being granted | Talent Agent |
| {inviter_name} | Super Admin who sent the invite | Derek Sole |
| {expiry_date} | Invitation link expiry, 7 days after sending | 10-29-2026 |
| {reset_code} | Six-digit password reset code | 482913 |
| {code_minutes} | Minutes the code stays valid | 10 |
| {date} | Date of the account action | 10-22-2026 |
| {candidate_name} | Candidate's full name | Sofia Martinez |
| {agent_name} | Talent agent's full name | Priya Nair |
| {interview_date} | Interview date | 10-30-2026 |
| {interview_time} | Start time with time zone | 6:30 PM New York (UTC-04:00) |
| {interview_length} | Interview length in minutes | 45 |
| {interview_type} | First interview or Re-interview | First interview |
| {candidate_topic} | What the candidate wrote at booking | Giving feedback to a peer who outranks me |
| {report_deadline} | When the agent's report is due, with time zone | 10-31-2026, 7:15 PM New York (UTC-04:00) |
| {level_name} | Level as shown in the product | Explorer – E3 |
| {old_level} | Previous level | Explorer – E2 |
| {fee_line} | Fee wording for the interview | Complimentary. Nothing was charged. |
| {amount} | Amount paid | $95 |
| {cohort_name} | Cohort name | Cohort 4 |
| {old_cohort_name} | Previous cohort | Cohort 2 |
| {leader_name} | Cohort Leader's full name | Priya Raman |
| {start_date} | Cohort start date | 11-03-2026 |
| {old_start_date} | Previous start date | 10-27-2026 |
| {session_title} | Cohort call title | Week 2 Cohort Call |
| {session_date} | Call date | 11-10-2026 |
| {session_time} | Call time with time zone | 6:00 PM New York (UTC-04:00) |
| {session_length} | Call length in minutes | 60 |
| {promotion_name} | The promotion earned | Rising Builder |
| {event_name} | Opt-in event named in the footer | Interview confirmed |

All sample values are illustrative (§74). {code_minutes}, {promotion_name} and the legal address are
not defined in any story yet.
