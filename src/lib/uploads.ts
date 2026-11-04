import "server-only";

import { getEmergencySettings } from "@/lib/emergency-settings";
import { deleteKey, getJson, setJson } from "@/lib/kv";

export interface StoredUpload {
  id: string;
  name: string;
  mimeType: string;
  data: string;
  createdAt: string;
}

/**
 * Each upload lives in its own key. The old layout kept every upload in one
 * JSON blob ("zm:uploads"); the daily Notdienst sync appended a new PDF to it
 * on every run until Redis hit maxmemory and all writes failed with OOM.
 */
const LEGACY_KEY = "zm:uploads";
const UPLOAD_URL_PREFIX = "/uploads/admin/";

function keyFor(id: string): string {
  return `zm:upload:${id}`;
}

export function uploadIdFromUrl(url: string | undefined): string | undefined {
  if (!url?.startsWith(UPLOAD_URL_PREFIX)) return undefined;
  return url.slice(UPLOAD_URL_PREFIX.length) || undefined;
}

/**
 * Moves uploads out of the legacy blob. Images are kept; PDFs only if the
 * Notdienst settings still point at them (older synced plans are obsolete).
 * If Redis is full, the writes fail, so the blob is deleted first and the
 * kept uploads (held in memory) are written afterwards.
 */
async function migrateLegacyUploads(): Promise<void> {
  const legacy = await getJson<Record<string, StoredUpload> | null>(
    LEGACY_KEY,
    null,
  );
  if (!legacy) return;

  const referencedPdfId = uploadIdFromUrl(
    (await getEmergencySettings()).documentUrl,
  );
  const all = Object.values(legacy);
  const keep = all.filter(
    (upload) =>
      upload.mimeType !== "application/pdf" || upload.id === referencedPdfId,
  );

  const writeKept = async () => {
    for (const upload of keep) await setJson(keyFor(upload.id), upload);
  };

  try {
    await writeKept();
    await deleteKey(LEGACY_KEY);
  } catch (error) {
    console.warn("[uploads] write failed, freeing legacy blob first", error);
    await deleteKey(LEGACY_KEY);
    await writeKept();
  }

  console.info(
    `[uploads] migrated ${keep.length} of ${all.length} legacy uploads, dropped ${all.length - keep.length} obsolete PDFs`,
  );
}

export async function saveUpload(input: {
  name: string;
  mimeType: string;
  data: string;
}): Promise<StoredUpload> {
  await migrateLegacyUploads();
  const upload: StoredUpload = {
    id: crypto.randomUUID(),
    name: input.name,
    mimeType: input.mimeType,
    data: input.data,
    createdAt: new Date().toISOString(),
  };
  await setJson(keyFor(upload.id), upload);
  return upload;
}

export async function getUpload(id: string): Promise<StoredUpload | undefined> {
  const upload = await getJson<StoredUpload | null>(keyFor(id), null);
  if (upload) return upload;

  // Not migrated yet; migration runs on the next save.
  const legacy = await getJson<Record<string, StoredUpload>>(LEGACY_KEY, {});
  return legacy[id];
}

export async function deleteUpload(id: string): Promise<void> {
  await deleteKey(keyFor(id));
}
