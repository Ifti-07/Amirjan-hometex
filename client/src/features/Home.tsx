import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../lib/api';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes, offerRes] = await Promise.all([
          api.get('/products/featured'),
          api.get('/categories'),
          api.get('/offers')
        ]);
        setFeatured(prodRes.data);
        setCategories(catRes.data);
        setOffers(offerRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden bg-black">
        <div className="absolute inset-0 opacity-70">
          <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1920" 
            alt="Fashion Hero" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-4 block">New Collection 2026</span>
            <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] mb-8 uppercase italic">
              STYLE <br /> <span className="text-gray-400">DEFINED.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-md font-light leading-relaxed">
              Discover the latest trends in premium fashion. From formal shirts to casual denim, we have everything you need to look your best.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/products" 
                className="inline-flex items-center px-10 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-gray-200 transition"
              >
                Shop Now <ArrowRight className="ml-2" size={20} />
              </Link>
              <Link 
                to="/products?category=shirts" 
                className="inline-flex items-center px-10 py-4 border-2 border-white text-white font-bold uppercase tracking-widest hover:bg-white hover:text-black transition"
              >
                View Shirts
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dynamic Offers Section */}
      {Array.isArray(offers) && offers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {offers.map((offer: any, idx: number) => (
              <motion.div
                key={offer._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2 }}
                viewport={{ once: true }}
                className="relative h-[400px] group overflow-hidden bg-gray-900"
              >
                <img 
                  src={offer.image} 
                  alt={offer.title}
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 p-10 flex flex-col justify-end text-white">
                  <span className="text-sm font-black tracking-widest text-red-500 mb-2">{offer.discount}</span>
                  <h3 className="text-4xl font-black uppercase italic tracking-tighter mb-2">{offer.title}</h3>
                  <p className="text-gray-300 mb-6 max-w-xs">{offer.description}</p>
                  <Link 
                    to={offer.link}
                    className="inline-flex items-center text-sm font-bold uppercase tracking-widest border-b-2 border-white w-fit pb-1 hover:border-red-500 transition"
                  >
                    Claim Offer <ArrowRight className="ml-2" size={16} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Explore</span>
            <h2 className="text-4xl font-bold tracking-tight">Categories</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.isArray(categories) && categories.map((cat: any) => (
            <Link 
              key={cat._id} 
              to={`/products?category=${cat._id}`}
              className="group relative h-64 overflow-hidden bg-gray-100"
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition duration-500" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-white text-2xl font-bold tracking-tight uppercase">{cat.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Selected</span>
            <h2 className="text-4xl font-bold tracking-tight">Featured Products</h2>
          </div>
          <Link to="/products" className="text-sm font-bold uppercase tracking-widest border-b-2 border-black pb-1">View All</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {Array.isArray(featured) && featured.map((product: any) => (
            <motion.div 
              key={product._id}
              whileHover={{ y: -10 }}
              className="group"
            >
              <Link to={`/products/${product._id}`}>
                <div className="aspect-square overflow-hidden bg-gray-100 mb-4">
                  <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h3 className="text-lg font-bold tracking-tight">{product.name}</h3>
                <p className="text-gray-500">৳{(product.price || 0).toFixed(2)}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
