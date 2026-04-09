import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const ghPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  basePath: ghPages ? "/zahnaerzte-mozartstrasse" : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
