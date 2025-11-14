"use client";

import Image from "next/image";
import Link from "next/link";
import {ShoppingBasket } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center pb-8">
          <h3 className="text-3xl font-bold mb-2">Featured Products</h3>
          <p className="text-gray-600 capitalize">The purpose of lorem ipsum</p>
        </div>

        <Slider {...settings} className="product-slider">
          {products.map((product) => (
            <div key={product.id} className="px-3">
              <div className="bg-white rounded-lg shadow-md overflow-hidden group">
                <div className="relative overflow-hidden">
                  <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-2 bg-white/90 py-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <button className="p-2 hover:bg-gray-100 rounded-full transition">
                      <ShoppingBasket size={20} />
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

                <div className="p-4">
                  <div className="text-center">
                    <h6 className="font-bold mb-2">{product.name}</h6>
                    <div className="flex justify-center gap-1 mb-2 text-yellow-500">
                      {[...Array(product.rating)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-4 h-4 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-lg font-bold">${product.price}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}
