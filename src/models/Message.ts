import mongoose, { Schema, model, Document } from 'mongoose';

export interface IMessage extends Document {
  conversationId: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  text: string;
  attachments: string[];
  isRead: boolean;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  attachments: [String], // URLs to site photos or blueprints on Cloudinary
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

// Indexing to load chat history fast
MessageSchema.index({ conversationId: 1, createdAt: 1 });

export default mongoose.model<IMessage>('Message', MessageSchema);