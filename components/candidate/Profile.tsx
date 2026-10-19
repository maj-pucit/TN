"use client";
import { Chips, Chip } from "../ui/Chip";
import { useRef, useState, type CSSProperties } from "react";
import { Page, PageHeader, Section, SectionHeader, Stack, Text } from "../primitives";
import { Tabs } from "../ui/Tabs";
import { Button } from "../ui/Button";
import { Facts, Fact, Stats, Stat } from "../ui/Figures";
import { Field, Input, TextArea, Form, FormRow } from "../ui/Field";
import { Dropdown } from "../ui/Dropdown";
import { Accordion } from "../ui/Accordion";
import { ToggleRow } from "../ui/Toggle";
import { Modal } from "../ui/Modal";
import { Confirm } from "../ui/Confirm";
import { Icon } from "../Icon";
import { useDemo } from "@/lib/demo";
import { PF, INTENTS, EMPLOYMENT, AVATARS, PF_SCENES, SOCIAL, MY_COURSES, EMAIL_TOGGLES, ALWAYS_ON } from "@/data/profile";
import { levelCard } from "@/data/level";
import { SCENE_STILL } from "@/data/interviews";
import { PEOPLE } from "@/data/seed";
import { ShareMenu } from "./Interviews";
import s from "./profile.module.css";
import t from "./interviews.module.css";

/* ============================================================
   /candidate/profile/ — Phase 1 V.account, five tabs: My Profile ·
   Linked Accounts · My Courses · Notifications · Privacy Settings.
   CUT: "Volunteer to lead a Cohort" (G8), the rank chip and Points (G9),
   "Ask Tal" under the scenes (G2), the cohort notification rows (G8).
   Edits are in place (a prototype: Save keeps the change for the session).
   ============================================================ */
const TABS = [
  { key: "me", label: "My Profile", count: "4/5" }, { key: "linked", label: "Linked Accounts" }, { key: "courses", label: "My Courses" },
  { key: "priv", label: "Privacy Settings" }, /* Notifications tab removed (Maryam 16 Oct 2026) */
];

export function ProfilePage() {
  const [tab, setTab] = useState("me");
  return (
    <Page>
      <PageHeader title="Profile" desc="Your details, linked accounts, courses and privacy settings." />
      <Section kind="tabs"><Tabs value={tab} onChange={setTab} items={TABS} /></Section>
      {tab === "me" && <MyProfile />}
      {tab === "linked" && <Linked />}
      {tab === "courses" && <Courses />}
      {tab === "priv" && <Privacy />}
    </Page>
  );
}

