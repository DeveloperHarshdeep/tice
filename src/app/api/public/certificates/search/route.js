import { connectDB } from "@/lib/db";
import Certificate from "@/models/Certificate";
import Student from "@/models/Student";
import { jsonError, jsonSuccess } from "@/lib/api-response";
import { normalizeRollNumber } from "@/lib/normalize";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

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
    return jsonError("Please enter a valid roll number.", 400);
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
              : "No issued certificate found for this roll number.",
          });
        }
        return jsonSuccess({
          found: true,
          status: "verified",
          certificate: {
            studentName: student.fullName,
            rollNumber: student.rollNumber,
            courseName: certDoc.courseName,
            issueDate: certDoc.issueDate,
            certificateNumber: certDoc.certificateNumber,
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
            rollNumber: student.rollNumber,
            courseName:
              student.certificateCourseName ||
              student.courseName ||
              "Computer Training Program",
            issueDate: student.certificateIssueDate || student.updatedAt,
            certificateNumber:
              student.certificateNumber ||
              `TICE-CERT-${student.rollNumber}`,
            fileUrl: student.certificateUrl,
          },
        });
      }
    }

    // Also check if user entered certificate number directly
    const directCert = await Certificate.findOne({
      certificateNumber: query.trim().toUpperCase(),
      status: "issued",
    }).populate("student", "fullName rollNumber archived");

    if (directCert && directCert.student && !directCert.student.archived) {
      return jsonSuccess({
        found: true,
        status: "verified",
        certificate: {
          studentName: directCert.student.fullName,
          rollNumber: directCert.student.rollNumber,
          courseName: directCert.courseName,
          issueDate: directCert.issueDate,
          certificateNumber: directCert.certificateNumber,
          fileUrl: directCert.file?.url || null,
        },
      });
    }

    return jsonSuccess({
      found: false,
      status: "not_found",
      message: "No certificate found for this roll number.",
    });
  } catch (error) {
    console.error("Certificate search error:", error.message);
    return jsonError("Unable to verify certificate at this time. Please try again.", 500);
  }
}
