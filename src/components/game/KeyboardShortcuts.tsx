'use client';

import { useEffect } from 'react';

interface KeyboardShortcutsProps {
  onToggleInvestigation: () => void;
  onToggleSuspects: () => void;
  onToggleCaseboard: () => void;
  onCloseAll: () => void;
}

export default function KeyboardShortcuts({
  onToggleInvestigation,
  onToggleSuspects,
  onToggleCaseboard,
  onCloseAll
}: KeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Don't trigger if typing in input/textarea
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key.toLowerCase()) {
        case '1':
          onToggleInvestigation();
          break;
        case '2':
          onToggleSuspects();
          break;
        case '3':
          onToggleCaseboard();
          break;
        case 'escape':
          onCloseAll();
          break;
        case '?':
          // Show keyboard shortcuts help
          alert(
            'Keyboard Shortcuts:\n\n' +
            '1 - Toggle Investigation panel\n' +
            '2 - Toggle Suspects panel\n' +
            '3 - Toggle Case Board panel\n' +
            'ESC - Close all panels\n' +
            '? - Show this help'
          );
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onToggleInvestigation, onToggleSuspects, onToggleCaseboard, onCloseAll]);

  return null; // This component doesn't render anything
}