/* ---------------- My Profile ---------------- */
function MyProfile() {
  const { stage, setUi } = useDemo();
  const [g, setG] = useState(PF.general);
  const [edit, setEdit] = useState<null | "general" | "work" | "edu" | "cert" | "skill">(null);
  const [photo, setPhoto] = useState(PEOPLE.maryam.img);
  const [photoOpen, setPhotoOpen] = useState(false);
  const lc = levelCard(stage);
  const track = "Explorer track";
  const level = lc.kind === "level" ? lc.level : "Not set yet";
  /* Phase 1 counts COMPLETED courses only: one once the 90 days are done. */
  const courses = stage === "day90" || stage === "promoted" ? 1 : 0;
  const editActs = (onSave?: () => void) => (
    <Stack row gap={3}>
      <Button kind="secondary" icon="delete" onClick={() => setEdit(null)}>Discard Changes</Button>
      <Button kind="primary" icon="check" onClick={() => { onSave?.(); setEdit(null); }}>Save Changes</Button>
    </Stack>
  );
  const pen = (k: typeof edit, label: string) => <Button kind="ghost" icon="edit" size="sm" onClick={() => setEdit(k)}>{label}</Button>;
  /* A CV section's heading carries icon-only controls (Phase 1, 4 Sep 2026): Add (where the
     section takes entries) to the left of Edit. Both open the section's form. */
  const icons = (k: typeof edit, edit_: string, add?: string) => (
    <Stack row gap={3}>
      {add && <Button kind="ghost" size="sm" icon="add" label={add} onClick={() => setEdit(k)} />}
      <Button kind="ghost" size="sm" icon="edit" label={edit_} onClick={() => setEdit(k)} />
    </Stack>
  );

  return (
    <>
      <Section kind="block">
        <div className={s.idhead}>
          <span className={s.photo}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo} alt="" />
            {edit === "general" && <button className={s.pencil} aria-label="Change photo" onClick={() => setPhotoOpen(true)}><Icon name="edit" /></button>}
          </span>
          <span className={s.idB}>
            <Text role="h2" as="span">{g.name}</Text>
            <Text role="desc" as="span">{g.nickname}</Text>
          </span>
          <span className={s.idAct}>{edit === "general" ? editActs() : pen("general", "Edit Details")}</span>
        </div>
      </Section>

      {edit === "general" ? (
        <Section kind="block"><GeneralForm g={g} onChange={setG} /></Section>
      ) : (
        <Section kind="block">
          <Facts>
            <Fact icon="flag" label="My track" value={track} />
            <Fact icon="growth" label="My level" value={level} />
            <Fact icon="book" label="Total courses taken" value={String(courses)} />
            <Fact icon="user" label="Current role" value={g.role} />
            <Fact icon="skill" label="Industry" value={g.industry} />
            <Fact icon="time" label="Years of experience" value={g.years} />
            <Fact icon="flag" label="Aspiration" value={g.intent} />
          </Facts>
        </Section>
      )}

      <Section>
        <SectionHeader title="About Me" />
        <Text role="body" ink="secondary">{g.about}</Text>
      </Section>

      <ScenesCarousel />

      <CvSection title="Experience" editing={edit === "work"} acts={editActs()} pen={icons("work", "Edit Experience", "Add a role")}
        view={PF.experience.map((e) => <CvRow key={e.role} icon="work" title={`${e.role} · ${e.org}`} sub={`${e.kind} · ${e.from} – ${e.to} · ${e.span}`} />)}
        form={PF.experience.map((e) => (
          <div key={e.role} className={s.entry}>
            <div className={s.entryH}><Button kind="link" size="sm" icon="delete">Remove</Button></div>
            <Form>
              <FormRow>
                <Field label="Title"><Input defaultValue={e.role} /></Field>
                <Field label="Company"><Input defaultValue={e.org} /></Field>
              </FormRow>
              <div className={s.g3}>
                <Field label="Employment type"><DdField value={e.kind} options={EMPLOYMENT} /></Field>
                <Field label="Start"><Input defaultValue={e.from} /></Field>
                <Field label="End"><Input defaultValue={e.to} /></Field>
              </div>
            </Form>
          </div>
        ))} />

      <CvSection title="Education" editing={edit === "edu"} acts={editActs()} pen={icons("edu", "Edit Education", "Add a school")}
        view={PF.education.map((e) => <CvRow key={e.school} art={e.art} title={e.school} sub={`${e.from} – ${e.to}`} />)}
        form={PF.education.map((e) => (
          <div key={e.school} className={s.entry}>
            <div className={s.entryH}><Button kind="link" size="sm" icon="delete">Remove</Button></div>
            <Form>
              <Field label="School"><Input defaultValue={e.school} /></Field>
              <FormRow>
                <Field label="Degree"><Input placeholder="BS" defaultValue={e.degree} /></Field>
                <Field label="Field of study"><Input placeholder="Computer Science" defaultValue={e.field} /></Field>
              </FormRow>
              <FormRow>
                <Field label="Start year"><Input defaultValue={e.from} /></Field>
                <Field label="End year"><Input defaultValue={e.to} /></Field>
              </FormRow>
            </Form>
          </div>
        ))} />

      <CvSection title="Licenses & certifications" editing={edit === "cert"} acts={editActs()} pen={icons("cert", "Edit Licenses & Certifications", "Add a certification")}
        view={PF.certs.map((c) => <CvRow key={c.name} art={c.art} title={c.name} sub={`${c.org} · issued ${c.issued}`} sub2={c.cred} />)}
        form={PF.certs.map((c) => (
          <div key={c.name} className={s.entry}>
            <div className={s.entryH}><Button kind="link" size="sm" icon="delete">Remove</Button></div>
            <Form>
              <FormRow>
                <Field label="Name"><Input defaultValue={c.name} /></Field>
                <Field label="Issuing organisation"><Input defaultValue={c.org} /></Field>
              </FormRow>
              <FormRow>
                <Field label="Issue date"><Input defaultValue={c.issued} /></Field>
                <Field label="Credential"><Input placeholder="What the credential is in" defaultValue={c.cred} /></Field>
              </FormRow>
            </Form>
          </div>
        ))} />

      <Skills editing={edit === "skill"} acts={editActs()} pen={icons("skill", "Edit Skills")} />

      <Section kind="block">
        <Button kind="secondary" icon="logout" onClick={() => setUi({ logout: true })}>Log Out</Button>
      </Section>

      {photoOpen && <PhotoSheet current={photo} onClose={() => setPhotoOpen(false)} onSave={(p) => { setPhoto(p); setPhotoOpen(false); }} />}
    </>
  );
}

