"use client";
import { useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { Page, PageHeader, Section, SectionHeader, Text, Stack } from "../primitives";
import { Button } from "../ui/Button";
import { Confirm } from "../ui/Confirm";
import { Modal } from "../ui/Modal";
import { Dropdown } from "../ui/Dropdown";
import { Icon } from "../Icon";
import {
  AGENT as A, SLOTS, CAL_TODAY, CAL_NOW_MIN, SLOT_DAYS, SLOT_TIMES, PHOTO, ivById, type Slot,
} from "@/data/agent";
import s from "./calendar.module.css";

/* ============================================================
   AVAILABILITY — Phase 1 V.availability (§41/§42): one calendar, three
   views behind Daily / Weekly / Monthly (Weekly the default). The week and
   day views are a time grid (12 PM to 8 PM, a block per 45-minute slot, the
   now-line on today); the month view is a grid of one-line rows. Blocks are
   filled by type (first interview / re-interview / open). A block opens its
   card; an open slot can be closed; "Add a slot" adds one to the week shown.
   ============================================================ */
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WD = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const WDL = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const START = 12, END = 20;                     // the hours the axis draws
const CAL_MONTHS: [number, number][] = [[2026, 7], [2026, 8], [2026, 9]];

const dayNo = (y: number, m: number, d: number) => Math.round(Date.UTC(y, m, d) / 864e5);
const fromNo = (n: number) => { const d = new Date(n * 864e5); return { y: d.getUTCFullYear(), m: d.getUTCMonth(), d: d.getUTCDate(), wd: (d.getUTCDay() + 6) % 7 }; };
const TODAY = dayNo(CAL_TODAY.y, CAL_TODAY.m, CAL_TODAY.d);
const toMin = (t: string) => { const [hm, ap] = t.split(" "); const [h, m] = hm.split(":").map(Number); return ((h % 12) + (ap === "PM" ? 12 : 0)) * 60 + m; };
const fmt = (min: number) => { const h = Math.floor(min / 60), m = min % 60; return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`; };
const longDay = (n: number) => { const x = fromNo(n); return `${WDL[x.wd]} ${x.d} ${MONTHS[x.m]}`; };

type View = "day" | "week" | "month";

export function AgentAvailability() {
  const [slots, setSlots] = useState<Slot[]>(SLOTS);
  const [view, setView] = useState<View>("week");
  const [anchor, setAnchor] = useState(TODAY);
  const [mon, setMon] = useState(0);
  const [open, setOpen] = useState<{ id: string; x: number; y: number } | null>(null);
  const [add, setAdd] = useState(false);
  const [close, setClose] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null);

  const onDay = (n: number) => { const x = fromNo(n); return slots.filter((sl) => sl.y === x.y && sl.m === x.m && sl.d === x.d).sort((a, b) => toMin(a.t) - toMin(b.t)); };
  const taken = slots.filter((sl) => sl.iv).length;
  const weekStart = anchor - fromNo(anchor).wd;
  const days = view === "day" ? [anchor] : Array.from({ length: 7 }, (_, i) => weekStart + i);

  const title = view === "month"
    ? `${MONTHS[CAL_MONTHS[mon][1]]} ${CAL_MONTHS[mon][0]}`
    : `${MONTHS[fromNo(days[0]).m]} ${fromNo(days[0]).y}`;
  const nav = (dir: 1 | -1) => {
    setOpen(null);
    if (view === "month") setMon((m) => Math.min(CAL_MONTHS.length - 1, Math.max(0, m + dir)));
    else setAnchor((a) => a + dir * (view === "week" ? 7 : 1));
  };
  const pick = (e: MouseEvent<HTMLButtonElement>, id: string) => {
    const r = root.current!.getBoundingClientRect(), b = e.currentTarget.getBoundingClientRect();
    const W = root.current!.offsetWidth, scale = r.width / W || 1, POP = 264;
    const bl = (b.left - r.left) / scale, br = (b.right - r.left) / scale, top = (b.top - r.top) / scale;
    let x = br + 8;
    if (x + POP > W - 8) x = bl - POP - 8;
    if (x < 8) x = Math.max(8, (W - POP) / 2);
    setOpen((o) => (o?.id === id ? null : { id, x, y: top }));
  };

  return (
    <Page>
      <PageHeader title="Availability" desc="The slots candidates can book with you, by day, week or month." />
      <Section kind="block">
        <SectionHeader title="Your calendar" desc={`${taken} taken, ${slots.length - taken} open · 45 minutes each`}
          actions={<Button kind="primary" size="sm" icon="add" onClick={() => setAdd(true)}>Add a slot</Button>} />
        <div className={s.cal} ref={root}>
          <div className={s.top}>
            <button type="button" className={`${s.todayBtn} t-label`} onClick={() => { setAnchor(TODAY); setMon(0); setOpen(null); }}>Today</button>
            <div className={s.nav}>
              <button type="button" className={s.navB} aria-label="Previous" onClick={() => nav(-1)}><Icon name="chevLeft" /></button>
              <button type="button" className={s.navB} aria-label="Next" onClick={() => nav(1)}><Icon name="chevRight" /></button>
            </div>
            <Text role="h2" as="h3" className={s.m}>{title}</Text>
            <div className={s.seg} role="group" aria-label="Calendar view">
              {(["day", "week", "month"] as View[]).map((v) => (
                <button key={v} type="button" aria-pressed={view === v} className={`${view === v ? s.on : ""} t-label`} onClick={() => { setView(v); setOpen(null); }}>
                  {v === "day" ? "Daily" : v === "week" ? "Weekly" : "Monthly"}
                </button>
              ))}
            </div>
          </div>

          {view === "month"
            ? <MonthGrid y={CAL_MONTHS[mon][0]} m={CAL_MONTHS[mon][1]} onDay={onDay} pick={pick} open={open?.id}
                more={(n) => { setAnchor(n); setView("day"); }} />
            : <TimeGrid days={days} onDay={onDay} pick={pick} open={open?.id} single={view === "day"} />}

          {open && <Pop id={open.id} slots={slots} style={{ "--x": `${open.x}px`, "--y": `${open.y}px` } as CSSProperties}
            onClose={() => setOpen(null)} onCloseSlot={(id) => { setOpen(null); setClose(id); }} />}
        </div>
      </Section>

      {add && <AddSlot onClose={() => setAdd(false)} onSave={(day, t) => {
        const n = weekStart + SLOT_DAYS.indexOf(day), x = fromNo(n);
        if (!slots.some((sl) => sl.y === x.y && sl.m === x.m && sl.d === x.d && sl.t === t))
          setSlots((all) => [...all, { id: `n${n}-${t}`, y: x.y, m: x.m, d: x.d, t }]);
        setAdd(false);
      }} />}
      {close && (
        <Confirm icon="warning" title="Close this slot?" ok="Close It"
          desc="It comes out of browse straight away. Nobody can book it, and you can open the same time again whenever you like."
          onCancel={() => setClose(null)} onOk={() => { setSlots((all) => all.filter((sl) => sl.id !== close)); setClose(null); }} />
      )}
    </Page>
  );
}

type Pick = (e: MouseEvent<HTMLButtonElement>, id: string) => void;
const kindCls = (sl: Slot) => (!sl.iv ? s.open : ivById(sl.iv)?.kind === "Re-interview" ? s.reiv : s.iv);

function TimeGrid({ days, onDay, pick, open, single }: { days: number[]; onDay: (n: number) => Slot[]; pick: Pick; open?: string; single: boolean }) {
  const hours = Array.from({ length: END - START }, (_, i) => START + i);
  const showNow = days.includes(TODAY);
  return (
    <div className={s.scroll}>
      <div className={`${s.calw} ${single ? s.single : ""}`} style={{ "--cols": days.length } as CSSProperties}>
        <div className={s.head}>
          <span className={s.corner} />
          {days.map((n) => {
            const x = fromNo(n);
            return (
              <div key={n} className={`${s.dh} ${n === TODAY ? s.today : ""}`}>
                <Text role="caption" as="span" className={s.dw}>{WD[x.wd]}</Text>
                <Text role="h4" as="span" className={s.dn}>{x.d}</Text>
              </div>
            );
          })}
        </div>
        <div className={s.body}>
          <div className={s.axis}>
            {hours.map((h) => <Text key={h} role="caption" as="span" className={s.h}>{h === START ? "" : `${((h + 11) % 12) + 1} PM`}</Text>)}
          </div>
          {days.map((n) => (
            <div key={n} className={s.col}>
              {hours.map((h) => <span key={h} className={s.cell} />)}
              {onDay(n).map((sl) => {
                const min = toMin(sl.t), x = sl.iv ? ivById(sl.iv) : undefined;
                return (
                  <button key={sl.id} type="button" className={`${s.ev} ${kindCls(sl)} ${open === sl.id ? s.picked : ""}`}
                    style={{ "--m": min - START * 60 } as CSSProperties} onClick={(e) => pick(e, sl.id)}>
                    <Text role="label" as="span" strong className={s.evT}>{x ? x.kind : "Open"}</Text>
                    <Text role="caption" as="span" className={s.evR}>{sl.t} – {fmt(min + 45)}</Text>
                    {x && (
                      <span className={s.evWho}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={PHOTO[x.id]} alt="" />
                        <Text role="caption" as="span">{x.n}</Text>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
          {showNow && (
            <div className={s.now} style={{ "--m": CAL_NOW_MIN - START * 60 } as CSSProperties}>
              <span className={`${s.nowT} t-caption`}>{fmt(CAL_NOW_MIN)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MonthGrid({ y, m, onDay, pick, open, more }: { y: number; m: number; onDay: (n: number) => Slot[]; pick: Pick; open?: string; more: (n: number) => void }) {
  const first = dayNo(y, m, 1), start = first - fromNo(first).wd;
  const last = dayNo(y, m + 1, 1) - 1, end = last + (6 - fromNo(last).wd);
  const cells = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  return (
    <div className={s.grid}>
      {WD.map((w) => <Text key={w} role="caption" as="span" className={s.wd}>{w}</Text>)}
      {cells.map((n) => {
        const x = fromNo(n), out = x.m !== m, list = out ? [] : onDay(n);
        return (
          <div key={n} className={`${s.d} ${out ? s.out : ""} ${x.wd > 4 ? s.we : ""} ${n === TODAY ? s.today : ""}`}>
            <Text role="label" as="span" className={s.n}>{x.d}</Text>
            {list.slice(0, 3).map((sl) => {
              const iv = sl.iv ? ivById(sl.iv) : undefined;
              return (
                <button key={sl.id} type="button" className={`${s.slot} ${kindCls(sl)} ${open === sl.id ? s.picked : ""}`} onClick={(e) => pick(e, sl.id)}>
                  <Text role="label" as="span" className={s.el}><span className={s.et}>{sl.t}</span> {iv ? iv.n : "Open"}</Text>
                </button>
              );
            })}
            {list.length > 3 && <button type="button" className={`${s.more} t-caption`} onClick={() => more(n)}>+{list.length - 3} more</button>}
          </div>
        );
      })}
    </div>
  );
}

function Pop({ id, slots, style, onClose, onCloseSlot }: { id: string; slots: Slot[]; style: CSSProperties; onClose: () => void; onCloseSlot: (id: string) => void }) {
  const sl = slots.find((x) => x.id === id);
  if (!sl) return null;
  const n = dayNo(sl.y, sl.m, sl.d), x = sl.iv ? ivById(sl.iv) : undefined;
  return (
    <div className={s.pop} style={style} role="dialog" aria-label={longDay(n)}>
      <div className={s.popH}>
        <Text role="h4" as="span">{longDay(n)}</Text>
        <button type="button" className={s.popX} aria-label="Close" onClick={onClose}><Icon name="close" /></button>
      </div>
      <Text role="label" as="p" className={s.popT}>{sl.t} · 45 minutes{x ? " · recorded" : ""}</Text>
      {x ? (
        <>
          <div className={s.popWho}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={PHOTO[x.id]} alt="" />
            <span className={s.popNb}><Text role="h4" as="span">{x.n}</Text><Text role="desc" as="span">{x.band}</Text></span>
          </div>
          <Row l="What it is" v={x.kind} />
          <Row l="Asked to be assessed on" v={x.asked} />
          <Row l="Fee" v={`$${A.fee} · paid`} />
          <div className={s.popA}><Button kind="accent" size="sm" iconEnd="video" disabled>Join the Call</Button></div>
        </>
      ) : (
        <>
          <Row l="Status" v="Open — nobody has taken it" />
          <Row l="If it is booked" v={`$${A.fee} held`} />
          <Row l="Taking it back" v="Any time before it is booked" />
          <div className={s.popA}><Button kind="ghost" size="sm" onClick={() => onCloseSlot(id)}>Close This Slot</Button></div>
        </>
      )}
    </div>
  );
}
const Row = ({ l, v }: { l: string; v?: string }) => (
  <div className={s.row}><Text role="caption" as="span" className={s.rl}>{l}</Text><Text role="compact" as="span">{v}</Text></div>
);

/* The add-slot sheet (Phase 1 §123): a weekday, and two time dropdowns,
   "start to end". Save Slot adds it to the week the calendar is showing. */
function AddSlot({ onClose, onSave }: { onClose: () => void; onSave: (day: string, t: string) => void }) {
  const [day, setDay] = useState(SLOT_DAYS[0]);
  const [start, setStart] = useState("3:00 PM");
  const [end, setEnd] = useState("4:00 PM");
  const opt = (v: string) => ({ value: v, label: v });
  return (
    <Modal label="Add a slot" onClose={onClose} footer={
      <>
        <Button kind="secondary" onClick={onClose}>Cancel</Button>
        <Button kind="primary" onClick={() => onSave(day, start)}>Save Slot</Button>
      </>
    }>
      <Stack gap={5}>
        <Text role="h3">Add a slot</Text>
        {/* No "Day"/"Time" labels: the controls say what they are (DESIGN §3, agent 6 Sep). */}
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
