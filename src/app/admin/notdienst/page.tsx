import { requireAuth } from "@/lib/session";
import { getEmergencySettings } from "@/lib/emergency-settings";
import { AdminFrame } from "@/components/admin/AdminFrame";
import { EmergencySettingsForm } from "@/components/admin/ContentSettingsForms";

export const metadata = {
  title: "Notdienst verwalten",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminNotdienstPage() {
  await requireAuth();
  const emergency = await getEmergencySettings();

  return (
    <AdminFrame
      title="Notdienst"
      area="notdienst"
      intro="Notdienstplan und Hinweise für Patienten am Wochenende und an Feiertagen."
    >
      <div className="bg-card rounded-2xl p-4 sm:p-6 lg:p-9 shadow-[0_20px_50px_rgba(16,59,92,0.06)]">
        <EmergencySettingsForm initial={emergency} />
      </div>
    </AdminFrame>
  );
}
