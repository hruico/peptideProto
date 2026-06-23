import mongoose, { Document, Schema } from 'mongoose';

export interface IActiveProtocol extends Document {
  userId: mongoose.Types.ObjectId;
  protocolId: string;   // references static data/protocols catalog id
  name: string;
  startedAt: Date;
}

const ActiveProtocolSchema = new Schema<IActiveProtocol>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    protocolId: { type: String, required: true },
    name: { type: String, required: true },
    startedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

ActiveProtocolSchema.index({ userId: 1 });

export const ActiveProtocol = mongoose.model<IActiveProtocol>('ActiveProtocol', ActiveProtocolSchema);
