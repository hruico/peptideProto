import type { Peptide } from '../types';

export const PEPTIDES: Peptide[] = [
  // ── Recovery & Healing ─────────────────────────────────────────────────────
  {
    id: 'bpc-157',
    name: 'BPC-157',
    category: 'Recovery & Healing',
    description: 'A pentadecapeptide derived from human gastric juice with remarkable regenerative properties.',
    mechanism: 'Upregulates growth hormone receptors, promotes angiogenesis, and activates the FAK-paxillin pathway to accelerate tendon and ligament healing.',
    typicalDose: '250–500',
    doseUnit: 'mcg',
    relatedGoals: ['injury-recovery', 'gut-health', 'joint-health'],
    popularIn: ['Match my goal', 'Curated combos'],
  },
  {
    id: 'tb-500',
    name: 'TB-500',
    category: 'Recovery & Healing',
    description: 'Synthetic version of Thymosin Beta-4, a naturally occurring peptide that promotes healing and reduces inflammation.',
    mechanism: 'Regulates actin polymerization, promotes cell migration, and reduces inflammation by blocking NF-κB signalling.',
    typicalDose: '2–5',
    doseUnit: 'mg',
    relatedGoals: ['injury-recovery', 'inflammation', 'muscle-repair'],
    popularIn: ['Expert protocols', 'Curated combos'],
  },
  {
    id: 'ghk-cu',
    name: 'GHK-Cu',
    category: 'Skin & Aesthetics',
    description: 'A naturally occurring copper peptide complex with potent wound healing and anti-aging effects.',
    mechanism: 'Activates over 4,000 genes related to tissue repair, stimulates collagen synthesis, and has antioxidant properties.',
    typicalDose: '1–2',
    doseUnit: 'mg',
    relatedGoals: ['skin-health', 'anti-aging', 'wound-healing'],
    popularIn: ['Skin protocols'],
  },

  // ── Fat Loss ───────────────────────────────────────────────────────────────
  {
    id: 'aod-9604',
    name: 'AOD-9604',
    category: 'Fat Loss',
    description: 'A modified fragment of human growth hormone specifically targeting fat metabolism.',
    mechanism: 'Stimulates lipolysis and inhibits lipogenesis by mimicking the lipolytic activity of HGH without affecting IGF-1 levels or blood sugar.',
    typicalDose: '250–300',
    doseUnit: 'mcg',
    relatedGoals: ['fat-loss', 'body-composition'],
    popularIn: ['Fat loss stacks'],
  },
  {
    id: 'cjc-1295',
    name: 'CJC-1295',
    category: 'Fat Loss',
    description: 'A long-acting GHRH analogue that elevates growth hormone and IGF-1 levels.',
    mechanism: 'Binds to albumin via a DAC (Drug Affinity Complex) to extend its half-life, providing sustained GH pulse stimulation.',
    typicalDose: '100–300',
    doseUnit: 'mcg',
    relatedGoals: ['fat-loss', 'muscle-growth', 'anti-aging'],
    popularIn: ['GH stacks'],
  },
  {
    id: 'ipamorelin',
    name: 'Ipamorelin',
    category: 'Fat Loss',
    description: 'A selective GH secretagogue with minimal side effects, often paired with CJC-1295.',
    mechanism: 'Acts as a ghrelin mimetic at GHS-R1a receptors, triggering a clean GH pulse without significantly raising cortisol or prolactin.',
    typicalDose: '200–300',
    doseUnit: 'mcg',
    relatedGoals: ['fat-loss', 'sleep', 'recovery'],
    popularIn: ['GH stacks', 'Sleep protocols'],
  },

  // ── Muscle & Performance ──────────────────────────────────────────────────
  {
    id: 'igf-1-lr3',
    name: 'IGF-1 LR3',
    category: 'Muscle & Performance',
    description: 'A long-acting analogue of insulin-like growth factor 1 that potently stimulates muscle hypertrophy.',
    mechanism: 'Binds IGF-1 receptors with higher affinity than native IGF-1, promoting satellite cell activation and protein synthesis while inhibiting apoptosis.',
    typicalDose: '20–50',
    doseUnit: 'mcg',
    relatedGoals: ['muscle-growth', 'fat-loss', 'performance'],
    popularIn: ['Muscle protocols'],
  },
  {
    id: 'follistatin-344',
    name: 'Follistatin-344',
    category: 'Muscle & Performance',
    description: 'An activin-binding protein that suppresses myostatin, enabling significant muscle growth.',
    mechanism: 'Inhibits myostatin and other TGF-β superfamily members, removing the natural brake on muscle hypertrophy.',
    typicalDose: '50–100',
    doseUnit: 'mcg',
    relatedGoals: ['muscle-growth', 'performance'],
    popularIn: ['Elite muscle protocols'],
  },

  // ── Cognitive & Neuroprotection ────────────────────────────────────────────
  {
    id: 'semax',
    name: 'Semax',
    category: 'Cognitive & Neuroprotection',
    description: 'A synthetic peptide derived from ACTH with potent nootropic and neuroprotective effects.',
    mechanism: 'Increases BDNF and NGF expression, modulates dopaminergic and serotonergic systems, and provides antioxidant neuroprotection.',
    typicalDose: '100–600',
    doseUnit: 'mcg',
    relatedGoals: ['cognition', 'focus', 'neuroprotection'],
    popularIn: ['Cognitive stacks'],
  },
  {
    id: 'selank',
    name: 'Selank',
    category: 'Cognitive & Neuroprotection',
    description: 'An anxiolytic peptide with nootropic properties, derived from tuftsin.',
    mechanism: 'Modulates GABA-A receptors and increases BDNF, producing anxiolytic effects without sedation or dependency.',
    typicalDose: '250–500',
    doseUnit: 'mcg',
    relatedGoals: ['anxiety', 'cognition', 'stress'],
    popularIn: ['Cognitive stacks', 'Stress protocols'],
  },

  // ── Sleep & Longevity ─────────────────────────────────────────────────────
  {
    id: 'epithalon',
    name: 'Epithalon',
    category: 'Sleep & Longevity',
    description: 'A tetrapeptide that activates telomerase and regulates the pineal gland, showing remarkable anti-aging effects.',
    mechanism: 'Activates telomerase to elongate telomeres, normalises melatonin synthesis, and reduces oxidative stress markers.',
    typicalDose: '5–10',
    doseUnit: 'mg',
    relatedGoals: ['longevity', 'sleep', 'anti-aging'],
    popularIn: ['Longevity protocols'],
  },
  {
    id: 'dsip',
    name: 'DSIP',
    category: 'Sleep & Longevity',
    description: 'Delta Sleep-Inducing Peptide — a natural neuromodulator that improves deep sleep quality.',
    mechanism: 'Modulates the hypothalamic-pituitary axis and promotes delta-wave sleep by regulating stress hormones.',
    typicalDose: '100–300',
    doseUnit: 'mcg',
    relatedGoals: ['sleep', 'recovery', 'stress'],
    popularIn: ['Sleep protocols'],
  },

  // ── GI & Gut Health ───────────────────────────────────────────────────────
  {
    id: 'kpv',
    name: 'KPV',
    category: 'GI & Gut Health',
    description: 'A tripeptide derived from alpha-MSH with potent anti-inflammatory and gut-healing properties.',
    mechanism: 'Inhibits NF-κB signalling and pro-inflammatory cytokines in intestinal epithelial cells, reducing gut permeability.',
    typicalDose: '250–500',
    doseUnit: 'mcg',
    relatedGoals: ['gut-health', 'inflammation', 'leaky-gut'],
    popularIn: ['Gut healing stacks'],
  },
];

export function getPeptideById(id: string): Peptide | undefined {
  return PEPTIDES.find((p) => p.id === id);
}

export function getPeptidesByCategory(category: Peptide['category']): Peptide[] {
  return PEPTIDES.filter((p) => p.category === category);
}

export function getPeptidesByGoal(goal: string): Peptide[] {
  return PEPTIDES.filter((p) => p.relatedGoals.includes(goal));
}

export const PEPTIDE_CATEGORIES = [
  ...new Set(PEPTIDES.map((p) => p.category)),
] as Peptide['category'][];
