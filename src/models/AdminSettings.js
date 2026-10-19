import mongoose from "mongoose";

const AdminSettingsSchema = new mongoose.Schema(
  {
    id: { type: String, default: "admin" },
    adminRegistrationEnabled: { type: Boolean, default: false },
  },
  { timestamps: true, collection: "settings", versionKey: false },
);

export default
  mongoose.models.AdminSettings ||
  mongoose.model("AdminSettings", AdminSettingsSchema);
