import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
  company: mongoose.Types.ObjectId;
  name: string;
  category: string;
  description?: string;
  image?: string;
  priceFrom?: number;
  priceTo?: number;
  unit: string;
  isPublic: boolean;
  createdAt: Date;
}

const ServiceSchema = new Schema<IService>({
  company:     { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  name:        { type: String, required: true, trim: true },
  category:    { type: String, required: true },
  description: { type: String, default: '' },
  image:       { type: String, default: '' },
  priceFrom:   { type: Number },
  priceTo:     { type: Number },
  unit:        { type: String, default: 'project' },
  isPublic:    { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model<IService>('Service', ServiceSchema);
