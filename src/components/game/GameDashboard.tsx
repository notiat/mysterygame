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

const AnalyzerInterface = dynamic(() => import('./AnalyzerInterface'));
const CollabTools = dynamic(() => import('./CollabTools'));
const DeductionPanel = dynamic(() => import('./DeductionPanel'));
const DialogueInterface = dynamic(() => import('./DialogueInterface'));
const PuzzlePanel = dynamic(() => import('./PuzzlePanel'));

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
    inventory: false,
    puzzle: false,
    deduction: false,
    dialogue: false,
    analyzer: false,
    collab: false
  });
  const [showChapterCard, setShowChapterCard] = useState(true);
  const orientation = useOrientation();

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
      return;
    }
    const result = analyzeEvidence(selectedEvidence.id);
    if (!result.ok) {
      setAnalyzerOutput(result.error ?? 'Analysis failed.');
      return;
    }
    const item = content.evidence.find((entry) => entry.id === selectedEvidence.id);
    setAnalyzerOutput(item?.analysisData.result ?? 'Analysis complete.');
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
    ['inventory', 'Evidence', '/assets/terminal-velocity/ui/icons/inventory.svg'],
    ['puzzle', 'Puzzle', '/assets/terminal-velocity/ui/icons/puzzle.svg'],
    ['dialogue', 'Interrogate', '/assets/terminal-velocity/ui/icons/dialogue.svg'],
    ['analyzer', 'Analyzer', '/assets/terminal-velocity/ui/icons/analyzer.svg'],
    ['deduction', 'Deductions', '/assets/terminal-velocity/ui/icons/deduction.svg'],
    ['collab', 'Co-op', '/assets/terminal-velocity/ui/icons/collab.svg']
  ] as const;
  const tally: Record<string, number> = {};
  for (const [, characterId] of voteEntries) {
    tally[characterId] = (tally[characterId] ?? 0) + 1;
  }
  const leadingVote = Object.entries(tally).sort((a, b) => b[1] - a[1])[0] ?? null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-slate-100">
      <div className="absolute inset-0">
        <ResponsiveSceneImage
          src={currentScene?.image ?? content.metadata.sceneGallery[0]?.image ?? '/assets/terminal-velocity/cover.svg'}
          portraitSrc={currentScene?.imagePortrait}
          landscapeSrc={currentScene?.imageLandscape}
          alt={currentScene?.title ?? 'Scene'}
          priority
        />
        <Image src="/assets/terminal-velocity/ui/overlays/vignette-overlay.svg" alt="" fill className="pointer-events-none object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80" />
      </div>

      <header className="relative z-20 flex items-start justify-between p-4 md:p-6 bg-gradient-to-b from-black/80 to-transparent">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-amber-400 font-semibold mb-1">
            FBI Detective Case
          </p>
          <h1 className="text-2xl font-bold md:text-3xl text-white drop-shadow-lg">{content.story.name}</h1>
          <p className="text-sm text-slate-200 mt-1 font-medium">
            {phaseLabel} • {session.progress.currentLocation}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="rounded-lg bg-black/80 backdrop-blur px-3 py-2 font-semibold border border-slate-700">
            Stage: <span className="text-amber-400">{roomStage}</span>
          </span>
          <span className="rounded-lg bg-black/80 backdrop-blur px-3 py-2 font-semibold border border-slate-700">
            ⚡ {session.progress.analyzerCharges}
          </span>
          <select
            aria-label="Difficulty mode"
            className="rounded border border-slate-700 bg-black/80 px-2 py-1"
            onChange={(event) => setDifficulty(event.target.value as 'easy' | 'normal' | 'hard' | 'expert')}
            value={difficultyId}
          >
            <option value="easy">Easy</option>
            <option value="normal">Normal</option>
            <option value="hard">Hard</option>
            <option value="expert">Expert</option>
          </select>
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
        className="fixed bottom-5 left-1/2 z-30 flex max-w-[calc(100vw-2rem)] -translate-x-1/2 flex-wrap justify-center gap-3 rounded-2xl border-2 border-slate-600 bg-black/90 px-4 py-3 backdrop-blur-lg shadow-2xl"
      >
        {toolButtons.map(([key, label, icon]) => (
          <button
            key={key}
            onClick={() => setWindowOpen((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
            aria-label={`${windowOpen[key as keyof typeof windowOpen] ? 'Close' : 'Open'} ${label} panel`}
            aria-expanded={windowOpen[key as keyof typeof windowOpen]}
            className={`inline-flex items-center gap-2 rounded-xl border-2 px-4 py-2.5 text-sm font-bold transition-all min-h-[44px] ${
              windowOpen[key as keyof typeof windowOpen]
                ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                : 'border-slate-600 hover:border-slate-400 hover:bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Image src={icon} alt="" width={16} height={16} className="opacity-90" />
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

      <FloatingWindow title="Evidence" position="left" open={windowOpen.inventory} onClose={() => setWindowOpen((s) => ({ ...s, inventory: false }))}>
        <div className="space-y-3">
          <p className="text-sm text-slate-400 bg-slate-900/50 rounded-lg p-3 border border-slate-700">
            💡 Click evidence to collect, examine, or analyze. Selected items can be used in interrogations.
          </p>
          <div className="grid grid-cols-1 gap-3">
            {content.evidence.map((item) => {
              const inInventory = session.progress.inventory.includes(item.id);
              const isExamined = session.progress.examinedItems.includes(item.id);
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
                    } else {
                      examineEvidence(item.id);
                      dispatchFlowEvent({ type: 'CLUE_EXAMINED' });
                    }
                  }}
                  className={`w-full rounded-xl border-2 p-3 text-left transition-all ${
                    isSelected 
                      ? 'border-amber-500 bg-amber-950/30 shadow-lg shadow-amber-500/20' 
                      : inInventory 
                        ? 'border-slate-600 bg-slate-900/80 hover:border-slate-500' 
                        : 'border-slate-700 bg-slate-950/50 opacity-60 hover:opacity-80'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 border-slate-700 bg-slate-900 shadow-md">
                      <Image
                        src={item.image ?? '/assets/terminal-velocity/evidence/whiskey-glass.svg'}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white text-base">{item.name}</p>
                      <p className="text-xs text-amber-400 font-semibold mt-0.5">📍 {item.location}</p>
                      <div className="flex gap-1.5 mt-2">
                        {inInventory && <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">✓ Collected</span>}
                        {isExamined && <span className="text-xs bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded">🔍 Examined</span>}
                        {isAnalyzed && <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">⚗️ Analyzed</span>}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </FloatingWindow>

      <FloatingWindow title="Puzzle Set Piece" position="right" open={windowOpen.puzzle} onClose={() => setWindowOpen((s) => ({ ...s, puzzle: false }))}>
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
      </FloatingWindow>

      <FloatingWindow title="Interrogation" position="right" open={windowOpen.dialogue} onClose={() => setWindowOpen((s) => ({ ...s, dialogue: false }))}>
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
                onSelectResponse={(nextNodeId) => advanceDialogue(activeCharacterId, nextNodeId)}
              />
            );
          })()}
        </div>
      </FloatingWindow>

      <FloatingWindow title="Analyzer" position="left" open={windowOpen.analyzer} onClose={() => setWindowOpen((s) => ({ ...s, analyzer: false }))}>
        <AnalyzerInterface
          charges={session.progress.analyzerCharges}
          selectedEvidenceName={selectedEvidence?.name ?? null}
          onRunAnalysis={runAnalysis}
          disabled={!selectedEvidence}
          output={analyzerOutput}
        />
      </FloatingWindow>

      <FloatingWindow title="Deduction Board" position="right" open={windowOpen.deduction} onClose={() => setWindowOpen((s) => ({ ...s, deduction: false }))}>
        <DeductionPanel deductions={content.deductions} unlockedIds={session.progress.unlockedDeductions} />
        <div className="mt-3 space-y-2 text-xs">
          <p className="text-slate-400">Vote-and-reveal accusation flow</p>
          <select
            className="w-full rounded border border-slate-700 bg-black px-2 py-1"
            value={session.progress.accusedKiller ?? ''}
            onChange={(event) => selectAccusation({ killerId: event.target.value || null })}
          >
            <option value="">
              Select killer
            </option>
            {content.characters.map((character) => (
              <option key={character.id} value={character.id}>
                {character.name}
              </option>
            ))}
          </select>
          <select
            className="w-full rounded border border-slate-700 bg-black px-2 py-1"
            value={session.progress.selectedMethod ?? ''}
            onChange={(event) => selectAccusation({ methodId: event.target.value || null })}
          >
            <option value="">
              Select method
            </option>
            {content.deductions
              .filter((entry) => entry.category === 'means')
              .map((deduction) => (
                <option key={deduction.id} value={deduction.id}>
                  {deduction.title}
                </option>
              ))}
          </select>
          <select
            className="w-full rounded border border-slate-700 bg-black px-2 py-1"
            value={session.progress.selectedDelivery ?? ''}
            onChange={(event) => selectAccusation({ deliveryId: event.target.value || null })}
          >
            <option value="">
              Select delivery
            </option>
            {content.deductions
              .filter((entry) => entry.category === 'opportunity')
              .map((deduction) => (
                <option key={deduction.id} value={deduction.id}>
                  {deduction.title}
                </option>
              ))}
          </select>
          <button
            onClick={() => {
              selectAccusation({
                insuranceId: 'insurance-epipen-swap',
                evidenceIds: session.progress.inventory.slice(0, 4)
              });
              dispatchFlowEvent({ type: 'OPEN_ACCUSATION' });
            }}
            className="w-full rounded border border-white/30 px-3 py-2"
          >
            Prepare Accusation Bundle
          </button>
          <button
            onClick={() => {
              if (leadingVote) {
                selectAccusation({ killerId: leadingVote[0] });
              }
              finalizeAccusation();
            }}
            disabled={!accusationReady}
            title={!accusationReady ? 'Select killer, method, delivery, and insurance first.' : undefined}
            className="w-full rounded bg-white px-3 py-2 font-bold text-black disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-300"
          >
            Vote and Reveal
          </button>
          {resolutionText ? <p className="rounded border border-emerald-700 bg-emerald-950/30 p-2 text-emerald-200">{resolutionText}</p> : null}
        </div>
      </FloatingWindow>

      <FloatingWindow title="Collaboration" position="bottom" open={windowOpen.collab} onClose={() => setWindowOpen((s) => ({ ...s, collab: false }))}>
        <CollabTools
          onPing={addPing}
          onAnnotate={addAnnotation}
          onVote={castAccusationVote}
          characters={content.characters.map((character) => ({ id: character.id, name: character.name }))}
        />
        <div className="mt-3 grid grid-cols-1 gap-2 text-xs md:grid-cols-2">
          <div className="rounded border border-slate-700 bg-slate-950 p-2">
            <p className="mb-1 uppercase tracking-wider text-slate-400">Live Pings</p>
            <div className="max-h-20 space-y-1 overflow-auto">
              {roomPings.slice(-5).map((ping) => (
                <p key={ping.id}>
                  <span className="text-white">{ping.by}:</span> {ping.text}
                </p>
              ))}
            </div>
          </div>
          <div className="rounded border border-slate-700 bg-slate-950 p-2">
            <p className="mb-1 uppercase tracking-wider text-slate-400">Clue Notes</p>
            <div className="max-h-20 space-y-1 overflow-auto">
              {roomAnnotations.slice(-5).map((note) => (
                <p key={note.id}>
                  <span className="text-white">{note.by}:</span> {note.note}
                </p>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-3 rounded border border-slate-700 bg-slate-950 p-2 text-xs">
          <p className="uppercase tracking-wider text-slate-400">Vote Summary</p>
          <p className="mt-1 text-slate-200">
            {voteEntries.length === 0
              ? 'No votes yet.'
              : `${voteEntries.length} votes cast. Leading: ${
                  leadingVote ? content.characters.find((c) => c.id === leadingVote[0])?.name ?? leadingVote[0] : 'N/A'
                }`}
          </p>
        </div>
      </FloatingWindow>

      <div className="absolute right-3 top-20 z-20 hidden rounded border border-slate-700 bg-black/80 p-2 text-[10px] text-slate-300 md:block md:right-6">
        <p>Players: {presenceUsers.length}</p>
        <p>Flow events: {flowEvents.length}</p>
        <p>Substate: {session.investigationSubstate}</p>
      </div>
    </div>
  );
}
