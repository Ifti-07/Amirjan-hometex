import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, ChevronDown } from 'lucide-react';
import api from '../lib/api';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const currentCategory = searchParams.get('category') || '';
  const currentSort = searchParams.get('sort') || 'newest';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get(`/products?category=${currentCategory}&sort=${currentSort}`),
          api.get('/categories')
        ]);
        setProducts(prodRes.data);
        setCategories(catRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentCategory, currentSort]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchParams({ category: currentCategory, sort: e.target.value });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 space-y-6 md:space-y-0">
        <div>
          <h1 className="text-5xl font-bold tracking-tighter mb-2">SHOP ALL</h1>
          <p className="text-gray-500">{products.length} Products</p>
        </div>

        <div className="flex items-center space-x-4 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <select 
              value={currentSort}
              onChange={handleSortChange}
              className="appearance-none w-full bg-white border-2 border-black px-4 py-2 pr-10 font-bold uppercase tracking-widest text-xs focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" size={16} />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 space-y-8">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4 flex items-center">
              <Filter size={14} className="mr-2" /> Categories
            </h3>
            <div className="space-y-2">
              <button 
                onClick={() => setSearchParams({ sort: currentSort })}
                className={`block text-sm transition ${!currentCategory ? 'font-bold underline underline-offset-4' : 'text-gray-500 hover:text-black'}`}
              >
                All Products
              </button>
              {Array.isArray(categories) && categories.map((cat: any) => (
                <button 
                  key={cat._id}
                  onClick={() => setSearchParams({ category: cat._id, sort: currentSort })}
                  className={`block text-sm transition ${currentCategory === cat._id ? 'font-bold underline underline-offset-4' : 'text-gray-500 hover:text-black'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-gray-200 mb-4" />
                  <div className="h-4 bg-gray-200 w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 w-1/4" />
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {Array.isArray(products) && products.map((product: any) => (
                <Link key={product._id} to={`/products/${product._id}`} className="group">
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
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No products found in this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
