import { RealtimeChannel } from '@supabase/supabase-js';
import { GameSession, PresenceUser } from '@/types/platform';
import { supabase } from '@/lib/supabase/client';

type SessionSyncHandlers = {
  onSessionUpdate: (session: GameSession) => void;
  onPresenceUpdate: (users: PresenceUser[]) => void;
};

export function createRealtimeSessionChannel(
  sessionId: string,
  currentUser: PresenceUser,
  handlers: SessionSyncHandlers
) {
  if (!supabase) return null;

  const channel: RealtimeChannel = supabase.channel(`game-session:${sessionId}`, {
    config: { presence: { key: currentUser.id } }
  });

  channel.on('broadcast', { event: 'session_update' }, (payload) => {
    const nextSession = payload.payload as GameSession;
    handlers.onSessionUpdate(nextSession);
  });

  channel.on('presence', { event: 'sync' }, () => {
    const state = channel.presenceState<PresenceUser>();
    const users = Object.values(state)
      .flatMap((entry) => entry)
      .map((user) => ({
        id: user.id,
        name: user.name,
        color: user.color
      }));
    handlers.onPresenceUpdate(users);
  });

  channel.subscribe((status) => {
    if (status === 'SUBSCRIBED') {
      channel.track(currentUser);
    }
  });

  return channel;
}

export async function broadcastSessionUpdate(channel: RealtimeChannel | null, session: GameSession) {
  if (!channel) return;
  await channel.send({
    type: 'broadcast',
    event: 'session_update',
    payload: session
  });
}
