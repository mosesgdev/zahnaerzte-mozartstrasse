"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { AlertCircle, Menu, X, Phone, ChevronDown } from "lucide-react";
import { navigation } from "@content/pages";
import { siteData } from "@content/site-data";
import { asset } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

const navItems = navigation.main as NavItem[];
const utilityItems = navigation.utility as NavItem[];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopDropdown, setDesktopDropdown] = useState<string | null>(null);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
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
        className={`fixed top-0 inset-x-0 z-50 bg-surface/95 backdrop-blur-sm border-b transition-colors duration-200 ease-out ${
          scrolled ? "border-border" : "border-transparent"
        }`}
      >
        <nav className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="block">
              <Image
                src={asset("/images/logo.png")}
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
                    onMouseEnter={() => setDesktopDropdown(item.label)}
                    onMouseLeave={() => setDesktopDropdown(null)}
                    onFocus={() => setDesktopDropdown(item.label)}
                  >
                    <Link
                      href={item.href}
                      className={`flex h-9 items-center gap-1 px-3 text-sm font-medium transition-colors duration-150 ease-out rounded-[8px] ${
                        desktopDropdown === item.label
                          ? "bg-surface-container text-primary"
                          : "text-foreground/70 hover:text-primary hover:bg-surface-container"
                      }`}
                    >
                      {item.label}
                      <ChevronDown
                        strokeWidth={1.5}
                        className={`size-4 transition-transform duration-150 ease-out ${
                          desktopDropdown === item.label ? "rotate-180" : ""
                        }`}
                      />
                    </Link>
                    <div
                      className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 transition-[opacity,transform,visibility] duration-200 ease-out ${
                        desktopDropdown === item.label
                          ? "opacity-100 visible translate-y-0 pointer-events-auto"
                          : "opacity-0 invisible -translate-y-1 pointer-events-none"
                      }`}
                    >
                      <div className="w-72 bg-card border border-border rounded-[12px] shadow-[0_8px_24px_rgba(0,0,0,0.06)] p-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="flex h-9 items-center px-3 text-sm text-foreground/70 hover:text-primary hover:bg-surface-low rounded-[8px] transition-colors duration-150 ease-out"
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
                    className="flex h-9 items-center px-3 text-sm font-medium text-foreground/70 hover:text-primary transition-colors duration-150 ease-out rounded-[8px] hover:bg-surface-container"
                  >
                    {item.label}
                  </Link>
                )
              )}
            </div>

            {/* CTA + mobile toggle */}
            <div className="flex items-center gap-3">
              {utilityItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="hidden md:inline-flex h-9 items-center gap-2 rounded-[8px] px-3 text-sm font-medium text-secondary transition-colors duration-150 ease-out hover:bg-surface-container"
                >
                  <AlertCircle className="size-4" strokeWidth={1.5} />
                  {item.label}
                </Link>
              ))}
              <a
                href={phoneHref}
                className="hidden sm:flex h-9 items-center gap-2 px-4 text-sm font-medium text-primary-foreground bg-primary rounded-[8px] hover:bg-primary-container transition-[background-color,transform] duration-150 ease-out active:scale-[0.98]"
              >
                <Phone className="size-4" strokeWidth={1.5} />
                Anrufen
              </a>
              <a
                href={phoneHref}
                className="sm:hidden p-3 text-primary hover:text-tertiary transition-colors duration-150 ease-out"
                aria-label="Anrufen"
              >
                <Phone className="size-5" strokeWidth={1.5} />
              </a>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="xl:hidden p-2.5 text-foreground hover:text-primary transition-colors duration-150 ease-out"
                aria-label={mobileOpen ? "Menü schließen" : "Menü öffnen"}
              >
                {mobileOpen ? (
                  <X className="size-6" strokeWidth={1.5} />
                ) : (
                  <Menu className="size-6" strokeWidth={1.5} />
                )}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 xl:hidden transition-[opacity,visibility] duration-200 ease-out ${
          mobileOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-foreground/10"
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={`absolute top-20 right-0 bottom-0 w-80 max-w-[calc(100%-2rem)] bg-surface border-l border-border overflow-y-auto transition-transform duration-300 ease-out ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <nav className="p-6 space-y-1">
            {utilityItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="mb-4 flex items-center justify-between rounded-[10px] bg-surface-low px-4 py-3 text-base font-medium text-secondary hover:bg-surface-container transition-colors duration-150 ease-out"
              >
                <span className="flex items-center gap-2">
                  <AlertCircle className="size-4" strokeWidth={1.5} />
                  {item.label}
                </span>
                <span className="text-xs font-medium text-on-surface-variant">
                  aktuell
                </span>
              </Link>
            ))}
            {navItems.map((item) =>
              item.children ? (
                <div key={item.label}>
                  <button
                    onClick={() =>
                      setMobileDropdown(
                        mobileDropdown === item.label ? null : item.label,
                      )
                    }
                    aria-expanded={mobileDropdown === item.label}
                    className="w-full flex items-center justify-between px-4 py-3 text-base font-medium text-foreground hover:text-primary rounded-[10px] hover:bg-surface-low transition-colors duration-150 ease-out"
                  >
                    {item.label}
                    <ChevronDown
                      strokeWidth={1.5}
                      className={`size-4 transition-transform duration-150 ease-out ${
                        mobileDropdown === item.label ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    hidden={mobileDropdown !== item.label}
                  >
                    <div className="ml-4 mt-1 space-y-0.5 pb-2">
                      {item.children[0]?.href !== item.href && (
                        <Link
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className="block px-4 py-3 text-sm text-foreground/70 hover:text-primary rounded-[8px] hover:bg-surface-low transition-colors duration-150 ease-out font-medium"
                        >
                          Alle {item.label}
                        </Link>
                      )}
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          className="block px-4 py-3 text-sm text-foreground/70 hover:text-primary rounded-[8px] hover:bg-surface-low transition-colors duration-150 ease-out"
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
                  className="block px-4 py-3 text-base font-medium text-foreground hover:text-primary rounded-[10px] hover:bg-surface-low transition-colors duration-150 ease-out"
                >
                  {item.label}
                </Link>
              )
            )}

            {/* Mobile phone CTA */}
            <div className="pt-4 mt-4">
              <a
                href={phoneHref}
                className="flex h-12 items-center justify-center gap-2 w-full px-6 text-base font-medium tabular-nums text-primary-foreground bg-primary rounded-[10px] hover:bg-primary-container transition-colors duration-150 ease-out"
              >
                <Phone className="size-4" strokeWidth={1.5} />
                {siteData.practice.phone}
              </a>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
