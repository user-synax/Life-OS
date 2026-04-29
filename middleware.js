import { NextResponse } from 'next/server';
import { verifyToken } from './src/lib/auth/jwt';

export async function middleware(req) {
  const token = req.cookies.get('token')?.value;
  const { pathname } = req.nextUrl;
  const hasJWTSecret = !!process.env.JWT_SECRET;
  const isProduction = process.env.NODE_ENV === 'production';

  // Paths that don't require authentication
  const isPublicPath = pathname === '/login' || pathname === '/register';

  // In production, JWT_SECRET must be set
  if (isProduction && !hasJWTSecret) {
    console.error('JWT_SECRET is not set in production. Authentication will fail.');
    // Allow request to proceed but login will fail at API level
    return NextResponse.next();
  }

  // Skip JWT validation in development if JWT_SECRET is not set
  if (!hasJWTSecret) {
    // Allow access to all routes when JWT_SECRET is not set (development mode)
    return NextResponse.next();
  }

  // If path is protected and no token, redirect to login
  if (!isPublicPath && !token && (pathname.startsWith('/dashboard') || pathname === '/')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // If token exists, validate it
  if (token) {
    const decoded = verifyToken(token);
    
    // If token is invalid/expired and trying to access protected route
    if (!decoded && !isPublicPath && (pathname.startsWith('/dashboard') || pathname === '/')) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    
    // If token is valid and path is login/register, redirect to dashboard
    if (decoded && isPublicPath) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register', '/'],
};
