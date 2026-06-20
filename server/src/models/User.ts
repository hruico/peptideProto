import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  displayName?: string;
  email?: string;
  provider: 'google' | 'apple' | 'guest';
  providerId?: string;       // OAuth subject / sub
  isGuest: boolean;
  createdAt: Date;
  // Onboarding snapshot stored per-user
  onboarding?: {
    sex?: string;
    ageRange?: string;
    selectedPath?: string;
    goal?: string;
    interestedPeptideId?: string;
    interestReasons?: string[];
    hasCompleted: boolean;
  };
}

const UserSchema = new Schema<IUser>(
  {
    displayName: { type: String },
    email: { type: String, lowercase: true, trim: true },
    provider: { type: String, enum: ['google', 'apple', 'guest'], required: true },
    providerId: { type: String },
    isGuest: { type: Boolean, default: false },
    onboarding: {
      sex: String,
      ageRange: String,
      selectedPath: String,
      goal: String,
      interestedPeptideId: String,
      interestReasons: [String],
      hasCompleted: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

// Compound unique index: one account per provider+subject
UserSchema.index({ provider: 1, providerId: 1 }, { unique: true, sparse: true });
UserSchema.index({ email: 1 }, { sparse: true });

export const User = mongoose.model<IUser>('User', UserSchema);
