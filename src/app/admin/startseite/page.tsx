import { requireAuth } from "@/lib/session";
import { getSiteSettings } from "@/lib/site-settings";
import { AdminFrame } from "@/components/admin/AdminFrame";
import { SiteSettingsForm } from "@/components/admin/ContentSettingsForms";

export const metadata = {
  title: "Startseite & Sprechzeiten",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminStartseitePage() {
  await requireAuth();
  const site = await getSiteSettings();

  return (
    <AdminFrame
      title="Startseite & Sprechzeiten"
      area="startseite"
      intro="Hier ändern Sie die Sprechzeiten und den Hinweis für Patienten oben auf der Startseite."
    >
      <div className="bg-card rounded-2xl p-4 sm:p-6 lg:p-9 shadow-[0_20px_50px_rgba(16,59,92,0.06)]">
        <SiteSettingsForm initial={site} />
      </div>
    </AdminFrame>
  );
}
