import { Story, GameProgress } from '@/types/platform';

export interface AccusationPayload {
  killerId: string | null;
  method: string | null;
  delivery: string | null;
  insurance: string | null;
  evidence: string[];
}

export function evaluateAccusation(story: Story, payload: AccusationPayload) {
  const requiredMethod = story.config.winCondition.methodId ?? 'method-poison-capsule';
  const requiredDelivery = story.config.winCondition.deliveryId ?? 'opportunity-video-freeze';
  const requiredInsurance = story.config.winCondition.insuranceId ?? 'insurance-epipen-swap';
  const requiredEvidenceCount = story.config.winCondition.minEvidenceCount ?? 3;

  const correctKiller = payload.killerId === story.config.winCondition.target;
  const methodOk = payload.method === requiredMethod;
  const deliveryOk = payload.delivery === requiredDelivery;
  const insuranceOk = payload.insurance === requiredInsurance;
  const evidenceOk = payload.evidence.length >= requiredEvidenceCount;

  const passed = correctKiller && methodOk && deliveryOk && insuranceOk && evidenceOk;

  return {
    passed,
    details: {
      correctKiller,
      methodOk,
      deliveryOk,
      insuranceOk,
      evidenceOk
    }
  };
}

export function createInitialProgress(story: Story): GameProgress {
  const firstPhase = story.config.phases[0]?.id ?? 'briefing';
  return {
    analyzerCharges: story.config.mechanics.analyzerCharges ?? 0,
    inventory: [],
    examinedItems: [],
    analyzedItems: [],
    solvedPuzzles: [],
    unlockedDeductions: [],
    currentLocation: 'Hangar 7',
    currentChapterId: firstPhase,
    chapterHistory: [firstPhase],
    usedHints: {},
    accusedKiller: null,
    selectedMethod: null,
    selectedDelivery: null,
    selectedInsurance: null,
    selectedEvidence: []
  };
}
