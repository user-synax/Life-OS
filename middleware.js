import { NextResponse } from 'next/server';

export async function middleware(req) {
  const token = req.cookies.get('token')?.value;
  const { pathname } = req.nextUrl;

  // Paths that don't require authentication
  const isPublicPath = pathname === '/login' || pathname === '/register';

  // If path is protected and no token, redirect to login
  if (!isPublicPath && !token && (pathname.startsWith('/dashboard') || pathname === '/')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // If token exists and path is login/register, redirect to dashboard
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register', '/'],
};
