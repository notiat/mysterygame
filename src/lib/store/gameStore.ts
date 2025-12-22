import { create } from 'zustand';
import { supabase } from '../supabase/client';
import { Clue, Room } from '../types/schema';

interface GameState {
  room: Room | null;
  clues: Clue[];
  isLoading: boolean;
  error: string | null;

  fetchRoomData: (codeToFetch: string) => Promise<void>;
  unlockClue: (clueId: string, inputCode: string) => Promise<boolean>;
}

export const useGameStore = create<GameState>((set, get) => ({
  room: null,
  clues: [],
  isLoading: false,
  error: null,

  fetchRoomData: async (codeToFetch) => {
    set({ isLoading: true, error: null });
    console.log(`🔍 START: Fetching room for code: ${codeToFetch}`);

    // 1. Fetch Room
    const { data: roomData, error: roomError } = await supabase
      .from('rooms')
      .select('*')
      .eq('code', codeToFetch)
      .single();

    if (roomError) {
      console.error('❌ Error fetching room:', roomError);
      set({ isLoading: false, error: 'Room not found' });
      return;
    }

    // 2. Fetch Clues (Use codeToFetch explicitly!)
    console.log(`2️⃣ Fetching clues for room_id: ${codeToFetch}`);
    const { data: cluesData, error: cluesError } = await supabase
      .from('clues')
      .select('*')
      .eq('room_id', codeToFetch);

    console.log(`3️⃣ Clues found: ${cluesData?.length || 0}`);

    if (cluesError) {
      console.error('❌ Error fetching clues:', cluesError);
      set({ isLoading: false, error: 'Error loading clues' });
      return;
    }

    set({ 
      room: roomData, 
      clues: cluesData || [], 
      isLoading: false 
    });
    console.log('✅ Success: Data loaded into store');
  },

  unlockClue: async (clueId, inputCode) => {
    console.log(`Unlocking ${clueId} with ${inputCode}`);
    
    const state = get();
    // Find the clue in local state
    const clue = state.clues.find(c => c.id === clueId);
    if (!clue) {
      console.error('Clue not found in state');
      return false;
    }

    // Check if the input code matches
    if (inputCode !== clue.metadata.lockSolution) {
      console.log('Incorrect code');
      return false;
    }

    // Update in Supabase
    const { error } = await supabase
      .from('clues')
      .update({ status: 'UNLOCKED' })
      .eq('id', clueId);

    if (error) {
      console.error('Error updating clue in DB:', error);
      return false;
    }

    // Update local state
    const updatedClues = state.clues.map(c => 
      c.id === clueId ? { ...c, status: 'UNLOCKED' as const } : c
    );
    set({ clues: updatedClues });
    console.log('Clue unlocked successfully');
    return true;
  }
}));