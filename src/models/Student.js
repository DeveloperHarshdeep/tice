import mongoose from "mongoose";

const PhotoSchema = new mongoose.Schema(
  {
    url: String,
    publicId: String,
  },
  { _id: false },
);

const StudentSchema = new mongoose.Schema(
  {
    rollNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    fullName: { type: String, required: true, trim: true },
    fatherName: { type: String, required: true, trim: true },
    contactNumber: { type: String, required: true, trim: true },
    courseId: { type: String, trim: true, default: "basic-computer" },
    courseName: { type: String, trim: true },
    photo: PhotoSchema,
    imageUrl: { type: String, trim: true },

    // Certificate fields (populated upon certificate issuance)
    certificateUrl: { type: String, trim: true },
    certificatePublicId: { type: String, trim: true },
    certificateNumber: { type: String, trim: true, uppercase: true },
    certificateCourseName: { type: String, trim: true },
    certificateIssueDate: { type: Date },
    certificateStatus: {
      type: String,
      enum: ["draft", "issued", "revoked"],
    },

    // Result fields (populated upon result upload or entry)
    resultUrl: { type: String, trim: true },
    resultPublicId: { type: String, trim: true },
    examName: { type: String, trim: true },
    resultDate: { type: Date },
    marksObtained: { type: Number },
    maxMarks: { type: Number },
    percentage: { type: Number },
    grade: { type: String, trim: true },
    resultPublicationStatus: {
      type: String,
      enum: ["draft", "published"],
    },

    enrollmentDate: { type: Date, default: Date.now },
    archived: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

export default mongoose.models.Student ||
  mongoose.model("Student", StudentSchema);
