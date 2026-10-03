import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  discount: { type: String, required: true },
  image: { type: String, required: true },
  link: { type: String, default: '/shop' },
  active: { type: Boolean, default: true },
}, { timestamps: true });

export const Offer = mongoose.model('Offer', offerSchema);
