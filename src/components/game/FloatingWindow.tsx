'use client';

import { PropsWithChildren } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { interactionMotion } from '@/lib/design/motion';

interface FloatingWindowProps extends PropsWithChildren {
  title: string;
  position?: 'left' | 'right' | 'bottom';
  open: boolean;
  onClose: () => void;
}

export default function FloatingWindow({ title, position = 'right', open, onClose, children }: FloatingWindowProps) {
  const posClass =
    position === 'left'
      ? 'left-3 bottom-20 md:top-20 md:bottom-auto'
      : position === 'bottom'
        ? 'bottom-3 left-1/2 -translate-x-1/2'
        : 'right-3 bottom-20 md:top-20 md:bottom-auto';

  return (
    <AnimatePresence>
      {open ? (
        <motion.aside
          role="dialog"
          aria-modal="true"
          aria-label={title}
          tabIndex={-1}
          onKeyDown={(event) => {
            if (event.key === 'Escape') onClose();
          }}
          {...interactionMotion.panelEnter}
          className={`fixed z-40 w-[92vw] max-w-md rounded-2xl border-2 border-slate-600 bg-black/90 p-5 shadow-2xl backdrop-blur-xl md:w-[28rem] ${posClass}`}
        >
          <div className="mb-4 flex items-center justify-between border-b border-slate-700 pb-3">
            <h3 className="text-base font-bold uppercase tracking-[0.2em] text-amber-400">{title}</h3>
            <button 
              onClick={onClose} 
              className="min-h-[44px] rounded-lg bg-slate-800 hover:bg-slate-700 px-4 py-2 text-sm font-bold text-slate-200 hover:text-white transition-colors border border-slate-700"
            >
              ✕ Close
            </button>
          </div>
          <div className="max-h-[60vh] overflow-auto pr-2 styled-scrollbar">{children}</div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
