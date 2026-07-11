import {
  CSRF_COOKIE_NAME,
  CSRF_HEADER_NAME,
  getAuthSecret,
  SESSION_COOKIE_NAME,
  SESSION_TTL_SECONDS,
  type TokenPayload,
} from "@/lib/auth-shared";
import { connectToDatabase } from "@/lib/db";
import { getRequestOrigin } from "@/lib/request";
import { Session } from "@/models/Session";
import { User } from "@/models/User";
import type { SessionUser, UserRole } from "@/types/admin";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
type AuthenticatedSession = SessionUser & {
  sessionId: string;
};

export async function createSessionToken(user: SessionUser, sessionId: string) {
  return new SignJWT({ role: user.role, username: user.username, sid: sessionId })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getAuthSecret());
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  };
}

export function csrfCookieOptions() {
  return {
    httpOnly: false,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  };
}

export function getCsrfTokenFromRequest(request: NextRequest) {
  return request.cookies.get(CSRF_COOKIE_NAME)?.value || crypto.randomUUID();
}

function verifyCsrfOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  const hostOrigin = getRequestOrigin(request);

  if (!origin || !hostOrigin) {
    return false;
  }

  return origin === hostOrigin;
}

export function assertValidCsrf(request: NextRequest) {
  const cookieToken = request.cookies.get(CSRF_COOKIE_NAME)?.value;
  const headerToken = request.headers.get(CSRF_HEADER_NAME);

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return NextResponse.json({ message: "CSRF token không hợp lệ." }, { status: 403 });
  }

  if (!verifyCsrfOrigin(request)) {
    return NextResponse.json({ message: "Origin không hợp lệ." }, { status: 403 });
  }

  return null;
}

async function verifyToken(token: string | undefined): Promise<AuthenticatedSession | null> {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getAuthSecret());
    const typedPayload = payload as TokenPayload & { sub?: string };
    if (!typedPayload.sub || !typedPayload.username || !typedPayload.role || !typedPayload.sid) {
      return null;
    }

    return {
      id: typedPayload.sub,
      username: typedPayload.username,
      role: typedPayload.role,
      sessionId: typedPayload.sid,
    };
  } catch {
    return null;
  }
}

async function validateSession(token: string | undefined): Promise<AuthenticatedSession | null> {
  const decoded = await verifyToken(token);
  if (!decoded) return null;

  await connectToDatabase();

  const sessionRecord = await Session.findById(decoded.sessionId);
  if (!sessionRecord || sessionRecord.revokedAt) {
    return null;
  }

  const now = new Date();
  if (sessionRecord.expiresAt <= now) {
    await Session.findByIdAndUpdate(decoded.sessionId, { revokedAt: now });
    return null;
  }

  const user = await User.findById(sessionRecord.userId);
  if (!user || user.role !== "ADMIN") {
    return null;
  }

  await Session.findByIdAndUpdate(decoded.sessionId, { lastSeenAt: now });

  return {
    id: String(user._id),
    username: user.username,
    role: user.role,
    sessionId: decoded.sessionId,
  };
}

export async function createDbSession(params: {
  userId: string;
  ipAddress?: string;
  userAgent?: string;
}) {
  await connectToDatabase();

  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000);
  const session = await Session.create({
    userId: params.userId,
    expiresAt,
    ipAddress: params.ipAddress,
    userAgent: params.userAgent,
    lastSeenAt: new Date(),
  });

  return {
    id: String(session._id),
    expiresAt,
  };
}

export async function revokeSession(sessionId: string) {
  await connectToDatabase();
  await Session.findByIdAndUpdate(sessionId, { revokedAt: new Date() });
}

export async function getSession() {
  const cookieStore = await cookies();
  return validateSession(cookieStore.get(SESSION_COOKIE_NAME)?.value);
}

export async function getSessionFromRequest(request: NextRequest) {
  return validateSession(request.cookies.get(SESSION_COOKIE_NAME)?.value);
}

export async function requireAdminPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    redirect("/login");
  }
  return session;
}