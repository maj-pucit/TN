"use client";
import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Text } from "../primitives";
import { Field, Input } from "../ui/Field";
import { Button } from "../ui/Button";
import { Accordion } from "../ui/Accordion";
import { Tabs } from "../ui/Tabs";
import { Icon } from "../Icon";
import { Scene } from "../shell/Scene";
import { LOGO_SVG } from "@/lib/icons";
import { useDemo } from "@/lib/demo";
import { LEGAL, LEGAL_META } from "@/data/profile";
import s from "./auth.module.css";

/* ============================================================
   /auth/<screen>/ — the candidate's front door, copied from Phase 1's
   AUTH screens as they render (15 Oct 2026):
     create  Set Your Password → Log In
     login   Log In → the Just joined dashboard (the Tal onboarding is hidden, 19 Oct 2026)
     forgot  Reset Password → Continue ("Sending…") → reset
     reset   Set New Password → Log In
     terms   the legal notices
   ============================================================ */
const EMAIL = "maryam.naz@tkxel.io";

export function AuthScreen({ screen }: { screen: string }) {
  return (
    <Scene>
      <div className={s.wrap}>
        <Brand />
        <div className={s.col}>
          <div className={s.card}>
            <span className={s.mobLogo} dangerouslySetInnerHTML={{ __html: LOGO_SVG }} />
            {screen === "create" && <Create />}
            {screen === "login" && <Login />}
            {screen === "forgot" && <Forgot />}
            {screen === "reset" && <Reset />}
            {screen === "terms" && <Terms />}
          </div>
        </div>
      </div>
    </Scene>
  );
}

function Brand() {
  return (
    <aside className={s.brand}>
      <span className={`${s.slide} ${s.s1}`} /><span className={`${s.slide} ${s.s2}`} /><span className={`${s.slide} ${s.s3}`} />
      <span className={s.logo} dangerouslySetInnerHTML={{ __html: LOGO_SVG }} />
      <div className={s.copy}>
        <Text role="h2" className={s.welcome}>Welcome to TALENTnext</Text>
        <Text role="body" className={s.lede}>An AI-native platform that grows your leadership, one level at a time.</Text>
        <div className={s.foot}>
          <Text role="caption" as="span" className="on-dark">© 2026 TALENTnext Limited</Text>
          <span className={s.bars} aria-hidden="true"><i className={s.bar} /><i className={s.bar} /><i className={s.bar} /></span>
        </div>
      </div>
    </aside>
  );
}

const Head = ({ title, desc, back }: { title: string; desc: string; back?: string }) => (
  <div className={s.head}>
    {back && <Link href={back} className={s.back} aria-label="Back"><Icon name="arrowLeft" /></Link>}
    <Text role="h1">{title}</Text>
    <Text role="desc">{desc}</Text>
  </div>
);

function Pw({ label, placeholder, value }: { label: string; placeholder?: string; value?: string }) {
  const [show, setShow] = useState(false);
  return (
    <Field label={label}>
      <span className={s.pw}>
        <Input type={show ? "text" : "password"} placeholder={placeholder} defaultValue={value} />
        <button type="button" className={s.eye} aria-label={show ? "Hide password" : "Show password"} onClick={() => setShow((x) => !x)}>
          <Icon name={show ? "viewOff" : "view"} />
        </button>
      </span>
    </Field>
  );
}

function Create() {
  const [terms, setTerms] = useState(false);
  const [rec, setRec] = useState(false);
  return (
    <>
      <Head title="Set Your Password" desc="Create a password to activate your account." />
      <div className={s.id}>
        <Text role="label" as="span">Your Email Address</Text>
        <span className={s.idRow}><Text role="body" as="span" strong>{EMAIL}</Text><Link href="/auth/login/" className={`${s.notYou} t-label`}>Not you?</Link></span>
      </div>
      <Pw label="Password" value="Talentnext1!" />
      <Pw label="Confirm Password" placeholder="Re-enter password" />
      <div className={s.cbxs}>
        <label className={`${s.cbx} t-label`}>
          <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
          <span>I accept the <Link href="/auth/terms/">Terms of Service</Link> and <Link href="/auth/terms/">Privacy Policy</Link>.</span>
        </label>
        <label className={`${s.cbx} t-label`}>
          <input type="checkbox" checked={rec} onChange={(e) => setRec(e.target.checked)} />
          <span>I consent to my interviews being recorded and transcribed.</span>
        </label>
      </div>
      <div><Button kind="primary" go disabled={!terms || !rec} href={terms && rec ? "/auth/login/" : undefined}>Set Password</Button></div>
    </>
  );
}

function Login() {
  const router = useRouter();
  const { setStage } = useDemo();
  return (
    <>
      <Head title="Log In" desc="Enter your credentials to access your account." />
      <Field label="Email Address"><Input type="email" placeholder="Enter your email address" defaultValue={EMAIL} /></Field>
      <div>
        <Pw label="Password" placeholder="Enter your password" value="Talentnext1!" />
        <Link href="/auth/forgot/" className={`${s.link} t-label`}>Forgot Password?</Link>
      </div>
      <label className={`${s.cbx} t-label`}><input type="checkbox" defaultChecked /> <span>Remember me</span></label>
      <div><Button kind="primary" go onClick={() => { setStage("new"); router.push("/candidate/?stage=new"); }}>Log In</Button></div>
      <Text role="body" className={s.alt}>New to TALENTnext? <a href="https://web-puce-six-27.vercel.app/new/get-started" target="_blank" rel="noopener">Sign up</a></Text>
    </>
  );
}

function Forgot() {
  const router = useRouter();
  const [sending, setSending] = useState(false);
  return (
    <>
      <Head title="Reset Password" desc="Enter your email address to receive instructions to reset your password." back="/auth/login/" />
      <Field label="Email address"><Input type="email" defaultValue={EMAIL} /></Field>
      <div>
        <Button kind="primary" go disabled={sending} onClick={() => { setSending(true); setTimeout(() => router.push("/auth/reset/"), 900); }}>
          {sending ? "Sending..." : "Continue"}
        </Button>
      </div>
    </>
  );
}

function Reset() {
  return (
    <>
      <Head title="Set New Password" desc="Create a new password for your account." back="/auth/login/" />
      <Pw label="Password" placeholder="Enter new password" />
      <Pw label="Confirm Password" placeholder="Re-enter new password" />
      <div><Button kind="primary" go href="/auth/login/">Update Password</Button></div>
    </>
  );
}

function Terms() {
  const [tab, setTab] = useState("terms");
  const doc = LEGAL.find((l) => l.key === tab)!;
  return (
    <>
      <Head title={doc.title} desc={LEGAL_META} back="/auth/create/" />
      <Tabs value={tab} onChange={setTab} items={LEGAL.map((l) => ({ key: l.key, label: l.title }))} />
      {doc.short && <Text role="body" ink="secondary">{doc.short}</Text>}
      <Accordion items={doc.sections.map(([t, b]) => ({ title: t, body: <Text role="body" ink="secondary">{b}</Text> as ReactNode }))} />
    </>
  );
}
