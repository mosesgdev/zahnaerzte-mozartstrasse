/**
 * Gesetzliche Feiertage in Niedersachsen + Berechnung des nächsten Werktags.
 * Winsen (Luhe) liegt in Niedersachsen.
 */

function ymd(year: number, month0: number, day: number): string {
  const m = String(month0 + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

function toIso(date: Date): string {
  return ymd(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Ostersonntag (Gauß / Anonymous Gregorian algorithm). */
function easterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31); // 3 = März, 4 = April
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

const holidayCache = new Map<number, Set<string>>();

/** Menge der Feiertags-ISO-Daten (Niedersachsen) für ein Jahr. */
function holidaysForYear(year: number): Set<string> {
  const cached = holidayCache.get(year);
  if (cached) return cached;

  const set = new Set<string>();
  // Feste Feiertage (Niedersachsen)
  set.add(ymd(year, 0, 1)); // Neujahr
  set.add(ymd(year, 4, 1)); // Tag der Arbeit
  set.add(ymd(year, 9, 3)); // Tag der Deutschen Einheit
  set.add(ymd(year, 9, 31)); // Reformationstag
  set.add(ymd(year, 11, 25)); // 1. Weihnachtstag
  set.add(ymd(year, 11, 26)); // 2. Weihnachtstag

  // Bewegliche Feiertage (relativ zu Ostersonntag)
  const easter = easterSunday(year);
  const offset = (days: number) => {
    const d = new Date(easter);
    d.setDate(d.getDate() + days);
    return toIso(d);
  };
  set.add(offset(-2)); // Karfreitag
  set.add(offset(1)); // Ostermontag
  set.add(offset(39)); // Christi Himmelfahrt
  set.add(offset(50)); // Pfingstmontag

  holidayCache.set(year, set);
  return set;
}

export function isHoliday(date: Date): boolean {
  return holidaysForYear(date.getFullYear()).has(toIso(date));
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // So / Sa
}

/**
 * Erster Werktag NACH dem letzten Schließtag (endIso, Format YYYY-MM-DD).
 * Überspringt Wochenenden und niedersächsische Feiertage.
 */
export function reopeningDateAfter(endIso: string): Date {
  const d = new Date(`${endIso}T00:00:00`);
  d.setDate(d.getDate() + 1);
  while (isWeekend(d) || isHoliday(d)) {
    d.setDate(d.getDate() + 1);
  }
  return d;
}
