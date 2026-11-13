/* eslint-disable @next/next/no-img-element */
"use client";

import {
  useActionState,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import type { SettingsFormState } from "@/app/admin/actions";
import { asset } from "@/lib/utils";
import { RichText } from "@/components/shared/RichText";
import { joinParagraphs, splitLines, splitParagraphs } from "@/lib/text";
import {
  AlertCircle,
  ArrowDown,
  Bold,
  Eye,
  Heading2,
  Italic,
  Link2,
  List,
  ListOrdered,
  PencilLine,
  ArrowUp,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  ImageUp,
  Loader2,
  Save,
  Trash2,
} from "lucide-react";

export const fieldClass =
  "w-full min-h-12 rounded-lg bg-surface-container px-4 py-3 text-base text-foreground outline-none ring-1 ring-outline-variant/40 focus:ring-2 focus:ring-primary transition";
const labelClass = "block text-base font-semibold text-primary";
const hintClass = "mt-1 text-sm text-on-surface-variant leading-relaxed";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_DOCUMENT_BYTES = 8 * 1024 * 1024;
/** Longest edge after automatic shrinking of large photos (e.g. from the iPhone). */
const IMAGE_MAX_EDGE = 2000;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export const PARAGRAPH_HINT =
  "Für einen neuen Absatz eine Leerzeile lassen (zweimal Eingabe/Return).";

/* ------------------------------------------------------------------ */
/* Saving, status and unsaved changes                                  */
/* ------------------------------------------------------------------ */

const LEAVE_MESSAGE =
  "Sie haben Änderungen, die noch nicht gespeichert sind. Seite trotzdem verlassen?";

/** Warns before closing the tab, following a link or logging out while dirty. */
export function useUnsavedChangesWarning(dirty: boolean) {
  useEffect(() => {
    if (!dirty) return;

    function onBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = "";
    }
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = (event.target as Element | null)?.closest?.(
        "a[href], [data-leave-page]",
      );
      if (!target) return;
      if (target instanceof HTMLAnchorElement && target.target === "_blank") return;
      if (!window.confirm(LEAVE_MESSAGE)) {
        event.preventDefault();
        event.stopPropagation();
      }
    }

    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("click", onClick, true);
    };
  }, [dirty]);
}

/**
 * Local form state + server action. `dirty` compares the current payload with
 * the last successfully saved one.
 */
export function useSettingsForm<T>(
  initial: T,
  serverAction: (
    prev: SettingsFormState,
    formData: FormData,
  ) => Promise<SettingsFormState>,
  serialize: (value: T) => string,
) {
  const [settings, setSettings] = useState(initial);
  const payload = useMemo(() => serialize(settings), [settings, serialize]);
  const [savedPayload, setSavedPayload] = useState(payload);
  const [state, action, pending] = useActionState(
    async (prev: SettingsFormState, formData: FormData) => {
      const result = await serverAction(prev, formData);
      if (result.success) setSavedPayload(String(formData.get("payload")));
      return result;
    },
    {},
  );
  const dirty = payload !== savedPayload;
  useUnsavedChangesWarning(dirty);

  return { settings, setSettings, payload, state, action, pending, dirty };
}

