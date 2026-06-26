/* eslint-disable @next/next/no-img-element */
"use client";

import { useActionState, useMemo, useRef, useState } from "react";
import {
  updateEmergencySettingsAction,
  updateGallerySettingsAction,
  updateServiceSettingsAction,
  updateTeamSettingsAction,
  type SettingsFormState,
} from "@/app/admin/actions";
import type { EmergencySettings } from "@/lib/emergency-settings";
import type { EmergencyEntry } from "@/lib/emergency-settings";
import type { GallerySettings } from "@/lib/gallery-settings";
import type { ServiceSettings } from "@/lib/service-settings";
import type { EditableTeamMember, TeamSettings } from "@/lib/team-settings";
import { Button } from "@/components/ui/button";
import { asset } from "@/lib/utils";
import { ArrowDown, ArrowUp, Plus, Save, Trash2, Upload } from "lucide-react";

const initialState: SettingsFormState = {};
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_DOCUMENT_BYTES = 8 * 1024 * 1024;
const fieldClass =
  "w-full rounded-lg bg-surface-container px-4 py-3 text-sm text-foreground outline-none ring-1 ring-outline-variant/40 focus:ring-2 focus:ring-primary transition";
const labelClass = "block text-sm font-medium text-on-surface-variant mb-1.5";

function linesToArray(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function arrayToLines(value: string[] | undefined): string {
  return value?.join("\n") ?? "";
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function formatBytes(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function uploadValidatedFile(
  file: File,
  kind: "image" | "document",
): Promise<
  | {
      url: string;
      name: string;
      parsed?: { documentText?: string; entries?: EmergencyEntry[] };
    }
  | undefined
> {
  const maxBytes = kind === "image" ? MAX_IMAGE_BYTES : MAX_DOCUMENT_BYTES;
  const validType =
    kind === "image" ? file.type.startsWith("image/") : file.type === "application/pdf";

  if (!validType) {
    window.alert(kind === "image" ? "Bitte eine Bilddatei auswählen." : "Bitte eine PDF-Datei auswählen.");
    return undefined;
  }
  if (file.size > maxBytes) {
    window.alert(`Die Datei ist zu groß. Maximal erlaubt: ${formatBytes(maxBytes)}.`);
    return undefined;
  }

  const formData = new FormData();
  formData.set("kind", kind);
  formData.set("file", file);

  const response = await fetch("/admin/upload", {
    method: "POST",
    body: formData,
  });
  const result = (await response.json().catch(() => ({}))) as {
    url?: string;
    name?: string;
    error?: string;
    parsed?: { documentText?: string; entries?: EmergencyEntry[] };
  };

  if (!response.ok || !result.url) {
    window.alert(result.error || "Upload fehlgeschlagen.");
    return undefined;
  }

  return {
    url: result.url,
    name: result.name || file.name,
    parsed: result.parsed,
  };
}

function ActionStatus({ state }: { state: SettingsFormState }) {
  if (state.error) {
    return <p className="text-sm text-destructive font-medium">{state.error}</p>;
  }
  if (state.success) {
    return <p className="text-sm text-secondary font-medium">Gespeichert.</p>;
  }
  return null;
}

function previewSrc(src: string | undefined): string | undefined {
  if (!src) return undefined;
  if (src.startsWith("data:") || src.startsWith("http")) return src;
  return asset(src);
}

function ImagePreview({
  src,
  alt,
  aspect = "aspect-[4/3]",
}: {
  src?: string;
  alt: string;
  aspect?: string;
}) {
  const resolved = previewSrc(src);
  return (
    <div
      className={`${aspect} w-full overflow-hidden rounded-lg bg-surface ring-1 ring-outline-variant/40`}
    >
      {resolved ? (
        <img src={resolved} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-xs font-medium text-on-surface-variant/60">
          Kein Bild
        </div>
      )}
    </div>
  );
}

function ImageUploadField({
  value,
  onChange,
  alt,
  placeholder,
  aspect = "aspect-[4/3]",
}: {
  value?: string;
  onChange: (value: string) => void;
  alt: string;
  placeholder: string;
  aspect?: string;
}) {
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-3">
      <div className="max-w-64">
        <ImagePreview src={value} alt={alt} aspect={aspect} />
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          className={fieldClass}
          value={value ?? ""}
          onChange={(event) => {
            setFileName("");
            onChange(event.target.value);
          }}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-surface px-4 py-3 text-sm font-medium text-primary hover:bg-surface-high disabled:opacity-60"
        >
          <Upload className="w-4 h-4" />
          {uploading ? "Lädt..." : "Bild wählen"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (!file) return;
            setUploading(true);
            try {
              const uploaded = await uploadValidatedFile(file, "image");
              if (!uploaded) return;
              setFileName(uploaded.name);
              onChange(uploaded.url);
            } finally {
              setUploading(false);
            }
          }}
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              setFileName("");
              onChange("");
            }}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/20"
          >
            <Trash2 className="w-4 h-4" />
            Entfernen
          </button>
        )}
      </div>
      <p className="text-xs text-on-surface-variant/70">
        {fileName
          ? `${fileName} ausgewählt. Mit Speichern übernehmen.`
          : "Bestehenden Pfad/URL verwenden oder ein Bild auswählen."}
      </p>
    </div>
  );
}

