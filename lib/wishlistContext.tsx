"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Wishlist дэх бүтээгдэхүүний төрөл
type WishlistItem = {
  _id: string;
  title: string;
  price: number;
  imgCover?: string;
  images?: string[];
};

// Wishlist context-ийн төрөл
type WishlistContextType = {
  wishlist: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

// Wishlist Provider - бүх компонентод wishlist хүртээмжтэй болгоно
export function WishlistProvider({ children }: { children: ReactNode }) {
  // localStorage-оос wishlist-ийг уншиж эхлүүлэх
  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  // Wishlist өөрчлөгдөх бүрт localStorage-д хадгална
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Wishlist-д бүтээгдэхүүн нэмэх
  const addToWishlist = (item: WishlistItem) => {
    setWishlist((prev) => {
      if (prev.find((i) => i._id === item._id)) {
        return prev; // Аль хэдийн wishlist-д байна
      }
      return [...prev, item];
    });
  };

  // Wishlist-ээс бүтээгдэхүүн хасах
  const removeFromWishlist = (id: string) => {
    setWishlist((prev) => prev.filter((item) => item._id !== id));
  };

  // Бүтээгдэхүүн wishlist-д байгаа эсэхийг шалгах
  const isInWishlist = (id: string) => {
    return wishlist.some((item) => item._id === id);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

// Wishlist hook - компонентод wishlist ашиглах
export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
}
