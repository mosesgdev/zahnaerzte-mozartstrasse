import type { Metadata } from "next";
import Link from "next/link";
import { services, servicesOverview } from "@content/services";
import { FadeIn } from "@/components/shared/FadeIn";
import { ArrowRight, Phone } from "lucide-react";
import { siteData } from "@content/site-data";

export const metadata: Metadata = {
  title: "Unsere Leistungen",
  description:
    "Unser Behandlungsspektrum: Implantologie, Prophylaxe, Parodontitis, Vollkeramik, Laserbehandlung, Zahnersatz und mehr in Winsen (Luhe).",
};

export default function LeistungenPage() {
  return (
    <>
      {/* Header */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-primary to-primary-container">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FadeIn>
            <p className="text-secondary-fixed/80 text-sm font-semibold tracking-[0.25em] uppercase mb-4">
              Behandlungsspektrum
            </p>
            <h1 className="text-4xl lg:text-[3.5rem] font-bold text-white leading-[1.08]">
              {servicesOverview.heading}
            </h1>
          </FadeIn>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-24 lg:py-32 bg-surface">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service, i) => (
              <FadeIn key={service.slug} delay={i * 0.04}>
                <Link
                  href={`/leistungen/${service.slug}`}
                  className="group block h-full bg-card rounded-xl p-8 shadow-[0_20px_40px_rgba(16,59,92,0.03)] hover:shadow-[0_20px_40px_rgba(16,59,92,0.1)] transition-all duration-500 hover:-translate-y-1"
                >
                  <h3 className="text-lg font-bold text-primary group-hover:text-tertiary transition-colors">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm text-on-surface-variant leading-relaxed">
                    {service.shortDescription}
                  </p>
                  {service.underConstruction && (
                    <span className="mt-3 inline-block px-3 py-1 text-xs font-medium text-tertiary bg-tertiary-fixed/30 rounded-full">
                      Demnächst
                    </span>
                  )}
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-secondary opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                    Mehr erfahren <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Full service list + anxious patients */}
      <section className="py-24 lg:py-32 bg-surface-low">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <FadeIn>
              <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-8">
                {servicesOverview.treatmentHeading}
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {servicesOverview.allServices.map((s) => (
                  <div
                    key={s}
                    className="flex items-start gap-2.5 text-sm text-on-surface-variant"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 shrink-0" />
                    <span className="leading-relaxed">{s}</span>
                  </div>
                ))}
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="bg-card rounded-xl p-8 shadow-[0_20px_40px_rgba(16,59,92,0.05)]">
                <h3 className="text-lg font-bold text-primary mb-4">
                  Angstpatienten
                </h3>
                <p className="text-base text-on-surface-variant leading-[1.8]">
                  {servicesOverview.anxiousPatients}
                </p>
                <a
                  href={`tel:${siteData.practice.phone.replace(/[\s/]/g, "")}`}
                  className="mt-6 inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-primary to-primary-container rounded-full hover:shadow-[0_8px_24px_rgba(16,59,92,0.3)] transition-all duration-300"
                >
                  <Phone className="w-4 h-4" />
                  Jetzt anrufen
                </a>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}
