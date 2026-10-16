"use client";
import { useRef, type KeyboardEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "../Icon";
import { Scene } from "../shell/Scene";
import { useDemo } from "@/lib/demo";
import { NIL_FIELDS, NIL_NAV, NIL_RESULT, NIL_SOCIAL, type NilScreen } from "@/data/nil";
import s from "./nil.module.css";

/* /nil/<screen>/ — the Next in Leadership run-up (Phase 1 nil.js). Another
   company's page, so it wears its own brand (navy + lime, a condensed display
   face) from the `--nil-*` tokens and none of the product's type roles.
   quiz → phone → result → "Continue your journey" → Create Account. */
export function NilScreenView({ screen }: { screen: NilScreen }) {
  const router = useRouter();
  const { setStage } = useDemo();
  const go = (to: NilScreen) => router.push(`/nil/${to}/`);
  const toSignup = () => { setStage("signup"); router.push("/auth/create/"); };

  return (
    <Scene>
      <div className={s.nil}>
        <NilBar />
        <div className={s.scroll}>
          {screen === "quiz" && <Quiz onNext={() => go("phone")} />}
          {screen === "phone" && <Phone onBack={() => go("quiz")} onNext={() => go("result")} />}
          {screen === "result" && <Result onContinue={toSignup} />}
        </div>
      </div>
    </Scene>
  );
}

/* The site bar. A stand-in drawing of the NIL mark (the real asset is not in
   the repo): the bubble outline, the name on two lines, the second reversed
   out of a lime bar. The nav words are spans: none of them leads anywhere. */
function NilBar() {
  return (
    <header className={s.bar}>
      <svg className={s.logo} viewBox="0 0 98 58" role="img" aria-label="Next in Leadership">
        <path className={s.logoLine} d="M3 3h92v40H64l-9.5 13-1.5-13H3Z" />
        <text className={s.logoLime} x="11" y="24" fontSize="18">NEXT IN</text>
        <rect className={s.logoFill} x="10" y="28" width="72" height="13" />
        <text className={s.logoNavy} x="13" y="38" fontSize="10.5" letterSpacing=".9">LEADERSHIP</text>
      </svg>
      <nav className={s.nav} aria-label="Next in Leadership">
        {NIL_NAV.map((x) => <span key={x}>{x}</span>)}
      </nav>
      <span className={s.cta}>What’s Next Quiz <Icon name="arrowRight" /></span>
    </header>
  );
}

function Card({ pill, title, children }: { pill: string; title: string; children: ReactNode }) {
  return (
    <div className={s.wrap}>
      <div className={s.card}>
        <p className={s.eyebrow}>What’s Next Quiz</p>
        <span className={s.pill}>{pill}</span>
        <h1 className={s.h1}>{title}</h1>
        {children}
        <p className={s.priv}>We respect your privacy. Unsubscribe anytime.</p>
      </div>
    </div>
  );
}

function Quiz({ onNext }: { onNext: () => void }) {
  return (
    <Card pill="Final step" title="Where should we send your results and resources?">
      <div className={s.grid}>
        {NIL_FIELDS.map((f) => (
          <div key={f.id} className={`${s.f} ${f.span ? s.span2 : ""}`}>
            <label htmlFor={`nq-${f.id}`}>{f.label}<span className={s.req} aria-hidden="true">*</span></label>
            <input id={`nq-${f.id}`} type={f.type} placeholder={f.ph} required aria-required="true" />
          </div>
        ))}
      </div>
      <div className={s.acts}>
        {/* The run-up starts here, so Back is drawn (it is their page) but disabled. */}
        <button className={`${s.btn} ${s.ghost}`} disabled><Icon name="arrowLeft" /> Back</button>
        <button className={s.btn} onClick={onNext}>Get my results <Icon name="arrowRight" /></button>
      </div>
    </Card>
  );
}

function Phone({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const boxes = useRef<(HTMLInputElement | null)[]>([]);
  /* typing carries the caret forward; Backspace on an empty box steps back */
  const onInput = (i: number, el: HTMLInputElement) => {
    el.value = el.value.replace(/\D/g, "").slice(0, 1);
    if (el.value) boxes.current[i + 1]?.focus();
  };
  const onKey = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Backspace" || e.currentTarget.value) return;
    const p = boxes.current[i - 1];
    if (p) { p.focus(); p.value = ""; e.preventDefault(); }
  };
  return (
    <Card pill="Verify your number" title="Enter the 6-digit code we sent you">
      <p className={s.sub}>
        We texted a verification code to <b>(555) 123-4567</b>. Enter it below and we will send your results straight through.
        Wrong number? <button className={s.lnk} onClick={onBack}>Change it</button>.
      </p>
      <div className={s.otp} role="group" aria-label="6-digit verification code">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <input key={i} ref={(el) => { boxes.current[i] = el; }} inputMode="numeric" autoComplete="one-time-code"
            maxLength={1} size={1} aria-label={`Digit ${i + 1} of 6`}
            onInput={(e) => onInput(i, e.currentTarget)} onKeyDown={(e) => onKey(i, e)} />
        ))}
      </div>
      <p className={s.resend}>Didn’t get it? <b>Resend code in 0:40</b></p>
      <div className={s.acts}>
        <button className={`${s.btn} ${s.ghost}`} onClick={onBack}><Icon name="arrowLeft" /> Back</button>
        <button className={s.btn} onClick={onNext}>Verify &amp; continue <Icon name="arrowRight" /></button>
      </div>
    </Card>
  );
}

