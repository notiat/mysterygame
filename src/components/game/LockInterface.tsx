'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Clue } from '@/types/schema';

interface LockInterfaceProps {
  clue: Clue;
  onUnlock?: (clueId: string, inputCode: string) => Promise<boolean>;
}

export default function LockInterface({ clue, onUnlock }: LockInterfaceProps) {
  const [inputCode, setInputCode] = useState('');
  const [error, setError] = useState(false);

  // 1. Handle Unlocked State (The Reward View)
  if (clue.status === 'UNLOCKED') {
    return (
      <div className="animate-fade-in w-full h-full flex flex-col items-center justify-center p-4">
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border-2 border-green-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
           {/* Use the rewardImage from metadata, or a fallback if missing */}
          <Image
            src={(clue.metadata.rewardImage as string) || 'https://placehold.co/600x400/333?text=Unlocked'}
            alt="Unlocked Content"
            width={600}
            height={400}
            className="w-full h-full object-cover"
          />
        </div>
        <p className="mt-4 text-green-400 font-mono text-sm tracking-widest uppercase">
          🔓 SYSTEM ACCESSED
        </p>
      </div>
    );
  }

  // 2. Handle Locked State (The Keypad View)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUnlock) {
      setError(true);
      setInputCode('');
      setTimeout(() => setError(false), 1200);
      return;
    }

    const success = await onUnlock(clue.id, inputCode);
    if (!success) {
      setError(true);
      setInputCode(''); // Clear input on fail
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-slate-900/50">
      <div className="mb-6 text-slate-400 text-sm font-mono tracking-wider">
        SECURITY LEVEL: HIGH
      </div>
      
      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          aria-label="4 digit passcode"
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value)}
          placeholder="ENTER PASSCODE"
          maxLength={4}
          className={`w-full bg-slate-950 border-2 ${
            error ? 'border-red-500 animate-pulse' : 'border-slate-700 focus:border-blue-500'
          } rounded px-4 py-3 text-center font-mono text-xl tracking-[0.5em] outline-none transition-colors`}
        />
        
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded transition-all active:scale-95 shadow-lg shadow-blue-900/20"
        >
          {error ? 'ACCESS DENIED' : 'SUBMIT'}
        </button>
      </form>
    </div>
  );
}