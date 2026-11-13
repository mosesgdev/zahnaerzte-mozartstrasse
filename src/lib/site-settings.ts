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

function normalize(settings: Partial<SiteSettings>): SiteSettings {
  const openingHours = Array.isArray(settings.openingHours)
    ? settings.openingHours
        .filter((entry) => entry.day?.trim())
        .map((entry) => ({
          day: entry.day.trim(),
          hours: entry.hours?.trim() ?? "",
          break: entry.break?.trim() || null,
        }))
    : fallbackSiteSettings.openingHours;

  const announcement = settings.announcement;
  return {
    openingHours,
    announcement: {
      enabled: Boolean(announcement?.enabled),
      title: announcement?.title?.trim() ?? "",
      text: normalizeText(announcement?.text),
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
