import type { Metadata } from "next";
import Image from "next/image";
import { pages } from "@content/pages";
import { FadeIn } from "@/components/shared/FadeIn";

export const metadata: Metadata = {
  title: pages.gallery.title,
  description: pages.gallery.metaDescription,
};

const galleryImages = [
  {
    src: "/images/gallery/eingang.jpeg",
    alt: "Eingangsbereich der Zahnarztpraxis",
    title: "Eingangsbereich",
  },
  {
    src: "/images/gallery/wartezimmer.jpeg",
    alt: "Wartezimmer",
    title: "Wartezimmer",
  },
  {
    src: "/images/gallery/behandlung-1.jpg",
    alt: "Behandlungsraum",
    title: "Behandlungsraum",
  },
  {
    src: "/images/gallery/behandlung-2.jpg",
    alt: "Behandlungsraum mit moderner Ausstattung",
    title: "Moderne Ausstattung",
  },
  {
    src: "/images/gallery/roentgen.jpeg",
    alt: "Digitale Röntgentechnik",
    title: "Digitales Röntgen",
  },
  {
    src: "/images/gallery/ausstattung.png",
    alt: "Praxisausstattung",
    title: "Praxisausstattung",
  },
];

export default function PraxisgaleriePage() {
  return (
    <>
      {/* Header */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-primary to-primary-container">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FadeIn>
            <p className="text-secondary-fixed/80 text-sm font-semibold tracking-[0.25em] uppercase mb-4">
              Praxis
            </p>
            <h1 className="text-4xl lg:text-[3.5rem] font-bold text-white leading-[1.08]">
              {pages.gallery.heading}
            </h1>
          </FadeIn>
        </div>
      </section>

      {/* Intro */}
      <section className="py-24 lg:py-32 bg-surface">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            {pages.gallery.content.map((text, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <p className="text-base text-on-surface-variant leading-[1.8] mb-4 last:mb-0">
                  {text}
                </p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery grid */}
      <section className="py-24 lg:py-32 bg-surface-low">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FadeIn>
            <p className="text-sm font-semibold text-secondary tracking-[0.2em] uppercase mb-4">
              Rundgang
            </p>
            <h2 className="text-3xl lg:text-[2.75rem] font-bold text-primary leading-[1.15] mb-14">
              Unsere Praxis in Bildern
            </h2>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {galleryImages.map((img, i) => (
              <FadeIn key={img.src} delay={i * 0.04}>
                <div className="group bg-card rounded-xl overflow-hidden shadow-[0_20px_40px_rgba(16,59,92,0.04)] hover:shadow-[0_20px_40px_rgba(16,59,92,0.1)] transition-all duration-500">
                  <div className="aspect-[4/3] overflow-hidden">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      width={600}
                      height={450}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-sm font-semibold text-primary">
                      {img.title}
                    </h3>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
