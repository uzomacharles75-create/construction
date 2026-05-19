import mongoose, { Schema, model, Document } from 'mongoose';

export interface ITender extends Document {
  title: string;
  slug: string;
  description: string;
  budget: number;
  location: string;
  deadline: Date;
  category: string;
  status: 'Open' | 'Closed' | 'Awarded' | 'Draft';
  postedBy?: mongoose.Types.ObjectId; // Optional for Guest Posts
  company?: mongoose.Types.ObjectId;  
  attachments: string[];             
  proposalsCount: number;
  isVerified: boolean;
  whatsappNumber: string;
  contactEmail: string;
  createdAt: Date;
  updatedAt: Date;
}

const TenderSchema = new Schema<ITender>({
  title: { type: String, required: true, trim: true },
  slug: String,
  description: { type: String, required: true },
  budget: { type: Number, required: true },
  location: { type: String, required: true },
  
  // FIX: required: false allows the controller to set a default
  deadline: { type: Date, required: false }, 
  
  category: { type: String, default: 'General Construction' },
  status: { type: String, enum: ['Open', 'Closed', 'Awarded', 'Draft'], default: 'Open' },
  
  // FIX: Removed 'required: true' so guests can post
  postedBy: { type: Schema.Types.ObjectId, ref: 'User', required: false }, 
  
  
  company: { type: Schema.Types.ObjectId, ref: 'Company' },
  attachments: [String],
  proposalsCount: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  whatsappNumber: { type: String, required: true }, 
  contactEmail: String
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

TenderSchema.pre('save', async function() {
  if (this.isModified('title')) {
    // Modern way: No 'next' needed. Just perform the logic.
    this.slug = this.title
      .toLowerCase()
      .trim()
      .split(' ')
      .join('-')
      .replace(/[^\w-]+/g, '');
  }
  // No next() call needed for async hooks
});


TenderSchema.virtual('daysRemaining').get(function() {
  if (!this.deadline) return 0;
  const diff = this.deadline.getTime() - new Date().getTime();
  return Math.ceil(diff / (1000 * 3600 * 24));
});

TenderSchema.index({ title: 'text', location: 'text' });

export default mongoose.models.Tender || model<ITender>('Tender', TenderSchema);