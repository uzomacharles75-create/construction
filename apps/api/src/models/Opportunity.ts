import mongoose, { Schema, model, Document } from 'mongoose';

export interface IOpportunity extends Document {
  externalId?: string;
  title: string;
  description?: string;
  type: 'job' | 'tender';
  category?: string;
  source: string;
  sourceUrl?: string;
  organization?: string;
  country?: string;
  region?: string;
  city?: string;
  locationText?: string;
  budget: number;
  currency: string;
  deadline?: Date;
  isConstruction: boolean;
  sector: 'government' | 'private';
  contactEmail?: string;
  contactPhone?: string;
  postedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OpportunitySchema = new Schema<IOpportunity>(
  {
    externalId: { type: String, index: { unique: true, sparse: true } },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    type: { type: String, enum: ['job', 'tender'], default: 'tender' },
    category: { type: String, default: 'General Construction' },
    source: { type: String, default: 'Sample' },
    sourceUrl: { type: String, default: '' },
    organization: { type: String, default: '' },
    country: { type: String, default: '' },
    region: { type: String, default: '' },
    city: { type: String, default: '' },
    locationText: { type: String, default: '' },
    budget: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
    deadline: { type: Date },
    isConstruction: { type: Boolean, default: true },
    sector: { type: String, enum: ['government', 'private'], default: 'government' },
    contactEmail: { type: String, default: '' },
    contactPhone: { type: String, default: '' },
    postedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.Opportunity ||
  model<IOpportunity>('Opportunity', OpportunitySchema);
