import mongoose from 'mongoose';

const orderProductSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  color: { type: String, required: true },
  size: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [orderProductSchema],
  totalPrice: { type: Number, required: true, min: 0 },
  deliveryAddress: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    fullAddress: { type: String, required: true },
    city: { type: String, required: true },
  },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], 
    default: 'pending' 
  },
}, { timestamps: true });

export const Order = mongoose.model('Order', orderSchema);
