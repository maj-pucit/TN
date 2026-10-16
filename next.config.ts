import type { NextConfig } from "next";

/* Static export: Vercel (or any static host) serves `out/`. No server code in Phase 0. */
const BUILD = !!process.env.P0_BUILD;

const nextConfig: NextConfig = {
  /* THE BUILD AND THE DEV SERVER MUST NOT SHARE A FOLDER (15 Oct 2026).
     With `output: "export"`, Next treats `distDir` as the EXPORT folder and
     still writes the build's working files into `.next` — so giving the
     build its own distDir protected nothing, and every `npm run build`
     overwrote the running dev server's `.next` (500s, "Cannot find module").
     So the DEV server gets its own folder (`.next-dev`), and the build uses
     `.next` for its working files and exports to `out/`.
     Static export is build-only: in dev it made stray requests (favicon)
     error inside the [portal] route. */
  ...(BUILD ? { output: "export" as const } : { distDir: ".next-dev" }),
  trailingSlash: true,
  images: { unoptimized: true },
  devIndicators: false,
};

export default nextConfig;
