import { connectDB } from "@/lib/db";
import Result from "@/models/Result";
import Student from "@/models/Student";
import { jsonError, jsonSuccess } from "@/lib/api-response";
import { normalizeRollNumber } from "@/lib/normalize";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { getCourseById } from "@/data/courses";
import { toPublicResult } from "@/lib/result-utils";
import {
  calculateGrade,
  calculatePassStatus,
  calculatePercentage,
} from "@/lib/grading";

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
    return jsonError("Please enter a valid student registration number.", 400);
  }

  const rollNumber = normalizeRollNumber(query);

  try {
    await connectDB();

    const student = await Student.findOne({ rollNumber, archived: false });
    if (!student) {
      return jsonSuccess({
        found: false,
        message: "No result found for this registration number.",
      });
    }

    const resultDocs = await Result.find({
      student: student._id,
      publicationStatus: "published",
    })
      .sort({ resultDate: -1, createdAt: -1 })
      .lean();

    if (resultDocs.length > 0) {
      const results = resultDocs.map((resultDoc) =>
        toPublicResult(resultDoc, student),
      );
      return jsonSuccess({
        found: true,
        student: {
          studentName: student.fullName,
          fatherName: student.fatherName,
          rollNumber: student.rollNumber,
        },
        results,
        result: results[0],
      });
    }

    if (
      student.resultPublicationStatus === "draft" ||
      (student.resultUrl == null &&
        student.marksObtained == null &&
        student.percentage == null)
    ) {
      return jsonSuccess({
        found: false,
        message: "No result found for this registration number.",
      });
    }

    const course = getCourseById(student.courseId);
    const courseTitle = student.courseName || course?.title || student.courseId || "Computer Training Course";

    const marksObtained = student.marksObtained;
    const maxMarks = student.maxMarks || 100;
    const hasMarks =
      Number.isFinite(marksObtained) &&
      Number.isFinite(maxMarks) &&
      maxMarks > 0 &&
      marksObtained >= 0 &&
      marksObtained <= maxMarks;
    const percentage = hasMarks
      ? calculatePercentage(marksObtained, maxMarks)
      : null;
    const passingPercentage = Number.isFinite(student.passingPercentage)
      ? student.passingPercentage
      : null;
    const passStatus =
      student.passStatus ||
      (percentage !== null && passingPercentage !== null
        ? calculatePassStatus(
            (marksObtained / maxMarks) * 100,
            passingPercentage,
          )
        : null);
    const legacyResult = {
      studentName: student.fullName,
      fatherName: student.fatherName,
      rollNumber: student.rollNumber,
      courseName: courseTitle,
      examName: student.examName || "Final Practical Examination",
      resultDate: student.resultDate || student.updatedAt,
      publishedAt: student.updatedAt,
      resultUrl: student.resultUrl || null,
      marksObtained: hasMarks ? marksObtained : null,
      maxMarks: hasMarks ? maxMarks : null,
      percentage,
      passingPercentage,
      grade:
        student.grade ||
        (percentage !== null && passingPercentage !== null
          ? calculateGrade(percentage, passingPercentage)
          : null),
      passStatus,
    };

    return jsonSuccess({
      found: true,
      student: {
        studentName: student.fullName,
        fatherName: student.fatherName,
        rollNumber: student.rollNumber,
      },
      results: [legacyResult],
      result: legacyResult,
    });
  } catch (error) {
    console.error("Result search error:", error.message);
    return jsonError("Unable to fetch results at this time. Please try again.", 500);
  }
}
