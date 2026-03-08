import { create } from 'zustand';
import { GameSession, PresenceUser, RoomEvent, Story } from '@/types/platform';
import { StoryContent } from '@/types/story';
import { analyzeEvidenceItem } from '@/lib/platform/analyzer';
import { computeUnlockedDeductions } from '@/lib/platform/deductions';
import { createInitialProgress, evaluateAccusation } from '@/lib/platform/gameEngine';
import { canTransitionPhase } from '@/lib/platform/phases';
import { loadStoryById } from '@/lib/platform/storyLoader';
import { GameFlowEvent, initialFlowState, replayFlowState, transitionFlowState } from '@/lib/platform/stateMachine';

interface GameState {
  isLoading: boolean;
  error: string | null;
  story: Story | null;
  content: StoryContent | null;
  session: GameSession | null;
  roomCode: string;
  nickname: string;
  isHost: boolean;
  presenceUsers: PresenceUser[];
  activeDialogueByCharacter: Record<string, string | null>;
  resolutionText: string | null;
  flowEvents: string[];
  activityFeed: string[];
  roomPings: Array<{ id: string; text: string; by: string; at: string }>;
  roomAnnotations: Array<{ id: string; note: string; by: string; at: string }>;
  accusationVotes: Record<string, string>;

  loadStory: (storyId: string) => Promise<void>;
  initializeRoom: (payload: { roomCode: string; nickname: string; isHost: boolean }) => void;
  dispatchFlowEvent: (event: GameFlowEvent) => void;
  setPresenceUsers: (users: PresenceUser[]) => void;
  applyRemoteSession: (session: GameSession) => void;
  setDifficulty: (mode: 'easy' | 'normal' | 'hard' | 'expert') => void;
  transitionPhase: (phaseId: string) => boolean;
  collectEvidence: (evidenceId: string) => void;
  examineEvidence: (evidenceId: string) => void;
  analyzeEvidence: (evidenceId: string) => { ok: boolean; error?: string };
  solvePuzzle: (puzzleId: string) => void;
  useHint: (puzzleId: string) => string | null;
  advanceChapter: () => void;
  addPing: (text: string) => void;
  addAnnotation: (note: string) => void;
  castAccusationVote: (characterId: string) => void;
  selectAccusation: (payload: {
    killerId?: string | null;
    methodId?: string | null;
    deliveryId?: string | null;
    insuranceId?: string | null;
    evidenceIds?: string[];
  }) => void;
  finalizeAccusation: () => { passed: boolean; details: Record<string, boolean> } | null;
  advanceDialogue: (characterId: string, nextNodeId: string | null) => void;
}

function getStorageKey(storyId: string, roomCode: string) {
  return `opencase:session:${storyId}:${roomCode}`;
}

function stageToPhase(roomStage: GameSession['roomStage']): string {
  if (roomStage === 'stage_interrogation') return 'interrogation';
  if (roomStage === 'stage_accusation') return 'accusation';
  if (roomStage === 'stage_resolution_win' || roomStage === 'stage_resolution_fail') return 'resolution';
  if (roomStage === 'stage_investigation') return 'investigation';
  return 'briefing';
}

function safeParseSession(raw: string | null): GameSession | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as GameSession;
  } catch {
    return null;
  }
}

function toMillis(iso: string) {
  return Number.isNaN(Date.parse(iso)) ? 0 : Date.parse(iso);
}

const MAX_EVENT_LOG = 120;
const HOST_CRITICAL_EVENTS: Array<GameFlowEvent['type']> = [
  'START_GAME',
  'INTERROGATION_UNLOCKED',
  'OPEN_ACCUSATION',
  'ACCUSATION_WIN',
  'ACCUSATION_FAIL',
  'POST_GAME',
  'RESET_TO_LOBBY',
  'CLOSE_ROOM'
];

