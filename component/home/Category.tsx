"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const categories = [
  { id: 1, name: "Kurtas", products: 856, image: "/assets/images/categories/01.webp" },
  { id: 2, name: "Heels", products: 169, image: "/assets/images/categories/02.webp" },
  { id: 3, name: "Lehenga", products: 589, image: "/assets/images/categories/03.webp" },
  { id: 4, name: "Plazzos", products: 278, image: "/assets/images/categories/04.webp" },
  { id: 5, name: "Makeup", products: 985, image: "/assets/images/categories/05.webp" },
  { id: 6, name: "Shoes", products: 489, image: "/assets/images/categories/06.webp" },
];

export default function Category() {
  return (
    <section className="py-8 md:py-12 lg:py-16 bg-gray-100">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="text-center pb-6 md:pb-8">
          <h3 className="text-2xl md:text-3xl font-bold mb-2">Top Categories</h3>
          <p className="text-sm md:text-base text-gray-600 capitalize">Select your favorite categories and purchase</p>
        </div>

        <Swiper
          slidesPerView={1}
          spaceBetween={20}
          loop={true}
          grabCursor={true}
          pagination={{
            clickable: true,
          }}
          navigation={true}
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
              slidesPerView: 6,
              spaceBetween: 30,
            },
          }}
          modules={[Pagination, Navigation]}
          className="categorySwiper"
        >
          {categories.map((category) => (
            <SwiperSlide key={category.id}>
              <Link href="/shop-grid">
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="overflow-hidden">
                    <Image
                      src={category.image}
                      width={300}
                      height={300}
                      alt={category.name}
                      className="w-full h-auto object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="text-center p-3 md:p-4">
                    <h5 className="font-bold text-base md:text-lg mb-1">{category.name}</h5>
                    <h6 className="text-sm md:text-base text-gray-600 font-semibold">{category.products} Products</h6>
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
