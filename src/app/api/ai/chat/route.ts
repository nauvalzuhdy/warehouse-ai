// TODO: implement AI chat API route
import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ message: 'POST /api/ai/chat' });
}
