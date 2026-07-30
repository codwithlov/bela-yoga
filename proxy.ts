import { CSRF_COOKIE_NAME, SESSION_COOKIE_NAME } from '@/lib/auth-shared';
import { NextRequest, NextResponse } from 'next/server';

type ProxyPayload = {
    role?: string;
    sid?: string;
    sub?: string;
    exp?: number;
};

function decodeBase64Url(value: string) {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    return atob(padded);
}

function readJwtPayload(token: string): ProxyPayload | null {
    const parts = token.split('.');
    if (parts.length !== 3) {
        return null;
    }

    try {
        return JSON.parse(decodeBase64Url(parts[1])) as ProxyPayload;
    } catch {
        return null;
    }
}

function unauthorizedApi() {
    return NextResponse.json({ message: 'Chưa đăng nhập hoặc phiên không hợp lệ.' }, { status: 401 });
}

function attachCsrfCookie(request: NextRequest, response: NextResponse) {
    const hasCookie = request.cookies.get(CSRF_COOKIE_NAME)?.value;
    if (!hasCookie && ['GET', 'HEAD'].includes(request.method)) {
        response.cookies.set(CSRF_COOKIE_NAME, crypto.randomUUID(), {
            httpOnly: false,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 60 * 60 * 12,
        });
    }

    return response;
}

async function hasValidAdminToken(request: NextRequest) {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!token) {
        return false;
    }

    const payload = readJwtPayload(token);
    if (!payload) {
        return false;
    }

    if (!payload.sub || !payload.sid || payload.role !== 'ADMIN') {
        return false;
    }

    if (typeof payload.exp === 'number' && payload.exp * 1000 <= Date.now()) {
        return false;
    }

    return true;
}

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    if (pathname === '/login' || pathname.startsWith('/admin') || pathname.startsWith('/user')) {
        return attachCsrfCookie(request, NextResponse.next());
    }

    const protectedArea = pathname.startsWith('/dashboard') || pathname.startsWith('/api/admin');
    if (!protectedArea) {
        return NextResponse.next();
    }

    const validToken = await hasValidAdminToken(request);
    if (!validToken) {
        if (pathname.startsWith('/api/admin')) {
            return unauthorizedApi();
        }

        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('next', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return attachCsrfCookie(request, NextResponse.next());
}

export const config = {
    matcher: ['/login', '/admin/:path*', '/dashboard/:path*', '/api/admin/:path*'],
};