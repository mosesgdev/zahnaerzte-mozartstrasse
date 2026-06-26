import "server-only";

import { parseEmergencyPdfText } from "@/lib/emergency-parser";
import { getJson, setJson } from "@/lib/kv";

export interface EmergencyEntry {
  id: string;
  date: string;
  time?: string;
  district?: string;
  practice: string;
  address?: string;
  phone?: string;
  raw?: string;
}

export interface EmergencySettings {
  title: string;
  intro: string;
  nonEmergencyItems: string[];
  consultationText: string;
  documentLabel: string;
  documentUrl?: string;
  documentName?: string;
  documentText?: string;
  lastSyncedAt?: string;
  updatedAt?: string;
  entries: EmergencyEntry[];
}

const KEY = "zm:emergency-settings";

const fallbackEmergencySettings: EmergencySettings = {
  title: "Zahnärztlicher Notdienst",
  intro:
    "Sollten Sie einen akuten zahnmedizinischen Notfall am Wochenende oder Feiertag haben, wenden Sie sich bitte zuerst telefonisch an die aufgeführten Praxen. So können Therapiebedarf und Wartezeit besser koordiniert werden.",
  nonEmergencyItems: [
    "die herausgefallene Füllung",
    "eine Druckstelle einer Prothese",
    "zerbrochener Zahnersatz",
    "das herausgefallene Provisorium",
    "die herausgefallene Krone",
    "die Entfernung von Nähten",
  ],
  consultationText:
    "Die Notdienstsprechstunde findet an den jeweiligen Tagen am Vormittag in der Zeit von 10 bis 12 Uhr statt. Außerhalb dieser Zeit besteht eine Rufbereitschaft.",
  documentLabel: "Notdienstplan herunterladen",
  documentUrl:
    "https://www.xn--zahnrzte-lneburg-ynb25b.de/.cm4all/uproc.php/0/Notdienst/Notdienst%20L%C3%BCneburg%2008.-09.11.25.pdf?_=19a48f641dc&cdp=a",
  documentName: "Notdienst Lüneburg 08.-09.11.25.pdf",
  documentText: "",
  lastSyncedAt: undefined,
  updatedAt: undefined,
  entries: [],
};

function isLikelyBrokenParsedEntry(entry: EmergencyEntry): boolean {
  return (
    entry.practice.length > 140 ||
    /^\d{1,2}\.\d{1,2}\.\d{4}\s+\d/.test(entry.practice) ||
    /^20\d{2}\s+\d/.test(entry.phone || "")
  );
}

function normalize(settings: EmergencySettings): EmergencySettings {
  const existingEntries = Array.isArray(settings.entries)
    ? settings.entries
        .filter((entry) => entry.date?.trim() || entry.practice?.trim())
        .map((entry) => ({
          id: entry.id || crypto.randomUUID(),
          date: entry.date?.trim() || "",
          time: entry.time?.trim() || undefined,
          district: entry.district?.trim() || undefined,
          practice: entry.practice?.trim() || "",
          address: entry.address?.trim() || undefined,
          phone: entry.phone?.trim() || undefined,
          raw: entry.raw?.trim() || undefined,
        }))
    : [];
  const shouldReparse =
    settings.documentText?.trim() &&
    (existingEntries.length === 0 ||
      existingEntries.some(isLikelyBrokenParsedEntry));
  const entries = shouldReparse
    ? parseEmergencyPdfText(settings.documentText || "").entries
    : existingEntries;

  return {
    title: settings.title?.trim() || fallbackEmergencySettings.title,
    intro: settings.intro?.trim() || fallbackEmergencySettings.intro,
    nonEmergencyItems: Array.isArray(settings.nonEmergencyItems)
      ? settings.nonEmergencyItems.map((item) => item.trim()).filter(Boolean)
      : fallbackEmergencySettings.nonEmergencyItems,
    consultationText:
      settings.consultationText?.trim() ||
      fallbackEmergencySettings.consultationText,
    documentLabel:
      settings.documentLabel?.trim() || fallbackEmergencySettings.documentLabel,
    documentUrl: settings.documentUrl?.trim() || undefined,
    documentName: settings.documentName?.trim() || undefined,
    documentText: settings.documentText?.trim() || undefined,
    lastSyncedAt: settings.lastSyncedAt?.trim() || undefined,
    updatedAt: settings.updatedAt?.trim() || undefined,
    entries,
  };
}

export async function getEmergencySettings(): Promise<EmergencySettings> {
  const settings = await getJson<EmergencySettings>(
    KEY,
    fallbackEmergencySettings,
  );
  return normalize(settings);
}

export async function setEmergencySettings(
  settings: EmergencySettings,
): Promise<void> {
  await setJson(
    KEY,
    normalize({
      ...settings,
      updatedAt: new Date().toISOString(),
    }),
  );
}
