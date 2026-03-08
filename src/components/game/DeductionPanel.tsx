'use client';

import { Deduction } from '@/types/story';

interface DeductionPanelProps {
  deductions: Deduction[];
  unlockedIds: string[];
}

export default function DeductionPanel({ deductions, unlockedIds }: DeductionPanelProps) {
  const unlockedCount = unlockedIds.length;
  const totalCount = deductions.length;
  
  return (
    <section className="rounded-xl border-2 border-slate-700 bg-slate-900/80 p-5">
      <div className="mb-4 flex items-center justify-between border-b border-slate-700 pb-3">
        <h3 className="text-base font-bold uppercase tracking-wider text-amber-400">🧩 Deductions</h3>
        <span className="rounded-lg bg-slate-800 px-3 py-1 text-sm font-bold text-slate-300">
          {unlockedCount}/{totalCount}
        </span>
      </div>
      <div className="space-y-3">
        {deductions.map((deduction) => {
          const unlocked = unlockedIds.includes(deduction.id);
          return (
            <div
              key={deduction.id}
              className={`rounded-lg border-2 p-4 text-sm transition-all ${
                unlocked 
                  ? 'border-emerald-500/50 bg-emerald-950/30 text-emerald-100 shadow-lg shadow-emerald-500/10' 
                  : 'border-slate-700 bg-slate-950/50 text-slate-500'
              }`}
            >
              <p className="font-bold text-base mb-2 flex items-center gap-2">
                {unlocked ? '✓' : '🔒'} {deduction.title}
              </p>
              <p className="leading-relaxed">
                {unlocked ? deduction.description : '🔍 Locked: Collect required evidence to unlock this deduction.'}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
