'use client';

import { createBrowserClient } from '@supabase/ssr';

/**
 * Browser-side Supabase client for client components
 * Use this in components marked with 'use client'
 * 
 * Features:
 * - Runs in the browser
 * - Handles client-side authentication
 * - Manages user session client-side
 * - Perfect for real-time subscriptions
 * 
 * @returns Supabase client instance
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
