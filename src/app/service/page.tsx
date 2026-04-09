import type { Metadata } from "next";
import Link from "next/link";
import { pages } from "@content/pages";
import { siteData } from "@content/site-data";
import { FadeIn } from "@/components/shared/FadeIn";
import {
  Accessibility,
  ParkingSquare,
  Baby,
  Phone,
  MapPin,
} from "lucide-react";

export const metadata: Metadata = {
  title: pages.service.title,
  description: pages.service.metaDescription,
};

const serviceFeatures = [
  {
    icon: Accessibility,
    title: "Barrierefreier Zugang",
    description:
      "Rollstuhlgerechter Eingang mit sanfter Rampe direkt in die Praxis. Bitte teilen Sie uns bei der Terminvereinbarung mit, welche Unterstützung Sie benötigen.",
  },
  {
    icon: ParkingSquare,
    title: "Parkplätze",
    description:
      "Zwei Parkplätze stehen direkt vor der Praxis zur Verfügung. Bequem erreichbar ohne lange Fußwege.",
  },
  {
    icon: Baby,
    title: "Familienfreundlich",
    description:
      "Größerer Wickeltisch (Tragfähigkeit bis 30 kg) im barrierefreien Bad. Kinder sind bei uns herzlich willkommen.",
  },
];

export default function ServicePage() {
  return (
    <>
      {/* Header */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-primary to-primary-container">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FadeIn>
            <p className="text-secondary-fixed/80 text-sm font-semibold tracking-[0.25em] uppercase mb-4">
              Service
            </p>
            <h1 className="text-4xl lg:text-[3.5rem] font-bold text-white leading-[1.08]">
              {pages.service.heading}
            </h1>
          </FadeIn>
        </div>
      </section>

      {/* Service features */}
      <section className="py-24 lg:py-32 bg-surface">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {serviceFeatures.map((feature, i) => (
              <FadeIn key={feature.title} delay={i * 0.05}>
                <div className="bg-card rounded-xl p-8 shadow-[0_20px_40px_rgba(16,59,92,0.04)] h-full">
                  <feature.icon className="w-8 h-8 text-secondary mb-5" />
                  <h3 className="text-lg font-bold text-primary mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Contact block */}
      <section className="py-24 lg:py-32 bg-surface-low">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-xl mx-auto text-center">
            <FadeIn>
              <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-4">
                Fragen zu unserem Service?
              </h2>
              <p className="text-base text-on-surface-variant mb-8">
                Wir helfen Ihnen gerne weiter und finden gemeinsam die beste
                Lösung für Ihren Besuch.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={`tel:${siteData.practice.phone.replace(/[\s/]/g, "")}`}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-primary to-primary-container rounded-full hover:shadow-[0_8px_24px_rgba(16,59,92,0.3)] transition-all duration-300"
                >
                  <Phone className="w-5 h-5" />
                  {siteData.practice.phone}
                </a>
                <Link
                  href="/anfahrt"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-primary bg-surface-highest rounded-full hover:bg-surface-high transition-colors"
                >
                  <MapPin className="w-5 h-5" />
                  Anfahrt
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}
