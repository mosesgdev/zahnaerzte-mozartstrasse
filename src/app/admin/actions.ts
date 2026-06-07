"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { timingSafeEqual } from "node:crypto";
import { createSession, deleteSession, requireAuth } from "@/lib/session";
import { addVacation, deleteVacation } from "@/lib/vacations";

export interface LoginState {
  error?: string;
}

export interface VacationFormState {
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
  const replacement = String(formData.get("replacement") ?? "").trim();
  const replacementPhone = String(formData.get("replacementPhone") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();

  if (!start || !end) {
    return { error: "Bitte Start- und Enddatum angeben." };
  }
  if (end < start) {
    return { error: "Das Enddatum darf nicht vor dem Startdatum liegen." };
  }
  if (!replacement) {
    return { error: "Bitte eine Vertretung angeben." };
  }

  await addVacation({ start, end, replacement, replacementPhone, note });
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteVacationAction(formData: FormData): Promise<void> {
  await requireAuth();
  const id = String(formData.get("id") ?? "");
  if (id) {
    await deleteVacation(id);
    revalidatePath("/admin");
  }
}
