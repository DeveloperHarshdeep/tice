import { connectDB } from "@/lib/db";
import Certificate from "@/models/Certificate";
import Student from "@/models/Student";
import { requireAdmin } from "@/lib/auth";
import { adminAuthErrorResponse, jsonError, jsonSuccess } from "@/lib/api-response";
import {
  paginationSchema,
  parseJsonBody,
  certificateCreateSchema,
} from "@/lib/validation";
import { verifySameOrigin } from "@/lib/rate-limit";
import { uploadGeneratedCertificate } from "@/lib/certificate-generator";
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
      const matchingStudents = await Student.find({
        $or: [{ rollNumber: regex }, { fullName: regex }],
      }).select("_id");
      filter = {
        $or: [
          { certificateNumber: regex },
          { courseName: regex },
          { student: { $in: matchingStudents.map((student) => student._id) } },
        ],
      };
    }

    const [items, total] = await Promise.all([
      Certificate.find(filter)
        .populate("student", "fullName rollNumber fatherName contactNumber archived certificateUrl courseId courseName photo imageUrl")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Certificate.countDocuments(filter),
    ]);

    return jsonSuccess({
      items: items.map((c) => ({ ...c, id: c._id.toString() })),
      page,
      limit,
      total,
    });
  } catch (err) {
    console.error("List certificates error:", err.message);
    return jsonError("Unable to load certificates.", 500);
  }
}

export async function POST(request) {
  if (!verifySameOrigin(request)) return jsonError("Invalid request origin.", 403);
  const { error } = await requireAdmin(request);
  if (error) return adminAuthErrorResponse(error);

  const parsed = await parseJsonBody(request, certificateCreateSchema);
  if (!parsed.success) return jsonError(parsed.error, 400);
  const data = parsed.data;
  if (!data.studentId && !data.rollNumber) {
    return jsonError("Select an existing student.", 400);
  }
  const courseName =
    data.courseName?.trim() || getCourseById(data.courseId)?.title || "";
  if (courseName.length < 2) {
    return jsonError("Enter a course name with at least 2 characters.", 400);
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

    const existingCertificate = await Certificate.findOne({ student: student._id });
    if ((student.certificateUrl || existingCertificate) && !data.reissue) {
      return jsonError(
        `A certificate has already been issued to ${student.fullName} (${student.rollNumber}). Confirm reissue to overwrite.`,
        409,
      );
    }

    const certDate = data.issueDate || new Date();
    const registrationNumber = student.rollNumber;
    const registrationConflict = await Certificate.exists({
      certificateNumber: registrationNumber,
      student: { $ne: student._id },
    });
    if (registrationConflict) {
      return jsonError(
        "This registration number conflicts with an existing certificate record.",
        409,
      );
    }

    let certificateFile = data.file;

    // If no manual file was provided, generate the professional A4 portrait SVG and upload to Cloudinary
    if (!certificateFile || !certificateFile.url) {
      try {
        const generated = await uploadGeneratedCertificate({
          studentName: student.fullName,
          fatherName: student.fatherName,
          rollNumber: student.rollNumber,
          courseName,
          issueDate: certDate,
        });

        certificateFile = {
          url: generated.url,
          publicId: generated.publicId,
        };
      } catch (uploadErr) {
        console.error("Cloudinary certificate upload error:", uploadErr.message);
        return jsonError(
          "Certificate generation failed to upload to Cloudinary. Check Cloudinary settings.",
          500,
        );
      }
    }

    // Update Student record with issued certificate details
    student.certificateUrl = certificateFile.url;
    student.certificatePublicId = certificateFile.publicId || "";
    student.certificateNumber = registrationNumber;
    student.certificateCourseName = courseName;
    student.certificateIssueDate = certDate;
    student.certificateStatus = data.status;
    await student.save();

    // Create or update Certificate collection entry
    const certificate = await Certificate.findOneAndUpdate(
      { student: student._id },
      {
        $set: {
          student: student._id,
          ...(data.courseId ? { courseId: data.courseId } : {}),
          certificateNumber: registrationNumber,
          courseName,
          file: certificateFile,
          issueDate: certDate,
          status: data.status,
        },
      },
      { upsert: true, new: true },
    );

    return jsonSuccess(
      {
        certificate,
        student: {
          id: student._id,
          fullName: student.fullName,
          rollNumber: student.rollNumber,
          certificateUrl: student.certificateUrl,
        },
        certificateUrl: certificateFile.url,
      },
      201,
    );
  } catch (err) {
    if (err.code === 11000) {
      return jsonError("Registration number already exists in certificate registry.", 409);
    }
    console.error("Create certificate error:", err.message);
    return jsonError("Unable to issue certificate.", 500);
  }
}
