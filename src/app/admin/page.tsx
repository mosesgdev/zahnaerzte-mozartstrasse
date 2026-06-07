import { requireAuth } from "@/lib/session";
import { getVacations } from "@/lib/vacations";
import { deleteVacationAction, logout } from "./actions";
import { VacationForm } from "@/components/admin/VacationForm";
import { CalendarOff, Phone, Trash2, Plus, LogOut } from "lucide-react";

export const metadata = {
  title: "Urlaubsverwaltung",
  robots: { index: false, follow: false },
};

// Always rendered dynamically — depends on the session cookie and live data.
export const dynamic = "force-dynamic";

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}.${m}.${y}`;
}

export default async function AdminPage() {
  await requireAuth();
  const vacations = await getVacations();

  return (
    <section className="py-16 lg:py-24 bg-surface min-h-[70vh]">
      <div className="mx-auto max-w-3xl px-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-12">
          <div>
            <p className="text-secondary text-xs font-semibold tracking-[0.25em] uppercase mb-2">
              Praxis-Verwaltung
            </p>
            <h1 className="text-3xl lg:text-4xl font-bold text-primary">
              Urlaubszeiten
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

        {/* Add form */}
        <div className="bg-card rounded-2xl p-7 lg:p-9 shadow-[0_20px_50px_rgba(16,59,92,0.06)] mb-12">
          <h2 className="flex items-center gap-2.5 text-xl font-bold text-primary mb-6">
            <Plus className="w-5 h-5 text-secondary" />
            Neue Urlaubszeit
          </h2>
          <VacationForm />
        </div>

        {/* List */}
        <h2 className="text-xl font-bold text-primary mb-6">
          Eingetragene Urlaubszeiten
        </h2>

        {vacations.length === 0 ? (
          <div className="bg-surface-container rounded-2xl p-10 text-center">
            <CalendarOff className="w-8 h-8 text-on-surface-variant/40 mx-auto mb-3" />
            <p className="text-on-surface-variant">
              Noch keine Urlaubszeiten eingetragen.
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {vacations.map((v) => (
              <li
                key={v.id}
                className="bg-card rounded-2xl p-6 lg:p-7 shadow-[0_20px_50px_rgba(16,59,92,0.05)] flex items-start justify-between gap-4"
              >
                <div>
                  <p className="text-base font-bold text-primary">
                    {formatDate(v.start)} – {formatDate(v.end)}
                  </p>
                  <p className="mt-2 text-sm text-on-surface-variant">
                    <span className="font-medium text-foreground">Vertretung:</span>{" "}
                    {v.replacement}
                  </p>
                  {v.replacementPhone && (
                    <a
                      href={`tel:${v.replacementPhone.replace(/[\s/]/g, "")}`}
                      className="mt-1.5 inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-on-surface-variant/50" />
                      {v.replacementPhone}
                    </a>
                  )}
                  {v.note && (
                    <p className="mt-1.5 text-sm text-on-surface-variant/80 italic">
                      {v.note}
                    </p>
                  )}
                </div>

                <form action={deleteVacationAction}>
                  <input type="hidden" name="id" value={v.id} />
                  <button
                    type="submit"
                    aria-label="Urlaubszeit löschen"
                    className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-destructive bg-destructive/10 hover:bg-destructive/20 transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
