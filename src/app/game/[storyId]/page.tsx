'use client';

import { useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import CinematicPlayer from '@/components/game/CinematicPlayer';
import GameDashboard from '@/components/game/GameDashboard';
import { useRealtimeSession } from '@/hooks/useRealtimeSession';
import { useStory } from '@/hooks/useStory';
import { useGameStore } from '@/lib/store/gameStore';

export default function StoryGamePage() {
  const params = useParams<{ storyId: string }>();
  const storyId = params.storyId;
  const { isLoading, error, content, session } = useStory(storyId);
  const { initializeRoom, dispatchFlowEvent } = useGameStore();
  const hasInitialized = useRef(false);

  useRealtimeSession(Boolean(session));

  useEffect(() => {
    if (!session || hasInitialized.current) return;
    initializeRoom({ roomCode: `solo-${storyId}`, nickname: 'SoloAgent', isHost: true });
    if (session.roomStage === 'room_lobby') {
      dispatchFlowEvent({ type: 'START_GAME' });
    }
    hasInitialized.current = true;
  }, [session, initializeRoom, storyId, dispatchFlowEvent]);

  if (isLoading) {
    return <div className="min-h-screen bg-slate-950 p-8 text-slate-100">Loading story pack...</div>;
  }

  if (error || !content || !session) {
    const debugInfo = [];
    if (error) debugInfo.push(`Error: ${error}`);
    if (!content) debugInfo.push('Content is null');
    if (!session) debugInfo.push('Session is null');
    
    return (
      <div className="min-h-screen bg-slate-950 p-8 text-rose-300">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Failed to load story</h1>
          <div className="bg-slate-900 p-4 rounded-lg text-sm space-y-2">
            {debugInfo.map((info, i) => (
              <div key={i}>{info}</div>
            ))}
            <div className="mt-4 text-slate-400">
              Story ID: {storyId}<br />
              Loading: {isLoading ? 'Yes' : 'No'}
            </div>
          </div>
        </div>
      </div>
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
