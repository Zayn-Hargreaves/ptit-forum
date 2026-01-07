import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const GUEST_ROUTES = new Set(['/login', '/register', '/verify-email', '/forgot-password']);
const PUBLIC_ROUTES = new Set(['/', '/documents', ...GUEST_ROUTES]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    new RegExp(/\.(png|jpg|jpeg|gif|svg|webp|ico)$/i).exec(pathname)
  ) {
    return NextResponse.next();
  }

  const isAuth = request.cookies.has('accessToken');
  const isPublicRoute = PUBLIC_ROUTES.has(pathname);
  const isGuestRoute = GUEST_ROUTES.has(pathname);

  // 1. Redirect unauthenticated users trying to access private routes
  if (!isPublicRoute && !isAuth) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // 2. Redirect authenticated users trying to access guest-only routes (e.g. login)
  if (isGuestRoute && isAuth) {
    return NextResponse.redirect(new URL('/forum', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
