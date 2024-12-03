import { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema({
  productName: {
    type: String,
    required: true
  },
  rentAmount: {
    type: Number,
    required: true
  },
  rentDays: {
    type: Number,
    required: true
  },
  dailyEarning: {
    type: Number,
    required: true
  },
  offerTiming: {
    type: String,
    required: true
  },
  totalEarning: {
    type: Number,
    required: true
  },
  buyAmount: {
    type: Number,
    required: true,
  }
});

const Product = models.Product || model('Product', ProductSchema);

export default Product;