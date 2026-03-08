import { StoryContent } from '@/types/story';
import { terminalVelocityStory } from './config';
import {
  terminalVelocityCharacters,
  terminalVelocityDeductions,
  terminalVelocityDialogues,
  terminalVelocityEvidence,
  terminalVelocityMetadata,
  terminalVelocityTimeline
} from './content';

export const terminalVelocityContent: StoryContent = {
  story: terminalVelocityStory,
  evidence: terminalVelocityEvidence,
  characters: terminalVelocityCharacters,
  dialogues: terminalVelocityDialogues,
  deductions: terminalVelocityDeductions,
  timeline: terminalVelocityTimeline,
  metadata: terminalVelocityMetadata
};
