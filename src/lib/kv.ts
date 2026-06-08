import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Tiny JSON key-value store. Uses Redis (STORAGE_REDIS_URL) in production and
 * a local-file fallback (.data/<key>.json) for development.
 */

const DATA_DIR = path.join(process.cwd(), ".data");

function redisUrl(): string | undefined {
  return process.env.STORAGE_REDIS_URL;
}

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

function fileFor(key: string): string {
  return path.join(DATA_DIR, `${key.replace(/[:/\\]/g, "_")}.json`);
}

export async function getJson<T>(key: string, fallback: T): Promise<T> {
  const url = redisUrl();
  if (url) {
    const redis = await getRedis(url);
    const raw = await redis.get(key);
    if (!raw) return fallback;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }

  try {
    const raw = await fs.readFile(fileFor(key), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function setJson(key: string, value: unknown): Promise<void> {
  const url = redisUrl();
  if (url) {
    const redis = await getRedis(url);
    await redis.set(key, JSON.stringify(value));
    return;
  }

  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(fileFor(key), JSON.stringify(value, null, 2), "utf8");
}
