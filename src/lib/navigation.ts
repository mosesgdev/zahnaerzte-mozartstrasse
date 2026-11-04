import "server-only";

import { navigation, type NavItem } from "@content/pages";
import { getServiceSettings, serviceMenuLabel } from "@/lib/service-settings";

/** Main navigation with the service submenu built from the editable services. */
export async function getMainNavigation(): Promise<NavItem[]> {
  const { services } = await getServiceSettings();
  const serviceLinks = services.map((service) => ({
    label: serviceMenuLabel(service),
    href: `/leistungen/${service.slug}`,
  }));

  return navigation.main.map((item) =>
    item.href === "/leistungen" ? { ...item, children: serviceLinks } : item,
  );
}
