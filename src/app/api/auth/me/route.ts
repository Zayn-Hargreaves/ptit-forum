import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const getApiUrl = () => process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

export async function GET() {
  const cookieStore = cookies();
  const accessToken = (await cookieStore).get("accessToken")?.value;
  const refreshToken = (await cookieStore).get("refreshToken")?.value;

  if (!accessToken && !refreshToken) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const baseUrl = getApiUrl();

  const fetchMe = async (token: string) => {
    return fetch(`${baseUrl}/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
  };

  try {
    let res = accessToken ? await fetchMe(accessToken) : null;

    if (!res || res.status === 401) {
      if (!refreshToken) {
        return NextResponse.json({ user: null }, { status: 401 });
      }

      console.log("Access Token expired, refreshing on server...");

      const refreshRes = await fetch(`${baseUrl}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
        cache: "no-store",
      });

      if (!refreshRes.ok) {
        return NextResponse.json({ user: null }, { status: 401 });
      }

      const refreshData = await refreshRes.json();
      const newAccessToken = refreshData.accessToken;

      if (!newAccessToken) {
        return NextResponse.json({ user: null }, { status: 401 });
      }

      res = await fetchMe(newAccessToken);

      if (!res.ok) {
        return NextResponse.json({ user: null }, { status: 401 });
      }

      const payload = await res.json();
      const user = payload?.data?.user ?? payload?.user ?? null;

      const response = NextResponse.json({ user }, { status: 200 });

      response.cookies.set("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60,
      });

      if (refreshData.refreshToken) {
        response.cookies.set("refreshToken", refreshData.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        });
      }

      return response;
    }

    const payload = await res.json();
    const user = payload?.data?.user ?? payload?.user ?? null;
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error(" BFF /api/auth/me error:", error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
