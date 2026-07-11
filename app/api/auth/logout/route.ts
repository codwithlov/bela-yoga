import {
  assertValidCsrf,
  csrfCookieOptions,
  getSessionFromRequest,
  revokeSession,
  sessionCookieOptions,
} from "@/lib/auth";
import { CSRF_COOKIE_NAME, SESSION_COOKIE_NAME } from "@/lib/auth-shared";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const csrfError = assertValidCsrf(request);
  if (csrfError) {
    return csrfError;
  }

  const session = await getSessionFromRequest(request);
  if (session?.sessionId) {
    await revokeSession(session.sessionId);
  }

  const response = NextResponse.json({ message: "Đã đăng xuất." });
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    ...sessionCookieOptions(),
    maxAge: 0,
  });
  response.cookies.set(CSRF_COOKIE_NAME, "", {
    ...csrfCookieOptions(),
    maxAge: 0,
  });
  return response;
}