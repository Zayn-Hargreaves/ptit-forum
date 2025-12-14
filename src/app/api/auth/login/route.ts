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
    const errorText = await resBackend.text();
    console.log("Backend Login Error:", errorText);
    return new NextResponse(
      JSON.stringify({ error: "Authentication failed" }),
      {
        status: resBackend.status,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const backendData = await resBackend.json();
  if (
    !backendData?.result?.tokenResponse?.accessToken ||
    !backendData?.result?.tokenResponse?.refreshToken ||
    !backendData?.result?.userResponse
  ) {
    console.error("Invalid backend response structure:", backendData);
    return new NextResponse(
      JSON.stringify({ error: "Invalid authentication response" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
  const { result } = backendData;
  const { accessToken, refreshToken } = result.tokenResponse;
  const user = result.userResponse;

  const response = NextResponse.json({ user });

  const isProd = process.env.NODE_ENV === "production";

  response.cookies.set("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    path: "/",
    maxAge: 15 * 60,
  });

  response.cookies.set("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
