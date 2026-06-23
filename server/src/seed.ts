/**
 * Seed script — run once to populate catalog collections in MongoDB.
 * Usage: npx ts-node src/seed.ts
 * Safe to re-run — uses upsert so it won't duplicate.
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import { CatalogPeptide, CatalogProtocol, CatalogGoal, CatalogBlend } from './models/Catalog';

const PEPTIDES = [
  {
    id: 'bpc-157', name: 'BPC-157', category: 'Recovery & Healing',
    alsoKnownAs: 'Body Protective Compound 157',
    description: 'A pentadecapeptide derived from human gastric juice with remarkable regenerative properties.',
    tagline: '"The most versatile healing peptide — tendons, gut, nerves, and beyond."',
    overview: 'BPC-157 has demonstrated broad regenerative activity in animal models, accelerating healing of tendons, ligaments, muscle, gut lining, and even nervous tissue.',
    mechanism: 'Upregulates growth hormone receptors, promotes angiogenesis, and activates the FAK-paxillin pathway.',
    typicalDose: '250–500', doseUnit: 'mcg',
    relatedGoals: ['injury-recovery', 'gut-health', 'joint-health'],
    popularIn: ['Match my goal', 'Curated combos'],
    whoIsThisFor: ['Athletes recovering from tendon or ligament injuries', 'People with gut issues like IBS or leaky gut'],
    weekByWeek: [{ week: 'Week 1', outcome: 'Reduced inflammation and pain' }, { week: 'Week 4+', outcome: 'Significant tissue regeneration' }],
    safety: { grade: 'A', label: 'Excellent Safety Profile', description: 'Exceptionally clean safety record in animal studies.', sideEffects: ['Mild injection site discomfort', 'Occasional nausea (rare)'] },
    typicalWeeklyCost: '~$28', costPerMg: '~$5.60/mg',
    howToDose: '250–500 mcg once or twice daily (subcutaneous or IM)',
    cycle: '4–8 weeks on, 2–4 weeks off',
    tip: 'Inject near the injury site for localized effects, or systemically for gut healing.',
  },
  {
    id: 'tb-500', name: 'TB-500', category: 'Recovery & Healing',
    alsoKnownAs: 'Thymosin Beta-4 Synthetic Fragment',
    description: 'Synthetic version of Thymosin Beta-4 that promotes healing and reduces inflammation.',
    tagline: '"Systemic healing — works from the inside out."',
    overview: 'Unlike BPC-157 which works locally, TB-500 distributes systemically, making it ideal for injuries that are hard to inject near directly.',
    mechanism: 'Regulates actin polymerization, promotes cell migration, and reduces inflammation by blocking NF-κB signalling.',
    typicalDose: '2–5', doseUnit: 'mg',
    relatedGoals: ['injury-recovery', 'inflammation', 'muscle-repair'],
    popularIn: ['Expert protocols', 'Curated combos'],
    whoIsThisFor: ['Athletes with systemic inflammation', 'Those stacking with BPC-157 for maximum recovery'],
    weekByWeek: [{ week: 'Week 1–2', outcome: 'Systemic anti-inflammatory effects begin' }, { week: 'Week 5–8', outcome: 'Sustained tissue repair and resilience' }],
    safety: { grade: 'A', label: 'Excellent Safety Profile', description: 'Well-tolerated in animal studies. No significant adverse effects at therapeutic doses.', sideEffects: ['Injection site reactions', 'Fatigue (temporary)'] },
    typicalWeeklyCost: '~$35', costPerMg: '~$7/mg',
    howToDose: '2–2.5 mg twice weekly during loading phase, then once weekly',
    cycle: '8–12 weeks loading, then maintenance',
    tip: 'Often stacked with BPC-157 for a synergistic recovery effect.',
  },
  {
    id: 'ipamorelin', name: 'Ipamorelin', category: 'Fat Loss',
    description: 'A selective GH secretagogue with minimal side effects, often paired with CJC-1295.',
    tagline: '"Clean GH pulse — no cortisol, no prolactin."',
    overview: 'Ipamorelin produces a clean GH pulse without raising cortisol or prolactin — the two main unwanted effects of other GH secretagogues.',
    mechanism: 'Acts as a ghrelin mimetic at GHS-R1a receptors, triggering a clean GH pulse without significantly raising cortisol or prolactin.',
    typicalDose: '200–300', doseUnit: 'mcg',
    relatedGoals: ['fat-loss', 'sleep', 'recovery'],
    popularIn: ['GH stacks', 'Sleep protocols'],
    whoIsThisFor: ['Those wanting GH benefits without side effects', 'People prioritizing sleep quality'],
    weekByWeek: [{ week: 'Week 1', outcome: 'Noticeably deeper sleep' }, { week: 'Week 5–8', outcome: 'Body composition changes become visible' }],
    safety: { grade: 'A', label: 'Excellent Safety Profile', description: 'Does not significantly raise cortisol or prolactin.', sideEffects: ['Mild water retention', 'Hunger increase'] },
    typicalWeeklyCost: '~$20', costPerMg: '~$4/mg',
    howToDose: '200–300 mcg 1–3x daily (before bed is most effective)',
    cycle: '12–16 weeks',
    tip: 'Take on an empty stomach. Avoid carbs 30 min before and after for best GH response.',
  },
  {
    id: 'semax', name: 'Semax', category: 'Cognitive & Neuroprotection',
    description: 'A synthetic peptide derived from ACTH with potent nootropic and neuroprotective effects.',
    tagline: '"Russian military nootropic — sharper, faster, clearer."',
    overview: 'Semax increases BDNF, improves focus, and provides neuroprotective effects.',
    mechanism: 'Increases BDNF and NGF expression, modulates dopaminergic and serotonergic systems.',
    typicalDose: '100–600', doseUnit: 'mcg',
    relatedGoals: ['cognition', 'focus', 'neuroprotection'],
    popularIn: ['Cognitive stacks'],
    whoIsThisFor: ['Knowledge workers needing sustained focus', 'People with brain fog or cognitive decline'],
    weekByWeek: [{ week: 'Day 1–3', outcome: 'Noticeable increase in focus and mental energy' }, { week: 'Week 3–4', outcome: 'Sustained cognitive enhancement' }],
    safety: { grade: 'A', label: 'Excellent Safety Profile', description: 'Extensively studied in Russia. Well-tolerated with no serious adverse effects.', sideEffects: ['Mild irritability (first few days)', 'Vivid dreams'] },
    typicalWeeklyCost: '~$30', costPerMg: '~$10/mg',
    howToDose: '100–300 mcg intranasal or subcutaneous, 1–2x daily',
    cycle: '2–4 weeks on, 2 weeks off',
    tip: 'Intranasal administration works fastest. Start at 100 mcg to assess tolerance.',
  },
  {
    id: 'epithalon', name: 'Epithalon', category: 'Sleep & Longevity',
    alsoKnownAs: 'Epitalon / Epithalamin',
    description: 'A tetrapeptide that activates telomerase and regulates the pineal gland.',
    tagline: '"Reverse cellular aging — telomere repair and deep sleep."',
    overview: 'Epithalon activates telomerase, the enzyme responsible for repairing and lengthening telomeres, and normalizes melatonin synthesis via the pineal gland.',
    mechanism: 'Activates telomerase to elongate telomeres, normalises melatonin synthesis, and reduces oxidative stress markers.',
    typicalDose: '5–10', doseUnit: 'mg',
    relatedGoals: ['longevity', 'sleep', 'anti-aging'],
    popularIn: ['Longevity protocols'],
    whoIsThisFor: ['Anyone interested in longevity optimization', 'Biohackers doing an annual anti-aging protocol'],
    weekByWeek: [{ week: 'Days 1–3', outcome: 'Improved sleep depth and vivid dreams' }, { week: 'Months 1–3', outcome: 'Cellular renewal and anti-aging effects' }],
    safety: { grade: 'A', label: 'Excellent Safety Profile', description: 'Extensively studied in Russia over decades. No significant adverse effects at therapeutic doses.', sideEffects: ['Injection site reactions', 'Vivid dreams (usually considered positive)'] },
    typicalWeeklyCost: '~$40', costPerMg: '~$4/mg',
    howToDose: '5–10 mg daily for 10–20 days, once or twice yearly',
    cycle: '10–20 day course, then 4–6 month break',
    tip: 'Most protocols run 10 days straight once or twice per year for longevity benefits.',
  },
];

const PROTOCOLS = [
  {
    id: 'injury-recovery-stack', name: 'Injury Recovery Stack',
    subtitle: 'Tendon, ligament & soft tissue repair', category: 'curated-combo',
    durationLabel: '8 weeks', durationDays: 56, participantCount: 3241,
    peptideIds: ['bpc-157', 'tb-500'],
    schedule: [{ peptideId: 'bpc-157', dose: 500, unit: 'mcg', frequency: 'Once daily', timing: 'Morning, fasted' }, { peptideId: 'tb-500', dose: 2, unit: 'mg', frequency: 'Twice weekly' }],
    tags: ['recovery', 'healing', 'tendons'], difficulty: 'Beginner', frequencyLabel: 'Daily + 2x weekly', estimatedWeeklyCost: '~$45/wk',
    whoIsThisFor: ['Athletes recovering from tendon or ligament injuries', 'People with chronic joint pain'],
    importantToKnow: ['Medical supervision recommended', 'Source peptides from reputable, tested suppliers'],
    faq: [{ question: 'How quickly will I notice results?', answer: 'Many users report reduced inflammation within the first 1–2 weeks. Structural healing takes 4–8 weeks.' }],
  },
  {
    id: 'gh-optimizer', name: 'GH Optimizer',
    subtitle: 'Fat loss, muscle & sleep quality', category: 'curated-combo',
    durationLabel: '12 weeks', durationDays: 84, participantCount: 5820,
    peptideIds: ['cjc-1295', 'ipamorelin'],
    schedule: [{ peptideId: 'cjc-1295', dose: 100, unit: 'mcg', frequency: 'Once daily', timing: 'Before bed' }, { peptideId: 'ipamorelin', dose: 200, unit: 'mcg', frequency: 'Once daily', timing: 'Before bed' }],
    tags: ['gh', 'fat-loss', 'sleep', 'muscle'], difficulty: 'Beginner', frequencyLabel: 'Daily', estimatedWeeklyCost: '~$55/wk',
    whoIsThisFor: ['Adults over 30 experiencing GH decline', 'People wanting fat loss and muscle simultaneously'],
    importantToKnow: ['Take on an empty stomach for best GH response', 'Medical supervision recommended'],
    faq: [{ question: 'When will I notice better sleep?', answer: 'Most users notice improved sleep depth within the first week.' }],
  },
  {
    id: 'cognitive-edge', name: 'Cognitive Edge',
    subtitle: 'Focus, memory & neuroprotection', category: 'curated-combo',
    durationLabel: '6 weeks', durationDays: 42, participantCount: 1876,
    peptideIds: ['semax', 'selank'],
    schedule: [{ peptideId: 'semax', dose: 300, unit: 'mcg', frequency: 'Once daily', timing: 'Morning' }, { peptideId: 'selank', dose: 250, unit: 'mcg', frequency: 'Once daily', timing: 'Afternoon' }],
    tags: ['cognition', 'focus', 'anxiety', 'nootropic'], difficulty: 'Beginner', frequencyLabel: 'Daily', estimatedWeeklyCost: '~$40/wk',
    whoIsThisFor: ['Knowledge workers needing sustained focus', 'People with anxiety or stress impacting performance'],
    importantToKnow: ['Semax and Selank are available as intranasal sprays — no injection required'],
    faq: [{ question: 'Will this affect my mood?', answer: 'Selank has positive mood-modulating effects. Most users report reduced anxiety.' }],
  },
];

const GOALS = [
  { id: 'injury-recovery', label: 'Injury Recovery', icon: '🩹', relatedPeptideIds: ['bpc-157', 'tb-500'], headline: 'Heal Faster Than Ever', benefits: ['Cut recovery time in half', 'Reduce inflammation fast'], description: 'BPC-157 and TB-500 are the gold standard for accelerated healing.', socialProofCount: 1654, socialProofLabel: 'people recovering faster', symptomOptions: ['Tendon or ligament injury', 'Chronic joint pain', 'Post-surgery recovery'], bgColor: '#FFF1F0', recommendedProtocolId: 'injury-recovery-stack' },
  { id: 'fat-loss', label: 'Weight Loss', icon: '🔥', relatedPeptideIds: ['aod-9604', 'cjc-1295', 'ipamorelin'], headline: 'Burn Fat While You Sleep', benefits: ['Lose 10–15 lbs in 8 weeks', 'Boost metabolism by 20%'], description: 'Peptides accelerate fat loss while preserving muscle.', socialProofCount: 2847, socialProofLabel: 'people losing weight', symptomOptions: ['Stubborn last 10–15 lbs', 'Slow metabolism or low energy'], bgColor: '#FFF3ED', recommendedProtocolId: 'gh-optimizer' },
  { id: 'cognition', label: 'Brain Enhancement', icon: '🧠', relatedPeptideIds: ['semax', 'selank'], headline: 'Unlock Your Mind', benefits: ['Sharper focus all day', 'Better memory recall'], description: 'Nootropic peptides modulate brain chemistry for clean, sustained focus.', socialProofCount: 1187, socialProofLabel: 'people thinking clearer', symptomOptions: ['Afternoon brain fog', 'Focus and productivity'], bgColor: '#F5F0FF', recommendedProtocolId: 'cognitive-edge' },
];

const BLENDS = [
  { id: 'blend-recovery-classic', name: 'Recovery Classic', description: 'The gold standard recovery combo used by athletes worldwide.', isCustom: false, peptides: [{ peptideId: 'bpc-157', peptideName: 'BPC-157', amountMg: 5 }, { peptideId: 'tb-500', peptideName: 'TB-500', amountMg: 5 }] },
  { id: 'blend-gh-stack', name: 'GH Stack', description: 'Synergistic GH release for body composition and sleep.', isCustom: false, peptides: [{ peptideId: 'cjc-1295', peptideName: 'CJC-1295', amountMg: 2 }, { peptideId: 'ipamorelin', peptideName: 'Ipamorelin', amountMg: 2 }] },
];

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not set');

  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  // Upsert all — safe to re-run
  for (const p of PEPTIDES) {
    await CatalogPeptide.findOneAndUpdate({ id: p.id }, p, { upsert: true, new: true });
    console.log(`  peptide: ${p.name}`);
  }
  for (const p of PROTOCOLS) {
    await CatalogProtocol.findOneAndUpdate({ id: p.id }, p, { upsert: true, new: true });
    console.log(`  protocol: ${p.name}`);
  }
  for (const g of GOALS) {
    await CatalogGoal.findOneAndUpdate({ id: g.id }, g, { upsert: true, new: true });
    console.log(`  goal: ${g.label}`);
  }
  for (const b of BLENDS) {
    await CatalogBlend.findOneAndUpdate({ id: b.id }, b, { upsert: true, new: true });
    console.log(`  blend: ${b.name}`);
  }

  console.log('\nSeed complete.');
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
