import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL =
  process.env.INTERNAL_API_URL || process.env.INTERNAL_BACKEND_URL || 'http://localhost:8080/api';

async function handler(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;

  // Reconstruct path
  const pathStr = path.join('/');

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  const url = `${BACKEND_URL}/${pathStr}${req.nextUrl.search}`;

  const headers = new Headers();

  // 1. Forward Authorization
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  // 2. Forward Content-Type if present (crucial for multipart/form-data boundaries)
  const contentType = req.headers.get('content-type');
  if (contentType) {
    headers.set('Content-Type', contentType);
  }

  // 3. Prepare body
  const body = req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined;

  try {
    const response = await fetch(url, {
      method: req.method,
      headers: headers,
      body: body,
      // @ts-expect-error - duplex is required for streaming bodies in Node.js runtime
      duplex: 'half',
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error: unknown) {
    const err = error as Error;
    console.error(`Proxy Error [${req.method} ${pathStr}]:`, err.message);

    return NextResponse.json(
      { message: 'Internal Proxy Error', detail: err.message },
      { status: 500 },
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
