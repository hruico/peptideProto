import type { Protocol } from '../types';

export interface ProtocolExtended extends Protocol {
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  frequencyLabel: string;
  estimatedWeeklyCost: string;
  whoIsThisFor: string[];
  importantToKnow: string[];
  faq: { question: string; answer: string }[];
}

export const PROTOCOLS: ProtocolExtended[] = [
  {
    id: 'injury-recovery-stack',
    name: 'Injury Recovery Stack',
    subtitle: 'Tendon, ligament & soft tissue repair',
    category: 'curated-combo',
    durationLabel: '8 weeks',
    durationDays: 56,
    participantCount: 3241,
    peptideIds: ['bpc-157', 'tb-500'],
    schedule: [
      { peptideId: 'bpc-157', dose: 500, unit: 'mcg', frequency: 'Once daily', timing: 'Morning, fasted' },
      { peptideId: 'tb-500', dose: 2, unit: 'mg', frequency: 'Twice weekly' },
    ],
    tags: ['recovery', 'healing', 'tendons'],
    difficulty: 'Beginner',
    frequencyLabel: 'Daily + 2x weekly',
    estimatedWeeklyCost: '~$45/wk',
    whoIsThisFor: [
      'Athletes recovering from tendon or ligament injuries',
      'People with chronic joint pain',
      'Post-surgery recovery patients',
      'Anyone with stubborn injuries that won\'t heal',
    ],
    importantToKnow: [
      'Medical supervision recommended for all injectable protocols',
      'Source peptides from reputable, tested suppliers',
      'BPC-157 may be taken orally for gut healing but injectable is preferred for injuries',
    ],
    faq: [
      { question: 'How quickly will I notice results?', answer: 'Many users report reduced inflammation and pain within the first 1–2 weeks. Structural healing takes 4–8 weeks.' },
      { question: 'Can I stack this with other protocols?', answer: 'Yes. This pairs well with GH peptides for enhanced recovery. Consult a practitioner for complex stacks.' },
      { question: 'How should I store these peptides?', answer: 'Store unreconstituted peptides in the freezer. Once reconstituted, refrigerate and use within 28 days.' },
    ],
  },
  {
    id: 'gh-optimizer',
    name: 'GH Optimizer',
    subtitle: 'Fat loss, muscle & sleep quality',
    category: 'curated-combo',
    durationLabel: '12 weeks',
    durationDays: 84,
    participantCount: 5820,
    peptideIds: ['cjc-1295', 'ipamorelin'],
    schedule: [
      { peptideId: 'cjc-1295', dose: 100, unit: 'mcg', frequency: 'Once daily', timing: 'Before bed' },
      { peptideId: 'ipamorelin', dose: 200, unit: 'mcg', frequency: 'Once daily', timing: 'Before bed' },
    ],
    tags: ['gh', 'fat-loss', 'sleep', 'muscle'],
    difficulty: 'Beginner',
    frequencyLabel: 'Daily',
    estimatedWeeklyCost: '~$55/wk',
    whoIsThisFor: [
      'Adults over 30 experiencing GH decline',
      'People wanting fat loss and muscle simultaneously',
      'Those with poor sleep quality',
      'Anyone wanting a gentle anti-aging protocol',
    ],
    importantToKnow: [
      'Take on an empty stomach for best GH response',
      'Avoid carbohydrates 30 minutes before and after injection',
      'Medical supervision recommended',
    ],
    faq: [
      { question: 'When will I notice better sleep?', answer: 'Most users notice improved sleep depth within the first week. GH release peaks during deep sleep.' },
      { question: 'Will this suppress my natural GH production?', answer: 'GHRH analogues stimulate natural GH release rather than replacing it, so suppression is minimal.' },
    ],
  },
  {
    id: 'cognitive-edge',
    name: 'Cognitive Edge',
    subtitle: 'Focus, memory & neuroprotection',
    category: 'curated-combo',
    durationLabel: '6 weeks',
    durationDays: 42,
    participantCount: 1876,
    peptideIds: ['semax', 'selank'],
    schedule: [
      { peptideId: 'semax', dose: 300, unit: 'mcg', frequency: 'Once daily', timing: 'Morning' },
      { peptideId: 'selank', dose: 250, unit: 'mcg', frequency: 'Once daily', timing: 'Afternoon' },
    ],
    tags: ['cognition', 'focus', 'anxiety', 'nootropic'],
    difficulty: 'Beginner',
    frequencyLabel: 'Daily',
    estimatedWeeklyCost: '~$40/wk',
    whoIsThisFor: [
      'Knowledge workers needing sustained focus',
      'People with anxiety or stress impacting performance',
      'Students and professionals seeking a cognitive edge',
      'Those with brain fog or post-COVID cognitive issues',
    ],
    importantToKnow: [
      'Semax and Selank are both available as intranasal sprays — no injection required',
      'Start at lower doses to assess tolerance',
      'These peptides are not sedating — safe for daytime use',
    ],
    faq: [
      { question: 'Will this affect my mood?', answer: 'Selank has positive mood-modulating effects. Most users report reduced anxiety and improved emotional resilience.' },
      { question: 'Can I take both at the same time?', answer: 'They can be taken together, but spacing them (morning/afternoon) lets you identify which one you respond to.' },
    ],
  },
  {
    id: 'longevity-protocol',
    name: 'Longevity Protocol',
    subtitle: 'Anti-aging & cellular rejuvenation',
    category: 'curated-combo',
    durationLabel: '10 days on / 4 months off',
    durationDays: 10,
    participantCount: 2109,
    peptideIds: ['epithalon', 'dsip'],
    schedule: [
      { peptideId: 'epithalon', dose: 5, unit: 'mg', frequency: 'Once daily', timing: 'Before bed' },
      { peptideId: 'dsip', dose: 200, unit: 'mcg', frequency: 'Once daily', timing: 'Before bed' },
    ],
    tags: ['longevity', 'anti-aging', 'sleep', 'telomeres'],
    difficulty: 'Beginner',
    frequencyLabel: 'Daily for 10 days',
    estimatedWeeklyCost: '~$55/wk (during cycle)',
    whoIsThisFor: [
      'Biohackers focused on longevity optimization',
      'Anyone concerned about cellular aging',
      'People wanting to improve sleep quality long-term',
      'Those doing annual anti-aging maintenance',
    ],
    importantToKnow: [
      'This is a short-course protocol — not meant for continuous use',
      'Run twice yearly for longevity maintenance',
      'Epithalon\'s effects are cumulative over multiple cycles',
    ],
    faq: [
      { question: 'How often should I run this cycle?', answer: 'Twice yearly is the typical recommendation for longevity purposes.' },
      { question: 'Can I extend beyond 10 days?', answer: 'Some protocols run 20 days. However 10 days is sufficient and better tolerated for most people.' },
    ],
  },
  {
    id: 'body-recomp',
    name: 'Body Recomposition',
    subtitle: 'Simultaneous fat loss & muscle gain',
    category: 'expert-protocol',
    durationLabel: '16 weeks',
    durationDays: 112,
    participantCount: 4430,
    peptideIds: ['cjc-1295', 'ipamorelin', 'aod-9604'],
    schedule: [
      { peptideId: 'cjc-1295', dose: 200, unit: 'mcg', frequency: 'Once daily', timing: 'Before bed' },
      { peptideId: 'ipamorelin', dose: 300, unit: 'mcg', frequency: 'Once daily', timing: 'Before bed' },
      { peptideId: 'aod-9604', dose: 250, unit: 'mcg', frequency: 'Once daily', timing: 'Morning, fasted' },
    ],
    tags: ['recomp', 'fat-loss', 'muscle', 'performance'],
    difficulty: 'Intermediate',
    frequencyLabel: 'Daily',
    estimatedWeeklyCost: '~$80/wk',
    whoIsThisFor: [
      'People who want to lose fat and gain muscle simultaneously',
      'Experienced athletes wanting to break a body composition plateau',
      'Adults 30+ dealing with body composition changes',
      'Those willing to commit to a 16-week protocol',
    ],
    importantToKnow: [
      'Medical supervision strongly recommended for this multi-peptide protocol',
      'Consistent training and nutrition are essential for results',
      'AOD-9604 should be taken fasted in the morning; GH peptides at night',
    ],
    faq: [
      { question: 'Do I need to change my diet?', answer: 'A moderate caloric deficit with high protein (0.8–1g per lb body weight) will optimize results.' },
      { question: 'How long until I see results?', answer: 'Most users notice changes in body composition by weeks 4–6. Full results at 12–16 weeks.' },
    ],
  },
  {
    id: 'elite-recovery',
    name: 'Elite Recovery',
    subtitle: 'Athlete-grade repair & regeneration',
    category: 'expert-protocol',
    durationLabel: '12 weeks',
    durationDays: 84,
    participantCount: 2760,
    peptideIds: ['bpc-157', 'tb-500', 'ghk-cu'],
    schedule: [
      { peptideId: 'bpc-157', dose: 250, unit: 'mcg', frequency: 'Twice daily' },
      { peptideId: 'tb-500', dose: 5, unit: 'mg', frequency: 'Once weekly' },
      { peptideId: 'ghk-cu', dose: 1, unit: 'mg', frequency: '3x per week' },
    ],
    tags: ['athlete', 'recovery', 'healing', 'performance'],
    difficulty: 'Intermediate',
    frequencyLabel: 'Daily + weekly',
    estimatedWeeklyCost: '~$90/wk',
    whoIsThisFor: [
      'Elite athletes with chronic or recurring injuries',
      'People recovering from surgery',
      'Those wanting maximum regenerative capacity',
      'Anyone who trains at high intensity regularly',
    ],
    importantToKnow: [
      'Three-peptide stack requires careful scheduling',
      'BPC-157 and GHK-Cu can be co-injected to simplify administration',
      'Medical supervision strongly recommended',
    ],
    faq: [
      { question: 'Can all three be taken together?', answer: 'BPC-157 and GHK-Cu can be mixed and injected together. TB-500 is separate due to its volume.' },
      { question: 'How soon after injury should I start?', answer: 'The earlier the better. Many users start within 24–48 hours of injury.' },
    ],
  },
  {
    id: 'gut-reset',
    name: 'Gut Reset',
    subtitle: 'Gut healing & inflammation reduction',
    category: 'expert-protocol',
    durationLabel: '8 weeks',
    durationDays: 56,
    participantCount: 1540,
    peptideIds: ['bpc-157', 'kpv'],
    schedule: [
      { peptideId: 'bpc-157', dose: 500, unit: 'mcg', frequency: 'Once daily', timing: 'Morning, fasted' },
      { peptideId: 'kpv', dose: 500, unit: 'mcg', frequency: 'Twice daily' },
    ],
    tags: ['gut', 'inflammation', 'healing', 'ibs'],
    difficulty: 'Beginner',
    frequencyLabel: '3x daily total',
    estimatedWeeklyCost: '~$50/wk',
    whoIsThisFor: [
      'People with IBS, IBD, or Crohn\'s disease',
      'Those with leaky gut or food sensitivities',
      'Anyone with chronic gut inflammation',
      'People who haven\'t responded to traditional treatments',
    ],
    importantToKnow: [
      'KPV can be taken orally (capsule form) to target gut directly',
      'BPC-157 is most effective for gut healing when taken fasted',
      'Results are gradual — give the full 8 weeks',
    ],
    faq: [
      { question: 'Can I take KPV orally instead of injecting?', answer: 'Yes. Oral KPV specifically targets the gut epithelium and is the preferred route for gut conditions.' },
      { question: 'Will this cure my IBS?', answer: 'These peptides reduce inflammation and support healing, but lifestyle factors like diet remain important.' },
    ],
  },
];

export function getProtocolById(id: string): ProtocolExtended | undefined {
  return PROTOCOLS.find((p) => p.id === id);
}

export function getProtocolsByCategory(category: Protocol['category']): ProtocolExtended[] {
  return PROTOCOLS.filter((p) => p.category === category);
}
