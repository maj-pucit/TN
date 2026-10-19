"use client";
import { Chips as ChipRow, Chip } from "../ui/Chip";
import { useState, type ReactNode } from "react";
import { Page, PageHeader, Section, SectionHeader, Stack, Text } from "../primitives";
import { Tabs } from "../ui/Tabs";
import { Button } from "../ui/Button";
import { Facts, Fact, Stats, Stat } from "../ui/Figures";
import { Field, Input, TextArea, Form, FormRow } from "../ui/Field";
import { ToggleRow } from "../ui/Toggle";
import { Confirm } from "../ui/Confirm";
import { Icon } from "../Icon";
import { Availability } from "./Slots";
import { useDemo } from "@/lib/demo";
import { AGENT as A, PUB, SPECIALISMS, INDUSTRIES, INTENTS, AGENT_NOTIF_TOGGLES } from "@/data/agent";
import p from "../candidate/profile.module.css";
import s from "./agent.module.css";

/* ============================================================
   /agent/profile/ — Phase 1 V.profile, four tabs: My Profile · Public
   Profile · Notifications · Privacy Settings. Edits are in place.
   CUT: the Training module status and certification copy (offline for V1).
   ============================================================ */
const TABS = [
  { key: "me", label: "My Profile" }, { key: "public", label: "Public Profile" },
  { key: "priv", label: "Privacy Settings" }, /* Notifications tab removed (Maryam 16 Oct 2026) */
];

export function AgentProfile() {
  const [tab, setTab] = useState("me");
  const [ind, setInd] = useState(PUB.industries);
  const [int, setInt] = useState(PUB.intents);
  const [specs, setSpecs] = useState(SPECIALISMS);
  const [fee, setFee] = useState(A.fee);
  return (
    <Page>
      <PageHeader title="Profile" desc="Your details, the public profile candidates see, and privacy." />
      <Section kind="tabs"><Tabs value={tab} onChange={setTab} items={TABS} /></Section>
      {tab === "me" && <Mine ind={ind} setInd={setInd} int={int} setInt={setInt} specs={specs} setSpecs={setSpecs} fee={fee} setFee={setFee} />}
      {tab === "public" && <Public ind={ind} int={int} specs={specs} fee={fee} />}
      {tab === "priv" && <Privacy />}
    </Page>
  );
}

const Chips = ({ items }: { items: string[] }) => (
  <ChipRow>{items.map((k) => <Chip key={k}>{k}</Chip>)}</ChipRow>
);

function Id({ meta, dot, act }: { meta: ReactNode; dot?: boolean; act?: ReactNode }) {
  return (
    <div className={p.idhead}>
      <span className={p.photo}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={A.img} alt="" />
        {dot && <i className={s.avOn} aria-label="Active" />}
      </span>
      <span className={p.idB}>
        <Text role="h3" as="span">{A.name}</Text>
        <Text role="desc" as="span">{meta}</Text>
      </span>
      {act && <span className={p.idAct}>{act}</span>}
    </div>
  );
}

function Mine({ ind, setInd, int, setInt, specs, setSpecs, fee, setFee }: {
  ind: string[]; setInd: (v: string[]) => void; int: string[]; setInt: (v: string[]) => void;
  specs: string[]; setSpecs: (v: string[]) => void; fee: number; setFee: (v: number) => void;
}) {
  const [edit, setEdit] = useState<null | "details" | "specs" | "ind" | "int">(null);
  const acts = (onSave: () => void) => (
    <Stack row gap={3}>
      <Button kind="secondary" icon="delete" onClick={() => setEdit(null)}>Discard Changes</Button>
      <Button kind="primary" icon="check" onClick={onSave}>Save Changes</Button>
    </Stack>
  );
  const pen = (k: typeof edit, label?: string) => label
    ? <Button kind="link" icon="add" onClick={() => setEdit(k)}>{label}</Button>
    : <Button kind="ghost" size="sm" icon="edit" label="Edit Specialities" onClick={() => setEdit(k)} />;
  const saveDetails = () => setEdit(null);
  return (
    <>
      <Section kind="block">
        <Id meta={A.email} dot act={edit === "details" ? acts(saveDetails) : <Button kind="ghost" iconEnd="edit" onClick={() => setEdit("details")}>Edit Details</Button>} />
      </Section>
      {edit === "details" ? (
        <Section kind="block">
          <Form>
            <FormRow>
              <Field label="Name"><Input defaultValue={A.name} /></Field>
              <Field label="Email"><Input defaultValue={A.email} readOnly /></Field>
            </FormRow>
            {/* The fee is set by TalentNext, not the agent (Maryam 19 Oct 2026), so it is read-only here. */}
            <Field label="Your interview fee" help={`Set by TalentNext and paid to you in full. Candidates pay $${A.price}, which includes the platform fee.`}>
              <Input value={`$${fee}`} readOnly />
            </Field>
            <Field label="About"><TextArea rows={5} defaultValue={PUB.about} /></Field>
          </Form>
        </Section>
      ) : (
        <Section kind="block">
          <Facts>
            <Fact icon="wallet" label="Your fee" value={`$${fee}`} />
            <Fact icon="growth" label="Assesses" value={A.rangeShort} />
            <Fact icon="video" label="Interviews" value={String(A.ivs)} />
            <Fact icon="starOutline" label="Rating" value={String(A.rating)} />
          </Facts>
        </Section>
      )}
      <Section>
        <SectionHeader title="About" />
        <Text role="body" ink="secondary">{PUB.about}</Text>
      </Section>
      <Availability />
      <Section>
        <SectionHeader title="Specialities" actions={edit === "specs" ? acts(() => setEdit(null)) : pen("specs")} />
        {edit === "specs" ? <Editable list={specs} onChange={setSpecs} placeholder="Add a speciality" /> : <Chips items={specs} />}
      </Section>
      <Section>
        <SectionHeader title="Industries you work with" actions={edit === "ind" ? acts(() => setEdit(null)) : pen("ind", "Add Industry")} />
        {edit === "ind" ? <Pick opts={INDUSTRIES} sel={ind} onChange={setInd} /> : <Chips items={ind} />}
      </Section>
      <Section>
        <SectionHeader title="Intents you work with" actions={edit === "int" ? acts(() => setEdit(null)) : pen("int", "Add Intent")} />
        {edit === "int" ? <Pick opts={INTENTS} sel={int} onChange={setInt} /> : <Chips items={int} />}
      </Section>
      <Section>
        <SectionHeader title="Visibility" />
        <ToggleRow title="Listed in the marketplace" desc="Candidates on your track can find and book you" />
      </Section>
    </>
  );
}

