"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Chips, Chip } from "../ui/Chip";
import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { Page, PageHeader, Section, SectionHeader, Text } from "../primitives";
import { Facts, Fact, Stats, Stat } from "../ui/Figures";
import { Table, PersonCell, Status, RowMenu } from "../ui/Table";
import { Tabs } from "../ui/Tabs";
import { KV } from "../ui/KV";
import { Button } from "../ui/Button";
import { Accordion } from "../ui/Accordion";
import { PerfChart } from "../ui/PerfChart";
import { Disclosure } from "../ui/Disclosure";
import { Icon } from "../Icon";
import { SigCard } from "../candidate/Interviews";
import { Rich } from "../agent/Interviews";
import { rowActs, UserSheets, type SheetKey } from "./Users";
import { commit, useStore } from "@/lib/store";
import {
  RAW, USER_BY_ID, BOOKINGS, PAST_IVS, PAYOUTS, TXNS, userCand, userTrack, staffRoleName,
  userStatus, agRange, rangeLabel, face, money, agScore, toneOf, userByName, candidatePrice, type U,
} from "@/data/admin";
import p from "../candidate/profile.module.css";
import iv from "../candidate/interviews.module.css";
import a from "../agent/agent.module.css";
import s from "./admin.module.css";

/* ============================================================
   A PERSON'S RECORD — Phase 1 candidatesDetail / agentsDetail /
   staffDetailView, at /admin/users/all/<id>/. One menu per person (the
   same rows the All Users kebab draws). CUT (G8): the Cohorts panel, the
   "View as Cohort Leader" switch, Remove as Cohort Leader. CUT (G9): the
   Points fact and the completed course's certificate card.
   ============================================================ */
const LEVEL_NAME = (c: string) => ({ E: "Explorer", B: "Builder", T: "Trailblazer" } as Record<string, string>)[c?.[0]] + " – " + c;
const COVER = (lvl: string) => `/images/covers/cohort-art-${["e1", "e2", "e3"].includes(lvl) ? lvl : "e1"}.webp`;
const hash = (n: string) => { let h = 0; for (const ch of n) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h; };

export function PersonDetail({ id }: { id: string }) {
  useStore();
  const u = USER_BY_ID[id];
  const [sheet, setSheet] = useState<SheetKey>(null);
  if (!u) return null;
  const menu = <RowMenu items={rowActs(u, setSheet)} />;
  const body = u.internal ? <Staff u={u} menu={menu} /> : u.roles.includes("candidate") && userCand(u) ? <Candidate u={u} menu={menu} /> : <Agent u={u} menu={menu} />;
  return (
    <Page>
      <PageHeader back="/admin/users/all/" title={u.internal ? "User details" : u.roles.includes("candidate") && userCand(u) ? "Candidate details" : "Talent agent details"}
        desc={u.internal ? "The account, its role and its permissions." : u.roles.includes("candidate") && userCand(u) ? "The candidate's profile, interviews, courses and CV." : "The agent's profile, marketplace standing and interviews."} />
      {body}
      <UserSheets sheet={sheet} close={() => setSheet(null)} />
    </Page>
  );
}

function IdHead({ u, meta, menu, rate }: { u: U; meta: string; menu: React.ReactNode; rate?: number }) {
  const [t, l] = userStatus(u);
  return (
    <div className={p.idhead}>
      <span className={p.photo}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={face(u.name)} alt="" />
      </span>
      <span className={p.idB}>
        <span className={s.nameRow}>
          <Text role="sec" as="span">{u.name}</Text>
          <Icon name="verified" className={s.verify} />
          {rate !== undefined && <span className={s.score}><Icon name="star" />{rate}</span>}
        </span>
        <Text role="desc" as="span">{meta}</Text>
      </span>
      <span className={p.idAct}>{u.status !== "active" && u.status !== "ok" && <Status tone={t}>{l}</Status>}{menu}</span>
    </div>
  );
}

