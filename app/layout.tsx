import type { Metadata } from "next";
import "@/styles/tokens.css";
import "@/styles/base.css";
import "@/styles/orb.css";
import { DemoProvider } from "@/lib/demo";

export const metadata: Metadata = {
  title: "TalentNext · Phase 0",
  description: "TalentNext Phase 0 prototype: Candidate, Talent Agent and Super Admin portals on one design system.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <DemoProvider>{children}</DemoProvider>
      </body>
    </html>
  );
}
