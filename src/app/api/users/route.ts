import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const users = [
    { id: 1, name: 'Kaming', email: 'kaming@example.com' },
    { id: 2, name: 'Budi', email: 'budi@example.com' },
    { id: 3, name: 'Sari', email: 'sari@example.com' },
  ];

  return NextResponse.json({ users });
}
