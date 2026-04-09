import type { Metadata } from "next";
import { pages } from "@content/pages";
import { siteData } from "@content/site-data";
import { FadeIn } from "@/components/shared/FadeIn";
import { Briefcase, Mail, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: pages.jobs.title,
  description: pages.jobs.metaDescription,
};

export default function JobsPage() {
  return (
    <>
      {/* Header */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-primary to-primary-container">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FadeIn>
            <p className="text-secondary-fixed/80 text-sm font-semibold tracking-[0.25em] uppercase mb-4">
              Karriere
            </p>
            <h1 className="text-4xl lg:text-[3.5rem] font-bold text-white leading-[1.08]">
              {pages.jobs.heading}
            </h1>
          </FadeIn>
        </div>
      </section>

      {/* Content */}
      <section className="py-24 lg:py-32 bg-surface">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <FadeIn>
              <div className="w-20 h-20 rounded-full bg-surface-container mx-auto flex items-center justify-center mb-8">
                <Briefcase className="w-9 h-9 text-primary" />
              </div>
              {pages.jobs.content.map((text, i) => (
                <p
                  key={i}
                  className="text-base text-on-surface-variant leading-[1.8] mb-4 last:mb-0"
                >
                  {text}
                </p>
              ))}
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="mt-12 bg-card rounded-xl p-8 shadow-[0_20px_40px_rgba(16,59,92,0.05)]">
                <h2 className="text-lg font-bold text-primary mb-4">
                  Initiativbewerbung
                </h2>
                <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
                  Sind Sie motiviert, Teil unseres Teams zu werden? Senden Sie
                  uns Ihre Bewerbungsunterlagen per E-Mail oder rufen Sie uns an.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href={`mailto:${siteData.practice.email}?subject=Initiativbewerbung`}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-primary to-primary-container rounded-full hover:shadow-[0_8px_24px_rgba(16,59,92,0.3)] transition-all duration-300"
                  >
                    <Mail className="w-4 h-4" />
                    E-Mail senden
                  </a>
                  <a
                    href={`tel:${siteData.practice.phone.replace(/[\s/]/g, "")}`}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-primary bg-surface-highest rounded-full hover:bg-surface-high transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    {siteData.practice.phone}
                  </a>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}
