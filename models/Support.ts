// models/SupportTicket.ts
import mongoose, { Schema, Document, Types } from 'mongoose';

interface IReply {
  sender: 'user' | 'admin';
  userId?: string; // userId to track which user replied
  message: string;
  timestamp: Date;
}

interface ISupportTicket extends Document {
  subjectLine: string;
  priority: 'high' | 'medium' | 'low';
  category: 'payment' | 'order' | 'other';
  ticketId: string;
  status: 'open' | 'answered' | 'closed';
  customReply?: string;
  replies: IReply[]; // Array to store replies
}

const SupportTicketSchema: Schema = new Schema(
  {
    subjectLine: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      required: true,
    },
    category: {
      type: String,
      enum: ['payment', 'order', 'other'],
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId, // to track the user who replied (only for user replies)
      ref: 'User',
      required: true
    },
    ticketId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ['open', 'answered', 'closed'],
      default: 'open',
    },
    customReply: {
      type: String,
      default: '',
    },
    replies: [{
      sender: {
        type: String,
        enum: ['user', 'admin'],
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    }],
  },
  {
    timestamps: true,
  }
);

const SupportTicket = mongoose.models.SupportTicket || mongoose.model<ISupportTicket>('SupportTicket', SupportTicketSchema);

export default SupportTicket;
