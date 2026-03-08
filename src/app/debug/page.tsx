'use client';

import Link from 'next/link';
import { useGameStore } from '@/lib/store/gameStore';
import { useStory } from '@/hooks/useStory';

export default function DebugPage() {
  const { content, session, isLoading, error } = useStory('terminal-velocity');
  const { setDifficulty, transitionPhase, selectAccusation, finalizeAccusation } = useGameStore();

  if (isLoading) return <div className="min-h-screen bg-slate-950 p-8 text-slate-100">Loading debug suite...</div>;
  if (!content || !session || error) return <div className="min-h-screen bg-slate-950 p-8 text-rose-300">Debug load failed.</div>;

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-slate-100">
      <div className="mx-auto max-w-4xl space-y-4">
        <h1 className="text-3xl font-bold">Debugger: Terminal Velocity</h1>
        <p className="text-sm text-slate-300">Use this page to force states and validate gameplay systems quickly.</p>
        <Link href={`/game/${content.story.id}`} className="inline-block rounded bg-blue-600 px-4 py-2 text-sm font-semibold">
          Open Playable Build
        </Link>

        <section className="rounded-lg border border-slate-700 bg-slate-900 p-4">
          <h2 className="mb-2 text-lg font-semibold">Session Snapshot</h2>
          <pre className="overflow-auto rounded bg-slate-950 p-3 text-xs text-slate-300">
            {JSON.stringify(session, null, 2)}
          </pre>
        </section>

        <section className="rounded-lg border border-slate-700 bg-slate-900 p-4">
          <h2 className="mb-2 text-lg font-semibold">Quick Controls</h2>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setDifficulty('easy')} className="rounded bg-emerald-600 px-3 py-2 text-xs font-semibold">
              Easy
            </button>
            <button onClick={() => setDifficulty('normal')} className="rounded bg-blue-600 px-3 py-2 text-xs font-semibold">
              Normal
            </button>
            <button onClick={() => setDifficulty('hard')} className="rounded bg-amber-600 px-3 py-2 text-xs font-semibold">
              Hard
            </button>
            <button onClick={() => setDifficulty('expert')} className="rounded bg-rose-600 px-3 py-2 text-xs font-semibold">
              Expert
            </button>
            <button onClick={() => transitionPhase('interrogation')} className="rounded bg-slate-700 px-3 py-2 text-xs font-semibold">
              Jump: Interrogation
            </button>
            <button
              onClick={() => {
                selectAccusation({
                  killerId: 'chloe-evans',
                  methodId: 'method-poison-capsule',
                  deliveryId: 'opportunity-video-freeze',
                  insuranceId: 'insurance-epipen-swap',
                  evidenceIds: ['whiskey-glass', 'fake-epipen', 'practice-log', 'murder-kit']
                });
                finalizeAccusation();
              }}
              className="rounded bg-fuchsia-600 px-3 py-2 text-xs font-semibold"
            >
              Force Winning Accusation
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
