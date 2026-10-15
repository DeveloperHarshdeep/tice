import { connectDB } from "@/lib/db";
import Student from "@/models/Student";
import Certificate from "@/models/Certificate";
import Result from "@/models/Result";
import { requireAdmin } from "@/lib/auth";
import { jsonError, jsonSuccess } from "@/lib/api-response";
import { isValidObjectId } from "@/lib/normalize";
import { verifySameOrigin } from "@/lib/rate-limit";
import { deleteCloudinaryAsset } from "@/lib/cloudinary";
import { getCourseById } from "@/data/courses";

async function getIdParams(params) {
  const resolved = await params;
  return resolved.id;
}

export async function GET(request, { params }) {
  const { error } = await requireAdmin(request);
  if (error) return jsonError("Unauthorized.", 401);

  const id = await getIdParams(params);
  if (!isValidObjectId(id)) return jsonError("Invalid student ID.", 400);

  try {
    await connectDB();
    const student = await Student.findById(id).lean();
    if (!student || student.archived) return jsonError("Student not found.", 404);
    return jsonSuccess({
      student: {
        ...student,
        id: student._id.toString(),
        courseTitle:
          student.courseName || getCourseById(student.courseId)?.title || student.courseId,
      },
    });
  } catch (err) {
    console.error("Get student:", err.message);
    return jsonError("Unable to load student.", 500);
  }
}

export async function PATCH(request, { params }) {
  if (!verifySameOrigin(request)) return jsonError("Invalid request origin.", 403);
  const { error } = await requireAdmin(request);
  if (error) return jsonError("Unauthorized.", 401);

  const id = await getIdParams(params);
  if (!isValidObjectId(id)) return jsonError("Invalid student ID.", 400);

  let updates;
  try {
    updates = await request.json();
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  try {
    await connectDB();

    if (updates.courseId && !updates.courseName) {
      const course = getCourseById(updates.courseId);
      if (course) updates.courseName = course.title;
    }

    if (updates.photo && updates.photo.url) {
      updates.imageUrl = updates.photo.url;
    }

    const student = await Student.findOneAndUpdate(
      { _id: id, archived: false },
      { $set: updates },
      { new: true, runValidators: true },
    );
    if (!student) return jsonError("Student not found.", 404);
    return jsonSuccess({ student });
  } catch (err) {
    if (err.code === 11000) {
      return jsonError("Roll number already in use.", 409);
    }
    console.error("Update student:", err.message);
    return jsonError("Unable to update student.", 500);
  }
}

export async function DELETE(request, { params }) {
  if (!verifySameOrigin(request)) return jsonError("Invalid request origin.", 403);
  const { error } = await requireAdmin(request);
  if (error) return jsonError("Unauthorized.", 401);

  const id = await getIdParams(params);
  if (!isValidObjectId(id)) return jsonError("Invalid student ID.", 400);

  try {
    await connectDB();
    const student = await Student.findById(id);
    if (!student || student.archived) return jsonError("Student not found.", 404);

    if (student.certificateUrl || student.resultUrl) {
      student.archived = true;
      await student.save();
      return jsonSuccess({
        archived: true,
        message: "Student archived because issued certificates or published results exist.",
      });
    }

    if (student.photo?.publicId) {
      try {
        await deleteCloudinaryAsset(student.photo.publicId, "image");
      } catch {
        /* non-fatal */
      }
    }

    await Certificate.deleteMany({ student: id });
    await Result.deleteMany({ student: id });
    await Student.deleteOne({ _id: id });

    return jsonSuccess({ deleted: true });
  } catch (err) {
    console.error("Delete student:", err.message);
    return jsonError("Unable to delete student.", 500);
  }
}
