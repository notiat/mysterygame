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
    <article className="rounded-lg border border-slate-700 bg-slate-900/80 p-4 shadow-md">
      <div className="relative mb-3 h-32 w-full overflow-hidden rounded border border-slate-700">
        <Image
          src={item.image ?? '/assets/terminal-velocity/evidence/whiskey-glass.svg'}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover grayscale"
        />
      </div>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-100">{item.name}</h3>
        <span className="rounded bg-slate-800 px-2 py-1 text-xs uppercase tracking-wide text-slate-300">
          {item.location}
        </span>
      </div>
      <p className="text-sm text-slate-300">{item.description}</p>

      {isExamined ? (
        <div className="mt-3 rounded border border-slate-700 bg-slate-950 p-2 text-xs text-sky-300">
          Visual: {item.visualClue}
        </div>
      ) : null}

      {isAnalyzed ? (
        <div className="mt-3 rounded border border-emerald-600/40 bg-emerald-950/30 p-2 text-xs text-emerald-200">
          <p className="font-semibold">Analyzer Result ({item.analysisData.confidence}% confidence)</p>
          <p className="mt-1">{item.analysisData.result}</p>
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={onCollect}
          disabled={isCollected}
          className="rounded bg-blue-600 px-3 py-1 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-700"
        >
          {isCollected ? 'Collected' : 'Collect'}
        </button>
        <button
          onClick={onExamine}
          disabled={!isCollected}
          className="rounded bg-violet-600 px-3 py-1 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-700"
        >
          Examine
        </button>
        <button
          onClick={onAnalyze}
          disabled={!isCollected}
          className="rounded bg-emerald-600 px-3 py-1 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-700"
        >
          Analyze
        </button>
      </div>
    </article>
  );
}
