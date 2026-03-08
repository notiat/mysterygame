import { Story } from '@/types/platform';

export function canTransitionPhase(story: Story, fromPhaseId: string, toPhaseId: string) {
  const current = story.config.phases.find((phase) => phase.id === fromPhaseId);
  if (!current) return false;
  return current.allowedTransitions.includes(toPhaseId);
}

export function getPhaseDisplayName(story: Story, phaseId: string) {
  return story.config.phases.find((phase) => phase.id === phaseId)?.displayName ?? phaseId;
}
