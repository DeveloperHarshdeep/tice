import mongoose from "mongoose";

const ResultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },
    marksObtained: { type: Number, required: true, min: 0 },
    maxMarks: { type: Number, required: true, min: 1 },
    percentage: { type: Number, required: true, min: 0, max: 100 },
    grade: { type: String, required: true },
    passStatus: { type: String, enum: ["pass", "fail"], required: true },
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
