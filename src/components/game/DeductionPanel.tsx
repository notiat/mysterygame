'use client';

import { Deduction } from '@/types/story';

interface DeductionPanelProps {
  deductions: Deduction[];
  unlockedIds: string[];
}

export default function DeductionPanel({ deductions, unlockedIds }: DeductionPanelProps) {
  return (
    <section className="rounded-lg border border-slate-700 bg-slate-900/70 p-3">
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-200">Deduction Board</h3>
      <div className="space-y-2">
        {deductions.map((deduction) => {
          const unlocked = unlockedIds.includes(deduction.id);
          return (
            <div
              key={deduction.id}
              className={`rounded border p-2 text-xs ${
                unlocked ? 'border-emerald-500 bg-emerald-900/20 text-emerald-100' : 'border-slate-700 bg-slate-950 text-slate-400'
              }`}
            >
              <p className="font-semibold">{deduction.title}</p>
              <p className="mt-1">{unlocked ? deduction.description : 'Locked: gather required evidence.'}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
