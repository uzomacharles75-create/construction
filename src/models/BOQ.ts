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
  source: { type: String, enum: ['user', 'marketplace', 'ai'], default: 'user' }
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

// 5. THE FIX: Explicitly cast 'pre' to stop the TS2349 error
// This prevents the compiler from thinking you are passing "SaveOptions"
(BOQSchema as any).pre('save', function (this: IBOQ, next: (err?: Error) => void) {
  try {
    let grandTotal = 0;

    if (this.items && this.items.length > 0) {
      this.items.forEach((item) => {
        // Perform calculation for each row
        item.total = (item.qty || 0) * (item.rate || 0);
        grandTotal += item.total;
      });
    }

    this.totalAmount = grandTotal;

    // "Verification-First" Logic
    const allVerified =
      this.items.length > 0 &&
      this.items.every((item) => item.status === 'verified');

    this.isLocked = allVerified;

    next();
  } catch (error: any) {
    next(error);
  }
});

// 6. Export Model
const BOQ = mongoose.models.BOQ || mongoose.model<IBOQ>('BOQ', BOQSchema);
export default BOQ;