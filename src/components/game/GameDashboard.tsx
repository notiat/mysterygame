'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { getDialogueNode, getDialogueRootForCharacter } from '@/lib/platform/dialogue';
import { getPhaseDisplayName } from '@/lib/platform/phases';
import { useGameStore } from '@/lib/store/gameStore';
import { interactionMotion } from '@/lib/design/motion';
import { neoNoirTheme } from '@/lib/design/tokens';
import { useOrientation } from '@/hooks/useOrientation';
import { StoryContent } from '@/types/story';
import ChapterCard from './ChapterCard';
import FloatingWindow from './FloatingWindow';
import ResponsiveSceneImage from './ResponsiveSceneImage';
import ToastContainer, { useToast } from '../system/Toast';

const AnalyzerInterface = dynamic(() => import('./AnalyzerInterface'));
const CollabTools = dynamic(() => import('./CollabTools'));
const DeductionPanel = dynamic(() => import('./DeductionPanel'));
const DialogueInterface = dynamic(() => import('./DialogueInterface'));
const PuzzlePanel = dynamic(() => import('./PuzzlePanel'));
const ProgressIndicator = dynamic(() => import('./ProgressIndicator'), { ssr: false });
const TutorialOverlay = dynamic(() => import('./TutorialOverlay'), { ssr: false });
const KeyboardShortcuts = dynamic(() => import('./KeyboardShortcuts'), { ssr: false });
const EvidenceZoomModal = dynamic(() => import('./EvidenceZoomModal'), { ssr: false });
const DetectiveNotebook = dynamic(() => import('./DetectiveNotebook'), { ssr: false });

interface GameDashboardProps {
  content: StoryContent;
}

