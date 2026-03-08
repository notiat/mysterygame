'use client';

import { useState } from 'react';

interface CollabToolsProps {
  onPing: (text: string) => void;
  onAnnotate: (note: string) => void;
  onVote: (characterId: string) => void;
  characters: Array<{ id: string; name: string }>;
}

export default function CollabTools({ onPing, onAnnotate, onVote, characters }: CollabToolsProps) {
  const [pingText, setPingText] = useState('');
  const [noteText, setNoteText] = useState('');

  return (
    <section className="space-y-3 text-sm">
      <div className="rounded border border-slate-700 bg-slate-950 p-2">
        <p className="mb-1 text-xs uppercase tracking-wider text-slate-400">Quick Ping</p>
        <div className="flex gap-2">
          <input
            aria-label="Team ping input"
            value={pingText}
            onChange={(e) => setPingText(e.target.value)}
            placeholder="Ping teammates"
            className="flex-1 rounded border border-slate-700 bg-black px-2 py-1"
          />
          <button
            onClick={() => {
              if (!pingText.trim()) return;
              onPing(pingText.trim());
              setPingText('');
            }}
            className="rounded bg-white px-3 py-1 text-xs font-bold text-black"
          >
            Send
          </button>
        </div>
      </div>

      <div className="rounded border border-slate-700 bg-slate-950 p-2">
        <p className="mb-1 text-xs uppercase tracking-wider text-slate-400">Annotate Clue</p>
        <textarea
          aria-label="Clue annotation input"
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Leave a forensic note for team..."
          className="h-20 w-full rounded border border-slate-700 bg-black px-2 py-1"
        />
        <button
          onClick={() => {
            if (!noteText.trim()) return;
            onAnnotate(noteText.trim());
            setNoteText('');
          }}
          className="mt-2 rounded bg-white px-3 py-1 text-xs font-bold text-black"
        >
          Save Note
        </button>
      </div>

      <div className="rounded border border-slate-700 bg-slate-950 p-2">
        <p className="mb-1 text-xs uppercase tracking-wider text-slate-400">Accusation Vote (Preview)</p>
        <div className="flex flex-wrap gap-2">
          {characters.map((character) => (
            <button
              key={character.id}
              onClick={() => onVote(character.id)}
              className="rounded border border-slate-700 px-2 py-1 text-xs hover:border-white"
            >
              Vote {character.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
