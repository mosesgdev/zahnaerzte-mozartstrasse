import { getUpload } from "@/lib/uploads";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const upload = await getUpload(id);

  if (!upload) {
    return new Response("Not found", { status: 404 });
  }

  const bytes = Buffer.from(upload.data, "base64");
  return new Response(bytes, {
    headers: {
      "Content-Type": upload.mimeType,
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Disposition": `inline; filename="${upload.name.replace(/"/g, "")}"`,
    },
  });
}
