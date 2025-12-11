"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Сагсан дахь бүтээгдэхүүний төрөл
type CartItem = {
  _id: string;
  title: string;
  price: number;
  imgCover?: string;
  images?: string[];
  quantity: number; // Тоо ширхэг
  priceAfterDiscount?: number;
};

// Cart context-ийн төрөл
type CartContextType = {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (id: string) => boolean;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart Provider - бүх компонентод сагс хүртээмжтэй болгоно
export function CartProvider({ children }: { children: ReactNode }) {
  // localStorage-оос сагсыг уншиж эхлүүлэх
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  // Сагс өөрчлөгдөх бүрт localStorage-д хадгална
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Сагсанд бүтээгдэхүүн нэмэх
  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCart((prev) => {
      const existingItem = prev.find((i) => i._id === item._id);
      if (existingItem) {
        // Аль хэдийн сагсанд байвал тоо ширхгийг нэмэх
        return prev.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      // Шинэ бүтээгдэхүүн нэмэх
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  // Сагснаас бүтээгдэхүүн хасах
  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  // Бүтээгдэхүүний тоо ширхэг өөрчлөх
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, quantity } : item
      )
    );
  };

  // Сагсыг хоослох
  const clearCart = () => {
    setCart([]);
  };

  // Бүтээгдэхүүн сагсанд байгаа эсэхийг шалгах
  const isInCart = (id: string) => {
    return cart.some((item) => item._id === id);
  };

  // Нийт бүтээгдэхүүний тоо
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Нийт үнэ
  const totalPrice = cart.reduce((sum, item) => {
    const price = item.priceAfterDiscount || item.price;
    return sum + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Cart hook - компонентод сагс ашиглах
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
