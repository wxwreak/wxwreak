import { NextResponse } from 'next/server';

export async function GET() {
  return new NextResponse('dh=626a0f66c1a6abf99f393acc46e730f617f47ee4', {
    headers: { 'Content-Type': 'text/plain' },
  });
}