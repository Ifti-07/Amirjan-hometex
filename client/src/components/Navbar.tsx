import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../store/AuthContext';
import { useCart } from '../store/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-black tracking-tighter text-black uppercase italic">
              CASH'N<span className="text-gray-400 not-italic font-light">STYLE</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/products" className="text-sm font-medium text-gray-700 hover:text-black transition">Shop</Link>
            <Link to="/contact" className="text-sm font-medium text-gray-700 hover:text-black transition">Contact</Link>
            
            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-black transition">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black">Admin</Link>
                )}
                <button onClick={handleLogout} className="p-2 text-gray-700 hover:text-black transition">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="p-2 text-gray-700 hover:text-black transition">
                <User size={20} />
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t px-4 pt-2 pb-6 space-y-4">
          <Link to="/products" className="block text-lg font-medium" onClick={() => setIsOpen(false)}>Shop</Link>
          <Link to="/contact" className="block text-lg font-medium" onClick={() => setIsOpen(false)}>Contact</Link>
          <Link to="/cart" className="block text-lg font-medium" onClick={() => setIsOpen(false)}>Cart ({totalItems})</Link>
          {user ? (
            <>
              {user.role === 'admin' && <Link to="/admin" className="block text-lg font-medium" onClick={() => setIsOpen(false)}>Admin Dashboard</Link>}
              <button onClick={handleLogout} className="block text-lg font-medium text-red-600">Logout</button>
            </>
          ) : (
            <Link to="/login" className="block text-lg font-medium" onClick={() => setIsOpen(false)}>Login</Link>
          )}
        </div>
      )}
    </nav>
  );
}
