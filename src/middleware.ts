import { createServerClient } from '@supabase/ssr';
import { NextResponse, NextRequest } from 'next/server';

// Define route categories for middleware logic
const PUBLIC_ROUTES = ['/', '/login', '/register', '/auth/callback'];
const AUTH_ROUTES = ['/login', '/register'];
const PROTECTED_ROUTES_PREFIX = [
  '/dashboard',
];
const API_PROTECTED_PREFIX = [
  '/api/products',
  '/api/warehouses',
  '/api/stock',
  '/api/ai',
];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Create Supabase client with proper cookie handling for session refresh
  // This uses the getAll/setAll pattern to handle cookies correctly in middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Get current user from Supabase session
  const { data: { user } } = await supabase.auth.getUser();

  // Get the current pathname for route matching
  const pathname = request.nextUrl.pathname;

  // Route protection logic:

  // 1. If user is logged in AND trying to access auth pages (login/register)
  //    → Redirect to dashboard (prevent logged-in users from accessing auth pages)
  // Kalau user sudah login DAN coba akses /login → redirect ke /dashboard
  if (user && AUTH_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 2. Check if accessing protected routes without authentication
  //    → Redirect to login with redirectTo parameter for post-login navigation
  if (!user) {
    const isProtectedRoute = PROTECTED_ROUTES_PREFIX.some((prefix) =>
      pathname.startsWith(prefix)
    );

    if (isProtectedRoute) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 3. Check if accessing protected API endpoints without authentication
    //    → Return 401 Unauthorized JSON response
    const isProtectedApi = API_PROTECTED_PREFIX.some((prefix) =>
      pathname.startsWith(prefix)
    );

    if (isProtectedApi) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
  }

  // 4. All other cases: allow the request to proceed
  return response;
}

// Middleware matcher configuration
// Excludes static assets, images, and favicons to prevent unnecessary middleware execution
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
