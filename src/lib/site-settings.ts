import "server-only";

import { siteData } from "@content/site-data";
import { getJson, setJson } from "@/lib/kv";
import { normalizeText } from "@/lib/text";

export interface OpeningHoursEntry {
  day: string;
  hours: string;
  break?: string | null;
}

/** Free text for patients on the start page (e.g. holiday greetings). */
export interface Announcement {
  enabled: boolean;
  title: string;
  text: string;
}

export interface SiteSettings {
  openingHours: OpeningHoursEntry[];
  announcement: Announcement;
}

const KEY = "zm:site-settings";

const fallbackSiteSettings: SiteSettings = {
  openingHours: siteData.openingHours.map((entry) => ({ ...entry })),
  announcement: { enabled: false, title: "", text: "" },
};

/** Stored/posted JSON is untrusted: non-strings become "". */
function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalize(settings: Partial<SiteSettings>): SiteSettings {
  const openingHours = Array.isArray(settings.openingHours)
    ? settings.openingHours
        .filter((entry) => str(entry?.day))
        .map((entry) => ({
          day: str(entry.day),
          hours: str(entry.hours),
          break: str(entry.break) || null,
        }))
    : fallbackSiteSettings.openingHours;

  const announcement = settings.announcement;
  return {
    openingHours,
    announcement: {
      enabled: announcement?.enabled === true,
      title: str(announcement?.title),
      text: normalizeText(str(announcement?.text)),
    },
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const settings = await getJson<Partial<SiteSettings>>(KEY, fallbackSiteSettings);
  return normalize(settings);
}

export async function setSiteSettings(settings: SiteSettings): Promise<void> {
  await setJson(KEY, normalize(settings));
}
