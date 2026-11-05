import "server-only";

import { getJson, setJson } from "@/lib/kv";

/** Admin areas that track a "zuletzt geändert" timestamp. */
export type AdminArea =
  | "notdienst"
  | "urlaubszeiten"
  | "team"
  | "leistungen"
  | "praxisgalerie";

const KEY = "zm:admin-updated";

export async function getLastUpdated(): Promise<Partial<Record<AdminArea, string>>> {
  return getJson<Partial<Record<AdminArea, string>>>(KEY, {});
}

export async function markUpdated(area: AdminArea): Promise<void> {
  const current = await getLastUpdated();
  await setJson(KEY, { ...current, [area]: new Date().toISOString() });
}