/** Sticky bar at the bottom of the screen: status message + save button. */
export function SaveBar({
  state,
  pending,
  dirty,
  label,
  publicHref,
}: {
  state: SettingsFormState;
  pending: boolean;
  dirty: boolean;
  label: string;
  publicHref: string;
}) {
  let status: React.ReactNode = null;
  if (pending) {
    status = (
      <span className="inline-flex items-center gap-2 text-on-surface-variant">
        <Loader2 className="w-4 h-4 animate-spin" />
        Wird gespeichert …
      </span>
    );
  } else if (state.error) {
    status = (
      <span role="alert" className="inline-flex items-start gap-2 text-destructive">
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
        {state.error}
      </span>
    );
  } else if (dirty) {
    status = (
      <span className="inline-flex items-center gap-2 text-on-surface-variant">
        <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
        Ungespeicherte Änderungen
      </span>
    );
  } else if (state.success) {
    status = (
      <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-secondary">
        <CheckCircle2 className="w-4 h-4 shrink-0" />
        Gespeichert. Die Website zeigt jetzt den neuen Stand.
        <a
          href={publicHref}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 font-semibold underline underline-offset-4"
        >
          Seite ansehen
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </span>
    );
  }

  return (
    <div className="sticky bottom-0 z-20 -mx-4 sm:-mx-6 lg:-mx-9 mt-8 border-t border-outline-variant/40 bg-card/95 px-4 sm:px-6 lg:px-9 py-3 backdrop-blur pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div aria-live="polite" className="min-h-6 text-sm font-medium">
          {status}
        </div>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-container px-7 text-base font-semibold text-white shadow-[0_8px_24px_rgba(16,59,92,0.25)] disabled:opacity-60"
        >
          <Save className="w-5 h-5" />
          {pending ? "Speichern …" : label}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Fields                                                              */
/* ------------------------------------------------------------------ */

function FieldShell({
  id,
  label,
  hint,
  required,
  children,
}: {
  id: string;
  label: string;
  hint?: React.ReactNode;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
        {required && (
          <span className="ml-1.5 text-sm font-medium text-destructive">
            * Pflichtfeld
          </span>
        )}
      </label>
      {hint && (
        <p id={`${id}-hint`} className={hintClass}>
          {hint}
        </p>
      )}
      <div className="mt-2">{children}</div>
    </div>
  );
}

export function TextField({
  label,
  hint,
  required,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  hint?: React.ReactNode;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const id = useId();
  const missing = required && !value.trim();
  return (
    <FieldShell id={id} label={label} hint={hint} required={required}>
      <input
        id={id}
        className={`${fieldClass} ${missing ? "ring-2 ring-destructive/60" : ""}`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-required={required || undefined}
        aria-invalid={missing || undefined}
        aria-describedby={hint ? `${id}-hint` : undefined}
      />
    </FieldShell>
  );
}

export const MARKDOWN_HINT = (
  <>
    Leerzeile = neuer Absatz. Formatieren mit den Knöpfen oder direkt:{" "}
    <code>**fett**</code>, <code>*kursiv*</code>, <code>- Liste</code>,{" "}
    <code>## Zwischenüberschrift</code>, <code>[Linktext](https://…)</code>.
  </>
);

type MarkdownAction = {
  label: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  apply: (selected: string) => { text: string; inline?: boolean; prefix?: string };
};

const markdownActions: MarkdownAction[] = [
  { label: "Fett", title: "Fett (**Text**)", icon: Bold, apply: (t) => ({ text: `**${t || "fetter Text"}**`, inline: true }) },
  { label: "Kursiv", title: "Kursiv (*Text*)", icon: Italic, apply: (t) => ({ text: `*${t || "kursiver Text"}*`, inline: true }) },
  { label: "Zwischenüberschrift", title: "Zwischenüberschrift (## Text)", icon: Heading2, apply: (t) => ({ text: t || "Zwischenüberschrift", prefix: "## " }) },
  { label: "Liste", title: "Aufzählung (- Punkt)", icon: List, apply: (t) => ({ text: t || "Punkt", prefix: "- " }) },
  { label: "Nummerierte Liste", title: "Nummerierte Liste (1. Punkt)", icon: ListOrdered, apply: (t) => ({ text: t || "Punkt", prefix: "1. " }) },
  { label: "Link", title: "Link ([Text](https://…))", icon: Link2, apply: (t) => ({ text: `[${t || "Linktext"}](https://)`, inline: true }) },
];

/** Applies a toolbar action to the textarea selection; returns new value + cursor. */
function applyMarkdown(
  value: string,
  start: number,
  end: number,
  action: MarkdownAction,
): { value: string; cursor: number } {
  const selected = value.slice(start, end);
  const result = action.apply(selected);
  if (result.inline) {
    const next = value.slice(0, start) + result.text + value.slice(end);
    return { value: next, cursor: start + result.text.length };
  }
  // Line-based: prefix every touched line (whole lines, also for a bare cursor).
  const lineStart = value.lastIndexOf("\n", start - 1) + 1;
  // A selection ending right after a line break does not touch the next line.
  const last = end > start && value[end - 1] === "\n" ? end - 1 : end;
  const nextBreak = value.indexOf("\n", last);
  const lineEnd = nextBreak === -1 ? value.length : nextBreak;
  const block = value.slice(lineStart, lineEnd);
  let n = 0;
  const prefixed = (block.trim() ? block : result.text)
    .split("\n")
    .map((line) => {
      if (!line.trim()) return line;
      n += 1;
      return result.prefix === "1. " ? `${n}. ${line}` : `${result.prefix}${line}`;
    })
    .join("\n");
  const next = value.slice(0, lineStart) + prefixed + value.slice(lineEnd);
  return { value: next, cursor: lineStart + prefixed.length };
}

/**
 * Free text; line breaks and blank lines (paragraphs) are kept as typed.
 * With `markdown`, a small toolbar and a preview are shown; the website
 * renders the text as Markdown (see components/shared/RichText).
 */
export function TextAreaField({
  label,
  hint,
  value,
  onChange,
  rows = 5,
  markdown = false,
}: {
  label: string;
  hint?: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  markdown?: boolean;
}) {
  const id = useId();
  const ref = useRef<HTMLTextAreaElement>(null);
  const [preview, setPreview] = useState(false);
  const shownHint = hint ?? (markdown ? MARKDOWN_HINT : PARAGRAPH_HINT);

  function run(action: MarkdownAction) {
    const el = ref.current;
    if (!el) return;
    const { value: next, cursor } = applyMarkdown(
      value,
      el.selectionStart,
      el.selectionEnd,
      action,
    );
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(cursor, cursor);
    });
  }

  return (
    <FieldShell id={id} label={label} hint={shownHint}>
      {markdown && (
        <div
          role="toolbar"
          aria-label={`Formatierung für „${label}“`}
          className="mb-2 flex flex-wrap items-center gap-1.5"
        >
          {markdownActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                type="button"
                title={action.title}
                aria-label={action.label}
                disabled={preview}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => run(action)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-surface text-on-surface-variant ring-1 ring-outline-variant/40 hover:bg-surface-high hover:text-primary disabled:opacity-40"
              >
                <Icon className="w-4.5 h-4.5" />
              </button>
            );
          })}
          <button
            type="button"
            aria-pressed={preview}
            onClick={() => setPreview((v) => !v)}
            className={`ml-auto inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold ${
              preview
                ? "bg-primary text-white"
                : "bg-secondary/10 text-secondary hover:bg-secondary/15"
            }`}
          >
            {preview ? <PencilLine className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {preview ? "Bearbeiten" : "Vorschau"}
          </button>
        </div>
      )}
      {markdown && preview ? (
        <div
          className={`${fieldClass} min-h-24 bg-surface`}
          role="region"
          aria-label={`Vorschau „${label}“`}
        >
          {value.trim() ? (
            <RichText
              text={value}
              className="space-y-3"
              paragraphClassName="text-base leading-relaxed text-on-surface-variant"
            />
          ) : (
            <p className="text-sm text-on-surface-variant/70">Noch kein Text.</p>
          )}
        </div>
      ) : (
        <textarea
          ref={ref}
          id={id}
          className={`${fieldClass} leading-relaxed ${markdown ? "font-mono text-[15px]" : ""}`}
          rows={rows}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-describedby={shownHint ? `${id}-hint` : undefined}
        />
      )}
    </FieldShell>
  );
}

