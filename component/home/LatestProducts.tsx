"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {  ShoppingBasket } from "lucide-react";
import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-client";
import { fetchProducts } from "@/lib/api";

type Product = {
  _id: string;
  title: string;
  price: number;
  imgCover?: string;
  images?: string[];
  ratingsAverage?: number;
  priceAfterDiscount?: number;
};

const tabs = [
  { id: "all", label: "All Products" },
];

const fallbackImages = [
  "/assets/images/new-arrival/01.webp",
  "/assets/images/new-arrival/02.webp",
  "/assets/images/new-arrival/03.webp",
  "/assets/images/new-arrival/04.webp",
  "/assets/images/new-arrival/05.webp",
  "/assets/images/new-arrival/06.webp",
  "/assets/images/new-arrival/07.webp",
  "/assets/images/new-arrival/08.webp",
];

export default function LatestProducts() {
  const [activeTab, setActiveTab] = useState("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      const data = await fetchProducts();
      if (data && data.length > 0) {
        setProducts(data);
      }
      setLoading(false);
    }
    loadProducts();
  }, []);

  const getImageSrc = (imgCover?: string, images?: string[], index: number = 0) => {
    if (imgCover && !imgCover.includes('undefined')) {
      return imgCover;
    }
    if (images && images.length > 0 && !images[0].includes('undefined')) {
      return images[0];
    }
    return fallbackImages[index % fallbackImages.length];
  };

  const displayProducts = products.slice(0, 10);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center pb-8">
          <h3 className="text-3xl font-bold mb-2">Latest Products</h3>
          <p className="text-gray-600 capitalize">The purpose of lorem ipsum</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white rounded-lg shadow-sm overflow-x-auto relative">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-medium whitespace-nowrap transition relative z-10 ${
                  activeTab === tab.id
                    ? "text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                initial={false}
                animate={{
                  color: activeTab === tab.id ? "#ffffff" : "#374151"
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gray-900 rounded-lg -z-10"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        <hr className="mb-8" />

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-8">Loading products...</div>
        ) : displayProducts.length === 0 ? (
          <div className="text-center py-8">No products available</div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            >
              {displayProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                    delay: index * 0.05
                  }}
                  className="bg-white rounded-lg shadow-md overflow-hidden group relative"
                >
                {product.priceAfterDiscount && (
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-3 py-1 rounded z-10">
                    Sale
                  </div>
                )}
                
                <div className="relative overflow-hidden">
                  <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-2 bg-white/90 py-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <button className="p-2 hover:bg-gray-100 rounded-full transition">
                      <ShoppingBasket size={20} />
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

                <div className="p-4">
                  <div className="text-center">
                    <h6 className="font-bold mb-2">{product.title}</h6>
                    <div className="flex justify-center gap-1 mb-2 text-yellow-500">
                      {[...Array(Math.round(product.ratingsAverage || 5))].map((_, i) => (
                        <svg
                          key={i}
                          className="w-4 h-4 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-lg font-bold">
                      {product.priceAfterDiscount ? (
                        <>
                          <span className="line-through text-gray-400 mr-2">${product.price}</span>
                          <span className="text-red-600">${product.priceAfterDiscount}</span>
                        </>
                      ) : (
                        `$${product.price}`
                      )}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}
