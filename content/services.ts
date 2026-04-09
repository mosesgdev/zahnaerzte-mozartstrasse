export interface Service {
  slug: string;
  title: string;
  pageTitle: string;
  shortDescription: string;
  content: string[];
  bulletPoints?: string[];
  underConstruction?: boolean;
}

export const services: Service[] = [
  {
    slug: "prophylaxe",
    title: "Prophylaxe",
    pageTitle: "Professionelle Zahnreinigung – aber richtig",
    shortDescription:
      "Regelmäßige professionelle Zahnreinigung für lebenslang gesunde Zähne.",
    content: [
      "Langzeitstudien zeigen: Nur mit regelmäßiger professioneller Zahnreinigung können Zähne ein Leben lang erhalten werden.",
      "Unsere zertifizierte Prophylaxe-Fachkraft Katrin Sellmer betreut Sie mit modernsten Instrumenten und individueller Beratung.",
    ],
    bulletPoints: [
      "Medizinische Zahnreinigung mit Bakterienentfernung",
      "Zahnpolitur und Aufhellung von Oberflächenverfärbungen",
      "Zertifizierte Prophylaxe-Fachkraft",
      "Kostenloses Recall-Programm",
      "Kinderprophylaxe",
    ],
  },
  {
    slug: "parodontitis",
    title: "Parodontitis-Behandlung",
    pageTitle:
      "Parodontitis, eine schleichende Entzündung, die oft zu spät erkannt wird",
    shortDescription:
      "Umfassende Behandlung von Zahnfleisch- und Zahnbetterkrankungen.",
    content: [
      "Parodontitis ist eine entzündliche Erkrankung des Zahnfleischs und des Zahnhalteapparats. Erste Symptome sind Rötung und Schwellung, fortschreitender Knochenabbau kann zum Zahnverlust führen.",
    ],
    bulletPoints: [
      "Zahnfleisch- und Kieferuntersuchung mit Taschenmessung",
      "Ultraschall-Wurzeloberflächenreinigung (Scaling)",
      "Chirurgische Parodontitis-Therapie",
      "Bakterientests und Antibiotikabehandlung",
      "Mukogingivale Chirurgie",
      "Lasergestützte Therapie zur Bakterienreduktion",
    ],
  },
  {
    slug: "aesthetische-zahnheilkunde",
    title: "Ästhetische Zahnheilkunde",
    pageTitle: "Ästhetik – mit verschiedenen Füllungsmaterialien",
    shortDescription:
      "Zahnfarbene Füllungen und ästhetische Restaurationen für ein natürliches Lächeln.",
    content: [
      "Karies verursacht irreversible Zahnschäden, die professionell behandelt werden müssen. Das Loch kann dann gefüllt werden, wobei die beliebtesten Füllungen zahnfarbene Füllungen sind.",
      "Zementfüllungen bieten ca. 3 Jahre Haltbarkeit mit Glasionomer-Eigenschaften. Kompositfüllungen sind lichtpolymerisierte Kunststofffüllungen, die als Amalgam-Alternative geeignet sind.",
    ],
  },
  {
    slug: "vollkeramik",
    title: "Vollkeramische Restaurationen",
    pageTitle: "Keramik – Ästhetik in Perfektion",
    shortDescription:
      "Vollkeramische Inlays, Kronen und Brücken für perfekte Ästhetik.",
    content: [
      "Die Verwendung von vollkeramischen Inlays, Kronen und Brücken in unserer Zahnarztpraxis ist ein wesentlicher Bestandteil der modernen ästhetischen Zahnmedizin.",
    ],
  },
  {
    slug: "laser",
    title: "Laserbehandlung",
    pageTitle: "Laser – moderne Technik mit sanfter Wirkung",
    shortDescription:
      "Diodenlaser als schonende Behandlungsalternative für schmerzfreie Therapie.",
    content: [
      "Unsere Diodenlaser-Behandlungen bieten eine schonende Behandlungsalternative mit den Vorteilen der Schmerzfreiheit und Heilungsbeschleunigung.",
    ],
    bulletPoints: [
      "Parodontologie: Gewebeentfernung, Bakterienreduktion",
      "Endodontie: Keimreduktion in Wurzelkanälen",
      "Chirurgie: Blutungsarme Eingriffe, Lippenbändchenentfernung",
      "Implantologie: Bakterienreduktion, Entzündungsbehandlung",
      "Desensibilisierung bei Zahnüberempfindlichkeit",
      "Zahnaufhellung, Schmerztherapie, Herpesbehandlung, Würgreizunterdrückung",
    ],
  },
  {
    slug: "zahnersatz",
    title: "Hochwertiger Zahnersatz",
    pageTitle: "Hochwertiger Zahnersatz – langlebig und elegant",
    shortDescription:
      "Moderner Zahnersatz mit zeitgemäßen Materialien und Methoden.",
    content: [
      "Moderner Zahnersatz mit zeitgemäßen Materialien und Methoden. Der Fokus liegt auf ästhetischer Qualität kombiniert mit Funktion.",
      "Wir bieten individualisierte Lösungen statt teurer Standardversorgung. Festsitzender Zahnersatz durch Implantattechnik, wenn möglich. Knochenerhalt und professionelle Verankerungstechniken für herausnehmbaren Zahnersatz.",
    ],
    bulletPoints: [
      "Herausnehmbarer Zahnersatz",
      "Teilprothesen und Totalprothesen",
      "Festsitzender Zahnersatz durch Implantattechnik",
      "Knochenerhaltende Strategien",
    ],
  },
  {
    slug: "implantate",
    title: "Implantate",
    pageTitle: "Implantate",
    shortDescription:
      "Künstliche Zahnwurzeln aus Titan für stabilen, natürlichen Zahnersatz.",
    content: [
      "Implantate sind künstliche Zahnwurzeln, meist aus Titan, die dort eingesetzt werden, wo Zähne fehlen.",
    ],
    bulletPoints: [
      "Stabiler Halt für Kronen, Brücken und Prothesen",
      "Wiederherstellung der Kaufunktion",
      "Natürlicheres Gefühl als konventioneller Zahnersatz",
      "Vorbeugung von Knochenschwund",
    ],
  },
  {
    slug: "kinderzahnheilkunde",
    title: "Kinderzahnheilkunde",
    pageTitle: "Kinder sind keine kleinen Erwachsenen...",
    shortDescription:
      "Einfühlsame Zahnbehandlung für unsere jüngsten Patienten.",
    content: [
      "Kindgerechte Zahnbehandlung in entspannter Atmosphäre. Wir nehmen uns die Zeit, die Ihr Kind braucht.",
    ],
    underConstruction: true,
  },
  {
    slug: "wurzelkanal",
    title: "Wurzelkanal-Behandlung",
    pageTitle: "Lasergestützte Endodontie",
    shortDescription:
      "Moderne Wurzelkanalbehandlung mit lasergestützter Technik.",
    content: [
      "Modernste Endodontie mit lasergestützter Keimreduktion für bestmögliche Behandlungsergebnisse.",
    ],
    underConstruction: true,
  },
  {
    slug: "specials",
    title: "Specials",
    pageTitle: "Specials",
    shortDescription:
      "Sportschutzschienen, Knirscherschienen, Zahnaufhellung und mehr.",
    content: [
      "Spezielle zahnärztliche Leistungen für individuelle Bedürfnisse. Sprechen Sie uns bei Ihrem nächsten Besuch gerne an.",
    ],
    bulletPoints: [
      "Individuelle Sportschutzschienen",
      "Knirscherschienen",
      "Zahnaufhellung (Bleaching)",
      "Softlaser-Behandlungen",
    ],
  },
];

export const servicesOverview = {
  heading: "Unsere Leistungen im Überblick",
  treatmentHeading: "Unser Behandlungsspektrum",
  anxiousPatients:
    "Angstpatienten sind selbstverständlich herzlich willkommen in unserer Praxis. Wir geben Ihnen die Zeit, die Sie brauchen, um sich bei uns wohl zu fühlen.",
  allServices: [
    "Implantate",
    "Hochwertiger Zahnersatz",
    "Parodontitis-Behandlung",
    "Wurzelkanaltherapie",
    "Vollkeramische Restaurationen",
    "Ästhetische Zahnheilkunde",
    "Laserbehandlungen",
    "Zahnaufhellung",
    "Prophylaxe für Erwachsene und Kinder",
    "Aufbissschienen",
    "Sportschutzschienen",
    "Amalgamfreie Materialien",
    "Seniorenheim-Betreuung",
    "Barrierefreiheit",
  ],
};
