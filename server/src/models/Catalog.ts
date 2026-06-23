import mongoose, { Document, Schema } from 'mongoose';

// ── Peptide ───────────────────────────────────────────────────────────────────
export interface ICatalogPeptide extends Document {
  id: string; // slug e.g. 'bpc-157'
  name: string;
  category: string;
  alsoKnownAs?: string;
  description: string;
  tagline: string;
  overview: string;
  mechanism: string;
  typicalDose: string;
  doseUnit: string;
  relatedGoals: string[];
  popularIn: string[];
  whoIsThisFor: string[];
  weekByWeek: { week: string; outcome: string }[];
  safety: { grade: string; label: string; description: string; sideEffects: string[] };
  typicalWeeklyCost: string;
  costPerMg: string;
  howToDose: string;
  cycle: string;
  tip?: string;
  sources?: string[];
  requiresTitration?: boolean;
  titrationNote?: string;
  categoryColor?: string;
}

const CatalogPeptideSchema = new Schema<ICatalogPeptide>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    alsoKnownAs: String,
    description: { type: String, required: true },
    tagline: { type: String, required: true },
    overview: { type: String, required: true },
    mechanism: { type: String, required: true },
    typicalDose: { type: String, required: true },
    doseUnit: { type: String, required: true },
    relatedGoals: [String],
    popularIn: [String],
    whoIsThisFor: [String],
    weekByWeek: [{ week: String, outcome: String }],
    safety: {
      grade: String,
      label: String,
      description: String,
      sideEffects: [String],
    },
    typicalWeeklyCost: String,
    costPerMg: String,
    howToDose: String,
    cycle: String,
    tip: String,
    sources: [String],
    requiresTitration: Boolean,
    titrationNote: String,
    categoryColor: String,
  },
  { timestamps: true }
);

export const CatalogPeptide = mongoose.model<ICatalogPeptide>('CatalogPeptide', CatalogPeptideSchema);

// ── Protocol ──────────────────────────────────────────────────────────────────
export interface ICatalogProtocol extends Document {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  durationLabel: string;
  durationDays: number;
  participantCount: number;
  peptideIds: string[];
  schedule: { peptideId: string; dose: number; unit: string; frequency: string; timing?: string }[];
  tags: string[];
  difficulty: string;
  frequencyLabel: string;
  estimatedWeeklyCost: string;
  whoIsThisFor: string[];
  importantToKnow: string[];
  faq: { question: string; answer: string }[];
}

const CatalogProtocolSchema = new Schema<ICatalogProtocol>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    subtitle: String,
    category: String,
    durationLabel: String,
    durationDays: Number,
    participantCount: Number,
    peptideIds: [String],
    schedule: [{ peptideId: String, dose: Number, unit: String, frequency: String, timing: String }],
    tags: [String],
    difficulty: String,
    frequencyLabel: String,
    estimatedWeeklyCost: String,
    whoIsThisFor: [String],
    importantToKnow: [String],
    faq: [{ question: String, answer: String }],
  },
  { timestamps: true }
);

export const CatalogProtocol = mongoose.model<ICatalogProtocol>('CatalogProtocol', CatalogProtocolSchema);

// ── Goal ──────────────────────────────────────────────────────────────────────
export interface ICatalogGoal extends Document {
  id: string;
  label: string;
  icon: string;
  relatedPeptideIds: string[];
  headline?: string;
  benefits?: string[];
  description?: string;
  socialProofCount?: number;
  socialProofLabel?: string;
  symptomOptions?: string[];
  bgColor?: string;
  recommendedProtocolId?: string;
}

const CatalogGoalSchema = new Schema<ICatalogGoal>(
  {
    id: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    icon: String,
    relatedPeptideIds: [String],
    headline: String,
    benefits: [String],
    description: String,
    socialProofCount: Number,
    socialProofLabel: String,
    symptomOptions: [String],
    bgColor: String,
    recommendedProtocolId: String,
  },
  { timestamps: true }
);

export const CatalogGoal = mongoose.model<ICatalogGoal>('CatalogGoal', CatalogGoalSchema);

// ── Blend ─────────────────────────────────────────────────────────────────────
export interface ICatalogBlend extends Document {
  id: string;
  name: string;
  description?: string;
  isCustom: boolean;
  peptides: { peptideId: string; peptideName: string; amountMg: number }[];
}

const CatalogBlendSchema = new Schema<ICatalogBlend>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: String,
    isCustom: { type: Boolean, default: false },
    peptides: [{ peptideId: String, peptideName: String, amountMg: Number }],
  },
  { timestamps: true }
);

export const CatalogBlend = mongoose.model<ICatalogBlend>('CatalogBlend', CatalogBlendSchema);