function DocumentUploadField({
  value,
  documentName,
  onChange,
}: {
  value?: string;
  documentName?: string;
  onChange: (patch: {
    documentUrl: string;
    documentName?: string;
    documentText?: string;
    entries?: EmergencyEntry[];
  }) => void;
}) {
  const [fileName, setFileName] = useState(documentName ?? "");
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          className={fieldClass}
          value={value ?? ""}
          onChange={(event) => {
            setFileName("");
            onChange({ documentUrl: event.target.value });
          }}
          placeholder="https://.../notdienst.pdf"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-surface px-4 py-3 text-sm font-medium text-primary hover:bg-surface-high disabled:opacity-60"
        >
          <Upload className="w-4 h-4" />
          {uploading ? "Lädt..." : "PDF wählen"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="sr-only"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (!file) return;
            setUploading(true);
            try {
              const uploaded = await uploadValidatedFile(file, "document");
              if (!uploaded) return;
              setFileName(uploaded.name);
              onChange({
                documentUrl: uploaded.url,
                documentName: uploaded.name,
                documentText: uploaded.parsed?.documentText,
                entries: uploaded.parsed?.entries,
              });
            } finally {
              setUploading(false);
            }
          }}
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              setFileName("");
              onChange({ documentUrl: "", documentName: "" });
            }}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/20"
          >
            <Trash2 className="w-4 h-4" />
            Entfernen
          </button>
        )}
      </div>
      <div className="rounded-lg bg-surface-container/60 px-4 py-3 text-xs text-on-surface-variant">
        {value ? (
          <div className="flex flex-col gap-1">
            <span className="font-medium text-foreground">
              {fileName || "Dokument hinterlegt"}
            </span>
            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              className="text-secondary hover:text-primary"
            >
              Aktuelles Dokument öffnen
            </a>
            <span>Mit Speichern übernehmen.</span>
          </div>
        ) : (
          "Keine PDF hinterlegt."
        )}
      </div>
    </div>
  );
}

function IconButton({
  label,
  children,
  onClick,
  disabled,
}: {
  label: string;
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-surface text-on-surface-variant hover:text-primary disabled:opacity-40"
    >
      {children}
    </button>
  );
}

