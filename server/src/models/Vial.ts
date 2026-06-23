import mongoose, { Document, Schema } from 'mongoose';

export interface IVial extends Document {
  userId: mongoose.Types.ObjectId;
  peptideId?: string;
  peptideName: string;
  label?: string;
  type: 'single' | 'blend';
  concentrationMcgPerMl: number;
  totalVolumeMl: number;
  reconstitutedDate: string;
  bacWaterMl?: number;
  originalAmountMg?: number;
}

const VialSchema = new Schema<IVial>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    peptideId: String,
    peptideName: { type: String, required: true },
    label: String,
    type: { type: String, enum: ['single', 'blend'], required: true },
    concentrationMcgPerMl: { type: Number, required: true },
    totalVolumeMl: { type: Number, required: true },
    reconstitutedDate: { type: String, required: true },
    bacWaterMl: Number,
    originalAmountMg: Number,
  },
  { timestamps: true }
);

VialSchema.index({ userId: 1 });

export const Vial = mongoose.model<IVial>('Vial', VialSchema);

// ── Custom blends ─────────────────────────────────────────────────────────────
export interface IBlend extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  isCustom: boolean;
  peptides: {
    peptideId: string;
    peptideName: string;
    amountMg: number;
  }[];
}

const BlendSchema = new Schema<IBlend>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: String,
    isCustom: { type: Boolean, default: true },
    peptides: [
      {
        peptideId: { type: String, required: true },
        peptideName: { type: String, required: true },
        amountMg: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

BlendSchema.index({ userId: 1 });

export const Blend = mongoose.model<IBlend>('Blend', BlendSchema);
