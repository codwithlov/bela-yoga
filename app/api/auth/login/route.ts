import {
  assertValidCsrf,
  createDbSession,
  createSessionToken,
  csrfCookieOptions,
  getCsrfTokenFromRequest,
  sessionCookieOptions,
} from "@/lib/auth";
import { CSRF_COOKIE_NAME, SESSION_COOKIE_NAME } from "@/lib/auth-shared";
import { connectToDatabase } from "@/lib/db";
import { clearLoginRateLimit, consumeLoginRateLimit } from "@/lib/rate-limit";
import { getRequestFingerprint } from "@/lib/request";
import { ensureSeedData } from "@/lib/seed";
import { loginSchema } from "@/lib/validators";
import { User } from "@/models/User";
import { compareSync } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await connectToDatabase();
  await ensureSeedData();

  const csrfError = assertValidCsrf(request);
  if (csrfError) {
    return csrfError;
  }

  const body = await request.json();
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Dữ liệu đăng nhập không hợp lệ." }, { status: 400 });
  }

  const fingerprint = getRequestFingerprint(request, parsed.data.username);
  const rateLimit = await consumeLoginRateLimit(fingerprint);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { message: `Đăng nhập tạm thời bị khoá. Thử lại sau ${rateLimit.retryAfterSeconds} giây.` },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfterSeconds),
        },
      },
    );
  }

  const user = await User.findOne({ username: parsed.data.username });

  if (!user || !compareSync(parsed.data.password, user.passwordHash)) {
    return NextResponse.json({ message: "Sai tài khoản hoặc mật khẩu." }, { status: 401 });
  }

  if (user.role !== "ADMIN") {
    return NextResponse.json({ message: "Chỉ tài khoản ADMIN được phép đăng nhập quản trị." }, { status: 403 });
  }

  const session = await createDbSession({
    userId: String(user._id),
    ipAddress: fingerprint.ipAddress,
    userAgent: fingerprint.userAgent,
  });

  const token = await createSessionToken({
    id: String(user._id),
    username: user.username,
    role: user.role,
  }, session.id);

  const csrfToken = getCsrfTokenFromRequest(request);
  await clearLoginRateLimit(fingerprint);

  const response = NextResponse.json({
    message: "Đăng nhập thành công.",
    user: {
      id: String(user._id),
      username: user.username,
      role: user.role,
    },
  });

  response.cookies.set(SESSION_COOKIE_NAME, token, sessionCookieOptions());
  response.cookies.set(CSRF_COOKIE_NAME, csrfToken, csrfCookieOptions());
  return response;
}