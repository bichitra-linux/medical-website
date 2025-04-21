import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import type { ClerkMiddlewareAuth } from '@clerk/nextjs/server';

// Create explicit route matchers for better type safety
const isPublicRoute = createRouteMatcher([
  '/',
  '/about',
  '/contact',
  '/services(.*)',
  '/doctors(.*)',
  '/appointment(.*)',
  '/blog(.*)',
  '/admin/login',
  '/admin/register',
  '/admin/forgot-password',
  '/api/public(.*)'
]);

const isProtectedRoute = createRouteMatcher([
  '/admin(.*)'
]);

export default clerkMiddleware(async (auth: ClerkMiddlewareAuth, req: NextRequest) => {
  // Handle direct /admin route access - redirect to login page
  const pathname = new URL(req.url).pathname;
  if (pathname === '/admin' || pathname === '/admin/') {
    console.log("Redirecting /admin to /admin/login"); // Debugging log
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }
  // Handle authenticated requests
  if (!(await auth()).userId && isProtectedRoute(req) && !isPublicRoute(req)) {
    const signInUrl = new URL('/admin/login', req.url);
    signInUrl.searchParams.set('redirect_url', req.url);
    return NextResponse.redirect(signInUrl);
  }
  
  // If user is signed in but tries to access auth pages, redirect to dashboard
  if ((await auth()).userId && 
      (req.url.includes('/admin/login') || 
       req.url.includes('/admin/register') || 
       req.url.includes('/admin/forgot-password'))) {
    return NextResponse.redirect(new URL('/admin/dashboard', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)']
};