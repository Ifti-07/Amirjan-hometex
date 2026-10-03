import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart, CartItem } from '../store/CartContext';

export default function Cart() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <h2 className="text-5xl font-bold tracking-tighter mb-6">YOUR CART IS EMPTY</h2>
        <p className="text-gray-500 mb-10">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/products" className="inline-block bg-black text-white px-10 py-4 font-bold uppercase tracking-widest hover:bg-gray-800 transition">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-5xl font-bold tracking-tighter mb-12">SHOPPING CART</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-8">
          {cart.map((item: CartItem) => (
            <div key={item.uniqueId} className="flex flex-col sm:flex-row gap-6 pb-8 border-b">
              <div className="w-full sm:w-40 aspect-square bg-gray-100 overflow-hidden">
                <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <Link to={`/products/${item._id}`} className="text-xl font-bold hover:underline">{item.name}</Link>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{item.colorName}</span>
                      <span className="text-gray-300">|</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{item.sizeName}</span>
                    </div>
                    <p className="text-gray-500 mt-2 font-bold">৳{(item.price || 0).toFixed(2)}</p>
                  </div>
                  <button onClick={() => removeFromCart(item.uniqueId)} className="text-gray-400 hover:text-red-600 transition">
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="flex items-center space-x-4 mt-4">
                  <div className="flex items-center border-2 border-black">
                    <button 
                      onClick={() => updateQuantity(item.uniqueId, item.quantity - 1)}
                      className="p-2 hover:bg-gray-100"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-10 text-center font-bold">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.uniqueId, item.quantity + 1)}
                      className="p-2 hover:bg-gray-100"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <p className="font-bold ml-auto">৳{((item.price || 0) * (item.quantity || 0)).toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 p-8 h-fit space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-widest border-b pb-4">Order Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal ({totalItems} items)</span>
              <span className="font-bold">৳{(totalPrice || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Shipping</span>
              <span className="text-green-600 font-bold uppercase tracking-widest text-[10px]">FREE</span>
            </div>
            <div className="flex justify-between text-xl font-bold pt-4 border-t border-gray-200">
              <span>Total</span>
              <span>৳{(totalPrice || 0).toFixed(2)}</span>
            </div>
          </div>
          <button 
            onClick={() => navigate('/checkout')}
            className="w-full bg-black text-white py-5 font-bold uppercase tracking-widest flex items-center justify-center hover:bg-gray-800 transition"
          >
            Checkout <ArrowRight size={20} className="ml-2" />
          </button>
          <p className="text-[10px] text-center text-gray-400 uppercase tracking-widest">
            Taxes and shipping calculated at checkout
          </p>
        </div>
      </div>
    </div>
  );
}
