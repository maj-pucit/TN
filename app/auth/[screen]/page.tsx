import { notFound } from "next/navigation";
import { AuthScreen } from "@/components/auth/Auth";
import { AUTH_SCREENS } from "@/data/auth";

export const dynamicParams = false;
export function generateStaticParams() {
  return AUTH_SCREENS.map((screen) => ({ screen }));
}

export default async function Page({ params }: { params: Promise<{ screen: string }> }) {
  const { screen } = await params;
  if (!AUTH_SCREENS.includes(screen)) notFound();
  return <AuthScreen screen={screen} />;
}
