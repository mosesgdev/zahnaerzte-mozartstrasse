import "server-only";

import { getJson, setJson } from "@/lib/kv";
import {
  vertretungen as staticVertretungen,
  type Vertretung,
} from "@content/vertretungen";

export type { Vertretung };

const KEY = "zm:vertretungen";

/** Custom practices added manually via the admin form (persisted). */
async function getCustom(): Promise<Vertretung[]> {
  return getJson<Vertretung[]>(KEY, []);
}

/** Static defaults + custom additions, deduped by id. */
export async function getAllVertretungen(): Promise<Vertretung[]> {
  const custom = await getCustom();
  const seen = new Set(staticVertretungen.map((v) => v.id));
  return [...staticVertretungen, ...custom.filter((v) => !seen.has(v.id))];
}

export async function findVertretungById(
  id: string,
): Promise<Vertretung | undefined> {
  return (await getAllVertretungen()).find((v) => v.id === id);
}

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "praxis"
  );
}

/**
 * Add a manually-entered practice to the persisted options (deduped by name).
 * Returns the existing or newly-created practice.
 */
export async function addCustomVertretung(input: {
  name: string;
  phone?: string;
  address?: string;
}): Promise<Vertretung> {
  const name = input.name.trim();
  const all = await getAllVertretungen();
  const existing = all.find(
    (v) => v.name.toLowerCase() === name.toLowerCase(),
  );
  if (existing) return existing;

  const custom = await getCustom();
  const baseId = slugify(name);
  let id = baseId;
  let n = 2;
  const ids = new Set(all.map((v) => v.id));
  while (ids.has(id)) id = `${baseId}-${n++}`;

  const created: Vertretung = {
    id,
    name,
    phone: (input.phone ?? "").trim(),
    address: (input.address ?? "").trim(),
  };
  custom.push(created);
  await setJson(KEY, custom);
  return created;
}
