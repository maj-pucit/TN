"use client";
import { useState } from "react";
import { Text } from "../primitives";
import s from "./charts.module.css";

/* ============================================================
   DASHBOARD CHARTS — Phase 1's own SVG builders (lineChart, barChart, the
   payout rings, the sparklines), same geometry: a 1000-wide viewBox,
   32 between tick rows, 6-unit axis text. The monthly / weekly / yearly
   series are Phase 1's authored placeholder (no dated history, SA-03 E1).
   ============================================================ */
export type Series = { name: string; color: string; pts: number[]; fillOpacity?: number };
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEK7 = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
type Per = "weekly" | "monthly" | "yearly";

function reshape(pts: number[], count: number) {
  const mean = pts.reduce((a, b) => a + b, 0) / pts.length, out: number[] = [];
  for (let i = 0; i < count; i++) {
    const t = count > 1 ? i / (count - 1) : 0;
    out.push(Math.max(1, Math.round(mean * (0.65 + 0.7 * t) + Math.sin(i * 0.8 + 1) * mean * 0.16 + Math.cos(i * 0.45) * mean * 0.08)));
  }
  return out;
}
function perData(base: Series[], per: Per) {
  if (per === "weekly") return { labels: WEEK7, series: base.map((x) => ({ ...x, pts: reshape(x.pts, 7) })) };
  if (per === "monthly") {
    const d = new Date(), dn = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    return { labels: Array.from({ length: dn }, (_, i) => String(i + 1)), series: base.map((x) => ({ ...x, pts: reshape(x.pts, dn) })) };
  }
  return { labels: MONTHS, series: base };
}

