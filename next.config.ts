import type { NextConfig } from "next";

// A static site: `next build` writes out/. NEXT_PUBLIC_BASE_PATH is set when it is served from a sub-path
// (GitHub Pages project sites: /pixmith-page).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const config: NextConfig = {
  output: "export",
  basePath,
  images: { unoptimized: true },
  trailingSlash: true,
};

export default config;
