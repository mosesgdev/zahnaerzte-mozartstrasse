"use client";

import { useState } from "react";
import {
  updateEmergencySettingsAction,
  updateGallerySettingsAction,
  updateServiceSettingsAction,
  updateSiteSettingsAction,
  updateTeamSettingsAction,
} from "@/app/admin/actions";
import type { OpeningHoursEntry, SiteSettings } from "@/lib/site-settings";
import type { EmergencyEntry, EmergencySettings } from "@/lib/emergency-settings";
import type { GallerySettings } from "@/lib/gallery-settings";
import type { ServiceSettings } from "@/lib/service-settings";
import type { EditableTeamMember, TeamSettings } from "@/lib/team-settings";
import type { Service } from "@content/services";
import { slugify } from "@/lib/text";
import {
  AddButton,
  CheckboxField,
  DocumentUploadField,
  FormSection,
  ImageUploadField,
  ItemCard,
  LinesField,
  ParagraphsField,
  SaveBar,
  TextAreaField,
  TextField,
  Thumb,
  fieldClass,
  moveItem,
  useSettingsForm,
} from "@/components/admin/form-kit";
import { Plus, Trash2 } from "lucide-react";

const json = (value: unknown) => JSON.stringify(value);

/* ------------------------------------------------------------------ */
/* Team                                                                */
/* ------------------------------------------------------------------ */

const teamGroups: { group: EditableTeamMember["group"]; title: string; add: string }[] = [
  { group: "dentists", title: "Zahnärzte", add: "Zahnarzt hinzufügen" },
  { group: "assistants", title: "Praxisteam", add: "Teammitglied hinzufügen" },
];

