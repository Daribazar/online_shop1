"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBasket } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const products = [
  { id: 1, name: "Product Name", price: 49, image: "/assets/images/featured-products/01.webp", rating: 5 },
  { id: 2, name: "Product Name", price: 49, image: "/assets/images/featured-products/02.webp", rating: 5 },
  { id: 3, name: "Product Name", price: 49, image: "/assets/images/featured-products/03.webp", rating: 5 },
  { id: 4, name: "Product Name", price: 49, image: "/assets/images/featured-products/04.webp", rating: 5 },
  { id: 5, name: "Product Name", price: 49, image: "/assets/images/featured-products/05.webp", rating: 5 },
  { id: 6, name: "Product Name", price: 49, image: "/assets/images/featured-products/06.webp", rating: 5 },
  { id: 7, name: "Product Name", price: 49, image: "/assets/images/featured-products/07.webp", rating: 5 },
  { id: 8, name: "Product Name", price: 49, image: "/assets/images/featured-products/08.webp", rating: 5 },
];

export default function Padding() {
  return (
    <section className="py-8 md:py-12 lg:py-16">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="text-center pb-6 md:pb-8">
          <h3 className="text-2xl md:text-3xl font-bold mb-2">Featured Products</h3>
          <p className="text-sm md:text-base text-gray-600 capitalize">The purpose of lorem ipsum</p>
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
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <div className="bg-white rounded-lg shadow-md overflow-hidden group">
                <div className="relative overflow-hidden">
                  <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-2 bg-white/90 py-2 md:py-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <button className="p-2 hover:bg-gray-100 rounded-full transition">
                      <ShoppingBasket size={18} className="md:w-5 md:h-5" />
                    </button>
                  </div>
                  <Link href="/product-details">
                    <Image
                      src={product.image}
                      width={300}
                      height={300}
                      alt={product.name}
                      className="w-full h-auto object-cover"
                    />
                  </Link>
                </div>

                <div className="p-3 md:p-4">
                  <div className="text-center">
                    <h6 className="font-bold text-sm md:text-base mb-1 md:mb-2">{product.name}</h6>
                    <div className="flex justify-center gap-1 mb-1 md:mb-2 text-yellow-500">
                      {[...Array(product.rating)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-3 h-3 md:w-4 md:h-4 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-base md:text-lg font-bold">${product.price}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
