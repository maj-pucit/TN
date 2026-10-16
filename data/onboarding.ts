/* ONBOARDING — Phase 1 ob.js OB_Q (the client's five questions, 21 Sep 2026)
   and obDoneScreen, read 15 Oct 2026. These are the questions Super Admin
   edits under Onboarding Questions. */
export type ObQ =
  | { k: string; q: string; t: "radio"; o: [string, string][] }
  | { k: string; q: string; t: "text"; ph: string }
  | { k: string; q: string; t: "dd"; o: [string, string][]; ph: string };

export const OB_Q: ObQ[] = [
  { k: "where", q: "Where are you right now?", t: "radio", o: [["moveup", "In a job I want to move up in"], ["leaving", "In a job I don't plan to stay in"], ["own", "Running something of my own, or trying to start it"], ["between", "Between things"]] },
  { k: "persona", q: "Which of these sounds most like you? Pick one.", t: "radio", o: [["top", "Top Performer"], ["athlete", "Athlete"], ["leader", "Leader"], ["entrepreneur", "Entrepreneur"], ["notsure", "Not Sure"], ["team", "Team Player"]] },
  { k: "role", q: "What do you do now?", t: "text", ph: "Operations coordinator, student, own a detailing business" },
  { k: "industry", q: "What industry is that in?", t: "dd", ph: "Tell me your industry", o: [["security", "Security"], ["franchise", "Franchise ownership"], ["retail", "Retail"], ["food", "Food and hospitality"], ["trades", "Trades and construction"], ["healthcare", "Healthcare"], ["logistics", "Transportation and logistics"], ["sales", "Sales"], ["education", "Education"], ["technology", "Technology"], ["student", "Student"], ["other", "Other"]] },
  { k: "years", q: "How many years have you been working?", t: "radio", o: [["0", "Under 1"], ["1", "1 to 3"], ["3", "3 to 7"], ["7", "7 to 15"], ["15", "15 or more"]] },
];

export const OB_WELCOME = {
  title: "Welcome to TALENTnext, Maryam!",
  /* Two paragraphs, as Phase 1 sets them. */
  lede: ["I’m Tal, your guide throughout your TALENTnext journey.", "Before we get started, I have a few quick questions to learn more about you and personalize your experience."],
};

/* CUT (G8): "Locks in your cohort and your price" → "Locks in your price";
   "90-Day Cohort Journey" → "Course Journey" (self-paced, Maryam 16 Oct 2026). */
export const OB_DONE = {
  title: "You’re all set",
  lede: "That is everything I needed. Here is where you are, and what comes next.",
  steps: [
    ["Next in Leadership Quiz", "You have taken it. Explorer track.", "done"],
    ["Interview & Levelling", "You are here. 45 minutes with a talent agent, and it is what sets your level.", "on"],
    ["Course Enrollment", "Locks in your price.", ""],
    ["Course Journey", "13 chapters, at your own pace.", ""],
  ] as [string, string, string][],
};
