import s from "./ui.module.css";

/* A complimentary fee: the price struck, "Free" beside it (Phase 1 ivFeeLabel).
   `quiet` keeps "Free" in the line's own grey (the booking page's agent head). */
export const FreeFee = ({ price, quiet }: { price: number; quiet?: boolean }) => (
  <><s className={s.was}>${price}</s> <span className={quiet ? undefined : s.free}>Free</span></>
);
