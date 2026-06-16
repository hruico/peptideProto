// ─── Core domain types for The Peptide App ───────────────────────────────────

export type DoseUnit = 'mcg' | 'mg' | 'IU';
export type ConcentrationUnit = 'mcg/mL' | 'mg/mL' | 'IU/mL';
export type PeptideCategory =
  | 'Recovery & Healing'
  | 'Fat Loss'
  | 'Muscle & Performance'
  | 'Cognitive & Neuroprotection'
  | 'Sleep & Longevity'
  | 'Sexual Health'
  | 'Skin & Aesthetics'
  | 'GI & Gut Health';

export interface Peptide {
  id: string;
  name: string;
  category: PeptideCategory;
  description: string;
  mechanism: string;
  typicalDose: string;
  doseUnit: DoseUnit;
  relatedGoals: string[];
  popularIn: string[];
}

export interface Protocol {
  id: string;
  name: string;
  subtitle: string;
  category: 'curated-combo' | 'expert-protocol' | 'community';
  heroImage?: string;
  durationLabel: string;    // e.g. "12 weeks"
  durationDays: number;
  participantCount: number;
  peptideIds: string[];
  schedule: ScheduleEntry[];
  tags: string[];
}

export interface ScheduleEntry {
  peptideId: string;
  dose: number;
  unit: DoseUnit;
  frequency: string;  // e.g. "Once daily", "5 days on / 2 off"
  timing?: string;    // e.g. "Before bed", "Post-workout"
}

export interface Vial {
  id: string;
  peptideId?: string;        // null for blends
  peptideName: string;
  label?: string;
  type: 'single' | 'blend';
  concentrationMcgPerMl: number;
  totalVolumeMl: number;
  reconstitutedDate: string; // ISO date string
  bacWaterMl?: number;
  originalAmountMg?: number;
}

export interface Blend {
  id: string;
  name: string;
  description?: string;
  peptides: BlendPeptide[];
  isCustom: boolean;
}

export interface BlendPeptide {
  peptideId: string;
  peptideName: string;
  amountMg: number;
}

export interface UserProfile {
  id: string;
  displayName?: string;
  createdAt: string;    // ISO date string
  isGuest: boolean;
}

export interface ActivityLogEntry {
  id: string;
  date: string;           // ISO date string
  type: 'protocol_started' | 'vial_saved' | 'dose_logged';
  title: string;
  subtitle?: string;
  relatedId?: string;
}

export interface Goal {
  id: string;
  label: string;
  icon: string;           // emoji
  relatedPeptideIds: string[];
}

// ─── Onboarding ──────────────────────────────────────────────────────────────

export type Sex = 'male' | 'female' | 'prefer-not-to-say';
export type AgeRange = '18-25' | '26-35' | '36-45' | '46-55' | '55+';
export type OnboardingPath =
  | 'match-goal'
  | 'choose-peptide'
  | 'browse-protocols'
  | 'add-stack';

// ─── Reconstitution calculator ───────────────────────────────────────────────

export interface ReconstitutionInput {
  vialAmountMg: number;
  bacWaterMl: number;
  desiredDose: number;
  desiredDoseUnit: DoseUnit;
}

export interface PreMixedInput {
  concentration: number;
  concentrationUnit: ConcentrationUnit;
  totalVolumeMl: number;
  doseAmount?: number;
  doseUnit?: DoseUnit;
}

export interface CalcResult {
  drawVolumeMl: number;
  syringeUnits: number;
  dosesPerVial?: number;
  concentrationMcgPerMl: number;
}
