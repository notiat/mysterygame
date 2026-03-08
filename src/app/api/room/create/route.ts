import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/server/rateLimit';

function randomCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
  const rl = rateLimit(`create:${ip}`);
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const body = (await req.json().catch(() => ({}))) as { storyId?: string; nickname?: string };
  const roomCode = randomCode();
  return NextResponse.json(
    {
      roomCode,
      storyId: body.storyId ?? 'terminal-velocity',
      nickname: body.nickname ?? 'HostAgent'
    },
    { status: 200 }
  );
}
