import { connectDB } from "@/lib/db";
import Result from "@/models/Result";
import Student from "@/models/Student";
import { requireAdmin } from "@/lib/auth";
import { adminAuthErrorResponse, jsonError, jsonSuccess } from "@/lib/api-response";
import {
  paginationSchema,
  parseJsonBody,
  resultCreateSchema,
} from "@/lib/validation";
import { verifySameOrigin } from "@/lib/rate-limit";
import { buildResultFields } from "@/lib/result-utils";
import { isValidObjectId } from "@/lib/normalize";
import { getCourseById } from "@/data/courses";

export async function GET(request) {
  const { error } = await requireAdmin(request);
  if (error) return adminAuthErrorResponse(error);

  const { searchParams } = new URL(request.url);
  const parsed = paginationSchema.safeParse({
    page: searchParams.get("page") || 1,
    limit: searchParams.get("limit") || 50,
    q: searchParams.get("q") || undefined,
  });
  if (!parsed.success) return jsonError("Invalid query parameters.", 400);

  const { page, limit, q } = parsed.data;

  try {
    await connectDB();

    let filter = {};
    if (q) {
      const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      const students = await Student.find({
        $or: [{ rollNumber: regex }, { fullName: regex }],
      }).select("_id");
      filter = { student: { $in: students.map((s) => s._id) } };
    }

    const [items, total] = await Promise.all([
      Result.find(filter)
        .populate("student", "fullName rollNumber fatherName photo imageUrl courseId courseName resultUrl")
        .sort({ resultDate: -1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Result.countDocuments(filter),
    ]);

    return jsonSuccess({
      items: items.map((r) => ({ ...r, id: r._id.toString() })),
      page,
      limit,
      total,
    });
  } catch (err) {
    console.error("List results error:", err.message);
    return jsonError("Unable to load results.", 500);
  }
}

export async function POST(request) {
  if (!verifySameOrigin(request)) return jsonError("Invalid request origin.", 403);
  const { error } = await requireAdmin(request);
  if (error) return adminAuthErrorResponse(error);

  const parsed = await parseJsonBody(request, resultCreateSchema);
  if (!parsed.success) return jsonError(parsed.error, 400);
  const data = parsed.data;
  const courseName =
    data.courseName?.trim() || getCourseById(data.courseId)?.title || "";
  if (!data.studentId && !data.rollNumber) {
    return jsonError("Select an existing student.", 400);
  }
  if (courseName.length < 2) {
    return jsonError("Enter a course name with at least 2 characters.", 400);
  }
  if (data.marksObtained > data.maxMarks) {
    return jsonError("Obtained marks cannot exceed maximum marks.", 400);
  }
  if (data.studentId && !isValidObjectId(data.studentId)) {
    return jsonError("Invalid student ID.", 400);
  }

  try {
    await connectDB();

    let student;
    if (data.studentId) {
      student = await Student.findById(data.studentId);
    } else if (data.rollNumber) {
      student = await Student.findOne({
        rollNumber: data.rollNumber.trim().toUpperCase(),
      });
    }

    if (!student || student.archived) {
      return jsonError("Registered student not found.", 404);
    }

    const computed = buildResultFields(
      data.marksObtained,
      data.maxMarks,
      data.passingPercentage,
      data.grade,
    );
    const resultDoc = await Result.create({
      student: student._id,
      ...(data.courseId ? { courseId: data.courseId } : {}),
      courseName,
      examName: data.examName,
      resultDate: data.resultDate,
      ...computed,
      ...(data.resultUrl
        ? {
            resultUrl: data.resultUrl,
            resultPublicId: data.resultPublicId || "",
          }
        : {}),
      publicationStatus: data.publicationStatus,
      showPhotoPublicly: data.showPhotoPublicly,
      ...(data.publicationStatus === "published"
        ? { publishedAt: new Date() }
        : {}),
    });

    return jsonSuccess({
      result: resultDoc,
      student: {
        id: student._id,
        fullName: student.fullName,
        rollNumber: student.rollNumber,
      },
    }, 201);
  } catch (err) {
    console.error("Create result error:", err.message);
    return jsonError("Unable to save result.", 500);
  }
}
