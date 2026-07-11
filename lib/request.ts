import type { NextRequest } from "next/server";

export function getClientIp(request: Pick<NextRequest, "headers">) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip") || "unknown";
}

export function getRequestFingerprint(request: Pick<NextRequest, "headers">, username?: string) {
  const ipAddress = getClientIp(request);
  const userAgent = request.headers.get("user-agent") || "unknown";
  const normalizedUsername = username?.trim().toLowerCase() || "anonymous";

  return {
    key: `${ipAddress}:${normalizedUsername}`,
    ipAddress,
    userAgent,
  };
}

export function getRequestOrigin(request: Pick<NextRequest, "headers" | "nextUrl">) {
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const forwardedHost = request.headers.get("x-forwarded-host");

  if (forwardedProto && forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  const host = request.headers.get("host");
  if (!host) {
    return request.nextUrl.origin;
  }

  const proto = forwardedProto || (host.includes("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");
  return `${proto}://${host}`;
}