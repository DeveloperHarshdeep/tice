import { v2 as cloudinary } from "cloudinary";

let configured = false;

export function assertCloudinaryConfigured() {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
    process.env;

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
    );
  }

  if (!configured) {
    cloudinary.config({
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
      secure: true,
    });
    configured = true;
  }

  return cloudinary;
}

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);

const MAX_BYTES = 5 * 1024 * 1024;

export function validateUploadFile(file) {
  if (!file || typeof file === "string") {
    return { ok: false, message: "No file provided." };
  }
  if (!ALLOWED_MIME.has(file.type)) {
    return {
      ok: false,
      message: "Invalid file type. Allowed: JPEG, PNG, WebP, PDF.",
    };
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, message: "File too large. Maximum size is 5 MB." };
  }
  return { ok: true };
}

export async function uploadBuffer(buffer, options = {}) {
  const client = assertCloudinaryConfigured();
  return new Promise((resolve, reject) => {
    const stream = client.uploader.upload_stream(
      {
        folder: options.folder || "talent-institute",
        resource_type: options.resourceType || "auto",
        ...options.uploadOptions,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );
    stream.end(buffer);
  });
}

export async function deleteCloudinaryAsset(publicId, resourceType = "image") {
  if (!publicId) return;
  const client = assertCloudinaryConfigured();
  await client.uploader.destroy(publicId, { resource_type: resourceType });
}
