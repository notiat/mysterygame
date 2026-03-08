import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const payload = await req.json().catch(() => null);
  if (!payload) {
    return NextResponse.json({ error: 'invalid payload' }, { status: 400 });
  }

  console.error('[client-error]', payload);
  return NextResponse.json({ ok: true }, { status: 200 });
}
