'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TutorialStep {
  title: string;
  description: string;
  highlight?: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    title: 'Welcome, Detective',
    description: 'You\'re investigating a murder on a private jet. Your goal: examine evidence, interrogate suspects, and identify the killer.'
  },
  {
    title: '🔬 Investigation Panel',
    description: 'Collect and analyze forensic evidence. Each piece of evidence can be examined for clues. Use your limited analyzer charges wisely!'
  },
  {
    title: '👥 Suspects Panel',
    description: 'Interrogate the 4 suspects. Ask questions and pay attention to their answers. Some evidence is required to unlock certain questions.'
  },
  {
    title: '📋 Case Board',
    description: 'Solve puzzles to unlock new areas, review your deductions, and make your final accusation when you\'re ready.'
  },
  {
    title: 'Ready to Begin?',
    description: 'Take your time. The evidence tells a story. Good luck, detective.'
  }
];

interface TutorialOverlayProps {
  onComplete: () => void;
}

export default function TutorialOverlay({ onComplete }: TutorialOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if user has seen tutorial before
    const hasSeenTutorial = localStorage.getItem('mysterygame_tutorial_seen');
    if (!hasSeenTutorial) {
      setShow(true);
    } else {
      onComplete();
    }
  }, [onComplete]);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    localStorage.setItem('mysterygame_tutorial_seen', 'true');
    setShow(false);
    onComplete();
  };

  const step = tutorialSteps[currentStep];

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50"
            onClick={handleSkip}
          />

          {/* Tutorial Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] max-w-lg"
          >
            <div className="rounded-2xl border-2 border-amber-500 bg-slate-950 p-8 shadow-2xl">
              {/* Progress dots */}
              <div className="flex justify-center gap-2 mb-6">
                {tutorialSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full transition-all ${
                      index === currentStep
                        ? 'w-8 bg-amber-500'
                        : index < currentStep
                        ? 'w-2 bg-amber-500/50'
                        : 'w-2 bg-slate-700'
                    }`}
                  />
                ))}
              </div>

              {/* Content */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-amber-400 mb-4">{step.title}</h2>
                <p className="text-lg text-slate-200 leading-relaxed">{step.description}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                {currentStep < tutorialSteps.length - 1 && (
                  <button
                    onClick={handleSkip}
                    className="flex-1 rounded-xl border-2 border-slate-700 bg-slate-900 px-6 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
                  >
                    Skip Tutorial
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className="flex-1 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3 text-sm font-bold text-white hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg"
                >
                  {currentStep < tutorialSteps.length - 1 ? 'Next' : 'Start Investigation'}
                </button>
              </div>

              {/* Step counter */}
              <p className="text-center text-xs text-slate-500 mt-4">
                Step {currentStep + 1} of {tutorialSteps.length}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
