import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/session";
import { saveUpload } from "@/lib/uploads";
import { parseEmergencyPdfBytes } from "@/lib/emergency-sync";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_DOCUMENT_BYTES = 8 * 1024 * 1024;

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const kind = String(formData.get("kind") ?? "");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Keine Datei erhalten." }, { status: 400 });
  }

  const isImage = kind === "image" && file.type.startsWith("image/");
  const isDocument = kind === "document" && file.type === "application/pdf";
  if (!isImage && !isDocument) {
    return NextResponse.json({ error: "Dateityp nicht erlaubt." }, { status: 400 });
  }

  const maxBytes = isImage ? MAX_IMAGE_BYTES : MAX_DOCUMENT_BYTES;
  if (file.size > maxBytes) {
    return NextResponse.json({ error: "Datei ist zu groß." }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const upload = await saveUpload({
    name: file.name,
    mimeType: file.type,
    data: bytes.toString("base64"),
  });

  let parsed: Awaited<ReturnType<typeof parseEmergencyPdfBytes>> | undefined;
  if (isDocument) {
    parsed = await parseEmergencyPdfBytes(bytes);
  }

  return NextResponse.json({
    url: `/uploads/admin/${upload.id}`,
    name: file.name,
    parsed,
  });
}
