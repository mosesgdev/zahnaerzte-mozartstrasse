import {
  CalendarOff,
  FileText,
  Images,
  Stethoscope,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { AdminArea } from "@/lib/admin-meta";

export interface AdminSection {
  key: AdminArea;
  title: string;
  href: string;
  /** Public page that shows this content ("Seite ansehen"). */
  publicHref: string;
  description: string;
  icon: LucideIcon;
}

export const adminSections: AdminSection[] = [
  {
    key: "notdienst",
    title: "Notdienst",
    href: "/admin/notdienst",
    publicHref: "/notdienst",
    description:
      "Notdienstplan (PDF) und Hinweise für Patienten am Wochenende und an Feiertagen.",
    icon: FileText,
  },
  {
    key: "urlaubszeiten",
    title: "Urlaub & Vertretung",
    href: "/admin/urlaubszeiten",
    publicHref: "/urlaubszeiten",
    description:
      "Praxisurlaub eintragen und angeben, welche Praxis Sie in der Zeit vertritt.",
    icon: CalendarOff,
  },
  {
    key: "team",
    title: "Team",
    href: "/admin/team",
    publicHref: "/team",
    description:
      "Personen, Funktionen, Vorstellungstexte und Fotos – auch die Reihenfolge.",
    icon: Users,
  },
  {
    key: "leistungen",
    title: "Leistungen",
    href: "/admin/leistungen",
    publicHref: "/leistungen",
    description:
      "Namen und Texte der Behandlungen. Der Name erscheint auch im Menü der Website.",
    icon: Stethoscope,
  },
  {
    key: "praxisgalerie",
    title: "Praxisgalerie",
    href: "/admin/praxisgalerie",
    publicHref: "/praxisgalerie",
    description: "Fotos der Praxis hinzufügen, beschriften und sortieren.",
    icon: Images,
  },
];

export function adminSection(key: AdminArea): AdminSection {
  return adminSections.find((section) => section.key === key)!;
}
