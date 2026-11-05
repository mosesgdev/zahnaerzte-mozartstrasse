import Link from "next/link";
import { requireAuth } from "@/lib/session";
import { getLastUpdated } from "@/lib/admin-meta";
import { getEmergencySettings } from "@/lib/emergency-settings";
import { AdminFrame } from "@/components/admin/AdminFrame";
import { adminSections } from "@/components/admin/sections";
import { ArrowRight, ExternalLink } from "lucide-react";

export const metadata = {
  title: "Praxis-Verwaltung",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const dateFormat = new Intl.DateTimeFormat("de-DE", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Europe/Berlin",
});

function latest(...values: (string | undefined)[]): string | undefined {
  return values.filter(Boolean).sort().at(-1);
}

export default async function AdminPage() {
  await requireAuth();
  const [lastUpdated, emergency] = await Promise.all([
    getLastUpdated(),
    getEmergencySettings(),
  ]);
  const changedAt = {
    ...lastUpdated,
    notdienst: latest(lastUpdated.notdienst, emergency.updatedAt),
  };

  return (
    <AdminFrame
      title="Übersicht"
      intro="Wählen Sie einen Bereich, ändern Sie die Angaben und tippen Sie unten auf „Speichern“. Die Website zeigt den neuen Stand sofort."
    >
      <ul className="grid sm:grid-cols-2 gap-4">
        {adminSections.map((section) => {
          const Icon = section.icon;
          const changed = changedAt[section.key];
          return (
            <li
              key={section.href}
              className="group relative flex flex-col bg-card rounded-2xl p-6 shadow-[0_20px_50px_rgba(16,59,92,0.05)] hover:shadow-[0_20px_50px_rgba(16,59,92,0.1)] transition-shadow focus-within:ring-2 focus-within:ring-primary"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                  <Icon className="w-5 h-5" />
                </span>
                <h2 className="text-xl font-bold text-primary">
                  {/* The stretched link makes the whole tile tappable. */}
                  <Link
                    href={section.href}
                    className="outline-none after:absolute after:inset-0 after:rounded-2xl"
                  >
                    {section.title}
                  </Link>
                </h2>
              </div>
              <p className="text-base text-on-surface-variant leading-relaxed">
                {section.description}
              </p>
              <p className="mt-3 text-sm text-on-surface-variant/80">
                {changed
                  ? `Zuletzt geändert: ${dateFormat.format(new Date(changed))} Uhr`
                  : "Noch keine Änderung gespeichert"}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-white">
                  Bearbeiten
                  <ArrowRight className="w-4 h-4" />
                </span>
                <a
                  href={section.publicHref}
                  target="_blank"
                  rel="noreferrer"
                  className="relative z-10 inline-flex min-h-11 items-center gap-2 rounded-full bg-surface-container px-5 text-sm font-semibold text-primary hover:bg-surface-high transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Seite ansehen
                </a>
              </div>
            </li>
          );
        })}
      </ul>
    </AdminFrame>
  );
}
