import { connectToDatabase } from "@/lib/db";
import { ensureTemplateCmsSeed } from "@/lib/template-cms-repository";
import { User } from "@/models/User";
import { hashSync } from "bcryptjs";

export async function ensureSeedData() {
  await connectToDatabase();

  const adminCount = await User.countDocuments({ role: "ADMIN" });
  if (adminCount === 0) {
    await User.create({
      username: process.env.ADMIN_USERNAME || "admin",
      fullName: "System Administrator",
      phone: process.env.ADMIN_PHONE || "0123456789",
      role: "ADMIN",
      passwordHash: hashSync(process.env.ADMIN_PASSWORD || "admin123456", 10),
    });
  }

  await ensureTemplateCmsSeed();
}