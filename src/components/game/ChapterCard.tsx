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
      className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-slate-700 bg-black/80 shadow-[0_0_30px_rgba(255,255,255,0.08)]"
    >
      <Image src={coverImage} alt={title} width={1600} height={900} className="h-72 w-full object-cover grayscale" />
      <div className="p-6">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Chapter Card</p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-100">{title}</h2>
        <p className="mt-1 text-slate-300">{subtitle}</p>
        <p className="mt-3 rounded border border-slate-700 bg-slate-950 p-3 text-sm text-slate-200">{objective}</p>
        <button onClick={onContinue} className="mt-4 min-h-11 rounded bg-white px-4 py-2 text-sm font-bold text-black transition hover:scale-[1.02]">
          Continue Investigation
        </button>
      </div>
    </motion.section>
  );
}
