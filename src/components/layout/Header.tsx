"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { navigation } from "@content/pages";
import { siteData } from "@content/site-data";

interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

const navItems = navigation.main as NavItem[];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const phoneHref = `tel:${siteData.practice.phone.replace(/[\s/]/g, "")}`;

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-[0_20px_40px_rgba(16,59,92,0.06)]"
            : "bg-white/60 backdrop-blur-md"
        }`}
      >
        <nav className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="block">
              <Image
                src="/images/logo.png"
                alt={siteData.practice.shortName}
                width={140}
                height={56}
                className="h-12 w-auto"
                priority
              />
            </Link>

            {/* Desktop nav */}
            <div className="hidden xl:flex items-center gap-0.5">
              {navItems.map((item) =>
                item.children ? (
                  <div
                    key={item.label}
                    className="relative group"
                    onMouseEnter={() => setServicesOpen(true)}
                    onMouseLeave={() => setServicesOpen(false)}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center gap-1 px-3.5 py-2 text-[13px] font-medium text-foreground/70 hover:text-primary transition-colors rounded-full hover:bg-surface-low"
                    >
                      {item.label}
                      <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
                    </Link>
                    <div
                      className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 transition-all duration-200 ${
                        servicesOpen
                          ? "opacity-100 visible translate-y-0"
                          : "opacity-0 invisible -translate-y-2"
                      }`}
                    >
                      <div className="w-72 bg-white/95 backdrop-blur-xl rounded-xl shadow-[0_20px_40px_rgba(16,59,92,0.12)] p-2.5">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-4 py-2.5 text-[13px] text-foreground/70 hover:text-primary hover:bg-surface-low rounded-lg transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="px-3.5 py-2 text-[13px] font-medium text-foreground/70 hover:text-primary transition-colors rounded-full hover:bg-surface-low"
                  >
                    {item.label}
                  </Link>
                )
              )}
            </div>

            {/* CTA + mobile toggle */}
            <div className="flex items-center gap-3">
              <a
                href={phoneHref}
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary to-primary-container rounded-full hover:shadow-[0_8px_24px_rgba(16,59,92,0.3)] transition-all duration-300"
              >
                <Phone className="w-4 h-4" />
                Anrufen
              </a>
              <a
                href={phoneHref}
                className="sm:hidden p-2 text-primary hover:text-tertiary transition-colors"
                aria-label="Anrufen"
              >
                <Phone className="w-5 h-5" />
              </a>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="xl:hidden p-2 text-foreground hover:text-primary transition-colors"
                aria-label={mobileOpen ? "Menü schließen" : "Menü öffnen"}
              >
                {mobileOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 xl:hidden transition-all duration-300 ${
          mobileOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-primary/10 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={`absolute top-20 right-0 bottom-0 w-80 max-w-[calc(100%-2rem)] bg-white/95 backdrop-blur-xl shadow-[-20px_0_40px_rgba(16,59,92,0.1)] overflow-y-auto transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <nav className="p-6 space-y-1">
            {navItems.map((item) =>
              item.children ? (
                <div key={item.label}>
                  <button
                    onClick={() => setServicesOpen(!servicesOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 text-base font-medium text-foreground hover:text-primary rounded-xl hover:bg-surface-low transition-colors"
                  >
                    {item.label}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        servicesOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      servicesOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="ml-4 mt-1 space-y-0.5 pb-2">
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="block px-4 py-2.5 text-sm text-foreground/70 hover:text-primary rounded-lg hover:bg-surface-low transition-colors font-medium"
                      >
                        Alle Leistungen
                      </Link>
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          className="block px-4 py-2.5 text-sm text-foreground/70 hover:text-primary rounded-lg hover:bg-surface-low transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-base font-medium text-foreground hover:text-primary rounded-xl hover:bg-surface-low transition-colors"
                >
                  {item.label}
                </Link>
              )
            )}

            {/* Mobile phone CTA */}
            <div className="pt-4 mt-4">
              <a
                href={phoneHref}
                className="flex items-center justify-center gap-2 w-full px-6 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-primary to-primary-container rounded-full"
              >
                <Phone className="w-4 h-4" />
                {siteData.practice.phone}
              </a>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
