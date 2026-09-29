import { z } from "zod";
import { uploadPropertyImage } from "./infrai_image_client.ts";

export const propertyUploadSchema = z.object({
  image: z.string().min(1),
  filename: z.string().min(1),
  caption: z.string().min(1),
  requestType: z.enum(["maintenance", "tenant-document", "inspection-reminder"])
});

export type PropertyUpload = z.infer<typeof propertyUploadSchema>;
export type ScreeningResult = { status: "approved" | "needs_review"; reason: string; imageId?: string };

const sensitiveWords = /password|social security|bank account|credit card/i;

export function screenCaption(input: PropertyUpload): ScreeningResult {
  if (sensitiveWords.test(input.caption)) return { status: "needs_review", reason: "Caption asks for sensitive personal information" };
  if (input.requestType === "tenant-document" && !/document|lease|proof|id/i.test(input.caption)) {
    return { status: "needs_review", reason: "Tenant documents need a clear document caption" };
  }
  return { status: "approved", reason: "Caption matches the property workflow" };
}

export async function publishPropertyUpload(raw: unknown): Promise<ScreeningResult> {
  const input = propertyUploadSchema.parse(raw);
  const decision = screenCaption(input);
  if (decision.status === "needs_review") return decision;
  const uploaded = await uploadPropertyImage(input.image, input.filename);
  return { ...decision, imageId: uploaded.id };
}

if (process.argv[1]?.endsWith("property_upload_service.ts")) {
  const body = process.env.PROPERTY_UPLOAD_JSON;
  if (!body) { console.error("Set PROPERTY_UPLOAD_JSON to a JSON request body"); process.exit(1); }
  publishPropertyUpload(JSON.parse(body)).then((result) => console.log(JSON.stringify(result))).catch((error) => { console.error(error.message); process.exit(1); });
}
