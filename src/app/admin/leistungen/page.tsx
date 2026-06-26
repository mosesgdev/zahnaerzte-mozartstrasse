import { requireAuth } from "@/lib/session";
import { getServiceSettings } from "@/lib/service-settings";
import { AdminFrame } from "@/components/admin/AdminFrame";
import { ServiceSettingsForm } from "@/components/admin/ContentSettingsForms";

export const metadata = {
  title: "Leistungen verwalten",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLeistungenPage() {
  await requireAuth();
  const serviceSettings = await getServiceSettings();

  return (
    <AdminFrame title="Leistungen">
      <div className="bg-card rounded-2xl p-7 lg:p-9 shadow-[0_20px_50px_rgba(16,59,92,0.06)]">
        <ServiceSettingsForm initial={serviceSettings} />
      </div>
    </AdminFrame>
  );
}
