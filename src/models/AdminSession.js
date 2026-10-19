import mongoose from "mongoose";

const AdminSessionSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
      index: true,
    },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true, collection: "admin_sessions" },
);

AdminSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default
  mongoose.models.AdminSession ||
  mongoose.model("AdminSession", AdminSessionSchema);
