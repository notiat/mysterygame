'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { interactionMotion } from '@/lib/design/motion';
import { useOrientation } from '@/hooks/useOrientation';

interface ChapterCardProps {
  title: string;
  subtitle: string;
  objective: string;
  sceneImage: string;
  sceneImagePortrait?: string;
  sceneImageLandscape?: string;
  onContinue: () => void;
}

export default function ChapterCard({
  title,
  subtitle,
  objective,
  sceneImage,
  sceneImagePortrait,
  sceneImageLandscape,
  onContinue
}: ChapterCardProps) {
  const orientation = useOrientation();
  const coverImage =
    orientation === 'portrait' ? sceneImagePortrait ?? sceneImage : sceneImageLandscape ?? sceneImage;

  return (
    <motion.section
      {...interactionMotion.chapterEnter}
      className="mx-auto max-w-5xl overflow-hidden rounded-3xl border-2 border-amber-500/30 bg-black/90 shadow-[0_0_60px_rgba(251,191,36,0.15)] backdrop-blur"
    >
      <div className="relative">
        <Image src={coverImage} alt={title} width={1600} height={900} className="h-80 w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-400 font-bold mb-2">📂 Case File</p>
          <h2 className="text-4xl md:text-5xl font-black text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">{title}</h2>
          <p className="mt-2 text-lg text-slate-200 font-medium">{subtitle}</p>
        </div>
      </div>
      <div className="p-8 bg-gradient-to-b from-slate-950 to-black">
        <div className="rounded-xl border-2 border-amber-500/30 bg-amber-950/20 p-5 mb-6">
          <p className="text-xs uppercase tracking-wider text-amber-400 font-bold mb-2">🎯 Mission Objective</p>
          <p className="text-base text-slate-100 leading-relaxed">{objective}</p>
        </div>
        <button 
          onClick={onContinue} 
          className="w-full min-h-[56px] rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 px-6 py-4 text-lg font-black text-black transition-all hover:from-amber-400 hover:to-yellow-400 hover:scale-[1.02] shadow-lg hover:shadow-amber-500/50"
        >
          ▶ Begin Investigation
        </button>
      </div>
    </motion.section>
  );
}
