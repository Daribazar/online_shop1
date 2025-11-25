"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlist } from "@/lib/wishlistContext";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
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
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeaturedProducts() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
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
      <section className="py-8 md:py-12 lg:py-16">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="text-center">Loading featured products...</div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null; // Don't show section if no featured products
  }

  return (
    <section className="py-8 md:py-12 lg:py-16">
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
              <Link href={`/product-details?id=${product._id}`} className="block">
                <div className="bg-white rounded-lg shadow-md overflow-hidden group">
                  <div className="relative w-full h-80 overflow-hidden">
                    <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-2 bg-white/90 py-2 md:py-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
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
                          className={`md:w-5 md:h-5 transition ${isInWishlist(product._id) ? 'fill-red-500 text-red-500' : 'hover:fill-red-500 hover:text-red-500'}`} 
                        />
                      </button>
                    </div>
                    <Image
                      src={getImageSrc(product.imgCover, product.images, index)}
                      fill
                      alt={product.title}
                      className="object-cover pointer-events-none"
                      draggable={false}
                    />
                  </div>

                  <div className="p-3 md:p-4">
                    <div className="text-center">
                      <h6 className="font-bold text-sm md:text-base mb-1 md:mb-2">{product.title}</h6>
                      <div className="flex justify-center gap-1 mb-1 md:mb-2 text-yellow-500">
                        {[...Array(Math.round(product.ratingsAverage || 5))].map((_, i) => (
                          <svg
                            key={i}
                            className="w-3 h-3 md:w-4 md:h-4 fill-current"
                            viewBox="0 0 20 20"
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
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