/* ---------------- Candidate ---------------- */
function Candidate({ u, menu }: { u: U; menu: React.ReactNode }) {
  const c = userCand(u);
  const pr = RAW.CAND_PROFILE[u.id] ?? (() => { const h = hash(u.name); return { role: RAW.CAND_ROLES[h % 6], industry: RAW.CAND_INDS[h % 5], years: `${3 + (h % 9)} years`, aspiration: RAW.CAND_ASP[h % 3] }; })();
  const letters = (c?.letters ?? []).join(", ");
  const ivs = BOOKINGS.filter((b) => b.cand === u.name);
  const pays = TXNS.filter((t) => t.who === u.name);
  const cv = RAW.CAND_CV;
  return (
    <>
      <Section kind="block">
        <IdHead u={u} menu={menu} meta={`${userTrack(u)} · ${c?.level ?? "—"} · ${u.email}`} />
      </Section>
      <Section kind="block">
        <Facts>
          <Fact icon="flag" label="Track" value={`${userTrack(u)} track`} />
          <Fact icon="growth" label="Current Level" value={c?.level ? `${LEVEL_NAME(c.level)}${letters ? ` (${letters})` : ""}` : "Not yet levelled"} />
          <Fact icon="book" label="Total courses taken" value={String(pr.courses ?? 0)} />
          <Fact icon="user" label="Current role" value={pr.role} />
          <Fact icon="skill" label="Industry" value={pr.industry} />
          <Fact icon="time" label="Years of experience" value={pr.years} />
          <Fact icon="flag" label="Aspiration" value={pr.aspiration} />
        </Facts>
      </Section>
      <Section>
        <SectionHeader title="Courses" />
        <Accordion items={RAW.CAND_COURSE_LIST.filter((x: { status: string }) => x.status !== "Not started").map((x: any) => ({
          title: x.name, sub: x.status,
          body: x.status === "Completed" ? (
            <Facts>
              <Fact icon="book" label="Chapters done" value={x.chapters} />
              <Fact icon="chart" label="Assessment average" value={x.avg} />
              <Fact icon="time" label="Time invested" value={x.time} />
              <Fact icon="flag" label="Tasks on time" value={x.tasks} />
            </Facts>
          ) : (
            <div className={s.crsProg}>
              <SectionHeader title="Performance" desc="Assessment average across 13 chapters." />
              <PerfChart scores={x.series} count={13} avg={x.cohort} avgLabel={`Course average ${x.cohort}%`} average={x.avg} insight={x.insight}
                names={RAW.COURSE_CH.map((ch: [string, number]) => ch[0])} />
              <SectionHeader title="Progress by chapter" />
              <div className={s.chList}>
                {RAW.COURSE_CH.map(([n, min]: [string, number], i: number) => {
                  const done = i < x.assessed;
                  return (
                    <div key={n} className={s.ch}>
                      <span className={s.chB}>
                        <Text role="h4" as="span">{n}</Text>
                        <Text role="desc" as="span">{done ? `${min} min · ${x.series[i]}% assessment` : i === x.assessed ? `In progress · ${min} min` : `Not started · ${min} min`}</Text>
                      </span>
                      <Icon name={done ? "checkFilled" : "circle"} className={done ? s.chDone : s.chTodo} />
                    </div>
                  );
                })}
              </div>
            </div>
          ),
          lead: (
            // eslint-disable-next-line @next/next/no-img-element
            <img className={s.crsThumb} src={COVER(x.lvl)} alt="" />
          ),
        }))} />
      </Section>
      <Section>
        <SectionHeader title="Interviews" />
        {ivs.length ? ivs.map((b) => (
          <div key={b.id} className={s.ivFound}>
            <Disclosure title={b.agent}>
              <Text role="desc" as="p">{b.kind} · {b.fee ? money(b.fee) : "Free"} · {b.slot}</Text>
              <div className={s.scenes}>
                {RAW.ADM_SCENE_SET.slice(0, 3).map(([t, at]: [string, string]) => (
                  <div key={t} className={iv.scene}>
                    <span className={iv.still} style={{ "--still": `url(${face(u.name)})` } as CSSProperties}>
                      <span className={iv.play}><Icon name="play" /></span>
                      <Text role="caption" as="span" className={`${iv.len} ${iv.lenScv}`}>{at}</Text>
                    </span>
                    <Text role="h4" as="span">{t}</Text>
                  </div>
                ))}
              </div>
            </Disclosure>
            <Link className={s.txLink} href={`/admin/interviews/recordings/${b.id}/`}>View Transcript</Link>
          </div>
        )) : <Text role="desc">No interviews yet.</Text>}
      </Section>
      <Section kind="block">
        <SectionHeader title="Payments" />
        <Table rows={pays} rowKey={(t) => t.id} cols={[
          { key: "d", label: "Date", cell: (t) => t.when },
          { key: "i", label: "Item", cell: (t) => t.kind },
          { key: "a", label: "Amount", cell: (t) => money(t.amt) },
          { key: "s", label: "Status", cell: (t) => { const m = RAW.TX_STATUS_META[t.status] ?? ["", t.status]; return <Status tone={toneOf(m[0] || "")}>{m[1]}</Status>; } },
        ]} />
      </Section>
      <Section>
        <SectionHeader title="Experience" />
        {cv.experience.map((e: Record<string, string>) => <CvRow key={e.role} t={`${e.role} · ${e.org}`} d={`${e.kind} · ${e.from} – ${e.to} · ${e.span}`} />)}
      </Section>
      <Section>
        <SectionHeader title="Education" />
        {cv.education.map((e: Record<string, string>) => <CvRow key={e.school} art={`/images/logos/pf-art-${e.art}.jpg`} t={e.school} d={`${e.from} – ${e.to}`} />)}
      </Section>
      <Section>
        <SectionHeader title="Licenses & certifications" />
        {cv.certs.map((e: Record<string, string>) => <CvRow key={e.name} art={`/images/logos/pf-art-${e.art}.webp`} t={e.name} d={`${e.org} · issued ${e.issued}`} x={e.cred} />)}
      </Section>
      <Section>
        <SectionHeader title="Skills" />
        <Chips>{cv.skills.map((k: string) => <Chip key={k}>{k}</Chip>)}</Chips>
      </Section>
      <Section kind="block">
        <SectionHeader title="Linked accounts" />
        <div className={p.lacc}>
          {RAW.SOCIAL_ADM.filter((x: { k: string }) => RAW.CAND_LINKED[x.k]).map((x: Record<string, string>) => (
            <div key={x.k} className={p.la} style={{ "--brand": x.color } as CSSProperties}>
              <span className={p.laMk} dangerouslySetInnerHTML={{ __html: x.svg }} />
              <span className={p.laB}><Text role="h4" as="span">{x.n}</Text><Text role="desc" as="span">{x.handle}</Text></span>
              <Text role="label" as="span" ink="primary">Linked</Text>
            </div>
          ))}
        </div>
      </Section>
      <Quiz first={u.name.split(" ")[0]} />
    </>
  );
}

