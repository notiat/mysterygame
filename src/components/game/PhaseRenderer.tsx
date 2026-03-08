'use client';

import { StoryContent } from '@/types/story';
import EvidenceCard from './EvidenceCard';

interface PhaseRendererProps {
  content: StoryContent;
  phaseId: string;
  inventory: string[];
  examinedItems: string[];
  analyzedItems: string[];
  onCollect: (id: string) => void;
  onExamine: (id: string) => void;
  onAnalyze: (id: string) => void;
}

export default function PhaseRenderer({
  content,
  phaseId,
  inventory,
  examinedItems,
  analyzedItems,
  onCollect,
  onExamine,
  onAnalyze
}: PhaseRendererProps) {
  if (phaseId === 'briefing') {
    return (
      <section className="rounded-lg border border-slate-700 bg-slate-900 p-5 text-slate-100">
        <h2 className="mb-3 text-xl font-semibold">Opening Briefing</h2>
        <p className="leading-relaxed text-slate-200">{content.metadata.briefing}</p>
      </section>
    );
  }

  if (phaseId === 'resolution') {
    return (
      <section className="rounded-lg border border-slate-700 bg-slate-900 p-5 text-slate-100">
        <h2 className="mb-3 text-xl font-semibold">Case Resolution</h2>
        <p className="leading-relaxed text-slate-200">{content.metadata.confession}</p>
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 gap-3 xl:grid-cols-2">
      {content.evidence.map((item) => (
        <EvidenceCard
          key={item.id}
          item={item}
          isCollected={inventory.includes(item.id)}
          isExamined={examinedItems.includes(item.id)}
          isAnalyzed={analyzedItems.includes(item.id)}
          onCollect={() => onCollect(item.id)}
          onExamine={() => onExamine(item.id)}
          onAnalyze={() => onAnalyze(item.id)}
        />
      ))}
    </section>
  );
}
