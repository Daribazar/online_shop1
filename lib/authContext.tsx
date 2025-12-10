"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Хэрэглэгчийн мэдээлэл
type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  addresses?: {
    city: string;
    street: string;
    phone: string;
  }[];
};

// Auth Context төрөл
type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  updateUser: (userData: User) => void;
  continueAsGuest: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider - бүх компонентод хэрэглэгчийн мэдээлэл хүртээмжтэй болгоно
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem("token");
  });

  const [isGuest, setIsGuest] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem("isGuest") === "true";
  });

  // User өөрчлөгдөх бүрт localStorage-д хадгална
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    if (isGuest) {
      localStorage.setItem("isGuest", "true");
    } else {
      localStorage.removeItem("isGuest");
    }
  }, [isGuest]);

  // Нэвтрэх
  const login = (newToken: string, userData: User) => {
    setToken(newToken);
    setUser(userData);
    setIsGuest(false);
  };

  // Гарах
  const logout = () => {
    setToken(null);
    setUser(null);
    setIsGuest(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isGuest");
  };

  // Зочноор үргэлжлүүлэх
  const continueAsGuest = () => {
    setIsGuest(true);
    setUser({
      id: "guest",
      name: "Guest User",
      email: "",
      role: "guest",
    });
  };

  // Хэрэглэгчийн мэдээлэл шинэчлэх
  const updateUser = (userData: User) => {
    setUser(userData);
  };

  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, isGuest, login, logout, updateUser, continueAsGuest }}>
      {children}
    </AuthContext.Provider>
  );
}

// Auth hook - компонентод auth ашиглах
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

