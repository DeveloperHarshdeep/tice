import {
  connectDB,
  getMongoConnectionState,
  getMongoDatabaseName,
} from "@/lib/db";
import Student from "@/models/Student";
import { requireAdmin } from "@/lib/auth";
import { adminAuthErrorResponse, jsonError, jsonSuccess } from "@/lib/api-response";
import {
  parseJsonBody,
  paginationSchema,
  studentCreateSchema,
} from "@/lib/validation";
import { verifySameOrigin } from "@/lib/rate-limit";
import { getCourseById } from "@/data/courses";

export async function GET(request) {
  const { error } = await requireAdmin(request);
  if (error) {
    return adminAuthErrorResponse(error);
  }

  const { searchParams } = new URL(request.url);
  const parsed = paginationSchema.safeParse({
    page: searchParams.get("page") || 1,
    limit: searchParams.get("limit") || 50,
    q: searchParams.get("q") || undefined,
  });
  if (!parsed.success) return jsonError("Invalid query parameters.", 400);

  const { page, limit, q } = parsed.data;
  const filter = { archived: false };
  if (q) {
    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [
      { fullName: regex },
      { rollNumber: regex },
      { contactNumber: regex },
    ];
  }

  try {
    await connectDB();
  } catch (err) {
    console.error("[api/admin/students] Database connection unavailable", {
      database: getMongoDatabaseName(),
      state: getMongoConnectionState(),
      configured: Boolean(process.env.MONGODB_URI?.trim()),
      errorType: err?.name || "Error",
    });
    return jsonError("Student database is unavailable.", 503, "DATABASE_UNAVAILABLE");
  }

  try {
    const [items, total] = await Promise.all([
      Student.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Student.countDocuments(filter),
    ]);

    const data = items.map((s) => ({
      ...s,
      id: s._id.toString(),
      courseTitle:
        s.courseName || getCourseById(s.courseId)?.title || s.courseId || "General Computing",
    }));

    console.info("[api/admin/students] Query succeeded", {
      database: getMongoDatabaseName(),
      state: getMongoConnectionState(),
      resultCount: items.length,
      total,
      status: 200,
    });

    return jsonSuccess({ items: data, page, limit, total });
  } catch (err) {
    console.error("[api/admin/students] Student query failed", {
      database: getMongoDatabaseName(),
      state: getMongoConnectionState(),
      errorType: err?.name || "Error",
    });
    return jsonError("Unable to load students.", 500, "STUDENT_QUERY_FAILED");
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

  const parsed = studentCreateSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues.map((i) => i.message).join("; ");
    return jsonError(message, 400);
  }

  const payload = parsed.data;
  const courseInfo = getCourseById(payload.courseId);
  const courseName = payload.courseName || courseInfo?.title || payload.courseId || "Basic Computer Course";

  try {
    await connectDB();

    // Check for duplicate roll number explicitly
    const existing = await Student.findOne({ rollNumber: payload.rollNumber });
    if (existing) {
      return jsonError("A student with this roll number already exists.", 409);
    }

    const studentData = {
      ...payload,
      courseName,
      enrollmentDate: payload.enrollmentDate || new Date(),
    };

    if (body.photo && body.photo.url) {
      studentData.photo = {
        url: body.photo.url,
        publicId: body.photo.publicId || "",
      };
      studentData.imageUrl = body.photo.url;
    }

    const student = await Student.create(studentData);
    return jsonSuccess({ student }, 201);
  } catch (err) {
    if (err.code === 11000) {
      return jsonError("A student with this roll number already exists.", 409);
    }
    console.error("Create student error:", err.message);
    return jsonError("Unable to create student. Please check database connection.", 500);
  }
}
