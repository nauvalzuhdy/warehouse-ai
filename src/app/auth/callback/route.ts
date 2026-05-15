import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (code) {
    const supabase = await createClient();
    try {
      await supabase.auth.exchangeCodeForSession(code);
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } catch (error) {
      return NextResponse.redirect(new URL('/login?error=auth_failed', request.url));
    }
  }

  return NextResponse.redirect(new URL('/login?error=no_code', request.url));
}

