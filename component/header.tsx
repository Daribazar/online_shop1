"use client"

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Moon, Search, Heart, ShoppingBasket, User } from 'lucide-react';

const fashionItems = [
  "Casual T-Shirts", "Formal Shirts", "Jackets", "Jeans",
  "Dresses", "Sneakers", "Belts", "Sports Shoes"
];

const electronicsItems = [
  "Mobiles", "Laptops", "Macbook", "Televisions",
  "Lighting", "Smart Watch", "Galaxy Phones", "PC Monitors"
];

const shopMenuItems = [
  { label: "Shop Cart", href: "/cart" },
  { label: "Wishlist", href: "/wishlist" },
  { label: "Product Details", href: "/product-details" },
  { label: "Payment Method", href: "/payment-method" },
  { label: "Billing Details", href: "/billing-details" },
  { label: "Addresses", href: "/address" },
  { label: "Shop Grid", href: "/shop-grid" },
  { label: "Search", href: "/search" }
];

const accountMenuItems = [
  { label: "Dashboard", href: "/account-dashboard" },
  { label: "My Orders", href: "/account-orders" },
  { label: "My Profile", href: "/account-profile" },
  { label: "Edit Profile", href: "/account-edit-profile" },
  { label: "Addresses", href: "/account-saved-address" },
  { label: "divider", href: "" },
  { label: "Login", href: "/authentication-login" },
  { label: "Register", href: "/authentication-register" },
  { label: "Password", href: "/authentication-reset-password" }
];

const blogMenuItems = [
  { label: "Blog Post", href: "/blog-post" },
  { label: "Blog Read", href: "/blog-read" }
];

const mobileMenuItems = [
  { label: "Home", href: "/" },
  { label: "Categories", href: "/categories" },
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Account", href: "/account" },
  { label: "Blog", href: "/blog" }
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [blogDropdownOpen, setBlogDropdownOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);

  return (
    <header className="bg-white text-black shadow-lg">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="hidden xl:block">
            <Image src="/assets/images/logo.webp" width={120} height={40} alt="Logo" />
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden text-white hover:text-gray-300 transition"
          >
            <Menu size={28} />
          </button>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center space-x-8 flex-1 ml-12">
            <Link href="/" className="hover:text-gray-300 transition">
              Home
            </Link>

            {/* Categories Dropdown */}
            <div className="relative group">
              <button
                onMouseEnter={() => setCategoriesDropdownOpen(true)}
                onMouseLeave={() => setCategoriesDropdownOpen(false)}
                className="hover:text-gray-300 transition"
              >
                Categories
              </button>
              {categoriesDropdownOpen && (
                <div
                  onMouseEnter={() => setCategoriesDropdownOpen(true)}
                  onMouseLeave={() => setCategoriesDropdownOpen(false)}
                  className="absolute left-0 top-full mt-2 w-[800px] bg-white text-gray-900 shadow-xl rounded-lg p-6 z-50"
                >
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <h6 className="font-bold text-lg mb-3">Fashion</h6>
                      <ul className="space-y-2">
                        {fashionItems.map((item) => (
                          <li key={item}>
                            <a href="#" className="hover:text-blue-600">{item}</a>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h6 className="font-bold text-lg mb-3">Electronics</h6>
                      <ul className="space-y-2">
                        {electronicsItems.map((item) => (
                          <li key={item}>
                            <a href="#" className="hover:text-blue-600">{item}</a>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <Image
                        src="/assets/images/menu-img.webp"
                        width={250}
                        height={300}
                        className="w-full h-full object-cover rounded-lg"
                        alt="Promo"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Shop Dropdown */}
            <div className="relative group">
              <button
                onMouseEnter={() => setShopDropdownOpen(true)}
                onMouseLeave={() => setShopDropdownOpen(false)}
                className="hover:text-gray-300 transition"
              >
                Shop
              </button>
              {shopDropdownOpen && (
                <div
                  onMouseEnter={() => setShopDropdownOpen(true)}
                  onMouseLeave={() => setShopDropdownOpen(false)}
                  className="absolute left-0 top-full mt-2 w-56 bg-white text-gray-900 shadow-xl rounded-lg py-2 z-50"
                >
                  {shopMenuItems.map((item) => (
                    <Link key={item.label} href={item.href} className="block px-4 py-2 hover:bg-gray-100">
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/about" className="hover:text-gray-300 transition">
              About
            </Link>

            <Link href="/contact" className="hover:text-gray-300 transition">
              Contact
            </Link>

            {/* Account Dropdown */}
            <div className="relative group">
              <button
                onMouseEnter={() => setAccountDropdownOpen(true)}
                onMouseLeave={() => setAccountDropdownOpen(false)}
                className="hover:text-gray-300 transition"
              >
                Account
              </button>
              {accountDropdownOpen && (
                <div
                  onMouseEnter={() => setAccountDropdownOpen(true)}
                  onMouseLeave={() => setAccountDropdownOpen(false)}
                  className="absolute left-0 top-full mt-2 w-56 bg-white text-gray-900 shadow-xl rounded-lg py-2 z-50"
                >
                  {accountMenuItems.map((item) => 
                    item.label === "divider" ? (
                      <hr key="divider" className="my-2" />
                    ) : (
                      <Link key={item.label} href={item.href} className="block px-4 py-2 hover:bg-gray-100">
                        {item.label}
                      </Link>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Blog Dropdown */}
            <div className="relative group">
              <button
                onMouseEnter={() => setBlogDropdownOpen(true)}
                onMouseLeave={() => setBlogDropdownOpen(false)}
                className="hover:text-gray-300 transition"
              >
                Blog
              </button>
              {blogDropdownOpen && (
                <div
                  onMouseEnter={() => setBlogDropdownOpen(true)}
                  onMouseLeave={() => setBlogDropdownOpen(false)}
                  className="absolute left-0 top-full mt-2 w-48 bg-white text-gray-900 shadow-xl rounded-lg py-2 z-50"
                >
                  {blogMenuItems.map((item) => (
                    <Link key={item.label} href={item.href} className="block px-4 py-2 hover:bg-gray-100">
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <button className="hover:text-gray-300 transition">
              <Moon size={22} />
            </button>
            <Link href="/search" className="hover:text-gray-300 transition">
              <Search size={22} />
            </Link>
            <Link href="/wishlist" className="hover:text-gray-300 transition">
              <Heart size={22} />
            </Link>
            <Link href="/cart" className="relative hover:text-gray-300 transition">
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                8
              </span>
              <ShoppingBasket size={22} />
            </Link>
            <Link href="/account" className="hover:text-gray-300 transition">
              <User size={22} />
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden mt-4 bg-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <Image src="/assets/images/logo.webp" width={96} height={32} alt="Logo" />
              <button onClick={() => setMobileMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="space-y-3">
              {mobileMenuItems.map((item) => (
                <Link key={item.label} href={item.href} className="block py-2 hover:text-gray-300">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}