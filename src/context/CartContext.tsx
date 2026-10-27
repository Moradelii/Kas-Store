import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Product } from '../types';
import { cartStorage } from '../services/cartStorage';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, selectedSize: string, selectedColor: string, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, newQty: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotalHnl: number;
  shippingHnl: number;
  totalHnl: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => cartStorage.loadCart());
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    cartStorage.saveCart(items);
  }, [items]);

  const addItem = (
    product: Product,
    selectedSize: string,
    selectedColor: string,
    quantity = 1
  ) => {
    const itemId = `${product.id}-${selectedSize}-${selectedColor}`;

    setItems((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          id: itemId,
          productId: product.id,
          product,
          selectedSize,
          selectedColor,
          quantity,
        },
      ];
    });

    // Auto open cart drawer to provide direct feedback
    setIsCartOpen(true);
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeItem(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity: newQty } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
    cartStorage.clearCart();
  };

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotalHnl = items.reduce((acc, item) => acc + item.product.priceHnl * item.quantity, 0);

  // Envíos a todo Honduras: Gratis en compras a partir de L 1,500, de lo contrario L 120 tarifa estándar
  const shippingHnl = items.length === 0 ? 0 : subtotalHnl >= 1500 ? 0 : 120;
  const totalHnl = subtotalHnl + shippingHnl;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotalHnl,
        shippingHnl,
        totalHnl,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        toggleCart: () => setIsCartOpen((prev) => !prev),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
