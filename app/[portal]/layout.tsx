import { notFound } from "next/navigation";
import { AppShell } from "@/components/shell/AppShell";
import { PORTALS, type PortalKey } from "@/lib/portals";

export const dynamicParams = false;

export function generateStaticParams() {
  return (Object.keys(PORTALS) as PortalKey[]).map((portal) => ({ portal }));
}

export default async function PortalLayout({ children, params }: { children: React.ReactNode; params: Promise<{ portal: string }> }) {
  const { portal } = await params;
  if (!(portal in PORTALS)) notFound();
  return <AppShell portal={portal as PortalKey}>{children}</AppShell>;
}
