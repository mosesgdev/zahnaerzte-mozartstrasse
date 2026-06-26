import { requireAuth } from "@/lib/session";
import { getTeamSettings } from "@/lib/team-settings";
import { AdminFrame } from "@/components/admin/AdminFrame";
import { TeamSettingsForm } from "@/components/admin/ContentSettingsForms";

export const metadata = {
  title: "Team verwalten",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminTeamPage() {
  await requireAuth();
  const team = await getTeamSettings();

  return (
    <AdminFrame title="Team">
      <div className="bg-card rounded-2xl p-7 lg:p-9 shadow-[0_20px_50px_rgba(16,59,92,0.06)]">
        <TeamSettingsForm initial={team} />
      </div>
    </AdminFrame>
  );
}