function Head({ series, per, setPer }: { series: Series[]; per: Per; setPer: (p: Per) => void }) {
  return (
    <div className={s.leg}>
      <span className={s.chips}>
        {series.map((x) => <span key={x.name} className={`${s.chip} t-compact`}><i style={{ "--c": x.color } as React.CSSProperties} />{x.name}</span>)}
      </span>
      <div className={s.gfilt} role="group" aria-label="Period">
        {(["weekly", "monthly", "yearly"] as Per[]).map((p) => (
          <button key={p} type="button" aria-pressed={per === p} className={per === p ? s.on : ""} onClick={() => setPer(p)}>
            {p[0].toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}

const ROW = 32, W = 1000;
function axis(vmax: number, step: number) { const t: number[] = []; for (let v = 0; v <= vmax + 1e-6; v += step) t.push(v); return t; }

/* Grouped bars, one group per period label (Platform Users). */
export function BarChart({ base, vmax, step, aria }: { base: Series[]; vmax: number; step: number; aria: string }) {
  const [per, setPer] = useState<Per>("monthly");
  const { labels, series } = perData(base, per);
  const n = labels.length, padL = 40, padR = 14, padT = 16, padB = 28, x0 = padL, x1 = W - padR, plotW = x1 - x0;
  const ticks = axis(vmax, step), plotH = (ticks.length - 1) * ROW, y1 = padT + plotH, H = y1 + padB;
  const Y = (v: number) => y1 - (Math.min(v, vmax) / vmax) * plotH;
  const bandW = plotW / n, gw = Math.min(bandW * 0.8, 140), gap = per === "monthly" ? 2 : 6;
  const bw = (gw - gap * (series.length - 1)) / series.length / 2;
  const rx = Math.min(per === "weekly" ? 4 : 999, bw / 2), gwEff = series.length * bw + gap * (series.length - 1);
  return (
    <div className={s.chart}>
      <Head series={base} per={per} setPer={setPer} />
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={aria}>
        {ticks.map((t) => <g key={t}><line x1={x0} x2={x1} y1={Y(t)} y2={Y(t)} className={s.grid} /><text x={x0 - 8} y={Y(t) + 3} textAnchor="end" className={s.ax}>{t}</text></g>)}
        {labels.map((l, i) => {
          const gl = x0 + i * bandW + (bandW - gwEff) / 2;
          return (
            <g key={l}>
              {series.map((x, j) => { const v = x.pts[i] || 0, h = (Math.min(v, vmax) / vmax) * plotH; return h > 0 && <rect key={j} x={gl + j * (bw + gap)} y={Y(v)} width={bw} height={h} rx={rx} ry={rx} fill={x.color} />; })}
              <text x={x0 + i * bandW + bandW / 2} y={H - 9} textAnchor="middle" className={s.ax}>{l.toUpperCase()}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function smooth(p: { x: number; y: number }[]) {
  if (p.length < 2) return "";
  let d = `M${p[0].x.toFixed(1)},${p[0].y.toFixed(1)}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] || p[i], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2] || p2;
    d += ` C${(p1.x + (p2.x - p0.x) / 6).toFixed(1)},${(p1.y + (p2.y - p0.y) / 6).toFixed(1)} ${(p2.x - (p3.x - p1.x) / 6).toFixed(1)},${(p2.y - (p3.y - p1.y) / 6).toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }
  return d;
}

/* Smooth area lines with a marker pill (Interviews). */
export function LineChart({ base, vmax, step, aria }: { base: Series[]; vmax: number; step: number; aria: string }) {
  const [per, setPer] = useState<Per>("monthly");
  const { labels, series } = perData(base, per);
  const n = labels.length, padL = 40, padR = 14, padT = 14, padB = 28, x0 = padL, x1 = W - padR, plotW = x1 - x0;
  const ticks = axis(vmax, step), plotH = (ticks.length - 1) * ROW, y1 = padT + plotH, H = y1 + padB;
  const X = (i: number) => x0 + (n === 1 ? 0 : (i / (n - 1)) * plotW);
  const Y = (v: number) => y1 - (Math.min(v, vmax) / vmax) * plotH;
  const total = series.reduce((a, x) => a + x.pts.reduce((b, c) => b + c, 0), 0);
  const mi = Math.round((series[0].pts.length - 1) * 0.7), mv = series[0].pts[mi], mx = X(mi), my = Y(mv), pw = String(mv).length * 4 + 14;
  return (
    <>
      <div className={s.fig}><span className={s.total}>{total}</span><Text role="desc" as="span">Interviews this month</Text></div>
      <div className={s.chart}>
        <Head series={base} per={per} setPer={setPer} />
        <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={aria}>
          {ticks.map((t) => <g key={t}><line x1={x0} x2={x1} y1={Y(t)} y2={Y(t)} className={s.grid} /><text x={x0 - 8} y={Y(t) + 3} textAnchor="end" className={s.ax}>{t}</text></g>)}
          {series.map((x) => {
            const pt = x.pts.map((v, i) => ({ x: X(i), y: Y(v) }));
            return (
              <g key={x.name}>
                <path d={`${smooth(pt)} L${X(n - 1).toFixed(1)},${y1} L${X(0).toFixed(1)},${y1} Z`} fill={x.color} opacity={x.fillOpacity ?? 0.08} />
                <path d={smooth(pt)} fill="none" stroke={x.color} strokeWidth={1} strokeLinecap="round" />
              </g>
            );
          })}
          <line x1={mx} y1={my} x2={mx} y2={y1} stroke={series[0].color} strokeWidth={0.5} strokeDasharray="2 2" />
          <circle cx={mx} cy={my} r={3} fill={series[0].color} className={s.knob} />
          <rect x={mx - pw / 2} y={my - 22} width={pw} height={14} rx={3} className={s.pill} />
          <text x={mx} y={my - 12.6} textAnchor="middle" className={s.pillT}>{mv}</text>
          {labels.map((l, i) => <text key={l} x={X(i)} y={H - 9} textAnchor="middle" className={s.ax}>{l.toUpperCase()}</text>)}
        </svg>
      </div>
    </>
  );
}

/* Three concentric rings: each state's share of the total amount, from 12
   o'clock clockwise over a light track (Payouts). */
export function Rings({ rings, total, fmt }: { rings: { l: string; v: number; c: string }[]; total: number; fmt: (n: number) => string }) {
  const cx = 135.64, cy = 136.316, R = [129.583, 97.048, 63.765], sum = rings.reduce((a, r) => a + r.v, 0) || 1;
  return (
    <div className={s.ring}>
      <svg viewBox="-10 -10 292 292" role="img" aria-label="Payouts by settlement state">
        {rings.map((g, i) => {
          const C = 2 * Math.PI * R[i], len = (g.v / sum) * C;
          return (
            <g key={g.l}>
              <circle cx={cx} cy={cy} r={R[i]} fill="none" className={s.track} />
              {g.v > 0 && <circle cx={cx} cy={cy} r={R[i]} fill="none" stroke={g.c} className={s.arc} strokeDasharray={`${len.toFixed(2)} ${(C - len).toFixed(2)}`} transform={`rotate(-90 ${cx} ${cy})`} />}
            </g>
          );
        })}
        <text x={cx} y={128} textAnchor="middle" className={s.rl}>Total payouts</text>
        <text x={cx} y={160} textAnchor="middle" className={s.rv}>{fmt(total)}</text>
      </svg>
      <div className={s.ringLeg}>
        {rings.map((g) => (
          <div key={g.l} className={s.ringRow}><i style={{ "--c": g.c } as React.CSSProperties} /><Text role="body" as="span" ink="secondary">{g.l}</Text><b>{fmt(g.v)}</b></div>
        ))}
      </div>
    </div>
  );
}

/* Phase 1's supplied sparkline artwork (Candidates by Track, Platform earnings). */
export const SPARK: Record<string, { vb: string; d: string }> = {
  Explorer: { vb: "0 0 146 104", d: "M1.5 102.434L18.7432 85.6119L26.1028 66.6867L37.0373 93.3923L44.3971 80.7755L52.1775 1.5L72.154 79.0934L86.6634 53.2289L114.42 102.434L123.042 90.0279L128.299 69.4205L144.49 53.2289" },
  Builder: { vb: "0 0 148 120", d: "M1.50024 118.416L21.2668 107.271L27.5748 89.1868L36.6168 97.5979L63.3223 1.5L78.4625 73.2054L92.9718 40.8223L113.369 89.1868L123.462 74.4671L131.453 80.1447L146.383 46.9204" },
  Trailblazer: { vb: "0 0 147 107", d: "M1.5 104.591L18.7393 89.42L25.2905 61.8373L34.5996 72.8706L63.9063 47.3565L73.905 1.50012L89.7651 64.5957L113.21 1.50012L120.106 75.9735L129.415 44.5982L144.586 69.4227" },
};
/* the two earnings streams, Maryam's supplied green artwork */
export const EARN_SPARK: Record<string, { vb: string; d: string }> = {
  course: { vb: "0 0 95 25", d: "M1.5 23.5L12.5943 19.8334L17.3294 15.7083L24.3647 21.5292L29.1 18.7792L34.1059 1.5L46.9588 18.4126L56.2941 12.775L74.1529 23.5L79.7 20.7959L83.0824 16.3042L93.5 12.775" },
  iv: { vb: "0 0 92 26", d: "M1.5 18.5021L12.5943 14.8354L17.3294 10.7104L22.5 20.5L29.1 13.7813L33 3.5L46.9588 13.4146L57 24.5L65 11.3063L79.7 15.798L83.0824 11.3063L90 1.5" },
};
export const EarnSpark = ({ k }: { k: "course" | "iv" }) => (
  <svg className={s.earnSpark} viewBox={EARN_SPARK[k].vb} fill="none" aria-hidden="true"><path d={EARN_SPARK[k].d} /></svg>
);
export const Spark = ({ k, className }: { k: string; className?: string }) => (
  <svg className={className} viewBox={SPARK[k].vb} fill="none" aria-hidden="true"><path d={SPARK[k].d} className={s.spark} /></svg>
);
