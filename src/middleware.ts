import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');

  // Kalau tidak ada token dan akses halaman dashboard → redirect ke login
  if (!token && request.nextUrl.pathname.startsWith('/students')) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/students/:path*'], // Halaman yang perlu login
};
