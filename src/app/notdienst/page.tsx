import type { Metadata } from "next";
import type { EmergencyEntry } from "@/lib/emergency-settings";
import { getEmergencySettings } from "@/lib/emergency-settings";
import { FadeIn } from "@/components/shared/FadeIn";
import {
  AlertCircle,
  Clock,
  Download,
  FileText,
  MapPin,
  Phone,
} from "lucide-react";
import { siteData } from "@content/site-data";

export const metadata: Metadata = {
  title: "Notdienst",
  description:
    "Aktueller zahnärztlicher Notdienst mit diensthabenden Praxen, Sprechzeiten und Notfallhinweisen.",
};

export const dynamic = "force-dynamic";

function phoneHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function splitPhones(phone?: string): string[] {
  if (!phone) return [];

  return phone
    .split(/[,;]\s*/)
    .map((item) => item.trim())
    .filter(
      (item) =>
        item.replace(/\D/g, "").length >= 5 &&
        !/^20\d{2}\s+\d/.test(item) &&
        !/^\d{1,2}\.\d{1,2}\.\d{2,4}/.test(item),
    );
}

function hasLetters(value?: string): boolean {
  return /[A-Za-zÄÖÜäöüß]/.test(value || "");
}

function formatDateTime(value?: string): string | undefined {
  if (!value) return undefined;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;

  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Berlin",
  }).format(date);
}

function getPlanDate(entries: EmergencyEntry[]): string | undefined {
  const dates = Array.from(
    new Set(entries.map((entry) => entry.date?.trim()).filter(Boolean)),
  );

  if (dates.length === 0) return undefined;
  if (dates.length === 1) return dates[0];
  return dates.join(", ");
}

function EmergencyPlanCard({ entry }: { entry: EmergencyEntry }) {
  const phones = splitPhones(entry.phone);

  return (
    <article className="flex h-full flex-col rounded-xl bg-card p-6 shadow-[0_20px_40px_rgba(16,59,92,0.05)] border border-outline-variant/30">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        {entry.district && (
          <span className="text-sm font-bold text-primary">
            {entry.district}
          </span>
        )}
        <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container px-3 py-1 text-xs font-semibold text-on-surface-variant">
          <Clock className="w-3.5 h-3.5" />
          {entry.time || "10-12 Uhr"}
        </span>
      </div>

      <div className="flex-1">
        <h3 className="text-xl font-bold text-primary leading-snug break-words">
          {entry.practice}
        </h3>
        {entry.address && (
          <p className="mt-4 flex items-start gap-2.5 text-sm leading-relaxed text-on-surface-variant">
            <MapPin className="w-4 h-4 shrink-0 text-secondary mt-0.5" />
            <span>{entry.address}</span>
          </p>
        )}
      </div>

      {phones.length > 0 ? (
        <div className="mt-6 flex flex-wrap gap-2">
          {phones.map((phone) => (
            <a
              key={phone}
              href={phoneHref(phone)}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-container"
            >
              <Phone className="w-4 h-4" />
              {phone}
            </a>
          ))}
        </div>
      ) : (
        <p className="mt-6 rounded-lg bg-surface-container px-4 py-3 text-sm text-on-surface-variant">
          Telefonnummer bitte dem PDF entnehmen.
        </p>
      )}
    </article>
  );
}

function EmergencyPlanFallback({ text }: { text: string }) {
  return (
    <div className="rounded-xl bg-card p-6 lg:p-8 shadow-[0_20px_40px_rgba(16,59,92,0.05)] border border-outline-variant/30">
      <div className="flex items-center gap-3 mb-5">
        <FileText className="w-6 h-6 text-secondary" />
        <h3 className="text-xl font-bold text-primary">
          Aus dem PDF extrahierter Notdienstplan
        </h3>
      </div>
      <div className="overflow-x-auto rounded-lg bg-surface-container p-4">
        <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-on-surface-variant">
          {text}
        </pre>
      </div>
    </div>
  );
}

