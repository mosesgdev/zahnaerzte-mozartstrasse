import "server-only";

import { getJson, setJson } from "@/lib/kv";

export interface StoredUpload {
  id: string;
  name: string;
  mimeType: string;
  data: string;
  createdAt: string;
}

const KEY = "zm:uploads";

async function getUploads(): Promise<Record<string, StoredUpload>> {
  return getJson<Record<string, StoredUpload>>(KEY, {});
}

export async function saveUpload(input: {
  name: string;
  mimeType: string;
  data: string;
}): Promise<StoredUpload> {
  const uploads = await getUploads();
  const upload: StoredUpload = {
    id: crypto.randomUUID(),
    name: input.name,
    mimeType: input.mimeType,
    data: input.data,
    createdAt: new Date().toISOString(),
  };
  uploads[upload.id] = upload;
  await setJson(KEY, uploads);
  return upload;
}

export async function getUpload(id: string): Promise<StoredUpload | undefined> {
  const uploads = await getUploads();
  return uploads[id];
}
