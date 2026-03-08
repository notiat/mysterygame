import { InvestigationSubstate, RoomStage } from '@/types/platform';

export interface FlowState {
  roomStage: RoomStage;
  investigationSubstate: InvestigationSubstate;
}

export type GameFlowEvent =
  | { type: 'ROOM_CREATED' }
  | { type: 'PLAYER_JOINED' }
  | { type: 'START_GAME' }
  | { type: 'INTRO_COMPLETE' }
  | { type: 'INTERROGATION_UNLOCKED' }
  | { type: 'OPEN_ACCUSATION' }
  | { type: 'ACCUSATION_WIN' }
  | { type: 'ACCUSATION_FAIL' }
  | { type: 'POST_GAME' }
  | { type: 'RESET_TO_LOBBY' }
  | { type: 'CLOSE_ROOM' }
  | { type: 'CLUE_SPOTTED' }
  | { type: 'CLUE_COLLECTED' }
  | { type: 'CLUE_EXAMINED' }
  | { type: 'ANALYSIS_STARTED' }
  | { type: 'ANALYSIS_FINISHED' }
  | { type: 'PUZZLE_AVAILABLE' }
  | { type: 'PUZZLE_STARTED' }
  | { type: 'PUZZLE_SOLVED' };

export const initialFlowState: FlowState = {
  roomStage: 'room_idle',
  investigationSubstate: 'scene_explore'
};

export function transitionFlowState(state: FlowState, event: GameFlowEvent): FlowState {
  switch (event.type) {
    case 'ROOM_CREATED':
      return { ...state, roomStage: 'room_lobby' };
    case 'PLAYER_JOINED':
      return state.roomStage === 'room_lobby' ? state : { ...state, roomStage: 'room_lobby' };
    case 'START_GAME':
      return { ...state, roomStage: 'intro_cinematic' };
    case 'INTRO_COMPLETE':
      return { ...state, roomStage: 'stage_investigation', investigationSubstate: 'scene_explore' };
    case 'INTERROGATION_UNLOCKED':
      return { ...state, roomStage: 'stage_interrogation' };
    case 'OPEN_ACCUSATION':
      return { ...state, roomStage: 'stage_accusation' };
    case 'ACCUSATION_WIN':
      return { ...state, roomStage: 'stage_resolution_win' };
    case 'ACCUSATION_FAIL':
      return { ...state, roomStage: 'stage_resolution_fail' };
    case 'POST_GAME':
      return { ...state, roomStage: 'post_game' };
    case 'RESET_TO_LOBBY':
      return { ...state, roomStage: 'room_lobby', investigationSubstate: 'scene_explore' };
    case 'CLOSE_ROOM':
      return { ...state, roomStage: 'room_closed' };
    case 'CLUE_SPOTTED':
      return { ...state, investigationSubstate: 'clue_spotted' };
    case 'CLUE_COLLECTED':
      return { ...state, investigationSubstate: 'clue_collected' };
    case 'CLUE_EXAMINED':
      return { ...state, investigationSubstate: 'clue_examined' };
    case 'ANALYSIS_STARTED':
      return { ...state, investigationSubstate: 'analysis_run' };
    case 'ANALYSIS_FINISHED':
      return { ...state, investigationSubstate: 'deduction_recalc' };
    case 'PUZZLE_AVAILABLE':
      return { ...state, investigationSubstate: 'puzzle_available' };
    case 'PUZZLE_STARTED':
      return { ...state, investigationSubstate: 'puzzle_attempt' };
    case 'PUZZLE_SOLVED':
      return { ...state, investigationSubstate: 'puzzle_solved' };
    default:
      return state;
  }
}

export function replayFlowState(events: Array<{ type: GameFlowEvent['type'] }>): FlowState {
  return events.reduce<FlowState>((current, event) => transitionFlowState(current, { type: event.type } as GameFlowEvent), {
    ...initialFlowState
  });
}
