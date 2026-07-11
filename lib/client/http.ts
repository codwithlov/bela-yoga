"use client";

import { CSRF_COOKIE_NAME, CSRF_HEADER_NAME } from "@/lib/auth-shared";

function getCookieValue(name: string) {
  if (typeof document === "undefined") {
    return "";
  }

  const encodedName = `${encodeURIComponent(name)}=`;
  const cookie = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(encodedName));

  return cookie ? decodeURIComponent(cookie.slice(encodedName.length)) : "";
}

export async function appFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const method = (init.method || "GET").toUpperCase();
  const headers = new Headers(init.headers || {});

  if (!["GET", "HEAD", "OPTIONS"].includes(method)) {
    const csrfToken = getCookieValue(CSRF_COOKIE_NAME);
    if (csrfToken) {
      headers.set(CSRF_HEADER_NAME, csrfToken);
    }
  }

  return fetch(input, {
    ...init,
    credentials: "same-origin",
    headers,
  });
}