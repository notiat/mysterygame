'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface StoryLauncherFormProps {
  storyId: string;
}

function randomCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export default function StoryLauncherForm({ storyId }: StoryLauncherFormProps) {
  const router = useRouter();
  const [nickname, setNickname] = useState('');
  const [joinCode, setJoinCode] = useState('');

  return (
    <div className="mt-4 space-y-3 rounded border border-slate-700 bg-slate-950 p-3">
      <input
        aria-label="Nickname"
        value={nickname}
        onChange={(event) => setNickname(event.target.value)}
        placeholder="Nickname"
        className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
      />
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <button
          onClick={() => {
            const code = randomCode();
            const nick = nickname.trim() || 'HostAgent';
            router.push(`/room/${code}?story=${storyId}&nick=${encodeURIComponent(nick)}&host=1`);
          }}
          className="rounded bg-blue-600 px-3 py-2 text-sm font-semibold text-white"
        >
          Create Room
        </button>
        <div className="flex gap-2">
          <input
            aria-label="Room code"
            value={joinCode}
            onChange={(event) => setJoinCode(event.target.value.toUpperCase())}
            placeholder="Room Code"
            className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
          />
          <button
            onClick={() => {
              const nick = nickname.trim() || `Agent${Math.floor(Math.random() * 99)}`;
              if (!joinCode.trim()) return;
              router.push(`/room/${joinCode.trim()}?story=${storyId}&nick=${encodeURIComponent(nick)}&host=0`);
            }}
            className="rounded bg-emerald-600 px-3 py-2 text-sm font-semibold text-white"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
}
