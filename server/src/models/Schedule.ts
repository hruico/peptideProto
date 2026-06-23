import mongoose, { Document, Schema } from 'mongoose';

export interface IScheduledPeptide extends Document {
  userId: mongoose.Types.ObjectId;
  clientId: string;          // client-side UUID (the `id` field from the app)
  peptideId: string;
  label?: string;
  dose: number;
  unit: 'mg' | 'mcg';
  frequency: 'once' | 'twice' | 'custom';
  times: string[];
  days: number[];
  durationValue?: number;
  durationUnit?: 'days' | 'weeks' | 'months';
  runIndefinitely: boolean;
  startDate: string;
  endDate?: string;
  titrationMode?: 'titrate' | 'fixed';
}

const ScheduledPeptideSchema = new Schema<IScheduledPeptide>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    clientId: { type: String, required: true },   // stores the app's `id` UUID
    peptideId: { type: String, required: true },
    label: String,
    dose: { type: Number, required: true },
    unit: { type: String, enum: ['mg', 'mcg'], required: true },
    frequency: { type: String, enum: ['once', 'twice', 'custom'], required: true },
    times: [String],
    days: [Number],
    durationValue: Number,
    durationUnit: { type: String, enum: ['days', 'weeks', 'months'] },
    runIndefinitely: { type: Boolean, default: false },
    startDate: { type: String, required: true },
    endDate: String,
    titrationMode: { type: String, enum: ['titrate', 'fixed'] },
  },
  { timestamps: true }
);

// One scheduled peptide per user+clientId — prevents duplicates on re-sync
ScheduledPeptideSchema.index({ userId: 1, clientId: 1 }, { unique: true });
ScheduledPeptideSchema.index({ userId: 1 });

export const ScheduledPeptide = mongoose.model<IScheduledPeptide>('ScheduledPeptide', ScheduledPeptideSchema);

// ── Taken doses ──────────────────────────────────────────────────────────────
// Each document = one dose log key: `${peptideId}-${date}-${time}`
export interface ITakenDose extends Document {
  userId: mongoose.Types.ObjectId;
  doseKey: string;
  takenAt: Date;
}

const TakenDoseSchema = new Schema<ITakenDose>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    doseKey: { type: String, required: true },
    takenAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

TakenDoseSchema.index({ userId: 1, doseKey: 1 }, { unique: true });

export const TakenDose = mongoose.model<ITakenDose>('TakenDose', TakenDoseSchema);
