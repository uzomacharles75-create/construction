import mongoose, { Schema, model, Document } from 'mongoose';

export interface IConversation extends Document {
  participants: mongoose.Types.ObjectId[];
  lastMessage: string;
  project?: mongoose.Types.ObjectId;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>({
  participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  lastMessage: { type: String, default: "" },
  project: { type: Schema.Types.ObjectId, ref: 'Project' } // Optional site-specific context
}, { timestamps: true });

// Indexing for faster retrieval of a user's inbox
ConversationSchema.index({ participants: 1 });

export default mongoose.model<IConversation>('Conversation', ConversationSchema);