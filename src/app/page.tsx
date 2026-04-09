import Link from "next/link";
import Image from "next/image";
import { siteData } from "@content/site-data";
import { services, servicesOverview } from "@content/services";
import { dentists, assistants, teamIntro } from "@content/team";
import { FadeIn } from "@/components/shared/FadeIn";
import {
  Phone,
  ArrowRight,
  MapPin,
  Clock,
  Shield,
  Star,
  Sparkles,
  Heart,
} from "lucide-react";

export default function Home() {
  const phoneHref = `tel:${siteData.practice.phone.replace(/[\s/]/g, "")}`;

  return (
    <>
      {/* ── Hero ── */}
      <section className="-mt-20 relative min-h-screen flex items-center bg-gradient-to-br from-primary via-primary to-primary-container overflow-hidden">
        {/* Atmospheric orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -right-32 w-[500px] h-[500px] rounded-full bg-white/[0.04] blur-3xl" />
          <div className="absolute -bottom-40 -left-20 w-[400px] h-[400px] rounded-full bg-tertiary/20 blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-72 h-72 rounded-full bg-secondary/[0.06] blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 pt-40 pb-24 lg:pt-48 lg:pb-32 w-full">
          <div className="max-w-3xl">
            <FadeIn>
              <p className="text-secondary-fixed/80 text-sm font-semibold tracking-[0.25em] uppercase mb-8">
                Zahnarztpraxis in Winsen (Luhe)
              </p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold text-white leading-[1.08] tracking-tight">
                Ihre Zahnärzte
                <br />
                <span className="text-tertiary-fixed">in Winsen</span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="mt-8 text-lg lg:text-xl text-white/60 max-w-xl leading-relaxed">
                Moderne ästhetische Zahnheilkunde mit persönlicher Zuwendung.
                Individuelle Behandlungspläne für Ihre Gesundheit und Ihr
                Wohlbefinden.
              </p>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <a
                  href={phoneHref}
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 text-base font-semibold text-primary bg-white rounded-full hover:bg-white/90 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(255,255,255,0.25)]"
                >
                  <Phone className="w-5 h-5" />
                  Termin vereinbaren
                </a>
                <Link
                  href="/leistungen"
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 text-base font-semibold text-white/90 bg-white/[0.08] backdrop-blur-sm rounded-full hover:bg-white/[0.15] transition-all duration-300"
                >
                  Leistungen entdecken
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </FadeIn>
          </div>

          {/* Quick info pills */}
          <FadeIn delay={0.5}>
            <div className="mt-20 flex flex-wrap gap-3">
              {[
                "Implantologie",
                "Prophylaxe",
                "Laserbehandlung",
                "Ästhetische Zahnheilkunde",
                "Angstpatienten willkommen",
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 text-xs font-medium text-white/70 bg-white/[0.06] backdrop-blur-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Welcome ── */}
      <section className="py-24 lg:py-36 bg-surface">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <FadeIn>
              <p className="text-sm font-semibold text-secondary tracking-[0.2em] uppercase mb-4">
                Willkommen
              </p>
              <h2 className="text-3xl lg:text-[2.75rem] font-bold text-primary leading-[1.15]">
                Zahnmedizin mit
                <br />
                Leidenschaft und Präzision
              </h2>
              <p className="mt-8 text-base text-on-surface-variant leading-[1.8]">
                In unserer Praxis verbinden wir modernste Behandlungsmethoden
                mit persönlicher Zuwendung. Als Zahnarzt und Zahntechniker
                vereint Boris Shuk die Expertise beider Welten — für
                Ergebnisse, die funktionell und ästhetisch überzeugen.
              </p>
              <p className="mt-4 text-base text-on-surface-variant leading-[1.8]">
                Seit 2013 versorgen wir Patienten in Winsen (Luhe) mit
                individuellen Behandlungsplänen und evidenzbasierter Zahnmedizin.
              </p>
            </FadeIn>
            <FadeIn delay={0.15}>
              <div className="grid grid-cols-2 gap-5">
                <div className="bg-card rounded-xl p-7 shadow-[0_20px_40px_rgba(16,59,92,0.05)]">
                  <Star className="w-7 h-7 text-secondary mb-4" />
                  <p className="text-3xl font-bold text-primary">13+</p>
                  <p className="text-sm text-on-surface-variant mt-1">
                    Jahre Erfahrung
                  </p>
                </div>
                <div className="bg-card rounded-xl p-7 shadow-[0_20px_40px_rgba(16,59,92,0.05)]">
                  <Shield className="w-7 h-7 text-secondary mb-4" />
                  <p className="text-3xl font-bold text-primary">10+</p>
                  <p className="text-sm text-on-surface-variant mt-1">
                    Fachbereiche
                  </p>
                </div>
                <div className="bg-card rounded-xl p-7 shadow-[0_20px_40px_rgba(16,59,92,0.05)]">
                  <Sparkles className="w-7 h-7 text-secondary mb-4" />
                  <p className="text-sm font-bold text-primary">
                    Modernste Technik
                  </p>
                  <p className="text-sm text-on-surface-variant mt-1">
                    Laser &amp; Digitale Diagnostik
                  </p>
                </div>
                <div className="bg-card rounded-xl p-7 shadow-[0_20px_40px_rgba(16,59,92,0.05)]">
                  <Heart className="w-7 h-7 text-secondary mb-4" />
                  <p className="text-sm font-bold text-primary">Barrierefrei</p>
                  <p className="text-sm text-on-surface-variant mt-1">
                    Rollstuhlgerechter Zugang
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="py-24 lg:py-36 bg-surface-low">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FadeIn>
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-secondary tracking-[0.2em] uppercase mb-4">
                Leistungen
              </p>
              <h2 className="text-3xl lg:text-[2.75rem] font-bold text-primary leading-[1.15]">
                {servicesOverview.heading}
              </h2>
            </div>
          </FadeIn>
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services
              .filter((s) => !s.underConstruction)
              .map((service, i) => (
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
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-secondary opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                      Mehr erfahren{" "}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </Link>
                </FadeIn>
              ))}
          </div>
          <FadeIn>
            <p className="mt-14 text-base text-on-surface-variant leading-relaxed max-w-2xl">
              {servicesOverview.anxiousPatients}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="py-24 lg:py-36 bg-surface">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-16">
            <div className="lg:col-span-2">
              <FadeIn>
                <p className="text-sm font-semibold text-secondary tracking-[0.2em] uppercase mb-4">
                  Unser Team
                </p>
                <h2 className="text-3xl lg:text-[2.75rem] font-bold text-primary leading-[1.15]">
                  {teamIntro.heading}
                </h2>
                <p className="mt-6 text-base text-on-surface-variant leading-[1.8]">
                  {teamIntro.text}
                </p>
                <Link
                  href="/team"
                  className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:text-primary transition-colors"
                >
                  Gesamtes Team kennenlernen{" "}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </FadeIn>
            </div>
            <div className="lg:col-span-3 space-y-5">
              <FadeIn delay={0.1}>
                <div className="bg-card rounded-xl p-8 shadow-[0_20px_40px_rgba(16,59,92,0.05)]">
                  <div className="flex flex-col sm:flex-row items-start gap-6">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-surface-container">
                      {dentists[0].image ? (
                        <Image
                          src={dentists[0].image}
                          alt={dentists[0].name}
                          width={192}
                          height={192}
                          className="w-full h-full object-cover object-top"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-white text-2xl font-bold">
                          BS
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-primary">
                        {dentists[0].name}
                      </h3>
                      <p className="text-sm text-secondary font-medium mt-0.5">
                        {dentists[0].role}
                      </p>
                      <p className="mt-4 text-sm text-on-surface-variant leading-relaxed">
                        {dentists[0].description}
                      </p>
                      {dentists[0].qualifications && (
                        <ul className="mt-5 space-y-2">
                          {dentists[0].qualifications.map((q) => (
                            <li
                              key={q}
                              className="text-xs text-on-surface-variant flex items-start gap-2.5"
                            >
                              <span className="w-1 h-1 rounded-full bg-secondary mt-1.5 shrink-0" />
                              {q}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </FadeIn>
              <FadeIn delay={0.2}>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {assistants.slice(0, 3).map((a) => (
                    <div
                      key={a.name}
                      className="bg-surface-low rounded-xl p-5"
                    >
                      <p className="text-sm font-semibold text-primary">
                        {a.name}
                      </p>
                      <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                        {a.role}
                      </p>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact CTA ── */}
      <section className="relative py-24 lg:py-36 bg-gradient-to-br from-primary via-primary to-tertiary overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-white/[0.03] blur-3xl" />
          <div className="absolute -bottom-32 left-0 w-[400px] h-[400px] rounded-full bg-secondary/[0.05] blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <h2 className="text-3xl lg:text-[2.75rem] font-bold text-white leading-[1.15]">
                Vereinbaren Sie
                <br />
                Ihren Termin
              </h2>
              <p className="mt-6 text-lg text-white/60 leading-relaxed max-w-md">
                Wir freuen uns auf Ihren Besuch. Rufen Sie uns an oder kommen
                Sie vorbei.
              </p>
              <a
                href={phoneHref}
                className="mt-8 inline-flex items-center gap-3 px-8 py-4 text-lg font-bold text-primary bg-white rounded-full hover:bg-white/90 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(255,255,255,0.25)]"
              >
                <Phone className="w-5 h-5" />
                {siteData.practice.phone}
              </a>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="bg-white/[0.07] backdrop-blur-sm rounded-xl p-8">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2.5">
                  <Clock className="w-5 h-5 text-tertiary-fixed" />
                  Sprechzeiten
                </h3>
                <div className="space-y-3.5">
                  {siteData.openingHours.map((h) => (
                    <div
                      key={h.day}
                      className="flex justify-between text-sm gap-4"
                    >
                      <span className="text-white/90 font-medium">
                        {h.day}
                      </span>
                      <span className="text-white/60 tabular-nums">
                        {h.hours}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-6">
                  <Link
                    href="/anfahrt"
                    className="flex items-center gap-2.5 text-sm text-white/70 hover:text-white transition-colors"
                  >
                    <MapPin className="w-4 h-4 shrink-0" />
                    {siteData.practice.address.street},{" "}
                    {siteData.practice.address.zip}{" "}
                    {siteData.practice.address.city}
                  </Link>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}
