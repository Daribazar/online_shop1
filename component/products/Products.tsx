"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cartContext";
import { fetchProducts, fetchCategories } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  sizes?: Array<{
    size: string;
    quantity: number;
  }>;
};

// Бүтээгдэхүүний жагсаалт хуудас - Шүүлт, эрэмбэлэлт, сагс
export const Products = () => {
  const { addToCart, isInCart } = useCart();
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category");
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("new");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(40); // Default: 40 for desktop

  // Screen size-г шалгаад items per page тохируулах
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(20); // Mobile: 20 items
      } else {
        setItemsPerPage(40); // Desktop: 40 items
      }
    };

    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  useEffect(() => {
    // Хуудас дээш scroll хийх
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
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

  // Category эсвэл sort өөрчлөгдөхөд хуудсыг 1 болгох
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategories, sortBy]);

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

  const allFilteredProducts = filteredAndSortedProducts();
  
  // Pagination тооцоолох
  const totalPages = Math.ceil(allFilteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayProducts = allFilteredProducts.slice(startIndex, endIndex);

  // Pagination товчлуур
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Pagination товчнууд үүсгэх
  const getPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    
    if (endPage - startPage < maxButtons - 1) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(i);
    }
    
    return buttons;
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
                <div className="font-semibold">
                  {allFilteredProducts.length} Items Found
                  {totalPages > 1 && (
                    <span className="text-sm text-gray-600 ml-2">
                      (Page {currentPage} of {totalPages})
                    </span>
                  )}
                </div>
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
                ) : allFilteredProducts.length === 0 ? (
                  <div className="text-center py-8">No products found</div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {displayProducts.map((product, index) => {
                        const discount = calculateDiscount(product.price, product.priceAfterDiscount);
                        const hasDiscount = product.priceAfterDiscount && product.priceAfterDiscount < product.price;
                        return (
                          <Link key={product._id} href={`/product-details?id=${product._id}`}>
                            <Card className="overflow-hidden group p-0 gap-0 cursor-pointer hover:shadow-lg transition-shadow">
                              <CardContent className="relative w-full h-64 overflow-hidden p-0">
                                <Image
                                  src={getImageSrc(product.imgCover, product.images, index)}
                                  fill
                                  alt={product.title}
                                  className="object-cover"
                                />
                              </CardContent>
                              <CardFooter className="flex flex-col items-start gap-2 p-3">
                                <h5 className="font-bold text-sm line-clamp-1">{product.title}</h5>
                                <p className="text-xs text-gray-600 line-clamp-2">{product.descripton}</p>
                                <div className="flex items-center gap-2 flex-wrap">
                                  {hasDiscount ? (
                                    <>
                                      <span className="font-bold text-base">${product.priceAfterDiscount}</span>
                                      <span className="text-gray-400 line-through text-sm">${product.price}</span>
                                      <Badge variant="destructive" className="text-xs">
                                        {discount}% OFF
                                      </Badge>
                                    </>
                                  ) : (
                                    <span className="font-bold text-base">${product.price}</span>
                                  )}
                                </div>
                              </CardFooter>
                            </Card>
                          </Link>
                        );
                      })}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="mt-8 flex justify-center items-center gap-2">
                        {/* Previous Button */}
                        <Button
                          variant="outline"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="px-4"
                        >
                          Previous
                        </Button>

                        {/* First Page */}
                        {currentPage > 3 && (
                          <>
                            <Button
                              variant={currentPage === 1 ? "default" : "outline"}
                              onClick={() => handlePageChange(1)}
                              className="w-10 h-10 p-0"
                            >
                              1
                            </Button>
                            {currentPage > 4 && <span className="px-2">...</span>}
                          </>
                        )}

                        {/* Page Numbers */}
                        {getPaginationButtons().map((page) => (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            onClick={() => handlePageChange(page)}
                            className="w-10 h-10 p-0"
                          >
                            {page}
                          </Button>
                        ))}

                        {/* Last Page */}
                        {currentPage < totalPages - 2 && (
                          <>
                            {currentPage < totalPages - 3 && <span className="px-2">...</span>}
                            <Button
                              variant={currentPage === totalPages ? "default" : "outline"}
                              onClick={() => handlePageChange(totalPages)}
                              className="w-10 h-10 p-0"
                            >
                              {totalPages}
                            </Button>
                          </>
                        )}

                        {/* Next Button */}
                        <Button
                          variant="outline"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="px-4"
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