/**
 * Edits a list of paragraphs as one text. The raw text is kept locally so
 * Return/blank lines are not swallowed while typing.
 */
export function ParagraphsField({
  label,
  hint,
  value,
  onChange,
  rows = 8,
}: {
  label: string;
  hint?: React.ReactNode;
  value: string[];
  onChange: (value: string[]) => void;
  rows?: number;
}) {
  const [text, setText] = useState(() => joinParagraphs(value));
  return (
    <TextAreaField
      markdown
      label={label}
      hint={hint}
      rows={rows}
      value={text}
      onChange={(next) => {
        setText(next);
        onChange(splitParagraphs(next));
      }}
    />
  );
}

/** One list entry per line (e.g. bullet points). */
export function LinesField({
  label,
  hint = "Ein Punkt pro Zeile.",
  value,
  onChange,
  rows = 6,
}: {
  label: string;
  hint?: React.ReactNode;
  value: string[] | undefined;
  onChange: (value: string[]) => void;
  rows?: number;
}) {
  const [text, setText] = useState(() => (value ?? []).join("\n"));
  return (
    <TextAreaField
      label={label}
      hint={hint}
      rows={rows}
      value={text}
      onChange={(next) => {
        setText(next);
        onChange(splitLines(next));
      }}
    />
  );
}

