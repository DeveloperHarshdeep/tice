import mongoose from "mongoose";

const FileSchema = new mongoose.Schema(
  {
    url: String,
    publicId: String,
  },
  { _id: false },
);

const CertificateSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },
    courseId: { type: String, trim: true },
    certificateNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    courseName: { type: String, required: true, trim: true },
    file: FileSchema,
    issueDate: { type: Date },
    status: {
      type: String,
      enum: ["draft", "issued", "revoked"],
      default: "draft",
      index: true,
    },
    revokedAt: { type: Date },
  },
  { timestamps: true },
);

export default mongoose.models.Certificate ||
  mongoose.model("Certificate", CertificateSchema);
