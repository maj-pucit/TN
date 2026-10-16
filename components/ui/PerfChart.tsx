"use client";
import { useState } from "react";
import s from "./perf.module.css";
import { Text } from "../primitives/Text";
import { Button } from "./Button";
import { Modal } from "./Modal";
import { Sparkle } from "./Sparkle";

/* <PerfChart> — assessment score by chapter against an average line.
   Geometry is Phase 1's: viewBox 900×180, x from 40 to 890 across `count`
   chapters, y = 156 − 1.44 × score. */
/* The legend. On Course Progress it rides the section heading's right end
   (Phase 1 .perf-leg); `legend={false}` on the chart leaves it to the caller. */
export function PerfLegend({ avgLabel }: { avgLabel: string }) {
  return (
    <div className={`${s.leg} t-label`}>
      <span className={s.lg}><i className={s.lgL} />Your score</span>
      <span className={s.lg}><i className={s.lgD} />{avgLabel}</span>
    </div>
  );
}

export function PerfChart({ scores, count, avg, avgLabel, average, insight, names, legend = true }: {
  scores: number[]; count: number; avg: number; avgLabel: string; average?: number;
  insight?: string; names: string[]; legend?: boolean;
}) {
  const [sheet, setSheet] = useState(false);
  const x = (i: number) => 40 + (850 * i) / (count - 1);
  const y = (v: number) => 156 - 1.44 * v;
  const lo = scores.length ? scores.indexOf(Math.min(...scores)) : -1;
  const hi = scores.length ? scores.indexOf(Math.max(...scores)) : -1;
  const last = scores.length - 1;
  /* The callout sits right of the latest point, or flips left when the point
     is near the chart's right edge (Day 90's last chapter is AT the edge). */
  const CAL_W = 128;
  const calX = last < 0 ? 0 : x(last) + 12 + CAL_W <= 900 ? x(last) + 12 : x(last) - 12 - CAL_W;
  const r = 9, c = 2 * Math.PI * r;
  return (
    <div>
      {legend && <div className={s.legTop}><PerfLegend avgLabel={avgLabel} /></div>}
      <div className={s.plot}>
        <svg viewBox="0 0 900 180" role="img" aria-label={`Assessment score by chapter. ${avgLabel}.`}>
          {[0, 20, 40, 60, 80, 100].map((v) => (
            <g key={v}>
              <line className={s.grid} x1={40} x2={890} y1={y(v)} y2={y(v)} strokeWidth={1} />
              <text className={s.axis} x={30} y={y(v) + 4} textAnchor="end">{v}%</text>
            </g>
          ))}
          <line className={s.avg} x1={40} x2={890} y1={y(avg)} y2={y(avg)} strokeWidth={1} />
          {scores.length > 1 && <path className={s.line} strokeWidth={2} d={scores.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ")} />}
          {scores.map((v, i) => (
            <g key={i}>
              {(i === lo || i === hi) && <circle className={i === lo ? s.halo : s.haloHi} cx={x(i)} cy={y(v)} r={9} />}
              <circle className={`${s.dot} ${i === lo ? s.lo : ""}`} cx={x(i)} cy={y(v)} r={4} strokeWidth={1.5} />
            </g>
          ))}
          {Array.from({ length: count }, (_, i) => <text key={i} className={s.axis} x={x(i)} y={174} textAnchor="middle">{i + 1}</text>)}
          {average !== undefined && last >= 0 && (
            <g className={s.cal}>
              <rect x={calX} y={12} width={CAL_W} height={34} />
              <circle className={s.calTrk} cx={calX + 17} cy={29} r={r} strokeWidth={2.5} />
              <circle className={s.calArc} cx={calX + 17} cy={29} r={r} strokeWidth={2.5}
                strokeDasharray={`${(c * average) / 100} ${c}`} transform={`rotate(-90 ${calX + 17} 29)`} />
              <text className={s.calL} x={calX + 34} y={27}>Average score</text>
              <text className={s.calV} x={calX + 34} y={41}>{average}%</text>
            </g>
          )}
        </svg>
      </div>
      {insight && (
        <div className={s.foot}>
          <div className={s.ins}>
            <Sparkle className={s.insMk} />
            <span className={s.insB}><Text role="label" as="span" strong ink="primary">Key insight</Text><Text role="desc" as="span">{insight}</Text></span>
          </div>
          <Button kind="text" size="sm" onClick={() => setSheet(true)}>View Scores</Button>
        </div>
      )}
      {sheet && (
        <Modal label="Assessment scores" onClose={() => setSheet(false)} footer={<Button kind="secondary" onClick={() => setSheet(false)}>Close</Button>}>
          <Text role="h3">Assessment scores</Text>
          <div className={s.rows}>
            {scores.map((v, i) => (
              <div key={i} className={s.row}>
                <Text role="compact" as="span">Chapter {i + 1} · {names[i]}</Text>
                <Text role="compact" as="span" strong>{v}%</Text>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}
