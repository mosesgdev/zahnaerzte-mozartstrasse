import type { Metadata } from "next";
import { pages } from "@content/pages";
import { siteData } from "@content/site-data";
import { FadeIn } from "@/components/shared/FadeIn";

export const metadata: Metadata = {
  title: pages.impressum.title,
  description: "Impressum und Datenschutzhinweise der Zahnarztpraxis Boris Shuk in Winsen (Luhe).",
};

export default function ImpressumPage() {
  const { practice, credentials } = siteData;

  return (
    <>
      {/* Header */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-primary to-primary-container">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FadeIn>
            <h1 className="text-4xl lg:text-[3.5rem] font-bold text-white leading-[1.08]">
              {pages.impressum.heading}
            </h1>
          </FadeIn>
        </div>
      </section>

      {/* Content */}
      <section className="py-24 lg:py-32 bg-surface">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl space-y-16">
            <FadeIn>
              <div>
                <h2 className="text-xs font-semibold text-primary uppercase tracking-[0.15em] mb-6">
                  Angaben gemäß § 5 TMG
                </h2>
                <div className="bg-card rounded-xl p-8 shadow-[0_20px_40px_rgba(16,59,92,0.04)]">
                  <p className="text-base text-foreground font-bold mb-1">
                    {practice.owner}
                  </p>
                  <p className="text-base text-on-surface-variant mb-4">
                    {practice.title}
                  </p>
                  <p className="text-base text-on-surface-variant leading-relaxed">
                    {practice.address.street}
                    <br />
                    {practice.address.zip} {practice.address.city}
                  </p>
                  <div className="mt-5 space-y-1.5">
                    <p className="text-sm text-on-surface-variant">
                      <span className="font-medium text-foreground/80">Telefon:</span>{" "}
                      {practice.phone}
                    </p>
                    <p className="text-sm text-on-surface-variant">
                      <span className="font-medium text-foreground/80">Fax:</span>{" "}
                      {practice.fax}
                    </p>
                    <p className="text-sm text-on-surface-variant">
                      <span className="font-medium text-foreground/80">E-Mail:</span>{" "}
                      <a
                        href={`mailto:${practice.email}`}
                        className="hover:text-primary transition-colors"
                      >
                        {practice.email}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.05}>
              <div>
                <h2 className="text-xs font-semibold text-primary uppercase tracking-[0.15em] mb-6">
                  Berufsbezeichnung und Approbation
                </h2>
                <div className="bg-card rounded-xl p-8 shadow-[0_20px_40px_rgba(16,59,92,0.04)]">
                  <div className="space-y-3">
                    <p className="text-sm text-on-surface-variant">
                      <span className="font-medium text-foreground/80">
                        Berufsbezeichnung:
                      </span>{" "}
                      Zahnarzt (verliehen in der Bundesrepublik Deutschland)
                    </p>
                    <p className="text-sm text-on-surface-variant">
                      <span className="font-medium text-foreground/80">
                        Approbation:
                      </span>{" "}
                      {credentials.approbation}
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div>
                <h2 className="text-xs font-semibold text-primary uppercase tracking-[0.15em] mb-6">
                  Zuständige Aufsichtsbehörden
                </h2>
                <div className="bg-card rounded-xl p-8 shadow-[0_20px_40px_rgba(16,59,92,0.04)]">
                  <div className="space-y-3">
                    <p className="text-sm text-on-surface-variant">
                      <span className="font-medium text-foreground/80">
                        Kammer:
                      </span>{" "}
                      {credentials.chamber}
                    </p>
                    <p className="text-sm text-on-surface-variant">
                      <span className="font-medium text-foreground/80">
                        KZV:
                      </span>{" "}
                      {credentials.kzv}
                    </p>
                    <p className="text-sm text-on-surface-variant">
                      <span className="font-medium text-foreground/80">
                        Datenschutz:
                      </span>{" "}
                      {credentials.dataProtectionAuthority}
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div>
                <h2 className="text-xs font-semibold text-primary uppercase tracking-[0.15em] mb-6">
                  Haftungshinweis
                </h2>
                <div className="bg-card rounded-xl p-8 shadow-[0_20px_40px_rgba(16,59,92,0.04)]">
                  <p className="text-sm text-on-surface-variant leading-[1.8]">
                    Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir
                    keine Haftung für die Inhalte externer Links. Für den Inhalt
                    der verlinkten Seiten sind ausschließlich deren Betreiber
                    verantwortlich. Alle auf dieser Website veröffentlichten
                    Inhalte und Bilder unterliegen dem deutschen Urheberrecht.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}
