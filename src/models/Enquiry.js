import mongoose from "mongoose";

const EnquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    courseOfInterest: { type: String, trim: true },
    message: { type: String, required: true, trim: true },
    ip: { type: String },
  },
  { timestamps: true },
);

export default mongoose.models.Enquiry ||
  mongoose.model("Enquiry", EnquirySchema);
