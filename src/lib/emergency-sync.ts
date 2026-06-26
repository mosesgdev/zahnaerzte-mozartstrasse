import "server-only";

import path from "node:path";
import { pathToFileURL } from "node:url";
import { PDFParse } from "pdf-parse";
import { parseEmergencyPdfText } from "@/lib/emergency-parser";
import { setEmergencySettings } from "@/lib/emergency-settings";
import { saveUpload } from "@/lib/uploads";

const SOURCE_URL =
  process.env.NOTDIENST_SOURCE_URL ||
  "https://www.xn--zahnrzte-lneburg-ynb25b.de/Notdienst/";

function configurePdfWorker() {
  const worker = path.join(
    process.cwd(),
    "node_modules",
    "pdf-parse",
    "dist",
    "pdf-parse",
    "cjs",
    "pdf.worker.mjs",
  );
  PDFParse.setWorker(pathToFileURL(worker).href);
}

function decodeHtml(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function filenameFromUrl(url: string): string {
  const pathname = new URL(url).pathname;
  const encoded = pathname.split("/").filter(Boolean).at(-1);
  return encoded ? decodeURIComponent(encoded) : "Notdienst.pdf";
}

function absoluteUrl(url: string, base: string): string {
  return new URL(decodeHtml(url), base).toString();
}

export function findEmergencyPdfUrl(html: string, baseUrl = SOURCE_URL): string {
  const links = Array.from(
    html.matchAll(/href=["']([^"']+\.pdf[^"']*)["']/gi),
  ).map((match) => absoluteUrl(match[1], baseUrl));
  const notdienstLink =
    links.find((link) => /notdienst/i.test(decodeURIComponent(link))) ??
    links[0];

  if (!notdienstLink) {
    throw new Error("No Notdienst PDF link found on source page.");
  }

  return notdienstLink;
}

export async function parseEmergencyPdfBytes(bytes: Buffer) {
  configurePdfWorker();
  const parser = new PDFParse({ data: bytes });
  try {
    const result = await parser.getText();
    return parseEmergencyPdfText(result.text);
  } finally {
    await parser.destroy();
  }
}

export async function syncEmergencySettingsFromSource() {
  const pageResponse = await fetch(SOURCE_URL, { cache: "no-store" });
  if (!pageResponse.ok) {
    throw new Error(`Source page request failed: ${pageResponse.status}`);
  }

  const pageHtml = await pageResponse.text();
  const pdfUrl = findEmergencyPdfUrl(pageHtml, SOURCE_URL);
  const pdfResponse = await fetch(pdfUrl, { cache: "no-store" });
  if (!pdfResponse.ok) {
    throw new Error(`PDF request failed: ${pdfResponse.status}`);
  }

  const bytes = Buffer.from(await pdfResponse.arrayBuffer());
  const parsed = await parseEmergencyPdfBytes(bytes);
  const documentName = filenameFromUrl(pdfUrl);
  const upload = await saveUpload({
    name: documentName,
    mimeType: "application/pdf",
    data: bytes.toString("base64"),
  });

  await setEmergencySettings({
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
    documentUrl: `/uploads/admin/${upload.id}`,
    documentName,
    documentText: parsed.documentText,
    lastSyncedAt: new Date().toISOString(),
    entries: parsed.entries,
  });

  return {
    sourceUrl: SOURCE_URL,
    pdfUrl,
    documentName,
    entries: parsed.entries.length,
  };
}
