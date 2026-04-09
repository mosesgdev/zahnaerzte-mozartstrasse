export interface TeamMember {
  name: string;
  role: string;
  description?: string;
  qualifications?: string[];
  image?: string;
}

export const dentists: TeamMember[] = [
  {
    name: "Boris Shuk",
    role: "Zahnarzt und Zahntechniker",
    description:
      "Praxisinhaber mit umfassender Erfahrung in ästhetischer Zahnheilkunde und Implantologie.",
    qualifications: [
      "Zahnmedizin-Studium in Hamburg: 2001–2006",
      "Zahntechniker-Ausbildung: 1988–1991",
      "Zahntechniker-Tätigkeit: 1991–2005",
      "Angestellter Zahnarzt in Hamburg und Reinfeld: 2006–2012",
      "Zertifikat Implantologie: 2010–2011",
      "Praxiseröffnung in Winsen: 2013",
    ],
  },
];

export const assistants: TeamMember[] = [
  {
    name: "Katrin Sellmer",
    role: "Zertifizierte Prophylaxe-Fachkraft, ZFA",
    description: "Spezialisiert auf professionelle Zahnreinigung und Prophylaxe.",
  },
  {
    name: "Isabell Gohr",
    role: "Praxismanagement, ZFA",
    description: "Verantwortlich für Praxisorganisation und -management.",
  },
  {
    name: "Sylvia Müller",
    role: "Zahnmedizinische Fachangestellte",
  },
  {
    name: "Ümran Avci",
    role: "Zahnmedizinische Fachangestellte",
  },
  {
    name: "Nicole Mrdan",
    role: "Zahnmedizinische Angestellte",
  },
];

export const teamIntro = {
  heading: "Wir stellen uns vor",
  subheading: "Unser Praxisteam auf einen Blick",
  text: "Das Praxisteam der Zahnärzte-Mozartstraße in Winsen freut sich, Sie kompetent behandeln und beraten zu dürfen.",
};
