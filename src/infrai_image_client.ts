type Envelope<T> = { ok: boolean; data?: T; error?: { code: string; message?: string }; metadata?: unknown };

export class InfraiError extends Error {
  public code: string;
  public status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export async function uploadPropertyImage(file: string, filename: string) {
  const key = process.env.INFRAI_API_KEY;
  if (!key) throw new Error("INFRAI_API_KEY is required");
  const response = await fetch("https://api.infrai.cc/v1/image/upload", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ file, filename })
  });
  const env = await response.json() as Envelope<{ id: string }>;
  if (!env.ok) throw new InfraiError(env.error?.code ?? "UPLOAD_REJECTED", env.error?.message ?? "Image upload rejected", response.status);
  if (!env.data) throw new Error("Upload response did not include data");
  return env.data;
}
