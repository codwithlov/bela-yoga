import type { UserRole } from "@/types/admin";

export const SESSION_COOKIE_NAME = "vcb_admin_session";
export const CSRF_COOKIE_NAME = "vcb_admin_csrf";
export const CSRF_HEADER_NAME = "x-csrf-token";
export const SESSION_TTL_SECONDS = 60 * 60 * 12;

export type TokenPayload = {
  role: UserRole;
  username: string;
  sid: string;
};

export function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is required for authentication.");
  }
  return new TextEncoder().encode(secret);
}