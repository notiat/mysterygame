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
    <section className="rounded-lg border border-slate-700 bg-slate-900/70 p-3">
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-200">Puzzle Board</h3>
      <div className="space-y-3">
        <div className="rounded border border-slate-700 bg-slate-950 p-2">
          <p className="text-xs text-slate-300">Puzzle 1: Decrypt the Training Log password.</p>
          <div className="mt-2 flex gap-2">
            <input
              aria-label="Training log password input"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter password"
              className="flex-1 rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm"
            />
            <button
              onClick={() => {
                if (code === 'Gym2024!') {
                  onSolvePuzzle('training-log-decrypt');
                  setMsg('Training Log unlocked.');
                } else {
                  setMsg('Incorrect password. Check planner clues.');
                }
              }}
              className="rounded bg-indigo-600 px-3 py-1 text-sm font-semibold"
            >
              Submit
            </button>
            <button
              onClick={() => {
                const hint = onUseHint('training-log-decrypt');
                if (hint) setMsg(`Hint: ${hint}`);
              }}
              className="rounded bg-slate-700 px-3 py-1 text-sm font-semibold"
            >
              Hint
            </button>
          </div>
        </div>

        <div className="rounded border border-slate-700 bg-slate-950 p-2">
          <p className="text-xs text-slate-300">Puzzle 2: Timeline ordering challenge.</p>
          <p className="mt-1 text-xs text-slate-500">Format: 18:42&gt;19:05&gt;19:07</p>
          <div className="mt-2 flex gap-2">
            <input
              aria-label="Timeline ordering input"
              value={timelineOrder}
              onChange={(e) => setTimelineOrder(e.target.value)}
              className="flex-1 rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm"
            />
            <button
              onClick={() => {
                if (timelineOrder.replace(/\s/g, '') === '18:42>19:05>19:07') {
                  onSolvePuzzle('timeline-sequence');
                  setMsg('Timeline puzzle solved.');
                } else {
                  setMsg('Timeline mismatch. Use witness + log evidence.');
                }
              }}
              className="rounded bg-teal-600 px-3 py-1 text-sm font-semibold"
            >
              Validate
            </button>
            <button
              onClick={() => {
                const hint = onUseHint('timeline-sequence');
                if (hint) setMsg(`Hint: ${hint}`);
              }}
              className="rounded bg-slate-700 px-3 py-1 text-sm font-semibold"
            >
              Hint
            </button>
          </div>
        </div>

        <div className="rounded border border-slate-700 bg-slate-950 p-2 text-xs text-cyan-100">{msg}</div>

        <button
          disabled={!allSolved}
          onClick={onUnlockInterrogation}
          className="w-full rounded bg-emerald-600 px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-700"
        >
          {allSolved ? 'Unlock Interrogation Stage' : 'Solve both puzzles to unlock interrogation'}
        </button>
      </div>
    </section>
  );
}