function GeneralForm({ g, onChange }: { g: typeof PF.general; onChange: (g: typeof PF.general) => void }) {
  const set = (k: keyof typeof PF.general) => (e: { target: { value: string } }) => onChange({ ...g, [k]: e.target.value });
  return (
    <Form>
      <div className={s.g3}>
        <Field label="Name"><Input value={g.name} onChange={set("name")} /></Field>
        <Field label="Nickname"><Input value={g.nickname} placeholder="A short name others can call you" onChange={set("nickname")} /></Field>
        <Field label="Email"><Input value={g.email} readOnly /></Field>
      </div>
      <div className={s.g3}>
        <Field label="Current role"><Input value={g.role} placeholder="e.g. Operations Lead — or Student" onChange={set("role")} /></Field>
        <Field label="Industry"><Input value={g.industry} placeholder="e.g. Software" onChange={set("industry")} /></Field>
        <Field label="Years of experience"><Input value={g.years} placeholder="e.g. 5 years" onChange={set("years")} /></Field>
      </div>
      <Field label="Intent aspiration">
        <Dropdown variant="form" value={g.intent} onChange={(v) => onChange({ ...g, intent: v })} options={INTENTS.map((i) => ({ value: i, label: i }))} />
      </Field>
      <Field label="About"><TextArea value={g.about} placeholder="Two or three sentences on what you do and what you are good at." onChange={set("about")} /></Field>
    </Form>
  );
}

function DdField({ value, options }: { value: string; options: string[] }) {
  const [v, setV] = useState(value);
  return <Dropdown variant="form" value={v} onChange={setV} options={options.map((o) => ({ value: o, label: o }))} />;
}

/* The Profile's "Interview scenes" (Phase 1 .scv-row): a carousel of 240px cards, each a
   3:4 still with a play disc, the time and a share disc (top right), the title and the
   agent; the heading carries the previous / next arrows, which scroll the row. */
function ScenesCarousel() {
  const row = useRef<HTMLDivElement>(null);
  const go = (dir: number) => row.current?.scrollBy({ left: dir * row.current.clientWidth * 0.8, behavior: "smooth" });
  return (
    <Section kind="block">
      <SectionHeader title="Interview scenes" actions={
        <Stack row gap={3}>
          <button className={s.scvCh} aria-label="Previous scenes" onClick={() => go(-1)}><Icon name="chevLeft" /></button>
          <button className={s.scvCh} aria-label="Next scenes" onClick={() => go(1)}><Icon name="chevRight" /></button>
        </Stack>
      } />
      <div className={s.scvRow} ref={row}>
        {PF_SCENES.map(([at, title]) => (
          <div key={title} className={s.scv}>
            <span className={s.scvArt}>
              <span className={`${t.still} ${s.scvStill}`} style={{ "--still": `url(${SCENE_STILL})` } as CSSProperties}>
                <span className={t.play}><Icon name="play" /></span>
                <Text role="caption" as="span" className={`${t.len} ${t.lenScv}`}>{at}</Text>
              </span>
              <ShareMenu />
            </span>
            <Text role="h4" as="span">{title}</Text>
            <span className={s.att}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={PEOPLE.priya.img} alt="" />
              <Text role="caption" as="span">Talent Agent: Priya Nair</Text>
            </span>
          </div>
        ))}
      </div>
    </Section>
  );
}

function CvSection({ title, editing, acts, pen, view, form }: {
  title: string; editing: boolean; acts: React.ReactNode; pen: React.ReactNode; view: React.ReactNode; form: React.ReactNode;
}) {
  return (
    <Section>
      <SectionHeader title={title} actions={editing ? acts : pen} />
      {editing ? <div>{form}</div> : <div className={s.cv}>{view}</div>}
    </Section>
  );
}

