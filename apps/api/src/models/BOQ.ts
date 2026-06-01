import mongoose, { Schema, model, Document } from 'mongoose';

// 1. Item Interface
interface IBOQItem {
  description: string;
  unit: string;
  qty: number;
  rate: number;
  total: number;
  status: 'pending' | 'verified' | 'rejected';
  source: 'user' | 'marketplace' | 'ai';
  // AI pricing metadata (set when an item originates from an AI suggestion)
  suggestedRate?: number;
  confidence?: 'high' | 'medium' | 'low';
  aiJustification?: string;
}

// 2. Document Interface
export interface IBOQ extends Document {
  project: mongoose.Types.ObjectId;
  company: mongoose.Types.ObjectId;
  items: IBOQItem[];
  totalAmount: number;
  isLocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 3. Item Schema
const BOQItemSchema = new Schema<IBOQItem>({
  description: { type: String, required: true },
  unit: { type: String, required: true },
  qty: { type: Number, required: true, default: 0 },
  rate: { type: Number, required: true, default: 0 },
  total: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  source: { type: String, enum: ['user', 'marketplace', 'ai'], default: 'user' },
  // AI pricing metadata
  suggestedRate: { type: Number },
  confidence: { type: String, enum: ['high', 'medium', 'low'] },
  aiJustification: { type: String }
});

// 4. Main Schema
const BOQSchema = new Schema<IBOQ>({
  project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  items: [BOQItemSchema],
  totalAmount: { type: Number, default: 0 },
  isLocked: { type: Boolean, default: false }
}, { 
  timestamps: true 
});

// 5. Pre-save: recalculate line + grand totals and apply verification-first lock.
// Written in synchronous/promise style (no `next` callback) — Mongoose 7+ treats a
// zero-arg pre hook as promise-returning, so the old `next()` form threw
// "next is not a function" at runtime and broke every save.
BOQSchema.pre('save', function (this: IBOQ) {
  let grandTotal = 0;

  if (this.items && this.items.length > 0) {
    this.items.forEach((item) => {
      item.total = (item.qty || 0) * (item.rate || 0);
      grandTotal += item.total;
    });
  }

  this.totalAmount = grandTotal;

  // "Verification-First" Logic: lock once every item is verified
  this.isLocked =
    this.items.length > 0 &&
    this.items.every((item) => item.status === 'verified');
});

// 6. Export Model
const BOQ = mongoose.models.BOQ || mongoose.model<IBOQ>('BOQ', BOQSchema);
export default BOQ;