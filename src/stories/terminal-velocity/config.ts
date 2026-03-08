import { Story } from '@/types/platform';

export const terminalVelocityStory: Story = {
  id: 'terminal-velocity',
  name: 'Terminal Velocity',
  slug: 'terminal-velocity',
  version: '1.2.0-beta',
  meta: {
    description:
      'A CEO dies mid-flight from anaphylactic shock. Determine whether this was a tragic accident or a precision assassination.',
    setting: 'FBI Anchorage Field Office + Impounded Gulfstream G650',
    playerCount: '1-4 online co-op',
    thumbnail: '/assets/terminal-velocity/cover.svg'
  },
  config: {
    phases: [
      { id: 'briefing', name: 'BRIEFING', displayName: 'Briefing', allowedTransitions: ['investigation'] },
      {
        id: 'investigation',
        name: 'INVESTIGATION',
        displayName: 'Investigation',
        allowedTransitions: ['interrogation', 'accusation']
      },
      {
        id: 'interrogation',
        name: 'INTERROGATION',
        displayName: 'Interrogation',
        allowedTransitions: ['investigation', 'accusation']
      },
      { id: 'accusation', name: 'ACCUSATION', displayName: 'Accusation', allowedTransitions: ['resolution'] },
      { id: 'resolution', name: 'RESOLUTION', displayName: 'Resolution', allowedTransitions: [] }
    ],
    mechanics: {
      analyzerCharges: 5,
      maxInventory: null,
      allowHints: false,
      autoTimeline: false
    },
    ui: {
      theme: 'fbi-dark',
      layout: 'dashboard',
      topBar: ['analyzer', 'location', 'phase', 'difficulty'],
      sidebar: ['inventory', 'suspects', 'deductions', 'timeline']
    },
    winCondition: {
      type: 'accusation',
      target: 'chloe-evans',
      methodId: 'method-poison-capsule',
      deliveryId: 'opportunity-video-freeze',
      insuranceId: 'insurance-epipen-swap',
      minEvidenceCount: 3
    }
  }
};