/* Removable chips + an add field (the candidate's Skills editor). */
function Editable({ list, onChange, placeholder }: { list: string[]; onChange: (v: string[]) => void; placeholder: string }) {
  const [adding, setAdding] = useState("");
  return (
    <Stack gap={4}>
      <div className={p.chips}>
        {list.map((k) => (
          <Text key={k} role="label" as="span" className={p.chip}>
            {k}<button className={p.chipX} aria-label={`Remove ${k}`} onClick={() => onChange(list.filter((x) => x !== k))}><Icon name="close" /></button>
          </Text>
        ))}
      </div>
      <Stack row gap={3}>
        <Input value={adding} placeholder={placeholder} onChange={(e) => setAdding(e.target.value)} />
        <Button kind="link" icon="add" onClick={() => { if (adding.trim()) { onChange([...list, adding.trim()]); setAdding(""); } }}>Add</Button>
      </Stack>
    </Stack>
  );
}

/* Pick from a fixed list (at least one stays selected). */
function Pick({ opts, sel, onChange }: { opts: string[]; sel: string[]; onChange: (v: string[]) => void }) {
  return (
    <div className={s.ltrs}>
      {opts.map((o) => {
        const on = sel.includes(o);
        return (
          <button key={o} type="button" aria-pressed={on} className={`${s.ltr} ${on ? s.on : ""}`}
            onClick={() => onChange(on ? (sel.length > 1 ? sel.filter((x) => x !== o) : sel) : [...sel, o])}>{o}</button>
        );
      })}
    </div>
  );
}

function Public({ ind, int, specs, fee }: { ind: string[]; int: string[]; specs: string[]; fee: number }) {
  return (
    <>
      <Section kind="block" noline>
        <Id meta={<span className={s.rate}><Icon name="star" />{A.rating} · Assesses {A.rangeShort}</span>} />
      </Section>
      <Section kind="block" bare>
        <Stats>
          <Stat icon="wallet" label="Interview Fee" value={`$${fee}`} />
          <Stat icon="calendar" label="Availability" value={PUB.hoursFig} />
          <Stat icon="time" label="Evaluation Time" value="24 hrs" />
          <Stat icon="work" label="Experience" value={PUB.yrs} />
        </Stats>
      </Section>
      <Section noline>
        <SectionHeader title="About me" />
        <Text role="body" ink="secondary">{PUB.about}</Text>
      </Section>
      <Section noline><SectionHeader title="Specialities" /><Chips items={specs} /></Section>
      <Section noline><SectionHeader title="Industries" /><Chips items={ind} /></Section>
      <Section><SectionHeader title="Intents I work with" /><Chips items={int} /></Section>
    </>
  );
}

function Privacy() {
  const { setUi } = useDemo();
  const [pw, setPw] = useState(false);
  const [del, setDel] = useState(false);
  return (
    <>
      <Section>
        <SectionHeader title="Sign-In & Security" />
        {/* Phase 1 .pf-sr: an 18px mark, the line over its note, no rule between the rows. */}
        <div className={`${p.srow} ${p.srowIc}`}>
          <Icon name="email" />
          <span className={p.srowB}><Text role="h4" as="span">{A.email}</Text><Text role="desc" as="span">Your email address is used to sign in and cannot be changed.</Text></span>
        </div>
        <div className={`${p.srow} ${p.srowIc}`}>
          <Icon name="locked" />
          <span className={p.srowB}><Text role="h4" as="span">Password</Text><Text role="desc" as="span">Last changed 12 June</Text></span>
          {!pw && <Button kind="ghost" size="sm" icon="renew" onClick={() => setPw(true)}>Reset Password</Button>}
        </div>
        {pw && (
          <div className={p.pwForm}>
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
        <SectionHeader title="Close Your Account" />
        {/* Phase 1 .close-b: the words left, the deep-red button on the right. */}
        <div className={p.closeB}>
          <Text role="body" ink="secondary" className={p.closeX}>Closing your account permanently deletes your profile, notes, and interview recordings.</Text>
          <Button kind="dangerInk" onClick={() => setDel(true)}>Delete Account</Button>
        </div>
      </Section>
      {del && (
        <Confirm icon="delete" danger title="Delete your account?" ok="Delete My Account"
          desc="This removes your profile, your notes and your interview recordings. This cannot be undone."
          onCancel={() => setDel(false)} onOk={() => { setDel(false); setUi({ logout: true }); }} />
      )}
    </>
  );
}
