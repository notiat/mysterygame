'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { EvidenceItem } from '@/types/story';

interface EvidenceZoomModalProps {
  evidence: EvidenceItem | null;
  isAnalyzed: boolean;
  onClose: () => void;
}

export default function EvidenceZoomModal({ evidence, isAnalyzed, onClose }: EvidenceZoomModalProps) {
  if (!evidence) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative max-w-4xl w-full max-h-[90vh] overflow-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="rounded-2xl border-2 border-amber-500/50 bg-slate-950 p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-start justify-between mb-4 border-b border-slate-700 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">{evidence.name}</h2>
                <p className="text-sm text-amber-400">📍 {evidence.location}</p>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg bg-slate-800 hover:bg-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:text-white transition-colors"
              >
                ✕ Close
              </button>
            </div>

            {/* Large Evidence Image */}
            <div className="relative w-full aspect-[4/3] mb-6 rounded-xl overflow-hidden border-2 border-slate-700 bg-slate-900">
              <Image
                src={evidence.image ?? '/assets/terminal-velocity/evidence/whiskey-glass.svg'}
                alt={evidence.name}
                fill
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-contain"
                priority
              />
            </div>

            {/* Evidence Details */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-2">Description</h3>
                <p className="text-base text-slate-200 leading-relaxed">{evidence.description}</p>
              </div>

              {evidence.visualClue && (
                <div>
                  <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-2">Visual Clue</h3>
                  <p className="text-base text-slate-200 leading-relaxed">{evidence.visualClue}</p>
                </div>
              )}

              {isAnalyzed && evidence.analysisData && (
                <div className="rounded-xl border-2 border-emerald-500/50 bg-emerald-950/20 p-4">
                  <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-2">
                    ⚗️ Analysis Results
                  </h3>
                  <p className="text-base text-emerald-200 font-medium mb-3">{evidence.analysisData.result}</p>
                  <div className="text-sm text-slate-300 space-y-1">
                    <p>Confidence: {evidence.analysisData.confidence}%</p>
                    {evidence.analysisData.notes && evidence.analysisData.notes.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {evidence.analysisData.notes.map((note, idx) => (
                          <p key={idx} className="text-xs text-slate-400">• {note}</p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {!isAnalyzed && evidence.requiresCharge && (
                <div className="rounded-xl border-2 border-blue-500/50 bg-blue-950/20 p-4">
                  <p className="text-sm text-blue-200">
                    💡 This evidence can be analyzed using an analyzer charge for more information.
                  </p>
                </div>
              )}

              {evidence.tags && evidence.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {evidence.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-lg bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300 border border-slate-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer hint */}
            <div className="mt-6 pt-4 border-t border-slate-700">
              <p className="text-xs text-slate-500 text-center">
                💡 Tip: Examine the image carefully for details that might be relevant to the case
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
