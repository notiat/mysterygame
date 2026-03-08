'use client';

import { EvidenceItem } from '@/types/story';
import Image from 'next/image';

interface EvidenceCardProps {
  item: EvidenceItem;
  isCollected: boolean;
  isExamined: boolean;
  isAnalyzed: boolean;
  onCollect: () => void;
  onExamine: () => void;
  onAnalyze: () => void;
}

export default function EvidenceCard({
  item,
  isCollected,
  isExamined,
  isAnalyzed,
  onCollect,
  onExamine,
  onAnalyze
}: EvidenceCardProps) {
  return (
    <article className="rounded-lg border border-slate-700 bg-slate-900/90 p-5 shadow-lg hover:border-slate-600 transition-all">
      <div className="relative mb-4 h-40 w-full overflow-hidden rounded-lg border border-slate-600 shadow-md">
        <Image
          src={item.image ?? '/assets/terminal-velocity/evidence/whiskey-glass.svg'}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover"
        />
      </div>
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="text-lg font-bold text-slate-50">{item.name}</h3>
        <span className="rounded-md bg-slate-800 px-3 py-1 text-xs uppercase tracking-wider text-amber-400 font-semibold whitespace-nowrap">
          {item.location}
        </span>
      </div>
      <p className="text-base text-slate-300 leading-relaxed">{item.description}</p>

      {isExamined ? (
        <div className="mt-4 rounded-lg border border-sky-500/50 bg-sky-950/40 p-3 text-sm text-sky-200">
          <p className="font-semibold text-sky-300 mb-1">🔍 Visual Clue</p>
          <p>{item.visualClue}</p>
        </div>
      ) : null}

      {isAnalyzed ? (
        <div className="mt-4 rounded-lg border border-emerald-500/50 bg-emerald-950/40 p-3 text-sm text-emerald-200">
          <p className="font-bold text-emerald-300 mb-1">⚗️ Analysis Complete ({item.analysisData.confidence}% confidence)</p>
          <p className="leading-relaxed">{item.analysisData.result}</p>
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          onClick={onCollect}
          disabled={isCollected}
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400 hover:bg-blue-500 transition-colors min-h-[44px]"
        >
          {isCollected ? '✓ Collected' : '📋 Collect'}
        </button>
        <button
          onClick={onExamine}
          disabled={!isCollected}
          className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400 hover:bg-violet-500 transition-colors min-h-[44px]"
        >
          🔍 Examine
        </button>
        <button
          onClick={onAnalyze}
          disabled={!isCollected}
          className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400 hover:bg-emerald-500 transition-colors min-h-[44px]"
        >
          ⚗️ Analyze
        </button>
      </div>
    </article>
  );
}
