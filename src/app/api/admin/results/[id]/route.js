import { connectDB } from "@/lib/db";
import Result from "@/models/Result";
import { requireAdmin } from "@/lib/auth";
import { adminAuthErrorResponse, jsonError, jsonSuccess } from "@/lib/api-response";
import { parseJsonBody, resultUpdateSchema } from "@/lib/validation";
import { isValidObjectId } from "@/lib/normalize";
import { verifySameOrigin } from "@/lib/rate-limit";
import { buildResultFields } from "@/lib/result-utils";
import { getCourseById } from "@/data/courses";

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
      .populate("student", "fullName rollNumber fatherName photo imageUrl courseId courseName")
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
    const passingPercentage =
      parsed.data.passingPercentage ?? existing.passingPercentage;
    if (!Number.isFinite(passingPercentage)) {
      return jsonError(
        "Set a passing percentage between 0 and 100 for this result.",
        400,
      );
    }
    if (marksObtained > maxMarks) {
      return jsonError("Obtained marks cannot exceed maximum marks.", 400);
    }
    const computed = buildResultFields(
      marksObtained,
      maxMarks,
      passingPercentage,
      parsed.data.grade ?? existing.grade,
    );

    const updates = {
      ...computed,
      ...(parsed.data.courseName !== undefined
        ? {
            courseName: parsed.data.courseName,
            ...(parsed.data.courseId ? { courseId: parsed.data.courseId } : {}),
          }
        : parsed.data.courseId
          ? {
              courseName:
                getCourseById(parsed.data.courseId)?.title ||
                parsed.data.courseId,
              courseId: parsed.data.courseId,
            }
          : {}),
      ...(parsed.data.examName !== undefined
        ? { examName: parsed.data.examName }
        : {}),
      ...(parsed.data.resultDate !== undefined
        ? { resultDate: parsed.data.resultDate }
        : {}),
      ...(parsed.data.resultUrl !== undefined
        ? {
            resultUrl: parsed.data.resultUrl,
            resultPublicId: parsed.data.resultPublicId || "",
          }
        : {}),
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

    await Result.deleteOne({ _id: id });
    return jsonSuccess({ deleted: true });
  } catch (err) {
    console.error("Delete result:", err.message);
    return jsonError("Unable to delete result.", 500);
  }
}
