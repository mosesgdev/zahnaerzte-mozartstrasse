"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { timingSafeEqual } from "node:crypto";
import { createSession, deleteSession, requireAuth } from "@/lib/session";
import {
  addVacation,
  deleteVacation,
  type ReplacementAssignment,
} from "@/lib/vacations";
import {
  addCustomVertretung,
  findVertretungById,
} from "@/lib/vertretungen";
import {
  setTeamSettings,
  type TeamSettings,
} from "@/lib/team-settings";
import {
  setGallerySettings,
  type GallerySettings,
} from "@/lib/gallery-settings";
import {
  setServiceSettings,
  type ServiceSettings,
} from "@/lib/service-settings";
import {
  setEmergencySettings,
  type EmergencySettings,
} from "@/lib/emergency-settings";

interface RowInput {
  vertretungId?: string;
  name?: string;
  phone?: string;
  address?: string;
  from?: string;
  to?: string;
}

function fmt(iso: string): string {
  const [y, m, d] = iso.split("-");
  return y && m && d ? `${d}.${m}.${y}` : iso;
}

export interface LoginState {
  error?: string;
}

export interface VacationFormState {
  error?: string;
  success?: boolean;
}

export interface SettingsFormState {
  error?: string;
  success?: boolean;
}

function passwordMatches(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (!expected) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");

  if (!passwordMatches(password)) {
    return { error: "Falsches Passwort." };
  }

  await createSession();
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await deleteSession();
  redirect("/admin/login");
}

export async function createVacationAction(
  _prev: VacationFormState,
  formData: FormData,
): Promise<VacationFormState> {
  await requireAuth();

  const start = String(formData.get("start") ?? "").trim();
  const end = String(formData.get("end") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();

  if (!start || !end) {
    return { error: "Bitte Start- und Enddatum angeben." };
  }
  if (end < start) {
    return { error: "Das Enddatum darf nicht vor dem Startdatum liegen." };
  }

  let rows: RowInput[];
  try {
    rows = JSON.parse(String(formData.get("rows") ?? "[]"));
  } catch {
    rows = [];
  }
  if (!Array.isArray(rows) || rows.length === 0) {
    return { error: "Bitte mindestens eine Vertretung angeben." };
  }

  const replacements: ReplacementAssignment[] = [];
  for (const row of rows) {
    const from = String(row.from ?? "").trim();
    const to = String(row.to ?? "").trim();
    if (!from || !to) {
      return { error: "Bitte für jede Vertretung Von- und Bis-Datum angeben." };
    }
    if (to < from) {
      return { error: "Bei einer Vertretung liegt das Bis-Datum vor dem Von-Datum." };
    }
    if (from < start || to > end) {
      return {
        error: `Vertretungs-Zeitraum (${fmt(from)}–${fmt(to)}) muss innerhalb der Schließzeit (${fmt(start)}–${fmt(end)}) liegen.`,
      };
    }

    const id = String(row.vertretungId ?? "").trim();
    let name: string;
    let phone: string | undefined;
    let address: string | undefined;

    if (id && id !== "andere") {
      const practice = await findVertretungById(id);
      if (!practice) {
        return { error: "Unbekannte Vertretung ausgewählt." };
      }
      name = practice.name;
      phone = practice.phone;
      address = practice.address;
    } else {
      const manualName = String(row.name ?? "").trim();
      if (!manualName) {
        return { error: "Bitte den Namen der manuellen Vertretung angeben." };
      }
      // Persist the manual practice so it becomes a reusable dropdown option.
      const saved = await addCustomVertretung({
        name: manualName,
        phone: String(row.phone ?? "").trim(),
        address: String(row.address ?? "").trim(),
      });
      name = saved.name;
      phone = saved.phone;
      address = saved.address;
    }

    replacements.push({
      name,
      phone: phone || undefined,
      address: address || undefined,
      from,
      to,
    });
  }

  await addVacation({ start, end, replacements, note });
  revalidatePath("/admin");
  revalidatePath("/admin/urlaubszeiten");
  revalidatePath("/urlaubszeiten");
  return { success: true };
}

export async function deleteVacationAction(formData: FormData): Promise<void> {
  await requireAuth();
  const id = String(formData.get("id") ?? "");
  if (id) {
    await deleteVacation(id);
    revalidatePath("/admin");
    revalidatePath("/admin/urlaubszeiten");
    revalidatePath("/urlaubszeiten");
  }
}

function parsePayload<T>(formData: FormData): T | undefined {
  try {
    return JSON.parse(String(formData.get("payload") ?? "")) as T;
  } catch {
    return undefined;
  }
}

function isAllowedAsset(value: string | undefined, kind: "image" | "document") {
  if (!value) return true;
  if (value.startsWith("/") || value.startsWith("https://")) return true;
  if (kind === "image" && value.startsWith("data:image/")) return true;
  if (kind === "document" && value.startsWith("data:application/pdf")) return true;
  return false;
}

export async function updateTeamSettingsAction(
  _prev: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  await requireAuth();
  const payload = parsePayload<TeamSettings>(formData);
  if (!payload) return { error: "Die Team-Daten konnten nicht gelesen werden." };
  if (!payload.members?.every((member) => isAllowedAsset(member.image, "image"))) {
    return { error: "Bitte nur Bilder oder sichere Bild-URLs verwenden." };
  }

  await setTeamSettings(payload);
  revalidatePath("/admin");
  revalidatePath("/admin/team");
  revalidatePath("/team");
  return { success: true };
}

export async function updateGallerySettingsAction(
  _prev: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  await requireAuth();
  const payload = parsePayload<GallerySettings>(formData);
  if (!payload) {
    return { error: "Die Galerie-Daten konnten nicht gelesen werden." };
  }
  if (!payload.images?.every((image) => isAllowedAsset(image.src, "image"))) {
    return { error: "Bitte nur Bilder oder sichere Bild-URLs verwenden." };
  }

  await setGallerySettings(payload);
  revalidatePath("/admin");
  revalidatePath("/admin/praxisgalerie");
  revalidatePath("/praxisgalerie");
  return { success: true };
}

export async function updateServiceSettingsAction(
  _prev: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  await requireAuth();
  const payload = parsePayload<ServiceSettings>(formData);
  if (!payload) {
    return { error: "Die Leistungs-Daten konnten nicht gelesen werden." };
  }
  if (!payload.services?.every((service) => isAllowedAsset(service.image, "image"))) {
    return { error: "Bitte nur Bilder oder sichere Bild-URLs verwenden." };
  }

  await setServiceSettings(payload);
  revalidatePath("/admin");
  revalidatePath("/admin/leistungen");
  revalidatePath("/leistungen");
  for (const service of payload.services ?? []) {
    if (service.slug) revalidatePath(`/leistungen/${service.slug}`);
  }
  return { success: true };
}

export async function updateEmergencySettingsAction(
  _prev: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  await requireAuth();
  const payload = parsePayload<EmergencySettings>(formData);
  if (!payload) {
    return { error: "Die Notdienst-Daten konnten nicht gelesen werden." };
  }
  if (!isAllowedAsset(payload.documentUrl, "document")) {
    return { error: "Bitte nur PDF-Dateien oder sichere Dokument-URLs verwenden." };
  }

  await setEmergencySettings(payload);
  revalidatePath("/admin");
  revalidatePath("/admin/notdienst");
  revalidatePath("/notdienst");
  return { success: true };
}
