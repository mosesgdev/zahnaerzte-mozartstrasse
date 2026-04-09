import Link from "next/link";
import { siteData } from "@content/site-data";
import { navigation } from "@content/pages";
import { services } from "@content/services";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  const phoneHref = `tel:${siteData.practice.phone.replace(/[\s/]/g, "")}`;

  return (
    <footer className="bg-surface-container">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Practice info */}
          <div>
            <h3 className="text-lg font-bold text-primary mb-1">
              {siteData.practice.shortName}
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-5">
              {siteData.practice.name}
            </p>
            <div className="space-y-3">
              <Link
                href="/anfahrt"
                className="flex items-start gap-2.5 text-sm text-on-surface-variant hover:text-primary transition-colors"
              >
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  {siteData.practice.address.street}
                  <br />
                  {siteData.practice.address.zip}{" "}
                  {siteData.practice.address.city}
                </span>
              </Link>
              <a
                href={phoneHref}
                className="flex items-center gap-2.5 text-sm text-on-surface-variant hover:text-primary transition-colors"
              >
                <Phone className="w-4 h-4 shrink-0" />
                {siteData.practice.phone}
              </a>
              <a
                href={`mailto:${siteData.practice.email}`}
                className="flex items-center gap-2.5 text-sm text-on-surface-variant hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4 shrink-0" />
                {siteData.practice.email}
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs font-semibold text-primary uppercase tracking-[0.15em] mb-5">
              Leistungen
            </h4>
            <ul className="space-y-2.5">
              {services.slice(0, 7).map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/leistungen/${s.slug}`}
                    className="text-sm text-on-surface-variant hover:text-primary transition-colors"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/leistungen"
                  className="text-sm font-medium text-secondary hover:text-primary transition-colors"
                >
                  Alle Leistungen →
                </Link>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-xs font-semibold text-primary uppercase tracking-[0.15em] mb-5">
              Sprechzeiten
            </h4>
            <ul className="space-y-2.5">
              {siteData.openingHours.map((h) => (
                <li
                  key={h.day}
                  className="flex justify-between text-sm text-on-surface-variant gap-4"
                >
                  <span className="font-medium text-foreground/80">
                    {h.day}
                  </span>
                  <span className="tabular-nums">{h.hours}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-semibold text-primary uppercase tracking-[0.15em] mb-5">
              Schnellzugriff
            </h4>
            <ul className="space-y-2.5">
              {(navigation.main as { label: string; href: string }[])
                .filter(
                  (n) => !("children" in n) && n.href !== "/"
                )
                .map((n) => (
                  <li key={n.href}>
                    <Link
                      href={n.href}
                      className="text-sm text-on-surface-variant hover:text-primary transition-colors"
                    >
                      {n.label}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-surface-high">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-on-surface-variant">
            © {new Date().getFullYear()} {siteData.practice.name}
          </p>
          <div className="flex gap-6">
            {navigation.footer.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="text-xs text-on-surface-variant hover:text-primary transition-colors"
              >
                {n.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