function CvRow({ icon, art, title, sub, sub2 }: { icon?: "work"; art?: string; title: string; sub: string; sub2?: string }) {
  return (
    <div className={s.cvRow}>
      <span className={s.cvArt} style={art ? ({ "--art": `url(${art})` } as CSSProperties) : undefined}>{icon && <Icon name={icon} />}</span>
      <span className={s.cvB}>
        <Text role="h4" as="span">{title}</Text>
        <Text role="desc" as="span">{sub}</Text>
        {sub2 && <Text role="desc" as="span">{sub2}</Text>}
      </span>
    </div>
  );
}

function Skills({ editing, acts, pen }: { editing: boolean; acts: React.ReactNode; pen: React.ReactNode }) {
  const [list, setList] = useState(PF.skills);
  const [adding, setAdding] = useState("");
  return (
    <Section>
      <SectionHeader title="Skills" actions={editing ? acts : pen} />
      <Chips>
        {list.map((k) => (
          <Chip key={k}>
            {k}
            {editing && <button aria-label={`Remove ${k}`} onClick={() => setList((l) => l.filter((x) => x !== k))}><Icon name="close" /></button>}
          </Chip>
        ))}
      </Chips>
      {editing && (
        <Stack row gap={3}>
          <Input value={adding} placeholder="Add a skill" onChange={(e) => setAdding(e.target.value)} />
          <Button kind="link" icon="add" onClick={() => { if (adding.trim()) { setList((l) => [...l, adding.trim()]); setAdding(""); } }}>Add</Button>
        </Stack>
      )}
    </Section>
  );
}

