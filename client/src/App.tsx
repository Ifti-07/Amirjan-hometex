import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './store/AuthContext';
import { CartProvider } from './store/CartContext';
import { Toaster } from 'sonner';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Features (Pages)
import Home from './features/Home';
import ProductList from './features/ProductList';
import ProductDetails from './features/ProductDetails';
import Cart from './features/Cart';
import Contact from './features/Contact';
import Login from './features/Login';
import Checkout from './features/Checkout';
import Account from './features/Account';
import AdminDashboard from './features/AdminDashboard';

function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" />;
  
  return <>{children}</>;
}

function AppContent() {
  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-black selection:text-white">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route 
            path="/account/*" 
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            } 
          />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Toaster position="top-center" duration={3000} richColors />
          <AppContent />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
