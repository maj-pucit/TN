"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import s from "./shell.module.css";
import c from "./chrome.module.css";
import { Icon } from "../Icon";
import { Text } from "../primitives/Text";
import { Confirm } from "../ui/Confirm";
import { PORTALS, STAGES, ACCOUNT_PAGES, href, resolve, type PortalKey, type NavItem } from "@/lib/portals";
import { useDemo, type Frame } from "@/lib/demo";
import { useCrumb } from "@/lib/crumb";
import { LOGO_SVG, TN_MARK } from "@/lib/icons";

/* ============================================================
   APP SHELL — one shell, three portals. Bar, rail, account menu,
   logout confirm, and the prototype frame around it. Everything a
   portal differs by is data in lib/portals.ts.
   ============================================================ */
export function AppShell({ portal, children }: { portal: PortalKey; children: ReactNode }) {
  const P = PORTALS[portal];
  const path = usePathname();
  const router = useRouter();
  const { stage, frame, ui, setUi } = useDemo();
  const [open, setOpen] = useState(false);
  const [acct, setAcct] = useState(false);
  const [logoutS, setLogoutS] = useState(false);
  const logout = logoutS || !!ui.logout;
  const setLogout = (v: boolean) => { setLogoutS(v); if (!v) setUi({ logout: undefined }); };
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 50); return () => clearTimeout(t); }, []);

  const slug = path.split("/").filter(Boolean).slice(1);
  const { title } = resolve(portal, slug);
  const crumb = useCrumb();
  const backSlug = crumb ? crumb.back.split("/").filter(Boolean).slice(1) : [];
  const parent = crumb ? (backSlug.length ? resolve(portal, backSlug).title : "Dashboard") : "";
  const visible = (n: NavItem) => portal !== "candidate" || !n.stages || n.stages.includes(stage);
  const main = P.nav.filter((n) => !n.foot && visible(n));
  const foot = P.nav.filter((n) => n.foot);

  // A phone-width frame starts with the drawer shut; navigating shuts it.
  useEffect(() => { setAcct(false); if (frame !== "desktop") setOpen(false); }, [path, frame]);

  const others = (Object.keys(PORTALS) as PortalKey[]).filter((k) => k !== portal);
  const effFrame: Frame = P.desktopOnly ? "desktop" : frame;

  const railItem = (n: NavItem) => {
    const on = slug[0] === n.key || (!n.key && slug.length === 0);
    const link = (
      <Link href={href(portal, n.key, n.subs?.[0].key ?? "")} className={`${s.item} ${on ? s.on : ""}`} title={n.title}>
        <Icon name={n.icon} />
        <span className={`${s.label} t-compact w-strong`}>{n.title}</span>
        {n.subs && <span className={`${s.chev} ${on ? s.up : ""}`}><Icon name="chevDown" /></span>}
      </Link>
    );
    if (!n.subs) return <li key={n.key || "home"}>{link}</li>;
    return (
      <li key={n.key} className={s.node}>
        {link}
        {/* Open rail: subs show under the current module. Collapsed rail: flyout on hover. */}
        <ul className={s.subs} hidden={open && !on}>
          {n.subs.map((x) => (
            <li key={x.key}>
              <Link href={href(portal, n.key, x.key)} className={`${s.sub} ${on && slug[1] === x.key ? s.on : ""} t-compact w-strong`}>
                {x.title}
              </Link>
            </li>
          ))}
        </ul>
      </li>
    );
  };

  return (
    <div className={`${c.stage} ${c[effFrame]}`}>
      <div className={c.device} data-ready={ready || undefined}>
        <div className={`${s.app} app-root ${portal === "admin" ? s.admin : ""}`} data-portal={portal}>
          <header className={s.bar}>
            {/* Phase 1 nav-t: the shut rail shows the TN mark, which turns into the
                menu glyph on hover (≥900; below it is the menu glyph). The open
                drawer shows the TALENTnext wordmark with the close X at its end. */}
            <div className={s.navCell} data-open={open}>
              {open && (
                <Link href={href(portal)} className={s.brand} aria-label="TalentNext home">
                  <span dangerouslySetInnerHTML={{ __html: LOGO_SVG }} />
                </Link>
              )}
              <button className={s.navToggle} onClick={() => setOpen((o) => !o)} aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open}>
                {open ? <Icon name="close" /> : (
                  <>
                    <span className={s.navMark} dangerouslySetInnerHTML={{ __html: TN_MARK }} />
                    <span className={s.navMenu}><Icon name="menu" /></span>
                  </>
                )}
              </button>
            </div>
            {crumb ? (
              <nav className={s.crumbs} aria-label="Breadcrumb">
                <Link href={crumb.back} className={s.crumbP}>{parent}</Link>
                <span className={s.crumbSep}><Icon name="chevRight" /></span>
                <span className={s.crumbNow}>{crumb.title}</span>
              </nav>
            ) : <Text role="sec" as="p" className={s.barTitle}>{title}</Text>}
            <div className={s.barActs}>
              {/* No notifications in Phase 0, on any portal (Maryam 16 Oct 2026): the bell is gone. */}
              <div className={s.acct}>
                <button className={s.acctT} onClick={() => setAcct((a) => !a)} aria-expanded={acct} aria-haspopup="menu">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={P.person.img} alt="" />
                  <span className={s.acctId}>
                    <Text role="desc" as="span" strong ink="primary" className={s.acctN}>{P.person.name}</Text>
                    <Text role="label" as="span" ink="secondary" className={s.acctR}>{P.person.role}</Text>
                  </span>
                  <Icon name="chevDown" />
                </button>
                {acct && (
                  <div className={s.menu} role="menu">
                    {portal === "admin"
                      ? ACCOUNT_PAGES.admin.map((a) => (
                          <Link key={a.key} href={href(portal, a.key)} className={`${s.menuI} t-body`} role="menuitem">
                            <Icon name={a.key === "general" ? "settings" : "user"} />{a.title}
                          </Link>
                        ))
                      : (
                        <Link href={href(portal, "profile")} className={`${s.menuI} t-body`} role="menuitem">
                          <Icon name="user" />My Profile
                        </Link>
                      )}
                    <div className={s.menuSep} />
                    {others.map((k) => (
                      <Link key={k} href={href(k)} className={`${s.menuI} t-body`} role="menuitem">
                        {/* The portal's own person, as in Phase 1's account menu (Maryam 16 Oct 2026). */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={PORTALS[k].person.img} alt="" />Switch to {PORTALS[k].name}
                      </Link>
                    ))}
                    <div className={s.menuSep} />
                    <button className={`${s.menuI} t-body`} role="menuitem" onClick={() => { setAcct(false); setLogout(true); }}>
                      <Icon name="logout" />Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          <div className={s.body} data-open={open}>
            {open && <div className={s.scrim} onClick={() => setOpen(false)} />}
            <nav className={s.rail} aria-label="Main">
              <ul className={s.railMain}>{main.map(railItem)}</ul>
              <ul className={s.railFoot}>
                {foot.map(railItem)}
                <li>
                  <button className={s.item} onClick={() => setLogout(true)} title="Log out">
                    <Icon name="logout" />
                    <span className={`${s.label} t-compact w-strong`}>Log out</span>
                  </button>
                </li>
              </ul>
            </nav>
            <main className={s.main}>
              <div className={s.column}>{children}</div>
            </main>
            {/* The dock layer: sits over the content column only, so a bulk action bar
                centres on the content and stays 20px off its bottom while it scrolls. */}
            <div id="p0-dock" className={s.dockLayer} />
            <div id="p0-slider" className={s.sliderSlot} />
          </div>

          <div id="p0-modal" className={s.modalLayer} />
          {logout && (
            <Confirm
              icon="logout"
              title="Are you sure you want to log out?"
              desc="If you want to logout please confirm your action below"
              ok="Log Out"
              onCancel={() => setLogout(false)}
              onOk={() => { setLogout(false); router.push("/auth/login/"); }}
            />
          )}
        </div>
      </div>
      <DemoMenu portal={portal} />
    </div>
  );
}

export function DemoMenu({ portal }: { portal: PortalKey }) {
  const { stage, setStage, frame, setFrame } = useDemo();
  const router = useRouter();
  const pickStage = (st: string) => {
    setStage(st);
    /* The before-the-product stages are full-frame scenes, not portal pages. */
    if (st === "nil") router.push("/nil/quiz/");
    else if (st === "signup") router.push("/auth/create/");
    else if (st === "onboard") router.push("/onboarding/");
    /* Every other stage opens on the candidate's first page, the dashboard, wherever you were
       (Maryam 16 Oct 2026): a stage switch never keeps you on another stage's module. */
    else router.push(`/candidate/?stage=${st}`);
  };
  const [show, setShow] = useState(false);
  const locked = PORTALS[portal].desktopOnly;
  /* A click anywhere outside the panel and its button closes it, and so does Escape
     (Maryam 16 Oct 2026). */
  const panelRef = useRef<HTMLDivElement>(null);
  const fabRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!show) return;
    const away = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!panelRef.current?.contains(t) && !fabRef.current?.contains(t)) setShow(false);
    };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setShow(false); };
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("pointerdown", away); document.removeEventListener("keydown", esc); };
  }, [show]);
  return (
    <>
      {show && (
        <div className={c.panel} ref={panelRef}>
          <Text role="eyebrow">Prototype</Text>
          <div className={c.seg} role="group" aria-label="Frame">
            {(["mobile", "tablet", "desktop"] as Frame[]).map((f) => (
              <button key={f} aria-pressed={(locked ? "desktop" : frame) === f} disabled={locked && f !== "desktop"}
                onClick={() => setFrame(f)} className="t-label">
                {f[0].toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          {portal === "candidate" && (
            <label>
              <Text role="label" ink="secondary">Journey stage</Text>
              <select className={c.select} value={stage} onChange={(e) => pickStage(e.target.value)}>
                {STAGES.map((x) => <option key={x.key} value={x.key}>{x.title}</option>)}
              </select>
            </label>
          )}
          <div className={c.links}>
            {(Object.keys(PORTALS) as PortalKey[]).map((k) => (
              <Link key={k} href={href(k)} className="t-label" onClick={() => setShow(false)}>{PORTALS[k].name} portal</Link>
            ))}
          </div>
        </div>
      )}
      <button ref={fabRef} className={c.fab} onClick={() => setShow((v) => !v)} aria-label="Prototype menu">
        <Icon name="overflow" />
      </button>
    </>
  );
}
