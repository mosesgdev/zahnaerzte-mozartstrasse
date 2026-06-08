import "server-only";

import { getJson, setJson } from "@/lib/kv";

/** One covering practice and the sub-range of the closure it is responsible for. */
export interface ReplacementAssignment {
  name: string;
  phone?: string;
  address?: string;
  /** ISO date (YYYY-MM-DD) */
  from: string;
  /** ISO date (YYYY-MM-DD) */
  to: string;
}

/** A vacation/absence period for the practice. */
export interface Vacation {
  id: string;
  /** ISO date (YYYY-MM-DD) */
  start: string;
  /** ISO date (YYYY-MM-DD) */
  end: string;
  /** One or more replacements, each covering specific days. */
  replacements: ReplacementAssignment[];
  note?: string;
}

export type NewVacation = Omit<Vacation, "id">;

const KEY = "zm:vacations";

// Legacy shape (single replacement) — normalized on read.
interface LegacyVacation {
  id: string;
  start: string;
  end: string;
  replacement?: string;
  replacementPhone?: string;
  replacements?: ReplacementAssignment[];
  note?: string;
}

function normalize(v: LegacyVacation): Vacation {
  const replacements: ReplacementAssignment[] = Array.isArray(v.replacements)
    ? v.replacements
    : v.replacement
      ? [
          {
            name: v.replacement,
            phone: v.replacementPhone,
            from: v.start,
            to: v.end,
          },
        ]
      : [];
  return {
    id: v.id,
    start: v.start,
    end: v.end,
    replacements,
    note: v.note,
  };
}

/** All vacations, sorted by start date ascending. */
export async function getVacations(): Promise<Vacation[]> {
  const list = await getJson<LegacyVacation[]>(KEY, []);
  return list
    .map(normalize)
    .sort((a, b) => a.start.localeCompare(b.start));
}

export async function addVacation(input: NewVacation): Promise<Vacation> {
  const list = await getJson<LegacyVacation[]>(KEY, []);
  const vacation: Vacation = {
    id: crypto.randomUUID(),
    start: input.start,
    end: input.end,
    replacements: input.replacements,
    note: input.note?.trim() || undefined,
  };
  list.push(vacation);
  await setJson(KEY, list);
  return vacation;
}

export async function deleteVacation(id: string): Promise<void> {
  const list = await getJson<LegacyVacation[]>(KEY, []);
  await setJson(
    KEY,
    list.filter((v) => v.id !== id),
  );
}
