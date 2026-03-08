'use client';

import { useEffect, useMemo, useRef } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { useGameStore } from '@/lib/store/gameStore';
import { broadcastSessionUpdate, createRealtimeSessionChannel } from '@/lib/platform/realtimeSession';

function colorForId(id: string) {
  const colors = ['#38bdf8', '#f472b6', '#a3e635', '#f59e0b', '#c084fc'];
  const idx = Math.abs(id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % colors.length;
  return colors[idx];
}

export function useRealtimeSession(enabled = true) {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const isSubscribedRef = useRef(false);
  const { session, nickname, applyRemoteSession, setPresenceUsers } = useGameStore();
  const sessionId = session?.id ?? null;

  const currentUser = useMemo(() => {
    const userId = typeof crypto !== 'undefined' ? crypto.randomUUID() : `agent-${Date.now()}`;
    const name = nickname || `Agent-${userId.slice(0, 4).toUpperCase()}`;
    return { id: userId, name, color: colorForId(userId) };
  }, [nickname]);

  useEffect(() => {
    if (!enabled || !sessionId) return;

    const channel = createRealtimeSessionChannel(sessionId, currentUser, {
      onSessionUpdate: applyRemoteSession,
      onPresenceUpdate: setPresenceUsers
    });
    channelRef.current = channel;
    isSubscribedRef.current = Boolean(channel);

    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
      }
      channelRef.current = null;
      isSubscribedRef.current = false;
    };
  }, [enabled, sessionId, currentUser, applyRemoteSession, setPresenceUsers]);

  useEffect(() => {
    if (!enabled || !session) return;
    if (!isSubscribedRef.current || !channelRef.current) return;
    void broadcastSessionUpdate(channelRef.current, session);
  }, [enabled, session]);

  return { channel: channelRef.current, currentUser };
}
