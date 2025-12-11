"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cartContext";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import { API_URL } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

type Product = {
  _id: string;
  title: string;
  price: number;
  imgCover?: string;
  images?: string[];
  ratingsAverage?: number;
  priceAfterDiscount?: number;
};

const fallbackImages = [
  "/assets/images/featured-products/01.webp",
  "/assets/images/featured-products/02.webp",
  "/assets/images/featured-products/03.webp",
  "/assets/images/featured-products/04.webp",
  "/assets/images/featured-products/05.webp",
  "/assets/images/featured-products/06.webp",
  "/assets/images/featured-products/07.webp",
  "/assets/images/featured-products/08.webp",
];

export default function Padding() {
  const { addToCart, isInCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeaturedProducts() {
      try {
        const response = await fetch(`${API_URL}/products`);
        const data = await response.json();
        // Filter only featured products
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const featured = data.getAllProducts?.filter((p: any) => p.isFeatured) || [];
        setProducts(featured);
      } catch (error) {
        console.error("Error loading featured products:", error);
      } finally {
        setLoading(false);
      }
    }
    loadFeaturedProducts();
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
  if (loading) {
    return (
      <section className="py-8 md:py-12 lg:py-16" aria-live="polite" aria-busy="true">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="text-center">
            <div className="inline-flex flex-col items-center gap-3">
              <svg className="animate-spin h-12 w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-600 font-medium">Loading featured products...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null; // Don't show section if no featured products
  }

  return (
    <section className="py-8 md:py-12 lg:py-16" aria-label="Онцгой бүтээгдэхүүнүүд">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="text-center pb-6 md:pb-8">
          <h3 className="text-2xl md:text-3xl font-bold mb-2">Featured Products</h3>
          <p className="text-sm md:text-base text-gray-600 capitalize">Онцгой бүтээгдэхүүнүүд</p>
        </div>

        <Swiper
          slidesPerView={1}
          spaceBetween={20}
          grabCursor={true}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          speed={600}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 30,
            },
            1280: {
              slidesPerView: 5,
              spaceBetween: 30,
            },
          }}
          modules={[Pagination, Navigation, Autoplay]}
          className="mySwiper"
        >
          {products.map((product, index) => (
            <SwiperSlide key={product._id}>
              <Link 
                href={`/product-details?id=${product._id}`} 
                className="block"
                aria-label={`${product.title} бүтээгдэхүүний дэлгэрэнгүй`}
              >
                <Card className="overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-0 gap-0">
                  <CardContent className="relative w-full h-80 overflow-hidden p-0">
                    <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-2 bg-white/90 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                      <Button 
                        size="sm"
                        variant={isInCart(product._id) ? "secondary" : "default"}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        aria-label={isInCart(product._id) ? `${product.title} сагсанд байна` : `${product.title}-г сагсанд нэмэх`}
                      >
                        <ShoppingBag className="md:mr-1" />
                        <span className="hidden md:inline">{isInCart(product._id) ? 'Сагсанд' : 'Нэмэх'}</span>
                      </Button>
                    </div>
                    <Image
                      src={getImageSrc(product.imgCover, product.images, index)}
                      fill
                      alt={`${product.title} - Онцгой бүтээгдэхүүн`}
                      className="object-cover pointer-events-none group-hover:scale-105 transition-transform duration-300"
                      draggable={false}
                    />
                  </CardContent>

                  <CardFooter className="flex-col gap-2 p-3 md:p-4">
                    <div className="text-center w-full">
                      <h6 className="font-bold text-sm md:text-base mb-1 md:mb-2">{product.title}</h6>
                      <div className="flex justify-center gap-1 mb-1 md:mb-2 text-yellow-500" role="img" aria-label={`${Math.round(product.ratingsAverage || 5)} оноо 5-аас`}>
                        {[...Array(Math.round(product.ratingsAverage || 5))].map((_, i) => (
                          <svg
                            key={i}
                            className="w-3 h-3 md:w-4 md:h-4 fill-current"
                            viewBox="0 0 20 20"
                            aria-hidden="true"
                          >
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-base md:text-lg font-bold">
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
                  </CardFooter>
                </Card>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
