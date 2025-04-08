// Import NextAuth middleware with safe handling of edge environments
// Safe import to avoid dotenv issues in middleware
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';

// Export a wrapper around the NextAuth middleware
export default function middleware(request: NextRequest) {
  // In middleware environments, ensure we don't try to access process.env
  // Try/catch to prevent any runtime errors in middleware
  try {
    return auth(request);
  } catch (error) {
    console.error('Middleware error:', error);
    
    // Check if request is for protected route
    const url = request.nextUrl.clone();
    const isProtectedRoute = url.pathname.startsWith('/dashboard') || 
                             url.pathname.startsWith('/admin') ||
                             url.pathname === '/create-group' ||
                             url.pathname === '/create-bill' ||
                             url.pathname === '/create-virtual-card' ||
                             url.pathname === '/virtual-card-details';
    
    // If it's a protected route, redirect to login
    if (isProtectedRoute) {
      url.pathname = '/auth/login';
      return NextResponse.redirect(url);
    }
    
    // Otherwise, just continue
    return NextResponse.next();
  }
}

// Specify protected routes that require authentication
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/create-group',
    '/create-bill',
    '/create-virtual-card',
    '/virtual-card-details',
    '/admin/:path*'
  ],
};