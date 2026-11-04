/**
 * Plain-text helpers for admin-edited copy. Text is stored as plain strings:
 * a blank line separates paragraphs, a single line break stays a line break.
 * No HTML is ever interpreted — rendering goes through React text nodes.
 */

/** Unifies line endings, trims trailing spaces per line and collapses 3+ newlines. */
export function normalizeText(value: string | undefined | null): string {
  return (value ?? "")
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.replace(/\s+$/, ""))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Splits text at blank lines into paragraphs (single line breaks are kept). */
export function splitParagraphs(value: string | undefined | null): string[] {
  return normalizeText(value)
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

/** Joins paragraphs back into editable text (blank line between paragraphs). */
export function joinParagraphs(paragraphs: string[] | undefined): string {
  return (paragraphs ?? []).join("\n\n");
}

/** One entry per non-empty line. */
export function splitLines(value: string | undefined | null): string[] {
  return (value ?? "")
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
