import mongoose from "mongoose";

const ResultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },
    courseId: { type: String, trim: true },
    courseName: { type: String, required: true, trim: true },
    examName: { type: String, trim: true },
    resultDate: { type: Date },
    marksObtained: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator(value) {
          const maxMarks = this.get("maxMarks");
          return maxMarks == null || value <= maxMarks;
        },
        message: "Obtained marks cannot exceed maximum marks.",
      },
    },
    maxMarks: { type: Number, required: true, min: 1 },
    percentage: { type: Number, required: true, min: 0, max: 100 },
    passingPercentage: { type: Number, required: true, min: 0, max: 100 },
    grade: { type: String, required: true, trim: true },
    passStatus: { type: String, enum: ["pass", "fail"], required: true },
    resultUrl: { type: String, trim: true },
    resultPublicId: { type: String, trim: true },
    publicationStatus: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      index: true,
    },
    publishedAt: { type: Date },
    showPhotoPublicly: { type: Boolean, default: false },
  },
  { timestamps: true },
);

ResultSchema.index({ student: 1, publicationStatus: 1 });

export default mongoose.models.Result || mongoose.model("Result", ResultSchema);
