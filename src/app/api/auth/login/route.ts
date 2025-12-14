import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL;

export async function POST(req: Request) {
  const body = await req.json();

  const resBackend = await fetch(`${BACKEND_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!resBackend.ok) {
    return new NextResponse(await resBackend.text(), {
      status: resBackend.status,
    });
  }

  const data = await resBackend.json();
  const response = NextResponse.json({ user: data.user });

  const isProd = process.env.NODE_ENV === "production";

  response.cookies.set("accessToken", data.accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    path: "/",
    maxAge: 60 * 60,
  });

  response.cookies.set("refreshToken", data.refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
