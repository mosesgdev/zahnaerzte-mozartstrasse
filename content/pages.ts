export interface PageData {
  slug: string;
  title: string;
  heading: string;
  metaDescription?: string;
  content: string[];
  bulletPoints?: string[];
}

export const pages: Record<string, PageData> = {
  home: {
    slug: "/",
    title: "Ihre Zahnärzte in Winsen",
    heading: "Ihre Zahnärzte in Winsen!",
    metaDescription:
      "Zahnarztpraxis für ästhetische Zahnheilkunde in Winsen (Luhe). Implantologie, Prophylaxe, Vollkeramik, Laser. Boris Shuk - Zahnarzt und Zahntechniker.",
    content: [
      "Moderne Zahnarztpraxis mit umfassendem Angebot in ästhetischer Zahnheilkunde.",
      "Schwerpunkte: Implantologie, Prophylaxe, Kinderzahnheilkunde, Vollkeramik, Lasertherapie und Zahnaufhellung.",
      "Individuelle Behandlungspläne und evidenzbasierte Versorgung.",
    ],
  },

  gallery: {
    slug: "/praxisgalerie",
    title: "Praxisgalerie",
    heading: "Gesunde Zähne für ein gesundes Lächeln",
    metaDescription:
      "Einblicke in unsere moderne Zahnarztpraxis in Winsen (Luhe). Digitale Röntgentechnik, Intraoralkamera, Diodenlaser.",
    content: [
      "Zahnbehandlung ist Präzisionsarbeit. Sie erfordert Einfühlungsvermögen, Qualifikation und technisches Geschick.",
      "Qualität ist das Resultat gewissenhafter und geschickter Handlungsweise.",
      "Moderne Diagnostik: digitale und somit strahlungsarme Röntgentechnik, Intraoralkamera, Diodenlaser, Softlaser, Vollkeramik.",
    ],
  },

  information: {
    slug: "/information",
    title: "Wissenswertes von A bis Z",
    heading: "Wissenswertes von A bis Z",
    metaDescription:
      "Wichtige Informationen für Ihren Besuch in der Zahnarztpraxis Boris Shuk in Winsen (Luhe).",
    content: [
      "Bitte bringen Sie Ihre Versichertenkarte zu jedem Termin mit.",
      "Prophylaxe: Mindestens einmal im Jahr empfohlen, bei empfindlichen Zähnen halbjährlich.",
      "Vereinbaren Sie nach jedem Besuch direkt Ihren nächsten Termin.",
    ],
  },

  service: {
    slug: "/service",
    title: "Service",
    heading: "Service",
    metaDescription:
      "Barrierefreier Zugang, Parkplätze und besondere Services in der Zahnarztpraxis Boris Shuk, Winsen (Luhe).",
    content: [
      "Bitte teilen Sie uns bei der Terminvereinbarung mit, welche Unterstützung Sie benötigen.",
      "Rollstuhlgerechter Eingang mit sanfter Rampe direkt in die Praxis.",
      "Größerer Wickeltisch (Tragfähigkeit bis 30 kg) im barrierefreien Bad.",
      "Zwei Parkplätze direkt vor der Praxis.",
    ],
  },

  directions: {
    slug: "/anfahrt",
    title: "Anfahrt",
    heading: "Ihr Weg zu uns",
    metaDescription:
      "Anfahrt zur Zahnarztpraxis Boris Shuk, Mozartstraße 10, 21423 Winsen (Luhe). Google Maps, Parkplätze vor der Tür.",
    content: [
      "Sie finden uns in der Mozartstraße 10, 21423 Winsen (Luhe).",
      "Zwei Parkplätze stehen direkt vor der Praxis zur Verfügung.",
    ],
  },

  contact: {
    slug: "/kontakt",
    title: "Kontakt",
    heading: "Unsere Kontaktdaten",
    metaDescription:
      "Kontaktieren Sie die Zahnarztpraxis Boris Shuk in Winsen (Luhe). Telefon: 04171/62 666, E-Mail: info@zahnaerzte-mozartstrasse.de",
    content: [
      "Rufen Sie uns an unter 04171/62 666 oder nutzen Sie unser Kontaktformular.",
      "Online-Terminvereinbarung möglich.",
    ],
  },

  jobs: {
    slug: "/jobs",
    title: "Aktuelle Stellenangebote",
    heading: "Aktuelle Stellenangebote",
    metaDescription:
      "Stellenangebote der Zahnarztpraxis Boris Shuk in Winsen (Luhe). Initiativbewerbungen willkommen.",
    content: [
      "Momentan bieten wir keine freie Stelle an.",
      "Gerne können Sie uns jedoch jederzeit eine Initiativbewerbung zukommen lassen.",
    ],
  },

  impressum: {
    slug: "/impressum",
    title: "Impressum und Datenschutz",
    heading: "Impressum und Datenschutz",
    content: [
      "Angaben gemäß § 5 TMG:",
      "Boris Shuk – Zahnarzt und Zahntechniker",
      "Mozartstraße 10, 21423 Winsen (Luhe)",
      "Telefon: 04171/62 666, Fax: 04171/64894",
      "E-Mail: info@zahnaerzte-mozartstrasse.de",
      "Approbation: 2006, Universitätsklinikum Hamburg-Eppendorf",
      "Zuständige Aufsichtsbehörde: Zahnärztekammer Niedersachsen",
      "Kassenzahnärztliche Vereinigung Niedersachsen",
    ],
  },

  links: {
    slug: "/links",
    title: "Links",
    heading: "Links",
    content: [
      "Kooperationspartner: VMH Hamburg (http://www.vmh-hamburg.de/)",
    ],
  },
};

export const navigation = {
  main: [
    { label: "Startseite", href: "/" },
    { label: "Praxisgalerie", href: "/praxisgalerie" },
    { label: "Team", href: "/team" },
    { label: "Information", href: "/information" },
    {
      label: "Leistungen",
      href: "/leistungen",
      children: [
        { label: "Prophylaxe", href: "/leistungen/prophylaxe" },
        { label: "Parodontitis", href: "/leistungen/parodontitis" },
        {
          label: "Ästhetische Zahnheilkunde",
          href: "/leistungen/aesthetische-zahnheilkunde",
        },
        { label: "Vollkeramik", href: "/leistungen/vollkeramik" },
        { label: "Laserbehandlung", href: "/leistungen/laser" },
        { label: "Zahnersatz", href: "/leistungen/zahnersatz" },
        { label: "Implantate", href: "/leistungen/implantate" },
        {
          label: "Kinderzahnheilkunde",
          href: "/leistungen/kinderzahnheilkunde",
        },
        { label: "Wurzelkanal", href: "/leistungen/wurzelkanal" },
        { label: "Specials", href: "/leistungen/specials" },
      ],
    },
    { label: "Service", href: "/service" },
    { label: "Anfahrt", href: "/anfahrt" },
    { label: "Kontakt", href: "/kontakt" },
  ],
  footer: [
    { label: "Impressum & Datenschutz", href: "/impressum" },
    { label: "Jobs", href: "/jobs" },
    { label: "Kontakt", href: "/kontakt" },
  ],
};