const CvRow = ({ t, d, x, art }: { t: string; d: string; x?: string; art?: string }) => (
  <div className={p.cvRow}>
    {art && <span className={p.cvArt} style={{ "--art": `url(${art})` } as CSSProperties} />}
    <span className={p.cvB}><Text role="h4" as="span">{t}</Text><Text role="desc" as="span">{d}</Text>{x && <Text role="desc" as="span">{x}</Text>}</span>
  </div>
);

/* Quiz results: the strongest and weakest bands, then the two lists (no chart). */
export function Quiz({ first }: { first: string }) {
  const sc: [string, number][] = RAW.ADM_SCORES;
  const hi = [...sc].sort((x, y) => y[1] - x[1])[0], lo = [...sc].sort((x, y) => x[1] - y[1])[0];
  return (
    <Section>
      <SectionHeader title="Quiz results" desc="How the levelling quiz scored this candidate across the five bands." />
      <div className={s.quiz}>
        <Text role="body" as="p"><b>{hi[0]}</b> at {hi[1]} is {first}’s strongest band, {lo[0].toLowerCase()} at {lo[1]} the weakest. An agent pushes hardest on the two lowest, and both are honest starting points.</Text>
        <div className={s.quizG}>
          <div><Text role="h4" as="span" className={s.qzOk}>What they do well</Text><ol>{RAW.ADM_QZ_STR.map((x: string) => <li key={x}><Text role="compact" as="span">{x}</Text></li>)}</ol></div>
          <div><Text role="h4" as="span" className={s.acc}>Where they lose ground</Text><ol>{RAW.ADM_QZ_DEV.map((x: string) => <li key={x}><Text role="compact" as="span">{x}</Text></li>)}</ol></div>
        </div>
      </div>
    </Section>
  );
}

