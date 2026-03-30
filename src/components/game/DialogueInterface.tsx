'use client';

import Image from 'next/image';
import { Character, DialogueNode, EvidenceItem } from '@/types/story';

interface DialogueInterfaceProps {
  character: Character;
  node: DialogueNode | null;
  inventory: string[];
  evidenceList?: EvidenceItem[];
  onSelectResponse: (nextNodeId: string | null) => void;
}

export default function DialogueInterface({
  character,
  node,
  inventory,
  evidenceList = [],
  onSelectResponse
}: DialogueInterfaceProps) {
  const getEvidenceName = (evidenceId: string): string => {
    const evidence = evidenceList.find((item) => item.id === evidenceId);
    return evidence?.name ?? evidenceId;
  };

  return (
    <section className="rounded-xl border-2 border-slate-700 bg-slate-950/90 p-5">
      <div className="mb-5 flex items-start gap-4 border-b border-slate-700 pb-4">
        <Image
          src={character.portrait}
          alt={character.name}
          width={80}
          height={80}
          className="h-20 w-20 rounded-xl border-2 border-slate-600 shadow-lg"
        />
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-1">{character.name}</h3>
          <p className="text-sm text-amber-400 font-semibold uppercase tracking-wide">{character.role}</p>
          <p className="text-xs text-slate-400 mt-1">{character.bio}</p>
        </div>
      </div>

      <div className="rounded-xl border-2 border-slate-700 bg-slate-900/50 p-5 mb-5 min-h-[120px]">
        <p className="text-sm uppercase tracking-wider text-slate-500 mb-2">💬 Statement</p>
        <p className="text-base text-slate-100 leading-relaxed italic">
          &ldquo;{node?.text ?? 'No dialogue loaded for this character.'}&rdquo;
        </p>
      </div>

      <div>
        <p className="text-xs uppercase tracking-wider text-amber-400 font-bold mb-3">🔍 Your Questions</p>
        <div className="space-y-3">
          {(node?.responses ?? []).map((response) => {
            const missing =
              response.requiresEvidence?.filter((evidenceId) => !inventory.includes(evidenceId)) ?? [];
            const disabled = missing.length > 0;
            const missingNames = missing.map(getEvidenceName);
            
            return (
              <button
                key={response.id}
                disabled={disabled}
                onClick={() => onSelectResponse(response.nextNodeId)}
                className={`w-full rounded-xl border-2 px-4 py-3 text-left text-sm transition-all min-h-[52px] ${
                  disabled
                    ? 'border-slate-800 bg-slate-900/30 text-slate-600 cursor-not-allowed'
                    : 'border-slate-700 bg-slate-900 text-slate-100 hover:border-amber-500 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="font-medium">{response.text}</span>
                {disabled ? (
                  <span className="mt-2 block text-xs text-rose-400">
                    🔒 Need to find: {missingNames.join(' • ')}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
