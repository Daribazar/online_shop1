"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Slider-ийн слайдууд
const slides = [
  {
    id: 0,
    title: "Шинэ бүтээгдэхүүн",
    subtitle: "Эмэгтэй загвар",
    discount: "25% хүртэл хөнгөлөлт",
    image: "/assets/images/s_1.webp",
    bgColor: "bg-blue-600",
    textColor: "text-white",
  },
  {
    id: 1,
    title: "Хамгийн сүүлийн үеийн",
    subtitle: "Загварын хувцас",
    discount: "35% хүртэл хөнгөлөлт",
    image: "/assets/images/s_2.webp",
    bgColor: "bg-red-600",
    textColor: "text-white",
  },
];

// Нүүр хуудасны slider - Автомат болон гараар солих боломжтой
export default function Slider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000); // 4 секунд тутамд солигдоно
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="slider-section relative w-full overflow-hidden bg-gray-900">
      <div className="relative h-[400px] md:h-[500px] lg:h-[600px]">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            } ${slide.bgColor}`}
          >
            <div className="container mx-auto px-4 h-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center h-full">
                <div
                  className={`hidden lg:flex flex-col justify-center space-y-4 ${slide.textColor}`}
                >
                  <h3 className="text-2xl font-bold">
                    {slide.title}
                  </h3>
                  <h1 className="text-5xl font-bold">{slide.subtitle}</h1>
                  <p className="text-xl italic font-bold">{slide.discount}</p>
                  <div>
                    <a
                      href="/products"
                      className="inline-block bg-gray-900 text-white px-8 py-3 rounded hover:bg-gray-800 transition"
                    >
                      Худалдан авах
                    </a>
                  </div>
                </div>
                <div className="flex items-center justify-center h-full">
                  <Image
                    src={slide.image}
                    width={600}
                    height={600}
                    alt={slide.subtitle}
                    className="object-contain max-h-full"
                    priority={index === 0}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition border-2 ${
              index === currentSlide 
                ? "bg-white border-white scale-125" 
                : "bg-transparent border-white/70 hover:border-white"
            }`}
            aria-current={index === currentSlide ? "true" : "false"}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Previous Button */}
      <button
        className="carousel-control-prev absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition z-10"
        type="button"
        onClick={prevSlide}
      >
        <ChevronLeft size={24} />
        <span className="sr-only">Өмнөх</span>
      </button>

      {/* Next Button */}
      <button
        className="carousel-control-next absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition z-10"
        type="button"
        onClick={nextSlide}
      >
        <ChevronRight size={24} />
        <span className="sr-only">Дараах</span>
      </button>
    </section>
  );
}
