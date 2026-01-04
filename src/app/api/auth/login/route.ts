import { BackendResponseSchema, loginSchema } from "@shared/validators/auth";
import {
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
} from "@shared/constants/constants";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json(
        { message: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    const res = await fetch(`${process.env.INTERNAL_BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    const parsedData = BackendResponseSchema.safeParse(data);
    if (!parsedData.success) {
      console.error("Backend login contract changed:", parsedData.error);
      return NextResponse.json(
        { message: "Upstream Server Error: Invalid response format" },
        { status: 502 }
      );
    }

    const { accessToken, refreshToken } = parsedData.data.result.tokenResponse;
    const user = parsedData.data.result.userResponse;

    const response = NextResponse.json({ user });

    const isProduction = process.env.NODE_ENV === "production";

    const setAuthCookie = (name: string, value: string, maxAge: number) => {
      response.cookies.set(name, value, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        path: "/",
        maxAge: maxAge,
      });
    };

    setAuthCookie("accessToken", accessToken, ACCESS_TOKEN_EXPIRY);
    setAuthCookie("refreshToken", refreshToken, REFRESH_TOKEN_EXPIRY);

    return response;
  } catch (error) {
    console.error("Login Route Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
