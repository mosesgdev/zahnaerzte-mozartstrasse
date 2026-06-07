import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * A single vacation/absence entry for Dr. Boris Shuk.
 * `replacement` is the covering dentist/practice (free text, since the
 * practice has a single dentist — cover is typically an external practice).
 */
export interface Vacation {
  id: string;
  /** ISO date (YYYY-MM-DD) */
  start: string;
  /** ISO date (YYYY-MM-DD) */
  end: string;
  /** Name of the covering dentist or practice */
  replacement: string;
  /** Optional phone number for the replacement */
  replacementPhone?: string;
  /** Optional free-text note */
  note?: string;
}

export type NewVacation = Omit<Vacation, "id">;

const REDIS_KEY = "zm:vacations";
const LOCAL_FILE = path.join(process.cwd(), ".data", "vacations.json");

function hasUpstash(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
  );
}

// ---- Storage backends -------------------------------------------------------

async function readAll(): Promise<Vacation[]> {
  if (hasUpstash()) {
    const { Redis } = await import("@upstash/redis");
    const redis = Redis.fromEnv();
    const data = await redis.get<Vacation[]>(REDIS_KEY);
    return Array.isArray(data) ? data : [];
  }

  // Local-file fallback for development before Upstash is provisioned.
  try {
    const raw = await fs.readFile(LOCAL_FILE, "utf8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function writeAll(list: Vacation[]): Promise<void> {
  if (hasUpstash()) {
    const { Redis } = await import("@upstash/redis");
    const redis = Redis.fromEnv();
    await redis.set(REDIS_KEY, list);
    return;
  }

  await fs.mkdir(path.dirname(LOCAL_FILE), { recursive: true });
  await fs.writeFile(LOCAL_FILE, JSON.stringify(list, null, 2), "utf8");
}

// ---- Public API -------------------------------------------------------------

/** All vacations, sorted by start date ascending. */
export async function getVacations(): Promise<Vacation[]> {
  const list = await readAll();
  return [...list].sort((a, b) => a.start.localeCompare(b.start));
}

export async function addVacation(input: NewVacation): Promise<Vacation> {
  const list = await readAll();
  const vacation: Vacation = {
    id: crypto.randomUUID(),
    start: input.start,
    end: input.end,
    replacement: input.replacement.trim(),
    replacementPhone: input.replacementPhone?.trim() || undefined,
    note: input.note?.trim() || undefined,
  };
  list.push(vacation);
  await writeAll(list);
  return vacation;
}

export async function deleteVacation(id: string): Promise<void> {
  const list = await readAll();
  await writeAll(list.filter((v) => v.id !== id));
}
