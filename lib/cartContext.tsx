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
  // Hydration error-ийг шийдэх: эхэнд хоосон array-аар эхлүүлж, дараа нь localStorage-оос уншина
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Component mount болоход localStorage-оос уншина
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      setCart(JSON.parse(saved));
    }
    setIsInitialized(true);
  }, []);

  // Сагс өөрчлөгдөх бүрт localStorage-д хадгална
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

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

    setCart((prev) => {
      // Size-тай бүтээгдэхүүн бол ID + Size-ийн хослолоор шалгах
      const cartKey = selectedSize ? `${item._id}-${selectedSize}` : item._id;
      const existingItem = prev.find((i) => {
        const existingKey = i.selectedSize ? `${i._id}-${i.selectedSize}` : i._id;
        return existingKey === cartKey;
      });
      
      if (existingItem) {
        // Нийт тоо ширхэг stock-аас хэтрэхгүй эсэхийг шалгах
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > availableStock) {
          toast.warning(`Уучлаарай! ${selectedSize ? 'Size ' + selectedSize : 'Энэ бүтээгдэхүүн'} ${availableStock} ширхэг л үлдсэн байна.`);
          return prev;
        }
        
        // Аль хэдийн сагсанд байвал тоо ширхгийг нэмэх
        toast.success(`${item.title} ${selectedSize ? '(Size: ' + selectedSize + ')' : ''} (${quantity}x) сагсанд нэмэгдлээ!`);
        return prev.map((i) => {
          const existingKey = i.selectedSize ? `${i._id}-${i.selectedSize}` : i._id;
          return existingKey === cartKey ? { ...i, quantity: newQuantity } : i;
        });
      }
      
      // Stock шалгах (шинэ бүтээгдэхүүн)
      if (quantity > availableStock) {
        toast.warning(`Уучлаарай! ${selectedSize ? 'Size ' + selectedSize : 'Энэ бүтээгдэхүүн'} ${availableStock} ширхэг л үлдсэн байна.`);
        return prev;
      }
      
      // Шинэ бүтээгдэхүүн нэмэх
      toast.success(`${item.title} ${selectedSize ? '(Size: ' + selectedSize + ')' : ''} (${quantity}x) сагсанд нэмэгдлээ!`);
      return [...prev, { ...item, quantity, selectedSize, availableStock }];
    });
  };

  // Сагснаас бүтээгдэхүүн хасах (size-тай эсвэл үгүй)
  const removeFromCart = (id: string, selectedSize?: string) => {
    setCart((prev) => {
      const item = prev.find((i) => {
        if (selectedSize && i.selectedSize) {
          return i._id === id && i.selectedSize === selectedSize;
        }
        return i._id === id;
      });
      
      if (item) {
        toast.info(`${item.title} ${selectedSize ? '(Size: ' + selectedSize + ')' : ''} хасагдлаа`);
      }
      
      return prev.filter((item) => {
        if (selectedSize && item.selectedSize) {
          return !(item._id === id && item.selectedSize === selectedSize);
        }
        return item._id !== id;
      });
    });
  };

  // Бүтээгдэхүүний тоо ширхэг өөрчлөх
  const updateQuantity = (id: string, quantity: number, selectedSize?: string) => {
    if (quantity <= 0) {
      removeFromCart(id, selectedSize);
      toast.info('Бүтээгдэхүүн сагснаас хасагдлаа');
      return;
    }
    
    setCart((prev) => {
      const item = prev.find((i) => {
        if (selectedSize && i.selectedSize) {
          return i._id === id && i.selectedSize === selectedSize;
        }
        return i._id === id;
      });

      // Stock шалгах
      if (item && item.availableStock && quantity > item.availableStock) {
        toast.warning(`Уучлаарай! ${selectedSize ? 'Size ' + selectedSize : 'Энэ бүтээгдэхүүн'} ${item.availableStock} ширхэг л үлдсэн байна.`);
        return prev;
      }

      return prev.map((item) => {
        if (selectedSize && item.selectedSize) {
          return (item._id === id && item.selectedSize === selectedSize) ? { ...item, quantity } : item;
        }
        return item._id === id ? { ...item, quantity } : item;
      });
    });
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
