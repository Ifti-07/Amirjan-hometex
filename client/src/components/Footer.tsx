import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="text-2xl font-black tracking-tighter uppercase italic">
              CASH'N<span className="text-gray-400 not-italic font-light">STYLE</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Premium fashion store offering a wide range of stylish apparel. Quality and style curated for your lifestyle.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition"><Facebook size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition"><Instagram size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition"><Twitter size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">Quick Links</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link to="/products" className="hover:text-gray-400 transition">Shop All</Link></li>
              <li><Link to="/products?category=shirts" className="hover:text-gray-400 transition">Shirts</Link></li>
              <li><Link to="/products?category=pants" className="hover:text-gray-400 transition">Pants</Link></li>
              <li><Link to="/contact" className="hover:text-gray-400 transition">Contact Us</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">Support</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link to="/account" className="hover:text-gray-400 transition">My Account</Link></li>
              <li><Link to="/cart" className="hover:text-gray-400 transition">Shopping Cart</Link></li>
              <li><a href="#" className="hover:text-gray-400 transition">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-gray-400 transition">Returns & Exchanges</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">Contact Info</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-gray-400 flex-shrink-0" />
                <span className="text-gray-400">123 Fashion Street, Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-gray-400 flex-shrink-0" />
                <span className="text-gray-400">+880 1234 567890</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-gray-400 flex-shrink-0" />
                <span className="text-gray-400">support@cashnstyle.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
            © 2026 CASH'N STYLE. All rights reserved.
          </p>
          <div className="flex space-x-6 text-[10px] font-bold uppercase tracking-widest text-gray-500">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
