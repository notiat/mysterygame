import { NextResponse } from 'next/server';
import { validateClientEnv } from '@/lib/config/env';

export async function GET() {
  const env = validateClientEnv();
  return NextResponse.json(
    {
      status: 'ok',
      realtimeReady: env.ok,
      missingEnv: env.missing
    },
    { status: 200 }
  );
}
