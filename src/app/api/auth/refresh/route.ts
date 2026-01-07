import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
} from "@shared/constants/constants";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { message: "No refresh token available" },
      { status: 401 }
    );
  }

  try {
    const url = `${process.env.INTERNAL_BACKEND_URL}/auth/refresh`;
    console.log("🔄 Refresh Proxy calling:", url);
    
    const res = await fetch(
      url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `refreshToken=${refreshToken}`,
        },
        body: JSON.stringify({ refreshToken }),
        signal: AbortSignal.timeout(10000),
      }
    );


    const data = await res.json();

    if (!res.ok || data.code !== 1000) {
      // ⚠️ WARNING: Don't delete cookies immediately. Log for debug.
      console.error("❌ Refresh Token Failed from Backend:", {
        status: res.status,
        backendResponse: data,
        sentRefreshToken: refreshToken ? "Present" : "Missing"
      });

      // Only delete if explicitly unauthorized or session broken (e.g. specific error code)
      // For now, we return 401 and let the frontend handle the redirect if needed.
      cookieStore.delete("accessToken");
      cookieStore.delete("refreshToken");

      return NextResponse.json(
        { message: data.message || "Refresh failed" },
        { status: 401 }
      );
    }

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      data.result;

    if (!newAccessToken || !newRefreshToken) {
      console.error("Backend response missing tokens:", data);
      return NextResponse.json(
        { message: "Invalid backend response" },
        { status: 502 }
      );
    }

    const response = NextResponse.json({ success: true });
    const isProduction = process.env.NODE_ENV === "production";

    response.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: ACCESS_TOKEN_EXPIRY,
    });

    response.cookies.set("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: REFRESH_TOKEN_EXPIRY,
    });

    return response;
  } catch (error) {
    console.error("Refresh Proxy Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
