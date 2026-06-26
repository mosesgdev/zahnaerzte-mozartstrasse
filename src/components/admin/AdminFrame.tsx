import Link from "next/link";
import { logout } from "@/app/admin/actions";
import {
  CalendarOff,
  FileText,
  Images,
  LogOut,
  Stethoscope,
  Users,
} from "lucide-react";

const adminNav = [
  { label: "Urlaubszeiten", href: "/admin/urlaubszeiten", icon: CalendarOff },
  { label: "Team", href: "/admin/team", icon: Users },
  { label: "Praxisgalerie", href: "/admin/praxisgalerie", icon: Images },
  { label: "Leistungen", href: "/admin/leistungen", icon: Stethoscope },
  { label: "Notdienst", href: "/admin/notdienst", icon: FileText },
];

export function AdminFrame({
  title,
  children,
  width = "max-w-5xl",
}: {
  title: string;
  children: React.ReactNode;
  width?: string;
}) {
  return (
    <section className="py-16 lg:py-24 bg-surface min-h-[70vh]">
      <div className={`mx-auto ${width} px-6`}>
        <div className="flex flex-col gap-6 mb-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-secondary text-xs font-semibold tracking-[0.25em] uppercase mb-2">
                Praxis-Verwaltung
              </p>
              <h1 className="text-3xl lg:text-4xl font-bold text-primary">
                {title}
              </h1>
            </div>
            <form action={logout}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Abmelden
              </button>
            </form>
          </div>

          <nav className="flex flex-wrap gap-2">
            {adminNav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-medium text-on-surface-variant shadow-[0_10px_30px_rgba(16,59,92,0.04)] hover:text-primary hover:bg-surface-container transition-colors"
                >
                  <Icon className="w-4 h-4 text-secondary" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {children}
      </div>
    </section>
  );
}
