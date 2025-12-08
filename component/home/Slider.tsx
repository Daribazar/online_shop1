"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Slider-ийн слайдууд
const slides = [
  {
    id: 0,
    title: "New Arrival",
    subtitle: "Women Fashion",
    discount: "Last call for upto 25%",
    image: "/assets/images/s_1.webp",
    bgColor: "bg-blue-600",
    textColor: "text-white",
  },
  {
    id: 1,
    title: "Latest Trending",
    subtitle: "Fashion Wear",
    discount: "Last call for upto 35%",
    image: "/assets/images/s_2.webp",
    bgColor: "bg-red-600",
    textColor: "text-white",
  },
  {
    id: 2,
    title: "New Trending",
    subtitle: "Kids Fashion",
    discount: "Last call for upto 15%",
    image: "/assets/images/s_3.webp",
    bgColor: "bg-purple-600",
    textColor: "text-white",
  },
  {
    id: 3,
    title: "Latest Trending",
    subtitle: "Electronics Items",
    discount: "Last call for upto 45%",
    image: "/assets/images/s_4.webp",
    bgColor: "bg-yellow-500",
    textColor: "text-gray-900",
  },
  {
    id: 4,
    title: "Super Deals",
    subtitle: "Home Furniture",
    discount: "Last call for upto 24%",
    image: "/assets/images/s_5.webp",
    bgColor: "bg-green-600",
    textColor: "text-white",
  },
];

// Нүүр хуудасны slider - Автомат болон гараар солих боломжтой
export default function Slider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
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
    <section className="slider-section relative w-full overflow-hidden">
      <div className="relative h-[400px] md:h-[500px] lg:h-[600px]">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
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
                      href="/shop"
                      className="inline-block bg-gray-900 text-white px-8 py-3 rounded hover:bg-gray-800 transition"
                    >
                      Shop Now
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
            className={`w-3 h-3 rounded-full transition ${
              index === currentSlide ? "bg-white" : "bg-white/50"
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
        <span className="sr-only">Previous</span>
      </button>

      {/* Next Button */}
      <button
        className="carousel-control-next absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition z-10"
        type="button"
        onClick={nextSlide}
      >
        <ChevronRight size={24} />
        <span className="sr-only">Next</span>
      </button>
    </section>
  );
}
