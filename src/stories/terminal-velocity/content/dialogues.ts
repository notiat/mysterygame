import { DialogueNode } from '@/types/story';

const sid = 'terminal-velocity';

export const terminalVelocityDialogues: DialogueNode[] = [
  {
    id: 'chloe-intro',
    storyId: sid,
    characterId: 'chloe-evans',
    text: "I did everything I could for Mr. Vane. I even handed him his EpiPen. It's all a blur.",
    responses: [
      { id: 'c1', text: 'Walk us through 18:40 to 18:45.', nextNodeId: 'chloe-window' },
      {
        id: 'c2',
        text: 'Why did your bag contain an empty Mylan box?',
        nextNodeId: 'chloe-epipen',
        requiresEvidence: ['mylan-empty-box']
      }
    ]
  },
  {
    id: 'chloe-window',
    storyId: sid,
    characterId: 'chloe-evans',
    text: 'I was on a video call with Tokyo investors the whole time. I never left frame.',
    responses: [
      {
        id: 'c3',
        text: 'Our network logs show a 3-second freeze at 18:42.',
        nextNodeId: 'chloe-deflect',
        requiresEvidence: ['video-call-logs']
      }
    ]
  },
  {
    id: 'chloe-epipen',
    storyId: sid,
    characterId: 'chloe-evans',
    text: "I kept old packaging for expense reports. That's normal admin work.",
    responses: [
      {
        id: 'c4',
        text: "Then explain the Amneal injector and the clipped spring.",
        nextNodeId: 'chloe-deflect',
        requiresEvidence: ['fake-epipen', 'medical-records']
      }
    ]
  },
  {
    id: 'chloe-deflect',
    storyId: sid,
    characterId: 'chloe-evans',
    text: 'You are reaching. If this was poison, check the attendant. He serves drinks.',
    responses: [{ id: 'c5', text: 'We are done for now.', nextNodeId: null }]
  },
  {
    id: 'julian-intro',
    storyId: sid,
    characterId: 'julian-ricci',
    text: "I poured what she asked for. That's all. He wanted whiskey, neat, like usual.",
    responses: [
      { id: 'j1', text: 'Did anyone alter the drink after service?', nextNodeId: 'julian-service' },
      { id: 'j2', text: 'Where were you during the call freeze?', nextNodeId: 'julian-alibi' }
    ]
  },
  {
    id: 'julian-service',
    storyId: sid,
    characterId: 'julian-ricci',
    text: 'Chloe took over final service while I reset galley stock.',
    responses: [{ id: 'j3', text: 'That helps. Stay available.', nextNodeId: null }]
  },
  {
    id: 'julian-alibi',
    storyId: sid,
    characterId: 'julian-ricci',
    text: 'I was at rear galley inventory terminal. You can check the station log.',
    responses: [{ id: 'j4', text: 'We will verify.', nextNodeId: null }]
  },
  {
    id: 'marcus-intro',
    storyId: sid,
    characterId: 'marcus-stone',
    text: "You want me to say I failed? Fine. I was on a call. Doesn't make me a killer.",
    responses: [
      { id: 'm1', text: 'Who had direct access to Vane and his med case?', nextNodeId: 'marcus-access' },
      { id: 'm2', text: 'Why was the whiskey glass in your evidence bag?', nextNodeId: 'marcus-glass' }
    ]
  },
  {
    id: 'marcus-access',
    storyId: sid,
    characterId: 'marcus-stone',
    text: 'Chloe. Always Chloe. She managed his tablets, meds, everything.',
    responses: [{ id: 'm3', text: 'Noted.', nextNodeId: null }]
  },
  {
    id: 'marcus-glass',
    storyId: sid,
    characterId: 'marcus-stone',
    text: 'I bagged it because Torres said secure everything after collapse.',
    responses: [{ id: 'm4', text: 'Chain of custody checks out.', nextNodeId: null }]
  },
  {
    id: 'rebecca-intro',
    storyId: sid,
    characterId: 'rebecca-park',
    text: 'At 18:42 UTC I saw Chloe serving Vane near the bar, then she returned to her call.',
    responses: [
      { id: 'r1', text: 'Could you see what was in her hands?', nextNodeId: 'rebecca-vision' },
      { id: 'r2', text: 'Confirm your timestamp source.', nextNodeId: 'rebecca-time' }
    ]
  },
  {
    id: 'rebecca-vision',
    storyId: sid,
    characterId: 'rebecca-park',
    text: 'Not clearly. Angle blocked her hands, but she was definitely preparing his drink.',
    responses: [{ id: 'r3', text: 'Understood.', nextNodeId: null }]
  },
  {
    id: 'rebecca-time',
    storyId: sid,
    characterId: 'rebecca-park',
    text: 'Flight deck UTC chronometer. I wrote it in my logbook immediately.',
    responses: [{ id: 'r4', text: 'Thank you.', nextNodeId: null }]
  }
];
