import { NextResponse } from "next/server";
import { syncEmergencySettingsFromSource } from "@/lib/emergency-sync";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");
  if (secret) return authorization === `Bearer ${secret}`;

  return request.headers
    .get("user-agent")
    ?.toLowerCase()
    .includes("vercel-cron") ?? false;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await syncEmergencySettingsFromSource();
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error("[notdienst-cron]", error);
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Notdienst sync failed.",
      },
      { status: 500 },
    );
  }
}