/* ---------------- Talent agent ---------------- */
/* No "Payouts to release" here: payouts are released outside the platform, through
   QuickBooks / FAS, so the admin never releases one (Maryam's senior, 19 Oct 2026).
   Every section on the talent-agent detail closes with a divider (Maryam 19 Oct 2026), so
   its table sections are text sections, like the agent's Earnings page. The identity head
   and the figure blocks row stay blocks: no line after the blocks (Maryam 19 Oct 2026). */
function Agent({ u, menu }: { u: U; menu: React.ReactNode }) {
  const pays = PAYOUTS.filter((x) => x.agent === u.name);
  const held = pays.filter((x) => x.status === "held");
  const paid = pays.filter((x) => x.status === "settled").reduce((n, x) => n + x.net, 0);
  const upcoming = BOOKINGS.filter((b) => b.agent === u.name);
  const past = PAST_IVS.filter((x) => x.agent === u.name);
  /* The agent is paid for every interview, first included: the first is free to the
     candidate only, so this page always shows the agent's fee, never "Free". */
  const fee = (f: number) => money(f || u.fee || 0);
  const kind = (k: string) => (/re-?interview/i.test(k) ? "Re-interview" : "First Interview");
  return (
    <>
      <Section kind="block">
        <IdHead u={u} menu={menu} rate={u.rating} meta={[u.job, u.email].filter(Boolean).join(" · ")} />
      </Section>
      <Section kind="block">
        <Stats>
          <Stat icon="wallet" label="Total earnings" value={money((u.interviewed || 0) * (u.fee || 0))} desc="Fees paid in full" />
          <Stat icon="video" label="Interviewed" value={String(u.interviewed || 0)} desc="sessions conducted" />
          <Stat icon="creditCard" label="Talent agent fee" value={u.fee ? money(u.fee) : "—"} desc={u.fee ? `Candidates pay ${money(candidatePrice(u))}` : "Not set"} />
          <Stat icon="growth" label="Assessment range" value={rangeLabel(agRange(u))} desc={`Agent Score ${agScore(u)?.toFixed(1) ?? "—"}`} />
        </Stats>
      </Section>
      <Section>
        <SectionHeader title="Upcoming interviews" desc="On this agent’s diary. Open one for the candidate and fee." />
        <Table rows={upcoming} rowKey={(b) => b.id} href={(b) => `/admin/users/all/${u.id}/${b.id}/`} cols={[
          { key: "c", label: "Candidate", cell: (b) => <PersonCell name={b.cand} img={face(b.cand)} /> },
          { key: "t", label: "Type", cell: (b) => kind(b.kind) },
          { key: "f", label: "Fee", cell: (b) => fee(b.fee) },
          { key: "w", label: "When", cell: (b) => b.slot },
          { key: "s", label: "Status", cell: () => <Status tone="green">Active</Status> },
        ]} />
      </Section>
      <Section>
        <SectionHeader title="Past interviews" desc="Completed interviews. Open one for the transcript, evaluations and the candidate’s review." />
        <Table rows={past} rowKey={(x) => x.id} href={(x) => `/admin/users/all/${u.id}/${x.id}/`} cols={[
          { key: "c", label: "Candidate", cell: (x) => <PersonCell name={x.cand} img={face(x.cand)} /> },
          { key: "t", label: "Type", cell: (x) => kind(x.kind) },
          { key: "f", label: "Fee", cell: (x) => fee(x.fee) },
          { key: "w", label: "When", cell: (x) => x.when },
          { key: "r", label: "Candidate rating", cell: (x) => <span className={s.score}><Icon name="star" />{x.rating}</span> },
        ]} />
      </Section>
      <Section>
        <SectionHeader title="Recommendations sent" desc="The recommendations this agent has sent: the level they proposed and the candidate’s rating." />
        <Table rows={past} rowKey={(x) => x.id} href={(x) => `/admin/users/all/${u.id}/${x.id}/`} cols={[
          { key: "c", label: "Candidate", cell: (x) => <PersonCell name={x.cand} img={face(x.cand)} /> },
          { key: "l", label: "Recommended level", cell: (x) => x.agentLevel },
          { key: "f", label: "Sent", cell: (x) => x.submitted },
          { key: "r", label: "Candidate rating", cell: (x) => <span className={s.score}><Icon name="star" />{x.rating}</span> },
        ]} />
      </Section>
      <Section>
        <SectionHeader title="Earnings" desc="Funds held, payouts to date, and the destination they settle to." />
        <Stats>
          <Stat icon="locked" label="Funds held" value={money(held.reduce((n, x) => n + x.net, 0))} desc="awaiting release" />
          <Stat icon="verified" label="Paid to date" value={money(paid)} desc="net, released" />
          <Stat icon="calendar" label="Next payout" value={money(held.reduce((n, x) => n + x.net, 0))} desc="Payable on the next run" />
          <Stat icon="wallet" label="Payout destination" value={u.payoutMethod ? "On file" : "Missing"} desc={u.payoutMethod || "No destination"} />
        </Stats>
      </Section>
    </>
  );
}

