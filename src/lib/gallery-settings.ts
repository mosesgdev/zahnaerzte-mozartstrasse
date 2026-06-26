import "server-only";

import { getJson, setJson } from "@/lib/kv";

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  title: string;
  copy?: string;
}

export interface GallerySettings {
  images: GalleryImage[];
}

const KEY = "zm:gallery-settings";

const fallbackGallerySettings: GallerySettings = {
  images: [
    {
      id: "eingang",
      src: "/images/gallery/eingang.jpeg",
      alt: "Eingangsbereich der Zahnarztpraxis",
      title: "Eingangsbereich",
    },
    {
      id: "wartezimmer",
      src: "/images/gallery/wartezimmer.jpeg",
      alt: "Wartezimmer",
      title: "Wartezimmer",
    },
    {
      id: "behandlung-1",
      src: "/images/gallery/behandlung-1.jpg",
      alt: "Behandlungsraum",
      title: "Behandlungsraum",
    },
    {
      id: "behandlung-2",
      src: "/images/gallery/behandlung-2.jpg",
      alt: "Behandlungsraum mit moderner Ausstattung",
      title: "Moderne Ausstattung",
    },
    {
      id: "roentgen",
      src: "/images/gallery/roentgen.jpeg",
      alt: "Digitale Röntgentechnik",
      title: "Digitales Röntgen",
    },
    {
      id: "ausstattung",
      src: "/images/gallery/ausstattung.png",
      alt: "Praxisausstattung",
      title: "Praxisausstattung",
    },
  ],
};

function normalize(settings: GallerySettings): GallerySettings {
  return {
    images: Array.isArray(settings.images)
      ? settings.images
          .filter((image) => image.src?.trim() && image.title?.trim())
          .map((image) => ({
            id: image.id || crypto.randomUUID(),
            src: image.src.trim(),
            alt: image.alt?.trim() || image.title.trim(),
            title: image.title.trim(),
            copy: image.copy?.trim() || undefined,
          }))
      : fallbackGallerySettings.images,
  };
}

export async function getGallerySettings(): Promise<GallerySettings> {
  const settings = await getJson<GallerySettings>(KEY, fallbackGallerySettings);
  return normalize(settings);
}

export async function setGallerySettings(settings: GallerySettings): Promise<void> {
  await setJson(KEY, normalize(settings));
}

