import type { Goal } from '../types';

export const GOALS: Goal[] = [
  {
    id: 'injury-recovery',
    label: 'Injury Recovery',
    icon: '🩹',
    relatedPeptideIds: ['bpc-157', 'tb-500'],
  },
  {
    id: 'fat-loss',
    label: 'Fat Loss',
    icon: '🔥',
    relatedPeptideIds: ['aod-9604', 'cjc-1295', 'ipamorelin'],
  },
  {
    id: 'muscle-growth',
    label: 'Muscle & Strength',
    icon: '💪',
    relatedPeptideIds: ['igf-1-lr3', 'follistatin-344', 'cjc-1295', 'ipamorelin'],
  },
  {
    id: 'cognition',
    label: 'Cognition & Focus',
    icon: '🧠',
    relatedPeptideIds: ['semax', 'selank'],
  },
  {
    id: 'sleep',
    label: 'Sleep Quality',
    icon: '🌙',
    relatedPeptideIds: ['dsip', 'ipamorelin', 'epithalon'],
  },
  {
    id: 'longevity',
    label: 'Longevity',
    icon: '⏳',
    relatedPeptideIds: ['epithalon', 'ghk-cu', 'bpc-157'],
  },
  {
    id: 'gut-health',
    label: 'Gut Health',
    icon: '🫀',
    relatedPeptideIds: ['bpc-157', 'kpv'],
  },
  {
    id: 'skin-health',
    label: 'Skin & Aesthetics',
    icon: '✨',
    relatedPeptideIds: ['ghk-cu', 'bpc-157'],
  },
];

export function getGoalById(id: string): Goal | undefined {
  return GOALS.find((g) => g.id === id);
}
