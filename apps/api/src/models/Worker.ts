import mongoose, { Schema } from 'mongoose';

const WorkerSchema = new Schema({
  name: { type: String, required: true },
  role: { type: String, required: true }, // e.g., 'Foreman', 'Welder'
  status: { type: String, enum: ['Active', 'On Leave', 'Terminated'], default: 'Active' },
  skills: [String],
  rating: { type: Number, default: 5 },
  company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  assignedProject: { type: Schema.Types.ObjectId, ref: 'Project' }
}, { timestamps: true });

export default mongoose.model('Worker', WorkerSchema);