/* The photo picker: Profile Image (upload / remove) and Avatar (ten discs). */
function PhotoSheet({ current, onClose, onSave }: { current: string; onClose: () => void; onSave: (p: string) => void }) {
  const [tab, setTab] = useState("img");
  const [img, setImg] = useState<string | null>(current);
  const [av, setAv] = useState(AVATARS[0]);
  const file = useRef<HTMLInputElement>(null);
  return (
    <Modal label="Change photo" onClose={onClose} footer={<>
      <Button kind="secondary" onClick={onClose}>Cancel</Button>
      <Button kind="primary" onClick={() => onSave(tab === "img" ? (img ?? current) : av)}>{tab === "img" ? "Update Photo" : "Update Avatar"}</Button>
    </>}>
      <Tabs value={tab} onChange={setTab} items={[{ key: "img", label: "Profile Image" }, { key: "av", label: "Avatar" }]} />
      <div className={s.pick}>
        {tab === "img" ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {img ? <img className={s.big} src={img} alt="" /> : <span className={s.bigEmpty}><Icon name="image" /></span>}
            <Stack row gap={3}>
              <input ref={file} className={s.upload} type="file" accept="image/*" aria-label="Upload a photo"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) setImg(URL.createObjectURL(f)); }} />
              <Button kind="ghost" icon="upload" onClick={() => file.current?.click()}>Upload</Button>
              <Button kind="ghost" icon="close" onClick={() => setImg(null)}>Remove</Button>
            </Stack>
          </>
        ) : (
          <div className={s.avs}>
            {AVATARS.map((a) => (
              <button key={a} className={`${s.av} ${a === av ? s.on : ""}`} aria-pressed={a === av} onClick={() => setAv(a)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a} alt="" />
              </button>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}

/* ---------------- Linked Accounts ---------------- */
function Linked() {
  const [on, setOn] = useState<Record<string, boolean>>(Object.fromEntries(SOCIAL.map((x) => [x.k, x.linked])));
  return (
    <Section kind="block">
      <SectionHeader title="Linked accounts" desc="Connect your social accounts to display them on your TALENTnext profile. Select an account to connect or disconnect it." />
      <div className={s.lacc}>
        {SOCIAL.map((x) => (
          <button key={x.k} className={s.la} style={{ "--brand": x.color } as CSSProperties} onClick={() => setOn((o) => ({ ...o, [x.k]: !o[x.k] }))}>
            <span className={s.laMk} dangerouslySetInnerHTML={{ __html: x.svg }} />
            <span className={s.laB}>
              <Text role="h4" as="span">{x.n}</Text>
              <Text role="desc" as="span">{on[x.k] ? x.handle : "Not connected"}</Text>
            </span>
            {on[x.k] ? <Text role="label" as="span" className={s.linked}>Linked</Text> : <Text role="label" as="span" ink="accent">Link account</Text>}
          </button>
        ))}
      </div>
    </Section>
  );
}

/* ---------------- My Courses ---------------- */
function Courses() {
  return (
    <Section>
      <SectionHeader title="My courses" />
      {/* The course figures run the full column (Maryam 16 Oct 2026). */}
      <Accordion full items={MY_COURSES.map((c) => ({
        title: c.name, sub: c.status,
        body: (
          <Stats>
            <Stat icon="book" label="Chapters done" value={String(c.done)} of="of 13" desc={`${Math.round((c.done / 13) * 100)}%`} />
            <Stat icon="chart" label="Assessment average" value={c.avg ? `${c.avg}%` : "Not yet"} desc={c.avg ? "Course average 79%" : "Nothing assessed yet"} />
            <Stat icon="time" label="Time invested" value={`${Math.floor(c.mins / 60)}h ${c.mins % 60}m`} desc={c.done ? `${Math.round(c.mins / c.done)} min per chapter` : "Not started"} />
            <Stat icon="flag" label="Tasks on time" value={c.tasks.split(" of ")[0]} of={`of ${c.tasks.split(" of ")[1]}`} desc={c.tasksSub} />
          </Stats>
        ),
      }))} />
    </Section>
  );
}

/* ---------------- Notifications ---------------- */
function Notifications() {
  return (
    <>
      <Section>
        <SectionHeader title="Email Notifications" />
        {EMAIL_TOGGLES.map(([title, desc]) => <ToggleRow key={title} title={title} desc={desc} />)}
      </Section>
      <Section>
        <SectionHeader title="Always On" desc="Essential updates on payments, levels and bookings. These notifications cannot be turned off." />
        {ALWAYS_ON.map(([title, desc]) => (
          <div key={title} className={s.srow}><span className={s.srowB}><Text role="h4" as="span">{title}</Text><Text role="desc" as="span">{desc}</Text></span></div>
        ))}
      </Section>
    </>
  );
}

/* ---------------- Privacy Settings ----------------
   No "Legal & Data Use" section in Phase 0 (Maryam 19 Oct 2026). The notices stay
   at /auth/terms/, which the sign-up consent links to. */
function Privacy() {
  const { setUi } = useDemo();
  const [pw, setPw] = useState(false);
  const [del, setDel] = useState(false);
  return (
    <>
      <Section>
        <SectionHeader title="Sign-In & Security" />
        <div className={s.srow}>
          <span className={s.srowB}><Text role="h4" as="span">Email Address</Text><Text role="body" as="span">{PF.general.email}</Text><Text role="desc" as="span">Your sign-in email. Manage your account details under My Profile.</Text></span>
        </div>
        <div className={s.srow}>
          <span className={s.srowB}><Text role="h4" as="span">Password</Text><Text role="desc" as="span">Last changed August 14, 2026</Text></span>
          {!pw && <Button kind="ghost" size="sm" onClick={() => setPw(true)}>Reset Password</Button>}
        </div>
        {pw && (
          <div className={s.pwForm}>
            <Form>
              <Field label="Current password"><Input type="password" /></Field>
              <FormRow>
                <Field label="New password"><Input type="password" /></Field>
                <Field label="Confirm new password"><Input type="password" /></Field>
              </FormRow>
              <Stack row gap={3}>
                <Button kind="secondary" onClick={() => setPw(false)}>Cancel</Button>
                <Button kind="primary" onClick={() => setPw(false)}>Update Password</Button>
              </Stack>
            </Form>
          </div>
        )}
      </Section>
      <Section>
        <SectionHeader title="Closing Your Account" />
        {/* The words left, the button at the right end of the row (Maryam 16 Oct 2026; Phase 1 .close-b). */}
        <div className={s.closeB}>
          <Text role="body" ink="secondary" className={s.closeX}>Deleting your account removes your profile, notes, and interview recordings.</Text>
          <Button kind="dangerInk" onClick={() => setDel(true)}>Delete My Account</Button>
        </div>
      </Section>
      {del && (
        <Confirm icon="delete" danger title="Delete your account?" ok="Delete My Account"
          desc="Your profile, notes and interview recordings will be removed. This cannot be undone."
          onCancel={() => setDel(false)} onOk={() => { setDel(false); setUi({ logout: true }); }} />
      )}
    </>
  );
}
