import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = new Set([
  "/",
  "/login",
  "/register",
  "/verify-email",
  "/forgot-password",
]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/_next") || pathname.startsWith("/static")) {
    return NextResponse.next();
  }

  const isAuth = request.cookies.has("refreshToken");
  const isPublicRoute = PUBLIC_ROUTES.has(pathname);

  if (!isPublicRoute && !isAuth) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (isPublicRoute && isAuth && pathname !== "/") {
    return NextResponse.redirect(new URL("/forum", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
