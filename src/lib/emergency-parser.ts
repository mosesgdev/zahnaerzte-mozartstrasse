import type { EmergencyEntry } from "@/lib/emergency-settings";

const dateRangePattern = /\b\d{1,2}\.-\d{1,2}\.\d{1,2}\.\d{4}\b/;
const datePattern = /\b\d{1,2}\.\d{1,2}\.\d{4}\b/;
const pageMarkerPattern = /^--\s*\d+\s+of\s+\d+\s*--$/i;
const phonePattern = /(?:\+49\s*)?0\d{2,5}[\s/-]?\d{3,}[\s/-]?\d*/g;
const districtPattern =
  /^(?:Lüneburg|Winsen\/Luhe|Buchholz|Uelzen|Lüchow\/Dannenberg)$/i;
const separatedStreetTypes = /^(?:Straße|Str\.|Weg|Platz|Allee|Ring|Damm|Chaussee)$/i;
const compoundStreetToken =
  /(?:straße|str\.?|weg|platz|allee|ring|damm|chaussee)$/i;

function cleanup(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function extractPhones(value: string): string[] {
  return Array.from(value.matchAll(phonePattern))
    .map((match) => cleanup(match[0]))
    .filter((phone) => phone.replace(/\D/g, "").length >= 6);
}

function normalizeLines(text: string): string[] {
  return text
    .replace(/\r/g, "\n")
    .split("\n")
    .map(cleanup)
    .filter(Boolean);
}

function documentTextFromLines(lines: string[]): string {
  return lines.join("\n");
}

function isDistrict(line: string): boolean {
  return districtPattern.test(line);
}

function isDateLine(line: string): boolean {
  return dateRangePattern.test(line) || datePattern.test(line);
}

function addressStartIndex(value: string): number {
  const tokens = value.split(/\s+/);
  const index = tokens.findIndex((token) => {
    const cleaned = token.replace(/[,.]$/, "");
    return separatedStreetTypes.test(cleaned) || compoundStreetToken.test(cleaned);
  });

  if (index === -1) return -1;
  if (separatedStreetTypes.test(tokens[index].replace(/[,.]$/, ""))) {
    return Math.max(0, index - 1);
  }

  return index;
}

function parsePracticeLine(
  line: string,
  date: string,
  district?: string,
): EmergencyEntry | undefined {
  const phones = extractPhones(line);
  const withoutPhones = cleanup(line.replace(phonePattern, " "));
  const tokens = withoutPhones.split(/\s+/);
  const start = addressStartIndex(withoutPhones);
  const practice = cleanup(
    start >= 0 ? tokens.slice(0, start).join(" ") : withoutPhones,
  );
  const address = cleanup(start >= 0 ? tokens.slice(start).join(" ") : "");

  if (!practice && phones.length === 0) return undefined;

  return {
    id: crypto.randomUUID(),
    date,
    time: "10-12 Uhr",
    district,
    practice: practice || district || "Diensthabende Praxis",
    address: address || undefined,
    phone: phones.join(", ") || undefined,
    raw: line,
  };
}

function findPrimaryDate(lines: string[]): string {
  for (const line of lines) {
    const range = line.match(dateRangePattern)?.[0];
    if (range) return range;

    const date = line.match(datePattern)?.[0];
    if (date) return date;
  }

  return "";
}

function parseLineBasedEntries(lines: string[]): EmergencyEntry[] {
  const entries: EmergencyEntry[] = [];
  let activeDate = findPrimaryDate(lines);
  let activeDistrict: string | undefined;

  for (const line of lines) {
    if (/^Notdienst$/i.test(line) || pageMarkerPattern.test(line)) continue;

    if (isDateLine(line)) {
      activeDate = line.match(dateRangePattern)?.[0] ?? line.match(datePattern)?.[0] ?? activeDate;
      continue;
    }

    if (isDistrict(line)) {
      activeDistrict = line;
      continue;
    }

    const phones = extractPhones(line);
    const isOnlyPhone = phones.length > 0 && cleanup(line.replace(phonePattern, "")) === "";
    if (isOnlyPhone && entries.length > 0) {
      const previous = entries[entries.length - 1];
      previous.phone = [previous.phone, phones.join(", ")]
        .filter(Boolean)
        .join(", ");
      previous.raw = [previous.raw, line].filter(Boolean).join(" ");
      continue;
    }

    if (phones.length === 0 && addressStartIndex(line) === -1) continue;

    const entry = parsePracticeLine(line, activeDate, activeDistrict);
    if (entry) entries.push(entry);
  }

  return entries;
}

export function parseEmergencyPdfText(text: string): {
  documentText: string;
  entries: EmergencyEntry[];
} {
  const lines = normalizeLines(text);
  const entries = parseLineBasedEntries(lines);

  return {
    documentText: documentTextFromLines(lines),
    entries: entries.filter((entry, index, list) => {
      const key = `${entry.date}|${entry.district}|${entry.practice}|${entry.phone}`;
      return (
        list.findIndex(
          (item) =>
            `${item.date}|${item.district}|${item.practice}|${item.phone}` ===
            key,
        ) === index
      );
    }),
  };
}
