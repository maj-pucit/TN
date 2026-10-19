"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDemo } from "@/lib/demo";

/* The Tal onboarding is HIDDEN (Maryam 19 Oct 2026): its questions are asked before the
   candidate reaches the product, so Log In lands on the "Just joined" dashboard. A stray
   link here goes there too. The flow is kept whole in components/auth/Onboarding.tsx;
   to restore it, render <Onboarding /> here again and put "onboard" back in STAGES. */
export default function Page() {
  const router = useRouter();
  const { setStage } = useDemo();
  useEffect(() => { setStage("new"); router.replace("/candidate/?stage=new"); }, [router, setStage]);
  return null;
}
