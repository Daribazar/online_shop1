"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

type Product = {
  _id: string;
  title: string;
  descripton: string;
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
        const API_URL = process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL !== 'undefined'
          ? process.env.NEXT_PUBLIC_API_URL 
          : 'http://localhost:5001/api/v1';
        const response = await fetch(`${API_URL}/products`);
        
        if (!response.ok) throw new Error('Failed to fetch products');
        
        const data = await response.json();
        const allProducts = data.getAllProducts || [];
        
        // Ижил category-тэй бүтээгдэхүүнүүдийг шүүх (одоогийн бүтээгдэхүүнээс бусад)
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
        console.error("Error loading similar products:", error);
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
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading similar products...</div>
        </div>
      </section>
    );
  }

  if (similarProducts.length === 0) {
    return null;
  }
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Хэсгийн гарчиг */}
        <div className="flex items-center gap-4 pb-8">
          <div className="flex-1 h-px bg-gray-300" />
          <h3 className="text-3xl font-bold">Similar Products</h3>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* Бүтээгдэхүүний grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {similarProducts.map((product) => {
            const discount = calculateDiscount(product.price, product.priceAfterDiscount);
            const displayPrice = product.priceAfterDiscount || product.price;
            
            return (
              <Link key={product._id} href={`/product-details?id=${product._id}`}>
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                  {product.imgCover && !product.imgCover.includes('undefined') && (
                    <div className="relative w-full h-80 overflow-hidden">
                      <Image
                        src={product.imgCover}
                        fill
                        alt={product.title}
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4 border-t">
                    <h5 className="font-bold mb-1 truncate">{product.title}</h5>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.descripton}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-lg font-bold">${displayPrice}</span>
                      {product.priceAfterDiscount && (
                        <>
                          <span className="text-sm text-gray-400 line-through">${product.price}</span>
                          <span className="text-sm font-bold text-red-600">({discount}% off)</span>
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
