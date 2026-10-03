import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  color: { type: mongoose.Schema.Types.ObjectId, ref: 'Color', required: true },
  sizes: [{
    size: { type: mongoose.Schema.Types.ObjectId, ref: 'Size', required: true },
    qty: { type: Number, required: true, min: 0, default: 0 },
  }],
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  description: { type: String, required: true },
  images: { type: [String], default: [] },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  variants: [variantSchema],
  featured: { type: Boolean, default: false },
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

productSchema.virtual('totalStock').get(function() {
  return this.variants.reduce((total, variant) => {
    return total + variant.sizes.reduce((sum, size) => sum + size.qty, 0);
  }, 0);
});

export const Product = mongoose.model('Product', productSchema);
