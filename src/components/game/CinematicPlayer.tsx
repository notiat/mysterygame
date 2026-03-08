'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { interactionMotion } from '@/lib/design/motion';
import { useOrientation } from '@/hooks/useOrientation';

interface CinematicSlide {
  id: string;
  image: string;
  imagePortrait?: string;
  imageLandscape?: string;
  subtitle: string;
  voiceover: string;
}

interface CinematicPlayerProps {
  slides: CinematicSlide[];
  onComplete: () => void;
}

export default function CinematicPlayer({ slides, onComplete }: CinematicPlayerProps) {
  const [index, setIndex] = useState(0);
  const [autoNarrate, setAutoNarrate] = useState(true);
  const orientation = useOrientation();
  const active = useMemo(() => slides[index], [slides, index]);
  const activeImage =
    orientation === 'portrait'
      ? active?.imagePortrait ?? active?.image
      : active?.imageLandscape ?? active?.image;

  useEffect(() => {
    if (slides.length === 0) onComplete();
  }, [slides.length, onComplete]);

  useEffect(() => {
    if (!autoNarrate || !active || typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(active.voiceover);
    msg.rate = 1;
    msg.pitch = 1;
    window.speechSynthesis.speak(msg);
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [active, autoNarrate]);

  if (!active) return null;

  const next = () => {
    if (index >= slides.length - 1) {
      onComplete();
      return;
    }
    setIndex((prev) => prev + 1);
  };

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
      <AnimatePresence mode="wait">
        <motion.div key={active.id} {...interactionMotion.panelEnter} className="relative overflow-hidden rounded-lg border border-slate-700">
          <Image src={activeImage} alt={active.subtitle} width={1600} height={900} className="h-[420px] w-full object-cover grayscale contrast-125" />
          <Image src="/assets/terminal-velocity/ui/overlays/grain-overlay.svg" alt="" fill className="pointer-events-none object-cover opacity-30" />
          <Image src="/assets/terminal-velocity/ui/overlays/vignette-overlay.svg" alt="" fill className="pointer-events-none object-cover opacity-70" />
        </motion.div>
      </AnimatePresence>
      <div className="mt-3 rounded border border-slate-700 bg-slate-950 p-3">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
          Narration {index + 1}/{slides.length}
        </p>
        <p className="mt-1 text-lg text-slate-100">{active.subtitle}</p>
        <p className="mt-2 text-sm text-slate-300">{active.voiceover}</p>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button onClick={() => setAutoNarrate((v) => !v)} className="min-h-11 rounded bg-slate-700 px-3 py-2 text-sm font-semibold">
          {autoNarrate ? 'Mute Voiceover' : 'Enable Voiceover'}
        </button>
        <button onClick={next} className="min-h-11 rounded bg-blue-600 px-3 py-2 text-sm font-semibold text-white">
          {index >= slides.length - 1 ? 'Enter Investigation' : 'Next Scene'}
        </button>
      </div>
    </div>
  );
}
