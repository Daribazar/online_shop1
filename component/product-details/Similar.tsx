"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { API_URL } from "@/lib/api";

type Product = {
  _id: string;
  title: string;
  description: string;
  price: number;
  priceAfterDiscount?: number;
  imgCover?: string;
  category?: { _id: string; name: string } | string;
};

type SimilarProps = {
  categoryId?: string;
  currentProductId?: string;
};

// Ижил төстэй бүтээгдэхүүнүүд харуулах компонент
export default function Similar({ categoryId, currentProductId }: SimilarProps) {
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSimilarProducts() {
      if (!categoryId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/products?limit=1000`);
        
        if (!response.ok) throw new Error('Failed to fetch products');
        
        const data = await response.json();
        const allProducts = data.getAllProducts || [];
        
        // Ижил ангилалтай бүтээгдэхүүнүүдийг шүүх (одоогийн бүтээгдэхүүнээс бусад)
        const filtered = allProducts.filter((product: Product) => {
          const productCategoryId = typeof product.category === 'string' 
            ? product.category 
            : product.category?._id;
          
          return productCategoryId === categoryId && product._id !== currentProductId;
        });
        
        // Random 10 бүтээгдэхүүн сонгох
        const shuffled = filtered.sort(() => 0.5 - Math.random());
        setSimilarProducts(shuffled.slice(0, 10));
      } catch (error) {
        console.error("Ижил төстэй бүтээгдэхүүн ачаалахад алдаа гарлаа:", error);
      } finally {
        setLoading(false);
      }
    }

    loadSimilarProducts();
  }, [categoryId, currentProductId]);

  const calculateDiscount = (price: number, priceAfterDiscount?: number) => {
    if (!priceAfterDiscount) return 0;
    return Math.round(((price - priceAfterDiscount) / price) * 100);
  };

  if (loading) {
    return (
      <section className="py-16" aria-live="polite" aria-busy="true">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex flex-col items-center gap-3">
              <svg className="animate-spin h-12 w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-600 font-medium">Ижил төстэй бүтээгдэхүүн ачааллаж байна...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (similarProducts.length === 0) {
    return null;
  }
  return (
    <section className="py-16" aria-label="Ижил төстэй бүтээгдэхүүнүүд">
      <div className="container mx-auto px-4">
        {/* Хэсгийн гарчиг */}
        <div className="flex items-center gap-4 pb-8">
          <div className="flex-1 h-px bg-gray-300" aria-hidden="true" />
          <h3 className="text-3xl font-bold">Ижил төстэй бүтээгдэхүүн</h3>
          <div className="flex-1 h-px bg-gray-300" aria-hidden="true" />
        </div>

        {/* Бүтээгдэхүүний grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {similarProducts.map((product) => {
            const discount = calculateDiscount(product.price, product.priceAfterDiscount);
            const displayPrice = product.priceAfterDiscount || product.price;
            
            return (
              <Link 
                key={product._id} 
                href={`/product-details?id=${product._id}`}
                aria-label={`${product.title} бүтээгдэхүүний дэлгэрэнгүй үзэх`}
                className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg block"
              >
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  {product.imgCover && !product.imgCover.includes('undefined') && (
                    <div className="relative w-full h-80 overflow-hidden">
                      <Image
                        src={product.imgCover}
                        fill
                        alt={`${product.title} - Ижил төстэй бүтээгдэхүүн`}
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-4 border-t">
                    <h5 className="font-bold mb-1 truncate">{product.title}</h5>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                    <div className="flex items-center gap-2 flex-wrap" aria-label={product.priceAfterDiscount ? `Хөнгөлөлттэй үнэ ${displayPrice} доллар, ${discount}% хөнгөлөлт` : `Үнэ ${displayPrice} доллар`}>
                      <span className="text-lg font-bold">${displayPrice}</span>
                      {product.priceAfterDiscount && (
                        <>
                          <span className="text-sm text-gray-400 line-through" aria-hidden="true">${product.price}</span>
                          <span className="text-sm font-bold text-red-600" aria-hidden="true">({discount}% off)</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