export function CheckboxField({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex min-h-11 cursor-pointer items-start gap-3 rounded-lg py-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-6 w-6 shrink-0 accent-primary"
      />
      <span>
        <span className="block text-base font-semibold text-primary">{label}</span>
        {hint && <span className={`block ${hintClass}`}>{hint}</span>}
      </span>
    </label>
  );
}

/* ------------------------------------------------------------------ */
/* Uploads                                                             */
/* ------------------------------------------------------------------ */

function formatBytes(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toLocaleString("de-DE", {
    maximumFractionDigits: 1,
  })} MB`;
}

/** Downscales big photos in the browser so typical phone pictures fit the limit. */
async function shrinkImage(file: File): Promise<File> {
  if (file.type === "image/gif") return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, IMAGE_MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const needsShrink = scale < 1 || file.size > MAX_IMAGE_BYTES;
    if (!needsShrink) {
      bitmap.close();
      return file;
    }
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.85),
    );
    if (!blob || blob.size >= file.size) return file;
    const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], name, { type: "image/jpeg" });
  } catch {
    return file;
  }
}

type UploadResult =
  | {
      ok: true;
      url: string;
      name: string;
      parsed?: { documentText?: string; entries?: unknown[] };
    }
  | { ok: false; error: string };

async function uploadFile(
  original: File,
  kind: "image" | "document",
): Promise<UploadResult> {
  if (kind === "image" && !IMAGE_TYPES.includes(original.type)) {
    return {
      ok: false,
      error:
        "Dieses Dateiformat wird nicht unterstützt. Bitte ein Foto als JPG, PNG oder WebP wählen.",
    };
  }
  if (kind === "document" && original.type !== "application/pdf") {
    return { ok: false, error: "Bitte eine PDF-Datei auswählen." };
  }

  const file = kind === "image" ? await shrinkImage(original) : original;
  const maxBytes = kind === "image" ? MAX_IMAGE_BYTES : MAX_DOCUMENT_BYTES;
  if (file.size > maxBytes) {
    return {
      ok: false,
      error: `Die Datei ist zu groß (${formatBytes(file.size)}). Erlaubt sind höchstens ${formatBytes(maxBytes)}. Bitte eine kleinere Datei wählen.`,
    };
  }

  const formData = new FormData();
  formData.set("kind", kind);
  formData.set("file", file);

  let response: Response;
  try {
    response = await fetch("/admin/upload", { method: "POST", body: formData });
  } catch {
    return {
      ok: false,
      error:
        "Hochladen fehlgeschlagen. Bitte die Internetverbindung prüfen und es noch einmal versuchen.",
    };
  }
  const result = (await response.json().catch(() => ({}))) as {
    url?: string;
    name?: string;
    error?: string;
    parsed?: { documentText?: string; entries?: unknown[] };
  };
  if (response.status === 401) {
    return {
      ok: false,
      error: "Ihre Anmeldung ist abgelaufen. Bitte die Seite neu laden und erneut anmelden.",
    };
  }
  if (!response.ok || !result.url) {
    return {
      ok: false,
      error: `Hochladen fehlgeschlagen${result.error ? `: ${result.error}` : "."} Bitte erneut versuchen.`,
    };
  }
  return { ok: true, url: result.url, name: result.name || file.name, parsed: result.parsed };
}

function previewSrc(src: string | undefined): string | undefined {
  if (!src) return undefined;
  if (src.startsWith("data:") || src.startsWith("http")) return src;
  return asset(src);
}

export function Thumb({
  src,
  alt,
  className = "h-14 w-14",
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  const resolved = previewSrc(src);
  return (
    <span
      className={`${className} block shrink-0 overflow-hidden rounded-lg bg-surface ring-1 ring-outline-variant/40`}
    >
      {resolved && <img src={resolved} alt={alt} className="h-full w-full object-cover" />}
    </span>
  );
}

export function ImageUploadField({
  label,
  value,
  onChange,
  alt,
  sizeHint,
  aspect = "aspect-[4/3]",
}: {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  alt: string;
  /** e.g. "Querformat, mindestens 1200 Pixel breit" */
  sizeHint: string;
  aspect?: string;
}) {
  const id = useId();
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resolved = previewSrc(value);

  return (
    <div>
      <p className={labelClass} id={`${id}-label`}>
        {label}
      </p>
      <p className={hintClass}>
        JPG, PNG oder WebP, höchstens 5 MB. {sizeHint}. Große Fotos werden
        automatisch verkleinert.
      </p>
      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start">
        <div
          className={`${aspect} w-full max-w-64 overflow-hidden rounded-lg bg-surface ring-1 ring-outline-variant/40`}
        >
          {resolved ? (
            <img src={resolved} alt={alt} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center p-4 text-center text-sm text-on-surface-variant/70">
              Noch kein Bild
            </div>
          )}
        </div>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            aria-describedby={`${id}-label`}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-secondary/10 px-5 text-base font-semibold text-secondary hover:bg-secondary/15 disabled:opacity-60"
          >
            {uploading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <ImageUp className="w-5 h-5" />
            )}
            {uploading ? "Wird hochgeladen …" : value ? "Anderes Bild wählen" : "Bild auswählen"}
          </button>
          {value && !uploading && (
            <button
              type="button"
              onClick={() => {
                setNotice("");
                setError("");
                onChange("");
              }}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4" />
              Bild entfernen
            </button>
          )}
          <input
            ref={inputRef}
            type="file"
            accept={IMAGE_TYPES.join(",")}
            className="sr-only"
            tabIndex={-1}
            aria-hidden
            onChange={async (event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (!file) return;
              setError("");
              setNotice("");
              setUploading(true);
              try {
                const result = await uploadFile(file, "image");
                if (!result.ok) {
                  setError(result.error);
                  return;
                }
                onChange(result.url);
                setNotice("Bild hochgeladen. Zum Übernehmen unten auf „Speichern“ tippen.");
              } finally {
                setUploading(false);
              }
            }}
          />
        </div>
      </div>
      <div aria-live="polite">
        {error && (
          <p role="alert" className="mt-3 flex items-start gap-2 text-sm font-medium text-destructive">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            {error}
          </p>
        )}
        {notice && <p className="mt-3 text-sm font-medium text-secondary">{notice}</p>}
      </div>
    </div>
  );
}

export function DocumentUploadField({
  value,
  documentName,
  onUploaded,
  onRemove,
}: {
  value?: string;
  documentName?: string;
  onUploaded: (upload: {
    url: string;
    name: string;
    parsed?: { documentText?: string; entries?: unknown[] };
  }) => void;
  onRemove: () => void;
}) {
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <p className={labelClass}>Notdienstplan (PDF)</p>
      <p className={hintClass}>
        PDF-Datei, höchstens 8 MB. Die Termine werden automatisch aus dem PDF
        ausgelesen und unten angezeigt.
      </p>
      <div className="mt-3 rounded-lg bg-surface-container/60 px-4 py-3 text-sm text-on-surface-variant">
        {value ? (
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-medium text-foreground break-all">
              {documentName || "PDF hinterlegt"}
            </span>
            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center gap-1 font-semibold text-secondary hover:text-primary"
            >
              Öffnen
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </span>
        ) : (
          "Noch keine PDF hinterlegt."
        )}
      </div>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-secondary/10 px-5 text-base font-semibold text-secondary hover:bg-secondary/15 disabled:opacity-60"
        >
          {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageUp className="w-5 h-5" />}
          {uploading ? "Wird hochgeladen …" : value ? "Neue PDF hochladen" : "PDF auswählen"}
        </button>
        {value && !uploading && (
          <button
            type="button"
            onClick={() => {
              setNotice("");
              onRemove();
            }}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4" />
            PDF entfernen
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="sr-only"
          tabIndex={-1}
          aria-hidden
          onChange={async (event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (!file) return;
            setError("");
            setNotice("");
            setUploading(true);
            try {
              const result = await uploadFile(file, "document");
              if (!result.ok) {
                setError(result.error);
                return;
              }
              onUploaded(result);
              setNotice("PDF hochgeladen. Zum Übernehmen unten auf „Speichern“ tippen.");
            } finally {
              setUploading(false);
            }
          }}
        />
      </div>
      <div aria-live="polite">
        {error && (
          <p role="alert" className="mt-3 flex items-start gap-2 text-sm font-medium text-destructive">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            {error}
          </p>
        )}
        {notice && <p className="mt-3 text-sm font-medium text-secondary">{notice}</p>}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sortable, collapsible list items                                    */
/* ------------------------------------------------------------------ */

function SquareButton({
  label,
  onClick,
  disabled,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition-colors disabled:opacity-30 ${
        danger
          ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
          : "bg-surface text-on-surface-variant hover:text-primary hover:bg-surface-high"
      }`}
    >
      {children}
    </button>
  );
}

