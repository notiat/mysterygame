'use client';

import Image from 'next/image';
import { Character, DialogueNode } from '@/types/story';

interface DialogueInterfaceProps {
  character: Character;
  node: DialogueNode | null;
  inventory: string[];
  onSelectResponse: (nextNodeId: string | null) => void;
}

export default function DialogueInterface({
  character,
  node,
  inventory,
  onSelectResponse
}: DialogueInterfaceProps) {
  return (
    <section className="rounded-lg border border-slate-700 bg-slate-950 p-4">
      <div className="mb-3 flex items-center gap-3">
        <Image
          src={character.portrait}
          alt={character.name}
          width={48}
          height={48}
          className="h-12 w-12 rounded-full border border-slate-600"
        />
        <div>
          <h3 className="text-base font-semibold text-slate-100">{character.name}</h3>
          <p className="text-xs text-slate-400">{character.role}</p>
        </div>
      </div>

      <div className="rounded border border-slate-700 bg-slate-900 p-3 text-sm text-slate-200">
        {node?.text ?? 'No dialogue loaded for this character.'}
      </div>

      <div className="mt-3 space-y-2">
        {(node?.responses ?? []).map((response) => {
          const missing =
            response.requiresEvidence?.filter((evidenceId) => !inventory.includes(evidenceId)) ?? [];
          const disabled = missing.length > 0;
          return (
            <button
              key={response.id}
              disabled={disabled}
              onClick={() => onSelectResponse(response.nextNodeId)}
              className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-left text-sm text-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {response.text}
              {disabled ? <span className="mt-1 block text-xs text-rose-300">Missing: {missing.join(', ')}</span> : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}