function Result({ onContinue }: { onContinue: () => void }) {
  const r = NIL_RESULT;
  return (
    <>
      <div className={`${s.wrap} ${s.wide}`}>
        <div className={s.res}>
          <div className={s.tab}>Quiz results</div>
          <div className={s.resGrid}>
            <div className={s.you}>
              <div className={s.youHead}>
                <p className={s.hey}>{r.hey}</p>
                <p className={s.type}>{r.type}</p>
              </div>
              <div className={s.youBody}>
                <h3 className={s.h3}>{r.title}</h3>
                <p className={s.para}>{r.body}</p>
                <div className={s.grp}>
                  <h3 className={s.h3}>Characteristics of a {r.type}</h3>
                  <ul className={s.ticks}>
                    {r.traits.map((t) => <li key={t}><Icon name="checkFilled" /><span>{t}</span></li>)}
                  </ul>
                </div>
              </div>
            </div>
            <div className={s.side}>
              <div className={s.box}>
                <h2 className={s.h2}>Career ideas</h2>
                <ul className={s.ideas}>
                  {r.ideas.map(([ic, role, what]) => <li key={role}><Icon name={ic} /><span>{role} – {what}</span></li>)}
                </ul>
              </div>
              <div className={s.box}>
                <h2 className={s.h2}>Your next step</h2>
                <p className={s.boxP}>{r.next}</p>
              </div>
              <div className={s.steps}>
                {/* Playbook and Toolkit are drawn without an affordance: only Continue is wired. */}
                <span className={s.step}><span className={s.stepL}><Icon name="book" /><span>Builder Playbook</span></span><Icon name="arrowRight" /></span>
                <span className={s.step}><span className={s.stepL}><Icon name="work" /><span>Builder Toolkit</span></span><Icon name="arrowRight" /></span>
                <button className={`${s.step} ${s.live}`} onClick={onContinue}>
                  <span className={s.stepL}><Icon name="chat" /><span>Continue your journey on TALENTnext</span></span><Icon name="arrowRight" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className={s.share}>
          <em>{r.share}</em>
          <span className={s.sharePill}>
            Share &nbsp;–&nbsp;
            {(["ig", "li", "yt"] as const).map((k) => <svg key={k} viewBox="0 0 24 24" aria-hidden="true"><path d={NIL_SOCIAL[k]} /></svg>)}
          </span>
        </div>
      </div>
      {/* a rule made of a word: full frame width, clipped at both ends */}
      <div className={s.band} aria-hidden="true">
        {Array.from({ length: 18 }, (_, i) => <span key={i}>{r.type}</span>)}
      </div>
    </>
  );
}