/* ---------------- Internal staff ---------------- */
function Staff({ u, menu }: { u: U; menu: React.ReactNode }) {
  const [t, l] = userStatus(u);
  const perms = (RAW.PERM_ROWS_FLAT as string[] | undefined) ?? ["Take Quiz / Interview", "Set Interview Fee", "Conduct Interviews", "Assign Candidate Level", "Candidate Database", "View AI Raw Scores", "Manage Payouts", "Manage Users & Roles", "Configure Fees & Payouts", "System Settings & Overrides", "Delete Account", "Export Data", "Audit Log: View"];
  const acts = (RAW.AUDIT as Record<string, string>[]).filter((x) => x.who === u.name && !/cohort/i.test(x.act + x.obj));
  return (
    <>
      <Section>
        <SectionHeader title={u.name} desc={u.email} actions={menu} />
        <KV rows={[
          ["Role", staffRoleName(u)], ["Status", <Status key="s" tone={t}>{l}</Status>], ["Job title", u.job || "—"], ["Department", u.dept || "—"],
          ["Phone", u.phone || "—"], ["Added", u.joined], ["Invited by", u.invitedBy || "You"], ["Last signed in", u.last || "Never"],
        ]} />
      </Section>
      <Section>
        <SectionHeader title={`What a ${staffRoleName(u)} can do`} desc="The permissions this role carries. Change them in the Roles module, not here." />
        <Chips>{perms.map((k) => <Chip key={k}>{k}</Chip>)}</Chips>
      </Section>
      <Section>
        <SectionHeader title="Recent activity" />
        {acts.length ? acts.map((x, i) => (
          <div key={i} className={s.act}>
            <span className={s.actAv}>{u.name.split(" ").map((w: string) => w[0]).join("")}</span>
            <span className={s.actB}><Text role="h4" as="span">{u.name}</Text><Text role="desc" as="span">{x.act} · {x.obj}</Text></span>
            <Text role="caption" as="span">{x.when}</Text>
          </div>
        )) : <Text role="desc">No recent activity.</Text>}
      </Section>
    </>
  );
}

/* ============================================================
   AN AGENT'S INTERVIEW — Phase 1 agentsInterview: a past one has two tabs
   (About Interview · Transcript); an upcoming booking shows its facts,
   the candidate's quiz and what they want to talk about.
   ============================================================ */
