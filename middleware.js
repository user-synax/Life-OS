import { NextResponse } from 'next/server';
import { verifyToken } from './src/lib/auth/jwt';

export async function middleware(req) {
  // Temporarily disable middleware to isolate the issue
  console.log('Middleware disabled - Path:', req.nextUrl.pathname);
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|_rsc).*)'],
};