export function TeamSettingsForm({ initial }: { initial: TeamSettings }) {
  const { settings, setSettings, payload, state, action, pending, dirty } =
    useSettingsForm(initial, updateTeamSettingsAction, json);
  const [newIds, setNewIds] = useStateSet();

  function updateMember(id: string, patch: Partial<EditableTeamMember>) {
    setSettings((current) => ({
      ...current,
      members: current.members.map((member) =>
        member.id === id ? { ...member, ...patch } : member,
      ),
    }));
  }

  /** Moves a member up/down within its own group (Zahnärzte / Praxisteam). */
  function moveMember(id: string, direction: -1 | 1) {
    setSettings((current) => {
      const member = current.members.find((m) => m.id === id);
      if (!member) return current;
      const groupIndexes = current.members
        .map((m, index) => (m.group === member.group ? index : -1))
        .filter((index) => index >= 0);
      const position = groupIndexes.indexOf(current.members.indexOf(member));
      const target = groupIndexes[position + direction];
      if (target === undefined) return current;
      const members = [...current.members];
      [members[groupIndexes[position]], members[target]] = [
        members[target],
        members[groupIndexes[position]],
      ];
      return { ...current, members };
    });
  }

  function addMember(group: EditableTeamMember["group"]) {
    const id = crypto.randomUUID();
    setNewIds(id);
    setSettings((current) => ({
      ...current,
      members: [...current.members, { id, group, name: "", role: "", qualifications: [] }],
    }));
  }

  return (
    <form action={action} className="space-y-10">
      <input type="hidden" name="payload" value={payload} />

      <FormSection
        title="Kopfbereich der Teamseite"
        description="Der Text ganz oben auf der Seite „Team“."
      >
        <TextField
          label="Überschrift"
          value={settings.intro.heading}
          onChange={(heading) =>
            setSettings((current) => ({ ...current, intro: { ...current.intro, heading } }))
          }
        />
        <TextField
          label="Unterzeile"
          value={settings.intro.subheading}
          onChange={(subheading) =>
            setSettings((current) => ({ ...current, intro: { ...current.intro, subheading } }))
          }
        />
        <TextAreaField
          markdown
          label="Einleitungstext"
          rows={4}
          value={settings.intro.text}
          onChange={(text) =>
            setSettings((current) => ({ ...current, intro: { ...current.intro, text } }))
          }
        />
      </FormSection>

      {teamGroups.map(({ group, title, add }) => {
        const members = settings.members.filter((member) => member.group === group);
        return (
          <FormSection
            key={group}
            title={title}
            description={
              group === "dentists"
                ? "Die erste Person wird groß oben auf der Teamseite und auf der Startseite gezeigt."
                : "Reihenfolge mit den Pfeilen ändern. Zum Bearbeiten auf den Namen tippen."
            }
          >
            <div className="space-y-3">
              {members.map((member, index) => (
                <ItemCard
                  key={member.id}
                  title={member.name || "Neue Person"}
                  subtitle={member.role}
                  thumb={<Thumb src={member.image} alt="" className="h-14 w-11" />}
                  position={index}
                  count={members.length}
                  onMove={(direction) => moveMember(member.id, direction)}
                  onRemove={() =>
                    setSettings((current) => ({
                      ...current,
                      members: current.members.filter((m) => m.id !== member.id),
                    }))
                  }
                  removeQuestion={`„${member.name || "Neue Person"}“ wirklich von der Website entfernen?`}
                  defaultOpen={newIds.has(member.id)}
                >
                  <TextField
                    label="Name"
                    required
                    value={member.name}
                    onChange={(name) => updateMember(member.id, { name })}
                    placeholder="z. B. Dr. Maria Muster"
                  />
                  <TextField
                    label="Funktion"
                    required
                    hint="z. B. Zahnärztin, Prophylaxe-Fachkraft, Auszubildende"
                    value={member.role}
                    onChange={(role) => updateMember(member.id, { role })}
                  />
                  <TextAreaField
                    markdown
                    label="Vorstellungstext"
                    value={member.description ?? ""}
                    onChange={(description) => updateMember(member.id, { description })}
                  />
                  <LinesField
                    label="Werdegang und Qualifikationen"
                    hint="Ein Eintrag pro Zeile, z. B. „Studium der Zahnmedizin: 2005–2010“."
                    value={member.qualifications}
                    onChange={(qualifications) => updateMember(member.id, { qualifications })}
                  />
                  <ImageUploadField
                    label="Foto"
                    value={member.image}
                    onChange={(image) => updateMember(member.id, { image })}
                    alt={member.name || "Teammitglied"}
                    sizeHint="Am besten ein Hochformat-Porträt"
                    aspect="aspect-[3/4]"
                  />
                </ItemCard>
              ))}
            </div>
            <AddButton onClick={() => addMember(group)}>
              <Plus className="w-5 h-5" />
              {add}
            </AddButton>
          </FormSection>
        );
      })}

      <SaveBar
        state={state}
        pending={pending}
        dirty={dirty}
        label="Team speichern"
        publicHref="/team"
      />
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Gallery                                                             */
/* ------------------------------------------------------------------ */

export function GallerySettingsForm({ initial }: { initial: GallerySettings }) {
  const { settings, setSettings, payload, state, action, pending, dirty } =
    useSettingsForm(initial, updateGallerySettingsAction, json);
  const [newIds, setNewIds] = useStateSet();

  function updateImage(id: string, patch: Partial<GallerySettings["images"][number]>) {
    setSettings((current) => ({
      images: current.images.map((image) =>
        image.id === id ? { ...image, ...patch } : image,
      ),
    }));
  }

  return (
    <form action={action} className="space-y-8">
      <input type="hidden" name="payload" value={payload} />

      <FormSection
        title="Bilder"
        description="Die Bilder erscheinen in dieser Reihenfolge auf der Seite „Praxisgalerie“. Zum Bearbeiten auf den Titel tippen."
      >
        <div className="space-y-3">
          {settings.images.map((image, index) => (
            <ItemCard
              key={image.id}
              title={image.title || "Neues Bild"}
              subtitle={`Bild ${index + 1}`}
              thumb={<Thumb src={image.src} alt="" />}
              position={index}
              count={settings.images.length}
              onMove={(direction) =>
                setSettings((current) => ({
                  images: moveItem(current.images, index, direction),
                }))
              }
              onRemove={() =>
                setSettings((current) => ({
                  images: current.images.filter((item) => item.id !== image.id),
                }))
              }
              removeQuestion={`Bild „${image.title || "Neues Bild"}“ wirklich aus der Galerie entfernen?`}
              defaultOpen={newIds.has(image.id)}
            >
              <ImageUploadField
                label="Bild"
                value={image.src}
                onChange={(src) => updateImage(image.id, { src })}
                alt={image.alt || image.title}
                sizeHint="Querformat, mindestens 1200 Pixel breit"
              />
              <TextField
                label="Titel"
                required
                hint="Kurze Überschrift unter dem Bild, z. B. „Wartezimmer“."
                value={image.title}
                onChange={(title) => updateImage(image.id, { title })}
              />
              <TextAreaField
                markdown
                label="Bildunterschrift (optional)"
                rows={3}
                value={image.copy ?? ""}
                onChange={(copy) => updateImage(image.id, { copy })}
              />
              <TextField
                label="Bildbeschreibung für Sehbehinderte (optional)"
                hint="Wird vorgelesen, wenn jemand das Bild nicht sehen kann. Leer lassen = Titel wird verwendet."
                value={image.alt}
                onChange={(alt) => updateImage(image.id, { alt })}
              />
            </ItemCard>
          ))}
        </div>
        <AddButton
          onClick={() => {
            const id = crypto.randomUUID();
            setNewIds(id);
            setSettings((current) => ({
              images: [...current.images, { id, src: "", alt: "", title: "", copy: "" }],
            }));
          }}
        >
          <Plus className="w-5 h-5" />
          Bild hinzufügen
        </AddButton>
      </FormSection>

      <SaveBar
        state={state}
        pending={pending}
        dirty={dirty}
        label="Galerie speichern"
        publicHref="/praxisgalerie"
      />
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Services                                                            */
/* ------------------------------------------------------------------ */

interface EditableService extends Service {
  /** Stable React key; the slug may be edited. */
  _key: string;
  /** Slug as loaded from the server ("" for new services). */
  _originalSlug: string;
  /** True once the menu name was edited in this session. */
  _menuTouched?: boolean;
}

interface EditableServiceSettings {
  overview: ServiceSettings["overview"];
  services: EditableService[];
}

function toEditable(settings: ServiceSettings): EditableServiceSettings {
  return {
    overview: settings.overview,
    services: settings.services.map((service) => ({
      ...service,
      _key: service.slug,
      _originalSlug: service.slug,
    })),
  };
}

function effectiveSlug(service: Service): string {
  return slugify(service.slug) || slugify(service.title);
}

/** Strips editor-only fields; a changed slug keeps the old one for redirects. */
function serializeServices(settings: EditableServiceSettings): string {
  const result: ServiceSettings = {
    overview: settings.overview,
    services: settings.services.map((editable) => {
      const { _key, _originalSlug, _menuTouched, ...service } = editable;
      void _key;
      void _menuTouched;
      const slug = effectiveSlug(service);
      const previousSlugs = [...(service.previousSlugs ?? [])];
      if (_originalSlug && _originalSlug !== slug) previousSlugs.push(_originalSlug);
      return { ...service, slug, previousSlugs };
    }),
  };
  return JSON.stringify(result);
}

export function ServiceSettingsForm({ initial }: { initial: ServiceSettings }) {
  const { settings, setSettings, payload, state, action, pending, dirty } =
    useSettingsForm(toEditable(initial), updateServiceSettingsAction, serializeServices);
  const [newIds, setNewIds] = useStateSet();

  function updateService(key: string, patch: Partial<EditableService>) {
    setSettings((current) => ({
      ...current,
      services: current.services.map((service) =>
        service._key === key ? { ...service, ...patch } : service,
      ),
    }));
  }

  function updateOverview(patch: Partial<ServiceSettings["overview"]>) {
    setSettings((current) => ({ ...current, overview: { ...current.overview, ...patch } }));
  }

  return (
    <form action={action} className="space-y-10">
      <input type="hidden" name="payload" value={payload} />

      <FormSection
        title="Einzelne Leistungen"
        description="Jede Leistung hat eine eigene Seite. Der Name erscheint im Menü, in der Übersicht und im Browser-Tab. Reihenfolge mit den Pfeilen ändern."
      >
        <div className="space-y-3">
          {settings.services.map((service, index) => {
            const slug = effectiveSlug(service);
            return (
              <ItemCard
                key={service._key}
                title={service.title || "Neue Leistung"}
                subtitle={
                  service.underConstruction ? "Als „Demnächst“ markiert" : `/leistungen/${slug}`
                }
                thumb={<Thumb src={service.image} alt="" />}
                position={index}
                count={settings.services.length}
                onMove={(direction) =>
                  setSettings((current) => ({
                    ...current,
                    services: moveItem(current.services, index, direction),
                  }))
                }
                onRemove={() =>
                  setSettings((current) => ({
                    ...current,
                    services: current.services.filter((s) => s._key !== service._key),
                  }))
                }
                removeQuestion={`Leistung „${service.title || "Neue Leistung"}“ wirklich entfernen? Die Seite ist danach nicht mehr erreichbar.`}
                defaultOpen={newIds.has(service._key)}
              >
                <TextField
                  label="Name der Leistung"
                  required
                  hint="Erscheint im Menü, in der Leistungsübersicht und im Browser-Tab. Die Webadresse der Seite bleibt beim Umbenennen gleich."
                  value={service.title}
                  onChange={(title) =>
                    updateService(service._key, {
                      title,
                      // Without an own menu name, the menu follows the new name.
                      ...(service._menuTouched ? {} : { menuLabel: "" }),
                    })
                  }
                  placeholder="z. B. Endodontie"
                />
                <TextField
                  label="Kürzerer Name fürs Menü (optional)"
                  hint="Leer lassen = Name der Leistung wird verwendet."
                  value={service.menuLabel ?? ""}
                  onChange={(menuLabel) =>
                    updateService(service._key, { menuLabel, _menuTouched: true })
                  }
                />
                <TextField
                  label="Überschrift auf der Leistungsseite"
                  hint="Die große Überschrift oben auf der Seite dieser Leistung."
                  value={service.pageTitle}
                  onChange={(pageTitle) => updateService(service._key, { pageTitle })}
                />
                <TextAreaField
                  label="Kurzbeschreibung"
                  hint="Ein bis zwei Sätze für die Leistungsübersicht und die Startseite."
                  rows={3}
                  value={service.shortDescription}
                  onChange={(shortDescription) =>
                    updateService(service._key, { shortDescription })
                  }
                />
                <ParagraphsField
                  label="Beschreibungstext"
                  value={service.content}
                  onChange={(content) => updateService(service._key, { content })}
                />
                <LinesField
                  label="Stichpunkte „Unsere Leistungen im Detail“"
                  hint="Ein Stichpunkt pro Zeile. Leer lassen, wenn keine Stichpunkte gezeigt werden sollen."
                  value={service.bulletPoints}
                  onChange={(bulletPoints) => updateService(service._key, { bulletPoints })}
                />
                <ImageUploadField
                  label="Bild"
                  value={service.image}
                  onChange={(image) => updateService(service._key, { image })}
                  alt={service.title || "Leistung"}
                  sizeHint="Querformat, mindestens 1200 Pixel breit"
                  aspect="aspect-[16/9]"
                />
                <ExtraImagesField
                  images={service.images ?? []}
                  alt={service.title || "Leistung"}
                  onChange={(images) => updateService(service._key, { images })}
                />
                <CheckboxField
                  label="Als „Demnächst“ markieren"
                  hint="Zeigt einen Hinweis, dass diese Seite noch erweitert wird."
                  checked={Boolean(service.underConstruction)}
                  onChange={(underConstruction) =>
                    updateService(service._key, { underConstruction })
                  }
                />
                <details className="rounded-lg bg-surface p-4">
                  <summary className="min-h-11 cursor-pointer content-center text-base font-semibold text-primary">
                    Weitere Einstellungen: Webadresse
                  </summary>
                  <div className="mt-3">
                    <TextField
                      label="Webadresse (Kürzel)"
                      hint={
                        <>
                          Adresse dieser Seite:{" "}
                          <strong className="break-all">/leistungen/{slug || "…"}</strong>.
                          Normalerweise nicht ändern – bestehende Links (z. B. bei
                          Google) zeigen auf diese Adresse. Wird sie doch geändert,
                          leitet die alte Adresse automatisch weiter.
                        </>
                      }
                      value={service.slug}
                      onChange={(value) => updateService(service._key, { slug: value })}
                    />
                  </div>
                </details>
              </ItemCard>
            );
          })}
        </div>
        <AddButton
          onClick={() => {
            const key = crypto.randomUUID();
            setNewIds(key);
            setSettings((current) => ({
              ...current,
              services: [
                ...current.services,
                {
                  _key: key,
                  _originalSlug: "",
                  slug: "",
                  title: "",
                  menuLabel: "",
                  pageTitle: "",
                  shortDescription: "",
                  content: [],
                  bulletPoints: [],
                },
              ],
            }));
          }}
        >
          <Plus className="w-5 h-5" />
          Leistung hinzufügen
        </AddButton>
      </FormSection>

      <FormSection
        title="Übersichtsseite „Leistungen“"
        description="Texte der Seite, auf der alle Leistungen aufgelistet sind."
      >
        <TextField
          label="Überschrift"
          value={settings.overview.heading}
          onChange={(heading) => updateOverview({ heading })}
        />
        <TextField
          label="Überschrift über der Liste"
          value={settings.overview.treatmentHeading}
          onChange={(treatmentHeading) => updateOverview({ treatmentHeading })}
        />
        <LinesField
          label="Behandlungsspektrum"
          hint="Ein Punkt pro Zeile."
          rows={8}
          value={settings.overview.allServices}
          onChange={(allServices) => updateOverview({ allServices })}
        />
        <TextAreaField
          markdown
          label="Text für Angstpatienten"
          rows={4}
          value={settings.overview.anxiousPatients}
          onChange={(anxiousPatients) => updateOverview({ anxiousPatients })}
        />
      </FormSection>

      <SaveBar
        state={state}
        pending={pending}
        dirty={dirty}
        label="Leistungen speichern"
        publicHref="/leistungen"
      />
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Emergency service                                                   */
/* ------------------------------------------------------------------ */

const entryFields: { key: keyof EmergencyEntry; label: string }[] = [
  { key: "date", label: "Datum" },
  { key: "time", label: "Uhrzeit" },
  { key: "district", label: "Ort / Bereich" },
  { key: "practice", label: "Praxis" },
  { key: "phone", label: "Telefon" },
  { key: "address", label: "Adresse" },
];

export function EmergencySettingsForm({ initial }: { initial: EmergencySettings }) {
  const { settings, setSettings, payload, state, action, pending, dirty } =
    useSettingsForm(initial, updateEmergencySettingsAction, json);

  function updateEntry(id: string, patch: Partial<EmergencyEntry>) {
    setSettings((current) => ({
      ...current,
      entries: current.entries.map((entry) =>
        entry.id === id ? { ...entry, ...patch } : entry,
      ),
    }));
  }

  return (
    <form action={action} className="space-y-10">
      <input type="hidden" name="payload" value={payload} />

      <FormSection
        title="Notdienstplan"
        description="Der Plan wird jeden Morgen automatisch von der Seite der Zahnärzte Lüneburg geholt. Hier können Sie ihn auch selbst hochladen."
      >
        <DocumentUploadField
          value={settings.documentUrl}
          documentName={settings.documentName}
          onUploaded={(upload) =>
            setSettings((current) => ({
              ...current,
              documentUrl: upload.url,
              documentName: upload.name,
              documentText: upload.parsed?.documentText ?? current.documentText,
              entries: (upload.parsed?.entries as EmergencyEntry[] | undefined) ?? current.entries,
            }))
          }
          onRemove={() =>
            setSettings((current) => ({ ...current, documentUrl: "", documentName: "" }))
          }
        />

        <details className="rounded-lg bg-surface-container/50 p-4">
          <summary className="min-h-11 cursor-pointer content-center text-base font-semibold text-primary">
            Ausgelesene Termine prüfen oder korrigieren ({settings.entries.length})
          </summary>
          <p className="mt-2 text-sm text-on-surface-variant">
            Nur nötig, wenn im PDF etwas falsch erkannt wurde. Beim nächsten
            automatischen Abruf werden die Termine neu ausgelesen.
          </p>
          <div className="mt-4 space-y-4">
            {settings.entries.map((entry, index) => (
              <div key={entry.id} className="rounded-xl bg-card p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-secondary">
                    Termin {index + 1}
                  </span>
                  <button
                    type="button"
                    aria-label={`Termin ${index + 1} entfernen`}
                    onClick={() =>
                      setSettings((current) => ({
                        ...current,
                        entries: current.entries.filter((item) => item.id !== entry.id),
                      }))
                    }
                    className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {entryFields.map((field) => (
                    <label key={field.key} className="block">
                      <span className="mb-1 block text-sm font-medium text-on-surface-variant">
                        {field.label}
                      </span>
                      <input
                        className={fieldClass}
                        value={String(entry[field.key] ?? "")}
                        onChange={(event) =>
                          updateEntry(entry.id, { [field.key]: event.target.value })
                        }
                      />
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <AddButton
              onClick={() =>
                setSettings((current) => ({
                  ...current,
                  entries: [
                    ...current.entries,
                    { id: crypto.randomUUID(), date: "", practice: "" },
                  ],
                }))
              }
            >
              <Plus className="w-5 h-5" />
              Termin hinzufügen
            </AddButton>
            <TextAreaField
              label="Ausgelesener Text des PDFs"
              hint="Wird angezeigt, falls keine Termine erkannt wurden."
              rows={6}
              value={settings.documentText ?? ""}
              onChange={(documentText) =>
                setSettings((current) => ({ ...current, documentText }))
              }
            />
          </div>
        </details>
      </FormSection>

      <FormSection title="Texte der Notdienstseite">
        <TextField
          label="Überschrift"
          value={settings.title}
          onChange={(title) => setSettings((current) => ({ ...current, title }))}
        />
        <TextAreaField
          markdown
          label="Einleitungstext"
          value={settings.intro}
          onChange={(intro) => setSettings((current) => ({ ...current, intro }))}
        />
        <TextAreaField
          markdown
          label="Sprechzeiten im Notdienst"
          rows={4}
          value={settings.consultationText}
          onChange={(consultationText) =>
            setSettings((current) => ({ ...current, consultationText }))
          }
        />
        <LinesField
          label="Was ist kein Notfall?"
          hint="Ein Beispiel pro Zeile, z. B. „die herausgefallene Füllung“."
          value={settings.nonEmergencyItems}
          onChange={(nonEmergencyItems) =>
            setSettings((current) => ({ ...current, nonEmergencyItems }))
          }
        />
      </FormSection>

      <SaveBar
        state={state}
        pending={pending}
        dirty={dirty}
        label="Notdienst speichern"
        publicHref="/notdienst"
      />
    </form>
  );
}

/* ------------------------------------------------------------------ */

/** Further photos of a service, shown below the text on its page. */
function ExtraImagesField({
  images,
  alt,
  onChange,
}: {
  images: string[];
  alt: string;
  onChange: (images: string[]) => void;
}) {
  return (
    <div className="space-y-5 rounded-lg bg-surface p-4">
      <div>
        <p className="block text-base font-semibold text-primary">Weitere Fotos</p>
        <p className="mt-1 text-sm text-on-surface-variant leading-relaxed">
          Erscheinen unter dem Text der Leistungsseite. Beliebig viele möglich.
        </p>
      </div>
      {images.map((src, index) => (
        // Index key: keying on src would remount after upload and drop the
        // "Bild hochgeladen … Speichern" notice.
        <div key={index} className="space-y-2">
          <ImageUploadField
            label={`Foto ${index + 2}`}
            value={src}
            onChange={(next) =>
              onChange(
                next
                  ? images.map((item, i) => (i === index ? next : item))
                  : images.filter((_, i) => i !== index),
              )
            }
            alt={alt}
            sizeHint="Querformat empfohlen"
          />
        </div>
      ))}
      <AddButton onClick={() => onChange([...images, ""])}>
        <Plus className="w-5 h-5" />
        Weiteres Foto hinzufügen
      </AddButton>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Start page: opening hours + announcement                            */
/* ------------------------------------------------------------------ */

export function SiteSettingsForm({ initial }: { initial: SiteSettings }) {
  const { settings, setSettings, payload, state, action, pending, dirty } =
    useSettingsForm(initial, updateSiteSettingsAction, json);

  function updateHours(index: number, patch: Partial<OpeningHoursEntry>) {
    setSettings((current) => ({
      ...current,
      openingHours: current.openingHours.map((entry, i) =>
        i === index ? { ...entry, ...patch } : entry,
      ),
    }));
  }

  function updateAnnouncement(patch: Partial<SiteSettings["announcement"]>) {
    setSettings((current) => ({
      ...current,
      announcement: { ...current.announcement, ...patch },
    }));
  }

  return (
    <form action={action} className="space-y-10">
      <input type="hidden" name="payload" value={payload} />

      <FormSection
        title="Hinweis für Patienten"
        description="Erscheint ganz oben auf der Startseite, z. B. Neujahrsgrüße, geänderte Zeiten oder Praxisurlaub. Zum Ausblenden den Haken entfernen; der Text bleibt gespeichert."
      >
        <CheckboxField
          label="Hinweis auf der Startseite zeigen"
          checked={settings.announcement.enabled}
          onChange={(enabled) => updateAnnouncement({ enabled })}
        />
        <TextField
          label="Überschrift"
          value={settings.announcement.title}
          onChange={(title) => updateAnnouncement({ title })}
          placeholder="z. B. Liebe Patientinnen und Patienten"
        />
        <TextAreaField
          markdown
          label="Text"
          rows={5}
          value={settings.announcement.text}
          onChange={(text) => updateAnnouncement({ text })}
        />
      </FormSection>

      <FormSection
        title="Sprechzeiten"
        description="Gelten überall auf der Website (Startseite, Kontakt, Anfahrt, Fußzeile). Schreibweise z. B. „8:00 – 18:00“. Leere Pause = keine Pause."
      >
        <div className="space-y-3">
          {settings.openingHours.map((entry, index) => (
            <div
              key={index}
              className="grid gap-3 rounded-xl bg-surface-container/50 p-3 ring-1 ring-outline-variant/30 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-end"
            >
              <TextField
                label="Tag"
                required
                value={entry.day}
                onChange={(day) => updateHours(index, { day })}
              />
              <TextField
                label="Uhrzeit"
                value={entry.hours}
                onChange={(hours) => updateHours(index, { hours })}
                placeholder="8:00 – 18:00"
              />
              <TextField
                label="Pause"
                value={entry.break ?? ""}
                onChange={(value) => updateHours(index, { break: value })}
                placeholder="12:00 – 13:00"
              />
              <button
                type="button"
                aria-label={`${entry.day || "Zeile"} entfernen`}
                title="Zeile entfernen"
                onClick={() => {
                  if (window.confirm(`„${entry.day || "Zeile"}“ aus den Sprechzeiten entfernen?`)) {
                    setSettings((current) => ({
                      ...current,
                      openingHours: current.openingHours.filter((_, i) => i !== index),
                    }));
                  }
                }}
                className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
        <AddButton
          onClick={() =>
            setSettings((current) => ({
              ...current,
              openingHours: [...current.openingHours, { day: "", hours: "", break: null }],
            }))
          }
        >
          <Plus className="w-5 h-5" />
          Tag hinzufügen
        </AddButton>
      </FormSection>

      <SaveBar
        state={state}
        pending={pending}
        dirty={dirty}
        label="Speichern"
        publicHref="/"
      />
    </form>
  );
}

/* ------------------------------------------------------------------ */

/** Remembers ids of newly added items so their cards start opened. */
function useStateSet(): [Set<string>, (id: string) => void] {
  const [ids, setIds] = useState<Set<string>>(() => new Set());
  return [ids, (id) => setIds((current) => new Set(current).add(id))];
}
