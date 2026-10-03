import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, MessageSquare, Package, Layers, Tag, LogOut } from 'lucide-react';
import api from '../lib/api';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'messages' | 'offers' | 'orders' | 'colors' | 'sizes' | 'stats'>('stats');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [messages, setMessages] = useState([]);
  const [offers, setOffers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productForm, setProductForm] = useState({
    name: '', price: 0, description: '', images: [''], category: '', variants: [] as any[], featured: false
  });

  const [showColorModal, setShowColorModal] = useState(false);
  const [editingColor, setEditingColor] = useState<any>(null);
  const [colorForm, setColorForm] = useState({ name: '', hex: '#000000' });

  const [showSizeModal, setShowSizeModal] = useState(false);
  const [editingSize, setEditingSize] = useState<any>(null);
  const [sizeForm, setSizeForm] = useState({ name: '' });

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '', image: '' });

  const [showOfferModal, setShowOfferModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState<any>(null);
  const [offerForm, setOfferForm] = useState({ title: '', description: '', discount: '', image: '', link: '/', active: true });

  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'products') {
        const res = await api.get('/products');
        setProducts(res.data);
        const [catRes, colRes, sizeRes] = await Promise.all([
          api.get('/categories'),
          api.get('/colors'),
          api.get('/sizes')
        ]);
        setCategories(catRes.data);
        setColors(colRes.data);
        setSizes(sizeRes.data);
      } else if (activeTab === 'categories') {
        const res = await api.get('/categories');
        setCategories(res.data);
      } else if (activeTab === 'messages') {
        const res = await api.get('/contact/messages');
        setMessages(res.data);
      } else if (activeTab === 'offers') {
        const res = await api.get('/offers');
        setOffers(res.data);
      } else if (activeTab === 'orders') {
        const res = await api.get('/orders/admin/all');
        setOrders(res.data);
      } else if (activeTab === 'colors') {
        const res = await api.get('/colors');
        setColors(res.data);
      } else if (activeTab === 'sizes') {
        const res = await api.get('/sizes');
        setSizes(res.data);
      } else if (activeTab === 'stats') {
        const res = await api.get('/dashboard/stats');
        setStats(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...productForm,
        images: productForm.images.filter(img => img.trim() !== '')
      };
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, data);
        toast.success('Product updated successfully!');
      } else {
        await api.post('/products', data);
        toast.success('Product created successfully!');
      }
      setShowProductModal(false);
      setEditingProduct(null);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleColorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingColor) {
        await api.put(`/colors/${editingColor._id}`, colorForm);
        toast.success('Color updated successfully!');
      } else {
        await api.post('/colors', colorForm);
        toast.success('Color created successfully!');
      }
      setShowColorModal(false);
      setEditingColor(null);
      setColorForm({ name: '', hex: '#000000' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSizeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSize) {
        await api.put(`/sizes/${editingSize._id}`, sizeForm);
        toast.success('Size updated successfully!');
      } else {
        await api.post('/sizes', sizeForm);
        toast.success('Size created successfully!');
      }
      setShowSizeModal(false);
      setEditingSize(null);
      setSizeForm({ name: '' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory._id}`, categoryForm);
        toast.success('Category updated successfully!');
      } else {
        await api.post('/categories', categoryForm);
        toast.success('Category created successfully!');
      }
      setShowCategoryModal(false);
      setEditingCategory(null);
      setCategoryForm({ name: '', description: '', image: '' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      toast.success('Order status updated!');
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteColor = async (id: string) => {
    try {
      await api.delete(`/colors/${id}`);
      toast.success('Color removed');
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await api.delete(`/categories/${id}`);
      toast.success('Category removed');
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      await api.delete(`/messages/${id}`);
      toast.success('Message removed');
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteSize = async (id: string) => {
    try {
      await api.delete(`/sizes/${id}`);
      toast.success('Size removed');
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleOfferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingOffer) {
        await api.put(`/offers/${editingOffer._id}`, offerForm);
        toast.success('Offer updated successfully!');
      } else {
        await api.post('/offers', offerForm);
        toast.success('Offer created successfully!');
      }
      setShowOfferModal(false);
      setEditingOffer(null);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted successfully!');
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteOffer = async (id: string) => {
    try {
      await api.delete(`/offers/${id}`);
      toast.success('Offer deleted successfully!');
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white p-8 space-y-10 flex-shrink-0">
        <h2 className="text-xl font-black tracking-tighter italic">CASH'N<span className="text-gray-500 not-italic font-light">ADMIN</span></h2>
        <nav className="space-y-2">
          <button 
            onClick={() => setActiveTab('stats')}
            className={`w-full flex items-center space-x-3 p-3 text-[10px] font-bold uppercase tracking-widest transition ${activeTab === 'stats' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
          >
            <Layers size={18} /> <span>Overview</span>
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center space-x-3 p-3 text-[10px] font-bold uppercase tracking-widest transition ${activeTab === 'orders' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
          >
            <Package size={18} /> <span>Orders</span>
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center space-x-3 p-3 text-[10px] font-bold uppercase tracking-widest transition ${activeTab === 'products' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
          >
            <Package size={18} /> <span>Products</span>
          </button>
          <button 
            onClick={() => setActiveTab('categories')}
            className={`w-full flex items-center space-x-3 p-3 text-[10px] font-bold uppercase tracking-widest transition ${activeTab === 'categories' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
          >
            <Layers size={18} /> <span>Categories</span>
          </button>
          <button 
            onClick={() => setActiveTab('colors')}
            className={`w-full flex items-center space-x-3 p-3 text-[10px] font-bold uppercase tracking-widest transition ${activeTab === 'colors' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
          >
            <Tag size={18} /> <span>Colors</span>
          </button>
          <button 
            onClick={() => setActiveTab('sizes')}
            className={`w-full flex items-center space-x-3 p-3 text-[10px] font-bold uppercase tracking-widest transition ${activeTab === 'sizes' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
          >
            <Tag size={18} /> <span>Sizes</span>
          </button>
          <button 
            onClick={() => setActiveTab('offers')}
            className={`w-full flex items-center space-x-3 p-3 text-[10px] font-bold uppercase tracking-widest transition ${activeTab === 'offers' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
          >
            <Tag size={18} /> <span>Offers</span>
          </button>
          <button 
            onClick={() => setActiveTab('messages')}
            className={`w-full flex items-center space-x-3 p-3 text-[10px] font-bold uppercase tracking-widest transition ${activeTab === 'messages' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
          >
            <MessageSquare size={18} /> <span>Messages</span>
          </button>
          <button 
            onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }}
            className="w-full flex items-center space-x-3 p-3 text-[10px] font-bold uppercase tracking-widest text-red-400 hover:text-red-200 transition mt-10"
          >
            <LogOut size={18} /> <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-y-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold tracking-tighter uppercase">{activeTab}</h1>
          {activeTab === 'products' && (
            <button 
              onClick={() => { setEditingProduct(null); setProductForm({ name: '', price: 0, description: '', images: [''], category: '', variants: [], featured: false }); setShowProductModal(true); }}
              className="bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest flex items-center"
            >
              <Plus size={16} className="mr-2" /> Add Product
            </button>
          )}
          {activeTab === 'categories' && (
            <button 
              onClick={() => { setEditingCategory(null); setCategoryForm({ name: '', description: '', image: '' }); setShowCategoryModal(true); }}
              className="bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest flex items-center"
            >
              <Plus size={16} className="mr-2" /> Add Category
            </button>
          )}
          {activeTab === 'colors' && (
            <button 
              onClick={() => setShowColorModal(true)}
              className="bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest flex items-center"
            >
              <Plus size={16} className="mr-2" /> Add Color
            </button>
          )}
          {activeTab === 'sizes' && (
            <button 
              onClick={() => setShowSizeModal(true)}
              className="bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest flex items-center"
            >
              <Plus size={16} className="mr-2" /> Add Size
            </button>
          )}
          {activeTab === 'offers' && (
            <button 
              onClick={() => { setEditingOffer(null); setOfferForm({ title: '', description: '', discount: '', image: '', link: '/', active: true }); setShowOfferModal(true); }}
              className="bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest flex items-center"
            >
              <Plus size={16} className="mr-2" /> Add Offer
            </button>
          )}
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-8">
            {activeTab === 'stats' && stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white border-2 border-black p-6">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Total Revenue</p>
                  <p className="text-3xl font-bold">৳{(stats?.totalRevenue || 0).toFixed(2)}</p>
                </div>
                <div className="bg-white border-2 border-black p-6">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Total Orders</p>
                  <p className="text-3xl font-bold">{stats.totalOrders}</p>
                </div>
                <div className="bg-white border-2 border-black p-6">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Pending Orders</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.pendingOrders}</p>
                </div>
                <div className="bg-white border-2 border-black p-6">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Delivered Orders</p>
                  <p className="text-3xl font-bold text-green-600">{stats.deliveredOrders}</p>
                </div>
              </div>
            )}

            <div className="bg-white border-2 border-black overflow-hidden">
              {activeTab === 'products' && (
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b-2 border-black text-[10px] font-bold uppercase tracking-widest">
                      <th className="p-4">Product</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Total Stock</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {Array.isArray(products) && products.map((p: any) => (
                      <tr key={p._id} className="border-b hover:bg-gray-50">
                        <td className="p-4 font-bold">{p.name}</td>
                        <td className="p-4 text-gray-500">{p.category?.name}</td>
                        <td className="p-4">৳{p.price}</td>
                        <td className="p-4">{p.totalStock}</td>
                        <td className="p-4 flex space-x-2">
                          <button 
                            onClick={() => { 
                              setEditingProduct(p); 
                              setProductForm({ 
                                ...p, 
                                category: p.category?._id,
                                variants: p.variants.map((v: any) => ({
                                  color: v.color?._id || v.color,
                                  sizes: v.sizes.map((s: any) => ({
                                    size: s.size?._id || s.size,
                                    qty: s.qty
                                  }))
                                }))
                              }); 
                              setShowProductModal(true); 
                            }} 
                            className="p-2 hover:bg-black hover:text-white transition"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => deleteProduct(p._id)} className="p-2 hover:bg-red-600 hover:text-white transition"><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === 'orders' && (
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b-2 border-black text-[10px] font-bold uppercase tracking-widest">
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {Array.isArray(orders) && orders.map((o: any) => (
                      <tr key={o._id} className="border-b hover:bg-gray-50">
                        <td className="p-4 font-mono text-xs">#{o._id.slice(-8).toUpperCase()}</td>
                        <td className="p-4">
                          <p className="font-bold">{o.deliveryAddress.fullName}</p>
                          <p className="text-[10px] text-gray-400">{o.deliveryAddress.phone}</p>
                        </td>
                        <td className="p-4 font-bold">৳{(o.totalPrice || 0).toFixed(2)}</td>
                        <td className="p-4">
                          <select 
                            value={o.status} 
                            onChange={(e) => updateOrderStatus(o._id, e.target.value)}
                            className={`text-[10px] font-bold uppercase tracking-widest p-1 border-2 ${
                              o.status === 'Pending' ? 'border-yellow-500 text-yellow-700' :
                              o.status === 'Packaging' ? 'border-blue-500 text-blue-700' :
                              o.status === 'Shipping' ? 'border-purple-500 text-purple-700' :
                              'border-green-500 text-green-700'
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Packaging">Packaging</option>
                            <option value="Shipping">Shipping</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </td>
                        <td className="p-4">
                          <button 
                            onClick={() => { setSelectedOrder(o); setShowOrderModal(true); }}
                            className="text-[10px] font-bold uppercase tracking-widest hover:underline"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === 'categories' && (
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b-2 border-black text-[10px] font-bold uppercase tracking-widest">
                      <th className="p-4">Category Name</th>
                      <th className="p-4">Description</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {Array.isArray(categories) && categories.map((c: any) => (
                      <tr key={c._id} className="border-b hover:bg-gray-50">
                        <td className="p-4 font-bold">{c.name}</td>
                        <td className="p-4 text-gray-500">{c.description}</td>
                        <td className="p-4 flex space-x-2">
                          <button onClick={() => { setEditingCategory(c); setCategoryForm({ ...c }); setShowCategoryModal(true); }} className="p-2 hover:bg-black hover:text-white transition"><Edit2 size={16} /></button>
                          <button onClick={() => deleteCategory(c._id)} className="p-2 hover:bg-red-600 hover:text-white transition"><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === 'colors' && (
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b-2 border-black text-[10px] font-bold uppercase tracking-widest">
                      <th className="p-4">Color Name</th>
                      <th className="p-4">Hex Code</th>
                      <th className="p-4">Preview</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {Array.isArray(colors) && colors.map((c: any) => (
                      <tr key={c._id} className="border-b hover:bg-gray-50">
                        <td className="p-4 font-bold">{c.name}</td>
                        <td className="p-4 font-mono">{c.hex}</td>
                        <td className="p-4">
                          <div className="w-6 h-6 border" style={{ backgroundColor: c.hex }}></div>
                        </td>
                        <td className="p-4 flex space-x-2">
                          <button onClick={() => { setEditingColor(c); setColorForm({ ...c }); setShowColorModal(true); }} className="p-2 hover:text-black transition"><Edit2 size={16} /></button>
                          <button onClick={() => deleteColor(c._id)} className="p-2 hover:text-red-600 transition"><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === 'sizes' && (
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b-2 border-black text-[10px] font-bold uppercase tracking-widest">
                      <th className="p-4">Size Name</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {Array.isArray(sizes) && sizes.map((s: any) => (
                      <tr key={s._id} className="border-b hover:bg-gray-50">
                        <td className="p-4 font-bold">{s.name}</td>
                        <td className="p-4 flex space-x-2">
                          <button onClick={() => { setEditingSize(s); setSizeForm({ ...s }); setShowSizeModal(true); }} className="p-2 hover:text-black transition"><Edit2 size={16} /></button>
                          <button onClick={() => deleteSize(s._id)} className="p-2 hover:text-red-600 transition"><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

            {activeTab === 'offers' && (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-black text-[10px] font-bold uppercase tracking-widest">
                    <th className="p-4">Offer</th>
                    <th className="p-4">Discount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {Array.isArray(offers) && offers.map((o: any) => (
                    <tr key={o._id} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-bold">{o.title}</td>
                      <td className="p-4 text-red-600 font-bold">{o.discount}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${o.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {o.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-4 flex space-x-2">
                        <button onClick={() => { setEditingOffer(o); setOfferForm({ ...o }); setShowOfferModal(true); }} className="p-2 hover:bg-black hover:text-white transition"><Edit2 size={16} /></button>
                        <button onClick={() => deleteOffer(o._id)} className="p-2 hover:bg-red-600 hover:text-white transition"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'messages' && (
              <div className="divide-y">
                {Array.isArray(messages) && messages.map((m: any) => (
                  <div key={m._id} className="p-6 space-y-2 relative group">
                    <button 
                      onClick={() => deleteMessage(m._id)}
                      className="absolute top-6 right-6 p-2 text-gray-300 hover:text-red-600 opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="flex justify-between">
                      <h4 className="font-bold">{m.name} <span className="text-gray-400 font-normal ml-2">({m.email})</span></h4>
                      <span className="text-[10px] text-gray-400 uppercase font-bold">{new Date(m.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-600">{m.message}</p>
                  </div>
                ))}
              </div>
            )}
            </div>
          </div>
        )}
      </main>

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border-2 border-black w-full max-w-4xl p-10 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold tracking-tighter mb-8 uppercase">{editingProduct ? 'Edit Product' : 'New Product'}</h2>
            <form onSubmit={handleProductSubmit} className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-2">Name</label>
                  <input type="text" required value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="w-full border-2 border-gray-100 p-3 focus:border-black outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-2">Price</label>
                  <input type="number" required value={productForm.price} onChange={e => setProductForm({...productForm, price: Number(e.target.value)})} className="w-full border-2 border-gray-100 p-3 focus:border-black outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-2">Description</label>
                <textarea required rows={4} value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} className="w-full border-2 border-gray-100 p-3 focus:border-black outline-none resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-2">Category</label>
                  <select required value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})} className="w-full border-2 border-gray-100 p-3 focus:border-black outline-none">
                    <option value="">Select Category</option>
                    {Array.isArray(categories) && categories.map((c: any) => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="flex items-center space-x-2 pt-8">
                  <input type="checkbox" checked={productForm.featured} onChange={e => setProductForm({...productForm, featured: e.target.checked})} className="w-4 h-4" />
                  <label className="text-[10px] font-bold uppercase tracking-widest">Featured Product</label>
                </div>
              </div>

              {/* Variants Section */}
              <div className="space-y-6 border-2 border-gray-100 p-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold uppercase tracking-widest">Product Variants</h3>
                  <button 
                    type="button"
                    onClick={() => setProductForm({...productForm, variants: [...productForm.variants, { color: '', sizes: [] }]})}
                    className="text-[10px] font-bold uppercase tracking-widest bg-black text-white px-4 py-2"
                  >
                    Add Color Variant
                  </button>
                </div>

                {productForm.variants.map((variant, vIdx) => (
                  <div key={vIdx} className="p-4 border border-gray-200 space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex-1 mr-4">
                        <label className="block text-[8px] font-bold uppercase tracking-widest mb-1">Color</label>
                        <select 
                          required 
                          value={variant.color} 
                          onChange={e => {
                            const newVariants = [...productForm.variants];
                            newVariants[vIdx].color = e.target.value;
                            setProductForm({...productForm, variants: newVariants});
                          }} 
                          className="w-full border p-2 text-xs"
                        >
                          <option value="">Select Color</option>
                          {colors.map((c: any) => <option key={c._id} value={c._id}>{c.name}</option>)}
                        </select>
                      </div>
                      <button 
                        type="button"
                        onClick={() => {
                          const newVariants = productForm.variants.filter((_, i) => i !== vIdx);
                          setProductForm({...productForm, variants: newVariants});
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-[8px] font-bold uppercase tracking-widest">Sizes & Stock</label>
                        <button 
                          type="button"
                          onClick={() => {
                            const newVariants = [...productForm.variants];
                            newVariants[vIdx].sizes.push({ size: '', qty: 0 });
                            setProductForm({...productForm, variants: newVariants});
                          }}
                          className="text-[8px] font-bold uppercase tracking-widest underline"
                        >
                          Add Size
                        </button>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {variant.sizes.map((sizeObj: any, sIdx: number) => (
                          <div key={sIdx} className="flex items-center space-x-2">
                            <select 
                              required 
                              value={sizeObj.size} 
                              onChange={e => {
                                const newVariants = [...productForm.variants];
                                newVariants[vIdx].sizes[sIdx].size = e.target.value;
                                setProductForm({...productForm, variants: newVariants});
                              }} 
                              className="flex-1 border p-2 text-xs"
                            >
                              <option value="">Select Size</option>
                              {sizes.map((s: any) => <option key={s._id} value={s._id}>{s.name}</option>)}
                            </select>
                            <input 
                              type="number" 
                              required 
                              placeholder="Qty"
                              value={sizeObj.qty} 
                              onChange={e => {
                                const newVariants = [...productForm.variants];
                                newVariants[vIdx].sizes[sIdx].qty = Number(e.target.value);
                                setProductForm({...productForm, variants: newVariants});
                              }} 
                              className="w-20 border p-2 text-xs"
                            />
                            <button 
                              type="button"
                              onClick={() => {
                                const newVariants = [...productForm.variants];
                                newVariants[vIdx].sizes = newVariants[vIdx].sizes.filter((_: any, i: number) => i !== sIdx);
                                setProductForm({...productForm, variants: newVariants});
                              }}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Images Section */}
              <div className="space-y-4 border-2 border-gray-100 p-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold uppercase tracking-widest">Product Images</h3>
                  <button 
                    type="button"
                    onClick={() => setProductForm({...productForm, images: [...productForm.images, '']})}
                    className="text-[10px] font-bold uppercase tracking-widest bg-black text-white px-4 py-2"
                  >
                    Add Image URL
                  </button>
                </div>
                <div className="space-y-3">
                  {productForm.images.map((img, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <input 
                        type="text" 
                        required 
                        placeholder="https://example.com/image.jpg"
                        value={img} 
                        onChange={e => {
                          const newImages = [...productForm.images];
                          newImages[i] = e.target.value;
                          setProductForm({...productForm, images: newImages});
                        }} 
                        className="flex-1 border-2 border-gray-100 p-3 focus:border-black outline-none" 
                      />
                      {productForm.images.length > 1 && (
                        <button 
                          type="button"
                          onClick={() => {
                            const newImages = productForm.images.filter((_, idx) => idx !== i);
                            setProductForm({...productForm, images: newImages});
                          }}
                          className="text-red-500 hover:text-red-700 p-2"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <button type="button" onClick={() => setShowProductModal(false)} className="px-6 py-3 text-xs font-bold uppercase tracking-widest border-2 border-black">Cancel</button>
                <button type="submit" className="px-6 py-3 text-xs font-bold uppercase tracking-widest bg-black text-white">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Color Modal */}
      {showColorModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border-2 border-black w-full max-w-md p-10">
            <h2 className="text-2xl font-bold tracking-tighter mb-8 uppercase">{editingColor ? 'Edit Color' : 'New Color'}</h2>
            <form onSubmit={handleColorSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-2">Color Name</label>
                <input type="text" required value={colorForm.name} onChange={e => setColorForm({...colorForm, name: e.target.value})} className="w-full border-2 border-gray-100 p-3 focus:border-black outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-2">Hex Code</label>
                <div className="flex space-x-2">
                  <input type="color" value={colorForm.hex} onChange={e => setColorForm({...colorForm, hex: e.target.value})} className="h-12 w-12 border-2 border-gray-100 p-1" />
                  <input type="text" required value={colorForm.hex} onChange={e => setColorForm({...colorForm, hex: e.target.value})} className="flex-1 border-2 border-gray-100 p-3 focus:border-black outline-none font-mono" />
                </div>
              </div>
              <div className="flex justify-end space-x-4 pt-6">
                <button type="button" onClick={() => { setShowColorModal(false); setEditingColor(null); }} className="px-6 py-3 text-xs font-bold uppercase tracking-widest border-2 border-black">Cancel</button>
                <button type="submit" className="px-6 py-3 text-xs font-bold uppercase tracking-widest bg-black text-white">Save Color</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Size Modal */}
      {showSizeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border-2 border-black w-full max-w-md p-10">
            <h2 className="text-2xl font-bold tracking-tighter mb-8 uppercase">{editingSize ? 'Edit Size' : 'New Size'}</h2>
            <form onSubmit={handleSizeSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-2">Size Name (e.g. XL)</label>
                <input type="text" required value={sizeForm.name} onChange={e => setSizeForm({...sizeForm, name: e.target.value})} className="w-full border-2 border-gray-100 p-3 focus:border-black outline-none" />
              </div>
              <div className="flex justify-end space-x-4 pt-6">
                <button type="button" onClick={() => { setShowSizeModal(false); setEditingSize(null); }} className="px-6 py-3 text-xs font-bold uppercase tracking-widest border-2 border-black">Cancel</button>
                <button type="submit" className="px-6 py-3 text-xs font-bold uppercase tracking-widest bg-black text-white">Save Size</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border-2 border-black w-full max-w-md p-10">
            <h2 className="text-2xl font-bold tracking-tighter mb-8 uppercase">{editingCategory ? 'Edit Category' : 'New Category'}</h2>
            <form onSubmit={handleCategorySubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-2">Category Name</label>
                <input type="text" required value={categoryForm.name} onChange={e => setCategoryForm({...categoryForm, name: e.target.value})} className="w-full border-2 border-gray-100 p-3 focus:border-black outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-2">Description</label>
                <textarea rows={3} value={categoryForm.description} onChange={e => setCategoryForm({...categoryForm, description: e.target.value})} className="w-full border-2 border-gray-100 p-3 focus:border-black outline-none resize-none" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-2">Image URL</label>
                <input type="text" value={categoryForm.image} onChange={e => setCategoryForm({...categoryForm, image: e.target.value})} className="w-full border-2 border-gray-100 p-3 focus:border-black outline-none" />
              </div>
              <div className="flex justify-end space-x-4 pt-6">
                <button type="button" onClick={() => { setShowCategoryModal(false); setEditingCategory(null); }} className="px-6 py-3 text-xs font-bold uppercase tracking-widest border-2 border-black">Cancel</button>
                <button type="submit" className="px-6 py-3 text-xs font-bold uppercase tracking-widest bg-black text-white">Save Category</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border-2 border-black w-full max-w-2xl p-10 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold tracking-tighter uppercase">Order Details</h2>
              <button onClick={() => setShowOrderModal(false)} className="text-gray-500 hover:text-black">✕</button>
            </div>
            
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Customer</h3>
                  <p className="font-bold">{selectedOrder.deliveryAddress.fullName}</p>
                  <p className="text-sm">{selectedOrder.deliveryAddress.phone}</p>
                </div>
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Shipping Address</h3>
                  <p className="text-sm">{selectedOrder.deliveryAddress.address}</p>
                  <p className="text-sm">{selectedOrder.deliveryAddress.city}</p>
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Items</h3>
                <div className="border-2 border-black divide-y-2 divide-black">
                  {(selectedOrder.products || []).map((item: any, idx: number) => (
                    <div key={idx} className="p-4 flex justify-between items-center">
                      <div>
                        <p className="font-bold">{item.name}</p>
                        <p className="text-[10px] uppercase tracking-widest text-gray-500">
                          {item.color} / {item.size} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-bold">৳{((item.price || 0) * (item.quantity || 0)).toFixed(2)}</p>
                    </div>
                  ))}
                  <div className="p-4 bg-gray-50 flex justify-between items-center font-bold">
                    <span>Total</span>
                    <span className="text-xl">৳{(selectedOrder?.totalPrice || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4">
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Status</h3>
                  <select 
                    value={selectedOrder.status} 
                    onChange={(e) => updateOrderStatus(selectedOrder._id, e.target.value)}
                    className="text-xs font-bold uppercase tracking-widest p-2 border-2 border-black"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Packaging">Packaging</option>
                    <option value="Shipping">Shipping</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
                <button 
                  onClick={() => setShowOrderModal(false)}
                  className="px-6 py-3 text-xs font-bold uppercase tracking-widest bg-black text-white"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Offer Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border-2 border-black w-full max-w-2xl p-10 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold tracking-tighter mb-8 uppercase">{editingOffer ? 'Edit Offer' : 'New Offer'}</h2>
            <form onSubmit={handleOfferSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-2">Title</label>
                  <input type="text" required value={offerForm.title} onChange={e => setOfferForm({...offerForm, title: e.target.value})} className="w-full border-2 border-gray-100 p-3 focus:border-black outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-2">Discount Text</label>
                  <input type="text" required placeholder="e.g. 50% OFF" value={offerForm.discount} onChange={e => setOfferForm({...offerForm, discount: e.target.value})} className="w-full border-2 border-gray-100 p-3 focus:border-black outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-2">Description</label>
                <textarea required rows={3} value={offerForm.description} onChange={e => setOfferForm({...offerForm, description: e.target.value})} className="w-full border-2 border-gray-100 p-3 focus:border-black outline-none resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-2">Image URL</label>
                  <input type="text" required value={offerForm.image} onChange={e => setOfferForm({...offerForm, image: e.target.value})} className="w-full border-2 border-gray-100 p-3 focus:border-black outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-2">Link</label>
                  <input type="text" required value={offerForm.link} onChange={e => setOfferForm({...offerForm, link: e.target.value})} className="w-full border-2 border-gray-100 p-3 focus:border-black outline-none" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" checked={offerForm.active} onChange={e => setOfferForm({...offerForm, active: e.target.checked})} className="w-4 h-4" />
                <label className="text-[10px] font-bold uppercase tracking-widest">Active Offer</label>
              </div>
              <div className="flex justify-end space-x-4 pt-6">
                <button type="button" onClick={() => setShowOfferModal(false)} className="px-6 py-3 text-xs font-bold uppercase tracking-widest border-2 border-black">Cancel</button>
                <button type="submit" className="px-6 py-3 text-xs font-bold uppercase tracking-widest bg-black text-white">Save Offer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
