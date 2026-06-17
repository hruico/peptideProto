import type { Goal } from '../types';

export const GOALS: Goal[] = [
  { id: 'injury-recovery', label: 'Injury Recovery', icon: '🩹', relatedPeptideIds: ['bpc-157', 'tb-500'] },
  { id: 'fat-loss', label: 'Weight Loss', icon: '🔥', relatedPeptideIds: ['aod-9604', 'cjc-1295', 'ipamorelin'] },
  { id: 'muscle-growth', label: 'Muscle & Strength', icon: '💪', relatedPeptideIds: ['igf-1-lr3', 'follistatin-344', 'cjc-1295', 'ipamorelin'] },
  { id: 'cognition', label: 'Brain Enhancement', icon: '🧠', relatedPeptideIds: ['semax', 'selank'] },
  { id: 'sleep', label: 'Sleep Quality', icon: '🌙', relatedPeptideIds: ['dsip', 'ipamorelin', 'epithalon'] },
  { id: 'longevity', label: 'Anti Aging', icon: '⏳', relatedPeptideIds: ['epithalon', 'ghk-cu', 'bpc-157'] },
  { id: 'gut-health', label: 'Gut Health', icon: '🫀', relatedPeptideIds: ['bpc-157', 'kpv'] },
  { id: 'skin-health', label: 'Skincare & Beauty', icon: '✨', relatedPeptideIds: ['ghk-cu', 'bpc-157'] },
];

export interface GoalDetail {
  id: string;
  headline: string;
  benefits: string[];
  description: string;
  socialProofCount: number;
  socialProofLabel: string;
  symptomOptions: string[];
  bgColor: string;
  recommendedProtocolId?: string;
}

export const GOAL_DETAILS: GoalDetail[] = [
  {
    id: 'fat-loss',
    headline: 'Burn Fat While You Sleep',
    benefits: ['Lose 10–15 lbs in 8 weeks', 'Boost metabolism by 20%', 'Preserve lean muscle mass'],
    description: 'Peptides accelerate fat loss while preserving muscle. Combined with diet and exercise, users see dramatic improvements in body composition.',
    socialProofCount: 2847,
    socialProofLabel: 'people losing weight',
    symptomOptions: ['Stubborn last 10–15 lbs', 'Cravings and appetite control', 'Slow metabolism or low energy', 'Lose fat without losing muscle'],
    bgColor: '#FFF3ED',
    recommendedProtocolId: 'gh-optimizer',
  },
  {
    id: 'skin-health',
    headline: 'Turn Back the Clock',
    benefits: ['Reduce fine lines by 30%', 'Boost collagen production', 'Visible results in 4 weeks'],
    description: 'Copper peptides and healing peptides rebuild your skin from within, restoring elasticity and radiance that diminishes with age.',
    socialProofCount: 1923,
    socialProofLabel: 'people seeing results',
    symptomOptions: ['Fine lines and wrinkles', 'Dull or uneven skin tone', 'Loss of firmness', 'Dark spots or sun damage'],
    bgColor: '#FFF0F5',
    recommendedProtocolId: 'elite-recovery',
  },
  {
    id: 'muscle-growth',
    headline: 'Build Lean Muscle Fast',
    benefits: ['Gain 8–12 lbs lean muscle', 'Increase strength by 25%', 'Recover 2x faster'],
    description: 'Growth hormone peptides and muscle-signalling compounds create the anabolic environment your body needs to build and maintain lean muscle.',
    socialProofCount: 3412,
    socialProofLabel: 'athletes building muscle',
    symptomOptions: ['Struggling to gain muscle despite training', 'Long recovery between sessions', 'Plateau in strength gains', 'Poor sleep impacting recovery'],
    bgColor: '#EFF6FF',
    recommendedProtocolId: 'body-recomp',
  },
  {
    id: 'injury-recovery',
    headline: 'Heal Faster Than Ever',
    benefits: ['Cut recovery time in half', 'Reduce inflammation fast', 'Get back to 100%'],
    description: 'BPC-157 and TB-500 are the gold standard for accelerated healing — used by elite athletes to return from injury in record time.',
    socialProofCount: 1654,
    socialProofLabel: 'people recovering faster',
    symptomOptions: ['Tendon or ligament injury', 'Chronic joint pain', 'Post-surgery recovery', 'Muscle tears or strains'],
    bgColor: '#FFF1F0',
    recommendedProtocolId: 'injury-recovery-stack',
  },
  {
    id: 'cognition',
    headline: 'Unlock Your Mind',
    benefits: ['Sharper focus all day', 'Better memory recall', 'No jitters or crash'],
    description: 'Nootropic peptides modulate brain chemistry to give you clean, sustained focus — without the crash of stimulants.',
    socialProofCount: 1187,
    socialProofLabel: 'people thinking clearer',
    symptomOptions: ['Afternoon brain fog', 'Focus and productivity', 'Mood support', 'Memory and recall'],
    bgColor: '#F5F0FF',
    recommendedProtocolId: 'cognitive-edge',
  },
  {
    id: 'longevity',
    headline: 'Reverse the Signs of Aging',
    benefits: ['73% saw visible improvement', '2.4x faster cellular recovery', '89% reported more energy'],
    description: 'Epithalon activates telomerase — the enzyme that repairs chromosomal tips — potentially extending cellular lifespan at the molecular level.',
    socialProofCount: 2103,
    socialProofLabel: 'people investing in longevity',
    symptomOptions: ['Feeling older than your age', 'Low energy and vitality', 'Poor sleep quality', 'Skin aging and recovery'],
    bgColor: '#EFFCF8',
    recommendedProtocolId: 'longevity-protocol',
  },
  {
    id: 'sleep',
    headline: 'Sleep Like You\'re 25 Again',
    benefits: ['Fall asleep faster', 'Deeper, more restorative sleep', 'Wake up refreshed'],
    description: 'Sleep peptides like Ipamorelin and DSIP work with your body\'s natural circadian rhythm to optimize deep sleep cycles.',
    socialProofCount: 1432,
    socialProofLabel: 'people sleeping better',
    symptomOptions: ['Trouble falling asleep', 'Waking up during the night', 'Poor sleep quality', 'Not feeling rested'],
    bgColor: '#F0F0FF',
    recommendedProtocolId: 'longevity-protocol',
  },
  {
    id: 'gut-health',
    headline: 'Heal Your Gut From Within',
    benefits: ['Reduce gut inflammation', 'Repair gut lining', 'Improve digestion'],
    description: 'KPV and BPC-157 target gut epithelial cells directly, reducing inflammation and promoting healing of the gut lining.',
    socialProofCount: 987,
    socialProofLabel: 'people healing their gut',
    symptomOptions: ['IBS or IBD symptoms', 'Leaky gut', 'Chronic bloating', 'Food sensitivities'],
    bgColor: '#F0FFF4',
    recommendedProtocolId: 'gut-reset',
  },
];

export function getGoalById(id: string): Goal | undefined {
  return GOALS.find((g) => g.id === id);
}

export function getGoalDetailById(id: string): GoalDetail | undefined {
  return GOAL_DETAILS.find((g) => g.id === id);
}
