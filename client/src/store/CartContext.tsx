import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  _id: string;
  uniqueId: string;
  name: string;
  price: number;
  images: string[];
  colorName: string;
  sizeName: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any, color: any, size: any) => void;
  removeFromCart: (uniqueId: string) => void;
  updateQuantity: (uniqueId: string, quantity: number) => void;
  clearCart: () => void;
  totalPrice: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: any, color: any, size: any) => {
    const uniqueId = `${product._id}-${color._id}-${size.size._id}`;
    
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.uniqueId === uniqueId);
      
      if (existingItem) {
        return prevCart.map(item => 
          item.uniqueId === uniqueId 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }

      const newItem: CartItem = {
        _id: product._id,
        uniqueId,
        name: product.name,
        price: product.price,
        images: product.images,
        colorName: color.name,
        sizeName: size.size.name,
        quantity: 1
      };

      return [...prevCart, newItem];
    });
  };

  const removeFromCart = (uniqueId: string) => {
    setCart(prevCart => prevCart.filter(item => item.uniqueId !== uniqueId));
  };

  const updateQuantity = (uniqueId: string, quantity: number) => {
    if (quantity < 1) return;
    setCart(prevCart => 
      prevCart.map(item => 
        item.uniqueId === uniqueId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      totalPrice, 
      totalItems 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
