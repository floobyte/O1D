import mongoose, { Schema, Document, Model } from 'mongoose';

interface Reply {
  sender: 'user' | 'admin';
  userId?: string;
  message: string;
  timestamp: Date;
}

export interface SupportTicket extends Document {
  ticketId: string;
  status: string;
  replies: Reply[];
}

const replySchema = new Schema<Reply>({
  sender: { type: String, required: true, enum: ['user', 'admin'] },
  userId: { type: String },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const supportSchema = new Schema<SupportTicket>({
  ticketId: { type: String, required: true, unique: true },
  status: { type: String, default: 'open' },
  replies: [replySchema],
});

const Support: Model<SupportTicket> =
  mongoose.models.Support || mongoose.model<SupportTicket>('Support', supportSchema);

export default Support;
