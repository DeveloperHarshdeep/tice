import { requireAdmin } from "@/lib/auth";
import { adminAuthErrorResponse, jsonError, jsonSuccess } from "@/lib/api-response";
import {
  assertCloudinaryConfigured,
  uploadBuffer,
  validateUploadFile,
} from "@/lib/cloudinary";
import { verifySameOrigin } from "@/lib/rate-limit";

export async function POST(request) {
  if (!verifySameOrigin(request)) {
    return jsonError("Invalid request origin.", 403);
  }

  const { error } = await requireAdmin(request);
  if (error) return adminAuthErrorResponse(error);

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return jsonError("Invalid form data.", 400);
  }

  const file = formData.get("file");
  const folder = formData.get("folder") || "talent-institute";
  const validation = validateUploadFile(file);
  if (!validation.ok) return jsonError(validation.message, 400);

  try {
    assertCloudinaryConfigured();
    const buffer = Buffer.from(await file.arrayBuffer());
    const resourceType = file.type === "application/pdf" ? "raw" : "image";
    const result = await uploadBuffer(buffer, {
      folder: String(folder),
      resourceType,
      uploadOptions: {
        resource_type: resourceType,
      },
    });

    return jsonSuccess({
      url: result.secure_url,
      publicId: result.public_id,
      resourceType,
    });
  } catch (err) {
    console.error("Upload error:", err.message);
    const message =
      err.message?.includes("Cloudinary") ?
        err.message
      : "Upload failed. Check Cloudinary configuration.";
    return jsonError(message, 500);
  }
}
