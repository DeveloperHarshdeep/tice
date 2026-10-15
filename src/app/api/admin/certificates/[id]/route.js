import { connectDB } from "@/lib/db";
import Certificate from "@/models/Certificate";
import { requireAdmin } from "@/lib/auth";
import { jsonError, jsonSuccess } from "@/lib/api-response";
import { parseJsonBody, certificateUpdateSchema } from "@/lib/validation";
import { isValidObjectId } from "@/lib/normalize";
import { verifySameOrigin } from "@/lib/rate-limit";
import { deleteCloudinaryAsset } from "@/lib/cloudinary";

async function getIdParams(params) {
  const resolved = await params;
  return resolved.id;
}

export async function GET(request, { params }) {
  const { error } = await requireAdmin(request);
  if (error) return jsonError("Unauthorized.", 401);

  const id = await getIdParams(params);
  if (!isValidObjectId(id)) return jsonError("Invalid certificate ID.", 400);

  try {
    await connectDB();
    const certificate = await Certificate.findById(id)
      .populate("student", "fullName rollNumber courseId")
      .lean();
    if (!certificate) return jsonError("Certificate not found.", 404);
    return jsonSuccess({
      certificate: { ...certificate, id: certificate._id.toString() },
    });
  } catch (err) {
    console.error("Get certificate:", err.message);
    return jsonError("Unable to load certificate.", 500);
  }
}

export async function PATCH(request, { params }) {
  if (!verifySameOrigin(request)) return jsonError("Invalid request origin.", 403);
  const { error } = await requireAdmin(request);
  if (error) return jsonError("Unauthorized.", 401);

  const id = await getIdParams(params);
  if (!isValidObjectId(id)) return jsonError("Invalid certificate ID.", 400);

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  const fileUpdate = body.file;
  const parsed = certificateUpdateSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues.map((i) => i.message).join("; ");
    return jsonError(message, 400);
  }

  const updates = { ...parsed.data };
  if (updates.status === "issued" && !updates.issueDate) {
    updates.issueDate = new Date();
  }
  if (updates.status === "revoked") {
    updates.revokedAt = new Date();
  }
  if (fileUpdate?.url && fileUpdate?.publicId) {
    updates.file = {
      url: String(fileUpdate.url),
      publicId: String(fileUpdate.publicId),
    };
  }

  try {
    await connectDB();
    const certificate = await Certificate.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true },
    );
    if (!certificate) return jsonError("Certificate not found.", 404);
    return jsonSuccess({ certificate });
  } catch (err) {
    if (err.code === 11000) {
      return jsonError("Certificate number already exists.", 409);
    }
    console.error("Update certificate:", err.message);
    return jsonError("Unable to update certificate.", 500);
  }
}

export async function DELETE(request, { params }) {
  if (!verifySameOrigin(request)) return jsonError("Invalid request origin.", 403);
  const { error } = await requireAdmin(request);
  if (error) return jsonError("Unauthorized.", 401);

  const id = await getIdParams(params);
  if (!isValidObjectId(id)) return jsonError("Invalid certificate ID.", 400);

  try {
    await connectDB();
    const certificate = await Certificate.findById(id);
    if (!certificate) return jsonError("Certificate not found.", 404);

    if (certificate.status !== "draft") {
      return jsonError(
        "Only draft certificates can be deleted. Revoke issued certificates instead.",
        400,
      );
    }

    if (certificate.file?.publicId) {
      try {
        const rt =
          certificate.file.url?.includes(".pdf") ? "raw" : "image";
        await deleteCloudinaryAsset(certificate.file.publicId, rt);
      } catch {
        /* non-fatal */
      }
    }

    await Certificate.deleteOne({ _id: id });
    return jsonSuccess({ deleted: true });
  } catch (err) {
    console.error("Delete certificate:", err.message);
    return jsonError("Unable to delete certificate.", 500);
  }
}