export function AgentInterviewDetail({ agentId, id }: { agentId: string; id: string }) {
  const [tab, setTab] = useState("about");
  const x = PAST_IVS.find((v) => v.id === id);
  const b = BOOKINGS.find((v) => v.id === id);
  const back = `/admin/users/all/${agentId}/`;
  if (b) {
    const first = b.cand.split(" ")[0];
    return (
      <Page>
        <PageHeader back={back} title={`Interview with ${b.cand}`} desc={`${b.agent} · ${/re-?interview/i.test(b.kind) ? "Re-interview" : "First Interview"} · ${b.slot}`} />
        <UpcomingBody b={b} />
      </Page>
    );
  }
  if (!x) return null;
  const first = x.cand.split(" ")[0], agentFirst = x.agent.split(" ")[0];
  return (
    <Page>
      <PageHeader back={back} title={`Interview with ${x.cand}`} desc={`${x.agent} · First Interview · ${x.when}`} />
      <Section kind="tabs"><Tabs value={tab} onChange={setTab} items={[{ key: "about", label: "About Interview" }, { key: "transcript", label: "Transcript" }]} /></Section>
      {tab === "about" ? (
        <>
          <Section kind="block">
            <Facts>
              <Fact icon="user" label="Candidate" value={x.cand} />
              <Fact icon="wallet" label="Interview fee" value={agentFee(x.fee, x.agent)} />
              <Fact icon="starOutline" label="Candidate rating" value={<span className={s.score}><Icon name="star" />{x.rating}</span>} />
              <Fact icon="calendar" label="When" value={x.when} />
            </Facts>
          </Section>
          <RecSection cand={x.cand} agent={x.agent} />
          <TalEval x={x} />
          <AgentEval x={x} />
          <Section>
            <SectionHeader title="Candidate’s rating and review" desc={`What ${first} said about this interview.`} />
            <span className={s.stars5}>{[1, 2, 3, 4, 5].map((n) => <Icon key={n} name={n <= x.rating ? "star" : "starOutline"} />)}</span>
            <Text role="body" as="p" ink="secondary">“{x.review}”</Text>
          </Section>
        </>
      ) : (
        <Transcript cand={x.cand} />
      )}
    </Page>
  );
}

/* The interview transcript (Phase 1 .tx-*, TX_LINES_ADM). */
export function Transcript({ cand }: { cand: string }) {
  const [f, setF] = useState("all");
  const [q, setQ] = useState("");
  const lines: [string, string, string, string, boolean][] = RAW.TX_LINES_ADM ?? TX_FALLBACK;
  const first = cand.split(" ")[0];
  const shown = lines.filter(([, , t, tag, sc]) => (f === "all" || (f === "scene" ? sc : tag === f)) && (!q || t.toLowerCase().includes(q.toLowerCase())));
  return (
    <Section>
      <label className={a.txSrch}><Icon name="search" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a word in the transcript" aria-label="Find a word in the transcript" /></label>
      <div className={a.txFilters}>
        {(RAW.TX_TAGS_ADM as [string, string][]).map(([k, l]) => (
          <button key={k} type="button" className={`${a.txF} ${f === k ? a.on : ""} t-caption`} aria-pressed={f === k} onClick={() => setF(k)}>{l}</button>
        ))}
      </div>
      {shown.map(([t, who, text, , sc]) => (
        <div key={t} className={`${a.txLine} ${who === "agent" ? a.me : ""}`}>
          <Text role="caption" as="span">{t}</Text>
          <div className={a.txB}>
            <Text role="label" as="span" strong className={a.txW}>{who === "agent" ? "Agent" : first}{sc && <span className={`${a.txScene} t-caption`}><Icon name="video" />Marked scene</span>}</Text>
            <Text role="body" as="p">{text}</Text>
          </div>
        </div>
      ))}
    </Section>
  );
}
const TX_FALLBACK: [string, string, string, string, boolean][] = [
  ["00:42", "agent", "Before we start, nothing here is a test you can fail. Tell me about a handover you planned rather than announced.", "", false],
];
/* What the agent is paid for an interview. The first interview is free to the candidate
   only; the agent still earns their fee, so the agent's pages never read "Free". */
