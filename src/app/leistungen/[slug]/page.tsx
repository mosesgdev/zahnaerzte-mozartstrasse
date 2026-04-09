import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { services } from "@content/services";
import { siteData } from "@content/site-data";
import { FadeIn } from "@/components/shared/FadeIn";
import { ArrowLeft, ArrowRight, Phone, Check } from "lucide-react";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return {};
  return {
    title: service.title,
    description: service.shortDescription,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  const currentIndex = services.findIndex((s) => s.slug === slug);
  const prevService = currentIndex > 0 ? services[currentIndex - 1] : null;
  const nextService =
    currentIndex < services.length - 1 ? services[currentIndex + 1] : null;

  return (
    <>
      {/* Header */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-primary to-primary-container">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FadeIn>
            <Link
              href="/leistungen"
              className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Alle Leistungen
            </Link>
            <h1 className="text-4xl lg:text-[3.5rem] font-bold text-white leading-[1.08]">
              {service.pageTitle}
            </h1>
          </FadeIn>
        </div>
      </section>

      {/* Content */}
      <section className="py-24 lg:py-32 bg-surface">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2">
              <FadeIn>
                {service.underConstruction && (
                  <div className="mb-8 px-5 py-3 bg-tertiary-fixed/20 rounded-xl">
                    <p className="text-sm text-tertiary font-medium">
                      Diese Seite wird derzeit erweitert. Für weitere
                      Informationen kontaktieren Sie uns bitte direkt.
                    </p>
                  </div>
                )}
                <div className="space-y-5">
                  {service.content.map((paragraph, i) => (
                    <p
                      key={i}
                      className="text-base text-on-surface-variant leading-[1.8]"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </FadeIn>

              {service.bulletPoints && service.bulletPoints.length > 0 && (
                <FadeIn delay={0.1}>
                  <div className="mt-12">
                    <h2 className="text-xl font-bold text-primary mb-6">
                      Unsere Leistungen im Detail
                    </h2>
                    <div className="space-y-3">
                      {service.bulletPoints.map((point) => (
                        <div
                          key={point}
                          className="flex items-start gap-3 text-base text-on-surface-variant"
                        >
                          <Check className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </FadeIn>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <FadeIn delay={0.15}>
                <div className="bg-card rounded-xl p-8 shadow-[0_20px_40px_rgba(16,59,92,0.05)] sticky top-28">
                  <h3 className="text-lg font-bold text-primary mb-4">
                    Beratungstermin
                  </h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
                    Haben Sie Fragen zu dieser Behandlung? Wir beraten Sie gerne
                    persönlich und unverbindlich.
                  </p>
                  <a
                    href={`tel:${siteData.practice.phone.replace(/[\s/]/g, "")}`}
                    className="flex items-center justify-center gap-2 w-full px-6 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-primary to-primary-container rounded-full hover:shadow-[0_8px_24px_rgba(16,59,92,0.3)] transition-all duration-300"
                  >
                    <Phone className="w-4 h-4" />
                    {siteData.practice.phone}
                  </a>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-16 bg-surface-low">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            {prevService ? (
              <Link
                href={`/leistungen/${prevService.slug}`}
                className="group flex items-center gap-3 text-sm text-on-surface-variant hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <div>
                  <span className="block text-xs text-on-surface-variant/60 mb-0.5">
                    Vorherige
                  </span>
                  <span className="font-medium">{prevService.title}</span>
                </div>
              </Link>
            ) : (
              <div />
            )}
            {nextService && (
              <Link
                href={`/leistungen/${nextService.slug}`}
                className="group flex items-center gap-3 text-sm text-on-surface-variant hover:text-primary transition-colors text-right"
              >
                <div>
                  <span className="block text-xs text-on-surface-variant/60 mb-0.5">
                    Nächste
                  </span>
                  <span className="font-medium">{nextService.title}</span>
                </div>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
