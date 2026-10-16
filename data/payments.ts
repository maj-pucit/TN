/* PAYMENTS — Phase 1 V.billing / payRows / receiptModal, read 15 Oct 2026. */
import { atLeast } from "@/lib/demo";

export type Payment = { id: string; item: string; date: string; card?: string; brand?: string; amount: string };

const E2: Payment = { id: "e2", item: "Explorer Track – E2", date: "Feb 4, 2026", card: "8210", brand: "Mastercard", amount: "$490" };
const IV: Payment = { id: "iv", item: "Interview · Priya Nair", date: "Aug 13, 2026", amount: "Complimentary" };
const E3: Payment = { id: "e3", item: "Explorer Track – E3", date: "Aug 14, 2026", card: "4242", brand: "Visa", amount: "$690" };
const RE: Payment = { id: "re", item: "Re-interview · Priya Nair", date: "Nov 20, 2026", card: "4242", brand: "Visa", amount: "$95" };

/* Newest first; what has been paid by the stage the candidate is at. */
export function payments(stage: string): Payment[] {
  const rows: Payment[] = [];
  if (atLeast(stage, "week1")) rows.push(E3);
  if (atLeast(stage, "booked")) rows.push(IV);
  if (stage === "promoted") rows.push(RE);
  rows.push(E2);
  return rows;
}
