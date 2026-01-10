import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  if (
    request.nextUrl.pathname.startsWith('/terms') ||
    request.nextUrl.pathname.startsWith('/privacy')
  ) {
    response.cookies.set('force-theme', 'light');
  } else {
    response.cookies.delete('force-theme');
  }

  return response;
}

export const config = {
  matcher: ['/terms/:path*', '/privacy/:path*'],
};
