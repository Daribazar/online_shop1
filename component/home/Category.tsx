"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { fetchCategories } from "@/lib/api";

// Category-ийн төрөл
type Category = {
  _id: string;
  name: string;
  Image?: string;
  slug?: string;
};

// Fallback категориуд (backend ажиллахгүй үед)
const fallbackCategories = [
  { _id: "1", name: "Kurtas", Image: "/assets/images/categories/01.webp" },
  { _id: "2", name: "Heels", Image: "/assets/images/categories/02.webp" },
  { _id: "3", name: "Lehenga", Image: "/assets/images/categories/03.webp" },
  { _id: "4", name: "Plazzos", Image: "/assets/images/categories/04.webp" },
  { _id: "5", name: "Makeup", Image: "/assets/images/categories/05.webp" },
  { _id: "6", name: "Shoes", Image: "/assets/images/categories/06.webp" },
];

// Категори харуулах компонент - Swiper slider ашиглана
export default function Category() {
  const [categories, setCategories] = useState<Category[]>(fallbackCategories);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      const data = await fetchCategories();
      if (data && data.length > 0) {
        setCategories(data);
      }
      setLoading(false);
    }
    loadCategories();
  }, []);

  // Зургийн эх сурвалж авах - fallback зураг ашиглана
  const getImageSrc = (image?: string, index: number = 0) => {
    if (!image || image.includes('undefined')) {
      const fallbackImages = [
        "/assets/images/categories/01.webp",
        "/assets/images/categories/02.webp",
        "/assets/images/categories/03.webp",
        "/assets/images/categories/04.webp",
        "/assets/images/categories/05.webp",
        "/assets/images/categories/06.webp",
      ];
      return fallbackImages[index % fallbackImages.length];
    }
    return image;
  };
  return (
    <section className="py-8 md:py-12 lg:py-16 bg-gray-100">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="text-center pb-6 md:pb-8">
          <h3 className="text-2xl md:text-3xl font-bold mb-2">Top Categories</h3>
          <p className="text-sm md:text-base text-gray-600 capitalize">Select your favorite categories and purchase</p>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading categories...</div>
        ) : (
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
            {categories.map((category, index) => (
              <SwiperSlide key={category._id}>
                <Link href={`/products?category=${category._id}`}>
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="relative w-full h-56 md:h-75 overflow-hidden">
                      <Image
                        src={getImageSrc(category.Image, index)}
                        fill
                        alt={category.name}
                        className="object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="text-center p-3 md:p-4">
                      <h5 className="font-bold text-base md:text-lg mb-1">{category.name}</h5>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
}
