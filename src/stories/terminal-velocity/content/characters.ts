import { Character } from '@/types/story';

const sid = 'terminal-velocity';

export const terminalVelocityCharacters: Character[] = [
  {
    id: 'chloe-evans',
    storyId: sid,
    name: 'Chloe Evans',
    role: 'Executive Assistant',
    age: 34,
    bio: 'Loyal, calm, and extremely cooperative. Served Vane directly throughout flight.',
    truth:
      'Professional corporate cleaner hired by board contacts. Planned capsule poisoning and EpiPen sabotage.',
    portrait: '/assets/terminal-velocity/characters/chloe-evans-neutral.svg',
    isGuilty: true
  },
  {
    id: 'julian-ricci',
    storyId: sid,
    name: 'Julian Ricci',
    role: 'Flight Attendant',
    age: 29,
    bio: 'Charismatic, defensive under pressure, handles beverage service.',
    truth: 'Innocent. Ideological writing made him an easy scapegoat.',
    portrait: '/assets/terminal-velocity/characters/julian-ricci-neutral.svg',
    isGuilty: false
  },
  {
    id: 'marcus-stone',
    storyId: sid,
    name: 'Marcus Stone',
    role: 'Bodyguard',
    age: 42,
    bio: 'Former military contractor with debt issues and a short fuse.',
    truth: 'Negligent and distracted on phone, but not the killer.',
    portrait: '/assets/terminal-velocity/characters-realistic/marcus-stone-neutral.svg',
    isGuilty: false
  },
  {
    id: 'rebecca-park',
    storyId: sid,
    name: 'Rebecca Park',
    role: 'Co-Pilot',
    age: 36,
    bio: 'Methodical, observant, and timeline-focused witness.',
    truth: 'Critical witness who saw Chloe serve the drink at 18:42 UTC.',
    portrait: '/assets/terminal-velocity/characters/rebecca-park-neutral.svg',
    isGuilty: false
  }
];
