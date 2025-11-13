"use client";

import Image from "next/image";
import Link from "next/link";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const categories = [
  { id: 1, name: "Kurtas", products: 856, image: "/assets/images/categories/01.webp" },
  { id: 2, name: "Heels", products: 169, image: "/assets/images/categories/02.webp" },
  { id: 3, name: "Lehenga", products: 589, image: "/assets/images/categories/03.webp" },
  { id: 4, name: "Plazzos", products: 278, image: "/assets/images/categories/04.webp" },
  { id: 5, name: "Makeup", products: 985, image: "/assets/images/categories/05.webp" },
  { id: 6, name: "Shoes", products: 489, image: "/assets/images/categories/06.webp" },
];

export default function Category() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 640,
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
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center pb-8">
          <h3 className="text-3xl font-bold mb-2">Top Categories</h3>
          <p className="text-gray-600 capitalize">Select your favorite categories and purchase</p>
        </div>

        <Slider {...settings} className="category-slider">
          {categories.map((category) => (
            <div key={category.id} className="px-3">
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
                  <div className="text-center p-4">
                    <h5 className="font-bold text-lg mb-1">{category.name}</h5>
                    <h6 className="text-gray-600 font-semibold">{category.products} Products</h6>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}
