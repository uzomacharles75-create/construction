import mongoose, { Schema, Document } from 'mongoose';

/**
 * Captures how a user responded to an AI price suggestion, so the system can
 * learn from corrections over time (req #7). Each record is one accept/edit/reject.
 */
export interface IPriceFeedback extends Document {
  company: mongoose.Types.ObjectId;
  project?: mongoose.Types.ObjectId;
  description: string;
  category?: string;
  location?: string;
  aiSuggestedRate: number;
  finalRate: number;            // 0 for rejected
  confidence?: 'high' | 'medium' | 'low';
  action: 'accepted' | 'edited' | 'rejected';
  delta: number;                // finalRate - aiSuggestedRate
  deltaPct: number;             // delta / aiSuggestedRate
  createdAt: Date;
}

const PriceFeedbackSchema = new Schema<IPriceFeedback>({
  company: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  project: { type: Schema.Types.ObjectId, ref: 'Project' },
  description: { type: String, required: true },
  category: { type: String },
  location: { type: String },
  aiSuggestedRate: { type: Number, required: true },
  finalRate: { type: Number, default: 0 },
  confidence: { type: String, enum: ['high', 'medium', 'low'] },
  action: { type: String, enum: ['accepted', 'edited', 'rejected'], required: true },
  delta: { type: Number, default: 0 },
  deltaPct: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.PriceFeedback ||
  mongoose.model<IPriceFeedback>('PriceFeedback', PriceFeedbackSchema);
