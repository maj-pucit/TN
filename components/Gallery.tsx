"use client";
import { useState } from "react";
import { Page, PageHeader, Section, SectionHeader, Stack, Text } from "./primitives";
import { Button } from "./ui/Button";
import { Stats, Stat, Facts, Fact } from "./ui/Figures";
import { DarkCard, DarkCardActions } from "./ui/DarkCard";
import { Table, PersonCell, Status } from "./ui/Table";
import { Tabs } from "./ui/Tabs";
import { Dropdown } from "./ui/Dropdown";
import { Field, Input, Form, FormRow, Search, Toolbar } from "./ui/Field";
import { Slider } from "./ui/Slider";
import { Confirm } from "./ui/Confirm";
import { PEOPLE } from "@/data/seed";

/* THE PHASE 0 GALLERY — every shared component, live, on the real primitives.
   Not product UI: it is the check that a component reads the same in every
   portal. /candidate/gallery/ */
type Row = { id: string; name: string; img: string; email: string; type: string; when: string; status: "green" | "warn" | "red" };
const ROWS: Row[] = [
  ["Maryam Naz", PEOPLE.maryam.img, "First interview", "10-21-2026", "green"],
  ["Priya Nair", PEOPLE.priya.img, "Re-interview", "10-22-2026", "warn"],
  ["Owen Clarke", PEOPLE.owen.img, "First interview", "10-23-2026", "green"],
  ["Lena Fischer", PEOPLE.lena.img, "Re-interview", "10-24-2026", "red"],
  ["Samuel Adeyemi", PEOPLE.samuel.img, "First interview", "10-25-2026", "green"],
  ["Derek Sole", PEOPLE.derek.img, "Re-interview", "10-26-2026", "warn"],
].map(([name, img, type, when, status], i) => ({
  id: String(i), name, img, email: `${name.split(" ")[0].toLowerCase()}@example.com`, type, when, status,
} as Row));
const WORD = { green: "Booked", warn: "Held", red: "Not held" } as const;

export function Gallery() {
  const [tab, setTab] = useState("all");
  const [type, setType] = useState("all");
  const [q, setQ] = useState("");
  const [slider, setSlider] = useState(false);
  const [conf, setConf] = useState(false);
  const [role, setRole] = useState<string>();

  const rows = ROWS.filter((r) =>
    (tab === "all" || r.status === tab) && (type === "all" || r.type === type) && r.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <Page>
      <PageHeader title="Component Gallery" desc="Every shared Phase 0 component, live, on the page primitives."
        actions={<Button kind="primary" icon="add" onClick={() => setSlider(true)}>Open Slider</Button>} />

      <Section kind="block" bare>
        <Stats>
          <Stat icon="book" label="Chapters done" value="5" of="of 13" desc="38%" />
          <Stat icon="chart" label="Assessment average" value="82%" desc="course average 79%" />
          <Stat icon="time" label="Time invested" value="4h 20m" desc="52 min per chapter" />
          <Stat icon="flag" label="Tasks on time" value="4" of="of 5" desc="one overdue" />
        </Stats>
      </Section>

      <DarkCard title="Your Next Step: Interview" tal slot={<Button kind="onDark" go>View All Agents</Button>}>
        <Text role="body">Priya’s expertise in architecture aligns well with your system design assessment.</Text>
        <DarkCardActions><Button kind="accent" go>Book a Call With Priya</Button></DarkCardActions>
      </DarkCard>

      <Section kind="block">
        <SectionHeader title="Profile facts" desc="Label over value, any count; two rows of four at desktop." />
        <Facts>
          <Fact icon="user" label="Current role" value="Operations coordinator" />
          <Fact icon="skill" label="Industry" value="Retail" />
          <Fact icon="time" label="Years working" value="3 to 7" />
          <Fact icon="flag" label="Aspiration" value="Develop in my current role" />
        </Facts>
      </Section>

      <Section kind="tabs">
        <Tabs value={tab} onChange={setTab} items={[
          { key: "all", label: "All", count: ROWS.length },
          { key: "green", label: "Booked", count: ROWS.filter((r) => r.status === "green").length },
          { key: "warn", label: "Held", count: ROWS.filter((r) => r.status === "warn").length },
          { key: "red", label: "Not held", count: ROWS.filter((r) => r.status === "red").length },
        ]} />
      </Section>

      <Section kind="block">
        <Stack gap={6}>
          <Toolbar
            search={<Search value={q} onChange={setQ} placeholder="Search by name" />}
            filters={<Dropdown label="Type" value={type} onChange={setType} options={[
              { value: "all", label: "All" }, { value: "First interview", label: "First interview" }, { value: "Re-interview", label: "Re-interview" },
            ]} />}
          />
          <Table<Row>
            rows={rows}
            rowKey={(r) => r.id}
            href={() => "/candidate/gallery/"}
            cols={[
              { key: "n", label: "Candidate", cell: (r) => <PersonCell name={r.name} img={r.img} sub={r.email} /> },
              { key: "t", label: "Type", cell: (r) => r.type },
              { key: "w", label: "Scheduled", cell: (r) => r.when },
              { key: "s", label: "Stage", cell: (r) => <Status tone={r.status}>{WORD[r.status]}</Status> },
            ]}
            actions={() => [
              { icon: "view", label: "View", onClick: () => {} },
              { icon: "edit", label: "Edit", onClick: () => setSlider(true) },
              { icon: "delete", label: "Delete", onClick: () => setConf(true), danger: true },
            ]}
          />
        </Stack>
      </Section>

      <Section>
        <SectionHeader title="Buttons" desc="Primary, accent, secondary, ghost and link. Title Case by CSS." />
        <Stack row gap={4}>
          <Button>Primary</Button>
          <Button kind="accent" go>Accent</Button>
          <Button kind="secondary">Secondary</Button>
          <Button kind="ghost" icon="download">Ghost</Button>
          <Button kind="link" go>Link</Button>
          <Button kind="accent" disabled>Join call</Button>
        </Stack>
      </Section>

      <Slider title="Invite a user" open={slider} onClose={() => setSlider(false)}
        footer={<><Button kind="secondary" onClick={() => setSlider(false)}>Cancel</Button><Button disabled={!role}>Send Invite</Button></>}>
        <Form>
          <Field label="Role" required>
            <Dropdown variant="form" placeholder="Choose a role" value={role} onChange={setRole} options={[
              { value: "agent", label: "Talent Agent" }, { value: "reviewer", label: "Reviewer" }, { value: "admin", label: "Admin" },
            ]} />
          </Field>
          <FormRow>
            <Field label="First name" required><Input placeholder="First name" /></Field>
            <Field label="Last name" required><Input placeholder="Last name" /></Field>
          </FormRow>
          <Field label="Email address" required><Input type="email" placeholder="name@example.com" /></Field>
        </Form>
      </Slider>

      {conf && <Confirm icon="delete" title="Delete this interview?" desc="This cannot be undone." ok="Delete" danger
        onCancel={() => setConf(false)} onOk={() => setConf(false)} />}
    </Page>
  );
}
