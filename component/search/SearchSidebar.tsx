"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Search } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { fetchProducts } from "@/lib/api";

type Product = {
  _id: string;
  title: string;
  price: number;
  imgCover?: string;
  images?: string[];
  priceAfterDiscount?: number;
};

interface SearchSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchSidebar({ isOpen, onClose }: SearchSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const loadProducts = async () => {
      setLoading(true);
      const products = await fetchProducts();
      setAllProducts(products || []);
      setLoading(false);
    };

    loadProducts();
  }, [isOpen]);

  const getImageSrc = (imgCover?: string, images?: string[]) => {
    if (imgCover && !imgCover.includes('undefined')) {
      return imgCover;
    }
    if (images && images.length > 0 && !images[0].includes('undefined')) {
      return images[0];
    }
    return "/assets/images/new-arrival/01.webp";
  };

  const filteredProducts = allProducts.filter(product =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayProducts = searchQuery ? filteredProducts.slice(0, 10) : [];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Search Products</SheetTitle>
        </SheetHeader>

        {/* Search Input */}
        <div className="mt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Бүтээгдэхүүн хайх..."
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Search Results */}
        <div className="mt-6 overflow-y-auto h-[calc(100vh-220px)] pb-4">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : !searchQuery ? (
            <div className="text-center py-8 text-gray-500">
              Бүтээгдэхүүн хайхын тулд бичнэ үү
            </div>
          ) : displayProducts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Илэрц олдсонгүй
            </div>
          ) : (
            <div className="space-y-3">
              {displayProducts.map((product) => (
                <Link
                  key={product._id}
                  href={`/product-details?id=${product._id}`}
                  onClick={onClose}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition"
                >
                  <Image
                    src={getImageSrc(product.imgCover, product.images)}
                    width={60}
                    height={60}
                    alt={product.title}
                    className="rounded object-cover"
                  />
                  <div className="flex-1">
                    <h6 className="font-medium text-sm mb-1">{product.title}</h6>
                    <div className="flex items-center gap-2">
                      {product.priceAfterDiscount ? (
                        <>
                          <span className="font-bold text-red-600">${product.priceAfterDiscount}</span>
                          <span className="text-gray-400 line-through text-sm">${product.price}</span>
                        </>
                      ) : (
                        <span className="font-bold">${product.price}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {searchQuery && filteredProducts.length > 10 && (
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t bg-background">
            <Link
              href={`/products?search=${searchQuery}`}
              onClick={onClose}
              className="block w-full bg-primary text-primary-foreground text-center px-6 py-3 rounded-md hover:bg-primary/90 transition font-semibold"
            >
              Бүх илэрцийг харах ({filteredProducts.length})
            </Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
