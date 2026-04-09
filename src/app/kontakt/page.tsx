import type { Metadata } from "next";
import Link from "next/link";
import { pages } from "@content/pages";
import { siteData } from "@content/site-data";
import { FadeIn } from "@/components/shared/FadeIn";
import { Phone, Mail, MapPin, Clock, Printer } from "lucide-react";

export const metadata: Metadata = {
  title: pages.contact.title,
  description: pages.contact.metaDescription,
};

export default function KontaktPage() {
  const phoneHref = `tel:${siteData.practice.phone.replace(/[\s/]/g, "")}`;

  return (
    <>
      {/* Header */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-primary to-primary-container">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FadeIn>
            <p className="text-secondary-fixed/80 text-sm font-semibold tracking-[0.25em] uppercase mb-4">
              Kontakt
            </p>
            <h1 className="text-4xl lg:text-[3.5rem] font-bold text-white leading-[1.08]">
              {pages.contact.heading}
            </h1>
            <p className="mt-6 text-lg text-white/60 max-w-xl leading-relaxed">
              Rufen Sie uns an oder schreiben Sie uns. Wir sind gerne für Sie
              da.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Contact grid */}
      <section className="py-24 lg:py-32 bg-surface">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FadeIn>
              <a
                href={phoneHref}
                className="group block bg-card rounded-xl p-8 shadow-[0_20px_40px_rgba(16,59,92,0.04)] hover:shadow-[0_20px_40px_rgba(16,59,92,0.1)] transition-all duration-500 hover:-translate-y-1 h-full"
              >
                <Phone className="w-8 h-8 text-secondary mb-5" />
                <h3 className="text-lg font-bold text-primary group-hover:text-tertiary transition-colors">
                  Telefon
                </h3>
                <p className="mt-2 text-xl font-bold text-primary tabular-nums">
                  {siteData.practice.phone}
                </p>
                <p className="mt-2 text-sm text-on-surface-variant">
                  Der schnellste Weg zu einem Termin
                </p>
              </a>
            </FadeIn>

            <FadeIn delay={0.05}>
              <a
                href={`mailto:${siteData.practice.email}`}
                className="group block bg-card rounded-xl p-8 shadow-[0_20px_40px_rgba(16,59,92,0.04)] hover:shadow-[0_20px_40px_rgba(16,59,92,0.1)] transition-all duration-500 hover:-translate-y-1 h-full"
              >
                <Mail className="w-8 h-8 text-secondary mb-5" />
                <h3 className="text-lg font-bold text-primary group-hover:text-tertiary transition-colors">
                  E-Mail
                </h3>
                <p className="mt-2 text-base font-medium text-primary break-all">
                  {siteData.practice.email}
                </p>
                <p className="mt-2 text-sm text-on-surface-variant">
                  Für Anfragen und Rückfragen
                </p>
              </a>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="bg-card rounded-xl p-8 shadow-[0_20px_40px_rgba(16,59,92,0.04)] h-full">
                <Printer className="w-8 h-8 text-secondary mb-5" />
                <h3 className="text-lg font-bold text-primary">Fax</h3>
                <p className="mt-2 text-xl font-bold text-primary tabular-nums">
                  {siteData.practice.fax}
                </p>
                <p className="mt-2 text-sm text-on-surface-variant">
                  Für Befunde und Dokumente
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Address + Hours */}
      <section className="py-24 lg:py-32 bg-surface-low">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <FadeIn>
              <div className="bg-card rounded-xl p-8 shadow-[0_20px_40px_rgba(16,59,92,0.05)] h-full">
                <h2 className="text-lg font-bold text-primary mb-5 flex items-center gap-2.5">
                  <MapPin className="w-5 h-5 text-secondary" />
                  Adresse
                </h2>
                <p className="text-base text-on-surface-variant leading-relaxed">
                  {siteData.practice.name}
                  <br />
                  {siteData.practice.address.street}
                  <br />
                  {siteData.practice.address.zip}{" "}
                  {siteData.practice.address.city}
                </p>
                <Link
                  href="/anfahrt"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:text-primary transition-colors"
                >
                  Anfahrt &amp; Route planen →
                </Link>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="bg-card rounded-xl p-8 shadow-[0_20px_40px_rgba(16,59,92,0.05)] h-full">
                <h2 className="text-lg font-bold text-primary mb-5 flex items-center gap-2.5">
                  <Clock className="w-5 h-5 text-secondary" />
                  Sprechzeiten
                </h2>
                <div className="space-y-3.5">
                  {siteData.openingHours.map((h) => (
                    <div
                      key={h.day}
                      className="flex justify-between items-center text-base"
                    >
                      <span className="font-medium text-primary">{h.day}</span>
                      <div className="text-right">
                        <span className="text-on-surface-variant tabular-nums">
                          {h.hours}
                        </span>
                        {h.break && (
                          <span className="block text-xs text-on-surface-variant/60 mt-0.5">
                            Pause: {h.break}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}
