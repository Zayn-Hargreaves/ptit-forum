import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
  }

  try {
    const res = await fetch(`${process.env.INTERNAL_BACKEND_URL}/users/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
      }
      return NextResponse.json({ user: null }, { status: res.status });
    }

    const payload = await res.json();
    const data = payload.result;

    // Sanitize & Map Data (BFF Layer)
    const sanitizedUser = {
      id: data.id,
      email: data.email,
      fullName: data.fullName,
      avatarUrl: data.avatar, // Map backend 'avatar' to frontend 'avatarUrl'
      role: data.permissions?.includes("ROLE_ADMIN") ? "ADMIN" : "USER",
      studentCode: data.studentCode,
      classCode: data.classCode,
      facultyName: data.facultyName,
      phone: data.phone,
    };

    return NextResponse.json({ user: sanitizedUser });
  } catch (error) {
    console.error("Auth Me Proxy Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

