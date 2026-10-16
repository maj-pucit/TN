import Link from "next/link";
import type { ReactNode } from "react";
import s from "./ui.module.css";
import { Icon } from "../Icon";
import type { IconName } from "@/lib/icons";

type Kind = "primary" | "accent" | "secondary" | "ghost" | "text" | "link" | "danger" | "dangerInk" | "dangerText" | "onDark";

/* One button. A leading `icon` sits before the words; `go` adds the trailing arrow
   (a quiet button that takes you to a page). `href` renders a link. */
export function Button({
  kind = "primary", icon, iconEnd, go, href, external, onClick, disabled, size, full, asIs, children, label, type = "button",
}: {
  kind?: Kind; icon?: IconName; iconEnd?: IconName; go?: boolean; href?: string; external?: boolean; onClick?: () => void;
  disabled?: boolean; size?: "sm"; full?: boolean; asIs?: boolean; children?: ReactNode;
  /* `label` names an ICON-ONLY button (no children): a square at the button's own height. */
  label?: string; type?: "button" | "submit";
}) {
  const cls = [s.btn, s[kind], size === "sm" && s.sm, full && s.full, asIs && s.asIs, !children && s.iconOnly].filter(Boolean).join(" ");
  const inner = (
    <>
      {icon && <Icon name={icon} />}
      {children && <span>{children}</span>}
      {iconEnd && <Icon name={iconEnd} />}
      {go && <Icon name="arrowRight" />}
    </>
  );
  if (href && external) return <a href={href} className={cls} target="_blank" rel="noopener noreferrer">{inner}</a>;
  return href ? (
    <Link href={href} className={cls}>{inner}</Link>
  ) : (
    <button type={type} className={cls} onClick={onClick} disabled={disabled} aria-label={label}>{inner}</button>
  );
}
