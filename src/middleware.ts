import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const VALID_API_KEY = process.env.API_KEY;

export function middleware(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key');

  if (!apiKey || apiKey !== VALID_API_KEY) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'], // bisa juga '/dashboard/:path*' dsb
};
