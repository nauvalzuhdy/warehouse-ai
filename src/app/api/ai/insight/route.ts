// TODO: implement AI insight API route
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST() {
  // IMPORTANT: Middleware should have already checked auth status,
  // but this is a safety layer to ensure API is never exposed.
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  return NextResponse.json({ message: 'POST /api/ai/insight' });
}