export function TeamSettingsForm({ initial }: { initial: TeamSettings }) {
  const [state, action, pending] = useActionState(
    updateTeamSettingsAction,
    initialState,
  );
  const [settings, setSettings] = useState(initial);

  const payload = useMemo(() => JSON.stringify(settings), [settings]);

  function updateMember(id: string, patch: Partial<EditableTeamMember>) {
    setSettings((current) => ({
      ...current,
      members: current.members.map((member) =>
        member.id === id ? { ...member, ...patch } : member,
      ),
    }));
  }

  function addMember(group: EditableTeamMember["group"]) {
    const id = crypto.randomUUID();
    setSettings((current) => ({
      ...current,
      members: [
        ...current.members,
        { id, group, name: "Neues Teammitglied", role: "", qualifications: [] },
      ],
    }));
  }

  function removeMember(id: string) {
    setSettings((current) => ({
      ...current,
      members: current.members.filter((member) => member.id !== id),
    }));
  }

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="payload" value={payload} />
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Überschrift</label>
          <input
            className={fieldClass}
            value={settings.intro.heading}
            onChange={(event) =>
              setSettings((current) => ({
                ...current,
                intro: { ...current.intro, heading: event.target.value },
              }))
            }
          />
        </div>
        <div>
          <label className={labelClass}>Team-Unterzeile</label>
          <input
            className={fieldClass}
            value={settings.intro.subheading}
            onChange={(event) =>
              setSettings((current) => ({
                ...current,
                intro: { ...current.intro, subheading: event.target.value },
              }))
            }
          />
        </div>
      </div>
      <div>
        <label className={labelClass}>Introtext</label>
        <textarea
          className={fieldClass}
          rows={3}
          value={settings.intro.text}
          onChange={(event) =>
            setSettings((current) => ({
              ...current,
              intro: { ...current.intro, text: event.target.value },
            }))
          }
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => addMember("dentists")}
          className="inline-flex items-center gap-2 text-sm font-medium text-secondary hover:text-primary"
        >
          <Plus className="w-4 h-4" />
          Zahnarzt hinzufügen
        </button>
        <button
          type="button"
          onClick={() => addMember("assistants")}
          className="inline-flex items-center gap-2 text-sm font-medium text-secondary hover:text-primary"
        >
          <Plus className="w-4 h-4" />
          Teammitglied hinzufügen
        </button>
      </div>

      <div className="space-y-4">
        {settings.members.map((member) => (
          <div key={member.id} className="rounded-xl bg-surface-container/50 p-5">
            <div className="flex items-center justify-between gap-3 mb-4">
              <span className="text-xs font-semibold text-secondary uppercase tracking-[0.15em]">
                {member.group === "dentists" ? "Zahnarzt" : "Team"}
              </span>
              <IconButton label="Teammitglied entfernen" onClick={() => removeMember(member.id)}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </IconButton>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Name</label>
                <input
                  className={fieldClass}
                  value={member.name}
                  onChange={(event) =>
                    updateMember(member.id, { name: event.target.value })
                  }
                />
              </div>
              <div>
                <label className={labelClass}>Rolle</label>
                <input
                  className={fieldClass}
                  value={member.role}
                  onChange={(event) =>
                    updateMember(member.id, { role: event.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className={labelClass}>Beschreibung</label>
                <textarea
                  className={fieldClass}
                  rows={4}
                  value={member.description ?? ""}
                  onChange={(event) =>
                    updateMember(member.id, { description: event.target.value })
                  }
                />
              </div>
              <div>
                <label className={labelClass}>Werdegang, eine Zeile pro Punkt</label>
                <textarea
                  className={fieldClass}
                  rows={4}
                  value={arrayToLines(member.qualifications)}
                  onChange={(event) =>
                    updateMember(member.id, {
                      qualifications: linesToArray(event.target.value),
                    })
                  }
                />
              </div>
            </div>
            <div className="mt-4">
              <label className={labelClass}>Bild</label>
              <ImageUploadField
                value={member.image}
                onChange={(image) => updateMember(member.id, { image })}
                alt={member.name || "Teammitglied"}
                placeholder="/images/team/name.jpg"
                aspect="aspect-[3/4]"
              />
            </div>
          </div>
        ))}
      </div>

      <ActionStatus state={state} />
      <Button type="submit" disabled={pending} className="gap-2 rounded-full">
        <Save className="w-4 h-4" />
        {pending ? "Speichern..." : "Team speichern"}
      </Button>
    </form>
  );
}

export function GallerySettingsForm({ initial }: { initial: GallerySettings }) {
  const [state, action, pending] = useActionState(
    updateGallerySettingsAction,
    initialState,
  );
  const [settings, setSettings] = useState(initial);
  const payload = useMemo(() => JSON.stringify(settings), [settings]);

  function updateImage(id: string, patch: Partial<GallerySettings["images"][number]>) {
    setSettings((current) => ({
      images: current.images.map((image) =>
        image.id === id ? { ...image, ...patch } : image,
      ),
    }));
  }

  function moveImage(id: string, direction: -1 | 1) {
    setSettings((current) => {
      const index = current.images.findIndex((image) => image.id === id);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= current.images.length) {
        return current;
      }
      const images = [...current.images];
      [images[index], images[nextIndex]] = [images[nextIndex], images[index]];
      return { images };
    });
  }

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="payload" value={payload} />
      <button
        type="button"
        onClick={() =>
          setSettings((current) => ({
            images: [
              ...current.images,
              {
                id: crypto.randomUUID(),
                src: "",
                alt: "",
                title: "Neues Bild",
                copy: "",
              },
            ],
          }))
        }
        className="inline-flex items-center gap-2 text-sm font-medium text-secondary hover:text-primary"
      >
        <Plus className="w-4 h-4" />
        Bild hinzufügen
      </button>
      {settings.images.map((image, index) => (
        <div key={image.id} className="rounded-xl bg-surface-container/50 p-5">
          <div className="flex items-center justify-between gap-3 mb-4">
            <span className="text-xs font-semibold text-secondary uppercase tracking-[0.15em]">
              Bild {index + 1}
            </span>
            <div className="flex gap-2">
              <IconButton label="Nach oben" onClick={() => moveImage(image.id, -1)} disabled={index === 0}>
                <ArrowUp className="w-4 h-4" />
              </IconButton>
              <IconButton label="Nach unten" onClick={() => moveImage(image.id, 1)} disabled={index === settings.images.length - 1}>
                <ArrowDown className="w-4 h-4" />
              </IconButton>
              <IconButton
                label="Bild entfernen"
                onClick={() =>
                  setSettings((current) => ({
                    images: current.images.filter((item) => item.id !== image.id),
                  }))
                }
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </IconButton>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Titel</label>
              <input
                className={fieldClass}
                value={image.title}
                onChange={(event) => updateImage(image.id, { title: event.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Alt-Text</label>
              <input
                className={fieldClass}
                value={image.alt}
                onChange={(event) => updateImage(image.id, { alt: event.target.value })}
              />
            </div>
          </div>
          <div className="mt-4">
            <label className={labelClass}>Bild</label>
            <ImageUploadField
              value={image.src}
              onChange={(src) => updateImage(image.id, { src })}
              alt={image.alt || image.title}
              placeholder="/images/gallery/bild.jpg"
            />
          </div>
          <div className="mt-4">
            <label className={labelClass}>Copy</label>
            <textarea
              className={fieldClass}
              rows={3}
              value={image.copy ?? ""}
              onChange={(event) => updateImage(image.id, { copy: event.target.value })}
            />
          </div>
        </div>
      ))}
      <ActionStatus state={state} />
      <Button type="submit" disabled={pending} className="gap-2 rounded-full">
        <Save className="w-4 h-4" />
        {pending ? "Speichern..." : "Galerie speichern"}
      </Button>
    </form>
  );
}

export function ServiceSettingsForm({ initial }: { initial: ServiceSettings }) {
  const [state, action, pending] = useActionState(
    updateServiceSettingsAction,
    initialState,
  );
  const [settings, setSettings] = useState(initial);
  const payload = useMemo(() => JSON.stringify(settings), [settings]);

  function updateService(slug: string, patch: Partial<ServiceSettings["services"][number]>) {
    setSettings((current) => ({
      ...current,
      services: current.services.map((service) =>
        service.slug === slug ? { ...service, ...patch } : service,
      ),
    }));
  }

  return (
    <form action={action} className="space-y-8">
      <input type="hidden" name="payload" value={payload} />

      <div className="rounded-2xl border border-outline-variant/40 bg-surface p-6 lg:p-7 shadow-[0_14px_35px_rgba(16,59,92,0.04)]">
        <div className="mb-6 border-b border-outline-variant/40 pb-4">
          <p className="text-xs font-semibold text-secondary uppercase tracking-[0.18em]">
            Übersichtsseite
          </p>
          <h3 className="mt-1 text-lg font-bold text-primary">
            Allgemeine Leistungsinhalte
          </h3>
        </div>

        <div className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Überschrift</label>
              <input
                className={fieldClass}
                value={settings.overview.heading}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    overview: { ...current.overview, heading: event.target.value },
                  }))
                }
              />
            </div>
            <div>
              <label className={labelClass}>Bereichsüberschrift</label>
              <input
                className={fieldClass}
                value={settings.overview.treatmentHeading}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    overview: {
                      ...current.overview,
                      treatmentHeading: event.target.value,
                    },
                  }))
                }
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Angstpatienten-Text</label>
            <textarea
              className={fieldClass}
              rows={3}
              value={settings.overview.anxiousPatients}
              onChange={(event) =>
                setSettings((current) => ({
                  ...current,
                  overview: {
                    ...current.overview,
                    anxiousPatients: event.target.value,
                  },
                }))
              }
            />
          </div>
          <div>
            <label className={labelClass}>
              Behandlungsspektrum, eine Zeile pro Punkt
            </label>
            <textarea
              className={fieldClass}
              rows={7}
              value={arrayToLines(settings.overview.allServices)}
              onChange={(event) =>
                setSettings((current) => ({
                  ...current,
                  overview: {
                    ...current.overview,
                    allServices: linesToArray(event.target.value),
                  },
                }))
              }
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-outline-variant/40 bg-surface p-6 lg:p-7 shadow-[0_14px_35px_rgba(16,59,92,0.04)]">
        <div className="mb-6 flex flex-col gap-4 border-b border-outline-variant/40 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold text-secondary uppercase tracking-[0.18em]">
              Detailseiten
            </p>
            <h3 className="mt-1 text-lg font-bold text-primary">
              Einzelne Leistungen
            </h3>
          </div>
          <button
            type="button"
            onClick={() =>
              setSettings((current) => ({
                ...current,
                services: [
                  ...current.services,
                  {
                    slug: `leistung-${crypto.randomUUID().slice(0, 8)}`,
                    title: "Neue Leistung",
                    pageTitle: "Neue Leistung",
                    shortDescription: "",
                    content: [],
                    bulletPoints: [],
                  },
                ],
              }))
            }
            className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-sm font-semibold text-secondary hover:bg-secondary/15 hover:text-primary"
          >
            <Plus className="w-4 h-4" />
            Leistung hinzufügen
          </button>
        </div>

        <div className="space-y-6">
          {settings.services.map((service) => (
        <div key={service.slug} className="rounded-xl border border-outline-variant/50 bg-surface-container/60 p-5 lg:p-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <span className="text-xs font-semibold text-secondary uppercase tracking-[0.15em]">
                /leistungen/{service.slug}
              </span>
              <h4 className="mt-1 text-base font-bold text-primary">
                {service.title || "Neue Leistung"}
              </h4>
            </div>
            <IconButton
              label="Leistung entfernen"
              onClick={() =>
                setSettings((current) => ({
                  ...current,
                  services: current.services.filter((item) => item.slug !== service.slug),
                }))
              }
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </IconButton>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Titel</label>
              <input
                className={fieldClass}
                value={service.title}
                onChange={(event) => {
                  const title = event.target.value;
                  updateService(service.slug, { title });
                }}
              />
            </div>
            <div>
              <label className={labelClass}>Slug</label>
              <input
                className={fieldClass}
                value={service.slug}
                onChange={(event) =>
                  updateService(service.slug, { slug: slugify(event.target.value) })
                }
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className={labelClass}>Seitentitel</label>
              <input
                className={fieldClass}
                value={service.pageTitle}
                onChange={(event) =>
                  updateService(service.slug, { pageTitle: event.target.value })
                }
              />
            </div>
            <div>
              <label className={labelClass}>Kurzbeschreibung</label>
              <input
                className={fieldClass}
                value={service.shortDescription}
                onChange={(event) =>
                  updateService(service.slug, {
                    shortDescription: event.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="mt-4">
            <label className={labelClass}>Bild</label>
            <ImageUploadField
              value={service.image}
              onChange={(image) => updateService(service.slug, { image })}
              alt={service.title || "Leistung"}
              placeholder="/images/leistung.jpg"
              aspect="aspect-[16/9]"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className={labelClass}>Copy, ein Absatz pro Zeile</label>
              <textarea
                className={fieldClass}
                rows={6}
                value={arrayToLines(service.content)}
                onChange={(event) =>
                  updateService(service.slug, {
                    content: linesToArray(event.target.value),
                  })
                }
              />
            </div>
            <div>
              <label className={labelClass}>Detailpunkte, eine Zeile pro Punkt</label>
              <textarea
                className={fieldClass}
                rows={6}
                value={arrayToLines(service.bulletPoints)}
                onChange={(event) =>
                  updateService(service.slug, {
                    bulletPoints: linesToArray(event.target.value),
                  })
                }
              />
            </div>
          </div>
          <label className="mt-4 inline-flex items-center gap-2 text-sm text-on-surface-variant">
            <input
              type="checkbox"
              checked={Boolean(service.underConstruction)}
              onChange={(event) =>
                updateService(service.slug, {
                  underConstruction: event.target.checked,
                })
              }
            />
            Als Demnächst markieren
          </label>
        </div>
          ))}
        </div>
      </div>

      <ActionStatus state={state} />
      <Button type="submit" disabled={pending} className="gap-2 rounded-full">
        <Save className="w-4 h-4" />
        {pending ? "Speichern..." : "Leistungen speichern"}
      </Button>
    </form>
  );
}

export function EmergencySettingsForm({
  initial,
}: {
  initial: EmergencySettings;
}) {
  const [state, action, pending] = useActionState(
    updateEmergencySettingsAction,
    initialState,
  );
  const [settings, setSettings] = useState(initial);
  const payload = useMemo(() => JSON.stringify(settings), [settings]);

  function updateEntry(id: string, patch: Partial<EmergencyEntry>) {
    setSettings((current) => ({
      ...current,
      entries: current.entries.map((entry) =>
        entry.id === id ? { ...entry, ...patch } : entry,
      ),
    }));
  }

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="payload" value={payload} />
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Seitentitel</label>
          <input
            className={fieldClass}
            value={settings.title}
            onChange={(event) =>
              setSettings((current) => ({ ...current, title: event.target.value }))
            }
          />
        </div>
        <div>
          <label className={labelClass}>Download-Button</label>
          <input
            className={fieldClass}
            value={settings.documentLabel}
            onChange={(event) =>
              setSettings((current) => ({
                ...current,
                documentLabel: event.target.value,
              }))
            }
          />
        </div>
      </div>
      <div>
        <label className={labelClass}>Intro</label>
        <textarea
          className={fieldClass}
          rows={4}
          value={settings.intro}
          onChange={(event) =>
            setSettings((current) => ({ ...current, intro: event.target.value }))
          }
        />
      </div>
      <div>
        <label className={labelClass}>Kein Notfall, eine Zeile pro Punkt</label>
        <textarea
          className={fieldClass}
          rows={5}
          value={arrayToLines(settings.nonEmergencyItems)}
          onChange={(event) =>
            setSettings((current) => ({
              ...current,
              nonEmergencyItems: linesToArray(event.target.value),
            }))
          }
        />
      </div>
      <div>
        <label className={labelClass}>Sprechzeiten-Text</label>
        <textarea
          className={fieldClass}
          rows={3}
          value={settings.consultationText}
          onChange={(event) =>
            setSettings((current) => ({
              ...current,
              consultationText: event.target.value,
            }))
          }
        />
      </div>
      <div>
        <label className={labelClass}>Dokument-URL oder Upload</label>
        <DocumentUploadField
          value={settings.documentUrl}
          documentName={settings.documentName}
          onChange={(patch) =>
            setSettings((current) => ({
              ...current,
              documentUrl: patch.documentUrl,
              documentName: patch.documentName,
              documentText: patch.documentText ?? current.documentText,
              entries: patch.entries ?? current.entries,
            }))
          }
        />
      </div>
      <div className="rounded-2xl border border-outline-variant/40 bg-surface p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold text-secondary uppercase tracking-[0.16em]">
              Sichtbarer Notdienstplan
            </p>
            <h3 className="mt-1 text-base font-bold text-primary">
              Aus dem PDF extrahierte Inhalte
            </h3>
          </div>
          <button
            type="button"
            onClick={() =>
              setSettings((current) => ({
                ...current,
                entries: [
                  ...current.entries,
                  {
                    id: crypto.randomUUID(),
                    date: "",
                    time: "",
                    district: "",
                    practice: "",
                    address: "",
                    phone: "",
                  },
                ],
              }))
            }
            className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-sm font-semibold text-secondary hover:bg-secondary/15 hover:text-primary"
          >
            <Plus className="w-4 h-4" />
            Zeile hinzufügen
          </button>
        </div>

        {settings.entries.length > 0 ? (
          <div className="space-y-4">
            {settings.entries.map((entry, index) => (
              <div
                key={entry.id}
                className="rounded-xl bg-surface-container/60 p-4"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-secondary uppercase tracking-[0.14em]">
                    Zeile {index + 1}
                  </span>
                  <IconButton
                    label="Zeile entfernen"
                    onClick={() =>
                      setSettings((current) => ({
                        ...current,
                        entries: current.entries.filter(
                          (item) => item.id !== entry.id,
                        ),
                      }))
                    }
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </IconButton>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Datum</label>
                    <input
                      className={fieldClass}
                      value={entry.date}
                      onChange={(event) =>
                        updateEntry(entry.id, { date: event.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Uhrzeit</label>
                    <input
                      className={fieldClass}
                      value={entry.time ?? ""}
                      onChange={(event) =>
                        updateEntry(entry.id, { time: event.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Bereich / Stadt</label>
                    <input
                      className={fieldClass}
                      value={entry.district ?? ""}
                      onChange={(event) =>
                        updateEntry(entry.id, { district: event.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Praxis</label>
                    <input
                      className={fieldClass}
                      value={entry.practice}
                      onChange={(event) =>
                        updateEntry(entry.id, { practice: event.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Telefon</label>
                    <input
                      className={fieldClass}
                      value={entry.phone ?? ""}
                      onChange={(event) =>
                        updateEntry(entry.id, { phone: event.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className={labelClass}>Adresse</label>
                  <input
                    className={fieldClass}
                    value={entry.address ?? ""}
                    onChange={(event) =>
                      updateEntry(entry.id, { address: event.target.value })
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-xl bg-surface-container/60 p-4 text-sm text-on-surface-variant">
            Noch keine Tabellenzeilen extrahiert. Laden Sie eine PDF hoch oder
            fügen Sie die Zeilen manuell hinzu.
          </p>
        )}

        <div className="mt-5">
          <label className={labelClass}>
            Extrahierter Volltext als Fallback
          </label>
          <textarea
            className={fieldClass}
            rows={6}
            value={settings.documentText ?? ""}
            onChange={(event) =>
              setSettings((current) => ({
                ...current,
                documentText: event.target.value,
              }))
            }
          />
        </div>
      </div>
      <ActionStatus state={state} />
      <Button type="submit" disabled={pending} className="gap-2 rounded-full">
        <Save className="w-4 h-4" />
        {pending ? "Speichern..." : "Notdienst speichern"}
      </Button>
    </form>
  );
}
