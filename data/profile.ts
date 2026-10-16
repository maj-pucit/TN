/* ============================================================
   CANDIDATE PROFILE — copied from Phase 1 (hifi PF, MY_COURSES, SOCIAL,
   legalDoc, pfNotif, pfPrivacy), read 15 Oct 2026. Cuts marked CUT.
   ============================================================ */

export const PF = {
  general: {
    name: "Maryam Naz", nickname: "@maryamsss", email: "maryam.naz@tkxel.io",
    role: "Operations Lead", industry: "Software", years: "5 years", intent: "Develop in my current role",
    about: "Senior UX/UI Designer with experience delivering user-centered designs across SaaS platforms, dashboards, mobile apps, and web experiences. Skilled in design systems, user journeys, and collaborating with cross-functional teams to turn ideas into polished digital products.",
  },
  experience: [
    { role: "Operations Lead", org: "Tkxel", kind: "Full-time", from: "Jan 2024", to: "Present", span: "2 yrs 8 mos" },
    { role: "Business Operations Analyst", org: "TechmateTech LLC", kind: "Full-time", from: "Mar 2021", to: "Dec 2023", span: "2 yrs 10 mos" },
  ],
  education: [{ school: "COMSATS Institute of Information and Technology", art: "/images/logos/pf-art-comsats.jpg", degree: "", field: "", from: "2018", to: "2022" }],
  certs: [
    { name: "Enterprise Design Thinking Co-Creator", org: "IBM", art: "/images/logos/pf-art-ibmco.webp", issued: "Jan 2023", cred: "User Experience Design (UXD)" },
    { name: "Enterprise Design Thinking Practitioner", org: "IBM", art: "/images/logos/pf-art-ibmpr.webp", issued: "Dec 2022", cred: "Enterprise Design Thinking" },
  ],
  skills: ["Mockups", "Low-fidelity designs", "User Experience Design (UXD)", "Interaction Design", "Visual Design", "Web Design", "Brand Design", "Logo Design", "UX Research", "Wireframing", "Prototyping", "Adobe Photoshop"],
};
export const INTENTS = ["Develop in my current role", "Develop for another role", "Develop for ownership"];
export const EMPLOYMENT = ["Full-time", "Part-time", "Freelance", "Contract", "Internship"];
export const AVATARS = ["av1", "b1", "b2", "b3", "b4", "g1", "g2", "g3", "g4", "g5"].map((k) => `/images/people/avatars-${k}.jpg`);

/* Profile scenes: the interview moments with their timestamps (Phase 1 pfScenes). */
export const PF_SCENES = [
  ["02:14", "The reorganization call"], ["11:02", "Handing over the vendor review"], ["19:37", "The Friday rhythm"],
  ["24:50", "Managing up"], ["31:15", "Conflict with a peer"], ["41:03", "Closing reflection"],
] as const;

