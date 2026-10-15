import { z } from "zod";
import { normalizeCertificateNumber, normalizeRollNumber } from "./normalize";

export const loginSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(6).max(128),
});

export const enquirySchema = z
  .object({
    name: z.string().trim().min(2).max(120),
    phone: z.string().trim().min(7).max(20).optional().or(z.literal("")),
    email: z.string().trim().email().max(255).optional().or(z.literal("")),
    courseOfInterest: z.string().trim().max(120).optional().or(z.literal("")),
    message: z.string().trim().min(10).max(2000),
  })
  .refine((data) => data.phone || data.email, {
    message: "Provide at least a phone number or email address.",
    path: ["phone"],
  });

export const certificateSearchSchema = z.object({
  rollNumber: z
    .string()
    .trim()
    .min(2)
    .max(64)
    .transform(normalizeRollNumber),
});

export const resultSearchSchema = z.object({
  rollNumber: z
    .string()
    .trim()
    .min(2)
    .max(64)
    .transform(normalizeRollNumber),
});

export const studentCreateSchema = z.object({
  rollNumber: z.string().trim().min(2).max(32).transform(normalizeRollNumber),
  fullName: z.string().trim().min(2).max(120),
  fatherName: z.string().trim().min(2).max(120),
  contactNumber: z
    .string()
    .trim()
    .min(7, "Contact number must have at least 7 digits")
    .max(20, "Contact number too long"),
  courseId: z.string().trim().min(1).max(64).optional(),
  courseName: z.string().trim().max(160).optional(),
  enrollmentDate: z.coerce.date().optional(),
});

const photoSchema = z
  .object({
    url: z.string().url(),
    publicId: z.string().min(1).optional(),
  })
  .nullable()
  .optional();

export const studentUpdateSchema = studentCreateSchema.partial().extend({
  photo: photoSchema,
  certificateUrl: z.string().optional(),
  resultUrl: z.string().optional(),
});

export const certificateCreateSchema = z.object({
  studentId: z.string().optional(),
  rollNumber: z.string().trim().min(2).max(64).optional(),
  certificateNumber: z
    .string()
    .trim()
    .min(3)
    .max(64)
    .transform(normalizeCertificateNumber)
    .optional(),
  courseName: z.string().trim().min(2).max(160),
  issueDate: z.coerce.date().optional(),
  status: z.enum(["draft", "issued", "revoked"]).default("issued"),
  fileUrl: z.string().optional(),
  publicId: z.string().optional(),
});

export const certificateUpdateSchema = z.object({
  certificateNumber: z
    .string()
    .trim()
    .min(3)
    .max(64)
    .transform(normalizeCertificateNumber)
    .optional(),
  courseName: z.string().trim().min(2).max(160).optional(),
  issueDate: z.coerce.date().optional(),
  status: z.enum(["draft", "issued", "revoked"]).optional(),
  file: z.object({ url: z.string(), publicId: z.string().optional() }).optional(),
});

export const resultCreateSchema = z.object({
  studentId: z.string().optional(),
  rollNumber: z.string().trim().min(2).max(64).optional(),
  examName: z.string().trim().max(160).optional(),
  resultDate: z.coerce.date().optional(),
  resultUrl: z.string().optional(),
  resultPublicId: z.string().optional(),
  marksObtained: z.coerce.number().min(0).optional(),
  maxMarks: z.coerce.number().min(1).optional(),
  publicationStatus: z.enum(["draft", "published"]).default("published"),
  showPhotoPublicly: z.boolean().optional().default(false),
});

export const resultUpdateSchema = resultCreateSchema.partial();

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(200).default(50),
  q: z.string().trim().max(120).optional(),
});

export async function parseJsonBody(request, schema) {
  let body;
  try {
    body = await request.json();
  } catch {
    return { success: false, error: "Invalid JSON body." };
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues.map((i) => i.message).join("; ");
    return { success: false, error: message };
  }
  return { success: true, data: parsed.data };
}
