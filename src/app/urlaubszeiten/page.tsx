import type { Metadata } from "next";
import { urlaubszeiten } from "@content/urlaubszeiten";
import { siteData } from "@content/site-data";
import { FadeIn } from "@/components/shared/FadeIn";
import { CalendarOff, Phone, MapPin, CalendarCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Praxisurlaub",
  description: `Urlaubszeiten der Zahnarztpraxis Boris Shuk. Praxis geschlossen vom ${urlaubszeiten.closurePeriod}. Notdienst-Vertretungen und Wiedereröffnung.`,
};

export default function UrlaubszeitenPage() {
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
              {urlaubszeiten.heading}
            </h1>
          </FadeIn>
        </div>
      </section>

      {/* Closure info */}
      <section className="py-24 lg:py-32 bg-surface">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <FadeIn>
              <div className="bg-card rounded-xl p-8 lg:p-10 shadow-[0_20px_40px_rgba(16,59,92,0.05)] mb-8">
                <div className="flex items-start gap-4">
                  <CalendarOff className="w-8 h-8 text-destructive shrink-0 mt-1" />
                  <div>
                    <h2 className="text-xl font-bold text-primary mb-2">
                      Praxis geschlossen
                    </h2>
                    <p className="text-lg text-on-surface-variant font-medium">
                      {urlaubszeiten.closurePeriod}
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.05}>
              <div className="bg-secondary-fixed/10 rounded-xl p-8 lg:p-10 mb-12">
                <div className="flex items-start gap-4">
                  <CalendarCheck className="w-8 h-8 text-secondary shrink-0 mt-1" />
                  <div>
                    <h2 className="text-xl font-bold text-primary mb-2">
                      Wiedereröffnung
                    </h2>
                    <p className="text-lg text-on-surface-variant font-medium">
                      {urlaubszeiten.reopening}
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Emergency contacts */}
            <FadeIn delay={0.1}>
              <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-8">
                Zahnärztlicher Notdienst
              </h2>
              <p className="text-base text-on-surface-variant mb-8 leading-relaxed">
                Während unserer Abwesenheit stehen Ihnen folgende Praxen für
                Notfälle zur Verfügung:
              </p>
            </FadeIn>

            <div className="space-y-4">
              {urlaubszeiten.emergencyContacts.map((contact, i) => (
                <FadeIn key={contact.date} delay={0.12 + i * 0.04}>
                  <div className="bg-card rounded-xl p-6 lg:p-8 shadow-[0_20px_40px_rgba(16,59,92,0.04)]">
                    <p className="text-xs font-semibold text-secondary uppercase tracking-[0.15em] mb-3">
                      {contact.date}
                    </p>
                    <h3 className="text-lg font-bold text-primary">
                      {contact.practice}
                    </h3>
                    <div className="mt-3 space-y-2">
                      <p className="flex items-center gap-2.5 text-sm text-on-surface-variant">
                        <MapPin className="w-4 h-4 shrink-0 text-on-surface-variant/50" />
                        {contact.address}
                      </p>
                      <a
                        href={`tel:${contact.phone.replace(/[\s/]/g, "")}`}
                        className="flex items-center gap-2.5 text-sm text-on-surface-variant hover:text-primary transition-colors"
                      >
                        <Phone className="w-4 h-4 shrink-0 text-on-surface-variant/50" />
                        {contact.phone}
                      </a>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>

            {/* Regular contact */}
            <FadeIn delay={0.35}>
              <div className="mt-12 text-center">
                <p className="text-sm text-on-surface-variant mb-4">
                  Bei allgemeinen Fragen erreichen Sie uns ab der
                  Wiedereröffnung unter:
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
