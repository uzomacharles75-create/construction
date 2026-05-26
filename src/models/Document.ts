import mongoose, { Schema } from 'mongoose';

const DocumentSchema = new Schema({
  name: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileType: String,
  fileSize: String,
  category: { 
    type: String, 
    enum: ['Blueprint', 'Contract', 'Invoice', 'Photo', 'General', 'Log'], 
    default: 'General' 
  },
  company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  project: { type: Schema.Types.ObjectId, ref: 'Project' },
  uploadedBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('Document', DocumentSchema);