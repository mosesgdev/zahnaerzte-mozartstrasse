import type { Metadata } from "next";
import { pages } from "@content/pages";
import { siteData } from "@content/site-data";
import { FadeIn } from "@/components/shared/FadeIn";
import { MapPin, Phone, Mail, Clock, Car } from "lucide-react";

export const metadata: Metadata = {
  title: pages.directions.title,
  description: pages.directions.metaDescription,
};

export default function AnfahrtPage() {
  const phoneHref = `tel:${siteData.practice.phone.replace(/[\s/]/g, "")}`;
  const address = siteData.practice.address;
  const mapsQuery = encodeURIComponent(
    `${address.street}, ${address.zip} ${address.city}`
  );

  return (
    <>
      {/* Header */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-primary to-primary-container">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FadeIn>
            <p className="text-secondary-fixed/80 text-sm font-semibold tracking-[0.25em] uppercase mb-4">
              So finden Sie uns
            </p>
            <h1 className="text-4xl lg:text-[3.5rem] font-bold text-white leading-[1.08]">
              {pages.directions.heading}
            </h1>
          </FadeIn>
        </div>
      </section>

      {/* Map + Info */}
      <section className="py-24 lg:py-32 bg-surface">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-10">
            {/* Map */}
            <FadeIn className="lg:col-span-3">
              <div className="bg-card rounded-xl overflow-hidden shadow-[0_20px_40px_rgba(16,59,92,0.06)] aspect-[4/3]">
                <iframe
                  title="Standort Zahnarztpraxis Boris Shuk"
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${mapsQuery}&zoom=15`}
                  className="w-full h-full"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </FadeIn>

            {/* Contact info */}
            <div className="lg:col-span-2 space-y-5">
              <FadeIn delay={0.1}>
                <div className="bg-card rounded-xl p-8 shadow-[0_20px_40px_rgba(16,59,92,0.05)]">
                  <h2 className="text-lg font-bold text-primary mb-5 flex items-center gap-2.5">
                    <MapPin className="w-5 h-5 text-secondary" />
                    Adresse
                  </h2>
                  <p className="text-base text-on-surface-variant leading-relaxed">
                    {siteData.practice.name}
                    <br />
                    {address.street}
                    <br />
                    {address.zip} {address.city}
                  </p>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${mapsQuery}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-primary to-primary-container rounded-full hover:shadow-[0_8px_24px_rgba(16,59,92,0.3)] transition-all duration-300"
                  >
                    Route planen
                  </a>
                </div>
              </FadeIn>

              <FadeIn delay={0.15}>
                <div className="bg-card rounded-xl p-8 shadow-[0_20px_40px_rgba(16,59,92,0.05)]">
                  <h3 className="text-lg font-bold text-primary mb-5 flex items-center gap-2.5">
                    <Car className="w-5 h-5 text-secondary" />
                    Parken
                  </h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    Zwei Parkplätze stehen direkt vor der Praxis zur Verfügung.
                  </p>
                </div>
              </FadeIn>

              <FadeIn delay={0.2}>
                <div className="bg-card rounded-xl p-8 shadow-[0_20px_40px_rgba(16,59,92,0.05)]">
                  <h3 className="text-lg font-bold text-primary mb-5 flex items-center gap-2.5">
                    <Phone className="w-5 h-5 text-secondary" />
                    Kontakt
                  </h3>
                  <div className="space-y-2.5">
                    <a
                      href={phoneHref}
                      className="block text-sm text-on-surface-variant hover:text-primary transition-colors"
                    >
                      Tel: {siteData.practice.phone}
                    </a>
                    <p className="text-sm text-on-surface-variant">
                      Fax: {siteData.practice.fax}
                    </p>
                    <a
                      href={`mailto:${siteData.practice.email}`}
                      className="block text-sm text-on-surface-variant hover:text-primary transition-colors"
                    >
                      {siteData.practice.email}
                    </a>
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.25}>
                <div className="bg-card rounded-xl p-8 shadow-[0_20px_40px_rgba(16,59,92,0.05)]">
                  <h3 className="text-lg font-bold text-primary mb-5 flex items-center gap-2.5">
                    <Clock className="w-5 h-5 text-secondary" />
                    Sprechzeiten
                  </h3>
                  <div className="space-y-2.5">
                    {siteData.openingHours.map((h) => (
                      <div
                        key={h.day}
                        className="flex justify-between text-sm text-on-surface-variant"
                      >
                        <span className="font-medium">{h.day}</span>
                        <span className="tabular-nums">{h.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
