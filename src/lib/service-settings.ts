import "server-only";

import { services, servicesOverview, type Service } from "@content/services";
import { getJson, setJson } from "@/lib/kv";

export interface ServiceSettings {
  overview: typeof servicesOverview;
  services: Service[];
}

const KEY = "zm:service-settings";

const fallbackServiceSettings: ServiceSettings = {
  overview: servicesOverview,
  services,
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalize(settings: ServiceSettings): ServiceSettings {
  return {
    overview: {
      heading: settings.overview?.heading?.trim() || servicesOverview.heading,
      treatmentHeading:
        settings.overview?.treatmentHeading?.trim() ||
        servicesOverview.treatmentHeading,
      anxiousPatients:
        settings.overview?.anxiousPatients?.trim() ||
        servicesOverview.anxiousPatients,
      allServices: Array.isArray(settings.overview?.allServices)
        ? settings.overview.allServices.map((item) => item.trim()).filter(Boolean)
        : servicesOverview.allServices,
    },
    services: Array.isArray(settings.services)
      ? settings.services
          .filter((service) => service.title?.trim())
          .map((service) => {
            const title = service.title.trim();
            const slug = service.slug?.trim() || slugify(title);
            return {
              slug,
              title,
              pageTitle: service.pageTitle?.trim() || title,
              shortDescription: service.shortDescription?.trim() || "",
              image: service.image?.trim() || undefined,
              content: Array.isArray(service.content)
                ? service.content.map((p) => p.trim()).filter(Boolean)
                : [],
              bulletPoints: Array.isArray(service.bulletPoints)
                ? service.bulletPoints.map((p) => p.trim()).filter(Boolean)
                : [],
              underConstruction: Boolean(service.underConstruction),
            };
          })
      : fallbackServiceSettings.services,
  };
}

export async function getServiceSettings(): Promise<ServiceSettings> {
  const settings = await getJson<ServiceSettings>(KEY, fallbackServiceSettings);
  return normalize(settings);
}

export async function setServiceSettings(settings: ServiceSettings): Promise<void> {
  await setJson(KEY, normalize(settings));
}

