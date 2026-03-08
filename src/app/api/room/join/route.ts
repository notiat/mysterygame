import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/server/rateLimit';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
  const rl = rateLimit(`join:${ip}`);
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const body = (await req.json().catch(() => ({}))) as { roomCode?: string; nickname?: string; storyId?: string };
  if (!body.roomCode) {
    return NextResponse.json({ error: 'roomCode is required' }, { status: 400 });
  }

  return NextResponse.json(
    {
      roomCode: body.roomCode.toUpperCase(),
      storyId: body.storyId ?? 'terminal-velocity',
      nickname: body.nickname ?? 'Agent'
    },
    { status: 200 }
  );
}
