'use client';

import { useMemo, useState } from 'react';

interface PuzzlePanelProps {
  solvedPuzzles: string[];
  onSolvePuzzle: (puzzleId: string) => void;
  onUnlockInterrogation: () => void;
  onUseHint: (puzzleId: string) => string | null;
}

export default function PuzzlePanel({ solvedPuzzles, onSolvePuzzle, onUnlockInterrogation, onUseHint }: PuzzlePanelProps) {
  const [code, setCode] = useState('');
  const [timelineOrder, setTimelineOrder] = useState('18:42>19:05>19:07');
  const [msg, setMsg] = useState('Chapter-gated puzzle set active.');

  const allSolved = useMemo(
    () => ['training-log-decrypt', 'timeline-sequence'].every((p) => solvedPuzzles.includes(p)),
    [solvedPuzzles]
  );

  return (
    <section className="rounded-xl border-2 border-slate-700 bg-slate-900/80 p-5">
      <div className="mb-4 flex items-center justify-between border-b border-slate-700 pb-3">
        <h3 className="text-base font-bold uppercase tracking-wider text-amber-400">🧩 Puzzle Challenges</h3>
        <span className="rounded-lg bg-slate-800 px-3 py-1 text-sm font-bold text-slate-300">
          {solvedPuzzles.length}/2
        </span>
      </div>
      <div className="space-y-4">
        <div className={`rounded-xl border-2 p-4 ${solvedPuzzles.includes('training-log-decrypt') ? 'border-emerald-500/50 bg-emerald-950/30' : 'border-slate-700 bg-slate-950/50'}`}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-white">🔐 Puzzle 1: Training Log Password</p>
            {solvedPuzzles.includes('training-log-decrypt') && <span className="text-emerald-400 text-xl">✓</span>}
          </div>
          <p className="text-xs text-slate-400 mb-3">Decrypt the password to access the victim&apos;s training logs.</p>
          <div className="flex gap-2">
            <input
              aria-label="Training log password input"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter password..."
              className="flex-1 rounded-lg border-2 border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none transition-colors"
            />
            <button
              onClick={() => {
                if (code === 'Gym2024!') {
                  onSolvePuzzle('training-log-decrypt');
                  setMsg('✓ Training Log unlocked!');
                } else {
                  setMsg('✗ Incorrect password. Check planner clues.');
                }
              }}
              className="rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-2 text-sm font-bold hover:from-indigo-500 hover:to-indigo-400 transition-all shadow-lg min-h-[44px]"
            >
              Submit
            </button>
            <button
              onClick={() => {
                const hint = onUseHint('training-log-decrypt');
                if (hint) setMsg(`💡 Hint: ${hint}`);
              }}
              className="rounded-lg bg-slate-700 hover:bg-slate-600 px-4 py-2 text-sm font-bold transition-colors min-h-[44px]"
            >
              💡
            </button>
          </div>
        </div>

        <div className={`rounded-xl border-2 p-4 ${solvedPuzzles.includes('timeline-sequence') ? 'border-emerald-500/50 bg-emerald-950/30' : 'border-slate-700 bg-slate-950/50'}`}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-white">⏰ Puzzle 2: Timeline Sequence</p>
            {solvedPuzzles.includes('timeline-sequence') && <span className="text-emerald-400 text-xl">✓</span>}
          </div>
          <p className="text-xs text-slate-400 mb-1">Order the events chronologically.</p>
          <p className="text-xs text-slate-500 mb-3 font-mono">Format: 18:42&gt;19:05&gt;19:07</p>
          <div className="flex gap-2">
            <input
              aria-label="Timeline ordering input"
              value={timelineOrder}
              onChange={(e) => setTimelineOrder(e.target.value)}
              className="flex-1 rounded-lg border-2 border-slate-700 bg-slate-900 px-3 py-2 text-sm font-mono focus:border-teal-500 focus:outline-none transition-colors"
            />
            <button
              onClick={() => {
                if (timelineOrder.replace(/\s/g, '') === '18:42>19:05>19:07') {
                  onSolvePuzzle('timeline-sequence');
                  setMsg('✓ Timeline sequence correct!');
                } else {
                  setMsg('✗ Timeline mismatch. Check witness statements and logs.');
                }
              }}
              className="rounded-lg bg-gradient-to-r from-teal-600 to-teal-500 px-4 py-2 text-sm font-bold hover:from-teal-500 hover:to-teal-400 transition-all shadow-lg min-h-[44px]"
            >
              Validate
            </button>
            <button
              onClick={() => {
                const hint = onUseHint('timeline-sequence');
                if (hint) setMsg(`💡 Hint: ${hint}`);
              }}
              className="rounded-lg bg-slate-700 hover:bg-slate-600 px-4 py-2 text-sm font-bold transition-colors min-h-[44px]"
            >
              💡
            </button>
          </div>
        </div>

        <div className="rounded-xl border-2 border-cyan-500/30 bg-cyan-950/20 p-4">
          <p className="text-sm text-cyan-100 leading-relaxed">{msg}</p>
        </div>

        <button
          disabled={!allSolved}
          onClick={onUnlockInterrogation}
          className="w-full min-h-[52px] rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-3 text-base font-black text-white disabled:cursor-not-allowed disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-400 hover:from-emerald-500 hover:to-emerald-400 transition-all shadow-lg hover:shadow-emerald-500/50"
        >
          {allSolved ? '🚪 Unlock Interrogation Stage' : '🔒 Solve both puzzles to unlock interrogation'}
        </button>
      </div>
    </section>
  );
}
