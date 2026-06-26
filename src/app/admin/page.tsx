import Link from "next/link";
import { requireAuth } from "@/lib/session";
import { AdminFrame } from "@/components/admin/AdminFrame";
import {
  CalendarOff,
  FileText,
  Images,
  Stethoscope,
  Users,
} from "lucide-react";

export const metadata = {
  title: "Praxis-Verwaltung",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const sections = [
  {
    title: "Urlaubszeiten",
    href: "/admin/urlaubszeiten",
    description: "Praxisurlaub und Vertretungen pflegen.",
    icon: CalendarOff,
  },
  {
    title: "Team",
    href: "/admin/team",
    description: "Teammitglieder, Rollen, Texte und Bilder bearbeiten.",
    icon: Users,
  },
  {
    title: "Praxisgalerie",
    href: "/admin/praxisgalerie",
    description: "Bilder hinzufügen, entfernen, sortieren und beschriften.",
    icon: Images,
  },
  {
    title: "Leistungen",
    href: "/admin/leistungen",
    description: "Leistungsseiten, Texte, Detailpunkte und Bilder bearbeiten.",
    icon: Stethoscope,
  },
  {
    title: "Notdienst",
    href: "/admin/notdienst",
    description: "Notdienstseite und Download-Dokument verwalten.",
    icon: FileText,
  },
];

export default async function AdminPage() {
  await requireAuth();

  return (
    <AdminFrame title="Übersicht">
      <div className="grid sm:grid-cols-2 gap-5">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link
              key={section.href}
              href={section.href}
              className="group bg-card rounded-2xl p-7 shadow-[0_20px_50px_rgba(16,59,92,0.05)] hover:shadow-[0_20px_50px_rgba(16,59,92,0.1)] transition-all"
            >
              <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/10 text-secondary group-hover:text-primary transition-colors">
                <Icon className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-primary mb-2">
                {section.title}
              </h2>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {section.description}
              </p>
            </Link>
          );
        })}
      </div>
    </AdminFrame>
  );
}
