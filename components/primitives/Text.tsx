import type { ElementType, ReactNode } from "react";

/* THE ONLY WAY TO SET TYPE. A role maps to one class in styles/base.css,
   which reads the --t-<role>-* tokens. Change a role there, every screen moves. */
export type Role =
  | "display" | "page" | "h1" | "h2" | "h3" | "h4" | "sec" | "sec-lg"
  | "body" | "compact" | "desc" | "label" | "eyebrow" | "caption";

const TAG: Partial<Record<Role, ElementType>> = {
  display: "p", page: "h1", h1: "h1", h2: "h2", h3: "h3", h4: "h4", sec: "h2", "sec-lg": "h2",
  body: "p", compact: "p", desc: "p", label: "span", eyebrow: "p", caption: "p",
};

export function Text({
  role, as, strong, ink, children, className = "",
}: {
  role: Role;
  as?: ElementType;
  strong?: boolean;
  ink?: "primary" | "secondary" | "accent";
  children: ReactNode;
  className?: string;
}) {
  const Tag = as ?? TAG[role] ?? "p";
  const cls = [`t-${role}`, strong && "w-strong", ink && `ink-${ink}`, className].filter(Boolean).join(" ");
  return <Tag className={cls}>{children}</Tag>;
}
