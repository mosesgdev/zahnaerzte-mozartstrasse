export const siteData = {
  practice: {
    name: "Praxis für ästhetische Zahnheilkunde Boris Shuk",
    shortName: "Zahnärzte Mozartstraße",
    owner: "Boris Shuk",
    title: "Zahnarzt und Zahntechniker",
    address: {
      street: "Mozartstraße 10",
      zip: "21423",
      city: "Winsen (Luhe)",
      country: "Deutschland",
    },
    phone: "04171/62 666",
    fax: "04171/64894",
    email: "info@zahnaerzte-mozartstrasse.de",
    website: "https://www.zahnaerzte-mozartstrasse.de",
  },

  credentials: {
    approbation: "2006, Universitätsklinikum Hamburg-Eppendorf",
    chamber: "Zahnärztekammer Niedersachsen",
    kzv: "Kassenzahnärztliche Vereinigung Niedersachsen",
    dataProtectionAuthority:
      "Landesbeauftragte für den Datenschutz Niedersachsen",
  },

  openingHours: [
    { day: "Montag", hours: "8:00 – 18:00", break: "12:00 – 13:00" },
    { day: "Dienstag", hours: "8:00 – 18:00", break: "12:00 – 13:00" },
    { day: "Mittwoch", hours: "8:00 – 13:00", break: null },
    { day: "Donnerstag", hours: "8:00 – 19:00", break: "12:00 – 13:00" },
    { day: "Freitag", hours: "8:00 – 13:00", break: null },
  ],

  images: {
    logo: "/images/logo.png",
    emotionHeader: "/images/emotionheader.jpg",
    originals: {
      logo: "https://www.zahnaerzte-mozartstrasse.de/s/misc/logo.png?t=1774580780",
      emotionHeader:
        "https://www.zahnaerzte-mozartstrasse.de/s/img/emotionheader.jpg",
      leistungen:
        "https://www.zahnaerzte-mozartstrasse.de/s/cc_images/cache_16768748.jpg",
      prophylaxe:
        "https://www.zahnaerzte-mozartstrasse.de/s/cc_images/cache_16769077.JPG",
      implantate:
        "https://www.zahnaerzte-mozartstrasse.de/s/cc_images/cache_7288401.jpg",
    },
  },

  seo: {
    defaultTitle: "Zahnarztpraxis Boris Shuk | Winsen (Luhe)",
    defaultDescription:
      "Ihre Zahnarztpraxis für ästhetische Zahnheilkunde in Winsen (Luhe). Implantologie, Prophylaxe, Vollkeramik, Laserbehandlung und mehr. Boris Shuk - Zahnarzt und Zahntechniker.",
    locale: "de_DE",
    type: "website",
  },
} as const;
