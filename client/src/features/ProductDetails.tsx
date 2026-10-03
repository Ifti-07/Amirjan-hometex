import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingBag, ArrowLeft, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import api from '../lib/api';
import { useCart } from '../store/CartContext';
import { toast } from 'sonner';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState<any>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
        if (res.data.variants && res.data.variants.length > 0) {
          setSelectedColor(res.data.variants[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (selectedColor) {
      setSelectedSize(null);
    }
  }, [selectedColor]);

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!product) return <div className="h-screen flex items-center justify-center">Product not found.</div>;

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      toast.error('Please select color and size');
      return;
    }
    addToCart(product, selectedColor.color, selectedSize);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button onClick={() => navigate(-1)} className="flex items-center text-sm font-bold uppercase tracking-widest mb-10 hover:text-gray-500 transition">
        <ArrowLeft size={16} className="mr-2" /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden bg-gray-100">
            <motion.img 
              key={activeImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              src={product.images[activeImage]} 
              alt={product.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((img: string, i: number) => (
              <button 
                key={i} 
                onClick={() => setActiveImage(i)}
                className={`aspect-square border-2 transition ${activeImage === i ? 'border-black' : 'border-transparent'}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">{product.category.name}</span>
            <h1 className="text-5xl font-bold tracking-tighter mt-2 mb-4">{product.name}</h1>
            <p className="text-3xl font-light">৳{(product.price || 0).toFixed(2)}</p>
          </div>

          <p className="text-gray-600 leading-relaxed text-lg">
            {product.description}
          </p>

          {product.variants && product.variants.length > 0 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Select Color</span>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((variant: any) => (
                    <button
                      key={variant.color._id}
                      onClick={() => setSelectedColor(variant)}
                      className={`group relative p-1 border-2 transition-all ${selectedColor?.color._id === variant.color._id ? 'border-black' : 'border-transparent hover:border-gray-200'}`}
                      title={variant.color.name}
                    >
                      <div 
                        className="w-8 h-8" 
                        style={{ backgroundColor: variant.color.hex }}
                      />
                      {selectedColor?.color._id === variant.color._id && (
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-bold uppercase whitespace-nowrap">
                          {variant.color.name}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {selectedColor && (
                <div className="space-y-4 pt-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Select Size</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedColor.sizes.map((sizeObj: any) => (
                      <button
                        key={sizeObj.size._id}
                        onClick={() => setSelectedSize(sizeObj)}
                        disabled={sizeObj.qty === 0}
                        className={`px-6 py-3 border-2 text-xs font-bold uppercase tracking-widest transition-all ${
                          selectedSize?.size._id === sizeObj.size._id 
                            ? 'bg-black text-white border-black' 
                            : sizeObj.qty === 0 
                              ? 'border-gray-100 text-gray-300 cursor-not-allowed' 
                              : 'border-gray-200 hover:border-black'
                        }`}
                      >
                        {sizeObj.size.name}
                        {sizeObj.qty > 0 && sizeObj.qty < 5 && (
                          <span className="block text-[8px] mt-1 text-red-500">Only {sizeObj.qty} left</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="pt-6 space-y-4">
            <button 
              onClick={handleAddToCart}
              disabled={!selectedSize || selectedSize.qty === 0}
              className="w-full bg-black text-white py-5 font-bold uppercase tracking-widest flex items-center justify-center hover:bg-gray-800 transition disabled:bg-gray-400"
            >
              <ShoppingBag size={20} className="mr-2" />
              {!selectedColor ? 'Select Color' : !selectedSize ? 'Select Size' : selectedSize.qty > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
            {selectedSize && selectedSize.qty > 0 && (
              <p className="text-xs text-center text-gray-500 uppercase tracking-widest">
                {selectedSize.qty} units available in stock
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t">
            <div className="flex flex-col items-center text-center space-y-2">
              <Truck size={24} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Free Shipping</span>
            </div>
            <div className="flex flex-col items-center text-center space-y-2">
              <RotateCcw size={24} />
              <span className="text-[10px] font-bold uppercase tracking-widest">30-Day Returns</span>
            </div>
            <div className="flex flex-col items-center text-center space-y-2">
              <ShieldCheck size={24} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Secure Payment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
