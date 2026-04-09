import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { dentists, assistants, teamIntro } from "@content/team";
import { FadeIn } from "@/components/shared/FadeIn";
import { ArrowRight, Phone } from "lucide-react";
import { siteData } from "@content/site-data";
import { asset } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Unser Team",
  description:
    "Lernen Sie das Team der Zahnarztpraxis Boris Shuk in Winsen (Luhe) kennen. Zahnarzt, Prophylaxe-Fachkraft und zahnmedizinische Fachangestellte.",
};

export default function TeamPage() {
  return (
    <>
      {/* Header */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-primary to-primary-container">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FadeIn>
            <p className="text-secondary-fixed/80 text-sm font-semibold tracking-[0.25em] uppercase mb-4">
              Team
            </p>
            <h1 className="text-4xl lg:text-[3.5rem] font-bold text-white leading-[1.08]">
              {teamIntro.heading}
            </h1>
            <p className="mt-6 text-lg text-white/60 max-w-xl leading-relaxed">
              {teamIntro.text}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Dentist */}
      <section className="py-24 lg:py-32 bg-surface">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FadeIn>
            <div className="bg-card rounded-xl overflow-hidden shadow-[0_20px_40px_rgba(16,59,92,0.05)]">
              <div className="flex flex-col lg:flex-row items-stretch gap-0 lg:gap-0">
                <div className="w-full lg:w-2/5 rounded-2xl lg:rounded-r-none lg:rounded-l-xl overflow-hidden shrink-0 bg-surface-container aspect-[3/4] lg:aspect-auto">
                  {dentists[0].image ? (
                    <Image
                      src={asset(dentists[0].image!)}
                      alt={dentists[0].name}
                      width={600}
                      height={800}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-white text-4xl font-bold">
                      BS
                    </div>
                  )}
                </div>
                <div className="flex-1 p-10 lg:p-14">
                  <h2 className="text-2xl lg:text-3xl font-bold text-primary">
                    {dentists[0].name}
                  </h2>
                  <p className="text-base text-secondary font-medium mt-1">
                    {dentists[0].role}
                  </p>
                  <p className="mt-6 text-base text-on-surface-variant leading-[1.8] max-w-2xl">
                    {dentists[0].description}
                  </p>
                  {dentists[0].qualifications && (
                    <div className="mt-8">
                      <h3 className="text-xs font-semibold text-primary uppercase tracking-[0.15em] mb-4">
                        Werdegang
                      </h3>
                      <div className="space-y-3">
                        {dentists[0].qualifications.map((q) => (
                          <div
                            key={q}
                            className="flex items-start gap-3 text-sm text-on-surface-variant"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 shrink-0" />
                            <span className="leading-relaxed">{q}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Team members */}
      <section className="py-24 lg:py-32 bg-surface-low">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-4">
              {teamIntro.subheading}
            </h2>
            <p className="text-base text-on-surface-variant mb-12 max-w-xl">
              Unser eingespieltes Team sorgt für eine professionelle und
              herzliche Betreuung bei jedem Besuch.
            </p>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {assistants.map((member, i) => (
              <FadeIn key={member.name} delay={i * 0.05}>
                <div className="bg-card rounded-xl p-7 shadow-[0_20px_40px_rgba(16,59,92,0.04)] h-full">
                  <div className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-surface-container mb-5">
                    {member.image ? (
                      <Image
                        src={asset(member.image!)}
                        alt={member.name}
                        width={400}
                        height={533}
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary text-3xl font-bold">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-primary">
                    {member.name}
                  </h3>
                  <p className="text-sm text-secondary font-medium mt-1">
                    {member.role}
                  </p>
                  {member.description && (
                    <p className="mt-3 text-sm text-on-surface-variant leading-relaxed">
                      {member.description}
                    </p>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-24 bg-surface">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-4">
              Wir freuen uns auf Sie
            </h2>
            <p className="text-base text-on-surface-variant mb-8 max-w-md mx-auto">
              Vereinbaren Sie einen Termin und lernen Sie unser Team persönlich
              kennen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`tel:${siteData.practice.phone.replace(/[\s/]/g, "")}`}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-primary to-primary-container rounded-full hover:shadow-[0_8px_24px_rgba(16,59,92,0.3)] transition-all duration-300"
              >
                <Phone className="w-5 h-5" />
                Termin vereinbaren
              </a>
              <Link
                href="/leistungen"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-primary bg-surface-highest rounded-full hover:bg-surface-high transition-colors"
              >
                Unsere Leistungen <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
