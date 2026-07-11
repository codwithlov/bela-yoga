import { assertValidCsrf, getSessionFromRequest } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { ensureSeedData } from "@/lib/seed";
import { serializeBank } from "@/lib/serializers";
import { createBankSchema } from "@/lib/validators";
import { Bank } from "@/models/Bank";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);

  if (session?.role !== "ADMIN") {
    return NextResponse.json({ message: "Không có quyền truy cập." }, { status: 401 });
  }

  await connectToDatabase();
  await ensureSeedData();

  const banks = await Bank.find().sort({ name: 1 }).lean();
  return NextResponse.json({ data: banks.map(serializeBank) });
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
  const parsed = createBankSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Dữ liệu ngân hàng không hợp lệ." }, { status: 400 });
  }

  const existing = await Bank.findOne({
    $or: [{ bankId: parsed.data.id }, { code: parsed.data.code }],
  }).lean();

  if (existing) {
    return NextResponse.json({ message: "Ngân hàng với id hoặc code này đã tồn tại." }, { status: 409 });
  }

  const created = await Bank.create({
    bankId: parsed.data.id,
    name: parsed.data.name,
    bin: parsed.data.bin,
    code: parsed.data.code,
    shortName: parsed.data.short_name,
    logoUrl: parsed.data.logo_url,
    iconUrl: parsed.data.icon_url,
    lookupSupported: parsed.data.lookup_supported === 1,
    swiftCode: parsed.data.swift_code,
  });

  return NextResponse.json({ data: serializeBank(created.toObject()) }, { status: 201 });
}