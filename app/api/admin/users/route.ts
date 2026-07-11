import { assertValidCsrf, getSessionFromRequest } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { ensureSeedData } from "@/lib/seed";
import { serializeUser } from "@/lib/serializers";
import { createUserSchema } from "@/lib/validators";
import { User } from "@/models/User";
import { hashSync } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);

  if (session?.role !== "ADMIN") {
    return NextResponse.json({ message: "Không có quyền truy cập." }, { status: 401 });
  }

  await connectToDatabase();
  await ensureSeedData();

  const users = await User.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ data: users.map(serializeUser) });
}

export async function POST(request: NextRequest) {
  const csrfError = assertValidCsrf(request);
  if (csrfError) {
    return csrfError;
  }

  const session = await getSessionFromRequest(request);

  if (session?.role !== "ADMIN") {
    return NextResponse.json({ message: "Không có quyền truy cập." }, { status: 401 });
  }

  await connectToDatabase();

  const body = await request.json();
  const parsed = createUserSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Dữ liệu user không hợp lệ." }, { status: 400 });
  }

  const existing = await User.findOne({ username: parsed.data.username }).lean();
  if (existing) {
    return NextResponse.json({ message: "Username đã tồn tại." }, { status: 409 });
  }

  const created = await User.create({
    username: parsed.data.username,
    fullName: parsed.data.fullName,
    phone: parsed.data.phone,
    role: parsed.data.role,
    passwordHash: hashSync(parsed.data.password, 10),
  });

  return NextResponse.json({ data: serializeUser(created.toObject()) }, { status: 201 });
}