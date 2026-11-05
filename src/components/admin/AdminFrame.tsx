import Link from "next/link";
import { logout } from "@/app/admin/actions";
import type { AdminArea } from "@/lib/admin-meta";
import { adminSection, adminSections } from "@/components/admin/sections";
import { ExternalLink, LayoutGrid, LogOut } from "lucide-react";

export function AdminFrame({
  title,
  area,
  intro,
  children,
  width = "max-w-5xl",
}: {
  title: string;
  /** Current area: highlights the menu entry and adds "Seite ansehen". */
  area?: AdminArea;
  intro?: string;
  children: React.ReactNode;
  width?: string;
}) {
  const section = area ? adminSection(area) : undefined;

  return (
    <section className="py-10 lg:py-16 bg-surface min-h-[70vh]">
      <div className={`mx-auto ${width} px-4 sm:px-6`}>
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-secondary text-xs font-semibold tracking-[0.25em] uppercase mb-2">
                Praxis-Verwaltung
              </p>
              <h1 className="text-3xl lg:text-4xl font-bold text-primary break-words">
                {title}
              </h1>
            </div>
            <form action={logout}>
              <button
                type="submit"
                data-leave-page
                className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-medium text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Abmelden
              </button>
            </form>
          </div>

          <nav aria-label="Bereiche" className="flex flex-wrap gap-2">
            <AdminNavLink href="/admin" current={!area}>
              <LayoutGrid className="w-4 h-4 text-secondary" />
              Übersicht
            </AdminNavLink>
            {adminSections.map((item) => {
              const Icon = item.icon;
              return (
                <AdminNavLink
                  key={item.href}
                  href={item.href}
                  current={item.key === area}
                >
                  <Icon className="w-4 h-4 text-secondary" />
                  {item.title}
                </AdminNavLink>
              );
            })}
          </nav>

          {(intro || section) && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {intro && (
                <p className="text-base text-on-surface-variant leading-relaxed max-w-2xl">
                  {intro}
                </p>
              )}
              {section && (
                <a
                  href={section.publicHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start rounded-full bg-card px-5 text-sm font-semibold text-primary shadow-[0_10px_30px_rgba(16,59,92,0.06)] hover:bg-surface-container transition-colors sm:self-auto"
                >
                  <ExternalLink className="w-4 h-4" />
                  Seite ansehen
                </a>
              )}
            </div>
          )}
        </div>

        {children}
      </div>
    </section>
  );
}

function AdminNavLink({
  href,
  current,
  children,
}: {
  href: string;
  current: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={current ? "page" : undefined}
      className={`inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors ${
        current
          ? "bg-primary text-white [&_svg]:text-white"
          : "bg-card text-on-surface-variant shadow-[0_10px_30px_rgba(16,59,92,0.04)] hover:text-primary hover:bg-surface-container"
      }`}
    >
      {children}
    </Link>
  );
}
