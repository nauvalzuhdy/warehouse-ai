// TODO: implement warehouses API route
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'GET /api/warehouses' });
}

export async function POST() {
  return NextResponse.json({ message: 'POST /api/warehouses' });
}