/**
 * One entry of a list (team member, service, image): header with name,
 * up/down/remove buttons; tapping the name opens the fields.
 */
export function ItemCard({
  title,
  subtitle,
  thumb,
  position,
  count,
  onMove,
  onRemove,
  removeQuestion,
  defaultOpen = false,
  children,
}: {
  title: string;
  subtitle?: string;
  thumb?: React.ReactNode;
  position: number;
  count: number;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
  removeQuestion: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const bodyId = useId();

  return (
    <div className="rounded-xl bg-surface-container/50 ring-1 ring-outline-variant/30">
      <div className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:gap-3">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={bodyId}
          className="flex min-h-12 min-w-0 flex-1 items-center gap-3 rounded-lg px-2 text-left hover:bg-surface-container"
        >
          {thumb}
          <span className="min-w-0 flex-1">
            <span className="block truncate text-base font-bold text-primary">
              {title}
            </span>
            {subtitle && (
              <span className="block truncate text-sm text-on-surface-variant">
                {subtitle}
              </span>
            )}
          </span>
          <span className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-secondary">
            <span className="sr-only sm:not-sr-only">
              {open ? "Zuklappen" : "Bearbeiten"}
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
            />
          </span>
        </button>
        <div className="flex justify-end gap-2">
          <SquareButton
            label={`„${title}“ nach oben schieben`}
            onClick={() => onMove(-1)}
            disabled={position === 0}
          >
            <ArrowUp className="w-5 h-5" />
          </SquareButton>
          <SquareButton
            label={`„${title}“ nach unten schieben`}
            onClick={() => onMove(1)}
            disabled={position === count - 1}
          >
            <ArrowDown className="w-5 h-5" />
          </SquareButton>
          <SquareButton
            label={`„${title}“ entfernen`}
            danger
            onClick={() => {
              if (window.confirm(removeQuestion)) onRemove();
            }}
          >
            <Trash2 className="w-5 h-5" />
          </SquareButton>
        </div>
      </div>
      {open && (
        <div id={bodyId} className="space-y-6 border-t border-outline-variant/30 p-4 sm:p-5">
          {children}
        </div>
      )}
    </div>
  );
}

/** Swaps an item with its neighbour; returns the same array if not possible. */
export function moveItem<T>(items: T[], index: number, direction: -1 | 1): T[] {
  const next = index + direction;
  if (index < 0 || next < 0 || next >= items.length) return items;
  const copy = [...items];
  [copy[index], copy[next]] = [copy[next], copy[index]];
  return copy;
}

/** Visual section inside a form. */
export function FormSection({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 border-b border-outline-variant/40 pb-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-primary">{title}</h2>
          {description && <p className={hintClass}>{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function AddButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-full bg-secondary/10 px-5 text-base font-semibold text-secondary hover:bg-secondary/15 hover:text-primary"
    >
      {children}
    </button>
  );
}
