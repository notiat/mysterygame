import { Story } from './platform';

export interface EvidenceItem {
  id: string;
  storyId: string;
  name: string;
  image?: string;
  description: string;
  visualClue: string;
  location: string;
  requiresCharge: boolean;
  tags: string[];
  analysisData: {
    result: string;
    confidence: number;
    notes: string[];
  };
}

export interface Character {
  id: string;
  storyId: string;
  name: string;
  role: string;
  age: number;
  bio: string;
  truth: string;
  portrait: string;
  isGuilty: boolean;
}

export interface DialogueResponse {
  id: string;
  text: string;
  nextNodeId: string | null;
  requiresEvidence?: string[];
}

export interface DialogueNode {
  id: string;
  storyId: string;
  characterId: string;
  text: string;
  responses: DialogueResponse[];
}

export interface Deduction {
  id: string;
  storyId: string;
  title: string;
  description: string;
  unlockedBy: string[];
  category: 'motive' | 'means' | 'opportunity' | 'timeline';
}

export interface TimelineEvent {
  id: string;
  timeUtc: string;
  label: string;
}

export interface StoryMetadata {
  briefing: string;
  confession: string;
  chapterCards: Array<{
    id: string;
    title: string;
    subtitle: string;
    sceneImage: string;
    sceneImageLandscape?: string;
    sceneImagePortrait?: string;
    objective: string;
    unlocksOn?: string[];
  }>;
  puzzleHints: Array<{
    puzzleId: string;
    tiers: string[];
  }>;
  introCinematic: Array<{
    id: string;
    image: string;
    imageLandscape?: string;
    imagePortrait?: string;
    subtitle: string;
    voiceover: string;
  }>;
  sceneGallery: Array<{
    id: string;
    title: string;
    image: string;
    imageLandscape?: string;
    imagePortrait?: string;
    caption: string;
  }>;
  difficultyModes: Array<{
    id: 'easy' | 'normal' | 'hard' | 'expert';
    analyzerCharges: number;
    hintLevel: string;
  }>;
}

export interface StoryContent {
  story: Story;
  evidence: EvidenceItem[];
  characters: Character[];
  dialogues: DialogueNode[];
  deductions: Deduction[];
  timeline: TimelineEvent[];
  metadata: StoryMetadata;
}
