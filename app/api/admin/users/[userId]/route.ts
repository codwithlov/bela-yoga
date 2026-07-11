import { assertValidCsrf, getSessionFromRequest } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { serializeUser } from "@/lib/serializers";
import { updateUserSchema } from "@/lib/validators";
import { User } from "@/models/User";
import { hashSync } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";

type RouteContext = {
  params: Promise<{ userId: string }>;
};

export async function PUT(request: NextRequest, context: RouteContext) {
  const csrfError = assertValidCsrf(request);
  if (csrfError) {
    return csrfError;
  }

  const session = await getSessionFromRequest(request);

  if (session?.role !== "ADMIN") {
    return NextResponse.json({ message: "Không có quyền truy cập." }, { status: 401 });
  }

  const { userId } = await context.params;
  if (!isValidObjectId(userId)) {
    return NextResponse.json({ message: "User ID không hợp lệ." }, { status: 400 });
  }

  await connectToDatabase();

  const body = await request.json();
  const parsed = updateUserSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Dữ liệu user không hợp lệ." }, { status: 400 });
  }

  const current = await User.findById(userId);
  if (!current) {
    return NextResponse.json({ message: "Không tìm thấy user." }, { status: 404 });
  }

  if (parsed.data.username && parsed.data.username !== current.username) {
    const existing = await User.findOne({ username: parsed.data.username }).lean();
    if (existing) {
      return NextResponse.json({ message: "Username đã tồn tại." }, { status: 409 });
    }
    current.username = parsed.data.username;
  }

  if (parsed.data.fullName !== undefined) current.fullName = parsed.data.fullName;
  if (parsed.data.phone !== undefined) current.phone = parsed.data.phone;
  if (parsed.data.role !== undefined) current.role = parsed.data.role;
  if (parsed.data.password) current.passwordHash = hashSync(parsed.data.password, 10);

  await current.save();
  return NextResponse.json({ data: serializeUser(current.toObject()) });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const csrfError = assertValidCsrf(request);
  if (csrfError) {
    return csrfError;
  }

  const session = await getSessionFromRequest(request);

  if (session?.role !== "ADMIN") {
    return NextResponse.json({ message: "Không có quyền truy cập." }, { status: 401 });
  }

  const { userId } = await context.params;
  if (!isValidObjectId(userId)) {
    return NextResponse.json({ message: "User ID không hợp lệ." }, { status: 400 });
  }

  if (session.id === userId) {
    return NextResponse.json({ message: "Không thể tự xoá tài khoản đang đăng nhập." }, { status: 400 });
  }

  await connectToDatabase();

  const deleted = await User.findByIdAndDelete(userId);
  if (!deleted) {
    return NextResponse.json({ message: "Không tìm thấy user." }, { status: 404 });
  }

  return NextResponse.json({ data: serializeUser(deleted.toObject()) });
}