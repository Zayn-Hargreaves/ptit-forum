import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.INTERNAL_BACKEND_URL || process.env.BACKEND_URL;
if (!BACKEND_URL) {
  throw new Error("❌ MISSING ENV: INTERNAL_BACKEND_URL is not defined");
}

async function refreshTokens(refreshToken: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      console.error(`[Refresh] Failed with status: ${res.status}`);
      return null;
    }

    const data = await res.json();
    return data.result;
  } catch (error) {
    console.error("[Refresh] Network error:", error);
    return null;
  }
}

async function handleProxy(req: NextRequest, params: { path: string[] }) {
  const path = params.path.join("/");
  const url = `${BACKEND_URL}/${path}${req.nextUrl.search}`;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const headers = new Headers(req.headers);
  headers.delete("host");
  headers.delete("cookie");

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  let backendRes = await fetch(url, {
    method: req.method,
    headers: headers,
    body:
      req.method !== "GET" && req.method !== "HEAD"
        ? await req.clone().arrayBuffer()
        : undefined,
    cache: "no-store",
    redirect: "manual",
  });

  if (backendRes.status === 401 && refreshToken) {
    console.log("[Proxy] Token expired. Refreshing...");

    const newTokens = await refreshTokens(refreshToken);

    if (newTokens && newTokens.accessToken) {
      console.log("[Proxy] Refresh success. Retrying request...");

      headers.set("Authorization", `Bearer ${newTokens.accessToken}`);

      backendRes = await fetch(url, {
        method: req.method,
        headers: headers,
        body:
          req.method !== "GET" && req.method !== "HEAD"
            ? await req.clone().arrayBuffer()
            : undefined,
        cache: "no-store",
      });

      return copyResponseWithNewCookies(backendRes, newTokens);
    } else {
      console.log("[Proxy] Refresh failed. Session expired.");

      const response = NextResponse.json(
        { message: "Session expired, please login again" },
        { status: 401 }
      );

      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");

      return response;
    }
  }

  const response = new NextResponse(backendRes.body, {
    status: backendRes.status,
    statusText: backendRes.statusText,
  });

  const safeHeaders = ["content-type", "content-length", "content-disposition"];
  safeHeaders.forEach((key) => {
    if (backendRes.headers.has(key)) {
      response.headers.set(key, backendRes.headers.get(key)!);
    }
  });

  return response;
}

function copyResponseWithNewCookies(backendRes: Response, newTokens: any) {
  const response = new NextResponse(backendRes.body, {
    status: backendRes.status,
    statusText: backendRes.statusText,
  });

  const safeHeaders = ["content-type", "content-length"];
  safeHeaders.forEach((key) => {
    if (backendRes.headers.has(key)) {
      response.headers.set(key, backendRes.headers.get(key)!);
    }
  });

  const isProd = process.env.NODE_ENV === "production";

  response.cookies.set("accessToken", newTokens.accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    path: "/",
    maxAge: 15 * 60,
  });

  if (newTokens.refreshToken) {
    response.cookies.set("refreshToken", newTokens.refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: isProd,
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
  }

  return response;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleProxy(req, await params);
}
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleProxy(req, await params);
}
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleProxy(req, await params);
}
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleProxy(req, await params);
}
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleProxy(req, await params);
}
