import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = "zm_admin_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET is not set");
  }
  return new TextEncoder().encode(secret);
}

interface SessionPayload {
  /** Subject — the single admin user. */
  sub: "boris";
  [key: string]: unknown;
}

async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getKey());
}

async function decrypt(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getKey(), {
      algorithms: ["HS256"],
    });
    return payload as SessionPayload;
  } catch {
    return null;
  }
}

/** Create the admin session cookie. Call only from a Server Action. */
export async function createSession(): Promise<void> {
  const token = await encrypt({ sub: "boris" });
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

/** Remove the admin session cookie. Call only from a Server Action. */
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/** Returns true if the current request carries a valid admin session. */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = await decrypt(cookieStore.get(COOKIE_NAME)?.value);
  return session?.sub === "boris";
}

/**
 * Data Access Layer guard. Redirects to the login page if the request is
 * not authenticated. Use at the top of protected pages and every mutating
 * Server Action — this is the real security boundary.
 */
export async function requireAuth(): Promise<void> {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }
}
