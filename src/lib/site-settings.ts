import "server-only";

import { getJson, setJson } from "@/lib/kv";

/**
 * Global site-wide switches. Currently used to fall back to the original
 * IONOS/1&1 website when needed. The proxy (src/proxy.ts) reads the same
 * KV key independently (it cannot import server-only modules), so keep the
 * KEY and shape below in sync with the reader there.
 */
export interface SiteSettings {
  /** When true, all public traffic is redirected to the original IONOS site. */
  ionosRedirectEnabled: boolean;
  /** Absolute URL of the original IONOS/1&1 website. */
  ionosUrl: string;
}

export const SITE_SETTINGS_KEY = "zm:site-settings";

const fallbackSiteSettings: SiteSettings = {
  ionosRedirectEnabled: false,
  ionosUrl: "https://www.zahnaerzte-mozartstrasse.de",
};

function normalize(settings: Partial<SiteSettings> | null | undefined): SiteSettings {
  const url = settings?.ionosUrl?.trim();
  return {
    ionosRedirectEnabled: Boolean(settings?.ionosRedirectEnabled),
    ionosUrl:
      url && /^https?:\/\//i.test(url) ? url : fallbackSiteSettings.ionosUrl,
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const settings = await getJson<SiteSettings>(
    SITE_SETTINGS_KEY,
    fallbackSiteSettings,
  );
  return normalize(settings);
}

export async function setSiteSettings(settings: SiteSettings): Promise<void> {
  await setJson(SITE_SETTINGS_KEY, normalize(settings));
}
