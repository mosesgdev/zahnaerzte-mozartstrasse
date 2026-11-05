import { requireAuth } from "@/lib/session";
import { getGallerySettings } from "@/lib/gallery-settings";
import { AdminFrame } from "@/components/admin/AdminFrame";
import { GallerySettingsForm } from "@/components/admin/ContentSettingsForms";

export const metadata = {
  title: "Praxisgalerie verwalten",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPraxisgaleriePage() {
  await requireAuth();
  const gallery = await getGallerySettings();

  return (
    <AdminFrame
      title="Praxisgalerie"
      area="praxisgalerie"
      intro="Fotos hinzufügen, beschriften und mit den Pfeilen sortieren."
    >
      <div className="bg-card rounded-2xl p-4 sm:p-6 lg:p-9 shadow-[0_20px_50px_rgba(16,59,92,0.06)]">
        <GallerySettingsForm initial={gallery} />
      </div>
    </AdminFrame>
  );
}