const agentFee = (f: number | undefined, agent: string) => money(f || userByName(agent)?.fee || 0);
export const personLink = (name: string) => { const u = userByName(name); return u ? `/admin/users/all/${u.id}/` : undefined; };

/* An upcoming interview (Phase 1 upcomingInterviewBody): the four facts, the
   candidate's quiz and what they want to talk about. */
export function UpcomingBody({ b }: { b: any }) {
  const first = b.cand.split(" ")[0];
  return (
    <>
      <Section kind="block">
        <Facts>
          <Fact icon="user" label="Candidate" value={b.cand} />
          <Fact icon="wallet" label="Interview fee" value={agentFee(b.fee, b.agent)} />
          <Fact icon="video" label="Type" value={/re-?interview/i.test(b.kind) ? "Re-interview" : "First Interview"} />
          <Fact icon="calendar" label="When" value={b.slot} />
        </Facts>
      </Section>
      <Quiz first={first} />
      <Section>
        <SectionHeader title={`What ${first} wants to talk about`} />
        <Text role="body" as="p" className={s.quote}><span>“</span>{RAW.IV_TOPICS[hash(b.cand) % RAW.IV_TOPICS.length]}<span>”</span></Text>
      </Section>
    </>
  );
}

/* The compact recording card (Phase 1 .iv-rec) in a headed section. */
export function RecCard({ cand, len = "48:00", href }: { cand: string; len?: string; href?: string }) {
  const inner = (
    <>
      <span className={a.recThumb} />
      <span className={a.recB}><Text role="body" as="span">Interview with {cand}.mp4</Text><Text role="desc" as="span">Video recording · {len}</Text></span>
      <span className={a.recOpen}><Icon name="play" /></span>
    </>
  );
  return href ? <Link href={href} className={a.rec}>{inner}</Link> : <span className={a.rec}>{inner}</span>;
}
export function RecSection({ cand, agent, len = "48:00", title = "Interview recording", desc }: { cand: string; agent: string; len?: string; title?: string; desc?: string }) {
  const bk = BOOKINGS.find((b) => b.cand === cand && b.recExists && !b.recDeleted) ?? BOOKINGS[0];
  return (
    <Section>
      <SectionHeader title={title} desc={desc ?? `The recorded ${parseInt(len)} minutes interview of ${cand} with ${agent}.`} />
      <RecCard cand={cand} len={len} href={`/admin/interviews/recordings/${bk.id}/`} />
    </Section>
  );
}

/* Tal's Evaluation (Phase 1 .tal-eval) — kept on the admin per the plan. */
export function TalEval({ x, kv }: { x: any; kv?: boolean }) {
  const first = x.cand.split(" ")[0];
  return (
    <Section>
      <SectionHeader title="Tal’s Evaluation" desc="What Tal read from the interview." />
      <div className={a.talEval}><Rich html={x.tal} /></div>
      {x.talType && <div className={a.talEval}><Text role="body" as="p" ink="secondary">Tal reads {first} as a <b>{x.talType}</b>.</Text></div>}
      {kv && <KV rows={[["Suggested level", x.talLevel], ["Acronyms", (x.talLetters || []).join(", ")]]} />}
    </Section>
  );
}

/* The agent's evaluation: suggested level, acronyms, strengths, growth, note. */
export function AgentEval({ x }: { x: any }) {
  const agentFirst = (x.agent || x.proposedBy || "").split(" ")[0];
  const agent = x.agent || x.proposedBy;
  return (
    <Section>
      <SectionHeader title={`${agent}’s evaluation`} desc="What the agent recorded after the interview." />
      <KV rows={[["Suggested level", x.agentLevel], ["Acronyms", (x.agentLetters || []).join(", ")]]} />
      <div className={s.sig}>
        <SigCard tone="green" icon="growth" title="Strengths" tag="Strong" text={x.strengths} />
        <SigCard tone="violet" icon="flag" title="Growth areas" tag="Focus" text={x.growth} />
      </div>
      <SigCard tone="green" icon="comment" title={`${agentFirst}’s note`} text={`“${x.note}”`} />
    </Section>
  );
}
