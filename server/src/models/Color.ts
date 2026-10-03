import mongoose from 'mongoose';

const colorSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },
  hex: { type: String, required: true, unique: true, lowercase: true },
}, { timestamps: true });

export const Color = mongoose.model('Color', colorSchema);
