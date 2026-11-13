import Link from "next/link";
import Image from "next/image";
import { siteData } from "@content/site-data";
import { getServiceSettings } from "@/lib/service-settings";
import { getTeamSettings } from "@/lib/team-settings";
import { getSiteSettings } from "@/lib/site-settings";
import { RichText } from "@/components/shared/RichText";
import { homeContent } from "@content/pages";
import { OpeningHours } from "@/components/shared/OpeningHours";
import { Phone, ArrowRight, MapPin } from "lucide-react";
import { asset } from "@/lib/utils";

const icon = { className: "size-4.5 shrink-0", strokeWidth: 1.5 } as const;

const sectionLabel = "text-sm font-medium text-secondary";
const sectionHeading =
  "text-3xl lg:text-[2.5rem] font-medium text-primary leading-[1.15] tracking-[-0.02em] text-balance";

export default async function Home() {
  const [
    { services, overview: servicesOverview },
    { intro: teamIntro, members },
    { openingHours, announcement },
  ] = await Promise.all([
    getServiceSettings(),
    getTeamSettings(),
    getSiteSettings(),
  ]);
  const showAnnouncement =
    announcement.enabled && Boolean(announcement.title || announcement.text);
  const dentists = members.filter((m) => m.group === "dentists");
  const assistants = members.filter((m) => m.group === "assistants");
  const phoneHref = `tel:${siteData.practice.phone.replace(/[\s/]/g, "")}`;
  const { hero, welcome, contact } = homeContent;
  const owner = dentists[0];
  const visibleServices = services.filter((s) => !s.underConstruction);
  const { street, zip, city } = siteData.practice.address;

  return (
    <>
      {/* ── Announcement (admin → Startseite) ── */}
      {showAnnouncement && (
        <section
          aria-label="Hinweis für Patienten"
          className="bg-surface-container"
        >
          <div className="mx-auto max-w-7xl px-6 py-5 lg:px-8">
            <div className="border-l-4 border-secondary pl-4">
              {announcement.title && (
                <h2 className="text-lg font-semibold leading-snug text-primary lg:text-xl">
                  {announcement.title}
                </h2>
              )}
              <RichText
                text={announcement.text}
                className={`${announcement.title ? "mt-1.5" : ""} max-w-[48rem] space-y-2`}
                paragraphClassName="text-base leading-[1.6] text-on-surface-variant"
              />
            </div>
          </div>
        </section>
      )}

      {/* ── Hero ── */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-12 sm:py-16 lg:min-h-[calc(100svh-5rem)] lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-12">
          <div>
            <p className="text-sm text-white/70">{hero.eyebrow}</p>
            <h1 className="mt-6 text-[2.5rem] font-medium leading-[1.06] tracking-[-0.03em] text-white text-balance sm:text-5xl lg:text-[4rem]">
              {hero.heading}
            </h1>
            <p className="mt-6 max-w-[36rem] text-lg leading-[1.6] text-white/80 lg:text-xl">
              {hero.text}
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href={phoneHref}
                className="inline-flex h-12 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[10px] bg-surface px-6 text-base font-medium text-primary transition-[background-color,transform] duration-150 ease-out hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-[0.98]"
              >
                <Phone {...icon} />
                {hero.primaryAction}
                <span className="font-normal tabular-nums text-primary/70">
                  {siteData.practice.phone}
                </span>
              </a>
              <Link
                href="/leistungen"
                className="inline-flex h-12 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[10px] bg-white/10 px-6 text-base font-medium text-white ring-1 ring-white/25 transition-[background-color,transform] duration-150 ease-out hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-[0.98]"
              >
                {hero.secondaryAction}
                <ArrowRight {...icon} />
              </Link>
            </div>
          </div>

          <figure>
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-primary-container lg:aspect-auto lg:h-[min(640px,calc(100svh-12rem))]">
              <Image
                src={asset("/images/gallery/eingang.jpeg")}
                alt={hero.imageAlt}
                fill
                priority
                sizes="(min-width: 1024px) 600px, 100vw"
                className="object-cover object-[50%_55%]"
              />
            </div>
            <figcaption className="mt-3 text-sm text-white/70">
              {hero.imageCaption}
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ── Welcome ── */}
      <section className="bg-surface-low py-20 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
          <div className="lg:col-span-7">
            <h2 className={sectionHeading}>{welcome.heading}</h2>
            <div className="mt-6 max-w-[40rem] space-y-4 text-base leading-[1.75] text-on-surface-variant">
              {welcome.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
          <dl className="grid grid-cols-2 self-end border-t border-border lg:col-span-5">
            {welcome.facts.map((f, i) => (
              <div
                key={f.label}
                className={`flex flex-col-reverse border-b border-border py-6 ${i % 2 === 0 ? "pr-6" : "pl-6"}`}
              >
                <dt className="mt-1 text-sm text-on-surface-variant">
                  {f.label}
                </dt>
                <dd className="text-2xl font-medium tabular-nums text-primary">
                  {f.value.replace(
                    "{services}",
                    String(visibleServices.length),
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="bg-surface py-20 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
          <div className="lg:col-span-4">
            <p className={sectionLabel}>{homeContent.services.label}</p>
            <h2 className={`mt-4 ${sectionHeading}`}>
              {servicesOverview.heading}
            </h2>
            <RichText
              text={servicesOverview.anxiousPatients}
              className="mt-6 space-y-4"
              paragraphClassName="text-base leading-[1.75] text-on-surface-variant"
            />
            <Link
              href="/leistungen"
              className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary underline-offset-4 transition-colors duration-150 ease-out hover:text-secondary hover:underline"
            >
              {homeContent.services.more}
              <ArrowRight {...icon} />
            </Link>
          </div>
          <ul className="border-t border-border lg:col-span-8">
            {visibleServices.map((service) => (
              <li key={service.slug} className="border-b border-border">
                <Link
                  href={`/leistungen/${service.slug}`}
                  className="group grid grid-cols-[1fr_auto] items-center gap-6 py-5 sm:grid-cols-[16rem_1fr_auto]"
                >
                  <h3 className="text-lg font-medium text-primary transition-colors duration-150 ease-out group-hover:text-secondary">
                    {service.title}
                  </h3>
                  <p className="col-start-1 text-sm leading-relaxed text-on-surface-variant sm:col-start-2 sm:row-start-1">
                    {service.shortDescription}
                  </p>
                  <ArrowRight
                    {...icon}
                    className={`${icon.className} col-start-2 row-span-2 row-start-1 text-on-surface-variant transition-colors duration-150 ease-out group-hover:text-primary sm:col-start-3 sm:row-span-1`}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="bg-surface-low py-20 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
          <div className="lg:col-span-4">
            <p className={sectionLabel}>{homeContent.team.label}</p>
            <h2 className={`mt-4 ${sectionHeading}`}>{teamIntro.heading}</h2>
            <RichText
              text={teamIntro.text}
              className="mt-6 space-y-4"
              paragraphClassName="text-base leading-[1.75] text-on-surface-variant"
            />
            <Link
              href="/team"
              className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary underline-offset-4 transition-colors duration-150 ease-out hover:text-secondary hover:underline"
            >
              {homeContent.team.more}
              <ArrowRight {...icon} />
            </Link>
          </div>

          <div className="space-y-4 lg:col-span-8">
            {owner && (
              <article className="rounded-lg bg-card p-6 shadow-[0_1px_2px_rgba(0,0,0,0.05)] sm:p-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
                  <div className="relative h-40 w-32 shrink-0 overflow-hidden rounded-[8px] bg-surface-container">
                    {owner.image && (
                      <Image
                        src={asset(owner.image)}
                        alt={owner.name}
                        fill
                        sizes="128px"
                        className="object-cover object-top"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-medium text-primary">
                      {owner.name}
                    </h3>
                    <p className="mt-1 text-sm text-on-surface-variant">
                      {owner.role}
                    </p>
                    <RichText
                      text={owner.description}
                      className="mt-4 space-y-3"
                      paragraphClassName="text-sm leading-relaxed text-on-surface-variant"
                    />
                    {owner.qualifications && (
                      <dl className="mt-6 border-t border-border text-sm">
                        {owner.qualifications.map((q) => {
                          const [label, years] = q.split(": ");
                          return (
                            <div
                              key={q}
                              className="flex justify-between gap-4 border-b border-border py-2"
                            >
                              <dt className="text-foreground/80">{label}</dt>
                              <dd className="shrink-0 tabular-nums text-on-surface-variant">
                                {years}
                              </dd>
                            </div>
                          );
                        })}
                      </dl>
                    )}
                  </div>
                </div>
              </article>
            )}

            <ul className="grid gap-4 sm:grid-cols-3">
              {assistants.slice(0, 3).map((a) => (
                <li
                  key={a.name}
                  className="flex items-center gap-4 rounded-lg bg-card p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                >
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-[8px] bg-surface-container">
                    {a.image && (
                      <Image
                        src={asset(a.image)}
                        alt={a.name}
                        fill
                        sizes="56px"
                        className="object-cover object-top"
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-primary">{a.name}</p>
                    <p className="mt-1 text-sm leading-snug text-on-surface-variant">
                      {a.role}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section className="bg-primary py-20 text-primary-foreground lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
          <div className="lg:col-span-6">
            <h2 className="text-3xl font-medium leading-[1.15] tracking-[-0.02em] lg:text-[2.5rem]">
              {contact.heading}
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-white/70">
              {contact.text}
            </p>
            <a
              href={phoneHref}
              className="mt-10 inline-flex h-12 items-center gap-2 rounded-[10px] bg-surface px-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white text-base font-medium tabular-nums text-primary transition-[background-color,transform] duration-150 ease-out hover:bg-white active:scale-[0.98]"
            >
              <Phone {...icon} />
              {siteData.practice.phone}
            </a>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <h3 className="text-sm font-medium text-white/60">
              {contact.hoursHeading}
            </h3>
            <OpeningHours hours={openingHours} tone="dark" className="mt-4" />
            <Link
              href="/anfahrt"
              className="mt-6 flex min-h-11 items-center gap-2 text-sm text-white/70 transition-colors duration-150 ease-out hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <MapPin {...icon} />
              <span>
                {street}, {zip} {city}
                <span className="text-white/70"> · {contact.directions}</span>
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
