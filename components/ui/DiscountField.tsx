"use client";
import { useState } from "react";
import { Text } from "../primitives/Text";
import { Button } from "./Button";
import { Input } from "./Field";
import { Icon } from "../Icon";
import { applyCode, type DiscCtx, type Sale } from "@/data/discounts";
import s from "./discountfield.module.css";

/* <DiscountField> — "Have a discount code?" on a checkout (Maryam 26 Oct 2026). Closed it is
   one quiet link; open it is the code input with Apply. A good code shows as a green
   banner (the amount off, the code, a Remove); a bad one shows the refusal
   from data/discounts.ts under the input. The page keeps the applied code and reprices
   off `onChange`. */
export type Applied = { code: string; off: number; d: unknown } | null;
/* `auto` is a live whole-platform discount (Maryam 26 Oct 2026): it shows as a chip with no
   remove, already applied. A typed code replaces it only when it takes off MORE; the two
   never stack. */
/* APPLIED = A GREEN BANNER, not a chip (Maryam 2 Nov 2026, off a promo-code reference):
   a check, "$345 off applied" in the success ink, a sub-line naming the code, its rate and
   when it ends, and a quiet Remove at the end. Square, like every box here; the tint is the
   success green at 8% on a hairline of it at 30%. The automatic sale is the same banner
   without Remove. */
const mdy = (iso?: string) => { const m = String(iso || "").match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? `${m[2]}-${m[3]}-${m[1]}` : ""; };
const rateOf = (d: any) => (!d ? "" : d.kind === "pct" ? `${d.value}% off` : `$${d.value} off`);
const subOf = (lead: string, d: any) => [lead, rateOf(d), d?.end ? `ends ${mdy(d.end)}` : ""].filter(Boolean).join(" · ");
function AppliedBanner({ off, sub, onRemove, label }: { off: number; sub: string; onRemove?: () => void; label: string }) {
  return (
    <div className={s.banner} role="status">
      <Icon name="checkFilled" />
      <span className={s.bannerTxt}>
        <Text role="h4" as="span" className={s.bannerT}>${off} off applied</Text>
        <Text role="caption" as="span" ink="secondary">{sub}</Text>
      </span>
      {onRemove && <Button kind="link" asIs onClick={onRemove} label={`Remove ${label}`}>Remove</Button>}
    </div>
  );
}
export function DiscountField({ ctx, cand, value, onChange, auto }: { ctx: DiscCtx; cand: string; value: Applied; onChange: (a: Applied) => void; auto?: Sale }) {
  const [open, setOpen] = useState(false), [code, setCode] = useState(""), [err, setErr] = useState("");
  const autoChip = auto && !value && <AppliedBanner off={auto.off} label={auto.name} sub={subOf("Applied automatically", auto.d)} />;
  if (value) return <AppliedBanner off={value.off} label={value.code} sub={subOf(value.code, value.d)} onRemove={() => { onChange(null); setCode(""); }} />;
  if (!open) return <div className={s.stack}>{autoChip}<div><Button kind="link" icon="add" asIs onClick={() => setOpen(true)}>Have a discount code?</Button></div></div>;
  const apply = () => {
    const r = applyCode(code, ctx, cand);
    if (!r.ok) setErr(r.reason);
    else if (auto && r.off <= auto.off) setErr(`The ${auto.name} already takes as much or more off. Discounts don’t combine.`);
    else { setErr(""); onChange({ code: String(r.d.code).toUpperCase(), off: r.off, d: r.d }); }
  };
  return (
    <div className={s.stack}>
    {autoChip}
    <div className={s.f}>
      <Text role="label" as="span">Discount code</Text>
      <div className={s.row}>
        <Input value={code} autoFocus placeholder="Enter your code" onChange={(e) => { setCode(e.target.value.toUpperCase()); setErr(""); }}
          onKeyDown={(e) => { if (e.key === "Enter") apply(); }} />
        <Button kind="secondary" onClick={apply}>Apply</Button>
      </div>
      {err && <Text role="caption" as="span" className={s.err}>{err}</Text>}
    </div>
    </div>
  );
}
