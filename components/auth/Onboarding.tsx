"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Text } from "../primitives";
import { Button } from "../ui/Button";
import { Dropdown } from "../ui/Dropdown";
import { Input } from "../ui/Field";
import { Icon } from "../Icon";
import { Scene } from "../shell/Scene";
import { TalOrb, TnLoader } from "../ui/TalOrb";
import { LOGO_SVG } from "@/lib/icons";
import { useDemo } from "@/lib/demo";
import { OB_Q, OB_WELCOME, OB_DONE } from "@/data/onboarding";
import s from "./onboarding.module.css";

/* /onboarding/ — Phase 1 ob.js: welcome → 2s loader → five questions →
   "You're all set" → "Find an Agent" → 2s loader → the dashboard. Tal's
   mark is the LIVE orb on every onboarding screen, as in Phase 1. */
export function Onboarding() {
  const router = useRouter();
  const { setStage } = useDemo();
  const [step, setStep] = useState(0);           // 0 welcome, 1..5 questions, 6 done
  const [loading, setLoading] = useState(false);
  const [ans, setAns] = useState<Record<string, string>>({});
  const N = OB_Q.length;

  useEffect(() => {
    if (new URLSearchParams(location.search).get("load")) {
      setLoading(true);
      const t = setTimeout(() => setLoading(false), 2000);
      return () => clearTimeout(t);
    }
  }, []);
  const load = (then: () => void) => { setLoading(true); setTimeout(() => { setLoading(false); then(); }, 2000); };
  const q = step >= 1 && step <= N ? OB_Q[step - 1] : null;
  const ready = !q ? true : q.t === "dd" ? !!ans[q.k] && (ans[q.k] !== "other" || !!ans[`${q.k}-other`]) : !!ans[q.k]?.trim();
  const pct = step === 0 ? 0 : step > N ? 100 : ((step - 1) / N) * 100;

  return (
    <Scene>
      <div className={s.ob}>
        {loading ? (
          <div className={s.loader}><TnLoader /></div>
        ) : step === 0 ? (
          <>
            <div className={s.top}><span className={s.logo} dangerouslySetInnerHTML={{ __html: LOGO_SVG }} /></div>
            <div className={s.welcome}>
              <div className={s.col}>
                <TalOrb size={144} live className={s.orb} />
                <p className={s.hello}>{OB_WELCOME.title}</p>
                {OB_WELCOME.lede.map((l) => <p key={l} className={s.lede}>{l}</p>)}
                <button type="button" className={`${s.go} t-h3`} onClick={() => load(() => setStep(1))}>Let’s Get Started</button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={s.bar}><div className={s.fill} style={{ "--w": `${pct}%` } as React.CSSProperties} /></div>
            <div className={s.top}>
              <span className={s.logo} dangerouslySetInnerHTML={{ __html: LOGO_SVG }} />
              {q && <Text role="desc" as="span">You’re almost there!</Text>}
            </div>
            <div className={s.main}>
              <div className={s.wrap}>
                <TalOrb size={52} live className={s.orb} />
                {q ? (
                  <>
                    <h1 className={s.title}>{q.q}</h1>
                    {q.t === "radio" && (
                      <div className={s.opts} role="radiogroup">
                        {q.o.map(([k, l]) => (
                          <button key={k} role="radio" aria-checked={ans[q.k] === k} className={`${s.opt} ${ans[q.k] === k ? s.on : ""}`} onClick={() => setAns((a) => ({ ...a, [q.k]: k }))}>
                            <span className={s.radio} /><Text role="body" as="span">{l}</Text>
                          </button>
                        ))}
                      </div>
                    )}
                    {q.t === "text" && <div className={s.field}><Input value={ans[q.k] ?? ""} placeholder={q.ph} onChange={(e) => setAns((a) => ({ ...a, [q.k]: e.target.value }))} /></div>}
                    {q.t === "dd" && (
                      <div className={s.field}>
                        <Dropdown variant="form" placeholder="Select your industry" value={ans[q.k]} onChange={(v) => setAns((a) => ({ ...a, [q.k]: v }))}
                          options={q.o.map(([value, label]) => ({ value, label }))} />
                        {ans[q.k] === "other" && <Input value={ans[`${q.k}-other`] ?? ""} placeholder={q.ph} onChange={(e) => setAns((a) => ({ ...a, [`${q.k}-other`]: e.target.value }))} />}
                      </div>
                    )}
                    <div className={s.foot}>
                      {step > 1 && <span className={s.prev}><Button kind="secondary" icon="arrowLeft" onClick={() => setStep(step - 1)}>Previous</Button></span>}
                      <Button kind="primary" go disabled={!ready} onClick={() => setStep(step + 1)}>Next</Button>
                    </div>
                  </>
                ) : (
                  <>
                    <h1 className={s.title}>{OB_DONE.title}</h1>
                    <Text role="desc" className={s.sub}>{OB_DONE.lede}</Text>
                    <div className={s.plan}>
                      <div className={s.planH}><span className={s.planT}>Your journey</span><span className={s.planN}>Step 2 of 4</span></div>
                      {OB_DONE.steps.map(([t, d, st]) => (
                        <div key={t} className={`${s.row} ${st ? s[st] : ""}`}>
                          <Icon name={st === "done" ? "checkFilled" : st === "on" ? "hourglass" : "circle"} />
                          <span className={s.rowB}><span className={s.rowL}>{t}</span><span className={s.rowD}>{d}</span></span>
                        </div>
                      ))}
                    </div>
                    <div className={s.foot}>
                      <Button kind="primary" go onClick={() => load(() => { setStage("new"); router.push("/candidate/"); })}>Find an Agent</Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Scene>
  );
}
