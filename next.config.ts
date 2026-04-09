import type { NextConfig } from "next";

const ghPages = process.env.GITHUB_PAGES === "true";
const basePath = ghPages ? "/zahnaerzte-mozartstrasse" : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
