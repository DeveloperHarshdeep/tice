import { connectDB } from "@/lib/db";
import Result from "@/models/Result";
import Student from "@/models/Student";
import { requireAdmin } from "@/lib/auth";
import { adminAuthErrorResponse, jsonError, jsonSuccess } from "@/lib/api-response";
import { parseJsonBody, resultUpdateSchema } from "@/lib/validation";
import { isValidObjectId } from "@/lib/normalize";
import { verifySameOrigin } from "@/lib/rate-limit";
import { buildResultFields } from "@/lib/result-utils";

async function getIdParams(params) {
  const resolved = await params;
  return resolved.id;
}

export async function GET(request, { params }) {
  const { error } = await requireAdmin(request);
  if (error) return adminAuthErrorResponse(error);

  const id = await getIdParams(params);
  if (!isValidObjectId(id)) return jsonError("Invalid result ID.", 400);

  try {
    await connectDB();
    const result = await Result.findById(id)
      .populate("student", "fullName rollNumber courseId")
      .lean();
    if (!result) return jsonError("Result not found.", 404);
    return jsonSuccess({ result: { ...result, id: result._id.toString() } });
  } catch (err) {
    console.error("Get result:", err.message);
    return jsonError("Unable to load result.", 500);
  }
}

export async function PATCH(request, { params }) {
  if (!verifySameOrigin(request)) return jsonError("Invalid request origin.", 403);
  const { error } = await requireAdmin(request);
  if (error) return adminAuthErrorResponse(error);

  const id = await getIdParams(params);
  if (!isValidObjectId(id)) return jsonError("Invalid result ID.", 400);

  const parsed = await parseJsonBody(request, resultUpdateSchema);
  if (!parsed.success) return jsonError(parsed.error, 400);

  try {
    await connectDB();
    const existing = await Result.findById(id);
    if (!existing) return jsonError("Result not found.", 404);

    const marksObtained = parsed.data.marksObtained ?? existing.marksObtained;
    const maxMarks = parsed.data.maxMarks ?? existing.maxMarks;
    const computed = buildResultFields(marksObtained, maxMarks);

    const updates = {
      ...computed,
      ...(parsed.data.publicationStatus !== undefined ?
        { publicationStatus: parsed.data.publicationStatus }
      : {}),
      ...(parsed.data.showPhotoPublicly !== undefined ?
        { showPhotoPublicly: parsed.data.showPhotoPublicly }
      : {}),
    };

    if (parsed.data.publicationStatus === "published") {
      updates.publishedAt = existing.publishedAt || new Date();
    }
    if (parsed.data.publicationStatus === "draft") {
      updates.publishedAt = undefined;
    }

    const result = await Result.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true },
    );

    if (existing.student) {
      const studentUpdates = {
        marksObtained,
        maxMarks,
        percentage: computed.percentage,
        grade: computed.grade,
        resultPublicationStatus: result.publicationStatus,
      };
      if (parsed.data.resultUrl) {
        studentUpdates.resultUrl = parsed.data.resultUrl;
        studentUpdates.resultPublicId = parsed.data.resultPublicId || "";
      }
      if (parsed.data.examName) studentUpdates.examName = parsed.data.examName;
      if (parsed.data.resultDate) studentUpdates.resultDate = parsed.data.resultDate;
      await Student.findByIdAndUpdate(existing.student, { $set: studentUpdates });
    }

    return jsonSuccess({ result });
  } catch (err) {
    console.error("Update result:", err.message);
    return jsonError("Unable to update result.", 500);
  }
}

export async function DELETE(request, { params }) {
  if (!verifySameOrigin(request)) return jsonError("Invalid request origin.", 403);
  const { error } = await requireAdmin(request);
  if (error) return adminAuthErrorResponse(error);

  const id = await getIdParams(params);
  if (!isValidObjectId(id)) return jsonError("Invalid result ID.", 400);

  try {
    await connectDB();
    const result = await Result.findById(id);
    if (!result) return jsonError("Result not found.", 404);

    if (result.publicationStatus === "published") {
      return jsonError(
        "Unpublish the result before deleting, or edit it instead.",
        400,
      );
    }

    await Result.deleteOne({ _id: id });
    if (result.student) {
      await Student.updateOne(
        { _id: result.student },
        { $set: { resultPublicationStatus: "draft" } },
      );
    }
    return jsonSuccess({ deleted: true });
  } catch (err) {
    console.error("Delete result:", err.message);
    return jsonError("Unable to delete result.", 500);
  }
}
