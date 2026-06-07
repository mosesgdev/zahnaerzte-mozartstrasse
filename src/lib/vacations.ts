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

function redisUrl(): string | undefined {
  return process.env.STORAGE_REDIS_URL;
}

// Reuse a single ioredis connection across Fluid Compute invocations / HMR.
type RedisClient = import("ioredis").Redis;
const globalForRedis = globalThis as unknown as { _zmRedis?: RedisClient };

async function getRedis(url: string): Promise<RedisClient> {
  if (globalForRedis._zmRedis) return globalForRedis._zmRedis;
  const { default: Redis } = await import("ioredis");
  const client = new Redis(url, { maxRetriesPerRequest: 3 });
  // Prevent unhandled 'error' events from crashing the serverless function.
  client.on("error", (err) => console.error("[redis]", err.message));
  globalForRedis._zmRedis = client;
  return client;
}

// ---- Storage backends -------------------------------------------------------

async function readAll(): Promise<Vacation[]> {
  const url = redisUrl();
  if (url) {
    const redis = await getRedis(url);
    const raw = await redis.get(REDIS_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  }

  // Local-file fallback for development before Redis is provisioned.
  try {
    const raw = await fs.readFile(LOCAL_FILE, "utf8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function writeAll(list: Vacation[]): Promise<void> {
  const url = redisUrl();
  if (url) {
    const redis = await getRedis(url);
    await redis.set(REDIS_KEY, JSON.stringify(list));
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
