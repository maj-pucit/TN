import { notFound } from "next/navigation";
import { NilScreenView } from "@/components/nil/Nil";
import { NIL_SCREENS, type NilScreen } from "@/data/nil";

export const dynamicParams = false;
export function generateStaticParams() {
  return NIL_SCREENS.map((screen) => ({ screen }));
}

export default async function Page({ params }: { params: Promise<{ screen: string }> }) {
  const { screen } = await params;
  if (!(NIL_SCREENS as readonly string[]).includes(screen)) notFound();
  return <NilScreenView screen={screen as NilScreen} />;
}
