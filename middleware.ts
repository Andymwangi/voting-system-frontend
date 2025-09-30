import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequestWithAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Public routes that don't require authentication
    const publicRoutes = [
      '/',
      '/login',
      '/register',
      '/about',
      '/contact',
      '/help',
      '/privacy',
      '/terms'
    ];

    // Check if the current path is a public route
    const isPublicRoute = publicRoutes.some(route =>
      pathname === route || pathname.startsWith('/api/auth')
    );

    // If it's a public route, allow access
    if (isPublicRoute) {
      return NextResponse.next();
    }

    // If user is not authenticated and trying to access protected route
    if (!token) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Role-based access control
    const userRole = token.role as string;

    // Admin routes - only accessible by ADMIN, SUPER_ADMIN, and MODERATOR
    if (pathname.startsWith('/admin')) {
      const allowedRoles = ['ADMIN', 'SUPER_ADMIN', 'MODERATOR'];
      if (!allowedRoles.includes(userRole)) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }

    // Super admin exclusive routes
    if (pathname.startsWith('/admin/settings') ||
        pathname.startsWith('/admin/audit') ||
        pathname.includes('/delete') ||
        pathname.includes('/backup')) {
      if (userRole !== 'SUPER_ADMIN') {
        return NextResponse.redirect(new URL('/admin/dashboard', req.url));
      }
    }

    // Voter routes - accessible by all authenticated users
    if (pathname.startsWith('/dashboard') ||
        pathname.startsWith('/elections') ||
        pathname.startsWith('/vote') ||
        pathname.startsWith('/results') ||
        pathname.startsWith('/history')) {
      // All authenticated users can access voter routes
      return NextResponse.next();
    }

    // Email verification check for sensitive operations
    const isVerified = token.isVerified as boolean;
    const sensitiveRoutes = ['/vote/', '/admin/elections/create', '/admin/candidates'];

    if (sensitiveRoutes.some(route => pathname.startsWith(route)) && !isVerified) {
      const verifyUrl = new URL('/verify-email', req.url);
      verifyUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(verifyUrl);
    }

    // Two-factor authentication check for admin operations
    const twoFactorEnabled = token.twoFactorEnabled as boolean;
    const adminSensitiveRoutes = [
      '/admin/settings',
      '/admin/audit',
      '/admin/voters/import',
      '/admin/elections/create'
    ];

    if (adminSensitiveRoutes.some(route => pathname.startsWith(route)) &&
        ['ADMIN', 'SUPER_ADMIN'].includes(userRole) &&
        !twoFactorEnabled) {
      const setup2faUrl = new URL('/admin/settings/security', req.url);
      setup2faUrl.searchParams.set('require2fa', 'true');
      setup2faUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(setup2faUrl);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // This callback determines if the middleware should run
        const { pathname } = req.nextUrl;

        // Always run middleware for protected routes
        const protectedPaths = ['/dashboard', '/admin', '/vote', '/elections', '/results', '/history'];
        const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

        // Run middleware if it's a protected path or if user is authenticated
        return isProtectedPath || !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public|images|fonts).*)',
  ],
};