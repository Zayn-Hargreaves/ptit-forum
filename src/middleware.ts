import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Protected routes that require authentication.
 * @type {string[]}
 */
const PROTECTED_ROUTES = ["/forum", "/profile", "/settings"];

/**
 * Routes that do not require authentication.
 * @type {string[]}
 */
const AUTH_ROUTES = ["/auth/login", "/landing", "/register"];

/**
 * Middleware to handle authentication logic for incoming requests.
 *
 * @param {NextRequest} request - The incoming request object from Next.js.
 * @returns {NextResponse} - The response object, either redirecting or continuing the request.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const isAuth = !!(accessToken || refreshToken);

  // Redirect unauthenticated users trying to access protected routes.
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route)) && !isAuth) {
    const url = new URL("/auth/login", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users trying to access authentication routes.
  if (AUTH_ROUTES.some((route) => pathname.includes(route)) && isAuth) {
    return NextResponse.redirect(new URL("/forum", request.url));
  }

  return NextResponse.next();
}

/**
 * Configuration for the middleware.
 * Specifies which routes the middleware should apply to.
 *
 * @type {{ matcher: string[] }}
 */
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
