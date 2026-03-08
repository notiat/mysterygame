'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/lib/store/gameStore';

export function useStory(storyId: string) {
  const {
    loadStory,
    isLoading,
    error,
    story,
    content,
    session,
    transitionPhase,
    collectEvidence,
    examineEvidence,
    analyzeEvidence,
    selectAccusation,
    finalizeAccusation,
    setDifficulty
  } = useGameStore();

  useEffect(() => {
    loadStory(storyId);
  }, [loadStory, storyId]);

  return {
    isLoading,
    error,
    story,
    content,
    session,
    actions: {
      transitionPhase,
      collectEvidence,
      examineEvidence,
      analyzeEvidence,
      selectAccusation,
      finalizeAccusation,
      setDifficulty
    }
  };
}
