import mongoose, { Document, Schema } from 'mongoose';

export interface ITrackingSession extends Document {
  userId: mongoose.Types.ObjectId;
  peptideId: string;
  metrics: {
    id: string;
    name: string;
    category: string;
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
    baselineValue?: number;
    unit?: string;
  }[];
  durationWeeks: number;
  startDate: string;
  endDate: string;
  baselinePhotoUri?: string;
}

const TrackingSessionSchema = new Schema<ITrackingSession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    peptideId: { type: String, required: true },
    metrics: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        category: { type: String, required: true },
        frequency: { type: String, enum: ['DAILY', 'WEEKLY', 'MONTHLY'], required: true },
        baselineValue: Number,
        unit: String,
      },
    ],
    durationWeeks: { type: Number, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    baselinePhotoUri: String,
  },
  { timestamps: true }
);

TrackingSessionSchema.index({ userId: 1 });

export const TrackingSession = mongoose.model<ITrackingSession>('TrackingSession', TrackingSessionSchema);

// ── Activity log ──────────────────────────────────────────────────────────────
export interface IActivityLog extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'protocol_started' | 'vial_saved' | 'dose_logged';
  title: string;
  subtitle?: string;
  relatedId?: string;
  date: string;
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['protocol_started', 'vial_saved', 'dose_logged'], required: true },
    title: { type: String, required: true },
    subtitle: String,
    relatedId: String,
    date: { type: String, required: true },
  },
  { timestamps: true }
);

ActivityLogSchema.index({ userId: 1, date: -1 });

export const ActivityLog = mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);
