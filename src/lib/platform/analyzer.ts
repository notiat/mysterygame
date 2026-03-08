import { GameProgress, Story } from '@/types/platform';
import { EvidenceItem } from '@/types/story';

export interface AnalyzerResult {
  ok: boolean;
  error?: string;
  progress: GameProgress;
  item?: EvidenceItem;
}

export function analyzeEvidenceItem({
  story,
  progress,
  item
}: {
  story: Story;
  progress: GameProgress;
  item: EvidenceItem;
}): AnalyzerResult {
  if (!item.requiresCharge) {
    return {
      ok: true,
      progress: {
        ...progress,
        analyzedItems: Array.from(new Set([...progress.analyzedItems, item.id]))
      },
      item
    };
  }

  if (story.config.mechanics.analyzerCharges !== null && progress.analyzerCharges <= 0) {
    return {
      ok: false,
      error: 'Analyzer battery depleted.',
      progress
    };
  }

  return {
    ok: true,
    progress: {
      ...progress,
      analyzerCharges: progress.analyzerCharges - 1,
      analyzedItems: Array.from(new Set([...progress.analyzedItems, item.id]))
    },
    item
  };
}