function nextEventId(actor: string) {
  return `${actor}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function appendEvent(session: GameSession, event: RoomEvent) {
  return [...(session.eventLog ?? []), event].slice(-MAX_EVENT_LOG);
}

function mergeSession(localSession: GameSession, incoming: GameSession): GameSession {
  const localTime = toMillis(localSession.updatedAt);
  const remoteTime = toMillis(incoming.updatedAt);
  const newer = remoteTime >= localTime ? incoming : localSession;
  const older = remoteTime >= localTime ? localSession : incoming;

  return {
    ...older,
    ...newer,
    progress: {
      ...older.progress,
      ...newer.progress,
      inventory: Array.from(new Set([...(older.progress.inventory ?? []), ...(newer.progress.inventory ?? [])])),
      examinedItems: Array.from(new Set([...(older.progress.examinedItems ?? []), ...(newer.progress.examinedItems ?? [])])),
      analyzedItems: Array.from(new Set([...(older.progress.analyzedItems ?? []), ...(newer.progress.analyzedItems ?? [])])),
      solvedPuzzles: Array.from(new Set([...(older.progress.solvedPuzzles ?? []), ...(newer.progress.solvedPuzzles ?? [])])),
      unlockedDeductions: Array.from(
        new Set([...(older.progress.unlockedDeductions ?? []), ...(newer.progress.unlockedDeductions ?? [])])
      ),
      chapterHistory: Array.from(new Set([...(older.progress.chapterHistory ?? []), ...(newer.progress.chapterHistory ?? [])])),
      usedHints: { ...(older.progress.usedHints ?? {}), ...(newer.progress.usedHints ?? {}) },
      selectedEvidence: Array.from(new Set([...(older.progress.selectedEvidence ?? []), ...(newer.progress.selectedEvidence ?? [])]))
    },
    roomPings: [...(older.roomPings ?? []), ...(newer.roomPings ?? [])].slice(-50),
    roomAnnotations: [...(older.roomAnnotations ?? []), ...(newer.roomAnnotations ?? [])].slice(-50),
    accusationVotes: { ...(older.accusationVotes ?? {}), ...(newer.accusationVotes ?? {}) },
    activityFeed: [...(older.activityFeed ?? []), ...(newer.activityFeed ?? [])].slice(-100),
    eventLog: [...(older.eventLog ?? []), ...(newer.eventLog ?? [])]
      .filter((event, index, arr) => arr.findIndex((candidate) => candidate.id === event.id) === index)
      .slice(-MAX_EVENT_LOG),
    sessionVersion: Math.max(older.sessionVersion ?? 0, newer.sessionVersion ?? 0),
    lastEventId: newer.lastEventId ?? older.lastEventId
  };
}

export const useGameStore = create<GameState>((set, get) => ({
  isLoading: false,
  error: null,
  story: null,
  content: null,
  session: null,
  roomCode: 'solo',
  nickname: 'Agent',
  isHost: false,
  presenceUsers: [],
  activeDialogueByCharacter: {},
  resolutionText: null,
  flowEvents: [],
  activityFeed: [],
  roomPings: [],
  roomAnnotations: [],
  accusationVotes: {},

  loadStory: async (storyId) => {
    set({ isLoading: true, error: null });
    const loaded = await loadStoryById(storyId);

    if (!loaded) {
      set({ isLoading: false, error: `Story "${storyId}" not found.` });
      return;
    }

    const { roomCode, nickname } = get();
    const effectiveRoomCode = roomCode === 'solo' ? `solo-${storyId}` : roomCode;
    const storageKey = getStorageKey(storyId, effectiveRoomCode);
    const persistedRaw = typeof window !== 'undefined' ? window.localStorage.getItem(storageKey) : null;
    const persisted = safeParseSession(persistedRaw);
    const firstChapterId = loaded.metadata.chapterCards[0]?.id ?? loaded.story.config.phases[0]?.id ?? 'briefing';

    const phaseId = persisted?.phaseId ?? loaded.story.config.phases[0]?.id ?? 'briefing';
    const session: GameSession = persisted
      ? {
          ...persisted,
          roomCode: persisted.roomCode ?? effectiveRoomCode,
          hostId: persisted.hostId ?? nickname,
          sessionVersion: persisted.sessionVersion ?? 1,
          lastEventId: persisted.lastEventId ?? null,
          roomStage: persisted.roomStage ?? 'room_lobby',
          investigationSubstate: persisted.investigationSubstate ?? initialFlowState.investigationSubstate,
          roomPings: persisted.roomPings ?? [],
          roomAnnotations: persisted.roomAnnotations ?? [],
          accusationVotes: persisted.accusationVotes ?? {},
          activityFeed: persisted.activityFeed ?? [],
          eventLog: persisted.eventLog ?? [],
          progress: {
            ...createInitialProgress(loaded.story),
            ...persisted.progress,
            solvedPuzzles: persisted.progress?.solvedPuzzles ?? [],
            currentChapterId: persisted.progress?.currentChapterId ?? firstChapterId,
            chapterHistory: persisted.progress?.chapterHistory ?? [firstChapterId],
            usedHints: persisted.progress?.usedHints ?? {}
          }
        }
      : {
          id: effectiveRoomCode,
          roomCode: effectiveRoomCode,
          hostId: nickname,
          sessionVersion: 1,
          lastEventId: null,
          roomStage: 'room_lobby',
          investigationSubstate: initialFlowState.investigationSubstate,
          storyId,
          phaseId,
          progress: {
            ...createInitialProgress(loaded.story),
            currentChapterId: firstChapterId,
            chapterHistory: [firstChapterId]
          },
          roomPings: [],
          roomAnnotations: [],
          accusationVotes: {},
          activityFeed: [],
          eventLog: [],
          updatedAt: new Date().toISOString()
        };

    const unlockedDeductions = computeUnlockedDeductions(loaded.deductions, session.progress.inventory);
    session.progress.unlockedDeductions = unlockedDeductions;

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(storageKey, JSON.stringify(session));
    }

    set({
      isLoading: false,
      story: loaded.story,
      content: loaded,
      session,
      roomCode: session.roomCode,
      activeDialogueByCharacter: {},
      resolutionText: null,
      flowEvents: [],
      roomPings: session.roomPings ?? [],
      roomAnnotations: session.roomAnnotations ?? [],
      accusationVotes: session.accusationVotes ?? {},
      activityFeed: session.activityFeed ?? []
    });
  },

  initializeRoom: ({ roomCode, nickname, isHost }) => {
    const state = get();
    const joinMessage = `${nickname} ${isHost ? 'created' : 'joined'} room ${roomCode}.`;
    const storyId = state.story?.id;
    const persistedForRoom =
      typeof window !== 'undefined' && storyId
        ? safeParseSession(window.localStorage.getItem(getStorageKey(storyId, roomCode)))
        : null;
    const nextSession = state.session
      ? {
          ...state.session,
          ...(persistedForRoom ?? {}),
          id: roomCode,
          roomCode,
          hostId: isHost ? nickname : state.session.hostId,
          activityFeed: Array.from(
            new Set([...(persistedForRoom?.activityFeed ?? state.session.activityFeed ?? []), joinMessage])
          ),
          updatedAt: new Date().toISOString()
        }
      : null;

    set({
      roomCode,
      nickname,
      isHost,
      session: nextSession,
      activityFeed: Array.from(new Set([...state.activityFeed, joinMessage]))
    });
  },

  dispatchFlowEvent: (event) => {
    const state = get();
    if (!state.session || !state.story) return;
    if (HOST_CRITICAL_EVENTS.includes(event.type) && !state.isHost) return;

    const eventId = nextEventId(state.nickname);
    const roomEvent: RoomEvent = {
      id: eventId,
      type: event.type,
      actor: state.nickname,
      createdAt: new Date().toISOString()
    };

    const nextFlow = transitionFlowState(
      {
        roomStage: state.session.roomStage,
        investigationSubstate: state.session.investigationSubstate
      },
      event
    );

    const nextSession: GameSession = {
      ...state.session,
      sessionVersion: (state.session.sessionVersion ?? 0) + 1,
      lastEventId: eventId,
      roomStage: nextFlow.roomStage,
      investigationSubstate: nextFlow.investigationSubstate,
      phaseId: stageToPhase(nextFlow.roomStage),
      eventLog: appendEvent(state.session, roomEvent),
      activityFeed: [...(state.session.activityFeed ?? []), `${state.nickname}: ${event.type.replace(/_/g, ' ')}`].slice(-100),
      updatedAt: new Date().toISOString()
    };

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(getStorageKey(state.story.id, state.roomCode), JSON.stringify(nextSession));
    }

    set({
      session: nextSession,
      flowEvents: [...state.flowEvents, event.type]
    });
    set((current) => ({ activityFeed: nextSession.activityFeed ?? current.activityFeed }));
  },

  setPresenceUsers: (users) => set({ presenceUsers: users }),

  applyRemoteSession: (session) => {
    const { story, session: localSession } = get();
    if (!story || session.storyId !== story.id) return;
    if (localSession) {
      const incomingTime = toMillis(session.updatedAt);
      const localTime = toMillis(localSession.updatedAt);
      const incomingVersion = session.sessionVersion ?? 0;
      const localVersion = localSession.sessionVersion ?? 0;
      const noNewSignals =
        (session.roomPings?.length ?? 0) <= (localSession.roomPings?.length ?? 0) &&
        (session.roomAnnotations?.length ?? 0) <= (localSession.roomAnnotations?.length ?? 0) &&
        Object.keys(session.accusationVotes ?? {}).length <= Object.keys(localSession.accusationVotes ?? {}).length;
      const duplicateEvent = session.lastEventId && session.lastEventId === localSession.lastEventId;
      if ((incomingVersion < localVersion || duplicateEvent) && noNewSignals) return;
      if (incomingTime <= localTime && incomingVersion <= localVersion && noNewSignals) return;
    }

    let nextSession = localSession ? mergeSession(localSession, session) : session;
    if (nextSession.eventLog?.length) {
      const replayed = replayFlowState(nextSession.eventLog.map((entry) => ({ type: entry.type as GameFlowEvent['type'] })));
      nextSession = {
        ...nextSession,
        roomStage: replayed.roomStage,
        investigationSubstate: replayed.investigationSubstate
      };
    }
    const storageKey = getStorageKey(story.id, nextSession.roomCode);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(storageKey, JSON.stringify(nextSession));
    }
    set({
      session: nextSession,
      roomPings: nextSession.roomPings ?? [],
      roomAnnotations: nextSession.roomAnnotations ?? [],
      accusationVotes: nextSession.accusationVotes ?? {},
      activityFeed: nextSession.activityFeed ?? []
    });
  },

  setDifficulty: (mode) => {
    const { content, session, story } = get();
    if (!content || !session || !story) return;
    const difficulty = content.metadata.difficultyModes.find((entry) => entry.id === mode);
    if (!difficulty) return;

    const nextSession: GameSession = {
      ...session,
      updatedAt: new Date().toISOString(),
      progress: {
        ...session.progress,
        analyzerCharges: difficulty.analyzerCharges
      }
    };
    const storageKey = getStorageKey(story.id, session.roomCode);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(storageKey, JSON.stringify(nextSession));
    }
    set({ session: nextSession });
  },

  transitionPhase: (phaseId) => {
    const { story, session, isHost } = get();
    if (!story || !session) return false;
    if (!isHost) return false;
    if (!canTransitionPhase(story, session.phaseId, phaseId)) return false;

    const eventId = nextEventId(get().nickname);
    const roomEvent: RoomEvent = {
      id: eventId,
      type: 'TRANSITION_PHASE',
      actor: get().nickname,
      createdAt: new Date().toISOString(),
      payload: { phaseId }
    };
    const nextSession: GameSession = { ...session, phaseId, updatedAt: new Date().toISOString() };
    nextSession.sessionVersion = (session.sessionVersion ?? 0) + 1;
    nextSession.lastEventId = eventId;
    nextSession.eventLog = appendEvent(session, roomEvent);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(getStorageKey(story.id, session.roomCode), JSON.stringify(nextSession));
    }
    set({ session: nextSession });
    return true;
  },

  collectEvidence: (evidenceId) => {
    const { session, story, content } = get();
    if (!session || !story || !content) return;
    const eventId = nextEventId(get().nickname);
    const roomEvent: RoomEvent = {
      id: eventId,
      type: 'COLLECT_EVIDENCE',
      actor: get().nickname,
      createdAt: new Date().toISOString(),
      payload: { evidenceId }
    };
    const inventory = Array.from(new Set([...session.progress.inventory, evidenceId]));
    const unlockedDeductions = computeUnlockedDeductions(content.deductions, inventory);

    const nextSession: GameSession = {
      ...session,
      sessionVersion: (session.sessionVersion ?? 0) + 1,
      lastEventId: eventId,
      eventLog: appendEvent(session, roomEvent),
      updatedAt: new Date().toISOString(),
      progress: { ...session.progress, inventory, unlockedDeductions }
    };

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(getStorageKey(story.id, session.roomCode), JSON.stringify(nextSession));
    }
    set({ session: nextSession });
  },

  examineEvidence: (evidenceId) => {
    const { session, story } = get();
    if (!session || !story) return;
    const eventId = nextEventId(get().nickname);
    const roomEvent: RoomEvent = {
      id: eventId,
      type: 'EXAMINE_EVIDENCE',
      actor: get().nickname,
      createdAt: new Date().toISOString(),
      payload: { evidenceId }
    };

    const nextSession: GameSession = {
      ...session,
      sessionVersion: (session.sessionVersion ?? 0) + 1,
      lastEventId: eventId,
      eventLog: appendEvent(session, roomEvent),
      updatedAt: new Date().toISOString(),
      progress: {
        ...session.progress,
        examinedItems: Array.from(new Set([...session.progress.examinedItems, evidenceId]))
      }
    };
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(getStorageKey(story.id, session.roomCode), JSON.stringify(nextSession));
    }
    set({ session: nextSession });
  },

  analyzeEvidence: (evidenceId) => {
    const { session, story, content } = get();
    if (!session || !story || !content) return { ok: false, error: 'Game session unavailable.' };

    const item = content.evidence.find((entry) => entry.id === evidenceId);
    if (!item) return { ok: false, error: 'Evidence item missing.' };

    const result = analyzeEvidenceItem({
      story,
      progress: session.progress,
      item
    });
    if (!result.ok) return { ok: false, error: result.error ?? 'Analysis failed.' };

    const unlockedDeductions = computeUnlockedDeductions(content.deductions, result.progress.inventory);
    const eventId = nextEventId(get().nickname);
    const roomEvent: RoomEvent = {
      id: eventId,
      type: 'ANALYZE_EVIDENCE',
      actor: get().nickname,
      createdAt: new Date().toISOString(),
      payload: { evidenceId }
    };
    const nextSession: GameSession = {
      ...session,
      sessionVersion: (session.sessionVersion ?? 0) + 1,
      lastEventId: eventId,
      eventLog: appendEvent(session, roomEvent),
      updatedAt: new Date().toISOString(),
      progress: { ...result.progress, unlockedDeductions }
    };
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(getStorageKey(story.id, session.roomCode), JSON.stringify(nextSession));
    }
    set({ session: nextSession });
    return { ok: true };
  },

  solvePuzzle: (puzzleId) => {
    const { session, story } = get();
    if (!session || !story) return;

    const eventId = nextEventId(get().nickname);
    const roomEvent: RoomEvent = {
      id: eventId,
      type: 'SOLVE_PUZZLE',
      actor: get().nickname,
      createdAt: new Date().toISOString(),
      payload: { puzzleId }
    };
    const nextSession: GameSession = {
      ...session,
      sessionVersion: (session.sessionVersion ?? 0) + 1,
      lastEventId: eventId,
      eventLog: appendEvent(session, roomEvent),
      updatedAt: new Date().toISOString(),
      investigationSubstate: 'puzzle_solved',
      progress: {
        ...session.progress,
        solvedPuzzles: Array.from(new Set([...session.progress.solvedPuzzles, puzzleId]))
      }
    };

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(getStorageKey(story.id, session.roomCode), JSON.stringify(nextSession));
    }
    set((state) => ({
      session: nextSession,
      activityFeed: [...state.activityFeed, `${state.nickname} solved puzzle: ${puzzleId}`]
    }));
  },

  useHint: (puzzleId) => {
    const { content, session, story } = get();
    if (!content || !session || !story) return null;
    const hintConfig = content.metadata.puzzleHints.find((entry) => entry.puzzleId === puzzleId);
    if (!hintConfig || hintConfig.tiers.length === 0) return null;

    const used = session.progress.usedHints[puzzleId] ?? 0;
    const tier = Math.min(used, hintConfig.tiers.length - 1);
    const hintText = hintConfig.tiers[tier];
    if (!hintText) return null;
    const nextUsedHints = { ...session.progress.usedHints, [puzzleId]: used + 1 };
    const eventId = nextEventId(get().nickname);
    const roomEvent: RoomEvent = {
      id: eventId,
      type: 'USE_HINT',
      actor: get().nickname,
      createdAt: new Date().toISOString(),
      payload: { puzzleId, tier: used + 1 }
    };
    const nextSession: GameSession = {
      ...session,
      sessionVersion: (session.sessionVersion ?? 0) + 1,
      lastEventId: eventId,
      eventLog: appendEvent(session, roomEvent),
      updatedAt: new Date().toISOString(),
      progress: { ...session.progress, usedHints: nextUsedHints }
    };

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(getStorageKey(story.id, session.roomCode), JSON.stringify(nextSession));
    }
    set((state) => ({
      session: nextSession,
      activityFeed: [...state.activityFeed, `${state.nickname} used hint on ${puzzleId}`]
    }));
    return hintText;
  },

  advanceChapter: () => {
    const { content, session, story } = get();
    if (!content || !session || !story) return;
    const currentIndex = content.metadata.chapterCards.findIndex((chapter) => chapter.id === session.progress.currentChapterId);
    const nextIndex = Math.min(currentIndex + 1, content.metadata.chapterCards.length - 1);
    const nextChapter = content.metadata.chapterCards[nextIndex];
    if (!nextChapter || nextChapter.id === session.progress.currentChapterId) return;

    const eventId = nextEventId(get().nickname);
    const roomEvent: RoomEvent = {
      id: eventId,
      type: 'ADVANCE_CHAPTER',
      actor: get().nickname,
      createdAt: new Date().toISOString(),
      payload: { chapterId: nextChapter.id }
    };
    const nextSession: GameSession = {
      ...session,
      sessionVersion: (session.sessionVersion ?? 0) + 1,
      lastEventId: eventId,
      eventLog: appendEvent(session, roomEvent),
      updatedAt: new Date().toISOString(),
      progress: {
        ...session.progress,
        currentChapterId: nextChapter.id,
        chapterHistory: Array.from(new Set([...session.progress.chapterHistory, nextChapter.id]))
      }
    };
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(getStorageKey(story.id, session.roomCode), JSON.stringify(nextSession));
    }
    set((state) => ({
      session: nextSession,
      activityFeed: [...state.activityFeed, `Chapter advanced to ${nextChapter.title}`]
    }));
  },

  addPing: (text) => {
    const state = get();
    if (!state.session || !state.story) return;
    const entry = { id: `${Date.now()}-ping`, text, by: state.nickname, at: new Date().toISOString() };
    const eventId = nextEventId(state.nickname);
    const roomEvent: RoomEvent = {
      id: eventId,
      type: 'ADD_PING',
      actor: state.nickname,
      createdAt: new Date().toISOString(),
      payload: { text }
    };
    const nextSession: GameSession = {
      ...state.session,
      sessionVersion: (state.session.sessionVersion ?? 0) + 1,
      lastEventId: eventId,
      eventLog: appendEvent(state.session, roomEvent),
      updatedAt: new Date().toISOString(),
      roomPings: [...(state.session.roomPings ?? []), entry].slice(-50),
      activityFeed: [...(state.session.activityFeed ?? []), `${state.nickname} pinged: ${text}`].slice(-100)
    };
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(getStorageKey(state.story.id, state.session.roomCode), JSON.stringify(nextSession));
    }
    set({ session: nextSession, roomPings: nextSession.roomPings, activityFeed: nextSession.activityFeed });
  },

  addAnnotation: (note) => {
    const state = get();
    if (!state.session || !state.story) return;
    const entry = { id: `${Date.now()}-note`, note, by: state.nickname, at: new Date().toISOString() };
    const eventId = nextEventId(state.nickname);
    const roomEvent: RoomEvent = {
      id: eventId,
      type: 'ADD_ANNOTATION',
      actor: state.nickname,
      createdAt: new Date().toISOString(),
      payload: { note }
    };
    const nextSession: GameSession = {
      ...state.session,
      sessionVersion: (state.session.sessionVersion ?? 0) + 1,
      lastEventId: eventId,
      eventLog: appendEvent(state.session, roomEvent),
      updatedAt: new Date().toISOString(),
      roomAnnotations: [...(state.session.roomAnnotations ?? []), entry].slice(-50),
      activityFeed: [...(state.session.activityFeed ?? []), `${state.nickname} annotated a clue.`].slice(-100)
    };
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(getStorageKey(state.story.id, state.session.roomCode), JSON.stringify(nextSession));
    }
    set({
      session: nextSession,
      roomAnnotations: nextSession.roomAnnotations,
      activityFeed: nextSession.activityFeed
    });
  },

  castAccusationVote: (characterId) => {
    const state = get();
    if (!state.session || !state.story) return;
    const nextVotes = { ...(state.session.accusationVotes ?? {}), [state.nickname]: characterId };
    const eventId = nextEventId(state.nickname);
    const roomEvent: RoomEvent = {
      id: eventId,
      type: 'CAST_VOTE',
      actor: state.nickname,
      createdAt: new Date().toISOString(),
      payload: { characterId }
    };
    const nextSession: GameSession = {
      ...state.session,
      sessionVersion: (state.session.sessionVersion ?? 0) + 1,
      lastEventId: eventId,
      eventLog: appendEvent(state.session, roomEvent),
      updatedAt: new Date().toISOString(),
      accusationVotes: nextVotes,
      activityFeed: [...(state.session.activityFeed ?? []), `${state.nickname} voted for ${characterId}`].slice(-100)
    };
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(getStorageKey(state.story.id, state.session.roomCode), JSON.stringify(nextSession));
    }
    set({
      session: nextSession,
      accusationVotes: nextVotes,
      activityFeed: nextSession.activityFeed
    });
  },

  selectAccusation: (payload) => {
    const { session, story } = get();
    if (!session || !story) return;
    const eventId = nextEventId(get().nickname);
    const roomEvent: RoomEvent = {
      id: eventId,
      type: 'SELECT_ACCUSATION',
      actor: get().nickname,
      createdAt: new Date().toISOString()
    };
    const nextSession: GameSession = {
      ...session,
      sessionVersion: (session.sessionVersion ?? 0) + 1,
      lastEventId: eventId,
      eventLog: appendEvent(session, roomEvent),
      updatedAt: new Date().toISOString(),
      progress: {
        ...session.progress,
        accusedKiller: payload.killerId !== undefined ? payload.killerId : session.progress.accusedKiller,
        selectedMethod: payload.methodId !== undefined ? payload.methodId : session.progress.selectedMethod,
        selectedDelivery: payload.deliveryId !== undefined ? payload.deliveryId : session.progress.selectedDelivery,
        selectedInsurance: payload.insuranceId !== undefined ? payload.insuranceId : session.progress.selectedInsurance,
        selectedEvidence: payload.evidenceIds !== undefined ? payload.evidenceIds : session.progress.selectedEvidence
      }
    };
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(getStorageKey(story.id, session.roomCode), JSON.stringify(nextSession));
    }
    set({ session: nextSession });
  },

  finalizeAccusation: () => {
    const { session, story, content } = get();
    if (!session || !story || !content) return null;
    if (!get().isHost) return null;

    const outcome = evaluateAccusation(story, {
      killerId: session.progress.accusedKiller,
      method: session.progress.selectedMethod,
      delivery: session.progress.selectedDelivery,
      insurance: session.progress.selectedInsurance,
      evidence: session.progress.selectedEvidence
    });

    const eventId = nextEventId(get().nickname);
    const roomEvent: RoomEvent = {
      id: eventId,
      type: outcome.passed ? 'ACCUSATION_WIN' : 'ACCUSATION_FAIL',
      actor: get().nickname,
      createdAt: new Date().toISOString()
    };
    const nextSession: GameSession = {
      ...session,
      sessionVersion: (session.sessionVersion ?? 0) + 1,
      lastEventId: eventId,
      eventLog: appendEvent(session, roomEvent),
      updatedAt: new Date().toISOString(),
      phaseId: 'resolution',
      roomStage: outcome.passed ? 'stage_resolution_win' : 'stage_resolution_fail',
      activityFeed: [
        ...(session.activityFeed ?? []),
        outcome.passed ? `${get().nickname} closed the case successfully.` : `${get().nickname} submitted a failed accusation.`
      ].slice(-100)
    };

    const resolutionText = outcome.passed
      ? content.metadata.confession
      : 'Your accusation does not meet the full burden of proof. The case remains unresolved.';

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(getStorageKey(story.id, session.roomCode), JSON.stringify(nextSession));
    }

    set({ session: nextSession, resolutionText, activityFeed: nextSession.activityFeed });
    const event = outcome.passed ? 'ACCUSATION_WIN' : 'ACCUSATION_FAIL';
    set((current) => ({ flowEvents: [...current.flowEvents, event] }));
    return outcome;
  },

  advanceDialogue: (characterId, nextNodeId) => {
    const state = get();
    set({
      activeDialogueByCharacter: {
        ...state.activeDialogueByCharacter,
        [characterId]: nextNodeId
      }
    });
  }
}));