export type WinConditionType = 'accusation' | 'deduction' | 'custom';
export type RoomStage =
  | 'room_idle'
  | 'room_lobby'
  | 'intro_cinematic'
  | 'stage_investigation'
  | 'stage_interrogation'
  | 'stage_accusation'
  | 'stage_resolution_win'
  | 'stage_resolution_fail'
  | 'post_game'
  | 'room_closed';

export type InvestigationSubstate =
  | 'scene_explore'
  | 'clue_spotted'
  | 'clue_collected'
  | 'clue_examined'
  | 'analysis_decision'
  | 'analysis_run'
  | 'deduction_recalc'
  | 'puzzle_available'
  | 'puzzle_attempt'
  | 'puzzle_solved';

export interface PhaseDefinition {
  id: string;
  name: string;
  displayName: string;
  allowedTransitions: string[];
}

export interface MechanicsConfig {
  analyzerCharges: number | null;
  maxInventory: number | null;
  allowHints: boolean;
  autoTimeline: boolean;
}

export interface UIConfig {
  theme: 'fbi-dark' | 'fbi-light';
  layout: 'dashboard';
  topBar: Array<'analyzer' | 'location' | 'phase' | 'difficulty'>;
  sidebar: Array<'inventory' | 'suspects' | 'deductions' | 'timeline'>;
}

export interface WinConditionConfig {
  type: WinConditionType;
  target: string;
  methodId?: string;
  deliveryId?: string;
  insuranceId?: string;
  minEvidenceCount?: number;
}

export interface StoryConfig {
  phases: PhaseDefinition[];
  mechanics: MechanicsConfig;
  ui: UIConfig;
  winCondition: WinConditionConfig;
}

export interface StoryMeta {
  description: string;
  setting: string;
  playerCount: string;
  thumbnail: string;
}

export interface Story {
  id: string;
  name: string;
  slug: string;
  version: string;
  config: StoryConfig;
  meta: StoryMeta;
}

export interface GameProgress {
  analyzerCharges: number;
  inventory: string[];
  examinedItems: string[];
  analyzedItems: string[];
  solvedPuzzles: string[];
  unlockedDeductions: string[];
  currentLocation: string;
  currentChapterId: string;
  chapterHistory: string[];
  usedHints: Record<string, number>;
  accusedKiller: string | null;
  selectedMethod: string | null;
  selectedDelivery: string | null;
  selectedInsurance: string | null;
  selectedEvidence: string[];
}

export interface GameSession {
  id: string;
  roomCode: string;
  hostId: string;
  sessionVersion: number;
  lastEventId: string | null;
  roomStage: RoomStage;
  investigationSubstate: InvestigationSubstate;
  storyId: string;
  phaseId: string;
  progress: GameProgress;
  roomPings: Array<{ id: string; text: string; by: string; at: string }>;
  roomAnnotations: Array<{ id: string; note: string; by: string; at: string }>;
  accusationVotes: Record<string, string>;
  activityFeed: string[];
  eventLog: RoomEvent[];
  updatedAt: string;
}

export interface RoomEvent {
  id: string;
  type: string;
  actor: string;
  createdAt: string;
  payload?: Record<string, unknown>;
}

export interface PresenceUser {
  id: string;
  name: string;
  color: string;
}
