import { EvidenceItem } from '@/types/story';

const sid = 'terminal-velocity';

export const terminalVelocityEvidence: EvidenceItem[] = [
  {
    id: 'whiskey-glass',
    storyId: sid,
    name: 'Whiskey Glass',
    image: '/assets/terminal-velocity/evidence-realistic/whiskey-glass.svg',
    description: 'Bagged from seat 2A. Thin oily sheen remains at the bottom.',
    visualClue: 'Bottom ring appears iridescent under cabin light.',
    location: 'Aircraft cabin galley',
    requiresCharge: true,
    tags: ['required', 'forensics', 'drink'],
    analysisData: {
      result: 'HPMC residue and concentrated sesame oil detected.',
      confidence: 97,
      notes: ['Dissolvable capsule delivery highly likely.', 'Matches residue from capsule sample.']
    }
  },
  {
    id: 'fake-epipen',
    storyId: sid,
    name: 'Used Auto-Injector',
    image: '/assets/terminal-velocity/evidence-realistic/fake-epipen.svg',
    description: 'Recovered from medical waste bag after emergency response.',
    visualClue: 'Body color is white/gray, inconsistent with prescribed model.',
    location: 'Medical waste',
    requiresCharge: true,
    tags: ['required', 'medical'],
    analysisData: {
      result: 'Epinephrine concentration 0.006mg/mL. Spring compression clipped.',
      confidence: 99,
      notes: ['Dose is ~2 percent of therapeutic standard.', 'Device engineered to look active while failing treatment.']
    }
  },
  {
    id: 'medical-records',
    storyId: sid,
    name: 'Medical Records',
    image: '/assets/terminal-velocity/evidence-realistic/medical-records.svg',
    description: "Vane's allergy profile and prescription logs.",
    visualClue: 'Prescription photo shows yellow/blue Mylan injector.',
    location: 'Tablet + aircraft med kit',
    requiresCharge: false,
    tags: ['required', 'documents'],
    analysisData: {
      result: 'Prescribed brand: Mylan 0.3mg. Device used in incident does not match.',
      confidence: 95,
      notes: ['Confirms pre-flight swap opportunity.', 'Cross-reference with empty Mylan box evidence.']
    }
  },
  {
    id: 'practice-log',
    storyId: sid,
    name: 'Encrypted Training Log',
    image: '/assets/terminal-velocity/evidence-realistic/practice-log.svg',
    description: "Spreadsheet in folder labeled 'Training Log'.",
    visualClue: "Sticky note in planner reads 'Gym2024!'.",
    location: "Chloe's tablet",
    requiresCharge: false,
    tags: ['required', 'digital', 'premeditation'],
    analysisData: {
      result: 'Eight timed dissolution trials recorded. Average 22-23 minutes.',
      confidence: 96,
      notes: ['Entry: "Add water splash. Neat does not work."', 'Photos show capsule + whiskey + stopwatch workflow.']
    }
  },
  {
    id: 'video-call-logs',
    storyId: sid,
    name: 'Video Call Logs',
    image: '/assets/terminal-velocity/evidence-realistic/video-call-logs.svg',
    description: 'Merged logs from onboard WiFi and Tokyo conference bridge.',
    visualClue: '3-second packet loss at 18:42 UTC.',
    location: 'Flight network logs',
    requiresCharge: false,
    tags: ['required', 'timeline', 'digital'],
    analysisData: {
      result: 'Call remained connected, but stream froze at 18:42 UTC.',
      confidence: 93,
      notes: ['Camera framing omitted hands.', 'Supports covert action during freeze window.']
    }
  },
  {
    id: 'murder-kit',
    storyId: sid,
    name: 'Carry-on Murder Kit',
    image: '/assets/terminal-velocity/evidence-realistic/murder-kit.svg',
    description: 'Toiletry compartment containing prep tools and trace materials.',
    visualClue: 'One filled HPMC capsule hidden inside vitamin bottle.',
    location: "Chloe's carry-on",
    requiresCharge: true,
    tags: ['required', 'forensics', 'premeditation'],
    analysisData: {
      result: 'Capsule oil profile matches whiskey glass residue.',
      confidence: 98,
      notes: ['Includes syringe, stopwatch, sesame oil bottle, empty Mylan carton.', 'Direct means + preparation link.']
    }
  },
  {
    id: 'julian-apron',
    storyId: sid,
    name: "Julian's Apron",
    image: '/assets/terminal-velocity/evidence-realistic/julian-apron.svg',
    description: 'Cabin service apron retained in galley locker.',
    visualClue: 'Smells of citrus sanitizer and coffee.',
    location: 'Galley locker',
    requiresCharge: true,
    tags: ['red-herring'],
    analysisData: {
      result: 'No sesame oil, no HPMC residue.',
      confidence: 91,
      notes: ['No chemical signature tied to poison delivery.']
    }
  },
  {
    id: 'food-sample-tray',
    storyId: sid,
    name: 'Food Sample Tray',
    image: '/assets/terminal-velocity/evidence-realistic/food-sample-tray.svg',
    description: 'Retained portions from in-flight meal service.',
    visualClue: 'Labeled sesame-free by catering.',
    location: 'Aircraft galley fridge',
    requiresCharge: true,
    tags: ['red-herring'],
    analysisData: {
      result: 'No sesame proteins above trace background.',
      confidence: 92,
      notes: ['Food source unlikely to explain rapid reaction onset.']
    }
  },
  {
    id: 'marcus-flask',
    storyId: sid,
    name: "Marcus's Flask",
    image: '/assets/terminal-velocity/evidence-realistic/marcus-flask.svg',
    description: 'Personal flask surrendered during interview.',
    visualClue: 'Contains bourbon only.',
    location: 'Evidence locker',
    requiresCharge: true,
    tags: ['red-herring'],
    analysisData: {
      result: 'No sesame concentrate. No capsule polymer traces.',
      confidence: 90,
      notes: ['Not linked to poisoning mechanism.']
    }
  },
  {
    id: 'planner-sticky',
    storyId: sid,
    name: 'Planner Sticky Note',
    image: '/assets/terminal-velocity/evidence-realistic/planner-sticky.svg',
    description: "Small sticky note reading 'Gym2024!'.",
    visualClue: 'Handwriting matches Chloe notes in briefing binder.',
    location: "Chloe's planner",
    requiresCharge: false,
    tags: ['supporting'],
    analysisData: {
      result: 'Likely password artifact linked to encrypted log access.',
      confidence: 84,
      notes: ['Key bridge to practice-log decryption.']
    }
  },
  {
    id: 'mylan-empty-box',
    storyId: sid,
    name: 'Empty Mylan Box',
    image: '/assets/terminal-velocity/evidence-realistic/mylan-empty-box.svg',
    description: 'Flattened auto-injector carton without device.',
    visualClue: 'Lot number scraped but visible under UV.',
    location: "Chloe's carry-on",
    requiresCharge: false,
    tags: ['required', 'supporting'],
    analysisData: {
      result: 'Matches prescription record lot family.',
      confidence: 88,
      notes: ['Strong indicator of intentional swap.']
    }
  },
  {
    id: 'tokyo-deal-memo',
    storyId: sid,
    name: 'Tokyo Deal Memo',
    image: '/assets/terminal-velocity/evidence-realistic/tokyo-deal-memo.svg',
    description: 'Internal memo forecasting catastrophic post-deal collapse.',
    visualClue: 'Board risk note highlights pension exposure.',
    location: "Vane's briefcase",
    requiresCharge: false,
    tags: ['motive'],
    analysisData: {
      result: 'Confirms significant incentive for corporate intervention.',
      confidence: 86,
      notes: ['Supports motive narrative for contract killing.']
    }
  },
  {
    id: 'board-wire-fragment',
    storyId: sid,
    name: 'Board Wire Fragment',
    image: '/assets/terminal-velocity/evidence-realistic/board-wire-fragment.svg',
    description: 'Partial transfer metadata from secure email printout.',
    visualClue: 'Contains $2,000,000 transfer reference ID.',
    location: "Chloe's deleted mail cache",
    requiresCharge: false,
    tags: ['motive', 'supporting'],
    analysisData: {
      result: 'Payment route consistent with shell consulting transfer.',
      confidence: 82,
      notes: ['Not definitive alone, but aligns with confession narrative.']
    }
  },
  {
    id: 'copilot-logbook',
    storyId: sid,
    name: 'Co-Pilot Logbook',
    image: '/assets/terminal-velocity/evidence-realistic/copilot-logbook.svg',
    description: 'Rebecca Park handwritten timing notes.',
    visualClue: 'Entry at 18:42 UTC: "Chloe served Vane at bar."',
    location: 'Cockpit records',
    requiresCharge: false,
    tags: ['required', 'timeline'],
    analysisData: {
      result: 'Independent witness confirms service timestamp.',
      confidence: 94,
      notes: ['Corroborates WiFi packet-loss window.']
    }
  },
  {
    id: 'security-camera-still',
    storyId: sid,
    name: 'Cabin Camera Still',
    image: '/assets/terminal-velocity/evidence-realistic/security-camera-still.svg',
    description: 'Low-angle image from cabin camera during call.',
    visualClue: "Shows Chloe near bar while call pane remains active on laptop.",
    location: 'Aircraft CCTV buffer',
    requiresCharge: false,
    tags: ['timeline', 'supporting'],
    analysisData: {
      result: 'Opportunity window visually supported.',
      confidence: 89,
      notes: ['Hands obscured; requires corroboration.']
    }
  },
  {
    id: 'hpmc-supplier-receipt',
    storyId: sid,
    name: 'HPMC Supplier Receipt',
    image: '/assets/terminal-velocity/evidence-realistic/hpmc-supplier-receipt.svg',
    description: 'Online purchase invoice for empty HPMC capsules.',
    visualClue: "Shipped to Chloe's apartment 11 days before flight.",
    location: 'Email attachments',
    requiresCharge: false,
    tags: ['premeditation'],
    analysisData: {
      result: 'Procurement aligns with tested method and timeline.',
      confidence: 87,
      notes: ['Directly ties suspect to uncommon capsule material.']
    }
  },
  {
    id: 'syringe-fingerprint',
    storyId: sid,
    name: 'Precision Syringe',
    image: '/assets/terminal-velocity/evidence-realistic/syringe-fingerprint.svg',
    description: '0.5mL syringe with micro-residue.',
    visualClue: 'Single dominant print on barrel and plunger.',
    location: 'Murder kit',
    requiresCharge: true,
    tags: ['supporting', 'forensics'],
    analysisData: {
      result: 'Residue: sesame oil concentrate. Prints match Chloe.',
      confidence: 97,
      notes: ['Tool likely used to fill capsules to controlled volumes.']
    }
  },
  {
    id: 'call-transcript',
    storyId: sid,
    name: 'Tokyo Call Transcript',
    image: '/assets/terminal-velocity/evidence-realistic/call-transcript.svg',
    description: 'Speech-to-text transcript from the investor call.',
    visualClue: '3-second transcript gap at 18:42 UTC.',
    location: 'Tokyo server export',
    requiresCharge: false,
    tags: ['timeline'],
    analysisData: {
      result: 'Gap coincides with packet-loss and witness account.',
      confidence: 92,
      notes: ['Strengthens opportunity reconstruction.']
    }
  },
  {
    id: 'bodyguard-phone-log',
    storyId: sid,
    name: 'Bodyguard Phone Log',
    image: '/assets/terminal-velocity/evidence-realistic/bodyguard-phone-log.svg',
    description: 'Marcus on phone during key pre-collapse window.',
    visualClue: 'Seven-minute gambling call before symptom onset.',
    location: "Marcus's phone",
    requiresCharge: false,
    tags: ['distraction'],
    analysisData: {
      result: 'Confirms negligence but not poisoning action.',
      confidence: 88,
      notes: ['Explains security lapse and suspicious demeanor.']
    }
  },
  {
    id: 'allergy-alert-card',
    storyId: sid,
    name: 'Allergy Alert Card',
    image: '/assets/terminal-velocity/evidence-realistic/allergy-alert-card.svg',
    description: 'Wallet card indicating severe sesame anaphylaxis risk.',
    visualClue: 'Card stress-folded, likely handled during emergency.',
    location: 'Victim wallet',
    requiresCharge: false,
    tags: ['context'],
    analysisData: {
      result: 'Victim profile confirms known high-risk trigger.',
      confidence: 90,
      notes: ['Makes accidental sesame introduction less plausible in controlled cabin.']
    }
  },
  {
    id: 'cabinet-water-bottle',
    storyId: sid,
    name: 'Mini Water Bottle',
    image: '/assets/terminal-velocity/evidence-realistic/cabinet-water-bottle.svg',
    description: 'Partially used bottle near bar prep area.',
    visualClue: 'Cap opened shortly before 18:42.',
    location: 'Galley side shelf',
    requiresCharge: false,
    tags: ['timeline', 'supporting'],
    analysisData: {
      result: 'Supports "water splash" method requirement from trials.',
      confidence: 80,
      notes: ['Best used with practice log and glass chemistry.']
    }
  },
  {
    id: 'seat-2a-napkin',
    storyId: sid,
    name: 'Seat 2A Napkin',
    image: '/assets/terminal-velocity/evidence-realistic/seat-2a-napkin.svg',
    description: 'Napkin from victim tray table with smudged oil trace.',
    visualClue: 'Faint sesame odor after warming.',
    location: 'Seat 2A',
    requiresCharge: true,
    tags: ['supporting', 'forensics'],
    analysisData: {
      result: 'Trace sesame oil transfer pattern consistent with glass handling.',
      confidence: 85,
      notes: ['Secondary transfer; not primary delivery evidence.']
    }
  },
  {
    id: 'investor-board-minutes',
    storyId: sid,
    name: 'Board Minutes Draft',
    image: '/assets/terminal-velocity/evidence-realistic/investor-board-minutes.svg',
    description: 'Draft minutes discussing emergency leadership contingency.',
    visualClue: "Mentions 'post-incident continuity plan'.",
    location: 'Corporate drive cache',
    requiresCharge: false,
    tags: ['motive'],
    analysisData: {
      result: 'Suggests board anticipated abrupt leadership removal.',
      confidence: 78,
      notes: ['Circumstantial but aligns with payment evidence.']
    }
  },
  {
    id: 'chloe-cigarette-case',
    storyId: sid,
    name: 'Cigarette Case',
    image: '/assets/terminal-velocity/evidence-realistic/chloe-cigarette-case.svg',
    description: 'Metal case with engraved initials C.E.',
    visualClue: 'Contains airport lounge receipt timestamped 17:10.',
    location: "Chloe's coat pocket",
    requiresCharge: false,
    tags: ['flavor'],
    analysisData: {
      result: 'No direct forensic relevance to homicide method.',
      confidence: 60,
      notes: ['Character flavor; useful in confrontation scene framing.']
    }
  },
  {
    id: 'cabin-service-schedule',
    storyId: sid,
    name: 'Cabin Service Schedule',
    image: '/assets/terminal-velocity/evidence-realistic/cabin-service-schedule.svg',
    description: 'Printed service timing maintained by flight crew.',
    visualClue: 'Extra whiskey request entered at 18:43.',
    location: 'Service clipboard',
    requiresCharge: false,
    tags: ['timeline', 'supporting'],
    analysisData: {
      result: 'Aligns with reconstructed poisoning timeline.',
      confidence: 89,
      notes: ['Converges with co-pilot statement and logs.']
    }
  }
];
