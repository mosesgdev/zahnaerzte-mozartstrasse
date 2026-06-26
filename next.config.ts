import type { NextConfig } from "next";

// Deployed on Vercel as a full Next.js app (App Router + Server Actions).
// Static export (`output: "export"`) is intentionally NOT used: it is
// incompatible with the /admin backend, which relies on Server Actions and
// request-time cookies. Public pages are still statically prerendered and
// served from Vercel's edge — only /admin and its actions run dynamically.
const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  images: {
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "8mb",
    },
  },
};

export default nextConfig;