export default async function NotdienstPage() {
  const settings = await getEmergencySettings();
  const entries = settings.entries.filter(
    (entry) => hasLetters(entry.practice) || hasLetters(entry.raw),
  );
  const hasEntries = entries.length > 0;
  const practicePhoneHref = phoneHref(siteData.practice.phone);
  const planDate = getPlanDate(entries);
  const latestUpdate = formatDateTime(settings.lastSyncedAt || settings.updatedAt);

  return (
    <>
      <section className="py-20 lg:py-28 bg-gradient-to-br from-primary to-primary-container">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FadeIn>
            <p className="text-secondary-fixed/80 text-sm font-semibold tracking-[0.25em] uppercase mb-4">
              Notdienst
            </p>
            <h1 className="text-4xl lg:text-[3.5rem] font-bold text-white leading-[1.08]">
              {settings.title}
            </h1>
            <p className="mt-6 text-lg text-white/75 max-w-3xl leading-relaxed">
              {settings.intro}
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-surface">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FadeIn>
            <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr] mb-14">
              <div className="rounded-xl bg-card p-6 lg:p-8 shadow-[0_20px_40px_rgba(16,59,92,0.05)] border border-outline-variant/30">
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-7 h-7 text-secondary shrink-0 mt-1" />
                  <div>
                    <h2 className="text-2xl font-bold text-primary mb-3">
                      Bei akuten Beschwerden zuerst anrufen
                    </h2>
                    <p className="text-base text-on-surface-variant leading-[1.8]">
                      Bitte melden Sie sich telefonisch bei der diensthabenden
                      Praxis, bevor Sie losfahren. So können Dringlichkeit,
                      Behandlungsbedarf und Wartezeit besser koordiniert werden.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <a
                        href={practicePhoneHref}
                        className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-container"
                      >
                        <Phone className="w-4 h-4" />
                        Praxis anrufen
                      </a>
                      {settings.documentUrl && (
                        <a
                          href={settings.documentUrl}
                          download={settings.documentName}
                          className="inline-flex items-center gap-2 rounded-full bg-surface-highest px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-surface-high"
                        >
                          <Download className="w-4 h-4" />
                          PDF herunterladen
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-secondary-fixed/10 p-6 lg:p-8">
                <Clock className="w-7 h-7 text-secondary mb-4" />
                <h2 className="text-xl font-bold text-primary mb-3">
                  Sprechzeiten im Notdienst
                </h2>
                <p className="text-base text-on-surface-variant leading-[1.8]">
                  {settings.consultationText}
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.05}>
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-secondary tracking-[0.2em] uppercase mb-3">
                  {planDate ? `Aktueller Plan: ${planDate}` : "Aktueller Plan"}
                </p>
                <h2 className="text-3xl lg:text-4xl font-bold text-primary">
                  Diensthabende Praxen
                </h2>
              </div>
              <div className="space-y-1 text-sm text-on-surface-variant sm:text-right">
                {settings.documentName && <p>Quelle: {settings.documentName}</p>}
                {latestUpdate && <p>Zuletzt aktualisiert: {latestUpdate}</p>}
              </div>
            </div>

            {hasEntries ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {entries.map((entry) => (
                  <EmergencyPlanCard key={entry.id} entry={entry} />
                ))}
              </div>
            ) : settings.documentText ? (
              <EmergencyPlanFallback text={settings.documentText} />
            ) : (
              <div className="rounded-xl bg-card p-8 text-base text-on-surface-variant shadow-[0_20px_40px_rgba(16,59,92,0.05)] border border-outline-variant/30">
                Der aktuelle Notdienstplan wird zeitnah ergänzt.
              </div>
            )}
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="mt-16 rounded-xl bg-surface-container p-6 lg:p-8">
              <h2 className="text-2xl font-bold text-primary mb-6">
                Was in der Regel kein Notfall ist
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {settings.nonEmergencyItems.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 text-sm text-on-surface-variant"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 shrink-0" />
                    <span className="leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
