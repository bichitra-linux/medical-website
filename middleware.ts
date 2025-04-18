import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

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

export default clerkMiddleware({
  // Define routes that don't require authentication
  publicRoutes: [
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
  ],
  
  afterAuth(auth, req, evt) {
    // Handle authenticated requests
    if (!auth.userId && isProtectedRoute(req.url) && !isPublicRoute(req.url)) {
      const signInUrl = new URL('/admin/login', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return Response.redirect(signInUrl);
    }
    
    // If user is signed in but tries to access auth pages, redirect to dashboard
    if (auth.userId && 
       (req.url.includes('/admin/login') || 
        req.url.includes('/admin/register') || 
        req.url.includes('/admin/forgot-password'))) {
      return Response.redirect(new URL('/admin/dashboard', req.url));
    }
  }
});

export const config = {
  matcher: ['/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)']
};