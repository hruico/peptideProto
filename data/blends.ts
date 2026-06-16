import type { Blend } from '../types';

export const POPULAR_BLENDS: Blend[] = [
  {
    id: 'blend-recovery-classic',
    name: 'Recovery Classic',
    description: 'The gold standard recovery combo used by athletes worldwide.',
    isCustom: false,
    peptides: [
      { peptideId: 'bpc-157', peptideName: 'BPC-157', amountMg: 5 },
      { peptideId: 'tb-500', peptideName: 'TB-500', amountMg: 5 },
    ],
  },
  {
    id: 'blend-gh-stack',
    name: 'GH Stack',
    description: 'Synergistic GH release for body composition and sleep.',
    isCustom: false,
    peptides: [
      { peptideId: 'cjc-1295', peptideName: 'CJC-1295', amountMg: 2 },
      { peptideId: 'ipamorelin', peptideName: 'Ipamorelin', amountMg: 2 },
    ],
  },
  {
    id: 'blend-neuro-stack',
    name: 'Neuro Stack',
    description: 'Calm focus and memory enhancement without stimulants.',
    isCustom: false,
    peptides: [
      { peptideId: 'semax', peptideName: 'Semax', amountMg: 3 },
      { peptideId: 'selank', peptideName: 'Selank', amountMg: 3 },
    ],
  },
  {
    id: 'blend-longevity',
    name: 'Longevity Blend',
    description: 'Telomere support and deep sleep optimization.',
    isCustom: false,
    peptides: [
      { peptideId: 'epithalon', peptideName: 'Epithalon', amountMg: 10 },
      { peptideId: 'dsip', peptideName: 'DSIP', amountMg: 2 },
    ],
  },
];
