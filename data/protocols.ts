import type { Protocol } from '../types';

export const PROTOCOLS: Protocol[] = [
  // ── Curated Combos ──────────────────────────────────────────────────────────
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
  },

  // ── Expert Protocols ────────────────────────────────────────────────────────
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
  },
];

export function getProtocolById(id: string): Protocol | undefined {
  return PROTOCOLS.find((p) => p.id === id);
}

export function getProtocolsByCategory(category: Protocol['category']): Protocol[] {
  return PROTOCOLS.filter((p) => p.category === category);
}
