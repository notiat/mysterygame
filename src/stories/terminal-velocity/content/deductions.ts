import { Deduction } from '@/types/story';

const sid = 'terminal-velocity';

export const terminalVelocityDeductions: Deduction[] = [
  {
    id: 'method-poison-capsule',
    storyId: sid,
    title: 'Method: Time-Delayed Poison Capsule',
    description: 'HPMC capsule dissolved in whiskey released concentrated sesame oil after ~22 minutes.',
    unlockedBy: ['whiskey-glass', 'practice-log'],
    category: 'method'
  },
  {
    id: 'insurance-epipen-swap',
    storyId: sid,
    title: 'Insurance: Sabotaged EpiPen',
    description: 'Victim used a swapped injector with drastically reduced epinephrine dose.',
    unlockedBy: ['fake-epipen', 'medical-records', 'mylan-empty-box'],
    category: 'insurance'
  },
  {
    id: 'opportunity-video-freeze',
    storyId: sid,
    title: 'Opportunity: Video Freeze Window',
    description: '3-second packet loss gave Chloe a covert action window while preserving alibi optics.',
    unlockedBy: ['video-call-logs', 'copilot-logbook'],
    category: 'delivery'
  },
  {
    id: 'motive-board-contract',
    storyId: sid,
    title: 'Motive: Corporate Contract',
    description: 'Board-linked financial trail and deal risk suggest contract elimination motive.',
    unlockedBy: ['tokyo-deal-memo', 'board-wire-fragment'],
    category: 'motive'
  },
  {
    id: 'timeline-reconstruction',
    storyId: sid,
    title: 'Timeline: 18:42 Service to 19:07 Onset',
    description: 'Delivery and symptom onset align with tested dissolution timing.',
    unlockedBy: ['cabin-service-schedule', 'practice-log', 'video-call-logs'],
    category: 'timeline'
  }
];
