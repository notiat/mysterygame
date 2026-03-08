export const neoNoirTheme = {
  colors: {
    bg: '#050505',
    bgElevated: '#0f0f10',
    line: '#2b2b2f',
    text: '#f4f4f5',
    textMuted: '#a1a1aa',
    accent: '#ffffff',
    success: '#34d399',
    warning: '#f59e0b',
    danger: '#ef4444'
  },
  typography: {
    titleTracking: '0.32em',
    labelTracking: '0.18em'
  },
  layout: {
    maxMobileWidth: 640,
    panelRadius: 14,
    hitTargetMin: 44
  }
} as const;

export type NeoNoirTheme = typeof neoNoirTheme;
