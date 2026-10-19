import { connectDB } from "@/lib/db";
import Result from "@/models/Result";
import Student from "@/models/Student";
import { requireAdmin } from "@/lib/auth";
import { adminAuthErrorResponse, jsonError, jsonSuccess } from "@/lib/api-response";
import { paginationSchema } from "@/lib/validation";
import { verifySameOrigin } from "@/lib/rate-limit";
import { buildResultFields } from "@/lib/result-utils";

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
        .populate("student", "fullName rollNumber courseId courseName resultUrl")
        .sort({ createdAt: -1 })
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

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  const {
    studentId,
    rollNumber,
    resultUrl,
    resultPublicId,
    examName = "Final Course Examination",
    resultDate,
    marksObtained,
    maxMarks = 100,
    publicationStatus = "published",
    showPhotoPublicly = false,
    replace = false,
  } = body;

  try {
    await connectDB();

    // Find student either by ID or by rollNumber
    let student;
    if (studentId) {
      student = await Student.findById(studentId);
    } else if (rollNumber) {
      student = await Student.findOne({ rollNumber: rollNumber.trim().toUpperCase() });
    }

    if (!student || student.archived) {
      return jsonError("Registered student not found.", 404);
    }

    // Check if result already exists and confirmation is needed
    if (student.resultUrl && !replace) {
      return jsonError(
        `A result document is already uploaded for ${student.fullName} (${student.rollNumber}). Confirm to replace.`,
        409,
      );
    }

    const marksNum = marksObtained !== undefined && marksObtained !== "" ? Number(marksObtained) : 85;
    const maxNum = maxMarks !== undefined && maxMarks !== "" ? Number(maxMarks) : 100;
    const computed = buildResultFields(marksNum, maxNum);
    const dateOfResult = resultDate ? new Date(resultDate) : new Date();

    // Update Student record with result document and details
    if (resultUrl) {
      student.resultUrl = resultUrl;
      student.resultPublicId = resultPublicId || "";
    }
    student.examName = examName;
    student.resultDate = dateOfResult;
    student.marksObtained = marksNum;
    student.maxMarks = maxNum;
    student.percentage = computed.percentage;
    student.grade = computed.grade;
    student.resultPublicationStatus = publicationStatus;
    await student.save();

    // Create or update Result document
    const resultDoc = await Result.findOneAndUpdate(
      { student: student._id },
      {
        $set: {
          student: student._id,
          ...computed,
          publicationStatus,
          showPhotoPublicly,
          publishedAt: publicationStatus === "published" ? new Date() : undefined,
        },
      },
      { upsert: true, new: true },
    );

    return jsonSuccess({
      result: resultDoc,
      student: {
        id: student._id,
        fullName: student.fullName,
        rollNumber: student.rollNumber,
        resultUrl: student.resultUrl,
        grade: student.grade,
        percentage: student.percentage,
      },
    }, 201);
  } catch (err) {
    console.error("Create result error:", err.message);
    return jsonError("Unable to save result.", 500);
  }
}
