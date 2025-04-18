import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /admin, /admin/dashboard)
  const path = request.nextUrl.pathname;
  
  // If it's an admin route and not the login page
  if (path.startsWith('/admin') && path !== '/admin/login') {
    // Check if the user has a token in the cookies
    // For Firebase auth, you typically check for a session cookie or token
    const token = request.cookies.get('auth-token')?.value;
    
    // If there's no token, redirect to the login page
    if (!token) {
      const url = new URL('/admin/login', request.url);
      // You can pass the original URL as a parameter to redirect back after login
      url.searchParams.set('from', path);
      return NextResponse.redirect(url);
    }
    
    // If there is a token, continue to the page
    return NextResponse.next();
  }
  
  // Continue for non-admin routes
  return NextResponse.next();
}

// Configure middleware to run only on specific paths
export const config = {
  matcher: [
    // Match all admin routes except login
    '/admin/:path*',
    // Exclude api routes and static files
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};