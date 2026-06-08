import type { Metadata } from "next";
import { siteData } from "@content/site-data";
import { getVacations } from "@/lib/vacations";
import { reopeningDateAfter } from "@/lib/holidays";
import { FadeIn } from "@/components/shared/FadeIn";
import { CalendarOff, Phone, CalendarCheck, CalendarDays } from "lucide-react";

export const metadata: Metadata = {
  title: "Praxisurlaub",
  description:
    "Aktuelle Urlaubszeiten und Vertretungen der Zahnarztpraxis Boris Shuk in Winsen (Luhe).",
};

// Always reflect the latest data set in the admin backend.
export const dynamic = "force-dynamic";

function parseDate(iso: string): Date {
  return new Date(`${iso}T00:00:00`);
}

function formatLong(iso: string): string {
  return new Intl.DateTimeFormat("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parseDate(iso));
}

/** Reopening = first business day after the last closed day (no weekend/holiday). */
function formatReopening(endIso: string): string {
  return new Intl.DateTimeFormat("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(reopeningDateAfter(endIso));
}

export default async function UrlaubszeitenPage() {
  const today = new Date().toISOString().slice(0, 10);
  // Only current and upcoming closures (past ones are hidden automatically).
  const vacations = (await getVacations()).filter((v) => v.end >= today);

  return (
    <>
      {/* Header */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-primary to-primary-container">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FadeIn>
            <p className="text-secondary-fixed/80 text-sm font-semibold tracking-[0.25em] uppercase mb-4">
              Urlaubszeiten
            </p>
            <h1 className="text-4xl lg:text-[3.5rem] font-bold text-white leading-[1.08]">
              Praxisurlaub
            </h1>
          </FadeIn>
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-surface">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            {vacations.length === 0 ? (
              /* No planned closures */
              <FadeIn>
                <div className="bg-card rounded-xl p-8 lg:p-10 shadow-[0_20px_40px_rgba(16,59,92,0.05)] text-center">
                  <CalendarCheck className="w-10 h-10 text-secondary mx-auto mb-4" />
                  <h2 className="text-xl font-bold text-primary mb-2">
                    Keine Urlaubszeiten geplant
                  </h2>
                  <p className="text-base text-on-surface-variant">
                    Unsere Praxis ist zu den gewohnten Sprechzeiten für Sie da.
                  </p>
                </div>
              </FadeIn>
            ) : (
              <div className="space-y-16">
                {vacations.map((v, i) => (
                  <div key={v.id}>
                    {vacations.length > 1 && (
                      <FadeIn delay={i * 0.05}>
                        <p className="text-xs font-semibold text-secondary uppercase tracking-[0.15em] mb-6">
                          Urlaub {i + 1}
                        </p>
                      </FadeIn>
                    )}

                    {/* Closure — includes the replacement that covers this period */}
                    <FadeIn delay={i * 0.05}>
                      <div className="bg-card rounded-xl p-8 lg:p-10 shadow-[0_20px_40px_rgba(16,59,92,0.05)] mb-8">
                        <div className="flex items-start gap-4">
                          <CalendarOff className="w-8 h-8 text-destructive shrink-0 mt-1" />
                          <div className="w-full">
                            <h2 className="text-xl font-bold text-primary mb-2">
                              Praxis geschlossen
                            </h2>
                            <p className="text-lg text-on-surface-variant font-medium">
                              {formatLong(v.start)} bis {formatLong(v.end)}
                            </p>

                            {/* Vertretung within the closure period */}
                            <div className="mt-6 pt-6 border-t border-outline-variant/30">
                              <p className="text-xs font-semibold text-secondary uppercase tracking-[0.15em] mb-3 flex items-center gap-2">
                                <CalendarDays className="w-4 h-4" />
                                Vertretung in dieser Zeit
                              </p>
                              <h3 className="text-lg font-bold text-primary">
                                {v.replacement}
                              </h3>
                              <div className="mt-2 space-y-2">
                                {v.replacementPhone && (
                                  <a
                                    href={`tel:${v.replacementPhone.replace(/[\s/]/g, "")}`}
                                    className="flex items-center gap-2.5 text-sm text-on-surface-variant hover:text-primary transition-colors"
                                  >
                                    <Phone className="w-4 h-4 shrink-0 text-on-surface-variant/50" />
                                    {v.replacementPhone}
                                  </a>
                                )}
                                {v.note && (
                                  <p className="text-sm text-on-surface-variant/80 italic">
                                    {v.note}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </FadeIn>

                    {/* Reopening — first business day after the closure */}
                    <FadeIn delay={i * 0.05 + 0.05}>
                      <div className="bg-secondary-fixed/10 rounded-xl p-8 lg:p-10">
                        <div className="flex items-start gap-4">
                          <CalendarCheck className="w-8 h-8 text-secondary shrink-0 mt-1" />
                          <div>
                            <h2 className="text-xl font-bold text-primary mb-2">
                              Wiedereröffnung
                            </h2>
                            <p className="text-lg text-on-surface-variant font-medium">
                              {formatReopening(v.end)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </FadeIn>
                  </div>
                ))}
              </div>
            )}

            {/* Regular contact */}
            <FadeIn delay={0.2}>
              <div className="mt-16 text-center">
                <p className="text-sm text-on-surface-variant mb-4">
                  Bei allgemeinen Fragen erreichen Sie uns gerne unter:
                </p>
                <a
                  href={`tel:${siteData.practice.phone.replace(/[\s/]/g, "")}`}
                  className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-primary to-primary-container rounded-full hover:shadow-[0_8px_24px_rgba(16,59,92,0.3)] transition-all duration-300"
                >
                  <Phone className="w-5 h-5" />
                  {siteData.practice.phone}
                </a>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}
