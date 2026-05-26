import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  name: string;
  location: string;
  clientName: string;
  budget: number;
  spent: number;
  progress: number;
  status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold';
  company: mongoose.Types.ObjectId; // The Tenant ID
  startDate: Date;
}

const ProjectSchema = new Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  clientName: { type: String, required: true },
  budget: { type: Number, default: 0 },
  spent: { type: Number, default: 0 },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  status: { 
    type: String, 
    enum: ['Planning', 'In Progress', 'Completed', 'On Hold'], 
    default: 'Planning' 
  },
  company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  startDate: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model<IProject>('Project', ProjectSchema);