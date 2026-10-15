import { connectDB } from "@/lib/db";
import Enquiry from "@/models/Enquiry";
import { jsonError, jsonSuccess } from "@/lib/api-response";
import { parseJsonBody, enquirySchema } from "@/lib/validation";
import { getClientIp, rateLimit, verifySameOrigin } from "@/lib/rate-limit";

export async function POST(request) {
  if (!verifySameOrigin(request)) {
    return jsonError("Invalid request origin.", 403);
  }

  const ip = getClientIp(request);
  const rl = await rateLimit(`enquiry:${ip}`, { limit: 5, windowMs: 60 * 60_000 });
  if (!rl.success) {
    return jsonError("Too many enquiries submitted. Please try again later.", 429);
  }

  const parsed = await parseJsonBody(request, enquirySchema);
  if (!parsed.success) return jsonError(parsed.error, 400);

  const { name, phone, email, courseOfInterest, message } = parsed.data;

  try {
    await connectDB();
    await Enquiry.create({
      name,
      phone: phone || undefined,
      email: email || undefined,
      courseOfInterest: courseOfInterest || undefined,
      message,
      ip,
    });
    return jsonSuccess({ submitted: true });
  } catch (error) {
    console.error("Enquiry error:", error.message);
    return jsonError("Unable to submit your enquiry. Please try again.", 500);
  }
}
