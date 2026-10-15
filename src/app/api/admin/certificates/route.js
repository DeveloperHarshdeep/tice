import { connectDB } from "@/lib/db";
import Certificate from "@/models/Certificate";
import Student from "@/models/Student";
import { requireAdmin } from "@/lib/auth";
import { jsonError, jsonSuccess } from "@/lib/api-response";
import { paginationSchema } from "@/lib/validation";
import { verifySameOrigin } from "@/lib/rate-limit";
import { uploadGeneratedCertificate } from "@/lib/certificate-generator";
import { normalizeCertificateNumber } from "@/lib/normalize";

export async function GET(request) {
  const { error } = await requireAdmin(request);
  if (error) return jsonError("Unauthorized.", 401);

  const { searchParams } = new URL(request.url);
  const parsed = paginationSchema.safeParse({
    page: searchParams.get("page") || 1,
    limit: searchParams.get("limit") || 50,
    q: searchParams.get("q") || undefined,
  });
  if (!parsed.success) return jsonError("Invalid query parameters.", 400);

  const { page, limit, q } = parsed.data;
  const filter = {};
  if (q) {
    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ certificateNumber: regex }, { courseName: regex }];
  }

  try {
    await connectDB();
    const [items, total] = await Promise.all([
      Certificate.find(filter)
        .populate("student", "fullName rollNumber fatherName contactNumber archived certificateUrl")
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
  if (error) return jsonError("Unauthorized.", 401);

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  const {
    studentId,
    rollNumber,
    courseName,
    issueDate,
    status = "issued",
    reissue = false,
    file,
  } = body;

  if (!courseName || !courseName.trim()) {
    return jsonError("Course name is required.", 400);
  }

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

    // Check for accidental duplicate issuance
    if (student.certificateUrl && !reissue) {
      return jsonError(
        `A certificate has already been issued to ${student.fullName} (${student.rollNumber}). Confirm reissue to overwrite.`,
        409,
      );
    }

    const certDate = issueDate ? new Date(issueDate) : new Date();
    const normalizedCertNo = body.certificateNumber
      ? normalizeCertificateNumber(body.certificateNumber)
      : `TICE-CERT-${new Date().getFullYear()}-${student.rollNumber.replace(/[^a-zA-Z0-9]/g, "").slice(-4) || Date.now().toString().slice(-4)}`;

    let certificateFile = file;

    // If no manual file was provided, generate the professional A4 portrait SVG and upload to Cloudinary
    if (!certificateFile || !certificateFile.url) {
      try {
        const generated = await uploadGeneratedCertificate({
          studentName: student.fullName,
          fatherName: student.fatherName,
          rollNumber: student.rollNumber,
          courseName: courseName.trim(),
          issueDate: certDate,
          certificateNumber: normalizedCertNo,
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
    student.certificateNumber = normalizedCertNo;
    student.certificateCourseName = courseName.trim();
    student.certificateIssueDate = certDate;
    await student.save();

    // Create or update Certificate collection entry
    const certificate = await Certificate.findOneAndUpdate(
      { student: student._id },
      {
        $set: {
          student: student._id,
          certificateNumber: normalizedCertNo,
          courseName: courseName.trim(),
          file: certificateFile,
          issueDate: certDate,
          status: status || "issued",
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
          certificateNumber: student.certificateNumber,
        },
        certificateUrl: certificateFile.url,
      },
      201,
    );
  } catch (err) {
    if (err.code === 11000) {
      return jsonError("Certificate number already exists in registry.", 409);
    }
    console.error("Create certificate error:", err.message);
    return jsonError("Unable to issue certificate.", 500);
  }
}
