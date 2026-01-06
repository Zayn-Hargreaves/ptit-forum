import axios from 'axios';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  // Await params first
  const { path } = await params;
  const action = path[0]; // 'login' or 'logout'

  if (action === 'login') {
    try {
      const body = await req.json();

      // forward to Spring Boot
      const { data } = await axios.post(`${BACKEND_URL}/auth/login`, body);

      // Spring Boot returns { ..., result: { accessToken: "..." }, ... }
      const accessToken = data.result?.accessToken;

      if (!accessToken) {
        return NextResponse.json({ message: 'Login failed: No token returned' }, { status: 401 });
      }

      const response = NextResponse.json(data);

      // Set HttpOnly Cookie
      // Note: In Next.js 15+, cookies() is awaitable but here we use the response object or cookies().set if accessible.
      // In Route Handlers, cookies() is read-only for request, mutable for response via cookies().set (Next 15 might change this).
      // Standard way in App Router:
      const cookieStore = await cookies();
      cookieStore.set('accessToken', accessToken, {
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 7 days (adjust as needed)
        sameSite: 'lax',
      });

      return response;
    } catch (error: unknown) {
      const err = error as { message?: string; response?: { status?: number; data?: unknown } };
      console.error('Login Proxy Error:', err.response?.data || err.message);
      return NextResponse.json(err.response?.data || { message: 'Login failed' }, {
        status: err.response?.status || 500,
      });
    }
  }

  if (action === 'logout') {
    const cookieStore = await cookies();
    cookieStore.delete('accessToken');
    return NextResponse.json({ message: 'Logged out successfully' });
  }

  return NextResponse.json({ message: 'Invalid auth action' }, { status: 400 });
}
