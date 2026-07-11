import { assertValidCsrf, getSessionFromRequest } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { serializeBank } from "@/lib/serializers";
import { updateBankSchema } from "@/lib/validators";
import { Bank } from "@/models/Bank";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ bankId: string }>;
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

  const { bankId } = await context.params;
  await connectToDatabase();

  const body = await request.json();
  const parsed = updateBankSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Dữ liệu ngân hàng không hợp lệ." }, { status: 400 });
  }

  const current = await Bank.findOne({ bankId });
  if (!current) {
    return NextResponse.json({ message: "Không tìm thấy ngân hàng." }, { status: 404 });
  }

  const targetId = parsed.data.id ?? current.bankId;
  const targetCode = parsed.data.code ?? current.code;
  const targetBin = parsed.data.bin ?? current.bin;

  const duplicate = await Bank.findOne({
    bankId: { $ne: current.bankId },
    $or: [{ bankId: targetId }, { code: targetCode }],
  }).lean();

  if (duplicate) {
    return NextResponse.json({ message: "id hoặc code đang bị trùng với ngân hàng khác." }, { status: 409 });
  }

  current.bankId = targetId;
  current.name = parsed.data.name ?? current.name;
  current.bin = targetBin;
  current.code = targetCode;
  current.shortName = parsed.data.short_name ?? current.shortName;
  current.logoUrl = parsed.data.logo_url ?? current.logoUrl;
  current.iconUrl = parsed.data.icon_url ?? current.iconUrl;
  current.lookupSupported = parsed.data.lookup_supported !== undefined ? parsed.data.lookup_supported === 1 : current.lookupSupported;
  current.swiftCode = parsed.data.swift_code ?? current.swiftCode;

  await current.save();
  return NextResponse.json({ data: serializeBank(current.toObject()) });
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

  const { bankId } = await context.params;
  await connectToDatabase();

  const deleted = await Bank.findOneAndDelete({ bankId });
  if (!deleted) {
    return NextResponse.json({ message: "Không tìm thấy ngân hàng." }, { status: 404 });
  }

  return NextResponse.json({ data: serializeBank(deleted.toObject()) });
}