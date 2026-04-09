import type { Metadata } from "next";
import Link from "next/link";
import { pages } from "@content/pages";
import { siteData } from "@content/site-data";
import { FadeIn } from "@/components/shared/FadeIn";
import {
  CreditCard,
  CalendarCheck,
  ShieldCheck,
  Clock,
  Phone,
  Info,
} from "lucide-react";

export const metadata: Metadata = {
  title: pages.information.title,
  description: pages.information.metaDescription,
};

const infoCards = [
  {
    icon: CreditCard,
    title: "Versichertenkarte",
    text: "Bitte bringen Sie Ihre Versichertenkarte zu jedem Termin mit.",
  },
  {
    icon: ShieldCheck,
    title: "Prophylaxe",
    text: "Mindestens einmal im Jahr empfohlen, bei empfindlichen Zähnen halbjährlich.",
  },
  {
    icon: CalendarCheck,
    title: "Folgetermin",
    text: "Vereinbaren Sie nach jedem Besuch direkt Ihren nächsten Termin.",
  },
  {
    icon: Clock,
    title: "Pünktlichkeit",
    text: "Bitte erscheinen Sie pünktlich, damit wir Wartezeiten für alle minimieren können.",
  },
  {
    icon: Info,
    title: "Unterlagen",
    text: "Bei Erstbesuch bitte alle relevanten medizinischen Unterlagen und den aktuellen Medikamentenplan mitbringen.",
  },
  {
    icon: Phone,
    title: "Terminabsage",
    text: "Bitte sagen Sie geplante Termine mindestens 24 Stunden vorher ab.",
  },
];

export default function InformationPage() {
  return (
    <>
      {/* Header */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-primary to-primary-container">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FadeIn>
            <p className="text-secondary-fixed/80 text-sm font-semibold tracking-[0.25em] uppercase mb-4">
              Gut zu wissen
            </p>
            <h1 className="text-4xl lg:text-[3.5rem] font-bold text-white leading-[1.08]">
              {pages.information.heading}
            </h1>
          </FadeIn>
        </div>
      </section>

      {/* Info cards */}
      <section className="py-24 lg:py-32 bg-surface">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {infoCards.map((card, i) => (
              <FadeIn key={card.title} delay={i * 0.04}>
                <div className="bg-card rounded-xl p-8 shadow-[0_20px_40px_rgba(16,59,92,0.04)] h-full">
                  <card.icon className="w-7 h-7 text-secondary mb-5" />
                  <h3 className="text-lg font-bold text-primary">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm text-on-surface-variant leading-relaxed">
                    {card.text}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Opening hours */}
      <section className="py-24 lg:py-32 bg-surface-low">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-xl mx-auto">
            <FadeIn>
              <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-8 text-center">
                Unsere Sprechzeiten
              </h2>
              <div className="bg-card rounded-xl p-8 shadow-[0_20px_40px_rgba(16,59,92,0.05)]">
                <div className="space-y-4">
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
            <FadeIn delay={0.1}>
              <div className="mt-8 text-center">
                <Link
                  href="/kontakt"
                  className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-primary to-primary-container rounded-full hover:shadow-[0_8px_24px_rgba(16,59,92,0.3)] transition-all duration-300"
                >
                  <Phone className="w-5 h-5" />
                  Kontakt aufnehmen
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}
