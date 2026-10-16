import type { CSSProperties } from "react";

/* <TalOrb> — Tal's mark, Phase 1's own component (icons.js borbMark,
   §132/§133/§135). `live` is the moving orb (an onboarding hero, a reply
   that is streaming); without it the same markup renders as the flat chrome
   blob (§135). `size` is the slot: the glass body lands on it and the glow
   bleeds outside, as §133 sizes it (--borb-size = slot / 0.80556). */
export function TalOrb({ size, live, className }: { size: number; live?: boolean; className?: string }) {
  const style = { "--borb-size": `${(size / 0.80556).toFixed(1)}px`, "--orb-slot": `${size}px` } as CSSProperties;
  return (
    <span className={`borb tal-orb ${className ?? ""}`} data-state="idle" {...(live ? { "data-borb-live": "1" } : {})} style={style} aria-hidden="true">
      <span className="borb__ripple" />
      <span className="borb__ripple borb__ripple--2" />
      <span className="borb__field">
        <span className="borb__cloud borb__cloud--1" />
        <span className="borb__cloud borb__cloud--2" />
        <span className="borb__cloud borb__cloud--3" />
        <span className="borb__cloud borb__cloud--4" />
      </span>
      <span className="borb__mark">
        <span className="borb__blade borb__blade--a" />
        <span className="borb__blade borb__blade--b" />
        <span className="borb__blade borb__blade--c" />
        <svg className="borb__waves" viewBox="0 0 100 100" aria-hidden="true"><path d="" /><path d="" /><path d="" /></svg>
      </span>
    </span>
  );
}

/* <TnLoader> — the three relay blades (Phase 1 tn-loader, 90px). */
export function TnLoader() {
  return (
    <span className="tn-loader" role="img" aria-label="Loading">
      <span className="tn-loader__blade tn-loader__blade--a" />
      <span className="tn-loader__blade tn-loader__blade--b" />
      <span className="tn-loader__blade tn-loader__blade--c" />
    </span>
  );
}
