import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Proxy (formerly Middleware, renamed in Next.js 16). Falls back to the
 * original IONOS/1&1 website when the admin toggle in /admin/website is on.
 *
 * The flag lives in the same KV store as src/lib/site-settings.ts under the
 * key "zm:site-settings". This file cannot import the server-only kv module,
 * so it reads the store directly (Redis in production, local file in dev) and
 * caches the result briefly to avoid a lookup on every request.
 */

const SETTINGS_KEY = "zm:site-settings";
const CACHE_TTL_MS = 30_000;

interface SiteSettings {
  ionosRedirectEnabled: boolean;
  ionosUrl: string;
}

type RedisClient = import("ioredis").Redis;
const globalForProxy = globalThis as unknown as {
  _zmProxyRedis?: RedisClient;
  _zmProxyCache?: { value: SiteSettings; expires: number };
};

async function readFromRedis(url: string): Promise<SiteSettings | null> {
  if (!globalForProxy._zmProxyRedis) {
    const { default: Redis } = await import("ioredis");
    const client = new Redis(url, { maxRetriesPerRequest: 3 });
    client.on("error", (err) => console.error("[proxy-redis]", err.message));
    globalForProxy._zmProxyRedis = client;
  }
  const raw = await globalForProxy._zmProxyRedis.get(SETTINGS_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SiteSettings;
  } catch {
    return null;
  }
}

async function readFromFile(): Promise<SiteSettings | null> {
  try {
    const [{ promises: fs }, path] = await Promise.all([
      import("node:fs"),
      import("node:path"),
    ]);
    const file = path.join(process.cwd(), ".data", "zm_site-settings.json");
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw) as SiteSettings;
  } catch {
    return null;
  }
}

async function getSiteSettings(): Promise<SiteSettings> {
  const cached = globalForProxy._zmProxyCache;
  if (cached && cached.expires > Date.now()) {
    return cached.value;
  }

  const url = process.env.STORAGE_REDIS_URL;
  const stored = url ? await readFromRedis(url) : await readFromFile();
  const value: SiteSettings = {
    ionosRedirectEnabled: Boolean(stored?.ionosRedirectEnabled),
    ionosUrl: stored?.ionosUrl?.trim() || "",
  };

  globalForProxy._zmProxyCache = { value, expires: Date.now() + CACHE_TTL_MS };
  return value;
}

export async function proxy(request: NextRequest) {
  const settings = await getSiteSettings();

  if (
    settings.ionosRedirectEnabled &&
    /^https?:\/\//i.test(settings.ionosUrl)
  ) {
    let targetHost = "";
    try {
      targetHost = new URL(settings.ionosUrl).host;
    } catch {
      return NextResponse.next();
    }
    // Avoid an infinite loop if the target is the site's own domain.
    if (targetHost && targetHost !== request.nextUrl.host) {
      return NextResponse.redirect(settings.ionosUrl, 307);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Run on every public route, but never on the admin area, API routes,
  // Next.js internals or static assets.
  matcher: [
    "/((?!admin|api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|images|uploads).*)",
  ],
};
