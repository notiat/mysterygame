'use client';

import { useEffect } from 'react';

export default function ClientErrorMonitor() {
  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      void fetch('/api/log/client-error', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          type: 'error',
          message: event.message,
          source: event.filename,
          line: event.lineno,
          col: event.colno
        })
      });
    };

    const onUnhandled = (event: PromiseRejectionEvent) => {
      void fetch('/api/log/client-error', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          type: 'unhandledrejection',
          message: String(event.reason ?? 'Unknown rejection')
        })
      });
    };

    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onUnhandled);
    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onUnhandled);
    };
  }, []);

  return null;
}
