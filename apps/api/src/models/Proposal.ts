import mongoose, { Schema, model, Document } from 'mongoose';

export interface IProposal extends Document {
  tender: mongoose.Types.ObjectId;
  company: mongoose.Types.ObjectId; // The bidding contractor
  user: mongoose.Types.ObjectId;    // The individual who wrote the bid
  bidAmount: number;
  timelineWeeks: number;
  coverLetter: string;
  attachments: string[];
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Shortlisted';
}

const ProposalSchema = new Schema<IProposal>({
  tender: { type: Schema.Types.ObjectId, ref: 'Tender', required: true },
  company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  bidAmount: { type: Number, required: true },
  timelineWeeks: { type: Number, required: true },
  coverLetter: { type: String, required: true },
  attachments: [String],
  status: { 
    type: String, 
    enum: ['Pending', 'Accepted', 'Rejected', 'Shortlisted'], 
    default: 'Pending' 
  }
}, { timestamps: true });

// Prevent duplicate bids from the same company on the same tender
ProposalSchema.index({ tender: 1, company: 1 }, { unique: true });

export default mongoose.model<IProposal>('Proposal', ProposalSchema);