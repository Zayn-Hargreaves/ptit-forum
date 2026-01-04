import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.INTERNAL_BACKEND_URL || process.env.BACKEND_URL;

const log = (step: string, msg: string, data?: any) => {
  console.log(`\x1b[36m[Proxy ${step}]\x1b[0m ${msg}`, data || '');
};

async function refreshTokens(refreshToken: string) {
  try {
    log('Refresh', 'Attempting to refresh token...');
    const res = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        Cookie: `refreshToken=${refreshToken}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      log('Refresh', `Failed with status: ${res.status}`);
      const text = await res.text();
      log('Refresh', `Error body:`, text);
      return null;
    }

    const data = await res.json();
    log('Refresh', 'Success!');
    return data.result;
  } catch (error) {
    console.error('[Refresh] Error:', error);
    return null;
  }
}

async function handleProxy(req: NextRequest, params: { path: string[] }) {
  const path = params.path.join('/');
  const method = req.method;
  const url = `${BACKEND_URL}/${path}${req.nextUrl.search}`;

  log('In', `Incoming ${method} Request to: ${path}`);

  // 1. Check Cookies
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  log('Auth', `Tokens present? Access: ${!!accessToken}, Refresh: ${!!refreshToken}`);

  // 2. Handle Body
  let requestBody: ArrayBuffer | undefined = undefined;
  if (method !== 'GET' && method !== 'HEAD') {
    try {
      requestBody = await req.arrayBuffer();
      log('Body', `Read body size: ${requestBody.byteLength} bytes`);
    } catch (e) {
      log('Body', 'Error reading body', e);
      return NextResponse.json({ message: 'Failed to read request body' }, { status: 400 });
    }
  }

  // 3. Prepare Headers
  const headers = new Headers(req.headers);
  headers.delete('host');
  headers.delete('cookie');

  headers.delete('content-length');
  headers.delete('content-encoding');

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  // 4. Send to Backend
  let backendRes: Response;
  try {
    backendRes = await fetch(url, {
      method: method,
      headers: headers,
      body: requestBody,
      cache: 'no-store',
      redirect: 'manual',
    });
    log('Backend', `Response Status: ${backendRes.status}`);
  } catch (e) {
    log('Backend', 'Network Error', e);
    return NextResponse.json({ message: 'Proxy Error' }, { status: 500 });
  }

  // 5. Handle 401 & Refresh
  if (backendRes.status === 401) {
    log('401', 'Detected 401. Checking refresh capability...');

    if (refreshToken) {
      const newTokens = await refreshTokens(refreshToken);

      if (newTokens?.accessToken) {
        log('Retry', 'Refreshing successful. Retrying original request...');

        headers.set('Authorization', `Bearer ${newTokens.accessToken}`);

        try {
          backendRes = await fetch(url, {
            method: method,
            headers: headers,
            body: requestBody,
            cache: 'no-store',
            redirect: 'manual',
          });

          log('Retry', `Retry Status: ${backendRes.status}`);

          return copyResponseWithNewCookies(backendRes, newTokens);
        } catch (e) {
          log('Retry', 'Retry Network Error', e);
        }
      } else {
        log('Refresh', 'Refresh failed or returned no tokens. Logout user.');
      }
    } else {
      log('401', 'No refresh token available.');
    }

    return clearCookiesAndReturn401(backendRes);
  }

  return copyResponse(backendRes);
}

// ================= Helpers =================

function copyResponse(backendRes: Response) {
  const response = new NextResponse(backendRes.body, {
    status: backendRes.status,
    statusText: backendRes.statusText,
  });

  copyHeaders(backendRes, response);
  return response;
}

function copyResponseWithNewCookies(backendRes: Response, newTokens: any) {
  const response = copyResponse(backendRes);

  const isProd = process.env.NODE_ENV === 'production';
  if (newTokens.accessToken) {
    response.cookies.set('accessToken', newTokens.accessToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: isProd,
      path: '/',
      maxAge: 15 * 60,
    });
  }

  if (newTokens.refreshToken) {
    response.cookies.set('refreshToken', newTokens.refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: isProd,
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });
  }

  return response;
}

function clearCookiesAndReturn401(backendRes: Response) {
  const response = new NextResponse(backendRes.body, {
    status: backendRes.status,
    statusText: backendRes.statusText,
  });

  copyHeaders(backendRes, response);

  response.cookies.set('accessToken', '', { maxAge: 0, path: '/' });
  response.cookies.set('refreshToken', '', { maxAge: 0, path: '/' });

  return response;
}

function copyHeaders(source: Response, target: NextResponse) {
  ['content-type', 'content-length', 'content-disposition'].forEach((key) => {
    if (source.headers.has(key)) {
      target.headers.set(key, source.headers.get(key)!);
    }
  });
}

// Next.js 15+ Params handling
export async function GET(req: NextRequest, { params }: any) {
  return handleProxy(req, await params);
}
export async function POST(req: NextRequest, { params }: any) {
  return handleProxy(req, await params);
}
export async function PUT(req: NextRequest, { params }: any) {
  return handleProxy(req, await params);
}
export async function DELETE(req: NextRequest, { params }: any) {
  return handleProxy(req, await params);
}
export async function PATCH(req: NextRequest, { params }: any) {
  return handleProxy(req, await params);
}
