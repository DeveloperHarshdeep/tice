import { connectDB } from "@/lib/db";
import Result from "@/models/Result";
import Student from "@/models/Student";
import { jsonError, jsonSuccess } from "@/lib/api-response";
import { normalizeRollNumber } from "@/lib/normalize";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { getCourseById } from "@/data/courses";

export async function POST(request) {
  const ip = getClientIp(request);
  const rl = await rateLimit(`result-search:${ip}`, { limit: 30, windowMs: 60_000 });
  if (!rl.success) {
    return jsonError("Too many searches. Please wait and try again.", 429);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  const query = body.rollNumber || body.query;
  if (!query || typeof query !== "string" || query.trim().length < 2) {
    return jsonError("Please enter a valid student roll number.", 400);
  }

  const rollNumber = normalizeRollNumber(query);

  try {
    await connectDB();

    const student = await Student.findOne({ rollNumber, archived: false });
    if (!student) {
      return jsonSuccess({
        found: false,
        message: "No result found for this roll number.",
      });
    }

    const latestResult = await Result.findOne({ student: student._id })
      .sort({ updatedAt: -1 })
      .lean();
    const resultDoc =
      latestResult?.publicationStatus === "published" ? latestResult : null;

    if (
      !resultDoc &&
      (latestResult ||
        student.resultPublicationStatus === "draft" ||
        !student.resultUrl)
    ) {
      return jsonSuccess({
        found: false,
        message: "No result found for this roll number.",
      });
    }

    const course = getCourseById(student.courseId);
    const courseTitle = student.courseName || course?.title || student.courseId || "Computer Training Course";

    const marksObtained = resultDoc?.marksObtained ?? student.marksObtained;
    const maxMarks = resultDoc?.maxMarks ?? student.maxMarks ?? 100;
    const percentage =
      resultDoc?.percentage ??
      student.percentage ??
      (marksObtained !== undefined && marksObtained !== null ?
        Math.round((marksObtained / maxMarks) * 100)
      : null);
    const grade =
      resultDoc?.grade ??
      student.grade ??
      (percentage !== null ?
        percentage >= 80 ? "A+"
        : percentage >= 70 ? "A"
        : percentage >= 60 ? "B"
        : percentage >= 50 ? "C"
        : "D"
      : null);

    return jsonSuccess({
      found: true,
      result: {
        studentName: student.fullName,
        rollNumber: student.rollNumber,
        courseName: courseTitle,
        examName: student.examName || "Final Practical Examination",
        resultDate: student.resultDate || resultDoc?.publishedAt || student.updatedAt,
        resultUrl: student.resultUrl || null,
        marksObtained,
        maxMarks,
        percentage,
        grade,
        passStatus: percentage !== null ? (percentage >= 40 ? "pass" : "fail") : "pass",
      },
    });
  } catch (error) {
    console.error("Result search error:", error.message);
    return jsonError("Unable to fetch results at this time. Please try again.", 500);
  }
}
