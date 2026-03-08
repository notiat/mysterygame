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
    <div className="mt-6 space-y-4 rounded-xl border-2 border-slate-700 bg-slate-950/50 backdrop-blur p-5">
      <div>
        <label className="block text-xs font-semibold text-amber-400 mb-2 uppercase tracking-wider">Your Codename</label>
        <input
          aria-label="Nickname"
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
          placeholder="Enter nickname..."
          className="w-full rounded-lg border-2 border-slate-700 bg-slate-900 px-4 py-3 text-base focus:border-amber-500 focus:outline-none transition-colors"
        />
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <button
          onClick={() => {
            const code = randomCode();
            const nick = nickname.trim() || 'HostAgent';
            router.push(`/room/${code}?story=${storyId}&nick=${encodeURIComponent(nick)}&host=1`);
          }}
          className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3 text-base font-bold text-white hover:from-blue-500 hover:to-blue-400 transition-all shadow-lg hover:shadow-blue-500/50 min-h-[48px]"
        >
          🎮 Create Room
        </button>
        <div className="flex gap-2">
          <input
            aria-label="Room code"
            value={joinCode}
            onChange={(event) => setJoinCode(event.target.value.toUpperCase())}
            placeholder="CODE"
            className="w-full rounded-lg border-2 border-slate-700 bg-slate-900 px-3 py-3 text-base text-center font-mono uppercase focus:border-emerald-500 focus:outline-none transition-colors"
          />
          <button
            onClick={() => {
              const nick = nickname.trim() || `Agent${Math.floor(Math.random() * 99)}`;
              if (!joinCode.trim()) return;
              router.push(`/room/${joinCode.trim()}?story=${storyId}&nick=${encodeURIComponent(nick)}&host=0`);
            }}
            className="rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 py-3 text-base font-bold text-white hover:from-emerald-500 hover:to-emerald-400 transition-all shadow-lg hover:shadow-emerald-500/50 min-h-[48px] whitespace-nowrap"
          >
            🚪 Join
          </button>
        </div>
      </div>
    </div>
  );
}
