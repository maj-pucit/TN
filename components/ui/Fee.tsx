import s from "./ui.module.css";

/* A complimentary fee: the word "Free" alone, never the struck price beside it
   (Maryam 16 Oct 2026; Phase 1 ivFeeLabel struck the price). `quiet` keeps it in
   the line's own grey (the booking page's agent head). */
export const FreeFee = ({ quiet }: { quiet?: boolean }) => (
  <span className={quiet ? undefined : s.free}>Free</span>
);
