"use client";
import { useState, type ReactNode } from "react";
import { bmk } from "@/data/brandmarks";
import s from "./cards.module.css";
import { Overlay } from "./Overlay";
import { Icon } from "../Icon";
import { Text } from "../primitives/Text";

export type Card = { brand: string; last4: string; exp: string; def?: boolean };

/* One saved card (Phase 1 .cardrow): the radio, the brand mark in a 40px
   bordered box, "Brand ending 1234" (14 Medium) with the accent Default
   pill, the expiry in the description grey, and an optional action. */
export function CardRow({ c, on, onPick, action }: { c: Card; on?: boolean; onPick?: () => void; action?: ReactNode }) {
  return (
    <div className={s.row} role={onPick ? "radio" : undefined} aria-checked={onPick ? !!on : undefined} onClick={onPick}>
      {onPick !== undefined || on !== undefined ? <span className={`${s.rad} ${on ? s.on : ""}`} /> : null}
      <span className={s.ic} dangerouslySetInnerHTML={{ __html: bmk(c.brand) }} />
      <span className={s.b}>
        <span className={s.t}>{c.brand} ending {c.last4}{c.def && <span className={s.def}>Default</span>}</span>
        <Text role="desc" as="span">Expires {c.exp}</Text>
      </span>
      {action && <span className={s.a}>{action}</span>}
    </div>
  );
}

/* <CardPicker> — pay from a saved card, never a re-typed one. The default is
   selected on open. */
export function CardPicker({ cards }: { cards: Card[] }) {
  const [pick, setPick] = useState(Math.max(0, cards.findIndex((c) => c.def)));
  return (
    <div className={s.stack} role="radiogroup">
      {cards.map((c, i) => <CardRow key={c.last4} c={c} on={i === pick} onPick={() => setPick(i)} />)}
    </div>
  );
}

/* <PayModal> — Stripe's "Add Payment Method", embedded as a picture. */
export function PayModal({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<"card" | "bank">("card");
  return (
    <Overlay onClose={onClose}>
      <div className={`${s.pay} ${s[tab]}`} role="dialog" aria-modal="true" aria-label="Add payment method" onClick={(e) => e.stopPropagation()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={tab === "card" ? "/images/art/pay-art-card.webp" : "/images/art/pay-art-bank.webp"} alt="Add a payment method" />
        <button className={`${s.hot} ${s.tabCard}`} aria-label="Pay by card" onClick={() => setTab("card")} />
        <button className={`${s.hot} ${s.tabBank}`} aria-label="Pay by US bank account" onClick={() => setTab("bank")} />
        <button className={`${s.hot} ${s.close}`} aria-label="Close" onClick={onClose} />
      </div>
    </Overlay>
  );
}
