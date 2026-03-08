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
          className={`fixed z-40 w-[92vw] max-w-sm rounded-xl border border-slate-700 bg-black/85 p-3 shadow-2xl backdrop-blur md:w-96 ${posClass}`}
        >
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-200">{title}</h3>
            <button onClick={onClose} className="min-h-11 rounded bg-slate-800 px-3 py-1 text-xs text-slate-200">
              Close
            </button>
          </div>
          <div className="max-h-[55vh] overflow-auto">{children}</div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
