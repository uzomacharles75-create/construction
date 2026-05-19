import mongoose, { Schema, Document } from 'mongoose';
import { ensureUniqueSlug } from '../utils/companySlug';

export interface ICompany extends Document {
  name: string;
  slug: string;
  address?: string;
  city: string;
  country: string;
  website?: string;
  email?: string;
  phone?: string;
  sector?: string;
  logo?: string;
  portfolio?: string[];
  isVerified: boolean;
  status: 'pending' | 'verified' | 'rejected';
  owner: mongoose.Types.ObjectId;
  plan: 'basic' | 'pro' | 'enterprise';
}

const CompanySchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true, sparse: true, lowercase: true },
  address: String,
  city: { type: String, required: true },
  country: { type: String, required: true },
  website: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  sector: { type: String, default: 'General Construction' },
  logo: { type: String, default: '' },
  portfolio: [{ type: String }],
  isVerified: { type: Boolean, default: false },
  status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: String, enum: ['basic', 'pro', 'enterprise'], default: 'pro' },
}, { timestamps: true });

CompanySchema.pre('save', async function () {
  if (!this.slug && this.name) {
    this.slug = await ensureUniqueSlug(this.name, this._id?.toString());
  } else if (this.isModified('name') && this.name && !this.isNew) {
    this.slug = await ensureUniqueSlug(this.name, this._id?.toString());
  }
});

export default mongoose.model<ICompany>('Company', CompanySchema);
