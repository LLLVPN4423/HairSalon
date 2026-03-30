import React, { createContext, useContext, useState, ReactNode } from 'react';

export type CartProduct = {
  type: 'product';
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

export type CartService = {
  type: 'service';
  id: string;
  name: string;
  price: number;
  image: string;
  barberId: string;
  barberName: string;
  date: string;
  time: string;
};

export type CartItem = CartProduct | CartService;

type CartContextType = {
  items: CartItem[];
  addProduct: (product: Omit<CartProduct, 'type'>) => void;
  addService: (service: Omit<CartService, 'type'>) => void;
  removeItem: (id: string) => void;
  updateProductQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartCount: () => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addProduct = (product: Omit<CartProduct, 'type'>) => {
    setItems(prev => {
      const existing = prev.find(item => item.type === 'product' && item.id === product.id);
      if (existing && existing.type === 'product') {
        return prev.map(item =>
          item.type === 'product' && item.id === product.id
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        );
      }
      return [...prev, { ...product, type: 'product' as const }];
    });
  };

  const addService = (service: Omit<CartService, 'type'>) => {
    setItems(prev => [...prev, { ...service, type: 'service' as const }]);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const updateProductQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.type === 'product' && item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getCartCount = () => {
    return items.reduce((count, item) => {
      if (item.type === 'product') {
        return count + item.quantity;
      }
      return count + 1;
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addProduct,
        addService,
        removeItem,
        updateProductQuantity,
        clearCart,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
