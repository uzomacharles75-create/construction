import mongoose, { Schema, model, Document } from 'mongoose';

// 1. Define the TypeScript interface for a single BOQ item
interface IBOQItem {
  description: string;
  unit: string;
  qty: number;
  rate: number;
  total: number;
  status: 'pending' | 'verified' | 'rejected';
  source: 'user' | 'marketplace' | 'ai';
}

// 2. Define the TypeScript interface for the BOQ document
export interface IBOQ extends Document {
  project: mongoose.Types.ObjectId;
  company: mongoose.Types.ObjectId;
  items: IBOQItem[];
  totalAmount: number;
  isLocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 3. The Item Schema (Sub-document)
const BOQItemSchema = new Schema<IBOQItem>({
  description: { type: String, required: true },
  unit: { type: String, required: true },
  qty: { type: Number, required: true, default: 0 },
  rate: { type: Number, required: true, default: 0 },
  total: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['pending', 'verified', 'rejected'], 
    default: 'pending' 
  },
  source: { 
    type: String, 
    enum: ['user', 'marketplace', 'ai'], 
    default: 'user' 
  }
});

// 4. The Main BOQ Schema
const BOQSchema = new Schema<IBOQ>({
  project: { 
    type: Schema.Types.ObjectId, 
    ref: 'Project', 
    required: true 
  },
  company: { 
    type: Schema.Types.ObjectId, 
    ref: 'Company', 
    required: true 
  },
  items: [BOQItemSchema],
  totalAmount: { 
    type: Number, 
    default: 0 
  },
  isLocked: { 
    type: Boolean, 
    default: false 
  }
}, { 
  timestamps: true // Automatically adds createdAt and updatedAt
});

// 5. MIDDLEWARE: Automatically calculate item totals and grand total before saving
BOQSchema.pre('save', function(next) {
  let grandTotal = 0;
  this.items.forEach(item => {
    item.total = item.qty * item.rate;
    grandTotal += item.total;
  });
  this.totalAmount = grandTotal;
  const allVerified = this.items.length > 0 && this.items.every(item => item.status === 'verified');
  this.isLocked = allVerified;
  next(); // Use next() to be safe with all TS versions
});

// 6. Export the Model
const BOQ = mongoose.models.BOQ || model<IBOQ>('BOQ', BOQSchema);
export default BOQ;