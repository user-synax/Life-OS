import { NextResponse } from 'next/server';
import { verifyToken } from './src/lib/auth/jwt';

export async function middleware(req) {
  // Middleware disabled - using localStorage fallback for authentication
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|_rsc).*)'],
};
