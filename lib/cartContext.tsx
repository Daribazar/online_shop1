"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

// Сагсан дахь бүтээгдэхүүний төрөл
type CartItem = {
  _id: string;
  title: string;
  price: number;
  imgCover?: string;
  images?: string[];
  quantity: number; // Тоо ширхэг
  priceAfterDiscount?: number;
  selectedSize?: string; // Сонгосон size (S, M, L гэх мэт)
  availableStock?: number; // Боломжит тоо ширхэг
  sizes?: Array<{
    size: string;
    quantity: number;
  }>;
};

// Cart context-ийн төрөл
type CartContextType = {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, selectedSize?: string, quantity?: number) => void;
  removeFromCart: (id: string, selectedSize?: string) => void;
  updateQuantity: (id: string, quantity: number, selectedSize?: string) => void;
  clearCart: () => void;
  isInCart: (id: string, selectedSize?: string) => boolean;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart Provider - бүх компонентод сагс хүртээмжтэй болгоно
export function CartProvider({ children }: { children: ReactNode }) {
  // Hydration error-ийг шийдэх: эхэнд хоосон array-аар эхлүүлж, client-д localStorage-оос уншина
  const [cart, setCart] = useState<CartItem[]>(() => {
    // Server-side rendering үед localStorage байхгүй тул шалгах
    if (typeof window === 'undefined') return [];
    
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  // Сагс өөрчлөгдөх бүрт localStorage-д хадгална
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  // Сагсанд бүтээгдэхүүн нэмэх (size-тай эсвэл үгүй, тоо ширхэгтэй)
  const addToCart = (item: Omit<CartItem, 'quantity'>, selectedSize?: string, quantity: number = 1) => {
    // Available stock тооцоолох
    let availableStock = 0;
    if (selectedSize && item.sizes) {
      const sizeInfo = item.sizes.find(s => s.size === selectedSize);
      availableStock = sizeInfo?.quantity || 0;
    } else {
      availableStock = item.availableStock || 999;
    }

    // Size-тай бүтээгдэхүүн бол ID + Size-ийн хослолоор шалгах
    const cartKey = selectedSize ? `${item._id}-${selectedSize}` : item._id;
    const existingItem = cart.find((i) => {
      const existingKey = i.selectedSize ? `${i._id}-${i.selectedSize}` : i._id;
      return existingKey === cartKey;
    });
    
    if (existingItem) {
      // Нийт тоо ширхэг stock-аас хэтрэхгүй эсэхийг шалгах
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > availableStock) {
        toast.warning(`Уучлаарай! ${selectedSize ? 'Size ' + selectedSize : 'Энэ бүтээгдэхүүн'} ${availableStock} ширхэг л үлдсэн байна.`);
        return;
      }
      
      // Аль хэдийн сагсанд байвал тоо ширхгийг нэмэх
      setCart((prev) => prev.map((i) => {
        const existingKey = i.selectedSize ? `${i._id}-${i.selectedSize}` : i._id;
        return existingKey === cartKey ? { ...i, quantity: newQuantity } : i;
      }));
      toast.success(`${item.title} ${selectedSize ? '(Size: ' + selectedSize + ')' : ''} (${quantity}x) сагсанд нэмэгдлээ!`);
      return;
    }
    
    // Stock шалгах (шинэ бүтээгдэхүүн)
    if (quantity > availableStock) {
      toast.warning(`Уучлаарай! ${selectedSize ? 'Size ' + selectedSize : 'Энэ бүтээгдэхүүн'} ${availableStock} ширхэг л үлдсэн байна.`);
      return;
    }
    
    // Шинэ бүтээгдэхүүн нэмэх
    setCart((prev) => [...prev, { ...item, quantity, selectedSize, availableStock }]);
    toast.success(`${item.title} ${selectedSize ? '(Size: ' + selectedSize + ')' : ''} (${quantity}x) сагсанд нэмэгдлээ!`);
  };

  // Сагснаас бүтээгдэхүүн хасах (size-тай эсвэл үгүй)
  const removeFromCart = (id: string, selectedSize?: string) => {
    const item = cart.find((i) => {
      if (selectedSize && i.selectedSize) {
        return i._id === id && i.selectedSize === selectedSize;
      }
      return i._id === id;
    });
    
    if (item) {
      setCart((prev) => prev.filter((item) => {
        if (selectedSize && item.selectedSize) {
          return !(item._id === id && item.selectedSize === selectedSize);
        }
        return item._id !== id;
      }));
      toast.info(`${item.title} ${selectedSize ? '(Size: ' + selectedSize + ')' : ''} хасагдлаа`);
    }
  };

  // Бүтээгдэхүүний тоо ширхэг өөрчлөх
  const updateQuantity = (id: string, quantity: number, selectedSize?: string) => {
    if (quantity <= 0) {
      removeFromCart(id, selectedSize);
      return;
    }
    
    const item = cart.find((i) => {
      if (selectedSize && i.selectedSize) {
        return i._id === id && i.selectedSize === selectedSize;
      }
      return i._id === id;
    });

    // Stock шалгах
    if (item && item.availableStock && quantity > item.availableStock) {
      toast.warning(`Уучлаарай! ${selectedSize ? 'Size ' + selectedSize : 'Энэ бүтээгдэхүүн'} ${item.availableStock} ширхэг л үлдсэн байна.`);
      return;
    }

    setCart((prev) => prev.map((item) => {
      if (selectedSize && item.selectedSize) {
        return (item._id === id && item.selectedSize === selectedSize) ? { ...item, quantity } : item;
      }
      return item._id === id ? { ...item, quantity } : item;
    }));
  };

  // Сагсыг хоослох
  const clearCart = () => {
    setCart([]);
  };

  // Бүтээгдэхүүн сагсанд байгаа эсэхийг шалгах (size-тай бол хамт шалгах)
  const isInCart = (id: string, selectedSize?: string) => {
    if (selectedSize) {
      return cart.some((item) => item._id === id && item.selectedSize === selectedSize);
    }
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
