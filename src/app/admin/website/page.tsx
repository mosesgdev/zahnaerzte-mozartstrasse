import { requireAuth } from "@/lib/session";
import { getSiteSettings } from "@/lib/site-settings";
import { AdminFrame } from "@/components/admin/AdminFrame";
import { SiteSettingsForm } from "@/components/admin/ContentSettingsForms";

export const metadata = {
  title: "Website-Modus verwalten",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminWebsitePage() {
  await requireAuth();
  const siteSettings = await getSiteSettings();

  return (
    <AdminFrame title="Website-Modus">
      <div className="bg-card rounded-2xl p-7 lg:p-9 shadow-[0_20px_50px_rgba(16,59,92,0.06)]">
        <SiteSettingsForm initial={siteSettings} />
      </div>
    </AdminFrame>
  );
}
