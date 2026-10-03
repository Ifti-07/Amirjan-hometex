import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart, CartItem } from '../store/CartContext';
import api from '../lib/api';
import { toast } from 'sonner';
import { ArrowLeft, CreditCard, Truck, ShieldCheck } from 'lucide-react';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, totalPrice, totalItems, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    fullAddress: '',
    city: ''
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/auth/profile');
        if (res.data.address) {
          setAddress(res.data.address);
        }
      } catch (err) {
        toast.error('Please login to checkout');
        navigate('/login?redirect=checkout');
      }
    };
    fetchUser();
  }, [navigate]);

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <h2 className="text-5xl font-bold tracking-tighter mb-6">YOUR CART IS EMPTY</h2>
        <Link to="/products" className="inline-block bg-black text-white px-10 py-4 font-bold uppercase tracking-widest hover:bg-gray-800 transition">
          Start Shopping
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.fullName || !address.phone || !address.fullAddress || !address.city) {
      toast.error('Please fill all address fields');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        products: cart.map((item: CartItem) => ({
          product: item._id,
          name: item.name,
          price: item.price,
          color: item.colorName,
          size: item.sizeName,
          quantity: item.quantity
        })),
        totalPrice,
        deliveryAddress: address
      };
      alert(JSON.stringify(orderData, null, 2));
      await api.post('/orders', orderData);

      toast.success('Order placed successfully!');
      clearCart();
      navigate('/account/orders');
    } catch (err: any) { 
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button onClick={() => navigate('/cart')} className="flex items-center text-sm font-bold uppercase tracking-widest mb-10 hover:text-gray-500 transition">
        <ArrowLeft size={16} className="mr-2" /> Back to Cart
      </button>

      <h1 className="text-5xl font-bold tracking-tighter mb-12">CHECKOUT</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Shipping Form */}
        <div className="space-y-10">
          <div className="space-y-6">
            <h3 className="text-xl font-bold tracking-tight border-b pb-4">Shipping Information</h3>
            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Full Name</label>
                  <input
                    type="text"
                    required
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full border-2 border-gray-100 p-4 focus:border-black outline-none transition"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="w-full border-2 border-gray-100 p-4 focus:border-black outline-none transition"
                    placeholder="017XXXXXXXX"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Full Address</label>
                <textarea
                  required
                  value={address.fullAddress}
                  onChange={(e) => setAddress({ ...address, fullAddress: e.target.value })}
                  className="w-full border-2 border-gray-100 p-4 focus:border-black outline-none transition h-32 resize-none"
                  placeholder="House #, Road #, Area..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">City</label>
                <input
                  type="text"
                  required
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="w-full border-2 border-gray-100 p-4 focus:border-black outline-none transition"
                  placeholder="Dhaka"
                />
              </div>

              <div className="pt-6">
                <h3 className="text-xl font-bold tracking-tight border-b pb-4 mb-6">Payment Method</h3>
                <div className="p-6 border-2 border-black flex items-center justify-between bg-gray-50">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full border-4 border-black mr-4"></div>
                    <span className="font-bold uppercase tracking-widest text-sm">Cash on Delivery</span>
                  </div>
                  <CreditCard size={24} className="text-gray-400" />
                </div>
                <p className="text-xs text-gray-500 mt-4 italic">
                  * Currently we only support Cash on Delivery. Pay when you receive your package.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-6 font-bold uppercase tracking-widest flex items-center justify-center hover:bg-gray-800 transition disabled:bg-gray-400 mt-10"
              >
                {loading ? 'Processing...' : `Confirm Order - ৳${(totalPrice || 0).toFixed(2)}`}
              </button>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-10">
          <div className="bg-gray-50 p-8 space-y-8">
            <h3 className="text-xl font-bold tracking-tight border-b pb-4">Order Summary</h3>

            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
              {cart.map((item: CartItem) => (
                <div key={item.uniqueId} className="flex gap-4">
                  <div className="w-20 h-20 bg-white border overflow-hidden flex-shrink-0">
                    <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm truncate">{item.name}</h4>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
                      {item.colorName} / {item.sizeName}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                      <span className="font-bold text-sm">৳{((item.price || 0) * (item.quantity || 0)).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-6 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 uppercase tracking-widest text-[10px] font-bold">Subtotal ({totalItems} items)</span>
                <span className="font-bold">৳{(totalPrice || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 uppercase tracking-widest text-[10px] font-bold">Shipping</span>
                <span className="text-green-600 font-bold uppercase tracking-widest text-[10px]">FREE</span>
              </div>
              <div className="flex justify-between text-2xl font-bold pt-4 border-t-2 border-black">
                <span>Total</span>
                <span>৳{(totalPrice || 0).toFixed(2)}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 pt-6">
              <div className="flex items-center space-x-3 text-gray-600">
                <Truck size={18} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Fast Delivery (2-5 Days)</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <ShieldCheck size={18} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Secure Transaction</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
