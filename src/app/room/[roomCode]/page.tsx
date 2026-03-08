'use client';

import { useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import CinematicPlayer from '@/components/game/CinematicPlayer';
import GameDashboard from '@/components/game/GameDashboard';
import RoomLobby from '@/components/game/RoomLobby';
import { useRealtimeSession } from '@/hooks/useRealtimeSession';
import { useStory } from '@/hooks/useStory';
import { useGameStore } from '@/lib/store/gameStore';

export default function RoomPage() {
  const params = useParams<{ roomCode: string }>();
  const searchParams = useSearchParams();
  const roomCode = params.roomCode;
  const storyId = searchParams.get('story') ?? 'terminal-velocity';
  const nick = searchParams.get('nick') ?? 'Agent';
  const host = searchParams.get('host') === '1';

  const { isLoading, error, content, session } = useStory(storyId);
  const { initializeRoom, dispatchFlowEvent, presenceUsers, isHost, nickname } = useGameStore();
  const hasDispatchedJoinEvent = useRef(false);

  useRealtimeSession(Boolean(session));

  useEffect(() => {
    initializeRoom({ roomCode, nickname: nick, isHost: host });
  }, [initializeRoom, roomCode, nick, host]);

  useEffect(() => {
    if (!session || hasDispatchedJoinEvent.current) return;
    if (session.roomStage !== 'room_lobby') return;
    dispatchFlowEvent({ type: host ? 'ROOM_CREATED' : 'PLAYER_JOINED' });
    hasDispatchedJoinEvent.current = true;
  }, [session, host, dispatchFlowEvent]);

  if (isLoading) return <div className="min-h-screen bg-slate-950 p-8 text-slate-100">Loading room...</div>;
  if (error || !content || !session) return <div className="min-h-screen bg-slate-950 p-8 text-rose-300">Room failed to load.</div>;

  if (session.roomStage === 'room_lobby') {
    return (
      <RoomLobby
        roomCode={roomCode}
        storyName={content.story.name}
        nickname={nickname}
        isHost={isHost}
        players={presenceUsers}
        onStartGame={() => dispatchFlowEvent({ type: 'START_GAME' })}
      />
    );
  }

  if (session.roomStage === 'intro_cinematic') {
    return (
      <main className="min-h-screen bg-slate-950 p-6 text-slate-100">
        <div className="mx-auto max-w-5xl">
          <h1 className="mb-4 text-3xl font-bold">Narrated Briefing</h1>
          <CinematicPlayer slides={content.metadata.introCinematic} onComplete={() => dispatchFlowEvent({ type: 'INTRO_COMPLETE' })} />
        </div>
      </main>
    );
  }

  return <GameDashboard content={content} />;
}
