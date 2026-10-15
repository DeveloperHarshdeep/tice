/**
 * Bootstrap the single administrator account.
 * Usage: npm run create-admin
 */
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error(
    "Missing required env: MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD",
  );
  process.exit(1);
}

if (ADMIN_PASSWORD.length < 8) {
  console.error("ADMIN_PASSWORD must be at least 8 characters.");
  process.exit(1);
}

const AdminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    name: { type: String, default: "Administrator" },
  },
  { timestamps: true },
);

const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

async function main() {
  await mongoose.connect(MONGODB_URI);

  const existing = await Admin.findOne({});
  if (existing) {
    console.error(
      "An administrator already exists. Refusing to overwrite or create another account.",
    );
    await mongoose.disconnect();
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await Admin.create({
    email: ADMIN_EMAIL.toLowerCase().trim(),
    passwordHash,
  });

  console.log("Administrator account created successfully.");
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
