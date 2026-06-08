export interface Vertretung {
  id: string;
  name: string;
  phone: string;
  address: string;
}

/**
 * Bekannte Vertretungspraxen für die Auswahl im Admin-Backend.
 * Können hier ergänzt/geändert werden; das Dropdown bezieht sich darauf.
 */
export const vertretungen: Vertretung[] = [
  {
    id: "wussow",
    name: "Zahnarztpraxis Wussow",
    phone: "04171/2917",
    address: "Eckermannstraße 8, 21423 Winsen",
  },
  {
    id: "muender",
    name: "Zahnarztpraxis Münder",
    phone: "04171/880920",
    address: "Marktstraße 4, 21423 Winsen",
  },
  {
    id: "hartmann",
    name: "Zahnarztpraxis Hartmann",
    phone: "04171/88770",
    address: "Bahnhofstraße 2, 21423 Winsen",
  },
  {
    id: "christiansen",
    name: "Dr. Christiansen",
    phone: "04105/4088043",
    address: "Fleestedter Ring 3, 21217 Seevetal",
  },
  {
    id: "thiede-bartels",
    name: "Zahnarztpraxis Thiede-Bartels",
    phone: "04174/689145",
    address: "Hagenhoop 1, 21435 Stelle",
  },
];

export function findVertretung(id: string): Vertretung | undefined {
  return vertretungen.find((v) => v.id === id);
}
