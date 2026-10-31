import { connectDB } from "@/lib/db";
import Certificate from "@/models/Certificate";
import Student from "@/models/Student";
import { jsonError, jsonSuccess } from "@/lib/api-response";
import {
  normalizeCertificateNumber,
  normalizeRollNumber,
} from "@/lib/normalize";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { getCourseById } from "@/data/courses";

export async function POST(request) {
  const ip = getClientIp(request);
  const rl = await rateLimit(`cert-search:${ip}`, { limit: 30, windowMs: 60_000 });
  if (!rl.success) {
    return jsonError("Too many searches. Please wait a moment and try again.", 429);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  const query = body.rollNumber || body.query;
  if (!query || typeof query !== "string" || query.trim().length < 2) {
    return jsonError("Please enter a valid registration number.", 400);
  }

  const roll = normalizeRollNumber(query);

  try {
    await connectDB();

    // 1. Search Student by rollNumber
    const student = await Student.findOne({ rollNumber: roll, archived: false });

    // The registry status is authoritative when a certificate record exists.
    if (student) {
      const certDoc = await Certificate.findOne({ student: student._id })
        .sort({ updatedAt: -1 })
        .lean();

      if (certDoc) {
        if (certDoc.status !== "issued") {
          return jsonSuccess({
            found: false,
            status: certDoc.status === "revoked" ? "revoked" : "not_found",
            message:
              certDoc.status === "revoked" ?
                "This certificate has been revoked."
              : "No issued certificate found for this registration number.",
          });
        }
        return jsonSuccess({
          found: true,
          status: "verified",
          certificate: {
            studentName: student.fullName,
            fatherName: student.fatherName,
            rollNumber: student.rollNumber,
            registrationNumber: student.rollNumber,
            courseName:
              certDoc.courseName ||
              getCourseById(certDoc.courseId || student.courseId)?.title ||
              student.certificateCourseName ||
              student.courseName ||
              "Computer Training Program",
            issueDate: certDoc.issueDate,
            fileUrl: certDoc.file?.url || student.certificateUrl || null,
          },
        });
      }

      // Older certificates may exist only on the student record.
      if (
        student.certificateUrl &&
        (!student.certificateStatus || student.certificateStatus === "issued")
      ) {
        return jsonSuccess({
          found: true,
          status: "verified",
          certificate: {
            studentName: student.fullName,
            fatherName: student.fatherName,
            rollNumber: student.rollNumber,
            registrationNumber: student.rollNumber,
            courseName:
              student.certificateCourseName ||
              student.courseName ||
              getCourseById(student.courseId)?.title ||
              "Computer Training Program",
            issueDate: student.certificateIssueDate || student.updatedAt,
            fileUrl: student.certificateUrl,
          },
        });
      }
    }

    // Keep old certificate-number searches working for existing records.
    const directCert = await Certificate.findOne({
      certificateNumber: normalizeCertificateNumber(query),
      status: "issued",
    }).populate(
      "student",
      "fullName fatherName rollNumber archived courseId courseName certificateCourseName",
    );

    if (directCert && directCert.student && !directCert.student.archived) {
      return jsonSuccess({
        found: true,
        status: "verified",
        certificate: {
          studentName: directCert.student.fullName,
          fatherName: directCert.student.fatherName,
          rollNumber: directCert.student.rollNumber,
          registrationNumber: directCert.student.rollNumber,
          courseName:
            directCert.courseName ||
            getCourseById(directCert.courseId || directCert.student.courseId)?.title ||
            "Computer Training Program",
          issueDate: directCert.issueDate,
          fileUrl: directCert.file?.url || null,
        },
      });
    }

    return jsonSuccess({
      found: false,
      status: "not_found",
      message: "No certificate found for this registration number.",
    });
  } catch (error) {
    console.error("Certificate search error:", error.message);
    return jsonError("Unable to verify certificate at this time. Please try again.", 500);
  }
}
