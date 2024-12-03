// models/RentalHistory.ts
import { Schema, model, models } from 'mongoose';

const RentalHistorySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  productName: {
    type: String,
    ref: 'Product',
    required: true,
  },
  wallet: {
    type: Schema.Types.ObjectId,
    ref: 'Wallet',
    required: true,
  },
  rentAmount: {
    type: Number,
    required: true,
  },
  rentDate: {
    type: Date,
    default: Date.now,
  },
  rentalPeriod: {
    type: Number, // number of days
    required: true,
  },
  dailyEarning: {
    type: Number,
    required: true,
  },
  lastEarningUpdate: {
    type: Date,
    default: Date.now,
  },
});

const RentalHistory = models.RentalHistory || model('RentalHistory', RentalHistorySchema);

export default RentalHistory;
