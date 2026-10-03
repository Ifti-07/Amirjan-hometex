import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { toast } from 'sonner';
import { Package, Truck, CheckCircle, Clock, MapPin, User as UserIcon, LogOut } from 'lucide-react';

export default function Account() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('orders');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, ordersRes] = await Promise.all([
          api.get('/auth/profile'),
          api.get('/orders/my-orders')
        ]);
        setUser(userRes.data);
        setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
      } catch (err) {
        toast.error('Please login to view your account');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Clock size={16} className="text-yellow-500" />;
      case 'Packaging': return <Package size={16} className="text-blue-500" />;
      case 'Shipping': return <Truck size={16} className="text-purple-500" />;
      case 'Delivered': return <CheckCircle size={16} className="text-green-500" />;
      default: return <Clock size={16} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar */}
        <div className="w-full md:w-64 space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter uppercase">Account</h2>
            <p className="text-gray-500 text-sm">{user?.email}</p>
          </div>

          <nav className="flex flex-col space-y-2">
            <button 
              onClick={() => setActiveTab('orders')}
              className={`flex items-center space-x-3 px-4 py-3 font-bold uppercase tracking-widest text-xs transition ${activeTab === 'orders' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
            >
              <Package size={18} />
              <span>My Orders</span>
            </button>
            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex items-center space-x-3 px-4 py-3 font-bold uppercase tracking-widest text-xs transition ${activeTab === 'profile' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
            >
              <UserIcon size={18} />
              <span>Profile & Address</span>
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-3 font-bold uppercase tracking-widest text-xs text-red-600 hover:bg-red-50 transition"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {activeTab === 'orders' ? (
            <div className="space-y-8">
              <h3 className="text-xl font-bold tracking-tight border-b pb-4">Order History</h3>
              {orders.length === 0 ? (
                <div className="py-20 text-center bg-gray-50 border-2 border-dashed border-gray-200">
                  <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">No orders found</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order._id} className="border-2 border-gray-100 p-6 space-y-6">
                      <div className="flex flex-wrap justify-between items-center gap-4">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Order ID</p>
                          <p className="font-mono text-sm">#{order._id.slice(-8).toUpperCase()}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Date</p>
                          <p className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</p>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(order.status)}
                            <span className="text-xs font-bold uppercase tracking-widest">{order.status}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Total</p>
                          <p className="font-bold">৳{(order.totalPrice || 0).toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="border-t pt-6 space-y-4">
                        {order.products.map((item: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gray-100 border overflow-hidden">
                                {item.product?.images?.[0] && (
                                  <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-bold">{item.name}</p>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                                  {item.color} / {item.size} x {item.quantity}
                                </p>
                              </div>
                            </div>
                            <p className="text-sm font-bold">৳{((item.price || 0) * (item.quantity || 0)).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>

                      <div className="bg-gray-50 p-4 flex items-start space-x-3">
                        <MapPin size={16} className="text-gray-400 mt-1" />
                        <div className="text-xs text-gray-600">
                          <p className="font-bold uppercase tracking-widest text-[8px] mb-1">Shipping Address</p>
                          <p>{order.deliveryAddress.fullName} | {order.deliveryAddress.phone}</p>
                          <p>{order.deliveryAddress.fullAddress}, {order.deliveryAddress.city}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              <h3 className="text-xl font-bold tracking-tight border-b pb-4">Profile Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="p-6 bg-gray-50 border-2 border-gray-100">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Email Address</p>
                    <p className="font-bold">{user?.email}</p>
                  </div>
                  <div className="p-6 bg-gray-50 border-2 border-gray-100">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Account Created</p>
                    <p className="font-bold">{new Date(user?.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-widest">Default Shipping Address</h4>
                  {user?.address ? (
                    <div className="p-6 border-2 border-black space-y-2">
                      <p className="font-bold">{user.address.fullName}</p>
                      <p className="text-sm">{user.address.phone}</p>
                      <p className="text-sm text-gray-600">{user.address.fullAddress}</p>
                      <p className="text-sm text-gray-600">{user.address.city}</p>
                    </div>
                  ) : (
                    <div className="p-6 border-2 border-dashed border-gray-200 text-center">
                      <p className="text-xs text-gray-500 uppercase tracking-widest">No address saved yet</p>
                    </div>
                  )}
                  <p className="text-[10px] text-gray-400 italic">
                    * Address is automatically saved when you place an order.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
