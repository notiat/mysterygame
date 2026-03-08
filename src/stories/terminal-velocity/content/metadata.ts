import { StoryMetadata } from '@/types/story';

export const terminalVelocityMetadata: StoryMetadata = {
  briefing: `Special Agent Torres: "Private charter, New York to Tokyo. Emergency landing two hours ago. Passenger deceased - Silas Vane, CEO of Vane Industries. Cause: anaphylactic shock. Sesame allergy. Used his EpiPen, died anyway. Four others on board - all detained. Bodyguard thinks it's murder. Assistant is very cooperative. Flight attendant lawyered up fast. Aircraft secured. Evidence tagged. ME has the body. Your forensic kit is ready. Was this murder or accident? The scene is yours."`,
  confession: `Chloe Evans: "Impressive. Most people would have stopped at the flight attendant. Silas was going to destroy Vane Industries. The board asked me to solve the problem. The HPMC capsules were elegant - exact timing, no taste. The 2% epinephrine was genius - enough to feel like it worked, not enough to save him. You win. But the board hired me. They'll deny it."`,
  introCinematic: [
    {
      id: 'intro-1',
      image: '/assets/terminal-velocity/scenes/hangar-briefing--landscape.svg',
      imageLandscape: '/assets/terminal-velocity/scenes/hangar-briefing--landscape.svg',
      imagePortrait: '/assets/terminal-velocity/scenes/hangar-briefing--portrait.svg',
      subtitle: 'Anchorage Field Office, Hangar 7 - 2:15 PM AKST',
      voiceover:
        'Special Agent Torres: Private charter, New York to Tokyo. Emergency landing two hours ago. Passenger deceased - Silas Vane.'
    },
    {
      id: 'intro-2',
      image: '/assets/terminal-velocity/scenes/aircraft-exterior--landscape.svg',
      imageLandscape: '/assets/terminal-velocity/scenes/aircraft-exterior--landscape.svg',
      imagePortrait: '/assets/terminal-velocity/scenes/aircraft-exterior--portrait.svg',
      subtitle: 'Impounded Gulfstream G650 secured for forensic sweep',
      voiceover:
        'Cause: anaphylactic shock. Sesame allergy. He used his EpiPen and died anyway.'
    },
    {
      id: 'intro-3',
      image: '/assets/terminal-velocity/scenes/evidence-table--landscape.svg',
      imageLandscape: '/assets/terminal-velocity/scenes/evidence-table--landscape.svg',
      imagePortrait: '/assets/terminal-velocity/scenes/evidence-table--portrait.svg',
      subtitle: 'Evidence tagged. Suspects detained. Mystery unresolved.',
      voiceover:
        'Was this murder or accident? The scene is yours. Work the evidence, then make your accusation.'
    }
  ],
  sceneGallery: [
    {
      id: 'scene-hangar',
      title: 'Hangar 7 Briefing Zone',
      image: '/assets/terminal-velocity/scenes/hangar-briefing--landscape.svg',
      imageLandscape: '/assets/terminal-velocity/scenes/hangar-briefing--landscape.svg',
      imagePortrait: '/assets/terminal-velocity/scenes/hangar-briefing--portrait.svg',
      caption: 'Primary command location for case intake and suspect access.'
    },
    {
      id: 'scene-cabin',
      title: 'Gulfstream Cabin',
      image: '/assets/terminal-velocity/scenes/cabin-main--landscape.svg',
      imageLandscape: '/assets/terminal-velocity/scenes/cabin-main--landscape.svg',
      imagePortrait: '/assets/terminal-velocity/scenes/cabin-main--portrait.svg',
      caption: 'Victim seat, service route, and timeline-critical visual evidence.'
    },
    {
      id: 'scene-galley',
      title: 'Aircraft Galley',
      image: '/assets/terminal-velocity/scenes/galley-close--landscape.svg',
      imageLandscape: '/assets/terminal-velocity/scenes/galley-close--landscape.svg',
      imagePortrait: '/assets/terminal-velocity/scenes/galley-close--portrait.svg',
      caption: 'Drink preparation area and capsule delivery opportunity window.'
    },
    {
      id: 'scene-cockpit',
      title: 'Cockpit Observation',
      image: '/assets/terminal-velocity/scenes/cockpit-log--landscape.svg',
      imageLandscape: '/assets/terminal-velocity/scenes/cockpit-log--landscape.svg',
      imagePortrait: '/assets/terminal-velocity/scenes/cockpit-log--portrait.svg',
      caption: 'Co-pilot witness notes and exact 18:42 UTC timeline anchor.'
    }
  ],
  chapterCards: [
    {
      id: 'chapter-1',
      title: 'Chapter I: The Landing',
      subtitle: 'Hangar 7 briefing and first sweep',
      sceneImage: '/assets/terminal-velocity/scenes/hangar-briefing--landscape.svg',
      sceneImageLandscape: '/assets/terminal-velocity/scenes/hangar-briefing--landscape.svg',
      sceneImagePortrait: '/assets/terminal-velocity/scenes/hangar-briefing--portrait.svg',
      objective: 'Establish cause and collect first physical evidence.'
    },
    {
      id: 'chapter-2',
      title: 'Chapter II: The Glass and Pen',
      subtitle: 'Cabin and galley reconstruction',
      sceneImage: '/assets/terminal-velocity/scenes/cabin-main--landscape.svg',
      sceneImageLandscape: '/assets/terminal-velocity/scenes/cabin-main--landscape.svg',
      sceneImagePortrait: '/assets/terminal-velocity/scenes/cabin-main--portrait.svg',
      objective: 'Prove poison delivery and treatment sabotage.',
      unlocksOn: ['training-log-decrypt']
    },
    {
      id: 'chapter-3',
      title: 'Chapter III: The Clockwork Alibi',
      subtitle: 'Timeline and witness contradiction',
      sceneImage: '/assets/terminal-velocity/scenes/cockpit-log--landscape.svg',
      sceneImageLandscape: '/assets/terminal-velocity/scenes/cockpit-log--landscape.svg',
      sceneImagePortrait: '/assets/terminal-velocity/scenes/cockpit-log--portrait.svg',
      objective: 'Resolve 18:42 to 19:07 timeline and open accusation.',
      unlocksOn: ['timeline-sequence']
    }
  ],
  puzzleHints: [
    {
      puzzleId: 'training-log-decrypt',
      tiers: [
        'A planner clue links to fitness language and a year.',
        'The password starts with "Gym".',
        'Use: Gym2024!'
      ]
    },
    {
      puzzleId: 'timeline-sequence',
      tiers: [
        'Start from the co-pilot witness timestamp.',
        'Service precedes dissolution, then symptom onset.',
        'Use: 18:42>19:05>19:07'
      ]
    }
  ],
  difficultyModes: [
    { id: 'easy', analyzerCharges: 7, hintLevel: 'highlights + auto timeline' },
    { id: 'normal', analyzerCharges: 5, hintLevel: 'subtle hints + manual timeline' },
    { id: 'hard', analyzerCharges: 3, hintLevel: 'minimal hints + complex interrogations' },
    { id: 'expert', analyzerCharges: 3, hintLevel: 'hidden evidence + active clue suppression' }
  ]
};
