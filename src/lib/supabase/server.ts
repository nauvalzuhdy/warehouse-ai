import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Server-side Supabase client for server components and route handlers
 * Use this in server components, API routes, and Server Actions
 * 
 * Features:
 * - Runs on the server
 * - Has access to authentication session
 * - Manages cookies for session persistence
 * - Secure database operations
 * - Perfect for protected data fetching and mutations
 * 
 * @returns Promise resolving to Supabase client instance
 */
export async function createClient() {
  const cookieStore = await cookies();

  // console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  // console.log('KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
}