export default function GameDashboard({ content }: GameDashboardProps) {
  const {
    session,
    presenceUsers,
    activeDialogueByCharacter,
    resolutionText,
    flowEvents,
    activityFeed,
    roomPings,
    roomAnnotations,
    accusationVotes,
    collectEvidence,
    examineEvidence,
    analyzeEvidence,
    solvePuzzle,
    useHint,
    advanceChapter,
    addPing,
    addAnnotation,
    castAccusationVote,
    dispatchFlowEvent,
    selectAccusation,
    finalizeAccusation,
    advanceDialogue,
    setDifficulty
  } = useGameStore();

  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null);
  const [analyzerOutput, setAnalyzerOutput] = useState('Analyzer ready.');
  const [activeCharacterId, setActiveCharacterId] = useState(content.characters[0]?.id ?? '');
  const [windowOpen, setWindowOpen] = useState({
    investigation: false,
    suspects: false,
    caseboard: false
  });
  const [showChapterCard, setShowChapterCard] = useState(true);
  const [tutorialComplete, setTutorialComplete] = useState(false);
  const [zoomedEvidenceId, setZoomedEvidenceId] = useState<string | null>(null);
  const [showNotebook, setShowNotebook] = useState(false);
  const orientation = useOrientation();
  const { messages: toastMessages, showToast, dismissToast } = useToast();

  const closeAllWindows = () => {
    setWindowOpen({ investigation: false, suspects: false, caseboard: false });
  };

  const zoomedEvidence = content.evidence.find((item) => item.id === zoomedEvidenceId) ?? null;

  if (!session) return null;

  const selectedEvidence = content.evidence.find((item) => item.id === selectedEvidenceId) ?? null;
  const activeDialogueId =
    activeDialogueByCharacter[activeCharacterId] ??
    getDialogueRootForCharacter(content.dialogues, activeCharacterId)?.id ??
    null;
  const activeNode = getDialogueNode(content.dialogues, activeDialogueId);

  const accusationReady = Boolean(
    session.progress.accusedKiller &&
      session.progress.selectedMethod &&
      session.progress.selectedDelivery &&
      session.progress.selectedInsurance
  );

  const runAnalysis = () => {
    if (!selectedEvidence) {
      setAnalyzerOutput('Select evidence from inventory first.');
      showToast('No evidence selected', 'warning');
      return;
    }
    
    // Warn on last charge
    if (session.progress.analyzerCharges === 1) {
      const confirmed = window.confirm(
        '⚠️ This is your LAST analyzer charge!\n\nAre you sure you want to analyze this evidence now?\n\n' +
        `Evidence: ${selectedEvidence.name}\n` +
        'Choose wisely - you won\'t be able to analyze any more items after this.'
      );
      if (!confirmed) {
        showToast('Analysis canceled', 'info');
        return;
      }
    }
    
    const result = analyzeEvidence(selectedEvidence.id);
    if (!result.ok) {
      setAnalyzerOutput(result.error ?? 'Analysis failed.');
      showToast(result.error ?? 'Analysis failed', 'error');
      return;
    }
    const item = content.evidence.find((entry) => entry.id === selectedEvidence.id);
    setAnalyzerOutput(item?.analysisData.result ?? 'Analysis complete.');
    showToast(`Analysis complete: ${selectedEvidence.name}`, 'success');
    
    // Show warning after using last charge
    if (session.progress.analyzerCharges === 0) {
      showToast('⚠️ No analyzer charges remaining!', 'warning');
    }
  };

  const phaseLabel = getPhaseDisplayName(content.story, session.phaseId);
  const roomStage = session.roomStage;
  const difficultyId =
    content.metadata.difficultyModes.find((difficulty) => difficulty.analyzerCharges === session.progress.analyzerCharges)?.id ??
    'normal';
  const currentChapter =
    content.metadata.chapterCards.find((chapter) => chapter.id === session.progress.currentChapterId) ??
    content.metadata.chapterCards[0];
  const sceneIndex = Math.max(
    0,
    Math.min((session.progress.chapterHistory?.length ?? 1) - 1, Math.max(content.metadata.sceneGallery.length - 1, 0))
  );
  const currentScene =
    content.metadata.sceneGallery.find((scene) => scene.id.includes(session.progress.currentChapterId.split('-')[1] ?? '')) ??
    content.metadata.sceneGallery[sceneIndex];
  const voteEntries = Object.entries(accusationVotes);
  const toolButtons = [
    ['investigation', '🔬 Investigation', '/assets/terminal-velocity/ui/icons/inventory.svg'],
    ['suspects', '👥 Suspects', '/assets/terminal-velocity/ui/icons/dialogue.svg'],
    ['caseboard', '📋 Case Board', '/assets/terminal-velocity/ui/icons/deduction.svg']
  ] as const;
  const tally: Record<string, number> = {};
  for (const [, characterId] of voteEntries) {
    tally[characterId] = (tally[characterId] ?? 0) + 1;
  }
  const leadingVote = Object.entries(tally).sort((a, b) => b[1] - a[1])[0] ?? null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-slate-100">
      <ToastContainer messages={toastMessages} onDismiss={dismissToast} />
      <TutorialOverlay onComplete={() => setTutorialComplete(true)} />
      <KeyboardShortcuts
        onToggleInvestigation={() => setWindowOpen(s => ({ ...s, investigation: !s.investigation }))}
        onToggleSuspects={() => setWindowOpen(s => ({ ...s, suspects: !s.suspects }))}
        onToggleCaseboard={() => setWindowOpen(s => ({ ...s, caseboard: !s.caseboard }))}
        onCloseAll={closeAllWindows}
      />
      <div className="absolute inset-0">
        <ResponsiveSceneImage
          src={currentScene?.image ?? content.metadata.sceneGallery[0]?.image ?? '/assets/terminal-velocity/cover.svg'}
          portraitSrc={currentScene?.imagePortrait}
          landscapeSrc={currentScene?.imageLandscape}
          alt={currentScene?.title ?? 'Scene'}
          priority
        />
        <Image src="/assets/terminal-velocity/ui/overlays/vignette-overlay.svg" alt="" fill className="pointer-events-none object-cover opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/90" />
      </div>

      <header className="relative z-20 p-4 md:p-6 bg-gradient-to-b from-black/90 to-transparent">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/20 border-2 border-amber-500/50">
              <span className="text-2xl">🔍</span>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">{content.story.name}</h1>
              <p className="text-sm text-amber-400 font-semibold mt-0.5">
                {phaseLabel} • ⚡ {session.progress.analyzerCharges} charges
              </p>
            </div>
            <button
              onClick={() => setShowNotebook(true)}
              className="ml-2 inline-flex items-center gap-2 rounded-xl border-2 border-amber-500/50 bg-amber-950/30 px-4 py-2 text-sm font-bold text-amber-300 hover:bg-amber-950/50 hover:border-amber-500 transition-all shadow-lg"
              aria-label="Open detective notebook"
            >
              <span className="text-lg">📓</span>
              <span className="hidden sm:inline">Notebook</span>
            </button>
          </div>
          <div className="w-full md:w-64">
            <ProgressIndicator
              totalEvidence={content.evidence.length}
              collectedEvidence={session.progress.inventory.length}
              analyzedEvidence={session.progress.analyzedItems.length}
              totalPuzzles={2}
              solvedPuzzles={session.progress.solvedPuzzles.length}
              suspectsTalkedTo={Object.keys(activeDialogueByCharacter).length}
              totalSuspects={content.characters.length}
            />
          </div>
        </div>
      </header>

      {showChapterCard && currentChapter ? (
        <div className="relative z-30 px-3 py-5 md:px-6">
          <ChapterCard
            title={currentChapter.title}
            subtitle={currentChapter.subtitle}
            objective={currentChapter.objective}
            sceneImage={currentChapter.sceneImage}
            sceneImagePortrait={currentChapter.sceneImagePortrait}
            sceneImageLandscape={currentChapter.sceneImageLandscape}
            onContinue={() => setShowChapterCard(false)}
          />
        </div>
      ) : null}

      <motion.div
        {...interactionMotion.panelEnter}
        className="fixed bottom-6 left-1/2 z-30 -translate-x-1/2 flex gap-4 rounded-2xl border-2 border-slate-600/80 bg-black/95 px-6 py-4 backdrop-blur-xl shadow-2xl"
      >
        {toolButtons.map(([key, label]) => (
          <button
            key={key}
            onClick={() => setWindowOpen((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
            aria-label={`${windowOpen[key as keyof typeof windowOpen] ? 'Close' : 'Open'} ${label} panel`}
            aria-expanded={windowOpen[key as keyof typeof windowOpen]}
            className={`inline-flex items-center justify-center gap-3 rounded-xl border-2 px-6 py-3 text-base font-bold transition-all min-h-[52px] min-w-[140px] ${
              windowOpen[key as keyof typeof windowOpen]
                ? 'border-amber-500 bg-amber-500/20 text-amber-300 shadow-lg shadow-amber-500/30'
                : 'border-slate-600 hover:border-slate-400 hover:bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </motion.div>

      <div
        className={`absolute z-20 max-w-sm rounded-xl border-2 border-slate-700 bg-black/85 backdrop-blur p-4 text-sm ${orientation === 'portrait' ? 'bottom-28 left-4 right-4 max-w-none' : 'bottom-24 left-4 md:left-6'}`}
      >
        <p className="mb-2 uppercase tracking-wider text-amber-400 font-bold text-xs">📡 Team Activity</p>
        <div className="max-h-32 space-y-2 overflow-auto text-slate-200">
          {activityFeed.slice(-6).map((entry, idx) => (
            <p key={`${entry}-${idx}`} className="animate-pulse-once leading-relaxed">
              {entry}
            </p>
          ))}
        </div>
      </div>

      <FloatingWindow title="🔬 Investigation" position="left" open={windowOpen.investigation} onClose={() => setWindowOpen((s) => ({ ...s, investigation: false }))}>
        <div className="space-y-4">
          <div className="bg-slate-900/70 rounded-xl p-4 border border-slate-700">
            <h4 className="text-sm font-bold text-amber-400 mb-2 uppercase tracking-wider">Evidence Collection</h4>
            <p className="text-sm text-slate-300">
              Click evidence to collect and examine. Use Analyze button below to run forensic tests.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {content.evidence.map((item) => {
              const inInventory = session.progress.inventory.includes(item.id);
              const isAnalyzed = session.progress.analyzedItems.includes(item.id);
              const isSelected = selectedEvidenceId === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedEvidenceId(item.id);
                    if (!inInventory) {
                      collectEvidence(item.id);
                      dispatchFlowEvent({ type: 'CLUE_COLLECTED' });
                      showToast(`Evidence collected: ${item.name}`, 'success');
                    } else {
                      examineEvidence(item.id);
                      dispatchFlowEvent({ type: 'CLUE_EXAMINED' });
                      showToast(`Examined: ${item.name}`, 'info');
                    }
                  }}
                  className={`rounded-xl border-2 p-3 text-left transition-all ${
                    isSelected 
                      ? 'border-amber-500 bg-amber-950/40 shadow-lg shadow-amber-500/30' 
                      : inInventory 
                        ? 'border-slate-600 bg-slate-900/80 hover:border-slate-500 hover:bg-slate-900' 
                        : 'border-slate-700 bg-slate-950/50 opacity-50 hover:opacity-70'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="relative h-32 w-full overflow-hidden rounded-lg border border-slate-700 bg-slate-900">
                      <Image
                        src={item.image ?? '/assets/terminal-velocity/evidence/whiskey-glass.svg'}
                        alt={item.name}
                        fill
                        sizes="200px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm leading-tight">{item.name}</p>
                      <p className="text-xs text-slate-400 mt-1">📍 {item.location}</p>
                      {isAnalyzed && (
                        <span className="inline-block mt-2 text-xs bg-emerald-500/30 text-emerald-300 px-2 py-1 rounded font-semibold">
                          ✓ Analyzed
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {selectedEvidence && (
            <div className="rounded-xl border-2 border-amber-500/50 bg-amber-950/20 p-4 space-y-3">
              <div>
                <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-1">Selected Evidence</h4>
                <p className="text-base font-bold text-white">{selectedEvidence.name}</p>
                <p className="text-sm text-slate-300 mt-2">{selectedEvidence.description}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setZoomedEvidenceId(selectedEvidence.id)}
                  className="flex-1 rounded-xl border-2 border-amber-500 bg-amber-950/30 px-4 py-3 text-base font-bold text-amber-300 hover:bg-amber-950/50 transition-all"
                >
                  🔍 View Details
                </button>
                <button
                  onClick={runAnalysis}
                  disabled={session.progress.analyzerCharges === 0}
                  className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3 text-base font-bold text-white hover:from-blue-500 hover:to-blue-400 transition-all disabled:from-slate-700 disabled:to-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed"
                >
                  🔬 Analyze ({session.progress.analyzerCharges})
                </button>
              </div>
              {analyzerOutput !== 'Analyzer ready.' && (
                <div className="rounded-lg bg-slate-900/80 border border-slate-700 p-3">
                  <p className="text-sm text-emerald-300 font-medium">{analyzerOutput}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </FloatingWindow>

      <FloatingWindow title="📋 Case Board" position="right" open={windowOpen.caseboard} onClose={() => setWindowOpen((s) => ({ ...s, caseboard: false }))}>
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-bold text-amber-400 mb-3 uppercase tracking-wider">🧩 Puzzles & Challenges</h4>
            <PuzzlePanel
              solvedPuzzles={session.progress.solvedPuzzles}
              onUseHint={useHint}
              onSolvePuzzle={(puzzleId) => {
                solvePuzzle(puzzleId);
                if (puzzleId === 'training-log-decrypt') {
                  advanceChapter();
                }
                if (puzzleId === 'timeline-sequence') {
                  dispatchFlowEvent({ type: 'INTERROGATION_UNLOCKED' });
                  advanceChapter();
                }
              }}
              onUnlockInterrogation={() => dispatchFlowEvent({ type: 'INTERROGATION_UNLOCKED' })}
            />
          </div>

          <div className="border-t border-slate-700 pt-6">
            <h4 className="text-sm font-bold text-amber-400 mb-3 uppercase tracking-wider">🎯 Build Your Case</h4>
            <DeductionPanel deductions={content.deductions} unlockedIds={session.progress.unlockedDeductions} />
            
            <div className="mt-4 space-y-3 rounded-xl border-2 border-slate-700 bg-slate-950/50 p-4">
              <p className="text-sm font-bold text-white uppercase tracking-wider">Final Accusation</p>
              <p className="text-xs text-slate-400 mb-2">Build your complete case with all 4 components:</p>
              
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-amber-400 uppercase">1. The Killer</label>
                <select
                  className="w-full rounded-lg border-2 border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
                  value={session.progress.accusedKiller ?? ''}
                  onChange={(event) => selectAccusation({ killerId: event.target.value || null })}
                >
                  <option value="">Who committed the murder?</option>
                  {content.characters.map((character) => (
                    <option key={character.id} value={character.id}>
                      {character.name} - {character.role}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-amber-400 uppercase">2. The Method</label>
                <select
                  className="w-full rounded-lg border-2 border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
                  value={session.progress.selectedMethod ?? ''}
                  onChange={(event) => selectAccusation({ methodId: event.target.value || null })}
                >
                  <option value="">What was the murder weapon/technique?</option>
                  {content.deductions
                    .filter((entry) => entry.category === 'method')
                    .map((deduction) => (
                      <option key={deduction.id} value={deduction.id} disabled={!session.progress.unlockedDeductions.includes(deduction.id)}>
                        {deduction.title} {!session.progress.unlockedDeductions.includes(deduction.id) ? '(Locked)' : ''}
                      </option>
                    ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-amber-400 uppercase">3. The Delivery</label>
                <select
                  className="w-full rounded-lg border-2 border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
                  value={session.progress.selectedDelivery ?? ''}
                  onChange={(event) => selectAccusation({ deliveryId: event.target.value || null })}
                >
                  <option value="">How did they execute the plan?</option>
                  {content.deductions
                    .filter((entry) => entry.category === 'delivery')
                    .map((deduction) => (
                      <option key={deduction.id} value={deduction.id} disabled={!session.progress.unlockedDeductions.includes(deduction.id)}>
                        {deduction.title} {!session.progress.unlockedDeductions.includes(deduction.id) ? '(Locked)' : ''}
                      </option>
                    ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-amber-400 uppercase">4. The Insurance</label>
                <select
                  className="w-full rounded-lg border-2 border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
                  value={session.progress.selectedInsurance ?? ''}
                  onChange={(event) => selectAccusation({ insuranceId: event.target.value || null })}
                >
                  <option value="">What was their backup plan?</option>
                  {content.deductions
                    .filter((entry) => entry.category === 'insurance')
                    .map((deduction) => (
                      <option key={deduction.id} value={deduction.id} disabled={!session.progress.unlockedDeductions.includes(deduction.id)}>
                        {deduction.title} {!session.progress.unlockedDeductions.includes(deduction.id) ? '(Locked)' : ''}
                      </option>
                    ))}
                </select>
              </div>
              <button
                onClick={() => {
                  if (leadingVote) {
                    selectAccusation({ killerId: leadingVote[0] });
                  }
                  finalizeAccusation();
                }}
                disabled={!accusationReady}
                title={!accusationReady ? 'Select killer and method first' : undefined}
                className="w-full rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-4 py-3 text-base font-bold text-white hover:from-red-500 hover:to-red-400 transition-all disabled:from-slate-700 disabled:to-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed"
              >
                Submit Final Accusation
              </button>
              {resolutionText && (
                <div className="rounded-lg border-2 border-emerald-500 bg-emerald-950/30 p-3">
                  <p className="text-sm text-emerald-200 font-medium">{resolutionText}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </FloatingWindow>

      <FloatingWindow title="👥 Suspects" position="right" open={windowOpen.suspects} onClose={() => setWindowOpen((s) => ({ ...s, suspects: false }))}>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-amber-400 mb-2 uppercase tracking-wider">
              👤 Select Suspect
            </label>
            <select
              value={activeCharacterId}
              onChange={(event) => {
                const charId = event.target.value;
                setActiveCharacterId(charId);
                const root = getDialogueRootForCharacter(content.dialogues, charId);
                advanceDialogue(charId, root?.id ?? null);
              }}
              className="w-full rounded-xl border-2 border-slate-700 bg-slate-900 px-4 py-3 text-base font-semibold focus:border-amber-500 focus:outline-none transition-colors"
            >
              {content.characters.map((character) => (
                <option key={character.id} value={character.id}>
                  {character.name} - {character.role}
                </option>
              ))}
            </select>
          </div>
          {(() => {
            const character = content.characters.find((entry) => entry.id === activeCharacterId);
            if (!character) return null;
            return (
              <DialogueInterface
                character={character}
                node={activeNode}
                inventory={session.progress.inventory}
                evidenceList={content.evidence}
                onSelectResponse={(nextNodeId) => advanceDialogue(activeCharacterId, nextNodeId)}
              />
            );
          })()}
        </div>
      </FloatingWindow>

      <EvidenceZoomModal
        evidence={zoomedEvidence}
        isAnalyzed={zoomedEvidence ? session.progress.analyzedItems.includes(zoomedEvidence.id) : false}
        onClose={() => setZoomedEvidenceId(null)}
      />

      {showNotebook && (
        <DetectiveNotebook
          progress={session.progress}
          allEvidence={content.evidence}
          allDeductions={content.deductions}
          onClose={() => setShowNotebook(false)}
        />
      )}
    </div>
  );
}
