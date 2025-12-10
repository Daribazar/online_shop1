"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlist } from "@/lib/wishlistContext";
import { fetchProducts, fetchCategories } from "@/lib/api";

// Category төрөл
type Category = {
  _id: string;
  name: string;
};

// Бүтээгдэхүүний төрөл
type Product = {
  _id: string;
  title: string;
  descripton: string;
  price: number;
  priceAfterDiscount?: number;
  imgCover?: string;
  images?: string[];
  category?: string | Category;
};

// Бүтээгдэхүүний жагсаалт хуудас - Шүүлт, эрэмбэлэлт, wishlist
export const Products = () => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category");
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("new");

  useEffect(() => {
    async function loadData() {
      const [productsData, categoriesData] = await Promise.all([
        fetchProducts(),
        fetchCategories()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      
      // Auto-select category from URL
      if (categoryFromUrl) {
        setSelectedCategories([categoryFromUrl]);
      }
      
      setLoading(false);
    }
    loadData();
  }, [categoryFromUrl]);

  // Хямдралын хувийг тооцоолох
  const calculateDiscount = (price: number, priceAfterDiscount?: number) => {
    if (!priceAfterDiscount) return 0;
    return Math.round(((price - priceAfterDiscount) / price) * 100);
  };

  // Зургийн эх сурвалж авах - fallback зураг ашиглана
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

  // Category сонгох/болих
  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Бүтээгдэхүүнүүдийг шүүж, эрэмбэлэх
  const filteredAndSortedProducts = () => {
    let result = [...products];

    // Filter by categories
    if (selectedCategories.length > 0) {
      result = result.filter(p => {
        if (!p.category) return false;
        const categoryId = typeof p.category === 'string' 
          ? p.category 
          : p.category._id;
        return selectedCategories.includes(categoryId);
      });
    }

    // Sort
    switch (sortBy) {
      case "new":
        // Assuming newer products are at the end
        result = result.reverse();
        break;
      case "popularity":
        // Keep original order (or add popularity field later)
        break;
      case "discount":
        result = result.sort((a, b) => {
          const discountA = calculateDiscount(a.price, a.priceAfterDiscount);
          const discountB = calculateDiscount(b.price, b.priceAfterDiscount);
          return discountB - discountA;
        });
        break;
      case "price-high":
        result = result.sort((a, b) => b.price - a.price);
        break;
      case "price-low":
        result = result.sort((a, b) => a.price - b.price);
        break;
      case "rating":
        // Keep original order (or add rating field later)
        break;
    }

    return result;
  };

  const displayProducts = filteredAndSortedProducts();
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
                      <input 
                        type="checkbox" 
                        className="w-4 h-4"
                        checked={selectedCategories.includes(cat._id)}
                        onChange={() => handleCategoryToggle(cat._id)}
                      />
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
                <div className="font-semibold">{displayProducts.length} Items Found</div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Sort By</span>
                  <select 
                    className="border rounded px-3 py-1"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="new">What&apos;s New</option>
                    <option value="popularity">Popularity</option>
                    <option value="discount">Better Discount</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="rating">Customer Rating</option>
                  </select>
                </div>
              </div>

              {/* Products Grid */}
              <div className="p-4">
                {loading ? (
                  <div className="text-center py-8">Loading products...</div>
                ) : displayProducts.length === 0 ? (
                  <div className="text-center py-8">No products found</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {displayProducts.map((product, index) => {
                      const discount = calculateDiscount(product.price, product.priceAfterDiscount);
                      return (
                        <div key={product._id} className="border rounded-lg overflow-hidden group">
                          <div className="relative w-full h-64 overflow-hidden">
                            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-3 bg-white/90 py-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                              <button 
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  if (isInWishlist(product._id)) {
                                    removeFromWishlist(product._id);
                                  } else {
                                    addToWishlist(product);
                                  }
                                }}
                                className="p-2 hover:bg-red-100 rounded-full transition"
                              >
                                <Heart 
                                  size={18} 
                                  className={`transition ${isInWishlist(product._id) ? 'fill-red-500 text-red-500' : 'hover:fill-red-500 hover:text-red-500'}`} 
                                />
                              </button>
                            </div>
                            <Link href={`/product-details?id=${product._id}`}>
                              <Image
                                src={getImageSrc(product.imgCover, product.images, index)}
                                fill
                                alt={product.title}
                                className="object-cover"
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
