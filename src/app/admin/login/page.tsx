import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/session";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata = {
  title: "Login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  // Already signed in → go straight to the dashboard.
  if (await isAuthenticated()) {
    redirect("/admin");
  }

  return (
    <section className="py-24 lg:py-32 bg-surface min-h-[70vh] flex items-center">
      <div className="mx-auto w-full max-w-md px-6">
        <div className="bg-card rounded-2xl p-8 lg:p-10 shadow-[0_20px_50px_rgba(16,59,92,0.08)]">
          <p className="text-secondary text-xs font-semibold tracking-[0.25em] uppercase mb-3">
            Praxis-Verwaltung
          </p>
          <h1 className="text-2xl font-bold text-primary mb-2">Anmeldung</h1>
          <p className="text-sm text-on-surface-variant mb-8">
            Bitte geben Sie das Praxis-Passwort ein, um die Praxisinhalte zu
            verwalten.
          </p>
          <LoginForm />
        </div>
      </div>
    </section>
  );
}
