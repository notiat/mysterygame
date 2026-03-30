'use client';

import { motion } from 'framer-motion';
import { Deduction, EvidenceItem } from '@/types/story';
import { GameProgress } from '@/types/platform';

interface DetectiveNotebookProps {
  progress: GameProgress;
  allEvidence: EvidenceItem[];
  allDeductions: Deduction[];
  onClose: () => void;
}

export default function DetectiveNotebook({
  progress,
  allEvidence,
  allDeductions,
  onClose
}: DetectiveNotebookProps) {
  // Calculate what player needs next
  const getNextObjectives = () => {
    const objectives: string[] = [];
    
    // Check puzzle status
    if (!progress.solvedPuzzles.includes('training-log-decrypt')) {
      objectives.push('🧩 Solve Puzzle 1: Decrypt the training log password');
    }
    if (!progress.solvedPuzzles.includes('timeline-sequence')) {
      objectives.push('🧩 Solve Puzzle 2: Reconstruct the timeline sequence');
    }
    
    // Check deduction unlock status
    const lockedDeductions = allDeductions.filter(
      (ded) => !progress.unlockedDeductions.includes(ded.id)
    );
    
    if (lockedDeductions.length > 0) {
      lockedDeductions.forEach((ded) => {
        const missingEvidence = ded.unlockedBy.filter(
          (evidenceId) => !progress.inventory.includes(evidenceId)
        );
        
        if (missingEvidence.length > 0) {
          objectives.push(
            `🔍 Unlock deduction "${ded.title}" by finding: ${missingEvidence.map((id) => {
              const evidence = allEvidence.find((e) => e.id === id);
              return evidence?.name ?? id;
            }).join(', ')}`
          );
        }
      });
    }
    
    // Check accusation readiness
    if (progress.unlockedDeductions.length >= 3) {
      if (!progress.accusedKiller) {
        objectives.push('⚖️ Ready to accuse! Open Case Board → Final Accusation');
      }
    }
    
    return objectives.slice(0, 5); // Show max 5 objectives
  };

  // Get evidence location hints
  const getEvidenceHints = () => {
    const hints: Array<{ evidence: string; location: string }> = [];
    
    allEvidence.forEach((item) => {
      if (!progress.inventory.includes(item.id)) {
        hints.push({
          evidence: item.name,
          location: item.location
        });
      }
    });
    
    return hints.slice(0, 8); // Show max 8 hints
  };

  const objectives = getNextObjectives();
  const hints = getEvidenceHints();
  const collectedCount = progress.inventory.length;
  const totalCount = allEvidence.length;
  const analysisUsed = 5 - progress.analyzerCharges;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative max-w-2xl w-full max-h-[90vh] overflow-auto bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl border-2 border-amber-500/50 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-amber-600 to-amber-500 px-6 py-4 border-b-2 border-amber-400">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📓</span>
              <h2 className="text-2xl font-bold text-white">Detective Notebook</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-amber-100 transition-colors text-2xl font-bold"
              aria-label="Close notebook"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Progress Summary */}
          <section className="rounded-xl border-2 border-slate-700 bg-slate-900/50 p-4">
            <h3 className="text-lg font-bold text-amber-400 mb-3 uppercase tracking-wider">
              📊 Investigation Progress
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-lg bg-slate-800/50 p-3 border border-slate-700">
                <p className="text-slate-400 mb-1">Evidence Collected</p>
                <p className="text-2xl font-bold text-white">{collectedCount}/{totalCount}</p>
              </div>
              <div className="rounded-lg bg-slate-800/50 p-3 border border-slate-700">
                <p className="text-slate-400 mb-1">Analysis Used</p>
                <p className="text-2xl font-bold text-white">{analysisUsed}/5</p>
              </div>
              <div className="rounded-lg bg-slate-800/50 p-3 border border-slate-700">
                <p className="text-slate-400 mb-1">Puzzles Solved</p>
                <p className="text-2xl font-bold text-white">{progress.solvedPuzzles.length}/2</p>
              </div>
              <div className="rounded-lg bg-slate-800/50 p-3 border border-slate-700">
                <p className="text-slate-400 mb-1">Deductions Unlocked</p>
                <p className="text-2xl font-bold text-white">{progress.unlockedDeductions.length}/{allDeductions.length}</p>
              </div>
            </div>
          </section>

          {/* Current Objectives */}
          {objectives.length > 0 && (
            <section className="rounded-xl border-2 border-blue-500/50 bg-blue-950/30 p-4">
              <h3 className="text-lg font-bold text-blue-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                <span>🎯</span>
                Next Steps
              </h3>
              <ul className="space-y-2">
                {objectives.map((objective, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-slate-100 bg-slate-900/50 rounded-lg p-3 border border-slate-700"
                  >
                    <span className="text-blue-400 font-bold text-lg">{idx + 1}.</span>
                    <span className="flex-1 leading-relaxed">{objective}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Evidence Locations */}
          {hints.length > 0 && (
            <section className="rounded-xl border-2 border-slate-700 bg-slate-900/50 p-4">
              <h3 className="text-lg font-bold text-amber-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                <span>📍</span>
                Evidence Locations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {hints.map((hint, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg bg-slate-800/50 p-3 border border-slate-700 hover:border-amber-500/50 transition-colors"
                  >
                    <p className="text-white font-semibold text-sm">{hint.evidence}</p>
                    <p className="text-xs text-slate-400 mt-1">📍 {hint.location}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Tips Section */}
          <section className="rounded-xl border-2 border-emerald-500/50 bg-emerald-950/30 p-4">
            <h3 className="text-lg font-bold text-emerald-400 mb-3 uppercase tracking-wider flex items-center gap-2">
              <span>💡</span>
              Tips
            </h3>
            <ul className="space-y-2 text-sm text-slate-200">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">•</span>
                <span>Use analyzer charges on evidence that seems critical to the case</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">•</span>
                <span>Some dialogue options require specific evidence to unlock</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">•</span>
                <span>Deductions unlock automatically when you collect the required evidence</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">•</span>
                <span>Your progress is auto-saved - you can return anytime</span>
              </li>
            </ul>
          </section>

          {/* Keyboard Shortcuts */}
          <section className="rounded-xl border-2 border-slate-700 bg-slate-900/50 p-4">
            <h3 className="text-lg font-bold text-slate-400 mb-3 uppercase tracking-wider flex items-center gap-2">
              <span>⌨️</span>
              Keyboard Shortcuts
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-slate-800 border border-slate-600 rounded text-white font-mono">I</kbd>
                <span className="text-slate-300">Investigation</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-slate-800 border border-slate-600 rounded text-white font-mono">S</kbd>
                <span className="text-slate-300">Suspects</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-slate-800 border border-slate-600 rounded text-white font-mono">C</kbd>
                <span className="text-slate-300">Case Board</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-slate-800 border border-slate-600 rounded text-white font-mono">ESC</kbd>
                <span className="text-slate-300">Close All</span>
              </div>
            </div>
          </section>
        </div>
      </motion.div>
    </motion.div>
  );
}
