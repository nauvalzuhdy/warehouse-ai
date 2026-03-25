// TODO: implement stock API route
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'GET /api/stock' });
}

export async function POST() {
  return NextResponse.json({ message: 'POST /api/stock' });
}
