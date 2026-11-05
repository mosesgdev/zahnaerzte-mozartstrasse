import "server-only";

import { services, servicesOverview, type Service } from "@content/services";
import { getJson, setJson } from "@/lib/kv";
import { normalizeText, slugify, splitParagraphs } from "@/lib/text";

export interface ServiceSettings {
  overview: typeof servicesOverview;
  services: Service[];
}

const KEY = "zm:service-settings";

const fallbackServiceSettings: ServiceSettings = {
  overview: servicesOverview,
  services,
};

/**
 * Data saved before `menuLabel` existed has no such field. In that case keep
 * the short menu name from content/services.ts as long as the title is still
 * the original one; after a rename the menu follows the new title.
 */
function legacyMenuLabel(slug: string, title: string): string {
  const original = services.find((service) => service.slug === slug);
  return original && original.title === title ? (original.menuLabel ?? "") : "";
}

function normalize(settings: ServiceSettings): ServiceSettings {
  const normalized = Array.isArray(settings.services)
    ? settings.services
        .filter((service) => service.title?.trim())
        .map((service) => {
          const title = service.title.trim();
          const slug = slugify(service.slug?.trim() || "") || slugify(title);
          return {
            slug,
            title,
            menuLabel:
              typeof service.menuLabel === "string"
                ? service.menuLabel.trim()
                : legacyMenuLabel(slug, title),
            pageTitle: service.pageTitle?.trim() || title,
            shortDescription: normalizeText(service.shortDescription),
            image: service.image?.trim() || undefined,
            content: Array.isArray(service.content)
              ? service.content.flatMap(splitParagraphs)
              : [],
            bulletPoints: Array.isArray(service.bulletPoints)
              ? service.bulletPoints.map((p) => p.trim()).filter(Boolean)
              : [],
            underConstruction: Boolean(service.underConstruction),
            previousSlugs: Array.isArray(service.previousSlugs)
              ? [...new Set(service.previousSlugs.map(slugify).filter(Boolean))]
              : [],
          };
        })
    : fallbackServiceSettings.services;

  // A former slug must never shadow a live page.
  const liveSlugs = new Set(normalized.map((service) => service.slug));
  for (const service of normalized) {
    service.previousSlugs = (service.previousSlugs ?? []).filter(
      (slug) => !liveSlugs.has(slug),
    );
  }

  return {
    overview: {
      heading: settings.overview?.heading?.trim() || servicesOverview.heading,
      treatmentHeading:
        settings.overview?.treatmentHeading?.trim() ||
        servicesOverview.treatmentHeading,
      anxiousPatients:
        normalizeText(settings.overview?.anxiousPatients) ||
        servicesOverview.anxiousPatients,
      allServices: Array.isArray(settings.overview?.allServices)
        ? settings.overview.allServices.map((item) => item.trim()).filter(Boolean)
        : servicesOverview.allServices,
    },
    services: normalized,
  };
}

/** Name shown in menus: the optional short menu name, else the title. */
export function serviceMenuLabel(service: Service): string {
  return service.menuLabel?.trim() || service.title;
}

export async function getServiceSettings(): Promise<ServiceSettings> {
  const settings = await getJson<ServiceSettings>(KEY, fallbackServiceSettings);
  return normalize(settings);
}

export async function setServiceSettings(settings: ServiceSettings): Promise<void> {
  await setJson(KEY, normalize(settings));
}