/* Linked accounts (Phase 1 SOCIAL; brand marks are their own artwork). */
export const SOCIAL = [
  { k: "linkedin", n: "LinkedIn", color: "#0A66C2", handle: "@maryamsss", linked: true, svg: '<svg viewBox="0 0 24 24" fill="currentColor"><g transform="translate(2 2) scale(0.83333)"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></g></svg>' },
  { k: "instagram", n: "Instagram", color: "#E4405F", handle: "@maryam.designs", linked: true, svg: '<svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="6" fill="currentColor"/><circle cx="12" cy="12" r="4" fill="none" stroke="#fff" stroke-width="1.8"/><circle cx="17.4" cy="6.6" r="1.3" fill="#fff"/></svg>' },
  { k: "facebook", n: "Facebook", color: "#1877F2", handle: "Maryam Naz", linked: false, svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>' },
  { k: "twitter", n: "X", color: "#000000", handle: "@maryamsss", linked: true, svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644z"/></svg>' },
  { k: "youtube", n: "YouTube", color: "#FF0000", handle: "@maryamnaz", linked: false, svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>' },
  { k: "tiktok", n: "TikTok", color: "#010101", handle: "@maryam.designs", linked: false, svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>' },
];

/* My Courses (Phase 1 MY_COURSES — authored placeholder progress there, §74). */
export const MY_COURSES = [
  { name: "Business Fundamentals", cover: "/images/covers/cohort-art-e3.webp", status: "Completed", done: 13, avg: 83, mins: 700, tasks: "12 of 13", tasksSub: "One overdue" },
  { name: "Business Leadership", cover: "/images/covers/cohort-art-e3.webp", status: "In progress", done: 6, avg: 78, mins: 330, tasks: "5 of 6", tasksSub: "on track" },
  { name: "Business Essentials", cover: "/images/covers/cohort-art-e1.webp", status: "Not started", done: 0, avg: 0, mins: 0, tasks: "0 of 0", tasksSub: "not started" },
];

/* Notifications. CUT (G8): "Weekly Call Reminders" (cohort calls) and the
   always-on "Your Cohort" row. */
export const EMAIL_TOGGLES = [
  ["Task Deadlines", "Receive a reminder on the morning a task is due."],
  ["Product and Course Updates", "Receive occasional product and course emails, no more than once a month."],
];
export const ALWAYS_ON = [
  ["Payments", "A payment is processed, fails, or is refunded."],
  ["Your Level", "Your report is ready, or your level is assigned or updated."],
  ["Your Booking", "An interview is confirmed, rescheduled, or cancelled."],
];

/* Legal notices (Phase 1 legalDoc), Version 3.2. Clauses about cut features
   are trimmed (cohort calls, the cohort leader, points, certificates).
   FLAG: legal copy needs legal review before launch either way. */
export const LEGAL: { key: string; title: string; short?: string; sections: [string, string][] }[] = [
  { key: "terms", title: "Terms of Service", sections: [
    ["1. Your Account", "You sign in through our identity provider and are responsible for keeping your credentials secure. Your sign-in email identifies your account and cannot be changed."],
    ["2. Using the Service", "Use TALENTnext for your own leadership development. Do not misuse the platform, access another person’s records without permission, or disrupt the service."],
    ["3. Payments", "Your first interview is complimentary. Subsequent interviews and course enrollments are charged at the prices shown before payment. Receipts are available under Payments."],
    ["4. Changes to These Terms", "We may update these terms. If a change is material, you’ll be asked to accept the updated terms at your next sign-in."],
  ] },
  { key: "privacy", title: "Privacy Notice", sections: [
    ["1. What We Collect", "Your profile, quiz results and band scores, interview recordings and reports, course progress, and payment records. Card details are handled by our payment processor, not stored by TALENTnext."],
    ["2. Why We Collect It", "We use your information to assess your level, recommend courses, support your learning journey, and maintain your progress records."],
    ["3. How Long We Keep It", "Interview recordings are retained for 24 months before deletion. Payment records are kept for seven years to meet accounting obligations. Other data is retained while your account remains active."],
    ["4. Your Rights", "You can review and update your profile, access your reports and transcripts, and close your account at any time through Privacy Settings."],
  ] },
  { key: "data", title: "Data Use Notice", short: "Your interviews are recorded and analysed to determine your level. TALENTnext assigns your level based on the evaluation, and that decision is final.", sections: [
    ["1. What We Record", "All interviews and re-interviews are recorded in video and audio and transcribed to support level assessment. Recordings are retained for 24 months before deletion."],
    ["2. Who Can Access Your Interview", "Your interviewing talent agent can access your interview information. Others cannot access your report unless you choose to share it."],
    ["3. How Your Level Is Determined", "A talent agent conducts your interview, and TALENTnext assigns your level based on the analysis. After each course, a re-interview determines whether you advance, maintain your level, or move down one level. This decision is final."],
    ["4. How We Protect Your Data", "We never sell your personal data or share your individual progress with an employer without your written instruction."],
    ["5. Managing Your Data", "You can close your account at any time through Privacy Settings. Deletion removes your profile, notes, and interview recordings."],
  ] },
  { key: "cookies", title: "Cookie Notice", sections: [
    ["1. Strictly Necessary Cookies", "These cookies keep you signed in and maintain your session. They are essential for the platform to function and cannot be disabled."],
    ["2. What We Don’t Use", "We don’t use advertising cookies or cross-site trackers, and we don’t sell tracking data to third parties."],
  ] },
];
export const LEGAL_META = "Version 3.2 · Effective September 15, 2026 · 4 min read";
