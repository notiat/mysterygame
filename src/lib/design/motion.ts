export const motionTokens = {
  durations: {
    fast: 0.18,
    normal: 0.28,
    slow: 0.42
  },
  easing: {
    smooth: [0.22, 1, 0.36, 1],
    snap: [0.3, 0.7, 0.4, 1]
  },
  stagger: {
    list: 0.05
  }
} as const;

export const interactionMotion = {
  panelEnter: {
    initial: { opacity: 0, y: 12, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 10, scale: 0.98 },
    transition: { duration: motionTokens.durations.normal, ease: motionTokens.easing.smooth }
  },
  chapterEnter: {
    initial: { opacity: 0, scale: 0.985 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: motionTokens.durations.slow, ease: motionTokens.easing.smooth }
  },
  cluePulse: {
    initial: { scale: 1, opacity: 0.9 },
    animate: { scale: [1, 1.025, 1], opacity: [0.9, 1, 0.9] },
    transition: { duration: 0.55, ease: motionTokens.easing.smooth }
  }
} as const;
