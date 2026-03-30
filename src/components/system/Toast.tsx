'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface ToastProps {
  message: ToastMessage;
  onDismiss: (id: string) => void;
}

function Toast({ message, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(message.id);
    }, 3000);
    return () => clearTimeout(timer);
  }, [message.id, onDismiss]);

  const colors = {
    success: 'from-emerald-600 to-emerald-500 border-emerald-400',
    info: 'from-blue-600 to-blue-500 border-blue-400',
    warning: 'from-amber-600 to-amber-500 border-amber-400',
    error: 'from-rose-600 to-rose-500 border-rose-400'
  };

  const icons = {
    success: '✓',
    info: 'ℹ',
    warning: '⚠',
    error: '✕'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className={`bg-gradient-to-r ${colors[message.type]} rounded-xl border-2 px-5 py-3 shadow-2xl backdrop-blur min-w-[280px] max-w-md`}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icons[message.type]}</span>
        <p className="text-white font-bold text-base">{message.text}</p>
      </div>
    </motion.div>
  );
}

interface ToastContainerProps {
  messages: ToastMessage[];
  onDismiss: (id: string) => void;
}

export default function ToastContainer({ messages, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {messages.map((message) => (
          <Toast key={message.id} message={message} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}

// Hook for using toasts
const MAX_VISIBLE_TOASTS = 3;

export function useToast() {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const showToast = (text: string, type: ToastMessage['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setMessages((prev) => {
      const newMessages = [...prev, { id, text, type }];
      // Keep only the last MAX_VISIBLE_TOASTS messages
      return newMessages.slice(-MAX_VISIBLE_TOASTS);
    });
  };

  const dismissToast = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  return { messages, showToast, dismissToast };
}
