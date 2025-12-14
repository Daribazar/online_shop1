"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Search, ShoppingBag, User } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import CartSidebar from './cart/CartSidebar';
import SearchSidebar from './search/SearchSidebar';
import ProfileSidebar from './profile/ProfileSidebar';
import { useScrollDirection } from '@/lib/useScrollDirection';
import { useAuth } from '@/lib/authContext';
import { useCart } from '@/lib/cartContext';

const mobileMenuItems = [
  { label: "Нүүр", href: "/" },
  { label: "Бүтээгдэхүүн", href: "/products" },
  { label: "Бидний тухай", href: "/about" },
  { label: "Холбоо барих", href: "/contact" }
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const scrollDirection = useScrollDirection();
  const { isAuthenticated, isGuest } = useAuth();
  const { totalItems } = useCart();

  // Prevent hydration mismatch by only showing auth-dependent UI after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header 
      className={`bg-white text-black shadow-lg fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
        scrollDirection === 'down' ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="hidden xl:block">
            <Image src="/assets/images/logo.webp" width={120} height={40} alt="Logo" />
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden text-black hover:text-gray-600 transition z-50"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          {/* Mobile Logo */}
          <Link href="/" className="xl:hidden absolute left-1/2 transform -translate-x-1/2">
            <Image src="/assets/images/logo.webp" width={100} height={33} alt="Logo" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center space-x-8 flex-1 ml-12">
            <Link href="/" className="hover:text-gray-300 transition">
              Нүүр
            </Link>

            <Link href="/products" className="hover:text-gray-300 transition">
              Бүтээгдэхүүн
            </Link>

            <Link href="/about" className="hover:text-gray-300 transition">
              Бидний тухай
            </Link>

            <Link href="/contact" className="hover:text-gray-300 transition">
              Холбоо барих
            </Link>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setSearchOpen(true)}
              className="hover:text-gray-300 transition"
            >
              <Search size={22} />
            </button>
            <button 
              onClick={() => setCartOpen(true)}
              className="hover:text-blue-500 transition relative"
              title="Сагс"
              suppressHydrationWarning
            >
              <ShoppingBag size={22} />
              {mounted && totalItems > 0 && (
                <span 
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                  suppressHydrationWarning
                >
                  {totalItems}
                </span>
              )}
            </button>
            <button 
              onClick={() => setProfileOpen(true)}
              className={`hover:text-blue-500 transition ${
                mounted ? (
                  isAuthenticated ? 'text-blue-600' : 
                  isGuest ? 'text-yellow-500' : ''
                ) : ''
              }`}
              title={
                mounted ? (
                  isAuthenticated ? 'Профайл' : 
                  isGuest ? 'Зочны профайл' : 
                  'Нэвтрэх / Бүртгүүлэх'
                ) : 'Профайл'
              }
            >
              <User size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop with blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 xl:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute top-full left-4 mt-2 w-64 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-100 z-50 xl:hidden overflow-hidden"
            >
              <div className="py-2">
                {mobileMenuItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                  >
                    <Link 
                      href={item.href} 
                      className="block py-3 px-4 hover:bg-gray-100/80 transition text-black font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      <SearchSidebar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <ProfileSidebar isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
    </header>
  );
}
