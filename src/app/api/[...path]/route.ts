import axios from 'axios';
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

  const headers: Record<string, string> = {};

  // 1. Forward Authorization
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  // 2. Handle Content-Type and Body
  const contentType = req.headers.get('content-type');
  let body: unknown = undefined;

  if (req.method !== 'GET' && req.method !== 'DELETE') {
    if (contentType?.includes('multipart/form-data')) {
      // Forward the raw stream/buffer for file uploads
      // IMPORTANT: We must pass the original Content-Type header because it contains the 'boundary'
      headers['Content-Type'] = contentType;

      // Reading as ArrayBuffer is safer for binary data in Edge/Node environments
      const blob = await req.arrayBuffer();
      body = Buffer.from(blob);
    } else {
      // Default to JSON
      headers['Content-Type'] = 'application/json';
      // Attempt to read json, handle empty body case
      try {
        const text = await req.text();
        body = text ? JSON.parse(text) : undefined;
      } catch (_e) {
        console.warn('Failed to parse JSON body, sending undefined');
        body = undefined;
      }
    }
  }

  try {
    const response = await axios({
      method: req.method,
      url: url,
      data: body,
      headers: headers,
      validateStatus: () => true,
      // Important for axios to accept large bodies or binary
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: unknown) {
    const err = error as { message?: string; response?: { status?: number; data?: unknown } };
    console.error(`Proxy Error [${req.method} ${pathStr}]:`, err.message);

    // Better error details
    const status = err.response?.status || 500;
    const data = err.response?.data || { message: 'Internal Proxy Error' };

    return NextResponse.json(data, { status });
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
