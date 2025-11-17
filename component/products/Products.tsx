"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBasket } from "lucide-react";
import { fetchProducts, fetchCategories } from "@/lib/api";

type Product = {
  _id: string;
  title: string;
  descripton: string;
  price: number;
  priceAfterDiscount?: number;
  imgCover?: string;
  images?: string[];
};

type Category = {
  _id: string;
  name: string;
};

export const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [productsData, categoriesData] = await Promise.all([
        fetchProducts(),
        fetchCategories()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      setLoading(false);
    }
    loadData();
  }, []);

  const calculateDiscount = (price: number, priceAfterDiscount?: number) => {
    if (!priceAfterDiscount) return 0;
    return Math.round(((price - priceAfterDiscount) / price) * 100);
  };

  const getImageSrc = (imgCover?: string, images?: string[], index: number = 0) => {
    if (imgCover && !imgCover.includes('undefined')) {
      return imgCover;
    }
    if (images && images.length > 0 && !images[0].includes('undefined')) {
      return images[0];
    }
    const fallbackImages = [
      "/assets/images/featured-products/01.webp",
      "/assets/images/featured-products/02.webp",
      "/assets/images/featured-products/03.webp",
      "/assets/images/featured-products/04.webp",
      "/assets/images/new-arrival/01.webp",
      "/assets/images/new-arrival/02.webp",
    ];
    return fallbackImages[index % fallbackImages.length];
  };
  return (
    <section className="py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter Sidebar */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h5 className="text-xl font-bold mb-4">Filters</h5>
              
              {/* Categories */}
              <div className="mb-6">
                <h6 className="bg-gray-100 p-2 font-bold mb-2">Categories</h6>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {categories.map((cat) => (
                    <label key={cat._id} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4" />
                      <span className="text-sm">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="w-full lg:w-3/4">
            <div className="bg-white rounded-lg shadow-md">
              {/* Header */}
              <div className="bg-gray-100 p-4 flex flex-wrap items-center justify-between gap-4">
                <div className="font-semibold">{products.length} Items Found</div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Sort By</span>
                  <select className="border rounded px-3 py-1">
                    <option>What&apos;s New</option>
                    <option>Popularity</option>
                    <option>Better Discount</option>
                    <option>Price: High to Low</option>
                    <option>Price: Low to High</option>
                    <option>Customer Rating</option>
                  </select>
                </div>
              </div>

              {/* Products Grid */}
              <div className="p-4">
                {loading ? (
                  <div className="text-center py-8">Loading products...</div>
                ) : products.length === 0 ? (
                  <div className="text-center py-8">No products available</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {products.map((product, index) => {
                      const discount = calculateDiscount(product.price, product.priceAfterDiscount);
                      return (
                        <div key={product._id} className="border rounded-lg overflow-hidden group">
                          <div className="relative overflow-hidden">
                            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-3 bg-white/90 py-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                              <button className="p-2 hover:bg-gray-100 rounded-full transition">
                                <ShoppingBasket size={18} />
                              </button>
                            </div>
                            <Link href={`/product-details?id=${product._id}`}>
                              <Image
                                src={getImageSrc(product.imgCover, product.images, index)}
                                width={300}
                                height={300}
                                alt={product.title}
                                className="w-full h-auto object-cover"
                              />
                            </Link>
                          </div>
                          <div className="p-3 border-t">
                            <h5 className="font-bold text-sm mb-1">{product.title}</h5>
                            <p className="text-xs text-gray-600 mb-2">{product.descripton}</p>
                            <div className="flex items-center gap-2 flex-wrap">
                              {product.priceAfterDiscount ? (
                                <>
                                  <span className="font-bold">${product.priceAfterDiscount}</span>
                                  <span className="text-gray-400 line-through text-sm">${product.price}</span>
                                  <span className="text-red-600 font-bold text-sm">({discount}% off)</span>
                                </>
                              ) : (
                                <span className="font-bold">${product.price}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
