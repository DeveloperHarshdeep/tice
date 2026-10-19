import { connectDB } from "@/lib/db";
import AdminSettings from "@/models/AdminSettings";

export async function getAdminRegistrationEnabled() {
  await connectDB();
  const settings = await AdminSettings.collection
    .find(
      { $or: [{ id: "admin" }, { _id: "admin" }] },
      { projection: { adminRegistrationEnabled: 1 } },
    )
    .toArray();
  return (
    settings.length > 0 &&
    settings.every((setting) => setting.adminRegistrationEnabled === true)
  );
}
