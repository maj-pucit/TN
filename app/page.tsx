"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

/* The site root opens on the product's front door, the Log In screen.
   (A portal-picker page lived here while Phase 0 was being built; Maryam
   removed it, 15 Oct 2026. Portals switch from the account menu.) */
export default function Home() {
  const router = useRouter();
  useEffect(() => { router.replace("/auth/login/"); }, [router]);
  return null;
}
