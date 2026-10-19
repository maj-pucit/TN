"use client";
import { useState } from "react";
import { Section, SectionHeader, Stack, Text } from "../primitives";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { Dropdown } from "../ui/Dropdown";
import { KV } from "../ui/KV";
import { Icon } from "../Icon";
import { WEEK_SLOTS, SLOT_DAYS, SLOT_TIMES, slotMin, type WeekSlot } from "@/data/agent";
import p from "../candidate/profile.module.css";
import s from "./slots.module.css";

/* ============================================================
   AVAILABLE SLOTS — on the agent's My Profile, after About (Maryam 19 Oct
   2026). It replaces the Availability module: no calendar, just the weekly
   times candidates can book. A weekday row lists its times as removable
   chips; "Add Slot" opens the add-slot dialog (Phase 1 §123: a weekday and
   a start-to-end time). A booked interview is not touched by removing a time.
   ============================================================ */
export function AvailableSlots() {
  const [slots, setSlots] = useState<WeekSlot[]>(WEEK_SLOTS);
  const [adding, setAdding] = useState(false);
  const rows = SLOT_DAYS
    .map((day) => [day, slots.filter((x) => x.day === day).sort((a, b) => slotMin(a.start) - slotMin(b.start))] as const)
    .filter(([, list]) => list.length);
  return (
    <Section>
      <SectionHeader title="Available slots" desc="The weekly times candidates can book with you. Removing a time does not affect interviews already booked."
        actions={<Button kind="link" icon="add" onClick={() => setAdding(true)}>Add Slot</Button>} />
      {rows.length ? (
        <KV rows={rows.map(([day, list]) => [day, (
          <span key={day} className={p.chips}>
            {list.map((x) => (
              <Text key={x.id} role="label" as="span" className={p.chip}>
                {x.start} – {x.end}
                <button className={p.chipX} aria-label={`Remove ${day} ${x.start}`} onClick={() => setSlots(slots.filter((y) => y.id !== x.id))}><Icon name="close" /></button>
              </Text>
            ))}
          </span>
        )])} />
      ) : <Text role="desc" as="p">No slots yet. Add the times candidates can book you.</Text>}
      {adding && (
        <AddSlot onClose={() => setAdding(false)} onSave={(day, start, end) => {
          const id = `${day} ${start}`;
          if (!slots.some((x) => x.id === id)) setSlots([...slots, { id, day, start, end }]);
          setAdding(false);
        }} />
      )}
    </Section>
  );
}

/* The add-slot dialog (Phase 1 §123): a weekday and two time dropdowns, "start to end".
   No "Day" / "Time" labels: the controls say what they are. Save is off until the end
   is after the start. */
function AddSlot({ onClose, onSave }: { onClose: () => void; onSave: (day: string, start: string, end: string) => void }) {
  const [day, setDay] = useState(SLOT_DAYS[0]);
  const [start, setStart] = useState("3:00 PM");
  const [end, setEnd] = useState("4:00 PM");
  const opt = (v: string) => ({ value: v, label: v });
  const ok = slotMin(end) > slotMin(start);
  return (
    <Modal label="Add a slot" onClose={onClose} footer={
      <>
        <Button kind="secondary" onClick={onClose}>Cancel</Button>
        <Button kind="primary" disabled={!ok} onClick={() => onSave(day, start, end)}>Save Slot</Button>
      </>
    }>
      <Stack gap={5}>
        <Text role="h3">Add a slot</Text>
        <Dropdown variant="form" value={day} onChange={setDay} options={SLOT_DAYS.map(opt)} />
        <div className={s.tm}>
          <Dropdown variant="form" value={start} onChange={setStart} options={SLOT_TIMES.map(opt)} />
          <Text role="desc" as="span">to</Text>
          <Dropdown variant="form" value={end} onChange={setEnd} options={SLOT_TIMES.map(opt)} />
        </div>
      </Stack>
    </Modal>
  );
}
